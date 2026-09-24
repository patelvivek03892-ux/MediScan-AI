'use client';

import { MedicalReport, Biomarker } from '../types/medical';
import { getCurrentUser, UserProfile } from './authStore';
import { getUserReports } from './userReportsStore';
import { exportReportToPdf } from './pdfExport';
import { sendReportAnalysisEmail, sendReportEmailViaApi } from './emailService';
import { Language, translations } from './i18n/translations';
import { detectHybridIntent, ActionSubIntent, ClassifiedIntent } from './ai/intentRouter';
import { answerConversationalQuestion } from './ai/conversationalLayer';
import { getActiveReportContext, answerReportFollowUp, ReportContext } from './ai/reportContext';

export type AssistantIntent =
  | 'ANALYZE_REPORT'
  | 'SCAN_REPORT'
  | 'EXPLAIN_REPORT'
  | 'VIEW_RESULT'
  | 'DOWNLOAD_REPORT'
  | 'EMAIL_REPORT'
  | 'CONFIRM_SEND_EMAIL'
  | 'COMPARE_REPORTS'
  | 'VIEW_HISTORY'
  | 'UPLOAD_REPORT'
  | 'ASK_ABOUT_BIOMARKER'
  | 'HELP'
  | 'GENERAL_CONVERSATION'
  | 'CLARIFICATION';

export interface ActionButton {
  label: string;
  action: string; // e.g. 'ACTION:EXPLAIN' | 'NAVIGATE:/analysis' | 'EXECUTE:DOWNLOAD'
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
}

