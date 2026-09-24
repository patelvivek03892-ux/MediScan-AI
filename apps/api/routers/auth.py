"""
MediScan AI - Authentication & User Management Router

Provides endpoints for:
- User registration with password hashing
- Secure login and JWT access token issuance
- Current user profile retrieval (/me)
- Admin-controlled user directory, role delegation, and account status updates
"""

from datetime import datetime
from typing import Optional, List, Dict, Any
import re
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db
from models.user import User
from models.report import MedicalReport
from security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
    require_admin,
)

router = APIRouter()

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# ============================================================
# SCHEMAS
# ============================================================

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "Patient"
    phone: Optional[str] = None


class UserLoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    phone: Optional[str] = None
    status: str
    created_at: datetime
    reports_count: int = 0

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class RoleUpdateRequest(BaseModel):
    role: str


class StatusUpdateRequest(BaseModel):
    status: str


def _format_user_response(user: User, db: Session) -> UserResponse:
    report_count = db.query(MedicalReport).filter(MedicalReport.user_id == user.id).count()
    return UserResponse(
        id=user.id,
        email=user.email,
        full_name=user.full_name,
        role=user.role,
        phone=user.phone,
        status=user.status,
        created_at=user.created_at,
        reports_count=report_count,
    )


# ============================================================
# AUTHENTICATION ENDPOINTS
# ============================================================

@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    """
    Register a new user account with hashed password and return JWT access token.
    """
    if not EMAIL_REGEX.match(req.email.strip()):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a valid email address."
        )

    if len(req.password.strip()) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters in length."
        )

    # Check email duplicate
    normalized_email = req.email.strip().lower()
    existing = db.query(User).filter(User.email == normalized_email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Allowed roles
    valid_roles = {"Patient", "Doctor", "Lab Tech", "Compliance Officer", "Admin"}
    assigned_role = req.role if req.role in valid_roles else "Patient"

    new_user = User(
        email=normalized_email,
        hashed_password=hash_password(req.password),
        full_name=req.full_name.strip(),
        role=assigned_role,
        phone=req.phone.strip() if req.phone else None,
        status="Active",
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({
        "sub": new_user.email,
        "user_id": new_user.id,
        "role": new_user.role,
        "name": new_user.full_name,
    })

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=_format_user_response(new_user, db)
    )


@router.post("/login", response_model=AuthResponse)
async def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    """
    Verify user credentials and return authenticated JWT access token.
    """
    normalized_email = req.email.strip().lower()
    user = db.query(User).filter(User.email == normalized_email).first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.status != "Active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been suspended. Please contact clinical administration.",
        )

    token = create_access_token({
        "sub": user.email,
        "user_id": user.id,
        "role": user.role,
        "name": user.full_name,
    })

    return AuthResponse(
        access_token=token,
        token_type="bearer",
        user=_format_user_response(user, db)
    )


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Return currently authenticated user's profile and report count.
    """
    return _format_user_response(current_user, db)


# ============================================================
# ADMINISTRATIVE USER MANAGEMENT (ADMIN ONLY)
# ============================================================

@router.get("/users", response_model=List[UserResponse])
async def list_all_users(
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Retrieve all registered users (Administrator privilege required).
    """
    users = db.query(User).order_by(User.created_at.desc()).all()
    return [_format_user_response(u, db) for u in users]


@router.put("/users/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: int,
    req: RoleUpdateRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Update a user's role (Administrator privilege required).
    """
    valid_roles = {"Patient", "Doctor", "Lab Tech", "Compliance Officer", "Admin"}
    if req.role not in valid_roles:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid role. Must be one of: {', '.join(valid_roles)}"
        )

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    target_user.role = req.role
    db.commit()
    db.refresh(target_user)
    return _format_user_response(target_user, db)


@router.put("/users/{user_id}/status", response_model=UserResponse)
async def update_user_status(
    user_id: int,
    req: StatusUpdateRequest,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Update a user's account status (Active / Suspended) (Administrator privilege required).
    """
    if req.status not in {"Active", "Suspended"}:
        raise HTTPException(status_code=400, detail="Status must be 'Active' or 'Suspended'")

    # Prevent admin suspending themselves
    if target_user_id := user_id:
        if target_user_id == admin.id and req.status == "Suspended":
            raise HTTPException(status_code=400, detail="Cannot suspend your own administrator account")

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    target_user.status = req.status
    db.commit()
    db.refresh(target_user)
    return _format_user_response(target_user, db)


@router.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Delete a user account and cascade delete their reports (Administrator privilege required).
    """
    if user_id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot delete your own administrator account")

    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(target_user)
    db.commit()
    return {"status": "success", "message": f"User {target_user.email} deleted successfully"}
