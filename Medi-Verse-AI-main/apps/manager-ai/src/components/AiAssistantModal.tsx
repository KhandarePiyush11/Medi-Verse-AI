import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  BedDouble, 
  Pill, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  HelpCircle, 
  Zap 
} from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  dataCard?: {
    title: string;
    items: string[];
    badge?: string;
  };
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: 'Hello, I am MANAGER AI Co-Pilot — your hospital operations intelligence assistant. How can I assist you with clinical, pharmacy, lab, bed allocation, or OPD workflows today?',
      timestamp: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Check available ICU and HDU beds',
    'Dispense status for Patient Rajesh Verma',
    'Which medications are running low in Pharmacy?',
    'OPD queue prediction for Cardiology today',
    'List all STAT emergency lab orders'
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputVal;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI response logic
    setTimeout(() => {
      let aiResponse: Message;
      const lower = query.toLowerCase();

      if (lower.includes('bed') || lower.includes('icu') || lower.includes('hdu')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Here is the real-time bed status breakdown across all critical and inpatient care units:',
          timestamp: 'Just now',
          dataCard: {
            title: 'Live Ward Bed Availability',
            badge: '2 Critical Vacancies',
            items: [
              'ICU-B02 (2nd Floor Critical Wing) — AVAILABLE (Fully Sanitized)',
              'HDU-101 (2nd Floor Step-Down) — AVAILABLE (Telemetry Active)',
              'DELUXE-302 (3rd Floor VIP Pavilion) — AVAILABLE',
              'ICU-B03 — In Terminal Cleaning (Ready in ~15 mins)',
              'Current Overall Hospital Occupancy: 60%'
            ]
          }
        };
      } else if (lower.includes('pharmacy') || lower.includes('medication') || lower.includes('stock') || lower.includes('low')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'I detected 2 inventory alerts requiring supervisor attention:',
          timestamp: 'Just now',
          dataCard: {
            title: 'Pharmacy Inventory Alert Summary',
            badge: 'Urgent Restock',
            items: [
              'Inj. Noradrenaline 4mg (Batch NOR-26-0921) — 18 Ampoules left (Threshold: 30)',
              'Augmentin 625mg Duo (Batch AUG-26-4412) — 48 Strips left (Threshold: 100)',
              'Action Taken: Auto-generated Purchase Requisition PO-8820 for Neon Labs distributor'
            ]
          }
        };
      } else if (lower.includes('rajesh') || lower.includes('dispense') || lower.includes('verma')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'Patient Rajesh Verma (UHID: NSH-2026-0941):',
          timestamp: 'Just now',
          dataCard: {
            title: 'Patient Clinical Status & Rx Order',
            badge: 'STAT Trop-I Elevated',
            items: [
              'Attending Physician: Dr. Aarav Sharma (Cardiology)',
              'Prescription RX-9941-CD: Atorvastatin 40mg + Telmisartan 40/5mg (Dispense Pending)',
              'Lab Order LAB-9041: High-Sensitivity Troponin I is CRITICAL (0.084 ng/mL)',
              'OPD Token CARD-014: Currently In Consultation / Bedside monitoring'
            ]
          }
        };
      } else if (lower.includes('opd') || lower.includes('queue') || lower.includes('predict')) {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'AI OPD Flow Analysis for today indicates high throughput with manageable wait times:',
          timestamp: 'Just now',
          dataCard: {
            title: 'OPD Surge Forecast',
            badge: 'Optimal Efficiency',
            items: [
              'Cardiology OPD: 4 waiting, average consult time 14 mins (Next token: CARD-014)',
              'Neurology OPD: 2 waiting, Dr. Priya Nambiar available in Room OPD-105',
              'Emergency / Triage: Triage surge detected with P1 acuity patient (Tanvi Saxena)',
              'Predicted Afternoon Surge: Minor peak expected between 02:30 PM - 04:00 PM'
            ]
          }
        };
      } else {
        aiResponse = {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: `Processed your request regarding "${query}". All hospital sub-systems (Doctor Station, Pharmacy POS, Diagnostics LIS, OPD Token Gate, Reception Admission) are operating normally. Let me know if you need specific record modifications or automated orders.`,
          timestamp: 'Just now'
        };
      }

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ height: '680px', display: 'flex', flexDirection: 'column' }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 14, 21, 0.95)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #A855F7 0%, #00F2FE 100%)',
              color: '#00373A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
            }}>
              <Sparkles size={20} strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#E0FDFF' }}>
                MANAGER AI Operations Assistant
              </div>
              <div style={{ fontSize: '0.75rem', color: '#849495' }}>
                Autonomous Clinical, Bed, Pharmacy & Laboratory Intelligence
              </div>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        {/* Quick Prompts Bar */}
        <div style={{
          padding: '10px 20px',
          background: 'rgba(16, 19, 27, 0.9)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap'
        }}>
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(0, 242, 254, 0.2)',
                color: '#B9CACB',
                fontSize: '0.75rem',
                fontWeight: 600,
                padding: '5px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00F2FE';
                e.currentTarget.style.color = '#00F2FE';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 242, 254, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.2)';
                e.currentTarget.style.color = '#B9CACB';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Sparkles size={12} color="#00F2FE" />
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div style={{
          flex: 1,
          padding: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          background: '#0B0F17'
        }}>
          {messages.map((m) => {
            const isAi = m.sender === 'ai';
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignSelf: isAi ? 'flex-start' : 'flex-end',
                  maxWidth: isAi ? '88%' : '78%'
                }}
              >
                {isAi && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(168, 85, 247, 0.15)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    color: '#C084FC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Bot size={16} />
                  </div>
                )}

                <div>
                  <div style={{
                    background: isAi ? 'rgba(28, 32, 39, 0.85)' : 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)',
                    color: isAi ? '#E0FDFF' : '#00373A',
                    fontWeight: isAi ? 500 : 700,
                    padding: '12px 16px',
                    borderRadius: isAi ? '0 14px 14px 14px' : '14px 0 14px 14px',
                    fontSize: '0.88rem',
                    lineHeight: 1.5,
                    border: isAi ? '1px solid rgba(0, 242, 254, 0.25)' : '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: isAi ? '0 0 20px rgba(0, 242, 254, 0.1)' : '0 0 20px rgba(0, 242, 254, 0.35)'
                  }}>
                    {m.text}

                    {m.dataCard && (
                      <div style={{
                        marginTop: '12px',
                        background: 'rgba(16, 19, 27, 0.9)',
                        border: '1px solid rgba(0, 242, 254, 0.3)',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        color: '#E0FDFF'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#00F2FE' }}>
                            {m.dataCard.title}
                          </span>
                          {m.dataCard.badge && (
                            <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>
                              {m.dataCard.badge}
                            </span>
                          )}
                        </div>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {m.dataCard.items.map((it, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.8rem', color: '#B9CACB' }}>
                              <CheckCircle2 size={14} color="#34D399" style={{ marginTop: '2px', flexShrink: 0 }} />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="font-data-mono" style={{ fontSize: '0.7rem', color: '#849495', marginTop: '4px', textAlign: isAi ? 'left' : 'right' }}>
                    {m.timestamp}
                  </div>
                </div>

                {!isAi && (
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(0, 242, 254, 0.15)',
                    color: '#00F2FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    border: '1px solid rgba(0, 242, 254, 0.3)'
                  }}>
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#00F2FE', fontSize: '0.8rem' }}>
              <Bot size={16} color="#A855F7" />
              <span>MANAGER AI is computing hospital recommendations...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: '14px 20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(16, 19, 27, 0.95)',
            display: 'flex',
            gap: '12px'
          }}
        >
          <input
            type="text"
            className="form-input"
            style={{ borderRadius: '20px', height: '42px', fontSize: '0.88rem' }}
            placeholder="Ask AI Assistant about patient status, beds, pharmacy, or lab orders..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ padding: '0 20px', borderRadius: '20px' }}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
