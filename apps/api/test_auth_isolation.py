"""
MediScan AI - End-to-End Multi-User Authentication & Backend Isolation Test Suite
(Uses direct async function execution with live SQLAlchemy session)
"""

import asyncio
from database import SessionLocal, Base, engine
from models.user import User
from models.report import MedicalReport
from routers.auth import (
    register, login, UserRegisterRequest, UserLoginRequest,
    list_all_users, update_user_role
)
from routers.reports import (
    save_or_update_report, list_user_reports, get_report_by_id,
    delete_report_by_id, get_user_dashboard_stats, ReportSaveRequest
)
from security import (
    decode_access_token, get_current_user, hash_password, verify_password
)
from fastapi.security import HTTPAuthorizationCredentials
from fastapi import HTTPException

from main import seed_default_users

# Ensure tables created and default accounts seeded
Base.metadata.create_all(bind=engine)
seed_default_users()

async def main():
    db = SessionLocal()
    try:
        print("=== 1. Testing Password Hashing & Verification ===")
        hashed = hash_password("Secret123!")
        assert verify_password("Secret123!", hashed) is True
        assert verify_password("WrongPassword", hashed) is False
        print("[OK] PBKDF2-HMAC password hashing verified with random salt")

        print("\n=== 2. Testing User Registration & JWT Token Issuance ===")
        # Register User Alice
        req_alice = UserRegisterRequest(
            email="alice.test@mediscan.org",
            password="alicePassword123",
            full_name="Alice Clinical",
            role="Patient"
        )
        # Delete if existed from previous run
        db.query(MedicalReport).filter(MedicalReport.report_id.like("REP-2026-ALICE%")).delete(synchronize_session=False)
        db.query(User).filter(User.email.in_(["alice.test@mediscan.org", "bob.test@mediscan.org"])).delete(synchronize_session=False)
        db.commit()

        alice_res = await register(req_alice, db)
        assert alice_res.access_token is not None
        alice_token = alice_res.access_token
        alice_user_id = alice_res.user.id
        print(f"[OK] Alice registered successfully! User ID: {alice_user_id}, Role: {alice_res.user.role}")

        # Register User Bob
        req_bob = UserRegisterRequest(
            email="bob.test@mediscan.org",
            password="bobPassword123",
            full_name="Bob Patient",
            role="Patient"
        )
        bob_res = await register(req_bob, db)
        bob_token = bob_res.access_token
        bob_user_id = bob_res.user.id
        print(f"[OK] Bob registered successfully! User ID: {bob_user_id}, Role: {bob_res.user.role}")

        # Decode tokens
        alice_payload = decode_access_token(alice_token)
        assert alice_payload["user_id"] == alice_user_id
        assert alice_payload["sub"] == "alice.test@mediscan.org"
        print("[OK] Alice JWT Payload decoded and cryptographically verified")

        print("\n=== 3. Testing Authentication Dependency (get_current_user) ===")
        alice_creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=alice_token)
        alice_user = await get_current_user(alice_creds, db)
        assert alice_user.id == alice_user_id

        bob_creds = HTTPAuthorizationCredentials(scheme="Bearer", credentials=bob_token)
        bob_user = await get_current_user(bob_creds, db)
        assert bob_user.id == bob_user_id
        print(f"[OK] Security layer correctly resolved Alice ({alice_user.email}) and Bob ({bob_user.email})")

        print("\n=== 4. Testing User A (Alice) Saving a Medical Report ===")
        rep_req = ReportSaveRequest(
            report_id="REP-2026-ALICE-SECURE-001",
            filename="alice_lipid_panel.pdf",
            patient_name="Alice Clinical",
            document_type="Comprehensive Metabolic Panel",
            risk_score=12.0,
            ocr_confidence=0.98,
            analysis_result={
                "overall_health_score": 88,
                "risk_level": "Low Risk",
                "biomarkers": [
                    {"name": "Fasting Blood Glucose", "value": 94.0, "unit": "mg/dL", "status": "normal"},
                    {"name": "HbA1c", "value": 5.2, "unit": "%", "status": "normal"}
                ],
                "organ_scores": {"Cardiac": 92, "Hepatic": 89, "Renal": 90, "Metabolic": 88, "Hematologic": 91, "Immune": 94}
            }
        )
        saved_report = await save_or_update_report(rep_req, alice_user, db)
        assert saved_report.user_id == alice_user.id
        assert saved_report.report_id == "REP-2026-ALICE-SECURE-001"
        print(f"[OK] Report '{saved_report.report_id}' saved with user_id = {saved_report.user_id}")

        print("\n=== 5. Testing Multi-User Data Isolation in Reports List ===")
        # Bob lists his reports
        bob_reports = await list_user_reports(None, bob_user, db)
        assert len(bob_reports) == 0, f"Bob should have 0 reports! Found: {len(bob_reports)}"
        print("[OK] Bob's report list returned 0 reports (Alice's report is completely isolated from Bob)")

        # Alice lists her reports
        alice_reports = await list_user_reports(None, alice_user, db)
        assert len(alice_reports) == 1
        assert alice_reports[0].report_id == "REP-2026-ALICE-SECURE-001"
        print("[OK] Alice's report list returned 1 report (her own)")

        print("\n=== 6. Testing Backend-Enforced Cross-User Security Check (403 Forbidden) ===")
        # Bob attempts to fetch Alice's report
        blocked = False
        try:
            await get_report_by_id("REP-2026-ALICE-SECURE-001", bob_user, db)
        except HTTPException as ex:
            if ex.status_code == 403:
                blocked = True
                print(f"[OK] Backend blocked Bob with HTTP 403 Forbidden: '{ex.detail}'")
        assert blocked is True, "Security check failed! Bob was able to view Alice's report!"

        # Bob attempts to delete Alice's report
        blocked_delete = False
        try:
            await delete_report_by_id("REP-2026-ALICE-SECURE-001", bob_user, db)
        except HTTPException as ex:
            if ex.status_code == 403:
                blocked_delete = True
                print(f"[OK] Backend blocked Bob with HTTP 403 Forbidden on delete: '{ex.detail}'")
        assert blocked_delete is True, "Security check failed! Bob was able to delete Alice's report!"

        print("\n=== 7. Testing Owner Access (200 OK) ===")
        alice_fetched = await get_report_by_id("REP-2026-ALICE-SECURE-001", alice_user, db)
        assert alice_fetched.report_id == "REP-2026-ALICE-SECURE-001"
        assert alice_fetched.analysis_result["overall_health_score"] == 88
        print("[OK] Alice successfully retrieved her own report with full analysis")

        print("\n=== 8. Testing User-Scoped Dashboard Stats Calculation ===")
        alice_stats = await get_user_dashboard_stats(alice_user, db)
        assert alice_stats.total_reports == 1
        assert alice_stats.average_health_score == 88
        assert alice_stats.user_email == "alice.test@mediscan.org"
        print(f"[OK] Alice's personal dashboard: {alice_stats.total_reports} report, Avg Health Score: {alice_stats.average_health_score}")

        bob_stats = await get_user_dashboard_stats(bob_user, db)
        assert bob_stats.total_reports == 0
        print(f"[OK] Bob's personal dashboard: {bob_stats.total_reports} reports (Isolated empty baseline)")

        print("\n=== 9. Testing Administrator Privileges & Access Control ===")
        admin_user = db.query(User).filter(User.role == "Admin").first()
        assert admin_user is not None
        all_users = await list_all_users(admin_user, db)
        assert len(all_users) >= 3
        print(f"[OK] Administrator successfully queried user directory: {len(all_users)} total accounts")

        print("\n=======================================================")
        print("ALL MULTI-USER AUTH & BACKEND ISOLATION TESTS PASSED! [SUCCESS]")
        print("=======================================================")

    finally:
        db.close()

if __name__ == "__main__":
    asyncio.run(main())
