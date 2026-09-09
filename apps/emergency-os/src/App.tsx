import React, { useState } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  Ambulance, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  Send, 
  Filter, 
  Layers, 
  Droplets, 
  X, 
  Radio, 
  Navigation, 
  ArrowLeft,
  Flame,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

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

export default function App() {
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

  const [reserveVentModal, setReserveVentModal] = useState<VentilatorBay | null>(null);
  const [showO2RefillModal, setShowO2RefillModal] = useState<OxygenReserveNode | null>(null);
  const [broadcastBloodModal, setBroadcastBloodModal] = useState<BloodBankReserve | null>(null);

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
  const availableAmbulances = mockAmbulanceFleet.filter(a => a.status === 'AVAILABLE_STANDBY').length;
  const dispatchedAmbulances = mockAmbulanceFleet.filter(a => a.status === 'EN_ROUTE_INCIDENT' || a.status === 'PATIENT_ONBOARD').length;
  const totalVacantVents = mockVentilatorBays.reduce((acc, curr) => acc + curr.invasiveVentilators.vacant, 0);
  const totalO2Stock = mockOxygenNodes.reduce((acc, curr) => acc + curr.lmoCurrentStockKL, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#030712', color: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      
      {/* GLOBAL TOP NAVIGATION HEADER */}
      <header style={{ height: '70px', background: 'rgba(7, 13, 30, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        
        {/* Brand & Live Alert Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(239, 68, 68, 0.7)' }}>
            <Ambulance size={24} color="#FFF" />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.02em', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>MediVerse <strong style={{ color: '#EF4444' }}>SOS</strong></span>
              <span style={{ fontSize: '9.5px', background: 'rgba(239, 68, 68, 0.25)', color: '#FCA5A5', border: '1px solid #EF4444', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                108 RAPID TRAUMA NETWORK
              </span>
            </div>
            <div className="font-data-mono" style={{ fontSize: '10.5px', color: '#94A3B8' }}>
              NATIONAL EMERGENCY COMMAND • ZERO-LATENCY TELEMETRY
            </div>
          </div>
        </div>

        {/* Action Controls & Return Bridge to Ecosystem Portals */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port ? 'http://localhost:5176' : '/'}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#94A3B8',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            title="Main Home Portal"
          >
            <span>MediVerse Home</span>
          </a>

          <a
            href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port ? 'http://localhost:5173' : '/hospital/'}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#38BDF8',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            title="Hospital Clinical Workstation"
          >
            <ArrowLeft size={13} />
            <span>Clinical Workstation</span>
          </a>

          <a
            href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port ? 'http://localhost:5174' : '/manager/'}
            style={{
              background: 'linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(2, 132, 199, 0.2) 100%)',
              color: '#00F2FE',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              padding: '7px 13px',
              borderRadius: '8px',
              fontSize: '11.5px',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s'
            }}
            title="Manager AI Operations Platform"
          >
            <span>Manager OS</span>
          </a>

          <button
            onClick={() => setShowIncidentDispatchModal(true)}
            style={{
              background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
              color: '#FFFFFF',
              border: '1px solid #FCA5A5',
              padding: '9px 18px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 0 20px rgba(239, 68, 68, 0.6)'
            }}
          >
            <ShieldAlert size={15} />
            <span>MASS CASUALTY / SOS</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main style={{ padding: '28px 40px', flex: 1, display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* 1. TOP METRIC RIBBON */}
        <div style={{
          background: 'linear-gradient(135deg, #070D1E 0%, #0F172A 100%)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '16px',
          padding: '16px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '14px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.5)'
        }}>
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '12px' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>ACLS FLEET IN TRANSIT</div>
            <div className="font-data-mono" style={{ fontSize: '20px', fontWeight: 900, color: '#38BDF8', marginTop: '2px' }}>
              {dispatchedAmbulances} Dispatched
            </div>
            <div style={{ fontSize: '10px', color: '#4ADE80' }}>{availableAmbulances} Units on Standby</div>
          </div>

          <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '12px' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>VACANT INVASIVE VENTS</div>
            <div className="font-data-mono" style={{ fontSize: '20px', fontWeight: 900, color: '#4ADE80', marginTop: '2px' }}>
              {totalVacantVents} Ready
            </div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Across 5 Trauma Centers</div>
          </div>

          <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '12px' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>LMO CRYOGENIC O2</div>
            <div className="font-data-mono" style={{ fontSize: '20px', fontWeight: 900, color: '#00F2FE', marginTop: '2px' }}>
              {totalO2Stock.toFixed(1)} kL
            </div>
            <div style={{ fontSize: '10px', color: '#38BDF8' }}>160h Autonomy Nominal</div>
          </div>

          <div style={{ borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '12px' }}>
            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>O- RARE BLOOD PACKS</div>
            <div className="font-data-mono" style={{ fontSize: '20px', fontWeight: 900, color: '#EF4444', marginTop: '2px' }}>
              38 PRBC Units
            </div>
            <div style={{ fontSize: '10px', color: '#FCA5A5' }}>Universal Donor Ready</div>
          </div>

          <div>
            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: 700 }}>AVG RESPONSE TIME</div>
            <div className="font-data-mono" style={{ fontSize: '20px', fontWeight: 900, color: '#FBBF24', marginTop: '2px' }}>
              4.8 Mins
            </div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>Level-1 Trauma Admission</div>
          </div>
        </div>

        {/* 2. TAB SWITCHER */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '2px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px', overflowX: 'auto' }}>
          {[
            { id: 'FLEET', label: '🚑 Area Ambulance Fleet & Live GPS Radar', icon: Navigation, count: `${availableAmbulances} Standby` },
            { id: 'TRIAGE', label: '📋 Pre-Hospital Triage Checklist', icon: CheckCircle2, count: 'Protocol Ready' },
            { id: 'VENTILATORS', label: '🫁 Vacant Ventilators & ICU Bays', icon: Activity, count: `${totalVacantVents} Ready` },
            { id: 'OXYGEN', label: '💨 Oxygen Tanks & Cylinder Bank', icon: Layers, count: `${totalO2Stock.toFixed(1)} kL` },
            { id: 'BLOOD', label: '🩸 Rare Group Blood Bank Reserves', icon: Droplets, count: '8 Groups Live' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: activeTab === tab.id ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' : 'rgba(15, 23, 42, 0.7)',
                color: activeTab === tab.id ? '#FFFFFF' : '#94A3B8',
                border: activeTab === tab.id ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                padding: '10px 18px',
                borderRadius: '12px',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeTab === tab.id ? '0 4px 14px rgba(2, 132, 199, 0.45)' : 'none',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              <span>{tab.label}</span>
              <span className="font-data-mono" style={{ background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0,0,0,0.4)', color: activeTab === tab.id ? '#FFF' : '#38BDF8', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 800 }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* 3. TAB CONTENT */}

        {/* TAB 1: FLEET & LIVE GPS RADAR */}
        {activeTab === 'FLEET' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Sector Selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', background: 'rgba(15, 23, 42, 0.8)', padding: '12px 20px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Filter size={15} color="#38BDF8" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#CBD5E1' }}>SECTOR CORRIDOR:</span>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { id: 'ALL', label: 'All Sectors' },
                  { id: 'Sector 1', label: 'Sector 1: Central Delhi' },
                  { id: 'Sector 2', label: 'Sector 2: North Trauma Ring' },
                  { id: 'Sector 3', label: 'Sector 3: Airport Expressway' },
                  { id: 'Sector 4', label: 'Sector 4: South Corridor' }
                ].map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setSelectedSector(sec.id)}
                    style={{
                      background: selectedSector === sec.id ? '#0284C7' : 'rgba(255, 255, 255, 0.06)',
                      color: selectedSector === sec.id ? '#FFFFFF' : '#94A3B8',
                      border: selectedSector === sec.id ? '1px solid #38BDF8' : '1px solid rgba(255, 255, 255, 0.1)',
                      padding: '5px 12px',
                      borderRadius: '16px',
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

            {/* Split Radar Canvas & Ambulance Details */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', alignItems: 'start' }}>
              
              {/* Left: Radar Canvas */}
              <div style={{ background: '#050B1A', border: '1px solid rgba(0, 242, 254, 0.3)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', animation: 'map-pulse 2s infinite' }} />
                    <span style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF' }}>METRO GPS FLEET RADAR</span>
                  </div>
                  <span className="font-data-mono" style={{ fontSize: '11px', color: '#00F2FE' }}>
                    LIVE PULSE: 800ms
                  </span>
                </div>

                <div style={{ position: 'relative', width: '100%', height: '400px', background: '#020617', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0, 180, 216, 0.25)' }}>
                  <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
                    <defs>
                      <pattern id="ambGrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(0, 242, 254, 0.08)" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#ambGrid)" />

                    <path d="M 20,200 Q 300,160 600,220 T 900,180" fill="none" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="5" />
                    <path d="M 240,20 Q 340,200 420,380" fill="none" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="4" />
                    <path d="M 640,30 Q 580,200 700,370" fill="none" stroke="rgba(56, 189, 248, 0.35)" strokeWidth="4" />

                    <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="4 4" />
                    <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="4 4" />
                  </svg>

                  <div style={{ position: 'absolute', top: '10px', left: '12px', fontSize: '9.5px', color: '#94A3B8', fontWeight: 800 }}>SECTOR 2 (NORTH)</div>
                  <div style={{ position: 'absolute', top: '10px', right: '12px', fontSize: '9.5px', color: '#94A3B8', fontWeight: 800 }}>SECTOR 1 (CENTRAL)</div>
                  <div style={{ position: 'absolute', bottom: '10px', left: '12px', fontSize: '9.5px', color: '#94A3B8', fontWeight: 800 }}>SECTOR 3 (AIRPORT)</div>
                  <div style={{ position: 'absolute', bottom: '10px', right: '12px', fontSize: '9.5px', color: '#94A3B8', fontWeight: 800 }}>SECTOR 4 (SOUTH)</div>

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
                        {isDispatched && (
                          <div
                            style={{
                              position: 'absolute',
                              inset: -12,
                              borderRadius: '50%',
                              background: 'rgba(239, 68, 68, 0.45)',
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
              </div>

              {/* Right: Selected Ambulance Telemetry */}
              {selectedAmbulance && (
                <div style={{ background: '#0F172A', border: '1.5px solid #0284C7', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="font-data-mono" style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 800 }}>
                        {selectedAmbulance.type}
                      </span>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#FFFFFF', marginTop: '2px' }}>
                        {selectedAmbulance.vehicleNo}
                      </div>
                    </div>
                    <span style={{
                      background: selectedAmbulance.status === 'AVAILABLE_STANDBY' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                      color: selectedAmbulance.status === 'AVAILABLE_STANDBY' ? '#4ADE80' : '#FCA5A5',
                      border: `1px solid ${selectedAmbulance.status === 'AVAILABLE_STANDBY' ? '#22C55E' : '#EF4444'}`,
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '10.5px',
                      fontWeight: 800
                    }}>
                      {selectedAmbulance.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>Location Sector</div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>{selectedAmbulance.sector.split('-')[0]}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>Speed / ETA</div>
                      <div style={{ fontSize: '12px', fontWeight: 900, color: '#38BDF8' }}>{selectedAmbulance.speed} • {selectedAmbulance.eta}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Oxygen Tank PSI:</span>
                      <strong className="font-data-mono" style={{ color: '#4ADE80' }}>{selectedAmbulance.oxygenTankPsi} PSI</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Ventilator:</span>
                      <strong style={{ color: '#FFFFFF' }}>{selectedAmbulance.ventilatorModel}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#94A3B8' }}>Base Hospital:</span>
                      <strong style={{ color: '#38BDF8' }}>{selectedAmbulance.assignedHospital}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '10px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>Officer Lead:</div>
                      <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#FFFFFF' }}>{selectedAmbulance.paramedicLead}</div>
                    </div>
                    <a
                      href={`tel:${selectedAmbulance.phone}`}
                      style={{
                        background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
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
                </div>
              )}
            </div>

            {/* Complete Fleet List Table */}
            <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginBottom: '12px' }}>
                ALL ACTIVE AMBULANCES IN REGIONAL MESH
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255, 255, 255, 0.04)', color: '#94A3B8', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <th style={{ padding: '10px' }}>VEHICLE ID</th>
                      <th style={{ padding: '10px' }}>TYPE</th>
                      <th style={{ padding: '10px' }}>SECTOR</th>
                      <th style={{ padding: '10px' }}>STATUS</th>
                      <th style={{ padding: '10px' }}>SPEED / ETA</th>
                      <th style={{ padding: '10px' }}>O2 TANK</th>
                      <th style={{ padding: '10px' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAmbulances.map(amb => (
                      <tr key={amb.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <td style={{ padding: '10px', fontWeight: 800, color: '#FFFFFF' }}>{amb.vehicleNo}</td>
                        <td style={{ padding: '10px', color: '#38BDF8' }}>{amb.type.split(' ')[0]}</td>
                        <td style={{ padding: '10px', color: '#CBD5E1' }}>{amb.sector.split('-')[0]}</td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            background: amb.status === 'AVAILABLE_STANDBY' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                            color: amb.status === 'AVAILABLE_STANDBY' ? '#4ADE80' : '#FCA5A5',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '10px',
                            fontWeight: 800
                          }}>
                            {amb.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="font-data-mono" style={{ padding: '10px', color: '#FFFFFF' }}>{amb.speed}</td>
                        <td className="font-data-mono" style={{ padding: '10px', color: '#4ADE80' }}>{amb.oxygenTankPsi} PSI</td>
                        <td style={{ padding: '10px' }}>
                          <button
                            onClick={() => setSelectedAmbulance(amb)}
                            style={{ background: '#0284C7', color: '#FFF', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                          >
                            Track 📡
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

        {/* TAB 2: TRIAGE CHECKLIST */}
        {activeTab === 'TRIAGE' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '22px', alignItems: 'start' }}>
            <div style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF' }}>PRE-HOSPITAL TRIAGE CHECKLIST</div>
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>Select clinical findings to auto-evaluate triage severity and pre-alert trauma team.</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '10px', background: 'rgba(255, 255, 255, 0.05)', padding: '12px', borderRadius: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '3px' }}>AGE</label>
                  <input type="text" value={patientAge} onChange={(e) => setPatientAge(e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '6px', background: '#030712', border: '1px solid #334155', color: '#FFF', fontSize: '12px' }} />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '3px' }}>GENDER</label>
                  <select value={patientGender} onChange={(e) => setPatientGender(e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '6px', background: '#030712', border: '1px solid #334155', color: '#FFF', fontSize: '12px' }}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Pediatric</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#94A3B8', display: 'block', marginBottom: '3px' }}>INCIDENT LOCATION</label>
                  <input type="text" value={incidentLoc} onChange={(e) => setIncidentLoc(e.target.value)} style={{ width: '100%', padding: '7px', borderRadius: '6px', background: '#030712', border: '1px solid #334155', color: '#FFF', fontSize: '12px' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { key: 'airway', label: '1. Airway Compromised (Stridor / Inhalation / Foreign Body)', weight: '+3 Pts' },
                  { key: 'hypoxemia', label: '2. Severe Hypoxemia (SpO2 < 90% on room air)', weight: '+3 Pts' },
                  { key: 'shock', label: '3. Hypotension Shock (Systolic BP < 90 mmHg)', weight: '+3 Pts' },
                  { key: 'arrhythmia', label: '4. Severe Bradycardia (<40 bpm) / Tachycardia (>130 bpm)', weight: '+2 Pts' },
                  { key: 'alteredGcs', label: '5. Altered GCS (<9) / Acute Stroke Signs', weight: '+3 Pts' },
                  { key: 'polytrauma', label: '6. High Velocity Polytrauma / Crash Deformity', weight: '+3 Pts' },
                  { key: 'hemorrhage', label: '7. Active Arterial Bleeding Controlled by Tourniquet', weight: '+2 Pts' },
                  { key: 'stemi', label: '8. 12-Lead ECG Transmitted STEMI Pattern', weight: '+2 Pts' }
                ].map(item => (
                  <label key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', background: checklist[item.key] ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.03)', border: checklist[item.key] ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.08)', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input type="checkbox" checked={checklist[item.key] || false} onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })} style={{ width: '15px', height: '15px' }} />
                      <span style={{ fontSize: '12.5px', color: checklist[item.key] ? '#FCA5A5' : '#CBD5E1', fontWeight: checklist[item.key] ? 800 : 500 }}>{item.label}</span>
                    </div>
                    <span className="font-data-mono" style={{ fontSize: '11px', color: checklist[item.key] ? '#EF4444' : '#64748B', fontWeight: 800 }}>{item.weight}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => {
                  setTriageGeneratedModal({
                    token: `TRIAGE-${Math.floor(100000 + Math.random() * 900000)}`,
                    level: currentTriage.level,
                    color: currentTriage.color,
                    desc: currentTriage.desc,
                    patient: `${patientAge} y/o ${patientGender}`,
                    location: incidentLoc
                  });
                }}
                style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF', border: 'none', padding: '12px', borderRadius: '8px', fontSize: '13px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Send size={15} />
                <span>TRANSMIT TRIAGE DOSSIER TO HOSPITAL ER 📡</span>
              </button>
            </div>

            {/* Status Card */}
            <div style={{ background: '#0F172A', border: `2px solid ${currentTriage.color}`, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 800 }}>TRIAGE STATUS:</div>
              <div style={{ background: currentTriage.color, color: '#FFF', padding: '14px', borderRadius: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '17px', fontWeight: 900 }}>{currentTriage.level}</div>
                <div style={{ fontSize: '11.5px', marginTop: '3px' }}>{currentTriage.desc}</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: VENTILATORS */}
        {activeTab === 'VENTILATORS' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
            {mockVentilatorBays.map(bay => (
              <div key={bay.id} style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span className="font-data-mono" style={{ fontSize: '10.5px', color: '#38BDF8' }}>{bay.sector}</span>
                      <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', margin: '2px 0 0 0' }}>{bay.hospitalName}</h4>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>{bay.department}</div>
                    </div>
                    <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', border: '1px solid #22C55E', padding: '2px 8px', borderRadius: '8px', fontSize: '10.5px', fontWeight: 800 }}>
                      {bay.vacantBeds} Beds Vacant
                    </span>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.04)', borderRadius: '8px', padding: '10px', margin: '12px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>Invasive Vents</div>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#4ADE80' }}>{bay.invasiveVentilators.vacant} / {bay.invasiveVentilators.total} Ready</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '10px', color: '#94A3B8' }}>BiPAP / CPAP</div>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#38BDF8' }}>{bay.nonInvasiveBipap.vacant} Ready</div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setReserveVentModal(bay)}
                  style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', color: '#FFF', border: 'none', padding: '9px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Instant Reserve Ventilator Bay 🫁
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: OXYGEN RESERVES */}
        {activeTab === 'OXYGEN' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '18px' }}>
            {mockOxygenNodes.map(node => (
              <div key={node.id} style={{ background: '#0F172A', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <span className="font-data-mono" style={{ fontSize: '10.5px', color: '#38BDF8' }}>{node.sector}</span>
                      <h4 style={{ fontSize: '16px', fontWeight: 900, color: '#FFFFFF', margin: '2px 0 0 0' }}>{node.facilityName}</h4>
                    </div>
                    <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#4ADE80', padding: '2px 8px', borderRadius: '8px', fontSize: '10.5px', fontWeight: 800 }}>
                      {node.autonomyHoursRemaining}h Autonomy
                    </span>
                  </div>

                  <div style={{ margin: '12px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                      <span style={{ color: '#94A3B8' }}>LMO Cryogenic Storage:</span>
                      <strong className="font-data-mono" style={{ color: '#00F2FE' }}>{node.lmoCurrentStockKL} / {node.lmoTankCapacityKL} kL</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(node.lmoCurrentStockKL / node.lmoTankCapacityKL) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #00B4D8, #0077B6)' }} />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowO2RefillModal(node)}
                  style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#38BDF8', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '9px', borderRadius: '8px', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Dispatch LMO Refill Tanker 🚚
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: BLOOD BANK */}
        {activeTab === 'BLOOD' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {mockBloodBank.map(blood => (
              <div key={blood.group} style={{ background: '#0F172A', border: blood.status === 'CRITICAL_LOW' ? '1.5px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '10px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '15px', fontWeight: 900, color: '#FFFFFF' }}>{blood.group}</span>
                    <span style={{ background: blood.status === 'CRITICAL_LOW' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(34, 197, 94, 0.2)', color: blood.status === 'CRITICAL_LOW' ? '#FCA5A5' : '#4ADE80', padding: '2px 8px', borderRadius: '8px', fontSize: '9.5px', fontWeight: 800 }}>
                      {blood.status}
                    </span>
                  </div>

                  <div style={{ margin: '10px 0', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '11px', textAlign: 'center' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ color: '#94A3B8' }}>PRBC</div>
                      <strong className="font-data-mono" style={{ color: '#EF4444' }}>{blood.prbcUnits}</strong>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ color: '#94A3B8' }}>FFP</div>
                      <strong className="font-data-mono" style={{ color: '#FBBF24' }}>{blood.ffpUnits}</strong>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '6px', borderRadius: '6px' }}>
                      <div style={{ color: '#94A3B8' }}>Platelets</div>
                      <strong className="font-data-mono" style={{ color: '#38BDF8' }}>{blood.plateletsUnits}</strong>
                    </div>
                  </div>
                </div>

                {blood.status === 'CRITICAL_LOW' && (
                  <button
                    onClick={() => setBroadcastBloodModal(blood)}
                    style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF', border: 'none', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Broadcast Donor Alert 📢
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </main>

      {/* MODALS */}
      {triageGeneratedModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: `2px solid ${triageGeneratedModal.color}`, borderRadius: '20px', width: '100%', maxWidth: '460px', padding: '24px', textAlign: 'center', color: '#FFFFFF' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900 }}>TRIAGE DOSSIER TRANSMITTED</h3>
            <div style={{ margin: '14px 0', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '10px', textAlign: 'left', fontSize: '12px' }}>
              <div><strong>Token:</strong> {triageGeneratedModal.token}</div>
              <div><strong>Level:</strong> <span style={{ color: triageGeneratedModal.color, fontWeight: 800 }}>{triageGeneratedModal.level}</span></div>
            </div>
            <button onClick={() => setTriageGeneratedModal(null)} style={{ background: '#0284C7', color: '#FFF', border: 'none', width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}

      {showIncidentDispatchModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#070D1E', border: '1.5px solid #EF4444', borderRadius: '20px', width: '100%', maxWidth: '480px', padding: '24px', color: '#FFFFFF' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 900, color: '#EF4444', margin: 0 }}>🚨 REPORT MASS CASUALTY</h3>
              <button onClick={() => setShowIncidentDispatchModal(false)} style={{ background: 'transparent', border: 'none', color: '#FFF', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '16px 0' }}>
              <div>
                <label style={{ fontSize: '11px', color: '#94A3B8' }}>INCIDENT TYPE</label>
                <select value={incidentType} onChange={(e) => setIncidentType(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0F172A', border: '1px solid #334155', color: '#FFF', fontSize: '12px' }}>
                  <option>Multi-Vehicle Highway Collision</option>
                  <option>Industrial Chemical / Fire Incident</option>
                  <option>Mass Cardiac / Heat Stroke Cluster</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', color: '#94A3B8' }}>ESTIMATED VICTIMS</label>
                <input type="text" value={incidentVictims} onChange={(e) => setIncidentVictims(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', background: '#0F172A', border: '1px solid #334155', color: '#FFF', fontSize: '12px' }} />
              </div>
            </div>
            <button
              onClick={() => {
                alert(`Mass casualty alarm transmitted! 3 ACLS units dispatched.`);
                setShowIncidentDispatchModal(false);
              }}
              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF', border: 'none', width: '100%', padding: '11px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer' }}
            >
              CONFIRM DISPATCH & SOUND ALARM 🚨
            </button>
          </div>
        </div>
      )}

      {reserveVentModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1.5px solid #00F2FE', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '24px', textAlign: 'center', color: '#FFFFFF' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900 }}>RESERVE VENTILATOR BAY</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8' }}>{reserveVentModal.hospitalName}</p>
            <button
              onClick={() => {
                alert(`Ventilator bay reserved! Token: VENT-${Math.floor(100000 + Math.random() * 900000)}`);
                setReserveVentModal(null);
              }}
              style={{ background: '#0284C7', color: '#FFF', border: 'none', width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', marginTop: '14px' }}
            >
              CONFIRM RESERVATION 🫁
            </button>
          </div>
        </div>
      )}

      {showO2RefillModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1.5px solid #38BDF8', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '24px', textAlign: 'center', color: '#FFFFFF' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900 }}>DISPATCH LMO CRYOGENIC TANKER</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8' }}>{showO2RefillModal.facilityName}</p>
            <button
              onClick={() => {
                alert(`Cryogenic LMO Tanker #LMO-TANK-902 dispatched to ${showO2RefillModal.facilityName}. ETA: 45 mins.`);
                setShowO2RefillModal(null);
              }}
              style={{ background: '#0284C7', color: '#FFF', border: 'none', width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', marginTop: '14px' }}
            >
              CONFIRM TANKER DISPATCH 🚚
            </button>
          </div>
        </div>
      )}

      {broadcastBloodModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }}>
          <div style={{ background: '#0F172A', border: '1.5px solid #EF4444', borderRadius: '20px', width: '100%', maxWidth: '440px', padding: '24px', textAlign: 'center', color: '#FFFFFF' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#EF4444' }}>BROADCAST RARE BLOOD SOS</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8' }}>{broadcastBloodModal.group}</p>
            <button
              onClick={() => {
                alert(`Emergency Donor Broadcast sent to 142 registered ${broadcastBloodModal.group} donors in the city.`);
                setBroadcastBloodModal(null);
              }}
              style={{ background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)', color: '#FFF', border: 'none', width: '100%', padding: '10px', borderRadius: '8px', fontWeight: 900, cursor: 'pointer', marginTop: '14px' }}
            >
              SEND DONOR BROADCAST 📢
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
