import React, { useState } from 'react';
import { 
  Stethoscope, 
  User, 
  Heart, 
  AlertOctagon, 
  Pill, 
  FlaskConical, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  FileText,
  ShieldCheck,
  Send,
  Zap,
  Activity,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Doctor, Patient, OpdToken, Prescription, LabTestOrder, PrescriptionItem } from '../types';

interface DoctorPortalProps {
  doctors: Doctor[];
  patients: Patient[];
  opdTokens: OpdToken[];
  prescriptions: Prescription[];
  onAddPrescription: (newRx: Prescription) => void;
  onAddLabOrder: (newLab: LabTestOrder) => void;
  onCompleteConsultation: (tokenId: string) => void;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({
  doctors,
  patients,
  opdTokens,
  prescriptions,
  onAddPrescription,
  onAddLabOrder,
  onCompleteConsultation
}) => {
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [selectedTokenId, setSelectedTokenId] = useState<string>(opdTokens[0]?.id || '');

  // Form State for active consultation
  const [diagnosisInput, setDiagnosisInput] = useState('');
  const [clinicalNotesInput, setClinicalNotesInput] = useState('');
  const [rxItems, setRxItems] = useState<Array<{ name: string; dosage: string; freq: string; dur: string; inst: string; cost: number }>>([
    { name: 'Atorvastatin 20mg Tab', dosage: '20mg', freq: '0-0-1 (Night)', dur: '30 days', inst: 'Post dinner with water', cost: 240 }
  ]);
  const [selectedLabTest, setSelectedLabTest] = useState<string>('High-Sensitivity Troponin I & Lipid Profile Panel');
  const [labPriority, setLabPriority] = useState<'Routine' | 'Urgent' | 'STAT_Emergency'>('STAT_Emergency');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const currentDoctor = doctors.find((d) => d.id === selectedDoctorId) || doctors[0];
  const doctorTokens = opdTokens.filter((t) => t.doctorId === selectedDoctorId);
  const activeToken = opdTokens.find((t) => t.id === selectedTokenId) || doctorTokens[0] || opdTokens[0];
  const activePatient = patients.find((p) => p.id === activeToken?.patientId);

  const handleAddMedicationRow = () => {
    setRxItems([...rxItems, { name: '', dosage: '500mg', freq: '1-0-1', dur: '5 days', inst: 'After meals', cost: 120 }]);
  };

  const handleApplyPreset = (type: 'cardiac' | 'fever' | 'antibiotic') => {
    if (type === 'cardiac') {
      setDiagnosisInput('Acute Coronary Syndrome (Suspected NSTEMI)');
      setClinicalNotesInput('ECG ST deviation noted. Advised urgent bedside Troponin I and cardiology echo.');
      setRxItems([
        { name: 'Aspirin 150mg + Clopidogrel 75mg (Dual Antiplatelet)', dosage: '1 Tab', freq: '1-0-0', dur: '30 days', inst: 'Immediate loading dose with water', cost: 180 },
        { name: 'Atorvastatin 40mg Tab', dosage: '40mg', freq: '0-0-1', dur: '30 days', inst: 'Bedtime', cost: 290 },
        { name: 'Telmisartan 40mg + Amlodipine 5mg', dosage: '1 Tab', freq: '1-0-0', dur: '30 days', inst: 'Morning after breakfast', cost: 220 }
      ]);
    } else if (type === 'fever') {
      setDiagnosisInput('Acute Febrile Illness / Viral Pyrexia');
      setClinicalNotesInput('High grade fever with body aches. Hydration advised, review CBC after 48 hours.');
      setRxItems([
        { name: 'Paracetamol 650mg Tab (Dolo/Calpol)', dosage: '650mg', freq: '1-1-1 (TDS)', dur: '3 days', inst: 'SOS if temp > 100°F', cost: 60 },
        { name: 'Pantoprazole 40mg Tab', dosage: '40mg', freq: '1-0-0', dur: '5 days', inst: 'Empty stomach 30 mins before breakfast', cost: 95 },
        { name: 'ORS Electrolyte Sachet', dosage: '1 Sachet', freq: '1-1-1', dur: '3 days', inst: 'Dissolve in 1L boiled drinking water', cost: 40 }
      ]);
    } else {
      setDiagnosisInput('Upper Respiratory Tract Infection (URTI)');
      setClinicalNotesInput('Productive cough, pharyngeal erythema. Steam inhalation and warm gargles advised.');
      setRxItems([
        { name: 'Amoxicillin + Clavulanic Acid 625mg (Augmentin)', dosage: '625mg', freq: '1-0-1', dur: '5 days', inst: 'Complete full course with meals', cost: 340 },
        { name: 'Levocetirizine 5mg + Montelukast 10mg Tab', dosage: '1 Tab', freq: '0-0-1', dur: '7 days', inst: 'Night bedtime', cost: 160 }
      ]);
    }
  };

  const handleRemoveMedicationRow = (index: number) => {
    setRxItems(rxItems.filter((_, i) => i !== index));
  };

  const handleCreatePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !currentDoctor) return;

