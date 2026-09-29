import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Send, 
  Globe, 
  Sparkles, 
  Play, 
  Square, 
  RotateCcw, 
  MessageSquare, 
  ShieldAlert, 
  Bot, 
  User, 
  ChevronRight,
  HelpCircle
} from 'lucide-react';
import { 
  SUPPORTED_LANGUAGES, 
  QUICK_VOICE_QUERIES, 
  LanguageOption, 
  GENERATE_VOICE_RESPONSE 
} from './aiHelpData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  langCode: string;
}

interface MultilingualVoiceAssistantProps {
  onNavigateToTab: (tabId: string) => void;
  onEmergencyTrigger?: () => void;
}

export const MultilingualVoiceAssistant: React.FC<MultilingualVoiceAssistantProps> = ({
  onNavigateToTab,
  onEmergencyTrigger
}) => {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(SUPPORTED_LANGUAGES[0]);
  const [inputText, setInputText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_1',
      sender: 'assistant',
      text: SUPPORTED_LANGUAGES[0].greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      langCode: 'en'
    }
  ]);

  const recognitionRef = useRef<any>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Update greeting when language switches
  const handleLanguageChange = (lang: LanguageOption) => {
    setSelectedLang(lang);
    stopSpeaking();
    setMessages(prev => [
      ...prev,
      {
        id: 'lang_switch_' + Date.now(),
        sender: 'assistant',
        text: lang.greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        langCode: lang.code
      }
    ]);
  };

  // Text-To-Speech (TTS)
  const speakText = (text: string, langCode: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.lang = selectedLang.speechCode;

      // Try finding preferred regional voice
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find(v => v.lang.startsWith(selectedLang.code) || v.lang.replace('_', '-').startsWith(selectedLang.speechCode));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Speech-To-Text (STT)
  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not natively supported in this browser. Please use the text input below.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = selectedLang.speechCode;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        processUserQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition start failed', e);
      setIsListening(false);
    }
  };

  // Process User Query
  const processUserQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg_user_' + Date.now(),
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      langCode: selectedLang.code
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setTimeout(() => {
      const aiResponse = GENERATE_VOICE_RESPONSE(queryText, selectedLang.code);
      const aiMsg: ChatMessage = {
        id: 'msg_ai_' + Date.now(),
        sender: 'assistant',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        langCode: selectedLang.code
      };
      setMessages(prev => [...prev, aiMsg]);
      speakText(aiResponse, selectedLang.code);
    }, 400);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processUserQuery(inputText);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* HEADER BANNER */}
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
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284C7 0%, #7C3AED 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF' }}>
                <Mic size={22} />
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Multilingual AI Clinical Voice Assistant
                </h2>
                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  Speech-to-Text (STT) → AI Clinical Reasoning → Natural Voice Synthesis (TTS) in 9+ Languages
                </div>
              </div>
            </div>
          </div>

          {/* LANGUAGE PICKER DROPDOWN */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Globe size={15} color="#0284C7" /> Language:
            </span>
            <select
              value={selectedLang.code}
              onChange={(e) => {
                const found = SUPPORTED_LANGUAGES.find(l => l.code === e.target.value);
                if (found) handleLanguageChange(found);
              }}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '12.5px',
                fontWeight: 800,
                background: '#FFFFFF',
                color: '#0F172A',
                cursor: 'pointer'
              }}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* MAIN ASSISTANT INTERFACE */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr', gap: '24px', alignItems: 'start' }}>
        {/* LEFT COLUMN: CONVERSATION STREAM & INPUT BAR */}
        <div className="glass-panel" style={{ borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', height: '620px' }}>
          {/* CHAT MESSAGES SCROLL AREA */}
          <div 
            ref={chatScrollRef}
            style={{ 
              flex: 1, 
              padding: '24px', 
              overflowY: 'auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px' 
            }}
          >
            {messages.map(msg => {
              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    alignSelf: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', fontSize: '11px', color: '#64748B' }}>
                    {isUser ? (
                      <>
                        <span>You</span>
                        <User size={12} />
                        <span>• {msg.timestamp}</span>
                      </>
                    ) : (
                      <>
                        <Bot size={13} color="#0284C7" />
                        <span style={{ fontWeight: 700, color: '#0284C7' }}>MediVerse AI</span>
                        <span>• {msg.timestamp}</span>
                      </>
                    )}
                  </div>

                  <div 
                    style={{
                      padding: '12px 16px',
                      borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: isUser ? 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)' : '#F1F5F9',
                      color: isUser ? '#FFFFFF' : '#0F172A',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      boxShadow: isUser ? '0 2px 10px rgba(2, 132, 199, 0.2)' : 'none'
                    }}
                  >
                    {msg.text}

                    {!isUser && (
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button
                          onClick={() => speakText(msg.text, msg.langCode)}
                          title="Listen with Text-to-Speech"
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#0284C7',
                            cursor: 'pointer',
                            padding: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 700
                          }}
                        >
                          <Volume2 size={13} />
                          <span>Speak</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE VOICE WAVE & CONTROLS (IF LISTENING OR SPEAKING) */}
          {(isListening || isSpeaking) && (
            <div 
              style={{ 
                padding: '10px 24px', 
                background: isListening ? '#FEF2F2' : 'rgba(2, 132, 199, 0.08)', 
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span 
                  style={{ 
                    width: '10px', 
                    height: '10px', 
                    borderRadius: '50%', 
                    background: isListening ? '#EF4444' : '#0284C7',
                    animation: 'pulse 1s infinite'
                  }} 
                />
                <span style={{ fontSize: '12px', fontWeight: 800, color: isListening ? '#B91C1C' : '#0284C7' }}>
                  {isListening ? `Listening in ${selectedLang.name}... Speak now.` : `Speaking in ${selectedLang.name}...`}
                </span>
              </div>

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  style={{
                    background: '#EF4444',
                    color: '#FFF',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Square size={10} /> Stop Audio
                </button>
              )}
            </div>
          )}

          {/* INPUT BAR WITH MICROPHONE BUTTON */}
          <form 
            onSubmit={handleFormSubmit}
            style={{ 
              padding: '16px 20px', 
              borderTop: '1px solid #E2E8F0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              background: '#F8FAFC',
              borderRadius: '0 0 16px 16px'
            }}
          >
            {/* MICROPHONE BUTTON */}
            <button
              type="button"
              onClick={toggleListening}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: isListening ? '#EF4444' : 'linear-gradient(135deg, #0284C7 0%, #0077B6 100%)',
                color: '#FFF',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isListening ? '0 0 16px rgba(239, 68, 68, 0.6)' : '0 2px 10px rgba(2, 132, 199, 0.3)',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              title={isListening ? 'Click to Stop Listening' : 'Click to Speak'}
            >
              {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask in ${selectedLang.name} or click the microphone to speak...`}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                outline: 'none',
                background: '#FFFFFF'
              }}
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: inputText.trim() ? '#0F172A' : '#E2E8F0',
                color: inputText.trim() ? '#FFF' : '#94A3B8',
                border: 'none',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: QUICK VOICE PROMPTS & AUDIO SETTINGS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* QUICK TOPIC CHIPS */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#0284C7" /> Frequent Voice Inquiries
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {QUICK_VOICE_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(q.query);
                    processUserQuery(q.query);
                  }}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#334155',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{q.label}</span>
                  <ChevronRight size={13} color="#94A3B8" />
                </button>
              ))}
            </div>
          </div>

          {/* AUDIO SYNTHESIS SETTINGS */}
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: '#FFFFFF', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Volume2 size={16} color="#0284C7" /> Speech Output Speed
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { label: '0.8x Slow', val: 0.8 },
                { label: '1.0x Normal', val: 1.0 },
                { label: '1.2x Fast', val: 1.2 }
              ].map(opt => (
                <button
                  key={opt.val}
                  onClick={() => setSpeechRate(opt.val)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: speechRate === opt.val ? '1px solid #0284C7' : '1px solid #CBD5E1',
                    background: speechRate === opt.val ? 'rgba(2, 132, 199, 0.1)' : '#FFF',
                    color: speechRate === opt.val ? '#0284C7' : '#475569',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* EMERGENCY SAFETY NOTE */}
          <div style={{ padding: '16px', borderRadius: '12px', background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', fontSize: '12px', lineHeight: '1.5' }}>
            <strong>Voice Assistant Safety Constraint:</strong>
            <div style={{ marginTop: '4px' }}>
              If you say keywords like "chest pain", "heart attack", or "cannot breathe", the voice assistant halts normal chatting and prioritizes direct emergency hotline protocol.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
