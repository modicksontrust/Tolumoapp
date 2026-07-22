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

const EARNINGS_MONTHS = [
  { month: 'Jan', amount: 42500 },
  { month: 'Feb', amount: 51000 },
  { month: 'Mar', amount: 48200 },
  { month: 'Apr', amount: 63400 },
  { month: 'May', amount: 58900 },
  { month: 'Jun', amount: 71200 },
  { month: 'Jul', amount: 66800 },
];

const EARNINGS_BREAKDOWN = [
  { label: 'Session Fees',       amount: 312000, pct: 62 },
  { label: 'Module Royalties',   amount: 124000, pct: 25 },
  { label: 'Quiz Premium',       amount: 45000,  pct:  9 },
  { label: 'Referral Bonus',     amount: 20000,  pct:  4 },
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
function MyEarnings() {
  const maxAmount = Math.max(...EARNINGS_MONTHS.map(e => e.amount));
  const totalEarned = EARNINGS_BREAKDOWN.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Earned (2025)"  value="₦501,000" color="text-primary" />
        <StatCard label="This Month"           value="₦66,800"  color="text-primary" />
        <StatCard label="Avg Per Session"      value="₦8,500"   />
        <StatCard label="Sessions This Month"  value="8"        />
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif font-semibold text-foreground">Monthly Earnings</h3>
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
            <TrendingUp className="h-3.5 w-3.5" /> +12% vs last month
          </div>
        </div>
        <div className="flex items-end gap-3 h-40">
          {EARNINGS_MONTHS.map(({ month, amount }) => {
            const pct = (amount / maxAmount) * 100;
            const isLatest = month === 'Jul';
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-semibold text-muted-foreground">
                  ₦{(amount / 1000).toFixed(0)}k
                </span>
                <div
                  className={`w-full rounded-t-md transition-all ${isLatest ? 'bg-primary' : 'bg-primary/20'}`}
                  style={{ height: `${pct}%` }}
                />
                <span className="text-[10px] text-muted-foreground">{month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
        <h3 className="font-serif font-semibold text-foreground mb-5">Earnings Breakdown</h3>
        <div className="space-y-4">
          {EARNINGS_BREAKDOWN.map(({ label, amount, pct }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <span className="text-sm font-semibold text-foreground">
                  ₦{amount.toLocaleString()} <span className="text-muted-foreground font-normal text-xs">({pct}%)</span>
                </span>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-lg font-serif text-primary">₦{totalEarned.toLocaleString()}</span>
        </div>
      </div>

      {/* Payout info */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl px-6 py-4 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <DollarSign className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">Next Payout: 31 Jul 2025</p>
          <p className="text-xs text-muted-foreground mt-0.5">Estimated ₦66,800 · GTBank ····4821</p>
        </div>
      </div>
    </div>
  );
}

// ── Tab: Student Feedback ─────────────────────────────────────────────────────
function StudentFeedback() {
  const avg = (FEEDBACK.reduce((s, f) => s + f.rating, 0) / FEEDBACK.length).toFixed(1);
  const dist = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: FEEDBACK.filter(f => f.rating === r).length,
    pct: Math.round((FEEDBACK.filter(f => f.rating === r).length / FEEDBACK.length) * 100),
  }));

  return (
    <div className="space-y-6">
      {/* Rating summary */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
        <div className="flex items-start gap-10">
          {/* Big number */}
          <div className="text-center shrink-0">
            <p className="text-5xl font-bold font-serif text-amber-500">{avg}</p>
            <Stars rating={5} />
            <p className="text-xs text-muted-foreground mt-1">{FEEDBACK.length} reviews</p>
          </div>
          {/* Distribution */}
          <div className="flex-1 space-y-2 pt-1">
            {dist.map(({ stars, count, pct }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-4 text-right">{stars}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-muted-foreground w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Individual reviews */}
      <div className="space-y-4">
        {FEEDBACK.map(f => (
          <div key={f.name} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <div className="flex items-start gap-3">
              <Avatar initials={f.initials} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-foreground text-sm">{f.name}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{f.date}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 mb-2">
                  <Stars rating={f.rating} />
                  <span className="text-xs text-muted-foreground">{f.module}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">"{f.comment}"</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer note */}
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
