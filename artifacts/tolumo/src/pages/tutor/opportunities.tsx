import React, { useState } from 'react';
import {
  Search, SlidersHorizontal, Bookmark, ExternalLink, X,
  Award, Star, Leaf, Globe, MapPin, Calendar, ChevronDown,
  GraduationCap, BookOpen, Mic, Send, Users, CheckCircle2,
  ChevronRight,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type OppType =
  | 'PhD Programme'
  | 'Academic Scholarship'
  | 'Postdoctoral Fellowship'
  | 'Research Grant'
  | 'Masterclass'
  | 'Visiting Lectureship'
  | 'Conference Grant';

type Region = 'Nigeria' | 'Africa' | 'Global';
type Audience = 'Early-career Lecturer' | 'Established Academic' | 'PhD Candidate' | 'All Levels';

interface Opportunity {
  id: number;
  type: OppType;
  region: Region;
  audience: Audience[];
  title: string;
  org: string;
  desc: string;
  tags: string[];
  deadline: string;
  deadlineDays: number | null;
  added: string;
  featured: boolean;
  eligibility: string[];
  applyUrl: string;
}

// ── Seed data ─────────────────────────────────────────────────────────────────
const OPPS: Opportunity[] = [
  {
    id: 1,
    type: 'Academic Scholarship', region: 'Global', audience: ['PhD Candidate', 'Early-career Lecturer'],
    title: 'British Academy Postdoctoral Fellowship',
    org: 'British Academy',
    desc: 'Three-year fellowship supporting outstanding early-career researchers to complete a significant piece of publishable work. Fellows are based at a UK host institution and receive a full salary, research expenses, and travel budget.',
    tags: ['Legal Research', 'Public Law', 'Postdoctoral'],
    deadline: '15 Oct 2026', deadlineDays: 82, added: '12 Jul 2026', featured: true,
    eligibility: [
      'PhD awarded within the last 5 years at time of application',
      'Proposed research must fall within the humanities or social sciences',
      'Affiliation with a UK higher education institution required',
      'Nigerian nationality is eligible',
    ],
    applyUrl: 'https://www.thebritishacademy.ac.uk',
  },
  {
    id: 2,
    type: 'PhD Programme', region: 'Global', audience: ['Early-career Lecturer', 'PhD Candidate'],
    title: 'Commonwealth Split-Site PhD Scholarship',
    org: 'Commonwealth Scholarship Commission',
    desc: "Enables PhD candidates registered at Nigerian universities to spend 12 months at a UK university, accessing world-class facilities and supervision without leaving their home institution's programme.",
    tags: ['PhD', 'Constitutional Law', 'Commonwealth'],
    deadline: '15 Nov 2026', deadlineDays: 113, added: '12 Jul 2026', featured: true,
    eligibility: [
      'Currently registered for a PhD at a recognised Nigerian university',
      'Home supervisor and proposed UK supervisor in agreement',
      'Demonstrated strong academic record and research proposal',
      'Nigerian citizenship or permanent residency',
    ],
    applyUrl: 'https://cscuk.fcdo.gov.uk',
  },
  {
    id: 3,
    type: 'Postdoctoral Fellowship', region: 'Global', audience: ['Early-career Lecturer'],
    title: 'Humboldt Research Fellowship — Experienced Researcher',
    org: 'Alexander von Humboldt Foundation',
    desc: 'Prestigious German fellowship for internationally experienced researchers to carry out a long-term research project (6–18 months) in collaboration with a specialist from a German host institution. Covers full living expenses and travel.',
    tags: ['Legal Research', 'International Law', 'Germany'],
    deadline: 'Rolling intake', deadlineDays: null, added: '12 Jul 2026', featured: false,
    eligibility: [
      'PhD with above-average qualifications',
      'Publications in international peer-reviewed journals',
      'Agreement from a German academic host',
      'Application submitted at least 4 months before intended start',
    ],
    applyUrl: 'https://www.humboldt-foundation.de',
  },
  {
    id: 4,
    type: 'Research Grant', region: 'Africa', audience: ['Established Academic', 'Early-career Lecturer'],
    title: 'African Research Initiative — Law & Governance Track',
    org: 'Carnegie Corporation of New York',
    desc: 'Research grants of up to $50,000 for African scholars conducting original research on law, governance, accountability, and rule of law within the African context. Funds fieldwork, data collection, and publication preparation.',
    tags: ['Legal Research', 'Public Law', 'Governance', 'Africa'],
    deadline: '1 Sep 2026', deadlineDays: 38, added: '12 Jul 2026', featured: true,
    eligibility: [
      'Employed at an African university or research institution',
      'Research proposal must be Africa-focused with clear policy impact',
      'Evidence of prior scholarly output (publications, conference papers)',
      'Open to early-career and senior academics',
    ],
    applyUrl: 'https://www.carnegie.org',
  },
  {
    id: 5,
    type: 'Masterclass', region: 'Global', audience: ['All Levels'],
    title: 'Oxford Summer School in Constitutional Law',
    org: 'University of Oxford — Faculty of Law',
    desc: 'Intensive week-long residential masterclass covering comparative constitutional design, judicial review, separation of powers, and rights adjudication. Led by Oxford constitutional law faculty with case-study workshops and small-group seminars.',
    tags: ['Constitutional Law', 'Pedagogy', 'Comparative Law'],
    deadline: '30 Apr 2027', deadlineDays: 279, added: '12 Jul 2026', featured: false,
    eligibility: [
      'Open to legal academics and practitioners worldwide',
      'Basic familiarity with constitutional law concepts expected',
      'Limited bursaries available for participants from low-income countries',
    ],
    applyUrl: 'https://www.law.ox.ac.uk',
  },
  {
    id: 6,
    type: 'Visiting Lectureship', region: 'Global', audience: ['Established Academic'],
    title: 'Hauser Global Law School Visiting Faculty',
    org: 'NYU School of Law',
    desc: 'Semester-length visiting faculty position at NYU Law School in New York. Visiting scholars teach one course in their area of expertise and engage in the full intellectual life of the school — workshops, colloquia, and research collaboration.',
    tags: ['Teaching', 'International Law', 'USA'],
    deadline: '1 Dec 2026', deadlineDays: 129, added: '12 Jul 2026', featured: true,
    eligibility: [
      'Tenured or senior non-tenured academic with an established research profile',
      'Strong publication record in law or a related field',
      'Ability to teach a full course in English',
      'Priority given to scholars from the Global South',
    ],
    applyUrl: 'https://www.law.nyu.edu',
  },
  {
    id: 7,
    type: 'Conference Grant', region: 'Africa', audience: ['Early-career Lecturer', 'PhD Candidate'],
    title: 'SEALS — African Law Conference Travel Award',
    org: 'Southeastern Association of Law Schools (SEALS)',
    desc: 'Travel grant covering economy flights, accommodation, and registration fees for Nigerian law academics to attend and present at the annual SEALS conference. Awardees are paired with a US law school mentor for the duration of the conference.',
    tags: ['Conference', 'Networking', 'Career Development'],
    deadline: '15 Aug 2026', deadlineDays: 21, added: '12 Jul 2026', featured: false,
    eligibility: [
      'Full-time academic at a Nigerian law faculty',
      'Accepted paper or panel contribution at SEALS conference',
      'Within first 7 years of academic career',
    ],
    applyUrl: 'https://www.sealslaw.org',
  },
  {
    id: 8,
    type: 'Research Grant', region: 'Nigeria', audience: ['Established Academic', 'Early-career Lecturer'],
    title: 'MacArthur Foundation Nigeria Rule of Law Grant',
    org: 'John D. and Catherine T. MacArthur Foundation',
    desc: 'Research funding for Nigerian institutions and academics working on accountability, anti-corruption, electoral justice, and rule of law. The programme prioritises work with clear links to policy change or public interest litigation.',
    tags: ['Rule of Law', 'Public Interest', 'Policy Research'],
    deadline: '31 Oct 2026', deadlineDays: 98, added: '12 Jul 2026', featured: false,
    eligibility: [
      'Nigerian academic or civil society researcher as lead',
      'Institutional affiliation with a Nigerian university or organisation',
      'Clear demonstration of policy impact pathway',
      'Previous publication or project in the rule of law space preferred',
    ],
    applyUrl: 'https://www.macfound.org',
  },
  {
    id: 9,
    type: 'Masterclass', region: 'Nigeria', audience: ['All Levels'],
    title: 'Law Pedagogy Institute — Legal Teaching Methods',
    org: 'Nigerian Institute of Advanced Legal Studies (NIALS)',
    desc: 'Three-day residential pedagogy training for law lecturers and senior teaching assistants. Topics include active learning in large law classes, case method facilitation, moot court design, and assessment innovation in Nigerian law faculties.',
    tags: ['Pedagogy', 'Teaching Methods', 'Nigerian Law'],
    deadline: '14 Aug 2026', deadlineDays: 20, added: '12 Jul 2026', featured: false,
    eligibility: [
      'Teaching staff or graduate teaching assistant at an accredited Nigerian law faculty',
      'Minimum two semesters of law teaching experience',
      'Institutional endorsement from department head',
    ],
    applyUrl: 'https://www.nials.edu.ng',
  },
  {
    id: 10,
    type: 'PhD Programme', region: 'Global', audience: ['Early-career Lecturer', 'PhD Candidate'],
    title: 'Gates Cambridge Scholarship',
    org: 'Gates Cambridge Trust',
    desc: "Full-cost scholarship for outstanding applicants from outside the UK to pursue a full-time postgraduate degree in any subject at the University of Cambridge. One of the world's most prestigious postgraduate awards.",
    tags: ['PhD', 'Postgraduate', 'Cambridge'],
    deadline: '8 Oct 2026', deadlineDays: 75, added: '12 Jul 2026', featured: true,
    eligibility: [
      'Citizen of any country outside the UK',
      'Applying for a full-time postgraduate degree at Cambridge',
      'Exceptional intellectual ability and leadership potential',
      'Strong commitment to improving lives of others',
    ],
    applyUrl: 'https://www.gatescambridge.org',
  },
];

// ── Pill configs ──────────────────────────────────────────────────────────────
const TYPE_STYLE: Record<OppType, { bg: string; text: string; icon: React.ReactNode }> = {
  'PhD Programme':       { bg: 'bg-purple-100', text: 'text-purple-700', icon: <GraduationCap className="h-3 w-3" /> },
  'Academic Scholarship':{ bg: 'bg-[#e8f0ee]',  text: 'text-[#1a4d35]', icon: <Award className="h-3 w-3" /> },
  'Postdoctoral Fellowship':{ bg: 'bg-blue-100', text: 'text-blue-700',  icon: <Star className="h-3 w-3" /> },
  'Research Grant':      { bg: 'bg-green-100',  text: 'text-green-700',  icon: <Leaf className="h-3 w-3" /> },
  'Masterclass':         { bg: 'bg-amber-100',  text: 'text-amber-700',  icon: <Mic className="h-3 w-3" /> },
  'Visiting Lectureship':{ bg: 'bg-orange-100', text: 'text-orange-700', icon: <BookOpen className="h-3 w-3" /> },
  'Conference Grant':    { bg: 'bg-rose-100',   text: 'text-rose-700',   icon: <Globe className="h-3 w-3" /> },
};

const REGION_ICON: Record<Region, React.ReactNode> = {
  Global:  <Globe  className="h-3 w-3" />,
  Nigeria: <MapPin className="h-3 w-3" />,
  Africa:  <MapPin className="h-3 w-3" />,
};

// ── Known students for recommend modal ────────────────────────────────────────
const KNOWN_STUDENTS = [
  { id: 's1', name: 'Chisom Nwosu',  school: 'University of Lagos',          year: '200 Level' },
  { id: 's2', name: 'Emeka Eze',     school: 'Enugu State University',        year: '200 Level' },
  { id: 's3', name: 'Fatima Bello',  school: 'Ahmadu Bello University',       year: '200 Level' },
  { id: 's4', name: 'Adaeze Okonkwo',school: 'University of Nigeria, Nsukka', year: '200 Level' },
  { id: 's5', name: 'Tunde Olatunji',school: 'University of Ibadan',          year: '200 Level' },
  { id: 's6', name: 'Ngozi Obi',     school: 'UNIZIK Awka',                   year: '300 Level' },
  { id: 's7', name: 'Chidera Ude',   school: 'University of Calabar',          year: '400 Level' },
];

const YEAR_GROUPS = ['100 Level', '200 Level', '300 Level', '400 Level', 'LLM / BL', 'All students'];

// ── Recommend Modal ───────────────────────────────────────────────────────────
function RecommendModal({ opp, onClose }: { opp: Opportunity; onClose: () => void }) {
  const [mode, setMode] = useState<'individual' | 'group'>('individual');
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [sent, setSent] = useState(false);

  const ts = TYPE_STYLE[opp.type];

  const toggleStudent = (id: string) => {
    setSelectedStudents(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const canSend = mode === 'individual' ? selectedStudents.size > 0 : !!selectedGroup;

  const handleSend = () => {
    if (!canSend) return;
    setSent(true);
  };

  const recipientLabel = mode === 'group'
    ? selectedGroup
    : selectedStudents.size === 0
      ? '—'
      : selectedStudents.size === 1
        ? KNOWN_STUDENTS.find(s => selectedStudents.has(s.id))?.name
        : `${selectedStudents.size} students`;

  if (sent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center text-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#1a4d35]/10 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-[#1a4d35]" />
          </div>
          <div>
            <p className="font-serif font-bold text-lg text-foreground">Recommendation sent</p>
            <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
              <span className="font-semibold text-foreground">{recipientLabel}</span> will receive a notification:
              <br /><span className="italic">"{`Prof. Adeyemi recommended an opportunity to you.`}"</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-2 w-full py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#1a4d35]/90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[88vh]">
        {/* Header */}
        <div className="bg-[#1a4d35] px-6 py-5 shrink-0">
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Recommend to students</p>
              <h2 className="font-serif font-bold text-white text-base leading-snug">{opp.title}</h2>
              <p className="text-xs text-white/60 mt-0.5">{opp.org}</p>
            </div>
            <button onClick={onClose} className="h-7 w-7 rounded-full bg-white/15 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/25 transition-colors shrink-0 mt-0.5">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${ts.bg} ${ts.text}`}>
              {ts.icon}{opp.type}
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-semibold">
              {REGION_ICON[opp.region]} {opp.region}
            </span>
          </div>
        </div>

        {/* Mode toggle */}
        <div className="px-6 pt-5 pb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Send to</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setMode('individual')}
              className={`py-2.5 rounded-xl border text-sm font-semibold transition-colors ${mode === 'individual' ? 'bg-[#1a4d35] border-[#1a4d35] text-white' : 'border-stone-200 text-foreground hover:border-stone-300'}`}
            >
              Individual student
            </button>
            <button
              onClick={() => setMode('group')}
              className={`py-2.5 rounded-xl border text-sm font-semibold transition-colors ${mode === 'group' ? 'bg-[#1a4d35] border-[#1a4d35] text-white' : 'border-stone-200 text-foreground hover:border-stone-300'}`}
            >
              Year group
            </button>
          </div>
        </div>

        {/* Selection */}
        <div className="flex-1 overflow-y-auto px-6 pb-5">
          {mode === 'individual' ? (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Select students</p>
              {KNOWN_STUDENTS.map(s => {
                const checked = selectedStudents.has(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleStudent(s.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${checked ? 'bg-[#1a4d35]/5 border-[#1a4d35]/30' : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${checked ? 'bg-[#1a4d35] text-white' : 'bg-stone-200 text-stone-600'}`}>
                      {s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.school} · {s.year}</p>
                    </div>
                    <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${checked ? 'bg-[#1a4d35] border-[#1a4d35]' : 'border-stone-300'}`}>
                      {checked && <CheckCircle2 className="h-3 w-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Select year group</p>
              {YEAR_GROUPS.map(g => (
                <button
                  key={g}
                  onClick={() => setSelectedGroup(g)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all ${selectedGroup === g ? 'bg-[#1a4d35]/5 border-[#1a4d35]/30' : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${selectedGroup === g ? 'bg-[#1a4d35]' : 'bg-stone-100'}`}>
                      <Users className={`h-4 w-4 ${selectedGroup === g ? 'text-white' : 'text-stone-500'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{g}</p>
                      <p className="text-xs text-muted-foreground">Notified in their feed</p>
                    </div>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedGroup === g ? 'bg-[#1a4d35] border-[#1a4d35]' : 'border-stone-300'}`}>
                    {selectedGroup === g && <CheckCircle2 className="h-3 w-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Optional note */}
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Add a note (optional)</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder={`e.g. "This aligns perfectly with your research interest in public law…"`}
              rows={2}
              className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[#1a4d35]/40 focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50 shrink-0 flex items-center justify-between gap-3">
          <button onClick={onClose} className="text-sm text-muted-foreground font-medium hover:text-foreground transition-colors">Cancel</button>
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#1a4d35]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
            Send recommendation
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Detail Modal ──────────────────────────────────────────────────────────────
function DetailModal({ opp, onClose, onRecommend }: { opp: Opportunity; onClose: () => void; onRecommend: () => void }) {
  const ts = TYPE_STYLE[opp.type];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[88vh]">
        <div className="bg-[#1a4d35] px-6 py-5 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${ts.bg} ${ts.text}`}>{ts.icon} {opp.type}</span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-white text-[10px] font-semibold">{REGION_ICON[opp.region]} {opp.region}</span>
          </div>
          <h2 className="font-serif font-bold text-white text-lg leading-tight mb-1">{opp.title}</h2>
          <p className="text-sm text-white/70">{opp.org}</p>
          <button onClick={onClose} className="absolute top-4 right-4 h-7 w-7 rounded-full bg-white/20 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/30 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 space-y-5 flex-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-stone-100 rounded-xl px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Deadline</p>
              <p className="font-semibold text-foreground text-sm">{opp.deadline}</p>
            </div>
            <div className="bg-stone-100 rounded-xl px-4 py-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Added to Tolumor</p>
              <p className="font-semibold text-foreground text-sm">{opp.added}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">About This Opportunity</p>
            <p className="text-sm text-foreground leading-relaxed">{opp.desc}</p>
          </div>
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
          <div className="flex flex-wrap gap-1.5 pb-1">
            {opp.tags.map(t => (
              <span key={t} className="px-3 py-1.5 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">{t}</span>
            ))}
          </div>
        </div>
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between gap-2 shrink-0">
          <button
            onClick={onRecommend}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#1a4d35] text-[#1a4d35] text-sm font-semibold hover:bg-[#1a4d35]/5 transition-colors"
          >
            <Send className="h-3.5 w-3.5" /> Recommend
          </button>
          <a href={opp.applyUrl} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#1a4d35]/90 transition-colors">
            Apply <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Filter types ──────────────────────────────────────────────────────────────
const TYPE_OPTS: ('All' | OppType)[] = ['All', 'PhD Programme', 'Academic Scholarship', 'Postdoctoral Fellowship', 'Research Grant', 'Masterclass', 'Visiting Lectureship', 'Conference Grant'];
const REGION_OPTS: ('All' | Region)[] = ['All', 'Nigeria', 'Africa', 'Global'];
const AUDIENCE_OPTS: ('All' | Audience)[] = ['All', 'Early-career Lecturer', 'Established Academic', 'PhD Candidate', 'All Levels'];
const DEADLINE_OPTS = ['All', 'Closing within 7 days', 'Within 30 days', 'Rolling / Open-ended'] as const;
type DeadlineFilter = typeof DEADLINE_OPTS[number];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function LecturerOpportunities() {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeF, setTypeF] = useState<'All' | OppType>('All');
  const [regionF, setRegionF] = useState<'All' | Region>('All');
  const [audienceF, setAudienceF] = useState<'All' | Audience>('All');
  const [deadlineF, setDeadlineF] = useState<DeadlineFilter>('All');
  const [tab, setTab] = useState<'all' | 'saved'>('all');
  const [saved, setSaved] = useState<Set<number>>(new Set([2, 10]));
  const [detail, setDetail] = useState<Opportunity | null>(null);
  const [recommending, setRecommending] = useState<Opportunity | null>(null);

  const toggleSave = (id: number) => setSaved(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

  const hasFilters = typeF !== 'All' || regionF !== 'All' || audienceF !== 'All' || deadlineF !== 'All';
  const clearFilters = () => { setTypeF('All'); setRegionF('All'); setAudienceF('All'); setDeadlineF('All'); };

  const base = tab === 'saved' ? OPPS.filter(o => saved.has(o.id)) : OPPS;
  const filtered = base.filter(o => {
    if (typeF !== 'All' && o.type !== typeF) return false;
    if (regionF !== 'All' && o.region !== regionF) return false;
    if (audienceF !== 'All' && !o.audience.includes(audienceF) && o.audience[0] !== 'All Levels') return false;
    if (deadlineF === 'Closing within 7 days') { if (o.deadlineDays === null || o.deadlineDays > 7) return false; }
    else if (deadlineF === 'Within 30 days') { if (o.deadlineDays === null || o.deadlineDays > 30) return false; }
    else if (deadlineF === 'Rolling / Open-ended') { if (o.deadlineDays !== null) return false; }
    if (search) { const q = search.toLowerCase(); if (!o.title.toLowerCase().includes(q) && !o.org.toLowerCase().includes(q)) return false; }
    return true;
  });

  function FilterPill<T extends string>({ value, options, set }: { value: T; options: T[]; set: (v: T) => void }) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {options.map(opt => (
          <button key={opt} onClick={() => set(opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${value === opt ? 'bg-[#1a4d35] text-white border-[#1a4d35]' : 'bg-white text-foreground border-stone-200 hover:border-primary/40'}`}>
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
        <h1 className="text-2xl font-serif font-bold text-foreground">Academic Opportunities</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Curated PhD programmes, scholarships, fellowships, masterclasses, and research grants for law academics and researchers.
        </p>
        <div className="flex items-center gap-3 mt-3">
          <div className="flex items-center gap-1.5">
            <span className="h-4 w-4 rounded-full bg-amber-400 flex items-center justify-center text-[8px] font-bold text-white">G</span>
            <p className="text-xs text-muted-foreground">Curated by <span className="font-semibold text-foreground">Goldcoast Developmental Foundation</span></p>
          </div>
          <span className="text-stone-300">·</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>Use <span className="font-semibold text-foreground">Recommend</span> to share an opportunity directly with your students</span>
          </div>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search opportunities, organisations..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 bg-white" />
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-2 px-4 h-10 rounded-xl border text-sm font-semibold transition-colors ${showFilters || hasFilters ? 'bg-primary text-white border-primary' : 'bg-white border-stone-200 text-foreground hover:border-primary/40'}`}
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
          <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Type</p><FilterPill value={typeF} options={TYPE_OPTS} set={setTypeF} /></div>
          <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Region</p><FilterPill value={regionF} options={REGION_OPTS} set={setRegionF} /></div>
          <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Audience</p><FilterPill value={audienceF} options={AUDIENCE_OPTS} set={setAudienceF} /></div>
          <div className="space-y-1"><p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Deadline</p><FilterPill value={deadlineF} options={[...DEADLINE_OPTS]} set={setDeadlineF} /></div>
          {hasFilters && <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">Clear all filters</button>}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-0 bg-stone-100 rounded-xl p-1">
          <button onClick={() => setTab('all')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${tab === 'all' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            All Opportunities ({OPPS.length})
          </button>
          <button onClick={() => setTab('saved')} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${tab === 'saved' ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
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
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${ts.bg} ${ts.text}`}>{ts.icon} {opp.type}</span>
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 text-[10px] font-semibold">{REGION_ICON[opp.region]} {opp.region}</span>
                  {opp.featured && <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">Featured</span>}
                </div>
                <button onClick={() => toggleSave(opp.id)}
                  className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${isSaved ? 'bg-[#1a4d35] border-[#1a4d35] text-white' : 'border-stone-200 text-stone-400 hover:border-primary/40 hover:text-primary'}`}>
                  <Bookmark className={`h-3.5 w-3.5 ${isSaved ? 'fill-white' : ''}`} />
                </button>
              </div>

              <h3 className="font-bold text-foreground leading-snug mb-0.5">{opp.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{opp.org}</p>
              <p className="text-sm text-foreground/80 leading-relaxed mb-3 flex-1 line-clamp-3">{opp.desc}</p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {opp.tags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-500 text-[10px] font-medium">{t}</span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-stone-100 pt-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  <span>{opp.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Recommend */}
                  <button onClick={() => setRecommending(opp)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#1a4d35] text-[#1a4d35] text-xs font-semibold hover:bg-[#1a4d35]/5 transition-colors">
                    <Send className="h-3 w-3" /> Recommend
                  </button>
                  <button onClick={() => setDetail(opp)} className="text-xs text-muted-foreground font-medium hover:text-foreground transition-colors">Details</button>
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
        <p>Last updated: 12 Jul 2026 · Next update: 19 Jul 2026</p>
        <p>Opportunities are verified and removed after deadline.</p>
      </div>

      {detail && <DetailModal opp={detail} onClose={() => setDetail(null)} onRecommend={() => { setRecommending(detail); setDetail(null); }} />}
      {recommending && <RecommendModal opp={recommending} onClose={() => setRecommending(null)} />}
    </div>
  );
}
