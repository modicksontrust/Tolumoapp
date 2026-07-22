import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  CheckCircle2, Lock, ChevronLeft, ChevronRight, ChevronDown,
  Play, Pause, SkipBack, SkipForward, Volume2,
  MessageCircle, Search, AlertCircle,
  Headphones, BookOpen, Scale, FileText, Gavel, Newspaper,
  Clock, Plus, XCircle, RefreshCw, Info,
} from 'lucide-react';

// ── Module & topics ────────────────────────────────────────────────────────────
const MODULE = { code: 'LAW 201', name: 'Constitutional Law 201', tutor: 'Prof. Oluwaseun Adeyemi' };

const TOPICS = [
  { id: 1, title: 'Introduction to Nigerian Legal System',  status: 'current' as const, duration: '47:23' },
  { id: 2, title: 'Separation of Powers',                   status: 'done'    as const, duration: '38:55' },
  { id: 3, title: 'Federalism & Devolution of Powers',      status: 'locked'  as const, duration: '52:10' },
  { id: 4, title: 'Fundamental Rights under Chapter IV',    status: 'locked'  as const, duration: '41:30' },
];

const TUTOR = {
  initials: 'OA',
  name: 'Prof. Oluwaseun Adeyemi',
  creds: 'LL.B (Hons), LL.M, PhD · Founding Lecturer',
  bio: "In this lecture, we explore the constitutional foundations of Nigerian federalism — examining Sections 2–4 of the CFRN 1999 and the distribution of legislative powers through the Second Schedule's Exclusive and Concurrent Lists.",
};

// ── Read / Listen ──────────────────────────────────────────────────────────────
const NOTES_SECTIONS = [
  {
    heading: '1. Nature of the Nigerian Federal State',
    paragraphs: [
      'Nigeria operates a federal system of government as expressly stated in Section 2(2) of the Constitution of the Federal Republic of Nigeria 1999 (as amended): "Nigeria shall be a Federation consisting of States and a Federal Capital Territory."',
      'The distinguishing feature of federalism is the constitutional distribution of powers between the central (federal) government and the component units (states), with each deriving its authority independently from the Constitution itself — not from the other tier.',
    ],
  },
  {
    heading: '2. Legislative Powers Under Section 4',
    paragraphs: [
      'Section 4 of the CFRN is the cornerstone provision for legislative competence. It vests legislative powers in the National Assembly (s. 4(1)) and State Houses of Assembly (s. 4(6)) respectively.',
    ],
    keyProvision: '"The National Assembly shall have power to make laws for the peace, order and good government of the Federation with respect to any matter included in the Exclusive Legislative List set out in Part I of the Second Schedule…" — Section 4(2), CFRN 1999',
  },
  {
    heading: '3. The Legislative Lists',
    paragraphs: [
      'The Second Schedule contains two lists that distribute legislative competence between the federal and state tiers.',
      'Part I — Exclusive Legislative List: 68 items on which only the National Assembly may legislate (defence, currency, customs, aviation, petroleum). States have no competence here.',
      'Part II — Concurrent Legislative List: 30 items where both tiers may legislate (education, electricity, health, road traffic). Federal law prevails on any conflict (s. 4(5)).',
      'Residual Powers: Matters not listed in either schedule vest exclusively in State Houses of Assembly.',
    ],
  },
  {
    heading: '4. The Inconsistency Clause — Section 4(5)',
    paragraphs: [
      '"If any Law enacted by the House of Assembly of a State is inconsistent with any law validly made by the National Assembly, the law made by the National Assembly shall prevail, and that other Law shall to the extent of its inconsistency be void."',
      'Two inconsistency tests apply: (1) Impossibility — is simultaneous compliance with both laws impossible? (2) Covering the Field — has Federal Parliament legislated so comprehensively as to impliedly exclude State legislation on the same matter?',
    ],
  },
];

