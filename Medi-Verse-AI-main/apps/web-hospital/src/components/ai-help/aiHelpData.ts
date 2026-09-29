// ============================================================================
// MEDIVERSE AI - AI HELP DATA & CLINICAL PROCESSING ENGINES
// Fully working dynamic clinical NLP engines, biomarker dictionary,
// pharmacopeia parser, risk assessment matrix, and Ayurvedic knowledge base
// ============================================================================

export interface SymptomCluster {
  id: string;
  name: string;
  category: 'Cardiopulmonary' | 'Gastrointestinal' | 'Infectious' | 'Neurological' | 'Musculoskeletal' | 'General';
  severityWeight: number; // 1-10
}

export const COMMON_SYMPTOMS: SymptomCluster[] = [
  { id: 'fever', name: 'High Fever (>101°F)', category: 'Infectious', severityWeight: 6 },
  { id: 'chills', name: 'Chills & Shivering', category: 'Infectious', severityWeight: 4 },
  { id: 'cough_dry', name: 'Dry Persistent Cough', category: 'Cardiopulmonary', severityWeight: 4 },
  { id: 'cough_productive', name: 'Cough with Phlegm', category: 'Cardiopulmonary', severityWeight: 5 },
  { id: 'chest_pain', name: 'Severe Chest Pressure / Pain', category: 'Cardiopulmonary', severityWeight: 10 },
  { id: 'shortness_of_breath', name: 'Shortness of Breath / Dyspnea', category: 'Cardiopulmonary', severityWeight: 9 },
  { id: 'headache_severe', name: 'Sudden Severe Headache', category: 'Neurological', severityWeight: 8 },
  { id: 'dizziness', name: 'Dizziness or Vertigo', category: 'Neurological', severityWeight: 5 },
  { id: 'nausea_vomiting', name: 'Nausea & Vomiting', category: 'Gastrointestinal', severityWeight: 5 },
  { id: 'abdominal_cramps', name: 'Sharp Abdominal Pain', category: 'Gastrointestinal', severityWeight: 7 },
  { id: 'diarrhea', name: 'Watery Diarrhea (>3 times/day)', category: 'Gastrointestinal', severityWeight: 5 },
  { id: 'fatigue_extreme', name: 'Unexplained Severe Fatigue', category: 'General', severityWeight: 5 },
  { id: 'joint_pain', name: 'Joint Pain & Stiffness', category: 'Musculoskeletal', severityWeight: 4 },
  { id: 'skin_rash', name: 'Spreading Skin Rash / Petechiae', category: 'General', severityWeight: 6 },
  { id: 'sore_throat', name: 'Sore Throat & Difficulty Swallowing', category: 'Infectious', severityWeight: 4 },
  { id: 'loss_of_smell', name: 'Loss of Taste or Smell', category: 'Infectious', severityWeight: 4 },
  { id: 'urinary_burning', name: 'Burning Urination / Frequency', category: 'Infectious', severityWeight: 5 },
  { id: 'back_pain', name: 'Lower Back Pain / Lumbar Strain', category: 'Musculoskeletal', severityWeight: 4 }
];

export interface PossibleConcern {
  condition: string;
  category: string;
  matchScore: number; // 0-100%
  urgency: 'LOW' | 'MODERATE' | 'URGENT_RED_FLAG';
  guidance: string;
  recommendedSpecialty: string;
  lifestyleTips: string[];
}

