"""
MediScan AI - Cryptographic Security & Authentication Primitives

Provides:
- PBKDF2-HMAC-SHA256 password hashing with random salt
- Self-contained, standard RFC 7519 HMAC-SHA256 JWT tokens
- FastAPI authentication dependencies (get_current_user, require_admin, require_doctor_or_admin)
"""

import os
import time
import json
import base64
import hmac
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from models.user import User

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "mediscan-ai-enterprise-hipaa-secure-jwt-key-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

security_scheme = HTTPBearer(auto_error=False)


# ============================================================
# PASSWORD HASHING (PBKDF2-HMAC-SHA256)
# ============================================================

def hash_password(password: str) -> str:
    """
    Hash a password using PBKDF2-HMAC-SHA256 with 100,000 rounds and random 16-byte salt.
    Format: salt$hex_hash
    """
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    )
    return f"{salt}${key.hex()}"


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify plain password against salt$hex_hash in constant time.
    """
    if not hashed_password or '$' not in hashed_password:
        return False
    try:
        salt, expected_hash = hashed_password.split('$', 1)
        key = hashlib.pbkdf2_hmac(
            'sha256',
            plain_password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return hmac.compare_digest(key.hex(), expected_hash)
    except Exception:
        return False


# ============================================================
# JWT TOKEN GENERATION & VERIFICATION (RFC 7519)
# ============================================================

def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')


def _base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4)) if len(data) % 4 != 0 else ''
    return base64.urlsafe_b64decode(data + padding)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create standard RFC 7519 HMAC-SHA256 JWT Token.
    """
    now = int(time.time())
    if expires_delta:
        exp = now + int(expires_delta.total_seconds())
    else:
        exp = now + (ACCESS_TOKEN_EXPIRE_MINUTES * 60)

    header = {
        "alg": "HS256",
        "typ": "JWT"
    }

    payload = dict(data)
    payload["iat"] = now
    payload["exp"] = exp

    header_bytes = json.dumps(header, separators=(',', ':')).encode('utf-8')
    payload_bytes = json.dumps(payload, separators=(',', ':')).encode('utf-8')

    header_b64 = _base64url_encode(header_bytes)
    payload_b64 = _base64url_encode(payload_bytes)

    signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
    signature = hmac.new(
        SECRET_KEY.encode('utf-8'),
        signing_input,
        hashlib.sha256
    ).digest()

    sig_b64 = _base64url_encode(signature)
    return f"{header_b64}.{payload_b64}.{sig_b64}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Decode and verify HMAC-SHA256 JWT token.
    Returns payload if valid, None if invalid or expired.
    """
    try:
        parts = token.split('.')
        if len(parts) != 3:
            return None

        header_b64, payload_b64, sig_b64 = parts

        # Verify signature
        signing_input = f"{header_b64}.{payload_b64}".encode('utf-8')
        expected_sig = hmac.new(
            SECRET_KEY.encode('utf-8'),
            signing_input,
            hashlib.sha256
        ).digest()

        provided_sig = _base64url_decode(sig_b64)
        if not hmac.compare_digest(expected_sig, provided_sig):
            return None

        # Decode payload
        payload_bytes = _base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode('utf-8'))

        # Verify expiration
        exp = payload.get("exp")
        if exp and exp < int(time.time()):
            return None

        return payload
    except Exception:
        return None


# ============================================================
# FASTAPI AUTHENTICATION DEPENDENCIES
# ============================================================

async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    """
    Authenticate user via Authorization: Bearer <token>.
    Raises HTTP 401 if missing, invalid, or expired.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired access token. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("user_id")
    email = payload.get("sub")

    query = db.query(User)
    if user_id:
        user = query.filter(User.id == user_id).first()
    elif email:
        user = query.filter(User.email == email).first()
    else:
        user = None

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account associated with this token was not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if user.status != "Active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your user account has been suspended. Please contact clinical administration.",
        )

    return user


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Optional authentication. Returns User if valid token is provided, None otherwise.
    """
    if not credentials or not credentials.credentials:
        return None

    try:
        payload = decode_access_token(credentials.credentials)
        if not payload:
            return None

        user_id = payload.get("user_id")
        email = payload.get("sub")

        query = db.query(User)
        if user_id:
            user = query.filter(User.id == user_id).first()
        elif email:
            user = query.filter(User.email == email).first()
        else:
            user = None

        if user and user.status == "Active":
            return user
        return None
    except Exception:
        return None


async def require_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Ensures current authenticated user has Admin role.
    """
    if current_user.role != "Admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Administrator privileges required.",
        )
    return current_user


async def require_doctor_or_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Ensures current authenticated user has Doctor or Admin role.
    """
    if current_user.role not in ["Doctor", "Admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: Physician or Administrator privileges required.",
        )
    return current_user
