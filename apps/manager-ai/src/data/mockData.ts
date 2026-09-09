import { Patient, Doctor, OpdToken, PharmacyItem, Prescription, LabTestOrder, Bed, Invoice, OperationalAlert } from '../types';

export const initialDoctors: Doctor[] = [
  {
    id: 'DOC-01',
    name: 'Dr. Aarav Sharma',
    specialty: 'Cardiology & Electrophysiology',
    qualification: 'MD, DM (Cardiology), FACC',
    nmcId: 'NMC-74892-DL',
    department: 'Cardiology',
    roomNo: 'OPD-102',
    status: 'In_Consult',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    patientsToday: 24,
    rating: 4.9,
    currentQueueCount: 4
  },
  {
    id: 'DOC-02',
    name: 'Dr. Priya Nambiar',
    specialty: 'Neurology & Stroke Care',
    qualification: 'MD, DM (Neurology), FINR',
    nmcId: 'NMC-92381-KL',
    department: 'Neurology',
    roomNo: 'OPD-105',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1594824813515-598e3b7b952a?w=150&auto=format&fit=crop&q=80',
    patientsToday: 18,
    rating: 4.95,
    currentQueueCount: 2
  },
  {
    id: 'DOC-03',
    name: 'Dr. Rohan Deshmukh',
    specialty: 'Orthopedics & Trauma Surgery',
    qualification: 'MS (Ortho), MCh, FRCS',
    nmcId: 'NMC-51829-MH',
    department: 'Orthopedics',
    roomNo: 'OPD-201',
    status: 'In_Surgery',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    patientsToday: 15,
    rating: 4.85,
    currentQueueCount: 0
  },
  {
    id: 'DOC-04',
    name: 'Dr. Ananya Sen',
    specialty: 'Emergency Medicine & Critical Care',
    qualification: 'MD (Emergency Med), FACEM',
    nmcId: 'NMC-33910-WB',
    department: 'Emergency / Triage',
    roomNo: 'ER-BAY-1',
    status: 'In_Consult',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    patientsToday: 32,
    rating: 4.9,
    currentQueueCount: 5
  },
  {
    id: 'DOC-05',
    name: 'Dr. Vikram Malhotra',
    specialty: 'Pulmonology & Respiratory Medicine',
    qualification: 'MD (Resp. Med), FCCP',
    nmcId: 'NMC-88219-KA',
    department: 'Pulmonology',
    roomNo: 'OPD-108',
    status: 'Available',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
    patientsToday: 19,
    rating: 4.8,
    currentQueueCount: 1
  }
];

