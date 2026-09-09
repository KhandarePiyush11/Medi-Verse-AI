import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Bell, 
  Search, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  AlertTriangle,
  Radio,
  Building2,
  Stethoscope,
  Pill,
  FlaskConical,
  Users,
  LayoutDashboard,
  User,
  Cpu,
  Zap,
  CheckCircle2,
  Bot,
  ExternalLink,
  ChevronDown,
  Home,
  HeartPulse
} from 'lucide-react';
import { PortalType } from '../types';

interface HeaderProps {
  activePortal: PortalType;
  onSelectPortal: (portal: PortalType) => void;
  onOpenAiAssistant: () => void;
  emergencyAlertCount: number;
  onQuickSearch: (query: string) => void;
  counts: {
    opdWaiting: number;
    labStat: number;
    lowStock: number;
    bedsOccupied: number;
    totalBeds: number;
  };
}

export const Header: React.FC<HeaderProps> = ({
  activePortal,
  onSelectPortal,
  onOpenAiAssistant,
  emergencyAlertCount,
  onQuickSearch,
  counts
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [searchVal, setSearchVal] = useState('');
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        }) + ' • ' + now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    onQuickSearch(e.target.value);
  };

  const navTabs: {
    id: PortalType;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[] = [
    { id: 'operations', label: 'AI Operations', icon: LayoutDashboard },
    { id: 'doctor', label: 'Doctor Cockpit', icon: Stethoscope },
    { id: 'medical', label: 'Pharmacy POS', icon: Pill, badge: counts.lowStock > 0 ? `${counts.lowStock} Low` : undefined, badgeColor: '#F59E0B' },
    { id: 'labs', label: 'Labs & LIS', icon: FlaskConical, badge: counts.labStat > 0 ? `${counts.labStat} STAT` : undefined, badgeColor: '#EF4444' },
    { id: 'opd', label: 'OPD & Triage', icon: Users, badge: counts.opdWaiting > 0 ? `${counts.opdWaiting}` : undefined, badgeColor: '#00F2FE' },
    { id: 'reception', label: 'Reception & Beds', icon: Building2, badge: `${counts.totalBeds - counts.bedsOccupied} Free`, badgeColor: '#10B981' },
    { id: 'automation', label: 'Hospital AI (n8n)', icon: Bot }
  ];

  return (
    <header className="header-glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      minHeight: '74px',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      width: '100%',
      boxSizing: 'border-box'
    }}>
      {/* Left: Brand Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
        <div 
          className="brand-icon-glow" 
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#00373A'
          }}
        >
          <Cpu size={24} strokeWidth={2.5} />
        </div>

        <div>
          <div style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', color: '#E0FDFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
            NEUROSYNAPSE <span style={{ color: '#00F2FE' }}>MANAGER OS</span>
            <span style={{ fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.15)', color: '#00F2FE', border: '1px solid rgba(0, 242, 254, 0.3)' }}>
              v8.0 BIO-TECH
            </span>
          </div>
          <div style={{ fontSize: '10px', color: '#849495', fontFamily: 'JetBrains Mono, monospace', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>ENTERPRISE HOSPITAL OPERATIONS OS</span>
            <span style={{ color: '#475569' }}>•</span>
            <span style={{ color: '#10B981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 6px #10B981' }}></span>
              ABDM M1-M3 COMPLIANT
            </span>
          </div>
        </div>
      </div>

      {/* Center: Scrollable Horizontal Navigation Bar */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, margin: '0 12px' }}>
        <nav 
          onWheel={(e) => {
            if (e.deltaY !== 0) {
              e.currentTarget.scrollLeft += e.deltaY;
            }
          }}
          className="scrollable-nav-bar"
          style={{ maxWidth: '100%' }}
        >
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePortal === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectPortal(tab.id)}
                className="nav-tab-btn"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '6px 13px',
                  borderRadius: '10px',
                  background: isActive ? 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)' : 'transparent',
                  color: isActive ? '#00373A' : '#B9CACB',
                  border: isActive ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid transparent',
                  boxShadow: isActive ? '0 0 20px rgba(0, 242, 254, 0.4)' : 'none',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease'
                }}
              >
                <div 
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '6px',
                    background: isActive ? 'rgba(0, 55, 58, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#00373A' : '#00F2FE',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={13} />
                </div>
                <span>{tab.label}</span>
                {tab.badge && (
                  <span 
                    style={{
                      fontSize: '9.5px',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '8px',
                      background: isActive ? 'rgba(0, 55, 58, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                      color: isActive ? '#00373A' : tab.badgeColor || '#00F2FE',
                      border: isActive ? '1px solid rgba(0, 55, 58, 0.3)' : `1px solid ${tab.badgeColor || '#00F2FE'}40`
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        {/* Search Input */}
        <div style={{ position: 'relative', width: '180px' }}>
          <Search size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#00F2FE' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '28px', height: '34px', fontSize: '11px', borderRadius: '8px' }}
            placeholder="Search bed, doc, rx..."
            value={searchVal}
            onChange={handleSearchChange}
          />
        </div>

        {/* Live Clock in JetBrains Mono */}
        <div className="font-data-mono" style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#B9CACB',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '6px 10px',
          borderRadius: '8px',
          border: '1px solid rgba(0, 242, 254, 0.15)',
          whiteSpace: 'nowrap'
        }}>
          {currentTime || 'Syncing...'}
        </div>

        {/* Emergency Alert Bell Indicator with Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-icon" 
            title="Active Operational & Emergency Alerts" 
            style={{ width: '34px', height: '34px', position: 'relative' }}
            onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
          >
            <Bell size={16} color="#00F2FE" />
            {emergencyAlertCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: '#EF4444',
                color: '#FFF',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                fontSize: '9px',
                fontWeight: 900,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 8px #EF4444'
              }}>
                {emergencyAlertCount}
              </span>
            )}
          </button>

          {showAlertsDropdown && (
            <div style={{
              position: 'absolute',
              top: '44px',
              right: '0',
              width: '300px',
              background: 'rgba(16, 19, 27, 0.98)',
              backdropFilter: 'blur(20px)',
              border: '1.5px solid rgba(0, 242, 254, 0.3)',
              borderRadius: 'var(--radius-md)',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.8), 0 0 25px rgba(0, 242, 254, 0.15)',
              padding: '14px',
              zIndex: 200
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#E0FDFF' }}>Live Operational Telemetry</span>
                <span className="badge badge-rose" style={{ fontSize: '9px' }}>{emergencyAlertCount} Critical</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.12)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                  <div style={{ fontWeight: 800, color: '#F87171' }}>ICU Bed Surge Alert</div>
                  <div style={{ color: '#B9CACB', marginTop: '2px' }}>Only 2 critical vacancies remaining across North Wing.</div>
                </div>
                <div style={{ background: 'rgba(245, 158, 11, 0.12)', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
                  <div style={{ fontWeight: 800, color: '#FBBF24' }}>Noradrenaline Low Stock</div>
                  <div style={{ color: '#B9CACB', marginTop: '2px' }}>18 ampoules left. Auto-replenishment PO dispatched.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Co-Pilot Button */}
        <button
          onClick={onOpenAiAssistant}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(0, 242, 254, 0.25) 100%)',
            color: '#E0FDFF',
            border: '1px solid rgba(0, 242, 254, 0.35)',
            fontWeight: 800,
            fontSize: '12px',
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <Sparkles size={14} color="#00F2FE" />
          <span>AI Co-Pilot</span>
        </button>

        {/* External Portal Links */}
        <a 
          href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port ? 'http://localhost:5173' : '/hospital/'}
          target="_blank"
          rel="noreferrer"
          style={{ 
            padding: '7px 12px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)', 
            color: '#00373A', 
            fontWeight: 800, 
            fontSize: '11.5px', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 16px rgba(0, 242, 254, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            whiteSpace: 'nowrap'
          }}
          title="Switch to Clinical Workstation (Light Edition)"
        >
          <Stethoscope size={13} /> Clinical Workstation
        </a>

        <a 
          href={typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port ? 'http://localhost:5176' : '/'}
          target="_blank"
          rel="noreferrer"
          style={{ 
            padding: '7px 12px', 
            borderRadius: '10px', 
            background: 'rgba(255, 255, 255, 0.08)', 
            color: '#B9CACB', 
            fontWeight: 700, 
            fontSize: '11.5px', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            whiteSpace: 'nowrap'
          }}
          title="Back to MediVerse Precision Health OS Main Home"
        >
          <Home size={13} color="#00F2FE" /> Home
        </a>
      </div>
    </header>
  );
};
