import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { PlayCircle, BookOpen, MessageCircle, CheckCircle2, Lock, ChevronLeft, ChevronRight, Send, Star, X, AlertCircle } from 'lucide-react';

// ── Topic data ─────────────────────────────────────────────────────────────────
const TOPIC = {
  number: 3,
  title: 'Federalism & Devolution of Powers',
  module: 'Constitutional Law 201',
  tutor: 'Prof. Adeyemi',
  totalTopics: 12,
};

const NOTES = `## Federalism & Devolution of Powers

### 1. The Structure of Nigerian Federalism

Nigeria operates a federal system of government under the 1999 Constitution (as amended). Legislative powers are divided between the National Assembly (federal) and the 36 State Houses of Assembly, plus the FCT.

### 2. The Second Schedule

The Second Schedule to the 1999 Constitution is the principal instrument of federal division:

**Part I — Exclusive Legislative List**
Only the National Assembly may legislate on the 68 items listed (e.g., defence, currency, customs, immigration, petroleum). States have no competence in these matters.

**Part II — Concurrent Legislative List**
Both the National Assembly and State Houses of Assembly may legislate on these 30 matters (e.g., education, electricity, health, road traffic). Where there is inconsistency, Federal law prevails (s.4(5)).

**Residual Powers**
Matters not listed in either schedule vest exclusively in States by exclusion.

### 3. Section 4(5) — The Inconsistency Clause

*"If any Law enacted by the House of Assembly of a State is inconsistent with any law validly made by the National Assembly, the law made by the National Assembly shall prevail, and that other Law shall to the extent of its inconsistency be void."*

**Test of Inconsistency:** A State law is inconsistent if it is impossible to obey both laws simultaneously, or if the Federal Parliament has occupied the field.

### 4. Key Cases

**A-G (Ogun State) v. A-G (Federation) [1982]**
The Supreme Court upheld the federal principle that where a State law conflicts with a valid federal statute on a concurrent matter, the federal law prevails.

**Bronik Motors Ltd v. Wema Bank Ltd [1983]**
The Court held that a State law on banking (an exclusive matter) was void for being in conflict with Federal banking legislation.

**Lakanmi v. A-G (Western State) [1971]**
Landmark case affirming the supremacy of the Constitution over military decrees; the courts can review executive action.

### 5. Practice Note

In examination questions on federalism, always:
1. Identify the Schedule item (Exclusive, Concurrent, or Residual)
2. Determine whether there is conflict
3. Apply s.4(5) and the relevant test
4. Cite at least one authority
`;

const AI_QA = [
  { q: 'What is the effect of s.4(5) of the 1999 Constitution?', a: 'Section 4(5) provides that where a State law is inconsistent with a valid Act of the National Assembly, the Federal law prevails and the State law is void to the extent of the inconsistency. This is sometimes called the Federal Supremacy Clause.' },
  { q: 'Name the two parts of the Second Schedule.', a: 'Part I contains the Exclusive Legislative List (68 items — Federal only). Part II contains the Concurrent Legislative List (30 items — both Federal and State, with Federal supremacy on conflict).' },
  { q: 'What are residual powers?', a: 'Residual powers are legislative matters not listed in either the Exclusive or Concurrent Legislative List. They vest exclusively in the States by exclusion from the Federal lists.' },
  { q: 'Apply Bronik Motors v. Wema Bank to a scenario where a State enacts a banking regulation.', a: 'Banking is an Exclusive Legislative List item. Following Bronik Motors, any State law on banking would be void under s.4(5) as the National Assembly has exclusive competence and has occupied the field through the Banks and Other Financial Institutions Act (BOFIA).' },
  { q: 'What test is used to determine inconsistency under s.4(5)?', a: 'The courts apply two tests: (1) the impossibility test — is it impossible to comply with both laws simultaneously? (2) The occupied field doctrine — has Federal Parliament legislated so comprehensively as to impliedly exclude State legislation?' },
];

