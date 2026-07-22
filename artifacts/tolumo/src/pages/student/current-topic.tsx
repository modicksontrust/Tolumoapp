import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  CheckCircle2, Lock, ChevronLeft, ChevronRight, Send,
  Play, SkipBack, SkipForward, Volume2, BookOpen,
  MessageCircle, FileText, Search, ClipboardList, AlertCircle,
} from 'lucide-react';

// ── Module & topics ────────────────────────────────────────────────────────────
const MODULE = { code: 'LAW 201', name: 'Constitutional Law 201', tutor: 'Prof. Oluwaseun Adeyemi' };

const TOPICS = [
  { id: 1, title: 'Introduction to Nigerian Legal System',    status: 'current'   as const, duration: '47:23' },
  { id: 2, title: 'Separation of Powers',                     status: 'done'      as const, duration: '38:55' },
  { id: 3, title: 'Federalism & Devolution of Powers',        status: 'locked'    as const, duration: '52:10' },
  { id: 4, title: 'Fundamental Rights under Chapter IV',      status: 'locked'    as const, duration: '41:30' },
];

const TUTOR = {
  initials: 'OA',
  name: 'Prof. Oluwaseun Adeyemi',
  creds: 'LL.B (Hons), LL.M, PhD · Founding Lecturer',
  bio: 'In this lecture, we explore the constitutional foundations of Nigerian federalism — examining Sections 2–4 of the CFRN 1999 and the distribution of legislative powers through the Second Schedule\'s Exclusive and Concurrent Lists.',
};

// ── Step content ───────────────────────────────────────────────────────────────
const NOTES_CONTENT = `## Federalism & Devolution of Powers

### 1. The Structure of Nigerian Federalism

Nigeria operates a federal system under the 1999 Constitution (as amended). Legislative powers are divided between the National Assembly (Federal) and the 36 State Houses of Assembly.

### 2. The Second Schedule

**Part I — Exclusive Legislative List**
Only the National Assembly may legislate on the 68 listed items (defence, currency, customs, immigration, petroleum). States have no competence here.

**Part II — Concurrent Legislative List**
Both Federal and State legislatures may legislate on 30 matters (education, electricity, health, road traffic). Federal law prevails on conflict (s.4(5)).

**Residual Powers**
Matters not listed in either schedule vest exclusively in States.

### 3. Section 4(5) — The Inconsistency Clause

*"If any Law enacted by the House of Assembly of a State is inconsistent with any law validly made by the National Assembly, the law made by the National Assembly shall prevail, and that other Law shall to the extent of its inconsistency be void."*

**Test of Inconsistency:** Impossibility of compliance or occupied-field doctrine.

### 4. Key Cases

**A-G (Ogun State) v. A-G (Federation) [1982]** — Federal supremacy upheld on concurrent matters.

**Bronik Motors Ltd v. Wema Bank Ltd [1983]** — State banking law void; banking is an exclusive federal matter.

**Lakanmi v. A-G (Western State) [1971]** — Constitution supreme over military decrees.`;

const SUMMARY_POINTS = [
  "Nigeria's federal system divides legislative powers between the National Assembly and State Houses of Assembly under the 1999 Constitution.",
  "The Second Schedule Part I (Exclusive List, 68 items) grants sole competence to the National Assembly — states cannot legislate here.",
  "The Concurrent List (Part II, 30 items) allows both tiers to legislate, but s.4(5) ensures Federal law prevails on any inconsistency.",
  "Residual powers vest in States for matters not appearing in either Schedule.",
  "The two inconsistency tests: (1) impossibility of simultaneous compliance; (2) occupied field doctrine.",
  "Leading cases: A-G Ogun v. Federation [1982], Bronik Motors [1983], Lakanmi [1971].",
];

