/**
 * MediScan AI - Hybrid Intent Router
 *
 * Dispatches user input into:
 * - ACTION: Direct execution via existing Action Engine (analyze, download, email, compare, scan, upload, history)
 * - REPORT_FOLLOW_UP_QUESTION: Questions referencing the active/latest report context
 * - QUESTION: General conversational medical educational Q&A
 * - GREETING: Friendly clinical greeting
 * - GENERAL_CONVERSATION: Pleasantries and conversational responses
 * - UNKNOWN: Ambiguous inputs prompting clarification
 */

export type HybridCategory =
  | 'ACTION'
  | 'REPORT_FOLLOW_UP_QUESTION'
  | 'QUESTION'
  | 'GREETING'
  | 'GENERAL_CONVERSATION'
  | 'UNKNOWN';

export type ActionSubIntent =
  | 'ANALYZE_REPORT'
  | 'EXPLAIN_REPORT'
  | 'SCAN_REPORT'
  | 'UPLOAD_REPORT'
  | 'DOWNLOAD_REPORT'
  | 'EMAIL_REPORT'
  | 'CONFIRM_SEND_EMAIL'
  | 'COMPARE_REPORTS'
  | 'VIEW_HISTORY'
  | 'VIEW_RESULT'
  | 'HELP';

export interface ClassifiedIntent {
  category: HybridCategory;
  actionSubIntent?: ActionSubIntent;
  targetBiomarker?: string;
  clarificationRequired?: boolean;
}

