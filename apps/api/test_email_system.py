"""
Test Suite for MediScan AI Outbound Email System
Direct invocation test suite (no external test client dependencies needed)
Verifies:
1. Configuration loading and safe fallback detection.
2. Multilingual template rendering (EN, HI, GU).
3. Safe disk logging when SMTP is unconfigured.
4. API endpoints:
   - get_email_status()
   - send_report_email() with authorization, report payload, and 403 prevention
   - test_email_connection()
"""

import sys
import os
import json
import asyncio
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR))
sys.stdout.reconfigure(encoding='utf-8')

from config import settings
from services.email_service import (
    EmailService,
    build_report_email_content,
    build_test_email_content,
    EMAIL_LOG_FILE,
)
from routers.email import (
    get_email_status,
    send_report_email,
    test_email_connection,
    SendReportEmailRequest,
    TestEmailRequest,
)
from database import SessionLocal
from models.user import User
from models.report import MedicalReport
from fastapi import HTTPException

SAMPLE_REPORT_DATA = {
    "id": "REP-TEST-001",
    "title": "Comprehensive Metabolic & Lipid Diagnostic Panel",
    "patientName": "Rahul Verma",
    "age": 32,
    "gender": "Male",
    "doctorName": "Dr. Anjali Mehta, MD",
    "laboratory": "Metropolis Healthcare Labs",
    "sampleDate": "2026-09-18",
    "overallHealthScore": 68,
    "riskLevel": "MODERATE",
    "executiveSummary": "Patient exhibits moderate dyslipidemia with elevated LDL and border triglycerides.",
    "biomarkers": [
        {
            "name": "Total Cholesterol",
            "value": 242,
            "unit": "mg/dL",
            "status": "HIGH",
            "refMin": 125,
            "refMax": 200,
        },
        {
            "name": "Fasting Blood Glucose",
            "value": 92,
            "unit": "mg/dL",
            "status": "NORMAL",
            "refMin": 70,
            "refMax": 99,
        },
    ],
}


def test_config():
    print("[1/5] Testing Configuration & Fallback Detection...")
    assert hasattr(settings, "MAIL_HOST")
    assert hasattr(settings, "MAIL_PORT")
    assert hasattr(settings, "MAIL_ENCRYPTION")
    is_conf = settings.is_smtp_configured()
    print(f"      SMTP configured: {is_conf}")
    print("      PASSED.")


def test_multilingual_templates():
    print("[2/5] Testing Multilingual Template Generation (EN, HI, GU)...")
    for lang in ["en", "hi", "gu"]:
        sub, html, text = build_report_email_content(SAMPLE_REPORT_DATA, "Rahul Verma", lang)
        assert "MediScan AI" in sub or "MediScan" in sub
        assert "Total Cholesterol" in html
        assert "242" in html
        assert len(text) > 100
        assert "http" in html  # Link to analysis
        print(f"      - Language '{lang}': Subject='{sub[:45]}...' - HTML len={len(html)} bytes")
    print("      PASSED.")


def test_dev_mode_logging():
    print("[3/5] Testing Safe Dev Mode Disk Logging...")
    initial_lines = 0
    if EMAIL_LOG_FILE.exists():
        initial_lines = len([l for l in EMAIL_LOG_FILE.read_text(encoding="utf-8").splitlines() if l.strip()])

    res = EmailService.send_report_email(
        report_dict=SAMPLE_REPORT_DATA,
        recipient_email="test.patient@example.com",
        recipient_name="Rahul Verma",
        language="en",
    )
    assert res["success"] is True
    assert "dispatch_id" in res
    assert res["mode"] in ("development_logged", "smtp")
    print(f"      Dispatched ID: {res['dispatch_id']} via mode: {res['mode']}")

    if res["mode"] == "development_logged":
        assert EMAIL_LOG_FILE.exists()
        new_lines = len([l for l in EMAIL_LOG_FILE.read_text(encoding="utf-8").splitlines() if l.strip()])
        assert new_lines > initial_lines
        print("      Disk log confirmed at logs/email_dispatches.log")
    print("      PASSED.")


def test_api_status():
    print("[4/5] Testing get_email_status endpoint...")
    status_resp = asyncio.run(get_email_status())
    assert hasattr(status_resp, "configured")
    assert hasattr(status_resp, "mode")
    assert hasattr(status_resp, "from_address")
    print(f"      Status: mode={status_resp.mode}, from={status_resp.from_address}")
    print("      PASSED.")


def test_api_endpoints_and_auth():
    print("[5/5] Testing send_report_email Security & Ownership...")
    db = SessionLocal()
    try:
        user_rahul = db.query(User).filter(User.email == "rahul.verma@example.com").first()
        assert user_rahul is not None, "Rahul user should exist in DB"

        # 1. Authorized user sends report
        req = SendReportEmailRequest(
            report_id="REP-TEST-001",
            recipient_email="rahul.verma@example.com",
            recipient_name="Rahul Verma",
            language="hi",
            report_data=SAMPLE_REPORT_DATA
        )
        resp = asyncio.run(send_report_email(req, current_user=user_rahul, db=db))
        assert resp.success is True
        assert resp.dispatch_id.startswith("EML-")
        print(f"      - Authorized send_report_email succeeded (ID: {resp.dispatch_id})")

        # 2. Test SMTP connection test endpoint
        test_req = TestEmailRequest(recipient_email="rahul.verma@example.com", language="en")
        test_resp = asyncio.run(test_email_connection(test_req, current_user=user_rahul))
        assert test_resp.success is True
        print(f"      - test_email_connection verified (mode: {test_resp.mode})")

        # 3. Test cross-user isolation: create a report owned by another user (ID 99999)
        other_report = MedicalReport(
            user_id=99999,
            report_id="REP-SECRET-999",
            filename="confidential.pdf",
            patient_name="Confidential VIP",
            status="processed"
        )
        db.add(other_report)
        db.commit()

        # Rahul attempts to send this private report
        attack_req = SendReportEmailRequest(
            report_id="REP-SECRET-999",
            recipient_email="rahul.verma@example.com"
        )
        try:
            asyncio.run(send_report_email(attack_req, current_user=user_rahul, db=db))
            assert False, "Expected 403 HTTPException was not raised"
        except HTTPException as he:
            assert he.status_code == 403, f"Expected 403 but got {he.status_code}"
            print("      - Cross-user unauthorized dispatch blocked with 403 Forbidden.")

        # Clean up test record
        db.delete(other_report)
        db.commit()

    finally:
        db.close()
    print("      PASSED.")


if __name__ == "__main__":
    print("==================================================")
    print("MEDISCAN-AI OUTBOUND EMAIL VERIFICATION SUITE")
    print("==================================================")
    test_config()
    test_multilingual_templates()
    test_dev_mode_logging()
    test_api_status()
    test_api_endpoints_and_auth()
    print("==================================================")
    print("ALL 5/5 EMAIL SYSTEM TESTS PASSED SUCCESSFULLY!")
    print("==================================================")
