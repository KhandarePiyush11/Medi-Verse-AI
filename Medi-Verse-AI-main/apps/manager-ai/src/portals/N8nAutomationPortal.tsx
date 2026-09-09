import React, { useState } from 'react';
import { 
  Bot, 
  MessageSquare, 
  PhoneCall, 
  FileText, 
  Star, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Send, 
  Clock, 
  Database, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Activity, 
  PhoneOutgoing, 
  Check, 
  X, 
  Download, 
  Cpu, 
  Sparkles,
  Radio
} from 'lucide-react';

const initialDoctors = [
  { id: '1', name: 'Dr. Aarav Sharma', department: 'Cardiology', fee: 1200, available_days: 'Mon-Fri', start_time: '09:00', end_time: '17:00' },
  { id: '2', name: 'Dr. Priya Nambiar', department: 'Neurology', fee: 1500, available_days: 'Mon, Wed, Fri', start_time: '10:00', end_time: '16:00' },
  { id: '3', name: 'Dr. Rohan Deshmukh', department: 'Orthopedics', fee: 1000, available_days: 'Tue, Thu, Sat', start_time: '09:00', end_time: '14:00' }
];

const initialAppointments = [
  { id: 'apt-101', patient_name: 'Rajesh Verma', patient_phone: '+919811234567', doctor_name: 'Dr. Aarav Sharma', department: 'Cardiology', slot_time: '2026-09-03 10:30 AM', status: 'confirmed' },
  { id: 'apt-102', patient_name: 'Meera Krishnan', patient_phone: '+919445188920', doctor_name: 'Dr. Priya Nambiar', department: 'Neurology', slot_time: '2026-09-03 02:00 PM', status: 'confirmed' },
  { id: 'apt-103', patient_name: 'Sardar Gurpreet Singh', patient_phone: '+919876512098', doctor_name: 'Dr. Aarav Sharma', department: 'Cardiology', slot_time: '2026-09-02 04:00 PM', status: 'completed' }
];

