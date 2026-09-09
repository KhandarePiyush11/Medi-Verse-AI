import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  UserCheck, 
  FileText, 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Cpu, 
  Stethoscope, 
  Bed, 
  QrCode, 
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Send,
  Brain,
  Radio,
  Share2,
  Grid,
  HeartPulse,
  Syringe,
  Crosshair,
  WifiOff,
  Wifi,
  Database,
  Building2,
  Search,
  Globe,
  ArrowRight,
  User,
  Calendar,
  Pill,
  LockKeyhole,
  Check,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Sliders,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  FileCheck,
  ShoppingBag,
  ShoppingCart,
  Plus,
  Minus,
  Truck,
  UploadCloud,
  Ambulance,
  Apple,
  Bot,
  MessageSquare,
  X,
  PhoneCall,
  MapPin,
  Star,
  Award,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Play,
  LogOut,
  LogIn,
  Map,
  Filter,
  Navigation,
  HelpCircle,
  Compass,
  Heart,
  ExternalLink,
  ChevronDown,
  SlidersHorizontal,
  Mic,
  MicOff,
  Scan,
  CreditCard,
  Thermometer,
  Droplets,
  Bell,
  Barcode,
  FlaskConical,
  TestTube,
  Flame,
  Key,
  Newspaper,
  Bug,
  TrendingUp,
  AlertCircle,
  Home
} from 'lucide-react';
import { 
  saveOfflinePrescription, 
  getUnsyncedPrescriptions, 
  initOfflineSyncWorker, 
  OfflinePrescription 
} from './services/offlineDb';
import { StaffPortal } from './portals/StaffPortal';

// 5 DISTINCT MASTER ROLES
type UserRole = 'PATIENT' | 'DOCTOR' | 'RECEPTION' | 'NURSE' | 'LAB_TECH';

// PAGE ROUTES MATRIX BY ROLE
type PageRoute = 
  | 'HOME' 
  | 'LOGIN'
  | 'OUTBREAK_RADAR'
  | 'HEALTH_NEWS'
  | 'BUY_MEDICINES' 
  | 'MEDICAL_MAP'
  | 'EMERGENCY_SYSTEM'
  | 'AI_HELP'
  | 'HOME_CURE'
  | 'BOOK_APPOINTMENT'
  // PATIENT ROLE ROUTES
  | 'PATIENT_PHR'
  | 'PATIENT_BIOMARKERS'
  | 'PATIENT_CONSENTS'
  // DOCTOR ROLE ROUTES
  | 'DOCTOR_COCKPIT'
  | 'DOCTOR_PACS_3D'
  | 'DOCTOR_SAMD_ENGINE'
  | 'DOCTOR_ANTIBIOGRAM'
  // RECEPTION ROLE ROUTES
  | 'RECEPTION_NHCX'
  | 'RECEPTION_ABDM_SCAN'
  | 'RECEPTION_TOKENS'
  | 'RECEPTION_BED_MATRIX'
  // NURSE ROLE ROUTES
  | 'NURSE_TELEMETRY'
  | 'NURSE_EMAR'
  | 'NURSE_FLUIDS'
  | 'NURSE_SBAR'
  // LAB TECH ROLE ROUTES
  | 'LAB_ACCESSION'
  | 'LAB_PACS_UPLOAD'
  | 'LAB_ANALYZER'
  | 'LAB_CRITICAL_DISPATCH'
  // N8N AUTOMATION ENGINE ROUTE
  | 'N8N_AUTOMATION';

interface UserProfile {
  name: string;
  role: UserRole;
  identifier: string;
  age?: number;
  illnesses?: string;
  mciId?: string;
  facility?: string;
  ward?: string;
  nodeId?: string;
}

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  image: string;
  ctaText: string;
  targetPage: PageRoute;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: 'The Intelligent Core for Sovereign Healthcare',
    subtitle: 'Unified B2C Patient Portal, Medical Facility Finder, E-Pharmacy, and AI Clinical Decision Support.',
    badge: 'STITCH AI: CLINICAL CLARITY EDITION',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Find Medical Facilities',
    targetPage: 'MEDICAL_MAP'
  },
  {
    id: 2,
    title: 'Local Outbreak Radar & Disease Telemetry',
    subtitle: 'Real-time monitoring of viral infections, vector-borne outbreaks, and IDSP epidemic alerts in your pin code area.',
    badge: 'LIVE LOCAL DISEASE SURVEILLANCE',
    image: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Check Disease Radar',
    targetPage: 'OUTBREAK_RADAR'
  },
  {
    id: 3,
    title: '2-Hour Express Doorstep E-Pharmacy Delivery',
    subtitle: 'Order essential medicines, upload ABDM M3 signed e-prescriptions, or get OTC wellness kits.',
    badge: 'VERIFIED E-PHARMACY GRID',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=80',
    ctaText: 'Buy Medicines Now',
    targetPage: 'BUY_MEDICINES'
  }
];

interface MedicalFacility {
  id: string;
  name: string;
  type: 'HOSPITAL' | 'SPECIALIST' | 'TESTING_LAB' | 'CLINIC' | 'EMERGENCY_ER' | 'DIALYSIS_CENTER';
  address: string;
  city: string;
  rating: number;
  distance: string;
  phone: string;
  open24x7: boolean;
  pinX: number;
  pinY: number;
  satisfaction: string;
  accreditation: string;
  image: string;
  tags: string[];
  icuBedsAvailable: number;
  oxygenBedsAvailable: number;
  generalBedsAvailable: number;
  erWaitTime: string;
  doctorsOnDuty: number;
}

