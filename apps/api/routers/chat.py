"""
MediScan AI - Action-Based Clinical AI Assistant Router

Provides:
- Natural Language Intent Detection (ANALYZE_REPORT, EXPLAIN_REPORT, EMAIL_REPORT, etc.)
- Context-aware clinical educational Q&A (HbA1c, Lipids, CBC, KFT, LFT, Thyroid)
- Action Payload generation for the frontend execution engine
- Multilingual responses (English, Hindi, Gujarati)
- Mandatory non-diagnostic statutory clinical disclaimers
"""

import re
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any

router = APIRouter()


class ChatMessage(BaseModel):
    role: str  # user | assistant | system
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []
    report_context: Optional[str] = None
    language: Optional[str] = "en"  # en, hi, gu


class ChatResponse(BaseModel):
    reply: str
    intent: str
    action_payload: Optional[Dict[str, Any]] = None
    suggested_follow_ups: List[str]
    disclaimer: str


def classify_intent(message: str) -> str:
    msg = message.lower().strip()

    # 1. Email Report Intent
    if re.search(r"\b(email|mail|send)\b.*?\b(report|summary|result|analysis)\b|\b(send to my email|email my report|mail this)\b", msg):
        return "EMAIL_REPORT"

    # 2. Download Report / PDF Intent
    if re.search(r"\b(download|pdf|export|save)\b.*?\b(report|analysis|dossier|result|file)\b|\b(give me pdf|download my report)\b", msg):
        return "DOWNLOAD_REPORT"

    # 3. Compare Reports Intent
    if re.search(r"\b(compare|comparison|difference|delta|trend)\b.*?\b(report|reports|test|tests|result|previous)\b|\b(has my result changed)\b", msg):
        return "COMPARE_REPORTS"

    # 4. Explain Report Intent
    if re.search(r"\b(explain|what does|interpret|meaning|understand)\b.*?\b(report|result|scan|test|findings)\b|\b(explain my report|what does my report say)\b", msg):
        return "EXPLAIN_REPORT"

    # 5. Analyze / Scan Report Intent
    if re.search(r"\b(analyze|scan|check|evaluate|process|inspect|diagnose)\b.*?\b(report|scan|file|document|image|blood work)\b|\b(analyze this|check my report)\b", msg):
        return "ANALYZE_REPORT"

    # 6. View History Intent
    if re.search(r"\b(history|previous|all reports|past tests|my records)\b", msg):
        return "VIEW_HISTORY"

    # 7. Upload Report Intent
    if re.search(r"\b(upload|new report|add test|camera|scanner)\b", msg):
        return "UPLOAD_REPORT"

    # 8. Help / Capabilities Intent
    if re.search(r"\b(help|what can you do|features|commands|how to use)\b", msg):
        return "HELP"

    # 9. Biomarker or Medical Query
    if any(k in msg for k in ["hba1c", "glucose", "sugar", "diabetes", "cholesterol", "ldl", "hdl", "hemoglobin", "wbc", "platelets", "creatinine", "egfr", "kidney", "liver", "thyroid", "tsh", "anemia"]):
        return "ASK_ABOUT_BIOMARKER"

    return "GENERAL_CONVERSATION"


