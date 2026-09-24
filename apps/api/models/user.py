"""
MediScan AI - User Account Database Model
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    """
    Stores authenticated user credentials, profiles, and clinical role permissions.
    """

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    email = Column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    hashed_password = Column(
        String(255),
        nullable=False,
    )

    full_name = Column(
        String(255),
        nullable=False,
    )

    role = Column(
        String(50),
        default="Patient",
        nullable=False,
    )

    phone = Column(
        String(50),
        nullable=True,
    )

    status = Column(
        String(50),
        default="Active",
        nullable=False,
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

    # Relationship to user's reports
    reports = relationship(
        "MedicalReport",
        back_populates="user",
        cascade="all, delete-orphan",
    )
