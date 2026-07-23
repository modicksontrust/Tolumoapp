import React, { useState } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { useClerk } from '@clerk/react';
import {
  Home, Users, Star, Share2, DollarSign, MessageSquare,
  HelpCircle, Settings, LogOut, Bell, Search, Eye, X,
  Send, Flag, CheckCircle2, ExternalLink, BarChart2,
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

// ── Shared helpers ─────────────────────────────────────────────────────────────

const SUPER = {
  name: 'Olu Martins',
  initials: 'OM',
};

const SUB_AGENTS = [
  { id: 1, name: 'Chiamaka Adeyemi', initials: 'CA', uni: 'University of Lagos',          students: 8,  commission: 42000, status: 'Active',    lastActive: '2h ago',  unread: 1 },
  { id: 2, name: 'Rotimi Olatunji',  initials: 'RO', uni: 'Obafemi Awolowo University',   students: 12, commission: 58000, status: 'Active',    lastActive: '5h ago',  unread: 0 },
  { id: 3, name: 'Ngozi Eze',        initials: 'NE', uni: 'University of Nigeria, Nsukka', students: 5,  commission: 22000, status: 'Active',    lastActive: '1d ago',  unread: 2 },
  { id: 4, name: 'Yusuf Maikudi',    initials: 'YM', uni: 'Ahmadu Bello University',       students: 9,  commission: 38500, status: 'Active',    lastActive: '3h ago',  unread: 0 },
  { id: 5, name: 'Adaeze Nwofor',    initials: 'AN', uni: 'University of Ibadan',          students: 0,  commission: 0,     status: 'Suspended', lastActive: '12d ago', unread: 0 },
];

const PENDING = [
  {
    id: 1, name: 'Tunde Afolabi', initials: 'TA', uni: 'Lagos State University',
    bank: 'First Bank ****4521',
    bio: '"Final-year law student and community leader. I manage a WhatsApp group of 300+ LASU law students and believe Tolumo fills a real gap in how we access quality tutorials."',
  },
  {
    id: 2, name: 'Amaka Okonkwo', initials: 'AO', uni: 'Nnamdi Azikiwe University',
    bank: 'Access Bank ****8834',
    bio: '"Graduated 2023, now serving at NYSC in Anambra. I want to help current NAU law students access resources I wish I had."',
  },
];

const STUDENTS = [
  { name: 'Adaeze Nwosu', uni: 'UniLag', agent: 'Chiamaka', signUp: '12 Jun 2025', plan: 'Monthly', status: 'Active'  },
  { name: 'Emeka Obi',    uni: 'UniLag', agent: 'Chiamaka', signUp: '5 Jun 2025',  plan: 'Annual',  status: 'Active'  },
  { name: 'Fatima Yusuf', uni: 'UniLag', agent: 'Chiamaka', signUp: '28 May 2025', plan: 'Monthly', status: 'Lapsed'  },
  { name: 'Sola Adediran',uni: 'OAU',   agent: 'Rotimi',   signUp: '14 Jul 2025', plan: 'Annual',  status: 'Active'  },
  { name: 'Chioma Nze',   uni: 'OAU',   agent: 'Rotimi',   signUp: '10 Jul 2025', plan: 'Monthly', status: 'Active'  },
  { name: 'Ibrahim Musa', uni: 'ABU',   agent: 'Yusuf',    signUp: '8 Jul 2025',  plan: 'Monthly', status: 'Active'  },
  { name: 'Ify Okafor',   uni: 'UNN',   agent: 'Ngozi',    signUp: '5 Jul 2025',  plan: 'Annual',  status: 'Active'  },
];

function Avatar({ initials, size = 'md', color = '#1a4d35' }: { initials: string; size?: 'sm' | 'md'; color?: string }) {
  const sz = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm';
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold text-white shrink-0`} style={{ background: color }}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active:    'bg-emerald-100 text-emerald-700',
    Lapsed:    'bg-red-100    text-red-600',
    Suspended: 'bg-stone-100  text-stone-500',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${map[status] ?? ''}`}>{status}</span>;
}

function PlanBadge({ plan }: { plan: string }) {
  const cls = plan === 'Monthly' ? 'bg-teal-100 text-teal-700' : 'bg-amber-100 text-amber-700';
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{plan}</span>;
}

