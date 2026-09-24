'use client';

import { MedicalReport, Biomarker } from '../../types/medical';
import { METABOLIC_REPORT, CARDIAC_CRITICAL_REPORT, WELLNESS_NORMAL_REPORT } from '../sampleData';
import { getUserReports } from '../userReportsStore';
import { Language } from '../i18n/translations';

export interface StructuredFinding {
  name: string;
  value: number;
  unit: string;
  refMin?: number;
  refMax?: number;
  status: string; // 'Normal' | 'Low' | 'High' | 'Critical'
  hasReferenceRange: boolean;
  clinicalSignificance: string;
  explanation: string;
}

export interface ReportContext {
  reportId: string;
  title: string;
  patientName: string;
  sampleDate: string;
  overallHealthScore: number;
  riskLevel: string;
  biomarkers: StructuredFinding[];
  abnormalBiomarkers: StructuredFinding[];
  dietSuggestions: string[];
  exerciseSuggestions: string[];
  monitoringSuggestions: string[];
  doctorQuestions: string[];
  analysisTimestamp: string;
  rawReport: MedicalReport;
}

export function getActiveReportContext(userId?: string): ReportContext | null {
  if (typeof window === 'undefined') return null;

  let report: MedicalReport | null = null;

  // 1. Check if an active report ID is set in sessionStorage
  const currentReportId = sessionStorage.getItem('mediscan_current_report_id');
  if (currentReportId) {
    const reportSpecific = sessionStorage.getItem(`mediscan_report_${currentReportId}`);
    if (reportSpecific) {
      try {
        report = JSON.parse(reportSpecific);
      } catch {}
    }
    if (!report && userId) {
      const userReports = getUserReports(userId);
      const found = userReports.find(r => r.id === currentReportId);
      if (found) report = found;
    }
  }

  // 2. Fallback to custom report in sessionStorage
  if (!report) {
    const customJson = sessionStorage.getItem('mediscan_custom_report_json');
    if (customJson) {
      try {
        report = JSON.parse(customJson);
      } catch {
        report = null;
      }
    }
  }

  // 3. Check active sample report type
  if (!report) {
    const activeType = sessionStorage.getItem('mediscan_active_report_type');
    if (activeType === 'cardiac') report = CARDIAC_CRITICAL_REPORT;
    else if (activeType === 'wellness') report = WELLNESS_NORMAL_REPORT;
    else if (activeType === 'metabolic') report = METABOLIC_REPORT;
  }

  // 4. Check user saved reports
  if (!report && userId) {
    const userReports = getUserReports(userId);
    if (userReports.length > 0) {
      report = userReports[0];
    }
  }

  // 5. Default fallback to metabolic report for demonstration
  if (!report) {
    report = METABOLIC_REPORT;
  }

  return buildReportContext(report);
}

export function setActiveReportContext(report: MedicalReport): void {
  if (typeof window === 'undefined' || !report) return;
  sessionStorage.setItem('mediscan_current_report_id', report.id);
  sessionStorage.setItem(`mediscan_report_${report.id}`, JSON.stringify(report));
  sessionStorage.setItem('mediscan_custom_report_json', JSON.stringify(report));
  window.dispatchEvent(new Event('mediscan_report_context_updated'));
}

export function buildReportContext(report: MedicalReport): ReportContext {
  const structuredFindings: StructuredFinding[] = report.biomarkers.map((b) => {
    const hasRange = typeof b.refMin === 'number' && typeof b.refMax === 'number';
    const isAbnormal = b.status !== 'NORMAL';

    let explanation = '';
    if (!isAbnormal) {
      explanation = `Value of ${b.value} ${b.unit} is within the clinical reference range (${b.refMin} - ${b.refMax} ${b.unit}).`;
    } else if (b.status === 'LOW' || b.status === 'CRITICAL_LOW') {
      explanation = `Value of ${b.value} ${b.unit} is below the reference range (${hasRange ? `${b.refMin} - ${b.refMax} ${b.unit}` : 'Not provided in report'}).`;
    } else {
      explanation = `Value of ${b.value} ${b.unit} is elevated above the reference range (${hasRange ? `${b.refMin} - ${b.refMax} ${b.unit}` : 'Not provided in report'}).`;
    }

    return {
      name: b.name,
      value: b.value,
      unit: b.unit,
      refMin: b.refMin,
      refMax: b.refMax,
      status: b.status,
      hasReferenceRange: hasRange,
      clinicalSignificance: b.clinicalSignificance || 'Clinical correlation recommended.',
      explanation
    };
  });

  const abnormals = structuredFindings.filter(
    (b) => b.status === 'CRITICAL_HIGH' || b.status === 'CRITICAL_LOW' || b.status === 'HIGH' || b.status === 'LOW'
  );

  return {
    reportId: report.id,
    title: report.title,
    patientName: report.patientName || 'Patient',
    sampleDate: report.sampleDate || new Date().toISOString().split('T')[0],
    overallHealthScore: report.overallHealthScore,
    riskLevel: report.riskLevel,
    biomarkers: structuredFindings,
    abnormalBiomarkers: abnormals,
    dietSuggestions: report.actionPlan?.diet || [],
    exerciseSuggestions: report.actionPlan?.exercise || [],
    monitoringSuggestions: report.actionPlan?.recommendedFollowUpTests || [],
    doctorQuestions: report.actionPlan?.questionsForDoctor || [],
    analysisTimestamp: new Date().toLocaleTimeString(),
    rawReport: report
  };
}