// Dynamic clinical symptom evaluation engine
export const EVALUATE_SYMPTOMS = (
  selectedSymptoms: string[],
  freeText: string,
  severity: number,
  durationDays: number
): {
  overallUrgency: 'LOW' | 'MODERATE' | 'URGENT_RED_FLAG';
  urgencyReason: string;
  concerns: PossibleConcern[];
  redFlagWarning: string | null;
} | null => {
  const combined = (freeText + ' ' + selectedSymptoms.join(' ')).trim().toLowerCase();
  if (!combined && selectedSymptoms.length === 0) {
    return null;
  }

  // 1. Acute Emergency Red Flags
  const hasChestPain = combined.includes('chest') || combined.includes('heart') || selectedSymptoms.includes('chest_pain');
  const hasShortnessOfBreath = combined.includes('breath') || combined.includes('dyspnea') || combined.includes('choking') || selectedSymptoms.includes('shortness_of_breath');
  const hasNeuroDeficit = combined.includes('stroke') || combined.includes('paralysis') || combined.includes('slurred') || combined.includes('seizure') || (selectedSymptoms.includes('headache_severe') && severity >= 8);
  const isEmergency = (hasChestPain && severity >= 6) || (hasShortnessOfBreath && severity >= 6) || hasNeuroDeficit;

  if (isEmergency) {
    return {
      overallUrgency: 'URGENT_RED_FLAG',
      urgencyReason: 'Potential acute cardiopulmonary or neurological red-flag syndrome detected requiring immediate emergency intervention.',
      redFlagWarning: 'CRITICAL CLINICAL ALERT: Symptoms indicate potential acute myocardial infarction, pulmonary compromise, or neurological emergency. Do not drive yourself — summon ambulance (108 / 112) or proceed to the nearest Emergency Department immediately.',
      concerns: [
        {
          condition: 'Acute Coronary Syndrome / Cardiopulmonary Distress',
          category: 'Cardiovascular Emergency',
          matchScore: 94,
          urgency: 'URGENT_RED_FLAG',
          guidance: 'Immediate 12-lead Electrocardiogram (ECG), continuous SpO2 pulse oximetry, and cardiac troponin biomarker assay required.',
          recommendedSpecialty: 'Emergency Medicine / Cardiology',
          lifestyleTips: ['Sit upright calmly', 'Loosen constricting collars/clothing', 'Do not attempt physical exertion']
        },
        {
          condition: 'Acute Pulmonary Compromise or Severe Bronchospasm',
          category: 'Respiratory Emergency',
          matchScore: 86,
          urgency: 'URGENT_RED_FLAG',
          guidance: 'Immediate oxygen therapy, bronchodilator nebulization, and arterial blood gas analysis.',
          recommendedSpecialty: 'Pulmonology / Critical Care',
          lifestyleTips: ['Maintain seated forward-leaning posture', 'Avoid deep hyperventilation']
        }
      ]
    };
  }

  // 2. Febrile & Vector-borne / Respiratory Infection
  const hasFever = combined.includes('fever') || combined.includes('temperature') || combined.includes('chills') || selectedSymptoms.includes('fever') || selectedSymptoms.includes('chills');
  const hasCoughOrThroat = combined.includes('cough') || combined.includes('throat') || selectedSymptoms.includes('cough_dry') || selectedSymptoms.includes('cough_productive') || selectedSymptoms.includes('sore_throat');
  const hasBodyPain = combined.includes('body ache') || combined.includes('joint') || combined.includes('muscle') || selectedSymptoms.includes('joint_pain');
  const hasRash = combined.includes('rash') || combined.includes('spot') || selectedSymptoms.includes('skin_rash');

  if (hasFever) {
    const isProlonged = durationDays >= 3 || severity >= 6;
    if (hasRash || (hasBodyPain && durationDays >= 2)) {
      return {
        overallUrgency: isProlonged ? 'MODERATE' : 'LOW',
        urgencyReason: 'Acute febrile illness with constitutional musculoskeletal signs. Important to monitor platelet trends and rule out arboviral infection (Dengue/Chikungunya).',
        redFlagWarning: null,
        concerns: [
          {
            condition: 'Arboviral Infection (Dengue / Chikungunya Syndrome)',
            category: 'Infectious Disease',
            matchScore: hasRash ? 89 : 82,
            urgency: isProlonged ? 'MODERATE' : 'LOW',
            guidance: 'Complete Blood Count (CBC) with Platelet count and Dengue NS1 / IgM serology advised. Strictly avoid Aspirin, Brufen or NSAIDs to eliminate hemorrhagic risk.',
            recommendedSpecialty: 'Internal Medicine / Infectious Diseases',
            lifestyleTips: ['Oral Rehydration Solution (ORS) 2.5-3 Liters daily', 'Strict physical bed rest', 'Paracetamol 650mg for fever control as indicated']
          },
          {
            condition: 'Viral Febrile Syndrome / Influenza',
            category: 'General Medicine',
            matchScore: 78,
            urgency: 'LOW',
            guidance: 'Symptomatic supportive management, monitoring oral temperature twice daily.',
            recommendedSpecialty: 'Family Physician / General Practitioner',
            lifestyleTips: ['Nutritious warm broths', 'Avoid strenuous physical exercise']
          }
        ]
      };
    }

    if (hasCoughOrThroat) {
      return {
        overallUrgency: isProlonged ? 'MODERATE' : 'LOW',
        urgencyReason: 'Acute upper/lower respiratory tract infection. Monitor for breathing difficulty or productive colored phlegm.',
        redFlagWarning: null,
        concerns: [
          {
            condition: 'Acute Viral Pharyngitis / Bronchitis',
            category: 'Respiratory Medicine',
            matchScore: 84,
            urgency: isProlonged ? 'MODERATE' : 'LOW',
            guidance: 'Warm saline gargles, steam inhalation, and throat lozenges. Consult doctor if high spikes exceed 102°F or breathlessness occurs.',
            recommendedSpecialty: 'General Physician / Pulmonologist',
            lifestyleTips: ['Warm saline gargles 3x daily', 'Hydration with warm herbal water', 'Rest vocal cords']
          },
          {
            condition: 'Seasonal Influenza (Flu)',
            category: 'Infectious Disease',
            matchScore: 76,
            urgency: 'LOW',
            guidance: 'Supportive antipyretic care and adequate sleep.',
            recommendedSpecialty: 'Internal Medicine',
            lifestyleTips: ['Isolation during active sneezing/fever', 'Hand hygiene']
          }
        ]
      };
    }
  }

  // 3. Gastrointestinal Distress
  const hasGI = combined.includes('stomach') || combined.includes('vomit') || combined.includes('nausea') || combined.includes('diarrhea') || combined.includes('loose') || selectedSymptoms.includes('nausea_vomiting') || selectedSymptoms.includes('diarrhea') || selectedSymptoms.includes('abdominal_cramps');

  if (hasGI) {
    const isModerate = severity >= 6 || durationDays >= 2;
    return {
      overallUrgency: isModerate ? 'MODERATE' : 'LOW',
      urgencyReason: 'Gastrointestinal inflammation or gastroenteritis. Highest priority is maintaining fluid-electrolyte balance and preventing dehydration.',
      redFlagWarning: null,
      concerns: [
        {
          condition: 'Acute Infectious Gastroenteritis',
          category: 'Gastroenterology',
          matchScore: 87,
          urgency: isModerate ? 'MODERATE' : 'LOW',
          guidance: 'Continuous oral rehydration with electrolyte solutions (ORS). Stool routine examination if symptoms persist beyond 48 hours or if blood/mucus is present.',
          recommendedSpecialty: 'Gastroenterologist / Primary Care Physician',
          lifestyleTips: ['BRAT Diet (Banana, Rice, Applesauce, Toast)', 'Electrolyte ORS sachets', 'Avoid dairy, spicy curries, and fried food']
        },
        {
          condition: 'Dyspepsia / Acid Reflux Flare',
          category: 'Digestive Health',
          matchScore: 71,
          urgency: 'LOW',
          guidance: 'Antacid trial and maintaining upright posture for 2 hours post-meals.',
          recommendedSpecialty: 'Family Medicine',
          lifestyleTips: ['Small frequent meals', 'Avoid eating right before sleeping']
        }
      ]
    };
  }

  // 4. Urinary Complaints
  if (combined.includes('urine') || combined.includes('burning') || selectedSymptoms.includes('urinary_burning')) {
    return {
      overallUrgency: severity >= 6 ? 'MODERATE' : 'LOW',
      urgencyReason: 'Possible lower urinary tract irritation or infection requiring hydration and urine microscopy.',
      redFlagWarning: null,
      concerns: [
        {
          condition: 'Urinary Tract Infection (Cystitis)',
          category: 'Urology / Internal Medicine',
          matchScore: 88,
          urgency: severity >= 6 ? 'MODERATE' : 'LOW',
          guidance: 'Urine Routine & Microscopic Examination (R/M) and Culture. Increase water intake to 3 Liters daily.',
          recommendedSpecialty: 'Urologist / General Physician',
          lifestyleTips: ['Drink 3L of water daily', 'Cranberry extract or barley water', 'Do not hold urine']
        }
      ]
    };
  }

  // 5. Default General / Musculoskeletal / Tension
  return {
    overallUrgency: severity >= 7 ? 'MODERATE' : 'LOW',
    urgencyReason: severity >= 7 
      ? 'Persistent symptoms of elevated intensity. Clinical consultation recommended within 48 hours for objective evaluation.'
      : 'Mild symptoms likely arising from physical fatigue, tension, postural strain, or mild dehydration.',
    redFlagWarning: null,
    concerns: [
      {
        condition: 'Tension-Type Strain & Physical Exhaustion',
        category: 'Lifestyle & Neuromuscular',
        matchScore: 75,
        urgency: 'LOW',
        guidance: 'Adequate hydration (2.5L water/day), sleep restoration (7-8 hours), ergonomic correction, and stress modulation.',
        recommendedSpecialty: 'General Physician / Wellness Clinic',
        lifestyleTips: ['Dark quiet room rest', 'Warm shower', 'Break repetitive screen time']
      },
      {
        condition: 'Postural Musculoskeletal Myalgia',
        category: 'Orthopedics / Physical Therapy',
        matchScore: 68,
        urgency: 'LOW',
        guidance: 'Gentle stretching, warm compress, and maintaining spinal alignment.',
        recommendedSpecialty: 'Physical Medicine & Rehabilitation',
        lifestyleTips: ['Gentle neck and back stretches', 'Ergonomic chair posture']
      }
    ]
  };
};

// ============================================================================
// FEATURE 2: HEALTH RISK ASSESSMENT MODELS
// ============================================================================

export interface PatientRiskInputs {
  age: number;
  gender: 'male' | 'female' | 'other';
  heightCm: number;
  weightKg: number;
  systolicBP: number; // mmHg
  diastolicBP: number; // mmHg
  fastingBloodGlucose: number; // mg/dL
  totalCholesterol: number; // mg/dL
  smokingStatus: 'never' | 'former' | 'current';
  alcoholIntake: 'none' | 'occasional' | 'frequent';
  physicalActivity: 'sedentary' | 'moderate' | 'active';
  familyHistory: {
    heartDisease: boolean;
    diabetes: boolean;
    hypertension: boolean;
    stroke: boolean;
  };
}

export interface RiskAssessmentResult {
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  overallScore: number; // 0-100
  bmi: number;
  bmiCategory: string;
  cardiovascularScore: number; // 0-100
  metabolicScore: number; // 0-100
  respiratoryScore: number; // 0-100
  lifestyleScore: number; // 0-100
  keyRiskDrivers: string[];
  preventiveActionPlan: {
    diet: string[];
    exercise: string[];
    recommendedTests: string[];
    clinicalTargets: string[];
  };
}

