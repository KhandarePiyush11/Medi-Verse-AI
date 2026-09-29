import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Pill, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  ShoppingBag, 
  Bell, 
  Sparkles, 
  Trash2, 
  RefreshCw, 
  Check, 
  X,
  Volume2,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { 
  ScheduledMedicine, 
  DEFAULT_SCHEDULED_MEDICINES,
  ExtractedMedicine 
} from './aiHelpData';

interface MedicationReminderViewProps {
  incomingMedicines?: ExtractedMedicine[] | null;
  onNavigateToPharmacy?: () => void;
  onBookFollowUp?: () => void;
}

export const MedicationReminderView: React.FC<MedicationReminderViewProps> = ({
  incomingMedicines,
  onNavigateToPharmacy,
  onBookFollowUp
}) => {
  const [medicines, setMedicines] = useState<ScheduledMedicine[]>(() => {
    try {
      const saved = localStorage.getItem('mediverse_ai_med_reminders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage read error', e);
    }
    return DEFAULT_SCHEDULED_MEDICINES;
  });

  const [activeSlotFilter, setActiveSlotFilter] = useState<'ALL' | 'morning' | 'afternoon' | 'evening' | 'night'>('ALL');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newMedForm, setNewMedForm] = useState<{
    name: string;
    dosage: string;
    slots: { morning: boolean; afternoon: boolean; evening: boolean; night: boolean };
    timingAdvice: string;
    totalPills: number;
    refillThreshold: number;
    doctorFollowUpDate: string;
  }>({
    name: '',
    dosage: '',
    slots: { morning: true, afternoon: false, evening: false, night: false },
    timingAdvice: 'After Meals',
    totalPills: 30,
    refillThreshold: 7,
    doctorFollowUpDate: '2026-10-15'
  });

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('mediverse_ai_med_reminders', JSON.stringify(medicines));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [medicines]);

  // Handle incoming synced medicines from prescription decoder
  useEffect(() => {
    if (incomingMedicines && incomingMedicines.length > 0) {
      setMedicines(prev => {
        const existingNames = new Set(prev.map(m => m.name.toLowerCase()));
        const newItems: ScheduledMedicine[] = [];

        incomingMedicines.forEach(im => {
          if (!existingNames.has(im.name.toLowerCase())) {
            const isTDS = im.frequency.includes('1-1-1') || im.frequency.toLowerCase().includes('three');
            const isBD = im.frequency.includes('1-0-1') || im.frequency.toLowerCase().includes('twice');
            const isNight = im.frequency.includes('0-0-1') || im.timing.toLowerCase().includes('bed');

            newItems.push({
              id: 'med_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
              name: im.name,
              dosage: im.dosage,
              slots: {
                morning: isTDS || isBD || (!isNight),
                afternoon: isTDS,
                evening: isBD || isTDS,
                night: isNight
              },
              timingAdvice: `${im.timing} (${im.duration})`,
              remainingPills: 20,
              totalPills: 30,
              refillThreshold: 6,
              doctorFollowUpDate: '2026-10-10',
              takenToday: { morning: false, afternoon: false, evening: false, night: false },
              history: []
            });
          }
        });

        return newItems.length > 0 ? [...prev, ...newItems] : prev;
      });
    }
  }, [incomingMedicines]);

  // Gentle synthesized Web Audio chime
  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.log('Audio not allowed yet or unsupported');
    }
  };

  const handleTakeDose = (medId: string, slot: 'morning' | 'afternoon' | 'evening' | 'night') => {
    playChime();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toISOString().split('T')[0];

    setMedicines(prev => prev.map(m => {
      if (m.id === medId) {
        const alreadyTaken = m.takenToday[slot];
        const newTaken = !alreadyTaken;
        const newCount = newTaken ? Math.max(0, m.remainingPills - 1) : m.remainingPills + 1;
        const newHistory = newTaken 
          ? [...m.history, { date: todayDate, slot, time: nowTime }]
          : m.history.filter(h => !(h.date === todayDate && h.slot === slot));

        return {
          ...m,
          remainingPills: newCount,
          takenToday: { ...m.takenToday, [slot]: newTaken },
          history: newHistory
        };
      }
      return m;
    }));
  };

  const handleDeleteMed = (medId: string) => {
    setMedicines(prev => prev.filter(m => m.id !== medId));
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all scheduled medications?')) {
      setMedicines([]);
      try {
        localStorage.removeItem('mediverse_ai_med_reminders');
      } catch (e) {
        console.warn('LocalStorage error', e);
      }
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedForm.name.trim()) return;

    const newMed: ScheduledMedicine = {
      id: 'med_' + Date.now(),
      name: newMedForm.name,
      dosage: newMedForm.dosage || '1 Tablet',
      slots: newMedForm.slots,
      timingAdvice: newMedForm.timingAdvice,
      remainingPills: newMedForm.totalPills,
      totalPills: newMedForm.totalPills,
      refillThreshold: newMedForm.refillThreshold,
      doctorFollowUpDate: newMedForm.doctorFollowUpDate,
      takenToday: { morning: false, afternoon: false, evening: false, night: false },
      history: []
    };

    setMedicines(prev => [...prev, newMed]);
    setShowAddModal(false);
    setNewMedForm({
      name: '',
      dosage: '',
      slots: { morning: true, afternoon: false, evening: false, night: false },
      timingAdvice: 'After Meals',
      totalPills: 30,
      refillThreshold: 7,
      doctorFollowUpDate: '2026-10-15'
    });
  };

  // Check overall compliance stats
  const totalDosesToday = medicines.reduce((acc, m) => {
    let slotsCount = 0;
    if (m.slots.morning) slotsCount++;
    if (m.slots.afternoon) slotsCount++;
    if (m.slots.evening) slotsCount++;
    if (m.slots.night) slotsCount++;
    return acc + slotsCount;
  }, 0);

  const completedDosesToday = medicines.reduce((acc, m) => {
    let takenCount = 0;
    if (m.slots.morning && m.takenToday.morning) takenCount++;
    if (m.slots.afternoon && m.takenToday.afternoon) takenCount++;
    if (m.slots.evening && m.takenToday.evening) takenCount++;
    if (m.slots.night && m.takenToday.night) takenCount++;
    return acc + takenCount;
  }, 0);

  const compliancePercentage = totalDosesToday > 0 ? Math.round((completedDosesToday / totalDosesToday) * 100) : 100;
  const lowStockMeds = medicines.filter(m => m.remainingPills <= m.refillThreshold);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER BANNER WITH COMPLIANCE METRICS */}
      <div 
        className="glass-panel"
        style={{ 
          padding: '24px', 
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.06) 0%, rgba(16, 185, 129, 0.04) 100%)',
          border: '1px solid rgba(2, 132, 199, 0.2)',
          borderRadius: '16px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284C7 0%, #00B4D8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <Clock size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  AI Medication Reminder & Refill Sentinel
                </h2>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  Smart daily dosing timeline, pill inventory countdown, and clinical follow-up tracking
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 900, color: compliancePercentage >= 80 ? '#10B981' : '#F59E0B' }}>
                {compliancePercentage}% Compliance
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                {completedDosesToday} of {totalDosesToday} doses logged today
              </div>
            </div>

            {medicines.length > 0 && (
              <button
                onClick={handleClearAll}
                style={{
                  background: '#F1F5F9',
                  color: '#64748B',
                  border: '1px solid #CBD5E1',
                  padding: '9px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Clear Regimen
              </button>
            )}

            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: '#0284C7',
                color: '#FFF',
                border: 'none',
                padding: '9px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 10px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Plus size={15} /> Add Custom Medicine
            </button>
          </div>
        </div>
      </div>

      {/* LOW STOCK ALERT (IF ANY) */}
      {lowStockMeds.length > 0 && (
        <div 
          style={{ 
            padding: '14px 20px', 
            borderRadius: '12px', 
            background: '#FFFBEB', 
            border: '1.5px solid #FDE68A', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertTriangle size={20} color="#D97706" />
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E' }}>
                Low Inventory Warning: {lowStockMeds.map(m => `${m.name} (${m.remainingPills} pills left)`).join(', ')}
              </div>
              <div style={{ fontSize: '11.5px', color: '#B45309', marginTop: '2px' }}>
                Stock below refill threshold. Reorder now to maintain therapy without interruption.
              </div>
            </div>
          </div>

          <button
            onClick={onNavigateToPharmacy}
            style={{
              background: '#D97706',
              color: '#FFF',
              border: 'none',
              padding: '7px 14px',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ShoppingBag size={14} /> Quick Reorder at Pharmacy
          </button>
        </div>
      )}

      {/* TIMELINE SLOTS NAVIGATION */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px', overflowX: 'auto' }}>
        {[
          { key: 'ALL', label: 'All Daily Regimen' },
          { key: 'morning', label: '🌅 Morning (08:00 AM)' },
          { key: 'afternoon', label: '☀️ Afternoon (01:00 PM)' },
          { key: 'evening', label: '🌆 Evening (07:00 PM)' },
          { key: 'night', label: '🌙 Bedtime (10:00 PM)' }
        ].map((slot) => (
          <button
            key={slot.key}
            onClick={() => setActiveSlotFilter(slot.key as any)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: activeSlotFilter === slot.key ? 800 : 600,
              border: 'none',
              background: activeSlotFilter === slot.key ? '#0F172A' : '#F1F5F9',
              color: activeSlotFilter === slot.key ? '#FFFFFF' : '#475569',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {slot.label}
          </button>
        ))}
      </div>

      {/* MEDICINE CARDS LIST OR CLEAN EMPTY STATE */}
      {medicines.length === 0 ? (
        <div 
          className="glass-panel" 
          style={{ 
            padding: '48px 28px', 
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
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(2, 132, 199, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
            <Pill size={32} />
          </div>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
              No Medications Currently Scheduled
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', maxWidth: '440px', lineHeight: '1.6', marginTop: '6px' }}>
              Your daily dosing sentinel is active and ready. Click <strong>Add Custom Medicine</strong> to configure a dose schedule, or use the <strong>AI Prescription Decoder</strong> to automatically sync your regimen.
            </div>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              background: '#0284C7',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 10px rgba(2, 132, 199, 0.3)'
            }}
          >
            <Plus size={16} /> Add First Medicine
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {medicines.map(med => {
          const isLowStock = med.remainingPills <= med.refillThreshold;
          return (
            <div 
              key={med.id}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: '#FFFFFF',
                border: isLowStock ? '1.5px solid #F59E0B' : '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                position: 'relative'
              }}
            >
              {/* CARD TOP ROW */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
                    <Pill size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                      {med.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {med.dosage} • {med.timingAdvice}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteMed(med.id)}
                  title="Remove Medicine"
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* DOSING SLOTS WITH 1-CLICK TAKE BUTTONS */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px' }}>
                {(['morning', 'afternoon', 'evening', 'night'] as const).map(slot => {
                  const isScheduled = med.slots[slot];
                  const isTaken = med.takenToday[slot];
                  const slotLabel = slot === 'morning' ? 'Morn' : slot === 'afternoon' ? 'Aft' : slot === 'evening' ? 'Eve' : 'Night';

                  if (!isScheduled) {
                    return (
                      <div 
                        key={slot} 
                        style={{ 
                          padding: '8px 4px', 
                          borderRadius: '8px', 
                          background: '#F8FAFC', 
                          color: '#CBD5E1', 
                          textAlign: 'center', 
                          fontSize: '11px' 
                        }}
                      >
                        {slotLabel}
                        <div style={{ fontSize: '10px' }}>—</div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={slot}
                      onClick={() => handleTakeDose(med.id, slot)}
                      style={{
                        padding: '8px 4px',
                        borderRadius: '8px',
                        border: isTaken ? '1px solid #10B981' : '1px solid #0284C7',
                        background: isTaken ? 'rgba(16, 185, 129, 0.12)' : 'rgba(2, 132, 199, 0.06)',
                        color: isTaken ? '#059669' : '#0284C7',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <span>{slotLabel}</span>
                      <span style={{ fontSize: '10px' }}>{isTaken ? '✓ Taken' : 'Take'}</span>
                    </button>
                  );
                })}
              </div>

              {/* PILL INVENTORY PROGRESS */}
              <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  <span>Pill Inventory Remaining:</span>
                  <span style={{ color: isLowStock ? '#D97706' : '#0F172A' }}>
                    {med.remainingPills} / {med.totalPills} pills
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      width: `${Math.min(100, Math.round((med.remainingPills / med.totalPills) * 100))}%`,
                      height: '100%',
                      background: isLowStock ? '#F59E0B' : '#10B981',
                      borderRadius: '3px'
                    }}
                  />
                </div>
              </div>

              {/* DOCTOR FOLLOW-UP DATE */}
              {med.doctorFollowUpDate && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} color="#0284C7" /> Follow-up: {med.doctorFollowUpDate}
                  </span>
                  <button
                    onClick={onBookFollowUp}
                    style={{ background: 'transparent', border: 'none', color: '#0284C7', fontWeight: 700, fontSize: '11px', cursor: 'pointer' }}
                  >
                    Confirm OPD →
                  </button>
                </div>
              )}
            </div>
          );
        })}
        </div>
      )}

      {/* ADD CUSTOM MEDICATION MODAL */}
      {showAddModal && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(15, 23, 42, 0.6)', 
            backdropFilter: 'blur(4px)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 999 
          }}
        >
          <div 
            className="glass-panel" 
            style={{ 
              background: '#FFFFFF', 
              borderRadius: '16px', 
              width: '100%', 
              maxWidth: '480px', 
              padding: '24px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="#0284C7" /> Add New Scheduled Medication
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Medicine Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Pantoprazole 40mg"
                  value={newMedForm.name}
                  onChange={(e) => setNewMedForm({ ...newMedForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Dosage:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 40 mg"
                    value={newMedForm.dosage}
                    onChange={(e) => setNewMedForm({ ...newMedForm, dosage: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Timing Instruction:
                  </label>
                  <select
                    value={newMedForm.timingAdvice}
                    onChange={(e) => setNewMedForm({ ...newMedForm, timingAdvice: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', background: '#FFF' }}
                  >
                    <option value="After Meals">After Meals</option>
                    <option value="Before Meals (Empty Stomach)">Before Meals (Empty Stomach)</option>
                    <option value="With Food">With Food</option>
                    <option value="At Bedtime">At Bedtime</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Daily Time Slots:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '8px' }}>
                  {[
                    { key: 'morning', label: 'Morning' },
                    { key: 'afternoon', label: 'Afternoon' },
                    { key: 'evening', label: 'Evening' },
                    { key: 'night', label: 'Night' }
                  ].map(s => (
                    <label key={s.key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={(newMedForm.slots as any)[s.key]}
                        onChange={(e) => setNewMedForm({
                          ...newMedForm,
                          slots: { ...newMedForm.slots, [s.key]: e.target.checked }
                        })}
                        style={{ accentColor: '#0284C7' }}
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Total Pills:
                  </label>
                  <input
                    type="number"
                    value={newMedForm.totalPills}
                    onChange={(e) => setNewMedForm({ ...newMedForm, totalPills: parseInt(e.target.value) || 30 })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Refill Alert Threshold:
                  </label>
                  <input
                    type="number"
                    value={newMedForm.refillThreshold}
                    onChange={(e) => setNewMedForm({ ...newMedForm, refillThreshold: parseInt(e.target.value) || 5 })}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{
                  background: 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: '8px'
                }}
              >
                Save to Medication Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
