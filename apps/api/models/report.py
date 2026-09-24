"""
MediScan AI - Medical Report Database Model
"""

from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class MedicalReport(Base):
    """
    Stores uploaded medical reports and their processing results.
    """

    __tablename__ = "medical_reports"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=True,
        index=True,
    )

    report_id = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True,
    )

    filename = Column(
        String(255),
        nullable=False,
    )

    patient_name = Column(
        String(255),
        nullable=True,
    )

    document_type = Column(
        String(50),
        nullable=True,
    )

    extracted_text = Column(
        Text,
        nullable=True,
    )

    analysis_result = Column(
        Text,
        nullable=True,
    )

    risk_score = Column(
        Float,
        nullable=True,
    )

    ocr_confidence = Column(
        Float,
        nullable=True,
    )

    processing_time_ms = Column(
        Float,
        nullable=True,
    )

    status = Column(
        String(50),
        nullable=False,
        default="processed",
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    user = relationship("User", back_populates="reports")

