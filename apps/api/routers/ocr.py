"""
MediScan AI - OCR Pipeline Router

Handles:
- PDF / image report uploads
- File validation
- OCR processing
- OCR confidence
- Page-level results
- PostgreSQL report storage

NOTE:
The OCR engine is currently simulated.
The database integration is real.

Later, PaddleOCR / Surya OCR can replace the
run_ocr_engine() function without changing the API.
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from typing import List
import time
import uuid

from sqlalchemy.orm import Session

from database import SessionLocal
from models.report import MedicalReport


router = APIRouter()


# ============================================================
# CONFIGURATION
# ============================================================

MAX_FILE_SIZE_MB = 20

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}


# ============================================================
# RESPONSE MODELS
# ============================================================

class OCRWord(BaseModel):
    text: str
    confidence: float
    bbox: List[int]


class OCRPageResult(BaseModel):
    page_number: int
    text: str
    confidence: float
    detected_orientation: int
    deskew_angle: float
    words: List[OCRWord]


class OCRResponse(BaseModel):
    status: str
    filename: str
    report_id: str
    processing_time_ms: float
    engines_used: List[str]
    pages: List[OCRPageResult]
    aggregated_text: str


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def get_file_extension(filename: str) -> str:
    """
    Return lowercase file extension.
    """

    if "." not in filename:
        return ""

    return "." + filename.rsplit(".", 1)[1].lower()


def validate_file(filename: str, content: bytes) -> None:
    """
    Validate uploaded file.
    """

    if not filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is missing.",
        )

    extension = get_file_extension(filename)

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=(
                f"Unsupported file type '{extension}'. "
                f"Allowed types: "
                f"{', '.join(sorted(ALLOWED_EXTENSIONS))}"
            ),
        )

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Uploaded file is empty.",
        )

    max_size = MAX_FILE_SIZE_MB * 1024 * 1024

    if len(content) > max_size:
        raise HTTPException(
            status_code=413,
            detail=(
                f"File size must not exceed "
                f"{MAX_FILE_SIZE_MB} MB."
            ),
        )


def get_document_type(filename: str) -> str:
    """
    Determine uploaded document type.
    """

    extension = get_file_extension(filename)

    if extension == ".pdf":
        return "PDF"

    if extension in {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    }:
        return "IMAGE"

    return "UNKNOWN"


def extract_patient_name(text: str) -> str | None:
    """
    Extract patient name from OCR text.

    Example:
        Patient Name: Rahul Verma
    """

    for line in text.splitlines():

        line = line.strip()

        if line.lower().startswith("patient name:"):

            name = line.split(":", 1)[1].strip()

            if name:
                return name

    return None


# ============================================================
# PREPROCESSING
# ============================================================

def preprocess_document(
    content: bytes,
    filename: str,
) -> dict:
    """
    Placeholder for document preprocessing.

    Future implementation can include:
    - resizing
    - noise reduction
    - brightness enhancement
    - sharpening
    - deskewing
    - perspective correction
    - shadow removal
    - automatic cropping
    """

    return {
        "document_type": get_document_type(filename),
        "input_size_bytes": len(content),
        "preprocessing": [
            "orientation_detection",
            "deskew",
            "noise_reduction",
            "brightness_enhancement",
            "sharpening",
        ],
    }


# ============================================================
# TEMPORARY OCR ENGINE
# ============================================================

def get_mock_medical_text() -> str:
    """
    Temporary OCR fallback.

    This simulates OCR output.

    Replace this later with PaddleOCR / Surya OCR.
    """

    return """
METROPOLIS HEALTHCARE & DIAGNOSTIC LABS
Accredited by NABL / CAP | License: MH-2024-9981
------------------------------------------------------
Patient Name: Rahul Verma        Age/Gender: 42 Y / Male
Referring Dr: Dr. Anjali Mehta, MD   Sample Date: 12-Aug-2026
Lab Reg No: MET-902148           Report Date: 12-Aug-2026

TEST NAME                     RESULT    UNIT      REFERENCE INTERVAL
--------------------------------------------------------------------
COMPLETE BLOOD COUNT (CBC)

Hemoglobin                    11.4      g/dL      13.5 - 17.5    [LOW]
Total Leucocyte Count (WBC)   12,800    /cumm     4,000 - 11,000 [HIGH]
RBC Count                     3.9       mil/uL    4.5 - 5.9      [LOW]
Platelet Count                145,000   /cumm     150,000 - 450,000 [LOW]
Neutrophils                   78        %         40 - 70        [HIGH]
Lymphocytes                   16        %         20 - 40        [LOW]

LIPID PROFILE

Total Cholesterol             248       mg/dL     < 200          [HIGH]
Triglycerides                 215       mg/dL     < 150          [HIGH]
HDL Cholesterol (Good)        36        mg/dL     > 40           [LOW]
LDL Cholesterol (Bad)         169       mg/dL     < 100          [HIGH]
VLDL                          43        mg/dL     < 30           [HIGH]

DIABETIC METABOLIC

HbA1c (Glycated Hemoglobin)   7.6       %         < 5.7          [HIGH]
Average Blood Glucose         171       mg/dL     < 115          [HIGH]
Fasting Blood Sugar           142       mg/dL     70 - 99        [HIGH]

KIDNEY FUNCTION (KFT)

