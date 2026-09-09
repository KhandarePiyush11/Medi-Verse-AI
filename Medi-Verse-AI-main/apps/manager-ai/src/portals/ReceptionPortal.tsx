import React, { useState } from 'react';
import { 
  Building2, 
  BedDouble, 
  CreditCard, 
  UserPlus, 
  CheckCircle2, 
  Search, 
  Plus, 
  DollarSign, 
  FileText, 
  Printer, 
  ShieldCheck, 
  AlertTriangle,
  QrCode,
  Layers,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { Bed, Invoice, Patient, Doctor } from '../types';

interface ReceptionPortalProps {
  beds: Bed[];
  invoices: Invoice[];
  patients: Patient[];
  doctors: Doctor[];
  onRegisterPatient: (newPat: Patient) => void;
  onAllocateBed: (bedId: string, patientName: string, doctorName: string) => void;
  onDischargeBed: (bedId: string) => void;
  onCreateInvoice: (newInv: Invoice) => void;
}

export const ReceptionPortal: React.FC<ReceptionPortalProps> = ({
  beds,
  invoices,
  patients,
  doctors,
  onRegisterPatient,
  onAllocateBed,
  onDischargeBed,
  onCreateInvoice
}) => {
  const [activeTab, setActiveTab] = useState<'beds' | 'register' | 'billing'>('beds');
  const [selectedWard, setSelectedWard] = useState<string>('ALL');
  const [selectedBedToAllocate, setSelectedBedToAllocate] = useState<Bed | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Patient Registration Form State
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState(38);
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [regPhone, setRegPhone] = useState('+91 98112 34567');
  const [regBlood, setRegBlood] = useState('O+ Positive');
  const [regAbha, setRegAbha] = useState('91-4820-9912-3841');
  const [regEmergency, setRegEmergency] = useState('Spouse (+91 98765 43210)');

  // Allocation Form State
  const [allocPatientName, setAllocPatientName] = useState('');
  const [allocDoctorName, setAllocDoctorName] = useState(doctors[0]?.name || '');

  // Billing Form State
  const [billPatientName, setBillPatientName] = useState(patients[0]?.name || '');
  const [billType, setBillType] = useState<Invoice['type']>('OPD_Consultation');
  const [billAmount, setBillAmount] = useState(1500);
  const [billMethod, setBillMethod] = useState<Invoice['paymentMethod']>('UPI_ABDM');

  const filteredBeds = beds.filter((b) => {
    return selectedWard === 'ALL' || b.ward === selectedWard;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName) return;

    const newPatient: Patient = {
      id: `PAT-${Date.now().toString().slice(-4)}`,
      uhid: `NSH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      abhaId: regAbha,
      name: regName,
      age: Number(regAge),
      gender: regGender,
      phone: regPhone,
      bloodGroup: regBlood,
      address: 'Main City Center, Sector 4',
      emergencyContact: regEmergency || 'Relative (+91 98000 00000)',
      allergies: ['None Reported'],
      chronicConditions: [],
      registeredAt: new Date().toLocaleString(),
      currentStatus: 'OPD_Waiting',
      triagePriority: 'P3_Standard'
    };

    onRegisterPatient(newPatient);
    setToastMessage(`Patient ${newPatient.name} registered with UHID ${newPatient.uhid}!`);
    setTimeout(() => setToastMessage(null), 4000);
    setActiveTab('beds');
  };

  const handleCommitAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBedToAllocate || !allocPatientName) return;

    onAllocateBed(selectedBedToAllocate.id, allocPatientName, allocDoctorName);
    setSelectedBedToAllocate(null);
    setToastMessage(`Bed ${selectedBedToAllocate.bedNumber} allocated to ${allocPatientName}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const newInv: Invoice = {
      id: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}-POS`,
      patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
      patientName: billPatientName,
      uhid: `NSH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleString(),
      type: billType,
      items: [
        { description: `${billType.replace('_', ' ')} Charge`, quantity: 1, unitPrice: Number(billAmount), total: Number(billAmount) }
      ],
      subtotal: Number(billAmount),
      tax: 0,
      discount: 0,
      grandTotal: Number(billAmount),
      status: 'Paid',
      paymentMethod: billMethod
    };

    onCreateInvoice(newInv);
    setToastMessage(`Receipt #${newInv.invoiceNumber} generated & payment marked as Paid!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="portal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#FFFFFF',
          padding: '14px 24px',
          borderRadius: '12px',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.4), var(--shadow-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          fontWeight: 800,
          fontSize: '0.9rem',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Reception Navigation Tabs */}
      <div style={{ display: 'flex', gap: '12px', borderBottom: '1.5px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px', flexWrap: 'wrap' }}>
        <button
          style={{
            fontSize: '0.92rem',
            fontWeight: 800,
            padding: '10px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'beds' ? 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)' : 'rgba(255, 255, 255, 0.04)',
            color: activeTab === 'beds' ? '#00373A' : '#B9CACB',
            border: activeTab === 'beds' ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: activeTab === 'beds' ? '0 0 20px rgba(0, 242, 254, 0.35)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('beds')}
        >
          <BedDouble size={18} />
          Ward Bed Matrix ({beds.filter((b) => b.status === 'Available').length} Vacant)
        </button>
        <button
          style={{
            fontSize: '0.92rem',
            fontWeight: 800,
            padding: '10px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'register' ? 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)' : 'rgba(255, 255, 255, 0.04)',
            color: activeTab === 'register' ? '#00373A' : '#B9CACB',
            border: activeTab === 'register' ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: activeTab === 'register' ? '0 0 20px rgba(0, 242, 254, 0.35)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('register')}
        >
          <UserPlus size={18} />
          Patient Registration & ABHA
        </button>
        <button
          style={{
            fontSize: '0.92rem',
            fontWeight: 800,
            padding: '10px 20px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'billing' ? 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)' : 'rgba(255, 255, 255, 0.04)',
            color: activeTab === 'billing' ? '#00373A' : '#B9CACB',
            border: activeTab === 'billing' ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: activeTab === 'billing' ? '0 0 20px rgba(0, 242, 254, 0.35)' : 'none',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onClick={() => setActiveTab('billing')}
        >
          <CreditCard size={18} />
          Cashier Desk & Billing POS
        </button>
      </div>

      {/* TAB 1: BED MATRIX */}
      {activeTab === 'beds' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Filter Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {['ALL', 'ICU', 'HDU', 'Emergency', 'Deluxe_Private', 'General_Male', 'General_Female'].map((w) => {
                const isActive = selectedWard === w;
                return (
                  <button
                    key={w}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: '8px',
                      background: isActive ? 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)' : 'rgba(255, 255, 255, 0.04)',
                      color: isActive ? '#00373A' : '#B9CACB',
                      border: isActive ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => setSelectedWard(w)}
                  >
                    {w.replace('_', ' ')}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: '18px', fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                Available ({beds.filter((b) => b.status === 'Available').length})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px #EF4444' }} />
                Occupied ({beds.filter((b) => b.status === 'Occupied').length})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B' }} />
                Cleaning ({beds.filter((b) => b.status === 'Cleaning').length})
              </span>
            </div>
          </div>

          {/* Bed Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '18px'
          }}>
            {filteredBeds.map((bed) => {
              const isAvailable = bed.status === 'Available';
              const isOccupied = bed.status === 'Occupied';
              const isCleaning = bed.status === 'Cleaning';

              return (
                <div
                  key={bed.id}
                  className="glass-panel"
                  style={{
                    padding: '18px',
                    borderLeft: `4px solid ${isAvailable ? '#10B981' : isOccupied ? '#EF4444' : '#F59E0B'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '170px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="font-data-mono" style={{ fontWeight: 900, fontSize: '1.15rem', color: '#E0FDFF' }}>
                        {bed.bedNumber}
                      </span>
                      <span className={`badge badge-${isAvailable ? 'emerald' : isOccupied ? 'rose' : 'amber'}`} style={{ fontSize: '0.68rem' }}>
                        {bed.status}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#00F2FE', fontWeight: 700 }}>
                      {bed.ward.replace('_', ' ')} • {bed.floor}
                    </div>

                    {isOccupied && (
                      <div style={{ marginTop: '10px', background: 'rgba(16, 19, 27, 0.75)', padding: '10px 12px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#E0FDFF' }}>
                          {bed.patientName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#B9CACB' }}>
                          Doctor: {bed.attendingDoctor || 'On-Call Medical Officer'}
                        </div>
                        {bed.equipmentConnected && (
                          <div style={{ fontSize: '0.72rem', color: '#849495', marginTop: '3px' }}>
                            Eq: {bed.equipmentConnected.join(', ')}
                          </div>
                        )}
                      </div>
                    )}

                    {isAvailable && (
                      <div style={{ fontSize: '0.82rem', color: '#849495', marginTop: '10px' }}>
                        Rate: <span style={{ color: '#34D399', fontWeight: 800 }}>₹{bed.dailyRate.toLocaleString()}</span> / day • Ready for admission
                      </div>
                    )}
                  </div>

                  {/* Bed Action Bar */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                    {isAvailable ? (
                      <button
                        className="btn-primary"
                        style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                        onClick={() => setSelectedBedToAllocate(bed)}
                      >
                        Allocate Bed
                      </button>
                    ) : isOccupied ? (
                      <button
                        className="btn-danger"
                        style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                        onClick={() => onDischargeBed(bed.id)}
                      >
                        Discharge Patient
                      </button>
                    ) : (
                      <button
                        className="btn-emerald"
                        style={{ padding: '6px 14px', fontSize: '0.78rem' }}
                        onClick={() => onAllocateBed(bed.id, '', '')}
                      >
                        Mark Clean & Ready
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: PATIENT REGISTRATION */}
      {activeTab === 'register' && (
        <div className="glass-panel" style={{ padding: '32px', maxWidth: '820px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)',
              color: '#00373A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)'
            }}>
              <UserPlus size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                Patient Registration & ABHA Health Passport
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#B9CACB', marginTop: '3px' }}>
                Generates Unique Hospital UHID, verifies National ABHA Card, and links ABDM records.
              </p>
            </div>
          </div>

          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>
                  Patient Full Name
                </label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Ramesh Kumar Verma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>
                  Age
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={regAge}
                  onChange={(e) => setRegAge(Number(e.target.value))}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>
                  Gender
                </label>
                <select
                  className="form-select"
                  value={regGender}
                  onChange={(e) => setRegGender(e.target.value as any)}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>
                  Blood Group
                </label>
                <select
                  className="form-select"
                  value={regBlood}
                  onChange={(e) => setRegBlood(e.target.value)}
                >
                  <option value="A+ Positive">A+ Positive</option>
                  <option value="A- Negative">A- Negative</option>
                  <option value="B+ Positive">B+ Positive</option>
                  <option value="B- Negative">B- Negative</option>
                  <option value="O+ Positive">O+ Positive</option>
                  <option value="O- Negative">O- Negative</option>
                  <option value="AB+ Positive">AB+ Positive</option>
                  <option value="AB- Negative">AB- Negative</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>
                  Mobile Phone Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>
                  Ayushman Bharat Health Account (ABHA ID)
                </label>
                <input
                  type="text"
                  className="form-input font-data-mono"
                  value={regAbha}
                  onChange={(e) => setRegAbha(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>
                  Emergency Contact & Relation
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Spouse / Parent (+91 ...)"
                  value={regEmergency}
                  onChange={(e) => setRegEmergency(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '14px' }}>
              <button type="submit" className="btn-primary" style={{ padding: '12px 28px' }}>
                <CheckCircle2 size={18} />
                Register & Issue UHID Card
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: BILLING & POS */}
      {activeTab === 'billing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '24px' }}>
          
          {/* POS Bill Generator */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                <DollarSign size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                  Generate Receipt / Invoice
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#849495', marginTop: '2px' }}>
                  Collect payments & dispatch instant digital receipts
                </div>
              </div>
            </div>

            <form onSubmit={handleGenerateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Patient Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={billPatientName}
                  onChange={(e) => setBillPatientName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Bill Category</label>
                  <select
                    className="form-select"
                    value={billType}
                    onChange={(e) => setBillType(e.target.value as any)}
                  >
                    <option value="OPD_Consultation">OPD Consultation</option>
                    <option value="IPD_Admission">IPD Bed Stay & ICU</option>
                    <option value="Diagnostics_Lab">Diagnostics / Lab</option>
                    <option value="Pharmacy">Pharmacy Dispense</option>
                    <option value="Emergency">Emergency Triage</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Amount (₹)</label>
                  <input
                    type="number"
                    className="form-input font-data-mono"
                    value={billAmount}
                    onChange={(e) => setBillAmount(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Payment Mode</label>
                <select
                  className="form-select"
                  value={billMethod}
                  onChange={(e) => setBillMethod(e.target.value as any)}
                >
                  <option value="UPI_ABDM">UPI / ABDM Health Payment</option>
                  <option value="Card">Credit / Debit POS Terminal</option>
                  <option value="Insurance_TPA">Cashless TPA Insurance Claim</option>
                  <option value="Cash">Cash Counter</option>
                </select>
              </div>

              <button type="submit" className="btn-emerald" style={{ marginTop: '10px', justifyContent: 'center' }}>
                <CreditCard size={16} />
                Collect Payment & Issue Invoice
              </button>
            </form>
          </div>

          {/* Invoices History Table */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileText size={20} color="#00F2FE" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                  Recent Invoices ({invoices.length})
                </h3>
              </div>
            </div>

            <div className="data-table-wrapper" style={{ maxHeight: '420px', overflowY: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Patient Name</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Mode</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="font-data-mono" style={{ fontWeight: 800, color: '#E0FDFF' }}>{inv.invoiceNumber}</td>
                      <td style={{ fontWeight: 700, color: '#E0FDFF' }}>{inv.patientName}</td>
                      <td>
                        <span className="badge badge-indigo" style={{ fontSize: '0.65rem' }}>
                          {inv.type.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="font-data-mono" style={{ fontWeight: 800, color: '#34D399' }}>
                        ₹{inv.grandTotal.toLocaleString()}
                      </td>
                      <td style={{ fontSize: '0.78rem', color: '#B9CACB' }}>{inv.paymentMethod}</td>
                      <td>
                        <span className={`badge badge-${inv.status === 'Paid' ? 'emerald' : 'amber'}`} style={{ fontSize: '0.65rem' }}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Bed Allocation Modal */}
      {selectedBedToAllocate && (
        <div className="modal-overlay" onClick={() => setSelectedBedToAllocate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div style={{ padding: '18px 26px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                Allocate Bed {selectedBedToAllocate.bedNumber}
              </h3>
              <button className="btn-icon" onClick={() => setSelectedBedToAllocate(null)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCommitAllocation} style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Patient Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Rameshwar Lal"
                  value={allocPatientName}
                  onChange={(e) => setAllocPatientName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Attending Specialist Doctor</label>
                <select
                  className="form-select"
                  value={allocDoctorName}
                  onChange={(e) => setAllocDoctorName(e.target.value)}
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setSelectedBedToAllocate(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Confirm Admission</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
