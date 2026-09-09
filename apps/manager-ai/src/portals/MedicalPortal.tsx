import React, { useState } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  ShoppingCart, 
  Package, 
  ArrowDownRight, 
  FileText,
  DollarSign,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { PharmacyItem, Prescription } from '../types';

interface MedicalPortalProps {
  pharmacyItems: PharmacyItem[];
  prescriptions: Prescription[];
  onDispensePrescription: (prescriptionId: string) => void;
  onAddNewMedicine: (item: PharmacyItem) => void;
  onRestockMedicine: (itemId: string, addQty: number) => void;
}

export const MedicalPortal: React.FC<MedicalPortalProps> = ({
  pharmacyItems,
  prescriptions,
  onDispensePrescription,
  onAddNewMedicine,
  onRestockMedicine
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedRxId, setSelectedRxId] = useState<string>(prescriptions[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item form state
  const [newName, setNewName] = useState('');
  const [newGeneric, setNewGeneric] = useState('');
  const [newCategory, setNewCategory] = useState<any>('Antibiotic');
  const [newStock, setNewStock] = useState(100);
  const [newPrice, setNewPrice] = useState(25);
  const [newThreshold, setNewThreshold] = useState(30);

  const filteredItems = pharmacyItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.batchNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const activeRx = prescriptions.find((r) => r.id === selectedRxId) || prescriptions[0];

  const handleDispense = (rxId: string) => {
    onDispensePrescription(rxId);
    setToastMessage(`Prescription successfully dispensed! Stock inventory deducted.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleAddMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newItem: PharmacyItem = {
      id: `MED-${Date.now().toString().slice(-4)}`,
      name: newName,
      genericName: newGeneric || newName,
      category: newCategory,
      batchNo: `BAT-${Math.floor(1000 + Math.random() * 9000)}`,
      stockQty: Number(newStock),
      unit: 'Units',
      minThreshold: Number(newThreshold),
      expiryDate: '2028-12-31',
      pricePerUnit: Number(newPrice),
      manufacturer: 'Apex Pharma Ltd',
      locationRack: 'Rack E-01',
      status: Number(newStock) <= Number(newThreshold) ? 'Low_Stock' : 'In_Stock'
    };

    onAddNewMedicine(newItem);
    setShowAddModal(false);
    setToastMessage(`New medicine "${newItem.name}" registered to central pharmacy.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const totalStockUnits = pharmacyItems.reduce((acc, curr) => acc + curr.stockQty, 0);
  const lowStockItems = pharmacyItems.filter((i) => i.status === 'Low_Stock' || i.status === 'Critical_Shortage');

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

      {/* Top Stat Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '18px'
      }}>
        <div className="stat-card">
          <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>Total Medicines in Stock</span>
          <div className="font-data-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#E0FDFF', margin: '6px 0 2px' }}>
            {totalStockUnits.toLocaleString()} <span style={{ fontSize: '0.9rem', color: '#849495' }}>Units</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#00F2FE', fontWeight: 700 }}>Across {pharmacyItems.length} Active SKUs</span>
        </div>

        <div className="stat-card">
          <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>Low Stock Warnings</span>
          <div className="font-data-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FBBF24', margin: '6px 0 2px' }}>
            {lowStockItems.length} SKUs
          </div>
          <span style={{ fontSize: '0.75rem', color: '#849495' }}>Below threshold (Reorder Auto-PO)</span>
        </div>

        <div className="stat-card">
          <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700 }}>Pending Rx Queue</span>
          <div className="font-data-mono" style={{ fontSize: '1.8rem', fontWeight: 800, color: '#34D399', margin: '6px 0 2px' }}>
            {prescriptions.filter((p) => p.dispensedStatus === 'Pending').length} Prescriptions
          </div>
          <span style={{ fontSize: '0.75rem', color: '#849495' }}>Real-time doctor EMR sync</span>
        </div>

        <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.82rem', color: '#B9CACB', fontWeight: 700, marginBottom: '8px' }}>Pharmacy Action</span>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowAddModal(true)}>
            <Plus size={16} /> Add New SKU Batch
          </button>
        </div>
      </div>

      {/* 2-Column Split: Pharmacy Dispensary Station & Live Inventory Table */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Live Pharmacy Stock Table */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                <Package size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                  Pharmacy Inventory Master ({filteredItems.length})
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#849495', marginTop: '2px' }}>
                  Central formulary with batch and rack telemetry
                </div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {['ALL', 'Antibiotic', 'Cardiovascular', 'Emergency_Injectable', 'Respiratory'].map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
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
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat.replace('_', ' ')}
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
              placeholder="Search by brand name, generic name, or batch..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="data-table-wrapper" style={{ maxHeight: '460px', overflowY: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Drug Formulation</th>
                  <th>Batch / Rack</th>
                  <th>Stock Qty</th>
                  <th>Price/Unit</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const isLow = item.status === 'Low_Stock' || item.status === 'Critical_Shortage';
                  return (
                    <tr key={item.id}>
                      <td>
                        <div style={{ fontWeight: 800, color: '#E0FDFF' }}>{item.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#849495' }}>{item.genericName}</div>
                      </td>
                      <td>
                        <div className="font-data-mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: '#00F2FE' }}>{item.batchNo}</div>
                        <div style={{ fontSize: '0.75rem', color: '#B9CACB' }}>{item.locationRack}</div>
                      </td>
                      <td>
                        <div className="font-data-mono" style={{ fontWeight: 800, color: isLow ? '#FBBF24' : '#E0FDFF' }}>
                          {item.stockQty} {item.unit}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#849495' }}>Min: {item.minThreshold}</div>
                      </td>
                      <td>
                        <div className="font-data-mono" style={{ fontWeight: 800, color: '#34D399' }}>
                          ₹{item.pricePerUnit.toFixed(2)}
                        </div>
                      </td>
                      <td>
                        <span className={`badge badge-${item.status === 'In_Stock' ? 'emerald' : item.status === 'Low_Stock' ? 'amber' : 'rose'}`} style={{ fontSize: '0.68rem' }}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-secondary"
                          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          onClick={() => onRestockMedicine(item.id, 50)}
                          title="Quick restock +50 units"
                        >
                          +50 Units
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: E-Prescription Dispensing Desk */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingCart size={20} color="#34D399" />
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                Prescription Dispensing Desk
              </h3>
            </div>
            <span className="badge badge-indigo">{prescriptions.length} Active Rx</span>
          </div>

          {/* Prescription Selector Tabs */}
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
            {prescriptions.map((rx) => {
              const isSelected = rx.id === selectedRxId;
              const isDispensed = rx.dispensedStatus === 'Dispensed';
              return (
                <button
                  key={rx.id}
                  onClick={() => setSelectedRxId(rx.id)}
                  style={{
                    background: isSelected ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1.5px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: isSelected ? '0 0 20px rgba(0, 242, 254, 0.2)' : 'none',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    minWidth: '160px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="font-data-mono" style={{ fontSize: '0.75rem', color: isSelected ? '#00F2FE' : '#849495', fontWeight: 800 }}>
                      {rx.prescriptionNumber}
                    </span>
                    <span className={`badge badge-${isDispensed ? 'emerald' : 'amber'}`} style={{ fontSize: '0.62rem', padding: '1px 6px' }}>
                      {rx.dispensedStatus}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#E0FDFF', marginTop: '4px' }}>
                    {rx.patientName}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Prescription Details */}
          {activeRx ? (
            <div style={{
              background: 'rgba(16, 19, 27, 0.85)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              borderRadius: '14px',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#E0FDFF' }}>
                    {activeRx.patientName}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#B9CACB', marginTop: '2px' }}>
                    Doctor: {activeRx.doctorName} • {activeRx.date}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#00F2FE', fontWeight: 700, marginTop: '3px' }}>
                    Diagnosis: {activeRx.diagnosis}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.72rem', color: '#849495' }}>Bill Amount</div>
                  <div className="font-data-mono" style={{ fontSize: '1.35rem', fontWeight: 900, color: '#34D399' }}>
                    ₹{activeRx.totalAmount.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#849495', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Prescribed Formulations
                </div>
                {activeRx.items.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(28, 32, 39, 0.7)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#E0FDFF' }}>
                        {it.medicineName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#B9CACB' }}>
                        Dosage: {it.dosage} • Freq: {it.frequency} • {it.instructions}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span className="font-data-mono" style={{ fontSize: '0.88rem', fontWeight: 800, color: '#34D399' }}>
                        ₹{it.cost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dispense Trigger */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#34D399', fontWeight: 600 }}>
                  <ShieldCheck size={16} />
                  <span>Drug interaction verification: Safe</span>
                </div>

                <button
                  className="btn-emerald"
                  disabled={activeRx.dispensedStatus === 'Dispensed'}
                  onClick={() => handleDispense(activeRx.id)}
                  style={{ opacity: activeRx.dispensedStatus === 'Dispensed' ? 0.6 : 1 }}
                >
                  <CheckCircle size={16} />
                  {activeRx.dispensedStatus === 'Dispensed' ? 'Already Dispensed' : 'Dispense & Deduct Stock'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '32px', textAlign: 'center', color: '#849495' }}>
              No prescription selected.
            </div>
          )}

        </div>

      </div>

      {/* Add Medicine Batch Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div style={{ padding: '18px 26px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#E0FDFF', margin: 0 }}>
                Add New Pharmaceutical SKU Batch
              </h3>
              <button className="btn-icon" onClick={() => setShowAddModal(false)}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddMedicineSubmit} style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Medicine Brand Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="e.g. Paracetamol 650mg (Dolo)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Generic Chemical Formulation</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Acetaminophen IP 650mg"
                  value={newGeneric}
                  onChange={(e) => setNewGeneric(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Therapeutic Category</label>
                  <select
                    className="form-select"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="Antibiotic">Antibiotic</option>
                    <option value="Cardiovascular">Cardiovascular</option>
                    <option value="Analgesic">Analgesic</option>
                    <option value="Respiratory">Respiratory</option>
                    <option value="Emergency_Injectable">Emergency Injectable</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Initial Stock Units</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Price Per Unit (₹)</label>
                  <input
                    type="number"
                    className="form-input font-data-mono"
                    value={newPrice}
                    onChange={(e) => setNewPrice(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#B9CACB', marginBottom: '6px' }}>Reorder Threshold</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Register SKU to Inventory</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