// ── Summary ────────────────────────────────────────────────────────────────────
const LEARNING_OUTCOMES = [
  'Define federalism and explain its distinguishing features from unitary systems',
  "Describe the constitutional basis of Nigeria's federal structure under Section 2(2) CFRN 1999",
  'Distinguish between the Exclusive List, Concurrent List, and Residual Powers under Section 4',
  "Apply the 'covering the field' doctrine to resolve conflicts between federal and state legislation",
  "Analyse the significance of A.-G. Ogun State v A.-G. Federation (1982) to Nigerian federalism",
];

const KEY_CONCEPTS = [
  { term: 'Federalism', def: 'Constitutional distribution of powers between a central government and component units, each deriving authority directly from the Constitution.' },
  { term: 'Exclusive Legislative List', def: 'Part I, Second Schedule, CFRN — 68 items on which only the National Assembly may legislate (e.g. defence, aviation, currency).' },
  { term: 'Concurrent List', def: 'Part II, Second Schedule — 30 items on which both federal and state legislatures may legislate; federal law prevails on conflict (s. 4(5)).' },
  { term: 'Residual Powers', def: 'Any matter not on either list falls to State Houses of Assembly — a core feature of Nigerian federalism.' },
  { term: 'Covering the Field', def: "Where federal legislation comprehensively regulates a concurrent-list matter, it 'covers the field' and renders inconsistent state legislation inoperative." },
  { term: 'Section 4(5) CFRN', def: '"If any law enacted by the House of Assembly of a State is inconsistent with any law validly made by the National Assembly, the law made by the National Assembly shall prevail..."' },
];

const SELF_CHECK = [
  'Can you name the three lists and give two examples from each?',
  'What happens when federal and state laws conflict on the Concurrent List?',
  'Why is A.-G. Ogun State v A.-G. Federation significant?',
  'What does Section 2(2) CFRN establish?',
];

// ── Research ───────────────────────────────────────────────────────────────────
const TRIAX_LIBRARY = {
  cases: [
    { name: 'A.-G. Ogun State v A.-G. Federation', citation: '(1982) 3 NCLR 166' },
    { name: 'Tukur v Government of Gongola State', citation: '(1989) 4 NWLR (Pt 117) 517' },
    { name: 'General Sani Abacha v Gani Fawehinmi', citation: '(2000) 6 NWLR (Pt 660) 228' },
  ],
  laws: [
    { name: 'CFRN 1999', desc: 'Constitution of the Federal Republic of Nigeria 1999' },
    { name: 'LUA 1978', desc: 'Land Use Act 1978' },
  ],
  court: [{ name: 'Supreme Court Rules 2014' }],
  judgements: [{ name: 'Okeke v Federal Republic of Nigeria — Digital Evidence Admissibility', court: 'Supreme Court of Nigeria · 11 April 2023' }],
  journals: [
    { name: 'The Doctrine of Covering the Field in Nigerian Federalism', by: 'Prof. T.O. Elias · Nigerian Law Journal' },
    { name: 'Domestication of International Human Rights Treaties in Nigeria', by: 'Prof. B.O. Nwabueze · University of Lagos Law Review' },
  ],
  textbooks: [{ name: 'Nigerian Constitutional Law', by: 'Prof. B.O. Nwabueze' }],
};

const RESEARCH_QUESTIONS = [
  "How has the Supreme Court applied 'covering the field' after 1982?",
  'What items are on the Exclusive List relevant to technology and communications?',
  'How do other federal constitutions handle concurrent-list conflicts?',
  'What is the effect of Section 315 CFRN on existing laws?',
];