Serum Creatinine              1.35      mg/dL     0.7 - 1.2      [HIGH]
Blood Urea Nitrogen           24        mg/dL     7 - 20         [HIGH]
eGFR                          64        mL/min    > 90           [MILD REDUCTION]
------------------------------------------------------
Verified by: Dr. S. K. Roy, Pathologist
""".strip()


def run_ocr_engine(
    content: bytes,
    filename: str,
    enhance_handwriting: bool,
    detect_tables: bool,
    detect_signatures: bool,
) -> dict:
    """
    OCR engine abstraction.

    Currently simulated.

    Future engines:
    - PaddleOCR
    - Surya OCR
    - DocTR
    - Tesseract
    """

    text = get_mock_medical_text()

    words = [
        OCRWord(
            text="Hemoglobin",
            confidence=0.99,
            bbox=[50, 100, 150, 120],
        ),
        OCRWord(
            text="11.4",
            confidence=0.98,
            bbox=[180, 100, 220, 120],
        ),
        OCRWord(
            text="HbA1c",
            confidence=0.99,
            bbox=[50, 300, 120, 320],
        ),
        OCRWord(
            text="7.6",
            confidence=0.99,
            bbox=[180, 300, 220, 320],
        ),
    ]

    return {
        "text": text,
        "confidence": 0.978,
        "orientation": 0,
        "deskew_angle": 0.4,
        "words": words,
        "engines": [
            "Surya OCR v0.4 (simulated)",
            "PaddleOCR v3.0 (simulated)",
            "DocTR v0.9 (simulated)",
        ],
    }


# ============================================================
# DATABASE SAVE
# ============================================================

def save_report_to_database(
    filename: str,
    document_type: str,
    extracted_text: str,
    ocr_confidence: float,
    processing_time_ms: float,
) -> str:
    """
    Save OCR report into PostgreSQL.
    """

    db: Session = SessionLocal()

    try:

        report_id = f"MED-{uuid.uuid4().hex[:12].upper()}"

        patient_name = extract_patient_name(
            extracted_text
        )

        report = MedicalReport(
            report_id=report_id,
            filename=filename,
            patient_name=patient_name,
            document_type=document_type,
            extracted_text=extracted_text,
            analysis_result=None,
            risk_score=None,
            ocr_confidence=ocr_confidence,
            processing_time_ms=processing_time_ms,
            status="ocr_completed",
        )

        db.add(report)

        db.commit()

        db.refresh(report)

        return report.report_id

    except Exception:

        db.rollback()

        raise

    finally:

        db.close()


# ============================================================
# OCR ENDPOINT
# ============================================================

@router.post(
    "/process",
    response_model=OCRResponse,
)
async def process_document(
    file: UploadFile = File(...),

    enhance_handwriting: bool = Form(True),

    detect_tables: bool = Form(True),

    detect_signatures: bool = Form(True),
):
    """
    Process uploaded medical report.

    Endpoint:

        POST /api/ocr/process
    """

    start_time = time.perf_counter()

    # --------------------------------------------------------
    # READ FILE
    # --------------------------------------------------------

    try:

        content = await file.read()

    except Exception as exc:

        raise HTTPException(
            status_code=400,
            detail=f"Unable to read uploaded file: {str(exc)}",
        )

    filename = file.filename or "uploaded_report.pdf"

    # --------------------------------------------------------
    # VALIDATE FILE
    # --------------------------------------------------------

    validate_file(
        filename=filename,
        content=content,
    )

    # --------------------------------------------------------
    # PREPROCESSING
    # --------------------------------------------------------

    preprocessing_info = preprocess_document(
        content=content,
        filename=filename,
    )

    _ = preprocessing_info

    # --------------------------------------------------------
    # OCR
    # --------------------------------------------------------

    try:

        ocr_result = run_ocr_engine(
            content=content,
            filename=filename,
            enhance_handwriting=enhance_handwriting,
            detect_tables=detect_tables,
            detect_signatures=detect_signatures,
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"OCR processing failed: {str(exc)}",
        )

    # --------------------------------------------------------
    # PROCESSING TIME
    # --------------------------------------------------------

    processing_time_ms = round(
        (time.perf_counter() - start_time) * 1000,
        2,
    )

    # --------------------------------------------------------
    # SAVE TO POSTGRESQL
    # --------------------------------------------------------

    try:

        report_id = save_report_to_database(
            filename=filename,
            document_type=get_document_type(filename),
            extracted_text=ocr_result["text"],
            ocr_confidence=ocr_result["confidence"],
            processing_time_ms=processing_time_ms,
        )

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=(
                "OCR completed, but the report could not "
                f"be saved to PostgreSQL: {str(exc)}"
            ),
        )

    # --------------------------------------------------------
    # PAGE RESULT
    # --------------------------------------------------------

    page_result = OCRPageResult(
        page_number=1,
        text=ocr_result["text"],
        confidence=ocr_result["confidence"],
        detected_orientation=ocr_result["orientation"],
        deskew_angle=ocr_result["deskew_angle"],
        words=ocr_result["words"],
    )

    # --------------------------------------------------------
    # FINAL RESPONSE
    # --------------------------------------------------------

    return OCRResponse(
        status="success",
        filename=filename,
        report_id=report_id,
        processing_time_ms=processing_time_ms,
        engines_used=ocr_result["engines"],
        pages=[page_result],
        aggregated_text=ocr_result["text"],
    )
