"""
MediScan AI - Enterprise Healthcare API
FastAPI backend service for medical report OCR, biomarker extraction, and clinical analysis.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import analysis, ocr, chat

app = FastAPI(
    title="MediScan AI - Clinical Analysis API",
    description="Enterprise-Grade AI-Powered Medical Report Intelligence & Biomarker Diagnostics API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(ocr.router, prefix="/api/ocr", tags=["OCR Pipeline"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["Report Analysis"])
app.include_router(chat.router, prefix="/api/chat", tags=["AI Health Assistant"])

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "MediScan AI API",
        "version": "1.0.0",
        "supported_modalities": [
            "Complete Blood Count (CBC)",
            "Lipid Profile",
            "Diabetic / HbA1c",
            "Kidney Function Tests (KFT)",
            "Liver Function Tests (LFT)",
            "Thyroid Panel",
            "Vitamin & Mineral Panels",
            "Urinalysis",
            "Cardiac Biomarkers"
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
