import React, { useState, useRef, useEffect } from 'react';
import { Send, Brain, ChevronRight, BookOpen, Star, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';

// ── Topic tree ─────────────────────────────────────────────────────────────────
const MODULES = [
  {
    code: 'LAW 201', title: 'Constitutional Law', color: 'from-amber-800 to-amber-600',
    topics: [
      'Origins of Nigerian Federalism',
      'Supremacy of the Constitution',
      'Federalism & Devolution of Powers',
      'Separation of Powers',
      'Fundamental Rights under Chapter IV',
      'The Second Schedule',
    ],
  },
  {
    code: 'LAW 202', title: 'Law of Contract', color: 'from-slate-700 to-slate-500',
    topics: [
      'Offer & Acceptance — The Postal Rule',
      'Consideration & Intention',
      'Terms of a Contract',
      'Misrepresentation & Mistake',
      'Breach & Remedies',
    ],
  },
];

// ── AI responses ──────────────────────────────────────────────────────────────
type Msg = { role: 'ai' | 'user'; text: string; chips?: string[]; helpful?: boolean | null };

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const RESPONSES: Record<string, { text: string; chips?: string[] }> = {
  federalism: {
    text: `**Federalism & the Second Schedule**\n\nNigerian federalism divides legislative powers between the Federal and State governments via the Second Schedule of the 1999 Constitution:\n\n• **Exclusive Legislative List** (Part I) — only the National Assembly may legislate on these matters (e.g. defence, currency, immigration).\n• **Concurrent List** (Part II) — both National Assembly and State House of Assembly may legislate. Where there is inconsistency, the Federal law prevails per **s.4(5)**.\n• **Residual Powers** — matters not listed vest exclusively in States by exclusion.\n\nKey case: *Lakanmi v. A-G (Western State)* [1971] — Affirmed the supremacy of the Constitution over military decrees.`,
    chips: ['Quiz me on this', 'Explain s.4(5)', 'Next topic'],
  },
  quiz: {
    text: `**Quiz: Federalism (3 Questions)**\n\n**Q1.** Under the 1999 Constitution, which Schedule contains the Exclusive Legislative List?\n\nA) First Schedule\nB) Second Schedule — Part I ✓\nC) Third Schedule\nD) Fourth Schedule\n\n**Q2.** What does s.4(5) provide?\n\nA) Federal law prevails over inconsistent State law ✓\nB) State law may override Federal law in emergencies\nC) Both levels may legislate freely\nD) Residual powers vest in the President\n\n**Q3.** In *Lakanmi v. A-G (Western State)*, what was held?\n\nA) Military decrees supersede the Constitution\nB) The Constitution is supreme over military decrees ✓\nC) States have full legislative autonomy\nD) None of the above\n\nYour results: **3/3 — 100% ✓ Excellent!**`,
    chips: ['Try a harder quiz', 'Explain any answer', 'Move to next topic'],
  },
  offer: {
    text: `**Offer & Acceptance — Key Principles**\n\nAn offer is a definite promise to be bound on specific terms, communicated to the offeree.\n\n**Rules of Acceptance:**\n• Must be unconditional and mirror the offer exactly (Mirror Image Rule)\n• Communicated to the offeror (exceptions: postal rule)\n• **Postal Rule:** Acceptance is complete when the letter is *posted*, not when received — *Adams v. Lindsell* [1818]\n\n**Nigerian Application:**\nIn *Carlill v. Carbolic Smoke Ball Co.* principle, offers to the world are valid; acceptance by conduct is sufficient.\n\n**Counter-offer:** A counter-offer kills the original offer — *Hyde v. Wrench* [1840].`,
    chips: ['Quiz me on Contract', 'Explain consideration', 'Practice essay question'],
  },
  default: {
    text: `I can help you with any topic from your enrolled modules. Here's what I can do:\n\n• **Explain** a concept in plain language\n• **Quiz** you with MCQs or essay questions\n• **Summarise** a topic for quick revision\n• **Give you a practice essay** with model answer\n• **Break down case law** applied in Nigerian courts\n\nJust type your question or pick a topic from the panel on the left.`,
    chips: ['Explain federalism', 'Quiz me: Constitutional Law', 'Offer & acceptance', 'Practice essay'],
  },
  essay: {
    text: `**Practice Essay Question:**\n\n*"The doctrine of federal supremacy under s.4(5) of the 1999 Constitution renders State legislative power meaningless." Discuss with reference to decided cases.*\n\n**Model Answer Structure:**\n\n1. **Introduction** — Define federal supremacy; outline the constitutional framework\n2. **The Second Schedule** — Exclusive vs. Concurrent List\n3. **s.4(5) in operation** — When does conflict arise? Test of inconsistency\n4. **Case law** — *A-G (Ogun State) v. A-G (Federation)*; *Bronik Motors v. Wema Bank*\n5. **Counter-argument** — Residual powers; State vitality\n6. **Conclusion** — Balanced view\n\n**Time: 45 minutes | Length: 800–1,000 words**`,
    chips: ['Give feedback on my answer', 'Show me another essay', 'Back to topics'],
  },
};

function getReply(input: string): { text: string; chips?: string[] } {
  const q = input.toLowerCase();
  if (q.match(/federalism|second schedule|devolution|s\.4/)) return RESPONSES.federalism;
  if (q.match(/quiz|test|question|mcq/)) return RESPONSES.quiz;
  if (q.match(/offer|acceptance|postal|contract/)) return RESPONSES.offer;
  if (q.match(/essay|practice|discuss/)) return RESPONSES.essay;
  return RESPONSES.default;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AIStudyCoach() {
  const [selectedModule, setSelectedModule] = useState(MODULES[0]);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'ai',
      text: `Welcome to your AI Study Coach! 🎓\n\nI'm here to help you master your LL.B modules through explanations, quizzes, case law breakdowns, and essay practice.\n\nSelect a topic from the left panel or type your question below.`,
      chips: ['Explain federalism', 'Quiz: Constitutional Law', 'Offer & Acceptance', 'Practice essay question'],
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [helpful, setHelpful] = useState<Record<number, boolean | null>>({});
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [msgs, typing]);

  const sendText = (text: string) => {
    if (!text.trim()) return;
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', text }]);
    setTyping(true);
    setTimeout(() => {
      const { text: aiText, chips } = getReply(text);
      setMsgs(prev => [...prev, { role: 'ai', text: aiText, chips }]);
      setTyping(false);
    }, 1100);
  };

  const handleTopicClick = (topic: string) => {
    setSelectedTopic(topic);
    sendText(`Explain: ${topic}`);
  };

  const resetChat = () => {
    setMsgs([{
      role: 'ai',
      text: "Session reset. What would you like to study?",
      chips: ['Explain federalism', 'Quiz: Constitutional Law', 'Offer & Acceptance', 'Practice essay question'],
    }]);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">AI Study Coach</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Get quizzed, ask questions, and revise smarter with AI.</p>
        </div>
        <button onClick={resetChat} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors">
          <RotateCcw className="h-4 w-4" /> New Session
        </button>
      </div>

      <div className="flex-1 flex gap-5 min-h-0">
        {/* Left panel — topic tree */}
        <aside className="w-56 shrink-0 bg-white rounded-xl border border-stone-200 shadow-sm overflow-y-auto">
          <div className="px-4 py-3 border-b border-stone-100">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Study Topics</p>
          </div>
          {MODULES.map(mod => (
            <div key={mod.code}>
              <button
                onClick={() => setSelectedModule(mod)}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-left border-b border-stone-100 transition-colors ${selectedModule.code === mod.code ? 'bg-primary/5' : 'hover:bg-stone-50'}`}
              >
                <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${mod.color} shrink-0`} />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-muted-foreground">{mod.code}</p>
                  <p className="text-xs font-semibold text-foreground truncate">{mod.title}</p>
                </div>
              </button>

              {selectedModule.code === mod.code && (
                <div className="bg-stone-50 border-b border-stone-100">
                  {mod.topics.map((t, i) => (
                    <button key={i} onClick={() => handleTopicClick(t)}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-primary/5 transition-colors ${selectedTopic === t ? 'bg-primary/5 text-primary' : ''}`}>
                      <ChevronRight className={`h-3 w-3 shrink-0 ${selectedTopic === t ? 'text-primary' : 'text-stone-400'}`} />
                      <span className="text-xs text-foreground leading-snug">{t}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="p-4">
            <div className="rounded-xl bg-primary/5 border border-primary/15 p-3 text-center">
              <Star className="h-5 w-5 text-accent mx-auto mb-1" />
              <p className="text-[10px] font-semibold text-primary">Avg. Score</p>
              <p className="text-lg font-bold text-primary">74.7%</p>
              <p className="text-[10px] text-muted-foreground">3 topics quizzed</p>
            </div>
          </div>
        </aside>

        {/* Chat area */}
        <div className="flex-1 flex flex-col min-w-0 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-stone-100 bg-primary shrink-0">
            <div className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">AI Study Coach</p>
              <p className="flex items-center gap-1.5 text-[11px] text-white/65">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" /> Online · {selectedModule.title}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} gap-3`}>
                {m.role === 'ai' && (
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Brain className="h-4 w-4 text-white" />
                  </div>
                )}
                <div className="max-w-[80%]">
                  <div className={`text-sm leading-relaxed px-4 py-3 rounded-2xl whitespace-pre-line ${m.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-stone-100 text-foreground rounded-tl-sm'}`}>
                    {m.text}
                  </div>
                  {m.role === 'ai' && m.chips && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {m.chips.map(c => (
                        <button key={c} onClick={() => sendText(c)}
                          className="px-3 py-1.5 rounded-full border border-stone-200 text-xs font-medium text-foreground bg-white hover:border-primary hover:text-primary transition-colors">
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                  {m.role === 'ai' && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[11px] text-stone-400">Was this helpful?</span>
                      <button onClick={() => setHelpful(h => ({ ...h, [i]: true }))}
                        className={`p-1 rounded transition-colors ${helpful[i] === true ? 'text-green-600' : 'text-stone-400 hover:text-green-600'}`}>
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => setHelpful(h => ({ ...h, [i]: false }))}
                        className={`p-1 rounded transition-colors ${helpful[i] === false ? 'text-red-500' : 'text-stone-400 hover:text-red-500'}`}>
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    {[0,1,2].map(j => <span key={j} className="h-2 w-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: `${j * 0.18}s` }} />)}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 border-t border-stone-100 px-4 py-3 bg-white">
            <div className="flex items-center gap-2">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(input); } }}
                placeholder="Ask a question, request a quiz, or say 'explain...'…"
                className="flex-1 text-sm px-4 py-2.5 rounded-full border border-stone-200 outline-none focus:ring-2 focus:ring-primary/15 focus:border-primary/40 bg-stone-50 placeholder:text-stone-400" />
              <button onClick={() => sendText(input)} disabled={!input.trim()}
                className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0 disabled:opacity-35 hover:bg-primary/90 transition-colors">
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 text-center mt-2">Powered by Tolumo AI · Study responses are for revision only</p>
          </div>
        </div>
      </div>
    </div>
  );
}
