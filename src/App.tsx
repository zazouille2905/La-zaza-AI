import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, MessageSquare, Info, Globe, Briefcase, GraduationCap, Languages, Target } from 'lucide-react';
import { LiveAudioService } from './services/liveAudio';
import { Visualizer } from './components/Visualizer';

const ELSA_CV = `
Identity: Elsa Planes, Marketing & Communication specialist.
Education: 
- Master’s degree in Marketing Grande Consommation at ESCE Paris (expected graduation: 2026).
- 6-month Erasmus exchange at the Universidad Europea de Madrid (UEM), Spain (2023).
- Baccalauréat with honors (Mention), Specialties: Math, Physics-Chemistry, SVT (2021).

Professional Experience:
- Marketing & Communication Assistant at Polyworks Europa (apprenticeship, since Oct 2025): Digital strategy (LinkedIn management, SEO, ROI analysis), Video content creation (A to Z), RSE engagement.
- Assistant Press Attaché at Stellantis (2024-2025): Press relations coordination, communication campaigns, media coverage analysis.
- Assistant Project Manager at Agence Marketing Bespoke (6-month internship, 2023): 360° marketing projects, freelancer coordination, benchmarks, social media analysis.
- Additional: Restaurant hostess at Riviera Fuga (Paris, since May 2024), Cashier for Paris 2024 Olympic Games (Sodexo, Summer 2024).

Skills:
- Languages: French (native), English (bilingual), Italian (advanced), Spanish (beginner).
- Tools: Pack Office (Excel, Word, PowerPoint), Canva, and AI tools (ChatGPT, Copilot, Gemini).

Goal: Seeking a professional challenge in CDD or CDI starting at the end of 2026.
Interests: Dance, rugby, motorsport, fashion, events, music.

Instructions for Zaza:
1. You are Zaza, Elsa's dedicated personal AI assistant.
2. You are professional, efficient, and proactive.
3. You are completely bilingual in English and French. Always adapt your language to match the user's language.
4. Your initial greeting MUST be: "I am Elsa assistant, how can I help you? / Je suis l'assistant d'Elsa, comment puis-je vous aider ?"
5. Use the provided CV data to answer questions about Elsa's skills, availability, or professional history.
6. If a question is outside your knowledge base, inform the user clearly and offer to help in another way.
7. Keep responses concise and insightful.
`;

export default function App() {
  const [isLive, setIsLive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
  const [transcription, setTranscription] = useState<string>('');
  const liveAudioRef = useRef<LiveAudioService | null>(null);

  const toggleLive = async () => {
    if (isLive) {
      liveAudioRef.current?.disconnect();
      setIsLive(false);
      setStatus('idle');
    } else {
      setStatus('connecting');
      try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new Error('API Key missing');

        liveAudioRef.current = new LiveAudioService({
          apiKey,
          systemInstruction: ELSA_CV,
          onOpen: () => {
            setIsLive(true);
            setStatus('active');
          },
          onClose: () => {
            setIsLive(false);
            setStatus('idle');
          },
          onError: (err) => {
            console.error(err);
            setStatus('error');
          },
          onMessage: (msg) => {
            // Handle transcriptions if needed
            if (msg.serverContent?.modelTurn?.parts?.[0]?.text) {
              setTranscription(prev => prev + ' ' + msg.serverContent?.modelTurn?.parts?.[0]?.text);
            }
          }
        });
        await liveAudioRef.current.connect();
      } catch (err) {
        console.error(err);
        setStatus('error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <span className="font-bold text-black text-xl">Z</span>
          </div>
          <div>
            <h1 className="text-lg font-medium tracking-tight">Zaza</h1>
            <p className="text-xs text-emerald-500/70 font-mono uppercase tracking-widest">Elsa's Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono uppercase tracking-wider text-white/50">
            <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-white/20'}`} />
            {status}
          </div>
        </div>
      </header>

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl md:text-7xl font-light tracking-tighter mb-6 leading-none">
              Bilingual <span className="text-emerald-500 italic">Marketing</span> Specialist.
            </h2>
            <p className="text-lg text-white/60 max-w-2xl leading-relaxed">
              I am Elsa's personal AI assistant, designed to help you discover her professional journey, skills, and availability.
            </p>
          </motion.div>
        </section>

        {/* Interaction Area */}
        <section className="relative mb-16">
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Mic className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <MessageSquare size={20} />
                  </div>
                  <span className="text-sm font-medium text-white/80">Voice Interface</span>
                </div>
                {isLive && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-2"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Live Connection
                  </motion.div>
                )}
              </div>

              <Visualizer isActive={isLive} />

              <div className="mt-8 flex flex-col items-center gap-6">
                <button
                  onClick={toggleLive}
                  className={`group relative flex items-center justify-center w-20 h-20 rounded-full transition-all duration-500 ${
                    isLive 
                      ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)]' 
                      : 'bg-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:scale-110'
                  }`}
                >
                  {isLive ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-black" />}
                  <span className="absolute -bottom-10 text-[10px] font-mono uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">
                    {isLive ? 'End Session' : 'Start Conversation'}
                  </span>
                </button>
                
                <p className="text-sm text-white/40 text-center max-w-xs italic">
                  {isLive 
                    ? "Zaza is listening... Speak naturally in English or French." 
                    : "Click the button to initialize the voice assistant."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Info Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard 
            icon={<GraduationCap size={18} />}
            title="Education"
            content="Master 2 Marketing Grande Consommation @ ESCE Paris (2026)"
          />
          <InfoCard 
            icon={<Briefcase size={18} />}
            title="Current Role"
            content="Marketing & Communication Assistant @ Polyworks Europa"
          />
          <InfoCard 
            icon={<Languages size={18} />}
            title="Languages"
            content="French (Native), English (Bilingual), Italian (Advanced)"
          />
          <InfoCard 
            icon={<Target size={18} />}
            title="Availability"
            content="Seeking CDD/CDI challenges from end of 2026"
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="p-10 border-t border-white/5 bg-black">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-white/30 text-xs font-mono uppercase tracking-widest">
            © 2026 Elsa Planes • Personal Assistant
          </div>
          <div className="flex gap-6">
            <a href="mailto:elsa.planes@free.fr" className="text-white/40 hover:text-emerald-500 transition-colors">Email</a>
            <a href="https://linkedin.com/in/elsa-planes" target="_blank" className="text-white/40 hover:text-emerald-500 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InfoCard({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-emerald-500/30 transition-all group">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-lg bg-white/5 text-emerald-500 group-hover:bg-emerald-500/10 transition-colors">
          {icon}
        </div>
        <h3 className="text-xs font-mono uppercase tracking-widest text-white/40">{title}</h3>
      </div>
      <p className="text-sm text-white/80 leading-relaxed">{content}</p>
    </div>
  );
}
