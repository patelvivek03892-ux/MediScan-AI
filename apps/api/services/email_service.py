"""
MediScan AI - Outbound SMTP Email Service & Template Engine

Features:
- Outbound SMTP sending via Python standard smtplib + SSL/TLS.
- Safe Development Fallback: logs dispatches to disk when SMTP is unconfigured.
- Multilingual email templates (English, Hindi, Gujarati).
- Multipart MIME (HTML + plain text fallback).
- Clinical report notification dispatch & connectivity diagnostics.
"""

import smtplib
import ssl
import json
import logging
import re
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr, formatdate, make_msgid
from pathlib import Path
from typing import Dict, Any, Optional, List, Tuple

from config import settings

logger = logging.getLogger("mediscan.email")

# Ensure logs directory exists
LOGS_DIR = Path(__file__).resolve().parent.parent / "logs"
LOGS_DIR.mkdir(parents=True, exist_ok=True)
EMAIL_LOG_FILE = LOGS_DIR / "email_dispatches.log"

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# ============================================================
# MULTILINGUAL LOCALIZATION DICTIONARIES
# ============================================================

TRANSLATIONS: Dict[str, Dict[str, str]] = {
    "en": {
        "subject_prefix": "[MediScan AI] Clinical Health Report Analysis Ready",
        "greeting": "Hello",
        "header_subtitle": "Clinical Diagnostic Report & Biomarker Intelligence",
        "intro": "Your medical test report has been analyzed by MediScan AI. Below is your clinical summary overview:",
        "health_score": "Health Score",
        "risk_tier": "Risk Tier",
        "patient": "Patient",
        "report_id": "Report ID",
        "doctor": "Attending Doctor",
        "facility": "Diagnostic Facility",
        "date": "Sample Date",
        "summary_title": "Clinical Executive Summary",
        "abnormal_title": "Out-of-Range Biomarker Alerts",
        "ref_range": "Ref Range",
        "cta_button": "View Full Interactive Analysis & Trends",
        "disclaimer_title": "Mandatory Medical Disclaimer",
        "disclaimer_body": "This AI-generated report summary is for informational and educational purposes only. It does not replace clinical consultation, professional medical advice, diagnosis, or treatment by a licensed healthcare provider.",
        "test_subject": "[MediScan AI] SMTP Connectivity Test Verification",
        "test_body_heading": "SMTP Email Verification Successful",
        "test_body_text": "Your MediScan AI outbound SMTP mail transport is operational and connected. This confirms that local and production email dispatches are active.",
    },
    "hi": {
        "subject_prefix": "[MediScan AI] नैदानिक स्वास्थ्य रिपोर्ट विश्लेषण तैयार है",
        "greeting": "नमस्ते",
        "header_subtitle": "क्लिनिकल डायग्नोस्टिक रिपोर्ट और बायोमार्कर विश्लेषण",
        "intro": "आपकी मेडिकल परीक्षण रिपोर्ट का MediScan AI द्वारा विश्लेषण किया गया है। नीचे आपका नैदानिक सारांश दिया गया है:",
        "health_score": "स्वास्थ्य स्कोर",
        "risk_tier": "जोखिम स्तर",
        "patient": "रोगी",
        "report_id": "रिपोर्ट आईडी",
        "doctor": "चिकित्सक",
        "facility": "प्रयोगशाला सुविधा",
        "date": "नमूना दिनांक",
        "summary_title": "चिकित्सकीय कार्यकारी सारांश",
        "abnormal_title": "असामान्य बायोमार्कर चेतावनी",
        "ref_range": "सामान्य सीमा",
        "cta_button": "पूर्ण इंटरैक्टिव विश्लेषण और रुझान देखें",
        "disclaimer_title": "अनिवार्य चिकित्सीय अस्वीकरण",
        "disclaimer_body": "यह AI-जनरेटेड सारांश केवल सूचनात्मक और शैक्षणिक उद्देश्यों के लिए है। यह लाइसेंस प्राप्त चिकित्सक के परामर्श, निदान अथवा उपचार का विकल्प नहीं है।",
        "test_subject": "[MediScan AI] SMTP कनेक्टिविटी परीक्षण सत्यापन",
        "test_body_heading": "SMTP ईमेल सत्यापन सफल",
        "test_body_text": "आपका MediScan AI आउटबाउंड SMTP मेल ट्रांसपोर्ट सक्रिय और कनेक्टेड है। स्थानीय और प्रोडक्शन ईमेल प्रेषण कार्य कर रहा है।",
    },
    "gu": {
        "subject_prefix": "[MediScan AI] ક્લિનિકલ હેલ્થ રિપોર્ટ વિશ્લેષણ તૈયાર છે",
        "greeting": "નમસ્તે",
        "header_subtitle": "ક્લિનિકલ ડાયગ્નોસ્ટિક રિપોર્ટ અને બાયોમાર્કર ઇન્ટેલિજન્સ",
        "intro": "તમારા તબીબી પરીક્ષણ રિપોર્ટનું MediScan AI દ્વારા વિશ્લેષણ કરવામાં આવ્યું છે. નીચે તમારો ક્લિનિકલ સારાંશ આપેલ છે:",
        "health_score": "સ્વાસ્થ્ય સ્કોર",
        "risk_tier": "જોખમ સ્તર",
        "patient": "દર્દી",
        "report_id": "રિપોર્ટ આઈડી",
        "doctor": "તબીબ",
        "facility": "પ્રયોગશાળા",
        "date": "નમૂના તારીખ",
        "summary_title": "ક્લિનિકલ સારાંશ",
        "abnormal_title": "અસામાન્ય બાયોમાર્કર ચેતવણીઓ",
        "ref_range": "સામાન્ય મર્યાદા",
        "cta_button": "સંપૂર્ણ ઇન્ટરેક્ટિવ વિશ્લેષણ જુઓ",
        "disclaimer_title": "ફરજિયાત તબીબી ડિસ્ક્લેમર",
        "disclaimer_body": "આ AI-જનરેટેડ રિપોર્ટ સારાંશ માત્ર માહિતી અને શૈક્ષણિક હેતુઓ માટે છે. તે લાયસન્સ પ્રાપ્ત ચિકિત્સકની સલાહ કે નિદાનનું સ્થાન લેતો નથી.",
        "test_subject": "[MediScan AI] SMTP કનેક્ટિવિટી ટેસ્ટ ચકાસણી",
        "test_body_heading": "SMTP ઇમેઇલ ચકાસણી સફળ",
        "test_body_text": "તમારું MediScan AI આઉટબાઉન્ડ SMTP મેઇલ ટ્રાન્સપોર્ટ સક્રિય અને જોડાયેલ છે.",
    },
}


