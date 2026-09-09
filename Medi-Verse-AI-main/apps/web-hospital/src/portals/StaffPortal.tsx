import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  MessageSquare, 
  PhoneCall, 
  FileText, 
  Star, 
  Share2, 
  AlertTriangle, 
  CheckCircle2, 
  Play, 
  RefreshCw, 
  Send, 
  Clock, 
  Database, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  Activity, 
  PhoneOutgoing, 
  PhoneIncoming, 
  Check, 
  X, 
  User, 
  Calendar, 
  QrCode, 
  Download, 
  ExternalLink, 
  Cpu, 
  Sparkles,
  Layers,
  ArrowRight,
  Radio
} from 'lucide-react';

// Mock doctors and appointments for n8n automation engine
const initialDoctors = [
  { id: '1', name: 'Dr. Aarav Sharma', department: 'Cardiology', fee: 1200, available_days: 'Mon, Tue, Wed, Thu, Fri', start_time: '09:00', end_time: '17:00', slot_duration_minutes: 30 },
  { id: '2', name: 'Dr. Priya Nambiar', department: 'Neurology', fee: 1500, available_days: 'Mon, Wed, Fri', start_time: '10:00', end_time: '16:00', slot_duration_minutes: 30 },
  { id: '3', name: 'Dr. Rohan Deshmukh', department: 'Orthopedics', fee: 1000, available_days: 'Tue, Thu, Sat', start_time: '09:00', end_time: '14:00', slot_duration_minutes: 30 },
  { id: '4', name: 'Dr. Ananya Sen', department: 'Emergency / Critical Care', fee: 1500, available_days: 'Mon-Sun (24x7)', start_time: '00:00', end_time: '23:59', slot_duration_minutes: 15 }
];

const initialAppointments = [
  { id: 'apt-101', patient_id: 'pat-1', patient_name: 'Rajesh Verma', patient_phone: '+919811234567', doctor_id: '1', doctor_name: 'Dr. Aarav Sharma', department: 'Cardiology', slot_time: '2026-09-03T10:30:00', status: 'confirmed', reminder_24h_sent: false, reminder_2h_sent: false },
  { id: 'apt-102', patient_id: 'pat-2', patient_name: 'Meera Krishnan', patient_phone: '+919445188920', doctor_id: '2', doctor_name: 'Dr. Priya Nambiar', department: 'Neurology', slot_time: '2026-09-03T14:00:00', status: 'confirmed', reminder_24h_sent: false, reminder_2h_sent: false },
  { id: 'apt-103', patient_id: 'pat-3', patient_name: 'Sardar Gurpreet Singh', patient_phone: '+919876512098', doctor_id: '1', doctor_name: 'Dr. Aarav Sharma', department: 'Cardiology', slot_time: '2026-09-02T16:00:00', status: 'completed', reminder_24h_sent: true, reminder_2h_sent: true }
];

