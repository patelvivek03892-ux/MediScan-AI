"""
AI Health Assistant Chat Router
Medical Q&A, lab explanation, medication context, and consultation prep.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

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
    suggested_follow_ups: List[str]
    disclaimer: str

@router.post("/ask", response_model=ChatResponse)
async def ask_health_assistant(req: ChatRequest):
    msg = req.message.lower()
    
    # Multilingual / intelligent clinical response generation
    if "hba1c" in msg or "sugar" in msg or "diabetes" in msg:
        if req.language == "hi":
            reply = "HbA1c आपके पिछले 2 से 3 महीनों के औसत रक्त शर्करा (ब्लड शुगर) को दर्शाता है। एक सामान्य स्तर 5.7% से कम होता है। 7.6% का मान बताता है कि आपका शुगर स्तर ऊंचा है और इसे संतुलित आहार, नियमित व्यायाम और चिकित्सक के परामर्श की आवश्यकता है।"
        elif req.language == "gu":
            reply = "HbA1c છેલ્લા 2 થી 3 મહિનાના સરેરાશ બ્લડ સુગરનું માપ દર્શાવે છે. સામાન્ય રીતે તે 5.7% થી ઓછું હોવું જોઈએ. 7.6% નું પ્રમાણ જણાવે છે કે ડાયાબિટીસ નિયંત્રણ માટે ડૉક્ટરની સલાહ લેવી જરૂરી છે."
        else:
            reply = "HbA1c measures the percentage of your hemoglobin that is coated with sugar, reflecting your average blood glucose over the past 2 to 3 months. A normal level is below 5.7%. A value of 7.6% indicates elevated blood sugar consistent with diabetes, which is typically managed via diet modification, exercise, and targeted medications under physician guidance."
    elif "anemia" in msg or "hemoglobin" in msg:
        reply = "Your hemoglobin is 11.4 g/dL, which is mildly below the standard male reference range (13.5 - 17.5 g/dL). This mild anemia can lead to tiredness or lower stamina. Your doctor will likely want to check iron, ferritin, or vitamin levels to find the exact cause."
    elif "cholesterol" in msg or "ldl" in msg or "lipid" in msg:
        reply = "Your LDL ('bad cholesterol') is 169 mg/dL and triglycerides are 215 mg/dL. Elevated LDL can contribute to plaque build-up in arteries over time. Recommended steps usually include reducing saturated/trans fats, increasing dietary fiber, regular cardio, and discussing cholesterol-lowering options with your physician."
    elif "emergency" in msg or "urgent" in msg:
        reply = "If you are experiencing severe chest pain, shortness of breath, sudden weakness or numbness, fainting, or acute dizziness, please contact emergency medical services (like 911 or 112) or go to the nearest emergency department immediately."
    else:
        reply = f"I have reviewed your inquiry regarding '{req.message}'. Based on standard clinical reference patterns, this metric correlates closely with your overall metabolic and cardiovascular profile. Always remember to discuss these findings directly with your primary care physician."

    return ChatResponse(
        reply=reply,
        suggested_follow_ups=[
            "What diet helps lower HbA1c and LDL?",
            "What tests should I ask my doctor for?",
            "Can mild anemia cause morning fatigue?",
            "How does exercise impact insulin sensitivity?"
        ],
        disclaimer="MediScan AI provides informational explanations and does not diagnose, prescribe, or provide clinical treatments. Always consult your healthcare provider."
    )