export const initialPatients: Patient[] = [
  {
    id: 'PAT-101',
    uhid: 'NSH-2026-0941',
    abhaId: '91-4829-1092-4821',
    name: 'Rajesh Verma',
    age: 58,
    gender: 'Male',
    phone: '+91 98112 34567',
    bloodGroup: 'B+ Positive',
    address: 'Flat 402, Green Glen Heights, New Delhi',
    emergencyContact: 'Sunita Verma (+91 98112 34568)',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    chronicConditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
    registeredAt: '2026-09-02 08:30 AM',
    currentStatus: 'OPD_Waiting',
    assignedDoctor: 'Dr. Aarav Sharma',
    triagePriority: 'P2_Urgent'
  },
  {
    id: 'PAT-102',
    uhid: 'NSH-2026-0942',
    abhaId: '91-7712-9901-3312',
    name: 'Meera Krishnan',
    age: 44,
    gender: 'Female',
    phone: '+91 94451 88920',
    bloodGroup: 'O+ Positive',
    address: 'Villa 12, Palm Meadows, Whitefield, Bengaluru',
    emergencyContact: 'K. Krishnan (+91 94451 88921)',
    allergies: ['Aspirin'],
    chronicConditions: ['Migraine with Aura', 'Hypothyroidism'],
    registeredAt: '2026-09-02 09:15 AM',
    currentStatus: 'In_Consultation',
    assignedDoctor: 'Dr. Priya Nambiar',
    triagePriority: 'P3_Standard'
  },
  {
    id: 'PAT-103',
    uhid: 'NSH-2026-0943',
    abhaId: '91-2299-8471-0019',
    name: 'Sardar Gurpreet Singh',
    age: 67,
    gender: 'Male',
    phone: '+91 98765 12098',
    bloodGroup: 'A+ Positive',
    address: 'Model Town Ext., Ludhiana / South Delhi',
    emergencyContact: 'Harpreet Singh (+91 98765 12099)',
    allergies: ['None known'],
    chronicConditions: ['CAD Post-PTCA (2022)', 'CKD Stage 3'],
    registeredAt: '2026-09-01 11:20 PM',
    currentStatus: 'Inpatient_Admitted',
    assignedDoctor: 'Dr. Aarav Sharma',
    assignedBed: 'ICU-B02',
    triagePriority: 'P1_Critical'
  },
  {
    id: 'PAT-104',
    uhid: 'NSH-2026-0944',
    abhaId: '91-3301-4491-7722',
    name: 'Sanya Mirza Roy',
    age: 29,
    gender: 'Female',
    phone: '+91 98200 91823',
    bloodGroup: 'AB+ Positive',
    address: 'Bandra West, Mumbai',
    emergencyContact: 'Amit Roy (+91 98200 91824)',
    allergies: ['Ibuprofen / NSAIDs'],
    chronicConditions: ['Asthma (Mild Persistent)'],
    registeredAt: '2026-09-02 09:45 AM',
    currentStatus: 'OPD_Waiting',
    assignedDoctor: 'Dr. Vikram Malhotra',
    triagePriority: 'P3_Standard'
  },
  {
    id: 'PAT-105',
    uhid: 'NSH-2026-0945',
    abhaId: '91-8899-1002-5561',
    name: 'Kavita Pillai',
    age: 72,
    gender: 'Female',
    phone: '+91 97110 54321',
    bloodGroup: 'O- Negative',
    address: 'Indiranagar 100ft Road, Bengaluru',
    emergencyContact: 'Dr. Ramesh Pillai (+91 97110 54322)',
    allergies: ['Latex', 'Ciprofloxacin'],
    chronicConditions: ['Severe Osteoarthritis Knee', 'Osteoporosis'],
    registeredAt: '2026-09-02 10:05 AM',
    currentStatus: 'Inpatient_Admitted',
    assignedDoctor: 'Dr. Rohan Deshmukh',
    assignedBed: 'DELUXE-301',
    triagePriority: 'P2_Urgent'
  }
];

