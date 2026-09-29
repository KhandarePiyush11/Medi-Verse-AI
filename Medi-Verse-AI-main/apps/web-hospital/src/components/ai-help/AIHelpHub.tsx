import React, { useState } from 'react';
import { 
  Bot, 
  Activity, 
  TrendingUp, 
  Scan, 
  TestTube, 
  Clock, 
  Mic, 
  Leaf, 
  ShieldAlert, 
  Sparkles, 
  PhoneCall, 
  CheckCircle2, 
  Calendar, 
  Pill, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { SymptomAnalysisView } from './SymptomAnalysisView';
import { HealthRiskAssessmentView } from './HealthRiskAssessmentView';
import { PrescriptionDecoderView } from './PrescriptionDecoderView';
import { LabReportDecoderView } from './LabReportDecoderView';
import { MedicationReminderView } from './MedicationReminderView';
import { MultilingualVoiceAssistant } from './MultilingualVoiceAssistant';
import { AyuCareWellnessView } from './AyuCareWellnessView';
import { ExtractedMedicine } from './aiHelpData';

export type AIHelpTab = 
  | 'symptoms' 
  | 'risk' 
  | 'rx_decoder' 
  | 'lab_decoder' 
  | 'reminders' 
  | 'voice_assistant' 
  | 'ayucare';

interface AIHelpHubProps {
  initialTab?: AIHelpTab;
  onNavigateToPage?: (page: string) => void;
}

export const AIHelpHub: React.FC<AIHelpHubProps> = ({
  initialTab = 'symptoms',
  onNavigateToPage
}) => {
  const [activeTab, setActiveTab] = useState<AIHelpTab>(initialTab);
  const [syncedMedicines, setSyncedMedicines] = useState<ExtractedMedicine[] | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSyncToReminders = (meds: ExtractedMedicine[]) => {
    setSyncedMedicines(meds);
    setActiveTab('reminders');
    showToast(`Successfully transferred ${meds.length} prescribed medications into your daily schedule!`);
  };

  const handleBookDoctor = () => {
    if (onNavigateToPage) {
      onNavigateToPage('BOOK_APPOINTMENT');
    } else {
      alert('Redirecting to Specialist OPD Booking...');
    }
  };

  const handleNavigateToPharmacy = () => {
    if (onNavigateToPage) {
      onNavigateToPage('BUY_MEDICINES');
    } else {
      alert('Redirecting to MediVerse Pharmacy...');
    }
  };

  const handleEmergencyTrigger = () => {
    if (onNavigateToPage) {
      onNavigateToPage('EMERGENCY_SYSTEM');
    } else {
      const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port;
      window.open(isLocal ? 'http://localhost:5175' : '/emergency/', '_blank');
    }
  };

  const navTabs: Array<{ id: AIHelpTab; label: string; icon: any; badge: string; color: string }> = [
    { id: 'symptoms', label: '1. Symptom Analysis', icon: Activity, badge: 'CDSS', color: '#0284C7' },
    { id: 'risk', label: '2. Health Risk Assessment', icon: TrendingUp, badge: 'Score', color: '#2563EB' },
    { id: 'rx_decoder', label: '3. Prescription Decoder', icon: Scan, badge: 'OCR', color: '#0284C7' },
    { id: 'lab_decoder', label: '4. Lab Report Decoder', icon: TestTube, badge: 'LOINC', color: '#0284C7' },
    { id: 'reminders', label: '5. Medication Reminder', icon: Clock, badge: 'Active', color: '#059669' },
    { id: 'voice_assistant', label: '6. AI Voice Assistant', icon: Mic, badge: '9 Langs', color: '#7C3AED' },
    { id: 'ayucare', label: '7. AyuCare AI', icon: Leaf, badge: 'Ayurveda', color: '#059669' }
  ];

  return (
    <div style={{ padding: '28px 40px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div 
          style={{ 
            position: 'fixed', 
            bottom: '24px', 
            right: '24px', 
            background: '#0F172A', 
            color: '#FFFFFF', 
            padding: '12px 20px', 
            borderRadius: '10px', 
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            zIndex: 9999,
            border: '1px solid rgba(0, 180, 216, 0.4)',
            fontSize: '13px',
            fontWeight: 700
          }}
        >
          <CheckCircle2 size={18} color="#00B4D8" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HERO HEADER */}
      <div 
        className="glass-panel" 
        style={{ 
          padding: '24px 32px', 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%)', 
          borderRadius: '20px',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284C7 0%, #00B4D8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <Bot size={26} />
              </div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: 900, margin: 0, letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  MediVerse <span style={{ color: '#00B4D8' }}>AI Help</span> & Clinical Intelligence Hub
                </h1>
                <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '3px' }}>
                  Integrated Clinical Decision Support, Medical OCR, Refill Management, Multilingual Voice & Ayurvedic Wellness
                </div>
              </div>
            </div>
          </div>

          {/* TELEMETRY BADGES & SOS BUTTON */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.08)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '11.5px', color: '#CBD5E1' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
              <span>SaMD AI Inference: <strong>ONLINE</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.08)', padding: '6px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)', fontSize: '11.5px', color: '#CBD5E1' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00B4D8' }} />
              <span>Web Speech API: <strong>READY</strong></span>
            </div>

            <button
              onClick={handleEmergencyTrigger}
              style={{
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)'
              }}
            >
              <PhoneCall size={14} />
              <span>EMERGENCY SOS (108)</span>
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL TAB SWITCHER BAR */}
      <div 
        style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto', 
          padding: '6px', 
          background: '#FFFFFF', 
          borderRadius: '14px', 
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        {navTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                minWidth: '150px',
                padding: '10px 14px',
                borderRadius: '10px',
                border: isActive ? '1px solid #0284C7' : '1px solid transparent',
                background: isActive ? 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)' : 'transparent',
                color: isActive ? '#FFFFFF' : '#475569',
                fontWeight: isActive ? 800 : 600,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.3)' : 'none'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
              <span 
                style={{ 
                  fontSize: '9.5px', 
                  padding: '2px 6px', 
                  borderRadius: '10px', 
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  fontWeight: 700
                }}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIVE TAB CONTENT VIEW */}
      <div>
        {activeTab === 'symptoms' && (
          <SymptomAnalysisView 
            onNavigateToTab={(t) => setActiveTab(t as AIHelpTab)}
            onBookDoctor={handleBookDoctor}
            onEmergencyTrigger={handleEmergencyTrigger}
          />
        )}

        {activeTab === 'risk' && (
          <HealthRiskAssessmentView 
            onNavigateToTab={(t) => setActiveTab(t as AIHelpTab)}
          />
        )}

        {activeTab === 'rx_decoder' && (
          <PrescriptionDecoderView 
            onSyncToReminders={handleSyncToReminders}
            onNavigateToTab={(t) => setActiveTab(t as AIHelpTab)}
          />
        )}

        {activeTab === 'lab_decoder' && (
          <LabReportDecoderView 
            onNavigateToTab={(t) => setActiveTab(t as AIHelpTab)}
            onBookDoctor={handleBookDoctor}
          />
        )}

        {activeTab === 'reminders' && (
          <MedicationReminderView 
            incomingMedicines={syncedMedicines}
            onNavigateToPharmacy={handleNavigateToPharmacy}
            onBookFollowUp={handleBookDoctor}
          />
        )}

        {activeTab === 'voice_assistant' && (
          <MultilingualVoiceAssistant 
            onNavigateToTab={(t) => setActiveTab(t as AIHelpTab)}
            onEmergencyTrigger={handleEmergencyTrigger}
          />
        )}

        {activeTab === 'ayucare' && (
          <AyuCareWellnessView 
            onNavigateToTab={(t) => setActiveTab(t as AIHelpTab)}
            onEmergencyTrigger={handleEmergencyTrigger}
          />
        )}
      </div>
    </div>
  );
};
