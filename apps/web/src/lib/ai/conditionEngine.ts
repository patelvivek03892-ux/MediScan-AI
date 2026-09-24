import { MedicalReport, Biomarker } from '../../types/medical';
import { Language } from '../i18n/translations';

export interface GroundedCondition {
  condition: string;
  supportingFinding: string;
  observedValue: string;
  referenceRange: string;
  explanation: string;
  nextStep: string;
  severityNote: string;
}

export function detectGroundedConditions(report: MedicalReport, lang: Language = 'en'): GroundedCondition[] {
  const conditions: GroundedCondition[] = [];
  const abnormals = report.biomarkers.filter(
    (b) => b.status === 'CRITICAL_HIGH' || b.status === 'CRITICAL_LOW' || b.status === 'HIGH' || b.status === 'LOW'
  );

  const getRangeString = (b: Biomarker): string => {
    if (typeof b.refMin === 'number' && typeof b.refMax === 'number') {
      return `${b.refMin} - ${b.refMax} ${b.unit}`;
    }
    if (lang === 'hi') return 'रिपोर्ट में संदर्भ सीमा प्रदान नहीं की गई है।';
    if (lang === 'gu') return 'રિપોર્ટમાં સામાન્ય મર્યાદા આપવામાં આવી નથી.';
    return 'Reference range not provided in the report.';
  };

  const severityNote =
    lang === 'hi'
      ? 'केवल इस रिपोर्ट के आधार पर गंभीरता का निर्धारण नहीं किया जा सकता।'
      : lang === 'gu'
      ? 'માત્ર આ રિપોર્ટના આધારે ગંભીરતા નક્કી કરી શકાતી નથી.'
      : 'Severity cannot be determined from this report alone.';

  // 1. ANEMIA / ERYTHROCYTE DEPLETION
  const hb = abnormals.find((b) => /he[a-z]*globin|hb/i.test(b.name) && (b.status === 'LOW' || b.status === 'CRITICAL_LOW'));
  if (hb) {
    if (lang === 'hi') {
      conditions.push({
        condition: 'एनीमिया (आयरन या पोषण की कमी संभव)',
        supportingFinding: `हीमोग्लोबिन स्तर संदर्भ सीमा से कम है`,
        observedValue: `${hb.value} ${hb.unit}`,
        referenceRange: getRangeString(hb),
        explanation: 'यह परिणाम शरीर में लाल रक्त कोशिकाओं या ऑक्सीजन वहन क्षमता की कमी का संकेत हो सकता है, लेकिन एक एकल परीक्षण कारण की पुष्टि नहीं कर सकता।',
        nextStep: 'आयरन प्रोफाइल (सीरम फेरिटिन) जांच और उचित आहार हेतु योग्य चिकित्सक से परामर्श करें।',
        severityNote
      });
    } else if (lang === 'gu') {
      conditions.push({
        condition: 'એનીમિયા (આયર્નની ઉણપ શક્ય)',
        supportingFinding: `હિમોગ્લોબિન સામાન્ય મર્યાદા કરતાં ઓછું છે`,
        observedValue: `${hb.value} ${hb.unit}`,
        referenceRange: getRangeString(hb),
        explanation: 'આ પરિણામ લોહીમાં ઓક્સિજન પહોંચાડવાની ક્ષમતામાં ઘટાડો સૂચવી શકે છે, પરંતુ માત્ર એક ટેસ્ટ કારણની પુષ્ટિ કરતો નથી.',
        nextStep: 'આયર્ન ટેસ્ટ કરાવો અને ડૉક્ટરની સલાહ લો.',
        severityNote
      });
    } else {
      conditions.push({
        condition: 'Anemia / Nutritional Deficiency Pattern',
        supportingFinding: `Hemoglobin is below standard clinical reference range`,
        observedValue: `${hb.value} ${hb.unit}`,
        referenceRange: getRangeString(hb),
        explanation: 'This finding can be associated with reduced erythrocyte oxygen-carrying capacity. A single isolated test cannot confirm the underlying cause.',
        nextStep: 'Consider discussing iron and ferritin panel evaluation with a qualified physician.',
        severityNote
      });
    }
  }

  // 2. GLYCEMIC DYSREGULATION / DIABETES MELLITUS
  const hba1c = abnormals.find((b) => /hba1c|glycated/i.test(b.name) && (b.status === 'HIGH' || b.status === 'CRITICAL_HIGH'));
  const glucose = abnormals.find((b) => /glucose|sugar/i.test(b.name) && (b.status === 'HIGH' || b.status === 'CRITICAL_HIGH'));
  const sugarMarker = hba1c || glucose;

  if (sugarMarker) {
    if (lang === 'hi') {
      conditions.push({
        condition: 'हाइपरग्लाइसीमिया / रक्त शर्करा असंतुलन (मधुमेह संभव)',
        supportingFinding: `${sugarMarker.name} संदर्भ सीमा से अधिक है`,
        observedValue: `${sugarMarker.value} ${sugarMarker.unit}`,
        referenceRange: getRangeString(sugarMarker),
        explanation: 'यह परिणाम रक्त में शर्करा के बढ़े हुए स्तर को दर्शाता है, जो प्रीडायबिटीज या डायबिटीज से जुड़ा हो सकता है।',
        nextStep: 'उपवास एवं भोजन के बाद की शर्करा जांच तथा एंडोक्रिनोलॉजिस्ट से चिकित्सीय परामर्श लें।',
        severityNote
      });
    } else if (lang === 'gu') {
      conditions.push({
        condition: 'હાઈપરગ્લાયસેમિયા / બ્લડ સુગર અસંતુલન (ડાયાબિટીસ શક્ય)',
        supportingFinding: `${sugarMarker.name} સામાન્ય મર્યાદા કરતાં વધુ છે`,
        observedValue: `${sugarMarker.value} ${sugarMarker.unit}`,
        referenceRange: getRangeString(sugarMarker),
        explanation: 'આ પરિણામ લોહીમાં શર્કરાનું ઊંચું સ્તર દર્શાવે છે, જે પ્રીડાયાબિટીસ અથવા ડાયાબિટીસ સાથે સંકળાયેલ હોઈ શકે છે.',
        nextStep: 'ડાયાબિટીસના નિયંત્રણ માટે ફિઝિશિયનની સલાહ લો.',
        severityNote
      });
    } else {
      conditions.push({
        condition: 'Hyperglycemia / Glycemic Dysregulation',
        supportingFinding: `${sugarMarker.name} is elevated above clinical reference range`,
        observedValue: `${sugarMarker.value} ${sugarMarker.unit}`,
        referenceRange: getRangeString(sugarMarker),
        explanation: 'This result reflects elevated glycemic burden and may correlate with impaired glucose tolerance or diabetes. Clinical confirmation is required.',
        nextStep: 'Discuss clinical management, dietary strategy, and follow-up glycemic tracking with your physician.',
        severityNote
      });
    }
  }

  // 3. DYSLIPIDEMIA / ELEVATED ATHEROGENIC LIPIDS
  const ldl = abnormals.find((b) => /ldl|cholesterol/i.test(b.name) && (b.status === 'HIGH' || b.status === 'CRITICAL_HIGH'));
  if (ldl) {
    if (lang === 'hi') {
      conditions.push({
        condition: 'डिसलिपिडेमिया / एथेरोजेनिक लिपिड वृद्धि',
        supportingFinding: `${ldl.name} अनुशंसित सीमा से अधिक है`,
        observedValue: `${ldl.value} ${ldl.unit}`,
        referenceRange: getRangeString(ldl),
        explanation: 'लिपिड की अधिकता धमनियों में जमाव का कारण बन सकती है और दीर्घकालिक हृदय जोखिम बढ़ा सकती है।',
        nextStep: 'जीवनशैली में बदलाव और कार्डियोवैस्कुलर जोखिम मूल्यांकन के लिए डॉक्टर से परामर्श करें।',
        severityNote
      });
    } else if (lang === 'gu') {
      conditions.push({
        condition: 'ડિસલિપિડેમિયા / કોલેસ્ટ્રોલ વધારો',
        supportingFinding: `${ldl.name} સામાન્ય કરતાં વધુ છે`,
        observedValue: `${ldl.value} ${ldl.unit}`,
        referenceRange: getRangeString(ldl),
        explanation: 'વધેલું કોલેસ્ટ્રોલ રક્તવાહિનીઓમાં અવરોધ ઊભો કરી શકે છે અને હૃદય માટે જોખમી બની શકે છે.',
        nextStep: 'હૃદયના જોખમ મૂલ્યાંકન માટે ડૉક્ટરની મુલાકાત લો.',
        severityNote
      });
    } else {
      conditions.push({
        condition: 'Dyslipidemia / Atherogenic Lipid Profile',
        supportingFinding: `${ldl.name} is elevated above optimal clinical threshold`,
        observedValue: `${ldl.value} ${ldl.unit}`,
        referenceRange: getRangeString(ldl),
        explanation: 'Elevated atherogenic lipoproteins correlate with long-term vascular plaque accumulation risk over time.',
        nextStep: 'Evaluate cardiovascular risk factor profile and lipid management protocols with a physician.',
        severityNote
      });
    }
  }

  // 4. RENAL FILTRATION STRAIN
  const creat = abnormals.find((b) => /creatinine|urea|bun/i.test(b.name) && (b.status === 'HIGH' || b.status === 'CRITICAL_HIGH'));
  if (creat) {
    if (lang === 'hi') {
      conditions.push({
        condition: 'गुर्दे की कार्यप्रणाली पर संभावित दबाव (Renal Filtration Strain)',
        supportingFinding: `${creat.name} सामान्य स्तर से अधिक है`,
        observedValue: `${creat.value} ${creat.unit}`,
        referenceRange: getRangeString(creat),
        explanation: 'यह परिणाम गुर्दे की छानने की गति में कमी या अस्थायी निर्जलीकरण (Dehydration) का संकेत हो सकता है।',
        nextStep: 'हाइड्रेशन स्थिति की समीक्षा और नेफ्रोलॉजिस्ट या फिजिशियन से फॉलो-अप टेस्ट की योजना बनाएं।',
        severityNote
      });
    } else if (lang === 'gu') {
      conditions.push({
        condition: 'કિડની પર સંભવિત ભાર (Renal Filtration Strain)',
        supportingFinding: `${creat.name} સામાન્ય મર્યાદા કરતાં વધુ છે`,
        observedValue: `${creat.value} ${creat.unit}`,
        referenceRange: getRangeString(creat),
        explanation: 'આ પરિણામ કિડનીના ફિલ્ટરેશનમાં ઘટાડો અથવા પાણીની અસ્થાયી અછત સૂચવી શકે છે.',
        nextStep: 'કિડનીની તપાસ માટે ફિઝિશિયન સાથે પરામર્શ કરો.',
        severityNote
      });
    } else {
      conditions.push({
        condition: 'Renal Filtration Strain / Nephron Burden',
        supportingFinding: `${creat.name} is elevated above standard laboratory baseline`,
        observedValue: `${creat.value} ${creat.unit}`,
        referenceRange: getRangeString(creat),
        explanation: 'Elevated nitrogenous metabolites may signify reduced glomerular clearance, high protein breakdown, or acute hydration deficit.',
        nextStep: 'Schedule follow-up renal assessment and eGFR staging with your primary physician.',
        severityNote
      });
    }
  }

  // 5. HEPATIC ENZYME ELEVATION
  const liverEnz = abnormals.find((b) => /sgpt|sgot|alt|ast|bilirubin/i.test(b.name) && (b.status === 'HIGH' || b.status === 'CRITICAL_HIGH'));
  if (liverEnz) {
    if (lang === 'hi') {
      conditions.push({
        condition: 'लिवर एंजाइम वृद्धि (हेपेटिक सूजन संभव)',
        supportingFinding: `${liverEnz.name} सामान्य संदर्भ सीमा से अधिक है`,
        observedValue: `${liverEnz.value} ${liverEnz.unit}`,
        referenceRange: getRangeString(liverEnz),
        explanation: 'यह परिणाम लिवर कोशिकाओं में हल्की सूजन, फैटी लिवर या दवाओं के प्रभाव से जुड़ा हो सकता है।',
        nextStep: 'शराब से परहेज करें और गैस्ट्रोएंटेरोलॉजिस्ट से आगे की जांच (LFT/USG) पर चर्चा करें।',
        severityNote
      });
    } else if (lang === 'gu') {
      conditions.push({
        condition: 'લિવર એન્ઝાઇમ વધારો (હેપેટિક સોજો શક્ય)',
        supportingFinding: `${liverEnz.name} સામાન્ય કરતાં વધુ છે`,
        observedValue: `${liverEnz.value} ${liverEnz.unit}`,
        referenceRange: getRangeString(liverEnz),
        explanation: 'આ પરિણામ લિવર કોષોમાં હળવો સોજો અથવા ફેટી લિવર દર્શાવી શકે છે.',
        nextStep: 'યોગ્ય નિદાન માટે LFT અને સોનોગ્રાફી અંગે ડૉક્ટરની સલાહ લો.',
        severityNote
      });
    } else {
      conditions.push({
        condition: 'Hepatic Transaminase Elevation',
        supportingFinding: `${liverEnz.name} is elevated above normal physiological range`,
        observedValue: `${liverEnz.value} ${liverEnz.unit}`,
        referenceRange: getRangeString(liverEnz),
        explanation: 'Transaminase leakage into the circulation reflects hepatic cellular stress, which can stem from steatosis, medication, or reactive inflammation.',
        nextStep: 'Correlate with a clinical liver function profile and consult a gastroenterologist.',
        severityNote
      });
    }
  }

  return conditions;
}