export function detectHybridIntent(
  query: string,
  hasReportContext: boolean = false
): ClassifiedIntent {
  const msg = query.toLowerCase().trim();

  // -------------------------------------------------------------
  // 1. GREETINGS
  // -------------------------------------------------------------
  if (/^(hi|hello|hey|greetings|namaste|kem cho|pranam|good morning|good afternoon|good evening)\b[!.?]?$/i.test(msg)) {
    return { category: 'GREETING' };
  }

  // -------------------------------------------------------------
  // 2. GENERAL CONVERSATION / PLEASANTRIES
  // -------------------------------------------------------------
  if (
    /^(how are you|how do you do|who are you|thanks|thank you|shukriya|dhanyawad|aabhar|bye|goodbye|see you)\b/i.test(msg) ||
    /^(what can you do|who made you)\b/i.test(msg)
  ) {
    if (/what can you do/i.test(msg)) {
      return { category: 'ACTION', actionSubIntent: 'HELP' };
    }
    return { category: 'GENERAL_CONVERSATION' };
  }

  // -------------------------------------------------------------
  // 3. ACTION INTENTS (HIGHEST SPECIFICITY FIRST)
  // -------------------------------------------------------------

  // 3.1 Email Report
  if (
    /\b(email|mail|send)\b.*?\b(report|summary|result|results|analysis|file|dossier|pdf)\b/i.test(msg) ||
    /\b(send to my email|email my report|mail this|send my report|email it to me|send the pdf to my email|receive my report by email)\b/i.test(msg) ||
    /(ईमेल|मेल).*?(रिपोर्ट|भेजें)/i.test(msg) ||
    /(રિપોર્ટ|ઇમેઇલ|મોકલો)/i.test(msg)
  ) {
    return { category: 'ACTION', actionSubIntent: 'EMAIL_REPORT' };
  }

  // 3.2 Download PDF Report
  if (
    /\b(download|export|generate|get|give me)\b.*?\b(pdf|dossier)\b/i.test(msg) ||
    /\b(download|export|save)\b.*?\b(report|analysis|result|results|file)\b/i.test(msg) ||
    /\b(download pdf report|download my report|give me my report pdf|i want a pdf|download report as pdf|get report pdf)\b/i.test(msg) ||
    /(डाउनलोड|पीडीएफ|ડાઉનલોડ|પીડીએફ)/i.test(msg)
  ) {
    return { category: 'ACTION', actionSubIntent: 'DOWNLOAD_REPORT' };
  }

  // 3.3 Compare Reports
  if (
    /\b(compare|comparison|difference|delta|trend|trends)\b.*?\b(report|reports|test|tests|result|results|previous|baseline)\b/i.test(msg) ||
    /\b(compare my reports|compare two reports|compare reports|has my result changed|compare this with|view delta)\b/i.test(msg) ||
    /(तुलना|पिछली रिपोर्ट|अंतर|સરખામણી|જૂનો રિપોર્ટ|તફાવત)/i.test(msg)
  ) {
    return { category: 'ACTION', actionSubIntent: 'COMPARE_REPORTS' };
  }

  // 3.4 Camera Scan Report
  if (
    /\b(camera|scanner|camera scan|start camera|scan document)\b/i.test(msg) ||
    /(कैमरा|स्कैनर|कैमरा स्कैन|કેમેરા|સ્કેનર)/i.test(msg)
  ) {
    return { category: 'ACTION', actionSubIntent: 'SCAN_REPORT' };
  }

  // 3.5 Upload Report
  if (
    /\b(upload|add report|new report|new test|drag and drop|ingest report|upload my report|upload a medical report)\b/i.test(msg) ||
    /(अपलोड|नई रिपोर्ट|अस्पताल रिपोर्ट|અપલોડ|નવો રિપોર્ટ)/i.test(msg)
  ) {
    return { category: 'ACTION', actionSubIntent: 'UPLOAD_REPORT' };
  }

  // 3.6 Explain Report / Results
  if (
    /\b(explain|interpret|breakdown)\b.*?\b(result|results|report|findings|test|lab|dossier|medical report)\b/i.test(msg) ||
    /\b(what does (my|this|the) report mean|what do (my|these) results mean|explain my results|explain my report|can you explain my results)\b/i.test(msg) ||
    /(समझाओ|परिणाम समझाओ|रिपोर्ट समझाओ|વિગતવાર સમજાવો|પરિણામ સમજાવો)/i.test(msg)
  ) {
    return { category: 'ACTION', actionSubIntent: 'EXPLAIN_REPORT' };
  }

  // 3.7 View Report / History
  if (
    /\b(show|open|view|display)\b.*?\b(my report|this report|the report|my results|my test)\b/i.test(msg) ||
    /\b(show my report|open my report|view my report|view report)\b/i.test(msg)
  ) {
    return { category: 'ACTION', actionSubIntent: 'VIEW_RESULT' };
  }
  if (
    /\b(history|previous tests|all reports|past tests|my records|my history|medical history)\b/i.test(msg) ||
    /\b(view my history|view my medical history)\b/i.test(msg) ||
    /(इतिहास|पुराने टेस्ट|मेरे रिकॉर्ड|ઇતિહાસ|જૂના ટેસ્ટ|મારા રેકોર્ડ)/i.test(msg)
  ) {
    return { category: 'ACTION', actionSubIntent: 'VIEW_HISTORY' };
  }

  // 3.8 Analyze Report
  if (
    /\b(analyze|scan|check|evaluate|process|inspect|review)\b.*?\b(report|scan|file|document|image|blood work|lab|test|medical report)\b/i.test(msg) ||
    /\b(analyze my report|scan my report|check my report|analyze this report|analyze this|check this report|check my test)\b/i.test(msg) ||
    /(मेरी रिपोर्ट का विश्लेषण|रिपोर्ट जांचो|रिपोर्ट स्कैन|વિશ્લેષણ કરો|રિપોર્ટ તપાસો)/i.test(msg)
  ) {
    return { category: 'ACTION', actionSubIntent: 'ANALYZE_REPORT' };
  }

  // 3.9 Help & Capabilities
  if (/\b(help|how to use|commands|features|capabilities)\b/i.test(msg)) {
    return { category: 'ACTION', actionSubIntent: 'HELP' };
  }

  // -------------------------------------------------------------
  // 4. REPORT FOLLOW-UP QUESTIONS (Context-Aware)
  // -------------------------------------------------------------

  const isPersonalReportReference =
    /\b(my report|this result|this report|my results|my test|my values|these findings|this finding)\b/i.test(msg) ||
    /\b(my hemoglobin|my glucose|my hba1c|my cholesterol|my creatinine|my wbc|my platelets|my tsh|my vitamin)\b/i.test(msg) ||
    /(मेरी रिपोर्ट|मेरा रिजल्ट|मेरा हीमोग्लोबिन|मेरा शुगर|મારો રિપોર્ટ|મારું રિઝલ્ટ|મારું હિમોગ્લોબિન|મારી સુગર)/i.test(msg);

  const isFollowUpPronoun =
    /\b(what does this mean|what does it mean|why is this low|why is this high|is this normal|is this dangerous|what should i do|what can i do about it)\b/i.test(msg) ||
    /\b(what should i eat|should i see a doctor|when should i see a doctor|what lifestyle changes|what diet)\b/i.test(msg) ||
    /(इसका क्या मतलब है|मुझे क्या खाना चाहिए|क्या मुझे डॉक्टर को दिखाना चाहिए|આનો શું અર્થ છે|મારે શું ખાવું જોઈએ|શું મારે ડૉક્ટરને મળવું જોઈએ)/i.test(msg);

  if (isPersonalReportReference || (isFollowUpPronoun && hasReportContext)) {
    const biomarkerMatch = extractBiomarkerName(msg);
    return {
      category: 'REPORT_FOLLOW_UP_QUESTION',
      targetBiomarker: biomarkerMatch
    };
  }

  // -------------------------------------------------------------
  // 5. CONVERSATIONAL MEDICAL QUESTIONS (General Q&A)
  // -------------------------------------------------------------

  const isQuestionForm =
    /^(what is|what are|what does|why is|why are|how does|how is|explain|tell me about)\b/i.test(msg) ||
    /(क्या है|किसे कहते हैं|का क्या मतलब है|क्यों जरूरी है|શું છે|એટલે શું|શા માટે જરૂરી છે)/i.test(msg) ||
    msg.endsWith('?');

  const detectedBiomarker = extractBiomarkerName(msg);

  if (isQuestionForm || detectedBiomarker) {
    return {
      category: 'QUESTION',
      targetBiomarker: detectedBiomarker
    };
  }

  // -------------------------------------------------------------
  // 6. AMBIGUOUS / UNKNOWN INTENT
  // -------------------------------------------------------------
  if (/\b(report|test|results)\b/i.test(msg)) {
    return {
      category: 'UNKNOWN',
      clarificationRequired: true
    };
  }

  return { category: 'GENERAL_CONVERSATION' };
}

