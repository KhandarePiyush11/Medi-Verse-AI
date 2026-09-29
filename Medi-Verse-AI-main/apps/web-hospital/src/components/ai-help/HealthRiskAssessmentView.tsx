import React, { useState, useMemo } from 'react';
import { 
  HeartPulse, 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Sliders, 
  RefreshCw, 
  Printer, 
  FileText, 
  ChevronRight, 
  User, 
  Sparkles,
  Zap,
  TrendingUp,
  Apple,
  Dna
} from 'lucide-react';
import { 
  PatientRiskInputs, 
  RiskAssessmentResult, 
  CALCULATE_HEALTH_RISK 
} from './aiHelpData';

interface HealthRiskAssessmentViewProps {
  onNavigateToTab: (tabId: string) => void;
}

export const HealthRiskAssessmentView: React.FC<HealthRiskAssessmentViewProps> = ({
  onNavigateToTab
}) => {
  const DEFAULT_BASELINE: PatientRiskInputs = {
    age: 30,
    gender: 'male',
    heightCm: 170,
    weightKg: 68,
    systolicBP: 120,
    diastolicBP: 80,
    fastingBloodGlucose: 90,
    totalCholesterol: 180,
    smokingStatus: 'never',
    alcoholIntake: 'none',
    physicalActivity: 'moderate',
    familyHistory: {
      heartDisease: false,
      diabetes: false,
      hypertension: false,
      stroke: false
    }
  };

  const [formData, setFormData] = useState<PatientRiskInputs>(DEFAULT_BASELINE);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  const riskResult = useMemo<RiskAssessmentResult>(() => {
    return CALCULATE_HEALTH_RISK(formData);
  }, [formData]);

  const handleReset = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setFormData(DEFAULT_BASELINE);
      setIsRecalculating(false);
    }, 200);
  };

  const handleTriggerCalculate = () => {
    setIsRecalculating(true);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 400);
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const getRiskColor = (level: 'LOW' | 'MEDIUM' | 'HIGH') => {
    switch (level) {
      case 'LOW': return '#10B981';
      case 'MEDIUM': return '#F59E0B';
      case 'HIGH': return '#EF4444';
    }
  };

  const riskColor = getRiskColor(riskResult.overallRiskLevel);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER WITH PRESETS */}
      <div 
        className="glass-panel"
        style={{ 
          padding: '24px', 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(124, 58, 237, 0.04) 100%)',
          border: '1px solid rgba(2, 132, 199, 0.2)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <TrendingUp size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  AI Health Risk Assessment & Longitudinal Profiler
                </h2>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  Multifactorial cardiovascular, metabolic, and systemic vulnerability scoring
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS (NO DEMO PRESETS) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleReset}
              disabled={isRecalculating}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                background: '#FFFFFF',
                border: '1px solid #CBD5E1',
                color: '#475569',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={13} className={isRecalculating ? 'animate-spin' : ''} />
              Reset Inputs
            </button>
            <button
              onClick={handlePrint}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                background: '#0284C7',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Printer size={13} />
              Print / Export Report
            </button>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '24px', alignItems: 'start' }}>
        {/* LEFT COLUMN: PATIENT MEASUREMENT INPUTS */}
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="#0284C7" /> Patient Vitals & Risk Parameters
          </div>

          {/* BASIC DEMOGRAPHICS & BMI */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Age (Years):
              </label>
              <input
                type="number"
                min="18"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 30 })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
              />
            </div>

            <div>
              <label style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Biological Sex:
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700, background: '#FFF' }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Height (cm):
              </label>
              <input
                type="number"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value) || 160 })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Weight (kg):
              </label>
              <input
                type="number"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: parseInt(e.target.value) || 60 })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                BMI (kg/m²):
              </label>
              <div style={{ padding: '8px 10px', borderRadius: '8px', background: '#F1F5F9', fontSize: '13px', fontWeight: 800, color: '#0F172A', textAlign: 'center' }}>
                {riskResult.bmi}
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '-10px' }}>
            BMI Status: <strong>{riskResult.bmiCategory}</strong>
          </div>

          {/* CARDIOVASCULAR & GLYCEMIC VITALS */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', letterSpacing: '0.04em' }}>
              LAB & BIOMETRIC MEASUREMENTS
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Systolic Blood Pressure (mmHg):
                </label>
                <input
                  type="number"
                  value={formData.systolicBP}
                  onChange={(e) => setFormData({ ...formData, systolicBP: parseInt(e.target.value) || 120 })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Diastolic Blood Pressure (mmHg):
                </label>
                <input
                  type="number"
                  value={formData.diastolicBP}
                  onChange={(e) => setFormData({ ...formData, diastolicBP: parseInt(e.target.value) || 80 })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Fasting Glucose (mg/dL):
                </label>
                <input
                  type="number"
                  value={formData.fastingBloodGlucose}
                  onChange={(e) => setFormData({ ...formData, fastingBloodGlucose: parseInt(e.target.value) || 90 })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Total Cholesterol (mg/dL):
                </label>
                <input
                  type="number"
                  value={formData.totalCholesterol}
                  onChange={(e) => setFormData({ ...formData, totalCholesterol: parseInt(e.target.value) || 180 })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 700 }}
                />
              </div>
            </div>
          </div>

          {/* LIFESTYLE HABITS */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', letterSpacing: '0.04em' }}>
              LIFESTYLE & ACTIVITY FACTORS
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Tobacco / Smoking:
                </label>
                <select
                  value={formData.smokingStatus}
                  onChange={(e) => setFormData({ ...formData, smokingStatus: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, background: '#FFF' }}
                >
                  <option value="never">Never Smoked</option>
                  <option value="former">Former Smoker (Quit)</option>
                  <option value="current">Active Smoker</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Alcohol Consumption:
                </label>
                <select
                  value={formData.alcoholIntake}
                  onChange={(e) => setFormData({ ...formData, alcoholIntake: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, background: '#FFF' }}
                >
                  <option value="none">None (Teetotaler)</option>
                  <option value="occasional">Occasional / Social</option>
                  <option value="frequent">Frequent / Heavy</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Physical Activity Level:
              </label>
              <select
                value={formData.physicalActivity}
                onChange={(e) => setFormData({ ...formData, physicalActivity: e.target.value as any })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700, background: '#FFF' }}
              >
                <option value="sedentary">Sedentary (Desk job, &lt; 30 mins exercise/wk)</option>
                <option value="moderate">Moderate (Walking 3-4 days/wk)</option>
                <option value="active">Active (Vigorous sport/gym &gt; 150 mins/wk)</option>
              </select>
            </div>
          </div>

          {/* FAMILY HISTORY */}
          <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', letterSpacing: '0.04em' }}>
              FAMILY MEDICAL HISTORY (1st Degree Relatives):
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[
                { key: 'heartDisease', label: 'Heart Attack / CAD' },
                { key: 'diabetes', label: 'Type 2 Diabetes' },
                { key: 'hypertension', label: 'Chronic Hypertension' },
                { key: 'stroke', label: 'Ischemic Stroke' }
              ].map((item) => (
                <label 
                  key={item.key} 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}
                >
                  <input
                    type="checkbox"
                    checked={(formData.familyHistory as any)[item.key]}
                    onChange={(e) => setFormData({
                      ...formData,
                      familyHistory: { ...formData.familyHistory, [item.key]: e.target.checked }
                    })}
                    style={{ accentColor: '#0284C7' }}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* RECALCULATE / UPDATE RISK BUTTON */}
          <button
            onClick={handleTriggerCalculate}
            disabled={isRecalculating}
            style={{
              marginTop: '6px',
              padding: '12px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0284C7 0%, #2563EB 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
            }}
          >
            <RefreshCw size={15} className={isRecalculating ? 'animate-spin' : ''} />
            {isRecalculating ? 'Recalculating Risk Vector...' : 'Calculate Health Risk Profile'}
          </button>
        </div>

        {/* RIGHT COLUMN: AI RISK REPORT & MULTI-PILLAR BREAKDOWN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* OVERALL RISK CARD GAUGE */}
          <div 
            className="glass-panel" 
            style={{ 
              padding: '24px', 
              borderRadius: '16px', 
              background: '#FFFFFF', 
              border: `1.5px solid ${riskColor}40`,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', letterSpacing: '0.06em' }}>
                  OVERALL COMPREHENSIVE HEALTH RISK
                </span>
                <div style={{ fontSize: '24px', fontWeight: 900, color: riskColor, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span>{riskResult.overallRiskLevel} RISK</span>
                  <span style={{ fontSize: '15px', color: '#64748B', fontWeight: 600 }}>({riskResult.overallScore}/100)</span>
                </div>
              </div>

              {/* PRINT BUTTON */}
              <button
                onClick={() => window.print()}
                style={{
                  background: '#F1F5F9',
                  color: '#334155',
                  border: '1px solid #CBD5E1',
                  padding: '7px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={13} /> Print Report
              </button>
            </div>

            {/* PROGRESS GAUGE BAR */}
            <div style={{ width: '100%', height: '10px', background: '#F1F5F9', borderRadius: '5px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${riskResult.overallScore}%`, 
                  height: '100%', 
                  background: riskResult.overallRiskLevel === 'HIGH' 
                    ? 'linear-gradient(90deg, #F59E0B, #EF4444)' 
                    : riskResult.overallRiskLevel === 'MEDIUM' 
                    ? 'linear-gradient(90deg, #10B981, #F59E0B)' 
                    : '#10B981',
                  borderRadius: '5px',
                  transition: 'width 0.4s ease'
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8' }}>
              <span>0% Low Risk</span>
              <span>30% Threshold</span>
              <span>60% High Risk</span>
              <span>100%</span>
            </div>

            {/* 4-PILLAR RADAR SCORES */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginTop: '4px' }}>
              {[
                { label: 'Cardio Vascular', score: riskResult.cardiovascularScore, color: '#EF4444' },
                { label: 'Metabolic & Sugar', score: riskResult.metabolicScore, color: '#F59E0B' },
                { label: 'Respiratory & Lungs', score: riskResult.respiratoryScore, color: '#0284C7' },
                { label: 'Lifestyle Strain', score: riskResult.lifestyleScore, color: '#8B5CF6' }
              ].map((p, idx) => (
                <div key={idx} style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: p.color }}>
                    {p.score}%
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700, marginTop: '2px' }}>
                    {p.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KEY RISK DRIVERS IDENTIFIED */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertTriangle size={16} color="#F59E0B" /> Key Biomarker Risk Drivers Detected:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {riskResult.keyRiskDrivers.map((driver, dIdx) => (
                <div 
                  key={dIdx} 
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '8px', 
                    background: '#FFFBEB', 
                    border: '1px solid #FDE68A', 
                    color: '#92400E', 
                    fontSize: '12px', 
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ color: '#D97706', fontWeight: 900 }}>•</span>
                  <span>{driver}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PREVENTIVE ACTION PLAN */}
          <div className="glass-panel" style={{ padding: '22px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} color="#0284C7" /> Personalized Preventive Healthcare Action Plan
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* DIETARY PROTOCOL */}
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Apple size={13} /> DIET & NUTRITION
                </span>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '16px', fontSize: '11.5px', color: '#334155', lineHeight: '1.6' }}>
                  {riskResult.preventiveActionPlan.diet.slice(0, 3).map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              {/* RECOMMENDED TESTS */}
              <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284C7', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Dna size={13} /> RECOMMENDED LAB SCREENS
                </span>
                <ul style={{ margin: '8px 0 0 0', paddingLeft: '16px', fontSize: '11.5px', color: '#334155', lineHeight: '1.6' }}>
                  {riskResult.preventiveActionPlan.recommendedTests.slice(0, 3).map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CLINICAL TARGET THRESHOLDS */}
            <div style={{ marginTop: '14px', padding: '12px', borderRadius: '8px', background: 'rgba(2, 132, 199, 0.05)', border: '1px solid rgba(2, 132, 199, 0.15)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284C7', marginBottom: '6px' }}>
                CLINICAL BIOMETRIC GOALS TO LOWER RISK:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {riskResult.preventiveActionPlan.clinicalTargets.map((goal, gIdx) => (
                  <span key={gIdx} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '6px', background: '#FFF', border: '1px solid #CBD5E1', color: '#334155', fontWeight: 600 }}>
                    🎯 {goal}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