const cityFacilityDatabase: Record<string, MedicalFacility[]> = {
  'New Delhi': [
    { id: 'del-f1', name: 'AIIMS Central Apex Trauma Center', type: 'HOSPITAL', address: 'Sri Aurobindo Marg, Ansari Nagar East', city: 'New Delhi', rating: 4.95, distance: '0.9 mi', phone: '+91 11 2658 8500', open24x7: true, pinX: 48, pinY: 58, satisfaction: '99% Trauma Survival', accreditation: 'Govt Apex • NABH', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80', tags: ['Level 1 Trauma', 'Neurosurgery', 'Organ Transplant', '24/7 ER'], icuBedsAvailable: 28, oxygenBedsAvailable: 85, generalBedsAvailable: 140, erWaitTime: '< 5 mins', doctorsOnDuty: 42 },
    { id: 'del-f2', name: 'Max Super Speciality Hospital Saket', type: 'HOSPITAL', address: '1, 2, Press Enclave Marg, Saket', city: 'New Delhi', rating: 4.9, distance: '1.4 mi', phone: '+91 11 4000 2000', open24x7: true, pinX: 52, pinY: 68, satisfaction: '98% Patient Satisfaction', accreditation: 'JCI & NABH Accredited', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80', tags: ['Cardiology', 'Oncology', 'Robotic Surgery'], icuBedsAvailable: 19, oxygenBedsAvailable: 60, generalBedsAvailable: 95, erWaitTime: '< 10 mins', doctorsOnDuty: 35 },
    { id: 'del-f3', name: 'Synapse Diagnostic & PET-MRI Center', type: 'TESTING_LAB', address: '450 Medical Plaza, Connaught Hub', city: 'New Delhi', rating: 4.8, distance: '2.1 mi', phone: '+91 11 2341 5566', open24x7: false, pinX: 50, pinY: 42, satisfaction: '97% Diagnostic Accuracy', accreditation: 'NABL Certified', image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80', tags: ['3T MRI', 'PET-CT', 'Molecular Genetics', 'Same-Day Report'], icuBedsAvailable: 0, oxygenBedsAvailable: 0, generalBedsAvailable: 0, erWaitTime: 'Direct Walk-in', doctorsOnDuty: 14 },
    { id: 'del-f4', name: 'Fortis Escorts Heart Institute', type: 'SPECIALIST', address: 'Okhla Road, New Friends Colony', city: 'New Delhi', rating: 4.85, distance: '3.0 mi', phone: '+91 11 4713 5000', open24x7: true, pinX: 68, pinY: 62, satisfaction: '99% Cardiac Recovery', accreditation: 'NABH Super-Speciality', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80', tags: ['Interventional Cardiology', 'Pediatric Cardiac', 'Cath Lab'], icuBedsAvailable: 14, oxygenBedsAvailable: 40, generalBedsAvailable: 65, erWaitTime: '< 8 mins', doctorsOnDuty: 22 },
    { id: 'del-f5', name: 'Manipal Hospital Dwarka', type: 'HOSPITAL', address: 'Sector 6, Dwarka Medical Corridor', city: 'New Delhi', rating: 4.8, distance: '4.2 mi', phone: '+91 11 4967 4967', open24x7: true, pinX: 26, pinY: 52, satisfaction: '96% OPD Rating', accreditation: 'NABH & Green OT', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80', tags: ['Emergency Triage', 'Orthopedics', 'Gastroenterology'], icuBedsAvailable: 12, oxygenBedsAvailable: 45, generalBedsAvailable: 80, erWaitTime: '< 12 mins', doctorsOnDuty: 28 },
    { id: 'del-f6', name: 'CurePoint Multi-Speciality Clinic', type: 'CLINIC', address: 'Vasant Vihar Community Center Block C', city: 'New Delhi', rating: 4.75, distance: '1.8 mi', phone: '+91 11 2614 1122', open24x7: false, pinX: 42, pinY: 74, satisfaction: '95% OPD Satisfaction', accreditation: 'ABDM Linked OPD', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=600&q=80', tags: ['Internal Medicine', 'Pediatrics', 'Vaccination', 'Tele-Consult'], icuBedsAvailable: 0, oxygenBedsAvailable: 5, generalBedsAvailable: 10, erWaitTime: 'Instant Token', doctorsOnDuty: 8 }
  ],
  'Mumbai': [
    { id: 'mum-f1', name: 'KEM Hospital & Parel Medical Super-Center', type: 'HOSPITAL', address: 'Acharya Donde Marg, Parel', city: 'Mumbai', rating: 4.9, distance: '1.1 mi', phone: '+91 22 2410 7000', open24x7: true, pinX: 50, pinY: 56, satisfaction: '98% Critical Care Rating', accreditation: 'Govt Apex • NABH', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80', tags: ['Level 1 Trauma', 'Infectious Diseases', '24/7 ER'], icuBedsAvailable: 24, oxygenBedsAvailable: 70, generalBedsAvailable: 120, erWaitTime: '< 5 mins', doctorsOnDuty: 40 },
    { id: 'mum-f2', name: 'Lilavati Hospital & Research Centre', type: 'HOSPITAL', address: 'A-791, Bandra Reclamation, Bandra West', city: 'Mumbai', rating: 4.85, distance: '2.3 mi', phone: '+91 22 2675 1000', open24x7: true, pinX: 42, pinY: 46, satisfaction: '99% Patient Experience', accreditation: 'NABH & JCI Accredited', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80', tags: ['Cardiology', 'Neurology', 'Oncology Care'], icuBedsAvailable: 18, oxygenBedsAvailable: 55, generalBedsAvailable: 85, erWaitTime: '< 8 mins', doctorsOnDuty: 32 },
    { id: 'mum-f3', name: 'Kokilaben Dhirubhai Ambani Hospital', type: 'HOSPITAL', address: 'Rao Saheb Achutrao Patwardhan Marg, Andheri West', city: 'Mumbai', rating: 4.9, distance: '3.6 mi', phone: '+91 22 4269 6969', open24x7: true, pinX: 44, pinY: 28, satisfaction: '99% Precision Rating', accreditation: 'JCI, NABH & CAP Certified', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80', tags: ['Robotic Surgery', 'Pediatric ICU', 'Transplant'], icuBedsAvailable: 22, oxygenBedsAvailable: 65, generalBedsAvailable: 110, erWaitTime: '< 7 mins', doctorsOnDuty: 36 },
    { id: 'mum-f4', name: 'Suburban Diagnostics Core Center', type: 'TESTING_LAB', address: 'BKC Complex Medical Wing', city: 'Mumbai', rating: 4.75, distance: '1.9 mi', phone: '+91 22 6170 0000', open24x7: false, pinX: 55, pinY: 42, satisfaction: '96% Diagnostic Speed', accreditation: 'NABL Certified', image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80', tags: ['Advanced Genomics', 'fMRI', 'RT-PCR Biomarkers'], icuBedsAvailable: 0, oxygenBedsAvailable: 0, generalBedsAvailable: 0, erWaitTime: 'No Waiting', doctorsOnDuty: 12 }
  ],
  'Bengaluru': [
    { id: 'blr-f1', name: 'Manipal Hospital Old Airport Road', type: 'HOSPITAL', address: '98, HAL Old Airport Rd, Kodihalli', city: 'Bengaluru', rating: 4.9, distance: '1.0 mi', phone: '+91 80 2502 4444', open24x7: true, pinX: 62, pinY: 48, satisfaction: '99% Critical Care', accreditation: 'NABH & AAHRPP', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80', tags: ['Organ Transplant', 'Trauma Apex', 'Cardio-Thoracic'], icuBedsAvailable: 26, oxygenBedsAvailable: 75, generalBedsAvailable: 130, erWaitTime: '< 6 mins', doctorsOnDuty: 38 },
    { id: 'blr-f2', name: 'Narayana Health City Mazumdar Shaw', type: 'HOSPITAL', address: '258/A, Bommasandra Industrial Area, Hosur Rd', city: 'Bengaluru', rating: 4.92, distance: '5.2 mi', phone: '+91 80 7122 2222', open24x7: true, pinX: 64, pinY: 82, satisfaction: '99% Cardiac Success', accreditation: 'JCI & NABH Accredited', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80', tags: ['Pediatric Cardiac', 'Bone Marrow Transplant', 'Oncology'], icuBedsAvailable: 35, oxygenBedsAvailable: 110, generalBedsAvailable: 190, erWaitTime: '< 5 mins', doctorsOnDuty: 50 },
    { id: 'blr-f3', name: 'Aster CMI Hospital Hebbal', type: 'HOSPITAL', address: '43/42, NH 44, Sahakar Nagar, Hebbal', city: 'Bengaluru', rating: 4.85, distance: '3.8 mi', phone: '+91 80 4342 0100', open24x7: true, pinX: 42, pinY: 24, satisfaction: '97% Patient Experience', accreditation: 'NABH & JCI', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80', tags: ['Neuro Sciences', 'Liver Care', 'Level 1 ER'], icuBedsAvailable: 18, oxygenBedsAvailable: 50, generalBedsAvailable: 80, erWaitTime: '< 10 mins', doctorsOnDuty: 29 },
    { id: 'blr-f4', name: 'Neuberg Anand Reference Laboratory', type: 'TESTING_LAB', address: 'Shivajinagar Diagnostic Arcade', city: 'Bengaluru', rating: 4.8, distance: '1.7 mi', phone: '+91 80 4666 4666', open24x7: false, pinX: 48, pinY: 40, satisfaction: '98% Lab Precision', accreditation: 'NABL & CAP Certified', image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80', tags: ['Digital Pathology', 'Histopathology', 'Immuno-Assays'], icuBedsAvailable: 0, oxygenBedsAvailable: 0, generalBedsAvailable: 0, erWaitTime: 'Direct Token', doctorsOnDuty: 15 }
  ],
  'Hyderabad': [
    { id: 'hyd-f1', name: 'Apollo Health City Jubilee Hills', type: 'HOSPITAL', address: 'Road No 72, Film Nagar, Jubilee Hills', city: 'Hyderabad', rating: 4.92, distance: '1.2 mi', phone: '+91 40 2360 7777', open24x7: true, pinX: 32, pinY: 42, satisfaction: '99% Clinical Excellence', accreditation: 'JCI & NABH', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80', tags: ['Robotic Cardiology', 'Proton Therapy', 'Trauma'], icuBedsAvailable: 30, oxygenBedsAvailable: 85, generalBedsAvailable: 150, erWaitTime: '< 6 mins', doctorsOnDuty: 45 },
    { id: 'hyd-f2', name: 'AIG Hospitals Gachibowli Mindspace', type: 'HOSPITAL', address: '1-66/AIG/1 to 5, Mindspace Rd, Gachibowli', city: 'Hyderabad', rating: 4.95, distance: '2.5 mi', phone: '+91 40 4244 4222', open24x7: true, pinX: 22, pinY: 36, satisfaction: '99% GI & Liver Precision', accreditation: 'JCI Accredited', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80', tags: ['Gastroenterology', 'Liver Transplant', 'ICU Bays'], icuBedsAvailable: 32, oxygenBedsAvailable: 90, generalBedsAvailable: 160, erWaitTime: '< 5 mins', doctorsOnDuty: 48 },
    { id: 'hyd-f3', name: 'Osmania General Hospital Central Apex', type: 'HOSPITAL', address: 'Afzal Gunj, High Court Road', city: 'Hyderabad', rating: 4.7, distance: '2.8 mi', phone: '+91 40 2460 0121', open24x7: true, pinX: 52, pinY: 68, satisfaction: '96% Emergency Triage', accreditation: 'Govt Apex • NABH', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80', tags: ['Level 1 Trauma', 'Burns Unit', '24/7 Casualty'], icuBedsAvailable: 20, oxygenBedsAvailable: 60, generalBedsAvailable: 110, erWaitTime: '< 8 mins', doctorsOnDuty: 35 }
  ],
  'Chennai': [
    { id: 'chn-f1', name: 'Apollo Hospital Greams Road', type: 'HOSPITAL', address: '21 Greams Lane, Thousand Lights', city: 'Chennai', rating: 4.95, distance: '0.8 mi', phone: '+91 44 2829 0200', open24x7: true, pinX: 48, pinY: 42, satisfaction: '99% Heart & Transplant Care', accreditation: 'JCI & NABH Accredited', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80', tags: ['Heart Transplant', 'Robotic Oncology', '24/7 ER'], icuBedsAvailable: 32, oxygenBedsAvailable: 95, generalBedsAvailable: 170, erWaitTime: '< 5 mins', doctorsOnDuty: 46 },
    { id: 'chn-f2', name: 'Fortis Malar Hospital Adyar', type: 'HOSPITAL', address: '52, 1st Main Rd, Gandhi Nagar, Adyar', city: 'Chennai', rating: 4.82, distance: '2.1 mi', phone: '+91 44 4289 2222', open24x7: true, pinX: 58, pinY: 64, satisfaction: '97% Patient Care', accreditation: 'NABH Super-Speciality', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80', tags: ['Cardio-Thoracic', 'Vascular Care', 'Emergency ICU'], icuBedsAvailable: 15, oxygenBedsAvailable: 45, generalBedsAvailable: 70, erWaitTime: '< 9 mins', doctorsOnDuty: 25 },
    { id: 'chn-f3', name: 'MIOT International Manapakkam', type: 'HOSPITAL', address: '4/112, Mount Poonamallee Rd, Manapakkam', city: 'Chennai', rating: 4.88, distance: '4.5 mi', phone: '+91 44 4200 2288', open24x7: true, pinX: 30, pinY: 60, satisfaction: '98% Ortho & Trauma Apex', accreditation: 'NABH & NABL', image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80', tags: ['Joint Replacement', 'Keyhole Surgery', 'Neuro ICU'], icuBedsAvailable: 22, oxygenBedsAvailable: 60, generalBedsAvailable: 105, erWaitTime: '< 7 mins', doctorsOnDuty: 34 }
  ],
  'Kolkata': [
    { id: 'kol-f1', name: 'SSKM Hospital & IPGMER Medical Institute', type: 'HOSPITAL', address: '244, AJC Bose Rd, Bhowanipore', city: 'Kolkata', rating: 4.9, distance: '1.2 mi', phone: '+91 33 2223 1589', open24x7: true, pinX: 44, pinY: 54, satisfaction: '98% Multi-Organ Survival', accreditation: 'Govt Apex • NABH', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80', tags: ['Level 1 Trauma', 'Cardiac Surgery', '24/7 ER'], icuBedsAvailable: 28, oxygenBedsAvailable: 80, generalBedsAvailable: 140, erWaitTime: '< 5 mins', doctorsOnDuty: 44 },
    { id: 'kol-f2', name: 'Apollo Multispeciality Hospitals EM Bypass', type: 'HOSPITAL', address: '58, Canal Circular Rd, Kadapara, Phool Bagan', city: 'Kolkata', rating: 4.88, distance: '2.6 mi', phone: '+91 33 2320 3040', open24x7: true, pinX: 68, pinY: 44, satisfaction: '98% Clinical Quality', accreditation: 'JCI & NABH Accredited', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80', tags: ['Oncology', 'Robotic Urology', 'Critical Care'], icuBedsAvailable: 24, oxygenBedsAvailable: 70, generalBedsAvailable: 120, erWaitTime: '< 7 mins', doctorsOnDuty: 36 },
    { id: 'kol-f3', name: 'AMRI Hospital Salt Lake Sector III', type: 'HOSPITAL', address: 'JC-16 & 17, Sector III, Bidhannagar, Salt Lake', city: 'Kolkata', rating: 4.82, distance: '3.1 mi', phone: '+91 33 6606 3800', open24x7: true, pinX: 76, pinY: 38, satisfaction: '97% Patient Rating', accreditation: 'NABH Accredited', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80', tags: ['Pediatric ICU', 'Neurology', 'Dialysis Bay'], icuBedsAvailable: 16, oxygenBedsAvailable: 45, generalBedsAvailable: 75, erWaitTime: '< 10 mins', doctorsOnDuty: 26 }
  ]
};

// Universal City Facilities Extractor with Dynamic Synthesis for custom cities
const getCityFacilities = (cityName: string): MedicalFacility[] => {
  const trimmed = cityName.trim();
  if (!trimmed) return cityFacilityDatabase['New Delhi'];

  if (cityFacilityDatabase[trimmed]) return cityFacilityDatabase[trimmed];

  const foundKey = Object.keys(cityFacilityDatabase).find(
    k => k.toLowerCase() === trimmed.toLowerCase() ||
         k.toLowerCase().includes(trimmed.toLowerCase())
  );
  if (foundKey) return cityFacilityDatabase[foundKey];

  const clean = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return [
    {
      id: `c-fac-${clean.toLowerCase()}-1`,
      name: `${clean} Apex Civil Hospital & Trauma Bay`,
      type: 'HOSPITAL',
      address: `Civil Hospital Road, Central District, ${clean}`,
      city: clean,
      rating: 4.8,
      distance: '0.9 mi',
      phone: '+91 1800-11-2026',
      open24x7: true,
      pinX: 48,
      pinY: 45,
      satisfaction: '98% Emergency Response',
      accreditation: 'District Apex • NABH',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80',
      tags: ['24/7 Level 1 Trauma', 'Emergency ICU', 'Cardiac Unit'],
      icuBedsAvailable: 18,
      oxygenBedsAvailable: 50,
      generalBedsAvailable: 90,
      erWaitTime: '< 8 mins',
      doctorsOnDuty: 28
    },
    {
      id: `c-fac-${clean.toLowerCase()}-2`,
      name: `${clean} Metro Super-Speciality Hospital`,
      type: 'HOSPITAL',
      address: `Sector 4 Ring Road Corridor, ${clean}`,
      city: clean,
      rating: 4.75,
      distance: '2.1 mi',
      phone: '+91 1800-11-4000',
      open24x7: true,
      pinX: 62,
      pinY: 34,
      satisfaction: '96% Patient Satisfaction',
      accreditation: 'NABH Accredited',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80',
      tags: ['Multispeciality', 'Surgery', 'Neonatal ICU'],
      icuBedsAvailable: 12,
      oxygenBedsAvailable: 35,
      generalBedsAvailable: 60,
      erWaitTime: '< 10 mins',
      doctorsOnDuty: 20
    },
    {
      id: `c-fac-${clean.toLowerCase()}-3`,
      name: `${clean} Advanced Diagnostic & MRI Imaging Hub`,
      type: 'TESTING_LAB',
      address: `Medical Plaza Arcade, North Wing, ${clean}`,
      city: clean,
      rating: 4.7,
      distance: '1.5 mi',
      phone: '+91 1800-11-8500',
      open24x7: false,
      pinX: 38,
      pinY: 65,
      satisfaction: '97% Diagnostic Speed',
      accreditation: 'NABL Certified',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80',
      tags: ['1.5T MRI', 'CT Scan', 'Pathology Lab'],
      icuBedsAvailable: 0,
      oxygenBedsAvailable: 0,
      generalBedsAvailable: 0,
      erWaitTime: 'Direct Walk-in',
      doctorsOnDuty: 10
    }
  ];
};

const facilityList: MedicalFacility[] = cityFacilityDatabase['New Delhi'];

interface DiseaseOutbreak {
  id: string;
  name: string;
  type: string;
  area: string;
  pincode: string;
  severity: 'CRITICAL' | 'MODERATE' | 'MONITORED';
  activeCases: number;
  trend: string;
  preventiveAdvice: string;
  lastUpdated: string;
}

interface CityOutbreakData {
  city: string;
  state: string;
  pincodeRange: string;
  activeCriticalAlerts: number;
  isolationBedsAvailable: number;
  bloodPlateletsReady: number;
  helpline: string;
  helplineLabel: string;
  outbreaks: DiseaseOutbreak[];
}

const cityOutbreakDatabase: Record<string, CityOutbreakData> = {
  'New Delhi': {
    city: 'New Delhi (NCR)',
    state: 'Delhi NCR',
    pincodeRange: '110001 - 110096',
    activeCriticalAlerts: 1,
    isolationBedsAvailable: 140,
    bloodPlateletsReady: 850,
    helpline: '1800-11-2026',
    helplineLabel: 'ICMR Delhi Epidemic Surveillance Cell',
    outbreaks: [
      {
        id: 'del-1',
        name: 'Dengue Virus Serotype-2 Surge',
        type: 'Vector-Borne Viral Infection',
        area: 'Delhi NCR (South & West Districts)',
        pincode: '110001 - 110075',
        severity: 'CRITICAL',
        activeCases: 1420,
        trend: '+340% Baseline Spike',
        preventiveAdvice: 'Eliminate stagnant water, use DEET mosquito repellents, monitor platelet count if high fever persists.',
        lastUpdated: '12 Mins Ago'
      },
      {
        id: 'del-2',
        name: 'Influenza A Subtype H3N2 Cluster',
        type: 'Respiratory Viral Infection',
        area: 'Gurugram & Vasant Kunj Sector 4',
        pincode: '122001 & 110070',
        severity: 'MODERATE',
        activeCases: 680,
        trend: '+45% Weekly Increase',
        preventiveAdvice: 'Wear N95 masks in transit, get quadrivalent flu vaccination, maintain 6ft distance from symptomatic patients.',
        lastUpdated: '2 Hours Ago'
      },
      {
        id: 'del-3',
        name: 'Chikungunya Viral Infection Alert',
        type: 'Aedes Aegypti Vector Outbreak',
        area: 'Noida Sector 62 & Indirapuram',
        pincode: '201301',
        severity: 'MONITORED',
        activeCases: 210,
        trend: 'Stable Control',
        preventiveAdvice: 'Report joint pain with sudden onset fever. Local municipal fogging squads deployed.',
        lastUpdated: '4 Hours Ago'
      }
    ]
  },
  'Mumbai': {
    city: 'Mumbai (MMR)',
    state: 'Maharashtra',
    pincodeRange: '400001 - 400099',
    activeCriticalAlerts: 1,
    isolationBedsAvailable: 210,
    bloodPlateletsReady: 1120,
    helpline: '022-2262-0261',
    helplineLabel: 'BMC Disaster Management Control',
    outbreaks: [
      {
        id: 'mum-1',
        name: 'Leptospirosis Waterlogging Alert',
        type: 'Bacterial Zoonotic Surge',
        area: 'Kurla, Dadar & Hindmata Lowlands',
        pincode: '400014 - 400070',
        severity: 'CRITICAL',
        activeCases: 890,
        trend: '+210% Post-Rainfall Surge',
        preventiveAdvice: 'Avoid wading in stagnant floodwaters, consult physician for prophylactic Doxycycline if exposed.',
        lastUpdated: '15 Mins Ago'
      },
      {
        id: 'mum-2',
        name: 'Malaria Vivax Cluster',
        type: 'Vector-Borne Parasitic Infection',
        area: 'Colaba, Fort & Parel Harbor Slopes',
        pincode: '400001 - 400012',
        severity: 'MODERATE',
        activeCases: 430,
        trend: '+28% Bi-Weekly Increase',
        preventiveAdvice: 'Screen for intermittent chills & high fever. Use bed nets treated with pyrethroid sprays.',
        lastUpdated: '1 Hour Ago'
      },
      {
        id: 'mum-3',
        name: 'Gastroenteritis (Rotavirus) Alert',
        type: 'Enteric Viral Infection',
        area: 'Andheri East & Ghatkopar Metro Belt',
        pincode: '400069 - 400075',
        severity: 'MONITORED',
        activeCases: 310,
        trend: 'Decelerating',
        preventiveAdvice: 'Boil drinking water for at least 10 minutes, maintain strict hand hygiene before meals.',
        lastUpdated: '3 Hours Ago'
      }
    ]
  },
  'Bengaluru': {
    city: 'Bengaluru (Urban)',
    state: 'Karnataka',
    pincodeRange: '560001 - 560100',
    activeCriticalAlerts: 1,
    isolationBedsAvailable: 175,
    bloodPlateletsReady: 940,
    helpline: '080-2266-0000',
    helplineLabel: 'BBMP Health Telemetry War Room',
    outbreaks: [
      {
        id: 'blr-1',
        name: 'Dengue Serotype-1 & 3 Surge',
        type: 'Vector-Borne Epidemic Alert',
        area: 'Mahadevapura, Whitefield & Koramangala',
        pincode: '560066 - 560034',
        severity: 'CRITICAL',
        activeCases: 1180,
        trend: '+190% Monthly Spike',
        preventiveAdvice: 'Inspect construction water sumps, clear terrace drainage trays, report persistent fever.',
        lastUpdated: '8 Mins Ago'
      },
      {
        id: 'blr-2',
        name: 'H1N1 Swine Influenza Cluster',
        type: 'Respiratory Droplet Viral',
        area: 'Indiranagar & HSR Layout Sector 2',
        pincode: '560038 - 560102',
        severity: 'MODERATE',
        activeCases: 390,
        trend: '+34% Weekly Increase',
        preventiveAdvice: 'Use Oseltamivir within 48h of onset under clinical prescription. Isolate high-risk patients.',
        lastUpdated: '1 Hour Ago'
      },
      {
        id: 'blr-3',
        name: 'Viral Conjunctivitis (Pink Eye)',
        type: 'Adenoviral Ocular Infection',
        area: 'Electronic City Phase 1 & 2',
        pincode: '560100',
        severity: 'MONITORED',
        activeCases: 260,
        trend: 'Plateaued',
        preventiveAdvice: 'Do not rub eyes, avoid sharing personal items, use preservative-free lubricating drops.',
        lastUpdated: '5 Hours Ago'
      }
    ]
  },
  'Hyderabad': {
    city: 'Hyderabad (GHMC)',
    state: 'Telangana',
    pincodeRange: '500001 - 500095',
    activeCriticalAlerts: 0,
    isolationBedsAvailable: 190,
    bloodPlateletsReady: 780,
    helpline: '040-2111-1111',
    helplineLabel: 'GHMC Epidemic Response Command',
    outbreaks: [
      {
        id: 'hyd-1',
        name: 'Typhoid (Salmonella Typhi) Spread',
        type: 'Waterborne Bacterial Infection',
        area: 'Old City, Charminar & Mehdipatnam',
        pincode: '500002 - 500028',
        severity: 'MODERATE',
        activeCases: 520,
        trend: '+15% Seasonal Shift',
        preventiveAdvice: 'Drink verified RO or boiled water, avoid raw street food, check Widal / Blood Culture if febrile.',
        lastUpdated: '25 Mins Ago'
      },
      {
        id: 'hyd-2',
        name: 'Dengue Serotype-2 Surveillance',
        type: 'Vector-Borne Infection',
        area: 'HITEC City, Madhapur & Gachibowli',
        pincode: '500081 - 500032',
        severity: 'MODERATE',
        activeCases: 410,
        trend: '+22% Baseline Increase',
        preventiveAdvice: 'Aerosol space spraying active in residential zones. Avoid uncovered water storage tanks.',
        lastUpdated: '2 Hours Ago'
      },
      {
        id: 'hyd-3',
        name: 'Scrub Typhus (Orientia Tsutsugamushi)',
        type: 'Mite-Borne Zoonosis',
        area: 'Secunderabad Cantonment Belt',
        pincode: '500003',
        severity: 'MONITORED',
        activeCases: 95,
        trend: 'Controlled',
        preventiveAdvice: 'Inspect skin for black eschar marks after outdoor trekking. Prompt Doxycycline treatment resolves symptoms.',
        lastUpdated: '6 Hours Ago'
      }
    ]
  },
  'Chennai': {
    city: 'Chennai (GCC)',
    state: 'Tamil Nadu',
    pincodeRange: '600001 - 600120',
    activeCriticalAlerts: 1,
    isolationBedsAvailable: 160,
    bloodPlateletsReady: 820,
    helpline: '044-2538-4520',
    helplineLabel: 'GCC Health & Communicable Disease Wing',
    outbreaks: [
      {
        id: 'chn-1',
        name: 'Chikungunya Arthritic Outbreak',
        type: 'Alphavirus Vector Surge',
        area: 'T. Nagar, Velachery & Adyar Coastal',
        pincode: '600017 - 600020',
        severity: 'CRITICAL',
        activeCases: 940,
        trend: '+280% Surge Post-Rainfall',
        preventiveAdvice: 'Early hydration and joint analgesic management. Avoid aspirin in febrile vector phase.',
        lastUpdated: '10 Mins Ago'
      },
      {
        id: 'chn-2',
        name: 'Dengue Hemorrhagic Watch',
        type: 'Flavivirus Vector Infection',
        area: 'Anna Nagar & Royapettah',
        pincode: '600040 - 600014',
        severity: 'MODERATE',
        activeCases: 480,
        trend: '+38% Weekly',
        preventiveAdvice: 'Daily CBC platelet monitoring if temperature exceeds 102°F. Rapid NS1 antigen kits deployed.',
        lastUpdated: '3 Hours Ago'
      }
    ]
  },
  'Kolkata': {
    city: 'Kolkata (KMC)',
    state: 'West Bengal',
    pincodeRange: '700001 - 700100',
    activeCriticalAlerts: 1,
    isolationBedsAvailable: 130,
    bloodPlateletsReady: 690,
    helpline: '033-2286-1212',
    helplineLabel: 'KMC Health Telemetry Center',
    outbreaks: [
      {
        id: 'kol-1',
        name: 'Adenovirus Pediatric Respiratory Alert',
        type: 'Airborne Pediatric Viral Surge',
        area: 'Salt Lake, Park Circus & Howrah',
        pincode: '700064 - 700017',
        severity: 'CRITICAL',
        activeCases: 1140,
        trend: '+240% Pediatric ICU Spike',
        preventiveAdvice: 'Keep infants away from crowded areas, nebulization under pediatrician supervision.',
        lastUpdated: '18 Mins Ago'
      },
      {
        id: 'kol-2',
        name: 'Dengue Serotype-4 Wave',
        type: 'Vector-Borne Infection',
        area: 'Ballygunge, Jadavpur & Behala',
        pincode: '700019 - 700034',
        severity: 'MODERATE',
        activeCases: 620,
        trend: '+45% Weekly',
        preventiveAdvice: 'Intensive larval eradication in open storm drains and building basements.',
        lastUpdated: '2 Hours Ago'
      }
    ]
  },
  'Pune': {
    city: 'Pune (PMC/PCMC)',
    state: 'Maharashtra',
    pincodeRange: '411001 - 411060',
    activeCriticalAlerts: 1,
    isolationBedsAvailable: 150,
    bloodPlateletsReady: 710,
    helpline: '020-2550-1000',
    helplineLabel: 'PMC Health War Room',
    outbreaks: [
      {
        id: 'pun-1',
        name: 'Zika & Dengue Co-Surveillance Alert',
        type: 'Flavivirus Vector Outbreak',
        area: 'Kothrud, Erandwane & Hinjawadi IT Park',
        pincode: '411038 - 411057',
        severity: 'CRITICAL',
        activeCases: 760,
        trend: '+175% Surge in Urban Belt',
        preventiveAdvice: 'Vector containment in residential societies. Prompt RT-PCR screening for Zika/Dengue.',
        lastUpdated: '14 Mins Ago'
      },
      {
        id: 'pun-2',
        name: 'Chikungunya Acute Joint Fever',
        type: 'Vector-Borne Epidemic',
        area: 'Hadapsar & Viman Nagar',
        pincode: '411028 - 411014',
        severity: 'MODERATE',
        activeCases: 340,
        trend: '+30% Weekly',
        preventiveAdvice: 'Avoid NSAIDs before platelet confirmation. Rest and adequate hydration recommended.',
        lastUpdated: '3 Hours Ago'
      }
    ]
  },
  'Ahmedabad': {
    city: 'Ahmedabad (AMC)',
    state: 'Gujarat',
    pincodeRange: '380001 - 380061',
    activeCriticalAlerts: 0,
    isolationBedsAvailable: 180,
    bloodPlateletsReady: 890,
    helpline: '079-2539-1811',
    helplineLabel: 'AMC Health Telemetry Bureau',
    outbreaks: [
      {
        id: 'ahm-1',
        name: 'Hepatitis E Water Contamination Watch',
        type: 'Enteric Viral Liver Infection',
        area: 'Maninagar, Bapunagar & Sabarmati Belt',
        pincode: '380008 - 380005',
        severity: 'MODERATE',
        activeCases: 490,
        trend: '+24% Bi-Weekly Increase',
        preventiveAdvice: 'Strict reliance on chlorinated or boiled water. Liver function testing if jaundice appears.',
        lastUpdated: '40 Mins Ago'
      },
      {
        id: 'ahm-2',
        name: 'Malaria Falciparum Surveillance',
        type: 'Vector-Borne Infection',
        area: 'SG Highway & Bodakdev',
        pincode: '380054',
        severity: 'MONITORED',
        activeCases: 190,
        trend: 'Controlled',
        preventiveAdvice: 'Periodic fogging around lake perimeters and active drainage lines.',
        lastUpdated: '4 Hours Ago'
      }
    ]
  },
  'Jaipur': {
    city: 'Jaipur (JMC)',
    state: 'Rajasthan',
    pincodeRange: '302001 - 302039',
    activeCriticalAlerts: 1,
    isolationBedsAvailable: 135,
    bloodPlateletsReady: 620,
    helpline: '0141-274-0000',
    helplineLabel: 'Rajasthan Directorate of Public Health',
    outbreaks: [
      {
        id: 'jai-1',
        name: 'Seasonal Dengue & Scrub Typhus Surge',
        type: 'Mixed Vector Epidemic Alert',
        area: 'Mansarovar, Vaishali Nagar & Sanganer',
        pincode: '302020 - 302029',
        severity: 'CRITICAL',
        activeCases: 830,
        trend: '+215% Monthly Spike',
        preventiveAdvice: 'Early serological evaluation. Immediate hospitalization if warning signs such as abdominal pain occur.',
        lastUpdated: '22 Mins Ago'
      }
    ]
  },
  'Lucknow': {
    city: 'Lucknow (LMC)',
    state: 'Uttar Pradesh',
    pincodeRange: '226001 - 226030',
    activeCriticalAlerts: 1,
    isolationBedsAvailable: 165,
    bloodPlateletsReady: 780,
    helpline: '0522-262-2026',
    helplineLabel: 'UP State Health Command & Control',
    outbreaks: [
      {
        id: 'luc-1',
        name: 'Dengue Serotype-2 & Viral Fever Wave',
        type: 'Vector-Borne Viral Infection',
        area: 'Gomti Nagar, Alambagh & Indira Nagar',
        pincode: '226010 - 226016',
        severity: 'CRITICAL',
        activeCases: 1050,
        trend: '+290% Hospital Admission Surge',
        preventiveAdvice: 'Avoid self-medication, ensure adequate electrolyte intake, report high fever immediately.',
        lastUpdated: '16 Mins Ago'
      }
    ]
  }
};

// Helper function to resolve or dynamically synthesize localized telemetry for ANY entered city
const getCityOutbreakData = (cityName: string): CityOutbreakData => {
  const trimmed = cityName.trim();
  if (!trimmed) return cityOutbreakDatabase['New Delhi'];

  // Check exact key match
  if (cityOutbreakDatabase[trimmed]) {
    return cityOutbreakDatabase[trimmed];
  }

  // Check case-insensitive match
  const foundKey = Object.keys(cityOutbreakDatabase).find(
    k => k.toLowerCase() === trimmed.toLowerCase() || 
         cityOutbreakDatabase[k].city.toLowerCase().includes(trimmed.toLowerCase())
  );
  if (foundKey) {
    return cityOutbreakDatabase[foundKey];
  }

  // Dynamic real-time synthesis for custom typed city
  const cleanName = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return {
    city: `${cleanName} (Custom Node)`,
    state: 'National Health Grid',
    pincodeRange: 'Locality Specific',
    activeCriticalAlerts: 1,
    isolationBedsAvailable: 95,
    bloodPlateletsReady: 480,
    helpline: '1800-11-2026',
    helplineLabel: `IDSP National Telemetry (${cleanName} Hub)`,
    outbreaks: [
      {
        id: `custom-${cleanName.toLowerCase()}-1`,
        name: `Seasonal Vector & Viral Surveillance (${cleanName})`,
        type: 'Active Epidemiological Monitoring',
        area: `${cleanName} Metropolitan & Peripheral Zones`,
        pincode: 'All Active Sectors',
        severity: 'MODERATE',
        activeCases: 420,
        trend: '+18% Telemetry Index',
        preventiveAdvice: 'Follow standard vector control protocols, verify potable water sources, and access nearby emergency triage.',
        lastUpdated: 'Live Just Now'
      }
    ]
  };
};

interface PatientHotspot {
  id: string;
  name: string;
  pincode: string;
  disease: string;
  patientCount: number;
  severity: 'CRITICAL' | 'MODERATE' | 'MONITORED';
  x: number; // 5% to 95%
  y: number; // 5% to 95%
  hospitalNearby: string;
  isolationBeds: number;
  quarantineStatus: string;
}

interface CityMapConfig {
  cityName: string;
  state: string;
  gridColor: string;
  riverName?: string;
  highwayNames: string[];
  landmarks: { name: string; x: number; y: number }[];
  hotspots: PatientHotspot[];
}

const cityMapDatabase: Record<string, CityMapConfig> = {
  'New Delhi': {
    cityName: 'New Delhi (NCR)',
    state: 'Delhi NCR',
    gridColor: '#00B4D8',
    riverName: 'Yamuna River Corridor',
    highwayNames: ['Outer Ring Road', 'Delhi-Gurgaon Expressway', 'DND Flyway', 'Noida-Gr.Noida Link'],
    landmarks: [
      { name: 'Connaught Place Hub', x: 50, y: 44 },
      { name: 'AIIMS Central Trauma Apex', x: 48, y: 62 },
      { name: 'CyberCity Gurugram Node', x: 22, y: 78 },
      { name: 'Noida Sector 62 Bio-Cluster', x: 80, y: 55 }
    ],
    hotspots: [
      { id: 'del-h1', name: 'South Delhi (Hauz Khas / Saket)', pincode: '110017', disease: 'Dengue Serotype-2', patientCount: 540, severity: 'CRITICAL', x: 52, y: 68, hospitalNearby: 'Max Super Speciality Saket', isolationBeds: 45, quarantineStatus: 'Level-3 Vector Containment Active' },
      { id: 'del-h2', name: 'West Delhi (Janakpuri & Dwarka)', pincode: '110058', disease: 'Dengue & H3N2 Flu', patientCount: 420, severity: 'CRITICAL', x: 28, y: 50, hospitalNearby: 'Manipal Hospital Dwarka', isolationBeds: 38, quarantineStatus: 'Mobile Testing Squads Active' },
      { id: 'del-h3', name: 'Gurugram Sector 29 & Vasant Kunj', pincode: '122001', disease: 'Influenza A (H3N2)', patientCount: 360, severity: 'MODERATE', x: 25, y: 72, hospitalNearby: 'Fortis Memorial Gurugram', isolationBeds: 30, quarantineStatus: 'Mask Advisory in Public Transit' },
      { id: 'del-h4', name: 'Noida Sector 62 & Indirapuram', pincode: '201301', disease: 'Chikungunya Arthritic Fever', patientCount: 210, severity: 'MONITORED', x: 78, y: 48, hospitalNearby: 'Fortis Hospital Noida', isolationBeds: 25, quarantineStatus: 'Municipal Fogging Dispatched' },
      { id: 'del-h5', name: 'North Delhi (Civil Lines / Rohini)', pincode: '110085', disease: 'Seasonal Viral Exanthem', patientCount: 180, severity: 'MODERATE', x: 38, y: 24, hospitalNearby: 'Saroj Super Speciality Rohini', isolationBeds: 22, quarantineStatus: 'Outpatient Triage Active' }
    ]
  },
  'Mumbai': {
    cityName: 'Mumbai (MMR)',
    state: 'Maharashtra',
    gridColor: '#0284C7',
    riverName: 'Mithi River Basin & Arabian Sea Coast',
    highwayNames: ['Western Express Highway', 'Eastern Freeway', 'Bandra-Worli Sea Link', 'Sion-Panvel Expressway'],
    landmarks: [
      { name: 'KEM Hospital & Parel Medical Hub', x: 50, y: 56 },
      { name: 'BKC Central Business Node', x: 55, y: 42 },
      { name: 'Bandra West Coastal', x: 42, y: 46 },
      { name: 'Colaba Heritage Bay', x: 48, y: 88 }
    ],
    hotspots: [
      { id: 'mum-h1', name: 'Kurla West & LBS Marg Lowlands', pincode: '400070', disease: 'Leptospirosis Waterlogging', patientCount: 480, severity: 'CRITICAL', x: 58, y: 38, hospitalNearby: 'KEM Hospital Parel', isolationBeds: 55, quarantineStatus: 'Water Sanitation Alert' },
      { id: 'mum-h2', name: 'Dadar & Hindmata Flood Plain', pincode: '400014', disease: 'Leptospirosis & Malaria', patientCount: 410, severity: 'CRITICAL', x: 50, y: 52, hospitalNearby: 'Tata Memorial & KEM', isolationBeds: 60, quarantineStatus: 'Doxycycline Prophylaxis Distributed' },
      { id: 'mum-h3', name: 'Andheri East Metro Corridor', pincode: '400069', disease: 'Rotavirus Gastroenteritis', patientCount: 310, severity: 'MODERATE', x: 46, y: 28, hospitalNearby: 'SevenHills Hospital Andheri', isolationBeds: 40, quarantineStatus: 'Water Supply Auditing' },
      { id: 'mum-h4', name: 'Colaba & Fort Marine Slopes', pincode: '400001', disease: 'Malaria Vivax Cluster', patientCount: 220, severity: 'MODERATE', x: 48, y: 82, hospitalNearby: 'Bombay Hospital Marine Lines', isolationBeds: 35, quarantineStatus: 'Harbor Fogging Operations' }
    ]
  },
  'Bengaluru': {
    cityName: 'Bengaluru (Urban)',
    state: 'Karnataka',
    gridColor: '#10B981',
    riverName: 'Vrishabhavathi / Bellandur Lake Belt',
    highwayNames: ['Outer Ring Road (ORR)', 'Hosur Road Expressway', 'NICE Ring Road', 'Old Airport Road'],
    landmarks: [
      { name: 'Victoria Hospital & City Market', x: 40, y: 46 },
      { name: 'Whitefield EPIP Tech Node', x: 82, y: 40 },
      { name: 'Koramangala 5th Block', x: 58, y: 60 },
      { name: 'Electronic City Phase 1', x: 62, y: 82 }
    ],
    hotspots: [
      { id: 'blr-h1', name: 'Mahadevapura & Marathahalli', pincode: '560048', disease: 'Dengue Serotype-1 Surge', patientCount: 620, severity: 'CRITICAL', x: 74, y: 44, hospitalNearby: 'Manipal Hospital Varthur', isolationBeds: 50, quarantineStatus: 'Construction Sump Larvicide Deployed' },
      { id: 'blr-h2', name: 'Whitefield IT Tech Park Zone', pincode: '560066', disease: 'Dengue & Febrile Illness', patientCount: 560, severity: 'CRITICAL', x: 84, y: 38, hospitalNearby: 'Vydehi Hospital Whitefield', isolationBeds: 45, quarantineStatus: 'Residential Mosquito Traps Placed' },
      { id: 'blr-h3', name: 'Indiranagar & HSR Layout', pincode: '560038', disease: 'H1N1 Swine Influenza', patientCount: 390, severity: 'MODERATE', x: 60, y: 54, hospitalNearby: 'Apollo Hospital Bannerghatta', isolationBeds: 38, quarantineStatus: 'Tamiflu Stock Requisitioned' },
      { id: 'blr-h4', name: 'Electronic City Phase 1 & 2', pincode: '560100', disease: 'Adenoviral Conjunctivitis', patientCount: 260, severity: 'MONITORED', x: 64, y: 80, hospitalNearby: 'Narayana Health City', isolationBeds: 30, quarantineStatus: 'Corporate Hygiene Advisory' }
    ]
  },
  'Hyderabad': {
    cityName: 'Hyderabad (GHMC)',
    state: 'Telangana',
    gridColor: '#F59E0B',
    riverName: 'Musi River Basin & Hussain Sagar',
    highwayNames: ['Nehru Outer Ring Road', 'PVNR Elevated Expressway', 'HITEC City Flyover', 'Secunderabad Road'],
    landmarks: [
      { name: 'NIMS Medical Super Campus', x: 46, y: 42 },
      { name: 'HITEC City Cyber Towers', x: 26, y: 36 },
      { name: 'Charminar Historical Core', x: 52, y: 68 },
      { name: 'Secunderabad Clock Tower', x: 58, y: 26 }
    ],
    hotspots: [
      { id: 'hyd-h1', name: 'Charminar Old City & Mehdipatnam', pincode: '500002', disease: 'Typhoid (Salmonella Typhi)', patientCount: 520, severity: 'CRITICAL', x: 54, y: 72, hospitalNearby: 'Osmania General Hospital', isolationBeds: 55, quarantineStatus: 'Water Quality Chlorination Active' },
      { id: 'hyd-h2', name: 'Madhapur & Gachibowli Cyber Belt', pincode: '500081', disease: 'Dengue Serotype-2 Surveillance', patientCount: 410, severity: 'MODERATE', x: 24, y: 40, hospitalNearby: 'Care Hospital HITEC City', isolationBeds: 40, quarantineStatus: 'Thermal Fogging Active' },
      { id: 'hyd-h3', name: 'Secunderabad Cantonment Belt', pincode: '500003', disease: 'Scrub Typhus Mite Infection', patientCount: 95, severity: 'MONITORED', x: 60, y: 28, hospitalNearby: 'Gandhi Hospital Secunderabad', isolationBeds: 25, quarantineStatus: 'Acaricide Treatment in Parks' }
    ]
  },
  'Chennai': {
    cityName: 'Chennai (GCC)',
    state: 'Tamil Nadu',
    gridColor: '#EC4899',
    riverName: 'Adyar & Cooum Rivers • Bay of Bengal Coast',
    highwayNames: ['Old Mahabalipuram Rd (OMR)', 'Grand Southern Trunk (GST)', 'Mount Road (Anna Salai)', 'East Coast Road'],
    landmarks: [
      { name: 'Rajiv Gandhi General Hospital', x: 54, y: 34 },
      { name: 'T. Nagar Commercial Core', x: 44, y: 52 },
      { name: 'OMR IT Corridor Sholinganallur', x: 52, y: 84 },
      { name: 'Anna Nagar West', x: 32, y: 32 }
    ],
    hotspots: [
      { id: 'chn-h1', name: 'T. Nagar & Velachery Lowlands', pincode: '600017', disease: 'Chikungunya Arthritic Outbreak', patientCount: 540, severity: 'CRITICAL', x: 46, y: 56, hospitalNearby: 'Apollo Hospital Greams Road', isolationBeds: 50, quarantineStatus: 'Physiotherapy & Pain Relief Hubs' },
      { id: 'chn-h2', name: 'Adyar Coastal & Thiruvanmiyur', pincode: '600020', disease: 'Chikungunya & Dengue', patientCount: 400, severity: 'CRITICAL', x: 58, y: 64, hospitalNearby: 'Fortis Malar Adyar', isolationBeds: 35, quarantineStatus: 'Coastal Drainage Sprayed' },
      { id: 'chn-h3', name: 'Anna Nagar & Royapettah', pincode: '600040', disease: 'Dengue Hemorrhagic Watch', patientCount: 480, severity: 'MODERATE', x: 36, y: 36, hospitalNearby: 'Govt Royapettah Hospital', isolationBeds: 42, quarantineStatus: 'NS1 Rapid Antigen Camps' }
    ]
  },
  'Kolkata': {
    cityName: 'Kolkata (KMC)',
    state: 'West Bengal',
    gridColor: '#8B5CF6',
    riverName: 'Hooghly River & Howrah Bridge Span',
    highwayNames: ['Eastern Metropolitan Bypass (EM Bypass)', 'VIP Road', 'Kona Expressway', 'Belghoria Expressway'],
    landmarks: [
      { name: 'SSKM Medical College Apex', x: 44, y: 54 },
      { name: 'Salt Lake Sector V IT Hub', x: 74, y: 40 },
      { name: 'Park Circus 7-Point Confluence', x: 52, y: 48 },
      { name: 'Howrah Terminal Concourse', x: 34, y: 42 }
    ],
    hotspots: [
      { id: 'kol-h1', name: 'Salt Lake Sector V & New Town', pincode: '700091', disease: 'Adenovirus Pediatric Respiratory', patientCount: 610, severity: 'CRITICAL', x: 76, y: 38, hospitalNearby: 'AMRI Hospital Salt Lake', isolationBeds: 48, quarantineStatus: 'Pediatric ICU Beds Augmented' },
      { id: 'kol-h2', name: 'Park Circus & Howrah Basin', pincode: '700017', disease: 'Adenovirus & Dengue', patientCount: 530, severity: 'CRITICAL', x: 48, y: 46, hospitalNearby: 'Calcutta National Medical College', isolationBeds: 42, quarantineStatus: 'Nebulization Centers Operational' },
      { id: 'kol-h3', name: 'Ballygunge & Jadavpur 8B', pincode: '700019', disease: 'Dengue Serotype-4 Wave', patientCount: 420, severity: 'MODERATE', x: 56, y: 68, hospitalNearby: 'SSKM Hospital', isolationBeds: 35, quarantineStatus: 'Open Drain Larvicide Flush' }
    ]
  }
};

// Fallback generator for any custom typed city map
const getCityMapConfig = (cityName: string): CityMapConfig => {
  const trimmed = cityName.trim();
  if (!trimmed) return cityMapDatabase['New Delhi'];

  if (cityMapDatabase[trimmed]) return cityMapDatabase[trimmed];

  const foundKey = Object.keys(cityMapDatabase).find(
    k => k.toLowerCase() === trimmed.toLowerCase() ||
         cityMapDatabase[k].cityName.toLowerCase().includes(trimmed.toLowerCase())
  );
  if (foundKey) return cityMapDatabase[foundKey];

  const clean = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return {
    cityName: `${clean} (Municipal Grid)`,
    state: 'State Public Health Grid',
    gridColor: '#00B4D8',
    riverName: `${clean} Water Basin`,
    highwayNames: [`${clean} Inner Ring Road`, `${clean} Highway Corridor`, `${clean} Bypass`],
    landmarks: [
      { name: `${clean} Medical College & Hospital`, x: 50, y: 45 },
      { name: `${clean} Central Transport Hub`, x: 35, y: 55 },
      { name: `${clean} District Civil Hospital`, x: 65, y: 35 }
    ],
    hotspots: [
      { id: `c-${clean}-1`, name: `${clean} Central Commercial Ward`, pincode: 'Zone-1', disease: 'Seasonal Dengue Surge', patientCount: 260, severity: 'CRITICAL', x: 48, y: 42, hospitalNearby: `${clean} Civil Hospital`, isolationBeds: 30, quarantineStatus: 'Active Containment Zone' },
      { id: `c-${clean}-2`, name: `${clean} North Residential Sector`, pincode: 'Zone-2', disease: 'Viral Influenza Cluster', patientCount: 190, severity: 'MODERATE', x: 62, y: 28, hospitalNearby: `${clean} District Health Center`, isolationBeds: 25, quarantineStatus: 'Outpatient Telemetry Monitoring' },
      { id: `c-${clean}-3`, name: `${clean} South Industrial Belt`, pincode: 'Zone-3', disease: 'Waterborne Enteric Alert', patientCount: 130, severity: 'MONITORED', x: 38, y: 68, hospitalNearby: `${clean} Emergency Trauma Unit`, isolationBeds: 20, quarantineStatus: 'Water Chlorination Underway' }
    ]
  };
};

const localOutbreaks: DiseaseOutbreak[] = cityOutbreakDatabase['New Delhi'].outbreaks;

interface HealthNewsArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  area: string;
  summary: string;
  category: string;
  image: string;
}

const localHealthNews: HealthNewsArticle[] = [
  {
    id: 'news-1',
    title: 'ICMR Issues Unified Advisory on Dengue Management & Platelet Transfusion Guidelines',
    source: 'Indian Council of Medical Research (ICMR)',
    date: 'August 21, 2026',
    area: 'Delhi NCR / National',
    summary: 'ICMR releases new clinical protocols emphasizing oral hydration over premature platelet transfusions for Dengue patients with counts above 20,000/μL.',
    category: 'Clinical Protocol',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'news-2',
    title: 'Delhi Health Department Launches 50 Mobile Testing Vans for Free Complete Blood Count (CBC)',
    source: 'Delhi State Health Mission',
    date: 'August 20, 2026',
    area: 'Delhi NCR (Local Area)',
    summary: '50 specialized diagnostic vans equipped with point-of-care cell counters dispatched to high-density areas for instant 10-minute CBC results.',
    category: 'Local Healthcare Update',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'news-3',
    title: 'National Health Authority Expands ABDM M3 Universal E-Prescription Network to 12,000 Pharmacies',
    source: 'National Health Authority (NHA)',
    date: 'August 19, 2026',
    area: 'National / Metro Regions',
    summary: 'Patients can now fulfill digitally signed FHIR R4 e-prescriptions seamlessly with automated insurance pre-authorization via NHCX claims network.',
    category: 'ABDM Policy Update',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80'
  }
];

interface MedicineItem {
  id: string;
  name: string;
  category: string;
  price: number;
  dosage: string;
  prescriptionRequired: boolean;
  inStock: boolean;
  image: string;
}

const medicineCatalog: MedicineItem[] = [
  { id: 'm-1', name: 'Levetiracetam 500mg', category: 'Neurology / Anti-Epileptic', price: 420, dosage: '10 Tablets / Strip', prescriptionRequired: true, inStock: true, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80' },
  { id: 'm-2', name: 'Atorvastatin 10mg', category: 'Cardiovascular / Lipid', price: 180, dosage: '15 Tablets / Strip', prescriptionRequired: true, inStock: true, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80' },
  { id: 'm-3', name: 'Metformin 500mg SR', category: 'Diabetes Care', price: 95, dosage: '20 Tablets / Strip', prescriptionRequired: true, inStock: true, image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=400&q=80' },
  { id: 'm-4', name: 'Dolo 650mg (Paracetamol)', category: 'Analgesic & Fever', price: 35, dosage: '15 Tablets / Strip', prescriptionRequired: false, inStock: true, image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=400&q=80' },
  { id: 'm-5', name: 'Amoxyclav 625mg', category: 'Antibiotics', price: 210, dosage: '10 Tablets / Strip', prescriptionRequired: true, inStock: true, image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=400&q=80' },
  { id: 'm-6', name: 'Pan-40 (Pantoprazole)', category: 'Gastro-Protective', price: 120, dosage: '15 Tablets / Strip', prescriptionRequired: false, inStock: true, image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80' },
];

interface DoctorCard {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  hospital: string;
  fee: number;
  availableToday: boolean;
  image: string;
}

const mockDoctors: DoctorCard[] = [
  { id: 'd-1', name: 'Dr. Vikram Seth', specialty: 'Senior Neurologist & Stroke Specialist', experience: 18, rating: 4.9, hospital: 'Apex Neurovascular Institute', fee: 1200, availableToday: true, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' },
  { id: 'd-2', name: 'Dr. Neha Verma', specialty: 'Interventional Cardiologist', experience: 14, rating: 4.8, hospital: 'Max Super Speciality Hospital', fee: 1500, availableToday: true, image: 'https://images.unsplash.com/photo-1594824813566-8885548325a7?auto=format&fit=crop&w=400&q=80' },
  { id: 'd-3', name: 'Dr. Anish Gupta', specialty: 'Infectious Disease Specialist', experience: 12, rating: 4.9, hospital: 'AIIMS New Delhi Apex Unit', fee: 900, availableToday: true, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80' },
];

function StitchThreeGlobe({ selectedCity, onSelectCity }: { selectedCity: string; onSelectCity: (city: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const render = () => {
      angle += 0.008;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = 110;

      const haloGradient = ctx.createRadialGradient(centerX, centerY, radius - 10, centerX, centerY, radius + 30);
      haloGradient.addColorStop(0, 'rgba(0, 180, 216, 0.4)');
      haloGradient.addColorStop(1, 'rgba(0, 180, 216, 0)');
      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 30, 0, Math.PI * 2);
      ctx.fill();

      const sphereGrad = ctx.createRadialGradient(centerX - 30, centerY - 30, 10, centerX, centerY, radius);
      sphereGrad.addColorStop(0, '#00B4D8');
      sphereGrad.addColorStop(0.6, '#0077B6');
      sphereGrad.addColorStop(1, '#0F172A');
      ctx.fillStyle = sphereGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;

      for (let i = -3; i <= 3; i++) {
        ctx.beginPath();
        const yOffset = i * 25;
        const rSub = Math.sqrt(Math.max(0, radius * radius - yOffset * yOffset));
        ctx.ellipse(centerX, centerY + yOffset, rSub, rSub * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        const rot = angle + (i * Math.PI) / 3;
        const xOffset = Math.sin(rot) * radius;
        ctx.ellipse(centerX, centerY, Math.abs(xOffset), radius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      const pulseScale = 1 + Math.sin(Date.now() * 0.003) * 0.08;
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius * pulseScale, radius * pulseScale * 0.35, 0, 0, Math.PI * 2);
      ctx.stroke();

      const markerAngle = angle + 1.2;
      const markerX = centerX + Math.cos(markerAngle) * (radius * 0.7);
      const markerY = centerY + Math.sin(markerAngle) * (radius * 0.3);

      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(markerX, markerY, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(markerX, markerY, 11, 0, Math.PI * 2);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <canvas ref={canvasRef} width={340} height={320} style={{ display: 'block' }} />
      <div className="font-data-mono" style={{ fontSize: '11px', color: '#00B4D8', fontWeight: 800, marginTop: '8px', background: 'rgba(0, 180, 216, 0.15)', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(0, 180, 216, 0.4)' }}>
        3D SPHERICAL TELEMETRY — ACTIVE NODE: {selectedCity.toUpperCase()}
      </div>
    </div>
  );
}

function CityEpidemicPatientMap({
  city,
  onSelectHotspot,
  selectedHotspotId
}: {
  city: string;
  onSelectHotspot?: (hotspot: PatientHotspot) => void;
  selectedHotspotId?: string | null;
}) {
  const [mapFilter, setMapFilter] = useState<'ALL' | 'CRITICAL' | 'MODERATE'>('ALL');
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredSpot, setHoveredSpot] = useState<PatientHotspot | null>(null);
  const [selectedSpot, setSelectedSpot] = useState<PatientHotspot | null>(null);

  const mapConfig = getCityMapConfig(city);

  const filteredHotspots = mapConfig.hotspots.filter(spot => {
    if (mapFilter === 'CRITICAL') return spot.severity === 'CRITICAL';
    if (mapFilter === 'MODERATE') return spot.severity === 'MODERATE';
    return true;
  });

  const totalPatientsInCity = mapConfig.hotspots.reduce((a, b) => a + b.patientCount, 0);

  return (
    <div style={{ background: '#0B132B', border: '1px solid rgba(0, 180, 216, 0.35)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', color: '#FFFFFF', boxShadow: '0 12px 40px rgba(11, 19, 43, 0.35)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Map Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', zIndex: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00F2FE', boxShadow: '0 0 10px #00F2FE' }} />
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              {mapConfig.cityName.toUpperCase()} — LIVE PATIENT EPIDEMIC & OUTBREAK GIS MAP
            </span>
            <span className="font-data-mono" style={{ background: 'rgba(0, 242, 254, 0.15)', border: '1px solid rgba(0, 242, 254, 0.4)', color: '#00F2FE', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
              {mapConfig.state}
            </span>
          </div>
          <div className="font-data-mono" style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
            TOTAL MONITORED PATIENTS IN REGION: <strong style={{ color: '#F87171' }}>{totalPatientsInCity.toLocaleString()} Active Cases</strong> • {mapConfig.hotspots.length} ACTIVE SURVEILLANCE CLUSTERS
          </div>
        </div>

        {/* Action Filters & Heatmap Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.8)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            {(['ALL', 'CRITICAL', 'MODERATE'] as const).map(f => (
              <button
                key={f}
                onClick={() => setMapFilter(f)}
                style={{
                  background: mapFilter === f ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)' : 'transparent',
                  color: mapFilter === f ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {f === 'ALL' ? 'All Spots' : f === 'CRITICAL' ? 'Critical (Red)' : 'Moderate (Amber)'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            style={{
              background: showHeatmap ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${showHeatmap ? '#EF4444' : 'rgba(255, 255, 255, 0.2)'}`,
              color: showHeatmap ? '#FCA5A5' : '#CBD5E1',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Flame size={13} color={showHeatmap ? '#EF4444' : '#CBD5E1'} />
            <span>Heatmap Overlay: {showHeatmap ? 'ON' : 'OFF'}</span>
          </button>

          {/* Zoom Controls */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(15, 23, 42, 0.8)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <button
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 1.8))}
              style={{ background: 'transparent', border: 'none', color: '#FFF', padding: '4px 8px', cursor: 'pointer', fontSize: '13px', fontWeight: 800 }}
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.8))}
              style={{ background: 'transparent', border: 'none', color: '#FFF', padding: '4px 8px', cursor: 'pointer', fontSize: '13px', fontWeight: 800 }}
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              style={{ background: 'transparent', border: 'none', color: '#38BDF8', padding: '4px 6px', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}
              title="Reset Zoom"
            >
              100%
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Canvas Container */}
      <div style={{ position: 'relative', width: '100%', height: '440px', background: '#070D1E', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0, 180, 216, 0.25)', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)' }}>
        
        {/* Transform / Zoom viewport */}
        <div style={{ width: '100%', height: '100%', transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative' }}>
          
          {/* SVG Map Grid, Corridors & Boundary of the Selected City */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 180, 216, 0.08)" strokeWidth="1" />
              </pattern>
              <radialGradient id="heatCritical" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(239, 68, 68, 0.55)" />
                <stop offset="60%" stopColor="rgba(239, 68, 68, 0.2)" />
                <stop offset="100%" stopColor="rgba(239, 68, 68, 0)" />
              </radialGradient>
              <radialGradient id="heatModerate" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(245, 158, 11, 0.45)" />
                <stop offset="60%" stopColor="rgba(245, 158, 11, 0.15)" />
                <stop offset="100%" stopColor="rgba(245, 158, 11, 0)" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* City Boundary Polygon Highlight */}
            <polygon
              points="80,50 220,30 460,40 680,60 840,120 920,260 880,380 720,420 480,440 260,410 100,340 50,180"
              fill="rgba(0, 180, 216, 0.04)"
              stroke="rgba(0, 242, 254, 0.35)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Major Arterial Highway Lines */}
            <path d="M 40,240 Q 300,200 600,260 T 960,220" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="4" />
            <path d="M 280,30 Q 380,240 460,440" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="3" />
            <path d="M 680,40 Q 640,220 740,430" fill="none" stroke="rgba(56, 189, 248, 0.25)" strokeWidth="3" />
            
            {/* Water Basin / River line if present */}
            {mapConfig.riverName && (
              <path d="M 120,40 Q 340,160 520,120 T 900,340" fill="none" stroke="rgba(6, 182, 212, 0.45)" strokeWidth="8" strokeLinecap="round" />
            )}

            {/* Heatmap density circles around hotspots */}
            {showHeatmap && filteredHotspots.map(spot => (
              <circle
                key={`heat-${spot.id}`}
                cx={`${spot.x}%`}
                cy={`${spot.y}%`}
                r={spot.severity === 'CRITICAL' ? "85" : "60"}
                fill={spot.severity === 'CRITICAL' ? "url(#heatCritical)" : "url(#heatModerate)"}
              />
            ))}
          </svg>

          {/* Landmarks / Hospital Hub Badges */}
          {mapConfig.landmarks.map((lm, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${lm.x}%`,
                top: `${lm.y}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(15, 23, 42, 0.85)',
                padding: '3px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                color: '#38BDF8',
                fontSize: '10px',
                fontWeight: 700,
                pointerEvents: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                zIndex: 5
              }}
            >
              <Building2 size={11} color="#38BDF8" />
              <span>{lm.name}</span>
            </div>
          ))}

          {/* Patient Hotspots Pins / Spots */}
          {filteredHotspots.map(spot => {
            const isCritical = spot.severity === 'CRITICAL';
            const isSelected = selectedSpot?.id === spot.id || selectedHotspotId === spot.id;

            return (
              <div
                key={spot.id}
                onClick={() => {
                  setSelectedSpot(spot);
                  if (onSelectHotspot) onSelectHotspot(spot);
                }}
                onMouseEnter={() => setHoveredSpot(spot)}
                onMouseLeave={() => setHoveredSpot(null)}
                style={{
                  position: 'absolute',
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 30 : 20
                }}
              >
                {/* Outer animated radar pulsing wave */}
                <div
                  style={{
                    position: 'absolute',
                    inset: -14,
                    borderRadius: '50%',
                    background: isCritical ? 'rgba(239, 68, 68, 0.35)' : 'rgba(245, 158, 11, 0.3)',
                    animation: 'map-pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                    pointerEvents: 'none'
                  }}
                />

                {/* Spot Pin Button */}
                <div
                  style={{
                    background: isCritical ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' : 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                    width: isSelected ? '42px' : '36px',
                    height: isSelected ? '42px' : '36px',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 900,
                    boxShadow: isCritical ? '0 0 18px rgba(239, 68, 68, 0.8), 0 4px 10px rgba(0,0,0,0.5)' : '0 0 14px rgba(245, 158, 11, 0.8), 0 4px 10px rgba(0,0,0,0.5)',
                    border: isSelected ? '3px solid #FFFFFF' : '2px solid rgba(255, 255, 255, 0.85)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                  }}
                  title={`${spot.name} - ${spot.patientCount} Patients`}
                >
                  <span style={{ fontSize: '11px', lineHeight: 1 }}>{spot.patientCount}</span>
                  <span style={{ fontSize: '7px', textTransform: 'uppercase', opacity: 0.9 }}>PTS</span>
                </div>

                {/* Pin Name Label Tag */}
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '4px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${isCritical ? '#EF4444' : '#F59E0B'}`,
                    whiteSpace: 'nowrap',
                    fontSize: '9.5px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    pointerEvents: 'none',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                  }}
                >
                  {spot.name.split('(')[0]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Hover / Selected Spot Live Telemetry Inspector Overlay */}
        {(selectedSpot || hoveredSpot) && (() => {
          const s = selectedSpot || hoveredSpot!;
          const isCritical = s.severity === 'CRITICAL';

          return (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                width: '320px',
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: `1.5px solid ${isCritical ? '#EF4444' : '#F59E0B'}`,
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                zIndex: 40,
                color: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="font-data-mono" style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>
                    PIN: {s.pincode} • {city.toUpperCase()}
                  </span>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>{s.name}</div>
                </div>
                <span style={{ background: isCritical ? '#EF4444' : '#F59E0B', color: '#FFF', padding: '2px 8px', borderRadius: '10px', fontSize: '9.5px', fontWeight: 800 }}>
                  {s.severity}
                </span>
              </div>

              <div style={{ margin: '10px 0', padding: '8px 10px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>Active Patients</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: isCritical ? '#F87171' : '#FBBF24' }}>
                    {s.patientCount} Confirmed
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>Pathogen / Variant</div>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#38BDF8' }}>{s.disease}</div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '6px' }}>
                <strong>Assigned Hospital:</strong> {s.hospitalNearby} ({s.isolationBeds} Isolation Beds)
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', background: 'rgba(0, 180, 216, 0.1)', padding: '6px 8px', borderRadius: '6px', border: '1px solid rgba(0, 180, 216, 0.3)' }}>
                <strong>Status:</strong> {s.quarantineStatus}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Map Legend Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11px', color: '#94A3B8', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
            <span>Critical Patient Clusters (&gt;400 Pts)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
            <span>Moderate Patient Zones (&lt;400 Pts)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Building2 size={12} color="#38BDF8" />
            <span>Hospital Triage Node</span>
          </div>
        </div>

        <span className="font-data-mono" style={{ color: '#38BDF8', fontWeight: 700 }}>
          CLICK ANY SPOT PIN TO INSPECT CLUSTER TRIAGE DOSSIER
        </span>
      </div>
    </div>
  );
}

function CityHealthcareGisMap({
  city,
  facilities,
  activeFacility,
  onSelectFacility,
  activeLayer = 'ALL',
  onChangeLayer
}: {
  city: string;
  facilities: MedicalFacility[];
  activeFacility: MedicalFacility;
  onSelectFacility: (facility: MedicalFacility) => void;
  activeLayer?: 'ALL' | 'TRAUMA' | 'ICU_HEATMAP' | 'DIAGNOSTIC';
  onChangeLayer?: (layer: 'ALL' | 'TRAUMA' | 'ICU_HEATMAP' | 'DIAGNOSTIC') => void;
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredFacility, setHoveredFacility] = useState<MedicalFacility | null>(null);

  const mapConfig = getCityMapConfig(city);

  const displayedFacilities = facilities.filter(fac => {
    if (activeLayer === 'TRAUMA') return fac.type === 'HOSPITAL' && fac.open24x7;
    if (activeLayer === 'ICU_HEATMAP') return fac.icuBedsAvailable > 0;
    if (activeLayer === 'DIAGNOSTIC') return fac.type === 'TESTING_LAB';
    return true;
  });

  const totalIcuBedsInCity = facilities.reduce((a, b) => a + b.icuBedsAvailable, 0);

  return (
    <div style={{ background: '#050B1A', border: '1px solid rgba(0, 242, 254, 0.3)', borderRadius: '18px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', color: '#FFFFFF', boxShadow: '0 16px 48px rgba(0, 0, 0, 0.6)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Top Map HUD Command Deck */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', zIndex: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00F2FE', boxShadow: '0 0 12px #00F2FE' }} />
            <span style={{ fontSize: '15.5px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              {city.toUpperCase()} HIGH-PRECISION CLINICAL GIS RADAR
            </span>
            <span className="font-data-mono" style={{ background: 'rgba(0, 242, 254, 0.15)', border: '1px solid rgba(0, 242, 254, 0.4)', color: '#00F2FE', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800 }}>
              {displayedFacilities.length} NODES PINNED • {totalIcuBedsInCity} ICU BEDS ACTIVE
            </span>
          </div>
          <div className="font-data-mono" style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
            GPS MESH COORDINATES • LIVE TRAUMA BAY AUTO-SYNC FREQUENCY: 1.2s
          </div>
        </div>

        {/* Layer Filters & Zoom Control Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Layer Selector */}
          <div style={{ display: 'flex', background: 'rgba(15, 23, 42, 0.9)', padding: '3px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            {[
              { id: 'ALL', label: 'All Nodes' },
              { id: 'TRAUMA', label: '🚨 Level-1 Trauma' },
              { id: 'ICU_HEATMAP', label: '🛏️ ICU Heatmap' },
              { id: 'DIAGNOSTIC', label: '🔬 MRI Labs' }
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => onChangeLayer && onChangeLayer(layer.id as any)}
                style={{
                  background: activeLayer === layer.id ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)' : 'transparent',
                  color: activeLayer === layer.id ? '#FFFFFF' : '#94A3B8',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {layer.label}
              </button>
            ))}
          </div>

          {/* Zoom Buttons */}
          <div style={{ display: 'flex', gap: '3px', background: 'rgba(15, 23, 42, 0.9)', padding: '3px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
            <button
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.2, 1.8))}
              style={{ background: 'transparent', border: 'none', color: '#FFF', padding: '4px 8px', cursor: 'pointer', fontSize: '13px', fontWeight: 800 }}
              title="Zoom In"
            >
              +
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.2, 0.8))}
              style={{ background: 'transparent', border: 'none', color: '#FFF', padding: '4px 8px', cursor: 'pointer', fontSize: '13px', fontWeight: 800 }}
              title="Zoom Out"
            >
              -
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              style={{ background: 'transparent', border: 'none', color: '#38BDF8', padding: '4px 6px', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}
              title="Reset Zoom"
            >
              100%
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Container */}
      <div style={{ position: 'relative', width: '100%', height: '440px', background: '#020617', borderRadius: '14px', overflow: 'hidden', border: '1px solid rgba(0, 180, 216, 0.3)', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.85)' }}>
        <div style={{ width: '100%', height: '100%', transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)', position: 'relative' }}>
          
          {/* Vector City Geometry & Corridor Lines */}
          <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <pattern id="gisMesh" width="36" height="36" patternUnits="userSpaceOnUse">
                <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(0, 180, 216, 0.07)" strokeWidth="1" />
              </pattern>
              <radialGradient id="gisIcuGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 242, 254, 0.45)" />
                <stop offset="50%" stopColor="rgba(2, 132, 199, 0.2)" />
                <stop offset="100%" stopColor="rgba(2, 132, 199, 0)" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#gisMesh)" />

            {/* City Boundary Polygon */}
            <polygon
              points="80,50 220,30 460,40 680,60 840,120 920,260 880,380 720,420 480,440 260,410 100,340 50,180"
              fill="rgba(0, 180, 216, 0.05)"
              stroke="rgba(0, 242, 254, 0.4)"
              strokeWidth="2"
              strokeDasharray="6 4"
            />

            {/* Major Arterial Highway Corridors */}
            <path d="M 40,240 Q 300,200 600,260 T 960,220" fill="none" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="4" />
            <path d="M 280,30 Q 380,240 460,440" fill="none" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="3" />
            <path d="M 680,40 Q 640,220 740,430" fill="none" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="3" />
            
            {/* Water Basin / River line if present */}
            {mapConfig.riverName && (
              <path d="M 120,40 Q 340,160 520,120 T 900,340" fill="none" stroke="rgba(6, 182, 212, 0.45)" strokeWidth="8" strokeLinecap="round" />
            )}

            {/* Heatmap Overlay when layer is ICU_HEATMAP */}
            {activeLayer === 'ICU_HEATMAP' && displayedFacilities.map(fac => (
              <circle
                key={`icu-heat-${fac.id}`}
                cx={`${fac.pinX}%`}
                cy={`${fac.pinY}%`}
                r={fac.icuBedsAvailable > 20 ? "90" : "60"}
                fill="url(#gisIcuGlow)"
              />
            ))}

            {/* Active Facility Navigation Route Vector Line */}
            {activeFacility && (
              <>
                <line
                  x1="50%"
                  y1="50%"
                  x2={`${activeFacility.pinX}%`}
                  y2={`${activeFacility.pinY}%`}
                  stroke="#00F2FE"
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  opacity="0.85"
                />
                {/* User GPS Origin Pin */}
                <circle cx="50%" cy="50%" r="6" fill="#00F2FE" />
                <circle cx="50%" cy="50%" r="14" fill="none" stroke="#00F2FE" strokeWidth="1.5" opacity="0.6" />
              </>
            )}
          </svg>

          {/* Landmarks Badges */}
          {mapConfig.landmarks.map((lm, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                left: `${lm.x}%`,
                top: `${lm.y}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(15, 23, 42, 0.85)',
                padding: '2px 7px',
                borderRadius: '5px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#94A3B8',
                fontSize: '9.5px',
                fontWeight: 700,
                pointerEvents: 'none',
                zIndex: 5
              }}
            >
              <span>{lm.name}</span>
            </div>
          ))}

          {/* Interactive Healthcare Facility Pins */}
          {displayedFacilities.map(fac => {
            const isSelected = activeFacility?.id === fac.id;
            const isHospital = fac.type === 'HOSPITAL';
            const isLab = fac.type === 'TESTING_LAB';

            return (
              <div
                key={fac.id}
                onClick={() => onSelectFacility(fac)}
                onMouseEnter={() => setHoveredFacility(fac)}
                onMouseLeave={() => setHoveredFacility(null)}
                style={{
                  position: 'absolute',
                  left: `${fac.pinX}%`,
                  top: `${fac.pinY}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: isSelected ? 35 : 20,
                  transition: 'transform 0.2s'
                }}
              >
                {/* Active Pin Glowing Beacon Wave */}
                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: -16,
                      borderRadius: '50%',
                      background: 'rgba(0, 242, 254, 0.45)',
                      animation: 'map-pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                      pointerEvents: 'none'
                    }}
                  />
                )}

                {/* Facility Pin Capsule */}
                <div
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, #00F2FE 0%, #0284C7 100%)'
                      : isHospital
                      ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)'
                      : isLab
                      ? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)'
                      : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    padding: isSelected ? '7px 14px' : '5px 11px',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: isSelected
                      ? '0 0 24px rgba(0, 242, 254, 0.95), 0 4px 14px rgba(0,0,0,0.6)'
                      : '0 4px 12px rgba(0,0,0,0.5)',
                    border: isSelected ? '2px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.4)',
                    transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {isHospital ? <Building2 size={13} /> : isLab ? <Zap size={13} /> : <Stethoscope size={13} />}
                  <span style={{ fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                    {fac.name.split(' ')[0]} {fac.name.split(' ')[1] || ''}
                  </span>
                  {fac.icuBedsAvailable > 0 && (
                    <span className="font-data-mono" style={{ background: 'rgba(255, 255, 255, 0.25)', padding: '1px 5px', borderRadius: '8px', fontSize: '9px', fontWeight: 900 }}>
                      {fac.icuBedsAvailable} ICU
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected / Hovered Live Facility Telemetry Overlay */}
        {(activeFacility || hoveredFacility) && (() => {
          const f = hoveredFacility || activeFacility!;
          return (
            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                width: '320px',
                background: 'rgba(10, 15, 29, 0.96)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1.5px solid #00F2FE',
                borderRadius: '14px',
                padding: '16px',
                boxShadow: '0 16px 36px rgba(0,0,0,0.7)',
                zIndex: 40,
                color: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span className="font-data-mono" style={{ fontSize: '10px', color: '#00F2FE', fontWeight: 700 }}>
                    {f.type} • {f.distance} AWAY
                  </span>
                  <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>{f.name}</div>
                </div>
                <span style={{ background: 'rgba(0, 242, 254, 0.15)', color: '#00F2FE', border: '1px solid rgba(0, 242, 254, 0.4)', padding: '2px 8px', borderRadius: '10px', fontSize: '9.5px', fontWeight: 800 }}>
                  ⭐ {f.rating}
                </span>
              </div>

              <div style={{ margin: '10px 0', padding: '8px 10px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>ICU Beds Ready</div>
                  <div style={{ fontSize: '15px', fontWeight: 900, color: '#4ADE80' }}>
                    {f.icuBedsAvailable > 0 ? `${f.icuBedsAvailable} Ready` : 'N/A (Lab/OPD)'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>ER Wait Time</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#38BDF8' }}>{f.erWaitTime}</div>
                </div>
              </div>

              <div style={{ fontSize: '11px', color: '#CBD5E1', marginBottom: '8px' }}>
                📍 {f.address}
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`tel:${f.phone}`}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                    color: '#FFF',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px'
                  }}
                >
                  <PhoneCall size={12} /> Call Facility
                </a>
                <button
                  onClick={() => alert(`Route directions mapped to ${f.name}. Estimated travel time: 8-12 minutes.`)}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#FFF',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Get Route 🧭
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Map Legend Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', fontSize: '11px', color: '#94A3B8', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0284C7', display: 'inline-block' }} />
            <span>24/7 Super Speciality Hospital</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#8B5CF6', display: 'inline-block' }} />
            <span>Advanced MRI & Diagnostic Lab</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span>Specialist OPD Clinic</span>
          </div>
        </div>

        <span className="font-data-mono" style={{ color: '#00F2FE', fontWeight: 700 }}>
          CLICK ANY PIN TO ENGAGE GPS NAVIGATION & LIVE ICU ACCESS
        </span>
      </div>
    </div>
  );
}

// ==========================================
// EMERGENCY MANAGEMENT SYSTEM TYPES & DATA
// ==========================================

interface AmbulanceUnit {
  id: string;
  vehicleNo: string;
  type: 'ACLS (Advanced Cardiac Life Support)' | 'BLS (Basic Life Support)' | 'NICU (Neonatal Critical Care)' | 'CCU (Coronary Care)';
  sector: string;
  status: 'AVAILABLE_STANDBY' | 'EN_ROUTE_INCIDENT' | 'PATIENT_ONBOARD' | 'RETURNING_BASE';
  paramedicLead: string;
  phone: string;
  locationName: string;
  pinX: number;
  pinY: number;
  speed: string;
  eta: string;
  oxygenTankPsi: number;
  ventilatorModel: string;
  aedReady: boolean;
  assignedHospital: string;
}

const mockAmbulanceFleet: AmbulanceUnit[] = [
  {
    id: 'AMB-101',
    vehicleNo: 'DL-01-EM-1081',
    type: 'ACLS (Advanced Cardiac Life Support)',
    sector: 'Sector 1 - Central Delhi / AIIMS Corridor',
    status: 'AVAILABLE_STANDBY',
    paramedicLead: 'Capt. Vikram Singh (ACLS Lead)',
    phone: '+91 98110 44921',
    locationName: 'AIIMS Trauma Center Station',
    pinX: 48,
    pinY: 42,
    speed: '0 km/h (Standby)',
    eta: 'Immediate (0 min)',
    oxygenTankPsi: 2000,
    ventilatorModel: 'Hamilton T1 Transport Ventilator',
    aedReady: true,
    assignedHospital: 'AIIMS Apex Trauma Center'
  },
  {
    id: 'AMB-102',
    vehicleNo: 'DL-02-EM-2044',
    type: 'ACLS (Advanced Cardiac Life Support)',
    sector: 'Sector 2 - North Trauma Ring (ISBT / Civil Lines)',
    status: 'EN_ROUTE_INCIDENT',
    paramedicLead: 'Lt. Pooja Sharma (Critical Care RN)',
    phone: '+91 98720 11942',
    locationName: 'Outer Ring Road, North Corridor',
    pinX: 35,
    pinY: 28,
    speed: '68 km/h',
    eta: '4.2 mins to Incident',
    oxygenTankPsi: 1950,
    ventilatorModel: 'Dräger Oxylog 3000 Plus',
    aedReady: true,
    assignedHospital: 'Safdarjung Super Speciality'
  },
  {
    id: 'AMB-103',
    vehicleNo: 'DL-03-EM-3829',
    type: 'NICU (Neonatal Critical Care)',
    sector: 'Sector 3 - Airport Express & Dwarka',
    status: 'PATIENT_ONBOARD',
    paramedicLead: 'Dr. Arun Nambiar (Pediatric Intensivist)',
    phone: '+91 99230 88214',
    locationName: 'Terminal 3 Access Tunnel',
    pinX: 22,
    pinY: 62,
    speed: '74 km/h',
    eta: '6.8 mins to ER Bay',
    oxygenTankPsi: 1850,
    ventilatorModel: 'Babylog VN500 Mobile',
    aedReady: true,
    assignedHospital: 'Max Super Speciality Hospital'
  },
  {
    id: 'AMB-104',
    vehicleNo: 'DL-04-EM-4912',
    type: 'CCU (Coronary Care)',
    sector: 'Sector 4 - South Industrial & Noida Expressway',
    status: 'AVAILABLE_STANDBY',
    paramedicLead: 'Paramedic Rahul Verma',
    phone: '+91 98114 77291',
    locationName: 'Okhla Phase-3 Fast-Bay',
    pinX: 72,
    pinY: 68,
    speed: '0 km/h (Standby)',
    eta: 'Immediate (0 min)',
    oxygenTankPsi: 2100,
    ventilatorModel: 'Zoll Z-Vent Tactical',
    aedReady: true,
    assignedHospital: 'Apollo Indraprastha Hospital'
  },
  {
    id: 'AMB-105',
    vehicleNo: 'DL-05-EM-5120',
    type: 'ACLS (Advanced Cardiac Life Support)',
    sector: 'Sector 1 - Central Delhi / AIIMS Corridor',
    status: 'RETURNING_BASE',
    paramedicLead: 'Paramedic S. Mukherjee',
    phone: '+91 98450 33819',
    locationName: 'Connaught Place Outer Circle',
    pinX: 52,
    pinY: 34,
    speed: '42 km/h',
    eta: 'Base in 8 mins',
    oxygenTankPsi: 1600,
    ventilatorModel: 'Hamilton T1 Transport Ventilator',
    aedReady: true,
    assignedHospital: 'AIIMS Apex Trauma Center'
  },
  {
    id: 'AMB-106',
    vehicleNo: 'DL-06-EM-6671',
    type: 'BLS (Basic Life Support)',
    sector: 'Sector 2 - North Trauma Ring (ISBT / Civil Lines)',
    status: 'AVAILABLE_STANDBY',
    paramedicLead: 'EMT Farooq Ahmed',
    phone: '+91 99100 22841',
    locationName: 'Kashmere Gate Emergency Station',
    pinX: 62,
    pinY: 22,
    speed: '0 km/h (Standby)',
    eta: 'Immediate (0 min)',
    oxygenTankPsi: 1900,
    ventilatorModel: 'Portable BVM Resuscitator',
    aedReady: true,
    assignedHospital: 'Safdarjung Super Speciality'
  }
];

interface VentilatorBay {
  id: string;
  hospitalName: string;
  sector: string;
  department: string;
  totalBeds: number;
  vacantBeds: number;
  invasiveVentilators: { total: number; vacant: number; models: string };
  nonInvasiveBipap: { total: number; vacant: number };
  ecmoUnits: { total: number; vacant: number };
  dutyIntensivist: string;
  phone: string;
}

const mockVentilatorBays: VentilatorBay[] = [
  {
    id: 'VB-01',
    hospitalName: 'AIIMS Apex Trauma Center',
    sector: 'Sector 1 - Central Corridor',
    department: 'Level-1 Surgical Trauma ICU',
    totalBeds: 40,
    vacantBeds: 12,
    invasiveVentilators: { total: 32, vacant: 9, models: 'Hamilton C6 & Dräger Evita V800' },
    nonInvasiveBipap: { total: 16, vacant: 6 },
    ecmoUnits: { total: 4, vacant: 2 },
    dutyIntensivist: 'Dr. Arvind Mehra (Director, Critical Care)',
    phone: '+91 11 2658 8500'
  },
  {
    id: 'VB-02',
    hospitalName: 'Safdarjung Super Speciality Hospital',
    sector: 'Sector 1 - Central Corridor',
    department: 'Emergency Resuscitation & Medical ICU',
    totalBeds: 35,
    vacantBeds: 8,
    invasiveVentilators: { total: 28, vacant: 7, models: 'Maquet Servo-u' },
    nonInvasiveBipap: { total: 12, vacant: 4 },
    ecmoUnits: { total: 2, vacant: 1 },
    dutyIntensivist: 'Dr. Shalini Roy (Lead Intensivist)',
    phone: '+91 11 2616 5060'
  },
  {
    id: 'VB-03',
    hospitalName: 'Max Super Speciality Hospital, Saket',
    sector: 'Sector 3 - South Corridor',
    department: 'Cardiothoracic CCU & Neuro ICU',
    totalBeds: 30,
    vacantBeds: 11,
    invasiveVentilators: { total: 24, vacant: 8, models: 'Hamilton G5 & Puritan Bennett 980' },
    nonInvasiveBipap: { total: 10, vacant: 5 },
    ecmoUnits: { total: 3, vacant: 2 },
    dutyIntensivist: 'Dr. Rajesh K. Nair (Cardiac Critical Care)',
    phone: '+91 11 2651 5050'
  },
  {
    id: 'VB-04',
    hospitalName: 'Fortis Memorial Research Institute',
    sector: 'Sector 4 - Expressway Corridor',
    department: 'Pediatric & Neonatal Intensive Care (PICU/NICU)',
    totalBeds: 25,
    vacantBeds: 9,
    invasiveVentilators: { total: 20, vacant: 7, models: 'Dräger Babylog VN500 High-Frequency' },
    nonInvasiveBipap: { total: 8, vacant: 4 },
    ecmoUnits: { total: 2, vacant: 1 },
    dutyIntensivist: 'Dr. Neha Kapoor (Pediatric Intensivist)',
    phone: '+91 124 496 2200'
  },
  {
    id: 'VB-05',
    hospitalName: 'Apollo Indraprastha Hospital',
    sector: 'Sector 4 - South Industrial',
    department: 'Organ Transplant & Polytrauma ICU',
    totalBeds: 32,
    vacantBeds: 14,
    invasiveVentilators: { total: 26, vacant: 11, models: 'GE Healthcare CARESCAPE R860' },
    nonInvasiveBipap: { total: 14, vacant: 8 },
    ecmoUnits: { total: 4, vacant: 3 },
    dutyIntensivist: 'Dr. Suresh V. Rao (Chief Critical Care)',
    phone: '+91 11 2692 5858'
  }
];

interface OxygenReserveNode {
  id: string;
  facilityName: string;
  sector: string;
  lmoTankCapacityKL: number;
  lmoCurrentStockKL: number;
  lmoPressureBar: number;
  dailyBurnRateKL: number;
  autonomyHoursRemaining: number;
  typeDCylinders: { total: number; full: number; empty: number };
  typeBCylinders: { total: number; full: number; empty: number };
  lastRefillDate: string;
  supplierHub: string;
}

const mockOxygenNodes: OxygenReserveNode[] = [
  {
    id: 'O2-01',
    facilityName: 'AIIMS Main Cryogenic O2 Complex',
    sector: 'Sector 1 - Central Delhi',
    lmoTankCapacityKL: 30,
    lmoCurrentStockKL: 28.4,
    lmoPressureBar: 16.2,
    dailyBurnRateKL: 3.8,
    autonomyHoursRemaining: 179,
    typeDCylinders: { total: 350, full: 310, empty: 40 },
    typeBCylinders: { total: 120, full: 110, empty: 10 },
    lastRefillDate: 'Yesterday 04:30 AM (Nominal)',
    supplierHub: 'Linde Cryogenics Delhi Grid'
  },
  {
    id: 'O2-02',
    facilityName: 'Safdarjung Liquid Oxygen Plant',
    sector: 'Sector 1 - Central Delhi',
    lmoTankCapacityKL: 20,
    lmoCurrentStockKL: 18.2,
    lmoPressureBar: 15.8,
    dailyBurnRateKL: 2.9,
    autonomyHoursRemaining: 150,
    typeDCylinders: { total: 240, full: 215, empty: 25 },
    typeBCylinders: { total: 80, full: 74, empty: 6 },
    lastRefillDate: 'Today 06:15 AM (Nominal)',
    supplierHub: 'Inox Air Products Plant 2'
  },
  {
    id: 'O2-03',
    facilityName: 'Max Super Speciality Cryo Depot',
    sector: 'Sector 3 - South Corridor',
    lmoTankCapacityKL: 15,
    lmoCurrentStockKL: 14.1,
    lmoPressureBar: 16.0,
    dailyBurnRateKL: 2.1,
    autonomyHoursRemaining: 161,
    typeDCylinders: { total: 180, full: 165, empty: 15 },
    typeBCylinders: { total: 60, full: 55, empty: 5 },
    lastRefillDate: 'Yesterday 11:00 PM (Nominal)',
    supplierHub: 'Air Liquide Industrial Hub'
  },
  {
    id: 'O2-04',
    facilityName: 'Apollo Indraprastha Cryogenic Bank',
    sector: 'Sector 4 - Expressway',
    lmoTankCapacityKL: 25,
    lmoCurrentStockKL: 23.5,
    lmoPressureBar: 16.4,
    dailyBurnRateKL: 3.2,
    autonomyHoursRemaining: 176,
    typeDCylinders: { total: 280, full: 260, empty: 20 },
    typeBCylinders: { total: 95, full: 88, empty: 7 },
    lastRefillDate: 'Today 02:00 AM (Nominal)',
    supplierHub: 'Linde Cryogenics Delhi Grid'
  }
];

interface BloodBankReserve {
  group: string;
  prbcUnits: number;
  ffpUnits: number;
  plateletsUnits: number;
  status: 'CRITICAL_LOW' | 'OPTIMAL' | 'SURPLUS';
}

const mockBloodBank: BloodBankReserve[] = [
  { group: 'O Negative (Universal Donor)', prbcUnits: 38, ffpUnits: 24, plateletsUnits: 18, status: 'CRITICAL_LOW' },
  { group: 'O Positive', prbcUnits: 142, ffpUnits: 88, plateletsUnits: 45, status: 'SURPLUS' },
  { group: 'A Negative', prbcUnits: 29, ffpUnits: 16, plateletsUnits: 12, status: 'CRITICAL_LOW' },
  { group: 'A Positive', prbcUnits: 118, ffpUnits: 64, plateletsUnits: 38, status: 'OPTIMAL' },
  { group: 'B Negative', prbcUnits: 22, ffpUnits: 14, plateletsUnits: 10, status: 'CRITICAL_LOW' },
  { group: 'B Positive', prbcUnits: 164, ffpUnits: 92, plateletsUnits: 52, status: 'SURPLUS' },
  { group: 'AB Negative', prbcUnits: 19, ffpUnits: 12, plateletsUnits: 8, status: 'CRITICAL_LOW' },
  { group: 'AB Positive (Universal Recipient)', prbcUnits: 84, ffpUnits: 48, plateletsUnits: 30, status: 'OPTIMAL' }
];

// ==========================================
// EMERGENCY MANAGEMENT SYSTEM PORTAL COMPONENT
// ==========================================

function EmergencyManagementPortal() {
  const [activeTab, setActiveTab] = useState<'FLEET' | 'TRIAGE' | 'VENTILATORS' | 'OXYGEN' | 'BLOOD'>('FLEET');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [selectedAmbulance, setSelectedAmbulance] = useState<AmbulanceUnit>(mockAmbulanceFleet[0]);
  
  // Triage Checklist State
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    airway: true,
    hypoxemia: true,
    shock: false,
    arrhythmia: false,
    alteredGcs: false,
    polytrauma: true,
    hemorrhage: false,
    stemi: false
  });
  const [patientAge, setPatientAge] = useState<string>('42');
  const [patientGender, setPatientGender] = useState<string>('Male');
  const [incidentLoc, setIncidentLoc] = useState<string>('Ring Road Exit 4, North Corridor');
  const [triageGeneratedModal, setTriageGeneratedModal] = useState<any | null>(null);

  // Modals
  const [showIncidentDispatchModal, setShowIncidentDispatchModal] = useState(false);
  const [incidentType, setIncidentType] = useState('Multi-Vehicle Highway Collision');
  const [incidentVictims, setIncidentVictims] = useState('3 Critical');
  const [dispatchSuccess, setDispatchSuccess] = useState<any | null>(null);

  const [reserveVentModal, setReserveVentModal] = useState<VentilatorBay | null>(null);
  const [reserveVentSuccess, setReserveVentSuccess] = useState<any | null>(null);

  const [showO2RefillModal, setShowO2RefillModal] = useState<OxygenReserveNode | null>(null);
  const [o2RefillSuccess, setO2RefillSuccess] = useState<string | null>(null);

  const [broadcastBloodModal, setBroadcastBloodModal] = useState<BloodBankReserve | null>(null);
  const [broadcastSuccess, setBroadcastSuccess] = useState<string | null>(null);

  // Filtered Ambulances
  const filteredAmbulances = mockAmbulanceFleet.filter(amb => {
    if (selectedSector === 'ALL') return true;
    return amb.sector.includes(selectedSector);
  });

  // Calculate Triage Score
  const calculateTriageLevel = () => {
    let score = 0;
    if (checklist.airway) score += 3;
    if (checklist.hypoxemia) score += 3;
    if (checklist.shock) score += 3;
    if (checklist.arrhythmia) score += 2;
    if (checklist.alteredGcs) score += 3;
    if (checklist.polytrauma) score += 3;
    if (checklist.hemorrhage) score += 2;
    if (checklist.stemi) score += 2;

    if (score >= 6) {
      return { level: 'PRIORITY 1: RED (Resuscitation)', color: '#EF4444', desc: 'Immediate trauma bay resuscitation required (< 0 min). Direct transfer to OT.' };
    } else if (score >= 4) {
      return { level: 'PRIORITY 2: ORANGE (Emergent)', color: '#F97316', desc: 'Emergency intervention required within 10 minutes. Pre-alert ICU team.' };
    } else if (score >= 2) {
      return { level: 'PRIORITY 3: YELLOW (Urgent)', color: '#FBBF24', desc: 'Urgent evaluation within 30 minutes. Stable airway and vitals.' };
    } else {
      return { level: 'PRIORITY 4: GREEN (Non-Urgent)', color: '#10B981', desc: 'Standard triage protocol. Direct to minor OT / OPD evaluation.' };
    }
  };

  const currentTriage = calculateTriageLevel();

  // Summary Metrics
  const totalFleet = mockAmbulanceFleet.length;
  const availableAmbulances = mockAmbulanceFleet.filter(a => a.status === 'AVAILABLE_STANDBY').length;
  const dispatchedAmbulances = mockAmbulanceFleet.filter(a => a.status === 'EN_ROUTE_INCIDENT' || a.status === 'PATIENT_ONBOARD').length;
  const totalVacantVents = mockVentilatorBays.reduce((acc, curr) => acc + curr.invasiveVentilators.vacant, 0);
  const totalO2Stock = mockOxygenNodes.reduce((acc, curr) => acc + curr.lmoCurrentStockKL, 0);

  return (
    <div style={{ padding: '28px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', background: '#F8FAFC' }}>
      
      {/* 1. TOP EMERGENCY COMMAND BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, #070D1E 0%, #111E38 100%)',
        border: '1.5px solid rgba(239, 68, 68, 0.4)',
        borderRadius: '18px',
        padding: '20px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '18px',
        boxShadow: '0 16px 40px rgba(239, 68, 68, 0.25)',
        color: '#FFFFFF'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(239, 68, 68, 0.7)' }}>
            <Ambulance size={26} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '0.02em', color: '#FFFFFF' }}>
                EMERGENCY MANAGEMENT & DISPATCH OS
              </span>
              <span className="font-data-mono" style={{ background: 'rgba(239, 68, 68, 0.25)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800 }}>
                TRAUMA GRID ACTIVE
              </span>
            </div>
            <div className="font-data-mono" style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>
              LIVE AREA-BY-AREA AMBULANCE GPS • VACANT VENTILATORS • CRYOGENIC OXYGEN & RARE BLOOD RESERVES
            </div>
          </div>
        </div>

        {/* Action Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '6px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>ACTIVE FLEET</div>
            <div className="font-data-mono" style={{ fontSize: '14px', fontWeight: 900, color: '#38BDF8' }}>
              {dispatchedAmbulances} Dispatched / {availableAmbulances} Standby
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '10px', padding: '6px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>VACANT VENTILATORS</div>
            <div className="font-data-mono" style={{ fontSize: '14px', fontWeight: 900, color: '#4ADE80' }}>
              {totalVacantVents} Bays Ready
            </div>
          </div>

          <button
            onClick={() => setShowIncidentDispatchModal(true)}
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              border: '1.5px solid #FCA5A5',
              padding: '11px 22px',
              borderRadius: '10px',
              fontSize: '12.5px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 24px rgba(239, 68, 68, 0.6)',
              letterSpacing: '0.03em'
            }}
          >
            <ShieldAlert size={16} />
            <span>REPORT MASS CASUALTY / SOS</span>
          </button>
        </div>
      </div>

      {/* 2. NAVIGATION TABS */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid #E2E8F0', paddingBottom: '12px', overflowX: 'auto' }}>
        {[
          { id: 'FLEET', label: '🚑 Area Ambulance Fleet & Live GPS Radar', icon: Navigation, count: `${availableAmbulances} Standby` },
          { id: 'TRIAGE', label: '📋 Pre-Hospital Triage Checklist', icon: CheckCircle2, count: 'Interactive Protocol' },
          { id: 'VENTILATORS', label: '🫁 Vacant Ventilators & ICU Bays', icon: Activity, count: `${totalVacantVents} Ready` },
          { id: 'OXYGEN', label: '💨 Oxygen Tanks & Cylinder Bank', icon: Layers, count: `${totalO2Stock.toFixed(1)} kL LMO` },
          { id: 'BLOOD', label: '🩸 Rare Group Blood Bank Reserves', icon: Droplets, count: '8 Groups Live' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              background: activeTab === tab.id ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)' : '#FFFFFF',
              color: activeTab === tab.id ? '#FFFFFF' : '#475569',
              border: activeTab === tab.id ? '1px solid #0077B6' : '1px solid #E2E8F0',
              padding: '10px 18px',
              borderRadius: '12px',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: activeTab === tab.id ? '0 4px 14px rgba(0, 180, 216, 0.35)' : '0 2px 6px rgba(0,0,0,0.03)',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            <span>{tab.label}</span>
            <span className="font-data-mono" style={{ background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9', color: activeTab === tab.id ? '#FFF' : '#0077B6', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 800 }}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENT SECTIONS */}

      {/* TAB 1: AMBULANCE FLEET & LIVE GPS RADAR */}
      {activeTab === 'FLEET' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Sector Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: '#FFFFFF', padding: '14px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={15} color="#0077B6" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>FILTER BY CORRIDOR SECTOR:</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'All Sectors (42 Fleet)' },
                { id: 'Sector 1', label: 'Sector 1: Central Delhi Corridor' },
                { id: 'Sector 2', label: 'Sector 2: North Trauma Ring' },
                { id: 'Sector 3', label: 'Sector 3: Airport Expressway' },
                { id: 'Sector 4', label: 'Sector 4: South Industrial Corridor' }
              ].map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSector(sec.id)}
                  style={{
                    background: selectedSector === sec.id ? '#0F172A' : '#F8FAFC',
                    color: selectedSector === sec.id ? '#38BDF8' : '#64748B',
                    border: selectedSector === sec.id ? '1px solid #0F172A' : '1px solid #CBD5E1',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {sec.label}
                </button>
              ))}
            </div>
          </div>

          {/* Split Radar Canvas & Ambulance Telemetry Cockpit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', alignItems: 'start' }}>
            
            {/* Left: Interactive GPS Ambulance Radar Map */}
            <div style={{ background: '#050B1A', border: '1px solid rgba(0, 242, 254, 0.3)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', color: '#FFFFFF', boxShadow: '0 12px 36px rgba(0,0,0,0.5)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', animation: 'map-pulse 2s infinite' }} />
                  <span style={{ fontSize: '15px', fontWeight: 900 }}>METRO AREA GPS AMBULANCE RADAR</span>
                </div>
                <span className="font-data-mono" style={{ fontSize: '11px', color: '#00F2FE' }}>
                  REFRESH RATE: 800ms • ENCRYPTED TELEMETRY
                </span>
              </div>

              {/* Radar Canvas */}
              <div style={{ position: 'relative', width: '100%', height: '380px', background: '#020617', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0, 180, 216, 0.25)' }}>
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                  <defs>
                    <pattern id="ambGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0, 242, 254, 0.08)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#ambGrid)" />

                  {/* Corridor Roads */}
                  <path d="M 20,200 Q 300,160 600,220 T 900,180" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="5" />
                  <path d="M 240,20 Q 340,200 420,380" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="4" />
                  <path d="M 640,30 Q 580,200 700,370" fill="none" stroke="rgba(56, 189, 248, 0.3)" strokeWidth="4" />

                  {/* Sector Boundary lines */}
                  <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="4 4" />
                  <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="4 4" />
                </svg>

                {/* Sector Labels */}
                <div style={{ position: 'absolute', top: '10px', left: '12px', fontSize: '9.5px', color: '#94A3B8', fontWeight: 800 }}>SECTOR 2 (NORTH)</div>
                <div style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '9.5px', color: '#94A3B8', fontWeight: 800 }}>SECTOR 1 (CENTRAL)</div>
                <div style={{ position: 'absolute', bottom: '10px', left: '12px', fontSize: '9.5px', color: '#94A3B8', fontWeight: 800 }}>SECTOR 3 (AIRPORT)</div>
                <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontSize: '9.5px', color: '#94A3B8', fontWeight: 800 }}>SECTOR 4 (SOUTH)</div>

                {/* Ambulance Unit Map Pins */}
                {filteredAmbulances.map(amb => {
                  const isSelected = selectedAmbulance.id === amb.id;
                  const isDispatched = amb.status === 'EN_ROUTE_INCIDENT' || amb.status === 'PATIENT_ONBOARD';

                  return (
                    <div
                      key={amb.id}
                      onClick={() => setSelectedAmbulance(amb)}
                      style={{
                        position: 'absolute',
                        left: `${amb.pinX}%`,
                        top: `${amb.pinY}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: isSelected ? 30 : 15,
                        transition: 'transform 0.2s'
                      }}
                    >
                      {/* Active Beacon Pulse */}
                      {isDispatched && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: -12,
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.4)',
                            animation: 'map-pulse 1.8s infinite',
                            pointerEvents: 'none'
                          }}
                        />
                      )}

                      <div
                        style={{
                          background: isSelected
                            ? '#EF4444'
                            : amb.status === 'AVAILABLE_STANDBY'
                            ? '#0284C7'
                            : amb.status === 'PATIENT_ONBOARD'
                            ? '#D97706'
                            : '#DC2626',
                          color: '#FFFFFF',
                          padding: isSelected ? '6px 12px' : '4px 8px',
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          boxShadow: isSelected ? '0 0 20px #EF4444' : '0 2px 8px rgba(0,0,0,0.5)',
                          border: isSelected ? '2px solid #FFFFFF' : '1px solid rgba(255, 255, 255, 0.4)',
                          transform: isSelected ? 'scale(1.15)' : 'scale(1)'
                        }}
                      >
                        <Ambulance size={12} />
                        <span style={{ fontSize: '10px', fontWeight: 900 }}>{amb.vehicleNo.split('-')[3] || amb.vehicleNo}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Map Footer Legend */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94A3B8', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '8px' }}>
                <div style={{ display: 'flex', gap: '14px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284C7', display: 'inline-block' }} /> Available
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} /> En Route
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#D97706', display: 'inline-block' }} /> Patient Onboard
                  </span>
                </div>
                <span className="font-data-mono" style={{ color: '#00F2FE' }}>CLICK PIN TO INSPECT TELEMETRY</span>
              </div>
            </div>

            {/* Right: Selected Ambulance Live Dossier Card */}
            {selectedAmbulance && (
              <div style={{ background: '#FFFFFF', border: '2px solid #0077B6', borderRadius: '16px', padding: '20px', boxShadow: '0 8px 24px rgba(0, 119, 182, 0.15)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span className="font-data-mono" style={{ fontSize: '11px', color: '#0077B6', fontWeight: 800 }}>
                      {selectedAmbulance.type}
                    </span>
                    <div style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>
                      {selectedAmbulance.vehicleNo}
                    </div>
                  </div>
                  <span style={{
                    background: selectedAmbulance.status === 'AVAILABLE_STANDBY' ? '#DCFCE7' : '#FEE2E2',
                    color: selectedAmbulance.status === 'AVAILABLE_STANDBY' ? '#166534' : '#991B1B',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    fontSize: '10.5px',
                    fontWeight: 800
                  }}>
                    {selectedAmbulance.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Location & Speed */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>Current Sector</div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>{selectedAmbulance.sector.split('-')[0]}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>Telemetry Speed / ETA</div>
                    <div style={{ fontSize: '12px', fontWeight: 900, color: '#0077B6' }}>{selectedAmbulance.speed} • {selectedAmbulance.eta}</div>
                  </div>
                </div>

                {/* Equipment & O2 Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Oxygen Cylinder Pressure:</span>
                    <strong className="font-data-mono" style={{ color: selectedAmbulance.oxygenTankPsi > 1800 ? '#16A34A' : '#D97706' }}>
                      {selectedAmbulance.oxygenTankPsi} PSI (Nominal)
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Portable Ventilator:</span>
                    <strong style={{ color: '#0F172A' }}>{selectedAmbulance.ventilatorModel}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>AED Defibrillator:</span>
                    <strong style={{ color: '#16A34A' }}>🟢 Ready & Calibrated</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748B' }}>Assigned Trauma Base:</span>
                    <strong style={{ color: '#0077B6' }}>{selectedAmbulance.assignedHospital}</strong>
                  </div>
                </div>

                {/* Paramedic Lead */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '10px', fontSize: '11.5px' }}>
                  <div>
                    <div style={{ color: '#64748B' }}>Lead Paramedic Officer:</div>
                    <div style={{ fontWeight: 800, color: '#0F172A' }}>{selectedAmbulance.paramedicLead}</div>
                  </div>
                  <a
                    href={`tel:${selectedAmbulance.phone}`}
                    style={{
                      background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                      color: '#FFF',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <PhoneCall size={12} /> Call Unit
                  </a>
                </div>

                {/* Quick Action Button */}
                <button
                  onClick={() => alert(`Direct dispatch order transmitted to Unit ${selectedAmbulance.vehicleNo}. Sirens engaged.`)}
                  style={{
                    background: '#0F172A',
                    color: '#38BDF8',
                    border: 'none',
                    padding: '10px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Send size={13} />
                  <span>Transmit Priority Mission Dispatch</span>
                </button>
              </div>
            )}
          </div>

          {/* Area Ambulance Fleet List Table */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
              ALL DEPLOYED EMERGENCY AMBULANCE UNITS ACROSS SECTORS
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#64748B', fontWeight: 800 }}>
                    <th style={{ padding: '10px 12px' }}>VEHICLE ID</th>
                    <th style={{ padding: '10px 12px' }}>TYPE</th>
                    <th style={{ padding: '10px 12px' }}>SECTOR & LOCATION</th>
                    <th style={{ padding: '10px 12px' }}>STATUS</th>
                    <th style={{ padding: '10px 12px' }}>SPEED / ETA</th>
                    <th style={{ padding: '10px 12px' }}>O2 TANK PSI</th>
                    <th style={{ padding: '10px 12px' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAmbulances.map(amb => (
                    <tr key={amb.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px', fontWeight: 800, color: '#0F172A' }}>
                        {amb.vehicleNo}
                      </td>
                      <td style={{ padding: '12px', color: '#0077B6', fontWeight: 700 }}>
                        {amb.type.split(' ')[0]}
                      </td>
                      <td style={{ padding: '12px', color: '#334155' }}>
                        <div>{amb.sector.split('-')[0]}</div>
                        <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>{amb.locationName}</div>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          background: amb.status === 'AVAILABLE_STANDBY' ? '#DCFCE7' : '#FEE2E2',
                          color: amb.status === 'AVAILABLE_STANDBY' ? '#166534' : '#991B1B',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '10px',
                          fontWeight: 800
                        }}>
                          {amb.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="font-data-mono" style={{ padding: '12px', fontWeight: 700, color: '#0F172A' }}>
                        {amb.speed}
                      </td>
                      <td className="font-data-mono" style={{ padding: '12px', fontWeight: 800, color: '#16A34A' }}>
                        {amb.oxygenTankPsi} PSI
                      </td>
                      <td style={{ padding: '12px' }}>
                        <button
                          onClick={() => setSelectedAmbulance(amb)}
                          style={{ background: '#0077B6', color: '#FFF', border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Inspect & Track 📡
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRE-HOSPITAL TRIAGE CHECKLIST */}
      {activeTab === 'TRIAGE' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '22px', alignItems: 'start' }}>
          
          {/* Checklist Form Deck */}
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                PARAMEDIC & ER PRE-HOSPITAL TRIAGE CHECKLIST
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Complete rapid assessment. Real-time algorithm calculates triage priority and pre-alerts hospital resuscitation bay.
              </div>
            </div>

            {/* Patient Demographics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '12px', background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>PATIENT AGE</label>
                <input
                  type="text"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: 600 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>GENDER</label>
                <select
                  value={patientGender}
                  onChange={(e) => setPatientGender(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: 600 }}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other / Pediatric</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>INCIDENT LOCATION</label>
                <input
                  type="text"
                  value={incidentLoc}
                  onChange={(e) => setIncidentLoc(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12.5px', fontWeight: 600 }}
                />
              </div>
            </div>

            {/* Interactive Checklist Protocol */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', borderBottom: '1px solid #F1F5F9', paddingBottom: '6px' }}>
                PRIMARY SURVEY PROTOCOL (TICK ALL PRESENT FINDINGS):
              </div>

              {[
                { key: 'airway', label: '1. Airway Compromised (Stridor / Foreign Object / Burn Inhalation)', weight: '+3 Points' },
                { key: 'hypoxemia', label: '2. Severe Hypoxemia (SpO2 < 90% on room air / Cyanosis)', weight: '+3 Points' },
                { key: 'shock', label: '3. Hypotension Shock (Systolic BP < 90 mmHg / Cold Clammy Skin)', weight: '+3 Points' },
                { key: 'arrhythmia', label: '4. Severe Bradycardia (<40 bpm) or Tachycardia (>130 bpm)', weight: '+2 Points' },
                { key: 'alteredGcs', label: '5. Altered Neurological State (GCS < 9 / Unresponsive / Acute Stroke)', weight: '+3 Points' },
                { key: 'polytrauma', label: '6. High Velocity Polytrauma / Major Vehicle Deformity / Fall > 20ft', weight: '+3 Points' },
                { key: 'hemorrhage', label: '7. Active Arterial Bleeding Controlled with Tourniquet / Splint', weight: '+2 Points' },
                { key: 'stemi', label: '8. 12-Lead ECG Transmitted Shows ST-Elevation Acute MI (STEMI)', weight: '+2 Points' }
              ].map((item) => (
                <label
                  key={item.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: checklist[item.key] ? 'rgba(239, 68, 68, 0.08)' : '#F8FAFC',
                    border: checklist[item.key] ? '1.5px solid #EF4444' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="checkbox"
                      checked={checklist[item.key] || false}
                      onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                      style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '12.5px', fontWeight: checklist[item.key] ? 800 : 600, color: checklist[item.key] ? '#991B1B' : '#334155' }}>
                      {item.label}
                    </span>
                  </div>
                  <span className="font-data-mono" style={{ fontSize: '11px', fontWeight: 800, color: checklist[item.key] ? '#EF4444' : '#94A3B8' }}>
                    {item.weight}
                  </span>
                </label>
              ))}
            </div>

            {/* Transmit Button */}
            <button
              onClick={() => {
                const triageToken = `TRIAGE-${Math.floor(100000 + Math.random() * 900000)}`;
                setTriageGeneratedModal({
                  token: triageToken,
                  level: currentTriage.level,
                  color: currentTriage.color,
                  desc: currentTriage.desc,
                  patient: `${patientAge} y/o ${patientGender}`,
                  location: incidentLoc
                });
              }}
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Send size={15} />
              <span>TRANSMIT TRIAGE DOSSIER TO ER TRAUMA BAY 📡</span>
            </button>
          </div>

          {/* Right: Real-time Calculated Triage Status Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#FFFFFF', border: `2.5px solid ${currentTriage.color}`, borderRadius: '16px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>
                CALCULATED TRIAGE CLASSIFICATION:
              </div>

              <div style={{ background: currentTriage.color, color: '#FFFFFF', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>{currentTriage.level}</div>
                <div style={{ fontSize: '11.5px', marginTop: '4px', opacity: 0.95 }}>{currentTriage.desc}</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Primary Destination:</span>
                  <strong style={{ color: '#0F172A' }}>AIIMS Apex Trauma Level-1</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Trauma Team Alert:</span>
                  <strong style={{ color: '#16A34A' }}>🟢 Red-Alert Pre-Activated</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Blood Bank Cross-match:</span>
                  <strong style={{ color: '#EF4444' }}>O- 4 Units Pre-Reserved</strong>
                </div>
              </div>
            </div>

            {/* Protocol Summary Card */}
            <div style={{ background: '#0F172A', color: '#FFFFFF', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#38BDF8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Activity size={15} /> GOLDEN HOUR PROTOCOL GUIDE
              </div>
              <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: 0, lineHeight: '1.5' }}>
                Maintain high-flow oxygen, establish 2 large-bore IV cannulae (16G), keep patient warm to prevent trauma triad of death (hypothermia, coagulopathy, acidosis).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: VACANT VENTILATORS & ICU BAYS */}
      {activeTab === 'VENTILATORS' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Summary Strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #16A34A' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>INVASIVE VENTILATORS VACANT</div>
              <div className="font-data-mono" style={{ fontSize: '22px', fontWeight: 900, color: '#16A34A', marginTop: '4px' }}>
                {totalVacantVents} Ready
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748B' }}>Across 5 Major Trauma Hospitals</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #0077B6' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>NON-INVASIVE BiPAP / CPAP</div>
              <div className="font-data-mono" style={{ fontSize: '22px', fontWeight: 900, color: '#0077B6', marginTop: '4px' }}>
                27 Available
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748B' }}>Non-intubated respiratory support</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #8B5CF6' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>NEONATAL / PICU HFOV</div>
              <div className="font-data-mono" style={{ fontSize: '22px', fontWeight: 900, color: '#8B5CF6', marginTop: '4px' }}>
                9 High-Freq
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748B' }}>Pediatric & Neonatal Bays</div>
            </div>

            <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0', borderLeft: '4px solid #DC2626' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>ECMO LIFE SUPPORT UNITS</div>
              <div className="font-data-mono" style={{ fontSize: '22px', fontWeight: 900, color: '#DC2626', marginTop: '4px' }}>
                8 Standby
              </div>
              <div style={{ fontSize: '10.5px', color: '#64748B' }}>Extracorporeal membrane oxy</div>
            </div>
          </div>

          {/* Hospital Ventilator Bay Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
            {mockVentilatorBays.map(bay => (
              <div key={bay.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="font-data-mono" style={{ fontSize: '10.5px', color: '#0077B6', fontWeight: 800 }}>{bay.sector}</span>
                      <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: '2px 0 0 0' }}>{bay.hospitalName}</h4>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{bay.department}</div>
                    </div>
                    <span style={{ background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: '8px', fontSize: '10.5px', fontWeight: 800 }}>
                      {bay.vacantBeds} Beds Vacant
                    </span>
                  </div>

                  {/* Bed & Ventilator Breakdown */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px', margin: '14px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>Invasive Ventilators</div>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#16A34A' }}>
                        {bay.invasiveVentilators.vacant} / {bay.invasiveVentilators.total} Ready
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>BiPAP / CPAP</div>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#0077B6' }}>
                        {bay.nonInvasiveBipap.vacant} / {bay.nonInvasiveBipap.total} Ready
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4' }}>
                    <div>👨‍⚕️ <strong>Intensivist:</strong> {bay.dutyIntensivist}</div>
                    <div className="font-data-mono" style={{ color: '#0077B6', marginTop: '3px' }}>📞 {bay.phone}</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                  <button
                    onClick={() => setReserveVentModal(bay)}
                    style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', color: '#FFF', border: 'none', padding: '8px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Instant Reserve Bay 🫁
                  </button>
                  <a
                    href={`tel:${bay.phone}`}
                    style={{ background: '#0F172A', color: '#38BDF8', padding: '8px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800, textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                  >
                    <PhoneCall size={12} /> Call ICU
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: OXYGEN CYLINDERS & CRYOGENIC LMO RESERVES */}
      {activeTab === 'OXYGEN' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
            {mockOxygenNodes.map(node => (
              <div key={node.id} style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '14px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="font-data-mono" style={{ fontSize: '10.5px', color: '#0077B6', fontWeight: 800 }}>{node.sector}</span>
                      <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A', margin: '2px 0 0 0' }}>{node.facilityName}</h4>
                    </div>
                    <span style={{ background: '#DCFCE7', color: '#166534', padding: '3px 8px', borderRadius: '8px', fontSize: '10.5px', fontWeight: 800 }}>
                      {node.autonomyHoursRemaining}h Autonomy
                    </span>
                  </div>

                  {/* LMO Tank Gauge */}
                  <div style={{ margin: '14px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ color: '#64748B' }}>Liquid Medical Oxygen Tank:</span>
                      <strong className="font-data-mono" style={{ color: '#0077B6' }}>{node.lmoCurrentStockKL} / {node.lmoTankCapacityKL} kL</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(node.lmoCurrentStockKL / node.lmoTankCapacityKL) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #00B4D8, #0077B6)' }} />
                    </div>
                  </div>

                  {/* Cylinders Status */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11.5px' }}>
                    <div>
                      <div style={{ color: '#64748B' }}>Type-D (7000L O2)</div>
                      <strong style={{ color: '#16A34A' }}>{node.typeDCylinders.full} Full</strong> / {node.typeDCylinders.total}
                    </div>
                    <div>
                      <div style={{ color: '#64748B' }}>Type-B Mobile (1400L)</div>
                      <strong style={{ color: '#0077B6' }}>{node.typeBCylinders.full} Full</strong> / {node.typeBCylinders.total}
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '10px' }}>
                    <div>🚚 <strong>Supplier Grid:</strong> {node.supplierHub}</div>
                    <div>⏱️ <strong>Last Refill:</strong> {node.lastRefillDate}</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowO2RefillModal(node)}
                  style={{ background: '#0F172A', color: '#38BDF8', border: 'none', padding: '9px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Request Cryogenic Refill Tanker 🚚
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: BLOOD BANK RESERVES */}
      {activeTab === 'BLOOD' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
              REGIONAL BLOOD BANK LIVE UNITS (PRBC, FFP & PLATELETS)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
              {mockBloodBank.map(blood => (
                <div key={blood.group} style={{ background: '#F8FAFC', border: blood.status === 'CRITICAL_LOW' ? '1.5px solid #EF4444' : '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>{blood.group}</span>
                      <span style={{
                        background: blood.status === 'CRITICAL_LOW' ? '#FEE2E2' : '#DCFCE7',
                        color: blood.status === 'CRITICAL_LOW' ? '#991B1B' : '#166534',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontSize: '9.5px',
                        fontWeight: 800
                      }}>
                        {blood.status}
                      </span>
                    </div>

                    <div style={{ margin: '10px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '11px', textAlign: 'center' }}>
                      <div style={{ background: '#FFF', padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <div style={{ color: '#64748B' }}>PRBC</div>
                        <strong className="font-data-mono" style={{ fontSize: '13px', color: '#DC2626' }}>{blood.prbcUnits}</strong>
                      </div>
                      <div style={{ background: '#FFF', padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <div style={{ color: '#64748B' }}>FFP</div>
                        <strong className="font-data-mono" style={{ fontSize: '13px', color: '#D97706' }}>{blood.ffpUnits}</strong>
                      </div>
                      <div style={{ background: '#FFF', padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <div style={{ color: '#64748B' }}>Platelets</div>
                        <strong className="font-data-mono" style={{ fontSize: '13px', color: '#0077B6' }}>{blood.plateletsUnits}</strong>
                      </div>
                    </div>
                  </div>

                  {blood.status === 'CRITICAL_LOW' && (
                    <button
                      onClick={() => setBroadcastBloodModal(blood)}
                      style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                    >
                      Broadcast Donor SOS 📢
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. MODALS */}

      {/* Triage Generated Confirmation Modal */}
      {triageGeneratedModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '460px', padding: '26px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.35)' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: triageGeneratedModal.color, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
              <CheckCircle2 size={32} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>TRIAGE DOSSIER TRANSMITTED</h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>
              Pre-hospital packet successfully synchronized with hospital trauma dashboard.
            </p>

            <div style={{ background: '#F8FAFC', border: `1.5px dashed ${triageGeneratedModal.color}`, borderRadius: '12px', padding: '14px', margin: '16px 0', textAlign: 'left', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div><strong>Token:</strong> {triageGeneratedModal.token}</div>
              <div><strong>Level:</strong> <span style={{ color: triageGeneratedModal.color, fontWeight: 800 }}>{triageGeneratedModal.level}</span></div>
              <div><strong>Patient:</strong> {triageGeneratedModal.patient}</div>
              <div><strong>Location:</strong> {triageGeneratedModal.location}</div>
            </div>

            <button
              onClick={() => setTriageGeneratedModal(null)}
              style={{ background: '#0077B6', color: '#FFF', border: 'none', width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}
            >
              Done & Return to Fleet 🚑
            </button>
          </div>
        </div>
      )}

      {/* Mass Casualty Incident Dispatch Modal */}
      {showIncidentDispatchModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#070D1E', border: '1.5px solid #EF4444', borderRadius: '20px', width: '100%', maxWidth: '500px', padding: '24px', color: '#FFFFFF', boxShadow: '0 25px 60px rgba(239, 68, 68, 0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#EF4444' }}>🚨 REPORT MASS CASUALTY / MULTI-AMBULANCE DISPATCH</div>
              <button onClick={() => setShowIncidentDispatchModal(false)} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '18px 0' }}>
              <div>
                <label style={{ fontSize: '11.5px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>INCIDENT TYPE</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', background: '#0F172A', border: '1px solid #334155', color: '#FFF', fontSize: '12.5px' }}
                >
                  <option>Multi-Vehicle Highway Collision</option>
                  <option>Industrial Chemical / Fire Incident</option>
                  <option>Mass Cardiac / Heat Stroke Cluster</option>
                  <option>Structural Collapse / Severe Trauma</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11.5px', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>ESTIMATED VICTIMS</label>
                <input
                  type="text"
                  value={incidentVictims}
                  onChange={(e) => setIncidentVictims(e.target.value)}
                  style={{ width: '100%', padding: '9px', borderRadius: '8px', background: '#0F172A', border: '1px solid #334155', color: '#FFF', fontSize: '12.5px' }}
                />
              </div>

              <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '10px', borderRadius: '8px', fontSize: '11.5px', color: '#FCA5A5' }}>
                ⚡ Auto-dispatches 3 nearest ACLS units and reserves nearest Level-1 trauma surgical bays.
              </div>
            </div>

            <button
              onClick={() => {
                alert(`Mass Casualty Emergency Protocol Activated! 3 ACLS Ambulances dispatched to incident site.`);
                setShowIncidentDispatchModal(false);
              }}
              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF', border: 'none', width: '100%', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 900, cursor: 'pointer' }}
            >
              CONFIRM DISPATCH & SOUND REGIONAL ALARM 🚨
            </button>
          </div>
        </div>
      )}

      {/* Ventilator Reservation Modal */}
      {reserveVentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '460px', padding: '24px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>RESERVE VENTILATOR BAY</h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>{reserveVentModal.hospitalName} ({reserveVentModal.department})</p>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', margin: '16px 0', textAlign: 'left', fontSize: '12px' }}>
              <div><strong>Available Invasive Units:</strong> {reserveVentModal.invasiveVentilators.vacant} Beds</div>
              <div><strong>Models:</strong> {reserveVentModal.invasiveVentilators.models}</div>
              <div><strong>Duty Intensivist:</strong> {reserveVentModal.dutyIntensivist}</div>
            </div>

            <button
              onClick={() => {
                alert(`Ventilator Bay Reserved at ${reserveVentModal.hospitalName}! Token: VENT-${Math.floor(100000 + Math.random() * 900000)}`);
                setReserveVentModal(null);
              }}
              style={{ background: '#0077B6', color: '#FFF', border: 'none', width: '100%', padding: '11px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer' }}
            >
              CONFIRM INSTANT RESERVATION 🫁
            </button>
          </div>
        </div>
      )}

      {/* Oxygen Refill Tanker Modal */}
      {showO2RefillModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '460px', padding: '24px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>ORDER CRYOGENIC LMO REFILL</h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>{showO2RefillModal.facilityName}</p>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px', margin: '16px 0', textAlign: 'left', fontSize: '12px' }}>
              <div><strong>Current Stock:</strong> {showO2RefillModal.lmoCurrentStockKL} kL / {showO2RefillModal.lmoTankCapacityKL} kL</div>
              <div><strong>Supplier Grid:</strong> {showO2RefillModal.supplierHub}</div>
              <div><strong>Priority:</strong> Green Fast-Lane Cryo Tanker</div>
            </div>

            <button
              onClick={() => {
                alert(`Cryogenic LMO Tanker #LMO-TANK-902 dispatched to ${showO2RefillModal.facilityName}. ETA: 45 mins.`);
                setShowO2RefillModal(null);
              }}
              style={{ background: '#0077B6', color: '#FFF', border: 'none', width: '100%', padding: '11px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer' }}
            >
              DISPATCH LMO REFILL TANKER 🚚
            </button>
          </div>
        </div>
      )}

      {/* Blood Donor Broadcast Modal */}
      {broadcastBloodModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '20px', width: '100%', maxWidth: '460px', padding: '24px', textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#FEE2E2', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Droplets size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A', margin: 0 }}>BROADCAST RARE BLOOD SOS</h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>
              Transmits urgent SMS & push notification to all verified {broadcastBloodModal.group} donors in the 15km radius.
            </p>

            <button
              onClick={() => {
                alert(`Emergency Donor Broadcast sent to 142 registered ${broadcastBloodModal.group} donors in the city.`);
                setBroadcastBloodModal(null);
              }}
              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF', border: 'none', width: '100%', padding: '11px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', marginTop: '12px' }}
            >
              SEND EMERGENCY DONOR BROADCAST 📢
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState<PageRoute>('HOME');
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Cart Drawer State
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Stitch AI Medical Map & Disease Radar State
  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [selectedCityInput, setSelectedCityInput] = useState<string>('');
  const [outbreakCity, setOutbreakCity] = useState<string>('New Delhi');
  const [outbreakCityInput, setOutbreakCityInput] = useState<string>('');
  const [mapMode, setMapMode] = useState<'GLOBE' | 'PHYSICAL_MAP'>('PHYSICAL_MAP');
  const [isRedirectingMap, setIsRedirectingMap] = useState(false);
  const [activeFacility, setActiveFacility] = useState<MedicalFacility>(facilityList[0]);
  const [facilityFilter, setFacilityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMapLayer, setActiveMapLayer] = useState<'ALL' | 'TRAUMA' | 'ICU_HEATMAP' | 'DIAGNOSTIC'>('ALL');
  const [bookingFacility, setBookingFacility] = useState<MedicalFacility | null>(null);
  const [bookingSlot, setBookingSlot] = useState<string>('Today 11:30 AM (Immediate)');
  const [bookingSpecialty, setBookingSpecialty] = useState<string>('General Medicine & Triage');
  const [bookingPatientName, setBookingPatientName] = useState<string>('Rajesh Kumar');
  const [bookingSuccessModal, setBookingSuccessModal] = useState<any | null>(null);
  const [showDispatchModal, setShowDispatchModal] = useState<MedicalFacility | null>(null);
  const [dispatchStatus, setDispatchStatus] = useState<string>('LOCATING');

  // 5 MASTER RBAC ROLE AUTHENTICATION STATE
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mediVerse_userProfile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginRole, setLoginRole] = useState<UserRole>('PATIENT');
  const [loginForm, setLoginForm] = useState({
    name: '',
    email: '',
    password: '',
    age: '34',
    illnesses: 'Hypertension, Seasonal Allergy',
    mciId: 'MCI-884920',
    facility: 'Apex Neurovascular Institute',
    ward: 'ICU STEP-DOWN - WARD 4B',
    nodeId: 'NODE #LAB-BIOCHEM-01'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    abhaId: '',
    password: '',
    confirmPassword: '',
    age: '28',
    gender: 'MALE',
    illnesses: '',
    termsAccepted: true
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (registerForm.password && registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match! Please check your password entry.");
      return;
    }
    const abhaNumber = registerForm.abhaId || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newProfile: UserProfile = {
      name: registerForm.fullName || 'New Patient',
      role: 'PATIENT',
      identifier: `ABHA: ${abhaNumber}`,
      age: Number(registerForm.age) || 28,
      illnesses: registerForm.illnesses || 'None'
    };
    setUserProfile(newProfile);
    localStorage.setItem('mediVerse_userProfile', JSON.stringify(newProfile));
    setShowLoginModal(false);
    setActivePage('PATIENT_PHR');
    alert(`Account Created Successfully! Welcome to MediVerse AI, ${newProfile.name}. ABHA Digital Health Passport Issued (${newProfile.identifier}).`);
  };

  const handleSocialLogin = (provider: string) => {
    const nameStr = loginForm.email || (provider === 'Google' ? 'Google User' : provider === 'Apple' ? 'Apple User' : 'MediVerse Key User');
    let newProfile: UserProfile = {
      name: nameStr,
      role: loginRole,
      identifier: `${provider.toUpperCase()}-AUTH-9921`,
      mciId: loginForm.mciId,
      facility: loginForm.facility,
      ward: loginForm.ward,
      nodeId: loginForm.nodeId
    };
    setUserProfile(newProfile);
    localStorage.setItem('mediVerse_userProfile', JSON.stringify(newProfile));
    setShowLoginModal(false);
    if (loginRole === 'PATIENT') setActivePage('PATIENT_PHR');
    else if (loginRole === 'DOCTOR') setActivePage('DOCTOR_COCKPIT');
    else if (loginRole === 'RECEPTION') setActivePage('RECEPTION_NHCX');
    else if (loginRole === 'NURSE') setActivePage('NURSE_TELEMETRY');
    else setActivePage('LAB_ACCESSION');
  };

  // Role-Specific State Flags
  const [isVoiceScribeActive, setIsVoiceScribeActive] = useState(true);
  const [pendingRxSignCount, setPendingRxSignCount] = useState(4);
  const [cashDrawerTotal, setCashDrawerTotal] = useState({ cash: 42500, digital: 188200 });
  const [codeBlueAlert, setCodeBlueAlert] = useState(false);

  // Hero Slider Auto-Play
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string }>>([
    { sender: 'bot', text: 'Welcome to MediBot AI! How can I assist you with symptoms, doctor appointments, local outbreak alerts, or health news?' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Triage Omnibar State
  const [triageQuery, setTriageQuery] = useState('');
  const [triageResult, setTriageResult] = useState<any>(null);

  const handleSelectCityLocation = (city: string) => {
    setSelectedCity(city);
    setIsRedirectingMap(true);
    setTimeout(() => {
      setIsRedirectingMap(false);
      setMapMode('PHYSICAL_MAP');
    }, 1200);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newProfile: UserProfile;

    if (loginRole === 'PATIENT') {
      newProfile = {
        name: loginForm.name || 'Rajesh Kumar',
        role: 'PATIENT',
        identifier: 'ABHA: 91-8472-9012-3341',
        age: Number(loginForm.age),
        illnesses: loginForm.illnesses
      };
      setActivePage('PATIENT_PHR');
    } else if (loginRole === 'DOCTOR') {
      newProfile = {
        name: loginForm.name || 'Dr. Neha Verma',
        role: 'DOCTOR',
        identifier: loginForm.mciId || 'MCI/NMC #2018/04/1982',
        mciId: loginForm.mciId || 'MCI/NMC #2018/04/1982',
        facility: loginForm.facility
      };
      setActivePage('DOCTOR_COCKPIT');
    } else if (loginRole === 'RECEPTION') {
      newProfile = {
        name: loginForm.name || 'Priya Sharma (Intake Officer)',
        role: 'RECEPTION',
        identifier: 'TERMINAL #REC-FRONT-02',
        facility: loginForm.facility
      };
      setActivePage('RECEPTION_NHCX');
    } else if (loginRole === 'NURSE') {
      newProfile = {
        name: loginForm.name || 'Staff Nurse Anita R.',
        role: 'NURSE',
        identifier: 'NURSE-ID #77291',
        ward: loginForm.ward
      };
      setActivePage('NURSE_TELEMETRY');
    } else {
      newProfile = {
        name: loginForm.name || 'Suresh Menon (Lab Tech)',
        role: 'LAB_TECH',
        identifier: loginForm.nodeId || 'NODE #LAB-BIOCHEM-01'
      };
      setActivePage('LAB_ACCESSION');
    }

    setUserProfile(newProfile);
    localStorage.setItem('mediVerse_userProfile', JSON.stringify(newProfile));
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem('mediVerse_userProfile');
    setActivePage('HOME');
  };

  const handleSendMessage = (text?: string) => {
    const msg = text || chatInput;
    if (!msg) return;
    setChatMessages(prev => [...prev, { sender: 'user', text: msg }]);
    if (!text) setChatInput('');

    setTimeout(() => {
      let botResp = `MediBot AI processed your query: "${msg}". I recommend checking our Local Outbreak Radar or booking an OPD consultation.`;
      setChatMessages(prev => [...prev, { sender: 'bot', text: botResp }]);
    }, 800);
  };

  const handleTriageExecute = (query?: string) => {
    const targetQuery = query || triageQuery;
    if (!targetQuery) return;
    setTriageQuery(targetQuery);
    
    const isCritical = targetQuery.toLowerCase().includes('fever') && (targetQuery.toLowerCase().includes('rash') || targetQuery.toLowerCase().includes('joint'));
    setTriageResult({
      riskLevel: isCritical ? 'URGENT SPECIALIST CONSULTATION' : 'ROUTINE OPD CARE',
      summary: `Patient complaint parsed: "${targetQuery}". Bayesian clinical engine calculates 88.4% correlation with Dengue Serotype-2 / Viral Exanthem. Pre-consultation summary generated for doctor cockpit.`,
      recommendedSpecialty: isCritical ? 'Infectious Disease / Neurology' : 'Internal Medicine',
      idspNotice: 'IDSP Telemetry Alert: Active Dengue Surge in Delhi NCR (PIN 110001) - 340% Baseline Increase'
    });
  };

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[id] > 1) {
        copy[id] -= 1;
      } else {
        delete copy[id];
      }
      return copy;
    });
  };

  const totalCartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = medicineCatalog.find(m => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const activeSlide = heroSlides[currentSlide];  // RENDER CUSTOM NAVBAR PER ROLE MATRICES WITH TRANSPARENT GLASS & ATTRACTIVE ILLUMINATED ICON THEME
  const renderRoleCustomNavbar = () => {
    const role = userProfile?.role || 'PATIENT';

    if (role === 'DOCTOR') {
      return (
        <header className="header-glass" style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div onClick={() => setActivePage('HOME')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} title="Go to Main Home Page">
            <div className="brand-icon-glow" style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(2, 132, 199, 0.45)' }}>
              <Stethoscope size={22} color="#FFF" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Doctor Clinical Cockpit</span>
                <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.2)', color: '#00F2FE', border: '1px solid rgba(0, 242, 254, 0.4)' }}>CLINICAL v8.0</span>
              </div>
              <div className="font-data-mono" style={{ fontSize: '10px', color: '#38BDF8', fontWeight: 700, marginTop: '2px' }}>
                {userProfile?.facility} • NMC #{userProfile?.identifier}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, margin: '0 16px', overflow: 'hidden' }}>
            <nav 
              className="scrollable-nav-bar"
              style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
            >
              {[
                { page: 'HOME', label: 'Main Home', icon: Home, badgeClass: 'icon-badge-home' },
                { page: 'DOCTOR_COCKPIT', label: 'OPD Stream (2 Crit | 14 Rout)', icon: UserCheck, badgeClass: 'icon-badge-doctor' },
                { page: 'DOCTOR_PACS_3D', label: '3D PACS Studio', icon: Brain, badgeClass: 'icon-badge-ai' },
                { page: 'DOCTOR_SAMD_ENGINE', label: 'SaMD CDSS AI Engine', icon: Cpu, badgeClass: 'icon-badge-map' },
                { page: 'DOCTOR_ANTIBIOGRAM', label: 'Antibiogram Radar', icon: ShieldCheck, badgeClass: 'icon-badge-pharmacy' },
                { page: 'N8N_AUTOMATION', label: 'Hospital AI Automation (n8n)', icon: Bot, badgeClass: 'icon-badge-ai' }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.page;
                return (
                  <button 
                    key={item.page} 
                    onClick={() => setActivePage(item.page as PageRoute)} 
                    className="nav-tab-btn"
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      border: isActive ? '1px solid rgba(0, 242, 254, 0.6)' : '1px solid transparent', 
                      background: isActive ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' : 'transparent', 
                      color: isActive ? '#FFF' : '#E2E8F0', 
                      fontWeight: isActive ? 800 : 600, 
                      fontSize: '11px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '7px',
                      flexShrink: 0,
                      boxShadow: isActive ? '0 4px 14px rgba(2, 132, 199, 0.45)' : 'none'
                    }}
                  >
                    <div className={`nav-icon-container ${isActive ? 'icon-badge-active' : item.badgeClass}`} style={{ width: '22px', height: '22px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button onClick={() => setIsVoiceScribeActive(!isVoiceScribeActive)} style={{ background: isVoiceScribeActive ? 'rgba(22, 163, 74, 0.25)' : 'rgba(255, 255, 255, 0.08)', border: isVoiceScribeActive ? '1px solid #4ADE80' : '1px solid rgba(255, 255, 255, 0.2)', color: isVoiceScribeActive ? '#4ADE80' : '#E2E8F0', padding: '7px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: isVoiceScribeActive ? '#16A34A' : '#64748B', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isVoiceScribeActive ? <Mic size={11} /> : <MicOff size={11} />}
              </div>
              <span>{isVoiceScribeActive ? 'Voice Scribe ACTIVE' : 'Voice Scribe OFF'}</span>
            </button>
            <button onClick={() => alert('Batch Sign Executed for 4 Rx. Cryptographic Stamp Applied.')} style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', color: '#FFF', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '7px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)' }}>
              <LockKeyhole size={13} /> Batch Sign Rx ({pendingRxSignCount})
            </button>
            <button onClick={handleLogout} title="Logout" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(220, 38, 38, 0.2)', border: '1px solid rgba(220, 38, 38, 0.4)', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogOut size={15} />
            </button>
          </div>
        </header>
      );
    }

    if (role === 'RECEPTION') {
      return (
        <header className="header-glass" style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div onClick={() => setActivePage('HOME')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }} title="Go to Main Home Page">
            <div className="brand-icon-glow" style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284C7 0%, #1D4ED8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(2, 132, 199, 0.45)' }}>
              <Building2 size={22} color="#FFF" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Reception Desk & NHCX</span>
                <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.2)', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.4)' }}>TERMINAL 02</span>
              </div>
              <div className="font-data-mono" style={{ fontSize: '10px', color: '#93C5FD', marginTop: '2px' }}>
                {userProfile?.identifier} • Cash: ₹{cashDrawerTotal.cash} | UPI: ₹{cashDrawerTotal.digital}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, margin: '0 16px', overflow: 'hidden' }}>
            <nav 
              className="scrollable-nav-bar"
              style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
            >
              {[
                { page: 'HOME', label: 'Main Home', icon: Home, badgeClass: 'icon-badge-home' },
                { page: 'RECEPTION_NHCX', label: 'NHCX Cashless Claims', icon: ShieldCheck, badgeClass: 'icon-badge-pharmacy' },
                { page: 'RECEPTION_ABDM_SCAN', label: 'ABDM Scan & Share', icon: QrCode, badgeClass: 'icon-badge-ai' },
                { page: 'RECEPTION_TOKENS', label: 'OPD Token Dispatcher', icon: Clock, badgeClass: 'icon-badge-news' },
                { page: 'RECEPTION_BED_MATRIX', label: 'Ward & Bed Matrix', icon: Bed, badgeClass: 'icon-badge-map' },
                { page: 'N8N_AUTOMATION', label: 'Hospital AI Automation (n8n)', icon: Bot, badgeClass: 'icon-badge-ai' }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.page;
                return (
                  <button 
                    key={item.page} 
                    onClick={() => setActivePage(item.page as PageRoute)} 
                    className="nav-tab-btn"
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      border: isActive ? '1px solid rgba(0, 242, 254, 0.6)' : '1px solid transparent', 
                      background: isActive ? 'linear-gradient(135deg, #0284C7 0%, #1D4ED8 100%)' : 'transparent', 
                      color: isActive ? '#FFF' : '#E2E8F0', 
                      fontWeight: isActive ? 800 : 600, 
                      fontSize: '11px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '7px',
                      flexShrink: 0,
                      boxShadow: isActive ? '0 4px 14px rgba(2, 132, 199, 0.45)' : 'none'
                    }}
                  >
                    <div className={`nav-icon-container ${isActive ? 'icon-badge-active' : item.badgeClass}`} style={{ width: '22px', height: '22px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button onClick={() => alert('Webcam Barcode Scanner Triggered.')} style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#E2E8F0', padding: '7px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.2)', color: '#00F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scan size={12} />
              </div>
              <span>Scan Barcode</span>
            </button>
            <button onClick={handleLogout} title="Logout" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(220, 38, 38, 0.2)', border: '1px solid rgba(220, 38, 38, 0.4)', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogOut size={15} />
            </button>
          </div>
        </header>
      );
    }

    if (role === 'NURSE') {
      return (
        <header className="header-glass" style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div onClick={() => setActivePage('HOME')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }} title="Go to Main Home Page">
            <div className="brand-icon-glow" style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(220, 38, 38, 0.45)' }}>
              <Activity size={22} color="#FFF" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Smart Nursing Station</span>
                <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#F87171', border: '1px solid rgba(239, 68, 68, 0.4)' }}>ICU HUD</span>
              </div>
              <div className="font-data-mono" style={{ fontSize: '10px', color: '#FCA5A5', fontWeight: 800, marginTop: '2px' }}>
                {userProfile?.ward} • {userProfile?.name}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, margin: '0 16px', overflow: 'hidden' }}>
            <nav 
              className="scrollable-nav-bar"
              style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
            >
              {[
                { page: 'HOME', label: 'Main Home', icon: Home, badgeClass: 'icon-badge-home' },
                { page: 'NURSE_TELEMETRY', label: 'Bed Telemetry HUD', icon: Activity, badgeClass: 'icon-badge-radar' },
                { page: 'NURSE_EMAR', label: 'eMAR Med Schedule', icon: Pill, badgeClass: 'icon-badge-pharmacy' },
                { page: 'NURSE_FLUIDS', label: 'Fluid Charting', icon: Droplets, badgeClass: 'icon-badge-cure' },
                { page: 'NURSE_SBAR', label: 'Shift Handoff (SBAR)', icon: FileText, badgeClass: 'icon-badge-news' },
                { page: 'N8N_AUTOMATION', label: 'Hospital AI Automation (n8n)', icon: Bot, badgeClass: 'icon-badge-ai' }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.page;
                return (
                  <button 
                    key={item.page} 
                    onClick={() => setActivePage(item.page as PageRoute)} 
                    className="nav-tab-btn"
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      border: isActive ? '1px solid rgba(248, 113, 113, 0.6)' : '1px solid transparent', 
                      background: isActive ? 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)' : 'transparent', 
                      color: isActive ? '#FFF' : '#E2E8F0', 
                      fontWeight: isActive ? 800 : 600, 
                      fontSize: '11px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '7px',
                      flexShrink: 0,
                      boxShadow: isActive ? '0 4px 14px rgba(220, 38, 38, 0.45)' : 'none'
                    }}
                  >
                    <div className={`nav-icon-container ${isActive ? 'icon-badge-active' : item.badgeClass}`} style={{ width: '22px', height: '22px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button onClick={() => setCodeBlueAlert(!codeBlueAlert)} style={{ background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)', color: '#FFF', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 4px 14px rgba(220,38,38,0.4)', animation: codeBlueAlert ? 'pulse 1s infinite' : 'none' }}>
              <Flame size={16} /> CODE BLUE EMERGENCY
            </button>
            <button onClick={handleLogout} title="Logout" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(220, 38, 38, 0.2)', border: '1px solid rgba(220, 38, 38, 0.4)', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogOut size={15} />
            </button>
          </div>
        </header>
      );
    }

    if (role === 'LAB_TECH') {
      return (
        <header className="header-glass" style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div onClick={() => setActivePage('HOME')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }} title="Go to Main Home Page">
            <div className="brand-icon-glow" style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(217, 119, 6, 0.45)' }}>
              <FlaskConical size={22} color="#FFF" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Diagnostic Lab & LIMS</span>
                <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.2)', color: '#FBBF24', border: '1px solid rgba(245, 158, 11, 0.4)' }}>LIMS CORE</span>
              </div>
              <div className="font-data-mono" style={{ fontSize: '10px', color: '#FDE68A', fontWeight: 800, marginTop: '2px' }}>
                {userProfile?.identifier} • Serial Port ONLINE
              </div>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, margin: '0 16px', overflow: 'hidden' }}>
            <nav 
              className="scrollable-nav-bar"
              style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
              onWheel={(e) => {
                if (e.deltaY !== 0) {
                  e.currentTarget.scrollLeft += e.deltaY;
                }
              }}
            >
              {[
                { page: 'HOME', label: 'Main Home', icon: Home, badgeClass: 'icon-badge-home' },
                { page: 'LAB_ACCESSION', label: 'Accession Queue', icon: TestTube, badgeClass: 'icon-badge-news' },
                { page: 'LAB_PACS_UPLOAD', label: 'PACS DICOM Dropzone', icon: UploadCloud, badgeClass: 'icon-badge-doctor' },
                { page: 'LAB_ANALYZER', label: 'LIMS Analyzer Sync', icon: Database, badgeClass: 'icon-badge-ai' },
                { page: 'LAB_CRITICAL_DISPATCH', label: 'Critical Value Dispatch', icon: AlertTriangle, badgeClass: 'icon-badge-radar' },
                { page: 'N8N_AUTOMATION', label: 'Hospital AI Automation (n8n)', icon: Bot, badgeClass: 'icon-badge-ai' }
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.page;
                return (
                  <button 
                    key={item.page} 
                    onClick={() => setActivePage(item.page as PageRoute)} 
                    className="nav-tab-btn"
                    style={{ 
                      padding: '6px 12px', 
                      borderRadius: '8px', 
                      border: isActive ? '1px solid rgba(251, 191, 36, 0.6)' : '1px solid transparent', 
                      background: isActive ? 'linear-gradient(135deg, #D97706 0%, #B45309 100%)' : 'transparent', 
                      color: isActive ? '#FFF' : '#E2E8F0', 
                      fontWeight: isActive ? 800 : 600, 
                      fontSize: '11px', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '7px',
                      flexShrink: 0,
                      boxShadow: isActive ? '0 4px 14px rgba(217, 119, 6, 0.45)' : 'none'
                    }}
                  >
                    <div className={`nav-icon-container ${isActive ? 'icon-badge-active' : item.badgeClass}`} style={{ width: '22px', height: '22px', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                    </div>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <button onClick={() => alert('LOINC Code Auto-Standardizer executed.')} style={{ background: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)', color: '#FFF', border: '1px solid rgba(255, 255, 255, 0.3)', padding: '7px 14px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Batch LOINC Sync
            </button>
            <button onClick={handleLogout} title="Logout" style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(220, 38, 38, 0.2)', border: '1px solid rgba(220, 38, 38, 0.4)', color: '#F87171', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LogOut size={15} />
            </button>
          </div>
        </header>
      );
    }

    // DEFAULT B2C PATIENT PORTAL NAVBAR WITH TRANSPARENT GLASS & ILLUMINATED JEWEL-TONED ICON THEME
    return (
      <header className="header-glass" style={{ height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50, gap: '12px' }}>
        {/* Brand Logo with Glowing Jewel Aura */}
        <div onClick={() => setActivePage('HOME')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flexShrink: 0 }} title="MediVerse AI — Precision Health OS">
          <div className="brand-icon-glow" style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeartPulse size={24} color="#FFFFFF" style={{ filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.25))' }} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF', lineHeight: '1', display: 'flex', alignItems: 'center', gap: '6px' }}>
              MediVerse <span style={{ background: 'linear-gradient(135deg, #00F2FE 0%, #38BDF8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
              <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.18)', color: '#00F2FE', border: '1px solid rgba(0, 242, 254, 0.35)', letterSpacing: '0.04em' }}>v8.0</span>
            </div>
            <div className="font-data-mono" style={{ fontSize: '10px', color: '#94A3B8', marginTop: '3px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>CUREPOINT HEALTH OS</span>
              <span style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#34D399' }}>
                <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }}></span>
                <span>ONLINE</span>
              </span>
            </div>
          </div>
        </div>

        {/* Themed Horizontal Scrollable Navigation Pill Bar */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, margin: '0 12px', overflow: 'hidden' }}>
          <nav 
            className="scrollable-nav-bar"
            style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.15)' }}
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
          >
            {[
              { page: 'HOME', label: 'Home', icon: Home, badgeClass: 'icon-badge-home' },
              { page: 'OUTBREAK_RADAR', label: 'Disease Radar', icon: Bug, badgeClass: 'icon-badge-radar' },
              { page: 'HEALTH_NEWS', label: 'Local News', icon: Newspaper, badgeClass: 'icon-badge-news' },
              { page: 'BUY_MEDICINES', label: 'Buy Medicines', icon: Pill, badgeClass: 'icon-badge-pharmacy' },
              { page: 'MEDICAL_MAP', label: 'Medical Map', icon: Map, badgeClass: 'icon-badge-map' },
              { page: 'AI_HELP', label: 'AI Help', icon: Bot, badgeClass: 'icon-badge-ai' },
              { page: 'HOME_CURE', label: 'Home Cure', icon: ShieldAlert, badgeClass: 'icon-badge-cure' },
              { page: 'BOOK_APPOINTMENT', label: 'Book Doctor', icon: Calendar, badgeClass: 'icon-badge-doctor' },
              { page: 'N8N_AUTOMATION', label: 'Hospital AI Automation (n8n)', icon: Cpu, badgeClass: 'icon-badge-ai' }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page;
              return (
                <button 
                  key={item.page} 
                  onClick={() => setActivePage(item.page as PageRoute)} 
                  className="nav-tab-btn"
                  style={{ 
                    padding: '6px 11px', 
                    borderRadius: '9px', 
                    border: isActive ? '1px solid rgba(0, 242, 254, 0.6)' : '1px solid transparent', 
                    background: isActive ? 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)' : 'transparent', 
                    color: isActive ? '#FFFFFF' : '#E2E8F0', 
                    fontWeight: isActive ? 800 : 600, 
                    fontSize: '11.5px', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    whiteSpace: 'nowrap', 
                    flexShrink: 0,
                    boxShadow: isActive ? '0 4px 14px rgba(2, 132, 199, 0.45)' : 'none'
                  }}
                >
                  <div 
                    className={`nav-icon-container ${isActive ? 'icon-badge-active' : item.badgeClass}`}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Manager Premium Button & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            onClick={() => {
              const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port;
              window.open(isLocal ? 'http://localhost:5174' : '/manager/', '_blank');
            }}
            style={{
              background: 'linear-gradient(135deg, #00F2FE 0%, #0284C7 100%)',
              color: '#00373A',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              padding: '7px 14px',
              borderRadius: '9px',
              fontSize: '11px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 16px rgba(0, 242, 254, 0.4)',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap'
            }}
            title="Open MediVerse Manager Premium Login Platform"
          >
            <Sparkles size={13} color="#00373A" />
            <span>MANAGER PREMIUM</span>
            <ArrowRight size={12} />
          </button>

          <a
            href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port ? 'http://localhost:5176' : '/'}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '7px 11px',
              borderRadius: '9px',
              fontSize: '11px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              whiteSpace: 'nowrap'
            }}
            title="Back to MediVerse Precision Health OS Main Home"
          >
            <Home size={12} />
            <span>Home Portal</span>
          </a>

          {userProfile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(15, 23, 42, 0.7)', height: '36px', padding: '0 10px', borderRadius: '9px', border: '1px solid rgba(255, 255, 255, 0.2)', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', flexShrink: 0 }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <User size={12} />
              </div>
              <div style={{ fontSize: '10.5px', lineHeight: '1.2' }}>
                <div style={{ fontWeight: 800, color: '#FFFFFF' }}>{userProfile.name}</div>
                <div className="font-data-mono" style={{ fontSize: '8.5px', color: '#38BDF8', fontWeight: 700 }}>{userProfile.role}</div>
              </div>
              <button onClick={handleLogout} title="Logout" style={{ background: 'transparent', border: 'none', color: '#F87171', cursor: 'pointer', marginLeft: '4px', display: 'flex', padding: '2px' }}>
                <LogOut size={13} />
              </button>
            </div>
          )}
        </div>
      </header>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC', color: '#0F172A', position: 'relative' }}>
      
      {/* ROLE-SPECIFIC CUSTOM NAVBAR */}
      {renderRoleCustomNavbar()}

      {/* SHOPPING CART DRAWER MODAL */}
      {showCartDrawer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '440px', height: '100%', background: '#FFFFFF', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', boxShadow: '-10px 0 40px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShoppingCart size={22} color="#0077B6" /> E-Pharmacy Cart ({totalCartCount} Items)
              </div>
              <button onClick={() => setShowCartDrawer(false)} style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(cart).map(([id, qty]) => {
                const item = medicineCatalog.find(m => m.id === id);
                if (!item) return null;
                return (
                  <div key={id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px', borderRadius: '8px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{item.name}</div>
                      <div className="font-data-mono" style={{ fontSize: '12px', color: '#0077B6', fontWeight: 800, marginTop: '2px' }}>₹{item.price * qty}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => removeFromCart(id)} style={{ background: '#CBD5E1', border: 'none', color: '#0F172A', width: '26px', height: '26px', borderRadius: '4px', cursor: 'pointer', fontWeight: 800 }}>-</button>
                      <span className="font-data-mono" style={{ fontSize: '13px', fontWeight: 800 }}>{qty}</span>
                      <button onClick={() => addToCart(id)} style={{ background: '#CBD5E1', border: 'none', color: '#0F172A', width: '26px', height: '26px', borderRadius: '4px', cursor: 'pointer', fontWeight: 800 }}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800 }}>
                <span>Total Amount:</span>
                <span className="font-data-mono" style={{ color: '#0077B6' }}>₹{cartTotal} INR</span>
              </div>
              <div className="font-data-mono" style={{ fontSize: '11px', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                <Truck size={14} /> 2-HOUR EXPRESS DOORSTEP DELIVERY GUARANTEED
              </div>
              <button onClick={() => { alert(`Express Order Placed! Total: ₹${cartTotal} INR. ABDM Health Locker Updated.`); setShowCartDrawer(false); }} style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', color: '#FFF', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEDIVERSE AI PORTAL LOGIN & REGISTRATION MODAL */}
      {showLoginModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ width: '460px', padding: '36px 32px', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 25px 60px rgba(15, 23, 42, 0.25)', position: 'relative', maxHeight: '94vh', overflowY: 'auto' }}>
            
            {/* Close Button */}
            <button onClick={() => setShowLoginModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: '#F1F5F9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={18} />
            </button>

            {/* TOGGLE TAB HEADER */}
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '14px', marginBottom: '22px', border: '1px solid #E2E8F0' }}>
              <button 
                type="button"
                onClick={() => setAuthMode('LOGIN')}
                style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none', background: authMode === 'LOGIN' ? 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)' : 'transparent', color: authMode === 'LOGIN' ? '#FFFFFF' : '#64748B', fontWeight: 800, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: authMode === 'LOGIN' ? '0 4px 14px rgba(2, 132, 199, 0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <LogIn size={14} /> LOG IN
              </button>
              <button 
                type="button"
                onClick={() => setAuthMode('REGISTER')}
                style={{ flex: 1, padding: '10px 16px', borderRadius: '10px', border: 'none', background: authMode === 'REGISTER' ? 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)' : 'transparent', color: authMode === 'REGISTER' ? '#FFFFFF' : '#64748B', fontWeight: 800, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: authMode === 'REGISTER' ? '0 4px 14px rgba(2, 132, 199, 0.3)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <UserCheck size={14} /> CREATE NEW ACCOUNT
              </button>
            </div>

            {authMode === 'LOGIN' ? (
              <>
                {/* BRAND HEADER MATCHING PROVIDED IMAGE */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #1B365D 0%, #27487F 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(27, 54, 93, 0.3)' }}>
                      <HeartPulse size={28} color="#00B4D8" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '26px', fontWeight: 800, color: '#1B365D', lineHeight: '1', letterSpacing: '-0.02em' }}>
                        MediVerse<sup style={{ fontSize: '11px', color: '#8FA334', fontWeight: 800, marginLeft: '3px' }}>AI</sup>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                        AI-Powered Health Solutions
                      </div>
                    </div>
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginTop: '16px', marginBottom: 0, letterSpacing: '-0.01em' }}>
                    Access Your MediVerse AI Portal
                  </h2>
                </div>

                {/* LOGIN FORM */}
                <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Role / Access Tier Select */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                      Portal Role / Access Tier
                    </label>
                    <select 
                      value={loginRole} 
                      onChange={(e) => setLoginRole(e.target.value as any)}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: '13px', fontWeight: 700, color: '#1B365D', outline: 'none' }}
                    >
                      <option value="PATIENT">Patient Portal (PHR Health Passport)</option>
                      <option value="DOCTOR">Doctor Clinical Cockpit (SaMD CDSS)</option>
                      <option value="RECEPTION">Reception Desk & NHCX Terminal</option>
                      <option value="NURSE">Smart Nursing Station & Telemetry</option>
                      <option value="LAB_TECH">Diagnostic Lab & LIMS Ingestion</option>
                    </select>
                  </div>

                  {/* Email / Username */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                      Email / Username
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <User size={18} color="#64748B" style={{ position: 'absolute', left: '16px' }} />
                      <input 
                        type="text"
                        placeholder="Enter your email"
                        value={loginForm.email || loginForm.name}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value, name: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px 16px 12px 46px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '16px' }} />
                      <input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        required
                        style={{ width: '100%', padding: '12px 46px 12px 46px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: '16px', background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      >
                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </div>
                    <div style={{ textAlign: 'right', marginTop: '6px' }}>
                      <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email!'); }} style={{ fontSize: '12px', color: '#1B365D', fontWeight: 700, textDecoration: 'none' }}>
                        Forgot Password?
                      </a>
                    </div>
                  </div>

                  {/* PERFECTLY ARRANGED PRIMARY LOG IN BUTTON */}
                  <button 
                    type="submit" 
                    className="primary-login-btn"
                  >
                    <LogIn size={17} strokeWidth={2.5} />
                    <span>LOG IN TO PORTAL</span>
                    <ArrowRight size={17} />
                  </button>
                </form>

                {/* DIVIDER */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
                  <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em' }}>OR LOG IN WITH</span>
                  <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
                </div>

                {/* SOCIAL LOGINS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button type="button" onClick={() => handleSocialLogin('Google')} className="social-login-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                      <span>Google</span>
                    </button>
                    <button type="button" onClick={() => handleSocialLogin('Apple')} className="social-login-btn">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.47c.65-.8 1.09-1.92.97-3.04-.94.04-2.08.63-2.75 1.42-.6.7-1.12 1.83-.98 2.93 1.05.08 2.11-.51 2.76-1.31z"/></svg>
                      <span>Apple</span>
                    </button>
                  </div>

                  <button type="button" onClick={() => handleSocialLogin('MediVerse Key')} className="social-login-btn" style={{ width: '100%' }}>
                    <Key size={16} color="#0284C7" />
                    <span>Continue with MediVerse Key</span>
                  </button>
                </div>

                {/* FOOTER LINKS */}
                <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#64748B' }}>
                  <div>
                    New to MediVerse AI?{' '}
                    <button type="button" onClick={() => setAuthMode('REGISTER')} style={{ background: 'transparent', border: 'none', color: '#1B365D', fontWeight: 800, cursor: 'pointer', textDecoration: 'none' }}>
                      Create an account.
                    </button>
                  </div>
                  <div style={{ marginTop: '6px' }}>
                    <a href="#support" onClick={(e) => { e.preventDefault(); alert('Support team connected: support@mediverse.ai | 1800-11-2026'); }} style={{ color: '#1B365D', fontWeight: 700, textDecoration: 'none' }}>
                      Contact Support
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* CREATE NEW PATIENT ACCOUNT HEADER */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #1B365D 0%, #27487F 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(27, 54, 93, 0.3)' }}>
                      <HeartPulse size={26} color="#00B4D8" />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#1B365D', lineHeight: '1', letterSpacing: '-0.02em' }}>
                        MediVerse<sup style={{ fontSize: '11px', color: '#8FA334', fontWeight: 800, marginLeft: '3px' }}>AI</sup>
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                        AI-Powered Health Solutions
                      </div>
                    </div>
                  </div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: '12px', marginBottom: 0 }}>
                    Create Your Patient Account
                  </h2>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Register for instant OPD booking, ABHA Passport & E-Pharmacy
                  </p>
                </div>

                {/* REGISTER FORM FOR NEW PATIENTS */}
                <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Full Name */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <User size={18} color="#64748B" style={{ position: 'absolute', left: '16px' }} />
                      <input 
                        type="text"
                        placeholder="Enter your full name"
                        value={registerForm.fullName}
                        onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px 16px 10px 46px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Mobile Number / ABHA ID */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                      Mobile Number / ABHA ID
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <ShieldCheck size={18} color="#64748B" style={{ position: 'absolute', left: '16px' }} />
                      <input 
                        type="text"
                        placeholder="Enter 10-digit mobile number or ABHA ID"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px 16px 10px 46px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Globe size={18} color="#64748B" style={{ position: 'absolute', left: '16px' }} />
                      <input 
                        type="email"
                        placeholder="Enter your email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px 16px 10px 46px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Password & Confirm Password */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                        Password
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '14px' }} />
                        <input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          required
                          style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', color: '#0F172A', outline: 'none' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                        Confirm
                      </label>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '14px' }} />
                        <input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm"
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                          required
                          style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', color: '#0F172A', outline: 'none' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Age & Gender */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                        Age (Years)
                      </label>
                      <input 
                        type="number"
                        placeholder="28"
                        value={registerForm.age}
                        onChange={(e) => setRegisterForm({ ...registerForm, age: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', color: '#0F172A', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                        Gender
                      </label>
                      <select 
                        value={registerForm.gender} 
                        onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', fontWeight: 700, color: '#0F172A', outline: 'none' }}
                      >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Medical Conditions / Allergies */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                      Pre-existing Conditions / Allergies
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g., Asthma, Hypertension, Peanut Allergy (optional)"
                      value={registerForm.illnesses}
                      onChange={(e) => setRegisterForm({ ...registerForm, illnesses: e.target.value })}
                      style={{ width: '100%', padding: '10px 16px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', color: '#0F172A', outline: 'none' }}
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <input 
                      type="checkbox"
                      id="termsCheck"
                      checked={registerForm.termsAccepted}
                      onChange={(e) => setRegisterForm({ ...registerForm, termsAccepted: e.target.checked })}
                      required
                    />
                    <label htmlFor="termsCheck" style={{ fontSize: '11px', color: '#475569' }}>
                      I agree to ABDM Digital Health Privacy Terms & Data Consent.
                    </label>
                  </div>

                  {/* CREATE PATIENT ACCOUNT BUTTON */}
                  <button 
                    type="submit" 
                    className="primary-login-btn"
                    style={{ 
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      boxShadow: '0 6px 22px rgba(16, 185, 129, 0.42)',
                      marginTop: '6px'
                    }}
                  >
                    <UserCheck size={18} strokeWidth={2.5} />
                    <span>CREATE PATIENT ACCOUNT</span>
                    <ArrowRight size={17} />
                  </button>
                </form>

                {/* SWITCH TO LOGIN */}
                <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#64748B' }}>
                  Already registered on MediVerse AI?{' '}
                  <button type="button" onClick={() => setAuthMode('LOGIN')} style={{ background: 'transparent', border: 'none', color: '#1B365D', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>
                    Log in here.
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* FLOATING CHATBOT WIDGET */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 90 }}>
        {!isChatOpen ? (
          <button onClick={() => setIsChatOpen(true)} style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', color: '#FFF', border: 'none', boxShadow: '0 8px 24px rgba(0, 180, 216, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <Bot size={28} />
          </button>
        ) : (
          <div className="glass-panel" style={{ width: '380px', height: '480px', display: 'flex', flexDirection: 'column', background: '#FFFFFF', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', color: '#FFF', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800 }}><Bot size={20} /> MediBot AI Assistant</div>
              <button onClick={() => setIsChatOpen(false)} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', background: msg.sender === 'user' ? '#0077B6' : '#F1F5F9', color: msg.sender === 'user' ? '#FFF' : '#0F172A', padding: '10px 14px', borderRadius: '10px', fontSize: '13px' }}>
                  {msg.text}
                </div>
              ))}
            </div>
            <div style={{ padding: '10px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', gap: '8px' }}>
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask MediBot AI..." style={{ flex: 1, border: '1px solid #CBD5E1', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
              <button onClick={() => handleSendMessage()} style={{ background: '#0077B6', color: '#FFF', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}><Send size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* NEW PAGE 1: LOCAL DISEASE / VIRUS OUTBREAK RADAR WITH CITY SELECTOR & INPUT */}
      {activePage === 'OUTBREAK_RADAR' && (() => {
        const activeCityData = getCityOutbreakData(outbreakCity);
        const totalCases = activeCityData.outbreaks.reduce((acc, curr) => acc + curr.activeCases, 0);

        return (
          <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Page Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Bug size={30} color="#DC2626" /> LOCAL VIRUS & DISEASE OUTBREAK RADAR
                </div>
                <div className="font-data-mono" style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  IDSP EPIDEMIOLOGICAL TELEMETRY • ACTIVE LOCATION: {activeCityData.city.toUpperCase()} (PIN {activeCityData.pincodeRange})
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: activeCityData.activeCriticalAlerts > 0 ? '#FEF2F2' : '#F0FDF4', border: `1px solid ${activeCityData.activeCriticalAlerts > 0 ? '#FCA5A5' : '#86EFAC'}`, color: activeCityData.activeCriticalAlerts > 0 ? '#991B1B' : '#166534', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} /> 
                  {activeCityData.activeCriticalAlerts > 0 ? `${activeCityData.activeCriticalAlerts} CRITICAL EPIDEMIC ALERT ACTIVE IN ${activeCityData.city.toUpperCase()}` : `LOW EPIDEMIC RISK IN ${activeCityData.city.toUpperCase()}`}
                </div>
              </div>
            </div>

            {/* INTERACTIVE CITY SELECTOR & CUSTOM CITY ENTRY BAR */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '20px 24px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Top Row: Search / Enter Custom City Input */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                  <MapPin size={18} color="#0077B6" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    value={outbreakCityInput}
                    onChange={(e) => setOutbreakCityInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && outbreakCityInput.trim()) {
                        setOutbreakCity(outbreakCityInput.trim());
                      }
                    }}
                    placeholder="Enter any city name, district or PIN code (e.g., Pune, Jaipur, Indore, Chandigarh, Kochi, Lucknow...)"
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 42px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      background: '#F8FAFC',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      color: '#0F172A',
                      outline: 'none',
                      transition: 'border-color 0.2s',
                      boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04)'
                    }}
                  />
                  {outbreakCityInput && (
                    <button
                      onClick={() => setOutbreakCityInput('')}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        display: 'flex',
                        padding: '4px'
                      }}
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    if (outbreakCityInput.trim()) {
                      setOutbreakCity(outbreakCityInput.trim());
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0, 180, 216, 0.35)',
                    transition: 'all 0.2s'
                  }}
                >
                  <Search size={15} />
                  <span>Scan City Telemetry</span>
                </button>
              </div>

              {/* Quick Select Preset Metro Cards */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#64748B', letterSpacing: '0.04em' }}>
                    POPULAR METRO NODES • CLICK TO SWITCH REGION:
                  </span>
                  <span className="font-data-mono" style={{ fontSize: '11px', color: '#0077B6', fontWeight: 700 }}>
                    ACTIVE NODE: <strong style={{ color: '#0F172A' }}>{activeCityData.city.toUpperCase()}</strong> ({totalCases.toLocaleString()} MONITORED CASES)
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                  {Object.keys(cityOutbreakDatabase).map((cityName) => {
                    const cityData = cityOutbreakDatabase[cityName];
                    const isSelected = outbreakCity.toLowerCase() === cityName.toLowerCase();
                    const hasCritical = cityData.activeCriticalAlerts > 0;

                    return (
                      <button
                        key={cityName}
                        onClick={() => {
                          setOutbreakCity(cityName);
                          setOutbreakCityInput(cityName);
                        }}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: isSelected ? '2px solid #00B4D8' : '1px solid #E2E8F0',
                          background: isSelected ? 'linear-gradient(135deg, rgba(0, 180, 216, 0.14) 0%, rgba(2, 132, 199, 0.08) 100%)' : '#F8FAFC',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '3px',
                          position: 'relative',
                          boxShadow: isSelected ? '0 4px 14px rgba(0, 180, 216, 0.25)' : 'none'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '12.5px', fontWeight: 800, color: isSelected ? '#0077B6' : '#0F172A' }}>{cityName}</span>
                          {hasCritical && (
                            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#DC2626', display: 'inline-block', boxShadow: '0 0 6px #DC2626' }} title="Critical Outbreak Active" />
                          )}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>{cityData.state}</span>
                          <span className="font-data-mono" style={{ fontWeight: 700, color: hasCritical ? '#DC2626' : '#16A34A' }}>
                            {cityData.outbreaks.length} Alerts
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* COMPLETE INTERACTIVE CITY PATIENT & EPIDEMIC HOTSPOT MAP */}
            <CityEpidemicPatientMap city={outbreakCity} />

            {/* Outbreaks Telemetry & Readiness Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
              {/* Left: Active Outbreaks List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeCityData.outbreaks.map(outbreak => (
                  <div key={outbreak.id} className="glass-panel" style={{ padding: '24px', background: '#FFFFFF', borderRadius: '14px', borderLeft: `6px solid ${outbreak.severity === 'CRITICAL' ? '#DC2626' : outbreak.severity === 'MODERATE' ? '#D97706' : '#16A34A'}`, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div className="font-data-mono" style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>{outbreak.type} • {outbreak.area}</div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>{outbreak.name}</div>
                      </div>
                      <span className="font-data-mono" style={{ background: outbreak.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB', color: outbreak.severity === 'CRITICAL' ? '#DC2626' : '#D97706', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>
                        {outbreak.severity} SEVERITY
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', margin: '16px 0', background: '#F8FAFC', padding: '12px', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Active Telemetry Cases</div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{outbreak.activeCases.toLocaleString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Weekly Surge Trend</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#DC2626' }}>{outbreak.trend}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Telemetry Updated</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0077B6' }}>{outbreak.lastUpdated}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '13px', color: '#334155', background: '#F0F9FF', border: '1px solid #BAE6FD', padding: '12px', borderRadius: '8px' }}>
                      <strong>Preventive Medical Guidelines:</strong> {outbreak.preventiveAdvice}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right: Hospital Vector Readiness & Helpline for Selected City */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '20px', background: '#FFFFFF', borderRadius: '12px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                    {outbreakCity} Vector Bed Readiness
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span>Vector Isolation Beds:</span>
                      <strong style={{ color: '#16A34A' }}>{activeCityData.isolationBedsAvailable} Available</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span>Blood Bank Platelet Units:</span>
                      <strong style={{ color: '#0077B6' }}>{activeCityData.bloodPlateletsReady} Units Ready</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span>Monitored Pincode Range:</span>
                      <strong className="font-data-mono" style={{ color: '#64748B' }}>{activeCityData.pincodeRange}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#0F172A', color: '#FFF', padding: '20px', borderRadius: '12px' }}>
                  <div className="font-data-mono" style={{ fontSize: '11px', color: '#00B4D8', fontWeight: 800 }}>EPIDEMIC SURVEILLANCE CELL</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, marginTop: '4px' }}>{activeCityData.helplineLabel}</div>
                  <div className="font-data-mono" style={{ fontSize: '20px', color: '#00B4D8', fontWeight: 800, marginTop: '8px' }}>{activeCityData.helpline}</div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* NEW PAGE 2: LOCAL HEALTHCARE NEWS & UPDATES */}
      {activePage === 'HEALTH_NEWS' && (
        <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Newspaper size={30} color="#0077B6" /> LOCAL HEALTHCARE NEWS & POLICY UPDATES
              </div>
              <div className="font-data-mono" style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                VERIFIED PRESS ADVISORIES • REGION: DELHI NCR & NATIONAL HEALTH NETWORK
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
            {localHealthNews.map(news => (
              <div key={news.id} className="glass-panel" style={{ background: '#FFFFFF', borderRadius: '14px', overflow: 'hidden', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <img src={news.image} alt={news.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
                  <div style={{ padding: '18px' }}>
                    <div className="font-data-mono" style={{ fontSize: '11px', color: '#0077B6', fontWeight: 800 }}>{news.category} • {news.date}</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '8px 0 10px 0', lineHeight: '1.3' }}>{news.title}</h3>
                    <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>{news.summary}</p>
                  </div>
                </div>

                <div style={{ padding: '14px 18px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-data-mono" style={{ fontSize: '10px', color: '#475569', fontWeight: 700 }}>{news.source}</span>
                  <button onClick={() => alert(`Full advisory opened for: ${news.title}`)} style={{ background: 'transparent', border: 'none', color: '#0077B6', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>
                    Read Full Advisory &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* OTHER B2C COMMON PAGES */}
      {activePage === 'PATIENT_PHR' && (
        <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={28} color="#0077B6" /> HOLOGRAPHIC ABHA DIGITAL HEALTH PASSPORT
          </div>
        </div>
      )}

      {activePage === 'DOCTOR_COCKPIT' && (
        <div style={{ flex: 1, display: 'flex', background: '#0F172A', color: '#FFF' }}>
          <main style={{ flex: 1, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#00B4D8' }}>Doctor Clinical Cockpit Active</div>
          </main>
        </div>
      )}

      {activePage === 'RECEPTION_NHCX' && (
        <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>NHCX Cashless Claims Terminal</div>
        </div>
      )}

      {activePage === 'NURSE_TELEMETRY' && (
        <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626' }}>Smart Nursing Station Active</div>
        </div>
      )}

      {activePage === 'LAB_ACCESSION' && (
        <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#D97706' }}>Diagnostic Lab LIMS Queue</div>
        </div>
      )}

      {/* ULTRA-RICH EXTENDED 4-SCROLL B2C HOME LANDING PAGE */}
      {activePage === 'HOME' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* FULL SCREEN HERO SECTION WITH SMOOTH IMAGE TRANSITION & POPPING LOGIN BUTTON */}
          <section style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#0F172A', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '100px 24px 60px' }}>
            {/* Background Image Transition covering full screen */}
            <div 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                backgroundImage: `url(${activeSlide.image})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                filter: 'brightness(0.50)', 
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)', 
                transform: 'scale(1.02)' 
              }} 
            />
            {/* Dark & Luminous Overlay */}
            <div 
              style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'radial-gradient(circle at center, rgba(15, 23, 42, 0.4) 0%, rgba(15, 23, 42, 0.85) 100%), linear-gradient(to bottom, rgba(15, 23, 42, 0.5) 0%, transparent 40%, rgba(15, 23, 42, 0.95) 100%)' 
              }} 
            />

            {/* CENTERED HERO CONTENT (BADGE, HEADLINE, SUBTITLE, SLIDE CTA & DOTS) */}
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '920px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 24px', margin: 'auto' }}>
              
              {/* Illuminated Jewel Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 18px', borderRadius: '30px', background: 'rgba(0, 242, 254, 0.15)', border: '1px solid rgba(0, 242, 254, 0.45)', color: '#00F2FE', fontSize: '11.5px', fontWeight: 800, width: 'fit-content', marginBottom: '18px', boxShadow: '0 0 20px rgba(0, 242, 254, 0.25)' }}>
                <Sparkles size={15} /> {activeSlide.badge}
              </div>

              {/* Giant Futuristic Headline */}
              <h1 style={{ fontSize: '50px', fontWeight: 900, color: '#FFFFFF', maxWidth: '860px', margin: '0 0 16px 0', lineHeight: '1.12', letterSpacing: '-0.025em', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                {activeSlide.title}
              </h1>

              {/* Explanatory Subtitle */}
              <p style={{ fontSize: '17px', color: '#E2E8F0', maxWidth: '720px', margin: '0 0 26px 0', lineHeight: '1.6', textShadow: '0 2px 10px rgba(0,0,0,0.4)' }}>
                {activeSlide.subtitle}
              </p>
              
              {/* 1. MODEL / SLIDE CTA ACTION BUTTON & CAROUSEL SWITCHER */}
              {/* 1. Primary Model Action Button */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button 
                  onClick={() => setActivePage(activeSlide.targetPage)} 
                  style={{ 
                    background: 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)', 
                    color: '#FFFFFF', 
                    border: '1px solid rgba(255, 255, 255, 0.35)', 
                    padding: '13px 34px', 
                    borderRadius: '30px', 
                    fontWeight: 800, 
                    fontSize: '14px', 
                    cursor: 'pointer', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '9px', 
                    boxShadow: '0 6px 24px rgba(2, 132, 199, 0.55)',
                    transition: 'all 0.22s ease-in-out'
                  }}
                >
                  <span>{activeSlide.ctaText}</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              {/* 2. SLEEK PROFESSIONAL SLIDER INDICATOR BAR (NO ARROW BUTTONS) */}
              <div style={{ 
                marginTop: '24px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'rgba(15, 23, 42, 0.75)', 
                backdropFilter: 'blur(20px)', 
                padding: '7px 14px', 
                borderRadius: '30px', 
                border: '1px solid rgba(255, 255, 255, 0.16)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
              }}>
                {heroSlides.map((slide, idx) => {
                  const isSelected = currentSlide === idx;
                  const shortLabels = ['3D PACS', 'ABDM M3', 'CDSS AI', '108 SOS'];
                  return (
                    <button
                      key={slide.id}
                      onClick={() => setCurrentSlide(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isSelected ? '7px' : '0px',
                        padding: isSelected ? '5px 14px' : '5px 8px',
                        borderRadius: '20px',
                        background: isSelected ? 'rgba(0, 242, 254, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1px solid rgba(0, 242, 254, 0.5)' : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: isSelected ? '0 0 16px rgba(0, 242, 254, 0.35)' : 'none'
                      }}
                      title={slide.title}
                    >
                      <span
                        style={{
                          width: isSelected ? '16px' : '8px',
                          height: '7px',
                          borderRadius: '4px',
                          background: isSelected ? 'linear-gradient(90deg, #00F2FE 0%, #38BDF8 100%)' : 'rgba(255, 255, 255, 0.35)',
                          transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                          display: 'inline-block',
                          boxShadow: isSelected ? '0 0 10px #00F2FE' : 'none'
                        }}
                      />
                      {isSelected && (
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 800, 
                            color: '#00F2FE', 
                            letterSpacing: '0.04em',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {shortLabels[idx]}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>

            {/* MEDIVERSE MANAGER PREMIUM LOGIN PLATFORM BUTTON */}
            <div style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: 'max-content' }}>
              <button 
                onClick={() => {
                  const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port;
                  window.open(isLocal ? 'http://localhost:5174' : '/manager/', '_blank');
                }} 
                style={{
                  background: 'linear-gradient(135deg, #00F2FE 0%, #0284C7 50%, #0077B6 100%)',
                  color: '#FFFFFF',
                  border: '1.5px solid rgba(255, 255, 255, 0.65)',
                  padding: '14px 36px',
                  borderRadius: '35px',
                  fontSize: '13.5px',
                  fontWeight: 900,
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 32px rgba(0, 242, 254, 0.55), 0 0 20px rgba(2, 132, 199, 0.4)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 242, 254, 0.75), 0 0 30px rgba(0, 242, 254, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 242, 254, 0.55), 0 0 20px rgba(2, 132, 199, 0.4)';
                }}
                title="Open ManagerAI Enterprise Sovereign Hospital Operations OS"
              >
                <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={15} color="#FFFFFF" />
                </div>
                <span>MEDIVERSE MANAGER PREMIUM LOGIN PLATFORM</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </button>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, letterSpacing: '0.04em', textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>
                STITCH BIO-TECH SOVEREIGN EDITION • MULTI-PORTAL OPERATIONS OS
              </div>
            </div>
          </section>

          <section style={{ padding: '48px 48px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid rgba(0, 180, 216, 0.3)', borderRadius: '16px', padding: '32px', boxShadow: '0 10px 30px rgba(0, 180, 216, 0.08)', marginBottom: '40px' }}>
              <div className="font-data-mono" style={{ fontSize: '12px', color: '#0077B6', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Stethoscope size={16} /> BAYESIAN CLINICAL TRIAGE OMNIBAR
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                <input type="text" value={triageQuery} onChange={(e) => setTriageQuery(e.target.value)} placeholder='Describe symptoms...' style={{ flex: 1, background: '#F8FAFC', border: '1px solid #CBD5E1', color: '#0F172A', padding: '16px', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                <button onClick={() => handleTriageExecute()} style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', color: '#FFFFFF', border: 'none', padding: '0 32px', borderRadius: '8px', fontWeight: 800, fontSize: '14px', cursor: 'pointer' }}>Analyze Live</button>
              </div>
              {triageResult && (
                <div style={{ marginTop: '16px', background: '#F0F9FF', borderLeft: '4px solid #00B4D8', padding: '16px', borderRadius: '6px' }}>
                  <div style={{ color: '#0077B6', fontWeight: 800, fontSize: '14px' }}>TRIAGE CATEGORY: {triageResult.riskLevel}</div>
                  <div style={{ fontSize: '13px', color: '#0F172A', marginTop: '4px' }}>{triageResult.summary}</div>
                </div>
              )}
            </div>

            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '24px' }}>
              SOVEREIGN CLINICAL PLATFORM PILLARS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
              <div className="glass-panel" style={{ padding: '28px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(0,180,216,0.1)', color: '#0077B6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Brain size={26} />
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>3D WebGPU PACS</div>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>MONAI Swin UNETR 3D CT/MRI segmentation with Grad-CAM overlays and zero local footprint.</p>
              </div>

              <div className="glass-panel" style={{ padding: '28px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(22,163,74,0.1)', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Pill size={26} />
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Express E-Pharmacy</div>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>ABDM M3 e-prescription linked ordering with guaranteed 2-hour doorstep delivery.</p>
              </div>

              <div 
                className="glass-panel" 
                onClick={() => window.open('http://localhost:5175', '_blank')}
                style={{ 
                  padding: '28px', 
                  background: '#FFFFFF', 
                  borderRadius: '16px', 
                  border: '1.5px solid #FCA5A5', 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 20px rgba(239, 68, 68, 0.08)'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(239, 68, 68, 0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(239, 68, 68, 0.08)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)' }}>
                    <Ambulance size={26} />
                  </div>
                  <span style={{ fontSize: '10.5px', background: 'rgba(239, 68, 68, 0.15)', color: '#DC2626', border: '1px solid #FCA5A5', padding: '3px 9px', borderRadius: '12px', fontWeight: 800 }}>
                    OPEN EMERGENCY OS ↗
                  </span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>ACLS Emergency SOS OS</div>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: 0 }}>Area-by-area GPS ambulance fleet, vacant ventilators, oxygen cryogenic reserves & emergency triage.</p>
              </div>
            </div>
          </section>
        </div>
      )}

      {activePage === 'LOGIN' && (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)', padding: '40px 20px' }}>
          <div style={{ width: '440px', padding: '36px 32px', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 25px 60px rgba(15, 23, 42, 0.12)' }}>
            
            {/* BRAND HEADER MATCHING PROVIDED IMAGE */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #1B365D 0%, #27487F 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 18px rgba(27, 54, 93, 0.3)' }}>
                  <HeartPulse size={28} color="#00B4D8" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#1B365D', lineHeight: '1', letterSpacing: '-0.02em' }}>
                    MediVerse<sup style={{ fontSize: '11px', color: '#8FA334', fontWeight: 800, marginLeft: '3px' }}>AI</sup>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600, marginTop: '2px' }}>
                    AI-Powered Health Solutions
                  </div>
                </div>
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginTop: '16px', marginBottom: 0, letterSpacing: '-0.01em' }}>
                Access Your MediVerse AI Portal
              </h2>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Role / Access Tier Select */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Portal Role / Access Tier
                </label>
                <select 
                  value={loginRole} 
                  onChange={(e) => setLoginRole(e.target.value as any)}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: '13px', fontWeight: 700, color: '#1B365D', outline: 'none' }}
                >
                  <option value="PATIENT">Patient Portal (PHR Health Passport)</option>
                  <option value="DOCTOR">Doctor Clinical Cockpit (SaMD CDSS)</option>
                  <option value="RECEPTION">Reception Desk & NHCX Terminal</option>
                  <option value="NURSE">Smart Nursing Station & Telemetry</option>
                  <option value="LAB_TECH">Diagnostic Lab & LIMS Ingestion</option>
                </select>
              </div>

              {/* Email / Username */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Email / Username
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User size={18} color="#64748B" style={{ position: 'absolute', left: '16px' }} />
                  <input 
                    type="text"
                    placeholder="Enter your email"
                    value={loginForm.email || loginForm.name}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px 16px 12px 46px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '16px' }} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    style={{ width: '100%', padding: '12px 46px 12px 46px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '16px', background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
                <div style={{ textAlign: 'right', marginTop: '6px' }}>
                  <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to your registered email!'); }} style={{ fontSize: '12px', color: '#1B365D', fontWeight: 700, textDecoration: 'none' }}>
                    Forgot Password?
                  </a>
                </div>
              </div>

              {/* PERFECTLY ARRANGED PRIMARY LOG IN BUTTON */}
              <button 
                type="submit" 
                className="primary-login-btn"
              >
                <LogIn size={17} strokeWidth={2.5} />
                <span>LOG IN TO PORTAL</span>
                <ArrowRight size={17} />
              </button>
            </form>

            {/* DIVIDER */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, letterSpacing: '0.05em' }}>OR LOG IN WITH</span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>

            {/* SOCIAL LOGINS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button type="button" onClick={() => handleSocialLogin('Google')} className="social-login-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                  <span>Google</span>
                </button>
                <button type="button" onClick={() => handleSocialLogin('Apple')} className="social-login-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.47c.65-.8 1.09-1.92.97-3.04-.94.04-2.08.63-2.75 1.42-.6.7-1.12 1.83-.98 2.93 1.05.08 2.11-.51 2.76-1.31z"/></svg>
                  <span>Apple</span>
                </button>
              </div>

              <button type="button" onClick={() => handleSocialLogin('MediVerse Key')} className="social-login-btn" style={{ width: '100%' }}>
                <Key size={16} color="#0284C7" />
                <span>Continue with MediVerse Key</span>
              </button>
            </div>

            {/* FOOTER LINKS */}
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#64748B' }}>
              <div>
                New to MediVerse AI?{' '}
                <a href="#create" onClick={(e) => { e.preventDefault(); alert('Create Account feature opened. Enter your details to register.'); }} style={{ color: '#1B365D', fontWeight: 800, textDecoration: 'none' }}>
                  Create an account.
                </a>
              </div>
              <div style={{ marginTop: '6px' }}>
                <a href="#support" onClick={(e) => { e.preventDefault(); alert('Support team connected: support@mediverse.ai | 1800-11-2026'); }} style={{ color: '#1B365D', fontWeight: 700, textDecoration: 'none' }}>
                  Contact Support
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

      {activePage === 'EMERGENCY_SYSTEM' && <EmergencyManagementPortal />}

      {activePage === 'BUY_MEDICINES' && (
        <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pill size={28} color="#0077B6" /> E-PHARMACY & MEDICINE GRID
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            {medicineCatalog.map(med => (
              <div key={med.id} className="glass-panel" style={{ padding: '16px', background: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <img src={med.image} alt={med.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }} />
                  <div style={{ fontWeight: 700, fontSize: '16px', marginTop: '10px', color: '#0F172A' }}>{med.name}</div>
                  <div className="font-data-mono" style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{med.category}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                  <div className="font-data-mono" style={{ fontSize: '16px', fontWeight: 800, color: '#0077B6' }}>₹{med.price}</div>
                  <button onClick={() => addToCart(med.id)} style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>Add to Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activePage === 'MEDICAL_MAP' && (() => {
        const cityFacilities = getCityFacilities(selectedCity);
        const filteredFacilities = cityFacilities.filter(fac => {
          const matchesCategory = facilityFilter === 'ALL' || fac.type === facilityFilter;
          const matchesQuery = searchQuery.trim() === '' ||
            fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fac.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            fac.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
          return matchesCategory && matchesQuery;
        });

        const activeMapFacility = filteredFacilities.find(f => f.id === activeFacility?.id) || filteredFacilities[0] || cityFacilities[0];
        const totalIcuBedsInCity = cityFacilities.reduce((a, b) => a + b.icuBedsAvailable, 0);
        const totalOxygenBedsInCity = cityFacilities.reduce((a, b) => a + b.oxygenBedsAvailable, 0);

        return (
          <div style={{ padding: '28px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '22px', background: '#F8FAFC' }}>
            
            {/* 1. TOP EMERGENCY COMMAND & 108 SOS DISPATCH RIBBON */}
            <div style={{
              background: 'linear-gradient(135deg, #070D1E 0%, #0A1428 100%)',
              border: '1px solid rgba(0, 242, 254, 0.35)',
              borderRadius: '16px',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              boxShadow: '0 12px 36px rgba(7, 13, 30, 0.4)',
              color: '#FFFFFF'
            }}>
              {/* Left Live Telemetry Banner */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ position: 'relative', width: '14px', height: '14px' }}>
                  <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#EF4444', animation: 'map-pulse 2s infinite' }} />
                  <div style={{ position: 'absolute', inset: 2, borderRadius: '50%', background: '#EF4444' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '0.02em' }}>
                      NATIONAL EMERGENCY CLINICAL COMMAND & 108 DISPATCH
                    </span>
                    <span className="font-data-mono" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #EF4444', color: '#FCA5A5', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800 }}>
                      LIVE REGION: {selectedCity.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-data-mono" style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    ALL REGIONAL TRAUMA BAYS • ICU VENTILATORS • LIQUID O2 RESERVES LINKED TO ABDM M3 MESH
                  </div>
                </div>
              </div>

              {/* Center Metrics Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: 'rgba(0, 242, 254, 0.15)', border: '1px solid rgba(0, 242, 254, 0.4)', borderRadius: '8px', padding: '6px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 700 }}>LIVE ICU BEDS</div>
                    <div className="font-data-mono" style={{ fontSize: '14px', fontWeight: 900, color: '#00F2FE' }}>
                      {totalIcuBedsInCity} Ready
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '8px', padding: '6px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 700 }}>O2 RESERVES</div>
                    <div className="font-data-mono" style={{ fontSize: '14px', fontWeight: 900, color: '#38BDF8' }}>
                      {totalOxygenBedsInCity} Cylinders
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.4)', borderRadius: '8px', padding: '6px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: '9.5px', color: '#94A3B8', fontWeight: 700 }}>ACLS FLEET</div>
                    <div className="font-data-mono" style={{ fontSize: '14px', fontWeight: 900, color: '#4ADE80' }}>
                      28 Active
                    </div>
                  </div>
                </div>

                {/* 108 SOS Trigger Button & Link to Emergency Management System */}
                <button
                  onClick={() => setShowDispatchModal(activeMapFacility)}
                  style={{
                    background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                    color: '#FFFFFF',
                    border: '1.5px solid #FCA5A5',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)',
                    letterSpacing: '0.04em'
                  }}
                >
                  <Ambulance size={16} />
                  <span>1-CLICK 108 SOS</span>
                </button>

                <button
                  onClick={() => window.open('http://localhost:5175', '_blank')}
                  style={{
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.35) 100%)',
                    color: '#FCA5A5',
                    border: '1px solid rgba(239, 68, 68, 0.6)',
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '11.5px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 0 16px rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <Activity size={14} />
                  <span>EMERGENCY SOS OS ↗</span>
                </button>
              </div>
            </div>

            {/* 2. THE CLINICAL CARE COMMAND COCKPIT (62% MAP / 38% CONTROL & SPOTLIGHT) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: '22px', alignItems: 'start' }}>
              
              {/* LEFT: INTERACTIVE CITY HEALTHCARE GIS RADAR MAP */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={22} color="#0077B6" />
                    <span>PRECISION HEALTHCARE GIS & TRAUMA MESH</span>
                  </div>
                  
                  {/* View Mode Switcher */}
                  <div style={{ display: 'flex', gap: '4px', background: '#E2E8F0', padding: '3px', borderRadius: '8px' }}>
                    <button
                      onClick={() => setMapMode('PHYSICAL_MAP')}
                      style={{
                        background: mapMode === 'PHYSICAL_MAP' ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)' : 'transparent',
                        color: mapMode === 'PHYSICAL_MAP' ? '#FFFFFF' : '#475569',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Map size={13} />
                      <span>City GIS Radar</span>
                    </button>
                    <button
                      onClick={() => setMapMode('GLOBE')}
                      style={{
                        background: mapMode === 'GLOBE' ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)' : 'transparent',
                        color: mapMode === 'GLOBE' ? '#FFFFFF' : '#475569',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <Globe size={13} />
                      <span>3D Globe</span>
                    </button>
                  </div>
                </div>

                {mapMode === 'GLOBE' ? (
                  <div style={{ background: '#0F172A', borderRadius: '18px', padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 180, 216, 0.3)', minHeight: '440px' }}>
                    <StitchThreeGlobe selectedCity={selectedCity} onSelectCity={handleSelectCityLocation} />
                  </div>
                ) : (
                  <CityHealthcareGisMap
                    city={selectedCity}
                    facilities={filteredFacilities}
                    activeFacility={activeMapFacility}
                    onSelectFacility={(fac) => setActiveFacility(fac)}
                    activeLayer={activeMapLayer}
                    onChangeLayer={(layer) => setActiveMapLayer(layer)}
                  />
                )}
              </div>

              {/* RIGHT: CONTROL OMNIBAR & FOCUSED LIVE HOSPITAL SPOTLIGHT */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* Search & City Corridor Omnibar Card */}
                <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', padding: '18px', boxShadow: '0 4px 16px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  
                  {/* Location & Pincode Input */}
                  <div style={{ position: 'relative' }}>
                    <MapPin size={17} color="#0077B6" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Enter city, locality, or PIN (e.g. New Delhi, Mumbai, 110017)..."
                      value={selectedCityInput}
                      onChange={(e) => setSelectedCityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && selectedCityInput.trim()) {
                          setSelectedCity(selectedCityInput.trim());
                        }
                      }}
                      style={{
                        width: '100%',
                        padding: '11px 14px 11px 38px',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        background: '#F8FAFC',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none'
                      }}
                    />
                    {selectedCityInput && (
                      <button
                        onClick={() => setSelectedCityInput('')}
                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '3px' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* Filter by Specialty / Treatment */}
                  <div style={{ position: 'relative' }}>
                    <Search size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="Filter by treatment or doctor (e.g. Cardiology, MRI)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px 10px 36px',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        background: '#F8FAFC',
                        fontSize: '12.5px',
                        fontWeight: 600,
                        color: '#0F172A',
                        outline: 'none'
                      }}
                    />
                  </div>

                  {/* Metro Quick Corridor Strip */}
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', marginBottom: '8px', letterSpacing: '0.03em' }}>
                      METRO HEALTHCARE HUBS:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                      {['New Delhi', 'Mumbai', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'].map((cName) => {
                        const isSelected = selectedCity.toLowerCase() === cName.toLowerCase();
                        return (
                          <button
                            key={cName}
                            onClick={() => {
                              setSelectedCity(cName);
                              setSelectedCityInput('');
                            }}
                            style={{
                              background: isSelected ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)' : '#F1F5F9',
                              color: isSelected ? '#FFFFFF' : '#334155',
                              border: isSelected ? '1px solid #0077B6' : '1px solid #E2E8F0',
                              borderRadius: '8px',
                              padding: '6px 4px',
                              fontSize: '10.5px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              textAlign: 'center',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              transition: 'all 0.2s',
                              boxShadow: isSelected ? '0 2px 8px rgba(0, 180, 216, 0.35)' : 'none'
                            }}
                            title={cName}
                          >
                            {cName}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Facility Category Filter Pills */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                    {[
                      { key: 'ALL', label: 'All Types' },
                      { key: 'HOSPITAL', label: '24/7 Super Speciality' },
                      { key: 'TESTING_LAB', label: 'MRI & Labs' },
                      { key: 'SPECIALIST', label: 'Specialist Hubs' },
                      { key: 'CLINIC', label: 'OPD Clinics' }
                    ].map(fType => (
                      <button
                        key={fType.key}
                        onClick={() => setFacilityFilter(fType.key)}
                        style={{
                          background: facilityFilter === fType.key ? '#0F172A' : '#F8FAFC',
                          color: facilityFilter === fType.key ? '#38BDF8' : '#64748B',
                          border: facilityFilter === fType.key ? '1px solid #0F172A' : '1px solid #CBD5E1',
                          padding: '4px 10px',
                          borderRadius: '16px',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        {fType.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ACTIVE FOCUSED HOSPITAL LIVE SPOTLIGHT DOSSIER */}
                {activeMapFacility && (
                  <div style={{
                    background: '#FFFFFF',
                    border: '2px solid #0077B6',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 8px 24px rgba(0, 119, 182, 0.15)',
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    {/* Header Image & Status */}
                    <div style={{ position: 'relative', height: '140px', width: '100%' }}>
                      <img
                        src={activeMapFacility.image}
                        alt={activeMapFacility.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 60%)' }} />
                      
                      <div style={{ position: 'absolute', top: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ background: 'rgba(15, 23, 42, 0.9)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800 }}>
                          {activeMapFacility.accreditation}
                        </span>
                        <span style={{ background: 'rgba(22, 163, 74, 0.9)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '12px', fontSize: '9.5px', fontWeight: 800 }}>
                          ⭐ {activeMapFacility.rating}
                        </span>
                      </div>

                      <div style={{ position: 'absolute', bottom: '8px', left: '12px', right: '12px', color: '#FFFFFF' }}>
                        <div style={{ fontSize: '15px', fontWeight: 900 }}>{activeMapFacility.name}</div>
                        <div style={{ fontSize: '11px', color: '#CBD5E1' }}>📍 {activeMapFacility.address}</div>
                      </div>
                    </div>

                    {/* Live Bed Telemetry Matrix */}
                    <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: '#F8FAFC', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                        <div>
                          <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700 }}>ICU Ready</div>
                          <div style={{ fontSize: '14px', fontWeight: 900, color: '#16A34A' }}>
                            {activeMapFacility.icuBedsAvailable > 0 ? `${activeMapFacility.icuBedsAvailable} Beds` : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700 }}>Oxygen Beds</div>
                          <div style={{ fontSize: '14px', fontWeight: 900, color: '#0077B6' }}>
                            {activeMapFacility.oxygenBedsAvailable > 0 ? `${activeMapFacility.oxygenBedsAvailable} Beds` : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700 }}>ER Wait Time</div>
                          <div style={{ fontSize: '13px', fontWeight: 900, color: '#DC2626' }}>
                            {activeMapFacility.erWaitTime}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B' }}>
                        <span>👨‍⚕️ <strong>{activeMapFacility.doctorsOnDuty} Specialists</strong> on shift</span>
                        <span className="font-data-mono" style={{ color: '#0077B6', fontWeight: 800 }}>⚡ {activeMapFacility.satisfaction}</span>
                      </div>

                      {/* Action CTAs */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                        <button
                          onClick={() => setBookingFacility(activeMapFacility)}
                          style={{
                            background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 8px rgba(0, 180, 216, 0.35)'
                          }}
                        >
                          <Calendar size={13} />
                          <span>Book OPD / Bed</span>
                        </button>

                        <button
                          onClick={() => setShowDispatchModal(activeMapFacility)}
                          style={{
                            background: '#0F172A',
                            color: '#38BDF8',
                            border: '1px solid #1E293B',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                          }}
                        >
                          <Ambulance size={13} />
                          <span>108 Dispatch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. UNIVERSAL HEALTHCARE DIRECTORY & COMPARISON MATRIX (WIDE MULTI-COLUMN CARDS) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
              
              {/* Directory Header Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building2 size={24} color="#0077B6" />
                    <span>VERIFIED HOSPITALS & HEALTHCARE FACILITIES IN {selectedCity.toUpperCase()}</span>
                  </div>
                  <div className="font-data-mono" style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                    DISPLAYING {filteredFacilities.length} VERIFIED NODES • ABDM M3 CERTIFIED TELEMETRY
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span className="font-data-mono" style={{ background: '#F0FDF4', color: '#166534', border: '1px solid #86EFAC', padding: '5px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                    🟢 100% ABDM M3 COMPLIANT NETWORK
                  </span>
                </div>
              </div>

              {/* Multi-Column Wide Facility Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(370px, 1fr))', gap: '20px' }}>
                {filteredFacilities.map(fac => {
                  const isSelected = activeMapFacility?.id === fac.id;
                  const isHospital = fac.type === 'HOSPITAL';
                  const isLab = fac.type === 'TESTING_LAB';

                  return (
                    <div
                      key={fac.id}
                      onClick={() => setActiveFacility(fac)}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '16px',
                        border: isSelected ? '2.5px solid #0077B6' : '1px solid #E2E8F0',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: isSelected ? '0 10px 30px rgba(0, 119, 182, 0.18)' : '0 4px 16px rgba(0,0,0,0.04)',
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        cursor: 'pointer',
                        transform: isSelected ? 'translateY(-3px)' : 'none'
                      }}
                    >
                      {/* Facility Photo with Overlay Badges */}
                      <div style={{ position: 'relative', height: '165px', width: '100%', overflow: 'hidden' }}>
                        <img
                          src={fac.image}
                          alt={fac.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s ease' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.8) 0%, transparent 60%)' }} />
                        
                        {/* Top Accreditation & 24/7 Badges */}
                        <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.4)', padding: '3px 10px', borderRadius: '20px', fontSize: '10.5px', fontWeight: 800 }}>
                            {fac.accreditation}
                          </span>
                          {fac.open24x7 && (
                            <span style={{ background: 'rgba(22, 163, 74, 0.9)', color: '#FFFFFF', padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Clock size={11} /> 24/7 ER ACTIVE
                            </span>
                          )}
                        </div>

                        {/* Bottom Distance & Satisfaction */}
                        <div style={{ position: 'absolute', bottom: '10px', left: '14px', right: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#FFFFFF' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700 }}>
                            <Navigation size={13} color="#00F2FE" />
                            <span>{fac.distance} away</span>
                          </div>
                          <span className="font-data-mono" style={{ fontSize: '10.5px', color: '#4ADE80', fontWeight: 800 }}>
                            {fac.satisfaction}
                          </span>
                        </div>
                      </div>

                      {/* Facility Body Details */}
                      <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                        
                        {/* Title & Rating */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                            <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: '1.3' }}>
                              {fac.name}
                            </h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', background: '#FEF3C7', color: '#D97706', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 800, whiteSpace: 'nowrap' }}>
                              <Star size={12} fill="#D97706" color="#D97706" /> {fac.rating}
                            </div>
                          </div>
                          <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0', lineHeight: '1.4' }}>
                            {fac.address}
                          </p>
                        </div>

                        {/* Speciality Tags */}
                        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                          {fac.tags.map((tag, idx) => (
                            <span key={idx} style={{ background: '#F1F5F9', color: '#475569', border: '1px solid #E2E8F0', padding: '2px 7px', borderRadius: '6px', fontSize: '10.5px', fontWeight: 700 }}>
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Live Bed Telemetry Matrix */}
                        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 12px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                          <div>
                            <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700 }}>ICU Beds</div>
                            <div style={{ fontSize: '13.5px', fontWeight: 900, color: fac.icuBedsAvailable > 0 ? '#16A34A' : '#64748B' }}>
                              {fac.icuBedsAvailable > 0 ? `${fac.icuBedsAvailable} Ready` : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700 }}>Oxygen Beds</div>
                            <div style={{ fontSize: '13.5px', fontWeight: 900, color: fac.oxygenBedsAvailable > 0 ? '#0077B6' : '#64748B' }}>
                              {fac.oxygenBedsAvailable > 0 ? `${fac.oxygenBedsAvailable} Ready` : 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '9.5px', color: '#64748B', fontWeight: 700 }}>ER Wait Time</div>
                            <div style={{ fontSize: '13px', fontWeight: 900, color: '#DC2626' }}>
                              {fac.erWaitTime}
                            </div>
                          </div>
                        </div>

                        {/* Duty Staff Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B' }}>
                          <span>👨‍⚕️ <strong>{fac.doctorsOnDuty} Specialists</strong> On Duty</span>
                          <span className="font-data-mono" style={{ color: '#0077B6', fontWeight: 700 }}>📞 {fac.phone}</span>
                        </div>
                      </div>

                      {/* Wide Facility Card Action Footer */}
                      <div style={{ padding: '12px 18px', background: '#F8FAFC', borderTop: '1px solid #E2E8F0', display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '8px' }}>
                        <a
                          href={`tel:${fac.phone}`}
                          style={{
                            background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                            color: '#FFFFFF',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 6px rgba(0, 180, 216, 0.3)'
                          }}
                        >
                          <PhoneCall size={12} />
                          <span>Emergency ER</span>
                        </a>

                        <button
                          onClick={() => setBookingFacility(fac)}
                          style={{
                            background: '#FFFFFF',
                            color: '#0077B6',
                            border: '1.5px solid #0077B6',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '11.5px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                          }}
                        >
                          <Calendar size={12} />
                          <span>Book OPD / Bed</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveFacility(fac);
                            window.scrollTo({ top: 200, behavior: 'smooth' });
                          }}
                          style={{
                            background: isSelected ? '#0F172A' : '#E2E8F0',
                            color: isSelected ? '#38BDF8' : '#475569',
                            border: 'none',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '4px'
                          }}
                          title="Center pin on radar map"
                        >
                          <MapPin size={12} />
                          <span>Pin</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredFacilities.length === 0 && (
                <div style={{ padding: '40px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>No medical facilities matched your query</div>
                  <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
                    Try searching for another city, clearing your specialty filter, or checking regional hospital clusters.
                  </p>
                  <button
                    onClick={() => {
                      setFacilityFilter('ALL');
                      setSearchQuery('');
                    }}
                    style={{ background: '#0077B6', color: '#FFF', border: 'none', padding: '8px 18px', borderRadius: '8px', fontWeight: 800, marginTop: '12px', cursor: 'pointer' }}
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>

            {/* 4. INTERACTIVE OPD APPOINTMENT & BED BOOKING MODAL */}
            {bookingFacility && (
              <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.75)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px'
              }}>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  width: '100%',
                  maxWidth: '520px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                  overflow: 'hidden',
                  border: '1px solid #E2E8F0'
                }}>
                  {/* Modal Header */}
                  <div style={{ background: 'linear-gradient(135deg, #070D1E 0%, #0A1428 100%)', color: '#FFFFFF', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '17px', fontWeight: 900 }}>BOOK APPOINTMENT / ICU ADMISSION</div>
                      <div style={{ fontSize: '12px', color: '#38BDF8', marginTop: '2px' }}>{bookingFacility.name}</div>
                    </div>
                    <button
                      onClick={() => setBookingFacility(null)}
                      style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#FFFFFF', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Modal Form Content */}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Patient Name */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        PATIENT FULL NAME / ABHA ID
                      </label>
                      <input
                        type="text"
                        value={bookingPatientName}
                        onChange={(e) => setBookingPatientName(e.target.value)}
                        placeholder="e.g. Rajesh Kumar / 91-4920-4491-0021"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}
                      />
                    </div>

                    {/* Department / Specialty */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        SELECT DEPARTMENT / SPECIALTY
                      </label>
                      <select
                        value={bookingSpecialty}
                        onChange={(e) => setBookingSpecialty(e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 600, color: '#0F172A' }}
                      >
                        <option>General Medicine & Triage</option>
                        <option>Cardiology & Cath Lab</option>
                        <option>Emergency Trauma & ICU Admission</option>
                        <option>Orthopaedics & Joint Replacement</option>
                        <option>Neurology & Neurosurgery</option>
                        <option>Pediatrics & NICU</option>
                        <option>Radiology & MRI / PET-CT Scan</option>
                      </select>
                    </div>

                    {/* Preferred Slot */}
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                        PREFERRED TIME SLOT
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {['Today 11:30 AM (Immediate)', 'Today 03:00 PM', 'Tomorrow 10:00 AM', 'Tomorrow 04:30 PM'].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingSlot(slot)}
                            style={{
                              background: bookingSlot === slot ? 'rgba(0, 180, 216, 0.15)' : '#F8FAFC',
                              border: bookingSlot === slot ? '2px solid #00B4D8' : '1px solid #E2E8F0',
                              color: bookingSlot === slot ? '#0077B6' : '#475569',
                              padding: '8px',
                              borderRadius: '8px',
                              fontSize: '11.5px',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ABDM Fast-Track Notice */}
                    <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '8px', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: '#166534' }}>
                      <CheckCircle size={16} color="#16A34A" />
                      <span>Zero-Queue ABDM Token generated directly to hospital kiosk.</span>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={() => {
                        const tokenCode = `MED-${Math.floor(100000 + Math.random() * 900000)}`;
                        setBookingSuccessModal({
                          facility: bookingFacility.name,
                          patient: bookingPatientName,
                          specialty: bookingSpecialty,
                          slot: bookingSlot,
                          token: tokenCode
                        });
                        setBookingFacility(null);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(0, 180, 216, 0.4)',
                        marginTop: '4px'
                      }}
                    >
                      CONFIRM & ISSUE DIGITAL APPOINTMENT PASS 🎟️
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 5. SUCCESS APPOINTMENT TOKEN RECEIPT MODAL */}
            {bookingSuccessModal && (
              <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px'
              }}>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '20px',
                  width: '100%',
                  maxWidth: '460px',
                  boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
                  overflow: 'hidden',
                  textAlign: 'center',
                  padding: '30px'
                }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle size={36} />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', margin: 0 }}>APPOINTMENT CONFIRMED!</h3>
                  <p style={{ fontSize: '13px', color: '#64748B', marginTop: '6px' }}>
                    Your ABDM digital queue pass has been generated and synced with hospital reception.
                  </p>

                  <div style={{ background: '#F8FAFC', border: '1.5px dashed #00B4D8', borderRadius: '12px', padding: '16px', margin: '18px 0', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#64748B' }}>Token ID:</span>
                      <strong className="font-data-mono" style={{ color: '#0077B6', fontSize: '14px' }}>{bookingSuccessModal.token}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#64748B' }}>Hospital:</span>
                      <strong style={{ color: '#0F172A' }}>{bookingSuccessModal.facility}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#64748B' }}>Patient:</span>
                      <strong style={{ color: '#0F172A' }}>{bookingSuccessModal.patient}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#64748B' }}>Department:</span>
                      <strong style={{ color: '#0F172A' }}>{bookingSuccessModal.specialty}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#64748B' }}>Slot Time:</span>
                      <strong style={{ color: '#16A34A' }}>{bookingSuccessModal.slot}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => setBookingSuccessModal(null)}
                    style={{
                      background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      width: '100%',
                      padding: '11px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Done & View on Map 🗺️
                  </button>
                </div>
              </div>
            )}

            {/* 6. 108 EMERGENCY AMBULANCE DISPATCH SIMULATION MODAL */}
            {showDispatchModal && (
              <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px'
              }}>
                <div style={{
                  background: '#070D1E',
                  borderRadius: '20px',
                  width: '100%',
                  maxWidth: '540px',
                  boxShadow: '0 25px 60px rgba(239, 68, 68, 0.3)',
                  overflow: 'hidden',
                  border: '1.5px solid #EF4444',
                  color: '#FFFFFF'
                }}>
                  {/* Modal Header */}
                  <div style={{ background: '#DC2626', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Ambulance size={22} color="#FFF" />
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 900 }}>108 EMERGENCY SOS DISPATCH</div>
                        <div style={{ fontSize: '11px', color: '#FEE2E2' }}>DISPATCHING TO: {showDispatchModal.name}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowDispatchModal(null)}
                      style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: '#FFF', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Dispatch Live Telemetry Body */}
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* ETA Countdown Alert */}
                    <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '10.5px', color: '#FCA5A5', fontWeight: 700 }}>ACLS UNIT #DL-08-EM-4091</div>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>PARAMEDIC TEAM EN ROUTE</div>
                      </div>
                      <div className="font-data-mono" style={{ fontSize: '22px', fontWeight: 900, color: '#EF4444', background: 'rgba(239, 68, 68, 0.2)', padding: '4px 12px', borderRadius: '8px' }}>
                        ETA: 05:42
                      </div>
                    </div>

                    {/* Real-time checklist */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ADE80' }}>
                        <CheckCircle size={15} /> <span>Emergency Trauma Bay Reserved at {showDispatchModal.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ADE80' }}>
                        <CheckCircle size={15} /> <span>Duty ER Physician Alerted ({showDispatchModal.doctorsOnDuty} Specialists On Shift)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ADE80' }}>
                        <CheckCircle size={15} /> <span>ABDM Patient Health Records Pre-synced</span>
                      </div>
                    </div>

                    {/* Driver & Contact Strip */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>Lead Paramedic:</div>
                        <div style={{ fontSize: '13px', fontWeight: 800 }}>Captain Vikram Singh</div>
                      </div>
                      <a
                        href={`tel:${showDispatchModal.phone}`}
                        style={{
                          background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                          color: '#FFFFFF',
                          padding: '8px 14px',
                          borderRadius: '6px',
                          fontSize: '11.5px',
                          fontWeight: 800,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <PhoneCall size={12} /> Call Hotline
                      </a>
                    </div>

                    <button
                      onClick={() => {
                        window.open('http://localhost:5175', '_blank');
                        setShowDispatchModal(null);
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: 900,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)'
                      }}
                    >
                      <Ambulance size={15} />
                      <span>OPEN FULL EMERGENCY COMMAND OS (LIVE RADAR) ↗</span>
                    </button>

                    <button
                      onClick={() => setShowDispatchModal(null)}
                      style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        color: '#94A3B8',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        padding: '9px',
                        borderRadius: '8px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Close Tracker & Keep Beacon Active 📡
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        );
      })()}

      {activePage === 'AI_HELP' && (
        <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bot size={28} color="#0077B6" /> AI BASED CLINICAL ASSISTANT
          </div>
        </div>
      )}

      {activePage === 'HOME_CURE' && (
        <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={28} color="#0077B6" /> HOME-CURE & FIRST-AID GUIDANCE
          </div>
        </div>
      )}

      {activePage === 'BOOK_APPOINTMENT' && (
        <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={28} color="#0077B6" /> SPECIALIST DOCTOR APPOINTMENT BOOKING
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            {mockDoctors.map(doc => (
              <div key={doc.id} className="glass-panel" style={{ padding: '20px', background: '#FFFFFF', borderRadius: '10px' }}>
                <img src={doc.image} alt={doc.name} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' }} />
                <div style={{ fontWeight: 800, fontSize: '18px', marginTop: '10px', color: '#0F172A' }}>{doc.name}</div>
                <div className="font-data-mono" style={{ fontSize: '11px', color: '#0077B6', fontWeight: 700 }}>{doc.specialty}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '10px' }}>
                  <span className="font-data-mono" style={{ fontSize: '15px', fontWeight: 800 }}>₹{doc.fee} INR</span>
                  <button onClick={() => alert(`OPD Slot booked with ${doc.name}!`)} style={{ background: '#0077B6', color: '#FFF', border: 'none', padding: '6px 14px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer' }}>Book Slot</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activePage === 'N8N_AUTOMATION' && (
        <div style={{ flex: 1, paddingTop: '24px' }}>
          <StaffPortal />
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #E2E8F0', backgroundColor: '#0F172A', color: '#F8FAFC', padding: '48px 48px 24px 48px', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '40px', paddingBottom: '36px', borderBottom: '1px solid #1E293B' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <HeartPulse color="#00B4D8" /> MediVerse <span style={{ color: '#00B4D8' }}>AI</span>
            </div>
            <div className="font-data-mono" style={{ fontSize: '11px', color: '#00B4D8', marginTop: '4px' }}>CUREPOINT — NEUROSYNAPSE HEALTH OS</div>
            <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '12px', lineHeight: '1.6', maxWidth: '340px' }}>
              Sovereign healthcare platform integrating B2C patient portals, ABDM M1-M3 identity lockers, zero-footprint WebGPU PACS, E-Pharmacy, and CDSCO Class C clinical decision support.
            </p>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>Platform Links</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#94A3B8' }}>
              <span onClick={() => setActivePage('HOME')} style={{ cursor: 'pointer' }}>Home Gateway</span>
              <span onClick={() => setActivePage('OUTBREAK_RADAR')} style={{ cursor: 'pointer' }}>Disease Radar</span>
              <span onClick={() => setActivePage('HEALTH_NEWS')} style={{ cursor: 'pointer' }}>Local Health News</span>
              <span onClick={() => setActivePage('BUY_MEDICINES')} style={{ cursor: 'pointer' }}>Buy Medicines</span>
              <span onClick={() => setActivePage('MEDICAL_MAP')} style={{ cursor: 'pointer' }}>Medical Map & Facilities</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>Compliance</div>
            <div className="font-data-mono" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', color: '#94A3B8' }}>
              <span>• ABDM M1-M3 Certified</span>
              <span>• CDSCO Form MD-9 (Class C)</span>
              <span>• DPDP Act 2023 Compliant</span>
              <span>• HL7 FHIR R4 Standards</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>Emergency Hotline</div>
            <div style={{ background: '#1E293B', padding: '12px', borderRadius: '8px', border: '1px solid #334155' }}>
              <div className="font-data-mono" style={{ fontSize: '14px', color: '#EF4444', fontWeight: 800 }}>HOTLINE: 108 / 112</div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>National Emergency Response Center Active</div>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '1200px', margin: '20px auto 0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748B' }}>
          <div>&copy; 2026 MediVerse AI — CurePoint Health Operating System. All Rights Reserved.</div>
          <div className="font-data-mono" style={{ fontSize: '11px' }}>Disease Radar & Health News Engine v8.0</div>
        </div>
      </footer>

    </div>
  );
}
