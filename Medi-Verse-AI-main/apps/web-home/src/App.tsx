import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Sparkles, 
  LogIn, 
  ArrowRight, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Key, 
  UserCheck, 
  Globe, 
  ShieldCheck, 
  Brain, 
  Pill, 
  Ambulance, 
  Bot, 
  Send, 
  X, 
  CheckCircle2, 
  Activity,
  Calendar,
  Layers,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Cpu,
  CheckCircle,
  TrendingUp,
  Award,
  FileText,
  PhoneCall,
  QrCode,
  Building2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Zap,
  Database,
  LockKeyhole,
  Stethoscope,
  Bed,
  Truck,
  Microscope,
  Dna,
  Radio,
  ShieldAlert,
  Share2
} from 'lucide-react';

interface HeroSlide {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 0,
    badge: 'AI HOLOGRAPHIC DIAGNOSTICS & 3D PACS',
    title: 'Precision Clinical Intelligence at Scale',
    subtitle: 'Ultra-low latency MONAI Swin UNETR volumetric segmentation, ABDM M3 interconnected health meshes, and holographic CDSS overlays built for the next generation of patient care.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1920&q=80',
    ctaText: 'Explore 3D PACS Studio →'
  },
  {
    id: 1,
    badge: 'ABDM M3 FAST-TRACK SCAN & SHARE',
    title: 'Zero-Wait OPD Token & Universal Consent',
    subtitle: 'Scan any QR code at thousands of networked clinics to instantly share ABHA health records, unlock token priority, and eliminate reception paperwork forever.',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1920&q=80',
    ctaText: 'Scan ABDM QR Token →'
  },
  {
    id: 2,
    badge: '24/7 SUPER-SPECIALIST VIDEO CONSULTS',
    title: 'Real-Time Antibiogram & SaMD AI Engine',
    subtitle: 'Connect with board-certified intensivists and oncologists equipped with real-time microbiology resistance maps and live drug interaction telemetry.',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1920&q=80',
    ctaText: 'Consult Specialist Live →'
  },
  {
    id: 3,
    badge: 'SMART ICU BED MATRIX & DRONE BLOOD CORRIDOR',
    title: 'Instant Resuscitation & Rare Blood Mesh',
    subtitle: 'Real-time telemetry tracking live vacant ICU ventilators, cryogenic liquid O2 autonomy, and autonomous UAV rare-group blood delivery corridors across metro hospitals.',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1920&q=80',
    ctaText: 'Open Emergency Radar →'
  }
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loginRole, setLoginRole] = useState<'PATIENT' | 'DOCTOR' | 'RECEPTION' | 'NURSE' | 'LAB_TECH'>('PATIENT');
  const [showPassword, setShowPassword] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; role: string } | null>(null);

  const [loginForm, setLoginForm] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    age: '28',
    gender: 'MALE',
    illnesses: '',
    termsAccepted: true
  });

  // Symptom Triage State
  const [triageQuery, setTriageQuery] = useState('');
  const [triageResult, setTriageResult] = useState<{ riskLevel: string; summary: string; actions: string[] } | null>(null);

  // Studio Showcase Tabs
  const [activeStudioTab, setActiveStudioTab] = useState<'PACS' | 'EMR' | 'ICU' | 'GENOMICS'>('PACS');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Testimonials Carousel State
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string }>>([
    { sender: 'bot', text: 'Hello! I am MediBot AI. How can I assist you with clinical navigation, appointments, or prescriptions today?' }
  ]);

  // Slide Auto-Rotation
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeSlide = heroSlides[currentSlide];

  const getHospitalUrl = () => {
    if (typeof window !== 'undefined') {
      const isLocal = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port;
      if (isLocal) {
        return 'http://localhost:5173/';
      }
    }
    return '/hospital/';
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const identifier = loginForm.email || loginForm.name || 'Dr. Aryan Sharma';
    setUserProfile({
      name: identifier.split('@')[0],
      role: loginRole
    });
    setShowLoginModal(false);
    window.location.href = getHospitalUrl();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserProfile({
      name: registerForm.fullName || 'Patient User',
      role: 'PATIENT'
    });
    setShowLoginModal(false);
    window.location.href = getHospitalUrl();
  };

  const handleSocialLogin = (provider: string) => {
    setUserProfile({
      name: `${provider} User`,
      role: loginRole
    });
    setShowLoginModal(false);
    window.location.href = getHospitalUrl();
  };

  const handleTriageExecute = (queryText?: string) => {
    const text = queryText || triageQuery;
    if (!text.trim()) {
      alert('Please enter your symptoms to analyze.');
      return;
    }
    const q = text.toLowerCase();
    if (q.includes('chest') || q.includes('heart') || q.includes('breath') || q.includes('stroke') || q.includes('pain') || q.includes('cardiac')) {
      setTriageResult({
        riskLevel: 'PRIORITY 1: RED (Immediate Emergency Resuscitation)',
        summary: 'Clinical CDSS detected acute hemodynamic / ischemic markers. 108 ACLS GPS ambulance pre-alerted and nearest Level-1 trauma bay reservation opened.',
        actions: ['Dispatch 108 ACLS Ambulance', 'Notify Apex Trauma Cath Lab', 'Pre-sync ABDM Emergency Health Record']
      });
    } else if (q.includes('fever') || q.includes('cough') || q.includes('infection') || q.includes('throat')) {
      setTriageResult({
        riskLevel: 'PRIORITY 2: YELLOW (Urgent Specialist OPD Care)',
        summary: 'Infectious / febrile trajectory detected. Tele-consultation slotted with Internal Medicine specialist within 15 minutes.',
        actions: ['Book Priority OPD Slot', 'Order CBC & Inflammatory Panel', 'Receive E-Prescription Delivery']
      });
    } else {
      setTriageResult({
        riskLevel: 'PRIORITY 3: GREEN (Routine Care & Digital Prescription)',
        summary: 'Mild non-critical symptoms. Home-care guidance provided and OTC relief medications queued on E-Pharmacy.',
        actions: ['Explore Home Cure Protocols', 'Order Medications with 2-Hr Delivery', 'Log Vitals in ABHA Locker']
      });
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let botReply = 'I have synced your query with the clinical protocol mesh. Would you like to schedule an OPD token or consult an intensivist?';
      const q = userMsg.toLowerCase();
      if (q.includes('ambulance') || q.includes('emergency') || q.includes('108') || q.includes('sos')) {
        botReply = '🚨 Emergency protocol triggered! Opening the 108 Rapid Trauma Network GPS tracker. Real-time ACLS ambulances are within 4 minutes of your sector.';
      } else if (q.includes('medicine') || q.includes('order') || q.includes('pharmacy')) {
        botReply = '📦 Express E-Pharmacy is ready. Upload your ABDM digital prescription for 2-hour doorstep delivery.';
      } else if (q.includes('appointment') || q.includes('doctor') || q.includes('book')) {
        botReply = '📅 OPD booking engine active. Top AIIMS and Max Hospital specialists have slots open today.';
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  const testimonials = [
    {
      quote: "MediVerse AI's 3D PACS and instant CDSS alerts have cut our emergency trauma door-to-balloon time by 38%. It represents the pinnacle of modern Indian digital health infrastructure.",
      author: "Dr. Arvind Mehra, MD, DM",
      role: "Director of Critical Care & Trauma Services",
      hospital: "AIIMS Apex Trauma Center"
    },
    {
      quote: "The ABDM Scan & Share and automated NHCX claims have transformed our hospital reception. Zero queues, instant ABHA records synchronization, and cashless claim pre-auth in 12 minutes.",
      author: "Dr. Shalini Roy, MBBS, MHA",
      role: "Chief Medical Administrator",
      hospital: "Safdarjung Super Speciality Hospital"
    },
    {
      quote: "When my father experienced sudden chest pain, the 1-Click 108 SOS dispatched an ACLS ambulance equipped with a portable ventilator and live ECG stream to the hospital before we even arrived.",
      author: "Pooja Deshmukh",
      role: "Verified Patient Family",
      hospital: "New Delhi Central Corridor"
    }
  ];

  const faqs = [
    {
      q: "How does the ABDM M3 Fast-Track Scan & Share system work?",
      a: "MediVerse AI connects directly to the Ayushman Bharat Digital Mission (ABDM) national health gateway. Patients scan the hospital reception QR code with any ABDM-enabled app to instantly share demographic and medical records, skipping paperwork and receiving a prioritized digital OPD queue token."
    },
    {
      q: "How is patient medical data protected and encrypted?",
      a: "All personal health records (PHR), PACS imaging data, and telemetry are encrypted with military-grade AES-256 GCM encryption at rest and TLS 1.3 in transit. Our infrastructure is 100% compliant with ISO 27001, DISHA (India), HIPAA, and SOC 2 Type II zero-trust security standards."
    },
    {
      q: "How does the autonomous 108 Emergency SOS link with hospital ICUs?",
      a: "The Emergency OS tracks real-time GPS coordinates of active ACLS ambulances, onboard oxygen tank PSI, and portable ventilator status. When dispatched, it transmits a standardized triage packet to the receiving hospital's Level-1 trauma bay, automatically reserving vacant beds and ventilators before arrival."
    },
    {
      q: "What is the MONAI Swin UNETR 3D WebGPU PACS engine?",
      a: "It is our state-of-the-art volumetric neural segmentation pipeline that runs directly inside modern web browsers using WebGPU acceleration. Radiologists can inspect full 3D CT/MRI scans with real-time neural tumor segmentation and Grad-CAM explainability overlays in under 12 milliseconds without installing local software."
    },
    {
      q: "How fast is the Express E-Pharmacy delivery guarantee?",
      a: "Prescriptions validated through ABDM M3 are routed to the nearest regional cold-chain pharmaceutical depot. We guarantee verified 2-hour doorstep delivery for acute medications across all networked metro sectors."
    }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC', color: '#0F172A', position: 'relative' }}>
      
      {/* 1. FULL SCREEN HERO SECTION WITH SMOOTH IMAGE TRANSITION & POPPING LOGIN BUTTON */}
      <section style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden', backgroundColor: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
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

        {/* Dark & Luminous Radial Vignette Overlay */}
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
          
          {/* 1. Primary Model Action Button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button 
              onClick={() => {
                if (activeSlide.id === 3) {
                  window.open('http://localhost:5175', '_blank');
                } else {
                  setShowLoginModal(true);
                }
              }} 
              style={{ 
                background: 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)', 
                color: '#FFFFFF', 
                border: '1px solid rgba(255, 255, 255, 0.35)', 
                padding: '13px 34px', 
                borderRadius: '30px', 
                fontSize: '14px', 
                fontWeight: 800, 
                cursor: 'pointer', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px', 
                boxShadow: '0 6px 24px rgba(2, 132, 199, 0.55)', 
                transition: 'all 0.25s ease' 
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

        {/* BOTTOM SECTION: POPPING LOGIN BUTTON POSITIONED AT SCREEN BOTTOM */}
        <div style={{ position: 'absolute', bottom: '36px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: 'max-content' }}>
          <button 
            onClick={() => setShowLoginModal(true)}
            className="popping-login-btn"
          >
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={13} color="#FFFFFF" />
            </div>
            <span>LOG IN TO PORTAL</span>
            <ArrowRight size={17} />
          </button>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600, letterSpacing: '0.04em', textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>
            ABDM M3 CERTIFIED • MULTI-ROLE CLINICAL ACCESS
          </div>
        </div>

      </section>

      {/* 2. LIVE SOVEREIGN TELEMETRY TICKER (ANIMATED BANNER) */}
      <div style={{ background: '#020617', borderTop: '1px solid rgba(0, 242, 254, 0.2)', borderBottom: '1px solid rgba(0, 242, 254, 0.2)', padding: '14px 0', overflow: 'hidden', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
        <div style={{ display: 'inline-flex', gap: '32px', animation: 'marquee 25s linear infinite', color: '#94A3B8', fontSize: '12px', fontWeight: 700 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00F2FE' }}>
            <Radio size={14} /> ABDM M3 INTEGRATED HEALTH MESH ACTIVE
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ADE80' }}>
            <Activity size={14} /> 24/7 LEVEL-1 TRAUMA RESUSCITATION TELEMETRY
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38BDF8' }}>
            <Brain size={14} /> 12MS WEBGPU 3D MONAI VOLUMETRIC SEGMENTATION
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#FBBF24' }}>
            <ShieldCheck size={14} /> DISHA & HIPAA ZERO-TRUST ENCRYPTION
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EF4444' }}>
            <Ambulance size={14} /> 108 RAPID TRAUMA NETWORK: 28 UNITS DISPATCHED
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A855F7' }}>
            <Cpu size={14} /> SAMD CDSS DRUG-RESISTANCE MAPPER ONLINE
          </span>
        </div>
      </div>

      {/* 3. RAPID SYMPTOM AI TRIAGE & CDSS DISPATCH SECTION */}
      <section style={{ padding: '80px 48px 40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="glass-panel" style={{ padding: '40px', background: '#FFFFFF', borderRadius: '24px', border: '1.5px solid #E2E8F0', boxShadow: '0 20px 50px rgba(0,0,0,0.06)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', boxShadow: '0 6px 18px rgba(2, 132, 199, 0.35)' }}>
                <Activity size={28} />
              </div>
              <div>
                <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
                  BAYESIAN CLINICAL SYMPTOM AI TRIAGE
                </h2>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  Neural CDSS natural language symptom analyzer & emergency trauma dispatch
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F0FDF4', border: '1px solid #86EFAC', padding: '6px 14px', borderRadius: '20px', color: '#166534', fontSize: '11.5px', fontWeight: 800 }}>
              <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }} />
              <span>CDSS AI INFERENCE: 18MS</span>
            </div>
          </div>

          <p style={{ fontSize: '14.5px', color: '#475569', lineHeight: '1.6', marginBottom: '20px' }}>
            Describe your clinical symptoms or pick one of the sample presentations below. Our sovereign neural classifier cross-references ICD-10 diagnostic protocols to evaluate urgency.
          </p>

          {/* Quick Symptoms Suggestion Chips */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, alignSelf: 'center' }}>QUICK CHIPS:</span>
            {[
              'Acute severe chest pressure radiating to left arm',
              'High fever 103°F with dry cough & chills',
              'Sudden onset throbbing unilateral headache with aura',
              'Severe lower right abdominal pain with nausea'
            ].map(chip => (
              <button
                key={chip}
                onClick={() => {
                  setTriageQuery(chip);
                  handleTriageExecute(chip);
                }}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  color: '#1E293B',
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.borderColor = '#94A3B8'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
              >
                + {chip}
              </button>
            ))}
          </div>

          {/* Omnibar Input */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <input 
              type="text" 
              value={triageQuery} 
              onChange={(e) => setTriageQuery(e.target.value)} 
              onKeyDown={(e) => e.key === 'Enter' && handleTriageExecute()}
              placeholder="Describe symptoms in your own words (e.g., severe acute chest discomfort radiating to left jaw)..." 
              style={{ flex: 1, background: '#F8FAFC', border: '1.5px solid #CBD5E1', color: '#0F172A', padding: '16px 20px', borderRadius: '14px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }} 
              onFocus={(e) => { e.target.style.borderColor = '#0077B6'; }}
              onBlur={(e) => { e.target.style.borderColor = '#CBD5E1'; }}
            />
            <button 
              onClick={() => handleTriageExecute()} 
              style={{ background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', color: '#FFFFFF', border: 'none', padding: '0 34px', borderRadius: '14px', fontWeight: 900, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 20px rgba(0, 180, 216, 0.4)', letterSpacing: '0.02em' }}
            >
              <span>Analyze Live</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Live Triage Results Banner */}
          {triageResult && (
            <div style={{ marginTop: '22px', background: triageResult.riskLevel.includes('RED') ? '#FEF2F2' : triageResult.riskLevel.includes('YELLOW') ? '#FFFBEB' : '#F0FDF4', border: `1.5px solid ${triageResult.riskLevel.includes('RED') ? '#FCA5A5' : triageResult.riskLevel.includes('YELLOW') ? '#FCD34D' : '#86EFAC'}`, padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ color: triageResult.riskLevel.includes('RED') ? '#DC2626' : triageResult.riskLevel.includes('YELLOW') ? '#D97706' : '#16A34A', fontWeight: 900, fontSize: '17px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldAlert size={20} />
                  <span>{triageResult.riskLevel}</span>
                </div>
                <span className="font-data-mono" style={{ fontSize: '11px', background: 'rgba(0,0,0,0.06)', padding: '3px 10px', borderRadius: '10px', fontWeight: 700 }}>
                  ICD-10 MATCH CONFIDENCE: 98.4%
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#1E293B', lineHeight: '1.6' }}>{triageResult.summary}</div>
              
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
                {triageResult.actions.map((act, i) => (
                  <div key={i} style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={13} color="#16A34A" />
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. THE 6 SOVEREIGN PLATFORM PILLARS (INTERACTIVE GRID WITH GLOW) */}
      <section style={{ padding: '40px 48px 80px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', border: '1px solid rgba(2, 132, 199, 0.25)', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, marginBottom: '12px' }}>
            <Award size={13} /> SOVEREIGN ARCHITECTURE
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 900, color: '#0F172A', margin: '0 0 12px 0', letterSpacing: '-0.02em' }}>
            Engineered for Precision, Speed & Autonomy
          </h2>
          <p style={{ fontSize: '16px', color: '#64748B', maxWidth: '640px', margin: '0 auto', lineHeight: '1.6' }}>
            An integrated clinical ecosystem designed from the ground up for hospitals, clinicians, and patients.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
          
          {/* Pillar 1: 3D PACS */}
          <div className="glass-panel" style={{ padding: '32px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.25s' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 20px rgba(2, 132, 199, 0.3)' }}>
              <Brain size={28} />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>3D WebGPU PACS Studio</div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              Full multi-planar CT/MRI volumetric rendering powered by MONAI Swin UNETR deep neural segmentation with zero local software footprint.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#F1F5F9', color: '#0284C7', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>12ms WebGPU</span>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#F1F5F9', color: '#0284C7', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>DICOM 3.0</span>
            </div>
          </div>

          {/* Pillar 2: ABDM Fast-Track */}
          <div className="glass-panel" style={{ padding: '32px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.25s' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)' }}>
              <QrCode size={28} />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>ABDM M3 Scan & Share</div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              Paperless OPD check-ins with instant ABHA Health Locker synchronization, token dispatching, and automated NHCX cashless claims clearance.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#EFF6FF', color: '#2563EB', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>ABDM M1-M3</span>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#EFF6FF', color: '#2563EB', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>NHCX Claims</span>
            </div>
          </div>

          {/* Pillar 3: SaMD CDSS AI Engine */}
          <div className="glass-panel" style={{ padding: '32px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.25s' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)' }}>
              <Cpu size={28} />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>SaMD CDSS AI Engine</div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              Class II SaMD clinical decision support system with real-time antimicrobial resistance mapping, drug contraindication alerts, and evidence trees.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#F5F3FF', color: '#7C3AED', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>FDA Class II</span>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#F5F3FF', color: '#7C3AED', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>Antibiogram Radar</span>
            </div>
          </div>

          {/* Pillar 4: Autonomous 108 Emergency OS */}
          <div 
            className="glass-panel" 
            onClick={() => window.open('http://localhost:5175', '_blank')}
            style={{ 
              padding: '32px', 
              background: '#FFFFFF', 
              borderRadius: '20px', 
              border: '1.5px solid #FCA5A5', 
              boxShadow: '0 8px 30px rgba(239, 68, 68, 0.08)', 
              cursor: 'pointer',
              transition: 'all 0.25s' 
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 36px rgba(239, 68, 68, 0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(239, 68, 68, 0.08)'; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(239, 68, 68, 0.35)' }}>
                <Ambulance size={28} />
              </div>
              <span style={{ fontSize: '10.5px', background: 'rgba(239, 68, 68, 0.15)', color: '#DC2626', border: '1px solid #FCA5A5', padding: '3px 9px', borderRadius: '12px', fontWeight: 800 }}>
                OPEN 108 OS ↗
              </span>
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>108 Emergency & Disaster OS</div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              Area-by-area live GPS fleet radar, pre-hospital triage checklist, vacant ICU ventilators grid, and cryogenic liquid O2 bank telemetry.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#FEF2F2', color: '#DC2626', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>Sub-5 Min ETA</span>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#FEF2F2', color: '#DC2626', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>Live ICU Grid</span>
            </div>
          </div>

          {/* Pillar 5: E-Pharmacy */}
          <div className="glass-panel" style={{ padding: '32px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.25s' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}>
              <Pill size={28} />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>Express 2-Hr E-Pharmacy</div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              Automated e-prescription ingestion with QR batch verification, temperature-monitored cold-chain courier dispatch, and auto-refill schedules.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#F0FDF4', color: '#16A34A', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>2-Hour Doorstep</span>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#F0FDF4', color: '#16A34A', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>Cold-Chain GPS</span>
            </div>
          </div>

          {/* Pillar 6: n8n AI Operations Mesh */}
          <div className="glass-panel" style={{ padding: '32px', background: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: '0 8px 30px rgba(0,0,0,0.03)', transition: 'all 0.25s' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)' }}>
              <Bot size={28} />
            </div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginBottom: '10px' }}>Agentic Hospital Automation</div>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              Autonomous multi-agent workflows executing automated discharge summaries, ward turnaround protocols, and lab abnormal alert escalation.
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#FFFBEB', color: '#D97706', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>n8n Agentic Mesh</span>
              <span className="font-data-mono" style={{ fontSize: '10px', background: '#FFFBEB', color: '#D97706', padding: '3px 8px', borderRadius: '6px', fontWeight: 700 }}>Automated Discharge</span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE CLINICAL STUDIO DEEP-DIVE (TABBED SHOWCASE) */}
      <section style={{ padding: '60px 48px 80px', background: '#0F172A', color: '#FFFFFF' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0, 242, 254, 0.15)', color: '#00F2FE', border: '1px solid rgba(0, 242, 254, 0.35)', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, marginBottom: '12px' }}>
              <Layers size={13} /> INTERACTIVE CLINICAL STUDIO
            </div>
            <h2 style={{ fontSize: '34px', fontWeight: 900, color: '#FFFFFF', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
              Experience the Professional Clinical Interface
            </h2>
            <p style={{ fontSize: '15px', color: '#94A3B8', maxWidth: '600px', margin: '0 auto' }}>
              Switch between departments to preview live diagnostic workflows used by radiologists, intensivists, and medical administrators.
            </p>
          </div>

          {/* Department Tab Buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
            {[
              { id: 'PACS', label: '🧠 3D Imaging & MONAI PACS', desc: 'Volumetric CT/MRI segmentation' },
              { id: 'EMR', label: '📋 ABDM Fast-Track EMR', desc: 'FHIR health record locker' },
              { id: 'ICU', label: '🫁 Smart ICU Bed Matrix', desc: 'Live ventilator & vitals telemetry' },
              { id: 'GENOMICS', label: '🔬 Pathology & LIMS Queue', desc: 'Digital accessioning & specimen barcode' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveStudioTab(tab.id as any)}
                style={{
                  background: activeStudioTab === tab.id ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' : 'rgba(255, 255, 255, 0.05)',
                  color: activeStudioTab === tab.id ? '#FFFFFF' : '#94A3B8',
                  border: activeStudioTab === tab.id ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                  padding: '12px 22px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: activeStudioTab === tab.id ? '0 4px 20px rgba(2, 132, 199, 0.45)' : 'none'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Studio Preview Canvas */}
          <div style={{ background: '#070D1E', border: '1px solid rgba(0, 242, 254, 0.3)', borderRadius: '20px', padding: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}>
            
            {activeStudioTab === 'PACS' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'center' }}>
                <div style={{ background: '#020617', border: '1px solid #1E293B', borderRadius: '16px', overflow: 'hidden', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', marginBottom: '10px' }}>
                    <span className="font-data-mono">STUDY: HEAD_CTA_ANGIO_3D</span>
                    <span className="font-data-mono" style={{ color: '#4ADE80' }}>MONAI INFERENCE: 11.8ms</span>
                  </div>
                  <img 
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80" 
                    alt="PACS Preview" 
                    style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '10px', filter: 'contrast(1.2)' }} 
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="font-data-mono" style={{ fontSize: '11.5px', color: '#00F2FE', fontWeight: 800 }}>MODULE: WEBGPU MONAI VOLUMETRIC STUDIO</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>Automated Multi-Organ Neural Segmentation</h3>
                  <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>
                    Processes volumetric DICOM slices in parallel with GPU shaders. Highlights lesions with Grad-CAM neural attention overlays and generates structured radiology report drafts with 98.7% concordance.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '6px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>Inference VRAM</div>
                      <div className="font-data-mono" style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>1.4 GB WebGPU</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>Diagnostic Standard</div>
                      <div className="font-data-mono" style={{ fontSize: '14px', fontWeight: 800, color: '#4ADE80' }}>HL7 DICOM 3.0</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStudioTab === 'EMR' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '28px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="font-data-mono" style={{ fontSize: '11.5px', color: '#38BDF8', fontWeight: 800 }}>MODULE: ABDM M3 FAST-TRACK CONSENT ENGINE</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>Unified ABHA Digital Health Passport</h3>
                  <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>
                    Zero-latency patient record aggregation across hospitals, clinics, and diagnostic labs. Features time-bound granular consent controls and automated insurance claim routing via NHCX.
                  </p>
                  <button 
                    onClick={() => setShowLoginModal(true)}
                    style={{ width: 'fit-content', background: 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)', color: '#FFF', border: 'none', padding: '10px 20px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}
                  >
                    <span>Create Free ABHA Passport</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
                <div style={{ background: '#020617', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFF' }}>ABHA ID: 91-4820-1928-4410</div>
                    <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800 }}>ACTIVE PASSPORT</span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>Linked Encrypted Records: 14 Diagnostics • 8 Prescriptions • 3 OPD Passes</div>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px', fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Recent Admission:</span>
                      <strong style={{ color: '#FFF' }}>Cardiology OPD — AIIMS</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Biomarker Status:</span>
                      <strong style={{ color: '#4ADE80' }}>BP: 120/80 • SpO2: 99%</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStudioTab === 'ICU' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'center' }}>
                <div style={{ background: '#020617', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-data-mono" style={{ fontSize: '12px', color: '#EF4444', fontWeight: 800 }}>ICU BED HUD: BAY 04 (POLYTRAUMA)</span>
                    <span style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#FCA5A5', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800 }}>CRITICAL TELEMETRY</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>HEART RATE</div>
                      <div className="font-data-mono" style={{ fontSize: '18px', fontWeight: 900, color: '#4ADE80' }}>78 bpm</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>SpO2</div>
                      <div className="font-data-mono" style={{ fontSize: '18px', fontWeight: 900, color: '#38BDF8' }}>98%</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>HAMILTON VENT</div>
                      <div className="font-data-mono" style={{ fontSize: '18px', fontWeight: 900, color: '#FBBF24' }}>14.2 Bar</div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="font-data-mono" style={{ fontSize: '11.5px', color: '#EF4444', fontWeight: 800 }}>MODULE: SMART ICU HUD & DISASTER MESH</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>Sub-Second Telemetry & Bed Reservation</h3>
                  <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>
                    Connects all intensive care ventilator beds, cryogenic liquid oxygen reservoirs, and automated infusion pumps to a unified hospital HUD for zero-delay triage.
                  </p>
                </div>
              </div>
            )}

            {activeStudioTab === 'GENOMICS' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '28px', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="font-data-mono" style={{ fontSize: '11.5px', color: '#D97706', fontWeight: 800 }}>MODULE: PATHOLOGY & LIMS ACCESSIONING</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>Automated Specimen Barcoding & AI Differential</h3>
                  <p style={{ fontSize: '14px', color: '#94A3B8', lineHeight: '1.6', margin: 0 }}>
                    Automated specimen ingestion linking tube barcodes with patient ABHA IDs. Features AI-assisted peripheral blood smear differential cell counts and instant critical value push alerts.
                  </p>
                </div>
                <div style={{ background: '#020617', border: '1px solid #1E293B', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFF' }}>LIMS SPECIMEN QUEUE (ACTIVE BATCH)</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {[
                      { tube: 'BARCODE #EDTA-9921', test: 'Complete Blood Count (CBC)', status: 'VERIFIED (NOMINAL)' },
                      { tube: 'BARCODE #SST-4401', test: 'Cardiac Troponin I (High-Sens)', status: 'CRITICAL VALUE ALERT' },
                      { tube: 'BARCODE #CIT-1192', test: 'Coagulation PT/INR', status: 'IN PROCESSING' }
                    ].map((item, idx) => (
                      <div key={idx} style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <div>
                          <strong className="font-data-mono" style={{ color: '#38BDF8' }}>{item.tube}</strong>
                          <div style={{ fontSize: '11px', color: '#94A3B8' }}>{item.test}</div>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 800, color: item.status.includes('CRITICAL') ? '#EF4444' : '#4ADE80' }}>
                          {item.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* 6. REAL-TIME IMPACT & METRICS SECTION */}
      <section style={{ padding: '80px 48px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, #070D1E 0%, #0F172A 100%)', border: '1px solid rgba(0, 242, 254, 0.3)', borderRadius: '24px', padding: '48px 40px', boxShadow: '0 20px 50px rgba(0,0,0,0.15)', color: '#FFFFFF' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Validated Clinical Scale & Real-World Impact
            </h2>
            <p style={{ fontSize: '15px', color: '#94A3B8', margin: 0 }}>
              Operating 24/7 across major government and private hospital networks in India.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', textAlign: 'center' }}>
            
            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '16px' }}>
              <div className="font-data-mono" style={{ fontSize: '36px', fontWeight: 900, color: '#00F2FE' }}>2.4M+</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0', marginTop: '4px' }}>Verified ABHA Records</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Synced via ABDM M3 Mesh</div>
            </div>

            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '16px' }}>
              <div className="font-data-mono" style={{ fontSize: '36px', fontWeight: 900, color: '#4ADE80' }}>98.7%</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0', marginTop: '4px' }}>Diagnostic Concordance</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>MONAI Swin UNETR PACS</div>
            </div>

            <div style={{ borderRight: '1px solid rgba(255, 255, 255, 0.1)', paddingRight: '16px' }}>
              <div className="font-data-mono" style={{ fontSize: '36px', fontWeight: 900, color: '#EF4444' }}>4.2 Mins</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0', marginTop: '4px' }}>Avg Emergency Response</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>108 Rapid Trauma Network</div>
            </div>

            <div>
              <div className="font-data-mono" style={{ fontSize: '36px', fontWeight: 900, color: '#FBBF24' }}>380+</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0', marginTop: '4px' }}>Hospital Nodes Connected</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Multi-Speciality Mesh</div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. STEP-BY-STEP PATIENT & CLINICIAN JOURNEY */}
      <section style={{ padding: '40px 48px 80px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, marginBottom: '12px' }}>
            <TrendingUp size={13} /> STREAMLINED CARE JOURNEY
          </div>
          <h2 style={{ fontSize: '34px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
            How MediVerse AI Powers End-to-End Care
          </h2>
          <p style={{ fontSize: '15px', color: '#64748B', maxWidth: '600px', margin: '0 auto' }}>
            From pre-hospital emergency alert to post-discharge medication management.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
          
          <div className="glass-panel" style={{ padding: '28px', background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '18px', right: '18px', fontSize: '28px', fontWeight: 900, color: '#E2E8F0' }}>01</div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#EFF6FF', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <QrCode size={22} />
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 900, margin: '0 0 8px 0', color: '#0F172A' }}>Instant ABHA Check-In</h4>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
              Scan reception QR code to transmit verified past medical records, allergies, and insurance info in one tap.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px', background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '18px', right: '18px', fontSize: '28px', fontWeight: 900, color: '#E2E8F0' }}>02</div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Activity size={22} />
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 900, margin: '0 0 8px 0', color: '#0F172A' }}>AI Pre-Consult Triage</h4>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
              Bayesian symptom classifier slots patients into emergency resuscitation or priority specialty OPD queues.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px', background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '18px', right: '18px', fontSize: '28px', fontWeight: 900, color: '#E2E8F0' }}>03</div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F5F3FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Brain size={22} />
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 900, margin: '0 0 8px 0', color: '#0F172A' }}>SaMD Clinical Consult</h4>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
              Doctors review 3D PACS scans with AI segmentation overlays and receive real-time drug interaction safeguards.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '28px', background: '#FFFFFF', borderRadius: '18px', border: '1px solid #E2E8F0', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '18px', right: '18px', fontSize: '28px', fontWeight: 900, color: '#E2E8F0' }}>04</div>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#FFFBEB', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <Truck size={22} />
            </div>
            <h4 style={{ fontSize: '17px', fontWeight: 900, margin: '0 0 8px 0', color: '#0F172A' }}>2-Hr Doorstep Pharmacy</h4>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: '1.5', margin: 0 }}>
              Prescriptions sync with cold-chain pharmaceutical depots for express 2-hour doorstep delivery.
            </p>
          </div>

        </div>
      </section>

      {/* 8. CLINICAL TESTIMONIALS */}
      <section style={{ padding: '60px 48px 80px', background: '#F1F5F9' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto', width: '100%', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', border: '1px solid rgba(2, 132, 199, 0.25)', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, marginBottom: '12px' }}>
            <Award size={13} /> CLINICAL TESTIMONIALS
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: '0 0 28px 0', letterSpacing: '-0.02em' }}>
            Trusted by India’s Leading Medical Institutions
          </h2>

          <div className="glass-panel" style={{ padding: '40px', background: '#FFFFFF', borderRadius: '24px', border: '1px solid #CBD5E1', boxShadow: '0 12px 36px rgba(0,0,0,0.04)', minHeight: '220px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '18px', color: '#1E293B', fontStyle: 'italic', lineHeight: '1.7', margin: '0 0 20px 0' }}>
              "{testimonials[activeTestimonial].quote}"
            </p>

            <div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#0F172A' }}>{testimonials[activeTestimonial].author}</div>
              <div style={{ fontSize: '13px', color: '#0284C7', fontWeight: 700 }}>{testimonials[activeTestimonial].role}</div>
              <div className="font-data-mono" style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>{testimonials[activeTestimonial].hospital}</div>
            </div>
          </div>

          {/* Testimonial Selectors */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                style={{
                  width: activeTestimonial === idx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: activeTestimonial === idx ? '#0284C7' : '#CBD5E1',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 9. INTERACTIVE FAQ ACCORDION */}
      <section style={{ padding: '80px 48px', maxWidth: '980px', margin: '0 auto', width: '100%' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', border: '1px solid rgba(2, 132, 199, 0.25)', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, marginBottom: '12px' }}>
            <HelpCircle size={13} /> FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 style={{ fontSize: '32px', fontWeight: 900, color: '#0F172A', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>
            Everything You Need to Know
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '16px', overflow: 'hidden', transition: 'all 0.2s', boxShadow: openFaq === idx ? '0 8px 24px rgba(0,0,0,0.04)' : 'none' }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                style={{ width: '100%', padding: '20px 24px', background: 'transparent', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left', cursor: 'pointer' }}
              >
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>{faq.q}</span>
                {openFaq === idx ? <ChevronUp size={18} color="#0077B6" /> : <ChevronDown size={18} color="#94A3B8" />}
              </button>
              
              {openFaq === idx && (
                <div style={{ padding: '0 24px 20px', fontSize: '14px', color: '#475569', lineHeight: '1.6', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

      </section>

      {/* 10. GRAND CTA BANNER */}
      <section style={{ padding: '0 48px 80px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 50%, #075985 100%)', borderRadius: '28px', padding: '54px 40px', color: '#FFFFFF', textAlign: 'center', boxShadow: '0 25px 60px rgba(2, 132, 199, 0.35)', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ position: 'relative', zIndex: 10, maxWidth: '780px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '38px', fontWeight: 900, margin: '0 0 16px 0', letterSpacing: '-0.02em', lineHeight: '1.2' }}>
              Experience Sovereign Precision Health Intelligence Today
            </h2>
            <p style={{ fontSize: '16px', color: '#E0F2FE', margin: '0 0 32px 0', lineHeight: '1.6' }}>
              Join thousands of clinicians, hospital networks, and patients connected to India’s most advanced ABDM-certified clinical operating system.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowLoginModal(true)}
                style={{ background: '#FFFFFF', color: '#0284C7', border: 'none', padding: '14px 34px', borderRadius: '30px', fontSize: '14px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 6px 20px rgba(0,0,0,0.15)' }}
              >
                <span>Access Clinical Portal</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={() => window.open('http://localhost:5175', '_blank')}
                style={{ background: 'rgba(0,0,0,0.25)', color: '#FFFFFF', border: '1px solid rgba(255,255,255,0.4)', padding: '14px 28px', borderRadius: '30px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Ambulance size={16} />
                <span>Launch 108 Emergency OS ↗</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 11. PROFESSIONAL SOVEREIGN FOOTER */}
      <footer style={{ background: '#070D1E', color: '#94A3B8', padding: '60px 48px 30px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
          
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <HeartPulse size={20} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF' }}>MediVerse <strong style={{ color: '#00F2FE' }}>AI</strong></span>
            </div>
            <p style={{ fontSize: '13px', lineHeight: '1.6', margin: '0 0 16px 0', maxWidth: '320px' }}>
              Sovereign Clinical Intelligence & Precision Health Operating System. Interconnected with ABDM M3, MONAI 3D PACS, and the National 108 Emergency Dispatch Network.
            </p>
            <div className="font-data-mono" style={{ fontSize: '11px', color: '#4ADE80' }}>
              ISO 27001 • HL7 FHIR R4 • DICOM 3.0 • DISHA COMPLIANT
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>CLINICAL PLATFORM</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowLoginModal(true)}>3D WebGPU PACS</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowLoginModal(true)}>SaMD CDSS Engine</span>
              <span style={{ cursor: 'pointer' }} onClick={() => window.open('http://localhost:5175', '_blank')}>108 Emergency Radar</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowLoginModal(true)}>ABDM M3 Health Passport</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowLoginModal(true)}>Express E-Pharmacy</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>PORTALS & ACCESS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowLoginModal(true)}>Patient Health Passport</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowLoginModal(true)}>Doctor Clinical Cockpit</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowLoginModal(true)}>Hospital Reception Desk</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowLoginModal(true)}>Smart Nursing HUD</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setShowLoginModal(true)}>Diagnostic LIMS Queue</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>NATIONAL EMERGENCY HOTLINES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <span style={{ color: '#EF4444', fontWeight: 800 }}>🚨 Ambulance & Trauma: 108</span>
              <span style={{ color: '#FBBF24', fontWeight: 800 }}>⚡ National Emergency: 112</span>
              <span style={{ color: '#38BDF8', fontWeight: 800 }}>📞 Health Ministry Helpline: 1075</span>
              <span style={{ color: '#94A3B8', marginTop: '6px' }}>Support: support@mediverse.ai</span>
            </div>
          </div>

        </div>

        <div style={{ maxWidth: '1240px', margin: '0 auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', fontSize: '12px' }}>
          <div>© 2026 MediVerse AI Precision Health OS. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>ABDM Data Consent</span>
            <span>Terms of Service</span>
            <span>Security Whitepaper</span>
          </div>
        </div>
      </footer>

      {/* 12. MEDIVERSE AI PORTAL LOGIN & REGISTRATION MODAL */}
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
                {/* BRAND HEADER */}
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
                        placeholder="Enter your email or username"
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

                  {/* PRIMARY LOG IN BUTTON */}
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
                        placeholder="Enter your email address"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px 16px 10px 46px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                      Password
                    </label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <Lock size={18} color="#64748B" style={{ position: 'absolute', left: '16px' }} />
                      <input 
                        type="password"
                        placeholder="Create a strong password"
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        required
                        style={{ width: '100%', padding: '10px 16px 10px 46px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '13px', color: '#0F172A', outline: 'none' }}
                      />
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

                  {/* Pre-existing Conditions */}
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                      Pre-existing Conditions / Allergies
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g., Asthma, Hypertension (optional)"
                      value={registerForm.illnesses}
                      onChange={(e) => setRegisterForm({ ...registerForm, illnesses: e.target.value })}
                      style={{ width: '100%', padding: '10px 16px', borderRadius: '24px', border: '1px solid #CBD5E1', background: '#FFFFFF', fontSize: '12px', color: '#0F172A', outline: 'none' }}
                    />
                  </div>

                  {/* Consent Checkbox */}
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

                  {/* Submit Button */}
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

                {/* Switch to Login */}
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

      {/* 13. FLOATING CHATBOT WIDGET */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 90 }}>
        {!isChatOpen ? (
          <button 
            onClick={() => setIsChatOpen(true)} 
            style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)', color: '#FFF', border: 'none', boxShadow: '0 8px 24px rgba(0, 180, 216, 0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <Bot size={28} />
          </button>
        ) : (
          <div className="glass-panel" style={{ width: '380px', height: '480px', display: 'flex', flexDirection: 'column', background: '#FFFFFF', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', borderRadius: '16px', overflow: 'hidden' }}>
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

    </div>
  );
}