const RESEARCH = [
  { type: 'Statute', ref: 'Constitution of the Federal Republic of Nigeria, 1999 (as amended) — ss.4, Second Schedule' },
  { type: 'Case', ref: 'A-G (Ogun State) v. A-G (Federation) [1982] 3 NCLR 583' },
  { type: 'Case', ref: 'Bronik Motors Ltd v. Wema Bank Ltd [1983] 1 SCNLR 296' },
  { type: 'Case', ref: 'Lakanmi v. A-G (Western State) [1971] 1 UILR 201' },
  { type: 'Article', ref: 'Nwabueze, B.O., "Nigerian Federal Finance" (1983) Nwamife Publishers' },
  { type: 'Article', ref: 'Ojo, J.D., "The Devolution of Powers in Nigeria" (2005) 19 African Journal of International Law 122' },
];

const AI_QA = [
  { q: 'What is the effect of s.4(5) of the 1999 Constitution?', a: 'Section 4(5) provides that where a State law is inconsistent with a valid Act of the National Assembly, the Federal law prevails and the State law is void to the extent of the inconsistency — the Federal Supremacy Clause.' },
  { q: 'Name the two parts of the Second Schedule.', a: 'Part I: Exclusive Legislative List (68 items — Federal only). Part II: Concurrent Legislative List (30 items — both Federal and State, Federal prevails on conflict).' },
  { q: 'What are residual powers?', a: 'Legislative matters not listed in either Schedule. They vest exclusively in States by exclusion from the Federal lists — States may legislate freely on these matters.' },
  { q: 'Apply Bronik Motors to a scenario where a State enacts a banking regulation.', a: 'Banking is an Exclusive List item. Applying Bronik Motors, any State banking law would be void under s.4(5) — the National Assembly has exclusive competence and has occupied the field via BOFIA.' },
  { q: 'What test is used to determine inconsistency under s.4(5)?', a: 'Two tests: (1) Impossibility — is it impossible to obey both laws simultaneously? (2) Occupied field — has Federal Parliament legislated so comprehensively as to impliedly exclude State legislation?' },
];

const MCQ = [
  { q: 'Under the 1999 Constitution, which Schedule contains the Exclusive Legislative List?', opts: ['First Schedule — Part I', 'Second Schedule — Part I', 'Second Schedule — Part II', 'Third Schedule'], ans: 1 },
  { q: 'What does s.4(5) of the 1999 Constitution provide?', opts: ['State law always prevails over Federal law', 'Federal law prevails over inconsistent State law', 'Both have equal validity', 'Emergency powers override all legislation'], ans: 1 },
  { q: 'In Bronik Motors v. Wema Bank [1983], the Supreme Court held a State banking law was:', opts: ['Valid and enforceable', 'Void for inconsistency with Federal law', 'Applicable only in that State', 'Subject to Presidential assent'], ans: 1 },
  { q: 'Residual legislative powers under the 1999 Constitution vest in:', opts: ['The National Assembly exclusively', 'The President', 'State Houses of Assembly exclusively', 'Both tiers jointly'], ans: 2 },
  { q: 'The "occupied field" doctrine in Nigerian federalism means:', opts: ['Emergency powers restrict State action', 'Federal Parliament has legislated so comprehensively as to exclude State legislation', 'Land use regulated by States', 'Military administration of states'], ans: 1 },
];

