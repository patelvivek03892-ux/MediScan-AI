/**
 * MediScan AI - Conversational Q&A Layer
 *
 * Provides patient-friendly, evidence-based educational explanations
 * for common medical laboratory tests, biomarkers, and health parameters.
 *
 * Supported Languages: English ('en'), Hindi ('hi'), Gujarati ('gu').
 * Non-diagnostic statutory disclaimers included.
 */

import { Language } from '../i18n/translations';

interface TopicExplanation {
  patterns: RegExp[];
  en: string;
  hi: string;
  gu: string;
}

const MEDICAL_TOPICS: TopicExplanation[] = [
  // 1. HEMOGLOBIN / ANEMIA
  {
    patterns: [/\b(hemoglobin|hb|heamoglobin|anemia)\b|(हीमोग्लोबिन|હિમોગ્લોબિન|एनीमिया|એનીમિયા)/i],
    en: "Hemoglobin is an iron-rich protein in red blood cells that transports oxygen from your lungs to tissues throughout your body and carries carbon dioxide back. Standard reference intervals are typically 13.5–17.5 g/dL for adult men and 12.0–15.5 g/dL for adult women. Low hemoglobin (anemia) can lead to fatigue, pale skin, or shortness of breath, often related to nutritional deficiencies (such as iron, vitamin B12, or folate) or blood loss. High levels can occur in chronic dehydration, high altitudes, or smoking.",
    hi: "हीमोग्लोबिन लाल रक्त कोशिकाओं में मौजूद एक महत्वपूर्ण आयरन युक्त प्रोटीन है जो फेफड़ों से पूरे शरीर में ऑक्सीजन पहुंचाने का काम करता है। पुरुषों के लिए सामान्य सीमा लगभग 13.5–17.5 g/dL और महिलाओं के लिए 12.0–15.5 g/dL होती है। हीमोग्लोबिन का स्तर कम होने पर एनीमिया हो सकता है, जिससे थकान, कमजोरी और सांस फूलने की समस्या हो सकती है। आयरन और विटामिन युक्त आहार इसके सुधार में सहायक होते हैं।",
    gu: "હિમોગ્લોબિન એ લાલ રક્તકણોમાં રહેલું આયર્નયુક્ત પ્રોટીન છે જે ફેફસાંમાંથી સમગ્ર શરીરમાં ઓક્સિજન પહોંચાડે છે. પુરુષો માટે સામાન્ય સ્તર 13.5–17.5 g/dL અને સ્ત્રીઓ માટે 12.0–15.5 g/dL હોય છે. હિમોગ્લોબિન ઓછું થવાથી એનીમિયા (લોહીની ઉણપ), થાક અને નબળાઈ આવી શકે છે. આયર્ન અને લીલા શાકભાજીનું સેવન ઉપયોગી સાબિત થાય છે."
  },

  // 2. COMPLETE BLOOD COUNT (CBC)
  {
    patterns: [/\b(cbc|complete blood count)\b|(सीबीसी|સીબીસી)/i],
    en: "A Complete Blood Count (CBC) is a fundamental blood test that measures several components: Red Blood Cells (RBCs) for oxygen carriage, White Blood Cells (WBCs) for fighting infections, Platelets for blood clotting, and Hemoglobin & Hematocrit for overall blood volume and density. Clinicians use it to evaluate general health, screen for infections, and investigate symptoms like fatigue or unexplained bruising.",
    hi: "सीबीसी (Complete Blood Count) एक बुनियादी रक्त जांच है जो रक्त के मुख्य घटकों को मापती है: ऑक्सीजन ले जाने वाली लाल रक्त कोशिकाएं (RBC), संक्रमण से लड़ने वाली श्वेत रक्त कोशिकाएं (WBC), और रक्त का थक्का जमाने वाले प्लेटलेट्स। यह संक्रमण, एनीमिया और सामान्य स्वास्थ्य स्थिति का पता लगाने में मदद करती है।",
    gu: "CBC (કમ્પ્લીટ બ્લડ કાઉન્ટ) એ લોહીની સામાન્ય અને મહત્વપૂર્ણ તપાસ છે. તે લાલ રક્તકણો (RBC), રોગપ્રતિકારક શ્વેતકણો (WBC) અને રક્ત ગંઠાઈ જવા માટેના પ્લેટલેટ્સનું પ્રમાણ માપે છે. આ ટેસ્ટથી શરીરમાં ઇન્ફેક્શન કે એનિમિયા વિશે જાણી શકાય છે."
  },

  // 3. DIABETES & GLUCOSE / HBA1C
  {
    patterns: [/\b(diabetes|sugar|glucose|hba1c)\b|(मधुमेह|शुगर|ડાયાબિટીસ|સુગર)/i],
    en: "Blood glucose indicates the immediate amount of sugar in your bloodstream, while HbA1c provides a 3-month average of glycemic control. For fasting blood sugar, normal levels are under 100 mg/dL (100–125 mg/dL indicates prediabetes, ≥126 mg/dL suggests diabetes). For HbA1c, under 5.7% is normal, 5.7%–6.4% indicates prediabetes, and ≥6.5% indicates diabetes. Regular physical activity, portion-controlled meals, and fiber intake support glycemic health.",
    hi: "ब्लड ग्लूकोज रक्त में तात्कालिक शर्करा की मात्रा को दर्शाता है, जबकि HbA1c पिछले 2 से 3 महीनों का औसत ब्लड शुगर बताता है। उपवास (Fasting) में सामान्य शुगर 100 mg/dL से कम और HbA1c 5.7% से कम सामान्य माना जाता है। संतुलित आहार, फाइबर का सेवन और रोजाना 30 मिनट की सैर इसे नियंत्रित रखने में सहायक हैं।",
    gu: "બ્લડ સુગર એ લોહીમાં ગ્લુકોઝનું તાત્કાલિક સ્તર છે, જ્યારે HbA1c છેલ્લા ૨-૩ મહિનાનું સરેરાશ સુગર દર્શાવે છે. ફાસ્ટિંગમાં 100 mg/dL થી ઓછું અને HbA1c 5.7% થી ઓછું સામાન્ય ગણાય છે. નિયમિત કસરત અને યોગ્ય આહાર દ્વારા ડાયાબિટીસનું જોખમ ઘટાડી શકાય છે."
  },

  // 4. CHOLESTEROL & LIPIDS
  {
    patterns: [/\b(cholesterol|lipid|ldl|hdl|triglyceride)\b|(कोलेस्ट्रॉल|કોલેસ્ટ્રોલ)/i],
    en: "A lipid profile assesses fats in the blood that influence cardiovascular risk. LDL ('bad cholesterol') carries lipids into artery walls; optimal levels are below 100 mg/dL. HDL ('good cholesterol') clears excess lipids back to the liver; levels above 40 mg/dL in men and 50 mg/dL in women are protective. Triglycerides store unused calories; below 150 mg/dL is desirable. Diets lower in saturated and trans fats and rich in soluble fiber improve lipid balances.",
    hi: "कोलेस्ट्रॉल रक्त में पाया जाने वाला वसायुक्त तत्व है। LDL ('खराब कोलेस्ट्रॉल') धमनियों में जमा होकर हृदय रोग का खतरा बढ़ाता है (सामान्य: <100 mg/dL)। HDL ('अच्छा कोलेस्ट्रॉल') हृदय की रक्षा करता है। ट्राइग्लिसराइड्स 150 mg/dL से कम होना चाहिए। तला-भुना कम खाकर और ओमेगा-3 युक्त भोजन से इसे संतुलित रखा जा सकता है।",
    gu: "કોલેસ્ટ્રોલ એ લોહીમાં રહેલું ફેટ (ચરબી) છે. LDL ('ખરાબ કોલેસ્ટ્રોલ') નળીઓમાં જમા થઈને હૃદય રોગનું જોખમ વધારે છે (સામાન્ય: <100 mg/dL). HDL ('સારું કોલેસ્ટ્રોલ') હૃદયને સ્વસ્થ રાખે છે. તેલ-ઘીનું પ્રમાણ ઘટાડવું અને કસરત કરવી અત્યંત ફાયદાકારક છે."
  },

  // 5. BLOOD PRESSURE
  {
    patterns: [/\b(blood pressure|bp|hypertension)\b|(रक्तचाप|બ્લડ પ્રેશર|હાઈ બીપી)/i],
    en: "Blood pressure measures the force exerted by circulating blood against arterial walls. Standard adult reading is around 120/80 mmHg (systolic/diastolic). Readings consistently above 130/80 mmHg indicate hypertension. Unmanaged elevated blood pressure strains the heart, brain, and kidneys over time. Reducing dietary sodium, maintaining a healthy weight, managing stress, and regular exercise promote optimal vascular tone.",
    hi: "ब्लड प्रेशर (रक्तचाप) धमनियों की दीवारों पर रक्त द्वारा डाले गए दबाव को मापता है। सामान्य वयस्क बीपी 120/80 mmHg माना जाता है। लगातार 130/80 mmHg से अधिक मान उच्च रक्तचाप (Hypertension) कहलाता है। नमक का सेवन कम करना, तनाव प्रबंधन और वजन नियंत्रित रखना बीपी को सामान्य रखने में मददगार है।",
    gu: "બ્લડ પ્રેશર એ લોહીની નસો પર લોહીના દબાણનું માપ છે. સામાન્ય બીપી 120/80 mmHg ગણાય છે. મીઠું ઓછું ખાવું, ચિંતામુક્ત રહેવું અને સંતુલિત વજન જાળવવાથી બ્લડ પ્રેશર સામાન્ય રહે છે."
  },

  // 6. KIDNEY FUNCTION (CREATININE, eGFR, UREA)
  {
    patterns: [/\b(creatinine|egfr|kidney|urea|bun)\b|(किडनी|કિડની|ગુરદા)/i],
    en: "Kidney Function Tests evaluate how effectively your renal system filters metabolic waste from blood. Serum Creatinine (normal: ~0.6–1.2 mg/dL) is a byproduct of muscle breakdown; elevated levels suggest reduced filtration. eGFR (Estimated Glomerular Filtration Rate) calculates filtering capacity (>90 mL/min/1.73m² is normal). Staying well-hydrated and avoiding unnecessary NSAID pain relievers helps protect nephrons.",
    hi: "किडनी फंक्शन टेस्ट (KFT) यह जांचता है कि गुर्दे रक्त से अपशिष्ट पदार्थों को कितनी अच्छी तरह छान रहे हैं। सीरम क्रिएटिनिन (सामान्य: ~0.6–1.2 mg/dL) का बढ़ना किडनी पर दबाव दर्शाता है। पर्याप्त मात्रा में पानी पीना और बिना डॉक्टर की सलाह के दर्द निवारक गोलियां (NSAIDs) न लेना किडनी स्वास्थ्य के लिए आवश्यक है।",
    gu: "કિડની ફંક્શન ટેસ્ટ દ્વારા જાણી શકાય છે કે કિડની લોહીને કેટલી યોગ્ય રીતે સાફ કરે છે. સીરમ ક્રિએટીનાઇન (સામાન્ય: 0.6–1.2 mg/dL) વધવું એ કિડની પર ભાર દર્શાવે છે. પૂરતું પાણી પીવું અને પેઇનકિલર્સનો બિનજરૂરી ઉપયોગ ટાળવો જોઈએ."
  },

  // 7. LIVER FUNCTION (SGOT, SGPT, BILIRUBIN)
  {
    patterns: [/\b(liver|sgot|sgpt|alt|ast|bilirubin)\b|(लिवर|લિવર)/i],
    en: "Liver Function Tests (LFT) examine enzymes and proteins involved in metabolism, bile production, and detoxification. Elevated SGPT/ALT and SGOT/AST enzymes typically indicate hepatic cell irritation, which can occur with fatty liver changes, medication use, alcohol, or viral hepatitis. Bilirubin measures yellow pigment from breakdown of red cells; high levels can cause jaundice.",
    hi: "लिवर फंक्शन टेस्ट (LFT) लिवर के एंजाइम और प्रोटीन की जांच करता है। SGPT (ALT) और SGOT (AST) का बढ़ना लिवर कोशिकाओं में सूजन या फैटी लिवर का संकेत हो सकता है। बिलीरुबिन का बढ़ना पीलिया (Jaundice) का कारण बन सकता है। शराब से दूरी और वसायुक्त भोजन कम करना लिवर को स्वस्थ रखता है।",
    gu: "લિવર ફંક્શન ટેસ્ટ પાચન અને ડિટોક્સિફિકેશન સાથે જોડાયેલા એન્ઝાઇમ્સ માપે છે. SGPT અને SGOT નું વધવું ફેટી લિવર કે સોજો દર્શાવી શકે છે. વધુ પડતી ચરબીવાળા ખોરાકથી દૂર રહેવું લિવર માટે હિતાવહ છે."
  },

  // 8. THYROID (TSH, T3, T4)
  {
    patterns: [/\b(thyroid|tsh|t3|t4)\b|(थायरॉइड|થાઈરોઈડ)/i],
    en: "The thyroid gland regulates bodily metabolism, energy levels, and heart rate. TSH (Thyroid Stimulating Hormone, normal range: 0.4–4.0 μIU/mL) stimulates thyroid hormone production. High TSH with low T4 suggests Hypothyroidism (underactive, leading to fatigue, weight gain, feeling cold). Low TSH with high T4 suggests Hyperthyroidism (overactive, causing tremors, palpitations, weight loss).",
    hi: "थायरॉयड ग्रंथि शरीर के मेटाबॉलिज्म, ऊर्जा और हृदय गति को नियंत्रित करती है। TSH का सामान्य स्तर 0.4–4.0 μIU/mL होता है। TSH का बढ़ना हाइपोथायरायडिज्म (सुस्त थायरॉयड, जिससे वजन बढ़ना और थकान होना) दर्शाता है, जबकि कम TSH हाइपरथायरायडिज्म (वजन घटना, बेचैनी) का संकेत देता है।",
    gu: "થાઇરોઇડ ગ્રંથિ શરીરની ઉર્જા અને પાચનક્રિયાનું નિયમન કરે છે. TSH નું સામાન્ય પ્રમાણ 0.4–4.0 μIU/mL હોય છે. TSH વધવાથી વજન વધવું અને થાક લાગે છે, જેને હાઈપોથાઈરોઈડિઝમ કહેવાય છે. ડૉક્ટરની સલાહ મુજબ આયોડિનયુક્ત આહાર અને દવા જરૂરી બને છે."
  },

  // 9. VITAMIN D & B12
  {
    patterns: [/\b(vitamin d|vit d|b12|vitamin b12)\b|(विटामिन|વિટામિન)/i],
    en: "Vitamin D3 is essential for bone mineral density, calcium absorption, and immune modulation (optimum: 30–100 ng/mL; below 20 ng/mL is deficient). Vitamin B12 is crucial for nerve function, neurological health, and red blood cell synthesis (normal: 200–900 pg/mL). Deficiencies can cause persistent tiredness, nerve tingling (pins and needles), or mood variations.",
    hi: "विटामिन D3 हड्डियों की मजबूती, कैल्शियम अवशोषण और रोग प्रतिरोधक क्षमता के लिए जरूरी है (सामान्य: 30–100 ng/mL)। विटामिन B12 तंत्रिका तंत्र (नर्वस सिस्टम) और लाल रक्त कोशिकाओं के निर्माण के लिए आवश्यक है। इनकी कमी से शरीर में दर्द, थकान और हाथ-पैरों में झनझनाहट हो सकती है।",
    gu: "વિટામિન D3 હાડકાંની મજબૂતી અને રોગપ્રતિકારક શક્તિ માટે મહત્વપૂર્ણ છે. વિટામિન B12 ચેતાતંત્ર (નર્વ્સ) અને લાલ રક્તકણો માટે જરૂરી છે. તેની ઉણપથી શરીરમાં કળતર, થાક અને નબળાઈ અનુભવાય છે. સૂર્યપ્રકાશ અને પૌષ્ટિક આહારથી સુધારો શક્ય છે."
  },

  // 10. WHITE BLOOD CELLS / INFECTION
  {
    patterns: [/\b(wbc|leukocyte|leukocytes)\b|(श्वेत रक्त|શ્વેતકણો)/i],
    en: "White Blood Cells (WBCs) are your immune defense army against bacterial, viral, and fungal pathogens. Normal reference range is 4,000–11,000 cells/cumm. Elevated counts (leukocytosis) frequently signify an active immune response to infection or tissue inflammation. Low counts (leukopenia) may reflect viral suppression or medication effects.",
    hi: "श्वेत रक्त कोशिकाएं (WBC) शरीर की प्रतिरक्षा प्रणाली का मुख्य हिस्सा हैं जो बैक्टीरिया और वायरस से लड़ती हैं। सामान्य सीमा 4,000–11,000 /cumm होती है। इनकी संख्या में वृद्धि संक्रमण या सूजन का संकेत देती है, जबकि कमी रोग प्रतिरोधक क्षमता में गिरावट दर्शाती है।",
    gu: "શ્વેત રક્તકણો (WBC) શરીરના સંરક્ષક છે જે ચેપ સામે રક્ષણ આપે છે. સામાન્ય મર્યાદા 4,000–11,000 /cumm છે. WBC વધવું એ શરીરમાં ઇન્ફેક્શન કે સોજો સૂચવે છે."
  },

  // 11. PLATELETS / CLOTTING
  {
    patterns: [/\b(platelet|platelets|plt)\b|(प्लेटलेट|પ્લેટલેટ્સ)/i],
    en: "Platelets are specialized cell fragments that form blood clots to stop bleeding from vascular injuries. Normal concentration is 150,000–450,000 /cumm. Mild reductions can occur during viral infections (such as dengue or viral fevers); severe drops (<50,000) carry increased risk of mucosal bleeding and require immediate clinical assessment.",
    hi: "प्लेटलेट्स रक्त की विशेष कोशिकाएं हैं जो चोट लगने पर रक्त का थक्का बनाकर बहाव रोकती हैं। सामान्य स्तर 1.5 से 4.5 लाख /cumm होता है। वायरल बुखार या डेंगू में प्लेटलेट्स घट सकते हैं। यदि स्तर 50,000 से नीचे चला जाए तो तुरंत चिकित्सीय जांच आवश्यक है।",
    gu: "પ્લેટલેટ્સ લોહી ગંઠાઈ જવા માટે જરૂરી કોષો છે. સામાન્ય પ્રમાણ ૧.૫ થી ૪.૫ લાખ /cumm હોય છે. વાયરલ તાવ કે ડેન્ગ્યુમાં તેનું પ્રમાણ ઘટી શકે છે. ખૂબ ઓછા પ્લેટલેટ્સમાં તાત્કાલિક સારવાર લેવી પડે છે."
  }
];

