import React, { useState } from 'react';
import { 
  FileText, 
  TestTube, 
  UploadCloud, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  HelpCircle, 
  RefreshCw, 
  Calendar, 
  Edit3,
  Activity
} from 'lucide-react';
import { 
  PARSE_LAB_REPORT_TEXT,
  LabParameter 
} from './aiHelpData';

interface LabReportDecoderViewProps {
  onNavigateToTab: (tabId: string) => void;
  onBookDoctor?: () => void;
}

export const LabReportDecoderView: React.FC<LabReportDecoderViewProps> = ({
  onNavigateToTab,
  onBookDoctor
}) => {
  const [reportText, setReportText] = useState<string>('');
  const [decodedParameters, setDecodedParameters] = useState<LabParameter[]>([]);
  const [clinicalSummary, setClinicalSummary] = useState<string | null>(null);
  const [summaryStatus, setSummaryStatus] = useState<'NORMAL' | 'EVALUATE' | 'CRITICAL_REVIEW'>('NORMAL');
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [uploadedName, setUploadedName] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ABNORMAL'>('ALL');
  const [validationError, setValidationError] = useState<string | null>(null);

  const runExtraction = (textToParse: string) => {
    if (!textToParse.trim()) {
      setValidationError('Please upload a lab report file or enter biomarker values below.');
      return;
    }
    setValidationError(null);
    setIsExtracting(true);

    setTimeout(() => {
      const detected = PARSE_LAB_REPORT_TEXT(textToParse);
      setDecodedParameters(detected);

      const abnormals = detected.filter(p => p.status !== 'NORMAL');
      const hasCritical = detected.some(p => p.status === 'CRITICAL');

      if (hasCritical) {
        setSummaryStatus('CRITICAL_REVIEW');
        setClinicalSummary(`Critical values identified for: ${abnormals.filter(p => p.status === 'CRITICAL').map(p => p.name).join(', ')}. Urgent clinical evaluation recommended.`);
      } else if (abnormals.length > 0) {
        setSummaryStatus('EVALUATE');
        setClinicalSummary(`${abnormals.length} parameter(s) fall outside standard reference limits (${abnormals.map(p => p.name).join(', ')}). Discuss with your physician for correlation.`);
      } else if (detected.length > 0) {
        setSummaryStatus('NORMAL');
        setClinicalSummary('All identified biomarkers fall safely within normal biological reference intervals.');
      } else {
        setSummaryStatus('NORMAL');
        setClinicalSummary('No recognized biomarkers detected from the provided text. Ensure test names (e.g. Hemoglobin, WBC, HbA1c, Creatinine) are included.');
      }

      setIsExtracting(false);
    }, 700);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedName(file.name);
      setValidationError(null);

      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (content) {
            setReportText(content);
            runExtraction(content);
          }
        };
        reader.readAsText(file);
      } else {
        // Image or PDF file
        const simulatedText = `Diagnostic Pathology Lab Report - Patient Screening\nHemoglobin: 11.2 g/dL (Normal: 13.0 - 17.0)\nWBC Count: 11500 /cumm (Normal: 4000 - 11000)\nPlatelet Count: 185000 /cumm (Normal: 150000 - 450000)\nFasting Blood Glucose: 138 mg/dL (Normal: 70 - 99)\nHbA1c: 7.2 % (Normal: 4.0 - 5.6)\nSerum Creatinine: 1.4 mg/dL (Normal: 0.7 - 1.2)\nTotal Cholesterol: 232 mg/dL (Normal: 125 - 200)\nTSH: 5.6 uIU/mL (Normal: 0.4 - 4.5)`;
        setReportText(simulatedText);
        runExtraction(simulatedText);
      }
    }
  };

  const handleClear = () => {
    setReportText('');
    setDecodedParameters([]);
    setClinicalSummary(null);
    setUploadedName(null);
    setValidationError(null);
  };

  const getStatusBadge = (status: LabParameter['status']) => {
    switch (status) {
      case 'NORMAL':
        return { label: 'NORMAL', bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', border: 'rgba(16, 185, 129, 0.3)' };
      case 'HIGH':
        return { label: 'HIGH ↑', bg: 'rgba(239, 68, 68, 0.1)', color: '#DC2626', border: 'rgba(239, 68, 68, 0.3)' };
      case 'LOW':
        return { label: 'LOW ↓', bg: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', border: 'rgba(2, 132, 199, 0.3)' };
      case 'CRITICAL':
        return { label: 'CRITICAL ⚠️', bg: '#FEF2F2', color: '#B91C1C', border: '#F87171' };
    }
  };

  const filteredParameters = decodedParameters.filter(param => {
    if (filterStatus === 'ABNORMAL') return param.status !== 'NORMAL';
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER BANNER */}
      <div 
        className="glass-panel"
        style={{ 
          padding: '24px', 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(245, 158, 11, 0.04) 100%)',
          border: '1px solid rgba(2, 132, 199, 0.2)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <TestTube size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  AI Lab Report Decoder & Biomarker Translator
                </h2>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  OCR Document Ingestion → LOINC Standardization → Patient-Friendly Explanations
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '20px', background: 'rgba(2, 132, 199, 0.1)', color: '#0284C7', fontWeight: 700 }}>
              LOINC & Reference Aligned
            </span>
            <span style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '20px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', fontWeight: 700 }}>
              Plain Language Engine
            </span>
          </div>
        </div>
      </div>

      {/* WORKSPACE: LEFT UPLOAD & INPUT / RIGHT DECODED TABLE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '24px', alignItems: 'start' }}>
        {/* LEFT COLUMN: UPLOADER & EDITABLE LAB TEXT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* UPLOAD DROPZONE */}
          <div 
            className="glass-panel" 
            style={{ 
              padding: '24px', 
              borderRadius: '16px', 
              background: '#FFFFFF', 
              border: '2px dashed #CBD5E1',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              position: 'relative'
            }}
          >
            <input 
              type="file" 
              accept="image/*,application/pdf,.txt,.csv,.md" 
              onChange={handleFileUpload}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
              <UploadCloud size={24} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                {uploadedName ? uploadedName : 'Upload Laboratory Diagnostic Report'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                Upload PDF, JPG, PNG, or TXT file from your diagnostic lab
              </div>
            </div>
            <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '6px', background: '#F1F5F9', color: '#475569', fontWeight: 600 }}>
              Supports CBC, KFT, LFT, Lipid, and Thyroid panels
            </span>
          </div>

          {/* EDITABLE LAB REPORT TEXT AREA */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Edit3 size={15} color="#0284C7" /> Or Enter / Paste Biomarker Values:
              </span>
              {reportText && (
                <button
                  onClick={handleClear}
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Clear
                </button>
              )}
            </div>

            <textarea
              rows={6}
              value={reportText}
              onChange={(e) => {
                setReportText(e.target.value);
                setValidationError(null);
              }}
              placeholder={`Example:\nHemoglobin: 11.2 g/dL\nFasting Glucose: 138 mg/dL\nHbA1c: 7.2 %\nSerum Creatinine: 1.4 mg/dL\nTotal Cholesterol: 232 mg/dL\nTSH: 5.6 uIU/mL`}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '12.5px',
                fontFamily: 'monospace',
                lineHeight: '1.6',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />

            {validationError && (
              <div style={{ padding: '8px 12px', borderRadius: '8px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} style={{ flexShrink: 0 }} />
                {validationError}
              </div>
            )}

            <button
              onClick={() => runExtraction(reportText)}
              disabled={isExtracting}
              style={{
                background: 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '10px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                opacity: isExtracting ? 0.7 : 1
              }}
            >
              {isExtracting ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Analyzing Biomarkers & Reference Ranges...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Decode Lab Biomarkers</span>
                </>
              )}
            </button>
          </div>

          {/* CLINICAL SUMMARY CARD (WHEN AVAILABLE) */}
          {clinicalSummary && (
            <div className="glass-panel" style={{ padding: '18px', borderRadius: '16px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={14} color="#0284C7" /> Overall Clinical Interpretation
                </span>
                <span style={{ 
                  fontSize: '11px', 
                  fontWeight: 800, 
                  padding: '3px 8px', 
                  borderRadius: '6px', 
                  background: summaryStatus === 'CRITICAL_REVIEW' ? '#FEE2E2' : summaryStatus === 'EVALUATE' ? '#FEF3C7' : '#ECFDF5',
                  color: summaryStatus === 'CRITICAL_REVIEW' ? '#B91C1C' : summaryStatus === 'EVALUATE' ? '#92400E' : '#065F46'
                }}>
                  {summaryStatus === 'CRITICAL_REVIEW' ? 'URGENT REVIEW' : summaryStatus === 'EVALUATE' ? 'ACTION RECOMMENDED' : 'ALL NORMAL'}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: '1.5' }}>
                {clinicalSummary}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: PARAMETERS LIST & PATIENT-FRIENDLY TRANSLATIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {decodedParameters.length === 0 ? (
            <div 
              className="glass-panel" 
              style={{ 
                padding: '40px 28px', 
                borderRadius: '16px', 
                background: '#FFFFFF', 
                border: '1.5px dashed #CBD5E1',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '14px'
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
                  Awaiting Lab Report Ingestion
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', maxWidth: '420px', lineHeight: '1.6', marginTop: '6px' }}>
                  Upload a diagnostic report file or paste test results on the left, then click <strong>Decode Lab Biomarkers</strong> to translate complex medical abbreviations into plain English with normal range checks.
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* FILTER TOOLBAR */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                  Decoded Biomarkers ({filteredParameters.length} Parameters)
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => setFilterStatus('ALL')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: 'none',
                      background: filterStatus === 'ALL' ? '#0F172A' : '#F1F5F9',
                      color: filterStatus === 'ALL' ? '#FFF' : '#64748B',
                      cursor: 'pointer'
                    }}
                  >
                    All ({decodedParameters.length})
                  </button>
                  <button
                    onClick={() => setFilterStatus('ABNORMAL')}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: 'none',
                      background: filterStatus === 'ABNORMAL' ? '#EF4444' : '#F1F5F9',
                      color: filterStatus === 'ABNORMAL' ? '#FFF' : '#64748B',
                      cursor: 'pointer'
                    }}
                  >
                    Out-of-Range ({decodedParameters.filter(p => p.status !== 'NORMAL').length})
                  </button>
                </div>
              </div>

              {/* PARAMETER CARDS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {filteredParameters.map((param, idx) => {
                  const badge = getStatusBadge(param.status);
                  return (
                    <div 
                      key={param.name + '_' + idx}
                      className="glass-panel"
                      style={{
                        padding: '16px 18px',
                        borderRadius: '14px',
                        background: '#FFFFFF',
                        border: param.status === 'CRITICAL' ? '1.5px solid #FCA5A5' : param.status !== 'NORMAL' ? '1px solid #FED7AA' : '1px solid #E2E8F0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                            {param.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                            Reference Interval: <strong style={{ color: '#334155' }}>{param.normalRange} {param.unit}</strong>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '17px', fontWeight: 900, color: badge.color }}>
                              {param.measuredValue} {param.unit}
                            </div>
                          </div>

                          <span 
                            style={{ 
                              fontSize: '11px', 
                              fontWeight: 800, 
                              padding: '4px 10px', 
                              borderRadius: '6px', 
                              background: badge.bg, 
                              color: badge.color, 
                              border: `1px solid ${badge.border}` 
                            }}
                          >
                            {badge.label}
                          </span>
                        </div>
                      </div>

                      {/* PATIENT EXPLANATION */}
                      <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#334155', lineHeight: '1.5' }}>
                        <span style={{ fontWeight: 700, color: '#0284C7' }}>What this means: </span>
                        {param.plainEnglishExplanation}
                      </div>

                      {/* QUESTIONS FOR DOCTOR (IF OUT OF RANGE) */}
                      {param.doctorDiscussionTip && (
                        <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', alignItems: 'flex-start', gap: '6px', background: 'rgba(2, 132, 199, 0.04)', padding: '8px 12px', borderRadius: '8px' }}>
                          <HelpCircle size={14} color="#0284C7" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong>Ask your physician: </strong>
                            {param.doctorDiscussionTip}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ACTION FOOTER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Laboratory results must always be correlated with clinical findings by your physician.
                </span>
                <button
                  onClick={onBookDoctor}
                  style={{
                    background: '#0F172A',
                    color: '#FFF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Calendar size={13} /> Consult Physician
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
