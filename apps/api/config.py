"""
MediScan AI - Application Configuration & Environment Settings

Loads environment variables for:
- Database connections
- JWT security settings
- SMTP outbound email configuration (Local & Production)
- CORS and frontend integration
"""

import os
from typing import Optional
from pathlib import Path
from dotenv import load_dotenv

# Load .env from api root or project root if available
BASE_DIR = Path(__file__).resolve().parent
dotenv_path = BASE_DIR / ".env"
if dotenv_path.exists():
    load_dotenv(dotenv_path)
else:
    load_dotenv()


class Settings:
    # App General
    APP_NAME: str = "MediScan AI"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "true").lower() in ("true", "1", "yes")
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:3000")

    # Security / Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # SMTP Email Configuration
    MAIL_HOST: str = os.getenv("MAIL_HOST", "").strip()
    MAIL_PORT: int = int(os.getenv("MAIL_PORT", "587"))
    MAIL_USERNAME: str = os.getenv("MAIL_USERNAME", "").strip()
    MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD", "").strip()
    # Encryption: 'tls' (STARTTLS on 587/25), 'ssl' (port 465), or 'none'
    MAIL_ENCRYPTION: str = os.getenv("MAIL_ENCRYPTION", "tls").strip().lower()
    MAIL_FROM_ADDRESS: str = os.getenv("MAIL_FROM_ADDRESS", "no-reply@mediscan.ai").strip()
    MAIL_FROM_NAME: str = os.getenv("MAIL_FROM_NAME", "MediScan AI Healthcare Intelligence").strip()
    MAIL_REPLY_TO: Optional[str] = os.getenv("MAIL_REPLY_TO", "").strip() or None
    MAIL_TIMEOUT_SECONDS: int = int(os.getenv("MAIL_TIMEOUT_SECONDS", "10"))

    @classmethod
    def is_smtp_configured(cls) -> bool:
        """
        Returns True if host, username, and password are configured with non-empty,
        non-placeholder values.
        """
        if not cls.MAIL_HOST or not cls.MAIL_USERNAME or not cls.MAIL_PASSWORD:
            return False
        # Discard placeholder values
        placeholders = {
            "your-smtp-host.com",
            "smtp.example.com",
            "your-email@gmail.com",
            "your-app-password",
            "changeme",
        }
        if cls.MAIL_HOST.lower() in placeholders or cls.MAIL_USERNAME.lower() in placeholders:
            return False
        return True


settings = Settings()