    const newPrescription: Prescription = {
      id: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      prescriptionNumber: `RX-${Math.floor(1000 + Math.random() * 9000)}-${currentDoctor.department.substring(0, 2).toUpperCase()}`,
      patientId: activePatient.id,
      patientName: activePatient.name,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      date: new Date().toLocaleString(),
      diagnosis: diagnosisInput || 'Clinical Assessment Completed',
      clinicalNotes: clinicalNotesInput || 'Patient examined, vital signs evaluated. Prescribed treatment plan.',
      items: rxItems.map((item, idx) => ({
        id: `RXI-${Date.now()}-${idx}`,
        medicineName: item.name || 'Prescribed Medicine',
        genericName: item.name || 'Standard Generic',
        dosage: item.dosage || 'Standard Dose',
        frequency: item.freq,
        duration: item.dur,
        instructions: item.inst,
        status: 'Prescribed',
        cost: item.cost
      })),
      dispensedStatus: 'Pending',
      totalAmount: rxItems.reduce((acc, curr) => acc + curr.cost, 0),
      paymentStatus: 'Pending'
    };

    onAddPrescription(newPrescription);
    setSuccessToast(`Prescription ${newPrescription.prescriptionNumber} signed & transmitted to Pharmacy POS!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleDispatchLabOrder = () => {
    if (!activePatient || !currentDoctor) return;

    const newLabOrder: LabTestOrder = {
      id: `LAB-2026-${Math.floor(100 + Math.random() * 900)}`,
      orderNumber: `LAB-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: activePatient.id,
      patientName: activePatient.name,
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      department: selectedLabTest.includes('MRI') || selectedLabTest.includes('CT') ? 'Radiology' : 'Biochemistry',
      testName: selectedLabTest,
      sampleType: selectedLabTest.includes('MRI') ? 'MRI' : 'Blood',
      orderedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' Today',
      status: 'Sample_Pending',
      priority: labPriority,
      barcode: `BC-${Math.floor(1000 + Math.random() * 9000)}-${selectedLabTest.substring(0, 4).toUpperCase()}`,
      notes: `Ordered by ${currentDoctor.name} from Chamber ${currentDoctor.roomNo}`
    };