export const CALCULATE_HEALTH_RISK = (data: PatientRiskInputs): RiskAssessmentResult => {
  const heightM = data.heightCm > 0 ? data.heightCm / 100 : 1.7;
  const bmi = data.weightKg > 0 ? parseFloat((data.weightKg / (heightM * heightM)).toFixed(1)) : 22.0;

  let bmiCat = 'Normal Weight';
  let bmiPoints = 0;
  if (bmi < 18.5) { bmiCat = 'Underweight'; bmiPoints = 5; }
  else if (bmi < 25) { bmiCat = 'Normal Weight (Healthy)'; bmiPoints = 0; }
  else if (bmi < 30) { bmiCat = 'Overweight'; bmiPoints = 12; }
  else { bmiCat = 'Obese (High Risk)'; bmiPoints = 25; }

  let cvPoints = 0;
  const drivers: string[] = [];

  if (data.age > 45) cvPoints += 12;
  if (data.age > 60) cvPoints += 10;
  if (data.systolicBP >= 140 || data.diastolicBP >= 90) {
    cvPoints += 25;
    drivers.push(`Hypertension Alert: BP ${data.systolicBP}/${data.diastolicBP} mmHg`);
  } else if (data.systolicBP >= 130) {
    cvPoints += 12;
    drivers.push(`Pre-hypertension: SBP ${data.systolicBP} mmHg`);
  }

  if (data.totalCholesterol >= 240) {
    cvPoints += 24;
    drivers.push(`Hypercholesterolemia: ${data.totalCholesterol} mg/dL (Target < 200)`);
  } else if (data.totalCholesterol >= 200) {
    cvPoints += 12;
  }

  if (data.smokingStatus === 'current') {
    cvPoints += 25;
    drivers.push('Active Tobacco / Smoking: Major independent vascular hazard');
  }

  if (data.familyHistory.heartDisease || data.familyHistory.stroke) {
    cvPoints += 15;
    drivers.push('Strong positive family history for premature cardiovascular disease');
  }

  let metaPoints = bmiPoints;
  if (data.fastingBloodGlucose >= 126) {
    metaPoints += 35;
    drivers.push(`Hyperglycemia / Diabetes range fasting glucose: ${data.fastingBloodGlucose} mg/dL`);
  } else if (data.fastingBloodGlucose >= 100) {
    metaPoints += 18;
    drivers.push(`Impaired Fasting Glucose (Prediabetes): ${data.fastingBloodGlucose} mg/dL`);
  }
  if (data.familyHistory.diabetes) metaPoints += 15;

  let lifePoints = 0;
  if (data.physicalActivity === 'sedentary') {
    lifePoints += 20;
    drivers.push('Sedentary Lifestyle: Lack of regular aerobic movement');
  } else if (data.physicalActivity === 'moderate') {
    lifePoints += 8;
  }
  if (data.alcoholIntake === 'frequent') {
    lifePoints += 18;
    drivers.push('Frequent Alcohol Intake: Elevation of triglycerides & hepatic strain');
  }

  const cvNormalized = Math.min(100, Math.round(cvPoints * 1.1));
  const metaNormalized = Math.min(100, Math.round(metaPoints * 1.1));
  const respNormalized = Math.min(100, Math.round((data.smokingStatus === 'current' ? 65 : 15) + (data.age > 50 ? 15 : 5)));
  const lifeNormalized = Math.min(100, Math.round(lifePoints * 2.2));

  const overall = Math.min(100, Math.round(
    cvNormalized * 0.4 + metaNormalized * 0.35 + respNormalized * 0.15 + lifeNormalized * 0.1
  ));

  let level: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (overall >= 60) level = 'HIGH';
  else if (overall >= 30) level = 'MEDIUM';

  return {
    overallRiskLevel: level,
    overallScore: overall,
    bmi,
    bmiCategory: bmiCat,
    cardiovascularScore: cvNormalized,
    metabolicScore: metaNormalized,
    respiratoryScore: respNormalized,
    lifestyleScore: lifeNormalized,
    keyRiskDrivers: drivers.length > 0 ? drivers : ['No acute biometric risk factors detected.'],
    preventiveActionPlan: {
      diet: [
        'Adopt Mediterranean or DASH dietary pattern (leafy greens, omega-3, legumes)',
        'Restrict dietary sodium < 2.3g/day (under 1 teaspoon table salt)',
        'Eliminate ultra-processed foods, refined flours, and sugary sweetened beverages',
        'Consume minimum 30g dietary fiber daily'
      ],
      exercise: [
        '150 minutes of moderate-intensity aerobic activity (brisk walking 30 mins, 5 days/wk)',
        'Resistance/strength training 2 times per week for skeletal muscle insulin sensitivity',
        'Break continuous sitting intervals every 45 minutes with 2-minute movement breaks'
      ],
      recommendedTests: [
        'Comprehensive Lipid Profile (LDL-C, HDL-C, Non-HDL, Triglycerides)',
        'Glycated Hemoglobin (HbA1c) 3-month glycemic audit',
        'High-Sensitivity C-Reactive Protein (hs-CRP) for vascular inflammation'
      ],
      clinicalTargets: [
        'Target Blood Pressure: < 125/80 mmHg',
        'Target Fasting Blood Glucose: 70 - 99 mg/dL',
        'Target LDL-Cholesterol: < 100 mg/dL',
        'Target BMI: 18.5 - 24.9 kg/m²'
      ]
    }
  };
};

// ============================================================================
// FEATURE 3: DYNAMIC PRESCRIPTION PARSER & PHARMACOPEIA ENGINE
// ============================================================================

export interface ExtractedMedicine {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  form: 'Tablet' | 'Capsule' | 'Syrup' | 'Inhaler' | 'Injection' | 'Drops';
  frequency: string;
  timing: 'After Meals' | 'Before Meals' | 'With Food' | 'Bedtime' | 'Empty Stomach';
  duration: string;
  purpose: string;
  patientExplanation: string;
  cautions: string[];
  commonSideEffects: string[];
}

// Master clinical drug database for dynamic extraction and explanation
interface DrugKnowledge {
  generic: string;
  category: string;
  purpose: string;
  explanation: string;
  defaultDose: string;
  defaultTiming: ExtractedMedicine['timing'];
  cautions: string[];
  sideEffects: string[];
}

