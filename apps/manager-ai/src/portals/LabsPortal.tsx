import React, { useState } from 'react';
import { 
  FlaskConical, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  QrCode, 
  FileText, 
  Clock, 
  Layers, 
  Check, 
  Printer,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { LabTestOrder } from '../types';

interface LabsPortalProps {
  labOrders: LabTestOrder[];
  onUpdateOrderStatus: (orderId: string, status: LabTestOrder['status'], results?: any[]) => void;
}

export const LabsPortal: React.FC<LabsPortalProps> = ({
  labOrders,
  onUpdateOrderStatus
}) => {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(labOrders[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Result entry state
  const [param1Val, setParam1Val] = useState('0.092');
  const [param2Val, setParam2Val] = useState('245');

  const filteredOrders = labOrders.filter((ord) => {
    const matchesSearch = ord.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ord.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ord.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ord.barcode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || ord.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeOrder = labOrders.find((o) => o.id === selectedOrderId) || labOrders[0];

  const handleAdvanceStatus = (newStatus: LabTestOrder['status']) => {
    if (!activeOrder) return;

    let updatedResults = activeOrder.results;
    if (newStatus === 'Results_Ready' || newStatus === 'Verified_Approved') {
      updatedResults = [
        { parameter: 'Quantitative Assay 1', value: param1Val, unit: 'ng/mL', normalRange: '< 0.014', flag: Number(param1Val) > 0.05 ? 'Critical' : 'Normal' },
        { parameter: 'Lipid/Biomarker Marker 2', value: param2Val, unit: 'mg/dL', normalRange: '< 200', flag: Number(param2Val) > 200 ? 'High' : 'Normal' }
      ];
    }

    onUpdateOrderStatus(activeOrder.id, newStatus, updatedResults);
    setToastMessage(`Order #${activeOrder.orderNumber} status updated to "${newStatus.replace('_', ' ')}"!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="portal-body" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
          color: '#FFFFFF',
          padding: '14px 24px',
          borderRadius: '12px',
          boxShadow: '0 0 30px rgba(16, 185, 129, 0.4), var(--shadow-xl)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 9999,
          fontWeight: 800,
          fontSize: '0.9rem',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <CheckCircle2 size={20} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top STAT Indicator & Pipeline Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px'
      }}>
        <div className="stat-card">
          <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>Emergency STAT Orders</span>
          <div className="font-data-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#F87171', margin: '6px 0 2px' }}>
            {labOrders.filter((o) => o.priority === 'STAT_Emergency').length} STAT
          </div>
          <span style={{ fontSize: '0.75rem', color: '#849495' }}>Priority LIS Routing Active</span>
        </div>

        <div className="stat-card">
          <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>Samples In Analysis</span>
          <div className="font-data-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FBBF24', margin: '6px 0 2px' }}>
            {labOrders.filter((o) => o.status === 'In_Analysis').length} Batches
          </div>
          <span style={{ fontSize: '0.75rem', color: '#849495' }}>Automated Analyzer Linked</span>
        </div>

        <div className="stat-card">
          <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>Verified & Pushed to EHR</span>
          <div className="font-data-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399', margin: '6px 0 2px' }}>
            {labOrders.filter((o) => o.status === 'Verified_Approved').length} Completed
          </div>
          <span style={{ fontSize: '0.75rem', color: '#849495' }}>Doctor EHR Notified</span>
        </div>

        <div className="stat-card">
          <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>Average Turnaround (TAT)</span>
          <div className="font-data-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#00F2FE', margin: '6px 0 2px' }}>
            22.4 Mins
          </div>
          <span style={{ fontSize: '0.75rem', color: '#34D399', fontWeight: 700 }}>8 mins ahead of SLA</span>
        </div>
      </div>

      {/* 2-Column Split: Orders Worklist & Lab Workbench */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        
        {/* Left: Orders Queue */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#F87171',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}>
                <FlaskConical size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                  Diagnostic & Pathology Worklist ({filteredOrders.length})
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#849495', marginTop: '2px' }}>
                  Laboratory Information System (LIS) orders & live specimen routing
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {['ALL', 'STAT_Emergency', 'Sample_Pending', 'In_Analysis', 'Verified_Approved'].map((st) => {
                const isActive = statusFilter === st;
                return (
                  <button
                    key={st}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '5px 10px',
                      borderRadius: '8px',
                      background: isActive ? 'linear-gradient(135deg, #00F2FE 0%, #3196E6 100%)' : 'rgba(255, 255, 255, 0.04)',
                      color: isActive ? '#00373A' : '#B9CACB',
                      border: isActive ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease'
                    }}
                    onClick={() => setStatusFilter(st)}
                  >
                    {st.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#00F2FE' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px', height: '40px', fontSize: '0.88rem' }}
              placeholder="Search by patient, order #, test, or barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Orders Table */}
          <div className="data-table-wrapper" style={{ maxHeight: '460px', overflowY: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order # / Barcode</th>
                  <th>Patient & Doctor</th>
                  <th>Investigation Test</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((ord) => {
                  const isSelected = ord.id === selectedOrderId;
                  const isStat = ord.priority === 'STAT_Emergency';
                  return (
                    <tr key={ord.id} style={{ background: isSelected ? 'rgba(0, 242, 254, 0.1)' : undefined }}>
                      <td>
                        <div className="font-data-mono" style={{ fontWeight: 800, color: '#E0FDFF' }}>{ord.orderNumber}</div>
                        <div className="font-data-mono" style={{ fontSize: '0.72rem', color: '#00F2FE', fontWeight: 600 }}>{ord.barcode}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: '#E0FDFF' }}>{ord.patientName}</div>
                        <div style={{ fontSize: '0.75rem', color: '#849495' }}>{ord.doctorName}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: '#E0FDFF', fontSize: '0.85rem' }}>{ord.testName}</div>
                        <div style={{ fontSize: '0.72rem', color: '#B9CACB' }}>{ord.department} • {ord.sampleType}</div>
                      </td>
                      <td>
                        <span className={`badge badge-${isStat ? 'rose' : ord.priority === 'Urgent' ? 'amber' : 'cyan'}`} style={{ fontSize: '0.65rem' }}>
                          {ord.priority.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <span className={`badge badge-${ord.status === 'Verified_Approved' ? 'emerald' : ord.status === 'In_Analysis' ? 'amber' : 'indigo'}`} style={{ fontSize: '0.65rem' }}>
                          {ord.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => setSelectedOrderId(ord.id)}
                        >
                          Open Desk
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Lab Analysis & Report Signer Workbench */}
        {activeOrder ? (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <QrCode size={20} color="#00F2FE" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                  Sample Processing & Verification
                </h3>
              </div>
              <span className="font-data-mono" style={{ fontSize: '0.8rem', color: '#00F2FE', background: 'rgba(0, 242, 254, 0.12)', padding: '3px 10px', borderRadius: '6px', fontWeight: 800, border: '1px solid rgba(0, 242, 254, 0.3)' }}>
                {activeOrder.barcode}
              </span>
            </div>

            {/* Patient & Test Header */}
            <div style={{
              background: 'rgba(16, 19, 27, 0.85)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              borderRadius: '12px',
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#E0FDFF' }}>
                  {activeOrder.patientName}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#B9CACB' }}>
                  Ordered by: {activeOrder.doctorName} • {activeOrder.orderedAt}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#00F2FE', marginTop: '2px' }}>
                  {activeOrder.testName}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className={`badge badge-${activeOrder.status === 'Verified_Approved' ? 'emerald' : 'rose'}`}>
                  {activeOrder.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Pipeline Stage Buttons */}
            <div>
              <div style={{ fontSize: '0.78rem', color: '#849495', marginBottom: '8px', fontWeight: 700 }}>
                Sample Workflow Progress
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <button
                  className="btn-secondary"
                  style={{
                    fontSize: '0.75rem',
                    padding: '8px 4px',
                    justifyContent: 'center',
                    background: activeOrder.status === 'Sample_Pending' ? 'rgba(0, 242, 254, 0.18)' : undefined,
                    borderColor: activeOrder.status === 'Sample_Pending' ? '#00F2FE' : undefined
                  }}
                  onClick={() => handleAdvanceStatus('Sample_Pending')}
                >
                  1. Pending
                </button>
                <button
                  className="btn-secondary"
                  style={{
                    fontSize: '0.75rem',
                    padding: '8px 4px',
                    justifyContent: 'center',
                    background: activeOrder.status === 'Sample_Collected' ? 'rgba(0, 242, 254, 0.18)' : undefined,
                    borderColor: activeOrder.status === 'Sample_Collected' ? '#00F2FE' : undefined
                  }}
                  onClick={() => handleAdvanceStatus('Sample_Collected')}
                >
                  2. Collected
                </button>
                <button
                  className="btn-secondary"
                  style={{
                    fontSize: '0.75rem',
                    padding: '8px 4px',
                    justifyContent: 'center',
                    background: activeOrder.status === 'In_Analysis' ? 'rgba(245, 158, 11, 0.18)' : undefined,
                    borderColor: activeOrder.status === 'In_Analysis' ? '#FBBF24' : undefined
                  }}
                  onClick={() => handleAdvanceStatus('In_Analysis')}
                >
                  3. In Analysis
                </button>
                <button
                  className="btn-emerald"
                  style={{ fontSize: '0.75rem', padding: '8px 4px', justifyContent: 'center' }}
                  onClick={() => handleAdvanceStatus('Verified_Approved')}
                >
                  4. Sign & Push
                </button>
              </div>
            </div>

            {/* Results Parameter Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#E0FDFF' }}>
                Laboratory Results & Panic Range Flagging
              </div>

              {activeOrder.results && activeOrder.results.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {activeOrder.results.map((r, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(16, 19, 27, 0.75)',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderLeft: `4px solid ${r.flag === 'Critical' ? '#EF4444' : r.flag === 'High' ? '#F59E0B' : '#10B981'}`
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#E0FDFF' }}>{r.parameter}</div>
                        <div style={{ fontSize: '0.75rem', color: '#849495' }}>Normal Range: {r.normalRange} {r.unit}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div className="font-data-mono" style={{ fontWeight: 900, fontSize: '1rem', color: r.flag === 'Critical' ? '#F87171' : '#E0FDFF' }}>
                          {r.value} {r.unit}
                        </div>
                        <span className={`badge badge-${r.flag === 'Critical' ? 'rose' : r.flag === 'High' ? 'amber' : 'emerald'}`} style={{ fontSize: '0.65rem' }}>
                          {r.flag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: 'rgba(16, 19, 27, 0.75)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(0, 242, 254, 0.2)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 600 }}>
                    Enter Quantitative Value for Analyzer Calibration:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#849495', marginBottom: '4px', display: 'block' }}>Troponin I / Primary Analyte</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        value={param1Val}
                        onChange={(e) => setParam1Val(e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#849495', marginBottom: '4px', display: 'block' }}>Lipid / Secondary Biomarker</label>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '6px 10px', fontSize: '0.85rem' }}
                        value={param2Val}
                        onChange={(e) => setParam2Val(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>
                <ShieldCheck size={16} />
                <span>NABL & ISO 15189 Certified</span>
              </div>
              <button className="btn-secondary" style={{ fontSize: '0.8rem', padding: '6px 14px' }} onClick={() => setToastMessage('Dispatching barcode label to Zebra direct-thermal printer...')}>
                <Printer size={14} />
                Print Barcode Tag
              </button>
            </div>

          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '56px', textAlign: 'center', color: '#849495' }}>
            No lab order selected.
          </div>
        )}

      </div>

    </div>
  );
};
