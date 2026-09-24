import { MedicalReport, Biomarker } from '../../types/medical';
import { Language } from '../i18n/translations';

export interface ReportSuggestions {
  nutrition: string[];
  lifestyle: string[];
  monitoring: string[];
  professionalFollowUp: string[];
}

export function generateReportSuggestions(report: MedicalReport, lang: Language = 'en'): ReportSuggestions {
  const abnormals = report.biomarkers.filter(
    (b) => b.status === 'CRITICAL_HIGH' || b.status === 'CRITICAL_LOW' || b.status === 'HIGH' || b.status === 'LOW'
  );

  const nutrition: string[] = [];
  const lifestyle: string[] = [];
  const monitoring: string[] = [];
  const professionalFollowUp: string[] = [];

  // Helper to check biomarker abnormalities
  const hasAbnormal = (nameKeywords: string[]) =>
    abnormals.some((b) => nameKeywords.some((k) => b.name.toLowerCase().includes(k.toLowerCase())));

  const isLow = (nameKeywords: string[]) =>
    abnormals.some(
      (b) =>
        (b.status === 'LOW' || b.status === 'CRITICAL_LOW') &&
        nameKeywords.some((k) => b.name.toLowerCase().includes(k.toLowerCase()))
    );

  const isHigh = (nameKeywords: string[]) =>
    abnormals.some(
      (b) =>
        (b.status === 'HIGH' || b.status === 'CRITICAL_HIGH') &&
        nameKeywords.some((k) => b.name.toLowerCase().includes(k.toLowerCase()))
    );

  // 1. ANEMIA / HEMOGLOBIN DEFICIENCY
  if (isLow(['hemoglobin', 'hb', 'rbc', 'hematocrit'])) {
    if (lang === 'hi') {
      nutrition.push('आयरन से भरपूर खाद्य पदार्थ शामिल करें: पालक, चुकंदर, अनार, दालें, गुड़ और खजूर।');
      nutrition.push('आयरन के बेहतर अवशोषण के लिए भोजन के साथ विटामिन सी (नींबू, संतरा, आंवला) लें।');
      lifestyle.push('अत्यधिक थका देने वाले व्यायाम से बचें; दैनिक ऊर्जा के लिए पर्याप्त विश्राम लें।');
      monitoring.push('8 से 12 सप्ताह के भीतर हीमोग्लोबिन और सीरम फेरिटिन की पुनः जांच कराएं।');
      professionalFollowUp.push('यदि अत्यधिक चक्कर या सांस फूलने की समस्या हो तो तुरंत चिकित्सक से मिलें।');
    } else if (lang === 'gu') {
      nutrition.push('આયર્નયુક્ત આહાર લો: પાલક, બીટ, દાડમ, દાળ, ગોળ અને ખજૂર.');
      nutrition.push('આયર્નના સારા શોષણ માટે લીંબુ, સંતરા જેવા વિટામિન સી યુક્ત ફળો લો.');
      lifestyle.push('વધુ પડતો થાક ન લાગે તે માટે પૂરતો આરામ લો.');
      monitoring.push('૮ થી ૧૨ અઠવાડિયા પછી ફરી હિમોગ્લોબિન અને ફેરીટીન ટેસ્ટ કરાવો.');
      professionalFollowUp.push('ચક્કર કે શ્વાસ લેવામાં તકલીફ જણાય તો તરત જ ડૉક્ટરની મુલાકાત લો.');
    } else {
      nutrition.push('Incorporate iron-dense whole foods: dark leafy greens (spinach), beetroot, lentils, pomegranate, and fortified cereals.');
      nutrition.push('Pair iron-containing meals with vitamin C (citrus fruits, bell peppers) to boost absorption; minimize concurrent tea or coffee.');
      lifestyle.push('Pace daily physical exertion; allow 7–8 hours of restorative nightly sleep to mitigate fatigue.');
      monitoring.push('Schedule repeat Hemoglobin and Serum Ferritin testing in 8–12 weeks to track hematopoietic recovery.');
      professionalFollowUp.push('Consult a physician to investigate potential causes (such as dietary deficiency or blood loss) and discuss supplementation.');
    }
  }

  // 2. GLYCEMIC DYSREGULATION / DIABETES
  if (isHigh(['glucose', 'sugar', 'hba1c'])) {
    if (lang === 'hi') {
      nutrition.push('कम ग्लाइसेमिक इंडेक्स (GI) वाले खाद्य पदार्थ चुनें: साबुत अनाज, जई, बाजरा और हरी सब्जियां।');
      nutrition.push('मीठे पेय पदार्थ, परिष्कृत चीनी और मैदे से बने व्यंजनों से परहेज करें।');
      lifestyle.push('भोजन के बाद 15–20 मिनट हल्की सैर करें; सप्ताह में कम से कम 150 मिनट मध्यम व्यायाम करें।');
      monitoring.push('खाली पेट (Fasting) और भोजन के 2 घंटे बाद (PP) ब्लड ग्लूकोज का रिकॉर्ड रखें; 3 महीने बाद HbA1c दोहराएं।');
      professionalFollowUp.push('दवाओं के समायोजन और डायबिटिक डाइट प्लान के लिए अपने एंडोक्रिनोलॉजिस्ट से परामर्श लें।');
    } else if (lang === 'gu') {
      nutrition.push('ઓછા ગ્લાયસેમિક ઇન્ડેક્સવાળા ખોરાક લો: આખા અનાજ, ઓટ્સ અને લીલા શાકભાજી.');
      nutrition.push('ખાંડ, મીઠાઈઓ અને મેંદાવાળી વાનગીઓનું સેવન ટાળો.');
      lifestyle.push('જમ્યા પછી ૧૫-૨૦ મિનિટ ચાલો; અઠવાડિયામાં ૧૫૦ મિનિટ હળવી કસરત કરો.');
      monitoring.push('ફાસ્ટિંગ અને જમ્યા પછીનું સુગર નિયમિત માપો; ૩ મહિના પછી HbA1c ટેસ્ટ કરાવો.');
      professionalFollowUp.push('દવા અને આહારના આયોજન માટે તમારા ફિઝિશિયન સાથે પરામર્શ કરો.');
    } else {
      nutrition.push('Prioritize low-glycemic complex carbohydrates: whole rolled oats, quinoa, legumes, and non-starchy vegetables.');
      nutrition.push('Eliminate refined sugars, sweetened sodas, and ultra-processed bakery products to minimize postprandial glucose spikes.');
      lifestyle.push('Engage in 20–30 minutes of daily moderate aerobic exercise (e.g., brisk walking, cycling) to enhance peripheral insulin sensitivity.');
      monitoring.push('Maintain a home log of fasting and post-prandial capillary blood glucose; recheck HbA1c in 90 days.');
      professionalFollowUp.push('Review elevated glycemic metrics with an endocrinologist or primary physician for therapy optimization.');
    }
  }

  // 3. LIPID & CARDIOVASCULAR RISK
  if (isHigh(['cholesterol', 'ldl', 'triglycerides', 'troponin'])) {
    if (lang === 'hi') {
      nutrition.push('संतृप्त वसा (घी, मक्खन, वनस्पति) कम करें; घुलनशील फाइबर (ओट्स, सेब, अलसी) का सेवन बढ़ाएं।');
      nutrition.push('ओमेगा-3 फैटी एसिड युक्त आहार (अखरोट, चिया बीज) शामिल करें।');
      lifestyle.push('कार्डियोवैस्कुलर फिटनेस के लिए रोजाना व्यायाम करें; धूम्रपान और तंबाकू से पूर्ण परहेज करें।');
      monitoring.push('3 से 6 महीने में लिपिड प्रोफाइल और रक्तचाप (BP) की जांच कराएं।');
      professionalFollowUp.push('हृदय संबंधी जोखिम मूल्यांकन और आवश्यकतानुसार स्टैटिन थेरेपी पर विचार करने के लिए डॉक्टर से मिलें।');
    } else if (lang === 'gu') {
      nutrition.push('તળેલું અને ચરબીયુક્ત ભોજન ટાળો; ફાઇબરવાળા ખોરાક (ઓટ્સ, સફરજન) નું પ્રમાણ વધારો.');
      nutrition.push('ઓમેગા-૩ યુક્ત ખોરાક (અખરોટ, ચિયા સીડ્સ) લો.');
      lifestyle.push('હૃદયની તંદુરસ્તી માટે રોજ કસરત કરો; ધૂમ્રપાન સંપૂર્ણપણે બંધ કરો.');
      monitoring.push('૩ થી ૬ મહિનામાં લિપિડ પ્રોફાઇલ અને બ્લડ પ્રેશર તપાસો.');
      professionalFollowUp.push('હૃદયના સ્વાસ્થ્ય અંગે ડૉક્ટર સાથે યોગ્ય સલાહ લો.');
    } else {
      nutrition.push('Restrict saturated and trans fatty acids; replace with heart-healthy monounsaturated fats (olive oil, avocado, walnuts).');
      nutrition.push('Increase viscous soluble dietary fiber to actively bind and eliminate biliary cholesterol in the digestive tract.');
      lifestyle.push('Accumulate at least 150 minutes per week of moderate-intensity cardiovascular exercise to increase protective HDL.');
      monitoring.push('Re-evaluate full Lipid Panel, ApoB, and resting blood pressure after 3–6 months of lifestyle modification.');
      professionalFollowUp.push('Discuss cardiovascular risk stratification with your clinician, who may assess indications for lipid-lowering therapy.');
    }
  }

  // 4. RENAL / KIDNEY METABOLITES
  if (isHigh(['creatinine', 'urea', 'bun', 'uric acid'])) {
    if (lang === 'hi') {
      nutrition.push('पर्याप्त मात्रा में पानी पिएं (दिन में 2.5–3 लीटर, जब तक कि डॉक्टर ने सीमित न किया हो)।');
      nutrition.push('सोडियम (नमक) और अतिरिक्त प्रोटीन पाउडर के सेवन को नियंत्रित रखें।');
      lifestyle.push('बिना डॉक्टर की सलाह के ब्रूफेन या डाइक्लोफेनाक जैसी दर्द निवारक दवाएं (NSAIDs) न लें।');
      monitoring.push('सीरम क्रिएटिनिन, यूरिक एसिड और यूरिन रूटीन टेस्ट की 6 से 8 सप्ताह में समीक्षा करें।');
      professionalFollowUp.push('गुर्दे की कार्यप्रणाली के मूल्यांकन के लिए नेफ्रोलॉजिस्ट या फिजिशियन से परामर्श लें।');
    } else if (lang === 'gu') {
      nutrition.push('પૂરતા પ્રમાણમાં પાણી પીવો (ડૉક્ટરની સલાહ મુજબ દિવસમાં ૨.૫-૩ લીટર).');
      nutrition.push('મીઠું ઓછું ખાવું અને અતિશય પ્રોટીન પાઉડર લેવાનું ટાળો.');
      lifestyle.push('ડૉક્ટરની સલાહ વગર પેઇનકિલર્સ (NSAIDs) ક્યારેય ન લો.');
      monitoring.push('૬ થી ૮ અઠવાડિયામાં સીરમ ક્રિએટીનાઇન અને યુરીન ટેસ્ટ કરાવો.');
      professionalFollowUp.push('કિડનીના સ્વાસ્થ્ય અંગે ફિઝિશિયનની સલાહ લો.');
    } else {
      nutrition.push('Maintain consistent, adequate daily hydration (2.5–3.0 L/day, unless medically restricted) to maintain renal clearance.');
      nutrition.push('Moderate dietary sodium intake (<2,000 mg/day) and avoid unregulated high-dose protein or creatine supplements.');
      lifestyle.push('Avoid chronic unmonitored use of over-the-counter NSAIDs (ibuprofen, naproxen) which impair renal prostaglandins.');
      monitoring.push('Follow up with repeat Serum Creatinine, eGFR, and Urine Albumin-to-Creatinine Ratio (uACR) in 6–8 weeks.');
      professionalFollowUp.push('Seek clinical review with a nephrologist or internist to differentiate acute kidney strain from chronic conditions.');
    }
  }

  // 5. LIVER ENZYMES (SGOT/SGPT)
  if (isHigh(['sgpt', 'sgot', 'alt', 'ast', 'bilirubin'])) {
    if (lang === 'hi') {
      nutrition.push('ताजे फल, हरी सब्जियां और एंटीऑक्सीडेंट युक्त खाद्य पदार्थ लें; तली-भुनी चीजों से बचें।');
      nutrition.push('शराब और परिष्कृत शर्करा का सेवन पूरी तरह बंद करें।');
      lifestyle.push('स्वस्थ वजन बनाए रखें; फैटी लिवर को कम करने के लिए वजन में 5-7% की कमी लाभकारी है।');
      monitoring.push('8 से 12 सप्ताह में लिवर फंक्शन टेस्ट (LFT) और आवश्यकतानुसार अल्ट्रासाउंड कराएं।');
      professionalFollowUp.push('लिवर एंजाइम वृद्धि के कारणों की जांच के लिए गैस्ट्रोएंटेरोलॉजिस्ट से मिलें।');
    } else if (lang === 'gu') {
      nutrition.push('તાજા ફળો, શાકભાજી લો; ભારે તળેલું અને તેલવાળું ભોજન ટાળો.');
      nutrition.push('દારૂ અને મીઠાઈઓનું સેવન બંધ કરો.');
      lifestyle.push('વજન સંતુલિત રાખો; વ્યાયામથી ફેટી લિવરમાં સુધારો થાય છે.');
      monitoring.push('૮ થી ૧૨ અઠવાડિયા પછી ફરી LFT કરાવો.');
      professionalFollowUp.push('લિવરના સ્વાસ્થ્ય અંગે ગેસ્ટ્રોએન્ટેરોલોજિસ્ટની સલાહ લો.');
    } else {
      nutrition.push('Adopt an antioxidant-rich Mediterranean dietary pattern with abundant cruciferous vegetables and green tea.');
      nutrition.push('Strictly avoid alcohol, industrial trans fats, and high-fructose corn syrups to alleviate hepatic metabolic stress.');
      lifestyle.push('A modest 5–7% loss of total body weight produces substantial reductions in hepatic steatosis and enzyme levels.');
      monitoring.push('Schedule follow-up Liver Function Testing (LFT) and evaluate need for non-invasive abdominal ultrasound in 8–12 weeks.');
      professionalFollowUp.push('Consult a gastroenterologist or hepatologist to screen for metabolic, toxic, or viral etiologies.');
    }
  }

  // DEFAULT / WELLNESS FALLBACK IF NO SPECIFIC ABNORMALITIES TRIGGERED
  if (nutrition.length === 0) {
    if (lang === 'hi') {
      nutrition.push('संतुलित आहार बनाए रखें: मौसमी फल, हरी सब्जियां, साबुत अनाज और पर्याप्त प्रोटीन।');
      nutrition.push('दिनभर में 2 से 3 लीटर स्वच्छ पानी का सेवन करें।');
      lifestyle.push('सप्ताह में 150 मिनट का शारीरिक व्यायाम करें और 7-8 घंटे की गहरी नींद लें।');
      monitoring.push('वार्षिक नियमित स्वास्थ्य जांच (Executive Health Checkup) जारी रखें।');
      professionalFollowUp.push('नियमित वार्षिक निवारक जांच के लिए अपने डॉक्टर से परामर्श करें।');
    } else if (lang === 'gu') {
      nutrition.push('પૌષ્ટિક અને સંતુલિત આહાર જાળવો: ફળો, શાકભાજી અને આખા અનાજ.');
      nutrition.push('દિવસમાં ૨ થી ૩ લિટર પાણી પીવો.');
      lifestyle.push('નિયમિત કસરત કરો અને ૭-૮ કલાકની શાંત ઊંઘ લો.');
      monitoring.push('વાર્ષિક હેલ્થ ચેકઅપ કરાવવાનું ચાલુ રાખો.');
      professionalFollowUp.push('સામાન્ય તબીબી તપાસ માટે તમારા ડૉક્ટરની મુલાકાત લો.');
    } else {
      nutrition.push('Maintain an anti-inflammatory dietary foundation with diverse colorful vegetables, lean proteins, and fiber.');
      nutrition.push('Maintain optimal baseline hydration of 2–2.5 liters of clean water daily.');
      lifestyle.push('Aim for 150+ minutes of moderate weekly physical activity and 7–8 hours of consistent nightly sleep.');
      monitoring.push('Continue routine annual preventative metabolic and hematologic wellness evaluations.');
      professionalFollowUp.push('Discuss longitudinal wellness trends with your primary care provider at your next annual checkup.');
    }
  }

  return {
    nutrition: nutrition.slice(0, 3),
    lifestyle: lifestyle.slice(0, 3),
    monitoring: monitoring.slice(0, 3),
    professionalFollowUp: professionalFollowUp.slice(0, 3)
  };
}