// ── Shell ──────────────────────────────────────────────────────────────────────

const NAV = [
  { href: '/super-agent',              label: 'Home',          icon: Home,         badge: 0 },
  { href: '/super-agent/sub-agents',   label: 'Sub-Agents',    icon: Users,        badge: 2 },
  { href: '/super-agent/students',     label: 'My Students',   icon: Star,         badge: 0 },
  { href: '/super-agent/referral',     label: 'Referral Tools',icon: Share2,       badge: 0 },
  { href: '/super-agent/commission',   label: 'Commission',    icon: DollarSign,   badge: 0 },
  { href: '/super-agent/messaging',    label: 'Messaging',     icon: MessageSquare,badge: 3 },
];

function SAShell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { signOut } = useClerk();

  const isActive = (href: string) =>
    href === '/super-agent' ? location === '/super-agent' : location.startsWith(href);

  const bottomTitle =
    location.startsWith('/super-agent/settings') ? 'Settings' :
    location.startsWith('/super-agent/help')     ? 'Help & Support' : null;
  const pageTitle = bottomTitle ?? NAV.find(n => isActive(n.href))?.label ?? 'Home';

  return (
    <div className="flex h-screen overflow-hidden bg-stone-50 font-sans">
      {/* Sidebar */}
      <aside className="w-[170px] bg-[#1a4d35] flex flex-col h-full shrink-0">
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">T</div>
          <span className="text-white font-serif font-bold text-sm">Tolumo</span>
        </div>

        {/* User */}
        <div className="px-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-white/20 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {SUPER.initials}
            </div>
            <div className="min-w-0">
              <p className="text-white text-[11px] font-semibold truncate">{SUPER.name}</p>
              <span className="inline-block bg-amber-400 text-[#1a2b1e] text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">Super Agent</span>
            </div>
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-2.5 pt-3 space-y-0.5 overflow-y-auto">
          {NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                isActive(item.href) ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              {item.label}
              {item.badge > 0 && (
                <span className="ml-auto h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2.5 pb-5 border-t border-white/10 pt-2 space-y-0.5 mt-2">
          {[
            { href: '/super-agent/help',     label: 'Help & Support', icon: HelpCircle },
            { href: '/super-agent/settings', label: 'Settings',       icon: Settings   },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors">
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              {item.label}
            </Link>
          ))}
          <button onClick={() => signOut().then(() => setLocation('/sign-in'))}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 border-b border-stone-200 bg-white flex items-center justify-between px-6 shrink-0">
          <span className="font-semibold text-sm text-foreground">{pageTitle}</span>
          <button className="relative">
            <Bell className="h-4.5 w-4.5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 rounded-full text-white text-[8px] font-bold flex items-center justify-center">3</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

// ── Home / Command Centre ──────────────────────────────────────────────────────

const TREND_DATA = [
  { m: 'Jan', v: 28 }, { m: 'Feb', v: 33 }, { m: 'Mar', v: 40 },
  { m: 'Apr', v: 47 }, { m: 'May', v: 55 }, { m: 'Jun', v: 62 }, { m: 'Jul', v: 80 },
];

const ACTIVITY = [
  { ago: '1h ago',  text: 'Tunde Afolabi applied to become Sub-Agent at Lagos State University' },
  { ago: '2h ago',  text: 'Chiamaka Adeyemi signed up 1 new student via referral' },
  { ago: '4h ago',  text: 'Ngozi Eze sent you a message' },
  { ago: '1d ago',  text: 'Monthly commission payout of ₦540,000 processed across 4 active Sub-Agents' },
  { ago: '2d ago',  text: 'Rotimi Olatunji hit 12 new students this month — top performer' },
];

function CommandCentre() {
  const [, setLocation] = useLocation();
  const STATS = [
    { label: 'Active Students',       value: '253', sub: '+16 this month',         color: 'text-emerald-600', border: '' },
    { label: 'Commission (Jul)',       value: '₦161K', sub: 'Aggregate',            color: 'text-emerald-600', border: '' },
    { label: 'Active Sub-Agents',     value: '4',   sub: '1 suspended',            color: '',                 border: '' },
    { label: 'Pending Applications',  value: '2',   sub: 'Awaiting review',        color: '',                 border: 'border-amber-200' },
    { label: 'Pending Verifications', value: '4',   sub: 'Across all institutions',color: '',                 border: 'border-amber-200' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-serif font-bold text-foreground">Command Centre</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Tolumo Super Agent — aggregate view across all institutions</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-5 gap-3">
        {STATS.map((s, i) => (
          <div key={i} className={`bg-white rounded-xl border ${s.border || 'border-stone-200'} shadow-sm p-4`}>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{s.label}</p>
            <p className="text-xl font-serif font-bold text-foreground">{s.value}</p>
            <p className={`text-[10px] mt-1 font-medium flex items-center gap-1 ${s.color || 'text-muted-foreground'}`}>
              {s.color && '↗'} {s.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Student Acquisition Trend</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={TREND_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            <Line type="monotone" dataKey="v" stroke="#1a4d35" strokeWidth={2} dot={{ r: 3, fill: '#1a4d35' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Sub-Agent Leaderboard — July</p>
        <div className="space-y-3">
          {[
            { rank: 1, name: 'Rotimi Olatunji',  uni: 'Obafemi Awolowo University', students: 12, commission: 58000, initials: 'RO' },
            { rank: 2, name: 'Yusuf Maikudi',    uni: 'Ahmadu Bello University',     students: 9,  commission: 38500, initials: 'YM' },
            { rank: 3, name: 'Chiamaka Adeyemi', uni: 'University of Lagos',         students: 8,  commission: 42000, initials: 'CA' },
          ].map(a => (
            <div key={a.rank} className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground w-5 text-center">{a.rank}</span>
              <Avatar initials={a.initials} size="sm" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{a.name}</p>
                <p className="text-[10px] text-muted-foreground">{a.uni}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{a.students} students</p>
                <p className="text-[10px] text-muted-foreground">₦{a.commission.toLocaleString()} earned</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Quick Actions</p>
        <div className="flex gap-3">
          <button onClick={() => setLocation('/super-agent/sub-agents?tab=pending')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors shadow-sm">
            + Review Applications
            <span className="h-5 w-5 rounded-full bg-white/25 text-white text-[10px] font-bold flex items-center justify-center">2</span>
          </button>
          <button onClick={() => setLocation('/super-agent/messaging')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm font-semibold text-foreground hover:bg-stone-50 transition-colors shadow-sm">
            <MessageSquare className="h-3.5 w-3.5" /> Broadcast Message
          </button>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Recent Activity</p>
        <div className="divide-y divide-stone-100">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5">
              <span className="text-[10px] text-muted-foreground shrink-0 w-10">{a.ago}</span>
              <p className="text-sm text-foreground">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Sub-Agents ─────────────────────────────────────────────────────────────────

function SubAgents() {
  const [search] = useLocation();
  const initialTab = search.includes('tab=pending') ? 'pending' : 'all';
  const [tab, setTab] = useState<'all' | 'pending'>(initialTab);
  const [query, setQuery] = useState('');
  const [agents, setAgents] = useState(SUB_AGENTS);
  const [pending, setPending] = useState(PENDING);

  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(query.toLowerCase()) ||
    a.uni.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'all' ? 'bg-[#1a4d35] text-white' : 'bg-white border border-stone-200 text-foreground hover:bg-stone-50'}`}>
          All Sub-Agents
        </button>
        <button onClick={() => setTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'pending' ? 'bg-[#1a4d35] text-white' : 'bg-white border border-stone-200 text-foreground hover:bg-stone-50'}`}>
          Pending Approval
          {pending.length > 0 && (
            <span className={`h-5 w-5 rounded-full text-[10px] font-bold flex items-center justify-center ${tab === 'pending' ? 'bg-white/25 text-white' : 'bg-red-500 text-white'}`}>{pending.length}</span>
          )}
        </button>
      </div>

      {tab === 'all' && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search by name or institution..."
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  {['Sub-Agent', 'Students (Mo)', 'Commission', 'Status', 'Last Active', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map(a => (
                  <tr key={a.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={a.initials} size="sm" />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-foreground text-sm">{a.name}</p>
                            {a.unread > 0 && (
                              <span className="h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{a.unread}</span>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">{a.uni}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{a.students}</td>
                    <td className="px-4 py-3 font-mono font-semibold">
                      {a.commission > 0 ? `₦${a.commission.toLocaleString()}` : <span className="text-muted-foreground">NO</span>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3 text-[11px] text-muted-foreground">{a.lastActive}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        {a.status === 'Active' && (
                          <button onClick={() => setAgents(prev => prev.filter(x => x.id !== a.id))}
                            className="text-muted-foreground hover:text-red-500 transition-colors">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'pending' && (
        <div className="space-y-4">
          {pending.length === 0 && (
            <div className="bg-white rounded-xl border border-stone-200 p-10 text-center text-sm text-muted-foreground">No pending applications.</div>
          )}
          {pending.map(p => (
            <div key={p.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-3">
              <div className="flex items-start gap-3">
                <Avatar initials={p.initials} />
                <div>
                  <p className="font-semibold text-foreground">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.uni}</p>
                  <p className="text-xs text-muted-foreground">Bank: {p.bank}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground bg-stone-50 rounded-lg px-4 py-3 italic">{p.bio}</p>
              <div className="flex gap-2">
                <button onClick={() => setPending(prev => prev.filter(x => x.id !== p.id))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve — Forward to Admin
                </button>
                <button onClick={() => setPending(prev => prev.filter(x => x.id !== p.id))}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                  <Flag className="h-3.5 w-3.5" /> Flag Concern
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── My Students ────────────────────────────────────────────────────────────────

function MyStudents() {
  const [query, setQuery] = useState('');
  const [agentFilter, setAgentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = STUDENTS.filter(s => {
    const matchQ = s.name.toLowerCase().includes(query.toLowerCase()) || s.uni.toLowerCase().includes(query.toLowerCase());
    const matchA = agentFilter === 'All' || s.agent === agentFilter;
    const matchS = statusFilter === 'All' || s.status === statusFilter;
    return matchQ && matchA && matchS;
  });

  const agents = ['All', ...Array.from(new Set(STUDENTS.map(s => s.agent)))];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <p className="text-xs text-muted-foreground">Read-only aggregate view. Re-engagement is a Sub-Agent responsibility.</p>
      </div>

      {/* Search + filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search students..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={agentFilter} onChange={e => setAgentFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-stone-200 bg-white text-sm outline-none appearance-none">
          {agents.map(a => <option key={a}>{a}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-stone-200 bg-white text-sm outline-none appearance-none">
          {['All', 'Active', 'Lapsed'].map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              {['Student', 'Sub-Agent', 'Sign-up', 'Plan', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((s, i) => (
              <tr key={i} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-semibold text-foreground">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">{s.uni}</p>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{s.agent}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{s.signUp}</td>
                <td className="px-4 py-3"><PlanBadge plan={s.plan} /></td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Referral Tools ─────────────────────────────────────────────────────────────

function ReferralTools() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <p className="text-xs text-muted-foreground">Share and manage your Super Agent referral network.</p>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-4">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Your Referral Link</p>
        <div className="flex gap-2">
          <input value="https://tolumo.ng/sa/OLU-2024-0001" readOnly
            className="flex-1 h-10 px-3 rounded-xl border border-stone-200 text-sm text-muted-foreground bg-stone-50 outline-none font-mono" />
          <button onClick={() => { navigator.clipboard.writeText('https://tolumo.ng/sa/OLU-2024-0001').catch(() => {}); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="px-4 h-10 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors">
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-3">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Network Stats</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Sub-Agents Recruited', value: '5' },
            { label: 'Total Students (Network)', value: '34' },
            { label: 'Network Commission (Jul)', value: '₦161K' },
          ].map(s => (
            <div key={s.label} className="text-center p-3 bg-stone-50 rounded-xl">
              <p className="text-xl font-bold font-serif text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Referral Resources</p>
        </div>
        {[
          { label: 'Download Recruitment Kit', desc: 'Flyers, WhatsApp scripts, and pitch templates.' },
          { label: 'Sub-Agent Onboarding Guide', desc: 'Step-by-step guide to send to new recruits.'  },
          { label: 'Referral Commission Structure', desc: 'How your overrides are calculated.'          },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors text-left border-t border-stone-100 group">
            <div>
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Commission ─────────────────────────────────────────────────────────────────

const COMM_DATA = [
  { m: 'Feb', v: 95000 }, { m: 'Mar', v: 110000 }, { m: 'Apr', v: 130000 },
  { m: 'May', v: 125000 }, { m: 'Jun', v: 140000 }, { m: 'Jul', v: 161000 },
];

const PAYOUT_HISTORY = [
  { date: '30 Jun 2025', method: 'Bank Transfer', amount: '₦540,000', status: 'Paid' },
  { date: '31 May 2025', method: 'Bank Transfer', amount: '₦480,000', status: 'Paid' },
];

function Commission() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Earned (Jul)', value: '₦161,000', sub: 'Across all Sub-Agents', subColor: 'text-emerald-600' },
          { label: 'Lifetime Total',     value: '₦745,500', sub: undefined,               subColor: '' },
          { label: 'Next Payout',        value: '31 Jul 2025', sub: 'Bank Transfer',       subColor: '' },
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{c.label}</p>
            <p className="text-xl font-serif font-bold text-foreground">{c.value}</p>
            {c.sub && <p className={`text-[10px] mt-1 font-medium ${c.subColor || 'text-muted-foreground'}`}>{c.subColor ? '↗ ' : ''}{c.sub}</p>}
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Monthly Aggregate Commission (₦)</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={COMM_DATA} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <XAxis dataKey="m" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false}
              tickFormatter={v => `${v / 1000}k`} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e5e7eb' }}
              formatter={(v: number) => [`₦${v.toLocaleString()}`, 'Commission']} />
            <Bar dataKey="v" fill="#1a4d35" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Breakdown by sub-agent */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <p className="px-5 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-b border-stone-100">Breakdown by Sub-Agent</p>
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              {['Sub-Agent', 'This Month', 'Lifetime', 'Last Payout'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {[
              { name: 'Chiamaka Adeyemi', thisMonth: '₦42,000',  lifetime: '₦185,000', lastPayout: '30 Jun 2025' },
              { name: 'Rotimi Olatunji',  thisMonth: '₦58,000',  lifetime: '₦241,000', lastPayout: '30 Jun 2025' },
              { name: 'Ngozi Eze',        thisMonth: '₦22,000',  lifetime: '₦98,000',  lastPayout: '30 Jun 2025' },
              { name: 'Yusuf Maikudi',    thisMonth: '₦38,500',  lifetime: '₦167,500', lastPayout: '30 Jun 2025' },
              { name: 'Adaeze Nwofor',    thisMonth: 'NO',       lifetime: '₦54,000',  lastPayout: '31 May 2025' },
            ].map((r, i) => (
              <tr key={i} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-semibold text-foreground">{r.name}</td>
                <td className="px-4 py-3 font-mono font-semibold text-sm">{r.thisMonth}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{r.lifetime}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{r.lastPayout}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payout history */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <p className="px-5 py-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-b border-stone-100">Payout History</p>
        <div className="divide-y divide-stone-100">
          {PAYOUT_HISTORY.map((p, i) => (
            <div key={i} className="flex items-center px-5 py-3.5">
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">{p.date}</p>
                <p className="text-[10px] text-muted-foreground">{p.method}</p>
              </div>
              <p className="text-sm font-mono font-bold text-foreground mr-4">{p.amount}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Messaging ──────────────────────────────────────────────────────────────────

const THREADS: Record<number, { from: 'me' | 'them'; text: string; time: string; broadcast?: boolean }[]> = {
  1: [
    { from: 'me',   text: 'Good morning all — July campaign brief attached. Please share the updated WhatsApp flyers with your networks this week.', time: '9:14 AM', broadcast: true },
    { from: 'them', text: 'Thanks Olu! Already shared with my network. When does Criminal Law Topic 4 go live?', time: '9:32 AM' },
    { from: 'me',   text: "Going live Monday 14 July. I'll confirm once the Content team signs off.", time: '9:45 AM' },
  ],
  2: [{ from: 'them', text: 'All good on my end. Waiting for the new course links.', time: '8:00 AM' }],
  3: [
    { from: 'them', text: 'Hi Olu, one of my students is asking about the refund policy.', time: '1:10 PM' },
    { from: 'them', text: 'Can you clarify?', time: '1:11 PM' },
  ],
  4: [{ from: 'me', text: 'Great work this month Yusuf!', time: '10:00 AM' }],
  5: [],
};

function Messaging() {
  const [selected, setSelected] = useState(1);
  const [input, setInput] = useState('');
  const [threads, setThreads] = useState(THREADS);
  const [broadcastMode, setBroadcastMode] = useState(false);

  const agent = SUB_AGENTS.find(a => a.id === selected)!;
  const msgs = threads[selected] ?? [];

  function send() {
    if (!input.trim()) return;
    const msg = { from: 'me' as const, text: input.trim(), time: 'Now', broadcast: broadcastMode };
    setThreads(prev => ({ ...prev, [selected]: [...(prev[selected] ?? []), msg] }));
    setInput('');
  }

  return (
    <div className="flex gap-0 max-w-4xl mx-auto h-[calc(100vh-9rem)] rounded-xl overflow-hidden border border-stone-200 shadow-sm bg-white">
      {/* Left panel */}
      <div className="w-52 shrink-0 border-r border-stone-200 flex flex-col">
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-stone-200">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sub-Agents</span>
            <span className="h-4 w-4 rounded-full bg-stone-200 text-stone-600 text-[9px] font-bold flex items-center justify-center">{SUB_AGENTS.length}</span>
          </div>
          <button onClick={() => setBroadcastMode(true)}
            className="flex items-center gap-1 text-[10px] font-semibold text-[#1a4d35] hover:underline">
            ✦ Broadcast
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {SUB_AGENTS.map(a => (
            <button key={a.id} onClick={() => { setSelected(a.id); setBroadcastMode(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-3 text-left transition-colors border-b border-stone-100 ${selected === a.id && !broadcastMode ? 'bg-stone-50' : 'hover:bg-stone-50'}`}>
              <Avatar initials={a.initials} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{a.name.split(' ')[0]}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {a.uni.replace('University of ', 'University of ').split(' ').slice(0, 2).join(' ')}
                </p>
              </div>
              {a.unread > 0 && (
                <span className="h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{a.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-stone-200 shrink-0">
          {broadcastMode ? (
            <>
              <div className="h-9 w-9 rounded-full bg-amber-100 text-amber-700 font-bold text-sm flex items-center justify-center">✦</div>
              <div>
                <p className="font-semibold text-foreground text-sm">Broadcast</p>
                <p className="text-[10px] text-muted-foreground">All {SUB_AGENTS.length} Sub-Agents</p>
              </div>
            </>
          ) : (
            <>
              <Avatar initials={agent.initials} size="sm" />
              <div>
                <p className="font-semibold text-foreground text-sm">{agent.name}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-muted-foreground">{agent.uni}</p>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-emerald-600 font-medium">Active</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {broadcastMode && (
            <div className="text-center">
              <span className="text-[10px] bg-stone-100 text-muted-foreground px-3 py-1 rounded-full">Broadcast to all Sub-Agents</span>
            </div>
          )}
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-sm space-y-1 ${m.from === 'me' ? 'items-end' : 'items-start'} flex flex-col`}>
                {m.broadcast && (
                  <span className="text-[9px] font-bold text-amber-600 self-end uppercase tracking-widest">Broadcast</span>
                )}
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.from === 'me'
                    ? m.broadcast
                      ? 'bg-amber-500 text-white rounded-br-sm'
                      : 'bg-[#1a4d35] text-white rounded-br-sm'
                    : 'bg-stone-100 text-foreground rounded-bl-sm'
                }`}>
                  {m.text}
                </div>
                <p className="text-[9px] text-muted-foreground">{m.time}</p>
              </div>
            </div>
          ))}
          {msgs.length === 0 && (
            <p className="text-center text-sm text-muted-foreground pt-10">No messages yet. Say hello!</p>
          )}
        </div>

        {/* Input */}
        <div className="px-5 py-3 border-t border-stone-200 shrink-0">
          <div className="flex items-center gap-2 bg-stone-50 rounded-xl border border-stone-200 px-4 py-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={broadcastMode ? 'Broadcast to all Sub-Agents...' : `Message ${agent.name.split(' ')[0]}...`}
              className="flex-1 bg-transparent text-sm outline-none" />
            <button onClick={send}
              className="h-8 w-8 rounded-lg bg-[#1a4d35] text-white flex items-center justify-center hover:bg-[#14392a] transition-colors">
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Help & Support ─────────────────────────────────────────────────────────────

function SAHelp() {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <p className="text-xs text-muted-foreground">Resources for Super Agents.</p>
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden">
        {[
          { label: 'Help Centre & FAQs',     desc: 'Guides on managing Sub-Agents, commissions, and verifications.' },
          { label: 'Contact Support',         desc: 'Reach our team via chat, email, or WhatsApp.'                  },
          { label: 'Report a Problem',        desc: 'Flag a bug, incorrect commission, or platform issue.'          },
          { label: 'Super Agent Guidelines',  desc: 'Standards and responsibilities for Super Agents.'              },
          { label: 'Terms of Service',        desc: undefined },
          { label: 'Privacy Policy',          desc: undefined },
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors text-left group">
            <div>
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</p>
              {item.desc && <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>}
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────────────────────

type SASettingsTab = 'profile' | 'payout' | 'notifications' | 'help' | 'account';

function SToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`relative shrink-0 inline-flex h-6 w-11 rounded-full transition-colors ${on ? 'bg-[#1a4d35]' : 'bg-stone-200'}`}>
      <span className={`absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

function SRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function SASettings() {
  const [tab, setTab] = useState<SASettingsTab>('profile');
  const [displayName, setDisplayName] = useState('Olu Martins');
  const [phone, setPhone] = useState('+234 803 000 0001');
  const [bio, setBio] = useState('Super Agent overseeing the South-West network.');

  const [bank, setBank] = useState('Zenith Bank');
  const [accountNo] = useState('••••••7890');
  const [accountName, setAccountName] = useState('Olu Martins');
  const [showAcct, setShowAcct] = useState(false);

  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif]   = useState(true);
  const [commUpd, setCommUpd]       = useState(true);
  const [newAgent, setNewAgent]     = useState(true);
  const [payoutP, setPayoutP]       = useState(true);
  const [sysAnn, setSysAnn]         = useState(true);
  const [mktg, setMktg]             = useState(false);

  function SaveBtn() {
    return (
      <button className="px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors shadow-sm mt-4">
        Save Changes
      </button>
    );
  }

  const NAV_ITEMS: { key: SASettingsTab; label: string; icon: React.ElementType }[] = [
    { key: 'profile',       label: 'Profile',       icon: BarChart2      },
    { key: 'payout',        label: 'Payout Details', icon: DollarSign    },
    { key: 'notifications', label: 'Notifications', icon: Bell           },
    { key: 'help',          label: 'Help & Support', icon: HelpCircle    },
    { key: 'account',       label: 'Account',        icon: LogOut        },
  ];

  return (
    <div className="flex gap-4 max-w-3xl mx-auto">
      <div className="w-44 shrink-0 bg-white rounded-xl border border-stone-200 shadow-sm py-2 h-fit">
        {NAV_ITEMS.map(item => (
          <button key={item.key} onClick={() => setTab(item.key)}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors text-left ${tab === item.key ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
            <item.icon className="h-4 w-4 shrink-0" />
            {item.label}
            {tab === item.key && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1a4d35]" />}
          </button>
        ))}
      </div>

      <div className="flex-1 bg-white rounded-xl border border-stone-200 shadow-sm p-6">
        {tab === 'profile' && (
          <div className="space-y-5">
            <h2 className="font-serif font-bold text-lg">Profile</h2>
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-[#1a4d35] text-white font-bold text-lg flex items-center justify-center">OM</div>
              <div>
                <p className="text-sm font-semibold">Upload photo</p>
                <p className="text-xs text-muted-foreground">JPG, PNG or WebP · max 5 MB</p>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Display Name</label>
              <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Email</label>
              <input value="olu.m@tolumo.ng" readOnly
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm text-muted-foreground bg-stone-50 outline-none" />
              <p className="text-[10px] text-muted-foreground mt-1">Managed by Tolumo — contact Admin to change.</p>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Phone</label>
              <input value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
            <SaveBtn />
          </div>
        )}

        {tab === 'payout' && (
          <div className="space-y-5">
            <h2 className="font-serif font-bold text-lg">Payout Details</h2>
            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
              <span className="shrink-0 mt-0.5">⚠</span>
              <span>Changes take effect from the next payout cycle. Ensure the account name matches your bank records exactly.</span>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Bank</label>
              <select value={bank} onChange={e => setBank(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none bg-white appearance-none">
                {['Zenith Bank', 'Guaranty Trust Bank (GTB)', 'First Bank of Nigeria', 'Access Bank', 'UBA'].map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Account Number</label>
              <div className="relative">
                <input value={showAcct ? '0123457890' : accountNo}
                  className="w-full h-10 px-3 pr-10 rounded-xl border border-stone-200 text-sm outline-none font-mono" readOnly />
                <button onClick={() => setShowAcct(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Account Name</label>
              <input value={accountName} onChange={e => setAccountName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
              <p className="text-[10px] text-muted-foreground mt-1">Must match exactly as it appears in your bank records.</p>
            </div>
            <SaveBtn />
          </div>
        )}

        {tab === 'notifications' && (
          <div className="space-y-5">
            <h2 className="font-serif font-bold text-lg">Notifications</h2>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Channels</p>
              <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 px-4">
                <SRow label="Email notifications" desc="Receive notifications to your registered email"><SToggle on={emailNotif} onToggle={() => setEmailNotif(v => !v)} /></SRow>
                <SRow label="Push notifications" desc="In-app and browser push alerts"><SToggle on={pushNotif} onToggle={() => setPushNotif(v => !v)} /></SRow>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Activity</p>
              <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 px-4">
                <SRow label="Commission updates" desc="When commission is credited or adjusted"><SToggle on={commUpd} onToggle={() => setCommUpd(v => !v)} /></SRow>
                <SRow label="New Sub-Agent application" desc="When someone applies to join your network"><SToggle on={newAgent} onToggle={() => setNewAgent(v => !v)} /></SRow>
                <SRow label="Payout processed" desc="Confirmation when your monthly payout is sent"><SToggle on={payoutP} onToggle={() => setPayoutP(v => !v)} /></SRow>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Platform</p>
              <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 px-4">
                <SRow label="System announcements" desc="Platform updates, downtime notices, policy changes"><SToggle on={sysAnn} onToggle={() => setSysAnn(v => !v)} /></SRow>
                <SRow label="Marketing & promotions" desc="Campaign tips, performance challenges, offers"><SToggle on={mktg} onToggle={() => setMktg(v => !v)} /></SRow>
              </div>
            </div>
            <SaveBtn />
          </div>
        )}

        {tab === 'help' && <SAHelp />}

        {tab === 'account' && (
          <div className="space-y-4">
            <h2 className="font-serif font-bold text-lg">Account</h2>
            <div className="rounded-xl border border-stone-200 p-5 space-y-3">
              <p className="font-semibold">Sign out</p>
              <p className="text-sm text-muted-foreground">You will be signed out of your Super Agent dashboard on this device.</p>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 text-sm font-semibold hover:bg-stone-50 transition-colors">
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
            <div className="rounded-xl border border-red-200 p-5 space-y-3 bg-red-50/50">
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-red-500 shrink-0" />
                <p className="font-semibold text-red-600">Delete account</p>
              </div>
              <p className="text-sm text-muted-foreground">This permanently removes your Super Agent account and all associated data. This cannot be undone.</p>
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors">
                <Flag className="h-3.5 w-3.5" /> Request account deletion
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Router ─────────────────────────────────────────────────────────────────────

export default function SuperAgentPortal() {
  return (
    <SAShell>
      <Switch>
        <Route path="/super-agent"             component={CommandCentre} />
        <Route path="/super-agent/sub-agents"  component={SubAgents}     />
        <Route path="/super-agent/students"    component={MyStudents}    />
        <Route path="/super-agent/referral"    component={ReferralTools} />
        <Route path="/super-agent/commission"  component={Commission}    />
        <Route path="/super-agent/messaging"   component={Messaging}     />
        <Route path="/super-agent/help"        component={SAHelp}        />
        <Route path="/super-agent/settings"    component={SASettings}    />
        <Route component={CommandCentre} />
      </Switch>
    </SAShell>
  );
}