export interface ActionResult {
  intent: AssistantIntent;
  type:
    | 'text'
    | 'analysis_progress'
    | 'report_summary'
    | 'explanation'
    | 'email_prompt'
    | 'email_preview'
    | 'email_sent'
    | 'comparison'
    | 'compare_summary'
    | 'auth_required'
    | 'no_reports'
    | 'download_started';
  reply: string;
  report?: MedicalReport;
  navigationUrl?: string;
  recipientEmail?: string;
  comparisonData?: {
    baselineReport: MedicalReport;
    currentReport: MedicalReport;
    deltas: Array<{
      name: string;
      prev: number;
      curr: number;
      unit: string;
      difference: string;
      status: 'Improved' | 'Stable' | 'Worsened';
    }>;
  };
  actions?: ActionButton[];
  disclaimer?: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Backward-compatible wrapper for intent detection
 */
export function detectIntent(query: string): AssistantIntent {
  const classified = detectHybridIntent(query, true);
  if (classified.category === 'ACTION' && classified.actionSubIntent) {
    return classified.actionSubIntent as AssistantIntent;
  }
  if (classified.category === 'QUESTION' || classified.category === 'REPORT_FOLLOW_UP_QUESTION') {
    return 'ASK_ABOUT_BIOMARKER';
  }
  return 'GENERAL_CONVERSATION';
}

/**
 * PRIMARY ENTRY POINT: HYBRID AI ASSISTANT PROCESSOR
 *
 * Intelligently routes into:
 * 1. ACTION -> Existing Action Engine (Zero breaking changes)
 * 2. REPORT_FOLLOW_UP_QUESTION -> Context-Aware Report Resolver
 * 3. QUESTION -> Conversational Q&A Layer (Direct chat reply)
 * 4. GREETING / GENERAL_CONVERSATION -> Conversational Layer
 * 5. UNKNOWN -> Clarification question
 */
export function processAssistantCommand(
  query: string,
  lang: Language = 'en'
): ActionResult {
  const user = getCurrentUser();
  const activeContext = getActiveReportContext(user?.id);
  const t = translations[lang] || translations.en;

  const classified: ClassifiedIntent = detectHybridIntent(query, Boolean(activeContext));

  // =============================================================
  // ROUTE 1: AMBIGUOUS / UNKNOWN INTENT -> ASK CLARIFICATION
  // =============================================================
  if (classified.category === 'UNKNOWN') {
    return {
      intent: 'CLARIFICATION',
      type: 'text',
      reply: t.ai.clarificationPrompt,
      actions: [
        { label: t.ai.clarificationOptionAnalyze, action: 'ACTION:ANALYZE', variant: 'primary' },
        { label: t.ai.clarificationOptionExplain, action: 'ACTION:EXPLAIN', variant: 'secondary' }
      ],
      disclaimer: t.ai.disclaimer
    };
  }

  // =============================================================
  // ROUTE 2: GREETINGS & PLEASANTRIES
  // =============================================================
  if (classified.category === 'GREETING') {
    return {
      intent: 'GENERAL_CONVERSATION',
      type: 'text',
      reply: t.ai.greetingReply,
      actions: [
        { label: t.chat.actionAnalyze, action: 'ACTION:ANALYZE', variant: 'primary' },
        { label: t.chat.actionExplain, action: 'ACTION:EXPLAIN', variant: 'secondary' },
        { label: t.nav.upload, action: 'NAVIGATE:/upload', variant: 'accent' }
      ],
      disclaimer: t.ai.disclaimer
    };
  }

  if (classified.category === 'GENERAL_CONVERSATION') {
    return {
      intent: 'GENERAL_CONVERSATION',
      type: 'text',
      reply: t.ai.generalConversationReply,
      actions: [
        { label: t.chat.actionAnalyze, action: 'ACTION:ANALYZE', variant: 'primary' },
        { label: t.chat.actionDownload, action: 'ACTION:DOWNLOAD', variant: 'secondary' }
      ],
      disclaimer: t.ai.disclaimer
    };
  }

  // =============================================================
  // ROUTE 3: REPORT FOLLOW-UP QUESTIONS (Grounded in latest report)
  // =============================================================
  if (classified.category === 'REPORT_FOLLOW_UP_QUESTION') {
    if (!activeContext) {
      return {
        intent: 'ASK_ABOUT_BIOMARKER',
        type: 'no_reports',
        reply: t.ai.noReportContextFound,
        actions: [
          { label: t.nav.upload, action: 'NAVIGATE:/upload', variant: 'primary' },
          { label: t.nav.scanner, action: 'NAVIGATE:/scanner', variant: 'accent' }
        ],
        disclaimer: t.ai.disclaimer
      };
    }

    const answer = answerReportFollowUp(query, activeContext, classified.targetBiomarker, lang);

    return {
      intent: 'ASK_ABOUT_BIOMARKER',
      type: 'explanation',
      reply: answer,
      report: activeContext.rawReport,
      actions: [
        { label: t.analysis.title, action: 'NAVIGATE:/analysis', variant: 'primary' },
        { label: t.chat.actionDownload, action: 'ACTION:DOWNLOAD', variant: 'secondary' },
        { label: t.chat.actionEmail, action: 'ACTION:EMAIL_CONFIRM', variant: 'accent' }
      ],
      disclaimer: t.ai.disclaimer
    };
  }

  // =============================================================
  // ROUTE 4: CONVERSATIONAL MEDICAL QUESTIONS (Direct in chat)
  // =============================================================
  if (classified.category === 'QUESTION') {
    const answer = answerConversationalQuestion(query, lang);

    return {
      intent: 'ASK_ABOUT_BIOMARKER',
      type: 'text',
      reply: answer,
      actions: [
        { label: t.chat.actionAnalyze, action: 'ACTION:ANALYZE', variant: 'primary' },
        { label: t.ai.suggestionsTitle, action: 'NAVIGATE:/analysis', variant: 'secondary' }
      ],
      disclaimer: t.ai.disclaimer
    };
  }

  // =============================================================
  // ROUTE 5: ACTION INTENTS -> EXISTING ACTION ENGINE
  // =============================================================
  const actionIntent: AssistantIntent = (classified.actionSubIntent || 'ANALYZE_REPORT') as AssistantIntent;
  return processExistingActionRequest(actionIntent, query, lang, user);
}

/**
 * EXISTING ACTION ENGINE (Preserves 100% of all existing working actions)
 */
function processExistingActionRequest(
  intent: AssistantIntent,
  query: string,
  lang: Language,
  user: UserProfile | null
): ActionResult {
  const t = translations[lang] || translations.en;

  // 1. AUTHENTICATION CHECK FOR PRIVATE ACTIONS ONLY (Email dispatch & private account history)
  const requiresAuthIntents: AssistantIntent[] = [
    'EMAIL_REPORT',
    'CONFIRM_SEND_EMAIL',
    'VIEW_HISTORY'
  ];

  if (requiresAuthIntents.includes(intent) && !user) {
    return {
      intent,
      type: 'auth_required',
      navigationUrl: '/login',
      reply:
        lang === 'hi'
          ? 'आपके मेडिकल रिकॉर्ड और लैब रिपोर्ट्स को सुरक्षित रखने के लिए कृपया पहले लॉगिन करें।'
          : lang === 'gu'
          ? 'તમારા મેડિકલ રિપોર્ટ્સ સુરક્ષિત રાખવા માટે કૃપા કરીને પહેલા લૉગિન કરો.'
          : 'To protect your private clinical records and access account-specific services, please log in.',
      actions: [
        { label: t.nav.login, action: 'NAVIGATE:/login', variant: 'primary' },
        { label: t.nav.signup, action: 'NAVIGATE:/signup', variant: 'secondary' }
      ]
    };
  }

  // 2. RETRIEVE USER'S REAL REPORTS (NO FABRICATION)
  const userReports = user ? getUserReports(user.id) : [];
  const activeContext = getActiveReportContext(user?.id);
  const latestReport = activeContext?.rawReport || userReports[0];

  const createNoReportsResult = (customMsg?: string): ActionResult => ({
    intent,
    type: 'no_reports',
    navigationUrl: '/upload',
    reply:
      customMsg ||
      (lang === 'hi'
        ? 'मुझे कोई सक्रिय मेडिकल रिपोर्ट नहीं मिली। कृपया पहले एक रिपोर्ट अपलोड करें या AI कैमरा स्कैनर का उपयोग करें। आपको अपलोड पेज पर ले जाया जा रहा है...'
        : lang === 'gu'
        ? 'મને કોઈ સક્રિય મેડિકલ રિપોર્ટ મળ્યો નથી. કૃપા કરીને પહેલા રિપોર્ટ અપલોડ કરો. અપલોડ પેજ પર લઈ જઈ રહ્યા છીએ...'
        : "I couldn't find an active medical report. Please upload a lab report or scan one to begin. Navigating to the upload center..."),
    actions: [
      { label: t.nav.upload, action: 'NAVIGATE:/upload', variant: 'primary' },
      { label: t.nav.scanner, action: 'NAVIGATE:/scanner', variant: 'accent' }
    ]
  });

  // -------------------------------------------------------------
  // ACTION 1: ANALYZE REPORT
  // -------------------------------------------------------------
  if (intent === 'ANALYZE_REPORT') {
    if (!latestReport) return createNoReportsResult();

    const abnormalCount = latestReport.biomarkers.filter(
      (b) => b.status === 'CRITICAL_HIGH' || b.status === 'CRITICAL_LOW' || b.status === 'HIGH' || b.status === 'LOW'
    ).length;

    return {
      intent,
      type: 'report_summary',
      navigationUrl: `/analysis?report_id=${encodeURIComponent(latestReport.id)}&type=custom`,
      reply:
        lang === 'hi'
          ? `मैंने आपकी नवीनतम रिपोर्ट (${latestReport.id}) का विश्लेषण पूरा कर लिया है। आपका समग्र स्वास्थ्य स्कोर ${latestReport.overallHealthScore}/100 है, जिसमें ${abnormalCount} बायोमार्कर सामान्य सीमा से बाहर हैं। आपको संपूर्ण विश्लेषण डॉसियर पर ले जाया जा रहा है...`
          : lang === 'gu'
          ? `મેં તમારા તાજેતરના રિપોર્ટનું વિશ્લેષણ પૂર્ણ કર્યું છે. હેલ્થ સ્કોર: ${latestReport.overallHealthScore}/100 (${abnormalCount} અસામાન્ય બાયોમાર્કર્સ). વિશ્લેષણ પેજ ખોલવામાં આવી રહ્યું છે...`
          : `Analysis completed successfully for Report ID: ${latestReport.id} (${latestReport.title}). Overall Health Score is ${latestReport.overallHealthScore}/100 (${latestReport.riskLevel}) with ${abnormalCount} out-of-range biomarkers. Opening your complete clinical analysis dossier...`,
      report: latestReport,
      actions: [
        { label: t.analysis.title, action: `NAVIGATE:/analysis?report_id=${encodeURIComponent(latestReport.id)}&type=custom`, variant: 'primary' },
        { label: t.chat.actionExplain, action: 'ACTION:EXPLAIN', variant: 'secondary' },
        { label: t.chat.actionDownload, action: 'ACTION:DOWNLOAD', variant: 'secondary' },
        { label: t.chat.actionEmail, action: 'ACTION:EMAIL_CONFIRM', variant: 'accent' },
        { label: t.chat.actionCompare, action: 'ACTION:COMPARE', variant: 'secondary' }
      ],
      disclaimer: t.ai.disclaimer
    };
  }

  // -------------------------------------------------------------
  // ACTION 2: EXPLAIN REPORT
  // -------------------------------------------------------------
  if (intent === 'EXPLAIN_REPORT') {
    if (!latestReport) return createNoReportsResult();

    const abnormals = latestReport.biomarkers.filter(
      (b) => b.status === 'CRITICAL_HIGH' || b.status === 'CRITICAL_LOW' || b.status === 'HIGH' || b.status === 'LOW'
    );

    let explanationBody = `### Clinical Explanation: ${latestReport.title}\n\n`;
    explanationBody += `**1. Overview & Health Score:**\nYour overall health score is **${latestReport.overallHealthScore}/100**, classified as **${latestReport.riskLevel}**.\n\n`;

    explanationBody += `**2. Key Out-of-Range Findings (${abnormals.length} Detected):**\n`;
    abnormals.slice(0, 5).forEach((b) => {
      const rangeStr = (typeof b.refMin === 'number' && typeof b.refMax === 'number')
        ? `${b.refMin} - ${b.refMax} ${b.unit}`
        : t.ai.noRefRange;
      explanationBody += `• **${b.name}**: Measured at **${b.value} ${b.unit}** [${b.status}]. Standard reference range is ${rangeStr}. *Clinical Note: ${b.clinicalSignificance || 'Requires clinical correlation.'}*\n`;
    });

    if (latestReport.actionPlan) {
      explanationBody += `\n**3. Recommended Lifestyle Considerations:**\n`;
      if (latestReport.actionPlan.diet && latestReport.actionPlan.diet.length > 0) {
        explanationBody += `• **Diet**: ${latestReport.actionPlan.diet[0]}\n`;
      }
      if (latestReport.actionPlan.exercise && latestReport.actionPlan.exercise.length > 0) {
        explanationBody += `• **Activity**: ${latestReport.actionPlan.exercise[0]}\n`;
      }
    }

    explanationBody += `\n**4. Questions to Ask Your Doctor:**\n`;
    if (latestReport.actionPlan?.questionsForDoctor && latestReport.actionPlan.questionsForDoctor.length > 0) {
      latestReport.actionPlan.questionsForDoctor.slice(0, 3).forEach((q) => {
        explanationBody += `• "${q}"\n`;
      });
    } else {
      explanationBody += `• "Do any of my out-of-range biomarkers require prescription intervention or follow-up re-testing?"\n`;
    }

    return {
      intent,
      type: 'explanation',
      navigationUrl: `/analysis?report_id=${encodeURIComponent(latestReport.id)}&type=custom`,
      reply: explanationBody,
      report: latestReport,
      actions: [
        { label: t.analysis.title, action: `NAVIGATE:/analysis?report_id=${encodeURIComponent(latestReport.id)}&type=custom`, variant: 'primary' },
        { label: t.chat.actionDownload, action: 'ACTION:DOWNLOAD', variant: 'secondary' },
        { label: t.chat.actionEmail, action: 'ACTION:EMAIL_CONFIRM', variant: 'accent' }
      ],
      disclaimer: t.ai.disclaimer
    };
  }

  // -------------------------------------------------------------
  // ACTION 3: EMAIL REPORT
  // -------------------------------------------------------------
  if (intent === 'EMAIL_REPORT') {
    if (!latestReport) return createNoReportsResult();
    if (!user) {
      return {
        intent,
        type: 'auth_required',
        navigationUrl: '/login',
        reply:
          lang === 'hi'
            ? 'अपनी लैब रिपोर्ट सुरक्षित रूप से ईमेल पर प्राप्त करने के लिए कृपया पहले लॉगिन करें।'
            : lang === 'gu'
            ? 'રિપોર્ટ ઇમેઇલ કરવા માટે કૃપા કરીને પહેલા લૉગિન કરો.'
            : 'To dispatch your verified clinical summary to your email address, please log in to your account.',
        actions: [
          { label: t.nav.login, action: 'NAVIGATE:/login', variant: 'primary' },
          { label: t.nav.signup, action: 'NAVIGATE:/signup', variant: 'secondary' }
        ]
      };
    }

    return {
      intent,
      type: 'email_prompt',
      recipientEmail: user.email,
      reply:
        lang === 'hi'
          ? `आपकी पूर्ण रिपोर्ट **${latestReport.title}** (ID: \`${latestReport.id}\`) मिल गई है। क्या आप चाहते हैं कि मैं इसे आपके पंजीकृत ईमेल (**${user.email}**) पर भेजूं?`
          : lang === 'gu'
          ? `તમારો પૂર્ણ રિપોર્ટ **${latestReport.title}** (ID: \`${latestReport.id}\`) મળી ગયો છે. શું તમારા રજિસ્ટર્ડ ઇમેઇલ (**${user.email}**) પર મોકલવો છે?`
          : `I located your completed report **${latestReport.title}** (Report ID: \`${latestReport.id}\`). Would you like me to dispatch the verified clinical summary and biomarker alert dossier to your registered email address (**${user.email}**)?`,
      report: latestReport,
      actions: [
        { label: `${t.common.confirm} (${user.email})`, action: 'EXECUTE:SEND_EMAIL', variant: 'primary' },
        { label: t.common.cancel, action: 'ACTION:CANCEL', variant: 'secondary' }
      ]
    };
  }

  // -------------------------------------------------------------
  // ACTION 4: DOWNLOAD PDF REPORT
  // -------------------------------------------------------------
  if (intent === 'DOWNLOAD_REPORT') {
    if (!latestReport) return createNoReportsResult();

    try {
      if (typeof window !== 'undefined') {
        exportReportToPdf(latestReport);
      }
      return {
        intent,
        type: 'download_started',
        reply:
          lang === 'hi'
            ? `आपकी आधिकारिक PDF क्लिनिकल रिपोर्ट (\`MediScan_Report_${latestReport.id}.pdf\`) सफलतापूर्वक डाउनलोड हो गई है। इसमें सभी बायोमार्कर और स्कोर शामिल हैं।`
            : lang === 'gu'
            ? `તમારો સત્તાવાર PDF રિપોર્ટ (\`MediScan_Report_${latestReport.id}.pdf\`) સફળતાપૂર્વક ડાઉનલોડ થઈ ગયો છે.`
            : `Your official PDF clinical report (\`MediScan_Report_${latestReport.id}.pdf\`) has been generated and downloaded to your browser. It contains your complete biomarker tables, organ scores, and statutory disclaimers.`,
        report: latestReport,
        actions: [
          { label: t.chat.actionExplain, action: 'ACTION:EXPLAIN', variant: 'primary' },
          { label: t.chat.actionEmail, action: 'ACTION:EMAIL_CONFIRM', variant: 'accent' },
          { label: t.analysis.title, action: 'NAVIGATE:/analysis', variant: 'secondary' }
        ]
      };
    } catch (err) {
      return {
        intent,
        type: 'text',
        navigationUrl: '/analysis',
        reply: `Could not generate PDF: ${String(err)}. You can also view and download it directly on the Analysis page.`,
        actions: [{ label: t.analysis.title, action: 'NAVIGATE:/analysis', variant: 'primary' }]
      };
    }
  }

  // -------------------------------------------------------------
  // ACTION 5: COMPARE REPORTS
  // -------------------------------------------------------------
  if (intent === 'COMPARE_REPORTS') {
    if (!userReports || userReports.length === 0) {
      return {
        intent,
        type: 'comparison',
        navigationUrl: '/compare',
        reply:
          lang === 'hi'
            ? 'रिपोर्ट्स की तुलना करने के लिए तुलना पृष्ठ पर ले जाया जा रहा है जहां आप टेस्ट चुन सकते हैं।'
            : lang === 'gu'
            ? 'રિપોર્ટ સરખામણી કરવા માટે સરખામણી પેજ પર લઈ જઈ રહ્યા છીએ.'
            : 'To compare clinical reports, at least two tests are required. Opening the comparison dashboard where you can select or upload baseline reports.',
        actions: [
          { label: t.nav.compare, action: 'NAVIGATE:/compare', variant: 'primary' },
          { label: t.nav.upload, action: 'NAVIGATE:/upload', variant: 'secondary' }
        ]
      };
    }

    if (userReports.length < 2) {
      return {
        intent,
        type: 'comparison',
        navigationUrl: '/compare',
        reply:
          lang === 'hi'
            ? `रिपोर्ट्स की तुलना करने के लिए कम से कम 2 टेस्ट आवश्यक हैं। आपके पास वर्तमान में 1 रिपोर्ट (\`${latestReport.id}\`) है। आपको कंपेयर पेज पर ले जाया जा रहा है...`
            : lang === 'gu'
            ? `સરખામણી કરવા માટે ઓછામાં ઓછા ૨ રિપોર્ટ જરૂરી છે. તમને કમ્પેર પેજ પર લઈ જઈ રહ્યા છીએ...`
            : `To compare clinical reports, at least two recorded tests are required. You currently have **1 report** on file (\`${latestReport.id}\`). Opening the comparison tool...`,
        actions: [
          { label: t.nav.compare, action: 'NAVIGATE:/compare', variant: 'primary' },
          { label: t.nav.upload, action: 'NAVIGATE:/upload', variant: 'secondary' }
        ]
      };
    }

    const current = userReports[0];
    const previous = userReports[1];

    const deltas: Array<{
      name: string;
      prev: number;
      curr: number;
      unit: string;
      difference: string;
      status: 'Improved' | 'Stable' | 'Worsened';
    }> = [];

    current.biomarkers.forEach((cb) => {
      const pb = previous.biomarkers.find(
        (b) => b.name.toLowerCase() === cb.name.toLowerCase()
      );
      if (pb && typeof pb.value === 'number' && typeof cb.value === 'number') {
        const diff = cb.value - pb.value;
        const diffStr = diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
        let deltaStatus: 'Improved' | 'Stable' | 'Worsened' = 'Stable';

        if (Math.abs(diff) < 0.05) {
          deltaStatus = 'Stable';
        } else if (cb.status === 'NORMAL' && pb.status !== 'NORMAL') {
          deltaStatus = 'Improved';
        } else if (cb.status !== 'NORMAL' && pb.status === 'NORMAL') {
          deltaStatus = 'Worsened';
        } else {
          deltaStatus = diff > 0 ? 'Worsened' : 'Improved';
        }

        deltas.push({
          name: cb.name,
          prev: pb.value,
          curr: cb.value,
          unit: cb.unit,
          difference: diffStr,
          status: deltaStatus
        });
      }
    });

    return {
      intent,
      type: 'comparison',
      navigationUrl: '/compare',
      reply:
        lang === 'hi'
          ? `आपकी वर्तमान रिपोर्ट (**${current.title}**) की तुलना आधार रेखा (**${previous.title}**) से की गई है। स्वास्थ्य स्कोर **${previous.overallHealthScore}** से बदलकर **${current.overallHealthScore}** हो गया। तुलना मैट्रिक्स खोला जा रहा है...`
          : lang === 'gu'
          ? `વર્તમાન રિપોર્ટ (**${current.title}**) અને અગાઉના રિપોર્ટ વચ્ચે સરખામણી પૂર્ણ થઈ. સરખામણી પેજ ખોલવામાં આવી રહ્યું છે...`
          : `Comparing your current test (**${current.title}**) against baseline (**${previous.title}**). Overall Health Score changed from **${previous.overallHealthScore}** to **${current.overallHealthScore}**. Opening comparison matrix...`,
      comparisonData: {
        baselineReport: previous,
        currentReport: current,
        deltas: deltas.slice(0, 6)
      },
      actions: [
        { label: t.nav.compare, action: 'NAVIGATE:/compare', variant: 'primary' },
        { label: t.chat.actionDownload, action: 'ACTION:DOWNLOAD', variant: 'secondary' }
      ]
    };
  }

  // -------------------------------------------------------------
  // ACTION 6: VIEW RESULT / ANALYSIS
  // -------------------------------------------------------------
  if (intent === 'VIEW_RESULT') {
    if (!latestReport) return createNoReportsResult();
    return {
      intent,
      type: 'text',
      navigationUrl: `/analysis?report_id=${encodeURIComponent(latestReport.id)}&type=custom`,
      reply:
        lang === 'hi'
          ? `आपकी नवीनतम रिपोर्ट (**${latestReport.title}**) का विश्लेषण डॉसियर खोला जा रहा है...`
          : lang === 'gu'
          ? `તમારા તાજેતરના રિપોર્ટ (**${latestReport.title}**) નો વિશ્લેષણ પેજ ખોલવામાં આવી રહ્યો છે...`
          : `Opening the comprehensive clinical analysis dossier for **${latestReport.title}** (Report ID: \`${latestReport.id}\`)...`,
      report: latestReport,
      actions: [
        { label: t.analysis.title, action: `NAVIGATE:/analysis?report_id=${encodeURIComponent(latestReport.id)}&type=custom`, variant: 'primary' },
        { label: t.chat.actionDownload, action: 'ACTION:DOWNLOAD', variant: 'secondary' }
      ]
    };
  }

  // -------------------------------------------------------------
  // ACTION 7: VIEW HISTORY
  // -------------------------------------------------------------
  if (intent === 'VIEW_HISTORY') {
    if (!user) {
      return {
        intent,
        type: 'auth_required',
        navigationUrl: '/login',
        reply:
          lang === 'hi'
            ? 'आपके मेडिकल रिकॉर्ड और टेस्ट इतिहास देखने के लिए कृपया अपने खाते में लॉगिन करें।'
            : lang === 'gu'
            ? 'તમારો મેડિકલ ઇતિહાસ જોવા માટે કૃપા કરીને લૉગિન કરો.'
            : 'Please log in to your account to view your medical history and past test records.',
        actions: [
          { label: t.nav.login, action: 'NAVIGATE:/login', variant: 'primary' },
          { label: t.nav.signup, action: 'NAVIGATE:/signup', variant: 'secondary' }
        ]
      };
    }
    if (!userReports || userReports.length === 0) return createNoReportsResult();

    let listText = `You have **${userReports.length} clinical report(s)** recorded in your private medical profile:\n\n`;
    userReports.forEach((r) => {
      listText += `• **${r.title}** (ID: \`${r.id}\`) — Score: **${r.overallHealthScore}/100** [${r.riskLevel}]\n`;
    });
    listText += `\nOpening your personal health history dashboard...`;

    return {
      intent,
      type: 'text',
      navigationUrl: '/dashboard',
      reply: listText,
      actions: [
        { label: t.nav.dashboard, action: 'NAVIGATE:/dashboard', variant: 'primary' },
        { label: t.analysis.title, action: 'NAVIGATE:/analysis', variant: 'secondary' }
      ]
    };
  }

  // -------------------------------------------------------------
  // ACTION 8: SCAN REPORT (CAMERA)
  // -------------------------------------------------------------
  if (intent === 'SCAN_REPORT') {
    return {
      intent,
      type: 'text',
      navigationUrl: '/scanner',
      reply:
        lang === 'hi'
          ? 'AI कैमरा स्कैनर खोला जा रहा है...'
          : lang === 'gu'
          ? 'AI કેમેરા સ્કેનર ખોલવામાં આવી રહ્યું છે...'
          : 'Opening Smart AI Camera Scanner with real-time edge detection and auto-crop...',
      actions: [
        { label: t.nav.scanner, action: 'NAVIGATE:/scanner', variant: 'primary' },
        { label: t.nav.upload, action: 'NAVIGATE:/upload', variant: 'secondary' }
      ]
    };
  }

  // -------------------------------------------------------------
  // ACTION 9: UPLOAD REPORT
  // -------------------------------------------------------------
  if (intent === 'UPLOAD_REPORT') {
    return {
      intent,
      type: 'text',
      navigationUrl: '/upload',
      reply:
        lang === 'hi'
          ? 'रिपोर्ट अपलोड केंद्र खोला जा रहा है...'
          : lang === 'gu'
          ? 'રિપોર્ટ અપલોડ સેન્ટર ખોલવામાં આવી રહ્યું છે...'
          : 'Opening Medical Report Upload Center (drag-and-drop PDF, JPG, PNG, WEBP)...',
      actions: [
        { label: t.nav.upload, action: 'NAVIGATE:/upload', variant: 'primary' },
        { label: t.nav.scanner, action: 'NAVIGATE:/scanner', variant: 'accent' }
      ]
    };
  }

  // -------------------------------------------------------------
  // ACTION 10: HELP
  // -------------------------------------------------------------
  return {
    intent: 'HELP',
    type: 'text',
    reply:
      lang === 'hi'
        ? "मैं मेडीस्कैन AI का एक्शन-आधारित क्लिनिकल सहायक हूँ। आप मुझसे ये कार्य करवा सकते हैं:\n\n" +
          "• **'मेरी रिपोर्ट का विश्लेषण करो'** — लैब टेस्ट का सत्यापन व मूल्यांकन।\n" +
          "• **'मेरी रिपोर्ट समझाओ'** — सरल भाषा में बायोमार्कर्स की व्याख्या।\n" +
          "• **'मेरी रिपोर्ट्स की तुलना करो'** — पुराने और नए टेस्ट के बीच अंतर।\n" +
          "• **'मेरी रिपोर्ट डाउनलोड करो'** — आधिकारिक PDF डॉसियर।\n" +
          "• **'मेरी रिपोर्ट ईमेल करो'** — आपके इनबॉक्स पर सुरक्षित सारांश।\n" +
          "• **चिकित्सीय प्रश्नोत्तर** — हीमोग्लोबिन, शुगर, कोलेस्ट्रॉल आदि के बारे में पूछें।"
        : lang === 'gu'
        ? "હું મેડીસ્કેન AI નો ક્લિનિકલ સહાયક છું. તમે નીચેના કાર્યો કરાવી શકો છો:\n\n" +
          "• **'મારો રિપોર્ટ વિશ્લેષણ કરો'**\n" +
          "• **'મારો રિપોર્ટ સમજાવો'**\n" +
          "• **'રિપોર્ટ સરખામણી કરો'**\n" +
          "• **'પીડીએફ ડાઉનલોડ કરો'**\n" +
          "• **'ઇમેઇલ મોકલો'**\n" +
          "• **તબીબી પ્રશ્નોત્તરી** (હિમોગ્લોબિન, ડાયાબિટીસ વગેરે)."
        : "I am the Action-Based AI Assistant for **MediScan AI**. I do not just answer questions — I interact directly with your healthcare records. Here is what you can ask me to do:\n\n" +
          "• **'Analyze my report'** — Validates and evaluates your uploaded lab tests.\n" +
          "• **'Explain my report'** — Breaks down abnormal biomarkers in plain language.\n" +
          "• **'Compare my reports'** — Generates timeline deltas between baseline and current tests.\n" +
          "• **'Download my report'** — Generates an official PDF clinical dossier.\n" +
          "• **'Send my report to my email'** — Dispatches a secure summary to your inbox.\n" +
          "• **'View my medical history'** — Lists all tests tied to your authenticated account.\n" +
          "• **Medical Q&A** — Answers questions regarding HbA1c, LDL cholesterol, CBC, eGFR, etc.",
    actions: [
      { label: t.chat.actionAnalyze, action: 'ACTION:ANALYZE', variant: 'primary' },
      { label: t.chat.actionExplain, action: 'ACTION:EXPLAIN', variant: 'secondary' },
      { label: t.nav.upload, action: 'NAVIGATE:/upload', variant: 'accent' }
    ]
  };
}

export function executeConfirmedEmailDispatch(
  report: MedicalReport,
  user: UserProfile,
  lang: Language = 'en'
): ActionResult {
  const log = sendReportAnalysisEmail(report, user.email, user.name);

  // Trigger outbound SMTP or safe dev log in backend asynchronously
  if (typeof window !== 'undefined') {
    sendReportEmailViaApi(report, user.email, user.name, lang).catch((err) => {
      console.warn('[AI Assistant] Outbound email dispatch error:', err);
    });
  }

  return {
    intent: 'CONFIRM_SEND_EMAIL',
    type: 'email_sent',
    reply: `Clinical notification email dispatched successfully to **${user.email}** (Dispatch ID: \`${log.id}\`). A summary containing Health Score (${report.overallHealthScore}/100) and out-of-range biomarker alerts has been delivered to your inbox.`,
    report,
    actions: [
      { label: 'View Full Analysis Page', action: `NAVIGATE:/analysis?report_id=${encodeURIComponent(report.id)}&type=custom`, variant: 'primary' },
      { label: 'Download PDF Dossier', action: 'ACTION:DOWNLOAD', variant: 'secondary' }
    ]
  };
}