const MCQ = [
  { q: 'Under the 1999 Constitution, which Schedule contains the Exclusive Legislative List?', opts: ['First Schedule — Part I', 'Second Schedule — Part I', 'Second Schedule — Part II', 'Third Schedule'], ans: 1 },
  { q: 'What does s.4(5) of the 1999 Constitution provide?', opts: ['State law always prevails over Federal law', 'Federal law prevails over inconsistent State law', 'Both Federal and State laws have equal validity', 'Emergency powers override all legislation'], ans: 1 },
  { q: 'In Bronik Motors v. Wema Bank [1983], the Supreme Court held that a State law on banking was:',  opts: ['Valid and enforceable', 'Void for inconsistency with Federal law', 'Applicable only in that State', 'Subject to Presidential assent'], ans: 1 },
  { q: 'Residual legislative powers under the 1999 Constitution vest in:', opts: ['The National Assembly exclusively', 'The President', 'State Houses of Assembly exclusively', 'Both National Assembly and States jointly'], ans: 2 },
  { q: 'The "occupied field" doctrine in Nigerian federalism refers to:', opts: ['Emergency powers restricting State action', 'Federal Parliament legislating so comprehensively as to exclude State legislation', 'Land use regulated by State governments', 'Military administration of states'], ans: 1 },
];

type Step = 'video' | 'notes' | 'qa' | 'quiz';

