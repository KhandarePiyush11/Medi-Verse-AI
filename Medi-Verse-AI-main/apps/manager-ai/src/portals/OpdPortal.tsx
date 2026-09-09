import React, { useState } from 'react';
import { 
  Users, 
  Volume2, 
  Plus, 
  Heart, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  ArrowRight,
  Stethoscope,
  Activity,
  Zap,
  PhoneCall,
  ShieldCheck,
  X
} from 'lucide-react';
import { OpdToken, Doctor, Patient } from '../types';

interface OpdPortalProps {
  opdTokens: OpdToken[];
  doctors: Doctor[];
  patients: Patient[];
  onCallToken: (tokenId: string) => void;
  onIssueNewToken: (token: OpdToken) => void;
  onUpdateTriageVitals: (tokenId: string, vitals: any, priority: any) => void;
}

export const OpdPortal: React.FC<OpdPortalProps> = ({
  opdTokens,
  doctors,
  patients,
  onCallToken,
  onIssueNewToken,
  onUpdateTriageVitals
}) => {
  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [showTriageModal, setShowTriageModal] = useState(false);
  const [activeTriageToken, setActiveTriageToken] = useState<OpdToken | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Token Form State
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenAge, setNewTokenAge] = useState(45);
  const [newTokenGender, setNewTokenGender] = useState('Male');
  const [newTokenDoctorId, setNewTokenDoctorId] = useState(doctors[0]?.id || '');
  const [newTokenComplaint, setNewTokenComplaint] = useState('');
  const [newTokenTriage, setNewTokenTriage] = useState<'P1_Critical' | 'P2_Urgent' | 'P3_Standard'>('P3_Standard');

  // Triage Vitals Form State
  const [triageBp, setTriageBp] = useState('120/80');
  const [triagePulse, setTriagePulse] = useState(78);
  const [triageSpo2, setTriageSpo2] = useState(98);
  const [triageTemp, setTriageTemp] = useState(98.6);
  const [triagePain, setTriagePain] = useState(2);
  const [triagePriority, setTriagePriority] = useState<'P1_Critical' | 'P2_Urgent' | 'P3_Standard'>('P3_Standard');

  const filteredTokens = opdTokens.filter((t) => {
    return selectedDept === 'ALL' || t.department.toLowerCase().includes(selectedDept.toLowerCase());
  });

  const callingToken = opdTokens.find((t) => t.status === 'Calling') || opdTokens.find((t) => t.status === 'In_Consult');

  const handleCallNext = (tok: OpdToken) => {
    onCallToken(tok.id);
    setToastMessage(`Calling Token ${tok.tokenNumber} to Room ${tok.roomNo}! Audio Chime broadcast.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName) return;

    const assignedDoc = doctors.find((d) => d.id === newTokenDoctorId) || doctors[0];
    const deptPrefix = assignedDoc.department.substring(0, 4).toUpperCase();
    const tokenCount = opdTokens.filter((t) => t.department === assignedDoc.department).length + 1;

    const newToken: OpdToken = {
      id: `TOK-${Date.now().toString().slice(-4)}`,
      tokenNumber: `${deptPrefix}-${String(tokenCount).padStart(3, '0')}`,
      patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
      patientName: newTokenName,
      age: Number(newTokenAge),
      gender: newTokenGender,
      doctorId: assignedDoc.id,
      doctorName: assignedDoc.name,
      department: assignedDoc.department,
      roomNo: assignedDoc.roomNo,
      triageLevel: newTokenTriage,
      status: 'Waiting',
      arrivalTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      chiefComplaint: newTokenComplaint || 'Routine outpatient consultation',
      vitals: {
        bp: '120/80 mmHg',
        pulse: 75,
        spo2: 98,
        temp: 98.6,
        painScore: 2,
        respiratoryRate: 16
      }
    };

    onIssueNewToken(newToken);
    setShowIssueModal(false);
    setToastMessage(`Token ${newToken.tokenNumber} generated for ${newToken.patientName}!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenTriage = (token: OpdToken) => {
    setActiveTriageToken(token);
    if (token.vitals) {
      setTriageBp(token.vitals.bp);
      setTriagePulse(token.vitals.pulse);
      setTriageSpo2(token.vitals.spo2);
      setTriageTemp(token.vitals.temp);
      setTriagePain(token.vitals.painScore);
    }
    setTriagePriority(token.triageLevel);
    setShowTriageModal(true);
  };

  const handleSaveTriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTriageToken) return;

    const updatedVitals = {
      bp: triageBp,
      pulse: Number(triagePulse),
      spo2: Number(triageSpo2),
      temp: Number(triageTemp),
      painScore: Number(triagePain),
      respiratoryRate: 18
    };

    onUpdateTriageVitals(activeTriageToken.id, updatedVitals, triagePriority);
    setShowTriageModal(false);
    setToastMessage(`Vitals & Triage score updated for ${activeTriageToken.patientName}!`);
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

      {/* Hero Live Digital Token Screen */}
      <div className="glass-panel-glow" style={{
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(22, 28, 40, 0.85)',
        border: '1.5px solid rgba(0, 242, 254, 0.35)',
        borderRadius: '16px',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)',
            color: '#00373A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 30px rgba(0, 242, 254, 0.5)'
          }}>
            <Volume2 size={32} strokeWidth={2.5} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="badge badge-rose" style={{ animation: 'pulse-slow 1.8s infinite' }}>
                NOW CALLING / IN CONSULTATION
              </span>
              <span className="font-data-mono" style={{ fontSize: '0.78rem', color: '#849495' }}>
                Waiting Hall Audio Chime Active
              </span>
            </div>

            {callingToken ? (
              <div style={{ marginTop: '6px', display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
                <span className="font-data-mono" style={{ fontSize: '2.4rem', fontWeight: 900, color: '#00F2FE', letterSpacing: '-0.02em', textShadow: '0 0 20px rgba(0, 242, 254, 0.5)' }}>
                  {callingToken.tokenNumber}
                </span>
                <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#E0FDFF' }}>
                  {callingToken.patientName} <span style={{ color: '#00F2FE' }}>➔</span> Room {callingToken.roomNo} <span style={{ color: '#849495', fontSize: '0.95rem' }}>({callingToken.doctorName})</span>
                </span>
              </div>
            ) : (
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#849495', marginTop: '6px' }}>
                All Chamber Consultations Clear
              </div>
            )}
          </div>
        </div>

        <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }} onClick={() => setShowIssueModal(true)}>
          <Plus size={18} />
          Issue New OPD Token
        </button>
      </div>

      {/* OPD Queue List & Vitals Triage Controls */}
      <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              color: '#818CF8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(99, 102, 241, 0.3)'
            }}>
              <Users size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                Live OPD Token Queue & Triage Desk ({filteredTokens.length})
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#849495', marginTop: '2px' }}>
                Smart queue prioritizing P1 Critical emergency patients with live EMR dispatch
              </div>
            </div>
          </div>

          {/* Department Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
            {['ALL', 'Cardiology', 'Neurology', 'Pulmonology', 'Emergency', 'Orthopedics'].map((dep) => {
              const isActive = selectedDept === dep;
              return (
                <button
                  key={dep}
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
                  onClick={() => setSelectedDept(dep)}
                >
                  {dep}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tokens Table */}
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token #</th>
                <th>Patient Details</th>
                <th>Assigned Doctor & Room</th>
                <th>Chief Complaint</th>
                <th>Triage Vitals</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTokens.map((tok) => {
                const isP1 = tok.triageLevel === 'P1_Critical';
                const isP2 = tok.triageLevel === 'P2_Urgent';
                const isCalling = tok.status === 'Calling';
                return (
                  <tr key={tok.id} style={{ background: isCalling ? 'rgba(0, 242, 254, 0.1)' : undefined }}>
                    <td>
                      <div className="font-data-mono" style={{ fontWeight: 800, fontSize: '0.98rem', color: isCalling ? '#00F2FE' : '#E0FDFF' }}>
                        {tok.tokenNumber}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#849495' }}>Arr: {tok.arrivalTime}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#E0FDFF' }}>{tok.patientName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#B9CACB' }}>Age: {tok.age} • {tok.gender}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#E0FDFF' }}>{tok.doctorName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#00F2FE', fontWeight: 600 }}>Room {tok.roomNo} ({tok.department})</div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.82rem', color: '#B9CACB', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {tok.chiefComplaint}
                      </div>
                    </td>
                    <td>
                      {tok.vitals ? (
                        <div style={{ fontSize: '0.78rem' }}>
                          <div>BP: <strong className="font-data-mono" style={{ color: '#E0FDFF' }}>{tok.vitals.bp}</strong></div>
                          <div>SpO2: <strong className="font-data-mono" style={{ color: tok.vitals.spo2 < 95 ? '#F87171' : '#34D399' }}>{tok.vitals.spo2}%</strong> • Pulse: <strong className="font-data-mono" style={{ color: '#E0FDFF' }}>{tok.vitals.pulse} bpm</strong></div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#849495' }}>Vitals pending</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${isP1 ? 'rose' : isP2 ? 'amber' : 'emerald'}`} style={{ fontSize: '0.68rem' }}>
                        {tok.triageLevel.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${tok.status === 'Completed' ? 'emerald' : tok.status === 'In_Consult' ? 'cyan' : tok.status === 'Calling' ? 'rose' : 'indigo'}`} style={{ fontSize: '0.68rem' }}>
                        {tok.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '0.75rem' }}
                          onClick={() => handleOpenTriage(tok)}
                          title="Record / Edit Patient Vitals"
                        >
                          <Activity size={13} color="#00F2FE" />
                          Triage
                        </button>
                        <button
                          className="btn-primary"
                          style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                          onClick={() => handleCallNext(tok)}
                          title="Call patient to doctor chamber"
                        >
                          <Volume2 size={13} />
                          Call
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Token Modal */}
      {showIssueModal && (
        <div className="modal-overlay" onClick={() => setShowIssueModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ padding: '18px 26px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                Issue OPD Token & Doctor Routing
              </h3>
              <button className="btn-icon" onClick={() => setShowIssueModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Patient Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newTokenName}
                  onChange={(e) => setNewTokenName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Age</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newTokenAge}
                    onChange={(e) => setNewTokenAge(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Gender</label>
                  <select
                    className="form-select"
                    value={newTokenGender}
                    onChange={(e) => setNewTokenGender(e.target.value)}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Select Specialist Doctor & Chamber</label>
                <select
                  className="form-select"
                  value={newTokenDoctorId}
                  onChange={(e) => setNewTokenDoctorId(e.target.value)}
                >
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} — Room {d.roomNo} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Chief Health Complaint</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. High fever, chest pain, vertigo"
                  value={newTokenComplaint}
                  onChange={(e) => setNewTokenComplaint(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Initial Triage Category</label>
                <select
                  className="form-select"
                  value={newTokenTriage}
                  onChange={(e) => setNewTokenTriage(e.target.value as any)}
                >
                  <option value="P3_Standard">P3 - Standard Consultation (Routine)</option>
                  <option value="P2_Urgent">P2 - Urgent (Elevated BP / Severe Pain)</option>
                  <option value="P1_Critical">P1 - Critical STAT (Emergency / Severe Sepsis)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowIssueModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Generate Token & Announce</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Triage Assessment Modal */}
      {showTriageModal && activeTriageToken && (
        <div className="modal-overlay" onClick={() => setShowTriageModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ padding: '18px 26px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                  Nursing Triage & Vitals Assessment
                </h3>
                <span className="font-data-mono" style={{ fontSize: '0.78rem', color: '#00F2FE', fontWeight: 800 }}>
                  {activeTriageToken.tokenNumber} • {activeTriageToken.patientName}
                </span>
              </div>
              <button className="btn-icon" onClick={() => setShowTriageModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveTriage} style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Blood Pressure (mmHg)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="120/80"
                    value={triageBp}
                    onChange={(e) => setTriageBp(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Heart Pulse (bpm)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={triagePulse}
                    onChange={(e) => setTriagePulse(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Oxygen SpO2 (%)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={triageSpo2}
                    onChange={(e) => setTriageSpo2(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Body Temp (°F)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-input"
                    value={triageTemp}
                    onChange={(e) => setTriageTemp(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Pain Scale Score (0 - 10)</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  style={{ width: '100%', accentColor: '#00F2FE' }}
                  value={triagePain}
                  onChange={(e) => setTriagePain(Number(e.target.value))}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#849495', fontWeight: 600, marginTop: '4px' }}>
                  <span>0 (No Pain)</span>
                  <span style={{ fontWeight: 800, color: triagePain >= 7 ? '#F87171' : '#00F2FE' }}>Current Score: {triagePain}</span>
                  <span>10 (Worst Pain)</span>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Assign Triage Priority Acuity</label>
                <select
                  className="form-select"
                  value={triagePriority}
                  onChange={(e) => setTriagePriority(e.target.value as any)}
                >
                  <option value="P1_Critical">P1 Critical — Red Code (Immediate Resuscitation)</option>
                  <option value="P2_Urgent">P2 Urgent — Yellow Code (Emergent Attention)</option>
                  <option value="P3_Standard">P3 Standard — Green Code (Routine Consultation)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowTriageModal(false)}>Cancel</button>
                <button type="submit" className="btn-emerald">Save & Commit Triage</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
