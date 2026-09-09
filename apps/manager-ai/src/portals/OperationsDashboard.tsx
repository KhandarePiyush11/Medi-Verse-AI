import React from 'react';
import { 
  Activity, 
  BedDouble, 
  Users, 
  Pill, 
  FlaskConical, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  ArrowUpRight,
  Stethoscope,
  Sparkles,
  Zap,
  Building2,
  Check,
  Bot
} from 'lucide-react';
import { Bed, Doctor, OpdToken, PharmacyItem, LabTestOrder, OperationalAlert, PortalType } from '../types';

interface OperationsDashboardProps {
  beds: Bed[];
  doctors: Doctor[];
  opdTokens: OpdToken[];
  pharmacyItems: PharmacyItem[];
  labOrders: LabTestOrder[];
  alerts: OperationalAlert[];
  onNavigatePortal: (portal: PortalType) => void;
  onDismissAlert: (id: string) => void;
}

export const OperationsDashboard: React.FC<OperationsDashboardProps> = ({
  beds,
  doctors,
  opdTokens,
  pharmacyItems,
  labOrders,
  alerts,
  onNavigatePortal,
  onDismissAlert
}) => {
  const occupiedBeds = beds.filter((b) => b.status === 'Occupied').length;
  const availableBeds = beds.filter((b) => b.status === 'Available').length;
  const occupancyPercent = beds.length > 0 ? Math.round((occupiedBeds / beds.length) * 100) : 0;

  const activeConsults = doctors.filter((d) => d.status === 'In_Consult').length;
  const onDutyDocs = doctors.filter((d) => d.status !== 'Off_Duty').length;

  const waitingTokens = opdTokens.filter((t) => t.status === 'Waiting' || t.status === 'Calling').length;
  const p1CriticalTokens = opdTokens.filter((t) => t.triageLevel === 'P1_Critical').length;

  const lowStockCount = pharmacyItems.filter((m) => m.status === 'Low_Stock' || m.status === 'Critical_Shortage').length;
  const statLabCount = labOrders.filter((l) => l.priority === 'STAT_Emergency' && l.status !== 'Verified_Approved').length;

  // Ward breakdown calculation
  const wardBreakdown: Record<string, { occupied: number; total: number }> = {};
  beds.forEach((b) => {
    if (!wardBreakdown[b.ward]) {
      wardBreakdown[b.ward] = { occupied: 0, total: 0 };
    }
    wardBreakdown[b.ward].total += 1;
    if (b.status === 'Occupied') {
      wardBreakdown[b.ward].occupied += 1;
    }
  });

  return (
    <div className="portal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner: Hospital Operations Health Index */}
      <div className="glass-panel-glow" style={{
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'rgba(22, 28, 40, 0.85)',
        border: '1.5px solid rgba(0, 242, 254, 0.35)',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '54px',
            height: '54px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00373A',
            boxShadow: '0 0 30px rgba(0, 242, 254, 0.5)'
          }}>
            <Activity size={30} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#E0FDFF', margin: 0, letterSpacing: '-0.02em' }}>
                Operational Health Index: <span className="text-gradient-cyan">98.4% Optimal</span>
              </h2>
              <span className="badge badge-emerald">
                <span className="pulse-dot pulse-emerald" />
                ABDM & HL7 Synced
              </span>
              <span className="badge badge-cyan">
                6 Active Units
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#B9CACB', marginTop: '5px' }}>
              Autonomous telemetry monitoring active across all clinical nodes • 0.8s real-time edge sync • CDSS dispatch active
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn-secondary" onClick={() => onNavigatePortal('reception')}>
            <Building2 size={16} color="#00F2FE" />
            Bed Matrix ({availableBeds} Vacant)
          </button>
          <button className="btn-primary" onClick={() => onNavigatePortal('opd')}>
            <Users size={16} />
            OPD Flow ({waitingTokens} Waiting)
          </button>
        </div>
      </div>

      {/* Primary KPI Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px'
      }}>
        {/* Bed Occupancy Card */}
        <div 
          className="stat-card"
          onClick={() => onNavigatePortal('reception')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>
              Bed Occupancy Rate
            </span>
            <div className="btn-icon" style={{ width: '32px', height: '32px' }}>
              <BedDouble size={16} color="#00F2FE" />
            </div>
          </div>
          <div className="font-data-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#E0FDFF', margin: '8px 0 4px' }}>
            {occupancyPercent}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: '#849495' }}>{occupiedBeds} / {beds.length} Beds</span>
            <span style={{ color: '#34D399', fontWeight: 800 }}>{availableBeds} Available</span>
          </div>
        </div>

        {/* OPD Queue Load */}
        <div 
          className="stat-card"
          onClick={() => onNavigatePortal('opd')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>
              OPD Queue & Triage
            </span>
            <div className="btn-icon" style={{ width: '32px', height: '32px' }}>
              <Users size={16} color="#818CF8" />
            </div>
          </div>
          <div className="font-data-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#E0FDFF', margin: '8px 0 4px' }}>
            {waitingTokens} <span style={{ fontSize: '0.9rem', color: '#849495', fontWeight: 600 }}>Active</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: p1CriticalTokens > 0 ? '#F87171' : '#34D399', fontWeight: 800 }}>
              {p1CriticalTokens} P1 Critical (STAT)
            </span>
            <span style={{ color: '#849495' }}>Avg wait: 11m</span>
          </div>
        </div>

        {/* Clinicians on Active Duty */}
        <div 
          className="stat-card"
          onClick={() => onNavigatePortal('doctor')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>
              Doctor Consultations
            </span>
            <div className="btn-icon" style={{ width: '32px', height: '32px' }}>
              <Stethoscope size={16} color="#34D399" />
            </div>
          </div>
          <div className="font-data-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#E0FDFF', margin: '8px 0 4px' }}>
            {activeConsults} <span style={{ fontSize: '0.9rem', color: '#849495', fontWeight: 600 }}>In Chamber</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: '#849495' }}>{onDutyDocs} Specialists On Duty</span>
            <span style={{ color: '#34D399', fontWeight: 800 }}>100% Covered</span>
          </div>
        </div>

        {/* Pharmacy & Stockout Guard */}
        <div 
          className="stat-card"
          onClick={() => onNavigatePortal('medical')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>
              Pharmacy Stock Watch
            </span>
            <div className="btn-icon" style={{ width: '32px', height: '32px' }}>
              <Pill size={16} color="#FBBF24" />
            </div>
          </div>
          <div className="font-data-mono" style={{ fontSize: '2rem', fontWeight: 800, color: lowStockCount > 0 ? '#FBBF24' : '#E0FDFF', margin: '8px 0 4px' }}>
            {lowStockCount} <span style={{ fontSize: '0.9rem', color: '#849495', fontWeight: 600 }}>Warnings</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: lowStockCount > 0 ? '#FBBF24' : '#34D399', fontWeight: 700 }}>
              {lowStockCount > 0 ? 'Auto PO Queued' : 'All Stock Optimal'}
            </span>
            <span style={{ color: '#849495' }}>{pharmacyItems.length} SKUs</span>
          </div>
        </div>

        {/* STAT Diagnostic Turnaround */}
        <div 
          className="stat-card"
          onClick={() => onNavigatePortal('labs')}
          style={{ cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>
              Diagnostic Lab Orders
            </span>
            <div className="btn-icon" style={{ width: '32px', height: '32px' }}>
              <FlaskConical size={16} color="#F87171" />
            </div>
          </div>
          <div className="font-data-mono" style={{ fontSize: '2rem', fontWeight: 800, color: '#E0FDFF', margin: '8px 0 4px' }}>
            {labOrders.length} <span style={{ fontSize: '0.9rem', color: '#849495', fontWeight: 600 }}>Total</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
            <span style={{ color: statLabCount > 0 ? '#F87171' : '#34D399', fontWeight: 800 }}>
              {statLabCount} STAT Emergency
            </span>
            <span style={{ color: '#849495' }}>TAT: 22m</span>
          </div>
        </div>
      </div>

      {/* Center 2-Column Split: AI Copilot Incidents & Ward Heatmap */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '24px' }}>
        
        {/* Left: AI Operational Alerts & Recommended Actions */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(0, 242, 254, 0.15)',
                color: '#00F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(0, 242, 254, 0.3)'
              }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                  AI Operations Copilot — Live Incidents & Interventions
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#849495', marginTop: '2px' }}>
                  Real-time algorithmic dispatching & hospital resource telemetry
                </div>
              </div>
            </div>
            <span className="badge badge-cyan">{alerts.length} Active Feeds</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {alerts.length === 0 ? (
              <div style={{ padding: '36px', textAlign: 'center', color: '#849495', fontSize: '0.9rem' }}>
                <CheckCircle2 size={32} color="#10B981" style={{ margin: '0 auto 10px' }} />
                All hospital systems operating at peak efficiency. No active alerts.
              </div>
            ) : (
              alerts.map((al) => {
                const isCrit = al.severity === 'Critical';
                const isWarn = al.severity === 'Warning';
                return (
                  <div
                    key={al.id}
                    style={{
                      background: isCrit ? 'rgba(239, 68, 68, 0.1)' : isWarn ? 'rgba(245, 158, 11, 0.1)' : 'rgba(0, 242, 254, 0.08)',
                      border: `1px solid ${isCrit ? 'rgba(239, 68, 68, 0.35)' : isWarn ? 'rgba(245, 158, 11, 0.35)' : 'rgba(0, 242, 254, 0.25)'}`,
                      borderRadius: '12px',
                      padding: '16px 18px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={`badge badge-${isCrit ? 'rose' : isWarn ? 'amber' : 'cyan'}`}>
                          {al.severity}
                        </span>
                        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: '#E0FDFF' }}>
                          {al.title}
                        </span>
                      </div>
                      <span className="font-data-mono" style={{ fontSize: '0.75rem', color: '#849495' }}>
                        {al.timestamp}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#B9CACB', lineHeight: 1.5, margin: 0 }}>
                      {al.message}
                    </p>

                    <div style={{
                      background: 'rgba(16, 19, 27, 0.75)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                      marginTop: '2px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: isCrit ? '#F87171' : '#00F2FE', fontWeight: 600 }}>
                        <Zap size={15} />
                        <span><strong>Recommendation:</strong> {al.actionableRecommendation}</span>
                      </div>
                      <button
                        className="btn-secondary"
                        style={{ padding: '4px 12px', fontSize: '0.75rem', height: '28px', flexShrink: 0 }}
                        onClick={() => onDismissAlert(al.id)}
                      >
                        Acknowledge
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Ward Occupancy Heatmap & Module Launchpad */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Ward Utilization */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#34D399',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <BedDouble size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                    Ward Occupancy Matrix
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#849495', marginTop: '2px' }}>
                    Real-time bed distribution by specialty wing
                  </div>
                </div>
              </div>
              <button 
                className="btn-secondary" 
                style={{ padding: '5px 12px', fontSize: '0.78rem' }}
                onClick={() => onNavigatePortal('reception')}
              >
                Manage Beds
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {Object.entries(wardBreakdown).map(([wardName, data]) => {
                const pct = data.total > 0 ? Math.round((data.occupied / data.total) * 100) : 0;
                const isHigh = pct >= 80;
                return (
                  <div key={wardName}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#E0E2ED' }}>{wardName.replace('_', ' ')}</span>
                      <span className="font-data-mono" style={{ color: isHigh ? '#F87171' : '#00F2FE', fontWeight: 800 }}>
                        {data.occupied} / {data.total} ({pct}%)
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '999px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: isHigh ? 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' : 'linear-gradient(90deg, #00F2FE 0%, #3196E6 100%)',
                        boxShadow: isHigh ? '0 0 10px rgba(239, 68, 68, 0.5)' : '0 0 10px rgba(0, 242, 254, 0.5)',
                        borderRadius: '999px',
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Department Portals Launcher */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#E0FDFF', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={16} color="#00F2FE" /> Quick Module Launchpad
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button 
                className="btn-secondary" 
                style={{ justifyContent: 'flex-start', padding: '12px 14px', fontSize: '0.85rem' }}
                onClick={() => onNavigatePortal('doctor')}
              >
                <Stethoscope size={17} color="#34D399" />
                Doctor Cockpit
              </button>
              <button 
                className="btn-secondary" 
                style={{ justifyContent: 'flex-start', padding: '12px 14px', fontSize: '0.85rem' }}
                onClick={() => onNavigatePortal('medical')}
              >
                <Pill size={17} color="#FBBF24" />
                Pharmacy POS
              </button>
              <button 
                className="btn-secondary" 
                style={{ justifyContent: 'flex-start', padding: '12px 14px', fontSize: '0.85rem' }}
                onClick={() => onNavigatePortal('labs')}
              >
                <FlaskConical size={17} color="#F87171" />
                Lab Diagnostics
              </button>
              <button 
                className="btn-secondary" 
                style={{ justifyContent: 'flex-start', padding: '12px 14px', fontSize: '0.85rem' }}
                onClick={() => onNavigatePortal('automation')}
              >
                <Bot size={17} color="#C084FC" />
                AI Automation
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