    onAddLabOrder(newLabOrder);
    setSuccessToast(`Diagnostic Order #${newLabOrder.orderNumber} dispatched to Laboratory worklist!`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleFinishConsult = () => {
    if (activeToken) {
      onCompleteConsultation(activeToken.id);
      setSuccessToast(`Consultation for ${activeToken.patientName} marked as Completed!`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  return (
    <div className="portal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Toast Notification */}
      {successToast && (
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
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Bar: Doctor Chamber Selector & Status */}
      <div className="glass-panel-glow" style={{
        padding: '20px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'rgba(22, 28, 40, 0.85)',
        border: '1.5px solid rgba(0, 242, 254, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img
            src={currentDoctor.avatar}
            alt={currentDoctor.name}
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              border: '2px solid #00F2FE',
              boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)',
              objectFit: 'cover'
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                {currentDoctor.name}
              </h2>
              <span className="badge badge-emerald">
                {currentDoctor.status.replace('_', ' ')}
              </span>
              <span className="badge badge-cyan">
                Room {currentDoctor.roomNo}
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#B9CACB', marginTop: '3px' }}>
              {currentDoctor.specialty} • {currentDoctor.qualification} • NMC ID: <span className="font-data-mono" style={{ color: '#00F2FE' }}>{currentDoctor.nmcId}</span>
            </p>
          </div>
        </div>

        {/* Doctor Switcher dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: '#B9CACB', fontWeight: 700 }}>Specialist Chamber:</span>
          <select
            className="form-select"
            value={selectedDoctorId}
            onChange={(e) => {
              setSelectedDoctorId(e.target.value);
              const firstT = opdTokens.find((t) => t.doctorId === e.target.value);
              if (firstT) setSelectedTokenId(firstT.id);
            }}
            style={{ width: '280px' }}
          >
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid: Queue on Left, Clinical EMR Desk on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '24px' }}>
        
        {/* Left Column: Waiting Queue */}
        <div className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
              Queue ({doctorTokens.length})
            </h3>
            <span className="badge badge-indigo">Chamber {currentDoctor.roomNo}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {doctorTokens.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#849495', fontSize: '0.85rem' }}>
                No patients in queue for this chamber right now.
              </div>
            ) : (
              doctorTokens.map((tok) => {
                const isSelected = tok.id === selectedTokenId;
                const isCrit = tok.triageLevel === 'P1_Critical';
                const isCompleted = tok.status === 'Completed';
                return (
                  <div
                    key={tok.id}
                    onClick={() => setSelectedTokenId(tok.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: isSelected ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1.5px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: isSelected ? '0 0 20px rgba(0, 242, 254, 0.2)' : 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span className="font-data-mono" style={{ fontWeight: 800, fontSize: '0.9rem', color: isSelected ? '#00F2FE' : '#E0FDFF' }}>
                        {tok.tokenNumber}
                      </span>
                      <span className={`badge badge-${isCrit ? 'rose' : isCompleted ? 'emerald' : 'indigo'}`} style={{ fontSize: '0.65rem' }}>
                        {tok.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#E0FDFF' }}>
                      {tok.patientName}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#B9CACB', marginTop: '3px' }}>
                      {tok.age}y • {tok.gender} • Arr: {tok.arrivalTime}
                    </div>

                    {tok.vitals && (
                      <div style={{ display: 'flex', gap: '10px', fontSize: '0.72rem', color: '#00F2FE', fontWeight: 700, marginTop: '6px' }}>
                        <span>BP: {tok.vitals.bp}</span>
                        <span>SpO2: {tok.vitals.spo2}%</span>
                        <span>Pulse: {tok.vitals.pulse}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Patient Clinical Cockpit */}
        {activePatient ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Patient Header Card */}
            <div className="glass-panel" style={{ padding: '22px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#E0FDFF', margin: 0 }}>
                      {activePatient.name}
                    </h2>
                    <span className="badge badge-cyan">{activePatient.uhid}</span>
                    {activePatient.bloodGroup && (
                      <span className="badge badge-rose">{activePatient.bloodGroup}</span>
                    )}
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#B9CACB', marginTop: '4px' }}>
                    {activePatient.age} Yrs • {activePatient.gender} • ABHA: <span className="font-data-mono" style={{ color: '#00F2FE' }}>{activePatient.abhaId || 'N/A'}</span> • Phone: {activePatient.phone}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-emerald" onClick={handleFinishConsult}>
                    <CheckCircle size={16} />
                    Complete Consult
                  </button>
                </div>
              </div>

              {/* Patient Vitals & Allergy Strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '12px',
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)'
              }}>
                <div style={{ background: 'rgba(16, 19, 27, 0.7)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0, 242, 254, 0.15)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#849495', fontWeight: 600 }}>Blood Pressure</div>
                  <div className="font-data-mono" style={{ fontWeight: 800, fontSize: '0.95rem', color: '#E0FDFF', marginTop: '2px' }}>
                    {activeToken?.vitals?.bp || '120/80 mmHg'}
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 19, 27, 0.7)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#849495', fontWeight: 600 }}>Heart Pulse</div>
                  <div className="font-data-mono" style={{ fontWeight: 800, fontSize: '0.95rem', color: '#34D399', marginTop: '2px' }}>
                    {activeToken?.vitals?.pulse || 76} bpm
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 19, 27, 0.7)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#849495', fontWeight: 600 }}>Oxygen SpO2</div>
                  <div className="font-data-mono" style={{ fontWeight: 800, fontSize: '0.95rem', color: '#00F2FE', marginTop: '2px' }}>
                    {activeToken?.vitals?.spo2 || 98}%
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 19, 27, 0.7)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(0, 242, 254, 0.15)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#849495', fontWeight: 600 }}>Temperature</div>
                  <div className="font-data-mono" style={{ fontWeight: 800, fontSize: '0.95rem', color: '#E0FDFF', marginTop: '2px' }}>
                    {activeToken?.vitals?.temp || 98.6}°F
                  </div>
                </div>

                <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '10px 14px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div style={{ fontSize: '0.72rem', color: '#F87171', fontWeight: 700 }}>Known Allergies</div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#F87171', marginTop: '2px' }}>
                    {activePatient.allergies.join(', ') || 'None reported'}
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Clinical Rx & Diagnostics Workbench */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={20} color="#00F2FE" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                    Clinical Assessment & E-Prescription Desk
                  </h3>
                </div>

                {/* 1-Click Protocol Presets */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#849495' }}>Quick Presets:</span>
                  <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleApplyPreset('cardiac')}>
                    🫀 Cardiac ACS
                  </button>
                  <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleApplyPreset('fever')}>
                    🌡️ Viral Pyrexia
                  </button>
                  <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }} onClick={() => handleApplyPreset('antibiotic')}>
                    💊 URTI Antibiotic
                  </button>
                </div>
              </div>

              {/* Diagnosis and Notes */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>
                    Primary Diagnosis / Assessment
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Acute Coronary Syndrome, Hypertension Grade II"
                    value={diagnosisInput}
                    onChange={(e) => setDiagnosisInput(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>
                    Clinical Notes & Patient Advice
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Advised low salt diet, review in 7 days"
                    value={clinicalNotesInput}
                    onChange={(e) => setClinicalNotesInput(e.target.value)}
                  />
                </div>
              </div>

              {/* Prescription Items Table */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#E0FDFF' }}>
                    Prescribed Medications (Auto-dispensed to Pharmacy POS)
                  </span>
                  <button className="btn-secondary" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={handleAddMedicationRow}>
                    <Plus size={14} /> Add Medicine
                  </button>
                </div>

                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Medicine Name</th>
                        <th>Dosage</th>
                        <th>Frequency</th>
                        <th>Duration</th>
                        <th>Instructions</th>
                        <th style={{ textAlign: 'center' }}>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rxItems.map((item, idx) => (
                        <tr key={idx}>
                          <td>
                            <input
                              type="text"
                              className="form-input"
                              style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                              value={item.name}
                              onChange={(e) => {
                                const copy = [...rxItems];
                                copy[idx].name = e.target.value;
                                setRxItems(copy);
                              }}
                              placeholder="Medicine Name (e.g. Atorvastatin 20mg)"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-input"
                              style={{ padding: '6px 10px', fontSize: '0.85rem', width: '95px' }}
                              value={item.dosage}
                              onChange={(e) => {
                                const copy = [...rxItems];
                                copy[idx].dosage = e.target.value;
                                setRxItems(copy);
                              }}
                              placeholder="20mg"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-input"
                              style={{ padding: '6px 10px', fontSize: '0.85rem', width: '105px' }}
                              value={item.freq}
                              onChange={(e) => {
                                const copy = [...rxItems];
                                copy[idx].freq = e.target.value;
                                setRxItems(copy);
                              }}
                              placeholder="1-0-1"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-input"
                              style={{ padding: '6px 10px', fontSize: '0.85rem', width: '95px' }}
                              value={item.dur}
                              onChange={(e) => {
                                const copy = [...rxItems];
                                copy[idx].dur = e.target.value;
                                setRxItems(copy);
                              }}
                              placeholder="7 days"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              className="form-input"
                              style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                              value={item.inst}
                              onChange={(e) => {
                                const copy = [...rxItems];
                                copy[idx].inst = e.target.value;
                                setRxItems(copy);
                              }}
                              placeholder="After food with water"
                            />
                          </td>
                          <td style={{ textAlign: 'center' }}>
                            <button
                              className="btn-danger"
                              style={{ padding: '5px 8px' }}
                              onClick={() => handleRemoveMedicationRow(idx)}
                              disabled={rxItems.length <= 1}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button className="btn-primary" onClick={handleCreatePrescription}>
                    <Send size={16} />
                    Sign & Transmit E-Prescription
                  </button>
                </div>
              </div>

              {/* Direct Diagnostic Lab Requisition Order */}
              <div style={{
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'rgba(239, 68, 68, 0.15)',
                    color: '#F87171',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(239, 68, 68, 0.3)'
                  }}>
                    <FlaskConical size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#E0FDFF' }}>
                      Order Diagnostic Lab or Radiology Investigation
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#849495' }}>
                      Requisition instantly routes to Pathology, Biochemistry, or Radiology LIS
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <select
                    className="form-select"
                    value={selectedLabTest}
                    onChange={(e) => setSelectedLabTest(e.target.value)}
                    style={{ width: '280px', fontSize: '0.85rem' }}
                  >
                    <option value="High-Sensitivity Troponin I & Lipid Profile Panel">High-Sensitivity Troponin I & Lipid Panel</option>
                    <option value="Complete Blood Count (CBC) with Differential">Complete Blood Count (CBC)</option>
                    <option value="MRI Brain with MR Angiography (Stroke Protocol)">MRI Brain with MR Angiography</option>
                    <option value="12-Lead Electrocardiogram & 2D Echocardiogram">12-Lead ECG & 2D Echo</option>
                    <option value="Renal Function Test (RFT) & Serum Electrolytes">Renal Function Test (RFT)</option>
                  </select>

                  <select
                    className="form-select"
                    value={labPriority}
                    onChange={(e) => setLabPriority(e.target.value as any)}
                    style={{ width: '140px', fontSize: '0.85rem' }}
                  >
                    <option value="STAT_Emergency">STAT Emergency</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Routine">Routine</option>
                  </select>

                  <button className="btn-secondary" onClick={handleDispatchLabOrder}>
                    <Plus size={15} />
                    Dispatch Order
                  </button>
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '56px', textAlign: 'center', color: '#849495' }}>
            Please select a patient from the queue to open the clinical cockpit.
          </div>
        )}

      </div>

    </div>
  );
};