def get_translation_dict(language: Optional[str]) -> Dict[str, str]:
    """Return dictionary for requested language, falling back to English."""
    lang = (language or "en").lower()
    return TRANSLATIONS.get(lang, TRANSLATIONS["en"])


# ============================================================
# TEMPLATE BUILDERS
# ============================================================

def build_report_email_content(
    report_dict: Dict[str, Any],
    recipient_name: str,
    language: str = "en",
) -> Tuple[str, str, str]:
    """
    Renders subject, HTML body, and plain-text fallback body.
    Returns: (subject, html_body, text_body)
    """
    t = get_translation_dict(language)

    # Extract report attributes safely from either MedicalReport DB object or dict
    title = report_dict.get("title") or report_dict.get("filename") or "Medical Laboratory Report"
    rep_id = report_dict.get("id") or report_dict.get("report_id") or "REP-2026"
    patient_name = report_dict.get("patientName") or report_dict.get("patient_name") or recipient_name or "Patient"
    age = report_dict.get("age", 35)
    gender = report_dict.get("gender", "Unspecified")
    sample_date = report_dict.get("sampleDate") or report_dict.get("created_at") or datetime.utcnow().strftime("%Y-%m-%d")
    doctor_name = report_dict.get("doctorName") or "Attending Physician, MD"
    laboratory = report_dict.get("laboratory") or "Metropolis Clinical Diagnostics"
    
    # Scores
    health_score = int(report_dict.get("overallHealthScore") or report_dict.get("overall_health_score") or 75)
    risk_level = str(report_dict.get("riskLevel") or report_dict.get("risk_level") or "MODERATE").upper()
    exec_summary = report_dict.get("executiveSummary") or report_dict.get("extracted_text") or "Comprehensive diagnostic panel processed."
    if len(exec_summary) > 600:
        exec_summary = exec_summary[:600] + "..."

    # Out of range biomarkers
    raw_biomarkers: List[Dict[str, Any]] = report_dict.get("biomarkers") or []
    abnormal = [
        b for b in raw_biomarkers
        if str(b.get("status", "")).upper() not in ("NORMAL", "OPTIMAL", "")
    ]

    # Theme colors
    score_color = "#059669" if health_score >= 80 else "#d97706" if health_score >= 60 else "#dc2626"
    
    subject = f"{t['subject_prefix']} ({patient_name} - {t['health_score']}: {health_score}/100)"

    # HTML Generation
    abnormal_rows_html = ""
    for bm in abnormal:
        abnormal_rows_html += f"""
        <tr style="border-bottom: 1px solid #334155;">
          <td style="padding: 10px 12px; font-weight: 600; color: #f1f5f9;">{bm.get('name', 'Biomarker')}</td>
          <td style="padding: 10px 12px; color: #fca5a5; font-weight: 700;">{bm.get('value')} {bm.get('unit', '')}</td>
          <td style="padding: 10px 12px; color: #ef4444; font-weight: 600;">{bm.get('status')}</td>
          <td style="padding: 10px 12px; color: #94a3b8; font-size: 12px;">{bm.get('refMin', 0)} - {bm.get('refMax', 0)} {bm.get('unit', '')}</td>
        </tr>
        """

    abnormal_section = f"""
    <div style="margin: 20px 0; background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 16px;">
      <h3 style="margin: 0 0 12px 0; font-size: 14px; color: #f87171; text-transform: uppercase; letter-spacing: 0.5px;">
        ⚠️ {t['abnormal_title']} ({len(abnormal)})
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
        <thead>
          <tr style="border-bottom: 2px solid #475569; color: #94a3b8; font-size: 11px;">
            <th style="padding: 8px 12px;">BIOMARKER</th>
            <th style="padding: 8px 12px;">VALUE</th>
            <th style="padding: 8px 12px;">STATUS</th>
            <th style="padding: 8px 12px;">REF RANGE</th>
          </tr>
        </thead>
        <tbody>
          {abnormal_rows_html}
        </tbody>
      </table>
    </div>
    """ if abnormal else ""

    analysis_url = f"{settings.FRONTEND_URL}/analysis"

    html_content = f"""<!DOCTYPE html>
<html lang="{language}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #090d16; color: #f8fafc; margin: 0; padding: 24px;">
  <div style="max-width: 620px; margin: 0 auto; background: #0f172a; border-radius: 20px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #0284c7 0%, #0f766e 100%); padding: 32px 24px; text-align: center;">
      <h1 style="color: #ffffff; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">🩺 MediScan AI</h1>
      <p style="color: #cffafe; font-size: 13px; margin: 6px 0 0 0; font-weight: 500;">{t['header_subtitle']}</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 28px 24px;">
      <p style="font-size: 15px; color: #e2e8f0; margin-top: 0;">{t['greeting']} <strong>{recipient_name}</strong>,</p>
      <p style="font-size: 13px; color: #94a3b8; line-height: 1.6; margin-bottom: 24px;">{t['intro']}</p>

      <!-- Score Card -->
      <div style="background: #1e293b; border-radius: 16px; padding: 20px; text-align: center; border: 1px solid #334155; margin-bottom: 24px;">
        <div style="display: inline-block; padding: 8px 20px; border-radius: 9999px; background: {score_color}; color: #ffffff; font-weight: 800; font-size: 16px; letter-spacing: 0.5px;">
          {t['health_score']}: {health_score} / 100
        </div>
        <div style="margin-top: 12px; font-size: 13px; color: #cbd5e1;">
          {t['risk_tier']}: <strong style="color: {score_color};">{risk_level}</strong>
        </div>
      </div>

      <!-- Metadata Box -->
      <div style="background: #0b1120; border-radius: 14px; padding: 16px 20px; border: 1px solid #1e293b; margin-bottom: 24px; font-size: 13px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; width: 35%;">{t['patient']}:</td>
            <td style="padding: 6px 0; color: #f1f5f9; font-weight: 600;">{patient_name} ({age}y / {gender})</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">{t['report_id']}:</td>
            <td style="padding: 6px 0; color: #38bdf8; font-family: monospace; font-weight: 600;">{rep_id}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">{t['doctor']}:</td>
            <td style="padding: 6px 0; color: #f1f5f9;">{doctor_name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">{t['facility']}:</td>
            <td style="padding: 6px 0; color: #f1f5f9;">{laboratory}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b;">{t['date']}:</td>
            <td style="padding: 6px 0; color: #f1f5f9;">{sample_date}</td>
          </tr>
        </table>
      </div>

      <!-- Executive Summary -->
      <div style="background: #0b1120; border-left: 4px solid #38bdf8; border-radius: 0 12px 12px 0; padding: 16px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 8px 0; color: #38bdf8; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">{t['summary_title']}</h4>
        <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin: 0;">{exec_summary}</p>
      </div>

      <!-- Abnormal Biomarkers -->
      {abnormal_section}

      <!-- Interactive Review CTA -->
      <div style="text-align: center; margin: 32px 0 20px 0;">
        <a href="{analysis_url}" style="display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 100%); color: #ffffff; text-decoration: none; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 12px; box-shadow: 0 10px 20px rgba(14, 165, 233, 0.3);">
          {t['cta_button']} &rarr;
        </a>
      </div>

      <!-- Disclaimer -->
      <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; line-height: 1.6;">
        <strong style="color: #94a3b8;">{t['disclaimer_title']}:</strong> {t['disclaimer_body']}
      </div>
    </div>
  </div>
</body>
</html>"""

    # Plain Text Generation
    abnormal_text = ""
    for bm in abnormal:
        abnormal_text += f"- {bm.get('name')}: {bm.get('value')} {bm.get('unit', '')} [{bm.get('status')}] (Ref: {bm.get('refMin')}-{bm.get('refMax')})\n"

    text_content = f"""
MediScan AI - {t['header_subtitle']}
==================================================
{t['greeting']} {recipient_name},

{t['intro']}

{t['health_score']}: {health_score}/100 | {t['risk_tier']}: {risk_level}
{t['patient']}: {patient_name} ({age}y / {gender})
{t['report_id']}: {rep_id}
{t['doctor']}: {doctor_name}
{t['facility']}: {laboratory}
{t['date']}: {sample_date}

{t['summary_title']}:
{exec_summary}

Out-of-Range Biomarkers:
{abnormal_text if abnormal else 'No out-of-range biomarkers detected.'}

View Full Interactive Analysis & Trends:
{analysis_url}

--------------------------------------------------
{t['disclaimer_title']}:
{t['disclaimer_body']}
"""

    return subject, html_content, text_content