const DRUG_KNOWLEDGE_BASE: Record<string, DrugKnowledge> = {
  amoxicillin: {
    generic: 'Amoxicillin Trihydrate',
    category: 'Penicillin-Class Antibiotic',
    purpose: 'Treats bacterial infections in respiratory tract, ear, nose, throat, or skin',
    explanation: 'A broad-spectrum antibiotic that destroys bacterial cell walls. Always finish the entire prescribed duration even if you feel 100% better to prevent antibiotic-resistant superbugs.',
    defaultDose: '500 mg',
    defaultTiming: 'After Meals',
    cautions: ['Complete full course', 'Notify doctor if rash appears', 'Do not consume alcohol'],
    sideEffects: ['Mild nausea', 'Diarrhea', 'Stomach upset']
  },
  augmentin: {
    generic: 'Amoxicillin + Potassium Clavulanate',
    category: 'Potentiated Beta-Lactam Antibiotic',
    purpose: 'Clears resistant bacterial respiratory, sinus, or dental infections',
    explanation: 'Contains amoxicillin combined with clavulanate to prevent bacteria from inactivating the medicine. Take with or after food to protect your stomach.',
    defaultDose: '625 mg',
    defaultTiming: 'After Meals',
    cautions: ['Complete full course', 'Take after meals', 'Report severe diarrhea'],
    sideEffects: ['Mild loose stools', 'Nausea']
  },
  metformin: {
    generic: 'Metformin Hydrochloride',
    category: 'Biguanide Antidiabetic',
    purpose: 'Lowers high blood sugar in Type 2 Diabetes',
    explanation: 'Reduces glucose output from your liver and helps your muscles absorb natural insulin. Always take with or right after meals to avoid gastrointestinal bloating.',
    defaultDose: '500 mg',
    defaultTiming: 'With Food',
    cautions: ['Take with food', 'Stay hydrated', 'Inform doctor before contrast CT scans'],
    sideEffects: ['Bloating', 'Metallic taste', 'Mild nausea']
  },
  pantoprazole: {
    generic: 'Pantoprazole Sodium',
    category: 'Proton Pump Inhibitor (PPI)',
    purpose: 'Suppresses stomach acid secretion for gastritis, ulcers, and GERD',
    explanation: 'Shuts down active acid pumps in the stomach lining. Works most effectively when taken first thing in the morning 30 minutes before breakfast.',
    defaultDose: '40 mg',
    defaultTiming: 'Empty Stomach',
    cautions: ['Take 30 mins before first meal', 'Do not crush or chew tablets'],
    sideEffects: ['Headache', 'Mild constipation']
  },
  pan: {
    generic: 'Pantoprazole Sodium',
    category: 'Proton Pump Inhibitor (PPI)',
    purpose: 'Suppresses stomach acid secretion for gastritis and reflux',
    explanation: 'Shuts down stomach acid pumps. Best taken on an empty stomach first thing in the morning.',
    defaultDose: '40 mg',
    defaultTiming: 'Empty Stomach',
    cautions: ['Take before breakfast'],
    sideEffects: ['Mild headache']
  },
  paracetamol: {
    generic: 'Paracetamol (Acetaminophen)',
    category: 'Analgesic & Antipyretic',
    purpose: 'Relieves fever and mild-to-moderate body pain or headaches',
    explanation: 'Acts on pain and thermal regulation pathways in the brain to reduce fever and soothe pain without irritating stomach lining.',
    defaultDose: '650 mg',
    defaultTiming: 'After Meals',
    cautions: ['Do not exceed 3000mg in 24 hours', 'Avoid alcohol'],
    sideEffects: ['Rare at normal doses']
  },
  dolo: {
    generic: 'Paracetamol 650mg',
    category: 'Antipyretic Analgesic',
    purpose: 'Fast fever reduction and relief of aches and pain',
    explanation: 'Reduces temperature and eases muscle pain. Space doses at least 4 to 6 hours apart.',
    defaultDose: '650 mg',
    defaultTiming: 'After Meals',
    cautions: ['Maximum 4 tablets per day', 'Do not double dose'],
    sideEffects: ['Very safe at recommended doses']
  },
  telmisartan: {
    generic: 'Telmisartan',
    category: 'Angiotensin Receptor Blocker (ARB)',
    purpose: 'Controls high blood pressure and shields heart and kidneys',
    explanation: 'Relaxes smooth muscles in your arteries, making it easier for your heart to pump blood throughout the body. Take consistently every morning.',
    defaultDose: '40 mg',
    defaultTiming: 'Before Meals',
    cautions: ['Do not stop abruptly', 'Avoid potassium salts without check'],
    sideEffects: ['Dizziness on standing up quickly']
  },
  telma: {
    generic: 'Telmisartan',
    category: 'Antihypertensive ARB',
    purpose: 'Long-acting 24-hour blood pressure regulation',
    explanation: 'Keeps blood pressure within healthy targets and protects heart muscle.',
    defaultDose: '40 mg',
    defaultTiming: 'Before Meals',
    cautions: ['Take consistently every morning'],
    sideEffects: ['Occasional lightheadedness']
  },
  atorvastatin: {
    generic: 'Atorvastatin Calcium',
    category: 'HMG-CoA Reductase Inhibitor (Statin)',
    purpose: 'Lowers LDL bad cholesterol and stabilizes vascular walls',
    explanation: 'Slows down cholesterol production in the liver. Most effective when taken in the evening or at bedtime.',
    defaultDose: '10 mg',
    defaultTiming: 'Bedtime',
    cautions: ['Avoid grapefruit juice', 'Report unexplained severe muscle aches'],
    sideEffects: ['Mild muscle tiredness']
  },
  cetirizine: {
    generic: 'Cetirizine Dihydrochloride',
    category: 'Second-Generation Antihistamine',
    purpose: 'Relieves allergic rhinitis, sneezing, runny nose, and hives',
    explanation: 'Blocks histamine receptors to prevent allergic inflammation. Take in the evening because it can cause mild sleepiness.',
    defaultDose: '10 mg',
    defaultTiming: 'Bedtime',
    cautions: ['May cause mild sedation; avoid alcohol'],
    sideEffects: ['Drowsiness', 'Dry mouth']
  },
  azithromycin: {
    generic: 'Azithromycin',
    category: 'Macrolide Antibiotic',
    purpose: 'Short-course antibiotic for throat, chest, and sinus infections',
    explanation: 'Stops bacterial growth. Usually prescribed as a convenient once-daily 3 or 5 day regimen.',
    defaultDose: '500 mg',
    defaultTiming: 'After Meals',
    cautions: ['Complete the full 3 or 5 day course'],
    sideEffects: ['Mild stomach cramps', 'Nausea']
  },
  montelukast: {
    generic: 'Montelukast Sodium',
    category: 'Leukotriene Receptor Antagonist',
    purpose: 'Prevents airway bronchospasm and allergic asthma flares',
    explanation: 'Blocks inflammatory leukotrienes in lung airways to ease breathing and stop night coughing.',
    defaultDose: '10 mg',
    defaultTiming: 'Bedtime',
    cautions: ['Take consistently at bedtime'],
    sideEffects: ['Mild headache', 'Vivid dreams']
  },
  montek: {
    generic: 'Montelukast + Levocetirizine',
    category: 'Dual Anti-allergic & Bronchial Stabilizer',
    purpose: 'Treats allergic cough, rhinitis, and night breathing difficulty',
    explanation: 'Combines an anti-allergic with an airway stabilizer to ensure restful breathing through the night.',
    defaultDose: '10mg / 5mg',
    defaultTiming: 'Bedtime',
    cautions: ['Take at night; may cause relaxation'],
    sideEffects: ['Mild sedation', 'Dry mouth']
  }
};

// Real Dynamic Prescription Text Parser
export const PARSE_PRESCRIPTION_TEXT = (rawText: string): ExtractedMedicine[] => {
  if (!rawText.trim()) return [];

  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  const extracted: ExtractedMedicine[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    // Check against drug knowledge base
    for (const [key, info] of Object.entries(DRUG_KNOWLEDGE_BASE)) {
      if (lineLower.includes(key)) {
        // Extract dosage if present in line (e.g. 500mg, 625 mg, 40mg, 10ml)
        const doseMatch = line.match(/\b\d+(\.\d+)?\s*(mg|g|mcg|ml)\b/i);
        const dosage = doseMatch ? doseMatch[0] : info.defaultDose;

        // Extract frequency (e.g. 1-0-1, 1-1-1, 0-0-1, 1-0-0, OD, BD, TDS, BID, TID, HS)
        let frequency = '1-0-1 (Twice Daily)';
        if (/1-1-1|tds|tid|three times/i.test(line)) frequency = '1-1-1 (Three Times Daily)';
        else if (/0-0-1|hs|bedtime|night/i.test(line)) frequency = '0-0-1 (Once Daily at Night)';
        else if (/1-0-0|od|once daily|morning/i.test(line)) frequency = '1-0-0 (Once Daily Morning)';
        else if (/1-0-1|bd|bid|twice daily/i.test(line)) frequency = '1-0-1 (Twice Daily)';
        else if (/sos|prn|as needed/i.test(line)) frequency = 'SOS (As Needed for Pain/Fever)';

        // Extract timing
        let timing: ExtractedMedicine['timing'] = info.defaultTiming;
        if (/before food|empty stomach|ac\b/i.test(line)) timing = 'Before Meals';
        else if (/after food|after meal|pc\b/i.test(line)) timing = 'After Meals';
        else if (/with food|with meal/i.test(line)) timing = 'With Food';
        else if (/bedtime|night/i.test(line)) timing = 'Bedtime';

        // Extract duration
        const durationMatch = line.match(/(\d+)\s*(days?|weeks?|months?)/i);
        const duration = durationMatch ? durationMatch[0] : '5 Days';

        // Form
        let form: ExtractedMedicine['form'] = 'Tablet';
        if (/syp|syrup|linctus/i.test(line)) form = 'Syrup';
        else if (/cap|capsule/i.test(line)) form = 'Capsule';
        else if (/inhaler|puff/i.test(line)) form = 'Inhaler';
        else if (/drops?/i.test(line)) form = 'Drops';

        // Format nice display name
        const cleanName = line.replace(/^\d+[\.\)]\s*/, '').split(/\s*(x|sig|for|\bpo\b|\btab\b|\bcap\b|\bsyp\b)/i)[0].trim() || key.toUpperCase();

        extracted.push({
          id: 'rx_med_' + Date.now() + '_' + i,
          name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
          genericName: info.generic,
          dosage,
          form,
          frequency,
          timing,
          duration,
          purpose: info.purpose,
          patientExplanation: info.explanation,
          cautions: info.cautions,
          commonSideEffects: info.sideEffects
        });

        break; // Match found for this line
      }
    }
  }

  // If no recognized pharmaceutical in database, construct generic structured items from lines
  if (extracted.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/tab|cap|syp|inj|mg|rx|sig/i.test(line) && line.length > 5) {
        const doseMatch = line.match(/\b\d+(\.\d+)?\s*(mg|g|mcg|ml)\b/i);
        extracted.push({
          id: 'rx_custom_' + Date.now() + '_' + i,
          name: line.replace(/^\d+[\.\)]\s*/, '').slice(0, 30),
          genericName: 'Prescribed Pharmaceutical Compound',
          dosage: doseMatch ? doseMatch[0] : 'As Directed',
          form: 'Tablet',
          frequency: line.includes('1-1-1') ? '1-1-1 (TDS)' : '1-0-1 (BD)',
          timing: 'After Meals',
          duration: '5 Days',
          purpose: 'Prescribed clinical therapy indicated by physician',
          patientExplanation: 'Take exactly as scheduled by your doctor with a full glass of water.',
          cautions: ['Do not exceed prescribed dosage', 'Keep out of reach of children'],
          commonSideEffects: ['Mild gastrointestinal variability']
        });
      }
    }
  }

  return extracted;
};

