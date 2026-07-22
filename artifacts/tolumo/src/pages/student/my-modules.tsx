import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { BookOpen, Star, CheckCircle2, Clock, PlayCircle, Lock, ChevronLeft, Award, Users, TrendingUp } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
export const ALL_MODULES = [
  { id: 1, code: 'LAW 201', title: 'Constitutional Law', tutor: 'Prof. O. Adeyemi', topics: 12, rating: 4.9, reviews: 3840, year: 2, available: true, gradient: 'from-amber-800 to-amber-600', desc: 'Foundational study of the 1999 Constitution of Nigeria (as amended), federalism, separation of powers, fundamental rights, and judicial review. Essential for all law practitioners.' },
  { id: 2, code: 'LAW 202', title: 'Law of Contract', tutor: 'Dr. N. Eze', topics: 10, rating: 4.8, reviews: 2910, year: 2, available: true, gradient: 'from-slate-700 to-slate-500', desc: 'Core principles of contract formation, terms, breach, and remedies under Nigerian contract law. Covers offer, acceptance, consideration, misrepresentation, and discharge.' },
  { id: 3, code: 'LAW 203', title: 'Criminal Law I', tutor: 'Prof. B. Olawale', topics: 11, rating: 4.9, reviews: 2140, year: 2, available: true, gradient: 'from-stone-700 to-stone-500', desc: 'Study of criminal liability, the elements of a crime, specific offences under the Criminal Code and Penal Code, defences, and principles of criminal responsibility.' },
  { id: 4, code: 'LAW 204', title: 'Law of Torts', tutor: 'Dr. A. Okafor', topics: 9, rating: 4.7, reviews: 1980, year: 2, available: true, gradient: 'from-amber-900 to-amber-700', desc: 'Civil wrongs and remedies under Nigerian law: negligence, occupiers\' liability, defamation, nuisance, trespass, and the rule in Rylands v Fletcher as applied in Nigeria.' },
  { id: 5, code: 'LAW 205', title: 'Jurisprudence', tutor: 'Prof. C. Nwachukwu', topics: 8, rating: 4.8, reviews: 1650, year: 2, available: true, gradient: 'from-green-800 to-green-600', desc: 'Philosophy of law covering natural law, legal positivism, realism, and critical legal studies. Explores the relationship between law, morality, and justice in African legal contexts.' },
  { id: 6, code: 'LAW 206', title: 'Land Law I', tutor: 'Dr. F. Al-Hassan', topics: 10, rating: 4.6, reviews: 1430, year: 2, available: true, gradient: 'from-teal-800 to-teal-600', desc: 'Nigerian land law including the Land Use Act 1978, customary land tenure, statutory rights of occupancy, mortgages, leases, and covenants relating to land.' },
  { id: 7, code: 'LAW 101', title: 'Nigerian Legal System', tutor: 'TBA', topics: 10, rating: 0, reviews: 0, year: 1, available: false, gradient: 'from-gray-600 to-gray-500', desc: 'Coming soon — Year 1 modules are currently in production.' },
  { id: 8, code: 'LAW 301', title: 'Company Law', tutor: 'TBA', topics: 12, rating: 0, reviews: 0, year: 3, available: false, gradient: 'from-gray-600 to-gray-500', desc: 'Coming soon — Year 3 modules are currently in production.' },
];

const MODULE_TOPICS: Record<number, { id: number; title: string; duration: string }[]> = {
  1: [
    { id: 1, title: 'Origins of Nigerian Federalism', duration: '45 min' },
    { id: 2, title: 'Supremacy of the Constitution', duration: '38 min' },
    { id: 3, title: 'Federalism & Devolution of Powers', duration: '52 min' },
    { id: 4, title: 'Separation of Powers', duration: '41 min' },
    { id: 5, title: 'The Three Arms of Government', duration: '35 min' },
    { id: 6, title: 'Fundamental Rights under Chapter IV', duration: '58 min' },
    { id: 7, title: 'Enforcement of Fundamental Rights', duration: '43 min' },
    { id: 8, title: 'The Second Schedule', duration: '47 min' },
    { id: 9, title: 'Judicial Review in Nigerian Law', duration: '39 min' },
    { id: 10, title: 'Constitutional Amendments: History & Process', duration: '44 min' },
    { id: 11, title: 'Emergency Powers & National Security', duration: '36 min' },
    { id: 12, title: 'Electoral Law & Constitutional Democracy', duration: '55 min' },
  ],
  2: [
    { id: 1, title: 'Formation of a Contract: Overview', duration: '40 min' },
    { id: 2, title: 'Offer & Acceptance — The Postal Rule', duration: '35 min' },
    { id: 3, title: 'Consideration & Intention', duration: '42 min' },
    { id: 4, title: 'Capacity & Legality', duration: '38 min' },
    { id: 5, title: 'Terms of a Contract', duration: '45 min' },
    { id: 6, title: 'Misrepresentation & Mistake', duration: '50 min' },
    { id: 7, title: 'Discharge of Contract', duration: '35 min' },
    { id: 8, title: 'Breach & Remedies', duration: '48 min' },
    { id: 9, title: 'Exclusion Clauses', duration: '32 min' },
    { id: 10, title: 'Agency in Contract Law', duration: '40 min' },
  ],
};

