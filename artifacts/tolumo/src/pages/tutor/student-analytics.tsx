import { useState } from 'react';
import { CheckCircle2, TrendingUp, TrendingDown, Star, DollarSign, MessageSquare } from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = 'performance' | 'earnings' | 'feedback';

// ── Mock data ─────────────────────────────────────────────────────────────────
const MODULES = [
  {
    code: 'Constitutional Law 201',
    enrolled: 3840,
    completed: 922,
    avgScore: 74,
    failRate: 18,
  },
  {
    code: 'Law of Contract 202',
    enrolled: 2910,
    completed: 641,
    avgScore: 71,
    failRate: 22,
  },
];

const QUIZ_RESULTS = [
  { name: 'Chisom Nwosu',     initials: 'CN', institution: 'UNILAG',    module: 'LAW 201', topic: 'Topic 3', mcq: '4/5', essay: '74%', pass: true  },
  { name: 'Emeka Okafor',     initials: 'EO', institution: 'UniPort',   module: 'LAW 201', topic: 'Topic 3', mcq: '5/5', essay: '88%', pass: true  },
  { name: 'Fatima Al-Hassan', initials: 'FA', institution: 'ABU Zaria', module: 'LAW 201', topic: 'Topic 2', mcq: '3/5', essay: '62%', pass: true  },
  { name: 'Ngozi Eze',        initials: 'NE', institution: 'OAU',       module: 'LAW 202', topic: 'Topic 1', mcq: '2/5', essay: '45%', pass: false },
  { name: 'Tunde Adeleke',    initials: 'TA', institution: 'LASU',      module: 'LAW 202', topic: 'Topic 4', mcq: '5/5', essay: '91%', pass: true  },
  { name: 'Amara Diallo',     initials: 'AD', institution: 'UNN',       module: 'LAW 201', topic: 'Topic 5', mcq: '4/5', essay: '79%', pass: true  },
];

const SESSION_EARNINGS = [
  { topic: 'Federalism & the Second Schedule', module: 'LAW 201', date: '10 Jul 2025', students: 22, gross: 55000 },
  { topic: 'Supremacy of the Constitution',    module: 'LAW 201', date: '3 Jul 2025',  students: 18, gross: 45000 },
  { topic: 'Offer & Acceptance — Postal Rule', module: 'LAW 202', date: '25 Jun 2025', students: 14, gross: 21000 },
];

const FEEDBACK = [
  { name: 'Chisom Nwosu',     initials: 'CN', module: 'LAW 201', rating: 5, date: '18 Jul 2025', comment: 'Prof. Adeyemi breaks down complex constitutional principles into very digestible bits. The visual aids are excellent!' },
  { name: 'Emeka Okafor',     initials: 'EO', module: 'LAW 202', rating: 5, date: '15 Jul 2025', comment: "Best tutor I've had for contract law. Very patient, explains offer and acceptance with real-world Nigerian examples." },
  { name: 'Fatima Al-Hassan', initials: 'FA', module: 'LAW 201', rating: 4, date: '10 Jul 2025', comment: 'Great sessions, though sometimes the pace is a bit fast. Would love more time on the fundamental rights chapter.' },
  { name: 'Ngozi Eze',        initials: 'NE', module: 'LAW 202', rating: 4, date: '3 Jul 2025',  comment: 'Very knowledgeable. Notes and slides are top-notch. Would appreciate more practice questions before exams.' },
];

// ── Shared subcomponents ──────────────────────────────────────────────────────
function StatCard({ label, value, color = 'text-foreground' }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm px-6 py-5 text-center">
      <p className={`text-2xl font-bold font-serif ${color}`}>{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} className={`h-3.5 w-3.5 ${i <= rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200 fill-stone-200'}`} />
      ))}
    </div>
  );
}

function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' }) {
  const sz = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs';
  return (
    <div className={`${sz} rounded-full bg-primary/10 flex items-center justify-center shrink-0`}>
      <span className="font-bold text-primary">{initials}</span>
    </div>
  );
}