// ============================================================================
// FEATURE 4: DYNAMIC LAB REPORT ANALYZER & BIOMARKER DATABASE
// ============================================================================

export interface LabParameter {
  name: string;
  measuredValue: number | string;
  unit: string;
  normalRange: string;
  status: 'NORMAL' | 'HIGH' | 'LOW' | 'CRITICAL';
  medicalMeaning: string;
  plainEnglishExplanation: string;
  doctorDiscussionTip: string;
}

interface BiomarkerDef {
  aliases: string[];
  unit: string;
  minNormal: number;
  maxNormal: number;
  criticalLow?: number;
  criticalHigh?: number;
  meaning: string;
  lowExplanation: string;
  highExplanation: string;
  normalExplanation: string;
  doctorTip: string;
}

const BIOMARKER_DICTIONARY: Record<string, BiomarkerDef> = {
  hemoglobin: {
    aliases: ['hemoglobin', 'hb', 'haemoglobin'],
    unit: 'g/dL',
    minNormal: 12.0,
    maxNormal: 17.5,
    criticalLow: 8.0,
    meaning: 'Oxygen-carrying protein in red blood cells.',
    lowExplanation: 'Your hemoglobin is below target (Anemia). Fewer oxygen-carriers are traveling in your blood, which can cause fatigue, paleness, or breathlessness on exertion.',
    highExplanation: 'Hemoglobin is elevated above target. Can occur in dehydration, smoking, high altitude, or bone marrow overproduction.',
    normalExplanation: 'Your oxygen-carrying hemoglobin levels are healthy and within standard limits.',
    doctorTip: 'Discuss iron, ferritin, and vitamin B12 stores if reading is low.'
  },
  wbc: {
    aliases: ['wbc', 'tlc', 'white blood cells', 'leukocyte'],
    unit: 'cells/mcL',
    minNormal: 4000,
    maxNormal: 11000,
    criticalHigh: 20000,
    criticalLow: 2500,
    meaning: 'Total immune defense circulating white blood cells.',
    lowExplanation: 'Leukocyte count is low (Leukopenia), which may temporarily reduce resistance against infections.',
    highExplanation: 'Leukocyte count is elevated (Leukocytosis), standard immune response indicating your body is actively fighting inflammation or bacterial infection.',
    normalExplanation: 'Your immune white blood cell count is balanced with no acute systemic defense reaction.',
    doctorTip: 'Correlate with active symptoms like fever or cough.'
  },
  platelets: {
    aliases: ['platelet', 'platelets', 'plt', 'thrombocyte'],
    unit: 'mcL',
    minNormal: 150000,
    maxNormal: 450000,
    criticalLow: 50000,
    criticalHigh: 750000,
    meaning: 'Blood clotting cells that prevent and stop bleeding.',
    lowExplanation: 'Platelet count is low (Thrombocytopenia), commonly seen in viral fevers like Dengue. Higher risk of bruising or bleeding.',
    highExplanation: 'Platelet count is elevated (Thrombocytosis), often a reactive response to iron deficiency or chronic inflammation.',
    normalExplanation: 'Blood clotting platelet count is within the healthy safety range.',
    doctorTip: 'Monitor serial counts if you have an active viral illness.'
  },
  creatinine: {
    aliases: ['creatinine', 'serum creatinine'],
    unit: 'mg/dL',
    minNormal: 0.6,
    maxNormal: 1.2,
    criticalHigh: 2.0,
    meaning: 'Muscle metabolic waste filtered exclusively by the kidneys.',
    lowExplanation: 'Creatinine is low, generally harmless and related to low muscle mass or high fluid intake.',
    highExplanation: 'Creatinine is elevated! This indicates that kidney filtration efficiency is reduced and metabolic waste is accumulating in the blood.',
    normalExplanation: 'Your kidney filtration waste clearance is operating normally.',
    doctorTip: 'Avoid painkillers (NSAIDs) and review blood pressure immediately if elevated.'
  },
  egfr: {
    aliases: ['egfr', 'gfr', 'estimated gfr'],
    unit: 'mL/min/1.73m²',
    minNormal: 60,
    maxNormal: 120,
    criticalLow: 30,
    meaning: 'Calculated rate of kidney filtration per minute.',
    lowExplanation: 'Kidney filtration efficiency is significantly reduced. Immediate nephrology evaluation and dietary sodium/protein monitoring needed.',
    highExplanation: 'Hyperfiltration rate, commonly seen in early diabetes or pregnancy.',
    normalExplanation: 'Kidney filtration speed is healthy (> 60 mL/min).',
    doctorTip: 'Consult a nephrologist if eGFR remains persistently below 60.'
  },
  glucose: {
    aliases: ['fasting glucose', 'blood sugar', 'fasting blood sugar', 'fbs', 'glucose'],
    unit: 'mg/dL',
    minNormal: 70,
    maxNormal: 99,
    criticalHigh: 200,
    criticalLow: 54,
    meaning: 'Circulating fuel and energy sugar in bloodstream.',
    lowExplanation: 'Hypoglycemia alert. Low blood sugar can cause dizziness, sweating, shaking, and confusion. Consume fast-acting carbs immediately.',
    highExplanation: 'Elevated blood sugar (Prediabetes: 100-125, Diabetes: >=126). Your pancreas and insulin receptors are struggling to process carbs.',
    normalExplanation: 'Fasting blood glucose is in the optimal healthy range.',
    doctorTip: 'Perform a 3-month HbA1c test to confirm long-term glycemic control.'
  },
  hba1c: {
    aliases: ['hba1c', 'glycated hemoglobin', 'a1c'],
    unit: '%',
    minNormal: 4.0,
    maxNormal: 5.6,
    criticalHigh: 9.0,
    meaning: 'Average blood sugar control over the preceding 90 days.',
    lowExplanation: 'A1c is below typical range, usually seen in hemolytic anemia or hypoglycemia.',
    highExplanation: 'Elevated A1c (5.7-6.4% Prediabetes, >=6.5% Diabetes). Elevated blood sugar is sticking to red blood cells, risking vascular damage.',
    normalExplanation: 'Excellent 3-month blood sugar control with low diabetic risk.',
    doctorTip: 'Discuss dietary carbohydrate restriction and lifestyle modulation.'
  },
  cholesterol: {
    aliases: ['total cholesterol', 'cholesterol'],
    unit: 'mg/dL',
    minNormal: 120,
    maxNormal: 199,
    criticalHigh: 280,
    meaning: 'Total circulating blood lipid and fatty substance.',
    lowExplanation: 'Unusually low cholesterol can sometimes occur with malabsorption or malnutrition.',
    highExplanation: 'Total cholesterol is elevated (>200 mg/dL). Excess circulating fats can accumulate inside arterial walls over time.',
    normalExplanation: 'Total cholesterol is in the healthy desirable range (< 200 mg/dL).',
    doctorTip: 'Check specific LDL, HDL, and Triglyceride fractions.'
  },
  ldl: {
    aliases: ['ldl', 'ldl cholesterol', 'bad cholesterol'],
    unit: 'mg/dL',
    minNormal: 50,
    maxNormal: 99,
    criticalHigh: 160,
    meaning: 'Atherogenic lipoprotein that deposits plaque inside arteries.',
    lowExplanation: 'Very low LDL is generally considered cardioprotective.',
    highExplanation: 'High LDL! This is the "bad" cholesterol that narrows arteries supplying the heart and brain, increasing cardiovascular event risk.',
    normalExplanation: 'LDL cholesterol is at an optimal healthy level (< 100 mg/dL).',
    doctorTip: 'Target is < 100 mg/dL (or < 70 if you have hypertension or diabetes).'
  },
  triglycerides: {
    aliases: ['triglycerides', 'tg', 'serum triglycerides'],
    unit: 'mg/dL',
    minNormal: 50,
    maxNormal: 149,
    criticalHigh: 350,
    meaning: 'Circulating fats directly derived from excess dietary sugars and alcohol.',
    lowExplanation: 'Low triglycerides are typical with low-fat, low-sugar diets.',
    highExplanation: 'Elevated triglycerides (>150 mg/dL). High intake of refined sugar, carbs, or alcohol causes fatty liver stress and vascular strain.',
    normalExplanation: 'Triglyceride levels are healthy (< 150 mg/dL).',
    doctorTip: 'Cut refined carbohydrates and sweet drinks to drop triglycerides fast.'
  },
  sgpt: {
    aliases: ['sgpt', 'alt', 'alanine aminotransferase'],
    unit: 'U/L',
    minNormal: 7,
    maxNormal: 45,
    criticalHigh: 120,
    meaning: 'Primary liver cell enzyme released into blood upon hepatic irritation.',
    lowExplanation: 'Low ALT is clinically normal.',
    highExplanation: 'Elevated SGPT/ALT indicates active liver stress, frequently caused by fatty liver, viral hepatitis, alcohol, or medications.',
    normalExplanation: 'Liver enzyme levels are normal, indicating healthy hepatocyte function.',
    doctorTip: 'Consider abdominal ultrasound for fatty liver if persistently elevated.'
  },
  tsh: {
    aliases: ['tsh', 'thyroid stimulating hormone'],
    unit: 'uIU/mL',
    minNormal: 0.4,
    maxNormal: 4.5,
    criticalHigh: 10.0,
    criticalLow: 0.1,
    meaning: 'Pituitary signal regulating thyroid hormone synthesis.',
    lowExplanation: 'Low TSH suggests hyperthyroidism (overactive thyroid), causing racing heart, weight loss, or anxiety.',
    highExplanation: 'Elevated TSH indicates hypothyroidism (underactive thyroid), where the body lacks thyroid hormone, causing fatigue, coldness, and weight gain.',
    normalExplanation: 'Thyroid stimulating hormone is in the normal euthyroid range.',
    doctorTip: 'Check Free T3 and Free T4 if TSH is abnormal.'
  }
};