export function extractBiomarkerName(msg: string): string | undefined {
  const terms: Record<string, string> = {
    'hemoglobin': 'Hemoglobin',
    'hb': 'Hemoglobin',
    'heamoglobin': 'Hemoglobin',
    'हीमोग्लोबिन': 'Hemoglobin',
    'હિમોગ્લોબિન': 'Hemoglobin',
    'hba1c': 'HbA1c',
    'glucose': 'Fasting Blood Glucose',
    'sugar': 'Fasting Blood Glucose',
    'diabetes': 'Fasting Blood Glucose',
    'शुगर': 'Fasting Blood Glucose',
    'ડાયાબિટીસ': 'Fasting Blood Glucose',
    'wbc': 'White Blood Cells (WBC)',
    'tlc': 'White Blood Cells (WBC)',
    'leukocyte': 'White Blood Cells (WBC)',
    'platelet': 'Platelet Count',
    'platelets': 'Platelet Count',
    'plt': 'Platelet Count',
    'cholesterol': 'Total Cholesterol',
    'ldl': 'LDL Cholesterol',
    'hdl': 'HDL Cholesterol',
    'triglyceride': 'Triglycerides',
    'lipid': 'Lipid Profile',
    'creatinine': 'Serum Creatinine',
    'egfr': 'eGFR',
    'kidney': 'Serum Creatinine',
    'urea': 'Blood Urea Nitrogen',
    'sgot': 'SGOT (AST)',
    'ast': 'SGOT (AST)',
    'sgpt': 'SGPT (ALT)',
    'alt': 'SGPT (ALT)',
    'liver': 'SGPT (ALT)',
    'bilirubin': 'Total Bilirubin',
    'thyroid': 'TSH (Thyroid Stimulating Hormone)',
    'tsh': 'TSH (Thyroid Stimulating Hormone)',
    't3': 'Total T3',
    't4': 'Total T4',
    'vitamin d': 'Vitamin D3 (25-OH)',
    'b12': 'Vitamin B12',
    'vitamin b12': 'Vitamin B12',
    'calcium': 'Serum Calcium',
    'anemia': 'Hemoglobin',
    'blood pressure': 'Blood Pressure',
    'bp': 'Blood Pressure'
  };

  for (const [key, normalized] of Object.entries(terms)) {
    if (msg.includes(key)) {
      return normalized;
    }
  }
  return undefined;
}