export const initialOpdTokens: OpdToken[] = [
  {
    id: 'TOK-101',
    tokenNumber: 'CARD-014',
    patientId: 'PAT-101',
    patientName: 'Rajesh Verma',
    age: 58,
    gender: 'Male',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Aarav Sharma',
    department: 'Cardiology',
    roomNo: 'OPD-102',
    triageLevel: 'P2_Urgent',
    status: 'Waiting',
    arrivalTime: '08:45 AM',
    vitals: {
      bp: '154/96 mmHg',
      pulse: 88,
      spo2: 97,
      temp: 98.6,
      painScore: 4,
      respiratoryRate: 18
    },
    chiefComplaint: 'Exertional chest heaviness, radiating left shoulder pain for 3 days'
  },
  {
    id: 'TOK-102',
    tokenNumber: 'NEUR-008',
    patientId: 'PAT-102',
    patientName: 'Meera Krishnan',
    age: 44,
    gender: 'Female',
    doctorId: 'DOC-02',
    doctorName: 'Dr. Priya Nambiar',
    department: 'Neurology',
    roomNo: 'OPD-105',
    triageLevel: 'P3_Standard',
    status: 'In_Consult',
    arrivalTime: '09:20 AM',
    vitals: {
      bp: '122/78 mmHg',
      pulse: 74,
      spo2: 99,
      temp: 98.4,
      painScore: 6,
      respiratoryRate: 16
    },
    chiefComplaint: 'Throbbing hemicranial headache with photophobia & scintillating scotoma'
  },
  {
    id: 'TOK-103',
    tokenNumber: 'PULM-011',
    patientId: 'PAT-104',
    patientName: 'Sanya Mirza Roy',
    age: 29,
    gender: 'Female',
    doctorId: 'DOC-05',
    doctorName: 'Dr. Vikram Malhotra',
    department: 'Pulmonology',
    roomNo: 'OPD-108',
    triageLevel: 'P3_Standard',
    status: 'Waiting',
    arrivalTime: '09:50 AM',
    vitals: {
      bp: '118/74 mmHg',
      pulse: 82,
      spo2: 96,
      temp: 99.1,
      painScore: 2,
      respiratoryRate: 20
    },
    chiefComplaint: 'Nocturnal cough, wheezing triggered by dust storm, inhaler non-compliance'
  },
  {
    id: 'TOK-104',
    tokenNumber: 'EMERG-003',
    patientId: 'PAT-106',
    patientName: 'Tanvi Saxena (Emergency Walk-in)',
    age: 34,
    gender: 'Female',
    doctorId: 'DOC-04',
    doctorName: 'Dr. Ananya Sen',
    department: 'Emergency / Triage',
    roomNo: 'ER-BAY-1',
    triageLevel: 'P1_Critical',
    status: 'Calling',
    arrivalTime: '10:10 AM',
    vitals: {
      bp: '90/60 mmHg',
      pulse: 124,
      spo2: 91,
      temp: 102.4,
      painScore: 8,
      respiratoryRate: 26
    },
    chiefComplaint: 'Acute respiratory distress, severe sepsis query, tachycardia & high fever'
  }
];

export const initialPharmacyItems: PharmacyItem[] = [
  {
    id: 'MED-01',
    name: 'Atorvastatin 20mg Tab (Lipitor Equiv)',
    genericName: 'Atorvastatin Calcium IP 20mg',
    category: 'Cardiovascular',
    batchNo: 'ATV-26-8801',
    stockQty: 840,
    unit: 'Tablets',
    minThreshold: 200,
    expiryDate: '2027-08-31',
    pricePerUnit: 14.50,
    manufacturer: 'Sun Pharma Lab',
    locationRack: 'Rack C-04',
    status: 'In_Stock'
  },
  {
    id: 'MED-02',
    name: 'Augmentin 625mg Duo (Amox-Clav)',
    genericName: 'Amoxicillin 500mg + Potassium Clavulanate 125mg',
    category: 'Antibiotic',
    batchNo: 'AUG-26-4412',
    stockQty: 48,
    unit: 'Strips (10 tabs)',
    minThreshold: 100,
    expiryDate: '2026-12-15',
    pricePerUnit: 185.00,
    manufacturer: 'GSK India',
    locationRack: 'Rack A-12',
    status: 'Low_Stock'
  },
  {
    id: 'MED-03',
    name: 'Inj. Noradrenaline 4mg/2ml (Ampoule)',
    genericName: 'Norepinephrine Bitartrate 2mg/ml',
    category: 'Emergency_Injectable',
    batchNo: 'NOR-26-0921',
    stockQty: 18,
    unit: 'Ampoules',
    minThreshold: 30,
    expiryDate: '2027-01-20',
    pricePerUnit: 82.00,
    manufacturer: 'Neon Labs',
    locationRack: 'ER Crash Cart #1',
    status: 'Critical_Shortage'
  },
  {
    id: 'MED-04',
    name: 'Telmisartan 40mg + Amlodipine 5mg',
    genericName: 'Telmisartan 40mg + Amlodipine Besylate 5mg',
    category: 'Cardiovascular',
    batchNo: 'TEL-26-1190',
    stockQty: 1250,
    unit: 'Tablets',
    minThreshold: 300,
    expiryDate: '2028-03-31',
    pricePerUnit: 9.80,
    manufacturer: 'Cipla Therapeutics',
    locationRack: 'Rack C-02',
    status: 'In_Stock'
  },
  {
    id: 'MED-05',
    name: 'Budesonide 0.5mg Respules (2ml)',
    genericName: 'Budesonide Inhalation Suspension IP 0.5mg',
    category: 'Respiratory',
    batchNo: 'BUD-26-3021',
    stockQty: 320,
    unit: 'Respules',
    minThreshold: 150,
    expiryDate: '2027-06-30',
    pricePerUnit: 28.50,
    manufacturer: 'Cipla Medpro',
    locationRack: 'Rack B-08',
    status: 'In_Stock'
  },
  {
    id: 'MED-06',
    name: 'Pantoprazole 40mg IV Vial',
    genericName: 'Pantoprazole Sodium for Inj. IP 40mg',
    category: 'Gastrointestinal',
    batchNo: 'PAN-26-7832',
    stockQty: 410,
    unit: 'Vials',
    minThreshold: 100,
    expiryDate: '2027-11-30',
    pricePerUnit: 49.00,
    manufacturer: 'Alkem Laboratories',
    locationRack: 'Rack D-01',
    status: 'In_Stock'
  }
];