// Real Dynamic Lab Report Parser
export const PARSE_LAB_REPORT_TEXT = (rawText: string): LabParameter[] => {
  if (!rawText.trim()) return [];

  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 2);
  const detected: LabParameter[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineLower = line.toLowerCase();

    for (const [key, bio] of Object.entries(BIOMARKER_DICTIONARY)) {
      const matchAlias = bio.aliases.some(a => lineLower.includes(a));
      if (matchAlias) {
        // Extract number in line (e.g. "Hemoglobin 10.4 g/dL" or "ALT: 64")
        const numMatch = line.match(/[:\s](\d+(\.\d+)?)/);
        if (numMatch) {
          const val = parseFloat(numMatch[1]);
          let status: LabParameter['status'] = 'NORMAL';
          let explanation = bio.normalExplanation;

          if (bio.criticalHigh && val >= bio.criticalHigh) {
            status = 'CRITICAL';
            explanation = bio.highExplanation;
          } else if (bio.criticalLow && val <= bio.criticalLow) {
            status = 'CRITICAL';
            explanation = bio.lowExplanation;
          } else if (val > bio.maxNormal) {
            status = 'HIGH';
            explanation = bio.highExplanation;
          } else if (val < bio.minNormal) {
            status = 'LOW';
            explanation = bio.lowExplanation;
          }

          detected.push({
            name: key.toUpperCase(),
            measuredValue: val,
            unit: bio.unit,
            normalRange: `${bio.minNormal} - ${bio.maxNormal}`,
            status,
            medicalMeaning: bio.meaning,
            plainEnglishExplanation: explanation,
            doctorDiscussionTip: bio.doctorTip
          });
          break;
        }
      }
    }
  }

  return detected;
};

// ============================================================================
// FEATURE 5: SCHEDULED MEDICINE INTERFACE
// ============================================================================

export interface ScheduledMedicine {
  id: string;
  name: string;
  dosage: string;
  slots: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  timingAdvice: string;
  remainingPills: number;
  totalPills: number;
  refillThreshold: number;
  doctorFollowUpDate?: string;
  takenToday: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    night: boolean;
  };
  history: Array<{ date: string; slot: string; time: string }>;
}

// Clean initial state: no hardcoded demo medicines by default!
export const DEFAULT_SCHEDULED_MEDICINES: ScheduledMedicine[] = [];

// ============================================================================
// FEATURE 6: MULTILINGUAL VOICE ASSISTANT DATA
// ============================================================================

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  speechCode: string;
  flag: string;
  greeting: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (India/US)', speechCode: 'en-IN', flag: '🇬🇧', greeting: 'Hello! I am your MediVerse AI Clinical Assistant. How can I help you today?' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', speechCode: 'hi-IN', flag: '🇮🇳', greeting: 'नमस्ते! मैं आपका मेडीवर्स एआई स्वास्थ्य सहायक हूँ। आज मैं आपकी क्या मदद कर सकता हूँ?' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', speechCode: 'mr-IN', flag: '🇮🇳', greeting: 'नमस्कार! मी तुमचा मेडीव्हर्स एआय आरोग्य सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकतो?' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', speechCode: 'bn-IN', flag: '🇮🇳', greeting: 'নমস্কার! আমি আপনার মেডিভার্স এআই স্বাস্থ্য সহকারী। আজ আপনাকে কীভাবে সাহায্য করতে পারি?' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', speechCode: 'ta-IN', flag: '🇮🇳', greeting: 'வணக்கம்! நான் உங்கள் மெடிவர்ஸ் ஏஐ சுகாதார உதவியாளர். இன்று நான் உங்களுக்கு எவ்வாறு உதவ முடியும்?' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', speechCode: 'te-IN', flag: '🇮🇳', greeting: 'నమస్కారం! నేను మీ మెడివర్స్ AI ఆరోగ్య సహాయకుడిని. ఈరోజు నేను మీకు ఎలా సహాయపడగలను?' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', speechCode: 'gu-IN', flag: '🇮🇳', greeting: 'નમસ્તે! હું તમારો મેડિવર્સ એઆઈ હેલ્થ આસિસ્ટન્ટ છું. આજે હું તમારી શું મદદ કરી શકું?' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', speechCode: 'es-ES', flag: '🇪🇸', greeting: '¡Hola! Soy tu Asistente Clínico MediVerse AI. ¿Cómo puedo ayudarte hoy con tu salud?' },
  { code: 'fr', name: 'French', nativeName: 'Français', speechCode: 'fr-FR', flag: '🇫🇷', greeting: 'Bonjour! Je suis votre assistant clinique MediVerse AI. Comment puis-je vous aider aujourd\'hui?' }
];

