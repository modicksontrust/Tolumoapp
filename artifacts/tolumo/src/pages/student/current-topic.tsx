import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import {
  CheckCircle2, Lock, ChevronLeft, ChevronRight, ChevronDown,
  Play, Pause, SkipBack, SkipForward, Volume2,
  MessageCircle, Search, AlertCircle,
  Headphones, BookOpen, Scale, FileText, Gavel, Newspaper,
  Clock, Plus, XCircle, RefreshCw, Info, X,
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

// ── Research — bridge screen items (will be pulled live from LawPavilion API once integration is confirmed) ──
const TOPIC_REFERENCES: { type: 'case' | 'statute'; name: string; detail: string }[] = [
  { type: 'case',    name: 'A.-G. Ogun State v A.-G. Federation',       detail: '(1982) 3 NCLR 166 — leading authority on covering the field' },
  { type: 'case',    name: 'Tukur v Government of Gongola State',        detail: '(1989) 4 NWLR (Pt 117) 517 — concurrent-list conflict' },
  { type: 'case',    name: 'General Sani Abacha v Gani Fawehinmi',       detail: '(2000) 6 NWLR (Pt 660) 228 — international treaty domestication' },
  { type: 'statute', name: 'Constitution of the Federal Republic of Nigeria 1999', detail: 'Sections 4, 12 & Second Schedule' },
  { type: 'statute', name: 'Land Use Act 1978',                          detail: 'Cap. L5, LFN 2004 — property rights under federalism' },
];

// Full library feature list (shown inside "Explore Full Library" modal)
const FULL_LIBRARY_FEATURES = [
  'Appellate Law Reports — Supreme Court & Court of Appeal',
  'Index & Digest (1960 to date)',
  'Laws of the Federation',
  'Rules of Court',
  'Latest Judgments with alerts',
  'Textbooks & Journals',
  'Unlimited Search',
  'My Practice Notes',
  'Legal Analytics',
  'Annotated Laws of the Federation',
  'Commercial Law Report',
];

// ── Q&A — AI knowledge base (grounded in NOTES_SECTIONS & KEY_CONCEPTS) ────────
const STUDENT_NAME = 'Chisom'; // will come from auth context once wired

type QaRule = { keywords: RegExp; response: string };

const QA_RULES: QaRule[] = [
  {
    keywords: /\bfederal(ism|ist)?\b|federal state|federal system|what is federalism/i,
    response: `Federalism, as we covered, is the constitutional distribution of legislative and executive powers between a central (federal) government and component units — the States — where each tier derives its authority *directly* from the Constitution, not from the other. Section 2(2) CFRN 1999 expressly declares Nigeria a federation: "Nigeria shall be a Federation consisting of States and a Federal Capital Territory." The key distinguishing feature is that neither tier is subordinate to the other in its own sphere; both draw their legitimacy from the same supreme document.`,
  },
  {
    keywords: /section 2|s\.?\s*2\(2\)|s2|nature of|nigerian federal/i,
    response: `Section 2(2) CFRN 1999 is the foundational provision — it expressly constitutes Nigeria as a federation: "Nigeria shall be a Federation consisting of States and a Federal Capital Territory." This is significant because it means the federal structure is *entrenched* in the Constitution itself, not created by ordinary legislation. Neither the Federal Government nor any State can unilaterally alter or dissolve the federation.`,
  },
  {
    keywords: /section 4|s\.?\s*4\b|legislative power|power to make law|national assembly.*power|competenc/i,
    response: `Section 4 is the cornerstone of legislative competence under the CFRN. Section 4(1) vests general federal legislative power in the National Assembly, while Section 4(6) does the same for State Houses of Assembly. The critical division flows from the Second Schedule: the National Assembly has *exclusive* power over Part I items (s. 4(2)), *concurrent* power with States over Part II items (s. 4(4)), and States legislate freely on residual matters. The Federal Supremacy Clause in s. 4(5) resolves any concurrent-list conflicts in favour of federal law.`,
  },
  {
    keywords: /exclusive list|exclusive legislative|part i|part 1|68 items|defence|aviation|currency|petroleum|customs/i,
    response: `The Exclusive Legislative List is found in Part I of the Second Schedule to the CFRN 1999. It contains 68 items — things like defence, currency, customs and excise, aviation, petroleum, and nuclear energy — on which *only* the National Assembly may legislate. State Houses of Assembly have zero competence on these matters, regardless of how much local interest there might be. If a State purports to legislate on an exclusive-list item, that law is void from the outset.`,
  },
  {
    keywords: /concurrent list|concurrent legislative|part ii|part 2|30 items|education|electricity|health|road traffic/i,
    response: `The Concurrent Legislative List is in Part II of the Second Schedule. It covers 30 items — education, electricity, health, road traffic, and others — where *both* the National Assembly and State Houses of Assembly may legislate. The catch is Section 4(5): whenever there is a conflict between a valid federal law and a State law on a concurrent-list item, the federal law prevails and the State law is void to the extent of the inconsistency. This is where the "covering the field" doctrine does its work.`,
  },
  {
    keywords: /residual|matters not listed|not on (either|the) list|state.*exclusive|state alone|state only/i,
    response: `Residual powers are a fascinating feature of Nigerian federalism. Any legislative matter that does *not* appear in either the Exclusive List (Part I) or the Concurrent List (Part II) of the Second Schedule falls *exclusively* to the State Houses of Assembly by virtue of their exclusion from the federal lists. No statute explicitly states this — it flows from the constitutional structure itself. So States actually have a wide sphere of residual competence, which includes many purely local matters the Constitution never bothered to enumerate.`,
  },
  {
    keywords: /4\(5\)|s\.?\s*4\s*\(5\)|inconsisten|federal.*prevail|state law.*void|supremacy clause/i,
    response: `Section 4(5) is the Federal Supremacy Clause: "If any Law enacted by the House of Assembly of a State is inconsistent with any law validly made by the National Assembly, the law made by the National Assembly shall prevail, and that other Law shall to the extent of its inconsistency be void." Two things to note: (1) the federal law must be *validly* made — a federal law made outside the National Assembly's competence cannot override a State law; (2) the State law is only void "to the extent of its inconsistency" — it may remain operative in parts that do not conflict.`,
  },
  {
    keywords: /cover(ing)? the field|occupied field|impliedly exclud|doctrine.*cover|cover.*doctrine/i,
    response: `"Covering the field" is one of the two inconsistency tests under s. 4(5). It asks: has the National Assembly legislated so *comprehensively* on a concurrent-list matter that it has impliedly left no room for State legislation? If yes, any State law on the same matter — even one that does not directly contradict the federal law — is void because the federal legislature has occupied the entire field. The leading authority is *A.-G. Ogun State v A.-G. Federation* (1982) 3 NCLR 166, where the Supreme Court applied this doctrine to invalidate a State revenue law that encroached on an area comprehensively covered by federal legislation.`,
  },
  {
    keywords: /impossibility|two tests|test.*inconsisten|inconsisten.*test|simultaneous/i,
    response: `The two tests for inconsistency under s. 4(5) are: (1) **Impossibility** — is it *impossible* to comply with both the federal and State law simultaneously? If obeying one necessarily means breaking the other, they are inconsistent and the federal law prevails. (2) **Covering the Field** — even without direct conflict, has the National Assembly legislated so comprehensively on a concurrent-list matter that it has impliedly excluded State legislation? Both tests were discussed in *A.-G. Ogun State v A.-G. Federation* (1982). You need to be able to apply both to a hypothetical — expect that in the test.`,
  },
  {
    keywords: /AG ogun|ogun.*federation|federation.*ogun|1982.*nclr|abacha.*fawehinmi|fawehinmi|tukur.*gongola|gongola|cases|leading case|authority/i,
    response: `We covered three key cases in this topic: (1) *A.-G. Ogun State v A.-G. Federation* (1982) 3 NCLR 166 — the leading authority on the "covering the field" doctrine and the operation of s. 4(5). (2) *Tukur v Government of Gongola State* (1989) 4 NWLR (Pt 117) 517 — on concurrent-list conflicts. (3) *General Sani Abacha v Gani Fawehinmi* (2000) 6 NWLR (Pt 660) 228 — on the domestication of international treaties under s. 12 CFRN, which is relevant to legislative competence in the international sphere. The examiner typically expects you to be precise with citations, so practise those.`,
  },
  {
    keywords: /second schedule|schedule.*cfrn|cfrn.*schedule/i,
    response: `The Second Schedule to the CFRN 1999 is the backbone of legislative power distribution in Nigeria. Part I contains the Exclusive Legislative List (68 items — federal only). Part II contains the Concurrent Legislative List (30 items — federal and State, with federal supremacy on conflict under s. 4(5)). Anything *outside* both lists is residual — State competence by default. When answering problem questions, always identify which Schedule and Part applies to the subject matter before applying s. 4(5).`,
  },
  {
    keywords: /unitary|difference.*federal|federal.*difference|compar/i,
    response: `In a *unitary* system, all power originates from the centre and subordinate units exercise only what the centre delegates — it can be withdrawn. In a *federal* system like Nigeria's, both tiers derive their authority *directly* from the Constitution, independently of each other. Neither can abolish or curtail the other's constitutionally guaranteed sphere. That independence is why we say each tier is a "co-ordinate" authority, not a subordinate one. Section 2(2) CFRN locks this in at the constitutional level.`,
  },
];

const QA_CONFUSION_ESCALATION = `I can see you're working through this carefully — that's exactly the right instinct. If this particular concept is still not clicking after the test, I'd strongly encourage you to book a one-on-one session with the lecturer directly. The "Book a Tutor Session" option is in your portal. Sometimes a live explanation makes all the difference.`;

const QA_OFF_TOPIC = `That's an interesting question, but it falls outside what we've covered in this specific topic — and I want to make sure I don't confuse you with material outside the lecturer's notes before your test. Let's stay focused on Federalism and the Distribution of Legislative Powers for now. Is there anything from the lecture — the lists, the cases, Section 4(5), the inconsistency tests — that you'd like to go over?`;

const QA_FALLBACK = `That's a fair question — let me think about how to frame it clearly. The topic covers Nigeria's federal structure under the CFRN 1999, specifically: Section 2(2) and what it establishes, Section 4 and the distribution of legislative powers, the Exclusive List, the Concurrent List, residual powers, Section 4(5) and its two inconsistency tests, and the key cases. Which of these would you like me to unpack further?`;

function getAIResponse(input: string, confusionCount: number): { text: string; isConfused: boolean } {
  const lower = input.toLowerCase();
  // Check for confusion signals
  const confusedSignals = /don'?t (get|understand)|confused|lost|not (sure|clear)|still (don'?t|not)|what do(es)? (that|this) mean|can you (explain|clarify)|huh\b|unclear|i'?m? (stuck|struggling)/i;
  const isConfused = confusedSignals.test(input);

  // Match against knowledge base
  for (const rule of QA_RULES) {
    if (rule.keywords.test(input)) {
      const base = rule.response;
      if (isConfused && confusionCount >= 1) {
        return { text: base + '\n\n' + QA_CONFUSION_ESCALATION, isConfused: true };
      }
      return { text: base, isConfused };
    }
  }

  // Off-topic check (simple heuristic — asks about something clearly unrelated)
  const offTopicSignals = /criminal law|tort|contract|land law|equity|evidence|jurisprudence|history of law|roman law|company law|tax|ip |intellectual property|family law|cyber|banking/i;
  if (offTopicSignals.test(lower)) {
    return { text: QA_OFF_TOPIC, isConfused: false };
  }

  // Fallback
  if (isConfused && confusionCount >= 1) {
    return { text: QA_FALLBACK + '\n\n' + QA_CONFUSION_ESCALATION, isConfused: true };
  }
  return { text: QA_FALLBACK, isConfused };
}

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
  const [showFullLibrary, setShowFullLibrary] = useState(false);

  // Q&A
  type QaMessage = { role: 'ai' | 'student'; text: string };
  const qaOpeningMsg: QaMessage = {
    role: 'ai',
    text: `Hi ${STUDENT_NAME}, you've made it through this topic — well done. Before we move to the test, this is your moment. Think of me as your lecturer, right after class, just for you. Ask me anything about this topic that you're still unsure about — no question is too small, and no question is a wrong one. Let's clear it up together before you go in and show what you know.`,
  };
  const [qaMessages, setQaMessages] = useState<QaMessage[]>([qaOpeningMsg]);
  const [qaInput, setQaInput] = useState('');
  const [qaIsTyping, setQaIsTyping] = useState(false);
  const [qaConfusionCount, setQaConfusionCount] = useState(0);
  const [voiceMode, setVoiceMode] = useState(false);
  const qaBottomRef = React.useRef<HTMLDivElement>(null);

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

          {/* Bridge screen card */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-[#1a4d35] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Scale className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Cases and Statutes for this Topic</p>
                  <p className="text-xs text-white/60 mt-0.5">Powered by Triax Law Library · LawPavilion</p>
                </div>
              </div>
            </div>

            {/* Pre-tagged references */}
            <div className="divide-y divide-stone-100">
              {TOPIC_REFERENCES.map((ref, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    ref.type === 'case' ? 'bg-amber-50' : 'bg-blue-50'
                  }`}>
                    {ref.type === 'case'
                      ? <Scale className="h-3.5 w-3.5 text-amber-600" />
                      : <FileText className="h-3.5 w-3.5 text-blue-600" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-snug">{ref.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{ref.detail}</p>
                  </div>
                  <span className={`shrink-0 mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    ref.type === 'case'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-blue-50 text-blue-600'
                  }`}>
                    {ref.type === 'case' ? 'Case' : 'Statute'}
                  </span>
                </div>
              ))}
            </div>

            {/* Explore Full Library CTA */}
            <div className="px-5 pb-5 pt-3">
              <button
                onClick={() => setShowFullLibrary(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1a4d35] text-white font-bold text-sm hover:bg-[#1a4d35]/90 transition-colors shadow-md"
              >
                <BookOpen className="h-4 w-4" />
                Explore Full Library
              </button>
              <p className="text-center text-[10px] text-muted-foreground mt-2">
                Opens the complete Triax Law Library — powered by LawPavilion
              </p>
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
        </div>
      )}

      {/* ══ FULL LIBRARY MODAL ══ */}
      {showFullLibrary && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden max-h-[90dvh] flex flex-col">
            {/* Modal header */}
            <div className="bg-[#1a4d35] px-5 py-5 shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-1">Triax Law Library</p>
                  <p className="font-bold text-white text-base leading-snug">Full Library Access</p>
                  <p className="text-xs text-white/60 mt-1">Powered by LawPavilion partnership</p>
                </div>
                <button onClick={() => setShowFullLibrary(false)} className="text-white/60 hover:text-white transition-colors mt-0.5">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Feature list */}
            <div className="overflow-y-auto flex-1 px-5 py-4">
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                The full Triax Law Library gives you complete access to Nigeria's most comprehensive legal research database. Available immediately upon LawPavilion integration confirmation.
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">What's included</p>
              <div className="space-y-2.5">
                {FULL_LIBRARY_FEATURES.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-[#1a4d35]/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-3 w-3 text-[#1a4d35]" />
                    </div>
                    <p className="text-sm text-foreground">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-stone-100 shrink-0 space-y-2">
              <button
                disabled
                className="w-full py-3.5 rounded-xl bg-stone-100 text-stone-400 font-bold text-sm cursor-not-allowed flex items-center justify-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Open Library — Coming Soon
              </button>
              <p className="text-center text-[10px] text-muted-foreground">
                Awaiting LawPavilion API integration finalisation
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══ Q&A ══ */}
      {step === 'qa' && (
        <div className="space-y-3">

          {/* Header */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="bg-[#1a4d35] px-5 py-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm">Pre-Test Q&A Session</p>
                  <p className="text-xs text-white/60 mt-0.5">Ask anything about this topic · AI-powered</p>
                </div>
              </div>
              {/* VIP voice toggle — shown for premium students */}
              <button
                onClick={() => setVoiceMode(v => !v)}
                title="Switch to voice mode (VIP)"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  voiceMode
                    ? 'bg-amber-400 border-amber-400 text-[#1a4d35]'
                    : 'border-white/30 text-white/60 hover:border-white/60 hover:text-white'
                }`}
              >
                <Headphones className="h-3.5 w-3.5" />
                {voiceMode ? 'Voice On' : 'Voice'}
              </button>
            </div>

            {/* Voice mode banner */}
            {voiceMode && (
              <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 border-b border-amber-100">
                <Headphones className="h-4 w-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <span className="font-bold">Voice mode active.</span> Speak your question — AI will respond aloud. Full voice interaction is a VIP feature.
                </p>
              </div>
            )}

            {/* Chat thread */}
            <div className="flex flex-col gap-4 px-5 py-5 max-h-[420px] overflow-y-auto">
              {qaMessages.map((msg, i) => (
                <div key={i} className={`flex items-end gap-2.5 ${msg.role === 'student' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  {msg.role === 'ai' ? (
                    <div className="h-8 w-8 rounded-full bg-[#1a4d35] flex items-center justify-center shrink-0 self-start">
                      <MessageCircle className="h-3.5 w-3.5 text-white" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-stone-200 flex items-center justify-center shrink-0 self-start">
                      <span className="text-xs font-bold text-stone-600">{STUDENT_NAME[0]}</span>
                    </div>
                  )}
                  {/* Bubble */}
                  <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'ai'
                      ? 'bg-stone-50 border border-stone-200 text-foreground rounded-tl-sm'
                      : 'bg-[#1a4d35] text-white rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {qaIsTyping && (
                <div className="flex items-end gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-[#1a4d35] flex items-center justify-center shrink-0">
                    <MessageCircle className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-stone-400 animate-bounce [animation-delay:0ms]" />
                    <span className="h-2 w-2 rounded-full bg-stone-400 animate-bounce [animation-delay:150ms]" />
                    <span className="h-2 w-2 rounded-full bg-stone-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
              <div ref={qaBottomRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 pb-4 pt-2 border-t border-stone-100">
              <div className="flex items-end gap-2">
                <textarea
                  value={qaInput}
                  onChange={e => setQaInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (!qaInput.trim() || qaIsTyping) return;
                      const userText = qaInput.trim();
                      setQaInput('');
                      setQaMessages(prev => [...prev, { role: 'student', text: userText }]);
                      setQaIsTyping(true);
                      setTimeout(() => {
                        const { text, isConfused } = getAIResponse(userText, qaConfusionCount);
                        if (isConfused) setQaConfusionCount(c => c + 1);
                        setQaMessages(prev => [...prev, { role: 'ai', text }]);
                        setQaIsTyping(false);
                        setTimeout(() => qaBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
                      }, 900 + Math.random() * 600);
                      setTimeout(() => qaBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
                    }
                  }}
                  placeholder="Ask anything about this topic…"
                  rows={1}
                  className="flex-1 resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#1a4d35]/30 focus:border-[#1a4d35]/40 transition-all"
                  style={{ minHeight: '44px', maxHeight: '120px' }}
                />
                <button
                  disabled={!qaInput.trim() || qaIsTyping}
                  onClick={() => {
                    if (!qaInput.trim() || qaIsTyping) return;
                    const userText = qaInput.trim();
                    setQaInput('');
                    setQaMessages(prev => [...prev, { role: 'student', text: userText }]);
                    setQaIsTyping(true);
                    setTimeout(() => {
                      const { text, isConfused } = getAIResponse(userText, qaConfusionCount);
                      if (isConfused) setQaConfusionCount(c => c + 1);
                      setQaMessages(prev => [...prev, { role: 'ai', text }]);
                      setQaIsTyping(false);
                      setTimeout(() => qaBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
                    }, 900 + Math.random() * 600);
                    setTimeout(() => qaBottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
                  }}
                  className="h-11 w-11 shrink-0 rounded-xl bg-[#1a4d35] text-white flex items-center justify-center hover:bg-[#1a4d35]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 text-center">Press Enter to send · Shift+Enter for new line</p>
            </div>
          </div>

          {/* Exit CTA — always visible, student decides when they're ready */}
          <button
            onClick={() => { markDone('qa'); setStep('quiz'); }}
            className="w-full py-4 rounded-2xl bg-[#1a4d35] text-white font-semibold text-sm hover:bg-[#1a4d35]/90 transition-colors flex items-center justify-center gap-2"
          >
            I'm ready for the test <ChevronRight className="h-4 w-4" />
          </button>
          <p className="text-center text-[10px] text-muted-foreground -mt-1">
            You can end this session whenever you feel ready — there's no minimum number of questions.
          </p>
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