// ── Q&A ────────────────────────────────────────────────────────────────────────
const AI_QA = [
  { q: 'What is the effect of s.4(5) of the 1999 Constitution?', a: 'Section 4(5) provides that where a State law is inconsistent with a valid Act of the National Assembly, the Federal law prevails and the State law is void to the extent of the inconsistency — the Federal Supremacy Clause.' },
  { q: 'Name the two parts of the Second Schedule.', a: 'Part I: Exclusive Legislative List (68 items — Federal only). Part II: Concurrent Legislative List (30 items — both Federal and State, Federal prevails on conflict).' },
  { q: 'What are residual powers?', a: 'Legislative matters not listed in either Schedule. They vest exclusively in States by exclusion from the Federal lists — States may legislate freely on these matters.' },
  { q: "Apply the 'covering the field' doctrine to a State education regulation.", a: "Education is on the Concurrent List. If the National Assembly has enacted a comprehensive education statute occupying the field, a conflicting State education law is void under s.4(5) — the Federal law is deemed to have 'covered the field'." },
  { q: 'What test is used to determine inconsistency under s.4(5)?', a: 'Two tests: (1) Impossibility — is it impossible to obey both laws simultaneously? (2) Occupied field — has Federal Parliament legislated so comprehensively as to impliedly exclude State legislation?' },
];