export const StaffPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'agent' | 'voice' | 'reports' | 'feedback' | 'workflow'>('agent');
  
  // 1. WhatsApp AI Agent State
  const [patientPhone, setPatientPhone] = useState('+919811234567');
  const [patientName, setPatientName] = useState('Rajesh Verma');
  const [waMessages, setWaMessages] = useState<Array<{ sender: 'user' | 'bot' | 'system'; text: string; time: string; toolUsed?: string }>>([
    { sender: 'system', text: '🟢 WhatsApp Webhook (POST /whatsapp-webhook) Handshake Verified.', time: '10:00 AM' },
    { sender: 'bot', text: 'Namaste Rajesh ji! 🙏 Main Hospital ka 24x7 AI Assistant hoon. Main aapke doctor appointment, timing, fee, lab reports aur general queries me madad kar sakta hoon. Aaj main aapki kya seva kar sakta hoon?', time: '10:01 AM' }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isAgentThinking, setIsAgentThinking] = useState(false);
  const [activeToolLog, setActiveToolLog] = useState<string | null>(null);

  // 2. Voice Call State
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'completed'>('idle');
  const [activeCallApt, setActiveCallApt] = useState(initialAppointments[0]);
  const [callOutcome, setCallOutcome] = useState<'confirmed' | 'reschedule_requested' | 'cancelled' | 'no_answer'>('confirmed');
  const [voiceLogs, setVoiceLogs] = useState<string[]>([
    'Cron Scanner [*/15 * * * *] initialized: Scanning appointments in 24h & 2h window...',
    'Found appointment #apt-101 (Rajesh Verma) - 24-hour reminder window triggered.'
  ]);

  // 3. Reports State
  const [reportPatient, setReportPatient] = useState('Rajesh Verma');
  const [reportType, setReportType] = useState('High-Sensitivity Troponin I & Fasting Lipid Panel');
  const [isCriticalPanic, setIsCriticalPanic] = useState(true);
  const [dispatchedReports, setDispatchedReports] = useState<Array<{ id: string; patient: string; type: string; critical: boolean; link: string; status: string; time: string }>>([
    { id: 'REP-9041', patient: 'Rajesh Verma', type: 'Troponin I (STAT Quantitative)', critical: true, link: 'https://hospital.mediverse.ai/r/9041-sec-token', status: 'Delivered (WhatsApp + Emergency Doctor Pinged)', time: '09:45 AM' }
  ]);

  // 4. Feedback & Reviews State
  const [feedbackList, setFeedbackList] = useState<Array<{ id: string; patient: string; rating: number; appointmentId: string; status: string; escalated: boolean; reviewBoostSent: boolean }>>([
    { id: 'FB-1', patient: 'Sardar Gurpreet Singh (+919876512098)', rating: 5, appointmentId: 'apt-103', status: 'Responded', escalated: false, reviewBoostSent: true },
    { id: 'FB-2', patient: 'Kavita Pillai (+919711054321)', rating: 2, appointmentId: 'apt-104', status: 'Escalated to Front Desk', escalated: true, reviewBoostSent: false }
  ]);

  // 5. Env Configuration State
  const [envVars, setEnvVars] = useState({
    SUPABASE_URL: 'https://mcp.supabase.co',
    WA_PHONE_NUMBER_ID: '10928491823901',
    WA_VERIFY_TOKEN: 'hospital_ai_verify_2026',
    VOICE_API_BASE_URL: 'https://voice.mediverse.ai',
    GOOGLE_REVIEW_LINK: 'https://g.page/r/hospital-mediverse/review',
    ADMIN_EMAIL: 'frontdesk.supervisor@hospital.mediverse.ai'
  });

  // Handle WhatsApp User Message & Agent Execution (Matching n8n.json Tools)
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

      // Check if this is a feedback rating 1-5
      if (/^[1-5]$/.test(text.trim())) {
        const rating = parseInt(text.trim(), 10);
        toolUsed = 'Update Feedback Record (Supabase)';
        if (rating <= 3) {
          botReply = 'Humein khed hai ki aapka experience accha nahi raha 🙏 Hamari senior team aapse turant contact karegi. Aap chahein to apni pareshani yahin likh sakte hain.';
          setFeedbackList(prev => [{ id: `FB-${Date.now()}`, patient: `${patientName} (${patientPhone})`, rating, appointmentId: 'apt-101', status: 'Escalated to Front Desk', escalated: true, reviewBoostSent: false }, ...prev]);
        } else {
          botReply = `Bahut bahut dhanyawad ⭐ Aapka ${rating}/5 rating record kar liya gaya hai! Kripya 30 second nikaal kar Google par hamare doctors ke liye ek review chhod dein:\n${envVars.GOOGLE_REVIEW_LINK}`;
          setFeedbackList(prev => [{ id: `FB-${Date.now()}`, patient: `${patientName} (${patientPhone})`, rating, appointmentId: 'apt-101', status: 'Google Review Dispatched', escalated: false, reviewBoostSent: true }, ...prev]);
        }
      } 
      // Doctor / Timing queries -> Tool: Get Hospital And Doctor Info
      else if (lower.includes('doctor') || lower.includes('timing') || lower.includes('fee') || lower.includes('department') || lower.includes('cardiology')) {
        toolUsed = 'Get Hospital And Doctor Info';
        botReply = 'Hamare paas Cardiology me Dr. Aarav Sharma (Mon-Fri 09:00 - 17:00, Fee: ₹1200) aur Neurology me Dr. Priya Nambiar (Mon, Wed, Fri 10:00 - 16:00, Fee: ₹1500) available hain. Kya aap inke sath slot book karna chahte hain?';
      }
      // Slot check / Booking -> Tool: Check Doctor Slots + Book Appointment
      else if (lower.includes('book') || lower.includes('appointment') || lower.includes('slot') || lower.includes('kal') || lower.includes('tomorrow')) {
        toolUsed = 'Check Doctor Booked Slots ➔ Book Appointment';
        botReply = `Maine Dr. Aarav Sharma ke sath kal subah 10:30 AM ka confirmed slot book kar diya hai! 🎉\n\n📌 Appointment ID: #APT-${Math.floor(1000 + Math.random() * 9000)}\n👨‍⚕️ Doctor: Dr. Aarav Sharma (Cardiology)\n🏥 Room: OPD-102 (1st Floor)\n\nAapko WhatsApp par reminder call bhi aayega.`;
      }
      // Report status -> Tool: Check My Report Status
      else if (lower.includes('report') || lower.includes('test') || lower.includes('result') || lower.includes('troponin')) {
        toolUsed = 'Check My Report Status';
        botReply = 'Aapka High-Sensitivity Troponin I & Lipid Panel test process ho chuka hai aur Doctor dwara electronically sign kiya gaya hai. 📄 Secure download link aapke number par dispatch kiya ja chuka hai.';
      }
      // Voice call request -> Tool: Request AI Voice Call
      else if (lower.includes('call') || lower.includes('phone') || lower.includes('baat')) {
        toolUsed = 'Request AI Voice Call For This Patient';
        botReply = 'Ji bilkul! Maine hamare AI Voice Calling Engine ko trigger kar diya hai. Hamari team/AI Assistant aapse agle 2 minute me call par sampark karega. 📞';
        setCallStatus('calling');
      }
      // Emergency / Escalation -> Tool: Escalate To Front Desk
      else if (lower.includes('chest pain') || lower.includes('emergency') || lower.includes('bleeding') || lower.includes('complaint')) {
        toolUsed = 'Escalate To Front Desk (Human Handoff)';
        botReply = '⚠️ Yeh emergency lag rahi hai! Kripya turant hamare Emergency Room (Ground Floor Triage Bay) me aayein ya 108 par call karein. Maine Front Desk Supervisor ko bhi STAT alert bhej diya hai.';
      }
      else {
        toolUsed = 'Patient WhatsApp AI Agent (Gemini Flash 2.0)';
        botReply = 'Aapka message receive ho gaya hai. Aap mujhse appointment booking, doctor schedules, lab reports, ya voice call request ke baare me poochh sakte hain.';
      }

      setActiveToolLog(toolUsed);
      setWaMessages(prev => [...prev, { sender: 'bot', text: botReply, time: timeStr, toolUsed }]);
      setIsAgentThinking(false);
    }, 900);
  };

  // Trigger Voice Call Follow-up
  const handleTriggerVoiceCall = (apt: typeof initialAppointments[0]) => {
    setActiveCallApt(apt);
    setCallStatus('calling');
    setVoiceLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Triggering Outbound Voice Call to ${apt.patient_name} (${apt.patient_phone}) via ${envVars.VOICE_API_BASE_URL}/api/v1/calls...`,
      ...prev
    ]);

    setTimeout(() => {
      setCallStatus('connected');
      setVoiceLogs(prev => [
        `[${new Date().toLocaleTimeString()}] Call Connected: Live AI Agent speaking with ${apt.patient_name} in Hindi/English...`,
        `Speech AI: "Namaste ${apt.patient_name} ji, yeh MediVerse Hospital se automated follow-up call hai. Kal aapka ${apt.doctor_name} ke sath ${apt.slot_time.substring(11, 16)} baje appointment hai. Kya aap is slot ko confirm kar rahe hain?"`,
        ...prev
      ]);
    }, 2000);
  };

  const handleSimulateCallOutcome = (outcome: 'confirmed' | 'reschedule_requested' | 'cancelled' | 'no_answer') => {
    setCallOutcome(outcome);
    setCallStatus('completed');
    const outcomeText = outcome === 'confirmed' 
      ? 'Patient verbally CONFIRMED appointment.' 
      : outcome === 'reschedule_requested' 
      ? 'Patient requested RESCHEDULE to next day 11:00 AM.' 
      : outcome === 'cancelled' 
      ? 'Patient requested CANCELLATION.' 
      : 'NO ANSWER: WhatsApp fallback message triggered.';

    setVoiceLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Webhook Callback Received (POST /voice-call-callback): Outcome = ${outcome.toUpperCase()}.`,
      `Database Sync: Updated appointments table -> ${outcomeText}`,
      ...prev
    ]);
  };

  // Dispatch Lab Report
  const handleDispatchReport = (e: React.FormEvent) => {
    e.preventDefault();
    const repId = `REP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRep = {
      id: repId,
      patient: reportPatient,
      type: reportType,
      critical: isCriticalPanic,
      link: `https://hospital.mediverse.ai/r/${repId.toLowerCase()}-sec-pin`,
      status: isCriticalPanic ? 'CRITICAL STAT ALERT: Doctor + Voice Call Triggered' : 'Delivered to WhatsApp',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setDispatchedReports([newRep, ...dispatchedReports]);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 24px 60px' }}>
      
      {/* Top Banner: N8N Model Context */}
      <div className="glass-panel" style={{ padding: '20px 28px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', borderLeft: '4px solid #0284C7' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>
              Hospital AI Automation Engine (N8N Core Workflow)
            </h2>
            <span className="badge badge-cyan" style={{ fontSize: '10px' }}>
              <Radio size={12} style={{ animation: 'pulse-slow 1.5s infinite' }} />
              N8N WORKFLOW ACTIVE
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '10px' }}>
              5 USE CASES SYNCHRONIZED
            </span>
          </div>
          <p style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px' }}>
            Full multi-trigger automation suite: 1) WhatsApp AI Booking & Support 2) AI Voice Calling 3) Diagnostic Reports 4) Review Booster 5) Error Audits
          </p>
        </div>

        {/* Sub Navigation Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {[
            { id: 'agent', label: '1. WhatsApp AI Agent', icon: MessageSquare },
            { id: 'voice', label: '2. Voice Calling Engine', icon: PhoneCall },
            { id: 'reports', label: '3. Reports & E-Prescription', icon: FileText },
            { id: 'feedback', label: '4. Feedback & Reviews', icon: Star },
            { id: 'workflow', label: '5. N8N Node Graph & Env', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className="nav-tab-btn"
                style={{
                  padding: '8px 14px',
                  borderRadius: '10px',
                  background: isActive ? '#0284C7' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#0F172A',
                  border: isActive ? '1px solid #0284C7' : '1px solid #CBD5E1',
                  fontWeight: 800,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.3)' : '0 1px 3px rgba(0,0,0,0.04)'
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* USE CASE 1 & 2: WHATSAPP INBOUND ROUTER + AI AGENT */}
      {activeTab === 'agent' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          
          {/* Simulated WhatsApp Phone Interface */}
          <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '620px', border: '1px solid #CBD5E1' }}>
            {/* WhatsApp Header */}
            <div style={{ background: '#075E54', color: '#FFF', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#128C7E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 900 }}>
                  🏥
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '14px' }}>MediVerse Hospital AI Care</div>
                  <div style={{ fontSize: '11px', opacity: 0.9 }}>Official Business Account • 24x7 Active</div>
                </div>
              </div>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#FFF', fontSize: '10px' }}>
                Meta Cloud API v21.0
              </span>
            </div>

            {/* Chat Thread */}
            <div style={{ flex: 1, padding: '18px', overflowY: 'auto', background: '#ECE5DD', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {waMessages.map((m, idx) => {
                const isUser = m.sender === 'user';
                const isSys = m.sender === 'system';

                if (isSys) {
                  return (
                    <div key={idx} style={{ textAlign: 'center', fontSize: '10.5px', color: '#555', background: 'rgba(255,255,255,0.7)', padding: '4px 12px', borderRadius: '20px', alignSelf: 'center' }}>
                      {m.text}
                    </div>
                  );
                }

                return (
                  <div
                    key={idx}
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      background: isUser ? '#DCF8C6' : '#FFFFFF',
                      color: '#0F172A',
                      padding: '10px 14px',
                      borderRadius: isUser ? '12px 0 12px 12px' : '0 12px 12px 12px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      fontSize: '12.5px',
                      lineHeight: 1.45
                    }}
                  >
                    {m.toolUsed && (
                      <div style={{ fontSize: '9.5px', fontWeight: 900, color: '#0284C7', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Zap size={10} />
                        TOOL EXECUTED: {m.toolUsed}
                      </div>
                    )}
                    <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                    <div style={{ fontSize: '9.5px', color: '#888', textAlign: 'right', marginTop: '4px' }}>
                      {m.time}
                    </div>
                  </div>
                );
              })}

              {isAgentThinking && (
                <div style={{ alignSelf: 'flex-start', background: '#FFF', padding: '8px 14px', borderRadius: '12px', fontSize: '11px', color: '#0284C7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={13} style={{ animation: 'spin 2s linear infinite' }} />
                  <span>N8N AI Agent executing tools (Gemini Flash 2.0)...</span>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendWaMessage(); }} style={{ padding: '12px 16px', background: '#F0F2F5', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                style={{ borderRadius: '24px', height: '40px', fontSize: '12.5px' }}
                placeholder="Type Hindi/Hinglish message (e.g. 'Dr Aarav ka appointment book karo', '5', 'Report status?')"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
              />
              <button type="submit" className="btn-primary" style={{ height: '40px', padding: '0 18px', borderRadius: '24px' }}>
                <Send size={15} />
              </button>
            </form>
          </div>

          {/* AI Agent Node Inspector & Quick Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Quick Test Prompt Shortcuts */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginBottom: '12px' }}>
                ⚡ Test Pre-built WhatsApp Scenarios (1-Click)
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  className="btn-secondary" 
                  style={{ justifyContent: 'flex-start', fontSize: '12px', padding: '8px 12px' }}
                  onClick={() => handleSendWaMessage('Dr. Aarav Sharma ke timing aur fees kya hain?')}
                >
                  💬 1. Ask Doctor Info & Timings
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ justifyContent: 'flex-start', fontSize: '12px', padding: '8px 12px' }}
                  onClick={() => handleSendWaMessage('Mujhe kal Cardiology me Dr Aarav ke sath appointment book karna hai')}
                >
                  📅 2. Book New Confirmed Appointment
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ justifyContent: 'flex-start', fontSize: '12px', padding: '8px 12px' }}
                  onClick={() => handleSendWaMessage('Kya meri Troponin lab report ready ho gayi hai?')}
                >
                  📑 3. Check Lab Report Status
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ justifyContent: 'flex-start', fontSize: '12px', padding: '8px 12px' }}
                  onClick={() => handleSendWaMessage('Mujhe doctor se phone par baat karni hai, please call me')}
                >
                  📞 4. Trigger Outbound AI Voice Call
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ justifyContent: 'flex-start', fontSize: '12px', padding: '8px 12px' }}
                  onClick={() => handleSendWaMessage('5')}
                >
                  ⭐ 5. Send 5-Star Rating (Google Review Trigger)
                </button>
                <button 
                  className="btn-secondary" 
                  style={{ justifyContent: 'flex-start', fontSize: '12px', padding: '8px 12px', color: '#DC2626' }}
                  onClick={() => handleSendWaMessage('1')}
                >
                  ⚠️ 6. Send 1-Star Rating (Unhappy Escalate Trigger)
                </button>
              </div>
            </div>

            {/* 8 Connected N8N Tools Matrix */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                  🛠️ N8N Agent Tools Configured (8 Tools)
                </h3>
                <span className="badge badge-emerald" style={{ fontSize: '9px' }}>Gemini Flash 2.0</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '11px' }}>
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
                  <div key={i} style={{ background: '#F1F5F9', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Check size={12} color="#059669" />
                    <span style={{ fontWeight: 700, color: '#334155' }}>{tool}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* USE CASE 3: AI VOICE CALLING FOR FOLLOW-UPS */}
      {activeTab === 'voice' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
          
          {/* Scheduled Appointments Scanner */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                  ⏰ 15-Min Reminder Scanner (Section B)
                </h3>
                <p style={{ fontSize: '12px', color: '#64748B' }}>
                  Auto-detects confirmed appointments in 24h & 2h windows and triggers Voice Calling API
                </p>
              </div>
              <button className="btn-secondary" style={{ fontSize: '12px' }} onClick={() => handleTriggerVoiceCall(initialAppointments[0])}>
                <RefreshCw size={13} /> Run Scanner Now
              </button>
            </div>

            <div className="data-table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient Name & Phone</th>
                    <th>Doctor & Dept</th>
                    <th>Appointment Slot</th>
                    <th>Window</th>
                    <th>Trigger Voice Call</th>
                  </tr>
                </thead>
                <tbody>
                  {initialAppointments.map((apt) => (
                    <tr key={apt.id}>
                      <td>
                        <div style={{ fontWeight: 800 }}>{apt.patient_name}</div>
                        <div className="font-data-mono" style={{ fontSize: '11px', color: '#0284C7' }}>{apt.patient_phone}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700 }}>{apt.doctor_name}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{apt.department}</div>
                      </td>
                      <td>
                        <div className="font-data-mono" style={{ fontWeight: 700 }}>{apt.slot_time.replace('T', ' ')}</div>
                      </td>
                      <td>
                        <span className="badge badge-amber" style={{ fontSize: '9.5px' }}>24h Reminder</span>
                      </td>
                      <td>
                        <button 
                          className="btn-primary" 
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                          onClick={() => handleTriggerVoiceCall(apt)}
                        >
                          <PhoneOutgoing size={13} /> Call Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Voice Call Terminal & Webhook Callback Simulator */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                📞 Voice Calling Server API Terminal
              </h3>
              <span className={`badge ${callStatus === 'connected' ? 'badge-emerald' : callStatus === 'calling' ? 'badge-amber' : 'badge-cyan'}`}>
                {callStatus.toUpperCase()}
              </span>
            </div>

            {callStatus === 'connected' && (
              <div style={{ background: '#F0FDF4', border: '1px solid #86EFAC', borderRadius: '10px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 800, color: '#166534', fontSize: '13px' }}>
                    🎙️ Call in Progress with {activeCallApt.patient_name}
                  </div>
                  <span className="font-data-mono" style={{ color: '#15803D', fontWeight: 800, fontSize: '12px' }}>00:42</span>
                </div>

                <div style={{ fontSize: '11.5px', color: '#14532D', background: '#DCFCE7', padding: '8px 12px', borderRadius: '6px' }}>
                  Patient response detected. Select patient verbal decision to simulate Webhook Callback:
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button className="btn-emerald" style={{ fontSize: '11px', padding: '8px' }} onClick={() => handleSimulateCallOutcome('confirmed')}>
                    ✅ Confirm Appointment
                  </button>
                  <button className="btn-secondary" style={{ fontSize: '11px', padding: '8px' }} onClick={() => handleSimulateCallOutcome('reschedule_requested')}>
                    🔄 Reschedule Request
                  </button>
                  <button className="btn-danger" style={{ fontSize: '11px', padding: '8px' }} onClick={() => handleSimulateCallOutcome('cancelled')}>
                    ❌ Cancel Slot
                  </button>
                  <button className="btn-secondary" style={{ fontSize: '11px', padding: '8px' }} onClick={() => handleSimulateCallOutcome('no_answer')}>
                    📵 No Answer / Busy
                  </button>
                </div>
              </div>
            )}

            {/* Voice Execution Logs */}
            <div style={{ background: '#0F172A', color: '#38BDF8', padding: '14px', borderRadius: '10px', fontSize: '11px', height: '240px', overflowY: 'auto', fontFamily: 'JetBrains Mono, monospace', lineHeight: 1.5 }}>
              {voiceLogs.map((log, i) => (
                <div key={i} style={{ marginBottom: '6px' }}>
                  {log}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* USE CASE 4: REPORTS & E-PRESCRIPTION DISPATCH */}
      {activeTab === 'reports' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '24px' }}>
          
          {/* Dispatch Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              📑 Report-Ready Webhook Trigger (Section C)
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '18px' }}>
              Simulates Laboratory Information System (LIS) generating signed diagnostic PDF & WhatsApp delivery
            </p>

            <form onSubmit={handleDispatchReport} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Patient Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={reportPatient}
                  onChange={(e) => setReportPatient(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>Investigation Report Type</label>
                <select
                  className="form-select"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value="High-Sensitivity Troponin I & Fasting Lipid Panel">High-Sensitivity Troponin I & Fasting Lipid Panel</option>
                  <option value="Complete Blood Count (CBC) with Differential">Complete Blood Count (CBC) with Differential</option>
                  <option value="MRI Brain with MR Angiography (Stroke Protocol)">MRI Brain with MR Angiography (Stroke Protocol)</option>
                  <option value="HbA1c & Fasting Blood Sugar Glycemic Profile">HbA1c & Fasting Blood Sugar Glycemic Profile</option>
                </select>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isCriticalPanic}
                    onChange={(e) => setIsCriticalPanic(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: isCriticalPanic ? '#DC2626' : '#0F172A' }}>
                      Mark as Critical Panic Value (is_critical = true)
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                      Auto-triggers emergency alert to Doctor + emergency outbound AI voice call to Patient.
                    </div>
                  </div>
                </label>
              </div>

              <button type="submit" className="btn-primary" style={{ marginTop: '6px' }}>
                <Send size={15} /> Trigger Webhook & Dispatch WhatsApp PDF
              </button>
            </form>
          </div>

          {/* Reports Dispatch Log & WhatsApp PDF Preview */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
              📡 Dispatched Reports & Panic Alert Audit Log
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {dispatchedReports.map((rep) => (
                <div 
                  key={rep.id} 
                  style={{
                    padding: '14px',
                    borderRadius: '10px',
                    background: rep.critical ? '#FEF2F2' : '#F8FAFC',
                    border: `1px solid ${rep.critical ? '#FECACA' : '#E2E8F0'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#0F172A' }}>{rep.patient}</div>
                      <div style={{ fontSize: '12px', color: '#0284C7', fontWeight: 700, marginTop: '2px' }}>{rep.type}</div>
                    </div>
                    <span className={`badge ${rep.critical ? 'badge-rose' : 'badge-emerald'}`}>
                      {rep.critical ? 'CRITICAL PANIC' : 'ROUTINE'}
                    </span>
                  </div>

                  <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#64748B' }}>
                    <span className="font-data-mono">{rep.id} • {rep.time}</span>
                    <a href="#" onClick={(e) => { e.preventDefault(); alert(`Opening Secure Verified Report PIN: ${rep.link}`); }} style={{ color: '#0284C7', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Download size={12} /> Secure Download Link
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* USE CASE 5: FEEDBACK & GOOGLE REVIEW BOOSTER */}
      {activeTab === 'feedback' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              ⭐ Post-Consultation Rating Automation (Section D)
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '18px' }}>
              Runs 3 hours after consultation. High ratings (4-5★) receive Google Review booster; low ratings (1-3★) trigger front-desk apology & supervisor escalation.
            </p>

            <div style={{ background: '#F1F5F9', padding: '16px', borderRadius: '10px', marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Simulate Patient WhatsApp Rating Response:
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleSendWaMessage(star.toString())}
                    className="btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', fontWeight: 900, color: star <= 3 ? '#DC2626' : '#059669' }}
                  >
                    {star} ★
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
              • <strong>4 or 5 Stars:</strong> Auto-sends: <em>"Bahut bahut dhanyawad! Kripya Google par review dein: {envVars.GOOGLE_REVIEW_LINK}"</em><br />
              • <strong>1, 2 or 3 Stars:</strong> Auto-sends apology + creates Supabase `escalations` ticket with Front Desk email alert.
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '14px' }}>
              📊 Live Feedback Stream & Google Review Conversions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {feedbackList.map((fb) => (
                <div key={fb.id} style={{ padding: '14px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '13px' }}>{fb.patient}</div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Apt #{fb.appointmentId} • {fb.status}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, fontSize: '14px', color: fb.rating <= 3 ? '#DC2626' : '#059669' }}>
                      {fb.rating} / 5 ⭐
                    </div>
                    <span className={`badge ${fb.escalated ? 'badge-rose' : 'badge-emerald'}`} style={{ fontSize: '9px' }}>
                      {fb.escalated ? 'Escalated' : 'Review Boosted'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* USE CASE 6: N8N WORKFLOW GRAPH & ENV CONFIG */}
      {activeTab === 'workflow' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                🧩 N8N Workflow Architecture & Environment Variables
              </h3>
              <p style={{ fontSize: '12px', color: '#64748B' }}>
                Defined in `n8n.json` — 42 Active Nodes, 4 Webhooks, 3 Cron Triggers, and Global Error Workflow
              </p>
            </div>
            <span className="badge badge-emerald">STATUS: READY FOR PRODUCTION</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginTop: '16px' }}>
            {Object.entries(envVars).map(([key, val]) => (
              <div key={key} style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B' }}>{key}</div>
                <div className="font-data-mono" style={{ fontSize: '12px', fontWeight: 700, color: '#0284C7', marginTop: '4px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default StaffPortal;
