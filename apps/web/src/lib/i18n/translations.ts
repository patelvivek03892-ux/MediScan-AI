export type Language = 'en' | 'hi' | 'gu';

export interface TranslationSchema {
  common: {
    loading: string;
    error: string;
    success: string;
    close: string;
    cancel: string;
    save: string;
    download: string;
    back: string;
    next: string;
    retry: string;
    or: string;
    all: string;
    view: string;
    delete: string;
    search: string;
    filter: string;
    status: string;
    date: string;
    actions: string;
    confirm: string;
    moderate: string;
    critical: string;
    optimal: string;
    improved: string;
    worsened: string;
    stable: string;
  };
  nav: {
    brand: string;
    tagline: string;
    home: string;
    scanner: string;
    upload: string;
    analysis: string;
    dashboard: string;
    compare: string;
    chat: string;
    admin: string;
    games: string;
    login: string;
    signup: string;
    logout: string;
    welcome: string;
    patientPortal: string;
    selectLanguage: string;
    collapseSidebar: string;
    expandSidebar: string;
    systemOperational: string;
    quickActions: string;
    helpFaq: string;
    aboutMethodology: string;
    notifications: string;
  };
  hero: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    titleSuffix: string;
    subtitle: string;
    ecgTelemetry: string;
    ecgNormal: string;
    ctaScan: string;
    ctaUpload: string;
    instantDemos: string;
    sampleMetabolic: string;
    sampleCardiac: string;
    sampleWellness: string;
    statAccuracy: string;
    statBiomarkers: string;
    statSpeed: string;
    hologramTitle: string;
    hologramBadge: string;
    coreTitle: string;
    coreOnline: string;
    coreDesc: string;
    featureHeadingBadge: string;
    featureHeadingTitle: string;
    featureHeadingSubtitle: string;
    featureScannerTitle: string;
    featureScannerDesc: string;
    featureScannerLink: string;
    featureEmergencyTitle: string;
    featureEmergencyDesc: string;
    featureEmergencyLink: string;
    featureMultiTenantTitle: string;
    featureMultiTenantDesc: string;
    featureMultiTenantLink: string;
    featureBiomarkersTitle: string;
    featureBiomarkersDesc: string;
    featureBiomarkersLink: string;
    featureAssistantTitle: string;
    featureAssistantDesc: string;
    featureAssistantLink: string;
    featureDossierTitle: string;
    featureDossierDesc: string;
    featureDossierLink: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    signupTitle: string;
    signupSubtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    signInBtn: string;
    signUpBtn: string;
    signingIn: string;
    signingUp: string;
    noAccount: string;
    haveAccount: string;
    quickLoginNotice: string;
    patientDemo: string;
    adminDemo: string;
    securityNote: string;
    authRequired: string;
    authRequiredDesc: string;
    enterEmailPassword: string;
    enterAllFields: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    activeScope: string;
    viewingAs: string;
    patientRole: string;
    totalReports: string;
    abnormalBiomarkers: string;
    averageHealthScore: string;
    systemAlerts: string;
    biomarkerTrends: string;
    biomarkerTrendsDesc: string;
    noTrendData: string;
    noTrendDataDesc: string;
    temporalProgression: string;
    historicalTrendFor: string;
    referenceInterval: string;
    baseline: string;
    currentValue: string;
    organHealthOverview: string;
    organHealthDesc: string;
    recentReports: string;
    noReports: string;
    noReportsDesc: string;
    seedDemo: string;
    uploadNew: string;
    scanCamera: string;
    viewFullAnalysis: string;
    allCategories: string;
    dateAnalyzed: string;
    overallScore: string;
    riskCategory: string;
    openReport: string;
    cardiacHealth: string;
    metabolicHealth: string;
    renalHealth: string;
    hepaticHealth: string;
    hematologicHealth: string;
    immuneHealth: string;
  };
  upload: {
    title: string;
    subtitle: string;
    tabUpload: string;
    tabPaste: string;
    dragDropText: string;
    supportedFormats: string;
    orUseSample: string;
    sampleMetabolic: string;
    sampleCardiac: string;
    sampleNormal: string;
    pastePlaceholder: string;
    analyzePastedBtn: string;
    guidelinesTitle: string;
    guide1: string;
    guide2: string;
    guide3: string;
    processingTitle: string;
    ocrStep: string;
  };
  scanner: {
    title: string;
    subtitle: string;
    alignGuide: string;
    startCamera: string;
    stopCamera: string;
    capturePage: string;
    switchCamera: string;
    torchOn: string;
    torchOff: string;
    gridOn: string;
    gridOff: string;
    zoom: string;
    autoEnhance: string;
    pagesCaptured: string;
    exportPdf: string;
    analyzeNow: string;
    clearPages: string;
    confidence: string;
    cameraAccessRequired: string;
    analyzing: string;
  };
  analysis: {
    title: string;
    backToDashboard: string;
    emailReport: string;
    downloadPdf: string;
    patientInfo: string;
    patientName: string;
    ageGender: string;
    reportId: string;
    date: string;
    laboratory: string;
    orderingPhysician: string;
    overallHealthScore: string;
    riskAssessment: string;
    executiveSummary: string;
    biomarkersTitle: string;
    biomarkersSubtitle: string;
    organMatrixTitle: string;
    actionPlanTitle: string;
    actionPlanSubtitle: string;
    dietaryGuidance: string;
    exerciseProtocol: string;
    sleepHydration: string;
    followUpTests: string;
    questionsForDoctor: string;
    rawOcrInspector: string;
    edit: string;
    reanalyze: string;
    disclaimer: string;
    emergencyBannerTitle: string;
    emergencyBannerText: string;
    bmColName: string;
    bmColValue: string;
    bmColRange: string;
    bmColSignificance: string;
    bmColStatus: string;
  };
  compare: {
    title: string;
    subtitle: string;
    baseline: string;
    current: string;
    delta: string;
    trajectory: string;
    summary: string;
    summaryText: string;
    colBiomarker: string;
    colCategory: string;
    colBaseline: string;
    colCurrent: string;
    colDelta: string;
    colStatus: string;
    colNotes: string;
    compareNotice: string;
  };
  chat: {
    title: string;
    subtitle: string;
    welcomeText: string;
    actionAnalyze: string;
    actionExplain: string;
    actionDownload: string;
    actionEmail: string;
    actionCompare: string;
    inputPlaceholder: string;
    listening: string;
    speak: string;
    send: string;
    badgeAssistant: string;
    speechToggle: string;
    analyzingReport: string;
    generatingDossier: string;
    emailSentSuccess: string;
    emailConfirmTitle: string;
    btnConfirmSend: string;
  };
  admin: {
    title: string;
    subtitle: string;
    tabUsers: string;
    tabEmails: string;
    tabAudit: string;
    totalUsers: string;
    totalEmails: string;
    complianceScore: string;
    activeSessions: string;
    userSearchPlaceholder: string;
    filterAllRoles: string;
    name: string;
    role: string;
    statusCol: string;
    reportsCol: string;
    joinedCol: string;
    viewEmail: string;
    recipient: string;
    subject: string;
    sentAt: string;
    statusDelivered: string;
    auditComplianceTrail: string;
    auditEvent: string;
    auditTimestamp: string;
    auditActor: string;
    auditStatus: string;
  };
  footer: {
    brandDesc: string;
    hipaa: string;
    encryption: string;
    clinicalTools: string;
    aiScanner: string;
    uploadLab: string;
    biomarkerAnalysis: string;
    healthTrend: string;
    compareTests: string;
    aiIntelligence: string;
    assistant: string;
    auditCompliance: string;
    validation: string;
    faq: string;
    legal: string;
    privacy: string;
    terms: string;
    disclaimerTitle: string;
    securityCommitment: string;
    copyright: string;
  };
  games: {
    button: string;
    title: string;
    subtitle: string;
    virusHunter: string;
    pillSort: string;
    dnaMatcher: string;
    heartbeatRhythm: string;
  };
  about: {
    badge: string;
    title: string;
    subtitle: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    creditsTitle: string;
    creditsDesc: string;
  };
  faq: {
    badge: string;
    title: string;
    subtitle: string;
    q1: string;
    a1: string;
    q2: string;
    a2: string;
    q3: string;
    a3: string;
    q4: string;
    a4: string;
    q5: string;
    a5: string;
  };
  privacy: {
    title: string;
    lastUpdated: string;
    s1Title: string;
    s1Desc: string;
    s2Title: string;
    s2Desc: string;
    s3Title: string;
    s3Desc: string;
  };
  terms: {
    title: string;
    lastUpdated: string;
    noticeTitle: string;
    noticeDesc: string;
    s1Title: string;
    s1Desc: string;
    s2Title: string;
    s2Desc: string;
    s3Title: string;
    s3Desc: string;
  };
  ai: {
    title: string;
    answer: string;
    actionAnalyzing: string;
    actionCompleted: string;
    actionDownloadSuccess: string;
    actionEmailConfirmPrompt: string;
    actionEmailDispatched: string;
    actionCompareNotice: string;
    suggestionsTitle: string;
    suggestionsSubtitle: string;
    nutritionTitle: string;
    lifestyleTitle: string;
    monitoringTitle: string;
    followUpTitle: string;
    conditionsTitle: string;
    conditionsSubtitle: string;
    conditionHeader: string;
    supportingFinding: string;
    observedValue: string;
    refRange: string;
    noRefRange: string;
    explanation: string;
    nextStep: string;
    severityNote: string;
    keyFindingsTitle: string;
    keyFindingsSubtitle: string;
    statusWithin: string;
    statusBelow: string;
    statusAbove: string;
    statusCritical: string;
    clarificationPrompt: string;
    clarificationOptionAnalyze: string;
    clarificationOptionExplain: string;
    greetingReply: string;
    generalConversationReply: string;
    noReportContextFound: string;
    disclaimer: string;
    errorAnalysisFailed: string;
  };
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      close: "Close",
      cancel: "Cancel",
      save: "Save",
      download: "Download",
      back: "Back",
      next: "Next",
      retry: "Retry",
      or: "Or",
      all: "All",
      view: "View",
      delete: "Delete",
      search: "Search...",
      filter: "Filter",
      status: "Status",
      date: "Date",
      actions: "Actions",
      confirm: "Confirm",
      moderate: "Moderate",
      critical: "Critical",
      optimal: "Optimal",
      improved: "Improved",
      worsened: "Worsened",
      stable: "Stable"
    },
    nav: {
      brand: "MediScan AI",
      tagline: "Clinical Intelligence",
      home: "Home",
      scanner: "Camera Scanner",
      upload: "Upload Report",
      analysis: "AI Analysis",
      dashboard: "Analytics & Trends",
      compare: "Compare Reports",
      chat: "AI Assistant",
      admin: "Admin & Compliance",
      games: "Health Fun",
      login: "Sign In",
      signup: "Create Account",
      logout: "Log Out",
      welcome: "Welcome",
      patientPortal: "Patient Portal",
      selectLanguage: "Language",
      collapseSidebar: "Collapse Sidebar",
      expandSidebar: "Expand Sidebar",
      systemOperational: "System Operational",
      quickActions: "Quick Actions",
      helpFaq: "Help & FAQ",
      aboutMethodology: "Clinical Methodology",
      notifications: "Notifications"
    },
    hero: {
      badge: "Next-Gen AI Healthcare Intelligence",
      titlePrefix: "Decipher Complex",
      titleHighlight: "Medical Reports",
      titleSuffix: "with Clinical AI",
      subtitle: "Enterprise-grade document AI, real-time camera scanning, clinical biomarker interpretation, and proactive health risk detection.",
      ecgTelemetry: "REAL-TIME ECG RHYTHM TELEMETRY",
      ecgNormal: "Normal Sinus: 72 BPM",
      ctaScan: "Launch Camera Scanner",
      ctaUpload: "Upload Medical Report",
      instantDemos: "Instant Zero-Upload Clinical Demos:",
      sampleMetabolic: "Metabolic & Diabetic Panel",
      sampleCardiac: "Cardiac Emergency Panel",
      sampleWellness: "Executive Wellness Checkup",
      statAccuracy: "99.4% OCR Precision",
      statBiomarkers: "60+ Biomarkers Detected",
      statSpeed: "< 1.5s AI Analysis",
      hologramTitle: "3D GENOMIC HELIX VISUALIZER",
      hologramBadge: "INTERACTIVE CANVAS",
      coreTitle: "Biomarker Synthesis Core",
      coreOnline: "ONLINE",
      coreDesc: "Analyzing multi-axial relationships between HbA1c, LDL cholesterol, liver enzymes, and renal filtration indices in real time.",
      featureHeadingBadge: "Enterprise Clinical Architecture",
      featureHeadingTitle: "Engineered for Precision, Safety & Clinical Clarity",
      featureHeadingSubtitle: "A unified clinical intelligence suite designed for hospitals, diagnostic laboratories, physicians, and health-conscious individuals.",
      featureScannerTitle: "Smart AI Camera Scanner",
      featureScannerDesc: "Real-time browser MediaDevices camera access with boundary edge-detection, perspective auto-crop, deskew, noise reduction, and multi-page batch scanning.",
      featureScannerLink: "Explore Scanner",
      featureEmergencyTitle: "Critical Emergency Triage",
      featureEmergencyDesc: "Instant detection of life-threatening lab values (Troponin, severe thrombocytopenia, hyperkalemia) with high-visibility red pulse alerts and emergency routing.",
      featureEmergencyLink: "View Emergency Demo",
      featureMultiTenantTitle: "Multi-User Data Isolation",
      featureMultiTenantDesc: "Strict account-level sandboxing with JWT sessions ensuring individual patients only see their personal lab reports and trend analytics.",
      featureMultiTenantLink: "Open Dashboard",
      featureBiomarkersTitle: "60+ Biomarker Range Engine",
      featureBiomarkersDesc: "Broad spectrum extraction covering complete blood counts (CBC), comprehensive metabolic panels (CMP), lipid profiles, thyroid and renal markers.",
      featureBiomarkersLink: "Biomarker Matrix",
      featureAssistantTitle: "Action-Based AI Assistant",
      featureAssistantDesc: "Intelligent clinical conversational assistant that analyzes reports, explains biological mechanisms, compares timelines, and emails summaries.",
      featureAssistantLink: "Ask Assistant",
      featureDossierTitle: "Automated Clinical Dossiers",
      featureDossierDesc: "Instant client-side PDF document generation formatted with executive summaries, radar graphs, and doctor-ready consultation prompts.",
      featureDossierLink: "Sample Dossier"
    },
    auth: {
      loginTitle: "Welcome Back to Clinical Portal",
      loginSubtitle: "Sign in to access your reports, biomarker analytics, and health history.",
      signupTitle: "Create Your Patient Account",
      signupSubtitle: "Register to securely store, analyze, and track your medical lab reports over time.",
      emailLabel: "Email Address",
      emailPlaceholder: "patient@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "••••••••",
      nameLabel: "Full Name",
      namePlaceholder: "e.g. Rahul Verma",
      phoneLabel: "Phone Number (Optional)",
      phonePlaceholder: "+91 98765 43210",
      signInBtn: "Sign In to Portal",
      signUpBtn: "Create Account",
      signingIn: "Authenticating...",
      signingUp: "Creating Account...",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      quickLoginNotice: "Single-Click Demo Accounts:",
      patientDemo: "Demo Patient (Rahul Verma)",
      adminDemo: "Compliance Admin",
      securityNote: "Data Isolation Guaranteed: Your medical reports are encrypted and strictly isolated to your account.",
      authRequired: "Authentication Required",
      authRequiredDesc: "Please log in to perform this action and access your personal medical reports.",
      enterEmailPassword: "Please enter both email and password.",
      enterAllFields: "Please fill in all required fields."
    },
    dashboard: {
      title: "Patient Clinical Dashboard",
      subtitle: "Longitudinal Biomarker Telemetry & Trend Tracking",
      activeScope: "Active Tenant Scope: Isolated User Sandbox",
      viewingAs: "Viewing medical records for:",
      patientRole: "Patient",
      totalReports: "Total Reports Analyzed",
      abnormalBiomarkers: "Biomarkers Out of Range",
      averageHealthScore: "Aggregate Health Score",
      systemAlerts: "Active Clinical Alerts",
      biomarkerTrends: "Longitudinal Biomarker Trajectories",
      biomarkerTrendsDesc: "Interactive time-series progression of clinical lab values against normal reference bounds.",
      noTrendData: "No Historical Trend Data Available",
      noTrendDataDesc: "This report does not contain historical time-series data. Multi-test trend tracking becomes available when multiple lab tests are recorded over time.",
      temporalProgression: "Temporal Biomarker Progression",
      historicalTrendFor: "Historical Trend",
      referenceInterval: "Reference Interval",
      baseline: "Baseline",
      currentValue: "Current Value",
      organHealthOverview: "Multi-Organ System Health",
      organHealthDesc: "Real-time algorithmic assessment across major physiological systems.",
      recentReports: "Recent Diagnostic Reports",
      noReports: "No Diagnostic Reports Found Yet",
      noReportsDesc: "Upload your first blood test, lipid panel, or scan an existing paper report with your camera to begin your personal health timeline.",
      seedDemo: "Load Clinical Sample Report",
      uploadNew: "Upload New Report",
      scanCamera: "Scan with Camera",
      viewFullAnalysis: "View Detailed AI Analysis",
      allCategories: "All Categories",
      dateAnalyzed: "Analyzed On",
      overallScore: "Health Score",
      riskCategory: "Risk Level",
      openReport: "Open Report",
      cardiacHealth: "Cardiovascular",
      metabolicHealth: "Endocrine & Metabolic",
      renalHealth: "Renal Filtration",
      hepaticHealth: "Hepatic / Liver",
      hematologicHealth: "Hematology / Blood",
      immuneHealth: "Immune / Inflammation"
    },
    upload: {
      title: "Upload Medical Reports",
      subtitle: "Enterprise document AI extracts and validates 60+ biomarkers from PDFs, images, and camera scans.",
      tabUpload: "Upload Document",
      tabPaste: "Paste Raw Lab Values",
      dragDropText: "Drag and drop your medical report here, or click to browse",
      supportedFormats: "Supports PDF, JPG, PNG, WEBP up to 50MB",
      orUseSample: "Or test immediately with pre-loaded clinical scenarios:",
      sampleMetabolic: "Metabolic & Diabetic Panel (Moderate Risk)",
      sampleCardiac: "Cardiac Emergency Panel (Critical Alert)",
      sampleNormal: "Comprehensive Wellness Checkup (Normal/Optimal)",
      pastePlaceholder: "Paste your lab report text here (e.g. Hemoglobin: 13.5 g/dL, Fasting Glucose: 110 mg/dL, HbA1c: 6.2%, Total Cholesterol: 210 mg/dL)...",
      analyzePastedBtn: "Analyze Laboratory Values",
      guidelinesTitle: "For Best Recognition Accuracy:",
      guide1: "Ensure good lighting with minimal glare and shadows.",
      guide2: "Keep the document flat and camera aligned with paper borders.",
      guide3: "Both printed diagnostic lab reports and digital lab PDFs are supported.",
      processingTitle: "Processing Medical Document...",
      ocrStep: "Extracting report text with OCR neural model..."
    },
    scanner: {
      title: "Smart AI Camera Scanner",
      subtitle: "High-resolution multi-page document scanning with real-time edge detection, auto-crop, and deskew.",
      alignGuide: "Align document edges within the frame",
      startCamera: "Start Camera",
      stopCamera: "Stop Camera",
      capturePage: "Capture Page",
      switchCamera: "Switch Lens",
      torchOn: "Torch: ON",
      torchOff: "Torch: OFF",
      gridOn: "Grid: ON",
      gridOff: "Grid: OFF",
      zoom: "Zoom",
      autoEnhance: "Auto Enhance & Sharpen",
      pagesCaptured: "Pages Captured",
      exportPdf: "Export PDF",
      analyzeNow: "Analyze with AI",
      clearPages: "Clear All",
      confidence: "OCR Quality",
      cameraAccessRequired: "Camera Access Required. Please enable camera permissions in your browser.",
      analyzing: "Analyzing captured document with AI..."
    },
    analysis: {
      title: "AI Medical Intelligence Report",
      backToDashboard: "Back to Dashboard",
      emailReport: "Email Analysis",
      downloadPdf: "Download Official PDF",
      patientInfo: "Patient & Specimen Dossier",
      patientName: "Patient Name",
      ageGender: "Age / Gender",
      reportId: "Report Reference ID",
      date: "Collection Date",
      laboratory: "Diagnostic Laboratory",
      orderingPhysician: "Ordering Physician",
      overallHealthScore: "AI Clinical Health Score",
      riskAssessment: "Overall Risk Tier",
      executiveSummary: "Clinical Executive Summary",
      biomarkersTitle: "Biomarker Laboratory Profile",
      biomarkersSubtitle: "Real-time reference interval comparison and automated clinical status mapping.",
      organMatrixTitle: "Multi-Organ System Functional Index",
      actionPlanTitle: "Personalized Clinical Action & Lifestyle Protocol",
      actionPlanSubtitle: "AI-synthesized lifestyle modifications and curated physician discussion points.",
      dietaryGuidance: "Targeted Nutritional Guidance",
      exerciseProtocol: "Physical Activity & Conditioning",
      sleepHydration: "Sleep Hygiene & Hydration Protocol",
      followUpTests: "Recommended Follow-up Diagnostics",
      questionsForDoctor: "Discussion Points for Your Physician",
      rawOcrInspector: "View Extracted Raw Text (OCR Inspector)",
      edit: "Edit Text",
      reanalyze: "Re-analyze Report",
      disclaimer: "Medical Disclaimer: This AI-generated analysis is for informational purposes only and is not a substitute for diagnosis, treatment, or advice from a qualified healthcare professional.",
      emergencyBannerTitle: "CRITICAL MEDICAL ALERT: IMMEDIATE ATTENTION REQUIRED",
      emergencyBannerText: "Biomarker values detected outside safe clinical tolerances. Immediate medical consultation recommended.",
      bmColName: "Biomarker",
      bmColValue: "Measured Value",
      bmColRange: "Reference Range",
      bmColSignificance: "Clinical Significance",
      bmColStatus: "Status"
    },
    compare: {
      title: "Longitudinal Clinical Report Comparison",
      subtitle: "Multi-test delta analysis, biomarker trajectory mapping, and clinical trend tracking.",
      baseline: "Baseline Test",
      current: "Current Follow-up Test",
      delta: "Delta Change",
      trajectory: "Biomarker Trajectory",
      summary: "Comparative Trajectory Summary",
      summaryText: "Significant changes detected across glycemic and lipid parameters. Recommended follow-up in 90 days.",
      colBiomarker: "Biomarker",
      colCategory: "Category",
      colBaseline: "Baseline",
      colCurrent: "Current",
      colDelta: "Delta",
      colStatus: "Trajectory",
      colNotes: "Clinical Significance",
      compareNotice: "Showing comparison between your baseline diagnostic panel and most recent laboratory tests."
    },
    chat: {
      title: "MediScan AI Clinical Assistant",
      subtitle: "Action-based AI assistant for report analysis, lab value explanation, PDF exports, and email dispatches.",
      welcomeText: "Hello! I am your Action-Based Clinical AI Assistant for MediScan AI. I don't just answer questions — I can analyze your uploaded reports, explain complex biomarker findings, compare tests over time, download official PDF dossiers, and email summaries directly to your inbox. How can I assist you today?",
      actionAnalyze: "📊 Analyze My Report",
      actionExplain: "🩺 Explain My Results",
      actionDownload: "📥 Download PDF Report",
      actionEmail: "✉️ Send to My Email",
      actionCompare: "🔄 Compare Reports",
      inputPlaceholder: "Ask about lab results, ask to analyze your report, or request a PDF...",
      listening: "Listening (Speech Recognition)...",
      speak: "Speak",
      send: "Send",
      badgeAssistant: "Action-Engine: ONLINE",
      speechToggle: "Voice Output",
      analyzingReport: "Analyzing your medical report with clinical AI models...",
      generatingDossier: "Compiling official PDF clinical dossier...",
      emailSentSuccess: "Analysis successfully dispatched to your email address.",
      emailConfirmTitle: "Confirm Clinical Report Dispatch",
      btnConfirmSend: "Confirm & Send Email"
    },
    admin: {
      title: "Administrative & Compliance Portal",
      subtitle: "User directory, role management, email notification logs, and clinical audit trail.",
      tabUsers: "User Directory",
      tabEmails: "Email Notification Logs",
      tabAudit: "Compliance Audit Trail",
      totalUsers: "Registered Users",
      totalEmails: "Emails Dispatched",
      complianceScore: "HIPAA Compliance",
      activeSessions: "Active Sessions",
      userSearchPlaceholder: "Search by name, email, or role...",
      filterAllRoles: "All Roles",
      name: "User",
      role: "Role",
      statusCol: "Status",
      reportsCol: "Reports",
      joinedCol: "Joined",
      viewEmail: "View Email",
      recipient: "Recipient",
      subject: "Subject",
      sentAt: "Sent Time",
      statusDelivered: "Delivered",
      auditComplianceTrail: "Clinical Audit & Data Access Log",
      auditEvent: "Event",
      auditTimestamp: "Timestamp",
      auditActor: "Actor",
      auditStatus: "Verification"
    },
    footer: {
      brandDesc: "Enterprise-grade clinical AI platform for diagnostic medical report interpretation, instant camera scanning, OCR biomarker extraction, and emergency risk triage.",
      hipaa: "HIPAA Aligned",
      encryption: "AES-256 Zero-Knowledge",
      clinicalTools: "Clinical Tools",
      aiScanner: "AI Camera Scanner",
      uploadLab: "Upload Lab Reports",
      biomarkerAnalysis: "Biomarker Analysis",
      healthTrend: "Health Trend Charts",
      compareTests: "Compare Historical Tests",
      aiIntelligence: "AI Intelligence",
      assistant: "AI Health Assistant",
      auditCompliance: "Audit & Compliance",
      validation: "Clinical Validation",
      faq: "Healthcare FAQ",
      legal: "Legal & Trust",
      privacy: "Privacy Architecture",
      terms: "Terms of Service",
      disclaimerTitle: "Medical Disclaimer",
      securityCommitment: "Security Commitment",
      copyright: "MediScan AI. Precision Healthcare & Clinical Intelligence."
    },
    games: {
      button: "Health Fun",
      title: "MediScan Health Fun & Learning",
      subtitle: "Interactive micro-games to build medical knowledge while taking a healthy break.",
      virusHunter: "Virus Hunter",
      pillSort: "Pill Sort Challenge",
      dnaMatcher: "DNA Base Matcher",
      heartbeatRhythm: "Heartbeat Rhythm"
    },
    about: {
      badge: "Our Mission & Clinical Architecture",
      title: "Democratizing Medical Intelligence",
      subtitle: "MediScan AI is an open-source initiative designed to bridge the gap between complex diagnostic laboratory results and patient understanding.",
      card1Title: "Clinical Validation",
      card1Desc: "Biomarker thresholds and reference ranges are mapped against consensus standards from the WHO, ADA, and College of American Pathologists (CAP).",
      card2Title: "Patient Centric",
      card2Desc: "Empowers patients with plain-language explanations, actionable lifestyle modifications, and structured doctor consultation preparation.",
      card3Title: "Open Science Foundation",
      card3Desc: "Transparent, privacy-preserving, and extensible. Built for community peer review, hospital integrations, and global healthcare equity.",
      creditsTitle: "Open-Source Attribution & Credits",
      creditsDesc: "MediScan AI utilizes open-source clinical and document intelligence technologies including document OCR models (Surya OCR, PaddleOCR, DocTR), Recharts, Lucide Icons, and Next.js under permissive open-source licenses (MIT/Apache 2.0)."
    },
    faq: {
      badge: "Frequently Asked Questions",
      title: "Healthcare & Technical FAQ",
      subtitle: "Answers to common questions regarding accuracy, safety, privacy, and clinical interpretations.",
      q1: "How does MediScan AI extract biomarkers from my medical report?",
      a1: "MediScan AI utilizes an advanced OCR and document vision pipeline combining Surya OCR, PaddleOCR, and DocTR models. It performs edge detection, perspective deskewing, noise filtering, and table boundary extraction before recognizing text and parsing numerical laboratory biomarkers against clinical reference dictionaries.",
      q2: "Does MediScan AI replace a physician or pathologist diagnosis?",
      a2: "No. MediScan AI is strictly an informational and educational analysis tool. It assists patients and clinicians in interpreting parameters, identifying potential risk factors, and preparing relevant consultation questions, but cannot formulate clinical diagnoses or prescribe treatments.",
      q3: "How is patient privacy protected under HIPAA / GDPR?",
      a3: "All processing can be performed in zero-knowledge client-side memory or through private on-premise container clusters. We do not sell or store Protected Health Information (PHI) without explicit cryptographic consent, and all network transmissions adhere to AES-256 standards.",
      q4: "What happens when a critical emergency value is detected?",
      a4: "The platform activates an immediate red pulse emergency alert banner and audio notification recommending urgent evaluation at an emergency department or immediate physician contact.",
      q5: "Which laboratory tests are supported?",
      a5: "Over 60+ biomarkers are parsed, including Complete Blood Count (CBC), Lipid Profiles, Diabetic & Glycemic Indices (HbA1c), Renal Function Tests (KFT), Liver Function Tests (LFT), Thyroid Axis (TSH, T3, T4), Vitamin D3 & B12, and Urinalysis."
    },
    privacy: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: August 2026 | HIPAA & GDPR Compliant",
      s1Title: "1. Zero-Knowledge Processing",
      s1Desc: "MediScan AI is designed from the ground up to respect patient confidentiality. By default, documents scanned via your camera or uploaded in browser sessions are processed in ephemeral client-side memory or securely piped to your private on-premise container cluster.",
      s2Title: "2. Protected Health Information (PHI)",
      s2Desc: "We do not sell, rent, monetize, or harvest personal health data for advertising. Patient names, lab affiliations, and numerical values are never transferred to commercial brokers.",
      s3Title: "3. Cryptographic Transmission",
      s3Desc: "All data transmitted between your device and API endpoints is encrypted using TLS 1.3 and stored with AES-256-GCM authenticated encryption at rest."
    },
    terms: {
      title: "Terms of Service & Medical Disclaimer",
      lastUpdated: "Last Updated: August 2026",
      noticeTitle: "Mandatory Medical Notice:",
      noticeDesc: "The software and services provided by MediScan AI do not provide medical advice, diagnosis, or treatment. It is intended solely for educational, reference, and informational utility.",
      s1Title: "1. No Doctor-Patient Relationship",
      s1Desc: "Use of the MediScan AI platform, camera scanner, and AI assistant does not establish a physician-patient relationship. You should never delay seeking medical advice, disregard medical recommendations, or discontinue medical treatment because of information provided by this application.",
      s2Title: "2. Emergency Medical Situations",
      s2Desc: "IF YOU BELIEVE YOU ARE EXPERIENCING A MEDICAL EMERGENCY, CHEST PAIN, STROKE SYMPTOMS, OR ACUTE SHORTNESS OF BREATH, IMMEDIATELY CALL 911 (OR YOUR LOCAL EMERGENCY SERVICE NUMBER) OR GO TO THE NEAREST EMERGENCY ROOM.",
      s3Title: "3. Open-Source License (MIT)",
      s3Desc: "MediScan AI is released under the permissive MIT Open Source License. The software is provided \"as is\", without warranty of any kind, express or implied."
    },
    ai: {
      title: "AI Clinical Intelligence",
      answer: "Clinical Answer",
      actionAnalyzing: "Your report analysis has started. Processing biomarkers and clinical parameters...",
      actionCompleted: "Report analysis completed successfully.",
      actionDownloadSuccess: "Official PDF clinical dossier generated and downloaded successfully.",
      actionEmailConfirmPrompt: "I located your completed clinical report dossier. Would you like me to send the full medical summary to your registered email address?",
      actionEmailDispatched: "Clinical notification email dispatched successfully to your registered address.",
      actionCompareNotice: "Longitudinal report comparison completed. Baseline vs. current deltas computed.",
      suggestionsTitle: "AI Suggestions & Recommendations",
      suggestionsSubtitle: "Personalized, evidence-based guidance derived directly from your laboratory findings.",
      nutritionTitle: "Nutrition Guidance",
      lifestyleTitle: "Lifestyle Modifications",
      monitoringTitle: "Parameters to Monitor",
      followUpTitle: "Professional Medical Follow-up",
      conditionsTitle: "Detected / Possible Conditions",
      conditionsSubtitle: "Clinical associations derived strictly from observed biomarker variations. Not a definitive diagnosis.",
      conditionHeader: "Possible Condition",
      supportingFinding: "Supporting Report Finding",
      observedValue: "Observed Value",
      refRange: "Reference Range",
      noRefRange: "Reference range not provided in the report.",
      explanation: "Clinical Explanation",
      nextStep: "Recommended Next Step",
      severityNote: "Severity cannot be determined from this report alone.",
      keyFindingsTitle: "Key Laboratory Findings",
      keyFindingsSubtitle: "Factual breakdown of primary biomarkers, reference intervals, and clinical status.",
      statusWithin: "Within Reference Range",
      statusBelow: "Below Reference Range",
      statusAbove: "Above Reference Range",
      statusCritical: "Critical Action Required",
      clarificationPrompt: "Would you like me to analyze the report or explain the result?",
      clarificationOptionAnalyze: "Analyze Report",
      clarificationOptionExplain: "Explain Result",
      greetingReply: "Hello! I am your MediScan AI Clinical Assistant. You can ask me medical questions or request actions like analyzing, explaining, comparing, or downloading your reports.",
      generalConversationReply: "I am ready to assist with your medical reports and clinical biomarker queries. How can I help you today?",
      noReportContextFound: "No active report context was found in your current session. Please upload or analyze a report to see personalized findings.",
      disclaimer: "MediScan AI is an educational and clinical decision-support tool. It does not replace professional medical diagnosis, treatment, or advice from a qualified healthcare provider.",
      errorAnalysisFailed: "We couldn't reliably analyze this report. Please check the uploaded report or try again."
    }
  },
  hi: {
    common: {
      loading: "लोड हो रहा है...",
      error: "त्रुटि",
      success: "सफल",
      close: "बंद करें",
      cancel: "रद्द करें",
      save: "सहेजें",
      download: "डाउनलोड",
      back: "वापस",
      next: "आगे",
      retry: "पुनः प्रयास करें",
      or: "या",
      all: "सभी",
      view: "देखें",
      delete: "हटाएं",
      search: "खोजें...",
      filter: "फ़िल्टर",
      status: "स्थिति",
      date: "तारीख",
      actions: "कार्रवाइयां",
      confirm: "पुष्टि करें",
      moderate: "मध्यम",
      critical: "गंभीर",
      optimal: "उत्तम",
      improved: "सुधार हुआ",
      worsened: "गिरावट आई",
      stable: "स्थिर"
    },
    nav: {
      brand: "मेडीस्कैन AI",
      tagline: "क्लिनिकल इंटेलिजेंस",
      home: "होम",
      scanner: "कैमरा स्कैनर",
      upload: "रिपोर्ट अपलोड",
      analysis: "AI विश्लेषण",
      dashboard: "एनालिटिक्स व ट्रेंड्स",
      compare: "रिपोर्ट तुलना",
      chat: "AI सहायक",
      admin: "प्रशासन व अनुपालन",
      games: "हेल्थ फन",
      login: "साइन इन",
      signup: "खाता बनाएं",
      logout: "लॉग आउट",
      welcome: "स्वागत",
      patientPortal: "मरीज़ पोर्टल",
      selectLanguage: "भाषा",
      collapseSidebar: "साइडबार समेटें",
      expandSidebar: "साइडबार खोलें",
      systemOperational: "प्रणाली सक्रिय",
      quickActions: "त्वरित क्रियाएँ",
      helpFaq: "सहायता व अक्सर पूछे जाने वाले प्रश्न",
      aboutMethodology: "क्लिनिकल पद्धति",
      notifications: "सूचनाएं"
    },
    hero: {
      badge: "अगली पीढ़ी की AI स्वास्थ्य प्रणाली",
      titlePrefix: "जटिल",
      titleHighlight: "मेडिकल रिपोर्ट",
      titleSuffix: "को AI से समझें",
      subtitle: "उन्नत दस्तावेज़ AI, रीयल-टाइम कैमरा स्कैनिंग, बायोमार्कर विश्लेषण और त्वरित स्वास्थ्य जोखिम पहचान।",
      ecgTelemetry: "रीयल-टाइम ECG रिदम टेलीमेट्री",
      ecgNormal: "सामान्य साइनस: 72 BPM",
      ctaScan: "कैमरा स्कैनर शुरू करें",
      ctaUpload: "रिपोर्ट अपलोड करें",
      instantDemos: "त्वरित क्लिनिकल नमूने देखें:",
      sampleMetabolic: "मेटाबोलिक व डायबिटिक पैनल",
      sampleCardiac: "कार्डियक आपातकालीन पैनल",
      sampleWellness: "संपूर्ण स्वास्थ्य जांच",
      statAccuracy: "99.4% OCR सटीकता",
      statBiomarkers: "60+ बायोमार्कर समर्थित",
      statSpeed: "< 1.5s AI विश्लेषण",
      hologramTitle: "3D जीनोमिक हेलिक्स विज़ुअलाइज़र",
      hologramBadge: "इंटरैक्टिव कैनवस",
      coreTitle: "बायोमार्कर विश्लेषण कोर",
      coreOnline: "सक्रिय",
      coreDesc: "HbA1c, LDL कोलेस्ट्रॉल, लिवर एंजाइम और किडनी फंक्शन का रीयल-टाइम विश्लेषण।",
      featureHeadingBadge: "उन्नत एंटरप्राइज क्लिनिकल आर्किटेक्चर",
      featureHeadingTitle: "सटीकता, सुरक्षा और स्पष्टता के लिए निर्मित",
      featureHeadingSubtitle: "अस्पतालों, प्रयोगशालाओं, डॉक्टरों और मरीजों के लिए संपूर्ण स्वास्थ्य AI प्रणाली।",
      featureScannerTitle: "स्मार्ट AI कैमरा स्कैनर",
      featureScannerDesc: "रीयल-टाइम एज डिटेक्शन, ऑटो-क्रॉप और उच्च रिज़ॉल्यूशन मल्टी-पेज स्कैनिंग।",
      featureScannerLink: "स्कैनर देखें",
      featureEmergencyTitle: "अत्यावश्यक आपातकालीन पहचान",
      featureEmergencyDesc: "जीवन-घातक लैब मानों की त्वरित पहचान और आपातकालीन परामर्श चेतावनी।",
      featureEmergencyLink: "आपातकालीन डेमो",
      featureMultiTenantTitle: "मल्टी-यूज़र डेटा गोपनीयता",
      featureMultiTenantDesc: "व्यक्तिगत सुरक्षा और JWT प्रमाणीकरण के साथ हर यूज़र का डेटा सुरक्षित और पृथक।",
      featureMultiTenantLink: "डैशबोर्ड खोलें",
      featureBiomarkersTitle: "60+ बायोमार्कर विश्लेषण",
      featureBiomarkersDesc: "CBC, मेटाबोलिक पैनल, लिपिड, थायरॉयड और किडनी बायोमार्कर की पूरी जांच।",
      featureBiomarkersLink: "बायोमार्कर मैट्रिक्स",
      featureAssistantTitle: "एक्शन-आधारित AI सहायक",
      featureAssistantDesc: "रिपोर्ट विश्लेषण, बायोमार्कर समझाने, PDF डाउनलोड और ईमेल भेजने में सक्षम सहायक।",
      featureAssistantLink: "सहायक से पूछें",
      featureDossierTitle: "स्वचालित क्लिनिकल रिपोर्ट",
      featureDossierDesc: "डॉक्टर के परामर्श हेतु विस्तृत PDF रिपोर्ट तुरंत तैयार करें।",
      featureDossierLink: "नमूना रिपोर्ट"
    },
    auth: {
      loginTitle: "क्लिनिकल पोर्टल में पुनः स्वागत है",
      loginSubtitle: "अपनी रिपोर्ट, बायोमार्कर एनालिटिक्स और इतिहास देखने के लिए लॉगिन करें।",
      signupTitle: "अपना मरीज़ खाता बनाएं",
      signupSubtitle: "अपनी मेडिकल रिपोर्ट सुरक्षित रूप से सहेजने और ट्रैक करने के लिए रजिस्टर करें।",
      emailLabel: "ईमेल पता",
      emailPlaceholder: "patient@example.com",
      passwordLabel: "पासवर्ड",
      passwordPlaceholder: "••••••••",
      nameLabel: "पूरा नाम",
      namePlaceholder: "उदा. राहुल वर्मा",
      phoneLabel: "फ़ोन नंबर (वैकल्पिक)",
      phonePlaceholder: "+91 98765 43210",
      signInBtn: "पोर्टल में साइन इन करें",
      signUpBtn: "खाता बनाएं",
      signingIn: "प्रमाणीकरण जारी है...",
      signingUp: "खाता बनाया जा रहा है...",
      noAccount: "क्या आपका खाता नहीं है?",
      haveAccount: "क्या आपके पास पहले से खाता है?",
      quickLoginNotice: "त्वरित डेमो लॉगिन:",
      patientDemo: "डेमो मरीज़ (राहुल वर्मा)",
      adminDemo: "एडमिन लॉगिन",
      securityNote: "डेटा गोपनीयता: आपकी मेडिकल रिपोर्ट एन्क्रिप्टेड और केवल आपके खाते तक सीमित हैं।",
      authRequired: "लॉगिन आवश्यक है",
      authRequiredDesc: "कृपया इस क्रिया को करने और अपनी रिपोर्ट देखने के लिए लॉगिन करें।",
      enterEmailPassword: "कृपया ईमेल और पासवर्ड दोनों दर्ज करें।",
      enterAllFields: "कृपया सभी आवश्यक जानकारी भरें।"
    },
    dashboard: {
      title: "मरीज़ क्लिनिकल डैशबोर्ड",
      subtitle: "दीर्घकालिक बायोमार्कर ट्रैकिंग और स्वास्थ्य रुझान",
      activeScope: "सक्रिय यूज़र दायरा: सुरक्षित पृथक डेटा",
      viewingAs: "इसके लिए मेडिकल रिकॉर्ड देख रहे हैं:",
      patientRole: "मरीज़",
      totalReports: "कुल विश्लेषित रिपोर्ट",
      abnormalBiomarkers: "सीमा से बाहर बायोमार्कर",
      averageHealthScore: "औसत स्वास्थ्य स्कोर",
      systemAlerts: "सक्रिय मेडिकल अलर्ट",
      biomarkerTrends: "बायोमार्कर रुझान व इतिहास",
      biomarkerTrendsDesc: "सामान्य संदर्भ सीमाओं के मुकाबले आपके लैब मानों का समय अनुसार विश्लेषण।",
      noTrendData: "कोई ऐतिहासिक रुझान डेटा उपलब्ध नहीं है",
      noTrendDataDesc: "इस रिपोर्ट में ऐतिहासिक समय-श्रृंखला डेटा नहीं है। समय के साथ कई लैब परीक्षण रिकॉर्ड होने पर ट्रेंड ट्रैकिंग उपलब्ध हो जाएगी।",
      temporalProgression: "बायोमार्कर समय-श्रृंखला प्रगति",
      historicalTrendFor: "ऐतिहासिक रुझान",
      referenceInterval: "संदर्भ सीमा",
      baseline: "आधार रेखा",
      currentValue: "वर्तमान मान",
      organHealthOverview: "बहु-अंग स्वास्थ्य स्थिति",
      organHealthDesc: "शरीर की प्रमुख प्रणालियों का रीयल-टाइम AI मूल्यांकन।",
      recentReports: "हालिया डायग्नोस्टिक रिपोर्ट",
      noReports: "अभी तक कोई मेडिकल रिपोर्ट नहीं मिली",
      noReportsDesc: "अपनी पहली रक्त रिपोर्ट अपलोड करें या कैमरे से स्कैन करके अपनी स्वास्थ्य यात्रा शुरू करें।",
      seedDemo: "नमूना रिपोर्ट लोड करें",
      uploadNew: "नई रिपोर्ट अपलोड करें",
      scanCamera: "कैमरे से स्कैन करें",
      viewFullAnalysis: "विस्तृत AI विश्लेषण देखें",
      allCategories: "सभी श्रेणियां",
      dateAnalyzed: "विश्लेषण तिथि",
      overallScore: "स्वास्थ्य स्कोर",
      riskCategory: "जोखिम स्तर",
      openReport: "रिपोर्ट खोलें",
      cardiacHealth: "हृदय व रक्तसंचार",
      metabolicHealth: "मेटाबोलिक व एंडोक्राइन",
      renalHealth: "किडनी स्वास्थ्य",
      hepaticHealth: "लिवर स्वास्थ्य",
      hematologicHealth: "रक्त संबंधी स्वास्थ्य",
      immuneHealth: "रोग प्रतिरोधक क्षमता"
    },
    upload: {
      title: "मेडिकल रिपोर्ट अपलोड करें",
      subtitle: "उन्नत दस्तावेज़ AI PDF, छवियों और स्कैन से 60+ बायोमार्कर निकालता और जांचता है।",
      tabUpload: "दस्तावेज़ अपलोड करें",
      tabPaste: "लैब परिणाम पेस्ट करें",
      dragDropText: "अपनी मेडिकल रिपोर्ट यहाँ खींचें और छोड़ें, या फ़ाइल चुनें",
      supportedFormats: "समर्थित प्रारूप: PDF, PNG, JPG, WEBP (अधिकतम 50MB)",
      orUseSample: "या तुरंत इन नमूनों के साथ परीक्षण करें:",
      sampleMetabolic: "मेटाबोलिक व डायबिटिक पैनल (मध्यम जोखिम)",
      sampleCardiac: "कार्डियक आपातकालीन पैनल (गंभीर चेतावनी)",
      sampleNormal: "संपूर्ण स्वास्थ्य जांच (सामान्य/उत्तम)",
      pastePlaceholder: "यहाँ अपनी लैब रिपोर्ट का टेक्स्ट पेस्ट करें (उदा. Hemoglobin: 13.5 g/dL, Fasting Glucose: 110 mg/dL, HbA1c: 6.2%)...",
      analyzePastedBtn: "लैब मानों का विश्लेषण करें",
      guidelinesTitle: "सर्वोत्तम OCR सटीकता के लिए:",
      guide1: "पर्याप्त प्रकाश सुनिश्चित करें और परछाई से बचें।",
      guide2: "दस्तावेज़ को समतल रखें और किनारों को सीधा रखें।",
      guide3: "मुद्रित और डिजिटल दोनों प्रकार की लैब रिपोर्ट समर्थित हैं।",
      processingTitle: "मेडिकल दस्तावेज़ प्रोसेस हो रहा है...",
      ocrStep: "AI OCR मॉडल से रिपोर्ट का टेक्स्ट निकाला जा रहा है..."
    },
    scanner: {
      title: "स्मार्ट AI कैमरा स्कैनर",
      subtitle: "रीयल-टाइम एज डिटेक्शन, ऑटो-क्रॉप और उच्च रिज़ॉल्यूशन मल्टी-पेज स्कैनिंग।",
      alignGuide: "दस्तावेज़ के किनारों को फ्रेम में संरेखित करें",
      startCamera: "कैमरा चालू करें",
      stopCamera: "कैमरा बंद करें",
      capturePage: "पेज कैप्चर करें",
      switchCamera: "कैमरा बदलें",
      torchOn: "टॉर्च: चालू",
      torchOff: "टॉर्च: बंद",
      gridOn: "ग्रिड: चालू",
      gridOff: "ग्रिड: बंद",
      zoom: "ज़ूम",
      autoEnhance: "स्वचालित छवि सुधार",
      pagesCaptured: "स्कैन किए गए पृष्ठ",
      exportPdf: "PDF बनाएं",
      analyzeNow: "AI से विश्लेषण करें",
      clearPages: "सभी हटाएं",
      confidence: "OCR गुणवत्ता",
      cameraAccessRequired: "कैमरा अनुमति आवश्यक है। कृपया ब्राउज़र में अनुमति दें।",
      analyzing: "AI से दस्तावेज़ का विश्लेषण जारी है..."
    },
    analysis: {
      title: "AI मेडिकल इंटेलिजेंस रिपोर्ट",
      backToDashboard: "डैशबोर्ड पर वापस",
      emailReport: "रिपोर्ट ईमेल करें",
      downloadPdf: "आधिकारिक PDF डाउनलोड करें",
      patientInfo: "मरीज़ व परीक्षण विवरण",
      patientName: "मरीज़ का नाम",
      ageGender: "उम्र / लिंग",
      reportId: "रिपोर्ट संदर्भ संख्या",
      date: "परीक्षण तिथि",
      laboratory: "प्रयोगशाला",
      orderingPhysician: "परामर्शदाता डॉक्टर",
      overallHealthScore: "AI स्वास्थ्य स्कोर",
      riskAssessment: "जोखिम श्रेणी",
      executiveSummary: "नैदानिक सारांश",
      biomarkersTitle: "बायोमार्कर प्रयोगशाला प्रोफ़ाइल",
      biomarkersSubtitle: "संदर्भ सीमा तुलना और स्वचालित नैदानिक स्थिति।",
      organMatrixTitle: "अंग प्रणाली स्वास्थ्य स्थिति",
      actionPlanTitle: "व्यक्तिगत कार्य योजना व जीवनशैली नियम",
      actionPlanSubtitle: "AI-आधारित जीवनशैली सुधार और डॉक्टर से परामर्श बिंदु।",
      dietaryGuidance: "आहार संबंधी मार्गदर्शन",
      exerciseProtocol: "व्यायाम व शारीरिक गतिविधि",
      sleepHydration: "नींद व जल संतुलन नियम",
      followUpTests: "अनुशंसित अनुवर्ती परीक्षण",
      questionsForDoctor: "डॉक्टर से पूछने योग्य प्रश्न",
      rawOcrInspector: "निकाला गया टेक्स्ट देखें (OCR निरीक्षक)",
      edit: "टेक्स्ट बदलें",
      reanalyze: "पुनः विश्लेषण करें",
      disclaimer: "चिकित्सा अस्वीकरण: यह AI-जनरेटेड विश्लेषण केवल सूचनात्मक उद्देश्यों के लिए है और किसी योग्य चिकित्सक के परामर्श का विकल्प नहीं है।",
      emergencyBannerTitle: "गंभीर चिकित्सा चेतावनी: तत्काल ध्यान आवश्यक",
      emergencyBannerText: "बायोमार्कर सुरक्षित सीमाओं से बाहर पाए गए हैं। तुरंत डॉक्टर से परामर्श करने की सलाह दी जाती है।",
      bmColName: "बायोमार्कर",
      bmColValue: "प्राप्त मान",
      bmColRange: "सामान्य सीमा",
      bmColSignificance: "चिकित्सीय महत्व",
      bmColStatus: "स्थिति"
    },
    compare: {
      title: "दीर्घकालिक मेडिकल रिपोर्ट तुलना",
      subtitle: "मल्टी-टेस्ट अंतर विश्लेषण, बायोमार्कर रुझान और स्वास्थ्य विकास।",
      baseline: "प्रारंभिक टेस्ट",
      current: "हालिया फॉलो-अप टेस्ट",
      delta: "बदलाव (डेल्टा)",
      trajectory: "स्वास्थ्य रुझान",
      summary: "तुलनात्मक सारांश",
      summaryText: "ग्लूकोज और लिपिड स्तरों में महत्वपूर्ण परिवर्तन देखे गए। 90 दिनों में दोबारा जांच की सलाह है।",
      colBiomarker: "बायोमार्कर",
      colCategory: "श्रेणी",
      colBaseline: "प्रारंभिक",
      colCurrent: "वर्तमान",
      colDelta: "बदलाव",
      colStatus: "रुझान",
      colNotes: "चिकित्सीय प्रभाव",
      compareNotice: "आपके पिछले और हालिया टेस्ट परिणामों की तुलना प्रदर्शित की जा रही है।"
    },
    chat: {
      title: "मेडीस्कैन AI क्लिनिकल सहायक",
      subtitle: "रिपोर्ट विश्लेषण, बायोमार्कर समझाने, PDF डाउनलोड और ईमेल भेजने के लिए एक्शन-आधारित AI सहायक।",
      welcomeText: "नमस्ते! मैं मेडीस्कैन AI का एक्शन-आधारित क्लिनिकल सहायक हूँ। मैं सिर्फ सवालों के जवाब ही नहीं देता — बल्कि आपकी रिपोर्ट का विश्लेषण कर सकता हूँ, बायोमार्कर समझा सकता हूँ, पुराने टेस्ट से तुलना कर सकता हूँ, PDF डाउनलोड कर सकता हूँ और सीधे आपके ईमेल पर भेज सकता हूँ। मैं आपकी क्या मदद करूँ?",
      actionAnalyze: "📊 मेरी रिपोर्ट का विश्लेषण करें",
      actionExplain: "🩺 मेरे परिणाम समझाएं",
      actionDownload: "📥 PDF रिपोर्ट डाउनलोड करें",
      actionEmail: "✉️ मेरे ईमेल पर भेजें",
      actionCompare: "🔄 रिपोर्ट की तुलना करें",
      inputPlaceholder: "अपनी रिपोर्ट, बायोमार्कर या डॉक्टर से परामर्श के बारे में पूछें...",
      listening: "सुन रहे हैं (आवाज़ पहचान)...",
      speak: "बोलें",
      send: "भेजें",
      badgeAssistant: "एक्शन इंजन: सक्रिय",
      speechToggle: "ध्वनि आउटपुट",
      analyzingReport: "AI मॉडल द्वारा आपकी रिपोर्ट का विश्लेषण किया जा रहा है...",
      generatingDossier: "आधिकारिक PDF क्लिनिकल रिपोर्ट तैयार हो रही है...",
      emailSentSuccess: "विश्लेषण रिपोर्ट सफलतापूर्वक आपके ईमेल पर भेज दी गई है।",
      emailConfirmTitle: "क्लिनिकल रिपोर्ट भेजने की पुष्टि करें",
      btnConfirmSend: "पुष्टि करें और ईमेल भेजें"
    },
    admin: {
      title: "प्रशासन व अनुपालन पोर्टल",
      subtitle: "यूज़र डायरेक्टरी, रोल प्रबंधन, ईमेल अधिसूचना लॉग और क्लिनिकल ऑडिट ट्रेल।",
      tabUsers: "यूज़र डायरेक्टरी",
      tabEmails: "ईमेल अधिसूचना लॉग",
      tabAudit: "अनुपालन ऑडिट ट्रेल",
      totalUsers: "पंजीकृत यूज़र्स",
      totalEmails: "भेजे गए ईमेल",
      complianceScore: "HIPAA अनुपालन",
      activeSessions: "सक्रिय सत्र",
      userSearchPlaceholder: "नाम, ईमेल या रोल द्वारा खोजें...",
      filterAllRoles: "सभी रोल",
      name: "यूज़र",
      role: "भूमिका",
      statusCol: "स्थिति",
      reportsCol: "रिपोर्ट संख्या",
      joinedCol: "शामिल तिथि",
      viewEmail: "ईमेल देखें",
      recipient: "प्राप्तकर्ता",
      subject: "विषय",
      sentAt: "भेजने का समय",
      statusDelivered: "सफलतापूर्वक भेजा गया",
      auditComplianceTrail: "क्लिनिकल ऑडिट व डेटा एक्सेस लॉग",
      auditEvent: "गतिविधि",
      auditTimestamp: "समय",
      auditActor: "कर्ता",
      auditStatus: "सत्यापन"
    },
    footer: {
      brandDesc: "मेडिकल रिपोर्ट विश्लेषण, कैमरा स्कैनिंग और आपातकालीन जोखिम पहचान के लिए उन्नत AI प्लेटफ़ॉर्म।",
      hipaa: "HIPAA अनुरूप",
      encryption: "AES-256 एन्क्रिप्शन",
      clinicalTools: "क्लिनिकल टूल्स",
      aiScanner: "AI कैमरा स्कैनर",
      uploadLab: "रिपोर्ट अपलोड",
      biomarkerAnalysis: "बायोमार्कर विश्लेषण",
      healthTrend: "स्वास्थ्य रुझान चार्ट",
      compareTests: "पुराने टेस्ट की तुलना",
      aiIntelligence: "AI क्षमताएं",
      assistant: "AI स्वास्थ्य सहायक",
      auditCompliance: "ऑडिट व अनुपालन",
      validation: "क्लिनिकल प्रमाणन",
      faq: "स्वास्थ्य संबंधी प्रश्नोत्तर",
      legal: "कानूनी व सुरक्षा",
      privacy: "गोपनीयता नीति",
      terms: "सेवा की शर्तें",
      disclaimerTitle: "चिकित्सा अस्वीकरण",
      securityCommitment: "सुरक्षा प्रतिबद्धता",
      copyright: "मेडीस्कैन AI. क्लिनिकल इंटेलिजेंस प्लेटफॉर्म।"
    },
    games: {
      button: "हेल्थ फन",
      title: "मेडीस्कैन हेल्थ गेम्स व शिक्षा",
      subtitle: "स्वास्थ्य ज्ञान बढ़ाने के लिए मनोरंजक खेल।",
      virusHunter: "वायरस हंटर",
      pillSort: "दवा छँटाई चुनौती",
      dnaMatcher: "DNA बेस मिलान",
      heartbeatRhythm: "हार्टबीट रिदम"
    },
    about: {
      badge: "हमारा उद्देश्य एवं क्लिनिकल संरचना",
      title: "चिकित्सा बुद्धिमत्ता का लोकतंत्रीकरण",
      subtitle: "मेडीस्कैन AI एक खुला अनुसंधान प्लेटफॉर्म है जिसका उद्देश्य जटिल प्रयोगशाला परिणामों और मरीज की समझ के बीच की खाई को पाटना है।",
      card1Title: "क्लिनिकल सत्यापन",
      card1Desc: "बायोमार्कर्स की सीमाएं WHO, ADA और कॉलेज ऑफ अमेरिकन पैथोलॉजिस्ट (CAP) के अंतरराष्ट्रीय मानकों के आधार पर निर्धारित हैं।",
      card2Title: "मरीज-केंद्रित दृष्टिकोण",
      card2Desc: "सरल भाषा में व्याख्या, जीवनशैली में आवश्यक सुधार और डॉक्टर से परामर्श के लिए तैयारी में मरीजों को सक्षम बनाता है।",
      card3Title: "ओपन साइंस फाउंडेशन",
      card3Desc: "पारदर्शी, गोपनीयता-संरक्षित और विस्तार योग्य। सामुदायिक समीक्षा, अस्पताल एकीकरण और स्वास्थ्य समानता के लिए निर्मित।",
      creditsTitle: "ओपन-सोर्स आभार एवं क्रेडिट्स",
      creditsDesc: "मेडीस्कैन AI ओपन-सोर्स प्रौद्योगिकियों द्वारा संचालित है, जिसमें दस्तावेज़ OCR मॉडल (Surya OCR, PaddleOCR, DocTR), Recharts, Lucide Icons और Next.js शामिल हैं (MIT/Apache 2.0 लाइसेंस)।"
    },
    faq: {
      badge: "अक्सर पूछे जाने वाले प्रश्न",
      title: "स्वास्थ्य एवं तकनीकी सामान्य प्रश्न",
      subtitle: "सटीकता, सुरक्षा, गोपनीयता और क्लिनिकल व्याख्याओं से जुड़े सामान्य सवालों के जवाब।",
      q1: "मेडीस्कैन AI मेरे मेडिकल रिपोर्ट से बायोमार्कर्स कैसे निकालता है?",
      a1: "मेडीस्कैन AI उन्नत OCR और विज़न पाइपलाइन का उपयोग करता है जो दस्तावेज़ के किनारों का पता लगाने, शोर हटाने और तालिकाओं को पढ़कर बायोमार्कर्स को क्लिनिकल शब्दकोश के साथ जोड़ता है।",
      q2: "क्या मेडीस्कैन AI डॉक्टर या पैथोलॉजिस्ट के निदान का विकल्प है?",
      a2: "नहीं। मेडीस्कैन AI केवल सूचना और शैक्षणिक उद्देश्यों के लिए है। यह रिपोर्ट समझने और डॉक्टर से पूछे जाने वाले प्रश्नों की तैयारी में सहायता करता है, लेकिन कोई डॉक्टरी निदान या दवा नहीं लिखता।",
      q3: "HIPAA और GDPR के तहत मरीज की गोपनीयता कैसे सुरक्षित रहती है?",
      a3: "सभी प्रोसेसिंग सुरक्षित रूप से होती है। हम आपकी निजी स्वास्थ्य जानकारी को कभी बेचते या बिना अनुमति साझा नहीं करते। सभी नेटवर्क ट्रांसमिशन AES-256 द्वारा सुरक्षित हैं।",
      q4: "यदि कोई गंभीर या आपातकालीन मान पाया जाता है तो क्या होता है?",
      a4: "प्लेटफ़ॉर्म तुरंत लाल पल्स चेतावनी बैनर और ऑडियो सूचना सक्रिय करता है और तत्काल आपातकालीन विभाग या डॉक्टर से संपर्क करने की सलाह देता है।",
      q5: "कौन-कौन से लैब टेस्ट समर्थित हैं?",
      a5: "60 से अधिक बायोमार्कर्स समर्थित हैं, जिनमें CBC, लिपिड प्रोफ़ाइल, मधुमेह (HbA1c), किडनी फंक्शन (KFT), लिवर फंक्शन (LFT), थायरॉइड (TSH), विटामिन D3 और B12 शामिल हैं।"
    },
    privacy: {
      title: "गोपनीयता नीति",
      lastUpdated: "अंतिम अद्यतन: अगस्त 2026 | HIPAA और GDPR अनुपालित",
      s1Title: "1. ज़ीरो-नॉलेज प्रोसेसिंग",
      s1Desc: "मेडीस्कैन AI मरीज की गोपनीयता का पूरा सम्मान करता है। आपके कैमरे से स्कैन किए गए या अपलोड किए गए दस्तावेज़ सुरक्षित रूप से प्रोसेस किए जाते हैं और कोई अवांछित डेटा सहेजा नहीं जाता।",
      s2Title: "2. संरक्षित स्वास्थ्य जानकारी (PHI)",
      s2Desc: "हम विज्ञापन या व्यावसायिक लाभ के लिए किसी भी स्वास्थ्य डेटा को बेचते या किराए पर नहीं देते। मरीजों के नाम और टेस्ट परिणाम पूर्णतया सुरक्षित हैं।",
      s3Title: "3. क्रिप्टोग्राफ़िक डेटा ट्रांसमिशन",
      s3Desc: "आपके डिवाइस और सर्वर के बीच सारा डेटा TLS 1.3 और AES-256-GCM एन्क्रिप्शन के साथ सुरक्षित रूप से स्थानांतरित होता है।"
    },
    terms: {
      title: "सेवा की शर्तें एवं चिकित्सा अस्वीकरण",
      lastUpdated: "अंतिम अद्यतन: अगस्त 2026",
      noticeTitle: "अनिवार्य चिकित्सा सूचना:",
      noticeDesc: "मेडीस्कैन AI द्वारा प्रदान की गई सेवाएं कोई चिकित्सीय सलाह, निदान या उपचार प्रदान नहीं करती हैं। यह केवल शैक्षणिक और सूचनात्मक उपयोग के लिए है।",
      s1Title: "1. डॉक्टर-रोगी संबंध नहीं",
      s1Desc: "इस प्लेटफ़ॉर्म का उपयोग किसी डॉक्टर-मरीज संबंध को स्थापित नहीं करता है। आपको कभी भी किसी पेशेवर डॉक्टर की सलाह को नजरअंदाज या उपचार को बंद नहीं करना चाहिए।",
      s2Title: "2. आपातकालीन चिकित्सा स्थितियां",
      s2Desc: "यदि आपको लगता है कि आप किसी चिकित्सीय आपात स्थिति, सीने में दर्द, या सांस लेने में गंभीर कठिनाई का सामना कर रहे हैं, तो तुरंत आपातकालीन नंबर (108/112) पर कॉल करें या निकटतम अस्पताल जाएं।",
      s3Title: "3. ओपन-सोर्स लाइसेंस (MIT)",
      s3Desc: "मेडीस्कैन AI एमआईटी (MIT) ओपन सोर्स लाइसेंस के तहत जारी किया गया है। यह सॉफ़्टवेयर बिना किसी प्रकार की वारंटी के प्रदान किया जाता है।"
    },
    ai: {
      title: "AI क्लिनिकल बुद्धिमत्ता",
      answer: "चिकित्सीय उत्तर",
      actionAnalyzing: "आपकी रिपोर्ट का विश्लेषण शुरू हो गया है। बायोमार्कर्स और क्लिनिकल मापदंडों की जांच जारी है...",
      actionCompleted: "रिपोर्ट का विश्लेषण सफलतापूर्वक पूर्ण हुआ।",
      actionDownloadSuccess: "आधिकारिक PDF क्लिनिकल डॉसियर जनरेट और डाउनलोड हो गया है।",
      actionEmailConfirmPrompt: "आपकी पूर्ण रिपोर्ट मिल गई है। क्या आप चाहते हैं कि मैं आपके पंजीकृत ईमेल पर सारांश भेजूं?",
      actionEmailDispatched: "क्लिनिकल सारांश आपके पंजीकृत ईमेल पते पर सफलतापूर्वक भेज दिया गया है।",
      actionCompareNotice: "दीर्घकालिक रिपोर्ट तुलना पूर्ण हुई। आधार रेखा बनाम वर्तमान बदलाव दर्ज किए गए।",
      suggestionsTitle: "AI सुझाव एवं सिफारिशें",
      suggestionsSubtitle: "आपकी प्रयोगशाला जांच परिणामों के आधार पर व्यक्तिगत एवं साक्ष्य-आधारित मार्गदर्शन।",
      nutritionTitle: "पोषण संबंधी मार्गदर्शन",
      lifestyleTitle: "जीवनशैली में सुधार",
      monitoringTitle: "निगरानी योग्य मापदंड",
      followUpTitle: "व्यावसायिक चिकित्सीय परामर्श",
      conditionsTitle: "पहचानी गई / संभावित स्थितियां",
      conditionsSubtitle: "बायोमार्कर भिन्नताओं से जुड़े संभावित संकेत। यह कोई अंतिम चिकित्सीय निदान नहीं है।",
      conditionHeader: "संभावित स्थिति",
      supportingFinding: "सहायक रिपोर्ट निष्कर्ष",
      observedValue: "परीक्षण मान",
      refRange: "संदर्भ सीमा (Reference Range)",
      noRefRange: "रिपोर्ट में संदर्भ सीमा प्रदान नहीं की गई है।",
      explanation: "चिकित्सीय व्याख्या",
      nextStep: "अनुशंसित अगला कदम",
      severityNote: "केवल इस रिपोर्ट के आधार पर गंभीरता का निर्धारण नहीं किया जा सकता।",
      keyFindingsTitle: "प्रमुख प्रयोगशाला निष्कर्ष",
      keyFindingsSubtitle: "प्राथमिक बायोमार्कर्स, संदर्भ सीमाओं और क्लिनिकल स्थिति का तथ्यात्मक विवरण।",
      statusWithin: "सामान्य सीमा के भीतर",
      statusBelow: "संदर्भ सीमा से कम",
      statusAbove: "संदर्भ सीमा से अधिक",
      statusCritical: "तत्काल ध्यान देने योग्य",
      clarificationPrompt: "क्या आप चाहते हैं कि मैं रिपोर्ट का विश्लेषण करूं या परिणाम समझाऊं?",
      clarificationOptionAnalyze: "रिपोर्ट का विश्लेषण करें",
      clarificationOptionExplain: "परिणाम समझाएं",
      greetingReply: "नमस्ते! मैं आपका मेडीस्कैन AI क्लिनिकल सहायक हूँ। आप मुझसे चिकित्सीय प्रश्न पूछ सकते हैं या रिपोर्ट विश्लेषण, व्याख्या या डाउनलोड का अनुरोध कर सकते हैं।",
      generalConversationReply: "मैं आपकी मेडिकल रिपोर्ट्स और बायोमार्कर प्रश्नों में सहायता के लिए तैयार हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?",
      noReportContextFound: "वर्तमान सत्र में कोई सक्रिय रिपोर्ट नहीं मिली। व्यक्तिगत परिणाम देखने के लिए कृपया रिपोर्ट अपलोड या विश्लेषण करें।",
      disclaimer: "मेडीस्कैन AI एक सूचनात्मक उपकरण है। यह किसी पेशेवर चिकित्सक के निदान या उपचार का विकल्प नहीं है।",
      errorAnalysisFailed: "हम इस रिपोर्ट का विश्वसनीय रूप से विश्लेषण नहीं कर सके। कृपया रिपोर्ट जांचें या दोबारा प्रयास करें।"
    }
  },
  gu: {
    common: {
      loading: "લોડ થઈ રહ્યું છે...",
      error: "ભૂલ",
      success: "સફળ",
      close: "બંધ કરો",
      cancel: "રદ કરો",
      save: "સાચવો",
      download: "ડાઉનલોડ",
      back: "પાછા",
      next: "આગળ",
      retry: "ફરી પ્રયાસ કરો",
      or: "અથવા",
      all: "બધા",
      view: "જુઓ",
      delete: "કાઢી નાખો",
      search: "શોધો...",
      filter: "ફિલ્ટર",
      status: "સ્થિતિ",
      date: "તારીખ",
      actions: "ક્રિયાઓ",
      confirm: "પુષ્ટિ કરો",
      moderate: "મધ્યમ",
      critical: "ગંભીર",
      optimal: "ઉત્તમ",
      improved: "સુધારો થયો",
      worsened: "નબળું પડ્યું",
      stable: "સ્થિર"
    },
    nav: {
      brand: "મેડીસ્કેન AI",
      tagline: "ક્લિનિકલ ઇન્ટેલિજન્સ",
      home: "હોમ",
      scanner: "કેમેરા સ્કેનર",
      upload: "રિપોર્ટ અપલોડ",
      analysis: "AI વિશ્લેષણ",
      dashboard: "એનાલિટિક્સ",
      compare: "તુલના",
      chat: "AI સહાયક",
      admin: "એડમિન પોર્ટલ",
      games: "હેલ્થ ફન",
      login: "સાઇન ઇન",
      signup: "ખાતું બનાવો",
      logout: "લૉગ આઉટ",
      welcome: "સ્વાગત",
      patientPortal: "દર્દી પોર્ટલ",
      selectLanguage: "ભાષા",
      collapseSidebar: "સાઇડબાર સંકોચો",
      expandSidebar: "સાઇડબાર વિસ્તૃત કરો",
      systemOperational: "સિસ્ટમ કાર્યરત",
      quickActions: "ઝડપી ક્રિયાઓ",
      helpFaq: "મદદ અને પ્રશ્નોત્તરી",
      aboutMethodology: "ક્લિનિકલ પદ્ધતિ",
      notifications: "સૂચનાઓ"
    },
    hero: {
      badge: "આધુનિક AI હેલ્થકેર સિસ્ટમ",
      titlePrefix: "જટિલ",
      titleHighlight: "મેડિકલ રિપોર્ટ",
      titleSuffix: "સરળતાથી સમજો",
      subtitle: "ઉચ્ચ-ગુણવત્તાવાળું AI, રીઅલ-ટાઇમ કેમેરા સ્કેનિંગ અને બાયોમાર્કર વિશ્લેષણ.",
      ecgTelemetry: "રીઅલ-ટાઇમ ECG રિધમ ટેલિમેટ્રી",
      ecgNormal: "સામાન્ય સાયનસ: 72 BPM",
      ctaScan: "કેમેરા સ્કેનર શરૂ કરો",
      ctaUpload: "રિપોર્ટ અપલોડ કરો",
      instantDemos: "તરત જ સેમ્પલ રિપોર્ટ જુઓ:",
      sampleMetabolic: "ડાયાબિટીક અને લિપિડ પેનલ",
      sampleCardiac: "કાર્ડિયાક કટોકટી પેનલ",
      sampleWellness: "સામાન્ય હેલ્થ ચેકઅપ",
      statAccuracy: "99.4% OCR ચોકસાઈ",
      statBiomarkers: "60+ બાયોમાર્કર્સ",
      statSpeed: "< 1.5 સેકન્ડ AI ઝડપ",
      hologramTitle: "3D જીનોમિક હેલિક્સ વિઝ્યુઅલાઇઝર",
      hologramBadge: "ઇન્ટરેક્ટિવ કેનવાસ",
      coreTitle: "બાયોમાર્કર એનાલિસિસ કોર",
      coreOnline: "ઓનલાઇન",
      coreDesc: "HbA1c, કોલેસ્ટ્રોલ, લીવર એન્ઝાઇમ્સ અને કિડની ફંક્શનનું રીઅલ-ટાઇમ વિશ્લેષણ.",
      featureHeadingBadge: "અદ્યતન એન્ટરપ્રાઇઝ ક્લિનિકલ આર્કિટેક્ચર",
      featureHeadingTitle: "ચોકસાઈ, સુરક્ષા અને સ્પષ્ટતા માટે નિર્મિત",
      featureHeadingSubtitle: "હોસ્પિટલો, લેબોરેટરીઓ, ડૉક્ટરો અને દર્દીઓ માટે સંપૂર્ણ સ્વાસ્થ્ય AI સિસ્ટમ.",
      featureScannerTitle: "સ્માર્ટ AI કેમેરા સ્કેનર",
      featureScannerDesc: "રીઅલ-ટાઇમ એજ ડિટેક્શન અને ઓટો-ક્રોપ સાથે મલ્ટી-પેજ સ્કેનિંગ.",
      featureScannerLink: "સ્કેનર જુઓ",
      featureEmergencyTitle: "તાત્કાલિક જોખમ ઓળખ",
      featureEmergencyDesc: "ગંભીર લેબ પરિણામોની ઝડપી ઓળખ અને તાત્કાલિક સલાહ.",
      featureEmergencyLink: "ઇમર્જન્સી ડેમો",
      featureMultiTenantTitle: "સુરક્ષિત યુઝર ડેટા",
      featureMultiTenantDesc: "દરેક યુઝરના રિપોર્ટ અને વિગતો સંપૂર્ણપણે અલગ અને સુરક્ષિત.",
      featureMultiTenantLink: "ડેશબોર્ડ ખોલો",
      featureBiomarkersTitle: "60+ બાયોમાર્કર ચકાસણી",
      featureBiomarkersDesc: "CBC, લિપિડ, ડાયાબિટીસ અને કિડની રિપોર્ટની સંપૂર્ણ તપાસ.",
      featureBiomarkersLink: "બાયોમાર્કર લિસ્ટ",
      featureAssistantTitle: "એક્શન AI આસિસ્ટન્ટ",
      featureAssistantDesc: "રિપોર્ટ વિશ્લેષણ, પરિણામો સમજાવવા અને PDF ડાઉનલોડ કરવા માટે AI સહાયક.",
      featureAssistantLink: "સહાયકને પૂછો",
      featureDossierTitle: "તૈયાર ક્લિનિકલ રિપોર્ટ",
      featureDossierDesc: "ડૉક્ટર સાથે ચર્ચા માટે વિગતવાર PDF રિપોર્ટ તરત ડાઉનલોડ કરો.",
      featureDossierLink: "સેમ્પલ PDF"
    },
    auth: {
      loginTitle: "ક્લિનિકલ પોર્ટલમાં ફરી સ્વાગત છે",
      loginSubtitle: "તમારા રિપોર્ટ, બાયોમાર્કર એનાલિટિક્સ અને ઇતિહાસ જોવા માટે લૉગિન કરો.",
      signupTitle: "તમારું પેશન્ટ એકાઉન્ટ બનાવો",
      signupSubtitle: "તમારા મેડિકલ રિપોર્ટ સુરક્ષિત રાખવા અને ટ્રેક કરવા માટે રજીસ્ટર કરો.",
      emailLabel: "ઇમેઇલ સરનામું",
      emailPlaceholder: "patient@example.com",
      passwordLabel: "પાસવર્ડ",
      passwordPlaceholder: "••••••••",
      nameLabel: "પૂરું નામ",
      namePlaceholder: "દા.ત. રાહુલ વર્મા",
      phoneLabel: "ફોન નંબર (વૈકલ્પિક)",
      phonePlaceholder: "+91 98765 43210",
      signInBtn: "પોર્ટલમાં સાઇન ઇન કરો",
      signUpBtn: "ખાતું બનાવો",
      signingIn: "પ્રમાણીકરણ ચાલુ છે...",
      signingUp: "ખાતું બની રહ્યું છે...",
      noAccount: "શું તમારી પાસે એકાઉન્ટ નથી?",
      haveAccount: "શું તમારી પાસે પહેલેથી ખાતું છે?",
      quickLoginNotice: "ઝડપી ડેમો લૉગિન:",
      patientDemo: "ડેમો દર્દી (રાહુલ વર્મા)",
      adminDemo: "એડમિન લૉગિન",
      securityNote: "ડેટા ગોપનીયતા: તમારા મેડિકલ રિપોર્ટ્સ એન્ક્રિપ્ટેડ અને ફક્ત તમારા એકાઉન્ટ માટે જ છે.",
      authRequired: "લૉગિન જરૂરી છે",
      authRequiredDesc: "આ ક્રિયા કરવા અને તમારા રિપોર્ટ જોવા માટે કૃપા કરીને લૉગિન કરો.",
      enterEmailPassword: "કૃપા કરીને ઇમેઇલ અને પાસવર્ડ બંને દાખલ કરો.",
      enterAllFields: "કૃપા કરીને બધી જરૂરી વિગતો ભરો."
    },
    dashboard: {
      title: "દર્દી ક્લિનિકલ ડેશબોર્ડ",
      subtitle: "લાંબા ગાળાના બાયોમાર્કર ટ્રેકિંગ અને હેલ્થ ટ્રેન્ડ્સ",
      activeScope: "સક્રિય યુઝર ડેટા: સુરક્ષિત અને વ્યક્તિગત",
      viewingAs: "આમના મેડિકલ રેકોર્ડ જોઈ રહ્યા છો:",
      patientRole: "દર્દી",
      totalReports: "કુલ તપાસેલ રિપોર્ટ",
      abnormalBiomarkers: "અસામાન્ય બાયોમાર્કર",
      averageHealthScore: "સરેરાશ હેલ્થ સ્કોર",
      systemAlerts: "સક્રિય મેડિકલ ચેતવણી",
      biomarkerTrends: "બાયોમાર્કર ટ્રેન્ડ્સ અને ઇતિહાસ",
      biomarkerTrendsDesc: "સામાન્ય શ્રેણીની સરખામણીમાં તમારા લેબ પરિણામોનો સમય સાથેનો ટ્રેન્ડ.",
      noTrendData: "કોઈ ઐતિહાસિક ટ્રેન્ડ ડેટા ઉપલબ્ધ નથી",
      noTrendDataDesc: "આ રિપોર્ટમાં ઐતિહાસિક સમય-શ્રેણી ડેટા નથી. સમય જતાં બહુવિધ લેબ પરીક્ષણો રેકોર્ડ કરવામાં આવે ત્યારે ટ્રેન્ડ ટ્રેકિંગ ઉપલબ્ધ થશે.",
      temporalProgression: "બાયોમાર્કર સમય-શ્રેણી પ્રગતિ",
      historicalTrendFor: "ઐતિહાસિક ટ્રેન્ડ",
      referenceInterval: "સંદર્ભ શ્રેણી",
      baseline: "બેઝલાઇન",
      currentValue: "વર્તમાન મૂલ્ય",
      organHealthOverview: "ઓર્ગન હેલ્થ સ્થિતિ",
      organHealthDesc: "મુખ્ય શારીરિક સિસ્ટમોનું રીઅલ-ટાઇમ AI મૂલ્યાંકન.",
      recentReports: "તાજેતરના રિપોર્ટ્સ",
      noReports: "હજી સુધી કોઈ મેડિકલ રિપોર્ટ મળ્યો નથી",
      noReportsDesc: "તમારો પ્રથમ લેબ રિપોર્ટ અપલોડ કરો અથવા કેમેરાથી સ્કેન કરીને શરૂઆત કરો.",
      seedDemo: "સેમ્પલ રિપોર્ટ લોડ કરો",
      uploadNew: "નવો રિપોર્ટ અપલોડ કરો",
      scanCamera: "કેમેરાથી સ્કેન કરો",
      viewFullAnalysis: "વિગતવાર વિશ્લેષણ જુઓ",
      allCategories: "બધી કેટેગરીઝ",
      dateAnalyzed: "તપાસ તારીખ",
      overallScore: "હેલ્થ સ્કોર",
      riskCategory: "જોખમ સ્તર",
      openReport: "રિપોર્ટ ખોલો",
      cardiacHealth: "હૃદય અને રક્તવાહિનીઓ",
      metabolicHealth: "ડાયાબિટીસ અને મેટાબોલિક",
      renalHealth: "કિડની આરોગ્ય",
      hepaticHealth: "લીવર આરોગ્ય",
      hematologicHealth: "રક્ત આરોગ્ય (CBC)",
      immuneHealth: "રોગપ્રતિકારક શક્તિ"
    },
    upload: {
      title: "મેડિકલ રિપોર્ટ અપલોડ કરો",
      subtitle: "ઉન્નત AI સિસ્ટમ PDF અને ફોટામાંથી 60+ બાયોમાર્કર્સ શોધીને તપાસે છે.",
      tabUpload: "દસ્તાવેજ અપલોડ કરો",
      tabPaste: "લેબ પરિણામ પેસ્ટ કરો",
      dragDropText: "અહીં તમારી ફાઇલ ખેંચો અથવા બ્રાઉઝ કરો",
      supportedFormats: "માન્ય ફોર્મેટ: PDF, PNG, JPG, WEBP (મહત્તમ 50MB)",
      orUseSample: "અથવા આ તૈયાર સેમ્પલ સાથે તપાસો:",
      sampleMetabolic: "ડાયાબિટીક અને લિપિડ પેનલ (મધ્યમ જોખમ)",
      sampleCardiac: "કાર્ડિયાક કટોકટી પેનલ (ગંભીર ચેતવણી)",
      sampleNormal: "સામાન્ય હેલ્થ ચેકઅપ (સામાન્ય)",
      pastePlaceholder: "અહીં તમારા રિપોર્ટનું લખાણ પેસ્ટ કરો (દા.ત. Hemoglobin: 13.5 g/dL, Fasting Glucose: 110 mg/dL, HbA1c: 6.2%)...",
      analyzePastedBtn: "લેબ પરિણામોનું વિશ્લેષણ કરો",
      guidelinesTitle: "શ્રેષ્ઠ પરિણામ માટે સૂચના:",
      guide1: "સારો પ્રકાશ રાખો અને પડછાયા ટાળો.",
      guide2: "કાગળ સીધો રાખો અને કિનારીઓ સરખી ગોઠવો.",
      guide3: "પ્રિન્ટ કરેલા અને ડિજિટલ બંને પ્રકારના રિપોર્ટ માન્ય છે.",
      processingTitle: "દસ્તાવેજ પ્રોસેસ થઈ રહ્યો છે...",
      ocrStep: "AI OCR મોડેલ દ્વારા લખાણ વાંચવામાં આવી રહ્યું છે..."
    },
    scanner: {
      title: "સ્માર્ટ AI કેમેરા સ્કેનર",
      subtitle: "રીઅલ-ટાઇમ એજ ડિટેક્શન અને ઓટો-ક્રોપ સાથે મલ્ટી-પેજ સ્કેનિંગ.",
      alignGuide: "દસ્તાવેજની કિનારીઓ ચોરસ ફ્રેમમાં ગોઠવો",
      startCamera: "કેમેરો ચાલુ કરો",
      stopCamera: "કેમેરો બંધ કરો",
      capturePage: "પેજ કેપ્ચર કરો",
      switchCamera: "કેમેરો બદલો",
      torchOn: "ટોર્ચ: ચાલુ",
      torchOff: "ટોર્ચ: બંધ",
      gridOn: "ગ્રીડ: ચાલુ",
      gridOff: "ગ્રીડ: બંધ",
      zoom: "ઝૂમ",
      autoEnhance: "ઓટો સુધારો",
      pagesCaptured: "સ્કેન કરેલા પેજ",
      exportPdf: "PDF બનાવો",
      analyzeNow: "AI વિશ્લેષણ કરો",
      clearPages: "બધા કાઢી નાખો",
      confidence: "ગુણવત્તા",
      cameraAccessRequired: "કેમેરા પરવાનગી જરૂરી છે. કૃપા કરીને બ્રાઉઝરમાં પરવાનગી આપો.",
      analyzing: "AI દ્વારા દસ્તાવેજ તપાસવામાં આવી રહ્યો છે..."
    },
    analysis: {
      title: "AI મેડિકલ ઇન્ટેલિજન્સ રિપોર્ટ",
      backToDashboard: "ડેશબોર્ડ પર પાછા",
      emailReport: "રિપોર્ટ ઇમેઇલ કરો",
      downloadPdf: "અધિકૃત PDF ડાઉનલોડ કરો",
      patientInfo: "દર્દી અને પરીક્ષણ વિગત",
      patientName: "દર્દીનું નામ",
      ageGender: "ઉંમર / લિંગ",
      reportId: "રિપોર્ટ આઈડી",
      date: "તારીખ",
      laboratory: "લેબોરેટરી",
      orderingPhysician: "ડૉક્ટર",
      overallHealthScore: "AI હેલ્થ સ્કોર",
      riskAssessment: "જોખમ સ્તર",
      executiveSummary: "ક્લિનિકલ સારાંશ",
      biomarkersTitle: "બાયોમાર્કર લેબોરેટરી પ્રોફાઇલ",
      biomarkersSubtitle: "સામાન્ય રેન્જ સાથે સરખામણી અને વિશ્લેષણ.",
      organMatrixTitle: "ઓર્ગન હેલ્થ ઇન્ડેક્સ",
      actionPlanTitle: "વ્યક્તિગત યોજના અને જીવનશૈલી",
      actionPlanSubtitle: "AI આધારિત જીવનશૈલી સુધારા અને ડૉક્ટર સાથે ચર્ચાના મુદ્દા.",
      dietaryGuidance: "ખોરાક સંબંધી માર્ગદર્શન",
      exerciseProtocol: "કસરત અને શારીરિક પ્રવૃત્તિ",
      sleepHydration: "ઊંઘ અને પાણીનું સંતુલન",
      followUpTests: "ભલામણ કરેલ અન્ય પરીક્ષણો",
      questionsForDoctor: "ડૉક્ટરને પૂછવાના પ્રશ્નો",
      rawOcrInspector: "એક્સટ્રેક્ટ થયેલ ટેક્સ્ટ જુઓ (OCR)",
      edit: "સુધારો કરો",
      reanalyze: "ફરી વિશ્લેષણ કરો",
      disclaimer: "મેડિકલ ડિસ્ક્લેમર: આ AI વિશ્લેષણ માત્ર માહિતી માટે છે અને યોગ્ય ડૉક્ટરની સલાહ કે નિદાનનું સ્થાન લેતું નથી.",
      emergencyBannerTitle: "તાત્કાલિક મેડિકલ ચેતવણી: તાબડતોબ ધ્યાન આપો",
      emergencyBannerText: "આ રિપોર્ટમાં કેટલાક બાયોમાર્કર સામાન્ય મર્યાદાથી ઘણા બહાર છે. તાત્કાલિક ડૉક્ટરનો સંપર્ક કરો.",
      bmColName: "બાયોમાર્કર",
      bmColValue: "માપેલ મૂલ્ય",
      bmColRange: "સામાન્ય રેન્જ",
      bmColSignificance: "તબીબી અસરો",
      bmColStatus: "સ્થિતિ"
    },
    compare: {
      title: "મેડિકલ રિપોર્ટ સરખામણી",
      subtitle: "બાયોમાર્કર ટ્રેન્ડ્સ અને પરિણામો વચ્ચે સરખામણી.",
      baseline: "પ્રારંભિક ટેસ્ટ",
      current: "તાજેતરનો ફોલો-અપ ટેસ્ટ",
      delta: "ફેરફાર (ડેલ્ટા)",
      trajectory: "હેલ્થ ટ્રેન્ડ",
      summary: "સરખામણી સારાંશ",
      summaryText: "સુગર અને લિપિડ લેવલમાં નોંધપાત્ર ફેરફાર. 90 દિવસમાં ફરી તપાસની સલાહ.",
      colBiomarker: "બાયોમાર્કર",
      colCategory: "કેટેગરી",
      colBaseline: "પ્રારંભિક",
      colCurrent: "વર્તમાન",
      colDelta: "ફેરફાર",
      colStatus: "સ્થિતિ",
      colNotes: "નોંધ",
      compareNotice: "તમારા જૂના અને નવા રિપોર્ટ વચ્ચે તુલનાત્મક સરખામણી દર્શાવેલ છે."
    },
    chat: {
      title: "મેડીસ્કેન AI ક્લિનિકલ આસિસ્ટન્ટ",
      subtitle: "રિપોર્ટ વિશ્લેષણ, લેબ પરિણામ સમજાવવા, PDF ડાઉનલોડ અને ઇમેઇલ માટે AI સહાયક.",
      welcomeText: "નમસ્તે! હું મેડીસ્કેન AI નો ક્લિનિકલ સહાયક છું. હું માત્ર પ્રશ્નોના જવાબ નથી આપતો — પરંતુ તમારા રિપોર્ટનું વિશ્લેષણ કરી શકું છું, પરિણામો સમજાવી શકું છું, જૂના રિપોર્ટ સાથે સરખામણી કરી શકું છું, PDF ડાઉનલોડ કરી શકું છું અને તમારા ઇમેઇલ પર મોકલી શકું છું. હું તમને શી રીતે મદદ કરી શકું?",
      actionAnalyze: "📊 મારા રિપોર્ટનું વિશ્લેષણ કરો",
      actionExplain: "🩺 મારા પરિણામો સમજાવો",
      actionDownload: "📥 PDF રિપોર્ટ ડાઉનલોડ કરો",
      actionEmail: "✉️ મારા ઇમેઇલ પર મોકલો",
      actionCompare: "🔄 રિપોર્ટ્સની સરખામણી કરો",
      inputPlaceholder: "તમારા રિપોર્ટ, પરિણામો કે ડૉક્ટરની સલાહ વિશે પૂછો...",
      listening: "સાંભળી રહ્યા છીએ (વોઇસ)...",
      speak: "બોલો",
      send: "મોકલો",
      badgeAssistant: "એક્શન એન્જિન: ઓનલાઇન",
      speechToggle: "અવાજ આઉટપુટ",
      analyzingReport: "AI મોડેલ દ્વારા તમારા રિપોર્ટનું વિશ્લેષણ કરવામાં આવી રહ્યું છે...",
      generatingDossier: "ક્લિનિકલ PDF તૈયાર થઈ રહી છે...",
      emailSentSuccess: "વિશ્લેષણ રિપોર્ટ સફળતાપૂર્વક તમારા ઇમેઇલ પર મોકલવામાં આવ્યો છે.",
      emailConfirmTitle: "ક્લિનિકલ રિપોર્ટ મોકલવાની પુષ્ટિ કરો",
      btnConfirmSend: "પુષ્ટિ કરો અને ઇમેઇલ મોકલો"
    },
    admin: {
      title: "એડમિન અને કમ્પ્લાયન્સ પોર્ટલ",
      subtitle: "યુઝર લિસ્ટ, રોલ મેનેજમેન્ટ, ઇમેઇલ લોગ અને ઓડિટ ટ્રેલ.",
      tabUsers: "યુઝર લિસ્ટ",
      tabEmails: "ઇમેઇલ લોગ",
      tabAudit: "ઓડિટ ટ્રેલ",
      totalUsers: "નોંધાયેલા યુઝર્સ",
      totalEmails: "મોકલેલા ઇમેઇલ્સ",
      complianceScore: "HIPAA કમ્પ્લાયન્સ",
      activeSessions: "સક્રિય સેશન",
      userSearchPlaceholder: "નામ, ઇમેઇલ કે રોલ દ્વારા શોધો...",
      filterAllRoles: "બધા રોલ",
      name: "યુઝર",
      role: "રોલ",
      statusCol: "સ્થિતિ",
      reportsCol: "રિપોર્ટ્સ",
      joinedCol: "જોડાવાની તારીખ",
      viewEmail: "ઇમેઇલ જુઓ",
      recipient: "મેળવનાર",
      subject: "વિષય",
      sentAt: "મોકલવાનો સમય",
      statusDelivered: "સફળતાપૂર્વક પહોંચ્યું",
      auditComplianceTrail: "ક્લિનિકલ ઓડિટ અને ડેટા એક્સેસ લોગ",
      auditEvent: "પ્રવૃત્તિ",
      auditTimestamp: "સમય",
      auditActor: "કર્તા",
      auditStatus: "ચકાસણી"
    },
    footer: {
      brandDesc: "મેડિકલ રિપોર્ટ વિશ્લેષણ, કેમેરા સ્કેનિંગ અને જોખમ ઓળખ માટે આધુનિક AI સિસ્ટમ.",
      hipaa: "HIPAA સુસંગત",
      encryption: "AES-256 એન્ક્રિપ્શન",
      clinicalTools: "ક્લિનિકલ ટૂલ્સ",
      aiScanner: "AI કેમેરા સ્કેનર",
      uploadLab: "રિપોર્ટ અપલોડ",
      biomarkerAnalysis: "બાયોમાર્કર વિશ્લેષણ",
      healthTrend: "હેલ્થ ટ્રેન્ડ ચાર્ટ્સ",
      compareTests: "જૂના રિપોર્ટ સરખામણી",
      aiIntelligence: "AI ક્ષમતાઓ",
      assistant: "AI હેલ્થ આસિસ્ટન્ટ",
      auditCompliance: "ઓડિટ અને કમ્પ્લાયન્સ",
      validation: "ક્લિનિકલ વેલિડેશન",
      faq: "પ્રશ્નોત્તરી (FAQ)",
      legal: "કાયદાકીય બાબતો",
      privacy: "પ્રાઇવસી પોલિસી",
      terms: "સેવાની શરતો",
      disclaimerTitle: "મેડિકલ ડિસ્ક્લેમર",
      securityCommitment: "સુરક્ષા પ્રતિબદ્ધતા",
      copyright: "મેડીસ્કેન AI. ક્લિનિકલ ઇન્ટેલિજન્સ પ્લેટફોર્મ."
    },
    games: {
      button: "હેલ્થ ફન",
      title: "મેડીસ્કેન હેલ્થ ગેમ્સ અને જ્ઞાન",
      subtitle: "સ્વાસ્થ્યનું જ્ઞાન વધારવા માટે સરળ રમતો.",
      virusHunter: "વાયરસ હન્ટર",
      pillSort: "દવા ગોઠવણ",
      dnaMatcher: "DNA જોડી",
      heartbeatRhythm: "હૃદયના ધબકારા"
    },
    about: {
      badge: "અમારો ઉદ્દેશ અને ક્લિનિકલ આર્કિટેક્ચર",
      title: "તબીબી બુદ્ધિમત્તાનું લોકશાહીકરણ",
      subtitle: "મેડીસ્કેન AI એ એક ઓપન રિસર્ચ પ્લેટફોર્મ છે જે જટિલ લેબોરેટરી પરિણામો અને દર્દીની સમજ વચ્ચેના અંતરને દૂર કરવા માટે બનાવવામાં આવી છે.",
      card1Title: "ક્લિનિકલ માન્યતા",
      card1Desc: "બાયોમાર્કર મર્યાદાઓ WHO, ADA અને કૉલેજ ઑફ અમેરિકન પેથોલોજિસ્ટ્સ (CAP) ના આંતરરાષ્ટ્રીય ધોરણો સાથે મેળ ખાય છે.",
      card2Title: "દર્દી-કેન્દ્રિત અભિગમ",
      card2Desc: "સરળ ભાષામાં સમજૂતી, જીવનશૈલીમાં જરૂરી ફેરફારો અને ડૉક્ટર સાથેની ચર્ચાની તૈયારી માટે દર્દીઓને સક્ષમ બનાવે છે.",
      card3Title: "ઓપન સાયન્સ ફાઉન્ડેશન",
      card3Desc: "પારદર્શક, ગોપનીયતા-સુરક્ષિત અને વિસ્તૃત કરી શકાય તેવું. સમુદાય સમીક્ષા, હોસ્પિટલ જોડાણ અને આરોગ્ય સમાનતા માટે બનેલું.",
      creditsTitle: "ઓપન-સોર્સ ક્રેડિટ્સ અને લાયસન્સ",
      creditsDesc: "મેડીસ્કેન AI ઓપન-સોર્સ ટેકનોલોજી દ્વારા સંચાલિત છે, જેમાં દસ્તાવેજ OCR મોડલ્સ (Surya OCR, PaddleOCR, DocTR), Recharts, Lucide Icons અને Next.js શામેલ છે (MIT/Apache 2.0 લાયસન્સ)."
    },
    faq: {
      badge: "વારંવાર પૂછાતા પ્રશ્નો",
      title: "આરોગ્ય અને તકનીકી પ્રશ્નોત્તરી",
      subtitle: "સચોટતા, સુરક્ષા, ગોપનીયતા અને ક્લિનિકલ સમજણ સંબંધિત સામાન્ય પ્રશ્નોના જવાબો.",
      q1: "મેડીસ્કેન AI મારા મેડિકલ રિપોર્ટમાંથી બાયોમાર્કર્સ કેવી રીતે કાઢે છે?",
      a1: "મેડીસ્કેન AI અદ્યતન OCR અને વિઝન મોડેલ્સનો ઉપયોગ કરે છે. તે દસ્તાવેજના ખૂણા સુધારી, અવાજ દૂર કરી અને કોષ્ટક વાંચીને લેબોરેટરી બાયોમાર્કર્સનું વિશ્લેષણ કરે છે.",
      q2: "શું મેડીસ્કેન AI ડૉક્ટર અથવા પેથોલોજિસ્ટના નિદાનનું સ્થાન લઈ શકે છે?",
      a2: "ના. મેડીસ્કેન AI ફક્ત માહિતી અને શૈક્ષણિક હેતુઓ માટેનું સાધન છે. તે રિપોર્ટ સમજવામાં અને ડૉક્ટર માટે પ્રશ્નો તૈયાર કરવામાં મદદ કરે છે, પરંતુ ડૉક્ટરી નિદાન કે દવા સૂચવતું નથી.",
      q3: "HIPAA અને GDPR હેઠળ દર્દીની ગોપનીયતા કેવી રીતે સુરક્ષિત રહે છે?",
      a3: "બધી પ્રક્રિયા સંપૂર્ણપણે સુરક્ષિત છે. અમે તમારી અંગત સ્વાસ્થ્ય માહિતી ક્યારેય વેચતા કે શેર કરતા નથી. તમામ નેટવર્ક ટ્રાન્સમિશન AES-256 સુરક્ષિત છે.",
      q4: "જો કોઈ ગંભીર કે કટોકટી મૂલ્ય જણાય તો શું થાય છે?",
      a4: "પ્લેટફોર્મ તરત જ લાલ પલ્સ એલર્ટ બેનર અને ઑડિયો ચેતવણી દર્શાવે છે અને તાત્કાલિક ડૉક્ટરનો સંપર્ક કરવાની સલાહ આપે છે.",
      q5: "કયા લેબોરેટરી ટેસ્ટ સપોર્ટ થાય છે?",
      a5: "60 થી વધુ બાયોમાર્કર્સ સપોર્ટેડ છે, જેમાં CBC, લિપિડ પ્રોફાઇલ, ડાયાબિટીસ (HbA1c), કિડની (KFT), લિવર (LFT), થાઇરોઇડ (TSH), વિટામિન D3 અને B12 શામેલ છે."
    },
    privacy: {
      title: "પ્રાઇવસી પોલિસી",
      lastUpdated: "છેલ્લું અપડેટ: ઓગસ્ટ 2026 | HIPAA અને GDPR સુસંગત",
      s1Title: "1. ઝીરો-નોલેજ પ્રોસેસિંગ",
      s1Desc: "મેડીસ્કેન AI દર્દીની ગોપનીયતાનું સંપૂર્ણ સન્માન કરે છે. કૅમેરા સ્કેન કે અપલોડ કરેલ દસ્તાવેજો સંપૂર્ણ સુરક્ષિત રીતે પ્રોસેસ થાય છે.",
      s2Title: "2. સુરક્ષિત આરોગ્ય માહિતી (PHI)",
      s2Desc: "અમે જાહેરાત માટે ક્યારેય દર્દીનો ડેટા વેચતા કે ભાડે આપતા નથી. દર્દીના નામ અને પરિણામો સુરક્ષિત રહે છે.",
      s3Title: "3. ક્રિપ્ટોગ્રાફિક ટ્રાન્સમિશન",
      s3Desc: "તમારા ઉપકરણ અને સર્વર વચ્ચેનો તમામ ડેટા TLS 1.3 અને AES-256-GCM એન્ક્રિપ્શન સાથે સુરક્ષિત રહે છે."
    },
    terms: {
      title: "સેવાની શરતો અને મેડિકલ ડિસ્ક્લેમર",
      lastUpdated: "છેલ્લું અપડેટ: ઓગસ્ટ 2026",
      noticeTitle: "ફરજિયાત તબીબી સૂચના:",
      noticeDesc: "મેડીસ્કેન AI દ્વારા પૂરી પાડવામાં આવેલ સેવાઓ કોઈપણ તબીબી સલાહ, નિદાન કે સારવાર આપતી નથી. તે ફક્ત શૈક્ષણિક અને માહિતી હેતુ માટે છે.",
      s1Title: "1. ડૉક્ટર-દર્દી સંબંધ નથી",
      s1Desc: "આ પ્લેટફોર્મનો ઉપયોગ કોઈ ડૉક્ટર-દર્દી સંબંધ સ્થાપિત કરતો નથી. તમારે ક્યારેય વ્યાવસાયિક ડૉક્ટરની સલાહની અવગણના કરવી જોઈએ નહીં.",
      s2Title: "2. કટોકટી તબીબી પરિસ્થિતિઓ",
      s2Desc: "જો તમને લાગે કે તમે કોઈ તબીબી કટોકટી, છાતીમાં દુખાવો અથવા શ્વાસ લેવામાં ગંભીર તકલીફ અનુભવી રહ્યા છો, તો તરત જ ઇમરજન્સી નંબર (108/112) પર કૉલ કરો અથવા નજીકની હોસ્પિટલ પહોંચો.",
      s3Title: "3. ઓપન-સોર્સ લાયસન્સ (MIT)",
      s3Desc: "મેડીસ્કેન AI MIT ઓપન સોર્સ લાયસન્સ હેઠળ ઉપલબ્ધ છે. સોફ્ટવેર કોઈપણ વોરંટી વિના પૂરું પાડવામાં આવે છે."
    },
    ai: {
      title: "AI ક્લિનિકલ બુદ્ધિમત્તા",
      answer: "તબીબી જવાબ",
      actionAnalyzing: "તમારા રિપોર્ટનું વિશ્લેષણ શરૂ થયું છે. બાયોમાર્કર્સ અને ક્લિનિકલ પરિમાણોની ચકાસણી ચાલુ છે...",
      actionCompleted: "રિપોર્ટ વિશ્લેષણ સફળતાપૂર્વક પૂર્ણ થયું.",
      actionDownloadSuccess: "સત્તાવાર PDF ક્લિનિકલ ડૉસિયર જનરેટ અને ડાઉનલોડ થઈ ગયું છે.",
      actionEmailConfirmPrompt: "તમારો પૂર્ણ રિપોર્ટ મળી ગયો છે. શું તમે તમારા રજિસ્ટર્ડ ઇમેઇલ પર સારાંશ મોકલવા માંગો છો?",
      actionEmailDispatched: "ક્લિનિકલ સારાંશ તમારા રજિસ્ટર્ડ ઇમેઇલ સરનામે સફળતાપૂર્વક મોકલવામાં આવ્યો છે.",
      actionCompareNotice: "રિપોર્ટ સરખામણી પૂર્ણ થઈ. અગાઉના અને હાલના તફાવતો નોંધાયા.",
      suggestionsTitle: "AI સૂચનો અને ભલામણો",
      suggestionsSubtitle: "તમારા લેબોરેટરી પરિણામો પર આધારિત વ્યક્તિગત અને સચોટ માર્ગદર્શન.",
      nutritionTitle: "પોષણ માર્ગદર્શન",
      lifestyleTitle: "જીવનશૈલી સુધારણા",
      monitoringTitle: "ધ્યાન રાખવા યોગ્ય બાબતો",
      followUpTitle: "વ્યાવસાયિક તબીબી સલાહ",
      conditionsTitle: "સંભવિત પરિસ્થિતિઓ",
      conditionsSubtitle: "બાયોમાર્કર પરિણામો સાથે જોડાયેલા સંભવિત સંકેતો. આ કોઈ ચોક્કસ તબીબી નિદાન નથી.",
      conditionHeader: "સંભવિત સ્થિતિ",
      supportingFinding: "સહાયક રિપોર્ટ પરિણામ",
      observedValue: "માપેલ મૂલ્ય",
      refRange: "સામાન્ય મર્યાદા (Reference Range)",
      noRefRange: "રિપોર્ટમાં સામાન્ય મર્યાદા આપવામાં આવી નથી.",
      explanation: "તબીબી સમજૂતી",
      nextStep: "ભલામણ કરેલ આગલું પગલું",
      severityNote: "માત્ર આ રિપોર્ટના આધારે ગંભીરતા નક્કી કરી શકાતી નથી.",
      keyFindingsTitle: "મુખ્ય લેબોરેટરી તારણો",
      keyFindingsSubtitle: "પ્રાથમિક બાયોમાર્કર્સ, સામાન્ય મર્યાદાઓ અને સ્થિતિનું વાસ્તવિક વિશ્લેષણ.",
      statusWithin: "સામાન્ય મર્યાદામાં",
      statusBelow: "સામાન્ય મર્યાદા કરતાં ઓછું",
      statusAbove: "સામાન્ય મર્યાદા કરતાં વધુ",
      statusCritical: "તાત્કાલિક પગલાં જરૂરી",
      clarificationPrompt: "શું તમે રિપોર્ટનું વિશ્લેષણ કરાવવા માંગો છો કે પરિણામ સમજવા માંગો છો?",
      clarificationOptionAnalyze: "રિપોર્ટ વિશ્લેષણ કરો",
      clarificationOptionExplain: "પરિણામ સમજાવો",
      greetingReply: "નમસ્તે! હું તમારો મેડીસ્કેન AI ક્લિનિકલ આસિસ્ટન્ટ છું. તમે તબીબી પ્રશ્નો પૂછી શકો છો અથવા રિપોર્ટ વિશ્લેષણ, સમજૂતી કે ડાઉનલોડની વિનંતી કરી શકો છો.",
      generalConversationReply: "હું તમારા મેડિકલ રિપોર્ટ્સ અને સ્વાસ્થ્ય પ્રશ્નોમાં મદદ કરવા માટે તૈયાર છું. હું તમને કેવી રીતે મદદ કરી શકું?",
      noReportContextFound: "હાલના સત્રમાં કોઈ સક્રિય રિપોર્ટ મળ્યો નથી. કૃપા કરીને વ્યક્તિગત વિગતો જોવા માટે રિપોર્ટ અપલોડ અથવા સ્કેન કરો.",
      disclaimer: "મેડીસ્કેન AI માત્ર માહિતી અને શૈક્ષણિક હેતુઓ માટે છે. તે ડૉક્ટરના નિદાન કે સારવારનું સ્થાન લેતું નથી.",
      errorAnalysisFailed: "અમે આ રિપોર્ટનું વિશ્વસનીય રીતે વિશ્લેષણ કરી શક્યા નથી. કૃપા કરીને રિપોર્ટ તપાસો અથવા ફરી પ્રયાસ કરો."
    }
  }
};
