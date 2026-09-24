"""
MediScan AI - Outbound Email API Router

Endpoints:
- POST /api/email/send-report : Dispatches clinical report notification email with ownership check
- POST /api/email/test        : Triggers an SMTP connectivity test verification email
- GET  /api/email/status      : Returns non-sensitive SMTP configuration and transport state
"""

import json
import logging
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.report import MedicalReport
from security import get_current_user
from config import settings
from services.email_service import EmailService, EMAIL_REGEX

logger = logging.getLogger("mediscan.email_router")
router = APIRouter()


# ============================================================
# SCHEMAS
# ============================================================

class SendReportEmailRequest(BaseModel):
    report_id: str
    recipient_email: str
    recipient_name: Optional[str] = None
    language: Optional[str] = "en"
    report_data: Optional[Dict[str, Any]] = None


class TestEmailRequest(BaseModel):
    recipient_email: str
    language: Optional[str] = "en"


class EmailDispatchResponse(BaseModel):
    success: bool
    dispatch_id: str
    mode: str
    recipient: str
    timestamp: str
    note: str


class EmailStatusResponse(BaseModel):
    configured: bool
    host: str
    port: int
    encryption: str
    from_address: str
    from_name: str
    mode: str


# ============================================================
# ENDPOINTS
# ============================================================

@router.get("/status", response_model=EmailStatusResponse)
async def get_email_status():
    """
    Returns current non-sensitive mail transport status.
    Reveals whether outbound SMTP is live or fallback dev logging is active.
    """
    is_configured = settings.is_smtp_configured()
    return EmailStatusResponse(
        configured=is_configured,
        host=settings.MAIL_HOST if is_configured else "None (Dev Safe Mode)",
        port=settings.MAIL_PORT,
        encryption=settings.MAIL_ENCRYPTION,
        from_address=settings.MAIL_FROM_ADDRESS,
        from_name=settings.MAIL_FROM_NAME,
        mode="smtp" if is_configured else "development_logged",
    )


@router.post("/send-report", response_model=EmailDispatchResponse)
async def send_report_email(
    req: SendReportEmailRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Sends a clinical report analysis summary email.
    
    Security & Authorization:
    - If the report exists in the database, verifies user ownership (or Admin/Doctor role).
    - If the report is newly scanned/client-side and provided in `report_data`, uses that.
    - Never leaks credentials or sensitive system tokens.
    """
    # 1. Validate email address format
    clean_email = req.recipient_email.strip().lower()
    if not EMAIL_REGEX.match(clean_email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{req.recipient_email}' is not a valid email address.",
        )

    # 2. Retrieve report and verify ownership
    report_obj = db.query(MedicalReport).filter(MedicalReport.report_id == req.report_id).first()

    report_payload: Dict[str, Any] = {}

    if report_obj:
        # Authorization check
        if report_obj.user_id and report_obj.user_id != current_user.id and current_user.role not in ["Admin", "Doctor"]:
            logger.warning(
                f"Unauthorized email attempt: user {current_user.id} tried sending report {req.report_id} owned by {report_obj.user_id}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: You do not have permission to dispatch this medical report.",
            )

        # Parse stored analysis or extract attributes
        if report_obj.analysis_result:
            try:
                report_payload = json.loads(report_obj.analysis_result)
            except Exception:
                pass

        # Fill in database fields if not in analysis_result
        report_payload.setdefault("id", report_obj.report_id)
        report_payload.setdefault("report_id", report_obj.report_id)
        report_payload.setdefault("patientName", report_obj.patient_name or current_user.full_name)
        report_payload.setdefault("patient_name", report_obj.patient_name or current_user.full_name)
        report_payload.setdefault("filename", report_obj.filename)
        report_payload.setdefault("overallHealthScore", int(100 - (report_obj.risk_score or 25)))
        report_payload.setdefault("executiveSummary", report_obj.extracted_text or "Laboratory Analysis")

    elif req.report_data:
        # Client provided sample or fresh client-analyzed report data
        report_payload = req.report_data
        report_payload.setdefault("id", req.report_id)
        report_payload.setdefault("patientName", req.recipient_name or current_user.full_name)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report with ID '{req.report_id}' was not found in records.",
        )

    recipient_name = req.recipient_name or report_payload.get("patientName") or current_user.full_name

    # 3. Dispatch email
    try:
        result = EmailService.send_report_email(
            report_dict=report_payload,
            recipient_email=clean_email,
            recipient_name=recipient_name,
            language=req.language or "en",
        )
        return EmailDispatchResponse(
            success=result["success"],
            dispatch_id=result["dispatch_id"],
            mode=result["mode"],
            recipient=result["recipient"],
            timestamp=result["timestamp"],
            note=result["note"],
        )
    except Exception as e:
        logger.error(f"Error dispatching report email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to dispatch email: {str(e)}",
        )


@router.post("/test", response_model=EmailDispatchResponse)
async def test_email_connection(
    req: TestEmailRequest,
    current_user: User = Depends(get_current_user),
):
    """
    Sends an SMTP connectivity test email to verify credentials and mail server handshake.
    """
    clean_email = req.recipient_email.strip().lower()
    if not EMAIL_REGEX.match(clean_email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"'{req.recipient_email}' is not a valid email address.",
        )

    try:
        result = EmailService.send_test_email(
            recipient_email=clean_email,
            language=req.language or "en",
        )
        return EmailDispatchResponse(
            success=result["success"],
            dispatch_id=result["dispatch_id"],
            mode=result["mode"],
            recipient=result["recipient"],
            timestamp=result["timestamp"],
            note=result["note"],
        )
    except Exception as e:
        logger.error(f"Error sending test email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"SMTP test failed: {str(e)}",
        )