export const initialPrescriptions: Prescription[] = [
  {
    id: 'RX-2026-0419',
    prescriptionNumber: 'RX-9941-CD',
    patientId: 'PAT-101',
    patientName: 'Rajesh Verma',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Aarav Sharma',
    date: '2026-09-02 09:30 AM',
    diagnosis: 'Unstable Angina / Acute Coronary Syndrome Query (High Risk)',
    clinicalNotes: 'ECG demonstrates ST depression in V4-V6. Advised emergency Troponin I and urgent 2D Echo. Strict bed rest.',
    items: [
      {
        id: 'RXI-01',
        medicineName: 'Atorvastatin 20mg Tab',
        genericName: 'Atorvastatin Calcium 20mg',
        dosage: '40mg (2 tabs)',
        frequency: '0-0-1 (Night)',
        duration: '30 days',
        instructions: 'Post dinner with water',
        status: 'Prescribed',
        cost: 435.00
      },
      {
        id: 'RXI-02',
        medicineName: 'Telmisartan 40mg + Amlodipine 5mg',
        genericName: 'Telmisartan 40mg + Amlodipine 5mg',
        dosage: '1 Tab',
        frequency: '1-0-0 (Morning)',
        duration: '30 days',
        instructions: 'Early morning empty stomach or after light breakfast',
        status: 'Prescribed',
        cost: 294.00
      },
      {
        id: 'RXI-03',
        medicineName: 'Pantoprazole 40mg Tab',
        genericName: 'Pantoprazole 40mg',
        dosage: '1 Tab',
        frequency: '1-0-0 (Before food)',
        duration: '14 days',
        instructions: '30 minutes before breakfast',
        status: 'Prescribed',
        cost: 140.00
      }
    ],
    dispensedStatus: 'Pending',
    totalAmount: 869.00,
    paymentStatus: 'Pending'
  },
  {
    id: 'RX-2026-0418',
    prescriptionNumber: 'RX-9938-NL',
    patientId: 'PAT-102',
    patientName: 'Meera Krishnan',
    doctorId: 'DOC-02',
    doctorName: 'Dr. Priya Nambiar',
    date: '2026-09-02 09:40 AM',
    diagnosis: 'Intractable Migraine with Visual Aura',
    clinicalNotes: 'Avoid tyramine foods. Sleep hygiene counseling provided. MRI Brain scheduled.',
    items: [
      {
        id: 'RXI-04',
        medicineName: 'Sumatriptan 50mg + Naproxen 250mg',
        genericName: 'Sumatriptan + Naproxen Sodium',
        dosage: '1 Tab SOS',
        frequency: 'SOS on aura onset',
        duration: '6 doses',
        instructions: 'Take immediately at the start of headache',
        status: 'Dispensed',
        cost: 320.00
      }
    ],
    dispensedStatus: 'Dispensed',
    totalAmount: 320.00,
    paymentStatus: 'Paid'
  }
];

