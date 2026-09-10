"""
MediScan AI - Clinical Report Analysis Router

Reads OCR text stored in PostgreSQL, extracts supported medical
biomarkers, evaluates configured reference ranges, calculates
health/risk scores, creates clinical alerts, and saves the
analysis result back into PostgreSQL.

IMPORTANT:
- The report_id must belong to an already-created MedicalReport.
- This router does NOT reuse old analysis results.
- The analysis result is always generated from the current report's
  OCR text.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import uuid
import re
from datetime import datetime

from sqlalchemy.orm import Session

from database import SessionLocal
from models.report import MedicalReport


router = APIRouter()


# ============================================================
# REPORT ID GENERATOR
# ============================================================

def generate_report_id() -> str:
    """
    Generate a unique report ID.

    Example:
        REP-2026-A81F92CD
    """

    return (
        f"REP-{datetime.now().year}-"
        f"{uuid.uuid4().hex[:8].upper()}"
    )


# ============================================================
# RESPONSE MODELS
# ============================================================

class BiomarkerItem(BaseModel):
    name: str
    category: str
    value: float
    unit: str
    ref_min: float
    ref_max: float
    status: str
    clinical_significance: str


class AnalysisRequest(BaseModel):
    """
    Request used to evaluate an already-uploaded report.

    report_id MUST be the ID of the NEW report created by the
    upload endpoint.
    """

    report_id: str
    report_text: Optional[str] = None

    patient_age: Optional[int] = 42
    patient_gender: Optional[str] = "Male"
    fasting_status: Optional[bool] = True


class EmergencyAlert(BaseModel):
    is_critical: bool
    title: str
    message: str
    triggered_biomarkers: List[str]
    action_required: str


class AnalysisResponse(BaseModel):
    report_id: str
    patient_info: Dict[str, Any]
    executive_summary: str
    overall_health_score: int
    risk_level: str
    ai_confidence: float
    emergency_alert: Optional[EmergencyAlert]
    biomarkers: List[BiomarkerItem]
    organ_scores: Dict[str, int]
    differential_possibilities: List[Dict[str, Any]]
    action_plan: Dict[str, Any]
    disclaimer: str


# ============================================================
# BIOMARKER CONFIGURATION
# ============================================================

BIOMARKER_CONFIG = [

    {
        "name": "Hemoglobin",
        "category": "CBC",
        "patterns": [
            r"\bhemoglobin\b[^\d]{0,20}(\d+(?:\.\d+)?)",
            r"\bhb\b[^\d]{0,10}(\d+(?:\.\d+)?)"
        ],
        "unit": "g/dL",
        "ref_min": 13.5,
        "ref_max": 17.5
    },

    {
        "name": "WBC (White Blood Cells)",
        "category": "CBC",
        "patterns": [
            r"\bwbc\b[^\d]{0,20}([\d,]+(?:\.\d+)?)",
            r"\bwhite blood cells?\b[^\d]{0,20}([\d,]+(?:\.\d+)?)"
        ],
        "unit": "/cumm",
        "ref_min": 4000,
        "ref_max": 11000
    },

    {
        "name": "Platelets",
        "category": "CBC",
        "patterns": [
            r"\bplatelets?\b[^\d]{0,20}([\d,]+(?:\.\d+)?)",
            r"\bplt\b[^\d]{0,10}([\d,]+(?:\.\d+)?)"
        ],
        "unit": "/cumm",
        "ref_min": 150000,
        "ref_max": 450000
    },

    {
        "name": "HbA1c",
        "category": "Diabetic",
        "patterns": [
            r"\bhba1c\b[^\d]{0,20}(\d+(?:\.\d+)?)",
            r"\ba1c\b[^\d]{0,20}(\d+(?:\.\d+)?)",
            r"\bglycated hemoglobin\b[^\d]{0,20}(\d+(?:\.\d+)?)"
        ],
        "unit": "%",
        "ref_min": 4.0,
        "ref_max": 5.6
    },

    {
        "name": "Fasting Blood Glucose",
        "category": "Diabetic",
        "patterns": [
            r"\bfasting blood glucose\b[^\d]{0,20}(\d+(?:\.\d+)?)",
            r"\bfasting glucose\b[^\d]{0,20}(\d+(?:\.\d+)?)",
            r"\bfasting blood sugar\b[^\d]{0,20}(\d+(?:\.\d+)?)"
        ],
        "unit": "mg/dL",
        "ref_min": 70,
        "ref_max": 99
    },

    {
        "name": "LDL Cholesterol",
        "category": "Lipid",
        "patterns": [
            r"\bldl(?: cholesterol)?\b[^\d]{0,20}(\d+(?:\.\d+)?)"
        ],
        "unit": "mg/dL",
        "ref_min": 0,
        "ref_max": 100
    },

    {
        "name": "HDL Cholesterol",
        "category": "Lipid",
        "patterns": [
            r"\bhdl(?: cholesterol)?\b[^\d]{0,20}(\d+(?:\.\d+)?)"
        ],
        "unit": "mg/dL",
        "ref_min": 40,
        "ref_max": 60
    },

    {
        "name": "Triglycerides",
        "category": "Lipid",
        "patterns": [
            r"\btriglycerides?\b[^\d]{0,20}(\d+(?:\.\d+)?)"
        ],
        "unit": "mg/dL",
        "ref_min": 0,
        "ref_max": 150
    },

    {
        "name": "Serum Creatinine",
        "category": "Kidney",
        "patterns": [
            r"\bserum creatinine\b[^\d]{0,20}(\d+(?:\.\d+)?)",
            r"\bcreatinine\b[^\d]{0,20}(\d+(?:\.\d+)?)"
        ],
        "unit": "mg/dL",
        "ref_min": 0.7,
        "ref_max": 1.2
    },

    {
        "name": "eGFR",
        "category": "Kidney",
        "patterns": [
            r"\begfr\b[^\d]{0,20}(\d+(?:\.\d+)?)",
            r"\bestimated glomerular filtration rate\b[^\d]{0,20}(\d+(?:\.\d+)?)"
        ],
        "unit": "mL/min",
        "ref_min": 90,
        "ref_max": 130
    },

    {
        "name": "ALT (SGPT)",
        "category": "Liver",
        "patterns": [
            r"\balt\b[^\d]{0,20}(\d+(?:\.\d+)?)",
            r"\bsgpt\b[^\d]{0,20}(\d+(?:\.\d+)?)"
        ],
        "unit": "U/L",
        "ref_min": 7,
        "ref_max": 56
    },

    {
        "name": "TSH (Thyroid)",
        "category": "Thyroid",
        "patterns": [
            r"\btsh\b[^\d]{0,20}(\d+(?:\.\d+)?)",
            r"\bthyroid stimulating hormone\b[^\d]{0,20}(\d+(?:\.\d+)?)"
        ],
        "unit": "uIU/mL",
        "ref_min": 0.4,
        "ref_max": 4.2
    },

    {
        "name": "Vitamin D3",
        "category": "Vitamins",
        "patterns": [
            r"\bvitamin d3\b[^\d]{0,20}(\d+(?:\.\d+)?)",
            r"\bvitamin d\b[^\d]{0,20}(\d+(?:\.\d+)?)"
        ],
        "unit": "ng/mL",
        "ref_min": 30,
        "ref_max": 100
    }
]


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def extract_value(
    text: str,
    patterns: List[str]
) -> Optional[float]:
    """
    Extract a biomarker value from OCR text.
    """

    for pattern in patterns:

        match = re.search(
            pattern,
            text,
            flags=re.IGNORECASE
        )

        if not match:
            continue

        raw_value = match.group(1)

        raw_value = raw_value.replace(",", "")

        try:
            return float(raw_value)
        except ValueError:
            continue

    return None


def determine_status(
    value: float,
    ref_min: float,
    ref_max: float
) -> str:

    if value < ref_min:
        return "LOW"

    if value > ref_max:
        return "HIGH"

    return "NORMAL"


def clinical_significance(
    name: str,
    status: str
) -> str:

    if status == "NORMAL":
        return (
            f"{name} is within the configured reference range."
        )

    if status == "LOW":
        return (
            f"{name} is below the configured reference range. "
            "Clinical interpretation should consider the complete "
            "report and the patient's individual context."
        )

    if status == "HIGH":
        return (
            f"{name} is above the configured reference range. "
            "Clinical interpretation should consider the complete "
            "report and the patient's individual context."
        )

    return f"{name} requires clinical review."


def calculate_health_score(
    biomarkers: List[BiomarkerItem]
) -> int:

    if not biomarkers:
        return 0

    abnormal_count = sum(
        1
        for item in biomarkers
        if item.status in ["LOW", "HIGH"]
    )

    total = len(biomarkers)

    abnormal_ratio = abnormal_count / total

    score = round(
        100 - (abnormal_ratio * 60)
    )

    return max(
        0,
        min(100, score)
    )


def calculate_risk_level(
    score: int
) -> str:

    if score >= 85:
        return "LOW"

    if score >= 70:
        return "MODERATE"

    if score >= 50:
        return "HIGH"

    return "CRITICAL"


def calculate_organ_scores(
    biomarkers: List[BiomarkerItem]
) -> Dict[str, int]:

    categories = {}

    for item in biomarkers:

        if item.category not in categories:
            categories[item.category] = []

        categories[item.category].append(
            item.status
        )

    result = {}

    category_names = {
        "CBC": "Hematology & Blood",
        "Diabetic": "Endocrine & Metabolic",
        "Lipid": "Cardiovascular",
        "Kidney": "Renal (Kidneys)",
        "Liver": "Hepatic (Liver)",
        "Thyroid": "Thyroid",
        "Vitamins": "Vitamins"
    }

    for category, statuses in categories.items():

        abnormal = sum(
            1
            for status in statuses
            if status != "NORMAL"
        )

        score = round(
            100 - (
                abnormal / len(statuses)
            ) * 50
        )

        result[
            category_names.get(
                category,
                category
            )
        ] = max(
            0,
            min(100, score)
        )

    return result


def create_emergency_alert(
    biomarkers: List[BiomarkerItem]
) -> Optional[EmergencyAlert]:

    critical_markers = []

    for item in biomarkers:

        # Demo triage thresholds only.

        if (
            item.name == "Fasting Blood Glucose"
            and item.value >= 300
        ):
            critical_markers.append(
                f"{item.name}: {item.value} {item.unit}"
            )

        elif (
            item.name == "HbA1c"
            and item.value >= 10
        ):
            critical_markers.append(
                f"{item.name}: {item.value} {item.unit}"
            )

        elif (
            item.name == "Hemoglobin"
            and item.value < 7
        ):
            critical_markers.append(
                f"{item.name}: {item.value} {item.unit}"
            )

    if not critical_markers:

        abnormal = [
            f"{item.name}: {item.value} {item.unit}"
            for item in biomarkers
            if item.status != "NORMAL"
        ]

        if abnormal:

            return EmergencyAlert(
                is_critical=False,
                title="Out-of-Range Biomarkers Detected",
                message=(
                    "One or more biomarkers are outside the "
                    "configured reference ranges. Please discuss "
                    "the findings with a qualified healthcare "
                    "professional."
                ),
                triggered_biomarkers=abnormal,
                action_required=(
                    "Review the report with a qualified healthcare "
                    "professional."
                )
            )

        return None

    return EmergencyAlert(
        is_critical=True,
        title="Potentially Critical Biomarker Detected",
        message=(
            "One or more values crossed the configured demo "
            "triage thresholds. This requires prompt professional "
            "medical review."
        ),
        triggered_biomarkers=critical_markers,
        action_required=(
            "Seek prompt medical evaluation, especially if "
            "symptoms are present."
        )
    )


# ============================================================
# MAIN ANALYSIS ENDPOINT
# ============================================================

@router.post(
    "/evaluate",
    response_model=AnalysisResponse
)
async def evaluate_report(
    req: AnalysisRequest
):

    db: Session = SessionLocal()

    try:

        # ====================================================
        # 1. VALIDATE REPORT ID
        # ====================================================

        if not req.report_id:
            raise HTTPException(
                status_code=400,
                detail="report_id is required."
            )

        # ====================================================
        # 2. FIND EXACT REPORT
        # ====================================================

        report = (
            db.query(MedicalReport)
            .filter(
                MedicalReport.report_id == req.report_id
            )
            .first()
        )

        if not report:

            raise HTTPException(
                status_code=404,
                detail=(
                    f"Report '{req.report_id}' "
                    "not found in database."
                )
            )

        # ====================================================
        # 3. GET CURRENT REPORT OCR TEXT
        # ====================================================

        analysis_text = (
            req.report_text
            if req.report_text
            else report.extracted_text
            or ""
        )

        if not analysis_text.strip():

            raise HTTPException(
                status_code=400,
                detail=(
                    "No OCR text found for this report. "
                    "Please process the report with OCR first."
                )
            )

        # ====================================================
        # 4. NORMALIZE OCR TEXT
        # ====================================================

        analysis_text = re.sub(
            r"\s+",
            " ",
            analysis_text
        ).strip()

        # ====================================================
        # 5. EXTRACT BIOMARKERS
        # ====================================================

        biomarkers: List[BiomarkerItem] = []

        for config in BIOMARKER_CONFIG:

            value = extract_value(
                analysis_text,
                config["patterns"]
            )

            # Never invent missing values.
            if value is None:
                continue

            status = determine_status(
                value,
                config["ref_min"],
                config["ref_max"]
            )

            biomarkers.append(
                BiomarkerItem(
                    name=config["name"],
                    category=config["category"],
                    value=value,
                    unit=config["unit"],
                    ref_min=config["ref_min"],
                    ref_max=config["ref_max"],
                    status=status,
                    clinical_significance=(
                        clinical_significance(
                            config["name"],
                            status
                        )
                    )
                )
            )

        # ====================================================
        # 6. CHECK EXTRACTION
        # ====================================================

        if not biomarkers:

            raise HTTPException(
                status_code=422,
                detail=(
                    "No supported biomarkers could be extracted "
                    "from the OCR text. Check the OCR output or "
                    "add extraction patterns for this report format."
                )
            )

        # ====================================================
        # 7. HEALTH SCORE
        # ====================================================

        overall_health_score = calculate_health_score(
            biomarkers
        )

        # ====================================================
        # 8. RISK LEVEL
        # ====================================================

        risk_level = calculate_risk_level(
            overall_health_score
        )

        # ====================================================
        # 9. ORGAN SCORES
        # ====================================================

        organ_scores = calculate_organ_scores(
            biomarkers
        )

        # ====================================================
        # 10. EMERGENCY ALERT
        # ====================================================

        emergency_alert = create_emergency_alert(
            biomarkers
        )

        # ====================================================
        # 11. ABNORMAL BIOMARKERS
        # ====================================================

        abnormal_markers = [
            item
            for item in biomarkers
            if item.status != "NORMAL"
        ]

        if abnormal_markers:

            abnormal_text = ", ".join(
                f"{item.name} "
                f"({item.value} {item.unit})"
                for item in abnormal_markers
            )

            executive_summary = (
                f"The report contains "
                f"{len(abnormal_markers)} "
                "out-of-range biomarker(s): "
                f"{abnormal_text}. "
                "The displayed interpretation is based on "
                "the configured reference ranges and should "
                "be reviewed with a qualified healthcare "
                "professional."
            )

        else:

            executive_summary = (
                f"The analysis identified "
                f"{len(biomarkers)} supported biomarker(s), "
                "and all extracted values are within the "
                "configured reference ranges."
            )

        # ====================================================
        # 12. DIFFERENTIAL POSSIBILITIES
        # ====================================================

        differential_possibilities = []

        high_glucose = any(
            item.name in [
                "HbA1c",
                "Fasting Blood Glucose"
            ]
            and item.status == "HIGH"
            for item in biomarkers
        )

        lipid_abnormal = any(
            item.category == "Lipid"
            and item.status != "NORMAL"
            for item in biomarkers
        )

        anemia_pattern = any(
            item.name == "Hemoglobin"
            and item.status == "LOW"
            for item in biomarkers
        )

        if high_glucose:

            differential_possibilities.append({
                "condition": "Abnormal Glycemic Pattern",
                "probability": 0.80,
                "urgency": "Clinical Follow-up",
                "rationale": (
                    "One or more glucose-related biomarkers "
                    "are above the configured reference range."
                )
            })

        if lipid_abnormal:

            differential_possibilities.append({
                "condition": "Abnormal Lipid Pattern",
                "probability": 0.75,
                "urgency": "Clinical Review",
                "rationale": (
                    "One or more lipid biomarkers are outside "
                    "the configured reference range."
                )
            })

        if anemia_pattern:

            differential_possibilities.append({
                "condition": "Low Hemoglobin Pattern",
                "probability": 0.65,
                "urgency": "Clinical Investigation",
                "rationale": (
                    "Hemoglobin is below the configured "
                    "reference range."
                )
            })

        if not differential_possibilities:

            differential_possibilities.append({
                "condition": "No Major Pattern Detected",
                "probability": 0.50,
                "urgency": "Routine Review",
                "rationale": (
                    "No predefined abnormal biomarker pattern "
                    "was detected among the extracted values."
                )
            })

        # ====================================================
        # 13. ACTION PLAN
        # ====================================================

        action_plan = {

            "diet": [
                "Maintain a balanced diet appropriate "
                "for your individual health needs.",
                "Prefer vegetables, legumes, whole grains "
                "and adequate protein.",
                "Limit excessive refined sugars and highly "
                "processed foods."
            ],

            "exercise": [
                "Maintain regular physical activity when "
                "medically appropriate.",
                "Discuss an appropriate exercise plan with "
                "your healthcare professional."
            ],

            "water_and_sleep": [
                "Maintain adequate hydration according "
                "to your individual medical needs.",
                "Aim for consistent, good-quality sleep."
            ],

            "questions_for_doctor": [
                "Which abnormal biomarkers require follow-up?",
                "Do any results require repeat testing?",
                "Are additional tests needed based on "
                "these findings?"
            ],

            "recommended_follow_up_tests": [
                "Repeat abnormal biomarkers as advised "
                "by a healthcare professional."
            ]
        }

        # ====================================================
        # 14. DISCLAIMER
        # ====================================================

        disclaimer = (
            "This automated analysis is for informational and "
            "demonstration purposes only. It does not diagnose "
            "disease or replace evaluation, diagnosis or treatment "
            "by a qualified healthcare professional."
        )

        # ====================================================
        # 15. CREATE ANALYSIS RESPONSE
        # ====================================================

        result = AnalysisResponse(

            # VERY IMPORTANT:
            # Always use the EXACT report that was requested.
            report_id=report.report_id,

            patient_info={
                "name": report.patient_name or "Unknown",
                "age": req.patient_age,
                "gender": req.patient_gender,
                "sample_date": None,
                "report_date": None,
                "lab_name": None
            },

            executive_summary=executive_summary,

            overall_health_score=overall_health_score,

            risk_level=risk_level,

            # Rule-engine/extraction confidence.
            # This is NOT diagnostic confidence.
            ai_confidence=0.90,

            emergency_alert=emergency_alert,

            biomarkers=biomarkers,

            organ_scores=organ_scores,

            differential_possibilities=(
                differential_possibilities
            ),

            action_plan=action_plan,

            disclaimer=disclaimer
        )

        # ====================================================
        # 16. SAVE RESULT TO CURRENT REPORT ONLY
        # ====================================================

        report.analysis_result = json.dumps(
            result.model_dump(),
            default=str
        )

        # Risk score = inverse of health score.
        report.risk_score = float(
            100 - overall_health_score
        )

        report.status = "analysis_completed"

        # ====================================================
        # 17. COMMIT
        # ====================================================

        db.commit()

        db.refresh(report)

        # ====================================================
        # 18. RETURN NEW/CURRENT REPORT RESULT
        # ====================================================

        return result

    except HTTPException:

        db.rollback()
        raise

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

    finally:

        db.close()
