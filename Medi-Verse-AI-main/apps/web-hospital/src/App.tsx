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
  AlertCircle
} from 'lucide-react';
import { 
  saveOfflinePrescription, 
  getUnsyncedPrescriptions, 
  initOfflineSyncWorker, 
  OfflinePrescription 
} from './services/offlineDb';

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
  | 'LAB_CRITICAL_DISPATCH';

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
  type: 'HOSPITAL' | 'SPECIALIST' | 'TESTING_LAB' | 'CLINIC';
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
}

const facilityList: MedicalFacility[] = [
  { id: 'f-1', name: 'Apex Neurovascular Institute', type: 'HOSPITAL', address: '1200 Innovation Drive, Tech District', city: 'New Delhi', rating: 4.9, distance: '0.8 mi', phone: '+91 11 2651 5050', open24x7: true, pinX: 38, pinY: 42, satisfaction: '98% Patient Satisfaction', accreditation: 'NABH Accredited', image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=600&q=80', tags: ['Neurology', 'Level 1 Trauma', '24/7 ER'] },
  { id: 'f-2', name: 'Synapse Diagnostic & MRI Center', type: 'TESTING_LAB', address: '450 Medical Plaza, West Wing', city: 'New Delhi', rating: 4.7, distance: '2.4 mi', phone: '+91 11 2658 8500', open24x7: false, pinX: 64, pinY: 30, satisfaction: '96% Accuracy Rate', accreditation: 'NABL Certified', image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=600&q=80', tags: ['fMRI', 'PET Scan', 'Bio-Lab'] },
  { id: 'f-3', name: 'Max Super Speciality Hospital', type: 'HOSPITAL', address: 'Press Enclave Road, Saket', city: 'New Delhi', rating: 4.9, distance: '1.2 mi', phone: '+91 11 4000 2000', open24x7: true, pinX: 52, pinY: 68, satisfaction: '99% Emergency Response', accreditation: 'JCI Accredited', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80', tags: ['Cardiology', 'ICU Beds', 'Organ Transplant'] },
  { id: 'f-4', name: 'CurePoint Multi-Specialty Clinic', type: 'CLINIC', address: 'Vasant Vihar Block C', city: 'New Delhi', rating: 4.8, distance: '1.5 mi', phone: '+91 11 2614 1122', open24x7: false, pinX: 76, pinY: 54, satisfaction: '95% OPD Satisfaction', accreditation: 'ABDM Linked', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=600&q=80', tags: ['Internal Medicine', 'Pediatrics', 'Vaccination'] }
];

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

const localOutbreaks: DiseaseOutbreak[] = [
  {
    id: 'out-1',
    name: 'Dengue Virus Serotype-2 Surge',
    type: 'Vector-Borne Viral Infection',
    area: 'Delhi NCR (South & West Districts)',
    pincode: '110001 - 110075',
    severity: 'CRITICAL',
    activeCases: 1420,
    trend: '+340% Baseline Spike',
    preventiveAdvice: 'Eliminate stagnant water, use N-Diethyl-meta-toluamide repellents, monitor platelet count if high fever persists.',
    lastUpdated: '12 Mins Ago'
  },
  {
    id: 'out-2',
    name: 'Influenza A Subtype H3N2 Cluster',
    type: 'Respiratory Viral Infection',
    area: 'Gurugram & Vasant Kunj Sector 4',
    pincode: '122001 & 110070',
    severity: 'MODERATE',
    activeCases: 680,
    trend: '+45% Weekly Increase',
    preventiveAdvice: 'Wear N95 masks in crowded transit, get quadrivalent flu vaccination, maintain 6ft distance from symptomatic patients.',
    lastUpdated: '2 Hours Ago'
  },
  {
    id: 'out-3',
    name: 'Chikungunya Viral Infection Alert',
    type: 'Aedes Aegypti Vector Outbreak',
    area: 'Noida Sector 62 & Indirapuram',
    pincode: '201301',
    severity: 'MONITORED',
    activeCases: 210,
    trend: 'Stable Control',
    preventiveAdvice: 'Report joint pain with sudden onset fever. Local fogging squads dispatched by municipal health authority.',
    lastUpdated: '4 Hours Ago'
  }
];

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

export default function App() {
  const [activePage, setActivePage] = useState<PageRoute>('HOME');
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Cart Drawer State
  const [cart, setCart] = useState<{ [key: string]: number }>({ 'm-1': 1, 'm-4': 2 });
  const [showCartDrawer, setShowCartDrawer] = useState(false);

  // Stitch AI Medical Map State
  const [selectedCity, setSelectedCity] = useState('New Delhi');
  const [mapMode, setMapMode] = useState<'GLOBE' | 'PHYSICAL_MAP'>('PHYSICAL_MAP');
  const [isRedirectingMap, setIsRedirectingMap] = useState(false);
  const [activeFacility, setActiveFacility] = useState<MedicalFacility>(facilityList[0]);
  const [facilityFilter, setFacilityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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

  const activeSlide = heroSlides[currentSlide];

  // RENDER CUSTOM NAVBAR PER ROLE MATRICES
  const renderRoleCustomNavbar = () => {
    const role = userProfile?.role || 'PATIENT';

    if (role === 'DOCTOR') {
      return (
        <header style={{ height: '72px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div onClick={() => setActivePage('HOME')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} title="Go to Main Home Page">
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Stethoscope size={22} color="#FFF" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Doctor Clinical Cockpit</div>
              <div className="font-data-mono" style={{ fontSize: '10px', color: '#0077B6', fontWeight: 700 }}>
                {userProfile?.facility} • NMC #{userProfile?.identifier}
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
            {[
              { page: 'HOME', label: 'Main Home', icon: Globe },
              { page: 'DOCTOR_COCKPIT', label: 'OPD Stream (2 Crit | 14 Rout)', icon: UserCheck },
              { page: 'DOCTOR_PACS_3D', label: '3D PACS Studio', icon: Brain },
              { page: 'DOCTOR_SAMD_ENGINE', label: 'SaMD CDSS AI Engine', icon: Cpu },
              { page: 'DOCTOR_ANTIBIOGRAM', label: 'Antibiogram Radar', icon: ShieldCheck }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page;
              return (
                <button key={item.page} onClick={() => setActivePage(item.page as PageRoute)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: isActive ? '#0077B6' : 'transparent', color: isActive ? '#FFF' : '#475569', fontWeight: 700, fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} /> {item.label}
                </button>
              );
            })}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setIsVoiceScribeActive(!isVoiceScribeActive)} style={{ background: isVoiceScribeActive ? '#DCFCE7' : '#F1F5F9', border: isVoiceScribeActive ? '1px solid #86EFAC' : '1px solid #CBD5E1', color: isVoiceScribeActive ? '#15803D' : '#475569', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              {isVoiceScribeActive ? <Mic size={14} /> : <MicOff size={14} />} {isVoiceScribeActive ? 'Voice Scribe ACTIVE' : 'Voice Scribe OFF'}
            </button>
            <button onClick={() => alert('Batch Sign Executed for 4 Rx. Cryptographic Stamp Applied.')} style={{ background: '#0077B6', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LockKeyhole size={14} /> Batch Sign Rx ({pendingRxSignCount})
            </button>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer' }}><LogOut size={16} /></button>
          </div>
        </header>
      );
    }

    if (role === 'RECEPTION') {
      return (
        <header style={{ height: '72px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div onClick={() => setActivePage('HOME')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} title="Go to Main Home Page">
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#0077B6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={22} color="#FFF" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Reception Desk & NHCX Terminal</div>
              <div className="font-data-mono" style={{ fontSize: '10px', color: '#64748B' }}>
                {userProfile?.identifier} • Cash: ₹{cashDrawerTotal.cash} | UPI: ₹{cashDrawerTotal.digital}
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
            {[
              { page: 'HOME', label: 'Main Home', icon: Globe },
              { page: 'RECEPTION_NHCX', label: 'NHCX Cashless Claims', icon: ShieldCheck },
              { page: 'RECEPTION_ABDM_SCAN', label: 'ABDM Scan & Share', icon: QrCode },
              { page: 'RECEPTION_TOKENS', label: 'OPD Token Dispatcher', icon: Clock },
              { page: 'RECEPTION_BED_MATRIX', label: 'Ward & Bed Matrix', icon: Bed }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page;
              return (
                <button key={item.page} onClick={() => setActivePage(item.page as PageRoute)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: isActive ? '#0077B6' : 'transparent', color: isActive ? '#FFF' : '#475569', fontWeight: 700, fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} /> {item.label}
                </button>
              );
            })}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => alert('Webcam Barcode Scanner Triggered.')} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Scan size={14} /> Scan QR (F1)
            </button>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer' }}><LogOut size={16} /></button>
          </div>
        </header>
      );
    }

    if (role === 'NURSE') {
      return (
        <header style={{ height: '72px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div onClick={() => setActivePage('HOME')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} title="Go to Main Home Page">
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={22} color="#FFF" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Smart Nursing Station</div>
              <div className="font-data-mono" style={{ fontSize: '10px', color: '#DC2626', fontWeight: 800 }}>
                {userProfile?.ward} • {userProfile?.name}
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
            {[
              { page: 'HOME', label: 'Main Home', icon: Globe },
              { page: 'NURSE_TELEMETRY', label: 'Bed Telemetry HUD', icon: Activity },
              { page: 'NURSE_EMAR', label: 'eMAR Med Schedule', icon: Pill },
              { page: 'NURSE_FLUIDS', label: 'Fluid Charting', icon: Droplets },
              { page: 'NURSE_SBAR', label: 'Shift Handoff (SBAR)', icon: FileText }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page;
              return (
                <button key={item.page} onClick={() => setActivePage(item.page as PageRoute)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: isActive ? '#DC2626' : 'transparent', color: isActive ? '#FFF' : '#475569', fontWeight: 700, fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} /> {item.label}
                </button>
              );
            })}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => setCodeBlueAlert(!codeBlueAlert)} style={{ background: '#DC2626', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(220,38,38,0.4)', animation: codeBlueAlert ? 'pulse 1s infinite' : 'none' }}>
              <Flame size={16} /> CODE BLUE EMERGENCY
            </button>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer' }}><LogOut size={16} /></button>
          </div>
        </header>
      );
    }

    if (role === 'LAB_TECH') {
      return (
        <header style={{ height: '72px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', position: 'sticky', top: 0, zIndex: 50 }}>
          <div onClick={() => setActivePage('HOME')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} title="Go to Main Home Page">
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FlaskConical size={22} color="#FFF" />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Diagnostic Lab & LIMS Hub</div>
              <div className="font-data-mono" style={{ fontSize: '10px', color: '#D97706', fontWeight: 800 }}>
                {userProfile?.identifier} • Serial Port ONLINE
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
            {[
              { page: 'HOME', label: 'Main Home', icon: Globe },
              { page: 'LAB_ACCESSION', label: 'Accession Queue', icon: TestTube },
              { page: 'LAB_PACS_UPLOAD', label: 'PACS DICOM Dropzone', icon: UploadCloud },
              { page: 'LAB_ANALYZER', label: 'LIMS Analyzer Sync', icon: Database },
              { page: 'LAB_CRITICAL_DISPATCH', label: 'Critical Value Dispatch', icon: AlertTriangle }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.page;
              return (
                <button key={item.page} onClick={() => setActivePage(item.page as PageRoute)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: isActive ? '#D97706' : 'transparent', color: isActive ? '#FFF' : '#475569', fontWeight: 700, fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Icon size={14} /> {item.label}
                </button>
              );
            })}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button onClick={() => alert('LOINC Code Auto-Standardizer executed.')} style={{ background: '#D97706', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>
              Batch LOINC Sync
            </button>
            <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer' }}><LogOut size={16} /></button>
          </div>
        </header>
      );
    }

    // DEFAULT B2C PATIENT PORTAL NAVBAR WITH OUTBREAK RADAR & HEALTH NEWS
    return (
      <header style={{ height: '72px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div onClick={() => setActivePage('HOME')} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0, 180, 216, 0.35)' }}>
            <HeartPulse size={24} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A', lineHeight: '1' }}>
              MediVerse <span style={{ color: '#0077B6' }}>AI</span>
            </div>
            <div className="font-data-mono" style={{ fontSize: '10px', color: '#64748B', marginTop: '3px', fontWeight: 600 }}>
              CUREPOINT HEALTH OS
            </div>
          </div>
        </div>

        <nav style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '4px 6px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
          {[
            { page: 'HOME', label: 'Home', icon: Globe },
            { page: 'OUTBREAK_RADAR', label: 'Disease Radar', icon: Bug },
            { page: 'HEALTH_NEWS', label: 'Local News', icon: Newspaper },
            { page: 'BUY_MEDICINES', label: 'Buy Medicines', icon: Pill },
            { page: 'MEDICAL_MAP', label: 'Medical Map', icon: Map },
            { page: 'AI_HELP', label: 'AI Help', icon: Bot },
            { page: 'HOME_CURE', label: 'Home Cure', icon: ShieldAlert },
            { page: 'BOOK_APPOINTMENT', label: 'Book Doctor', icon: Calendar }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.page;
            return (
              <button key={item.page} onClick={() => setActivePage(item.page as PageRoute)} style={{ padding: '6px 12px', borderRadius: '6px', border: 'none', background: isActive ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)' : 'transparent', color: isActive ? '#FFFFFF' : '#475569', fontWeight: 700, fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap' }}>
                <Icon size={13} /> {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button onClick={() => setShowCartDrawer(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', color: '#FFFFFF', padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 800, boxShadow: '0 4px 15px rgba(0, 180, 216, 0.35)' }}>
            <ShoppingCart size={16} />
            <span>Cart ({totalCartCount})</span>
            <span style={{ background: '#FFFFFF', color: '#0077B6', padding: '2px 6px', borderRadius: '12px', fontSize: '10px', fontWeight: 800 }}>₹{cartTotal}</span>
          </button>

          {userProfile ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', padding: '4px 10px', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
              <User size={14} color="#0077B6" />
              <div style={{ fontSize: '11px', lineHeight: '1.2' }}>
                <div style={{ fontWeight: 800, color: '#0F172A' }}>{userProfile.name}</div>
                <div className="font-data-mono" style={{ fontSize: '9px', color: '#64748B' }}>{userProfile.role}</div>
              </div>
              <button onClick={handleLogout} title="Logout" style={{ background: 'transparent', border: 'none', color: '#DC2626', cursor: 'pointer', marginLeft: '4px', display: 'flex' }}><LogOut size={14} /></button>
            </div>
          ) : (
            <button onClick={() => setShowLoginModal(true)} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#0F172A', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LogIn size={14} /> Sign In
            </button>
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
            <div style={{ display: 'flex', background: '#F1F5F9', padding: '4px', borderRadius: '30px', marginBottom: '20px' }}>
              <button 
                type="button"
                onClick={() => setAuthMode('LOGIN')}
                style={{ flex: 1, padding: '8px 16px', borderRadius: '24px', border: 'none', background: authMode === 'LOGIN' ? '#1B365D' : 'transparent', color: authMode === 'LOGIN' ? '#FFFFFF' : '#64748B', fontWeight: 800, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                LOG IN
              </button>
              <button 
                type="button"
                onClick={() => setAuthMode('REGISTER')}
                style={{ flex: 1, padding: '8px 16px', borderRadius: '24px', border: 'none', background: authMode === 'REGISTER' ? '#1B365D' : 'transparent', color: authMode === 'REGISTER' ? '#FFFFFF' : '#64748B', fontWeight: 800, fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                CREATE NEW ACCOUNT
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

                  {/* LOG IN BUTTON */}
                  <button 
                    type="submit" 
                    style={{ 
                      width: '100%', 
                      background: '#27487F', 
                      color: '#FFFFFF', 
                      border: 'none', 
                      padding: '14px', 
                      borderRadius: '24px', 
                      fontWeight: 800, 
                      fontSize: '14px', 
                      letterSpacing: '0.05em', 
                      cursor: 'pointer', 
                      marginTop: '4px',
                      boxShadow: '0 6px 18px rgba(39, 72, 127, 0.35)'
                    }}
                  >
                    LOG IN
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
                    <button type="button" onClick={() => handleSocialLogin('Google')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 12px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                      Continue with Google
                    </button>
                    <button type="button" onClick={() => handleSocialLogin('Apple')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 12px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.47c.65-.8 1.09-1.92.97-3.04-.94.04-2.08.63-2.75 1.42-.6.7-1.12 1.83-.98 2.93 1.05.08 2.11-.51 2.76-1.31z"/></svg>
                      Continue with Apple
                    </button>
                  </div>

                  <button type="button" onClick={() => handleSocialLogin('MediVerse Key')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px 14px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', fontWeight: 700, color: '#1B365D', cursor: 'pointer' }}>
                    <Key size={16} color="#1B365D" />
                    Continue with MediVerse Key
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
                    style={{ 
                      width: '100%', 
                      background: '#27487F', 
                      color: '#FFFFFF', 
                      border: 'none', 
                      padding: '14px', 
                      borderRadius: '24px', 
                      fontWeight: 800, 
                      fontSize: '14px', 
                      letterSpacing: '0.05em', 
                      cursor: 'pointer', 
                      marginTop: '6px',
                      boxShadow: '0 6px 18px rgba(39, 72, 127, 0.35)'
                    }}
                  >
                    CREATE PATIENT ACCOUNT
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

      {/* NEW PAGE 1: LOCAL DISEASE / VIRUS OUTBREAK RADAR */}
      {activePage === 'OUTBREAK_RADAR' && (
        <div style={{ padding: '32px 48px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bug size={30} color="#DC2626" /> LOCAL VIRUS & DISEASE OUTBREAK RADAR
              </div>
              <div className="font-data-mono" style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                IDSP EPIDEMIOLOGICAL TELEMETRY • ACTIVE LOCATION: DELHI NCR (PIN 110001)
              </div>
            </div>

            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} /> 1 CRITICAL EPIDEMIC ALERT ACTIVE IN YOUR REGION
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
            {/* Left: Active Outbreaks List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {localOutbreaks.map(outbreak => (
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
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>{outbreak.activeCases}</div>
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

            {/* Right: Hospital Vector Readiness & ICMR Helpline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="glass-panel" style={{ padding: '20px', background: '#FFFFFF', borderRadius: '12px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>Hospital Vector Bed Readiness</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Dengue Isolation Beds:</span>
                    <strong style={{ color: '#16A34A' }}>140 Available</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span>Blood Bank Platelet Units:</span>
                    <strong style={{ color: '#0077B6' }}>850 Units Ready</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: '#0F172A', color: '#FFF', padding: '20px', borderRadius: '12px' }}>
                <div className="font-data-mono" style={{ fontSize: '11px', color: '#00B4D8', fontWeight: 800 }}>EPIDEMIC SURVEILLANCE CELL</div>
                <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px' }}>ICMR Dengue & Fever Helpline</div>
                <div className="font-data-mono" style={{ fontSize: '20px', color: '#00B4D8', fontWeight: 800, marginTop: '8px' }}>1800-11-2026</div>
              </div>
            </div>
          </div>
        </div>
      )}

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
          <section style={{ position: 'relative', height: '520px', overflow: 'hidden', backgroundColor: '#0F172A' }}>
            <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${activeSlide.image})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.65)', transition: 'all 0.8s ease-in-out', transform: 'scale(1.02)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.5) 60%, transparent 100%)' }} />
            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 48px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '30px', background: 'rgba(0, 180, 216, 0.2)', border: '1px solid rgba(0, 180, 216, 0.5)', color: '#00B4D8', fontSize: '11px', fontWeight: 800, width: 'fit-content', marginBottom: '16px' }}>
                <Sparkles size={14} /> {activeSlide.badge}
              </div>
              <h1 style={{ fontSize: '46px', fontWeight: 800, color: '#FFFFFF', maxWidth: '760px', margin: '0 0 16px 0', lineHeight: '1.15', letterSpacing: '-0.02em' }}>{activeSlide.title}</h1>
              <p style={{ fontSize: '16px', color: '#E2E8F0', maxWidth: '640px', margin: '0 0 28px 0', lineHeight: '1.6' }}>{activeSlide.subtitle}</p>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <button onClick={() => setActivePage(activeSlide.targetPage)} style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', color: '#FFFFFF', border: 'none', padding: '14px 32px', borderRadius: '8px', fontWeight: 800, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 20px rgba(0, 180, 216, 0.4)' }}>
                  {activeSlide.ctaText} <ArrowRight size={16} />
                </button>
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

              <div className="glass-panel" style={{ padding: '28px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(220,38,38,0.1)', color: '#DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Ambulance size={26} />
                </div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>ACLS Emergency SOS</div>
                <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6' }}>Real-time GPS ambulance dispatch and ER trauma bay auto-reservation.</p>
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

              {/* LOG IN BUTTON */}
              <button 
                type="submit" 
                style={{ 
                  width: '100%', 
                  background: '#27487F', 
                  color: '#FFFFFF', 
                  border: 'none', 
                  padding: '14px', 
                  borderRadius: '24px', 
                  fontWeight: 800, 
                  fontSize: '14px', 
                  letterSpacing: '0.05em', 
                  cursor: 'pointer', 
                  marginTop: '4px',
                  boxShadow: '0 6px 18px rgba(39, 72, 127, 0.35)'
                }}
              >
                LOG IN
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
                <button type="button" onClick={() => handleSocialLogin('Google')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 12px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                  Continue with Google
                </button>
                <button type="button" onClick={() => handleSocialLogin('Apple')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px 12px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#000"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.47c.65-.8 1.09-1.92.97-3.04-.94.04-2.08.63-2.75 1.42-.6.7-1.12 1.83-.98 2.93 1.05.08 2.11-.51 2.76-1.31z"/></svg>
                  Continue with Apple
                </button>
              </div>

              <button type="button" onClick={() => handleSocialLogin('MediVerse Key')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '11px 14px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', fontWeight: 700, color: '#1B365D', cursor: 'pointer' }}>
                <Key size={16} color="#1B365D" />
                Continue with MediVerse Key
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

      {activePage === 'MEDICAL_MAP' && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F8FAFC' }}>
          <div style={{ padding: '16px 32px', background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={22} color="#0077B6" /> Medical Map & Facility Finder — Stitch AI Clinical Edition
              </div>
            </div>
            <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '4px', borderRadius: '8px' }}>
              <button onClick={() => setMapMode('PHYSICAL_MAP')} style={{ background: mapMode === 'PHYSICAL_MAP' ? '#0077B6' : 'transparent', color: mapMode === 'PHYSICAL_MAP' ? '#FFF' : '#475569', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>Physical Map Grid</button>
              <button onClick={() => setMapMode('GLOBE')} style={{ background: mapMode === 'GLOBE' ? '#0077B6' : 'transparent', color: mapMode === 'GLOBE' ? '#FFF' : '#475569', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>3D Animated Globe</button>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            <aside style={{ width: '460px', background: '#FFFFFF', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '100%', zIndex: 10 }}>
              <div style={{ padding: '16px', background: '#F8FAFC' }}>
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search facilities..." style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }} />
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {facilityList.map(fac => (
                  <div key={fac.id} onClick={() => setActiveFacility(fac)} style={{ background: '#FFFFFF', borderRadius: '12px', border: activeFacility.id === fac.id ? '2px solid #0077B6' : '1px solid #E2E8F0', overflow: 'hidden', cursor: 'pointer' }}>
                    <img src={fac.image} alt={fac.name} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
                    <div style={{ padding: '14px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>{fac.name}</h3>
                      <p style={{ fontSize: '11px', color: '#64748B', margin: '4px 0' }}>{fac.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
            <main style={{ flex: 1, background: '#CBD5E1', display: 'flex', flexDirection: 'column' }}>
              {mapMode === 'GLOBE' ? (
                <div style={{ flex: 1, background: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <StitchThreeGlobe selectedCity={selectedCity} onSelectCity={handleSelectCityLocation} />
                </div>
              ) : (
                <div style={{ flex: 1, position: 'relative', background: '#E2E8F0' }}>
                  {facilityList.map(fac => (
                    <div key={fac.id} onClick={() => setActiveFacility(fac)} style={{ position: 'absolute', left: `${fac.pinX}%`, top: `${fac.pinY}%`, transform: 'translate(-50%, -50%)', cursor: 'pointer' }}>
                      <div style={{ background: activeFacility.id === fac.id ? '#0077B6' : '#DC2626', color: '#FFF', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800 }}>
                        <MapPin size={12} /> {fac.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      )}

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