export const initialLabOrders: LabTestOrder[] = [
  {
    id: 'LAB-2026-081',
    orderNumber: 'LAB-9041',
    patientId: 'PAT-101',
    patientName: 'Rajesh Verma',
    doctorId: 'DOC-01',
    doctorName: 'Dr. Aarav Sharma',
    department: 'Biochemistry',
    testName: 'High-Sensitivity Troponin I & Lipid Profile Panel',
    sampleType: 'Blood',
    orderedAt: '2026-09-02 09:15 AM',
    status: 'In_Analysis',
    priority: 'STAT_Emergency',
    barcode: 'BC-9041-TROP',
    results: [
      { parameter: 'High-Sensitivity Troponin I', value: '0.084', unit: 'ng/mL', normalRange: '< 0.014', flag: 'Critical' },
      { parameter: 'Total Cholesterol', value: '238', unit: 'mg/dL', normalRange: '125 - 200', flag: 'High' },
      { parameter: 'LDL Cholesterol', value: '154', unit: 'mg/dL', normalRange: '< 100', flag: 'High' },
      { parameter: 'HDL Cholesterol', value: '38', unit: 'mg/dL', normalRange: '> 40', flag: 'Low' },
      { parameter: 'Triglycerides', value: '192', unit: 'mg/dL', normalRange: '< 150', flag: 'High' }
    ],
    notes: 'STAT troponin elevation detected! Immediate bedside notification dispatched to Dr. Sharma.'
  },
  {
    id: 'LAB-2026-082',
    orderNumber: 'LAB-9042',
    patientId: 'PAT-102',
    patientName: 'Meera Krishnan',
    doctorId: 'DOC-02',
    doctorName: 'Dr. Priya Nambiar',
    department: 'Radiology',
    testName: 'MRI Brain with MR Angiography (Stroke Protocol)',
    sampleType: 'MRI',
    orderedAt: '2026-09-02 09:45 AM',
    status: 'Sample_Collected',
    priority: 'Urgent',
    barcode: 'BC-9042-MRI',
    notes: 'Patient positioned in 3.0T MRI Gantry (Suite 2). Contrast screening confirmed normal.'
  },
  {
    id: 'LAB-2026-083',
    orderNumber: 'LAB-9043',
    patientId: 'PAT-104',
    patientName: 'Sanya Mirza Roy',
    doctorId: 'DOC-05',
    doctorName: 'Dr. Vikram Malhotra',
    department: 'Hematology',
    testName: 'Complete Blood Count (CBC) with Absolute Eosinophil Count (AEC)',
    sampleType: 'Blood',
    orderedAt: '2026-09-02 10:00 AM',
    status: 'Verified_Approved',
    priority: 'Routine',
    barcode: 'BC-9043-CBC',
    results: [
      { parameter: 'Hemoglobin (Hb)', value: '13.4', unit: 'g/dL', normalRange: '12.0 - 15.5', flag: 'Normal' },
      { parameter: 'Total Leukocyte Count (TLC)', value: '7,800', unit: '/cu.mm', normalRange: '4,000 - 11,000', flag: 'Normal' },
      { parameter: 'Absolute Eosinophil Count (AEC)', value: '620', unit: '/cu.mm', normalRange: '40 - 450', flag: 'High' },
      { parameter: 'Platelet Count', value: '2.85', unit: 'Lakhs/cu.mm', normalRange: '1.5 - 4.5', flag: 'Normal' }
    ],
    notes: 'Elevated eosinophils corroborating active allergic bronchospasm.',
    verifiedBy: 'Dr. K. N. Rao, Senior Pathologist'
  }
];

