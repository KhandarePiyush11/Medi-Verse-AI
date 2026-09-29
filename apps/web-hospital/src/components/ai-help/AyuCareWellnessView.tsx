import React, { useState } from 'react';
import { 
  Leaf, 
  ShieldAlert, 
  Sparkles, 
  Heart, 
  Sun, 
  Moon, 
  Coffee, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronRight, 
  Search, 
  RefreshCw,
  Flame,
  Wind,
  Droplets,
  BookOpen,
  PhoneCall
} from 'lucide-react';
import { 
  DOSHA_QUIZ, 
  CLASSICAL_HERBS, 
  AYURVEDIC_HOME_REMEDIES, 
  AYUCARE_RED_FLAG_KEYWORDS, 
  AyurvedicHerb 
} from './aiHelpData';

interface AyuCareWellnessViewProps {
  onNavigateToTab: (tabId: string) => void;
  onEmergencyTrigger?: () => void;
}

export const AyuCareWellnessView: React.FC<AyuCareWellnessViewProps> = ({
  onNavigateToTab,
  onEmergencyTrigger
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'DOSHA' | 'HERBS' | 'DINACHARYA' | 'REMEDIES'>('DOSHA');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, 'vata' | 'pitta' | 'kapha'>>({});
  const [selectedHerb, setSelectedHerb] = useState<AyurvedicHerb>(CLASSICAL_HERBS[0]);
  const [herbSearch, setHerbSearch] = useState<string>('');
  const [wellnessQuery, setWellnessQuery] = useState<string>('');
  const [redFlagIntercepted, setRedFlagIntercepted] = useState<boolean>(false);
  const [wellnessAdvice, setWellnessAdvice] = useState<string | null>(null);

  const answeredCount = Object.keys(quizAnswers).length;
  const isQuizComplete = answeredCount === DOSHA_QUIZ.length;

  const handleResetQuiz = () => {
    setQuizAnswers({});
  };

  // Calculate dominant Dosha from answers
  const doshaScore = Object.values(quizAnswers).reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, { vata: 0, pitta: 0, kapha: 0 } as Record<'vata' | 'pitta' | 'kapha', number>);

  let dominantDosha: 'Vata' | 'Pitta' | 'Kapha' = 'Pitta';
  if (doshaScore.vata >= doshaScore.pitta && doshaScore.vata >= doshaScore.kapha) dominantDosha = 'Vata';
  else if (doshaScore.kapha >= doshaScore.pitta && doshaScore.kapha >= doshaScore.vata) dominantDosha = 'Kapha';

  const handleHerbSearch = CLASSICAL_HERBS.filter(h => 
    h.name.toLowerCase().includes(herbSearch.toLowerCase()) || 
    h.sanskritName.toLowerCase().includes(herbSearch.toLowerCase()) ||
    h.traditionalUses.toLowerCase().includes(herbSearch.toLowerCase())
  );

  const handleWellnessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wellnessQuery.trim()) return;

    const lower = wellnessQuery.toLowerCase();
    const isRedFlag = AYUCARE_RED_FLAG_KEYWORDS.some(k => lower.includes(k));

    if (isRedFlag) {
      setRedFlagIntercepted(true);
      setWellnessAdvice(null);
      return;
    }

    setRedFlagIntercepted(false);
    setWellnessAdvice(
      `Ayurvedic Perspective for "${wellnessQuery}": Based on classical principles of Agni (digestive fire) and Tridosha balance, maintain a warm, freshly cooked diet (Ahara), practice Nadi Shodhana Pranayama (alternate nostril breathing), and sip warm water infused with cumin and fennel. Avoid cold, stale, or excessively pungent items while body channels (Srotas) recalibrate.`
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* MANDATORY CLINICAL ISOLATION & SAFETY BANNER */}
      <div 
        style={{ 
          padding: '20px 24px', 
          borderRadius: '16px', 
          background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.08) 0%, rgba(217, 119, 6, 0.05) 100%)', 
          border: '1.5px solid rgba(5, 150, 105, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
              <Leaf size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#064E3B', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                AyuCare AI — Traditional Ayurvedic & Holistic Wellness
              </h2>
              <div style={{ fontSize: '13px', color: '#047857', marginTop: '2px' }}>
                Prakriti Dosha Profiling • Classical Rasayana Herbology • Dinacharya Circadian Balance
              </div>
            </div>
          </div>

          <span style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '20px', background: 'rgba(5, 150, 105, 0.15)', color: '#065F46', fontWeight: 800 }}>
            🌿 NON-CLINICAL WELLNESS MODE
          </span>
        </div>

        {/* CLINICAL ISOLATION DECLARATION */}
        <div style={{ fontSize: '12px', color: '#065F46', lineHeight: '1.5', background: '#ECFDF5', padding: '10px 14px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
          <strong>Safety Boundary Declaration:</strong> AyuCare AI provides traditional Ayurvedic lifestyle, herbal, and holistic wellness guidance for chronic vitality and balance. This is <em>strictly separated from acute medical diagnosis and emergency care</em>. If you experience acute chest pain, shortness of breath, or trauma, modern emergency clinical care is strictly required.
        </div>
      </div>

      {/* RED-FLAG INTERCEPTION MODAL (IF USER ENTERS ACUTE SYMPTOMS) */}
      {redFlagIntercepted && (
        <div 
          style={{ 
            padding: '20px', 
            borderRadius: '14px', 
            background: '#FEF2F2', 
            border: '2px solid #EF4444', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '12px',
            animation: 'pulse 1.5s infinite'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={28} color="#DC2626" />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#991B1B' }}>
                CRITICAL CLINICAL RED-FLAG INTERCEPTED!
              </div>
              <div style={{ fontSize: '12.5px', color: '#B91C1C', marginTop: '2px' }}>
                Traditional Ayurvedic remedies must NOT be used for acute cardiopulmonary or neurological emergencies.
              </div>
            </div>
          </div>

          <div style={{ fontSize: '13px', color: '#7F1D1D', lineHeight: '1.5' }}>
            Your query indicates symptoms that require immediate clinical evaluation. Please do not delay. Proceed to the nearest hospital emergency room or contact the National Emergency Response Center immediately.
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
            <button
              onClick={onEmergencyTrigger}
              style={{
                background: '#DC2626',
                color: '#FFF',
                border: 'none',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)'
              }}
            >
              <PhoneCall size={16} /> Open Emergency SOS (108/112)
            </button>
            <button
              onClick={() => setRedFlagIntercepted(false)}
              style={{
                background: '#FFFFFF',
                color: '#475569',
                border: '1px solid #CBD5E1',
                padding: '9px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Dismiss Warning
            </button>
          </div>
        </div>
      )}

      {/* SUB-TABS NAVIGATION */}
      <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
        {[
          { key: 'DOSHA', label: '1. Prakriti Dosha Analyzer', icon: Flame },
          { key: 'HERBS', label: '2. Classical Herbs Compendium', icon: BookOpen },
          { key: 'DINACHARYA', label: '3. Dinacharya (Daily Routine)', icon: Sun },
          { key: 'REMEDIES', label: '4. Traditional Home Remedies', icon: Droplets }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key as any)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: isActive ? 800 : 600,
                border: 'none',
                background: isActive ? '#059669' : '#F1F5F9',
                color: isActive ? '#FFFFFF' : '#475569',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB 1: PRAKRITI DOSHA ANALYZER */}
      {activeSubTab === 'DOSHA' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* QUIZ QUESTIONS */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={18} color="#059669" /> Ayurvedic Body-Mind Type (Prakriti) Questionnaire
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {DOSHA_QUIZ.map((q, idx) => (
                <div key={q.id} style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                    {idx + 1}. {q.question}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {(['vata', 'pitta', 'kapha'] as const).map(d => {
                      const isSelected = quizAnswers[q.id] === d;
                      const dLabel = d === 'vata' ? 'Vata (💨 Air)' : d === 'pitta' ? 'Pitta (🔥 Fire)' : 'Kapha (💧 Earth)';
                      return (
                        <label 
                          key={d} 
                          style={{
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            fontSize: '11.5px', 
                            color: isSelected ? '#065F46' : '#475569',
                            background: isSelected ? 'rgba(5, 150, 105, 0.08)' : '#FFF',
                            padding: '6px 10px',
                            borderRadius: '6px',
                            border: isSelected ? '1px solid #059669' : '1px solid #CBD5E1',
                            cursor: 'pointer'
                          }}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            value={d}
                            checked={isSelected}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: d })}
                            style={{ accentColor: '#059669' }}
                          />
                          <span><strong>{dLabel}:</strong> {q.options[d]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DOSHA SUMMARY CARD */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isQuizComplete ? (
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '36px 24px', 
                  borderRadius: '16px', 
                  background: '#FFFFFF', 
                  border: '1.5px dashed #A7F3D0',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}
              >
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(5, 150, 105, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                  <Leaf size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#064E3B' }}>
                    Discover Your Ayurvedic Prakriti
                  </div>
                  <div style={{ fontSize: '13px', color: '#047857', maxWidth: '380px', lineHeight: '1.6', marginTop: '6px' }}>
                    Answer all 5 questions on the left ({answeredCount} of {DOSHA_QUIZ.length} answered) to uncover your primary Dosha constitution (Vata, Pitta, or Kapha) and receive personalized Ayurvedic Ahara & Vihara guidance.
                  </div>
                </div>

                {/* PROGRESS BAR */}
                <div style={{ width: '100%', maxWidth: '280px', background: '#E2E8F0', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${(answeredCount / DOSHA_QUIZ.length) * 100}%`, height: '100%', background: '#059669', borderRadius: '4px', transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                  {answeredCount} of {DOSHA_QUIZ.length} questions completed
                </span>
              </div>
            ) : (
              <div 
                className="glass-panel" 
                style={{ 
                  padding: '24px', 
                  borderRadius: '16px', 
                  background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)', 
                  border: '1.5px solid #059669',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#047857', letterSpacing: '0.06em' }}>
                      CALCULATED PRAKRITI PROFILE
                    </span>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#064E3B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {dominantDosha === 'Vata' && <Wind size={26} color="#0284C7" />}
                      {dominantDosha === 'Pitta' && <Flame size={26} color="#D97706" />}
                      {dominantDosha === 'Kapha' && <Droplets size={26} color="#059669" />}
                      <span>{dominantDosha}-Dominant Type</span>
                    </div>
                  </div>

                  <button
                    onClick={handleResetQuiz}
                    style={{
                      background: 'rgba(5, 150, 105, 0.1)',
                      border: '1px solid #A7F3D0',
                      color: '#065F46',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Retake Quiz
                  </button>
                </div>

              {/* DOSHA BREAKDOWN BARS */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Vata (Air & Space)', count: doshaScore.vata, color: '#0284C7' },
                  { label: 'Pitta (Fire & Water)', count: doshaScore.pitta, color: '#D97706' },
                  { label: 'Kapha (Earth & Water)', count: doshaScore.kapha, color: '#059669' }
                ].map((d, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 700, color: '#334155' }}>
                      <span>{d.label}</span>
                      <span>{Math.round((d.count / 5) * 100)}%</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', marginTop: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(d.count / 5) * 100}%`, height: '100%', background: d.color, borderRadius: '3px' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* TAILORED BALANCING ADVICE */}
              <div style={{ background: '#FFFFFF', padding: '14px', borderRadius: '10px', border: '1px solid #A7F3D0', fontSize: '12px', color: '#064E3B', lineHeight: '1.5' }}>
                {dominantDosha === 'Vata' && (
                  <div>
                    <strong>Vata Balancing Protocol:</strong> Focus on warm, grounding, cooked foods (soups, stews, ghee). Keep a consistent daily routine. Practice sesame oil self-massage (Abhyanga) to calm the nervous system. Avoid excessive raw salads and chilled beverages.
                  </div>
                )}
                {dominantDosha === 'Pitta' && (
                  <div>
                    <strong>Pitta Balancing Protocol:</strong> Focus on cooling, hydrating foods (coconut water, cucumbers, sweet fruits). Avoid excessive chili, vinegar, and deep-fried foods. Moderate competitive stress and take refreshing evening walks under moonlight (Sheetali Pranayama).
                  </div>
                )}
                {dominantDosha === 'Kapha' && (
                  <div>
                    <strong>Kapha Balancing Protocol:</strong> Focus on warm, light, spicy, and bitter foods to kindle digestive fire. Engage in vigorous morning aerobic exercise. Drink ginger-cinnamon tea and avoid afternoon naps and heavy dairy.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ASK AYUCARE WELLNESS ENGINE */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                Ask AyuCare for Holistic Wellness Guidance:
              </div>
              <form onSubmit={handleWellnessSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="e.g., Natural Ayurvedic tea for acid reflux or better sleep"
                  value={wellnessQuery}
                  onChange={(e) => setWellnessQuery(e.target.value)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#059669',
                    color: '#FFF',
                    border: 'none',
                    padding: '9px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Consult Traditional Knowledge
                </button>
              </form>

              {wellnessAdvice && (
                <div style={{ marginTop: '12px', padding: '12px', borderRadius: '8px', background: '#F0FDF4', border: '1px solid #BBF7D0', fontSize: '12px', color: '#166534', lineHeight: '1.5' }}>
                  {wellnessAdvice}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CLASSICAL HERBS COMPENDIUM */}
      {activeSubTab === 'HERBS' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', alignItems: 'start' }}>
          {/* HERBS LIST */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', padding: '8px 12px', borderRadius: '8px', border: '1px solid #CBD5E1' }}>
              <Search size={15} color="#64748B" />
              <input
                type="text"
                placeholder="Search herbs (Ashwagandha, Tulsi, Triphala...)"
                value={herbSearch}
                onChange={(e) => setHerbSearch(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '12px', width: '100%' }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '480px', overflowY: 'auto' }}>
              {handleHerbSearch.map(herb => {
                const isSelected = selectedHerb.name === herb.name;
                return (
                  <div
                    key={herb.name}
                    onClick={() => setSelectedHerb(herb)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: isSelected ? '1.5px solid #059669' : '1px solid #E2E8F0',
                      background: isSelected ? 'rgba(5, 150, 105, 0.08)' : '#F8FAFC',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                        {herb.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                        {herb.sanskritName}
                      </div>
                    </div>
                    {isSelected && <CheckCircle2 size={16} color="#059669" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* HERB DETAIL CARD */}
          <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', letterSpacing: '0.04em' }}>
                  CLASSICAL RASAYANA MONOGRAPH
                </span>
                <div style={{ fontSize: '22px', fontWeight: 900, color: '#0F172A', marginTop: '2px' }}>
                  {selectedHerb.name}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B', fontStyle: 'italic', marginTop: '2px' }}>
                  {selectedHerb.botanicalName} • {selectedHerb.sanskritName}
                </div>
              </div>

              <span style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '6px', background: '#ECFDF5', color: '#065F46', fontWeight: 700, border: '1px solid #A7F3D0' }}>
                {selectedHerb.doshaEffect}
              </span>
            </div>

            {/* BENEFITS TAGS */}
            <div>
              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                Primary Traditional Benefits:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedHerb.primaryBenefits.map((b, i) => (
                  <span key={i} style={{ fontSize: '11px', padding: '4px 9px', borderRadius: '6px', background: '#F1F5F9', border: '1px solid #CBD5E1', color: '#334155', fontWeight: 600 }}>
                    ✨ {b}
                  </span>
                ))}
              </div>
            </div>

            {/* TRADITIONAL USES */}
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#059669', marginBottom: '4px' }}>
                TRADITIONAL REPERTOIRE (SAMHITA CONTEXT):
              </div>
              <div style={{ fontSize: '12.5px', color: '#334155', lineHeight: '1.6' }}>
                {selectedHerb.traditionalUses}
              </div>
            </div>

            {/* PREPARATION METHOD */}
            <div style={{ background: '#F0FDF4', padding: '14px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
              <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#166534', marginBottom: '4px' }}>
                RECOMMENDED PREPARATION (ANUPANA):
              </div>
              <div style={{ fontSize: '12.5px', color: '#14532D', lineHeight: '1.6' }}>
                {selectedHerb.recommendedPreparation}
              </div>
            </div>

            {/* CAUTIONS */}
            <div style={{ background: '#FFFBEB', padding: '12px 14px', borderRadius: '10px', border: '1px solid #FDE68A', fontSize: '11.5px', color: '#92400E' }}>
              <strong>⚠️ Traditional Contraindications:</strong> {selectedHerb.cautions}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DINACHARYA (DAILY ROUTINE) */}
      {activeSubTab === 'DINACHARYA' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {[
            {
              time: '🌅 Brahma Muhurta (Dawn, 05:30 AM)',
              title: 'Awakening & Conscious Awakening',
              action: 'Awaken before sunrise when Vata qualities of lightness and mental clarity dominate the atmosphere.',
              tips: ['Splash eyes with cool water', 'Scrape tongue to remove morning Ama (toxins)']
            },
            {
              time: '🫖 Ushapan (Morning Hydration, 06:00 AM)',
              title: 'Warm Copper Water Hydration',
              action: 'Drink 1-2 glasses of warm water (optionally stored in copper overnight) to stimulate gastrocolic peristalsis.',
              tips: ['Encourages natural morning bowel movement', 'Kindles gentle digestive Agni']
            },
            {
              time: '🧘 Abhyanga & Yoga (06:30 AM)',
              title: 'Warm Herbal Self-Oil Massage',
              action: 'Apply warm sesame or coconut oil over the scalp and body prior to a warm bath.',
              tips: ['Pacifies aggravated Vata', 'Improves peripheral circulation and joint lubrication']
            },
            {
              time: '🍲 Madhyahna Bhojana (Noon, 12:30 PM)',
              title: 'Principal Noon Meal',
              action: 'Consume your heaviest, most nourishing meal when the sun is at its zenith and digestive fire (Agni) is highest.',
              tips: ['Include all 6 Ayurvedic tastes (Shad Rasa)', 'Sit quietly for 5 minutes post-meal']
            },
            {
              time: '🌙 Sandhyavandanam (Twilight, 06:30 PM)',
              title: 'Light Dinner & Unwinding',
              action: 'A light, easily digestible evening meal (kitchari, vegetable soup) at least 3 hours prior to sleep.',
              tips: ['Avoid heavy dairy and curd at night', 'Dim bright digital blue screens']
            },
            {
              time: '🛏️ Ratricharya (Night, 10:00 PM)',
              title: 'Restorative Sleep Alignment',
              action: 'Lie down before 10:00 PM to align with Kapha heaviness before Pitta nighttime cellular rejuvenation begins.',
              tips: ['Sip warm nutmeg moon milk', 'Gentle foot sole massage (Padabhyanga) with ghee']
            }
          ].map((dina, idx) => (
            <div 
              key={idx}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#059669', background: '#ECFDF5', padding: '3px 8px', borderRadius: '6px', alignSelf: 'flex-start' }}>
                {dina.time}
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                {dina.title}
              </div>
              <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5' }}>
                {dina.action}
              </div>
              <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: '8px', marginTop: '4px' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>Key Steps:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                  {dina.tips.map((t, ti) => (
                    <div key={ti} style={{ fontSize: '11.5px', color: '#334155' }}>• {t}</div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 4: TRADITIONAL HOME REMEDIES */}
      {activeSubTab === 'REMEDIES' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {AYURVEDIC_HOME_REMEDIES.map((rem, rIdx) => (
            <div 
              key={rIdx}
              className="glass-panel"
              style={{
                padding: '20px',
                borderRadius: '16px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', textTransform: 'uppercase' }}>
                Condition: {rem.condition}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                {rem.remedyName}
              </div>

              <div style={{ background: '#F8FAFC', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#334155' }}>
                <strong>Ingredients:</strong> {rem.ingredients}
              </div>

              <div style={{ fontSize: '12.5px', color: '#475569', lineHeight: '1.5' }}>
                <strong>Method:</strong> {rem.method}
              </div>

              <div style={{ background: '#ECFDF5', padding: '8px 12px', borderRadius: '8px', border: '1px solid #A7F3D0', fontSize: '11.5px', color: '#065F46' }}>
                <strong>Benefit:</strong> {rem.benefit}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