@router.post("/ask", response_model=ChatResponse)
async def ask_health_assistant(req: ChatRequest):
    msg = req.message.lower().strip()
    intent = classify_intent(req.message)
    lang = req.language or "en"
    action_payload: Optional[Dict[str, Any]] = None

    if intent == "ANALYZE_REPORT":
        action_payload = {
            "action": "START_ANALYSIS",
            "requires_auth": True,
            "target_route": "/analysis"
        }
        if lang == "hi":
            reply = "जरूर, मैं आपकी नवीनतम मेडिकल रिपोर्ट को वैलिडेट करके उसका AI बायोमार्कर विश्लेषण शुरू कर रहा हूँ।"
        elif lang == "gu":
            reply = "ચોક્કસ, હું તમારા તાજેતરના મેડિકલ રિપોર્ટની ચકાસણી કરીને તેનું AI વિશ્લેષણ શરૂ કરી રહ્યો છું."
        else:
            reply = "I found your latest medical report. I am validating the file integrity and starting the clinical AI biomarker analysis now."

    elif intent == "EXPLAIN_REPORT":
        action_payload = {
            "action": "EXPLAIN_REPORT",
            "requires_auth": True,
            "target_route": "/analysis"
        }
        if lang == "hi":
            reply = "मैं आपकी विश्लेषित रिपोर्ट के मुख्य बायोमार्कर, जोखिम स्कोर और डॉक्टर से पूछने योग्य प्रश्नों को सरल भाषा में समझा रहा हूँ।"
        elif lang == "gu":
            reply = "હું તમારા રિપોર્ટના મહત્વપૂર્ણ પરિણામો અને ડૉક્ટરને પૂછવા યોગ્ય પ્રશ્નો સરળ ભાષામાં સમજાવી રહ્યો છું."
        else:
            reply = "Here is a patient-friendly breakdown of your clinical findings, out-of-range biomarkers, and tailored questions for your attending physician."

    elif intent == "COMPARE_REPORTS":
        action_payload = {
            "action": "COMPARE_REPORTS",
            "requires_auth": True,
            "target_route": "/compare"
        }
        reply = "I am comparing your historical test results against your baseline test to evaluate percentage changes and clinical trajectories."

    elif intent == "EMAIL_REPORT":
        action_payload = {
            "action": "CONFIRM_EMAIL_DISPATCH",
            "requires_auth": True,
            "requires_confirmation": True
        }
        reply = "I located your completed clinical report dossier. Would you like me to send the full medical summary to your registered email address?"

    elif intent == "DOWNLOAD_REPORT":
        action_payload = {
            "action": "TRIGGER_PDF_DOWNLOAD",
            "requires_auth": True
        }
        reply = "I am generating your official MediScan AI clinical dossier with reference ranges and disclaimers for instant download."

    elif intent == "VIEW_HISTORY":
        action_payload = {
            "action": "NAVIGATE",
            "target_route": "/dashboard"
        }
        reply = "Here is your personal longitudinal medical test history and recorded biomarker trend timeline."

    elif intent == "UPLOAD_REPORT":
        action_payload = {
            "action": "NAVIGATE",
            "target_route": "/upload"
        }
        reply = "You can upload a lab PDF, image, or use our AI camera scanner to ingest a new medical report."

    elif intent == "HELP":
        reply = (
            "I am the Action-Based AI Assistant for MediScan AI. You can ask me to:\n"
            "• **'Analyze my report'** - Start real AI biomarker extraction\n"
            "• **'Explain my report'** - Break down abnormal values in simple words\n"
            "• **'Compare my reports'** - See timeline deltas between multiple tests\n"
            "• **'Download my report'** - Generate an official PDF dossier\n"
            "• **'Send my report to my email'** - Dispatch a secure summary to your inbox\n"
            "• **Medical Q&A** - Ask educational questions about HbA1c, LDL, CBC, etc."
        )

    elif intent == "ASK_ABOUT_BIOMARKER":
        if "hba1c" in msg or "sugar" in msg or "diabetes" in msg:
            if lang == "hi":
                reply = "HbA1c पिछले 2-3 महीनों के औसत ब्लड शुगर को मापता है (सामान्य: <5.7%)। 7.6% का मान रक्त शर्करा वृद्धि दर्शाता है, जिसे संतुलित आहार और चिकित्सक की सलाह से नियंत्रित किया जा सकता है।"
            elif lang == "gu":
                reply = "HbA1c છેલ્લા ૨-૩ મહિનાના સરેરાશ બ્લડ સુગરનું માપ દર્શાવે છે (સામાન્ય: <૫.૭%)। ૭.૬% પ્રમાણ ડૉક્ટરની સલાહ મુજબ આહાર અને વ્યાયામથી નિયંત્રિત કરી શકાય છે."
            else:
                reply = "HbA1c measures glycated hemoglobin over the past 90 days (Normal: < 5.7%). A level of 7.6% indicates elevated glycemic burden consistent with diabetes, typically managed through balanced carbohydrates, daily walking, and physician-prescribed protocols."
        elif "cholesterol" in msg or "ldl" in msg or "lipid" in msg:
            reply = "LDL ('bad cholesterol') carries cholesterol to tissues. Levels above 100 mg/dL can contribute to vascular plaque over time. Reducing saturated fats, adding soluble fiber, and regular cardio are standard clinical recommendations."
        elif "hemoglobin" in msg or "anemia" in msg:
            reply = "Hemoglobin delivers oxygen throughout the body (standard range: 13.5-17.5 g/dL for men, 12.0-15.5 g/dL for women). Mild anemia can cause fatigue and is usually investigated with iron and ferritin panels."
        elif "creatinine" in msg or "egfr" in msg or "kidney" in msg:
            reply = "Creatinine is a waste product filtered by the kidneys. Mild elevation or eGFR reduction indicates filtration strain. Adequate hydration and avoiding chronic NSAID painkillers helps preserve nephrons."
        else:
            reply = f"Based on clinical reference standards, '{req.message}' plays a vital role in systemic homeostasis. Always evaluate findings with your primary physician."

    else:
        reply = (
            "Hello! I am your MediScan AI Action-Based Clinical Assistant. "
            "You can ask me medical questions or command me to analyze, explain, compare, download, or email your medical reports."
        )

    return ChatResponse(
        reply=reply,
        intent=intent,
        action_payload=action_payload,
        suggested_follow_ups=[
            "Analyze my latest report",
            "Explain my report in simple terms",
            "Download my report PDF",
            "Send my report to my email",
            "Compare my reports"
        ],
        disclaimer="MediScan AI provides informational analysis and does not replace professional clinical diagnosis, treatment, or advice from a licensed physician."
    )
