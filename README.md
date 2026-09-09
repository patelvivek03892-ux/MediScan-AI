# 🩺 MediScan AI — Enterprise-Grade Open-Source Healthcare Report Analyzer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688.svg)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed)](https://www.docker.com/)

**MediScan AI** is an enterprise-grade, open-source clinical diagnostic report analyzer and healthcare intelligence platform. Designed for hospitals, laboratories, clinicians, and patients, it combines an ultra-modern cinematic UI (3D DNA helix, real-time ECG canvas, aurora mesh gradients) with browser-based smart camera scanning, multi-engine OCR, deep biomarker extraction, emergency triage detection, interactive health analytics, conversational AI assistance, and educational mini-games.

---

## 🌟 Key Features

### 🎨 1. Premium Medical UI / UX
- **3D DNA Double Helix Visualizer**: Interactive canvas-based rotating genomic helix with mouse tracking.
- **Real-Time ECG Heartbeat Wave**: Dynamic canvas P-Q-R-S-T wave pulse with systolic peaks.
- **Glassmorphism & Mesh Gradients**: Frosted glass panels, dynamic glowing cursor, and medical particles (RBCs, WBCs, molecules).
- **Multilingual Support**: Real-time localization across **English**, **Hindi (हिन्दी)**, and **Gujarati (ગુજરાતી)**.

### 📷 2. Smart AI Camera Scanner
- Native browser **MediaDevices API** integration with automatic rear camera selection on mobile devices.
- Live video stream with real-time **boundary edge detection**, alignment guidelines, and laser sweep animations.
- **Auto-Image Enhancement**: Dynamic contrast optimization, brightness normalization, and sharpening.
- **Batch Multi-Page Scanning**: Queue multiple report pages into a batch and compile into downloadable **PDFs** before AI extraction.
- Controls: Torch/flash toggle, zoom slider, rule-of-thirds grid overlay, and lens switching.

### 🔍 3. Advanced OCR & Ingestion Pipeline
- Supports **PDF**, multi-page PDF, **JPG**, **PNG**, **WEBP**, **HEIC**, and **ZIP** report packages.
- Cloud storage integration presets (Google Drive, Dropbox, OneDrive, Apple Files).
- Pre-processing: Deskewing, shadow removal, noise reduction, and table structure detection.
- Fast multi-engine consensus extraction (Surya OCR, PaddleOCR, DocTR) with editable extracted text and confidence metrics.

### 🧠 4. 60+ Clinical Biomarkers Analyzed
- **Complete Blood Count (CBC)**: Hemoglobin, RBC, WBC, Platelets, Hematocrit, MCV, MCH, MCHC, RDW, Neutrophils, Lymphocytes.
- **Lipid Profile**: Total Cholesterol, HDL, LDL, VLDL, Triglycerides, Total/HDL ratio.
- **Diabetic & Metabolic**: Fasting Blood Sugar, Postprandial, HbA1c, Average Blood Glucose.
- **Kidney Function (KFT)**: Serum Creatinine, Blood Urea Nitrogen (BUN), eGFR, Uric Acid, Electrolytes.
- **Liver Function (LFT)**: ALT (SGPT), AST (SGOT), Alkaline Phosphatase, Bilirubin, Albumin.
- **Thyroid Axis**: TSH, Total T3, Total T4, Free T3, Free T4.
- **Vitamins & Minerals**: Vitamin D3, Vitamin B12, Iron, Ferritin, Calcium, Magnesium.
- **Cardiac & Urinalysis**: Cardiac Troponin I, D-Dimer, Urine Protein, pH, Ketones.

### 🚨 5. Emergency Detection System
- Immediate triage detection for life-threatening laboratory values (e.g. Troponin > 0.04 ng/mL, Platelets < 20,000 /µL, Potassium > 6.0 mmol/L).
- High-visibility pulsating red alert banner with synthesized hospital chime audio notification and immediate emergency call routing.