export function answerConversationalQuestion(query: string, lang: Language = 'en'): string {
  const clean = query.toLowerCase();

  for (const topic of MEDICAL_TOPICS) {
    if (topic.patterns.some((p) => p.test(clean))) {
      return topic[lang] || topic.en;
    }
  }

  // Fallback clinical educational response
  if (lang === 'hi') {
    return (
      `आपके प्रश्न "${query}" के संबंध में: क्लिनिकल संदर्भ मानकों के अनुसार, शरीर के सभी बायोमार्कर्स और अंग प्रणालियां आपस में जुड़ी होती हैं। ` +
      `प्रयोगशाला परीक्षणों की सामान्य सीमाएं उम्र, लिंग और परीक्षण पद्धति के आधार पर भिन्न हो सकती हैं। ` +
      `किसी भी व्यक्तिगत लक्षण या चिंता के लिए अपने डॉक्टर से परामर्श करना सबसे सुरक्षित है।`
    );
  }
  if (lang === 'gu') {
    return (
      `તમારા પ્રશ્ન અંગે: ક્લિનિકલ ધોરણો મુજબ, શરીરના તમામ બાયોમાર્કર્સ એકબીજા સાથે જોડાયેલા હોય છે. ` +
      `લેબોરેટરી પરિણામો ઉંમર અને પરિસ્થિતિ મુજબ બદલાઈ શકે છે. ` +
      `ચોક્કસ નિદાન માટે હંમેશા તમારા ડૉક્ટરની સલાહ લો.`
    );
  }

  return (
    `Regarding your inquiry about "${query}": In clinical medicine, laboratory biomarkers and physiological parameters function as an interconnected network to maintain systemic homeostasis. ` +
    `Reference intervals can vary based on analytical methodologies, age, and biological sex. ` +
    `If you have specific lab results or health symptoms related to this topic, discussing them directly with a healthcare provider is recommended.`
  );
}