export default function CurrentTopic() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<Step>('notes'); // video already done
  const [completedSteps, setCompletedSteps] = useState<Set<Step>>(new Set(['video']));

  // Notes
  const [notesRead, setNotesRead] = useState(false);

  // Q&A
  const [qaIndex, setQaIndex] = useState(0);
  const [showAns, setShowAns] = useState(false);
  const [completedQA, setCompletedQA] = useState<Set<number>>(new Set());

  // Quiz
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizFailed, setQuizFailed] = useState(false);

  const steps: { id: Step; label: string }[] = [
    { id: 'video', label: 'Video' },
    { id: 'notes', label: 'Notes' },
    { id: 'qa', label: 'Q&A' },
    { id: 'quiz', label: 'Topic Quiz' },
  ];

  const isDone = (s: Step) => completedSteps.has(s);
  const canAccess = (s: Step) => {
    const order: Step[] = ['video', 'notes', 'qa', 'quiz'];
    const idx = order.indexOf(s);
    if (idx === 0) return true;
    return completedSteps.has(order[idx - 1]);
  };

  const markDone = (s: Step) => {
    setCompletedSteps(prev => new Set([...prev, s]));
  };

  const completeQA = () => {
    if (completedQA.size >= AI_QA.length - 1) {
      markDone('qa');
    }
    setCompletedQA(prev => new Set([...prev, qaIndex]));
    if (qaIndex < AI_QA.length - 1) {
      setQaIndex(q => q + 1);
      setShowAns(false);
    }
  };

  const submitQuiz = () => {
    const correct = MCQ.filter((q, i) => selected[i] === q.ans).length;
    setSubmitted(true);
    if (correct >= 3) {
      setQuizPassed(true);
      markDone('quiz');
    } else {
      setQuizFailed(true);
    }
  };

  const resetQuiz = () => {
    setSelected({});
    setSubmitted(false);
    setQuizPassed(false);
    setQuizFailed(false);
    // Topic resets — go back to video
    setCompletedSteps(new Set());
    setStep('video');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <button onClick={() => setLocation('/student')} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors mb-2">
            <ChevronLeft className="h-3.5 w-3.5" /> Back to Dashboard
          </button>
          <h1 className="text-xl font-serif font-bold text-foreground">Topic {TOPIC.number}: {TOPIC.title}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{TOPIC.module} · {TOPIC.tutor} · Topic {TOPIC.number} of {TOPIC.totalTopics}</p>
        </div>
      </div>

      {/* Step tabs */}
      <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl p-1 shadow-sm w-fit">
        {steps.map((s, i) => {
          const done = isDone(s.id);
          const accessible = canAccess(s.id);
          const active = step === s.id;
          return (
            <button
              key={s.id}
              onClick={() => accessible && setStep(s.id)}
              disabled={!accessible}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-primary text-white' : done ? 'text-green-600 hover:bg-stone-50' : accessible ? 'text-muted-foreground hover:text-foreground' : 'text-stone-300 cursor-not-allowed'}`}
            >
              {done && !active && <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />}
              {!accessible && <Lock className="h-3 w-3 shrink-0" />}
              {s.label}
            </button>
          );
        })}
      </div>

      {/* ── VIDEO ── */}
      {step === 'video' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="aspect-video bg-stone-900 flex flex-col items-center justify-center gap-4 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a4d35]/80 to-stone-900 flex flex-col items-center justify-center gap-4">
              <PlayCircle className="h-16 w-16 text-white/60" />
              <p className="text-white font-semibold text-lg text-center px-6">Topic 3: Federalism & Devolution of Powers</p>
              <p className="text-white/50 text-sm">45 minutes · Prof. Adeyemi</p>
              <button className="mt-2 flex items-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition-colors">
                <PlayCircle className="h-5 w-5" /> Play Video Lecture
              </button>
            </div>
          </div>
          <div className="p-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Watch the full lecture before proceeding to Review Notes.</p>
            <button onClick={() => { markDone('video'); setStep('notes'); }} className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
              Mark as Watched → Notes
            </button>
          </div>
        </div>
      )}

      {/* ── NOTES ── */}
      {step === 'notes' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">Lecture Notes</span>
            </div>
            <span className="text-xs text-muted-foreground">Read carefully before the AI Q&A</span>
          </div>
          <div className="px-6 py-6 prose prose-sm max-w-none text-foreground overflow-y-auto" style={{ maxHeight: '460px' }}>
            {NOTES.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold font-serif text-foreground mt-4 mb-2">{line.replace('## ', '')}</h2>;
              if (line.startsWith('### ')) return <h3 key={i} className="text-base font-semibold text-foreground mt-4 mb-1.5">{line.replace('### ', '')}</h3>;
              if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-foreground mt-2">{line.replace(/\*\*/g, '')}</p>;
              if (line.startsWith('*') && line.endsWith('*')) return <p key={i} className="italic text-muted-foreground border-l-4 border-primary/30 pl-4 my-2">{line.replace(/\*/g, '')}</p>;
              if (line.match(/^\d+\./)) return <p key={i} className="ml-4 text-sm text-foreground my-0.5">{line}</p>;
              if (line === '') return <div key={i} className="h-2" />;
              return <p key={i} className="text-sm text-foreground leading-relaxed">{line}</p>;
            })}
          </div>
          <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={notesRead} onChange={e => setNotesRead(e.target.checked)} className="h-4 w-4 accent-primary" />
              <span className="text-sm font-medium text-foreground">I have read and understood these notes</span>
            </label>
            <button onClick={() => { if (notesRead) { markDone('notes'); setStep('qa'); } }}
              disabled={!notesRead}
              className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Continue to AI Q&A →
            </button>
          </div>
        </div>
      )}

      {/* ── AI Q&A ── */}
      {step === 'qa' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-primary text-white">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <span className="font-semibold">AI Q&A — {completedQA.size}/{AI_QA.length} completed</span>
            </div>
            <span className="text-xs text-white/65">Answer all questions to unlock the quiz</span>
          </div>

          <div className="p-6 space-y-4">
            {/* Progress */}
            <div className="flex items-center gap-2">
              {AI_QA.map((_, i) => (
                <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${completedQA.has(i) ? 'bg-green-500' : i === qaIndex ? 'bg-primary' : 'bg-stone-200'}`} />
              ))}
            </div>

            {/* Question */}
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-200">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Question {qaIndex + 1} of {AI_QA.length}</p>
              <p className="font-semibold text-foreground leading-relaxed">{AI_QA[qaIndex].q}</p>
            </div>

            {/* Answer */}
            {showAns ? (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-2">AI Answer</p>
                <p className="text-sm text-foreground leading-relaxed">{AI_QA[qaIndex].a}</p>
                <button onClick={completeQA}
                  className="mt-4 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
                  {qaIndex < AI_QA.length - 1 ? 'Next Question →' : completedQA.size >= AI_QA.length - 1 ? 'Complete Q&A →' : 'Next →'}
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAns(true)}
                className="w-full py-3 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors">
                Reveal AI Answer
              </button>
            )}
          </div>

          {isDone('qa') && (
            <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between bg-green-50">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-semibold text-sm">All Q&A completed!</span>
              </div>
              <button onClick={() => setStep('quiz')} className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
                Take the Quiz →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── QUIZ ── */}
      {step === 'quiz' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-100 bg-stone-50">
            <div className="flex items-center gap-2 mb-0.5">
              <Star className="h-5 w-5 text-accent" />
              <span className="font-semibold text-foreground">Topic Quiz — 5 MCQ Questions</span>
            </div>
            <p className="text-xs text-muted-foreground">Pass mark: 3/5 correct. If you fail, the topic resets from the video.</p>
          </div>

          {quizPassed && (
            <div className="p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-9 w-9 text-green-600" />
              </div>
              <h2 className="font-serif font-bold text-xl text-foreground mb-1">Topic Passed! 🎉</h2>
              <p className="text-sm text-muted-foreground mb-2">
                You got {MCQ.filter((q, i) => selected[i] === q.ans).length}/5 correct — {Math.round(MCQ.filter((q, i) => selected[i] === q.ans).length / MCQ.length * 100)}%
              </p>
              <p className="text-sm text-green-700 font-medium mb-6">Topic 4: Separation of Powers is now unlocked.</p>
              <div className="flex items-center justify-center gap-3">
                <button className="px-5 py-2.5 rounded-xl border border-stone-200 text-foreground font-semibold text-sm hover:bg-stone-50 transition-colors">Review Answers</button>
                <button className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">Next Topic →</button>
              </div>
            </div>
          )}

          {quizFailed && (
            <div className="p-8 text-center">
              <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-9 w-9 text-red-500" />
              </div>
              <h2 className="font-serif font-bold text-xl text-foreground mb-1">Quiz Not Passed</h2>
              <p className="text-sm text-muted-foreground mb-2">
                You got {MCQ.filter((q, i) => selected[i] === q.ans).length}/5 — you need at least 3 correct.
              </p>
              <p className="text-sm text-red-600 font-medium mb-6">The topic has been reset. Please rewatch the video and review the notes before trying again.</p>
              <button onClick={resetQuiz} className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
                Restart from Video
              </button>
            </div>
          )}

          {!submitted && (
            <div className="p-6 space-y-6">
              {MCQ.map((q, qi) => (
                <div key={qi}>
                  <p className="font-semibold text-sm text-foreground mb-3">Q{qi + 1}. {q.q}</p>
                  <div className="space-y-2">
                    {q.opts.map((opt, oi) => (
                      <button key={oi} onClick={() => setSelected(s => ({ ...s, [qi]: oi }))}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-colors ${selected[qi] === oi ? 'border-primary bg-primary/5 text-primary font-medium' : 'border-stone-200 text-foreground hover:border-stone-300 hover:bg-stone-50'}`}>
                        <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 text-[11px] font-bold ${selected[qi] === oi ? 'border-primary bg-primary text-white' : 'border-stone-300'}`}>
                          {selected[qi] === oi ? '●' : String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <span className="text-sm text-muted-foreground">{Object.keys(selected).length}/{MCQ.length} answered</span>
                <button onClick={submitQuiz} disabled={Object.keys(selected).length < MCQ.length}
                  className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Submit Quiz
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
