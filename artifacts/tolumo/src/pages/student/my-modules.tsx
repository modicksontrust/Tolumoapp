import React, { useState } from 'react';
import { useLocation } from 'wouter';
import {
  BookOpen, Star, CheckCircle2, Clock, PlayCircle, Lock,
  ChevronLeft, Award, Users, TrendingUp, Search, Plus, X,
} from 'lucide-react';

// ── All modules from reference ─────────────────────────────────────────────────
export const ALL_MODULES = [
  // Year 1 — carryover (add-on ₦7,500)
  { id: 101, code: 'LAW 101', title: 'Introduction to Nigerian Legal System', tutor: 'Prof. Chiamaka Okonkwo', topics: 8,  year: 1, sem: 1, status: 'carryover' as const },
  { id: 102, code: 'LAW 102', title: 'Legal Methods',                          tutor: 'Dr. Ibrahim Yusuf',        topics: 10, year: 1, sem: 1, status: 'carryover' as const },
  { id: 103, code: 'LAW 103', title: 'Law of Persons',                         tutor: 'Dr. Adeaize Obi',          topics: 7,  year: 1, sem: 2, status: 'carryover' as const },
  { id: 104, code: 'LAW 104', title: 'Nigerian Constitutional History',         tutor: 'Prof. Kunle Adetoye',      topics: 9,  year: 1, sem: 2, status: 'carryover' as const },
  // Year 2 — enrolled
  { id: 1,   code: 'LAW 201', title: 'Constitutional Law',                      tutor: 'Prof. Olusegun Adeyemi',   topics: 12, year: 2, sem: 1, status: 'enrolled'  as const },
  { id: 2,   code: 'LAW 202', title: 'Law of Contract',                         tutor: 'Dr. Ngozi Eze',            topics: 10, year: 2, sem: 1, status: 'enrolled'  as const },
  { id: 3,   code: 'LAW 203', title: 'Criminal Law I',                          tutor: 'Prof. Abiodun Olawale',    topics: 11, year: 2, sem: 1, status: 'enrolled'  as const },
  { id: 4,   code: 'LAW 204', title: 'Law of Torts',                            tutor: 'Dr. Fatima Bello',         topics: 9,  year: 2, sem: 2, status: 'enrolled'  as const },
  { id: 5,   code: 'LAW 205', title: 'Jurisprudence',                           tutor: 'Prof. Emeka Nnamdi',       topics: 8,  year: 2, sem: 2, status: 'enrolled'  as const },
  { id: 6,   code: 'LAW 206', title: 'Land Law I',                              tutor: 'Dr. Funmi Adebayo',        topics: 10, year: 2, sem: 2, status: 'enrolled'  as const },
  // Year 3 — locked
  { id: 301, code: 'LAW 301', title: 'Criminal Law II & Procedure',             tutor: 'Prof. Abiodun Olawale',    topics: 14, year: 3, sem: 1, status: 'locked'    as const },
  { id: 302, code: 'LAW 302', title: 'Equity & Trusts',                         tutor: 'Dr. Chidinma Okoro',       topics: 11, year: 3, sem: 1, status: 'locked'    as const },
  // Year 4 — locked
  { id: 401, code: 'LAW 401', title: 'Company Law',                             tutor: 'Prof. Tunde Bakare',       topics: 13, year: 4, sem: 1, status: 'locked'    as const },
  // Year 5 — locked
  { id: 501, code: 'LAW 501', title: 'Law of Evidence',                         tutor: 'Prof. Yusuf Abubakar',     topics: 12, year: 5, sem: 1, status: 'locked'    as const },
];

// Topic data for enrolled module detail view
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

// Progress data (matches dashboard)
const MODULE_PROGRESS: Record<number, { done: number; avgScore: number | null }> = {
  1: { done: 8, avgScore: 82 },
  2: { done: 4, avgScore: 70 },
  3: { done: 6, avgScore: 76 },
  4: { done: 2, avgScore: null },
  5: { done: 1, avgScore: null },
  6: { done: 0, avgScore: null },
};

// Picsum seeds chosen to look appropriate for each module
const MODULE_IMAGES: Record<number, string> = {
  101: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=340&fit=crop',
  102: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=340&fit=crop',
  103: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=340&fit=crop',
  104: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=340&fit=crop',
  1:   'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=340&fit=crop',
  2:   'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&h=340&fit=crop',
  3:   'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?w=600&h=340&fit=crop',
  4:   'https://images.unsplash.com/photo-1575505586569-646b2ca898fc?w=600&h=340&fit=crop',
  5:   'https://images.unsplash.com/photo-1555374018-13a8994ab246?w=600&h=340&fit=crop',
  6:   'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=340&fit=crop',
  301: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=600&h=340&fit=crop',
  302: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=340&fit=crop',
  401: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=340&fit=crop',
  501: 'https://images.unsplash.com/photo-1521587765099-8835e7201186?w=600&h=340&fit=crop',
};