/**
 * Generates an accurate, grounded answer to a report follow-up question.
 */
export function answerReportFollowUp(
  query: string,
  context: ReportContext,
  targetBiomarker?: string,
  lang: Language = 'en'
): string {
  const msg = query.toLowerCase();

  // 1. SPECIFIC BIOMARKER LOOKUP FROM REPORT
  if (targetBiomarker) {
    const found = context.biomarkers.find(
      (b) => b.name.toLowerCase().includes(targetBiomarker.toLowerCase()) ||
             targetBiomarker.toLowerCase().includes(b.name.toLowerCase())
    );

    if (found) {
      const rangeText = found.hasReferenceRange
        ? `${found.refMin} - ${found.refMax} ${found.unit}`
        : (lang === 'hi' ? 'रिपोर्ट में संदर्भ सीमा प्रदान नहीं की गई है।' : lang === 'gu' ? 'રિપોર્ટમાં સામાન્ય મર્યાદા આપવામાં આવી નથી.' : 'Reference range not provided in report.');

      if (lang === 'hi') {
        return (
          `आपकी रिपोर्ट (**${context.reportId}**) में, **${found.name}** का मापा गया परिणाम **${found.value} ${found.unit}** है।\n\n` +
          `• **संदर्भ सीमा:** ${rangeText}\n` +
          `• **स्थिति:** ${found.status}\n` +
          `• **क्लिनिकल महत्व:** ${found.clinicalSignificance}\n\n` +
          `इस परिणाम की समीक्षा अपने डॉक्टर के साथ नियमित जांच के दौरान करें।`
        );
      }
      if (lang === 'gu') {
        return (
          `તમારા રિપોર્ટ (**${context.reportId}**) માં, **${found.name}** નું પરિણામ **${found.value} ${found.unit}** છે.\n\n` +
          `• **સામાન્ય મર્યાદા:** ${rangeText}\n` +
          `• **સ્થિતિ:** ${found.status}\n` +
          `• **ક્લિનિકલ મહત્વ:** ${found.clinicalSignificance}\n\n` +
          `આ પરિણામ અંગે તમારા ડૉક્ટર સાથે ચર્ચા કરો.`
        );
      }
      return (
        `In your report (**${context.reportId}**), your **${found.name}** measured **${found.value} ${found.unit}**.\n\n` +
        `• **Reference Range:** ${rangeText}\n` +
        `• **Status:** ${found.status}\n` +
        `• **Clinical Significance:** ${found.clinicalSignificance}\n\n` +
        `Please correlate this observation with your primary care provider.`
      );
    }
  }

  // 2. DIET / NUTRITION QUESTION ("What should I eat?")
  if (/\b(eat|diet|food|nutrition)\b|(खाना|आहार|ખોરાક)/i.test(msg)) {
    if (context.dietSuggestions.length > 0) {
      const items = context.dietSuggestions.map((d) => `• ${d}`).join('\n');
      if (lang === 'hi') {
        return `आपकी रिपोर्ट के परिणामों के आधार पर, यहाँ अनुशंसित आहार सुझाव दिए गए हैं:\n\n${items}\n\nयह सामान्य पोषण मार्गदर्शन है। किसी भी बड़े आहार परिवर्तन से पहले अपने डॉक्टर या पोषण विशेषज्ञ से सलाह लें।`;
      }
      if (lang === 'gu') {
        return `તમારા રિપોર્ટના પરિણામોના આધારે, નીચે મુજબના આહાર સૂચનો ઉપયોગી રહેશે:\n\n${items}\n\nકોઈપણ મોટા ફેરફાર કરતાં પહેલાં ડૉક્ટર અથવા ન્યુટ્રિશનિસ્ટની સલાહ લો.`;
      }
      return `Based on your analyzed lab findings, here are targeted dietary considerations:\n\n${items}\n\n*Note: These are general nutritional suggestions. Consult your physician or registered dietitian before making drastic dietary modifications.*`;
    }
  }

  // 3. DOCTOR QUESTION ("Should I see a doctor?", "When should I visit a doctor?")
  if (/\b(doctor|physician|consult|visit|urgent)\b|(डॉक्टर|ચિકિત્સક|ડૉક્ટર)/i.test(msg)) {
    const questions = context.doctorQuestions.length > 0
      ? context.doctorQuestions.slice(0, 3).map((q) => `• "${q}"`).join('\n')
      : '• "Do any of my out-of-range biomarkers require prescription therapy or follow-up tests?"';

    if (lang === 'hi') {
      return (
        `हाँ, आपकी रिपोर्ट (**स्कोर: ${context.overallHealthScore}/100**, स्तर: ${context.riskLevel}) में ${context.abnormalBiomarkers.length} बायोमार्कर सामान्य सीमा से बाहर हैं। अपने डॉक्टर से परामर्श करते समय ये प्रश्न पूछें:\n\n` +
        `${questions}\n\n` +
        `यदि आपको सीने में दर्द, सांस लेने में तकलीफ या चक्कर आने जैसे गंभीर लक्षण महसूस हों, तो तत्काल आपातकालीन सहायता लें।`
      );
    }
    if (lang === 'gu') {
      return (
        `હા, તમારા રિપોર્ટમાં (${context.abnormalBiomarkers.length} અસામાન્ય મૂલ્યો) ડૉક્ટરની સલાહ લેવાની ભલામણ છે. ચર્ચા માટે નીચેના પ્રશ્નો ઉપયોગી થશે:\n\n` +
        `${questions}\n\n` +
        `જો ગંભીર લક્ષણો જણાય તો તરત જ તબીબી સહાય મેળવો.`
      );
    }
    return (
      `Yes, with ${context.abnormalBiomarkers.length} out-of-range biomarkers (Overall Health Score: ${context.overallHealthScore}/100 [${context.riskLevel}]), discussing these findings with your physician is strongly recommended. Here are specific questions prepared for your visit:\n\n` +
      `${questions}\n\n` +
      `*Emergency reminder: If experiencing acute symptoms such as chest tightness or sudden breathlessness, seek immediate emergency care.*`
    );
  }

  // 4. GENERAL REPORT MEANING ("What does my report mean?", "Explain this result")
  const abnormalNames = context.abnormalBiomarkers.map((b) => `${b.name} (${b.value} ${b.unit})`).join(', ');

  if (lang === 'hi') {
    return (
      `आपकी रिपोर्ट (**${context.title}**, ID: \`${context.reportId}\`) का समग्र स्वास्थ्य स्कोर **${context.overallHealthScore}/100** है।\n\n` +
      `• **मुख्य निष्कर्ष:** ${context.abnormalBiomarkers.length} बायोमार्कर सामान्य सीमा से बाहर मिले: ${abnormalNames || 'सभी जांचे गए बायोमार्कर सामान्य सीमा में हैं'}.\n` +
      `• **जोखिम स्तर:** ${context.riskLevel}\n\n` +
      `आप मुझसे विशिष्ट बायोमार्कर (जैसे "हीमोग्लोबिन" या "शुगर") के बारे में पूछ सकते हैं, या आहार व जीवनशैली सुधार के सुझाव मांग सकते हैं।`
    );
  }
  if (lang === 'gu') {
    return (
      `તમારા રિપોર્ટ (**${context.title}**, ID: \`${context.reportId}\`) નો હેલ્થ સ્કોર **${context.overallHealthScore}/100** છે.\n\n` +
      `• **મુખ્ય તારણો:** ${context.abnormalBiomarkers.length} બાયોમાર્કર્સ સામાન્ય મર્યાદા બહાર છે: ${abnormalNames || 'બધા બાયોમાર્કર્સ સામાન્ય છે'}.\n` +
      `• **જોખમ સ્તર:** ${context.riskLevel}\n\n` +
      `તમે ચોક્કસ બાયોમાર્કર અથવા આહાર સંબંધિત પ્રશ્નો પૂછી શકો છો.`
    );
  }

  return (
    `Your report (**${context.title}**, ID: \`${context.reportId}\`) has an Overall Health Score of **${context.overallHealthScore}/100** (${context.riskLevel}).\n\n` +
    `• **Key Findings:** ${context.abnormalBiomarkers.length} biomarker(s) deviated from standard reference bounds: ${abnormalNames || 'All tested biomarkers are within reference intervals'}.\n` +
    `• **Next Steps:** You can ask me specific questions like *"What should I eat?"*, *"Why is my hemoglobin low?"*, or *"Should I see a doctor?"*`
  );
}