### 📈 6. Interactive Health Charts & AI Analytics
- Recharts visualizations: Multi-point historical area trends, 6-axis organ health radar, radial health score gauge.
- Longitudinal comparison engine calculating biomarker delta shifts and percentage improvements.
- AI predictive trends and lifestyle improvement forecasts.
- One-click **PDF Clinical Report Export** using `jsPDF`.

### 🎮 7. "Health Fun" Educational Mini-Games
Floating non-intrusive interactive launcher with 4 games:
1. 🦠 **Virus Hunter**: Tap and neutralize invading pathogens while sparing friendly leukocytes.
2. 💊 **Pill Sort Challenge**: Speed test sorting prescription capsules into morning or night dosage slots.
3. 🧬 **DNA Base Matcher**: Pair Adenine-Thymine and Cytosine-Guanine base pairs.
4. 🫀 **Heartbeat Rhythm**: Synchronize taps with 60 BPM systolic ECG contractions.
- Features confetti particle animations and clinical trivia facts after each level.

### 💬 8. AI Health Assistant
- Conversational medical Q&A for explaining lab results, normal ranges, and clinical terminology.
- Integrated **Speech-to-Text (Voice Input)** and **Text-to-Speech (Audio Playback)** via Web Speech API.
- Generates curated questions for patients to ask their attending physician.

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0+ (v24 tested)
- **npm**: v9.0+
- **Python**: 3.10+ (for FastAPI backend)
- **Docker & Docker Compose** (Optional for container deployment)

### 1. Launch Frontend (Next.js 15)
```bash
cd apps/web
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Launch Backend (FastAPI Python)
```bash
cd apps/api
pip install -r requirements.txt
python main.py
```
Open API Swagger Documentation at **[http://localhost:8000/docs](http://localhost:8000/docs)**.

### 3. Deploy with Docker Compose
```bash
docker-compose up --build
```
This orchestrates:
- Next.js Web App on port `3000`
- FastAPI Backend on port `8000`
- Redis Cache on port `6379`
- PostgreSQL on port `5432`

---

## 📁 Repository Structure

```
mediscan-ai/
├── apps/
│   ├── web/                              # Next.js 15 App Router Frontend
│   │   ├── src/
│   │   │   ├── app/                      # Routes: /, /scanner, /upload, /analysis, /dashboard, /compare, /chat, /admin, /about, /faq, /terms, /privacy
│   │   │   ├── components/
│   │   │   │   ├── 3d/                   # 3D DNA Helix & Medical Particle canvases
│   │   │   │   ├── scanner/              # CameraScanner with live edge overlay
│   │   │   │   ├── analysis/             # EmergencyBanner, BiomarkerTable, HealthScoreGauge, ActionPlanCard
│   │   │   │   ├── charts/               # BiomarkerTrendChart, OrganHealthRadar
│   │   │   │   ├── games/                # HealthGamesModal, VirusHunter, PillSort, DNA Matcher
│   │   │   │   └── layout/               # Navbar, Footer, CustomCursor, EcgLine
│   │   │   ├── lib/                      # Translations (EN/HI/GU), sampleData, reportAnalyzer, pdfExport
│   │   │   └── types/                    # TypeScript medical interfaces
│   └── api/                              # Python FastAPI Backend
│       ├── main.py                       # Application entrypoint & CORS
│       ├── routers/                      # ocr.py, analysis.py, chat.py
│       ├── requirements.txt              # Backend dependencies
│       └── Dockerfile                    # Container configuration
├── docker-compose.yml                    # Multi-container service definitions
└── README.md
```

---

## ⚖️ Statutory Medical Disclaimer
> **IMPORTANT**: This AI-generated analysis is for informational and educational purposes only and is not a substitute for diagnosis, treatment, or clinical advice from a qualified healthcare professional. Always consult a physician regarding medical conditions or before changing medications.

---

## 📜 License
Released under the permissive **[MIT License](LICENSE)**. Open source and free for research, hospital networks, and community development.