// ── Carryover modal ────────────────────────────────────────────────────────────
function CarryoverModal({ mod, onClose }: { mod: typeof ALL_MODULES[0]; onClose: () => void }) {
  const [paid, setPaid] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-serif font-bold text-foreground">Add Carryover Module</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-stone-100"><X className="h-4 w-4" /></button>
        </div>
        {paid ? (
          <div className="px-6 py-10 text-center">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="font-serif font-bold text-foreground text-lg mb-1">Module Added!</h3>
            <p className="text-sm text-muted-foreground mb-6">{mod.title} has been added to your library. You now have instant access.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">Start Learning</button>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="font-semibold text-amber-900 mb-0.5">{mod.code}: {mod.title}</p>
              <p className="text-xs text-amber-700">{mod.tutor} · {mod.topics} topics · Year {mod.year}, Semester {mod.sem}</p>
            </div>
            <p className="text-sm text-muted-foreground">This is a Year 1 carryover module. Add it as a one-time add-on for instant access.</p>
            <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-xl p-4">
              <span className="text-sm font-medium text-foreground">One-time add-on fee</span>
              <span className="text-xl font-bold text-primary">₦7,500</span>
            </div>
            <button onClick={() => setPaid(true)} className="w-full py-3 rounded-xl bg-accent text-white font-bold hover:bg-accent/90 transition-colors">
              Pay ₦7,500 — Add Module
            </button>
            <p className="text-[10px] text-muted-foreground text-center">Secure payment · Instant access after payment · No refunds</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Module detail view ─────────────────────────────────────────────────────────
function ModuleDetail({ moduleId, onBack }: { moduleId: number; onBack: () => void }) {
  const [, setLocation] = useLocation();
  const mod = ALL_MODULES.find(m => m.id === moduleId);
  if (!mod) return <div className="text-muted-foreground">Module not found.</div>;

  const topics = MODULE_TOPICS[moduleId] || [];
  const prog = MODULE_PROGRESS[moduleId] || { done: 0, avgScore: null };
  const pct = topics.length ? Math.round((prog.done / topics.length) * 100) : 0;
  const img = MODULE_IMAGES[moduleId];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Module Library
      </button>

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden h-44">
        {img && <img src={img} alt={mod.title} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a4d35]/90 to-[#1a4d35]/50 flex items-end p-7">
          <div>
            <span className="inline-block px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wide mb-2">Year {mod.year} · Sem {mod.sem}</span>
            <h1 className="text-2xl font-serif font-bold text-white mb-1">{mod.title}</h1>
            <div className="flex flex-wrap items-center gap-5 text-sm text-white/75">
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {mod.tutor}</span>
              <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {mod.topics} topics</span>
              <span className="font-mono text-white/50">{mod.code}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="font-serif font-bold text-foreground">Course Topics</h2>
            {topics.length > 0 && <span className="text-xs text-muted-foreground font-semibold">{prog.done}/{topics.length} completed</span>}
          </div>
          {topics.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Topics are being uploaded. Check back soon.</div>
          ) : (
            <div className="divide-y divide-stone-100">
              {topics.map((t, i) => {
                const done = i < prog.done;
                const locked = i > prog.done;
                return (
                  <div key={t.id} className={`px-6 py-4 flex items-center gap-4 ${locked ? 'opacity-50' : 'hover:bg-stone-50'}`}>
                    <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 ${done ? 'bg-primary border-primary text-white' : 'border-stone-300'}`}>
                      {done && <CheckCircle2 className="h-4 w-4" />}
                      {locked && <Lock className="h-3 w-3 text-stone-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-muted-foreground">Topic {t.id}</p>
                      <p className={`text-sm font-medium mt-0.5 ${done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{t.title}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> {t.duration}</span>
                      {!locked && (
                        <button onClick={() => setLocation('/student/topic')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-medium text-foreground hover:border-primary hover:text-primary transition-colors">
                          <PlayCircle className="h-3.5 w-3.5" /> {done ? 'Revisit' : 'Watch'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-5">
          {/* Progress */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <h3 className="font-semibold text-foreground mb-4">Your Progress</h3>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-bold font-serif text-primary">{pct}%</span>
              <span className="text-sm text-muted-foreground">{prog.done}/{topics.length} topics</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            {prog.avgScore !== null && (
              <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span>Average quiz score: <strong className="text-foreground">{prog.avgScore}%</strong></span>
              </div>
            )}
            {pct === 100 && (
              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-600">
                <Award className="h-4 w-4" /> Module Complete! 🎉
              </div>
            )}
          </div>

          <div className="bg-primary rounded-xl p-5 text-white">
            <TrendingUp className="h-5 w-5 text-white/70 mb-3" />
            <h3 className="font-semibold mb-1">Need extra help?</h3>
            <p className="text-sm text-white/70 mb-4">Book a 1-on-1 session with {mod.tutor} for personalised guidance.</p>
            <button onClick={() => setLocation('/student/sessions')} className="w-full py-2.5 rounded-xl bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-colors">Book a Session</button>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <h3 className="font-semibold text-foreground mb-2">AI Study Coach</h3>
            <p className="text-sm text-muted-foreground mb-4">Get quizzed on this module and receive instant explanations.</p>
            <button onClick={() => setLocation('/student/topic')} className="w-full py-2.5 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors">Continue Learning →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Module Catalog (main view) ─────────────────────────────────────────────────
export default function MyModules({ moduleId }: { moduleId?: number }) {
  const [yearFilter, setYearFilter] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [carryoverMod, setCarryoverMod] = useState<typeof ALL_MODULES[0] | null>(null);
  const [detailId, setDetailId] = useState<number | null>(moduleId || null);

  if (detailId) {
    return <ModuleDetail moduleId={detailId} onBack={() => setDetailId(null)} />;
  }

  const years = [1, 2, 3, 4, 5];
  const filtered = ALL_MODULES.filter(m => {
    const matchYear = yearFilter === 'all' || m.year === yearFilter;
    const matchSearch = search === '' || m.title.toLowerCase().includes(search.toLowerCase()) || m.code.toLowerCase().includes(search.toLowerCase()) || m.tutor.toLowerCase().includes(search.toLowerCase());
    return matchYear && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Module Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Law Programme · NUC-approved modules · Complete all Year 2 modules for certificate</p>
        </div>
        <button className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Add Carryover Module
        </button>
      </div>

      {/* Carryover banner */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
        <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-amber-600 text-sm">💡</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-amber-900 text-sm">Have Year 1 carryover modules?</p>
          <p className="text-xs text-amber-800 mt-0.5">Add failed modules from your previous year as a one-time add-on — ₦7,500 per module, instant access after payment.</p>
        </div>
        <button
          onClick={() => setCarryoverMod(ALL_MODULES.find(m => m.status === 'carryover') || null)}
          className="shrink-0 px-4 py-2 rounded-xl bg-[#1a4d35] text-white text-xs font-bold hover:bg-[#1a4d35]/90 transition-colors"
        >
          Add Module
        </button>
      </div>

      {/* Search + year filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search modules..."
            className="h-10 pl-9 pr-4 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 w-52" />
        </div>
        <div className="flex gap-1 bg-white border border-stone-200 rounded-xl p-1">
          <button onClick={() => setYearFilter('all')} className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${yearFilter === 'all' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>All Levels</button>
          {years.map(y => (
            <button key={y} onClick={() => setYearFilter(y)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${yearFilter === y ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>Year {y}</button>
          ))}
        </div>
      </div>

      {/* Module grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(m => {
          const img = MODULE_IMAGES[m.id];
          const prog = MODULE_PROGRESS[m.id];

          return (
            <div
              key={m.id}
              onClick={() => {
                if (m.status === 'carryover') { setCarryoverMod(m); return; }
                if (m.status === 'enrolled') { setDetailId(m.id); }
              }}
              className={`bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col transition-shadow ${m.status !== 'locked' ? 'cursor-pointer hover:shadow-md' : 'opacity-80'}`}
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-stone-200 overflow-hidden">
                {img && <img src={img} alt={m.title} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/20" />

                {/* Year/Sem badge */}
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/50 text-white text-[10px] font-semibold">
                  Year {m.year} · Sem {m.sem}
                </span>

                {/* Carryover overlay */}
                {m.status === 'carryover' && (
                  <div className="absolute inset-0 bg-amber-900/60 flex flex-col items-center justify-center gap-1">
                    <Lock className="h-6 w-6 text-white/80" />
                    <span className="text-xs font-bold text-white/90 text-center px-4">Carryover · Add-on required</span>
                  </div>
                )}

                {/* Locked overlay */}
                {m.status === 'locked' && (
                  <div className="absolute inset-0 bg-stone-900/50 flex flex-col items-center justify-center gap-1">
                    <Lock className="h-6 w-6 text-white/70" />
                    <span className="text-[10px] font-semibold text-white/70">Complete Year {m.year - 1} to unlock</span>
                  </div>
                )}

                {/* Enrolled progress bar */}
                {m.status === 'enrolled' && prog && prog.done > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
                    <div className="h-full bg-accent" style={{ width: `${Math.round(prog.done / m.topics * 100)}%` }} />
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-[10px] font-bold text-muted-foreground tracking-widest mb-0.5">{m.code}</p>
                <h3 className="font-semibold text-foreground text-sm leading-snug mb-1">{m.title}</h3>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
                  <Users className="h-3.5 w-3.5 shrink-0" /> {m.tutor}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5" /> {m.topics} topics
                  </span>
                  {m.status === 'enrolled' && (
                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled
                    </span>
                  )}
                  {m.status === 'carryover' && (
                    <span className="text-xs font-bold text-accent">Add — ₦7,500</span>
                  )}
                  {m.status === 'locked' && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Lock className="h-3 w-3" /> Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-3 bg-white rounded-xl border border-stone-200 p-12 text-center">
            <BookOpen className="h-10 w-10 text-stone-300 mx-auto mb-3" />
            <p className="text-muted-foreground">No modules match your search.</p>
          </div>
        )}
      </div>

      {/* Carryover modal */}
      {carryoverMod && <CarryoverModal mod={carryoverMod} onClose={() => setCarryoverMod(null)} />}
    </div>
  );
}