// ── Module Catalog ─────────────────────────────────────────────────────────────
export default function MyModules({ moduleId }: { moduleId?: number }) {
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [enrolled, setEnrolled] = useState<number[]>(() => {
    const s = localStorage.getItem('student_enrolled');
    return s ? JSON.parse(s) : [1];
  });
  const [progress, setProgress] = useState<Record<number, Set<number>>>(() => {
    const s = localStorage.getItem('student_topic_progress');
    if (!s) return { 1: new Set([1, 2, 3]) };
    const raw = JSON.parse(s) as Record<number, number[]>;
    return Object.fromEntries(Object.entries(raw).map(([k, v]) => [Number(k), new Set(v)]));
  });
  const [, setLocation] = useLocation();

  // Save enrolled + progress
  const enroll = (id: number) => {
    const updated = [...enrolled, id];
    setEnrolled(updated);
    localStorage.setItem('student_enrolled', JSON.stringify(updated));
  };

  const toggleTopic = (moduleId: number, topicId: number) => {
    setProgress(prev => {
      const current = new Set(prev[moduleId] || []);
      if (current.has(topicId)) current.delete(topicId);
      else current.add(topicId);
      const updated = { ...prev, [moduleId]: current };
      const raw = Object.fromEntries(Object.entries(updated).map(([k, v]) => [k, [...v]]));
      localStorage.setItem('student_topic_progress', JSON.stringify(raw));
      return updated;
    });
  };

  // Module detail view
  if (moduleId) {
    const mod = ALL_MODULES.find(m => m.id === moduleId);
    if (!mod) return <div className="text-muted-foreground">Module not found.</div>;

    const topics = MODULE_TOPICS[moduleId] || [];
    const isEnrolled = enrolled.includes(moduleId);
    const done = progress[moduleId] || new Set();
    const pct = topics.length ? Math.round((done.size / topics.length) * 100) : 0;

    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <button onClick={() => setLocation('/student/modules')} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Modules
        </button>

        {/* Header banner */}
        <div className={`bg-gradient-to-r ${mod.gradient} rounded-2xl p-8 text-white relative overflow-hidden`}>
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20" />
          <div className="relative">
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide mb-4">Year {mod.year} · {mod.code}</span>
            <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">{mod.title}</h1>
            <p className="text-white/75 text-sm max-w-xl">{mod.desc}</p>
            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
              <div className="flex items-center gap-2"><Users className="h-4 w-4 text-white/70" /> {mod.tutor}</div>
              <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-white/70" /> {topics.length} topics</div>
              {mod.rating > 0 && <div className="flex items-center gap-1.5"><Star className="h-4 w-4 text-amber-300 fill-amber-300" /> {mod.rating} ({mod.reviews.toLocaleString()} reviews)</div>}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Topics list */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <h2 className="font-serif font-bold text-foreground">Course Topics</h2>
              {isEnrolled && topics.length > 0 && (
                <span className="text-xs font-semibold text-muted-foreground">{done.size}/{topics.length} completed</span>
              )}
            </div>

            {!isEnrolled ? (
              <div className="p-8 text-center">
                <Lock className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-1">Enroll to access topics</p>
                <p className="text-sm text-muted-foreground mb-5">Get full access to all {topics.length} topics, quizzes, and AI revision sessions.</p>
                <button onClick={() => enroll(mod.id)} className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
                  Enroll Now — Free
                </button>
              </div>
            ) : topics.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">Topics are being uploaded. Check back soon.</div>
            ) : (
              <div className="divide-y divide-stone-100">
                {topics.map((t, i) => {
                  const isCompleted = done.has(t.id);
                  const isLocked = i > 0 && !done.has(topics[i - 1].id) && i > done.size;
                  return (
                    <div key={t.id} className={`px-6 py-4 flex items-center gap-4 transition-colors ${isLocked ? 'opacity-50' : 'hover:bg-stone-50'}`}>
                      <button
                        disabled={isLocked}
                        onClick={() => !isLocked && toggleTopic(moduleId, t.id)}
                        className={`h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isCompleted ? 'bg-primary border-primary text-white' : 'border-stone-300 hover:border-primary'}`}
                      >
                        {isCompleted && <CheckCircle2 className="h-4 w-4" />}
                        {isLocked && !isCompleted && <Lock className="h-3 w-3 text-stone-400" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Topic {t.id}</p>
                        <p className={`font-medium text-sm mt-0.5 ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{t.title}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {t.duration}</span>
                        {!isLocked && (
                          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors">
                            <PlayCircle className="h-3.5 w-3.5" /> Watch
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Progress */}
            {isEnrolled && (
              <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                <h3 className="font-semibold text-foreground mb-4">Your Progress</h3>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-bold font-serif text-primary">{pct}%</span>
                  <span className="text-sm text-muted-foreground">{done.size}/{topics.length} topics</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                {pct === 100 && (
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-green-600">
                    <Award className="h-4 w-4" /> Module Complete! 🎉
                  </div>
                )}
              </div>
            )}

            {/* Book a session */}
            <div className="bg-primary rounded-xl p-5 text-white">
              <TrendingUp className="h-6 w-6 text-white/70 mb-3" />
              <h3 className="font-semibold mb-1">Struggling with a topic?</h3>
              <p className="text-sm text-white/70 mb-4">Book a 1-on-1 session with {mod.tutor} for personalised guidance.</p>
              <button onClick={() => setLocation('/student/sessions')} className="w-full py-2.5 rounded-xl bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-colors">
                Book a Session
              </button>
            </div>

            {/* AI Coach */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
              <h3 className="font-semibold text-foreground mb-2">AI Study Coach</h3>
              <p className="text-sm text-muted-foreground mb-4">Get quizzed on this module, ask questions, or request a topic summary.</p>
              <button onClick={() => setLocation('/student/ai-coach')} className="w-full py-2.5 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors">
                Open AI Coach
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Module catalog
  const years = [1, 2, 3, 4, 5];
  const filtered = yearFilter === 'all' ? ALL_MODULES : ALL_MODULES.filter(m => m.year === yearFilter);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">My Modules</h1>
          <p className="text-muted-foreground mt-0.5">Browse NUC-approved LL.B modules.</p>
        </div>
        {/* Year filter */}
        <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-xl p-1 shadow-sm">
          <button onClick={() => setYearFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${yearFilter === 'all' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>All</button>
          {years.map(y => (
            <button key={y} onClick={() => setYearFilter(y)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${yearFilter === y ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>Yr {y}</button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(m => {
          const isEnrolled = enrolled.includes(m.id);
          const done = progress[m.id]?.size || 0;
          const pct = m.topics ? Math.round((done / m.topics) * 100) : 0;

          return (
            <div key={m.id} className={`bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow ${!m.available ? 'opacity-70' : ''}`}>
              {/* Thumbnail */}
              <div className={`h-36 bg-gradient-to-br ${m.gradient} relative flex items-end p-4`}>
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wide">Year {m.year}</span>
                {!m.available && (
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 text-white text-[10px] font-bold">Coming Soon</span>
                )}
                {isEnrolled && (
                  <div className="absolute bottom-3 right-3">
                    <div className="flex items-center gap-1.5 bg-white/90 rounded-full px-2.5 py-1">
                      <div className="h-1.5 w-16 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-primary">{pct}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[10px] font-bold text-muted-foreground tracking-widest mb-1">{m.code}</p>
                <h3 className="font-semibold text-foreground text-base mb-1 leading-snug">{m.title}</h3>
                <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
                  <span>👤</span> {m.available ? m.tutor : 'TBA'}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {m.topics} topics</span>
                  {m.rating > 0 ? (
                    <span className="flex items-center gap-1 text-amber-600 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> {m.rating} ({m.reviews.toLocaleString()})
                    </span>
                  ) : <span className="italic">No ratings yet</span>}
                </div>

                <div className="mt-auto">
                  {!m.available ? (
                    <button disabled className="w-full py-2.5 rounded-xl bg-stone-100 text-stone-400 text-sm font-semibold cursor-not-allowed">
                      Coming Soon
                    </button>
                  ) : isEnrolled ? (
                    <button onClick={() => setLocation(`/student/modules/${m.id}`)} className="w-full py-2.5 rounded-xl border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors">
                      Continue Learning →
                    </button>
                  ) : (
                    <button onClick={() => { enroll(m.id); setLocation(`/student/modules/${m.id}`); }}
                      className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                      Enroll Now
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coming soon banner */}
      <div className="flex items-center justify-between bg-stone-900 text-white rounded-xl px-6 py-5">
        <div>
          <p className="font-semibold">Year 1, 3, 4 & 5 modules coming soon</p>
          <p className="text-sm text-white/60 mt-0.5">We're currently live with all Year 2 (200 Level) modules. Additional years are in production.</p>
        </div>
        <button className="shrink-0 px-5 py-2.5 rounded-xl bg-white text-stone-900 font-semibold text-sm hover:bg-white/90 transition-colors">
          Get Early Access
        </button>
      </div>
    </div>
  );
}
