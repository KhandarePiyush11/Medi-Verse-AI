import React, { useState } from 'react';
import { Header } from './components/Header';
import { AiAssistantModal } from './components/AiAssistantModal';
import { OperationsDashboard } from './portals/OperationsDashboard';
import { DoctorPortal } from './portals/DoctorPortal';
import { MedicalPortal } from './portals/MedicalPortal';
import { LabsPortal } from './portals/LabsPortal';
import { OpdPortal } from './portals/OpdPortal';
import { ReceptionPortal } from './portals/ReceptionPortal';
import { N8nAutomationPortal } from './portals/N8nAutomationPortal';

import {
  initialDoctors,
  initialPatients,
  initialOpdTokens,
  initialPharmacyItems,
  initialPrescriptions,
  initialLabOrders,
  initialBeds,
  initialInvoices,
  initialAlerts
} from './data/mockData';

import { PortalType, Patient, Doctor, OpdToken, PharmacyItem, Prescription, LabTestOrder, Bed, Invoice, OperationalAlert } from './types';
import { AlertTriangle, Radio, ShieldCheck, Zap, HeartPulse, Sparkles, Building2, Stethoscope, Pill, FlaskConical, Users, Bot } from 'lucide-react';

export const App: React.FC = () => {
  const [activePortal, setActivePortal] = useState<PortalType>('operations');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Core Hospital Data States
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [opdTokens, setOpdTokens] = useState<OpdToken[]>(initialOpdTokens);
  const [pharmacyItems, setPharmacyItems] = useState<PharmacyItem[]>(initialPharmacyItems);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [labOrders, setLabOrders] = useState<LabTestOrder[]>(initialLabOrders);
  const [beds, setBeds] = useState<Bed[]>(initialBeds);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [alerts, setAlerts] = useState<OperationalAlert[]>(initialAlerts);

  // Handlers for cross-module events
  const handleAddPrescription = (newRx: Prescription) => {
    setPrescriptions((prev) => [newRx, ...prev]);
  };

  const handleAddLabOrder = (newLab: LabTestOrder) => {
    setLabOrders((prev) => [newLab, ...prev]);
  };

  const handleCompleteConsultation = (tokenId: string) => {
    setOpdTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, status: 'Completed' } : t))
    );
  };

  const handleDispensePrescription = (prescriptionId: string) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === prescriptionId ? { ...p, dispensedStatus: 'Dispensed' } : p))
    );
    const rx = prescriptions.find((p) => p.id === prescriptionId);
    if (rx) {
      setPharmacyItems((prev) =>
        prev.map((item) => {
          const matched = rx.items.some((it) => it.medicineName.toLowerCase().includes(item.name.toLowerCase().substring(0, 5)));
          if (matched && item.stockQty > 10) {
            return { ...item, stockQty: item.stockQty - 10 };
          }
          return item;
        })
      );
    }
  };

  const handleAddNewMedicine = (item: PharmacyItem) => {
    setPharmacyItems((prev) => [item, ...prev]);
  };

  const handleRestockMedicine = (itemId: string, addQty: number) => {
    setPharmacyItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, stockQty: item.stockQty + addQty, status: 'In_Stock' } : item))
    );
  };

  const handleUpdateLabOrderStatus = (orderId: string, status: LabTestOrder['status'], results?: any[]) => {
    setLabOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status, results: results || o.results }
          : o
      )
    );
  };

  const handleCallToken = (tokenId: string) => {
    setOpdTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, status: 'Calling' } : t))
    );
  };

  const handleIssueNewToken = (token: OpdToken) => {
    setOpdTokens((prev) => [...prev, token]);
  };

  const handleUpdateTriageVitals = (tokenId: string, vitals: any, priority: any) => {
    setOpdTokens((prev) =>
      prev.map((t) =>
        t.id === tokenId
          ? { ...t, vitals, triageLevel: priority }
          : t
      )
    );
  };

  const handleRegisterPatient = (newPat: Patient) => {
    setPatients((prev) => [newPat, ...prev]);
  };

  const handleAllocateBed = (bedId: string, patientName: string, doctorName: string) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? {
              ...b,
              status: patientName ? 'Occupied' : 'Available',
              patientName: patientName || undefined,
              attendingDoctor: doctorName || undefined,
              admittedAt: patientName ? new Date().toLocaleString() : undefined
            }
          : b
      )
    );
  };

  const handleDischargeBed = (bedId: string) => {
    setBeds((prev) =>
      prev.map((b) =>
        b.id === bedId
          ? { ...b, status: 'Cleaning', patientName: undefined, attendingDoctor: undefined }
          : b
      )
    );
  };

  const handleCreateInvoice = (newInv: Invoice) => {
    setInvoices((prev) => [newInv, ...prev]);
  };

  const handleDismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleQuickSearch = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('bed') || q.includes('admit') || q.includes('ward') || q.includes('icu') || q.includes('nsh')) {
      setActivePortal('reception');
    } else if (q.includes('rx') || q.includes('medicine') || q.includes('stock') || q.includes('dolo') || q.includes('pharma')) {
      setActivePortal('medical');
    } else if (q.includes('lab') || q.includes('test') || q.includes('trop') || q.includes('cbc') || q.includes('blood')) {
      setActivePortal('labs');
    } else if (q.includes('token') || q.includes('opd') || q.includes('triage') || q.includes('queue') || q.includes('card-')) {
      setActivePortal('opd');
    } else if (q.includes('doc') || q.includes('consult') || q.includes('sharma') || q.includes('nambiar')) {
      setActivePortal('doctor');
    } else if (q.includes('n8n') || q.includes('whatsapp') || q.includes('voice') || q.includes('auto')) {
      setActivePortal('automation');
    }
  };

  // Counts
  const occupiedBedsCount = beds.filter((b) => b.status === 'Occupied').length;
  const opdWaitingCount = opdTokens.filter((t) => t.status === 'Waiting' || t.status === 'Calling').length;
  const labStatCount = labOrders.filter((l) => l.priority === 'STAT_Emergency' && l.status !== 'Verified_Approved').length;
  const lowStockCount = pharmacyItems.filter((m) => m.status === 'Low_Stock' || m.status === 'Critical_Shortage').length;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#10131B',
      backgroundImage: 'radial-gradient(ellipse at top, rgba(0, 242, 254, 0.08) 0%, rgba(16, 19, 27, 1) 70%)',
      color: '#E0E2ED',
      overflowX: 'hidden'
    }}>
      {/* Header */}
      <Header
        activePortal={activePortal}
        onSelectPortal={setActivePortal}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        emergencyAlertCount={alerts.filter((a) => a.severity === 'Critical').length}
        onQuickSearch={handleQuickSearch}
        counts={{
          opdWaiting: opdWaitingCount,
          labStat: labStatCount,
          lowStock: lowStockCount,
          bedsOccupied: occupiedBedsCount,
          totalBeds: beds.length
        }}
      />

      {/* Live Hospital Telemetry Ticker Banner */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(0, 55, 58, 0.85) 0%, rgba(16, 28, 48, 0.9) 50%, rgba(11, 14, 21, 0.95) 100%)',
        borderBottom: '1px solid rgba(0, 242, 254, 0.2)',
        color: '#E0FDFF',
        padding: '6px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        fontWeight: 700,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge" style={{ background: '#EF4444', color: '#FFF', fontSize: '9px', padding: '1px 7px', boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)' }}>
            <Radio size={10} style={{ animation: 'pulse-slow 1.5s infinite' }} />
            LIVE TELEMETRY
          </span>
          <span>
            Hospital Operational Health: <strong style={{ color: '#00F2FE' }}>98.4% Optimal</strong> • ABDM HIECM M3 Active • <span style={{ color: '#34D399' }}>{beds.filter(b => b.status === 'Available').length} Vacant Beds Ready</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '10.5px', opacity: 0.9 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34D399' }}>
            <ShieldCheck size={13} color="#10B981" />
            ZERO-TRUST ENCRYPTED
          </span>
          <span className="font-data-mono" style={{ color: '#00F2FE', background: 'rgba(0, 242, 254, 0.1)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
            NODE #HOSP-DELHI-01
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '24px 0' }}>
        {activePortal === 'operations' && (
          <OperationsDashboard
            beds={beds}
            doctors={doctors}
            opdTokens={opdTokens}
            pharmacyItems={pharmacyItems}
            labOrders={labOrders}
            alerts={alerts}
            onNavigatePortal={setActivePortal}
            onDismissAlert={handleDismissAlert}
          />
        )}

        {activePortal === 'doctor' && (
          <DoctorPortal
            doctors={doctors}
            patients={patients}
            opdTokens={opdTokens}
            prescriptions={prescriptions}
            onAddPrescription={handleAddPrescription}
            onAddLabOrder={handleAddLabOrder}
            onCompleteConsultation={handleCompleteConsultation}
          />
        )}

        {activePortal === 'medical' && (
          <MedicalPortal
            pharmacyItems={pharmacyItems}
            prescriptions={prescriptions}
            onDispensePrescription={handleDispensePrescription}
            onAddNewMedicine={handleAddNewMedicine}
            onRestockMedicine={handleRestockMedicine}
          />
        )}

        {activePortal === 'labs' && (
          <LabsPortal
            labOrders={labOrders}
            onUpdateOrderStatus={handleUpdateLabOrderStatus}
          />
        )}

        {activePortal === 'opd' && (
          <OpdPortal
            opdTokens={opdTokens}
            doctors={doctors}
            patients={patients}
            onCallToken={handleCallToken}
            onIssueNewToken={handleIssueNewToken}
            onUpdateTriageVitals={handleUpdateTriageVitals}
          />
        )}

        {activePortal === 'reception' && (
          <ReceptionPortal
            beds={beds}
            invoices={invoices}
            patients={patients}
            doctors={doctors}
            onRegisterPatient={handleRegisterPatient}
            onAllocateBed={handleAllocateBed}
            onDischargeBed={handleDischargeBed}
            onCreateInvoice={handleCreateInvoice}
          />
        )}

        {activePortal === 'automation' && (
          <N8nAutomationPortal />
        )}
      </main>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </div>
  );
};