// ── Step config ────────────────────────────────────────────────────────────────
type StepId = 'watch' | 'read' | 'summary' | 'research' | 'qa' | 'quiz';
const STEPS: { id: StepId; label: string; short: string }[] = [
  { id: 'watch',    label: 'Watch',         short: 'Watch' },
  { id: 'read',     label: 'Read / Listen', short: 'Read / Listen' },
  { id: 'summary',  label: 'Summary',       short: 'Summary' },
  { id: 'research', label: 'Research',      short: 'Research' },
  { id: 'qa',       label: 'Q&A',           short: 'Q&A' },
  { id: 'quiz',     label: 'Quiz',          short: 'Quiz' },
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function CurrentTopic() {
  const [, setLocation] = useLocation();
  const [currentTopicId, setCurrentTopicId] = useState(1);
  const [step, setStep] = useState<StepId>('watch');
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
  const [notesRead, setNotesRead] = useState(false);

  // Q&A state
  const [qaIndex, setQaIndex] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const [completedQA, setCompletedQA] = useState<Set<number>>(new Set());

  // Quiz state
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  const markDone = (s: StepId) => setCompletedSteps(prev => new Set([...prev, s]));

  const stepOrder = STEPS.map(s => s.id);
  const canAccess = (id: StepId) => {
    const i = stepOrder.indexOf(id);
    if (i === 0) return true;
    return completedSteps.has(stepOrder[i - 1]);
  };

  const goNext = (current: StepId) => {
    markDone(current);
    const i = stepOrder.indexOf(current);
    if (i < stepOrder.length - 1) setStep(stepOrder[i + 1]);
  };

  // Quiz submit
  const submitQuiz = () => {
    const correct = MCQ.filter((q, i) => selected[i] === q.ans).length;
    setSubmitted(true);
    if (correct >= 3) { setQuizPassed(true); markDone('quiz'); }
  };
  const resetAll = () => {
    setSelected({}); setSubmitted(false); setQuizPassed(false);
    setCompletedSteps(new Set()); setStep('watch');
    setQaIndex(0); setShowAns(false); setCompletedQA(new Set()); setNotesRead(false);
  };

  // Current topic & step
  const topic = TOPICS.find(t => t.id === currentTopicId) || TOPICS[0];
  const stepIdx = stepOrder.indexOf(step);

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <button onClick={() => setLocation('/student/modules')} className="flex items-center gap-1 hover:text-primary transition-colors">
          <ChevronLeft className="h-3.5 w-3.5" /> Module Library
        </button>
        <span>/</span>
        <span className="text-foreground font-medium">{MODULE.name}</span>
      </div>

      {/* Page title */}
      <div>
        <h1 className="text-xl font-serif font-bold text-foreground">Topic {topic.id}: {topic.title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{MODULE.tutor} · {MODULE.name}</p>
      </div>

      {/* Topic navigator */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {TOPICS.map(t => {
          const active = t.id === currentTopicId;
          return (
            <button
              key={t.id}
              onClick={() => { if (t.status !== 'locked') setCurrentTopicId(t.id); }}
              disabled={t.status === 'locked'}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap
                ${active ? 'bg-primary text-white border-primary' :
                  t.status === 'done' ? 'bg-white border-primary/30 text-primary' :
                  t.status === 'locked' ? 'bg-stone-50 border-stone-200 text-stone-400 cursor-not-allowed' :
                  'bg-white border-stone-200 text-foreground hover:border-primary/30'}`}
            >
              {t.status === 'done' && <CheckCircle2 className="h-3 w-3 text-primary" />}
              {t.status === 'locked' && <Lock className="h-3 w-3" />}
              <span>Topic {t.id}</span>
              <span className="text-[10px] opacity-60 max-w-[100px] truncate">· {t.title}</span>
            </button>
          );
        })}
      </div>

      {/* Step tab bar */}
      <div className="flex items-center gap-0 bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
        {STEPS.map((s, i) => {
          const done = completedSteps.has(s.id);
          const active = step === s.id;
          const accessible = canAccess(s.id);
          return (
            <button
              key={s.id}
              onClick={() => accessible && setStep(s.id)}
              disabled={!accessible}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-colors border-r border-stone-200 last:border-r-0
                ${active ? 'bg-primary text-white' :
                  done ? 'text-primary bg-white hover:bg-stone-50' :
                  accessible ? 'text-muted-foreground bg-white hover:bg-stone-50 hover:text-foreground' :
                  'text-stone-300 bg-stone-50 cursor-not-allowed'}`}
            >
              {done && !active ? (
                <CheckCircle2 className="h-3 w-3 shrink-0" />
              ) : !accessible ? (
                <span className="h-4 w-4 rounded-full border border-stone-300 flex items-center justify-center text-[9px] font-bold text-stone-400">{i + 1}</span>
              ) : active && !done ? (
                <span className="h-4 w-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold">{i + 1}</span>
              ) : null}
              <span className="hidden sm:inline">{s.short}</span>
            </button>
          );
        })}
      </div>

      {/* ── WATCH ── */}
      {step === 'watch' && (
        <div className="space-y-4">
          {/* Video player */}
          <div className="relative rounded-2xl overflow-hidden bg-stone-900 shadow-lg" style={{ aspectRatio: '16/9' }}>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=675&fit=crop"
              alt="Lecture"
              className="w-full h-full object-cover opacity-80"
            />
            {/* Play overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30">
                <Play className="h-8 w-8 text-white fill-white ml-1" />
              </button>
            </div>
            {/* Controls bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
              {/* Progress bar */}
              <div className="h-1 bg-white/30 rounded-full mb-3 cursor-pointer">
                <div className="h-full w-0 bg-white rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="text-white/80 hover:text-white transition-colors"><SkipBack className="h-4 w-4" /></button>
                  <button className="text-white hover:text-white/80 transition-colors"><Play className="h-5 w-5 fill-white" /></button>
                  <button className="text-white/80 hover:text-white transition-colors"><SkipForward className="h-4 w-4" /></button>
                  <span className="text-white text-xs font-mono">0:00 / {topic.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-white/80 hover:text-white transition-colors"><Volume2 className="h-4 w-4" /></button>
                  <span className="text-white/80 text-xs font-semibold">1.0x</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tutor card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">{TUTOR.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{TUTOR.name}</p>
              <p className="text-xs text-muted-foreground mb-2">{TUTOR.creds}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{TUTOR.bio}</p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => goNext('watch')}
            className="w-full py-4 rounded-2xl bg-[#1a4d35] text-white font-semibold text-sm hover:bg-[#1a4d35]/90 transition-colors flex items-center justify-center gap-2"
          >
            I've watched the video — Continue to Notes <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── READ / LISTEN ── */}
      {step === 'read' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Lecture Notes</span>
              <span className="ml-auto text-xs text-muted-foreground">Read before the AI Q&A</span>
            </div>
            <div className="px-6 py-5 space-y-3 overflow-y-auto" style={{ maxHeight: 440 }}>
              {NOTES_CONTENT.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold font-serif text-foreground mt-3 mb-1">{line.replace('## ', '')}</h2>;
                if (line.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-foreground mt-3 mb-1">{line.replace('### ', '')}</h3>;
                if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-foreground">{line.replace(/\*\*/g, '')}</p>;
                if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="italic text-muted-foreground border-l-4 border-primary/30 pl-4 my-2">{line.replace(/\*/g, '')}</p>;
                if (line === '') return <div key={i} className="h-2" />;
                return <p key={i} className="text-sm text-foreground leading-relaxed">{line}</p>;
              })}
            </div>
            <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={notesRead} onChange={e => setNotesRead(e.target.checked)} className="h-4 w-4 accent-primary" />
                <span className="text-sm font-medium text-foreground">I've read and understood these notes</span>
              </label>
            </div>
          </div>
          <button onClick={() => { if (notesRead) goNext('read'); }} disabled={!notesRead}
            className="w-full py-4 rounded-2xl bg-[#1a4d35] text-white font-semibold text-sm hover:bg-[#1a4d35]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            Continue to Summary <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── SUMMARY ── */}
      {step === 'summary' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100">
              <FileText className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Topic Summary</span>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-muted-foreground mb-4">Key takeaways from this topic — use these as your revision anchor points.</p>
              {SUMMARY_POINTS.map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">{i + 1}</div>
                  <p className="text-sm text-foreground leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => goNext('summary')}
            className="w-full py-4 rounded-2xl bg-[#1a4d35] text-white font-semibold text-sm hover:bg-[#1a4d35]/90 transition-colors flex items-center justify-center gap-2">
            Continue to Research <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── RESEARCH ── */}
      {step === 'research' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100">
              <Search className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Further Research</span>
              <span className="ml-auto text-xs text-muted-foreground">Primary & secondary sources</span>
            </div>
            <div className="px-6 py-5 space-y-3">
              <p className="text-sm text-muted-foreground mb-2">Review these sources to deepen your understanding before the Q&A.</p>
              {RESEARCH.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-stone-200 hover:border-primary/30 transition-colors">
                  <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${r.type === 'Case' ? 'bg-amber-100 text-amber-800' : r.type === 'Statute' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-600'}`}>{r.type}</span>
                  <p className="text-sm text-foreground leading-relaxed">{r.ref}</p>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => goNext('research')}
            className="w-full py-4 rounded-2xl bg-[#1a4d35] text-white font-semibold text-sm hover:bg-[#1a4d35]/90 transition-colors flex items-center justify-center gap-2">
            Continue to Q&A <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Q&A ── */}
      {step === 'qa' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-primary">
              <div className="flex items-center gap-2 text-white">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">AI Q&A Coach — {completedQA.size}/{AI_QA.length} questions</span>
              </div>
              <span className="text-xs text-white/60">Answer all to unlock the quiz</span>
            </div>

            <div className="p-6 space-y-5">
              {/* Progress dots */}
              <div className="flex items-center gap-2">
                {AI_QA.map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${completedQA.has(i) ? 'bg-green-500' : i === qaIndex ? 'bg-primary' : 'bg-stone-200'}`} />
                ))}
              </div>

              {/* Question */}
              <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Question {qaIndex + 1} of {AI_QA.length}</p>
                <p className="font-semibold text-foreground leading-relaxed">{AI_QA[qaIndex].q}</p>
              </div>

              {/* Answer */}
              {showAns ? (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-4">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Model Answer</p>
                  <p className="text-sm text-foreground leading-relaxed">{AI_QA[qaIndex].a}</p>
                  <button
                    onClick={() => {
                      const newDone = new Set([...completedQA, qaIndex]);
                      setCompletedQA(newDone);
                      if (qaIndex < AI_QA.length - 1) { setQaIndex(q => q + 1); setShowAns(false); }
                      else { markDone('qa'); setStep('quiz'); }
                    }}
                    className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
                  >
                    {qaIndex < AI_QA.length - 1 ? 'Next Question →' : 'Proceed to Quiz →'}
                  </button>
                </div>
              ) : (
                <button onClick={() => setShowAns(true)}
                  className="w-full py-3 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors">
                  Reveal Model Answer
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── QUIZ ── */}
      {step === 'quiz' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Topic Quiz</span>
              </div>
              <span className="text-xs text-muted-foreground">Pass mark: 3/5 correct</span>
            </div>

            {/* Passed */}
            {quizPassed && (
              <div className="p-10 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground">Topic Complete! 🎉</h3>
                <p className="text-sm text-muted-foreground">You've passed the quiz. Topic {topic.id} is now fully unlocked and credited to your certificate progress.</p>
                <div className="flex gap-3 justify-center pt-2">
                  <button onClick={() => setLocation('/student/modules')} className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">Back to Module Library</button>
                  <button onClick={resetAll} className="px-6 py-2.5 rounded-xl border border-stone-200 text-foreground font-semibold text-sm hover:bg-stone-50 transition-colors">Revisit Topic</button>
                </div>
              </div>
            )}

            {/* Quiz failed */}
            {submitted && !quizPassed && (
              <div className="p-10 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                  <AlertCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground">Not quite — try again</h3>
                <p className="text-sm text-muted-foreground">You scored {MCQ.filter((q, i) => selected[i] === q.ans).length}/5. The topic will reset so you can re-watch and re-read before retrying.</p>
                <button onClick={resetAll} className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">Start Topic Again</button>
              </div>
            )}

            {/* Quiz form */}
            {!submitted && (
              <div className="p-6 space-y-6">
                {MCQ.map((q, qi) => (
                  <div key={qi} className="space-y-3">
                    <p className="font-semibold text-foreground text-sm">{qi + 1}. {q.q}</p>
                    <div className="space-y-2">
                      {q.opts.map((opt, oi) => (
                        <button key={oi} onClick={() => setSelected(prev => ({ ...prev, [qi]: oi }))}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors ${selected[qi] === oi ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-stone-200 text-foreground hover:border-stone-300 hover:bg-stone-50'}`}>
                          <span className="mr-2 font-bold">{['A', 'B', 'C', 'D'][oi]}.</span>{opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button
                  onClick={submitQuiz}
                  disabled={Object.keys(selected).length < MCQ.length}
                  className="w-full py-3.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
