'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Zap, 
  Search, 
  MapPin, 
  Calendar, 
  Cpu, 
  Sparkles, 
  Layers, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  Stethoscope,
  Globe,
  Brain,
  Fingerprint,
  Home,
  Radio,
  Bug
} from 'lucide-react';

export default function ConsumerLandingPage() {
  const [activeConsoleTab, setActiveConsoleTab] = useState<'TRIAGE' | 'RADAR' | 'BOOKING' | 'PROVIDER'>('TRIAGE');
  const [dicomSliderPos, setDicomSliderPos] = useState(50);
  const [outbreakFilter, setOutbreakFilter] = useState<'ALL' | 'DENGUE' | 'H3N2'>('ALL');

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#10131b', color: '#e0e2ed', overflowX: 'hidden' }}>
      
      {/* Stitch Design System Top Header */}
      <header style={{ 
        height: '76px', 
        borderBottom: '1px solid rgba(0, 242, 254, 0.15)', 
        backgroundColor: 'rgba(11, 14, 21, 0.85)', 
        backdropFilter: 'blur(24px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 48px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #00f2fe 0%, #3196e6 100%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}>
            <Brain size={26} color="#00373a" />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#e0fdff', display: 'flex', alignItems: 'center', gap: '8px' }}>
              NEUROSYNAPSE <span style={{ color: '#00f2fe' }}>HEALTH OS</span>
              <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.15)', color: '#00f2fe', border: '1px solid rgba(0, 242, 254, 0.3)' }}>v8.0 BIO-TECH</span>
            </div>
            <div style={{ fontSize: '10px', color: '#849495', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>SOVEREIGN B2C HEALTH GATEWAY</span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 6px #10b981' }}></span>
                ABDM M1-M3 COMPLIANT
              </span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, margin: '0 16px', overflow: 'hidden' }}>
          <nav 
            onWheel={(e) => {
              if (e.deltaY !== 0) {
                e.currentTarget.scrollLeft += e.deltaY;
              }
            }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'rgba(255, 255, 255, 0.04)', 
              padding: '5px 8px', 
              borderRadius: '14px', 
              border: '1px solid rgba(255, 255, 255, 0.08)',
              overflowX: 'auto',
              overflowY: 'hidden',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
              scrollbarWidth: 'thin'
            }}
          >
            <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#e0e2ed', textDecoration: 'none', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 700, background: 'rgba(0, 242, 254, 0.15)', border: '1px solid rgba(0, 242, 254, 0.3)', flexShrink: 0 }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(0, 242, 254, 0.25)', color: '#00f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Home size={13} />
              </div>
              Home
            </a>
            <a href="#outbreak-radar" style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#b9cacb', textDecoration: 'none', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s', flexShrink: 0 }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(239, 68, 68, 0.15)', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bug size={13} />
              </div>
              Outbreak Radar
            </a>
            <a href="#samd-preview" style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#b9cacb', textDecoration: 'none', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s', flexShrink: 0 }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Cpu size={13} />
              </div>
              SaMD Studio
            </a>
            <a href="#ecosystem" style={{ display: 'flex', alignItems: 'center', gap: '7px', color: '#b9cacb', textDecoration: 'none', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s', flexShrink: 0 }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'rgba(160, 185, 129, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Layers size={13} />
              </div>
              Ecosystem
            </a>
          </nav>
        </div>

        <a 
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          style={{ 
            padding: '10px 22px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #00f2fe 0%, #3196e6 100%)', 
            color: '#00373a', 
            fontWeight: 800, 
            fontSize: '13px', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }}
        >
          <Stethoscope size={16} /> Launch Clinical Workstation
        </a>
      </header>

      {/* HERO SECTION WITH STITCH BIO-TECH GLASSMORPHISM */}
      <section id="hero" style={{ 
        position: 'relative', 
        padding: '80px 48px 60px 48px', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, rgba(0, 242, 254, 0.1) 0%, rgba(16, 19, 27, 1) 70%)'
      }}>
        
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '6px 16px', 
          borderRadius: '30px', 
          background: 'rgba(0, 242, 254, 0.1)', 
          border: '1px solid rgba(0, 242, 254, 0.3)', 
          color: '#00f2fe', 
          fontSize: '12px', 
          fontWeight: 700,
          marginBottom: '24px'
        }}>
          <Sparkles size={14} /> Stitch Bio-Tech Design System Edition | ABDM & SaMD CDSS Standard
        </div>

        <h1 style={{ 
          fontSize: '56px', 
          fontWeight: 800, 
          lineHeight: '1.1', 
          maxWidth: '920px', 
          margin: '0 0 20px 0',
          letterSpacing: '-0.03em',
          color: '#e0fdff'
        }}>
          Precision Health Operating System. <br />
          <span style={{ 
            background: 'linear-gradient(135deg, #00f2fe 0%, #9bcbff 100%)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            Zero-Leakage Sovereign Data.
          </span>
        </h1>

        <p style={{ fontSize: '18px', color: '#b9cacb', maxWidth: '720px', lineHeight: '1.6', margin: '0 0 40px 0' }}>
          Real-time ABDM health record orchestration, WebGPU zero-footprint PACS DICOM diagnostics, and SaMD clinical decision support with human-in-the-loop validation.
        </p>

        {/* Floating Glassmorphic Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', width: '100%', maxWidth: '1000px', marginBottom: '48px' }}>
          <div style={{ background: 'rgba(28, 32, 39, 0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 242, 254, 0.25)', padding: '24px', borderRadius: '12px', textAlign: 'left' }}>
            <div className="font-data-mono" style={{ fontSize: '32px', fontWeight: 700, color: '#00f2fe' }}>1.2M+</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#e0e2ed', marginTop: '4px' }}>ABDM Health Records Synced</div>
            <div style={{ fontSize: '12px', color: '#849495', marginTop: '2px' }}>HIECM M1-M3 Gateways Validated</div>
          </div>
          <div style={{ background: 'rgba(28, 32, 39, 0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(155, 203, 255, 0.25)', padding: '24px', borderRadius: '12px', textAlign: 'left' }}>
            <div className="font-data-mono" style={{ fontSize: '32px', fontWeight: 700, color: '#9bcbff' }}>99.4%</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#e0e2ed', marginTop: '4px' }}>SaMD Nodule Localization</div>
            <div style={{ fontSize: '12px', color: '#849495', marginTop: '2px' }}>MONAI Swin UNETR 3D WebGPU Engine</div>
          </div>
          <div style={{ background: 'rgba(28, 32, 39, 0.65)', backdropFilter: 'blur(20px)', border: '1px solid rgba(0, 242, 254, 0.25)', padding: '24px', borderRadius: '12px', textAlign: 'left' }}>
            <div className="font-data-mono" style={{ fontSize: '32px', fontWeight: 700, color: '#00f2fe' }}>0-Click</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#e0e2ed', marginTop: '4px' }}>Smart Rx Scribe Dispatch</div>
            <div style={{ fontSize: '12px', color: '#849495', marginTop: '2px' }}>MCI/NMC Cryptographic Signatures</div>
          </div>
        </div>

        {/* UNIFIED ACTION CONSOLE OMNIBAR */}
        <div style={{ 
          width: '100%', 
          maxWidth: '960px', 
          background: 'rgba(28, 32, 39, 0.85)', 
          backdropFilter: 'blur(20px)', 
          border: '1px solid rgba(0, 242, 254, 0.3)', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 0 40px rgba(0, 242, 254, 0.15)'
        }}>
          <div style={{ display: 'flex', gap: '12px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '16px' }}>
            {[
              { id: 'TRIAGE', label: 'Patient Triage & Symptoms', icon: Stethoscope },
              { id: 'RADAR', label: 'Viral Outbreak Radar', icon: Globe },
              { id: 'BOOKING', label: 'Book Imaging / OPD', icon: Calendar },
              { id: 'PROVIDER', label: 'Provider Portal Launch', icon: Cpu }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveConsoleTab(tab.id as any)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeConsoleTab === tab.id ? 'linear-gradient(135deg, #00f2fe, #3196e6)' : 'transparent',
                    color: activeConsoleTab === tab.id ? '#00373a' : '#b9cacb',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Icon size={16} /> {tab.label}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#0b0e15', border: '1px solid rgba(0,242,254,0.3)', borderRadius: '6px', padding: '0 12px' }}>
              <Search size={18} color="#00f2fe" />
              <input 
                type="text" 
                placeholder={
                  activeConsoleTab === 'TRIAGE' ? "Describe symptoms (e.g. High fever, joint pain, thrombocytopenia)..." :
                  activeConsoleTab === 'RADAR' ? "Enter City / District (e.g. New Delhi, Bengaluru)..." :
                  "Search Doctor, Specialty, or Hospital..."
                }
                style={{ width: '100%', background: 'transparent', border: 'none', color: '#FFF', padding: '12px', outline: 'none', fontSize: '14px', fontFamily: 'Geist, sans-serif' }}
              />
            </div>
            <button style={{ 
              padding: '12px 24px', 
              borderRadius: '6px', 
              border: 'none', 
              background: '#00f2fe', 
              color: '#00373a', 
              fontWeight: 800, 
              fontSize: '14px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              Execute Query <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </section>

      {/* LIVE EPIDEMIOLOGICAL SURGE HEATMAP */}
      <section id="outbreak-radar" style={{ padding: '60px 48px', background: '#0b0e15', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
            <div>
              <div className="font-data-mono" style={{ color: '#ffb4ab', fontWeight: 700, fontSize: '12px', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertCircle size={14} /> LIVE EPIDEMIOLOGICAL SURGE TELEMETRY
              </div>
              <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '4px 0 0 0', color: '#e0fdff' }}>National Disease Outbreak Radar</h2>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {(['ALL', 'DENGUE', 'H3N2'] as const).map(f => (
                <button 
                  key={f}
                  onClick={() => setOutbreakFilter(f)}
                  className="font-data-mono"
                  style={{
                    padding: '6px 14px',
                    borderRadius: '4px',
                    border: outbreakFilter === f ? '1px solid #ffb4ab' : '1px solid rgba(255,255,255,0.08)',
                    background: outbreakFilter === f ? 'rgba(255, 180, 171, 0.15)' : '#10131b',
                    color: outbreakFilter === f ? '#ffb4ab' : '#b9cacb',
                    fontWeight: 700,
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  {f} Clusters
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
            <div style={{ 
              height: '380px', 
              background: '#10131b', 
              borderRadius: '12px', 
              border: '1px solid rgba(255, 180, 171, 0.3)', 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', top: '120px', left: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#ffb4ab', boxShadow: '0 0 20px #ffb4ab' }} />
                <span className="font-data-mono" style={{ fontSize: '10px', background: '#93000a', color: '#ffb4ab', padding: '2px 6px', borderRadius: '4px', marginTop: '4px', fontWeight: 700 }}>
                  DELHI NCR: DENGUE SURGE (+340%)
                </span>
              </div>

              <div className="font-data-mono" style={{ position: 'absolute', bottom: '16px', left: '16px', fontSize: '11px', color: '#849495' }}>
                SPATIAL POISSON BAYESIAN REGRESSION | REAL-TIME IDSP SYMPTOM FEED
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(147, 0, 10, 0.25)', border: '1px solid #ffb4ab', padding: '16px', borderRadius: '8px' }}>
                <div className="font-data-mono" style={{ color: '#ffb4ab', fontWeight: 700, fontSize: '13px', marginBottom: '4px' }}>CRITICAL SURGE ALERT</div>
                <div style={{ fontSize: '14px', fontWeight: 700 }}>Delhi NCR — Dengue Serotype 2</div>
                <div className="font-data-mono" style={{ fontSize: '11px', color: '#b9cacb', marginTop: '4px' }}>
                  Relative Risk Ratio: <strong>3.42</strong> | IDSP Baseline Exceeded.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SaMD DIAGNOSTIC STUDIO (STITCH ENTERPRISE ECOSYSTEM) */}
      <section id="ecosystem" style={{ padding: '60px 48px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <div className="font-data-mono" style={{ color: '#00f2fe', fontWeight: 700, fontSize: '12px' }}>ENTERPRISE ECOSYSTEM</div>
          <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '4px 0 0 0', color: '#e0fdff' }}>Integrated Clinical Modules</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#e0fdff' }}>Instant ABHA KYC</div>
            <div style={{ fontSize: '12px', color: '#849495', marginTop: '4px' }}>Zero-friction patient onboarding with QR scan.</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#e0fdff' }}>Smart OPD Token</div>
            <div style={{ fontSize: '12px', color: '#849495', marginTop: '4px' }}>Live WebSocket triage queue orchestrator.</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#e0fdff' }}>Zero-Leakage TPA</div>
            <div style={{ fontSize: '12px', color: '#849495', marginTop: '4px' }}>Automated cashless insurance pre-authorization.</div>
          </div>
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#e0fdff' }}>eMAR & Telemetry</div>
            <div style={{ fontSize: '12px', color: '#849495', marginTop: '4px' }}>Bedside medication administration & vital feeds.</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '40px 48px', textAlign: 'center', color: '#849495', fontSize: '13px', background: '#0b0e15' }}>
        <div style={{ color: '#e0e2ed', fontWeight: 700 }}>NEUROSYNAPSE HEALTH OS — Enterprise Health-Tech & SaMD Platform</div>
        <div className="font-data-mono" style={{ marginTop: '8px', fontSize: '11px' }}>
          Stitch Bio-Tech Design System | HL7 FHIR v4 & ABDM M1-M3 Compliant
        </div>
      </footer>
    </div>
  );
}