def build_test_email_content(recipient_email: str, language: str = "en") -> Tuple[str, str, str]:
    """Generates SMTP verification test email contents."""
    t = get_translation_dict(language)
    subject = t["test_subject"]
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")

    html = f"""<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background-color: #0f172a; color: #f8fafc; padding: 24px;">
  <div style="max-width: 540px; margin: 0 auto; background: #1e293b; border-radius: 16px; padding: 28px; border: 1px solid #334155;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #38bdf8; margin: 0;">🩺 MediScan AI</h2>
      <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Outbound SMTP Mail Transport Verification</p>
    </div>
    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 16px; text-align: center;">
      <h3 style="color: #34d399; margin: 0 0 8px 0;">{t['test_body_heading']}</h3>
      <p style="color: #e2e8f0; font-size: 13px; margin: 0;">{t['test_body_text']}</p>
    </div>
    <div style="margin-top: 20px; font-size: 12px; color: #94a3b8; line-height: 1.6;">
      <p style="margin: 4px 0;"><strong>Recipient:</strong> {recipient_email}</p>
      <p style="margin: 4px 0;"><strong>Timestamp:</strong> {timestamp}</p>
      <p style="margin: 4px 0;"><strong>Host:</strong> {settings.MAIL_HOST or 'Development Safe Logger'}</p>
      <p style="margin: 4px 0;"><strong>Port:</strong> {settings.MAIL_PORT}</p>
      <p style="margin: 4px 0;"><strong>Encryption:</strong> {settings.MAIL_ENCRYPTION.upper()}</p>
    </div>
  </div>
</body>
</html>"""

    text = f"""
MediScan AI - Outbound SMTP Mail Transport Verification
==================================================
{t['test_body_heading']}
{t['test_body_text']}

Recipient: {recipient_email}
Timestamp: {timestamp}
Host: {settings.MAIL_HOST or 'Development Safe Logger'}
Port: {settings.MAIL_PORT}
Encryption: {settings.MAIL_ENCRYPTION.upper()}
"""

    return subject, html, text