export const QUICK_VOICE_QUERIES = [
  { label: 'Check Fever & Chills Symptoms', query: 'I have a fever with chills and body ache. What should I do?' },
  { label: 'How to Take Antibiotics?', query: 'How should I take Augmentin or Amoxicillin and what should I avoid?' },
  { label: 'Explain High Creatinine in Lab', query: 'My lab report shows Serum Creatinine is elevated. What does this mean for kidneys?' },
  { label: 'Emergency Hotline Help', query: 'What is the national emergency ambulance number and what to do for chest pain?' },
  { label: 'Ayurvedic Tea for Digestion', query: 'What Ayurvedic herbal remedy helps with bloating and acid reflux?' }
];

// Contextual Dynamic Knowledge Engine for Voice Assistant
export const GENERATE_VOICE_RESPONSE = (query: string, langCode: string): string => {
  const q = query.toLowerCase();

  // Emergency triggers
  if (q.includes('chest pain') || q.includes('heart attack') || q.includes('cant breathe') || q.includes('cannot breathe') || q.includes('unconscious') || q.includes('severe bleeding')) {
    if (langCode === 'hi') {
      return 'चेतावनी: यह एक गंभीर आपातकालीन स्थिति हो सकती है! तुरंत 108 या 112 पर कॉल करें या नजदीकी आपातकालीन अस्पताल पहुँचें। स्वयं गाड़ी न चलाएं।';
    }
    return 'CRITICAL EMERGENCY ALERT: Please dial 108 or 112 immediately or proceed to the nearest Emergency Room. If experiencing crushing chest pressure or breathing difficulty, sit upright, remain calm, and summon emergency medical transport without delay.';
  }

  // Medication timing query
  if (q.includes('amoxicillin') || q.includes('augmentin') || q.includes('antibiotic')) {
    if (langCode === 'hi') {
      return 'एंटीबायोटिक हमेशा भोजन के बाद ली जानी चाहिए ताकि पेट खराब न हो। डॉक्टर द्वारा बताया गया पूरा कोर्स अवश्य पूरा करें, भले ही आप पहले ही ठीक महसूस करने लगें।';
    }
    return 'Antibiotics like Augmentin and Amoxicillin should always be taken after meals with a full glass of water to avoid stomach irritation. Crucially, complete the entire prescribed course even if you feel completely recovered to prevent bacterial antibiotic resistance.';
  }

  // Lab report creatinine query
  if (q.includes('creatinine') || q.includes('kidney') || q.includes('kft')) {
    if (langCode === 'hi') {
      return 'सीरम क्रिएटिनिन का बढ़ना यह दर्शाता है कि गुर्दों (किडनी) की कार्यक्षमता प्रभावित हो रही है। आपको बिना देरी किए किसी नेफ्रोलॉजिस्ट से परामर्श लेना चाहिए और दर्द निवारक दवाओं (NSAIDs) से बचना चाहिए।';
    }
    return 'An elevated Serum Creatinine indicates reduced glomerular filtration efficiency in the kidneys. We strongly recommend scheduling a clinical consultation with a Nephrologist, avoiding all over-the-counter NSAID painkillers, and having blood pressure monitored.';
  }

  // Fever advice
  if (q.includes('fever') || q.includes('temperature') || q.includes('chills')) {
    if (langCode === 'hi') {
      return 'बुखार के लिए भरपूर मात्रा में तरल पदार्थ जैसे ओआरएस या नारियल पानी पिएं। बुखार कम करने के लिए पैरासिटामोल ली जा सकती है। यदि बुखार 3 दिन से अधिक रहे तो डॉक्टर को दिखाएं।';
    }
    return 'For fever and chills, prioritize oral rehydration with ORS and electrolyte fluids. Paracetamol can be taken for temperature control. If the fever persists past 48 hours or is accompanied by rash or breathing discomfort, consult a physician promptly.';
  }

  // Ayurvedic query
  if (q.includes('ayurveda') || q.includes('ayucare') || q.includes('herbal') || q.includes('digestion') || q.includes('bloating')) {
    if (langCode === 'hi') {
      return 'आयुर्वेद के अनुसार पाचन को सुधारने के लिए भोजन के बाद भुनी हुई सौंफ और अजवाइन का गर्म पानी पिएं। त्रिफला चूर्ण रात में गुनगुने पानी के साथ पाचन अग्नि को संतुलित करता है।';
    }
    return 'In traditional Ayurveda, mild digestive sluggishness is balanced by drinking warm cumin-coriander-fennel (CCF) water after meals to kindle Agni (digestive fire). Organic Triphala with warm water at bedtime also supports natural regularity.';
  }

  // General dynamic response
  if (langCode === 'hi') {
    return `मेडीवर्स एआई ने आपके सवाल का विश्लेषण किया: "${query}". स्वास्थ्य सुरक्षा के लिए, आप हमारे लक्षण विश्लेषण, लैब डिकोडर, या दवा रिमाइंडर का उपयोग कर सकते हैं। किसी भी गंभीर लक्षण के लिए डॉक्टर से परामर्श लें।`;
  }
  return `MediVerse AI Clinical Assistant has processed your inquiry: "${query}". You can use our specialized tabs above for complete Symptom Analysis, Prescription Decoding, Lab Report Extraction, or AyuCare guidance. Always remember that AI guidance provides supportive information and does not replace in-person clinical diagnosis.`;
};

// ============================================================================
// FEATURE 7: AYUCARE AI KNOWLEDGE BASE & RED FLAGS
// ============================================================================

export interface DoshaQuestion {
  id: string;
  question: string;
  options: {
    vata: string;
    pitta: string;
    kapha: string;
  };
}

export const DOSHA_QUIZ: DoshaQuestion[] = [
  {
    id: 'body_frame',
    question: 'How would you describe your natural physical body frame?',
    options: {
      vata: 'Slender, thin bones, difficulty gaining weight',
      pitta: 'Medium, athletic build, moderate muscle definition',
      kapha: 'Solid, broad shoulders, heavy bones, easily gain weight'
    }
  },
  {
    id: 'skin_temperament',
    question: 'How does your skin typically feel and react to weather?',
    options: {
      vata: 'Dry, rough, cool to touch, prone to cracking in winter',
      pitta: 'Warm, slightly oily T-zone, prone to redness, acne, or freckles',
      kapha: 'Thick, smooth, cool, soft, moist, retains hydration easily'
    }
  },
  {
    id: 'digestion_appetite',
    question: 'How is your daily digestive fire (Agni) and appetite?',
    options: {
      vata: 'Variable and unpredictable; irregular appetite and gas',
      pitta: 'Strong, intense, cannot skip meals without feeling irritable',
      kapha: 'Slow, steady, can easily skip meals, feels heavy after eating'
    }
  },
  {
    id: 'mental_stress',
    question: 'How do you typically react when experiencing mental stress?',
    options: {
      vata: 'Anxiety, restlessness, overthinking, disrupted sleep',
      pitta: 'Irritability, impatience, anger, feeling frustrated',
      kapha: 'Withdrawal, procrastination, lethargy, reluctance to change'
    }
  },
  {
    id: 'sleep_quality',
    question: 'What is your typical nighttime sleep pattern?',
    options: {
      vata: 'Light, interrupted easily, prone to waking around 2-4 AM',
      pitta: 'Sound, moderate 6-7 hours, can wake up feeling hot or thirsty',
      kapha: 'Deep, heavy, 8+ hours, difficulty getting out of bed in the morning'
    }
  }
];