export const initialBeds: Bed[] = [
  {
    id: 'BED-01',
    bedNumber: 'ICU-B01',
    ward: 'ICU',
    floor: '2nd Floor Critical Wing',
    status: 'Occupied',
    patientId: 'PAT-103',
    patientName: 'Sardar Gurpreet Singh',
    admittedAt: '2026-09-01 11:30 PM',
    attendingDoctor: 'Dr. Aarav Sharma',
    equipmentConnected: ['Dräger Infinity Ventilator', 'Mindray BeneVision N17 Monitor', 'Syringe Infusion Pump x3'],
    dailyRate: 8500
  },
  {
    id: 'BED-02',
    bedNumber: 'ICU-B02',
    ward: 'ICU',
    floor: '2nd Floor Critical Wing',
    status: 'Available',
    dailyRate: 8500
  },
  {
    id: 'BED-03',
    bedNumber: 'ICU-B03',
    ward: 'ICU',
    floor: '2nd Floor Critical Wing',
    status: 'Cleaning',
    dailyRate: 8500
  },
  {
    id: 'BED-04',
    bedNumber: 'HDU-101',
    ward: 'HDU',
    floor: '2nd Floor Step-Down Wing',
    status: 'Available',
    dailyRate: 5200
  },
  {
    id: 'BED-05',
    bedNumber: 'HDU-102',
    ward: 'HDU',
    floor: '2nd Floor Step-Down Wing',
    status: 'Occupied',
    patientName: 'Rameshwar Lal',
    admittedAt: '2026-08-31 04:00 PM',
    attendingDoctor: 'Dr. Rohan Deshmukh',
    equipmentConnected: ['Multipara Monitor', 'Oxygen High Flow Nasal Cannula'],
    dailyRate: 5200
  },
  {
    id: 'BED-06',
    bedNumber: 'ER-BAY-01',
    ward: 'Emergency',
    floor: 'Ground Floor Triage Bay',
    status: 'Occupied',
    patientName: 'Tanvi Saxena',
    admittedAt: '2026-09-02 10:12 AM',
    attendingDoctor: 'Dr. Ananya Sen',
    equipmentConnected: ['Emergency Cardiac Monitor', 'Defibrillator Standby'],
    dailyRate: 3500
  },
  {
    id: 'BED-07',
    bedNumber: 'DELUXE-301',
    ward: 'Deluxe_Private',
    floor: '3rd Floor VIP Pavilion',
    status: 'Occupied',
    patientId: 'PAT-105',
    patientName: 'Kavita Pillai',
    admittedAt: '2026-09-02 10:15 AM',
    attendingDoctor: 'Dr. Rohan Deshmukh',
    dailyRate: 11000
  },
  {
    id: 'BED-08',
    bedNumber: 'DELUXE-302',
    ward: 'Deluxe_Private',
    floor: '3rd Floor VIP Pavilion',
    status: 'Available',
    dailyRate: 11000
  },
  {
    id: 'BED-09',
    bedNumber: 'GEN-M-12',
    ward: 'General_Male',
    floor: '1st Floor Ward A',
    status: 'Available',
    dailyRate: 1800
  },
  {
    id: 'BED-10',
    bedNumber: 'GEN-F-08',
    ward: 'General_Female',
    floor: '1st Floor Ward B',
    status: 'Occupied',
    patientName: 'Sunita Ghosh',
    admittedAt: '2026-09-01 02:00 PM',
    attendingDoctor: 'Dr. Vikram Malhotra',
    dailyRate: 1800
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'INV-2026-1049',
    invoiceNumber: 'INV-0941-POS',
    patientId: 'PAT-101',
    patientName: 'Rajesh Verma',
    uhid: 'NSH-2026-0941',
    date: '2026-09-02 08:35 AM',
    type: 'OPD_Consultation',
    items: [
      { description: 'Senior Consultant Cardiology Fee (Dr. Aarav Sharma)', quantity: 1, unitPrice: 1200, total: 1200 },
      { description: 'Standard 12-Lead Electrocardiogram (ECG)', quantity: 1, unitPrice: 450, total: 450 }
    ],
    subtotal: 1650,
    tax: 0,
    discount: 0,
    grandTotal: 1650,
    status: 'Paid',
    paymentMethod: 'UPI_ABDM'
  },
  {
    id: 'INV-2026-1050',
    invoiceNumber: 'INV-0942-LAB',
    patientId: 'PAT-101',
    patientName: 'Rajesh Verma',
    uhid: 'NSH-2026-0941',
    date: '2026-09-02 09:18 AM',
    type: 'Diagnostics_Lab',
    items: [
      { description: 'High-Sensitivity Troponin I (STAT Quantitative)', quantity: 1, unitPrice: 1800, total: 1800 },
      { description: 'Comprehensive Fasting Lipid Profile Panel', quantity: 1, unitPrice: 950, total: 950 }
    ],
    subtotal: 2750,
    tax: 0,
    discount: 250,
    grandTotal: 2500,
    status: 'Paid',
    paymentMethod: 'Card'
  },
  {
    id: 'INV-2026-1051',
    invoiceNumber: 'INV-0943-IPD',
    patientId: 'PAT-103',
    patientName: 'Sardar Gurpreet Singh',
    uhid: 'NSH-2026-0943',
    date: '2026-09-02 00:00 AM',
    type: 'IPD_Admission',
    items: [
      { description: 'ICU Bed Stay Charge (Day 1)', quantity: 1, unitPrice: 8500, total: 8500 },
      { description: 'Critical Care Monitoring & Ventilator Support', quantity: 1, unitPrice: 6000, total: 6000 },
      { description: 'Emergency Medical Officer & Nursing Shift Charge', quantity: 1, unitPrice: 3500, total: 3500 }
    ],
    subtotal: 18000,
    tax: 0,
    discount: 0,
    grandTotal: 18000,
    status: 'TPA_Insurance_Pending',
    paymentMethod: 'Insurance_TPA'
  }
];

