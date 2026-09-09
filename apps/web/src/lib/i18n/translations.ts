export type Language = 'en' | 'hi' | 'gu';

export const translations = {
  en: {
    nav: {
      brand: "MediScan AI",
      home: "Home",
      scanner: "Camera Scanner",
      upload: "Upload Report",
      analysis: "AI Analysis",
      dashboard: "Analytics & Trends",
      compare: "Compare Reports",
      chat: "AI Assistant",
      games: "Health Fun",
      admin: "Admin & Compliance"
    },
    hero: {
      badge: "Next-Gen AI Healthcare Intelligence",
      title: "Decipher Complex Medical Reports in Seconds",
      subtitle: "Enterprise-grade document AI, real-time camera scanning, clinical biomarker interpretation, and proactive health risk detection.",
      ctaScan: "Launch Camera Scanner",
      ctaUpload: "Upload Medical Report",
      demoReport: "Load Clinical Sample",
      statAccuracy: "99.4% OCR Precision",
      statBiomarkers: "60+ Biomarkers Detected",
      statSpeed: "< 1.5s AI Analysis"
    },
    scanner: {
      title: "Smart AI Camera Scanner",
      subtitle: "High-resolution multi-page document scanning with real-time edge detection, auto-crop, and deskew.",
      startCamera: "Start Camera",
      stopCamera: "Stop Camera",
      capturePage: "Capture Page",
      switchCamera: "Switch Lens",
      torchOn: "Torch On",
      torchOff: "Torch Off",
      zoom: "Zoom",
      pagesCaptured: "Pages Captured",
      autoEnhance: "Auto Enhance & Sharpen",
      exportPdf: "Export PDF",
      analyzeNow: "Analyze with AI",
      cameraAccessRequired: "Camera Access Required. Please enable camera permissions in your browser."
    },
    upload: {
      title: "Upload Medical Reports",
      subtitle: "Supports PDFs, JPGs, PNGs, multi-page documents, and DICOM summary sheets.",
      dragDrop: "Drag and drop your medical report here, or click to browse",
      supportedFormats: "Supported formats: PDF, PNG, JPG, WEBP, ZIP up to 50MB",
      orUseSample: "Or test immediately with pre-loaded clinical scenarios:",
      sampleMetabolic: "Metabolic & Diabetic Panel (Moderate Risk)",
      sampleCardiac: "Cardiac Emergency Panel (Critical Alert)",
      sampleNormal: "Comprehensive Wellness Checkup (Normal/Optimal)"
    },
    analysis: {
      title: "AI Medical Intelligence Report",
      executiveSummary: "Clinical Executive Summary",
      healthScore: "AI Health Score",
      riskLevel: "Overall Risk Level",
      biomarkers: "Biomarker Breakdown",
      organHealth: "Organ Health Matrix",
      actionPlan: "Personalized Action Plan",
      diet: "Dietary Suggestions",
      exercise: "Physical Activity Plan",
      lifestyle: "Hydration & Sleep Protocol",
      questionsDoctor: "Questions for Your Doctor",
      followUp: "Recommended Follow-up Tests",
      disclaimer: "Medical Disclaimer: This AI-generated analysis is for informational purposes only and is not a substitute for diagnosis, treatment, or advice from a qualified healthcare professional.",
      exportPdf: "Download Clinical Report (PDF)"
    },
    emergency: {
      criticalAlert: "Critical Medical Alert",
      urgentAdvice: "This report contains biomarkers requiring urgent clinical evaluation. Please consult a physician or seek emergency medical attention if symptoms persist.",
      soundOn: "Alert Tone: ON",
      soundOff: "Alert Tone: OFF"
    },
    chat: {
      title: "MediScan AI Clinical Assistant",
      subtitle: "Ask questions regarding lab values, medical terminology, diet, or doctor appointments.",
      placeholder: "e.g. Why is my HbA1c elevated? What should I ask my doctor?",
      listening: "Listening (Speech-to-Text)...",
      speak: "Speak",
      send: "Send"
    },
    games: {
      button: "Health Fun",
      title: "MediScan Health Fun & Learning",
      subtitle: "Interactive micro-games to build medical knowledge while taking a healthy break.",
      virusHunter: "Virus Hunter",
      pillSort: "Pill Sort Challenge",
      dnaMatcher: "DNA Base Matcher",
      heartbeatRhythm: "Heartbeat Rhythm"
    }
  },
  hi: {
    nav: {
      brand: "मेडीस्कैन AI",
      home: "होम",
      scanner: "कैमरा स्कैनर",
      upload: "रिपोर्ट अपलोड",
      analysis: "AI विश्लेषण",
      dashboard: "एनालिटिक्स व ट्रेंड्स",
      compare: "रिपोर्ट तुलना",
      chat: "AI सहायक",
      games: "हेल्थ फन",
      admin: "प्रशासन व अनुपालन"
    },
    hero: {
      badge: "अगली पीढ़ी की AI स्वास्थ्य प्रणाली",
      title: "जटिल मेडिकल रिपोर्ट को सेकंडों में समझें",
      subtitle: "उन्नत दस्तावेज़ AI, रीयल-टाइम कैमरा स्कैनिंग, बायोमार्कर विश्लेषण और त्वरित स्वास्थ्य जोखिम पहचान।",
      ctaScan: "कैमरा स्कैनर शुरू करें",
      ctaUpload: "रिपोर्ट अपलोड करें",
      demoReport: "नमूना रिपोर्ट देखें",
      statAccuracy: "99.4% OCR सटीकता",
      statBiomarkers: "60+ बायोमार्कर समर्थित",
      statSpeed: "< 1.5s AI विश्लेषण"
    },
    scanner: {
      title: "स्मार्ट AI कैमरा स्कैनर",
      subtitle: "रीयल-टाइम एज डिटेक्शन, ऑटो-क्रॉप और उच्च रिज़ॉल्यूशन मल्टी-पेज स्कैनिंग।",
      startCamera: "कैमरा चालू करें",
      stopCamera: "कैमरा बंद करें",
      capturePage: "पेज कैप्चर करें",
      switchCamera: "कैमरा बदलें",
      torchOn: "टॉर्च चालू",
      torchOff: "टॉर्च बंद",
      zoom: "ज़ूम",
      pagesCaptured: "स्कैन किए गए पृष्ठ",
      autoEnhance: "स्वचालित छवि सुधार",
      exportPdf: "PDF बनाएं",
      analyzeNow: "AI से विश्लेषण करें",
      cameraAccessRequired: "कैमरा अनुमति आवश्यक है। कृपया ब्राउज़र में अनुमति दें।"
    },
    upload: {
      title: "मेडिकल रिपोर्ट अपलोड करें",
      subtitle: "PDF, JPG, PNG और मल्टी-पेज दस्तावेज़ समर्थित हैं।",
      dragDrop: "अपनी मेडिकल रिपोर्ट यहाँ खींचें और छोड़ें, या फ़ाइल चुनें",
      supportedFormats: "समर्थित प्रारूप: PDF, PNG, JPG, WEBP (अधिकतम 50MB)",
      orUseSample: "या तुरंत इन नमूनों के साथ परीक्षण करें:",
      sampleMetabolic: "मेटाबोलिक व डायबिटिक पैनल (मध्यम जोखिम)",
      sampleCardiac: "कार्डियक आपातकालीन पैनल (गंभीर चेतावनी)",
      sampleNormal: "संपूर्ण स्वास्थ्य जांच (सामान्य/उत्तम)"
    },
    analysis: {
      title: "AI मेडिकल इंटेलिजेंस रिपोर्ट",
      executiveSummary: "नैदानिक सारांश",
      healthScore: "AI स्वास्थ्य स्कोर",
      riskLevel: "जोखिम स्तर",
      biomarkers: "बायोमार्कर विवरण",
      organHealth: "अंग स्वास्थ्य स्कोर",
      actionPlan: "व्यक्तिगत कार्य योजना",
      diet: "आहार संबंधी सुझाव",
      exercise: "व्यायाम योजना",
      lifestyle: "जल व नींद नियम",
      questionsDoctor: "डॉक्टर से पूछने योग्य प्रश्न",
      followUp: "अनुशंसित अनुवर्ती परीक्षण",
      disclaimer: "चिकित्सा अस्वीकरण: यह AI-जनरेटेड विश्लेषण केवल सूचना के उद्देश्यों के लिए है और किसी योग्य चिकित्सक के परामर्श का विकल्प नहीं है।",
      exportPdf: "रिपोर्ट डाउनलोड करें (PDF)"
    },
    emergency: {
      criticalAlert: "अत्यावश्यक चिकित्सा चेतावनी",
      urgentAdvice: "इस रिपोर्ट में ऐसे बायोमार्कर हैं जिन पर तुरंत डॉक्टर की सलाह आवश्यक है। कृपया तत्काल चिकित्सक से संपर्क करें।",
      soundOn: "अलर्ट टोन: चालू",
      soundOff: "अलर्ट टोन: बंद"
    },
    chat: {
      title: "मेडीस्कैन AI स्वास्थ्य सहायक",
      subtitle: "लैब रिपोर्ट, मेडिकल शब्द या डॉक्टर परामर्श की तैयारी के बारे में पूछें।",
      placeholder: "उदा. मेरा HbA1c स्तर अधिक क्यों है? मुझे डॉक्टर से क्या पूछना चाहिए?",
      listening: "सुन रहे हैं (आवाज़ से टेक्स्ट)...",
      speak: "बोलें",
      send: "भेजें"
    },
    games: {
      button: "हेल्थ फन",
      title: "मेडीस्कैन हेल्थ गेम्स व शिक्षा",
      subtitle: "स्वास्थ्य ज्ञान बढ़ाने के लिए मनोरंजक खेल।",
      virusHunter: "वायरस हंटर",
      pillSort: "दवा छँटाई चुनौती",
      dnaMatcher: "DNA बेस मिलान",
      heartbeatRhythm: "हार्टबीट रिदम"
    }
  },
  gu: {
    nav: {
      brand: "મેડીસ્કેન AI",
      home: "હોમ",
      scanner: "કેમેરા સ્કેનર",
      upload: "રિપોર્ટ અપલોડ",
      analysis: "AI વિશ્લેષણ",
      dashboard: "એનાલિટિક્સ",
      compare: "તુલના",
      chat: "AI સહાયક",
      games: "હેલ્થ ફન",
      admin: "એડમિન"
    },
    hero: {
      badge: "આધુનિક AI હેલ્થકેર સિસ્ટમ",
      title: "જટિલ મેડિકલ રિપોર્ટ સરળતાથી સમજો",
      subtitle: "ઉચ્ચ-ગુણવત્તાવાળું AI, રીઅલ-ટાઇમ કેમેરા સ્કેનિંગ અને બાયોમાર્કર વિશ્લેષણ.",
      ctaScan: "કેમેરા સ્કેનર શરૂ કરો",
      ctaUpload: "રિપોર્ટ અપલોડ કરો",
      demoReport: "ડેમો રિપોર્ટ જુઓ",
      statAccuracy: "99.4% OCR ચોકસાઈ",
      statBiomarkers: "60+ બાયોમાર્કર્સ",
      statSpeed: "< 1.5 સેકન્ડ AI ઝડપ"
    },
    scanner: {
      title: "સ્માર્ટ AI કેમેરા સ્કેનર",
      subtitle: "રીઅલ-ટાઇમ એજ ડિટેક્શન અને ઓટો-ક્રોપ સાથે મલ્ટી-પેજ સ્કેનિંગ.",
      startCamera: "કેમેરો ચાલુ કરો",
      stopCamera: "કેમેરો બંધ કરો",
      capturePage: "પેજ કેપ્ચર કરો",
      switchCamera: "કેમેરો બદલો",
      torchOn: "ટોર્ચ ચાલુ",
      torchOff: "ટોર્ચ બંધ",
      zoom: "ઝૂમ",
      pagesCaptured: "સ્કેન કરેલા પેજ",
      autoEnhance: "ઇમેજ સુધારો",
      exportPdf: "PDF બનાવો",
      analyzeNow: "AI વિશ્લેષણ કરો",
      cameraAccessRequired: "કેમેરા પરવાનગી જરૂરી છે."
    },
    upload: {
      title: "મેડિકલ રિપોર્ટ અપલોડ કરો",
      subtitle: "PDF, JPG, PNG અને મલ્ટી-પેજ ડોક્યુમેન્ટ્સ સપોર્ટેડ છે.",
      dragDrop: "અહીં તમારી ફાઇલ ખેંચો અથવા બ્રાઉઝ કરો",
      supportedFormats: "માન્ય ફોર્મેટ: PDF, PNG, JPG (મહત્તમ 50MB)",
      orUseSample: "અથવા આ તૈયાર સેમ્પલ સાથે તપાસો:",
      sampleMetabolic: "ડાયાબિટીક અને લિપિડ પેનલ (મધ્યમ જોખમ)",
      sampleCardiac: "કાર્ડિયાક કટોકટી પેનલ (ગંભીર ચેતવણી)",
      sampleNormal: "સામાન્ય હેલ્થ ચેકઅપ (સામાન્ય)"
    },
    analysis: {
      title: "AI મેડિકલ ઇન્ટેલિજન્સ રિપોર્ટ",
      executiveSummary: "ક્લિનિકલ સારાંશ",
      healthScore: "AI હેલ્થ સ્કોર",
      riskLevel: "જોખમ સ્તર",
      biomarkers: "બાયોમાર્કર વિગતો",
      organHealth: "ઓર્ગન હેલ્થ સ્કોર",
      actionPlan: "વ્યક્તિગત યોજના",
      diet: "ખોરાકની સલાહ",
      exercise: "કસરતની યોજના",
      lifestyle: "પાણી અને ઊંઘ",
      questionsDoctor: "ડૉક્ટરને પૂછવાના પ્રશ્નો",
      followUp: "ભલામણ કરેલ પરીક્ષણો",
      disclaimer: "મેડિકલ ડિસ્ક્લેમર: આ AI વિશ્લેષણ માત્ર માહિતી માટે છે અને યોગ્ય ડૉક્ટરની સલાહનું સ્થાન લેતું નથી.",
      exportPdf: "PDF ડાઉનલોડ કરો"
    },
    emergency: {
      criticalAlert: "તાત્કાલિક મેડિકલ ચેતવણી",
      urgentAdvice: "આ રિપોર્ટમાં એવા પરિણામો છે જેના માટે તુરંત ડૉક્ટરનો સંપર્ક કરવો જરૂરી છે.",
      soundOn: "ચેતવણી અવાજ: ચાલુ",
      soundOff: "ચેતવણી અવાજ: બંધ"
    },
    chat: {
      title: "AI હેલ્થ આસિસ્ટન્ટ",
      subtitle: "તમારા રિપોર્ટ કે તબીબી શબ્દો વિશે કોઈપણ પ્રશ્ન પૂછો.",
      placeholder: "દા.ત. મારો સુગર લેવલ કેમ વધુ છે?",
      listening: "સાંભળી રહ્યા છીએ...",
      speak: "બોલો",
      send: "મોકલો"
    },
    games: {
      button: "હેલ્થ ફન",
      title: "હેલ્થ ગેમ્સ અને જ્ઞાન",
      subtitle: "સ્વાસ્થ્યનું જ્ઞાન વધારવા માટે સરળ રમતો.",
      virusHunter: "વાયરસ હન્ટર",
      pillSort: "દવા ગોઠવણ",
      dnaMatcher: "DNA જોડી",
      heartbeatRhythm: "હૃદયના ધબકારા"
    }
  }
};