// ── Tab: Student Performance ──────────────────────────────────────────────────
function StudentPerformance() {
  return (
    <div className="space-y-6">
      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Enrolled"     value="6,750" />
        <StatCard label="Topic Completions"  value="1,563" color="text-primary" />
        <StatCard label="Avg Quiz Score"     value="72%"   color="text-amber-500" />
        <StatCard label="Overall Fail Rate"  value="19%"   color="text-red-500" />
      </div>

      {/* Module cards */}
      <div className="grid lg:grid-cols-2 gap-5">
        {MODULES.map(m => (
          <div key={m.code} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <h3 className="font-serif font-semibold text-foreground mb-4">{m.code}</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Enrolled',   value: m.enrolled.toLocaleString(), color: 'text-primary' },
                { label: 'Completed',  value: m.completed.toLocaleString(), color: 'text-primary' },
                { label: 'Avg Score',  value: `${m.avgScore}%`,  color: 'text-amber-500' },
                { label: 'Fail Rate',  value: `${m.failRate}%`,  color: 'text-red-500'   },
              ].map(({ label, value, color }) => (
                <div key={label} className="bg-[#F5F2EB] rounded-lg px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{label}</p>
                  <p className={`text-xl font-bold font-serif ${color}`}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Quiz Results */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="font-serif font-semibold text-foreground">Recent Quiz Results</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
                {['Student', 'Institution', 'Module', 'Topic', 'MCQ', 'Essay', 'Pass?'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {QUIZ_RESULTS.map(r => (
                <tr key={r.name} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={r.initials} size="sm" />
                      <span className="font-medium text-foreground">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{r.institution}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.module}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.topic}</td>
                  <td className="px-5 py-3 font-semibold text-foreground">{r.mcq}</td>
                  <td className="px-5 py-3 font-semibold text-foreground">{r.essay}</td>
                  <td className="px-5 py-3">
                    {r.pass ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">Fail</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab: My Earnings ──────────────────────────────────────────────────────────
const PLATFORM_RATE = 0.15;

function MyEarnings() {
  const rows = SESSION_EARNINGS.map(s => ({
    ...s,
    platform: Math.round(s.gross * PLATFORM_RATE),
    net: Math.round(s.gross * (1 - PLATFORM_RATE)),
  }));
  const totalGross    = rows.reduce((sum, r) => sum + r.gross,    0);
  const totalPlatform = rows.reduce((sum, r) => sum + r.platform, 0);
  const totalNet      = rows.reduce((sum, r) => sum + r.net,      0);
  const totalStudents = rows.reduce((sum, r) => sum + r.students, 0);

  const fmt = (n: number) => `₦${n.toLocaleString()}`;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Net Earnings" value={fmt(totalNet)}      color="text-foreground" />
        <StatCard label="Gross Revenue"      value={fmt(totalGross)}    color="text-primary" />
        <StatCard label="Platform Fee (15%)" value={fmt(totalPlatform)} color="text-amber-500" />
        <StatCard label="Students Taught"    value={String(totalStudents)} color="text-violet-600" />
      </div>

      {/* Breakdown table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="font-serif font-semibold text-foreground">Session Earnings Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
                {['Topic', 'Module', 'Date', 'Students', 'Gross', 'Platform (15%)', 'Your Net'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {rows.map(r => (
                <tr key={r.topic} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-foreground">{r.topic}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.module}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{r.date}</td>
                  <td className="px-5 py-3.5 text-foreground font-semibold">{r.students}</td>
                  <td className="px-5 py-3.5 text-foreground font-semibold">{fmt(r.gross)}</td>
                  <td className="px-5 py-3.5 text-red-500 font-semibold">-{fmt(r.platform)}</td>
                  <td className="px-5 py-3.5 text-foreground font-bold">{fmt(r.net)}</td>
                </tr>
              ))}
              {/* Total row */}
              <tr className="bg-stone-50/80 border-t-2 border-stone-200">
                <td className="px-5 py-3.5 font-bold text-foreground" colSpan={4}>Total</td>
                <td className="px-5 py-3.5 font-bold text-foreground">{fmt(totalGross)}</td>
                <td className="px-5 py-3.5 font-bold text-red-500">-{fmt(totalPlatform)}</td>
                <td className="px-5 py-3.5 font-bold text-foreground">{fmt(totalNet)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Policy notice */}
        <div className="px-6 py-4 border-t border-stone-100 bg-stone-50/40">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Earnings policy:</span>{' '}
            Tolumo retains 15% of each tutorial session fee as a platform service charge.
            Your net earnings are transferred to your registered bank account within 3 working
            days after each session concludes.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Rating Trend sparkline (pure SVG) ─────────────────────────────────────────
function RatingTrend({ values }: { values: number[] }) {
  const W = 700, H = 80, PAD = 12;
  const minV = 1, maxV = 5;
  const xs = values.map((_, i) => PAD + (i / (values.length - 1)) * (W - PAD * 2));
  const ys = values.map(v => H - PAD - ((v - minV) / (maxV - minV)) * (H - PAD * 2));
  const path = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${x} ${ys[i]}`).join(' ');

  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Rating Trend (Last 5 Weeks)</p>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20">
          {/* Y axis guides */}
          {[1,2,3,4,5].map(v => {
            const y = H - PAD - ((v - minV) / (maxV - minV)) * (H - PAD * 2);
            return (
              <g key={v}>
                <line x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="#e7e5e4" strokeWidth="1" />
                <text x={0} y={y + 4} fontSize="10" fill="#a8a29e">{v}</text>
              </g>
            );
          })}
          {/* Line */}
          <path d={path} fill="none" stroke="hsl(153,54%,15%)" strokeWidth="2" strokeLinejoin="round" />
          {/* Dots */}
          {xs.map((x, i) => (
            <circle key={i} cx={x} cy={ys[i]} r="4" fill="hsl(153,54%,15%)" />
          ))}
        </svg>
        {/* X axis labels */}
        <div className="flex justify-between px-3 -mt-1">
          {values.map((_, i) => (
            <span key={i} className="text-[10px] text-muted-foreground">Wk {i + 1}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Topic feedback data ───────────────────────────────────────────────────────
const TOPIC_FEEDBACK = [
  {
    topic: 'Topic 1: Origins of Federalism',
    module: 'LAW 201',
    avgRating: 4.3,
    responses: 87,
    trend: [4.1, 4.0, 4.4, 4.5, 4.3],
    notes: [
      { initial: 'C', name: 'Chisom N.', institution: 'UNILAG', date: '12 Jul', rating: 5, comment: '"The historical timeline was brilliant. I finally understand why the 1954 Lyttelton Constitution matters so much."' },
      { initial: 'E', name: 'Emeka O.',  institution: 'UniPort', date: '11 Jul', rating: 4, comment: '"Good lecture overall. Would be better with more Nigerian case law referenced, especially recent SCNJ decisions."' },
      { initial: 'F', name: 'Fatima A.', institution: 'ABU Zaria', date: '10 Jul', rating: 4, comment: '"Very clear explanation of the Richards and Macpherson constitutions. Notes are well-structured."' },
      { initial: 'N', name: 'Ngozi E.',  institution: 'OAU',     date: '9 Jul',  rating: 5, comment: '"Loved the comparative approach with other federal systems. Made the material click immediately."' },
      { initial: 'T', name: 'Tunde A.',  institution: 'LASU',    date: '8 Jul',  rating: 4, comment: '"Session was engaging. Would appreciate a practice Q&A session before the exam."' },
    ],
  },
  {
    topic: 'Topic 2: Supremacy of the Constitution',
    module: 'LAW 201',
    avgRating: 4.6,
    responses: 91,
    trend: [4.4, 4.5, 4.6, 4.7, 4.6],
    notes: [
      { initial: 'A', name: 'Amara D.',  institution: 'UNN',     date: '5 Jul',  rating: 5, comment: '"The section 1 CFRN breakdown was spot-on. Finally understand the supremacy clause in context."' },
      { initial: 'C', name: 'Chisom N.', institution: 'UNILAG',  date: '4 Jul',  rating: 5, comment: '"Best session yet. Real cases used throughout. Very helpful for bar prep."' },
      { initial: 'E', name: 'Emeka O.',  institution: 'UniPort', date: '3 Jul',  rating: 4, comment: '"Solid content. Slides could use a bit more visual hierarchy but the explanations are top-tier."' },
    ],
  },
  {
    topic: 'Topic 3: Offer & Acceptance — Postal Rule',
    module: 'LAW 202',
    avgRating: 4.1,
    responses: 74,
    trend: [3.9, 4.0, 4.2, 4.0, 4.3],
    notes: [
      { initial: 'F', name: 'Fatima A.', institution: 'ABU Zaria', date: '28 Jun', rating: 4, comment: '"Adams v Lindsell was explained really well. The Nigerian equivalents were a nice touch."' },
      { initial: 'N', name: 'Ngozi E.',  institution: 'OAU',       date: '27 Jun', rating: 4, comment: '"Good pace. The hypothetical scenarios made it easy to apply the rule."' },
    ],
  },
];

const AVATAR_COLORS = [
  'bg-emerald-100 text-emerald-700',
  'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
];

// ── Tab: Student Feedback ─────────────────────────────────────────────────────
function StudentFeedback() {
  const [open, setOpen] = useState<string | null>(TOPIC_FEEDBACK[0].topic);

  const totalResponses = TOPIC_FEEDBACK.reduce((s, t) => s + t.responses, 0);
  const overallAvg = (
    TOPIC_FEEDBACK.reduce((s, t) => s + t.avgRating * t.responses, 0) / totalResponses
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Overall Avg. Rating" value={`${overallAvg} / 5`} color="text-foreground" />
        <StatCard label="Total Responses"     value={totalResponses.toString()} color="text-primary" />
        <StatCard label="Topics with Feedback" value={TOPIC_FEEDBACK.length.toString()} color="text-violet-600" />
      </div>

      {/* Per-topic accordions */}
      <div className="space-y-3">
        {TOPIC_FEEDBACK.map((t, ti) => {
          const isOpen = open === t.topic;
          return (
            <div key={t.topic} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
              {/* Header row */}
              <button
                onClick={() => setOpen(isOpen ? null : t.topic)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-stone-50/50 transition-colors text-left"
              >
                <div className="flex items-start gap-4">
                  {/* Stars */}
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-4 w-4 ${i <= Math.round(t.avgRating) ? 'fill-amber-400 text-amber-400' : 'text-stone-200 fill-stone-200'}`} />
                    ))}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{t.topic}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t.avgRating} avg · {t.responses} responses
                      <span className="ml-2 bg-stone-100 px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">{t.module}</span>
                    </p>
                  </div>
                </div>
                <span className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  ▾
                </span>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="border-t border-stone-100 px-6 pb-6 pt-5 space-y-6 bg-[#FAFAF8]">
                  {/* Trend chart */}
                  <RatingTrend values={t.trend} />

                  {/* Notes */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                      Student Notes ({t.notes.length})
                    </p>
                    <div className="space-y-3">
                      {t.notes.map((n, ni) => (
                        <div key={ni} className="bg-white rounded-lg border border-stone-100 px-5 py-4">
                          <div className="flex items-center justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[(ti + ni) % AVATAR_COLORS.length]}`}>
                                {n.initial}
                              </div>
                              <div>
                                <span className="font-semibold text-sm text-foreground">{n.name}</span>
                                <span className="text-xs text-muted-foreground ml-2">{n.institution}</span>
                                <span className="text-xs text-muted-foreground ml-2">{n.date}</span>
                              </div>
                            </div>
                            {/* Stars right-aligned */}
                            <div className="flex items-center gap-0.5 shrink-0">
                              {[1,2,3,4,5].map(i => (
                                <Star key={i} className={`h-3.5 w-3.5 ${i <= n.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200 fill-stone-200'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">{n.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-xl px-5 py-3 flex items-center gap-3">
        <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
        <p className="text-xs text-muted-foreground">Feedback is submitted anonymously by students after each session. Ratings impact your visibility on the platform.</p>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function StudentAnalytics() {
  const [tab, setTab] = useState<Tab>('performance');

  const TABS: { key: Tab; label: string }[] = [
    { key: 'performance', label: 'Student Performance' },
    { key: 'earnings',    label: 'My Earnings'         },
    { key: 'feedback',   label: 'Student Feedback'    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-6">Analytics</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit mb-6">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              tab === key
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'performance' && <StudentPerformance />}
      {tab === 'earnings'    && <MyEarnings />}
      {tab === 'feedback'    && <StudentFeedback />}
    </div>
  );
}
