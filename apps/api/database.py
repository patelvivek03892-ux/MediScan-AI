"""
MediScan AI - Database Configuration

PostgreSQL connection using SQLAlchemy.
The DATABASE_URL is read from the environment variable.

Never hard-code your PostgreSQL password in this file.
"""

import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker


# ============================================================
# DATABASE URL
# ============================================================

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mediscan.db")

# ============================================================
# DATABASE ENGINE
# ============================================================

connect_args = {}
engine_kwargs = {}

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace(
        "postgresql://",
        "postgresql+psycopg://",
        1,
    )
    engine_kwargs["pool_pre_ping"] = True
elif DATABASE_URL.startswith("sqlite"):
    connect_args["check_same_thread"] = False

engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args,
    **engine_kwargs
)


# ============================================================
# DATABASE SESSION
# ============================================================

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ============================================================
# BASE MODEL
# ============================================================

Base = declarative_base()


# ============================================================
# DATABASE DEPENDENCY
# ============================================================

def get_db():
    """
    Provide a database session to FastAPI routes.
    """

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
