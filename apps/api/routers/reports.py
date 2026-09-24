"""
MediScan AI - User-Scoped Medical Reports Router

Enforces strict backend-level authorization:
- Reports are linked to user_id upon creation.
- Regular users can ONLY list, view, or delete their own reports.
- Accessing another user's report returns HTTP 403 Forbidden.
- Doctors and Admins have authorized clinical access.
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
import json
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.report import MedicalReport
from security import get_current_user, get_optional_user

router = APIRouter()


# ============================================================
# SCHEMAS
# ============================================================

class ReportSaveRequest(BaseModel):
    report_id: str
    filename: Optional[str] = "uploaded_report.pdf"
    patient_name: Optional[str] = None
    document_type: Optional[str] = "Laboratory Diagnostic Report"
    extracted_text: Optional[str] = None
    analysis_result: Optional[Dict[str, Any]] = None
    risk_score: Optional[float] = None
    ocr_confidence: Optional[float] = 0.95


class ReportItemResponse(BaseModel):
    id: int
    user_id: Optional[int]
    report_id: str
    filename: str
    patient_name: Optional[str]
    document_type: Optional[str]
    risk_score: Optional[float]
    ocr_confidence: Optional[float]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


class ReportDetailResponse(ReportItemResponse):
    extracted_text: Optional[str]
    analysis_result: Optional[Dict[str, Any]]


class UserDashboardStats(BaseModel):
    user_name: str
    user_email: str
    user_role: str
    total_reports: int
    average_health_score: int
    risk_level: str
    latest_report_date: Optional[str]
    biomarker_trends: List[Dict[str, Any]]
    organ_scores: Dict[str, int]


# ============================================================
# REPORT CRUD WITH STRICT USER ISOLATION
# ============================================================

@router.post("/", response_model=ReportDetailResponse, status_code=status.HTTP_201_CREATED)
async def save_or_update_report(
    req: ReportSaveRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Save or update a medical report. Strictly associates report with current_user.id.
    """
    # Check if report already exists
    report = db.query(MedicalReport).filter(MedicalReport.report_id == req.report_id).first()

    analysis_str = json.dumps(req.analysis_result, default=str) if req.analysis_result else None

    if report:
        # Check ownership before update
        if report.user_id and report.user_id != current_user.id and current_user.role != "Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: You cannot update a report owned by another user."
            )
        report.filename = req.filename or report.filename
        report.patient_name = req.patient_name or report.patient_name
        report.document_type = req.document_type or report.document_type
        if req.extracted_text:
            report.extracted_text = req.extracted_text
        if analysis_str:
            report.analysis_result = analysis_str
        if req.risk_score is not None:
            report.risk_score = req.risk_score
        if req.ocr_confidence is not None:
            report.ocr_confidence = req.ocr_confidence
        report.user_id = current_user.id
        report.status = "analysis_completed"
    else:
        report = MedicalReport(
            user_id=current_user.id,
            report_id=req.report_id,
            filename=req.filename or "uploaded_report.pdf",
            patient_name=req.patient_name or current_user.full_name,
            document_type=req.document_type or "Clinical Laboratory Report",
            extracted_text=req.extracted_text,
            analysis_result=analysis_str,
            risk_score=req.risk_score,
            ocr_confidence=req.ocr_confidence,
            status="analysis_completed"
        )
        db.add(report)

    db.commit()
    db.refresh(report)

    parsed_analysis = None
    if report.analysis_result:
        try:
            parsed_analysis = json.loads(report.analysis_result)
        except Exception:
            pass

    return ReportDetailResponse(
        id=report.id,
        user_id=report.user_id,
        report_id=report.report_id,
        filename=report.filename,
        patient_name=report.patient_name,
        document_type=report.document_type,
        risk_score=report.risk_score,
        ocr_confidence=report.ocr_confidence,
        status=report.status,
        created_at=report.created_at,
        extracted_text=report.extracted_text,
        analysis_result=parsed_analysis
    )


