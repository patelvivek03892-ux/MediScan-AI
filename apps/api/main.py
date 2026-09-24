"""
MediScan AI - Enterprise Healthcare API
FastAPI backend service for medical report OCR, biomarker extraction, and clinical analysis.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analysis, ocr, chat, auth, reports, email
from database import Base, engine, SessionLocal
from models.report import MedicalReport
from models.user import User
from security import hash_password

app = FastAPI(
    title="MediScan AI - Clinical Analysis API",
    description="Enterprise-Grade AI-Powered Medical Report Intelligence & Biomarker Diagnostics API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Initialize tables
Base.metadata.create_all(bind=engine)


def seed_default_users():
    """Seed initial clinical users if missing"""
    db = SessionLocal()
    try:
        default_users = [
            User(
                email="admin@mediscan.ai",
                hashed_password=hash_password("admin123"),
                full_name="Dr. Rohan Shah, MD",
                role="Admin",
                phone="+91 91234 56789",
                status="Active"
            ),
            User(
                email="dr.mehta@metropolis.med",
                hashed_password=hash_password("doctor123"),
                full_name="Dr. Anjali Mehta, MD",
                role="Doctor",
                phone="+91 99887 76655",
                status="Active"
            ),
            User(
                email="rahul.verma@example.com",
                hashed_password=hash_password("patient123"),
                full_name="Rahul Verma",
                role="Patient",
                phone="+91 98765 43210",
                status="Active"
            ),
            User(
                email="suresh.patil@diagnostics.lab",
                hashed_password=hash_password("labtech123"),
                full_name="Suresh Patil",
                role="Lab Tech",
                phone="+91 97654 32109",
                status="Active"
            ),
        ]
        for u in default_users:
            if not db.query(User).filter(User.email == u.email).first():
                db.add(u)
        db.commit()
    except Exception as e:
        print(f"Seed error: {e}")
        db.rollback()
    finally:
        db.close()

seed_default_users()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://mediscan-lo3yw5imo-patelvivek03892-2740s-projects.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication & Access Control"])
app.include_router(reports.router, prefix="/api/reports", tags=["User-Scoped Reports & Dashboard"])
app.include_router(ocr.router, prefix="/api/ocr", tags=["OCR Pipeline"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Report Analysis"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Health Assistant"])
app.include_router(email.router, prefix="/api/email", tags=["Outbound Email & Notifications"])

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "MediScan AI API",
        "version": "1.0.0",
        "supported_modalities": [
            "Complete Blood Count (CBC)",
            "Lipid Profile",
            "Diabetic / HbA1c",
            "Kidney Function Tests (KFT)",
            "Liver Function Tests (LFT)",
            "Thyroid Panel",
            "Vitamin & Mineral Panels",
            "Urinalysis",
            "Cardiac Biomarkers"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