export const N8nAutomationPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agent' | 'voice' | 'reports' | 'feedback' | 'workflow'>('agent');
  
  // WhatsApp AI Agent State
  const [waMessages, setWaMessages] = useState<Array<{ sender: 'user' | 'bot' | 'system'; text: string; time: string; toolUsed?: string }>>([
    { sender: 'system', text: '🟢 N8N Webhook (POST /whatsapp-webhook) Live & Handshake Verified.', time: '10:00 AM' },
    { sender: 'bot', text: 'Namaste! Main MANAGERAI Hospital ka 24x7 WhatsApp Agent hoon. Main doctor appointments, fees, OPD schedules, lab test reports aur voice follow-ups handle karta hoon. Main aapki kya sahayata karoon?', time: '10:01 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isAgentThinking, setIsAgentThinking] = useState(false);

  // Voice Call State
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'completed'>('idle');
  const [activeCallApt, setActiveCallApt] = useState(initialAppointments[0]);
  const [voiceLogs, setVoiceLogs] = useState<string[]>([
    'Cron Scanner [*/15 * * * *] initialized: Scanning appointments in 24h & 2h window...',
    'Found appointment #apt-101 (Rajesh Verma) - 24-hour reminder window triggered.'
  ]);

  // Reports State
  const [reportPatient, setReportPatient] = useState('Rajesh Verma');
  const [reportType, setReportType] = useState('High-Sensitivity Troponin I & Lipid Profile');
  const [isCriticalPanic, setIsCriticalPanic] = useState(true);
  const [dispatchedReports, setDispatchedReports] = useState<Array<{ id: string; patient: string; type: string; critical: boolean; link: string; status: string; time: string }>>([
    { id: 'REP-9041', patient: 'Rajesh Verma', type: 'Troponin I (STAT Quantitative)', critical: true, link: 'https://hospital.mediverse.ai/r/9041-sec-token', status: 'Delivered (WhatsApp + Doctor Emergency Call Initiated)', time: '09:45 AM' }
  ]);

  // Feedback State
  const [feedbackList, setFeedbackList] = useState<Array<{ id: string; patient: string; rating: number; appointmentId: string; status: string; escalated: boolean }>>([
    { id: 'FB-1', patient: 'Sardar Gurpreet Singh (+919876512098)', rating: 5, appointmentId: 'apt-103', status: 'Google Review Link Dispatched', escalated: false },
    { id: 'FB-2', patient: 'Kavita Pillai (+919711054321)', rating: 2, appointmentId: 'apt-104', status: 'Escalated to Front Desk Manager', escalated: true }
  ]);

  const handleSendWaMessage = (customText?: string) => {
    const text = customText || inputMsg;
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setWaMessages(prev => [...prev, { sender: 'user', text, time: timeStr }]);
    if (!customText) setInputMsg('');
    setIsAgentThinking(true);

    const lower = text.toLowerCase();

    setTimeout(() => {
      let botReply = '';
      let toolUsed = '';

      if (/^[1-5]$/.test(text.trim())) {
        const rating = parseInt(text.trim(), 10);
        toolUsed = 'Update Feedback Record (Supabase)';
        if (rating <= 3) {
          botReply = 'Humein khed hai ki aapka experience santoshjanak nahi raha 🙏 Hamari senior supervisor team turant aapse contact karegi.';
          setFeedbackList(prev => [{ id: `FB-${Date.now()}`, patient: 'Rajesh Verma (+919811234567)', rating, appointmentId: 'apt-101', status: 'Escalated to Front Desk', escalated: true }, ...prev]);
        } else {
          botReply = `Bahut bahut dhanyawad ⭐ Aapka ${rating}/5 rating record kar liya gaya hai! Kripya Google par ek review chhod dein: https://g.page/r/hospital-mediverse/review`;
          setFeedbackList(prev => [{ id: `FB-${Date.now()}`, patient: 'Rajesh Verma (+919811234567)', rating, appointmentId: 'apt-101', status: 'Google Review Dispatched', escalated: false }, ...prev]);
        }
      } else if (lower.includes('doctor') || lower.includes('timing') || lower.includes('fee') || lower.includes('cardiology')) {
        toolUsed = 'Get Hospital And Doctor Info';
        botReply = 'Cardiology me Dr. Aarav Sharma (Mon-Fri 09:00 - 17:00, Fee: ₹1200) aur Neurology me Dr. Priya Nambiar (Mon, Wed, Fri 10:00 - 16:00, Fee: ₹1500) available hain. Kya main aapka slot book kar doon?';
      } else if (lower.includes('book') || lower.includes('appointment') || lower.includes('slot')) {
        toolUsed = 'Check Doctor Booked Slots ➔ Book Appointment';
        botReply = `Dr. Aarav Sharma ke sath kal subah 10:30 AM ka confirmed slot book ho gaya hai! 🎉\n\n📌 Appointment ID: #APT-8821\n🏥 Room: OPD-102 (Cardiology Floor 1)`;
      } else if (lower.includes('report') || lower.includes('test') || lower.includes('troponin')) {
        toolUsed = 'Check My Report Status';
        botReply = 'Aapka High-Sensitivity Troponin I test ready ho chuka hai aur Consultant dwara electronically sign kiya gaya hai. 📄 Secure download link aapke WhatsApp par dispatch kar diya gaya hai.';
      } else if (lower.includes('call') || lower.includes('phone')) {
        toolUsed = 'Request AI Voice Call For This Patient';
        botReply = 'Maine hamare Outbound AI Voice Calling Server ko trigger kar diya hai. Aapke number par agle 2 minute me call aayega. 📞';
        setCallStatus('calling');
      } else {
        toolUsed = 'Patient WhatsApp AI Agent (Gemini Flash 2.0)';
        botReply = 'Aapka message receive hua. Aap appointment booking, doctor timings, lab reports, ya AI voice call request ke baare me poochh sakte hain.';
      }

      setWaMessages(prev => [...prev, { sender: 'bot', text: botReply, time: timeStr, toolUsed }]);
      setIsAgentThinking(false);
    }, 750);
  };

  const handleTriggerVoiceCall = (apt: typeof initialAppointments[0]) => {
    setActiveCallApt(apt);
    setCallStatus('calling');
    setVoiceLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Triggering Outbound Voice Call to ${apt.patient_name} (${apt.patient_phone})...`,
      ...prev
    ]);

    setTimeout(() => {
      setCallStatus('connected');
      setVoiceLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Call Connected: Live AI Agent speaking with ${apt.patient_name} in Hindi/English...`,
        `Speech AI: "Namaste ${apt.patient_name} ji, yeh MediVerse Hospital se automated follow-up call hai. Kal aapka appointment Dr. Aarav Sharma ke sath 10:30 AM par hai. Kya aap confirm kar rahe hain?"`,
        ...prev
      ]);
    }, 1500);
  };

  const handleSimulateCallOutcome = (outcome: 'confirmed' | 'reschedule_requested' | 'cancelled' | 'no_answer') => {
    setCallStatus('completed');
    const outcomeText = outcome === 'confirmed' ? 'Patient verbally CONFIRMED appointment.' : outcome === 'reschedule_requested' ? 'Patient requested RESCHEDULE to next day.' : outcome === 'cancelled' ? 'Patient requested CANCELLATION.' : 'NO ANSWER: WhatsApp fallback dispatched.';
    setVoiceLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Webhook Callback Received (POST /voice-call-callback): Outcome = ${outcome.toUpperCase()}.`,
      `Database Sync: Updated appointments table -> ${outcomeText}`,
      ...prev
    ]);
  };

  return (
    <div className="portal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Banner */}
      <div className="glass-panel-glow" style={{
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        borderLeft: '4px solid #A855F7',
        background: 'rgba(22, 28, 40, 0.85)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#E0FDFF', margin: 0 }}>
              Hospital AI Automation Suite <span className="text-gradient-purple">(n8n Workflow Engine)</span>
            </h2>
            <span className="badge badge-indigo">
              <Radio size={11} style={{ animation: 'pulse-slow 1.5s infinite' }} />
              N8N SYNCED
            </span>
            <span className="badge badge-emerald">
              5 ACTIVE FLOWS
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: '#B9CACB', marginTop: '4px' }}>
            Multi-trigger workflow engine: 1) WhatsApp AI Appointments 2) Outbound Voice Calling 3) Lab Panic Alerts 4) Feedback Booster
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {[
            { id: 'agent', label: '1. WhatsApp AI', icon: MessageSquare },
            { id: 'voice', label: '2. Voice Server', icon: PhoneCall },
            { id: 'reports', label: '3. Panic Reports', icon: FileText },
            { id: 'feedback', label: '4. Feedback', icon: Star },
            { id: 'workflow', label: '5. Config & Env', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  padding: '7px 14px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: isActive ? 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)' : 'rgba(255, 255, 255, 0.04)',
                  color: isActive ? '#00373A' : '#B9CACB',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isActive ? '0 0 20px rgba(0, 242, 254, 0.35)' : 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* WhatsApp Agent View */}
      {activeTab === 'agent' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '600px', border: '1px solid rgba(0, 242, 254, 0.25)' }}>
            <div style={{ background: 'linear-gradient(90deg, #064E3B 0%, #065F46 100%)', color: '#FFF', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0, 242, 254, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00373A', fontWeight: 900, boxShadow: '0 0 12px rgba(16, 185, 129, 0.5)' }}>
                  🏥
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#E0FDFF' }}>MANAGERAI Hospital Assistant</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.9, color: '#A7F3D0' }}>WhatsApp Cloud API • 24x7 Live</div>
                </div>
              </div>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: '#FFF', fontSize: '9.5px', border: '1px solid rgba(255,255,255,0.2)' }}>
                Meta Graph API v21.0
              </span>
            </div>

            <div style={{ flex: 1, padding: '18px', overflowY: 'auto', background: '#0B0F17', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {waMessages.map((m, idx) => {
                const isUser = m.sender === 'user';
                const isSys = m.sender === 'system';
                if (isSys) {
                  return (
                    <div key={idx} style={{ textAlign: 'center', fontSize: '0.75rem', color: '#00F2FE', background: 'rgba(0, 242, 254, 0.08)', padding: '4px 12px', borderRadius: '20px', alignSelf: 'center', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                      {m.text}
                    </div>
                  );
                }
                return (
                  <div key={idx} style={{ alignSelf: isUser ? 'flex-end' : 'flex-start', maxWidth: '82%', background: isUser ? 'rgba(0, 242, 254, 0.18)' : 'rgba(28, 32, 39, 0.9)', color: '#E0FDFF', padding: '10px 14px', borderRadius: isUser ? '12px 0 12px 12px' : '0 12px 12px 12px', border: isUser ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                    {m.toolUsed && (
                      <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#00F2FE', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Zap size={11} />
                        TOOL: {m.toolUsed}
                      </div>
                    )}
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                    <div className="font-data-mono" style={{ fontSize: '0.68rem', color: '#849495', textAlign: 'right', marginTop: '4px' }}>{m.time}</div>
                  </div>
                );
              })}

              {isAgentThinking && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(28, 32, 39, 0.9)', padding: '8px 14px', borderRadius: '10px', fontSize: '0.78rem', color: '#00F2FE', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
                  <Sparkles size={14} />
                  <span>AI Agent executing n8n toolchain...</span>
                </div>
              )}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSendWaMessage(); }} style={{ padding: '12px 16px', background: 'rgba(16, 19, 27, 0.95)', display: 'flex', gap: '10px', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <input
                type="text"
                className="form-input"
                style={{ borderRadius: '20px', height: '40px', fontSize: '0.85rem' }}
                placeholder="Type message (e.g. 'Dr Aarav ka appointment book karo', '5', 'Report status?')"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ height: '40px', padding: '0 18px', borderRadius: '20px' }}>
                <Send size={15} />
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#E0FDFF', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="#00F2FE" /> Quick N8N Scenario Triggers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.82rem' }} onClick={() => handleSendWaMessage('Dr. Aarav Sharma ke timing aur fees kya hain?')}>
                  💬 1. Get Doctor Info & Timings
                </button>
                <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.82rem' }} onClick={() => handleSendWaMessage('Mujhe kal Cardiology me Dr Aarav ke sath appointment book karna hai')}>
                  📅 2. Book Confirmed Appointment
                </button>
                <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.82rem' }} onClick={() => handleSendWaMessage('Kya meri Troponin lab report ready ho gayi hai?')}>
                  📑 3. Check Lab Report Status
                </button>
                <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.82rem' }} onClick={() => handleSendWaMessage('Mujhe doctor se phone par baat karni hai, please call me')}>
                  📞 4. Trigger Outbound AI Voice Call
                </button>
                <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.82rem', color: '#34D399' }} onClick={() => handleSendWaMessage('5')}>
                  ⭐ 5. Send 5-Star Rating (Google Review Trigger)
                </button>
                <button className="btn-secondary" style={{ justifyContent: 'flex-start', fontSize: '0.82rem', color: '#F87171' }} onClick={() => handleSendWaMessage('1')}>
                  ⚠️ 6. Send 1-Star Rating (Supervisor Escalate Trigger)
                </button>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '22px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#E0FDFF', marginBottom: '12px' }}>
                🛠️ Connected N8N Tools Matrix
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.78rem' }}>
                {[
                  'Get Doctor & Dept Info',
                  'Check Booked Slots',
                  'Book Appointment',
                  'Reschedule Slot',
                  'Cancel Appointment',
                  'Check Report Status',
                  'Request AI Voice Call',
                  'Escalate Front Desk'
                ].map((tool, i) => (
                  <div key={i} style={{ background: 'rgba(16, 19, 27, 0.75)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={14} color="#10B981" />
                    <span style={{ fontWeight: 700, color: '#E0E2ED' }}>{tool}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Call View */}
      {activeTab === 'voice' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', marginBottom: '14px' }}>
              ⏰ 15-Min Reminder Scanner (Section B)
            </h3>
            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient Name & Phone</th>
                    <th>Doctor & Dept</th>
                    <th>Appointment Slot</th>
                    <th>Trigger Voice Call</th>
                  </tr>
                </thead>
                <tbody>
                  {initialAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: '#E0FDFF' }}>{apt.patient_name}</div>
                        <div className="font-data-mono" style={{ fontSize: '0.75rem', color: '#00F2FE' }}>{apt.patient_phone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#E0FDFF' }}>{apt.doctor_name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#849495' }}>{apt.department}</div>
                      </td>
                      <td>
                        <div className="font-data-mono" style={{ fontWeight: 700, color: '#B9CACB' }}>{apt.slot_time}</div>
                      </td>
                      <td>
                        <button className="btn-primary" style={{ padding: '5px 12px', fontSize: '0.78rem' }} onClick={() => handleTriggerVoiceCall(apt)}>
                          <PhoneOutgoing size={13} /> Call Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
              📞 Voice Calling Server API Terminal
            </h3>

            {callStatus === 'connected' && (
              <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 800, color: '#34D399', fontSize: '0.9rem' }}>
                    🎙️ Live Call with {activeCallApt.patient_name}
                  </div>
                  <span className="font-data-mono" style={{ color: '#34D399', fontWeight: 800, fontSize: '0.85rem' }}>00:38</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button className="btn-emerald" style={{ fontSize: '0.75rem', padding: '6px' }} onClick={() => handleSimulateCallOutcome('confirmed')}>
                    ✅ Confirm Slot
                  </button>
                  <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px' }} onClick={() => handleSimulateCallOutcome('reschedule_requested')}>
                    🔄 Reschedule
                  </button>
                  <button className="btn-danger" style={{ fontSize: '0.75rem', padding: '6px' }} onClick={() => handleSimulateCallOutcome('cancelled')}>
                    ❌ Cancel Slot
                  </button>
                  <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '6px' }} onClick={() => handleSimulateCallOutcome('no_answer')}>
                    📵 No Answer
                  </button>
                </div>
              </div>
            )}

            <div style={{ background: '#090D14', color: '#00F2FE', padding: '14px', borderRadius: '10px', fontSize: '0.75rem', height: '240px', overflowY: 'auto', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.6, border: '1px solid rgba(0, 242, 254, 0.2)' }}>
              {voiceLogs.map((log, i) => (
                <div key={i} style={{ marginBottom: '6px' }}>{log}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reports View */}
      {activeTab === 'reports' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', marginBottom: '4px' }}>
              📑 Report-Ready Webhook Trigger (Section C)
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#849495', marginBottom: '16px' }}>
              Dispatches verified diagnostic PDF & triggers Panic Range workflows
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', display: 'block', marginBottom: '4px' }}>Patient Name</label>
                <input type="text" className="form-input" value={reportPatient} onChange={(e) => setReportPatient(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', display: 'block', marginBottom: '4px' }}>Investigation Type</label>
                <select className="form-select" value={reportType} onChange={(e) => setReportType(e.target.value)}>
                  <option value="High-Sensitivity Troponin I & Lipid Profile">High-Sensitivity Troponin I & Lipid Profile</option>
                  <option value="Complete Blood Count (CBC) with Differential">Complete Blood Count (CBC) with Differential</option>
                  <option value="MRI Brain with MR Angiography (Stroke Protocol)">MRI Brain with MR Angiography (Stroke Protocol)</option>
                </select>
              </div>
              <div style={{ background: 'rgba(16, 19, 27, 0.75)', padding: '12px 14px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isCriticalPanic} onChange={(e) => setIsCriticalPanic(e.target.checked)} style={{ width: '16px', height: '16px', accentColor: '#EF4444' }} />
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: isCriticalPanic ? '#F87171' : '#E0FDFF' }}>
                      Mark as Critical Panic Value (is_critical = true)
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#849495', marginTop: '2px' }}>
                      Auto-triggers emergency alert to Doctor + voice call to Patient.
                    </div>
                  </div>
                </label>
              </div>
              <button 
                className="btn-primary" 
                onClick={() => {
                  const repId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
                  setDispatchedReports([{ id: repId, patient: reportPatient, type: reportType, critical: isCriticalPanic, link: `https://hospital.mediverse.ai/r/${repId.toLowerCase()}`, status: isCriticalPanic ? 'CRITICAL STAT ALERT' : 'Delivered to WhatsApp', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...dispatchedReports]);
                }}
              >
                <Send size={15} /> Trigger Webhook & Dispatch WhatsApp PDF
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#E0FDFF', marginBottom: '14px' }}>
              📡 Dispatched Reports & Panic Alert Audit Log
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dispatchedReports.map((rep) => (
                <div key={rep.id} style={{ padding: '14px', borderRadius: '10px', background: rep.critical ? 'rgba(239, 68, 68, 0.12)' : 'rgba(16, 19, 27, 0.75)', border: `1px solid ${rep.critical ? 'rgba(239, 68, 68, 0.35)' : 'rgba(255, 255, 255, 0.08)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#E0FDFF' }}>{rep.patient}</div>
                      <div style={{ fontSize: '0.82rem', color: '#00F2FE', fontWeight: 700, marginTop: '2px' }}>{rep.type}</div>
                    </div>
                    <span className={`badge ${rep.critical ? 'badge-rose' : 'badge-emerald'}`}>{rep.critical ? 'CRITICAL PANIC' : 'ROUTINE'}</span>
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#849495' }}>
                    <span className="font-data-mono">{rep.id} • {rep.time}</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert(`Verified Report PIN: ${rep.link}`); }} style={{ color: '#00F2FE', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Download size={13} /> Secure Download Link
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Feedback View */}
      {activeTab === 'feedback' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', marginBottom: '4px' }}>
              ⭐ Post-Consultation Rating Automation (Section D)
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#849495', marginBottom: '16px' }}>
              4-5★ triggers Google Review booster; 1-3★ triggers supervisor escalation.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => handleSendWaMessage(star.toString())} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', fontWeight: 900, color: star <= 3 ? '#F87171' : '#34D399', fontSize: '1rem' }}>
                  {star} ★
                </button>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#E0FDFF', marginBottom: '14px' }}>
              📊 Live Feedback Stream
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {feedbackList.map((fb) => (
                <div key={fb.id} style={{ padding: '14px', borderRadius: '10px', background: 'rgba(16, 19, 27, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#E0FDFF' }}>{fb.patient}</div>
                    <div style={{ fontSize: '0.75rem', color: '#849495', marginTop: '2px' }}>Apt #{fb.appointmentId} • {fb.status}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div className="font-data-mono" style={{ fontWeight: 900, fontSize: '0.98rem', color: fb.rating <= 3 ? '#F87171' : '#34D399' }}>{fb.rating} / 5 ⭐</div>
                    <span className={`badge ${fb.escalated ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '9.5px', marginTop: '4px' }}>
                      {fb.escalated ? 'Escalated' : 'Review Boosted'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Config View */}
      {activeTab === 'workflow' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#E0FDFF', marginBottom: '4px' }}>
            🧩 N8N Workflow Architecture & Environment Variables
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#849495', marginBottom: '16px' }}>
            Configured from `n8n.json` — 42 Active Nodes, 4 Webhooks, 3 Cron Triggers, and Global Error Workflow
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {[
              { key: 'SUPABASE_URL', val: 'https://mcp.supabase.co' },
              { key: 'WA_PHONE_NUMBER_ID', val: '10928491823901' },
              { key: 'WA_VERIFY_TOKEN', val: 'hospital_ai_verify_2026' },
              { key: 'VOICE_API_BASE_URL', val: 'https://voice.mediverse.ai' },
              { key: 'GOOGLE_REVIEW_LINK', val: 'https://g.page/r/hospital-mediverse/review' },
              { key: 'ADMIN_EMAIL', val: 'frontdesk.supervisor@hospital.mediverse.ai' }
            ].map((item) => (
              <div key={item.key} style={{ background: 'rgba(16, 19, 27, 0.75)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(0, 242, 254, 0.2)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#849495' }}>{item.key}</div>
                <div className="font-data-mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#00F2FE', marginTop: '4px' }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
