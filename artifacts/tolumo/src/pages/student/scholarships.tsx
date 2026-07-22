import React, { useState } from 'react';
import {
  Search, SlidersHorizontal, Bookmark, ExternalLink, X,
  GraduationCap, Award, Star, Briefcase, Leaf, Globe, MapPin,
  Calendar, ChevronDown,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type OppType = 'Scholarship' | 'Internship' | 'Fellowship' | 'Job Posting' | 'Grant';
type Region  = 'Nigeria' | 'Africa' | 'Global';
type Level   = 'Undergraduate' | 'Postgraduate' | 'Early Career';

interface Opportunity {
  id: number;
  type: OppType;
  region: Region;
  levels: Level[];
  title: string;
  org: string;
  desc: string;
  tags: string[];
  deadline: string;
  deadlineDays: number | null; // null = rolling
  added: string;
  featured: boolean;
  eligibility: string[];
  applyUrl: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const OPPS: Opportunity[] = [
  {
    id: 1,
    type: 'Scholarship', region: 'Global', levels: ['Postgraduate'],
    title: 'Chevening Scholarship 2026/27',
    org: 'UK Foreign, Commonwealth & Development Office',
    desc: "Fully-funded one-year master's programme at any UK university. Covers tuition, living allowance, return flights, and visa costs. Open to future leaders with strong academic records and demonstrated leadership potential.",
    tags: ['Postgraduate', 'Corporate Law', 'Public Interest', 'International'],
    deadline: '5 Nov 2025', deadlineDays: 116, added: '12 Jul 2025', featured: true,
    eligibility: [
      'Nigerian or other eligible-country national',
      "Bachelor's degree with minimum 2:1 or equivalent",
      'At least 2 years of work or internship experience',
      'Return to home country for 2 years after the scholarship',
    ],
    applyUrl: 'https://www.chevening.org',
  },
  {
    id: 2,
    type: 'Scholarship', region: 'Global', levels: ['Postgraduate'],
    title: 'Commonwealth Scholarship — LLM Award',
    org: 'Commonwealth Scholarship Commission',
    desc: 'Fully-funded LLM study at leading UK universities for high-achieving graduates from Commonwealth countries. Designed to develop professionals who will make change in their home countries.',
    tags: ['Postgraduate', 'Public Interest', 'Government'],
    deadline: '15 Dec 2026', deadlineDays: 521, added: '12 Jul 2025', featured: true,
    eligibility: [
      'Nigerian or Commonwealth-country citizen',
      'First-class or upper second-class degree in Law',
      'Commitment to returning to Nigeria post-study',
      'Evidence of leadership and public-service orientation',
    ],
    applyUrl: 'https://cscuk.fcdo.gov.uk',
  },
  {
    id: 3,
    type: 'Internship', region: 'Nigeria', levels: ['Undergraduate'],
    title: 'Vacation Scheme — Corporate & Finance Practice',
    org: 'Aluko & Oyebode',
    desc: "Two-week structured vacation scheme at one of Nigeria's leading full-service law firms. Trainees rotate across Corporate & Finance, Disputes, and Regulatory practices, shadowing senior associates.",
    tags: ['Undergraduate', 'Corporate Law'],
    deadline: '21 Jul 2025', deadlineDays: 9, added: '12 Jul 2025', featured: false,
    eligibility: [
      '200–400 Level LL.B student at an accredited Nigerian university',
      'Minimum CGPA of 4.0 / Second Class Upper',
      'Strong written and oral communication skills',
    ],
    applyUrl: 'https://www.aluko-oyebode.com',
  },
  {
    id: 4,
    type: 'Internship', region: 'Nigeria', levels: ['Undergraduate', 'Postgraduate'],
    title: 'Student Law Review Internship',
    org: 'Aelex Partners',
    desc: "Semester-long internship embedded in AELEX's knowledge management and legal research unit. Interns draft client alerts, assist on pro bono matters, and contribute to the firm's thought leadership publications.",
    tags: ['Undergraduate', 'Postgraduate', 'Corporate Law', 'International'],
    deadline: '30 Aug 2025', deadlineDays: 49, added: '12 Jul 2025', featured: false,
    eligibility: [
      '300 Level and above LL.B or LLM students',
      'Demonstrated interest in legal research and writing',
      'Prior law review or moot court experience preferred',
    ],
    applyUrl: 'https://www.aelex.com',
  },
  {
    id: 5,
    type: 'Fellowship', region: 'Global', levels: ['Early Career'],
    title: 'Justice Initiative Fellowship',
    org: 'Open Society Foundations',
    desc: 'Two-year fellowship supporting early-career lawyers and advocates working at the intersection of human rights, criminal justice reform, and rule of law in the Global South. Fellows receive a stipend.',
    tags: ['Early Career', 'Public Interest', 'Criminal Justice'],
    deadline: '1 Oct 2025', deadlineDays: 81, added: '12 Jul 2025', featured: true,
    eligibility: [
      'LL.B graduate with 1–4 years of practice',
      'Working at a human rights or public interest organisation',
      'Clear theory of change for proposed fellowship project',
      'Commitment to remain in Nigeria for the fellowship period',
    ],
    applyUrl: 'https://www.opensocietyfoundations.org',
  },
  {
    id: 6,
    type: 'Fellowship', region: 'Global', levels: ['Early Career'],
    title: 'Legal Delegate Graduate Programme',
    org: 'International Committee of the Red Cross (ICRC)',
    desc: 'Intensive two-year field posting with ICRC delegations worldwide. Legal Delegates advise on International Humanitarian Law, engage with armed forces and authorities, and document violations.',
    tags: ['Early Career', 'International', 'Public Interest'],
    deadline: 'Rolling — open year-round', deadlineDays: null, added: '12 Jul 2025', featured: false,
    eligibility: [
      'LL.B or LLM with IHL or public international law specialisation',
      'Minimum 2 years post-call experience',
      'Fluency in English; French or Arabic is an advantage',
      'Willingness to be deployed globally on short notice',
    ],
    applyUrl: 'https://www.icrc.org',
  },
  {
    id: 7,
    type: 'Job Posting', region: 'Africa', levels: ['Early Career'],
    title: 'Legal Officer — Compliance & Contracts',
    org: 'African Development Bank Group',
    desc: "Entry-level legal officer role within the AfDB's General Counsel's Office. Responsibilities include contract review, procurement support, regulatory compliance advisory, and institutional legal...",
    tags: ['Early Career', 'Corporate Law', 'Government'],
    deadline: '15 Sep 2025', deadlineDays: 65, added: '12 Jul 2025', featured: false,
    eligibility: [
      'LL.B with strong academic record; LLM preferred',
      'Experience in corporate or international law',
      'Knowledge of multilateral development bank operations',
      'Proficiency in English; French desirable',
    ],
    applyUrl: 'https://www.afdb.org',
  },
  {
    id: 8,
    type: 'Job Posting', region: 'Nigeria', levels: ['Early Career'],
    title: 'State Counsel — Office of the Attorney General',
    org: 'Lagos State Ministry of Justice',
    desc: 'Entry-level State Counsel position handling prosecution, legal drafting, and advisory work for Lagos State. Successful candidates are attached to the Directorate of Public Prosecutions or the...',
    tags: ['Early Career', 'Government', 'Criminal Justice'],
    deadline: '1 Aug 2025', deadlineDays: 20, added: '12 Jul 2025', featured: false,
    eligibility: [
      'LL.B (Second Class Upper minimum) and BL',
      'Called to the Nigerian Bar',
      'Good understanding of criminal procedure and civil litigation',
      'Lagos State indigene or resident preferred',
    ],
    applyUrl: 'https://www.lagosstatemoj.org',
  },
  {
    id: 9,
    type: 'Grant', region: 'Global', levels: ['Postgraduate', 'Early Career'],
    title: 'MacArthur Foundation 100&Change Proposal Grant',
    org: 'John D. and Catherine T. MacArthur Foundation',
    desc: 'Competitive research grant for projects addressing a single, significant problem in criminal justice reform, access to justice, or rule of law. Grants of up to $100M over five years for selected initiatives.',
    tags: ['Postgraduate', 'Early Career', 'Public Interest', 'Criminal Justice'],
    deadline: '30 Sep 2025', deadlineDays: 80, added: '12 Jul 2025', featured: false,
    eligibility: [
      'Organisation or institution (not individuals) as lead applicant',
      'Demonstrated expertise in criminal justice or access to justice',
      'Clear measurable impact theory',
      'Open to Nigerian civil society and research organisations',
    ],
    applyUrl: 'https://www.macfound.org',
  },
  {
    id: 10,
    type: 'Internship', region: 'Africa', levels: ['Postgraduate'],
    title: 'Internship — Legal Affairs Division',
    org: 'African Union Commission',
    desc: 'Six-month internship supporting the AU Commission\'s Legal Affairs Division in Addis Ababa. Interns assist with treaty drafting, AU Summit preparation, and advisory opinions on matters of continental...',
    tags: ['Postgraduate', 'International', 'Government'],
    deadline: 'Rolling intake — apply 2 months before desired start', deadlineDays: null, added: '12 Jul 2025', featured: false,
    eligibility: [
      'Currently enrolled in LLM or final year LL.B',
      'Interest in public international law and African Union law',
      'English or French proficiency required',
      'African Union member state citizenship',
    ],
    applyUrl: 'https://au.int',
  },
  {
    id: 11,
    type: 'Internship', region: 'Africa', levels: ['Postgraduate'],
    title: 'UN Women Legal Internship — West Africa Office',
    org: 'UN Women',
    desc: "Unpaid but prestigious internship supporting UN Women's West Africa Regional Office in Dakar. Tasks include gender-responsive legal analysis, CEDAW compliance research, and policy brief preparation.",
    tags: ['Postgraduate', 'Public Interest', 'International'],
    deadline: '31 Oct 2026', deadlineDays: 476, added: '12 Jul 2025', featured: false,
    eligibility: [
      'Enrolled in or recently completed LLM in human rights, gender, or international law',
      'Strong research and writing skills',
      'French language proficiency advantageous',
      'Commitment to gender equality and women\'s rights',
    ],
    applyUrl: 'https://www.unwomen.org',
  },
  {
    id: 12,
    type: 'Fellowship', region: 'Global', levels: ['Postgraduate'],
    title: 'Young Professionals Programme — Legal Track',
    org: 'World Bank Group',
    desc: 'Highly competitive two-year rotational programme placing outstanding young professionals across World Bank operations. Legal track fellows work on project finance, environmental law, and...',
    tags: ['Postgraduate', 'International', 'Government'],
    deadline: '1 Sep 2025', deadlineDays: 51, added: '12 Jul 2025', featured: true,
    eligibility: [
      'LLM or JD/SJD from a top-ranked institution',
      'Maximum 32 years of age at time of application',
      'Minimum 3 years of relevant work experience post first degree',
      'Fluency in English required; additional WB languages advantageous',
    ],
    applyUrl: 'https://www.worldbank.org/ypp',
  },
];

// ── Pill configs ───────────────────────────────────────────────────────────────
const TYPE_STYLE: Record<OppType, { bg: string; text: string; icon: React.ReactNode }> = {
  Scholarship:  { bg: 'bg-[#e8f0ee]', text: 'text-[#1a4d35]', icon: <Award  className="h-3 w-3" /> },
  Internship:   { bg: 'bg-orange-100', text: 'text-orange-700', icon: <GraduationCap className="h-3 w-3" /> },
  Fellowship:   { bg: 'bg-purple-100', text: 'text-purple-700', icon: <Star  className="h-3 w-3" /> },
  'Job Posting':{ bg: 'bg-blue-100',   text: 'text-blue-700',   icon: <Briefcase className="h-3 w-3" /> },
  Grant:        { bg: 'bg-green-100',  text: 'text-green-700',  icon: <Leaf  className="h-3 w-3" /> },
};

const REGION_ICON: Record<Region, React.ReactNode> = {
  Global:  <Globe   className="h-3 w-3" />,
  Nigeria: <MapPin  className="h-3 w-3" />,
  Africa:  <MapPin  className="h-3 w-3" />,
};

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ opp, onClose }: { opp: Opportunity; onClose: () => void }) {
  const ts = TYPE_STYLE[opp.type];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
        {/* Green header */}
        <div className="bg-[#1a4d35] px-6 py-5 relative shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${ts.bg} ${ts.text}`}>
              {ts.icon} {opp.type}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-semibold">
              {REGION_ICON[opp.region]} {opp.region}
            </span>
          </div>
          <h2 className="font-serif font-bold text-white text-lg leading-tight mb-1">{opp.title}</h2>
          <p className="text-sm text-white/70">{opp.org}</p>
          <button onClick={onClose} className="absolute top-4 right-4 h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/30 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
          {/* Deadline + Added row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-100 rounded-xl px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Deadline</p>
              <p className="font-semibold text-foreground text-sm">{opp.deadline}</p>
            </div>
            <div className="bg-stone-100 rounded-xl px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Added to Tolumo</p>
              <p className="font-semibold text-foreground text-sm">{opp.added}</p>
            </div>
          </div>

          {/* About */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">About This Opportunity</p>
            <p className="text-sm text-foreground leading-relaxed">{opp.desc}</p>
          </div>

          {/* Eligibility */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Key Eligibility Requirements</p>
            <div className="space-y-2">
              {opp.eligibility.map((req, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="h-5 w-5 rounded-full bg-[#1a4d35] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <p className="text-sm text-foreground leading-relaxed">{req}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {opp.tags.map(t => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">{t}</span>
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between shrink-0">
          <button onClick={onClose} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">Details</button>
          <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#1a4d35]/90 transition-colors">
            Apply <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
const TYPE_OPTS: ('All' | OppType)[] = ['All', 'Scholarship', 'Internship', 'Job Posting', 'Fellowship', 'Grant'];
const REGION_OPTS: ('All' | Region)[] = ['All', 'Nigeria', 'Africa', 'Global'];
const LEVEL_OPTS: ('All' | Level)[] = ['All', 'Undergraduate', 'Postgraduate', 'Early Career'];
const DEADLINE_OPTS = ['All', 'Closing within 7 days', 'Within 30 days', 'Rolling / Open-ended'] as const;
type DeadlineFilter = typeof DEADLINE_OPTS[number];

export default function Scholarships() {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeF, setTypeF] = useState<'All' | OppType>('All');
  const [regionF, setRegionF] = useState<'All' | Region>('All');
  const [levelF, setLevelF] = useState<'All' | Level>('All');
  const [deadlineF, setDeadlineF] = useState<DeadlineFilter>('All');
  const [tab, setTab] = useState<'all' | 'saved'>('all');
  const [saved, setSaved] = useState<Set<number>>(new Set([2, 5])); // Commonwealth + Justice Initiative pre-saved
  const [detail, setDetail] = useState<Opportunity | null>(null);

  const toggleSave = (id: number) => setSaved(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const hasFilters = typeF !== 'All' || regionF !== 'All' || levelF !== 'All' || deadlineF !== 'All';
  const clearFilters = () => { setTypeF('All'); setRegionF('All'); setLevelF('All'); setDeadlineF('All'); };

  const base = tab === 'saved' ? OPPS.filter(o => saved.has(o.id)) : OPPS;
  const filtered = base.filter(o => {
    if (typeF !== 'All' && o.type !== typeF) return false;
    if (regionF !== 'All' && o.region !== regionF) return false;
    if (levelF !== 'All' && !o.levels.includes(levelF)) return false;
    if (deadlineF === 'Closing within 7 days') {
      if (o.deadlineDays === null || o.deadlineDays > 7) return false;
    } else if (deadlineF === 'Within 30 days') {
      if (o.deadlineDays === null || o.deadlineDays > 30) return false;
    } else if (deadlineF === 'Rolling / Open-ended') {
      if (o.deadlineDays !== null) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!o.title.toLowerCase().includes(q) && !o.org.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function FilterPill<T extends string>({ value, options, set }: { value: T; options: T[]; set: (v: T) => void }) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button key={opt} onClick={() => set(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border
              ${value === opt ? 'bg-[#1a4d35] text-white border-[#1a4d35]' : 'bg-white text-foreground border-stone-200 hover:border-primary/40'}`}>
            {opt}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Scholarships &amp; Opportunities</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Curated scholarships, internships, fellowships, jobs, and grants for law students and early-career legal professionals.
        </p>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="h-4 w-4 rounded-full bg-amber-400 flex items-center justify-center text-[8px] font-bold text-white">G</span>
          <p className="text-xs text-muted-foreground">Powered by <span className="font-semibold text-foreground">Goldcoast Developmental Foundation</span></p>
        </div>
      </div>

      {/* Search + Filters toggle */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search opportunities, organisations..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 bg-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-semibold transition-colors
            ${showFilters || hasFilters ? 'bg-primary text-white border-primary' : 'bg-white border-stone-200 text-foreground hover:border-primary/40'}`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasFilters && <span className="h-4 w-4 rounded-full bg-white/30 text-white text-[9px] font-bold flex items-center justify-center">·</span>}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</p>
            <FilterPill value={typeF} options={TYPE_OPTS} set={setTypeF} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Region</p>
            <FilterPill value={regionF} options={REGION_OPTS} set={setRegionF} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Level</p>
            <FilterPill value={levelF} options={LEVEL_OPTS} set={setLevelF} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deadline</p>
            <FilterPill value={deadlineF} options={[...DEADLINE_OPTS]} set={setDeadlineF} />
          </div>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">Clear all filters</button>
          )}
        </div>
      )}

      {/* Tabs + count */}
      <div className="flex items-center justify-between">
        <div className="flex gap-0 bg-stone-100 rounded-xl p-1">
          <button onClick={() => setTab('all')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${tab === 'all' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            All Opportunities ({OPPS.length})
          </button>
          <button onClick={() => setTab('saved')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${tab === 'saved' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            Saved ({saved.size})
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(opp => {
          const ts = TYPE_STYLE[opp.type];
          const isSaved = saved.has(opp.id);
          return (
            <div key={opp.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow">
              {/* Top row */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${ts.bg} ${ts.text}`}>
                    {ts.icon} {opp.type}
                  </span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 text-[10px] font-semibold">
                    {REGION_ICON[opp.region]} {opp.region}
                  </span>
                  {opp.featured && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">Featured</span>
                  )}
                </div>
                <button
                  onClick={() => toggleSave(opp.id)}
                  className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors
                    ${isSaved ? 'bg-[#1a4d35] border-[#1a4d35] text-white' : 'border-stone-200 text-stone-400 hover:border-primary/40 hover:text-primary'}`}
                >
                  <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-white' : ''}`} />
                </button>
              </div>

              {/* Title + org */}
              <h3 className="font-bold text-foreground leading-snug mb-0.5">{opp.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{opp.org}</p>
              <p className="text-sm text-foreground/80 leading-relaxed mb-3 flex-1 line-clamp-3">{opp.desc}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {opp.tags.map(t => (
                  <span key={t} className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 text-[10px] font-medium">
                    {t}
                  </span>
                ))}
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>{opp.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setDetail(opp)} className="text-xs text-muted-foreground font-medium hover:text-foreground transition-colors">
                    Details
                  </button>
                  <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1a4d35] text-white text-xs font-semibold hover:bg-[#1a4d35]/90 transition-colors">
                    Apply <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <Award className="h-10 w-10 text-stone-300 mx-auto mb-3" />
            <p className="font-semibold text-foreground">No opportunities match</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-stone-200 pt-4">
        <p>Last updated: 12 Jul 2025 · Next update: 19 Jul 2025</p>
        <p>Opportunities are verified and removed after deadline.</p>
      </div>

      {/* Detail modal */}
      {detail && <DetailModal opp={detail} onClose={() => setDetail(null)} />}
    </div>
  );
}
