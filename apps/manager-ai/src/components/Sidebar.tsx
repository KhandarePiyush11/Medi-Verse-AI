import React from 'react';
import { 
  LayoutDashboard, 
  Stethoscope, 
  Pill, 
  FlaskConical, 
  Users, 
  Building2, 
  Zap, 
  BedDouble, 
  ShieldAlert,
  ChevronRight,
  TrendingUp,
  Cpu,
  Radio,
  Bot
} from 'lucide-react';
import { PortalType } from '../types';

interface SidebarProps {
  activePortal: PortalType;
  onSelectPortal: (portal: PortalType) => void;
  counts: {
    opdWaiting: number;
    labStat: number;
    lowStock: number;
    bedsOccupied: number;
    totalBeds: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePortal,
  onSelectPortal,
  counts
}) => {
  const navItems: {
    id: PortalType;
    label: string;
    description: string;
    icon: React.ElementType;
    badge?: string;
    badgeClass?: string;
    iconClass: string;
  }[] = [
    {
      id: 'operations',
      label: 'AI Operations',
      description: 'KPIs & Copilot',
      icon: LayoutDashboard,
      badge: 'LIVE',
      badgeClass: 'badge-cyan',
      iconClass: 'icon-badge-home'
    },
    {
      id: 'doctor',
      label: 'Doctor Cockpit',
      description: 'Consults & E-Rx',
      icon: Stethoscope,
      badge: '5 ON-DUTY',
      badgeClass: 'badge-emerald',
      iconClass: 'icon-badge-doctor'
    },
    {
      id: 'medical',
      label: 'Pharmacy POS',
      description: 'Dispensary & Stock',
      icon: Pill,
      badge: counts.lowStock > 0 ? `${counts.lowStock} LOW` : undefined,
      badgeClass: 'badge-amber',
      iconClass: 'icon-badge-pharmacy'
    },
    {
      id: 'labs',
      label: 'Labs & LIS',
      description: 'Pathology Pipeline',
      icon: FlaskConical,
      badge: counts.labStat > 0 ? `${counts.labStat} STAT` : undefined,
      badgeClass: 'badge-rose',
      iconClass: 'icon-badge-radar'
    },
    {
      id: 'opd',
      label: 'OPD & Triage',
      description: 'Tokens & Vitals',
      icon: Users,
      badge: counts.opdWaiting > 0 ? `${counts.opdWaiting} QUEUE` : undefined,
      badgeClass: 'badge-indigo',
      iconClass: 'icon-badge-map'
    },
    {
      id: 'reception',
      label: 'Reception & Beds',
      description: 'Matrix & Billing',
      icon: Building2,
      badge: `${counts.totalBeds - counts.bedsOccupied} FREE`,
      badgeClass: 'badge-cyan',
      iconClass: 'icon-badge-cure'
    },
    {
      id: 'automation',
      label: 'Hospital AI (n8n)',
      description: 'Voice & WhatsApp',
      icon: Bot,
      badge: '5 FLOWS',
      badgeClass: 'badge-indigo',
      iconClass: 'icon-badge-ai'
    }
  ];

  const occupancyPercent = counts.totalBeds > 0 ? Math.round((counts.bedsOccupied / counts.totalBeds) * 100) : 0;

  return (
    <aside style={{
      width: '260px',
      background: 'rgba(16, 19, 27, 0.85)',
      backdropFilter: 'blur(24px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px 14px',
      flexShrink: 0
    }}>
      {/* Brand Header */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 6px 18px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.4)',
            color: '#080C14',
            flexShrink: 0
          }}>
            <Cpu size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{
              fontSize: '1.05rem',
              fontWeight: 900,
              letterSpacing: '-0.02em',
              color: '#F8FAFC'
            }}>
              MANAGER<span style={{ color: '#00F2FE' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.62rem', color: '#64748B', fontWeight: 800, letterSpacing: '0.1em', fontFamily: 'var(--font-mono)' }}>
              SOVEREIGN OS v4.2
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#64748B',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '4px 10px 6px',
            fontFamily: 'var(--font-mono)'
          }}>
            Hospital Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePortal === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectPortal(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '10px',
                  background: isActive ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                  border: isActive ? '1px solid rgba(0, 242, 254, 0.4)' : '1px solid rgba(255, 255, 255, 0.04)',
                  boxShadow: isActive ? '0 0 16px rgba(0, 242, 254, 0.15)' : 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div 
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: isActive ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      color: isActive ? '#00F2FE' : '#94A3B8',
                      border: isActive ? '1px solid rgba(0, 242, 254, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '0.82rem',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? '#FFFFFF' : '#E2E8F0'
                    }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748B' }}>
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span className={`badge ${item.badgeClass || 'badge-cyan'}`} style={{ fontSize: '0.58rem', padding: '2px 6px' }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Hospital Occupancy Mini Widget */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '14px',
        marginTop: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Live Bed Matrix
          </span>
          <span style={{ 
            fontSize: '0.82rem', 
            fontWeight: 900, 
            fontFamily: 'var(--font-mono)',
            color: occupancyPercent > 80 ? '#F43F5E' : '#00F2FE' 
          }}>
            {occupancyPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            width: `${occupancyPercent}%`,
            height: '100%',
            background: occupancyPercent > 80 
              ? 'linear-gradient(90deg, #F59E0B 0%, #F43F5E 100%)' 
              : 'linear-gradient(90deg, #00F2FE 0%, #10B981 100%)',
            borderRadius: '999px',
            boxShadow: '0 0 10px rgba(0, 242, 254, 0.4)',
            transition: 'width 0.4s ease'
          }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
          <span>{counts.bedsOccupied} OCCUPIED</span>
          <span>{counts.totalBeds - counts.bedsOccupied} FREE</span>
        </div>
      </div>
    </aside>
  );
};