# ============================================================
# DISPATCH ENGINE (SMTP + SAFE DEV LOGGER)
# ============================================================

class EmailService:
    @staticmethod
    def _log_to_dev_file(
        dispatch_id: str,
        recipient_email: str,
        subject: str,
        html_content: str,
        text_content: str,
        metadata: Dict[str, Any],
    ) -> None:
        """Saves simulated dispatch to local disk log when SMTP is unconfigured."""
        entry = {
            "dispatch_id": dispatch_id,
            "timestamp": datetime.utcnow().isoformat(),
            "recipient_email": recipient_email,
            "subject": subject,
            "from": f"{settings.MAIL_FROM_NAME} <{settings.MAIL_FROM_ADDRESS}>",
            "metadata": metadata,
            "html_snippet": html_content[:300] + "...",
            "text_preview": text_content.strip()[:300] + "...",
        }
        try:
            with open(EMAIL_LOG_FILE, "a", encoding="utf-8") as f:
                f.write(json.dumps(entry, ensure_ascii=False) + "\n")
        except Exception as e:
            logger.warning(f"Could not write to email log file: {e}")

    @classmethod
    def send_raw_email(
        cls,
        recipient_email: str,
        subject: str,
        html_content: str,
        text_content: str,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """
        Sends an email via SMTP or writes to safe dev log if credentials are unset.
        Returns a dict describing the dispatch outcome.
        """
        if not EMAIL_REGEX.match(recipient_email.strip()):
            raise ValueError(f"Invalid recipient email address: '{recipient_email}'")

        dispatch_id = f"EML-{int(datetime.utcnow().timestamp())}-{recipient_email[:3]}"
        metadata = metadata or {}

        # 1. Check if SMTP is configured
        if not settings.is_smtp_configured():
            logger.info(
                f"[DEV MODE] SMTP not configured. Writing dispatch {dispatch_id} to {EMAIL_LOG_FILE}"
            )
            cls._log_to_dev_file(
                dispatch_id=dispatch_id,
                recipient_email=recipient_email,
                subject=subject,
                html_content=html_content,
                text_content=text_content,
                metadata=metadata,
            )
            return {
                "success": True,
                "dispatch_id": dispatch_id,
                "mode": "development_logged",
                "recipient": recipient_email,
                "timestamp": datetime.utcnow().isoformat(),
                "note": (
                    "SMTP is not configured in .env. The email was validated, rendered, "
                    f"and recorded in {EMAIL_LOG_FILE}. To deliver to a real inbox, configure "
                    "MAIL_HOST, MAIL_PORT, MAIL_USERNAME, and MAIL_PASSWORD in apps/api/.env."
                ),
            }

        # 2. Prepare MIME message
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = formataddr((settings.MAIL_FROM_NAME, settings.MAIL_FROM_ADDRESS))
        msg["To"] = recipient_email
        msg["Date"] = formatdate(localtime=True)
        msg["Message-ID"] = make_msgid(domain="mediscan.ai")
        if settings.MAIL_REPLY_TO:
            msg["Reply-To"] = settings.MAIL_REPLY_TO

        # Attach text part then HTML part (HTML takes precedence in capable clients)
        part1 = MIMEText(text_content, "plain", "utf-8")
        part2 = MIMEText(html_content, "html", "utf-8")
        msg.attach(part1)
        msg.attach(part2)

        # 3. Connect & Send via SMTP
        try:
            encryption = settings.MAIL_ENCRYPTION.lower()
            if encryption == "ssl" or settings.MAIL_PORT == 465:
                context = ssl.create_default_context()
                with smtplib.SMTP_SSL(
                    settings.MAIL_HOST,
                    settings.MAIL_PORT,
                    context=context,
                    timeout=settings.MAIL_TIMEOUT_SECONDS,
                ) as server:
                    server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
                    server.send_message(msg)
            else:
                # STARTTLS (port 587, 25, or custom)
                with smtplib.SMTP(
                    settings.MAIL_HOST,
                    settings.MAIL_PORT,
                    timeout=settings.MAIL_TIMEOUT_SECONDS,
                ) as server:
                    server.ehlo()
                    if encryption == "tls" or server.has_extn("STARTTLS"):
                        context = ssl.create_default_context()
                        server.starttls(context=context)
                        server.ehlo()
                    if settings.MAIL_USERNAME and settings.MAIL_PASSWORD:
                        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
                    server.send_message(msg)

            logger.info(f"Email {dispatch_id} sent successfully via SMTP to {recipient_email}")
            return {
                "success": True,
                "dispatch_id": dispatch_id,
                "mode": "smtp",
                "recipient": recipient_email,
                "timestamp": datetime.utcnow().isoformat(),
                "note": f"Dispatched via outbound SMTP ({settings.MAIL_HOST}:{settings.MAIL_PORT}).",
            }

        except Exception as e:
            logger.error(f"Failed to dispatch email {dispatch_id} via SMTP: {e}", exc_info=True)
            # Raise a sanitized message without exposing credentials
            raise RuntimeError(f"SMTP delivery failed: {str(e)}")

    @classmethod
    def send_report_email(
        cls,
        report_dict: Dict[str, Any],
        recipient_email: str,
        recipient_name: Optional[str] = None,
        language: str = "en",
    ) -> Dict[str, Any]:
        """Renders report email and dispatches it."""
        rec_name = recipient_name or report_dict.get("patientName") or "Patient"
        subject, html, text = build_report_email_content(
            report_dict=report_dict,
            recipient_name=rec_name,
            language=language,
        )
        return cls.send_raw_email(
            recipient_email=recipient_email,
            subject=subject,
            html_content=html,
            text_content=text,
            metadata={
                "report_id": report_dict.get("id") or report_dict.get("report_id"),
                "language": language,
                "recipient_name": rec_name,
            },
        )

    @classmethod
    def send_test_email(
        cls,
        recipient_email: str,
        language: str = "en",
    ) -> Dict[str, Any]:
        """Dispatches an SMTP connectivity test email."""
        subject, html, text = build_test_email_content(
            recipient_email=recipient_email,
            language=language,
        )
        return cls.send_raw_email(
            recipient_email=recipient_email,
            subject=subject,
            html_content=html,
            text_content=text,
            metadata={"type": "smtp_test", "language": language},
        )
