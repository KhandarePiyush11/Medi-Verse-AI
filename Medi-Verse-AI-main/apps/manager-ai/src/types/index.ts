export type PortalType = 
  | 'operations'
  | 'doctor'
  | 'medical'
  | 'labs'
  | 'opd'
  | 'reception'
  | 'automation';

export interface Patient {
  id: string;
  uhid: string; // Unique Hospital ID
  abhaId?: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  allergies: string[];
  chronicConditions: string[];
  registeredAt: string;
  currentStatus: 'OPD_Waiting' | 'In_Consultation' | 'Inpatient_Admitted' | 'Discharged' | 'Emergency_ICU';
  assignedDoctor?: string;
  assignedBed?: string;
  triagePriority?: 'P1_Critical' | 'P2_Urgent' | 'P3_Standard';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualification: string;
  nmcId: string; // National Medical Commission ID
  department: string;
  roomNo: string;
  status: 'Available' | 'In_Consult' | 'In_Surgery' | 'Off_Duty';
  avatar: string;
  patientsToday: number;
  rating: number;
  currentQueueCount: number;
}

export interface OpdToken {
  id: string;
  tokenNumber: string; // e.g. 'CARD-014'
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  doctorId: string;
  doctorName: string;
  department: string;
  roomNo: string;
  triageLevel: 'P1_Critical' | 'P2_Urgent' | 'P3_Standard';
  status: 'Waiting' | 'Calling' | 'In_Consult' | 'Completed' | 'Skipped';
  arrivalTime: string;
  vitals?: {
    bp: string;
    pulse: number;
    spo2: number;
    temp: number;
    painScore: number;
    respiratoryRate: number;
  };
  chiefComplaint: string;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  genericName: string;
  dosage: string;
  frequency: string; // e.g. '1-0-1'
  duration: string; // e.g. '5 days'
  instructions: string;
  status: 'Prescribed' | 'Dispensed' | 'Out_Of_Stock';
  cost: number;
}

export interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  clinicalNotes: string;
  items: PrescriptionItem[];
  dispensedStatus: 'Pending' | 'Partially_Dispensed' | 'Dispensed';
  totalAmount: number;
  paymentStatus: 'Pending' | 'Paid';
}

export interface PharmacyItem {
  id: string;
  name: string;
  genericName: string;
  category: 'Antibiotic' | 'Cardiovascular' | 'Analgesic' | 'Respiratory' | 'Gastrointestinal' | 'Surgical_Consumables' | 'Emergency_Injectable';
  batchNo: string;
  stockQty: number;
  unit: string;
  minThreshold: number;
  expiryDate: string;
  pricePerUnit: number;
  manufacturer: string;
  locationRack: string;
  status: 'In_Stock' | 'Low_Stock' | 'Critical_Shortage' | 'Expired';
}

export interface LabTestOrder {
  id: string;
  orderNumber: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: 'Pathology' | 'Biochemistry' | 'Radiology' | 'Microbiology' | 'Hematology';
  testName: string;
  sampleType: 'Blood' | 'Serum' | 'Urine' | 'Tissue Biopsy' | 'X-Ray Chest' | 'CT Scan' | 'MRI';
  orderedAt: string;
  status: 'Sample_Pending' | 'Sample_Collected' | 'In_Analysis' | 'Results_Ready' | 'Verified_Approved';
  priority: 'Routine' | 'Urgent' | 'STAT_Emergency';
  barcode: string;
  results?: {
    parameter: string;
    value: string;
    unit: string;
    normalRange: string;
    flag: 'Normal' | 'High' | 'Low' | 'Critical';
  }[];
  notes?: string;
  verifiedBy?: string;
}

export interface Bed {
  id: string;
  bedNumber: string; // e.g., 'ICU-B04'
  ward: 'ICU' | 'HDU' | 'Emergency' | 'General_Male' | 'General_Female' | 'Deluxe_Private' | 'Pediatric';
  floor: string;
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance' | 'Reserved';
  patientId?: string;
  patientName?: string;
  admittedAt?: string;
  attendingDoctor?: string;
  equipmentConnected?: string[];
  dailyRate: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  uhid: string;
  date: string;
  type: 'OPD_Consultation' | 'IPD_Admission' | 'Pharmacy' | 'Diagnostics_Lab' | 'Emergency';
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  grandTotal: number;
  status: 'Unpaid' | 'Paid' | 'TPA_Insurance_Pending' | 'Partially_Paid';
  paymentMethod?: 'Cash' | 'Card' | 'UPI_ABDM' | 'Insurance_TPA';
}

export interface OperationalAlert {
  id: string;
  title: string;
  severity: 'Critical' | 'Warning' | 'Info' | 'Success';
  category: 'Bed_Capacity' | 'Drug_Stockout' | 'OPD_Surge' | 'Lab_Delay' | 'Emergency_Triage';
  message: string;
  timestamp: string;
  actionableRecommendation: string;
}
