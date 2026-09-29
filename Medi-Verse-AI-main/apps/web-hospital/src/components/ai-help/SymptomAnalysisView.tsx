import React, { useState } from 'react';
import { 
  Bot, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles, 
  Activity, 
  ArrowRight, 
  PhoneCall, 
  Calendar, 
  HeartPulse, 
  Leaf, 
  RefreshCw, 
  HelpCircle,
  Clock,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { 
  COMMON_SYMPTOMS, 
  EVALUATE_SYMPTOMS, 
  PossibleConcern 
} from './aiHelpData';

interface SymptomAnalysisViewProps {
  onNavigateToTab: (tabId: string) => void;
  onBookDoctor?: () => void;
  onEmergencyTrigger?: () => void;
}

export const SymptomAnalysisView: React.FC<SymptomAnalysisViewProps> = ({
  onNavigateToTab,
  onBookDoctor,
  onEmergencyTrigger
}) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [freeText, setFreeText] = useState<string>('');
  const [severity, setSeverity] = useState<number>(4);
  const [durationDays, setDurationDays] = useState<number>(2);
  const [patientAge, setPatientAge] = useState<number>(30);
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    overallUrgency: 'LOW' | 'MODERATE' | 'URGENT_RED_FLAG';
    urgencyReason: string;
    concerns: PossibleConcern[];
    redFlagWarning: string | null;
  } | null>(null);

  const toggleSymptom = (id: string) => {
    setValidationError(null);
    setSelectedSymptoms(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleRunAnalysis = () => {
    if (selectedSymptoms.length === 0 && !freeText.trim()) {
      setValidationError('Please select at least one symptom or describe your symptoms in the text box above.');
      return;
    }
    setValidationError(null);
    setIsAnalyzing(true);
    setTimeout(() => {
      const res = EVALUATE_SYMPTOMS(selectedSymptoms, freeText, severity, durationDays);
      setAnalysisResult(res);
      setIsAnalyzing(false);
    }, 600);
  };

  const handleReset = () => {
    setSelectedSymptoms([]);
    setFreeText('');
    setSeverity(4);
    setDurationDays(2);
    setAnalysisResult(null);
    setValidationError(null);
  };

  const urgencyConfig = {
    LOW: {
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.3)',
      badge: 'NON-URGENT / SELF-CARE',
      icon: CheckCircle2,
      subtitle: 'Mild constitutional symptoms. Can be monitored with hydration and home self-care.'
    },
    MODERATE: {
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.08)',
      border: 'rgba(245, 158, 11, 0.3)',
      badge: 'MODERATE / CLINICAL VISIT ADVISED',
      icon: AlertTriangle,
      subtitle: 'Symptoms warrant clinical assessment by a general physician within 24-48 hours.'
    },
    URGENT_RED_FLAG: {
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.4)',
      badge: 'EMERGENCY / URGENT MEDICAL ATTENTION',
      icon: ShieldAlert,
      subtitle: 'Critical red flags identified. Immediate in-person emergency evaluation required.'
    }
  };

  const currentUrgency = analysisResult ? urgencyConfig[analysisResult.overallUrgency] : urgencyConfig.LOW;
  const UrgencyIcon = currentUrgency.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER / INTRO */}
      <div 
        className="glass-panel"
        style={{ 
          padding: '24px', 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(0, 180, 216, 0.04) 100%)',
          border: '1px solid rgba(2, 132, 199, 0.2)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <Bot size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  AI Symptom Analysis & Clinical Decision Support
                </h2>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  Natural language symptom triaging, differential probability mapping, and urgency scoring
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '20px', background: 'rgba(2, 132, 199, 0.12)', color: '#0284C7', fontWeight: 700 }}>
              CDSS Model v4.2
            </span>
            <span style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.12)', color: '#059669', fontWeight: 700 }}>
              Class C SaMD Compliant
            </span>
          </div>
        </div>

        {/* DECISION SUPPORT DISCLAIMER */}
        <div 
          style={{ 
            marginTop: '16px', 
            padding: '10px 14px', 
            background: 'rgba(245, 158, 11, 0.08)', 
            border: '1px solid rgba(245, 158, 11, 0.25)', 
            borderRadius: '8px',
            fontSize: '12px',
            color: '#B45309',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <HelpCircle size={16} style={{ flexShrink: 0 }} />
          <span>
            <strong>Decision Support Notice:</strong> This AI tool provides clinical decision support and guidance. It does <em>not</em> establish a final diagnostic determination. Always seek consultation with a licensed physician for clinical therapy.
          </span>
        </div>
      </div>

      {/* INPUT FORM & RESULTS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: '24px', alignItems: 'start' }}>
        {/* LEFT COLUMN: SYMPTOM INPUT FORM */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} color="#0284C7" /> 1. Enter Patient Symptoms & Context
          </div>

          {/* FREE TEXT INPUT */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Describe your symptoms in natural language:
            </label>
            <textarea
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              placeholder="e.g., I have had a high fever for 2 days with sharp body ache, shivering, and slight dry cough..."
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                color: '#0F172A',
                fontFamily: 'inherit',
                outline: 'none',
                resize: 'vertical',
                background: '#F8FAFC'
              }}
            />
          </div>

          {/* QUICK SYMPTOM CHIPS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
                Quick Symptom Tags (click to toggle):
              </label>
              <span style={{ fontSize: '11px', color: '#64748B' }}>{selectedSymptoms.length} selected</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
              {COMMON_SYMPTOMS.map(sym => {
                const isSelected = selectedSymptoms.includes(sym.id);
                return (
                  <button
                    key={sym.id}
                    onClick={() => toggleSymptom(sym.id)}
                    type="button"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '11.5px',
                      fontWeight: isSelected ? 700 : 500,
                      border: isSelected ? '1px solid #0284C7' : '1px solid #E2E8F0',
                      background: isSelected ? 'rgba(2, 132, 199, 0.1)' : '#F8FAFC',
                      color: isSelected ? '#0284C7' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSelected ? '✓ ' : '+ '}{sym.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEVERITY & DURATION CONTROLS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sliders size={13} /> Severity (1-10):
                </span>
                <span style={{ 
                  fontSize: '12px', 
                  fontWeight: 800, 
                  color: severity >= 8 ? '#EF4444' : severity >= 5 ? '#F59E0B' : '#10B981' 
                }}>
                  {severity} / 10
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={severity} 
                onChange={(e) => setSeverity(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: severity >= 8 ? '#EF4444' : '#0284C7' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8' }}>
                <span>1 Mild</span>
                <span>5 Moderate</span>
                <span>10 Severe</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> Duration:
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                  {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="14" 
                value={durationDays} 
                onChange={(e) => setDurationDays(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: '#0284C7' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8' }}>
                <span>1 Day</span>
                <span>7 Days</span>
                <span>14+ Days</span>
              </div>
            </div>
          </div>

          {/* DEMOGRAPHICS (AGE / GENDER) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Patient Age (Years):
              </label>
              <input
                type="number"
                value={patientAge}
                onChange={(e) => setPatientAge(parseInt(e.target.value) || 25)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Biological Sex:
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: '#FFF'
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>          {validationError && (
            <div style={{ padding: '10px 14px', borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', fontSize: '12.5px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              {validationError}
            </div>
          )}

          {/* SUBMIT & RESET BUTTONS */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              style={{
                flex: 1,
                background: 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '13px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
                opacity: isAnalyzing ? 0.7 : 1
              }}
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Running CDSS Clinical Engine...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Analyze Symptoms with AI</span>
                </>
              )}
            </button>

            {(selectedSymptoms.length > 0 || freeText.trim() || analysisResult) && (
              <button
                onClick={handleReset}
                style={{
                  background: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #CBD5E1',
                  padding: '13px 18px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AI CLINICAL GUIDANCE & CONCERNS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {!analysisResult ? (
            <div 
              className="glass-panel" 
              style={{ 
                padding: '36px 28px', 
                borderRadius: '16px', 
                background: '#FFFFFF', 
                border: '1.5px dashed #CBD5E1',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div 
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '16px', 
                  background: 'rgba(2, 132, 199, 0.08)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: '#0284C7' 
                }}
              >
                <Activity size={30} />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                  Awaiting Patient Symptoms
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', maxWidth: '420px', lineHeight: '1.6', marginTop: '6px' }}>
                  Select one or more symptoms from the clinical categories on the left or type your experience in natural language, then click <strong>Analyze Symptoms with AI</strong> to compute your triage urgency level and differential guidance.
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '11.5px', padding: '6px 12px', borderRadius: '20px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontWeight: 700 }}>
                  🟢 Non-Urgent / Self-Care
                </span>
                <span style={{ fontSize: '11.5px', padding: '6px 12px', borderRadius: '20px', background: '#FFFBEB', border: '1px solid #FDE68A', color: '#92400E', fontWeight: 700 }}>
                  🟡 Moderate / OPD Consultation
                </span>
                <span style={{ fontSize: '11.5px', padding: '6px 12px', borderRadius: '20px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontWeight: 700 }}>
                  🔴 Urgent Emergency Red-Flag
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* URGENCY INDICATOR BANNER */}
              <div 
                style={{ 
                  padding: '20px', 
                  borderRadius: '16px', 
                  background: currentUrgency.bg, 
                  border: `1.5px solid ${currentUrgency.border}`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <UrgencyIcon size={24} color={currentUrgency.color} />
                    <div>
                      <span 
                        style={{ 
                          fontSize: '11px', 
                          fontWeight: 900, 
                          color: currentUrgency.color, 
                          letterSpacing: '0.05em' 
                        }}
                      >
                        TRIAGE LEVEL:
                      </span>
                      <div style={{ fontSize: '17px', fontWeight: 900, color: currentUrgency.color }}>
                        {currentUrgency.badge}
                      </div>
                    </div>
                  </div>

                  {analysisResult.overallUrgency === 'URGENT_RED_FLAG' && (
                    <button
                      onClick={onEmergencyTrigger}
                      style={{
                        background: '#EF4444',
                        color: '#FFF',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontWeight: 800,
                        fontSize: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(239, 68, 68, 0.4)'
                      }}
                    >
                      <PhoneCall size={14} /> Call 108 SOS
                    </button>
                  )}
                </div>

                <div style={{ fontSize: '13px', color: '#1E293B', lineHeight: '1.5' }}>
                  {analysisResult.urgencyReason}
                </div>

                {analysisResult.redFlagWarning && (
                  <div 
                    style={{ 
                      padding: '10px 12px', 
                      borderRadius: '8px', 
                      background: '#FEF2F2', 
                      border: '1px solid #FCA5A5', 
                      color: '#B91C1C', 
                      fontSize: '12px', 
                      fontWeight: 700 
                    }}
                  >
                    {analysisResult.redFlagWarning}
                  </div>
                )}
              </div>

              {/* POSSIBLE HEALTH CONCERNS */}
              <div className="glass-panel" style={{ padding: '22px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HeartPulse size={18} color="#0284C7" />
                    Differential Health Concerns & Probabilities
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Statistical Correlation</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {analysisResult.concerns.map((concern, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0',
                        background: '#F8FAFC',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                            {concern.condition}
                          </div>
                          <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: 700, marginTop: '2px' }}>
                            {concern.category} • Specialty: {concern.recommendedSpecialty}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '16px', fontWeight: 900, color: '#0284C7' }}>
                            {concern.matchScore}%
                          </div>
                          <span style={{ fontSize: '10px', color: '#64748B' }}>Correlation</span>
                        </div>
                      </div>

                      {/* PROBABILITY BAR */}
                      <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div 
                          style={{ 
                            width: `${concern.matchScore}%`, 
                            height: '100%', 
                            background: concern.matchScore > 80 ? 'linear-gradient(90deg, #0284C7, #00B4D8)' : '#94A3B8',
                            borderRadius: '3px'
                          }}
                        />
                      </div>

                      <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
                        <strong>Clinical Guidance:</strong> {concern.guidance}
                      </div>

                      {/* LIFESTYLE TIPS */}
                      {concern.lifestyleTips && concern.lifestyleTips.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                          {concern.lifestyleTips.map((tip, tIdx) => (
                            <span 
                              key={tIdx} 
                              style={{ 
                                fontSize: '11px', 
                                padding: '3px 8px', 
                                borderRadius: '6px', 
                                background: '#FFFFFF', 
                                border: '1px solid #CBD5E1', 
                                color: '#475569' 
                              }}
                            >
                              • {tip}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* ACTION BUTTONS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                  <button
                    onClick={onBookDoctor}
                    style={{
                      background: '#0F172A',
                      color: '#FFF',
                      border: 'none',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Calendar size={14} /> Book Specialist OPD
                  </button>

                  <button
                    onClick={() => onNavigateToTab('ayucare')}
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      color: '#059669',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Leaf size={14} /> View AyuCare Wellness <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