export const initialAlerts: OperationalAlert[] = [
  {
    id: 'ALT-01',
    title: 'Critical Emergency Triage Surge Warning',
    severity: 'Critical',
    category: 'Emergency_Triage',
    message: 'ER Triage bay occupancy reached 88% with 4 high-acuity arrivals in the last 20 minutes.',
    timestamp: '10:12 AM Today',
    actionableRecommendation: 'Route on-call Emergency Physician Dr. Ananya Sen and designate HDU-101 for step-down transfer.'
  },
  {
    id: 'ALT-02',
    title: 'Pharmacy Stockout Risk: Inj. Noradrenaline',
    severity: 'Warning',
    category: 'Drug_Stockout',
    message: 'Noradrenaline 4mg ampoules down to 18 units (Threshold: 30 units). Estimated runout in 14 hours.',
    timestamp: '09:45 AM Today',
    actionableRecommendation: 'Auto-dispatched emergency purchase order to Neon Labs distributor with 4-hour expedited delivery.'
  },
  {
    id: 'ALT-03',
    title: 'Cardiology OPD Token Throughput Optimized',
    severity: 'Success',
    category: 'OPD_Surge',
    message: 'Average consultation turnaround is 14.2 mins per patient, outperforming hospital benchmark of 18 mins.',
    timestamp: '09:10 AM Today',
    actionableRecommendation: 'Slot 3 overflow walk-in consultations to Room OPD-102.'
  },
  {
    id: 'ALT-04',
    title: 'STAT Laboratory Turnaround (TAT) Alert',
    severity: 'Info',
    category: 'Lab_Delay',
    message: 'Biochemistry Troponin STAT samples processed in 22 mins average (Standard TAT limit: 30 mins).',
    timestamp: '08:55 AM Today',
    actionableRecommendation: 'Automatic instant EHR notification pushed to attending cardiologists.'
  }
];
