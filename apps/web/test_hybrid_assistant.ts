/**
 * Comprehensive Verification Script for MediScan AI Hybrid Assistant
 * Tests all 14 test cases defined in specification.
 */

import { detectHybridIntent } from './src/lib/ai/intentRouter';
import { answerConversationalQuestion } from './src/lib/ai/conversationalLayer';
import { generateReportSuggestions } from './src/lib/ai/suggestionsEngine';
import { detectGroundedConditions } from './src/lib/ai/conditionEngine';
import { answerReportFollowUp, buildReportContext } from './src/lib/ai/reportContext';
import { METABOLIC_REPORT, CARDIAC_CRITICAL_REPORT, WELLNESS_NORMAL_REPORT } from './src/lib/sampleData';
import { translations } from './src/lib/i18n/translations';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}: ${detail || 'Assertion failed'}`);
    failCount++;
  }
}

console.log('====================================================');
console.log('STARTING MEDISCAN AI HYBRID ASSISTANT TEST SUITE');
console.log('====================================================\n');

// ---------------------------------------------------------
// TEST 1 — ACTION: "Analyze my report"
// ---------------------------------------------------------
const t1 = detectHybridIntent('Analyze my report', false);
assert(
  t1.category === 'ACTION' && t1.actionSubIntent === 'ANALYZE_REPORT',
  'TEST 1: "Analyze my report" routes to ACTION:ANALYZE_REPORT',
  JSON.stringify(t1)
);

// ---------------------------------------------------------
// TEST 2 — QUESTION: "What is hemoglobin?"
// ---------------------------------------------------------
const t2 = detectHybridIntent('What is hemoglobin?', false);
const a2 = answerConversationalQuestion('What is hemoglobin?', 'en');
assert(
  t2.category === 'QUESTION' && a2.includes('iron-rich protein'),
  'TEST 2: "What is hemoglobin?" routes to QUESTION and delivers direct educational answer',
  `Category: ${t2.category}, Answer: ${a2.slice(0, 50)}...`
);

// ---------------------------------------------------------
// TEST 3 — REPORT FOLLOW-UP: "What does this result mean?"
// ---------------------------------------------------------
const metabolicContext = buildReportContext(METABOLIC_REPORT);
const t3 = detectHybridIntent('What does this result mean?', true);
const a3 = answerReportFollowUp('What does this result mean?', metabolicContext, undefined, 'en');
assert(
  t3.category === 'REPORT_FOLLOW_UP_QUESTION' && a3.includes(metabolicContext.reportId),
  'TEST 3: "What does this result mean?" resolves report follow-up using active report context',
  `Category: ${t3.category}, Answer: ${a3.slice(0, 50)}...`
);

// ---------------------------------------------------------
// TEST 4 — ACTION: "Download my report"
// ---------------------------------------------------------
const t4 = detectHybridIntent('Download my report', true);
assert(
  t4.category === 'ACTION' && t4.actionSubIntent === 'DOWNLOAD_REPORT',
  'TEST 4: "Download my report" routes to ACTION:DOWNLOAD_REPORT',
  JSON.stringify(t4)
);

// ---------------------------------------------------------
// TEST 5 — ACTION: "Email my report"
// ---------------------------------------------------------
const t5 = detectHybridIntent('Email my report', true);
assert(
  t5.category === 'ACTION' && t5.actionSubIntent === 'EMAIL_REPORT',
  'TEST 5: "Email my report" routes to ACTION:EMAIL_REPORT',
  JSON.stringify(t5)
);

// ---------------------------------------------------------
// TEST 6 — QUESTION: "Why is hemoglobin important?"
// ---------------------------------------------------------
const t6 = detectHybridIntent('Why is hemoglobin important?', true);
const a6 = answerConversationalQuestion('Why is hemoglobin important?', 'en');
assert(
  t6.category === 'QUESTION' && a6.includes('transports oxygen'),
  'TEST 6: "Why is hemoglobin important?" delivers normal educational answer',
  `Category: ${t6.category}`
);

// ---------------------------------------------------------
// TEST 7 — REPORT QUESTION: "Why is my hemoglobin low?"
// ---------------------------------------------------------
const t7 = detectHybridIntent('Why is my hemoglobin low?', true);
const a7 = answerReportFollowUp('Why is my hemoglobin low?', metabolicContext, 'Hemoglobin', 'en');
assert(
  t7.category === 'REPORT_FOLLOW_UP_QUESTION' && a7.includes('Hemoglobin') && a7.includes('11.4'),
  'TEST 7: "Why is my hemoglobin low?" references actual report value (11.4 g/dL) and bounds',
  `Category: ${t7.category}, Answer: ${a7.slice(0, 80)}...`
);

// ---------------------------------------------------------
// TEST 8 — SUGGESTIONS: Grounded 4-part guidance
// ---------------------------------------------------------
const suggestionsEn = generateReportSuggestions(METABOLIC_REPORT, 'en');
assert(
  suggestionsEn.nutrition.length > 0 &&
  suggestionsEn.lifestyle.length > 0 &&
  suggestionsEn.monitoring.length > 0 &&
  suggestionsEn.professionalFollowUp.length > 0 &&
  suggestionsEn.nutrition.some((n) => n.toLowerCase().includes('iron') || n.toLowerCase().includes('glycemic')),
  'TEST 8: Suggestions module generates 4-category guidance grounded in report findings',
  `Nutrition: ${suggestionsEn.nutrition[0]}`
);

// ---------------------------------------------------------
// TEST 9 — CONDITIONS: Grounded possible conditions without fake %
// ---------------------------------------------------------
const conditionsEn = detectGroundedConditions(METABOLIC_REPORT, 'en');
assert(
  conditionsEn.length > 0 &&
  conditionsEn.some((c) => c.condition.includes('Anemia') || c.condition.includes('Glycemic')) &&
  !JSON.stringify(conditionsEn).includes('% Probability') &&
  !JSON.stringify(conditionsEn).includes('% severe'),
  'TEST 9: Possible conditions are grounded in abnormal biomarkers with zero fake percentages',
  `Count: ${conditionsEn.length}`
);

// ---------------------------------------------------------
// TEST 10 — NO FABRICATION: Missing ranges & severity limits
// ---------------------------------------------------------
const mockReportWithoutRange = {
  ...METABOLIC_REPORT,
  biomarkers: [
    {
      id: 'custom_marker',
      name: 'Experimental Marker',
      category: 'CBC' as any,
      value: 42,
      unit: 'U/L',
      refMin: undefined as any,
      refMax: undefined as any,
      status: 'HIGH' as any,
      clinicalSignificance: 'Under investigation.'
    }
  ]
};
const conditionsNoRange = detectGroundedConditions(mockReportWithoutRange as any, 'en');
assert(
  conditionsEn.every((c) => c.severityNote === 'Severity cannot be determined from this report alone.'),
  'TEST 10: Strict severity limitation note enforced ("Severity cannot be determined from this report alone.")'
);

// ---------------------------------------------------------
// TEST 11 — ENGLISH: Full English answers and action strings
// ---------------------------------------------------------
const actionAnalyzingEn = translations.en.ai.actionAnalyzing;
const answerEn = answerConversationalQuestion('What is diabetes?', 'en');
assert(
  actionAnalyzingEn.includes('Your report analysis has started') && answerEn.includes('Blood glucose'),
  'TEST 11: English active language produces verified English action confirmations and answers'
);

// ---------------------------------------------------------
// TEST 12 — HINDI: Full Hindi answers and action strings
// ---------------------------------------------------------
const actionAnalyzingHi = translations.hi.ai.actionAnalyzing;
const answerHi = answerConversationalQuestion('हीमोग्लोबिन क्या है?', 'hi');
const suggestionsHi = generateReportSuggestions(METABOLIC_REPORT, 'hi');
assert(
  actionAnalyzingHi.includes('आपकी रिपोर्ट का विश्लेषण शुरू हो गया है') &&
  answerHi.includes('हीमोग्लोबिन') &&
  suggestionsHi.nutrition.length > 0 &&
  suggestionsHi.nutrition[0].includes('आयरन'),
  'TEST 12: Hindi active language produces verified Hindi action confirmations, answers, and suggestions'
);

// ---------------------------------------------------------
// TEST 13 — GUJARATI: Full Gujarati answers and action strings
// ---------------------------------------------------------
const actionAnalyzingGu = translations.gu.ai.actionAnalyzing;
const answerGu = answerConversationalQuestion('હિમોગ્લોબિન શું છે?', 'gu');
const suggestionsGu = generateReportSuggestions(METABOLIC_REPORT, 'gu');
assert(
  actionAnalyzingGu.includes('તમારા રિપોર્ટનું વિશ્લેષણ શરૂ થયું છે') &&
  answerGu.includes('હિમોગ્લોબિન') &&
  suggestionsGu.nutrition.length > 0 &&
  suggestionsGu.nutrition[0].includes('આહાર'),
  'TEST 13: Gujarati active language produces verified Gujarati action confirmations, answers, and suggestions'
);

// ---------------------------------------------------------
// TEST 14 — DYNAMIC LANGUAGE SWITCH
// ---------------------------------------------------------
const promptEn = answerReportFollowUp('What should I eat?', metabolicContext, undefined, 'en');
const promptHi = answerReportFollowUp('मुझे क्या खाना चाहिए?', metabolicContext, undefined, 'hi');
const promptGu = answerReportFollowUp('મારે શું ખાવું જોઈએ?', metabolicContext, undefined, 'gu');
assert(
  promptEn.includes('dietary considerations') &&
  promptHi.includes('आहार') &&
  promptGu.includes('આહાર'),
  'TEST 14: Dynamic language switch seamlessly alternates answers between EN, HI, and GU'
);

// ---------------------------------------------------------
// TEST 15 — NATURAL LANGUAGE ACTION VARIATIONS (ANALYZE_REPORT)
// ---------------------------------------------------------
const t15a = detectHybridIntent('I want to analyze my medical report', false);
const t15b = detectHybridIntent('Can you scan my report?', false);
assert(
  t15a.category === 'ACTION' && t15a.actionSubIntent === 'ANALYZE_REPORT' &&
  t15b.category === 'ACTION' && t15b.actionSubIntent === 'ANALYZE_REPORT',
  'TEST 15: Natural language analyze variations route to ACTION:ANALYZE_REPORT',
  `t15a: ${JSON.stringify(t15a)}, t15b: ${JSON.stringify(t15b)}`
);

// ---------------------------------------------------------
// TEST 16 — NATURAL LANGUAGE ACTION VARIATIONS (EXPLAIN_REPORT)
// ---------------------------------------------------------
const t16a = detectHybridIntent('Explain my report', true);
const t16b = detectHybridIntent('What does my report mean?', true);
assert(
  t16a.category === 'ACTION' && t16a.actionSubIntent === 'EXPLAIN_REPORT' &&
  t16b.category === 'ACTION' && t16b.actionSubIntent === 'EXPLAIN_REPORT',
  'TEST 16: "Explain my report" & "What does my report mean?" route to ACTION:EXPLAIN_REPORT',
  `t16a: ${JSON.stringify(t16a)}, t16b: ${JSON.stringify(t16b)}`
);

// ---------------------------------------------------------
// TEST 17 — NATURAL LANGUAGE ACTION VARIATIONS (DOWNLOAD_REPORT)
// ---------------------------------------------------------
const t17a = detectHybridIntent('Download pdf report', true);
const t17b = detectHybridIntent('give me my report pdf', true);
assert(
  t17a.category === 'ACTION' && t17a.actionSubIntent === 'DOWNLOAD_REPORT' &&
  t17b.category === 'ACTION' && t17b.actionSubIntent === 'DOWNLOAD_REPORT',
  'TEST 17: Download variations route to ACTION:DOWNLOAD_REPORT',
  `t17a: ${JSON.stringify(t17a)}, t17b: ${JSON.stringify(t17b)}`
);

// ---------------------------------------------------------
// TEST 18 — NATURAL LANGUAGE ACTION VARIATIONS (EMAIL_REPORT)
// ---------------------------------------------------------
const t18a = detectHybridIntent('send my report to my email', true);
const t18b = detectHybridIntent('receive my report by email', true);
assert(
  t18a.category === 'ACTION' && t18a.actionSubIntent === 'EMAIL_REPORT' &&
  t18b.category === 'ACTION' && t18b.actionSubIntent === 'EMAIL_REPORT',
  'TEST 18: Email variations route to ACTION:EMAIL_REPORT',
  `t18a: ${JSON.stringify(t18a)}, t18b: ${JSON.stringify(t18b)}`
);

// ---------------------------------------------------------
// TEST 19 — NATURAL LANGUAGE ACTION VARIATIONS (COMPARE_REPORTS)
// ---------------------------------------------------------
const t19 = detectHybridIntent('compare my reports', true);
assert(
  t19.category === 'ACTION' && t19.actionSubIntent === 'COMPARE_REPORTS',
  'TEST 19: "compare my reports" routes to ACTION:COMPARE_REPORTS',
  JSON.stringify(t19)
);

// ---------------------------------------------------------
// TEST 20 — VIEW RESULT & VIEW HISTORY
// ---------------------------------------------------------
const t20a = detectHybridIntent('show my report', true);
const t20b = detectHybridIntent('view my medical history', true);
assert(
  t20a.category === 'ACTION' && t20a.actionSubIntent === 'VIEW_RESULT' &&
  t20b.category === 'ACTION' && t20b.actionSubIntent === 'VIEW_HISTORY',
  'TEST 20: "show my report" -> VIEW_RESULT and "view my medical history" -> VIEW_HISTORY',
  `t20a: ${JSON.stringify(t20a)}, t20b: ${JSON.stringify(t20b)}`
);

// ---------------------------------------------------------
// TEST 21 — GENERAL MEDICAL QUESTION IS NOT AN ACTION
// ---------------------------------------------------------
const t21a = detectHybridIntent('What is hemoglobin?', false);
const t21b = detectHybridIntent('What are normal glucose levels?', false);
assert(
  t21a.category === 'QUESTION' && t21b.category === 'QUESTION',
  'TEST 21: General medical questions correctly route to QUESTION, not ACTION',
  `t21a: ${t21a.category}, t21b: ${t21b.category}`
);

// ---------------------------------------------------------
// TEST 22 — NAVIGATION URLS ON ACTION EXECUTION
// ---------------------------------------------------------
const { processAssistantCommand } = require('./src/lib/assistantEngine');
const cmdAnalyze = processAssistantCommand('Analyze my report', 'en');
const cmdCompare = processAssistantCommand('Compare my reports', 'en');
const cmdUpload = processAssistantCommand('Upload report', 'en');
const cmdScanner = processAssistantCommand('Start camera scanner', 'en');

assert(
  (cmdAnalyze.navigationUrl === '/analysis' || cmdAnalyze.navigationUrl === '/upload') &&
  cmdCompare.navigationUrl === '/compare' &&
  cmdUpload.navigationUrl === '/upload' &&
  cmdScanner.navigationUrl === '/scanner',
  'TEST 22: processAssistantCommand returns correct navigationUrl for actions',
  `Analyze: ${cmdAnalyze.navigationUrl}, Compare: ${cmdCompare.navigationUrl}, Upload: ${cmdUpload.navigationUrl}, Scanner: ${cmdScanner.navigationUrl}`
);

console.log('\n====================================================');
console.log(`TEST RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
console.log('====================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