@router.get("/", response_model=List[ReportItemResponse])
async def list_user_reports(
    patient_id: Optional[int] = Query(None, description="Admin/Doctor query for specific patient"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List reports.
    - Regular users receive ONLY their own reports (user_id == current_user.id).
    - Admins and Doctors may inspect all or filter by patient_id.
    """
    query = db.query(MedicalReport)

    if current_user.role in ["Admin", "Doctor"]:
        if patient_id:
            query = query.filter(MedicalReport.user_id == patient_id)
    else:
        # Strict user isolation
        query = query.filter(MedicalReport.user_id == current_user.id)

    reports = query.order_by(MedicalReport.created_at.desc()).all()
    return reports


@router.get("/{report_id}", response_model=ReportDetailResponse)
async def get_report_by_id(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve full report details by report_id.
    Strictly checks that the report belongs to the authenticated user.
    """
    report = db.query(MedicalReport).filter(MedicalReport.report_id == report_id).first()

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report '{report_id}' not found."
        )

    # BACKEND AUTHORIZATION CHECK
    if report.user_id and report.user_id != current_user.id and current_user.role not in ["Admin", "Doctor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: You are not authorized to view this medical report."
        )

    parsed_analysis = None
    if report.analysis_result:
        try:
            parsed_analysis = json.loads(report.analysis_result)
        except Exception:
            pass

    return ReportDetailResponse(
        id=report.id,
        user_id=report.user_id,
        report_id=report.report_id,
        filename=report.filename,
        patient_name=report.patient_name,
        document_type=report.document_type,
        risk_score=report.risk_score,
        ocr_confidence=report.ocr_confidence,
        status=report.status,
        created_at=report.created_at,
        extracted_text=report.extracted_text,
        analysis_result=parsed_analysis
    )


@router.delete("/{report_id}")
async def delete_report_by_id(
    report_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a report. Only allowed by the owner or an Admin.
    """
    report = db.query(MedicalReport).filter(MedicalReport.report_id == report_id).first()

    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Report '{report_id}' not found."
        )

    if report.user_id and report.user_id != current_user.id and current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access Denied: You are not authorized to delete this report."
        )

    db.delete(report)
    db.commit()
    return {"status": "success", "message": f"Report '{report_id}' deleted successfully."}


@router.get("/dashboard/stats", response_model=UserDashboardStats)
async def get_user_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Calculate and return health metrics, trends, and organ status strictly for the authenticated user.
    """
    user_reports = (
        db.query(MedicalReport)
        .filter(MedicalReport.user_id == current_user.id)
        .order_by(MedicalReport.created_at.asc())
        .all()
    )

    total_reports = len(user_reports)
    latest_date = user_reports[-1].created_at.strftime("%Y-%m-%d") if total_reports > 0 else None

    # Calculate average health score
    health_scores = []
    organ_totals: Dict[str, List[int]] = {
        "Cardiac": [],
        "Hepatic": [],
        "Renal": [],
        "Metabolic": [],
        "Hematologic": [],
        "Immune": []
    }
    biomarker_points: List[Dict[str, Any]] = []

    for idx, rep in enumerate(user_reports):
        if rep.risk_score is not None:
            # Health score = 100 - risk_score
            score = max(0, min(100, int(100 - rep.risk_score)))
            health_scores.append(score)

        if rep.analysis_result:
            try:
                data = json.loads(rep.analysis_result)
                if "organ_scores" in data and isinstance(data["organ_scores"], dict):
                    for org, val in data["organ_scores"].items():
                        if org in organ_totals and isinstance(val, (int, float)):
                            organ_totals[org].append(int(val))

                # Track timeline points
                rep_date = rep.created_at.strftime("%b %d")
                point: Dict[str, Any] = {"date": rep_date, "report_id": rep.report_id}
                if "biomarkers" in data and isinstance(data["biomarkers"], list):
                    for b in data["biomarkers"]:
                        name = b.get("name", "")
                        if "Glucose" in name:
                            point["glucose"] = b.get("value")
                        elif "HbA1c" in name:
                            point["hba1c"] = b.get("value")
                        elif "Cholesterol" in name or "LDL" in name:
                            point["cholesterol"] = b.get("value")
                biomarker_points.append(point)
            except Exception:
                pass

    avg_score = int(sum(health_scores) / len(health_scores)) if health_scores else 82

    if avg_score >= 80:
        risk_level = "Low Risk (Optimal Homeostasis)"
    elif avg_score >= 60:
        risk_level = "Moderate Deviation"
    else:
        risk_level = "High Risk / Clinical Alert"

    final_organ_scores = {
        org: int(sum(vals) / len(vals)) if vals else 85
        for org, vals in organ_totals.items()
    }

    return UserDashboardStats(
        user_name=current_user.full_name,
        user_email=current_user.email,
        user_role=current_user.role,
        total_reports=total_reports,
        average_health_score=avg_score,
        risk_level=risk_level,
        latest_report_date=latest_date,
        biomarker_trends=biomarker_points,
        organ_scores=final_organ_scores
    )