// ── Quiz ───────────────────────────────────────────────────────────────────────
const MCQ = [
  {
    q: 'In a federal state, legislative powers are typically:',
    opts: ['Concentrated in the central government', 'Distributed between central and component units', 'Held exclusively by state governments', 'Determined by the judiciary'],
    ans: 1,
  },
  {
    q: 'Which Chapter of the 1999 CFRN deals with Fundamental Rights?',
    opts: ['Chapter I', 'Chapter II', 'Chapter III', 'Chapter IV'],
    ans: 3,
  },
  {
    q: 'The Exclusive Legislative List in Nigeria is contained in:',
    opts: ['Section 4 and Part I of the Second Schedule', 'Section 5 and Part II of the First Schedule', 'Section 6 and Part III', 'Section 7 and Part IV'],
    ans: 0,
  },
  {
    q: 'Which provision grants the National Assembly power to legislate on the Exclusive List?',
    opts: ['Section 3', 'Section 4(2)', 'Section 5(1)', 'Section 6(4)'],
    ans: 1,
  },
  {
    q: 'Residual legislative powers in Nigeria are exercised by:',
    opts: ['The National Assembly', 'The President', 'The Judiciary', 'State Houses of Assembly'],
    ans: 3,
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(s: number) {
  const m = Math.floor(s / 60), ss = s % 60;
  return `${m}:${ss.toString().padStart(2, '0')}`;
}

// ── Step config ────────────────────────────────────────────────────────────────
type StepId = 'watch' | 'read' | 'summary' | 'research' | 'qa' | 'quiz';
const STEPS: { id: StepId; label: string }[] = [
  { id: 'watch',    label: 'Watch' },
  { id: 'read',     label: 'Read / Listen' },
  { id: 'summary',  label: 'Summary' },
  { id: 'research', label: 'Research' },
  { id: 'qa',       label: 'Q&A' },
  { id: 'quiz',     label: 'Quiz' },
];

// ── Main component ─────────────────────────────────────────────────────────────
export default function CurrentTopic() {
  const [, setLocation] = useLocation();
  const [currentTopicId, setCurrentTopicId] = useState(1);
  const [step, setStep] = useState<StepId>('watch');
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());

  // Watch
  const [playing, setPlaying] = useState(false);

  // Read
  const [notesRead, setNotesRead] = useState(false);

  // Research
  const [expandedQ, setExpandedQ] = useState<number | null>(null);

  // Q&A
  const [qaIndex, setQaIndex] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const [completedQA, setCompletedQA] = useState<Set<number>>(new Set());

  // Quiz
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizSecs, setQuizSecs] = useState(590); // 9:50

  useEffect(() => {
    if (step !== 'quiz' || submitted) return;
    if (quizSecs <= 0) return;
    const t = setInterval(() => setQuizSecs(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [step, submitted, quizSecs]);

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

  const submitQuiz = () => {
    const correct = MCQ.filter((q, i) => selected[i] === q.ans).length;
    setSubmitted(true);
    if (correct >= 3) { setQuizPassed(true); markDone('quiz'); }
  };

  const resetAll = () => {
    setSelected({}); setSubmitted(false); setQuizPassed(false);
    setCompletedSteps(new Set()); setStep('watch');
    setQaIndex(0); setShowAns(false); setCompletedQA(new Set());
    setNotesRead(false); setPlaying(false); setQuizSecs(590);
  };

  const topic = TOPICS.find(t => t.id === currentTopicId) || TOPICS[0];

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
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
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
      <div className="flex items-center bg-white border border-stone-200 rounded-xl overflow-hidden shadow-sm">
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
              {done && !active
                ? <CheckCircle2 className="h-3 w-3 shrink-0" />
                : <span className={`h-4 w-4 rounded-full border flex items-center justify-center text-[9px] font-bold
                    ${active ? 'border-white text-white' : accessible ? 'border-stone-400 text-stone-500' : 'border-stone-300 text-stone-300'}`}>{i + 1}</span>
              }
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══ WATCH ══ */}
      {step === 'watch' && (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-stone-900 shadow-lg" style={{ aspectRatio: '16/9' }}>
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=675&fit=crop"
              alt="Lecture"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => setPlaying(p => !p)}
                className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors border border-white/30"
              >
                {playing
                  ? <Pause className="h-7 w-7 text-white fill-white" />
                  : <Play  className="h-7 w-7 text-white fill-white ml-1" />}
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
              <div className="h-1 bg-white/30 rounded-full mb-3">
                <div className="h-full w-0 bg-white rounded-full" />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button className="text-white/80 hover:text-white"><SkipBack className="h-4 w-4" /></button>
                  <button onClick={() => setPlaying(p => !p)} className="text-white hover:text-white/80">
                    {playing ? <Pause className="h-5 w-5 fill-white" /> : <Play className="h-5 w-5 fill-white" />}
                  </button>
                  <button className="text-white/80 hover:text-white"><SkipForward className="h-4 w-4" /></button>
                  <span className="text-white text-xs font-mono">0:00 / {topic.duration}</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-white/80 hover:text-white"><Volume2 className="h-4 w-4" /></button>
                  <span className="text-white/80 text-xs font-semibold">1.0x</span>
                </div>
              </div>
            </div>
          </div>

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

          <button onClick={() => goNext('watch')}
            className="w-full py-4 rounded-2xl bg-[#1a4d35] text-white font-semibold text-sm hover:bg-[#1a4d35]/90 transition-colors flex items-center justify-center gap-2">
            I've watched the video — Continue to Notes <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ══ READ / LISTEN ══ */}
      {step === 'read' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            {/* Auto-read bar */}
            <div className="flex items-center gap-3 px-5 py-3 border-b border-stone-100 bg-stone-50">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Headphones className="h-4 w-4 text-primary" />
              </div>
              <span className="font-semibold text-foreground text-sm">Auto Read — Lecture Notes</span>
              <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-mono font-semibold text-foreground">18:40</span>
                <span>1×</span>
                <Volume2 className="h-4 w-4" />
              </div>
            </div>

            {/* Notes content */}
            <div className="px-6 py-5 overflow-y-auto space-y-6" style={{ maxHeight: 480 }}>
              {NOTES_SECTIONS.map((sec, si) => (
                <div key={si} className="space-y-3">
                  <h3 className="font-bold text-[#1a4d35] text-base">{sec.heading}</h3>
                  {sec.paragraphs.map((p, pi) => (
                    <p key={pi} className="text-sm text-foreground leading-relaxed">{p}</p>
                  ))}
                  {sec.keyProvision && (
                    <div className="rounded-xl bg-amber-50 border border-amber-100 px-5 py-4 mt-2">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700 mb-2">Key Provision</p>
                      <p className="text-sm text-foreground leading-relaxed italic">{sec.keyProvision}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => { setNotesRead(true); goNext('read'); }}
            className="w-full py-4 rounded-2xl bg-[#1a4d35] text-white font-semibold text-sm hover:bg-[#1a4d35]/90 transition-colors flex items-center justify-center gap-2">
            Notes read — See Topic Summary <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ══ SUMMARY ══ */}
      {step === 'summary' && (
        <div className="space-y-4">
          {/* Dark-green header card */}
          <div className="rounded-2xl bg-[#1a4d35] px-7 py-6 text-white">
            <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">Topic {topic.id}</p>
            <h2 className="text-xl font-serif font-bold mb-1">{topic.title}</h2>
            <p className="text-sm opacity-70">{MODULE.name} · {MODULE.tutor.replace('Prof. ', 'Prof. ')}</p>
          </div>

          {/* Learning outcomes */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Learning Outcomes — You Should Now Be Able To</p>
            {LEARNING_OUTCOMES.map((o, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{o}</p>
              </div>
            ))}
          </div>

          {/* Key Concepts 2-col grid */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Key Concepts</p>
            <div className="grid grid-cols-2 gap-3">
              {KEY_CONCEPTS.map((c, i) => (
                <div key={i} className="rounded-xl border border-stone-200 p-4 space-y-1">
                  <p className="font-semibold text-foreground text-sm">{c.term}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.def}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Landmark Case */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 border-l-4 border-l-amber-400">
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">Landmark Case</p>
            <p className="font-semibold text-foreground mb-2">A.-G. Ogun State v A.-G. Federation (1982) 3 NCLR 166</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Established the 'covering the field' doctrine in Nigeria. Held that where federal legislation comprehensively covers a concurrent-list matter, state legislation on that same matter is inoperative to the extent of any inconsistency — even if the state law predates the federal.
            </p>
          </div>

          {/* Key Provision to Memorise */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Key Provision to Memorise</p>
            <p className="text-sm text-foreground leading-relaxed">
              "The National Assembly shall have power to make laws for the peace, order and good government of the Federation with respect to any matter included in the Exclusive Legislative List..." — <strong>Section 4(2), CFRN 1999</strong>
            </p>
          </div>

          {/* Self-check */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Before You Research — Quick Self-Check</p>
            <div className="space-y-2">
              {SELF_CHECK.map((q, i) => (
                <p key={i} className="text-sm text-foreground"><span className="font-bold">Q{i + 1}.</span> {q}</p>
              ))}
            </div>
          </div>

          <button onClick={() => goNext('summary')}
            className="w-full py-4 rounded-2xl bg-[#1a4d35] text-white font-semibold text-sm hover:bg-[#1a4d35]/90 transition-colors flex items-center justify-center gap-2">
            Summary reviewed — Start Research <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ══ RESEARCH ══ */}
      {step === 'research' && (
        <div className="space-y-4">
          {/* Intro card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex items-start gap-4">
            <div className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Research Step</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Before moving to Q&A, explore the cases, laws, and materials referenced in this topic. Use the Triax Law Library below to read case holdings, study key legislation, and review recommended judgements. Deep research now makes your Q&A session far more effective.
              </p>
            </div>
          </div>

          {/* Triax Law Library */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm">TRIAX LAW LIBRARY</p>
                  <p className="text-xs text-muted-foreground">Cases, laws &amp; resources referenced in this topic</p>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="px-5 py-4 space-y-5">
              {/* Cases */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Cases Referenced</p>
                <div className="space-y-1">
                  {TRIAX_LIBRARY.cases.map((c, i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b border-stone-100 last:border-b-0">
                      <div className="h-7 w-7 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                        <Scale className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.citation}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-stone-300 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Relevant Laws */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Relevant Laws</p>
                <div className="space-y-1">
                  {TRIAX_LIBRARY.laws.map((l, i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b border-stone-100 last:border-b-0">
                      <div className="h-7 w-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <FileText className="h-3.5 w-3.5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{l.name}</p>
                        <p className="text-xs text-muted-foreground">{l.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-stone-300 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Rules of Court */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Rules of Court</p>
                {TRIAX_LIBRARY.court.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5">
                    <div className="h-7 w-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                      <Gavel className="h-3.5 w-3.5 text-stone-500" />
                    </div>
                    <p className="flex-1 text-sm font-medium text-foreground">{r.name}</p>
                    <ChevronRight className="h-4 w-4 text-stone-300 shrink-0" />
                  </div>
                ))}
              </div>

              {/* Recommended Judgements */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Recommended Judgements</p>
                {TRIAX_LIBRARY.judgements.map((j, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5">
                    <div className="h-7 w-7 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                      <Scale className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground leading-tight">{j.name}</p>
                      <p className="text-xs text-muted-foreground">{j.court}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-stone-300 shrink-0" />
                  </div>
                ))}
              </div>

              {/* Related Journals */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Related Journals</p>
                <div className="space-y-1">
                  {TRIAX_LIBRARY.journals.map((j, i) => (
                    <div key={i} className="flex items-center gap-3 py-2.5 border-b border-stone-100 last:border-b-0">
                      <div className="h-7 w-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                        <Newspaper className="h-3.5 w-3.5 text-stone-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground leading-tight">{j.name}</p>
                        <p className="text-xs text-muted-foreground">{j.by}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-stone-300 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Textbooks */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Textbooks</p>
                {TRIAX_LIBRARY.textbooks.map((b, i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5">
                    <div className="h-7 w-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                      <BookOpen className="h-3.5 w-3.5 text-stone-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.by}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-stone-300 shrink-0" />
                  </div>
                ))}
              </div>

              {/* Open Library link */}
              <button className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
                <Plus className="h-3.5 w-3.5" /> Open Full Library
              </button>
            </div>
          </div>

          {/* Suggested Research Questions */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Suggested Research Questions</p>
            </div>
            <div className="divide-y divide-stone-100">
              {RESEARCH_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setExpandedQ(expandedQ === i ? null : i)}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-left hover:bg-stone-50 transition-colors"
                >
                  <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <p className="flex-1 text-sm text-foreground leading-relaxed">{q}</p>
                  <ChevronRight className="h-4 w-4 text-stone-300 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <button onClick={() => goNext('research')}
              className="flex-1 py-4 rounded-2xl bg-[#1a4d35] text-white font-semibold text-sm hover:bg-[#1a4d35]/90 transition-colors flex items-center justify-center gap-2">
              Research done — Start Q&A <ChevronRight className="h-4 w-4" />
            </button>
            <button onClick={() => { markDone('research'); markDone('qa'); setStep('quiz'); }}
              className="px-5 py-4 rounded-2xl border border-stone-300 text-foreground font-semibold text-sm hover:bg-stone-50 transition-colors whitespace-nowrap">
              Skip to Quiz →
            </button>
          </div>
          <button className="w-full flex items-center justify-center gap-2 py-3 text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Open Full Library
          </button>
        </div>
      )}

      {/* ══ Q&A ══ */}
      {step === 'qa' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 bg-primary">
              <div className="flex items-center gap-2 text-white">
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold">AI Q&A Coach — {completedQA.size}/{AI_QA.length} questions</span>
              </div>
              <span className="text-xs text-white/60">Answer all to unlock the quiz</span>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-2">
                {AI_QA.map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${completedQA.has(i) ? 'bg-green-500' : i === qaIndex ? 'bg-primary' : 'bg-stone-200'}`} />
                ))}
              </div>
              <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Question {qaIndex + 1} of {AI_QA.length}</p>
                <p className="font-semibold text-foreground leading-relaxed">{AI_QA[qaIndex].q}</p>
              </div>
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
                    className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
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

      {/* ══ QUIZ ══ */}
      {step === 'quiz' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            {/* Quiz header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div>
                <p className="font-semibold text-foreground">Topic Quiz — Part I: Multiple Choice</p>
                <p className="text-xs text-muted-foreground mt-0.5">Select the best answer for each question. Once you pass, you can rewatch this topic's video freely.</p>
              </div>
              {!submitted && (
                <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-foreground shrink-0 ml-4">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {fmt(quizSecs)}
                </div>
              )}
            </div>

            {/* Passed */}
            {quizPassed && (
              <div className="p-10 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground">Topic Complete! 🎉</h3>
                <p className="text-sm text-muted-foreground">You've passed the quiz. Topic {topic.id} is now fully credited to your certificate progress.</p>
                <div className="flex gap-3 justify-center pt-2">
                  <button onClick={() => setLocation('/student/modules')} className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">Back to Module Library</button>
                  <button onClick={resetAll} className="px-6 py-2.5 rounded-xl border border-stone-200 text-foreground font-semibold text-sm hover:bg-stone-50 transition-colors">Revisit Topic</button>
                </div>
              </div>
            )}

            {/* Failed — detailed review */}
            {submitted && !quizPassed && (() => {
              const score = MCQ.filter((q, i) => selected[i] === q.ans).length;
              return (
                <div className="p-6 space-y-4">
                  {/* Score header */}
                  <div className="flex flex-col items-center gap-2 py-4">
                    <div className="h-14 w-14 rounded-full bg-red-100 flex items-center justify-center">
                      <XCircle className="h-7 w-7 text-red-500" />
                    </div>
                    <p className="text-2xl font-serif font-bold text-foreground">{score}/5 Correct</p>
                    <p className="text-sm text-muted-foreground">Not quite — review the answers below and try again.</p>
                  </div>

                  {/* Per-question result cards */}
                  <div className="space-y-2">
                    {MCQ.map((q, qi) => {
                      const correct = selected[qi] === q.ans;
                      return (
                        <div key={qi} className={`rounded-xl px-4 py-3 border ${correct ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                          <p className={`text-sm font-semibold mb-1.5 ${correct ? 'text-green-900' : 'text-red-900'}`}>{q.q}</p>
                          <p className="text-xs text-green-700 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 shrink-0" />
                            Correct: {q.opts[q.ans]}
                          </p>
                          {!correct && selected[qi] !== undefined && (
                            <p className="text-xs text-red-600 flex items-center gap-1 mt-0.5">
                              <XCircle className="h-3 w-3 shrink-0" />
                              Your answer: {q.opts[selected[qi]]}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Warning */}
                  <div className="rounded-xl bg-amber-50 border border-amber-100 px-5 py-4 flex items-start gap-3">
                    <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800 leading-relaxed text-center">
                      You need 3/5 to pass. You must retake this topic from the beginning — watch the video, review notes, and complete the Q&A before attempting the test again.
                    </p>
                  </div>

                  {/* Retake button */}
                  <button onClick={resetAll}
                    className="w-full py-4 rounded-2xl bg-[#1a4d35] text-white font-semibold text-sm hover:bg-[#1a4d35]/90 transition-colors flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4" /> Retake Topic from Beginning
                  </button>
                </div>
              );
            })()}

            {/* Quiz form */}
            {!submitted && (
              <div className="p-6 space-y-7">
                {MCQ.map((q, qi) => (
                  <div key={qi} className="space-y-3">
                    <p className="font-semibold text-foreground text-sm">{qi + 1}. {q.q}</p>
                    <div className="space-y-2">
                      {q.opts.map((opt, oi) => (
                        <button
                          key={oi}
                          onClick={() => setSelected(prev => ({ ...prev, [qi]: oi }))}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-colors flex items-center gap-3
                            ${selected[qi] === oi ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-stone-200 text-foreground hover:border-stone-300 hover:bg-stone-50'}`}
                        >
                          <span className={`h-4 w-4 rounded-full border-2 shrink-0 flex items-center justify-center
                            ${selected[qi] === oi ? 'border-primary' : 'border-stone-300'}`}>
                            {selected[qi] === oi && <span className="h-2 w-2 rounded-full bg-primary block" />}
                          </span>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {!submitted && (
            <button
              onClick={submitQuiz}
              className="w-full py-4 rounded-2xl bg-stone-200 text-stone-500 font-bold text-sm transition-colors disabled:cursor-not-allowed
                enabled:bg-[#1a4d35] enabled:text-white enabled:hover:bg-[#1a4d35]/90"
              disabled={false}
            >
              Submit Answers ({Object.keys(selected).length}/5 answered)
            </button>
          )}
        </div>
      )}
    </div>
  );
}