export interface AyurvedicHerb {
  name: string;
  sanskritName: string;
  botanicalName: string;
  doshaEffect: string;
  primaryBenefits: string[];
  traditionalUses: string;
  recommendedPreparation: string;
  cautions: string;
}

export const CLASSICAL_HERBS: AyurvedicHerb[] = [
  {
    name: 'Ashwagandha',
    sanskritName: 'अश्वगंधा (Ashwagandha)',
    botanicalName: 'Withania somnifera (Indian Ginseng)',
    doshaEffect: 'Balances Vata & Kapha (Vata-Shamaka)',
    primaryBenefits: ['Cortisol & Stress Reduction', 'Nervine Vitality (Medhya)', 'Deep Restorative Sleep', 'Physical Stamina'],
    traditionalUses: 'Rasayana (Rejuvenator) used for thousands of years to build Ojas (vital immunity) and calm anxious nervous system currents.',
    recommendedPreparation: '3-5 grams of root powder with warm milk and a pinch of nutmeg or ghee before bedtime.',
    cautions: 'Avoid in acute hyperthyroidism or active high fever.'
  },
  {
    name: 'Tulsi (Holy Basil)',
    sanskritName: 'तुलसी (Tulasi)',
    botanicalName: 'Ocimum sanctum',
    doshaEffect: 'Pacifies Vata & Kapha, mildly elevates Pitta if excessive',
    primaryBenefits: ['Prana Vayu Support (Lung Clearance)', 'Immune Defense', 'Adaptogenic Resilience', 'Clarity of Mind'],
    traditionalUses: 'Sacred Ayurvedic plant revered as the "Queen of Herbs" for eliminating respiratory phlegm and supporting cellular health.',
    recommendedPreparation: 'Fresh leaf decoction or tea with crushed ginger and raw honey (never boil honey above 40°C).',
    cautions: 'Use with moderation if experiencing acute hyperacidity.'
  },
  {
    name: 'Triphala',
    sanskritName: 'त्रिफला (Triphala)',
    botanicalName: 'Emblica officinalis + Terminalia bellirica + Terminalia chebula',
    doshaEffect: 'Tridoshic (Harmonizes all three doshas: Vata, Pitta, Kapha)',
    primaryBenefits: ['Gentle Colon Cleansing', 'Eye Health (Chakshushya)', 'Antioxidant Wealth', 'Digestive Harmony'],
    traditionalUses: 'Cornerstone formulation of classical Ayurveda consisting of Amalaki, Bibhitaki, and Haritaki. Cleanses the GI tract without causing dependency.',
    recommendedPreparation: '1/2 teaspoon powder steeped in warm water for 10 minutes at bedtime.',
    cautions: 'Avoid during active acute diarrhea or pregnancy.'
  },
  {
    name: 'Brahmi / Gotu Kola',
    sanskritName: 'ब्राह्मी (Brahmi)',
    botanicalName: 'Bacopa monnieri',
    doshaEffect: 'Balances Pitta & Vata, deeply cooling to mind',
    primaryBenefits: ['Cognitive Focus & Memory', 'Mental Calmness', 'Emotional Balance', 'Scalp Vitality'],
    traditionalUses: 'Premier Medhya Rasayana (brain tonic) that cools heated emotions, sharpens recall, and fosters meditative focus.',
    recommendedPreparation: 'Infusion of dried leaves or medicated Brahmi Ghee taken in the morning.',
    cautions: 'Take with food if possessing a very sensitive stomach.'
  },
  {
    name: 'Giloy (Guduchi)',
    sanskritName: 'गुडूची (Amrita / Giloy)',
    botanicalName: 'Tinospora cordifolia',
    doshaEffect: 'Tridoshic balancing; especially pacifies Pitta & Vata',
    primaryBenefits: ['Immune Cell Stimulation', 'Jvara-Hara (Natural Fever Balance)', 'Liver Detoxification', 'Blood Purification'],
    traditionalUses: 'Known as "Amrita" (nectar of vitality) for its ability to digest accumulated systemic toxins (Ama).',
    recommendedPreparation: 'Stem juice or aqueous extract (Kwath) 15-20ml diluted in water.',
    cautions: 'Monitor blood sugar if taking alongside diabetic medications.'
  },
  {
    name: 'Curcumin / Haridra (Turmeric)',
    sanskritName: 'हरिद्रा (Haridra)',
    botanicalName: 'Curcuma longa',
    doshaEffect: 'Balances all three doshas; reduces Kapha & Vata',
    primaryBenefits: ['Joint Comfort & Mobility', 'Antimicrobial Protection', 'Skin Radiance', 'Circulatory Health'],
    traditionalUses: 'Celebrated golden healer across traditional medicine for cooling inflammatory flare-ups and cleansing micro-channels (Srotas).',
    recommendedPreparation: 'Golden Milk: 1/2 tsp organic turmeric gently warmed in milk with a pinch of black pepper for enhanced absorption.',
    cautions: 'Caution with bile duct obstruction or high-dose pharmaceutical blood thinners.'
  }
];

export const AYUCARE_RED_FLAG_KEYWORDS = [
  'chest pain', 'heart attack', 'shortness of breath', 'difficulty breathing',
  'loss of consciousness', 'unconscious', 'fainting', 'stroke', 'paralysis',
  'slurred speech', 'severe bleeding', 'vomiting blood', 'convulsions',
  'seizure', 'severe trauma', 'fracture', 'poisoning', 'suicidal'
];

export const AYURVEDIC_HOME_REMEDIES = [
  {
    condition: 'Digestive Bloating & Sluggishness',
    remedyName: 'CCF (Cumin, Coriander, Fennel) Digestive Tea',
    ingredients: '1/2 tsp cumin seeds, 1/2 tsp coriander seeds, 1/2 tsp fennel seeds in 500ml water',
    method: 'Boil for 5 minutes, strain, and sip warm throughout the day 30 minutes after meals.',
    benefit: 'Kindles Agni without aggravating internal heat or causing acid surges.'
  },
  {
    condition: 'Dry Seasonal Cough & Throat Irritation',
    remedyName: 'Licorice (Yashtimadhu) & Ginger Infusion',
    ingredients: '1/4 tsp licorice root powder, 1/2 inch crushed ginger, 1 clove',
    method: 'Simmer in 1 cup water for 7 minutes. Sip slowly with a spoon of raw honey once drinkable warm.',
    benefit: 'Coats throat mucosa with soothing mucilage and breaks dry bronchial spasms.'
  },
  {
    condition: 'Nighttime Restlessness & Insomnia',
    remedyName: 'Spiced Nutmeg Moon Milk (Jaiphal Dugdha)',
    ingredients: '1 cup warm A2 milk or almond milk, pinch of freshly grated nutmeg, pinch of cardamom, 1/4 tsp ghee',
    method: 'Whisk together warm and consume 30 minutes prior to lying down in bed.',
    benefit: 'Nutmeg has natural calming properties that pacify erratic Prana Vayu.'
  },
  {
    condition: 'Morning Stiffness & Joint Aches',
    remedyName: 'Dry Ginger (Sunthi) & Castor Oil Pack',
    ingredients: 'Warm sesame or Mahanarayan oil infused with dry ginger paste',
    method: 'Gently massage clockwise over affected joints, followed by warm water compress.',
    benefit: 'Dissolves cold, rigid Vata stagnation and lubricates synovial joints.'
  }
];
