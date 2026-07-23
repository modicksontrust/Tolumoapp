import React, { useState } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { useClerk } from '@clerk/react';
import {
  LayoutDashboard, Users, BookOpen, CreditCard, BarChart2,
  Megaphone, Award, HelpCircle, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell, Search, Menu,
  BookMarked, UserCheck, X, Check, Globe, Building2,
  ToggleLeft, ToggleRight, Filter, Send, Clock, Zap,
  ShieldCheck, AlertTriangle, TrendingUp, Activity,
  PenLine, Trash2, ExternalLink, Plus, MoreVertical, RefreshCw,
} from 'lucide-react';

// ── Shell ─────────────────────────────────────────────────────────────────────

function NavItem({ href, icon: Icon, label, active }: {
  href: string; icon: React.ElementType; label: string; active: boolean;
}) {
  return (
    <Link href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </Link>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  const isActive = (href: string) =>
    href === '/admin' ? location === '/admin' : location.startsWith(href);

  const topNav = [
    { href: '/admin',               label: 'Overview',             icon: LayoutDashboard },
    { href: '/admin/users',         label: 'Users',                icon: Users           },
    { href: '/admin/modules',       label: 'Modules',              icon: BookOpen        },
    { href: '/admin/subscriptions', label: 'Subscriptions',        icon: CreditCard      },
    { href: '/admin/analytics',     label: 'Analytics',            icon: BarChart2       },
    { href: '/admin/announcements', label: 'Announcements',        icon: Megaphone       },
    { href: '/admin/scholarships',  label: 'Scholarships & Opps',  icon: Award           },
  ];

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}
      <aside className={`fixed md:relative inset-y-0 left-0 z-30 w-[200px] bg-[#1a4d35] flex flex-col h-full shrink-0 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-4 py-4 flex items-center gap-2.5">
          <img src={`${basePath}/logo.svg`} alt="Tolumo" className="h-8 w-8 shrink-0" />
          <div>
            <p className="font-serif font-bold text-lg text-white leading-none">Tolumo</p>
            <p className="text-[8px] font-bold text-white/35 uppercase tracking-[0.2em] mt-0.5">Admin Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-2.5 space-y-0.5 overflow-y-auto py-2">
          {topNav.map(item => <NavItem key={item.href} {...item} active={isActive(item.href)} />)}
        </nav>
        <div className="px-2.5 pt-2 pb-5 border-t border-white/10 space-y-0.5">
          <NavItem href="/admin/help"     label="Help & Support" icon={HelpCircle} active={isActive('/admin/help')} />
          <NavItem href="/admin/settings" label="Settings"       icon={Settings}   active={isActive('/admin/settings')} />
          <button onClick={() => signOut().then(() => setLocation('/sign-in'))}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="h-4 w-4 shrink-0" /> Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 shrink-0 bg-white border-b border-stone-200 flex items-center gap-3 px-4">
          <button className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-stone-100" onClick={() => setMobileOpen(v => !v)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => history.back()} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-stone-100"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => history.forward()} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-stone-100"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input placeholder="Search courses, topics…" className="w-full h-9 pl-9 pr-3 rounded-full bg-stone-100 border-0 text-sm placeholder:text-stone-400 outline-none" />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors">
              <Bell className="h-5 w-5 text-stone-500" />
              <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">1</span>
            </button>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#1a4d35] text-white flex items-center justify-center text-xs font-bold shrink-0">AD</div>
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-semibold text-foreground">Admin</p>
                <p className="text-[10px] text-muted-foreground">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8 bg-[#faf9f7]">
          {children}
        </main>
      </div>
    </div>
  );
}

// ── Overview ──────────────────────────────────────────────────────────────────

const PENDING_ACTIONS = [
  { icon: BookMarked, label: '4 modules awaiting approval',              action: 'Review', style: 'bg-[#1a4d35] text-white' },
  { icon: UserCheck,  label: '3 new tutor applications',                 action: 'Review', style: 'bg-[#1a4d35] text-white' },
  { icon: CreditCard, label: '2 payment disputes to resolve',            action: 'View',   style: 'bg-[#1a4d35] text-white' },
  { icon: Megaphone,  label: 'Platform announcement due (new semester)', action: 'Draft',  style: 'bg-[#1a4d35] text-white' },
];

function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Tolumo admin dashboard — July 2025</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students',   value: '12,411', sub: '+284 this week',       icon: Users,      iconColor: 'text-stone-500'  },
          { label: 'Active Tutors',    value: '48',     sub: '+3 pending approval',  icon: UserCheck,  iconColor: 'text-amber-500'  },
          { label: 'Monthly Revenue',  value: '₦18.4M', sub: '+14% vs last month',   icon: CreditCard, iconColor: 'text-teal-500'   },
          { label: 'Modules Live',     value: '23',     sub: '4 pending review',     icon: BookOpen,   iconColor: 'text-violet-500' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-2">{s.label}</p>
              <p className="text-2xl font-bold font-serif text-foreground leading-none mb-1.5">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0">
              <s.icon className={`h-[1.125rem] w-[1.125rem] ${s.iconColor}`} />
            </div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
          <h2 className="font-serif font-bold text-lg text-foreground mb-5">Monthly Subscriptions</h2>
          <div className="space-y-4">
            {[
              { label: 'Monthly (₦3,500/mo)',   subs: '3,723 subs', rev: '₦13.0M', w: '85%', opacity: ''      },
              { label: 'Semester (₦9,500/sem)', subs: '548 subs',   rev: '₦5.2M',  w: '23%', opacity: '/60'   },
              { label: 'Annual (₦24,000/yr)',   subs: '112 subs',   rev: '₦2.7M',  w: '8%',  opacity: '/30'   },
            ].map((r, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-muted-foreground">{r.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-foreground">{r.subs}</span>
                    <span className="text-sm font-bold text-foreground">{r.rev}</span>
                  </div>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-[#1a4d35]${r.opacity} rounded-full`} style={{ width: r.w }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
          <h2 className="font-serif font-bold text-lg text-foreground mb-5">Pending Actions</h2>
          <div className="space-y-3">
            {PENDING_ACTIONS.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#fdf9f0] border border-amber-100">
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                  <item.icon className="h-4 w-4 text-amber-600" />
                </div>
                <p className="flex-1 text-sm text-foreground font-medium leading-snug">{item.label}</p>
                <button className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${item.style}`}>
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Users ─────────────────────────────────────────────────────────────────────

const MOCK_USERS = [
  { id: 1, name: 'Chisom Nwosu',    email: 'c.nwosu@unilag.edu.ng',    role: 'Student', university: 'UNILAG',    plan: 'Monthly',   joined: 'Mar 2025', status: 'active'    },
  { id: 2, name: 'Emeka Okafor',    email: 'e.okefor@uniport.edu.ng',  role: 'Student', university: 'UniPort',   plan: 'Monthly',   joined: 'Jan 2025', status: 'active'    },
  { id: 3, name: 'Prof. Adeyemi',   email: 'o.adeyemi@tolumo.com',     role: 'Tutor',   university: '—',         plan: '—',         joined: 'Jan 2025', status: 'active'    },
  { id: 4, name: 'Fatima Al-Hassan',email: 'f.alhassan@abu.edu.ng',    role: 'Student', university: 'ABU Zaria', plan: 'Monthly',   joined: 'Apr 2025', status: 'active'    },
  { id: 5, name: 'Amara Diallo',    email: 'a.diallo@unn.edu.ng',      role: 'Student', university: 'UNN',       plan: 'Monthly',   joined: 'May 2025', status: 'suspended' },
];

function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [instFilter, setInstFilter] = useState('All Institutions');

  const filtered = MOCK_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'All Roles' || u.role === roleFilter;
    const matchInst = instFilter === 'All Institutions' || u.university === instFilter;
    return matchSearch && matchRole && matchInst;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-serif font-bold text-foreground">User Management</h1>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors shadow-sm">
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users…"
            className="w-full pl-9 pr-3 h-9 rounded-xl bg-white border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          className="h-9 px-3 rounded-xl bg-white border border-stone-200 text-sm outline-none">
          {['All Roles', 'Student', 'Tutor', 'Admin'].map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={instFilter} onChange={e => setInstFilter(e.target.value)}
          className="h-9 px-3 rounded-xl bg-white border border-stone-200 text-sm outline-none">
          {['All Institutions', 'UNILAG', 'UniPort', 'ABU Zaria', 'UNN'].map(r => <option key={r}>{r}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              {['Name', 'Email', 'Role', 'University', 'Plan', 'Joined', 'Status', ''].map(h => (
                <th key={h} className="px-4 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs font-mono">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    u.role === 'Tutor' ? 'bg-violet-100 text-violet-700' : 'bg-sky-100 text-sky-700'
                  }`}>{u.role}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.university}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.plan}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.joined}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold ${u.status === 'active' ? 'text-emerald-600' : 'text-red-500'}`}>{u.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button className="p-1 rounded hover:bg-stone-100 text-muted-foreground"><PenLine className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Modules ───────────────────────────────────────────────────────────────────

const MODULES_DATA = [
  { id: 1, title: 'Law of Evidence',   tutor: 'Dr. Ngozi Eze',       topics: 11, status: 'pending' },
  { id: 2, title: 'Jurisprudence',     tutor: 'Prof. Adeyemi',       topics: 9,  status: 'pending' },
  { id: 3, title: 'Equity & Trusts',   tutor: 'Barrister Okonkwo',   topics: 12, status: 'pending' },
  { id: 4, title: 'Constitutional Law',tutor: 'Prof. Adeyemi',       topics: 12, status: 'live'    },
  { id: 5, title: 'Law of Contract',   tutor: 'Prof. Adeyemi',       topics: 10, status: 'live'    },
  { id: 6, title: 'Criminal Law',      tutor: 'Barrister Okonkwo',   topics: 14, status: 'live'    },
];

function ModulesPage() {
  const [modules, setModules] = useState(MODULES_DATA);
  const approve = (id: number) => setModules(m => m.map(x => x.id === id ? { ...x, status: 'live' } : x));
  const reject  = (id: number) => setModules(m => m.filter(x => x.id !== id));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-serif font-bold text-foreground">Module Management</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map(m => (
          <div key={m.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-semibold text-foreground text-sm leading-snug">{m.title}</h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                m.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>{m.status}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{m.tutor} · {m.topics} topics</p>
            {m.status === 'pending' ? (
              <div className="flex gap-2">
                <button onClick={() => approve(m.id)} className="flex-1 py-2 rounded-lg bg-[#1a4d35] text-white text-xs font-semibold hover:bg-[#14392a] transition-colors">Approve</button>
                <button onClick={() => reject(m.id)}  className="flex-1 py-2 rounded-lg border border-red-200 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">Reject</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg border border-stone-200 text-foreground text-xs font-semibold hover:bg-stone-50 transition-colors">View</button>
                <button className="flex-1 py-2 rounded-lg border border-stone-200 text-foreground text-xs font-semibold hover:bg-stone-50 transition-colors">Edit</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Subscriptions ─────────────────────────────────────────────────────────────

const SUB_TXNS = [
  { student: 'Chisom Nwosu',   plan: 'Monthly',       amount: '₦3,500',  date: '14 Jul 2025', status: 'success' },
  { student: 'Kunle Adeyemi',  plan: 'Semester',      amount: '₦15,000', date: '13 Jul 2025', status: 'success' },
  { student: 'Ngozi Eze',      plan: 'Monthly',       amount: '₦3,500',  date: '12 Jul 2025', status: 'failed'  },
  { student: 'Bola Tinubu',    plan: 'Academic Year', amount: '₦25,000', date: '11 Jul 2025', status: 'success' },
  { student: 'Aisha Bello',    plan: 'Monthly',       amount: '₦3,500',  date: '10 Jul 2025', status: 'success' },
];

function SubscriptionsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-serif font-bold text-foreground">Subscription Monitoring</h1>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { value: '3,723', label: 'Active Subscriptions', color: 'text-foreground' },
          { value: '142',   label: 'Expiring This Week',   color: 'text-amber-500'  },
          { value: '7',     label: 'Payment Failures',     color: 'text-red-500'    },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 text-center">
            <p className={`text-3xl font-bold font-serif mb-2 ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <h2 className="font-serif font-bold text-foreground">Recent Transactions</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              {['Student', 'Plan', 'Amount', 'Date', 'Status'].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {SUB_TXNS.map((t, i) => (
              <tr key={i} className="hover:bg-stone-50">
                <td className="px-5 py-3.5 font-medium text-foreground">{t.student}</td>
                <td className="px-5 py-3.5 text-muted-foreground">{t.plan}</td>
                <td className="px-5 py-3.5 font-semibold text-foreground">{t.amount}</td>
                <td className="px-5 py-3.5 text-muted-foreground text-xs">{t.date}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-xs font-semibold ${t.status === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Analytics ─────────────────────────────────────────────────────────────────

const ANALYTICS_TXNS = [
  { student: 'Chisom Nwosu',  type: 'Monthly Sub',       amount: '₦3,500',  date: '14 Jul 2025', status: 'success' },
  { student: 'Kunle Adeyemi', type: 'Semester Sub',      amount: '₦15,000', date: '13 Jul 2025', status: 'success' },
  { student: 'Ngozi Eze',     type: 'Monthly Sub',       amount: '₦3,500',  date: '12 Jul 2025', status: 'failed'  },
  { student: 'Amara Diallo',  type: 'Academic Year Sub', amount: '₦25,000', date: '11 Jul 2025', status: 'success' },
  { student: 'Fatima Bello',  type: 'Add-on: LAW 101',   amount: '₦7,500',  date: '11 Jul 2025', status: 'success' },
  { student: 'Emeka Okafor',  type: 'Tutorial: LAW 201', amount: '₦2,500',  date: '10 Jul 2025', status: 'success' },
  { student: 'Aisha Mohammed',type: 'Monthly Sub',       amount: '₦3,500',  date: '10 Jul 2025', status: 'success' },
];

const MODULE_ENGAGEMENT = [
  { module: 'Constitutional Law', code: 'LAW 201', type: 'Subscription',   students: '3,840', completion: '24%', addon: '—'              },
  { module: 'Law of Contract',    code: 'LAW 202', type: 'Subscription',   students: '2,910', completion: '22%', addon: '—'              },
  { module: 'Criminal Law I',     code: 'LAW 203', type: 'Subscription',   students: '2,490', completion: '18%', addon: '—'              },
  { module: 'Legal Methods',      code: 'LAW 102', type: 'Carryover Add-on', students: '—',  completion: '—',   addon: '84 (₦630,000)' },
  { module: 'Intro to Nig. Legal System', code: 'LAW 101', type: 'Carryover Add-on', students: '—', completion: '—', addon: '68 (₦510,000)' },
];

function AnalyticsPage() {
  const [tab, setTab] = useState<'Finance' | 'Students' | 'Tutors' | 'Platform'>('Finance');
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Platform Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Finance, student, tutor, and platform metrics — July 2025</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-white border border-stone-200 rounded-xl p-1 w-fit">
        {(['Finance', 'Students', 'Tutors', 'Platform'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-[#1a4d35] text-white' : 'text-muted-foreground hover:text-foreground'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'Finance' && (
        <>
          {/* 6 stat boxes */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: 'MRR',                  value: '₦18.4M',  sub: '+14%',           color: 'text-foreground' },
              { label: 'ARR (projected)',       value: '₦220.8M', sub: '+14%',           color: 'text-foreground' },
              { label: 'Revenue This Month',   value: '₦18.4M',  sub: '+₦2.2M',         color: 'text-amber-600'  },
              { label: 'Payment Success Rate', value: '98.1%',   sub: '+0.4%',          color: 'text-emerald-600'},
              { label: 'Churn Rate',           value: '3.2%',    sub: '-0.6%',          color: 'text-red-500'    },
              { label: 'Add-on Revenue',       value: '₦1.14M',  sub: '152 purchases',  color: 'text-emerald-600'},
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className={`text-2xl font-bold font-serif mb-1 ${s.color}`}>{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Revenue by plan */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
            <h2 className="font-serif font-bold text-foreground mb-5">Revenue by Subscription Plan</h2>
            <div className="space-y-5">
              {[
                { plan: 'Monthly (₦3,500)',       rev: '₦9,943,500',  subs: '2,841 subscribers', pct: '54% of total revenue', w: '80%' },
                { plan: 'Semester (₦15,000)',     rev: '₦9,465,000',  subs: '631 subscribers',   pct: '24% of total revenue', w: '40%' },
                { plan: 'Academic Year (₦25,000)',rev: '₦6,275,000',  subs: '251 subscribers',   pct: '22% of total revenue', w: '32%' },
              ].map((r, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{r.plan}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-bold text-foreground">{r.rev}</span>
                      <span className="text-xs text-muted-foreground">{r.subs}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-stone-100 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-[#1a4d35] rounded-full" style={{ width: r.w }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground">{r.pct}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Module table */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100">
              <h2 className="font-serif font-bold text-foreground">Module Engagement & Add-on Revenue</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {['Module', 'Code', 'Type', 'Students', 'Completion %', 'Add-on Sales'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {MODULE_ENGAGEMENT.map((m, i) => (
                  <tr key={i} className="hover:bg-stone-50">
                    <td className="px-5 py-3.5 font-medium text-foreground">{m.module}</td>
                    <td className="px-5 py-3.5 text-muted-foreground font-mono text-xs">{m.code}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        m.type === 'Subscription' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                      }`}>{m.type}</span>
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">{m.students}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{m.completion}</td>
                    <td className="px-5 py-3.5 font-semibold text-foreground">{m.addon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Recent txns */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-100"><h2 className="font-serif font-bold text-foreground">Recent Transactions</h2></div>
            <table className="w-full text-sm">
              <thead className="bg-stone-50 border-b border-stone-100">
                <tr>
                  {['Student', 'Type', 'Amount', 'Date', 'Status'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {ANALYTICS_TXNS.map((t, i) => (
                  <tr key={i} className="hover:bg-stone-50">
                    <td className="px-5 py-3.5 font-medium text-foreground">{t.student}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{t.type}</td>
                    <td className="px-5 py-3.5 font-semibold text-foreground">{t.amount}</td>
                    <td className="px-5 py-3.5 text-muted-foreground text-xs">{t.date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold ${t.status === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab !== 'Finance' && (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <p className="text-muted-foreground text-sm">{tab} analytics — coming soon</p>
        </div>
      )}
    </div>
  );
}

// ── Announcements ─────────────────────────────────────────────────────────────

const PAST_ANNOUNCEMENTS = [
  { title: 'Welcome to Tolumo — Semester 2 begins!',         date: '1 Jan 2025',  audience: 'All Students' },
  { title: 'New module: Criminal Law & Procedure is live',   date: '15 Mar 2025', audience: 'Law Students' },
  { title: 'Platform maintenance — Sunday 2am–4am',          date: '28 May 2025', audience: 'All Users'    },
];

function AnnouncementsPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sendTo, setSendTo] = useState('All Students');
  const [sent, setSent] = useState(false);

  const handlePublish = () => {
    if (title && message) { setSent(true); setTitle(''); setMessage(''); setTimeout(() => setSent(false), 2500); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-serif font-bold text-foreground">Announcements</h1>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-4">
        <h2 className="font-serif font-bold text-lg text-foreground">Publish New Announcement</h2>
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="e.g. New Semester Modules Now Available"
            className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Write your announcement..."
            rows={5}
            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Send To</label>
          <select value={sendTo} onChange={e => setSendTo(e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none appearance-none bg-white">
            {['All Students', 'Law Students', 'All Users', 'Tutors'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <button onClick={handlePublish}
          className="w-fit px-6 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors shadow-sm">
          {sent ? '✓ Published!' : 'Publish Announcement'}
        </button>
      </div>

      <div>
        <h2 className="font-semibold text-foreground mb-3">Past Announcements</h2>
        <div className="space-y-2">
          {PAST_ANNOUNCEMENTS.map((a, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-stone-200 rounded-xl px-4 py-3 shadow-sm">
              <Bell className="h-4 w-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{a.title}</p>
                <p className="text-[10px] text-muted-foreground">{a.date} · {a.audience}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Scholarships & Opps module ────────────────────────────────────────────────

type ScholarshipTab = 'overview' | 'opportunities' | 'sources' | 'scan' | 'notifications' | 'roles';

const OPPS = [
  { id: 1, type: 'Scholarship', title: 'Chevening Scholarship 2026/27',      org: 'UK Government',          region: 'International', deadline: '2025-11-05', status: 'Published',       ai: true,  desc: 'Fully funded Masters scholarships for future leaders from Nigeria.' },
  { id: 2, type: 'Scholarship', title: 'Commonwealth LLM Award',              org: 'Commonwealth Secretariat',region: 'International', deadline: '2025-12-15', status: 'Published',       ai: true,  desc: 'Postgraduate scholarships for Commonwealth citizens to study in the UK.' },
  { id: 3, type: 'Internship',  title: 'Lagos State Bar Council Internship',  org: 'Lagos State Bar Council',region: 'Nigeria',        deadline: '2025-08-01', status: 'Pending Review',  ai: true,  desc: '6-week pupillage programme at the Lagos State Bar Council chambers.' },
  { id: 4, type: 'Fellowship',  title: 'African Legal Aid Fellowship',        org: 'African Legal Aid',      region: 'Africa',         deadline: '2025-09-30', status: 'Pending Review',  ai: true,  desc: '12-month fellowship for early-career lawyers supporting access to justice.' },
  { id: 5, type: 'Job',         title: 'Legal Research Assistant – NJI',      org: 'National Judicial Institute', region: 'Nigeria',   deadline: '2025-07-31', status: 'Published',       ai: false, desc: 'Research assistant roles at the NJI supporting judicial reform initiatives.' },
  { id: 6, type: 'Grant',       title: 'MacArthur Foundation Grant – Rule of Law', org: 'MacArthur Foundation', region: 'International', deadline: '2025-10-20', status: 'Rejected',    ai: true,  desc: 'Grants for organisations advancing rule of law in Nigeria.' },
  { id: 7, type: 'Internship',  title: 'UNICEF Nigeria Legal Internship',     org: 'UNICEF Nigeria',         region: 'Nigeria',        deadline: '2025-08-15', status: 'Pending Review',  ai: true,  desc: 'Legal intern supporting child rights and protection programmes.' },
  { id: 8, type: 'Scholarship', title: 'Afe Babalola University PhD Scholarship', org: 'ABUAD',             region: 'Nigeria',        deadline: '2025-09-01', status: 'Archived',        ai: false, desc: 'Full scholarship for PhD in Law candidates at ABUAD.' },
];

const AI_SOURCES = [
  { name: 'Law Pavilion',                   type: 'WEBSITE',      url: 'https://lawpavilion.com/opportunities', trusted: true,  lastScan: '2025-07-15 06:00', found: 12 },
  { name: 'Chevening Scholarships',         type: 'WEBSITE',      url: 'https://chevening.org/scholarships',    trusted: true,  lastScan: '2025-07-15 06:00', found: 3  },
  { name: 'CommonWealth Scholarship Commission', type: 'WEBSITE', url: 'https://cscuk.fcdo.gov.uk',             trusted: true,  lastScan: '2025-07-15 06:00', found: 2  },
  { name: 'NJI Jobs API',                   type: 'API',          url: 'https://api.nji.gov.ng/jobs',            trusted: true,  lastScan: '2025-07-14 18:00', found: 5  },
  { name: 'African Legal Aid',              type: 'ORGANIZATION', url: 'https://africanlegalaid.org/vacancies',  trusted: true,  lastScan: '2025-07-15 06:00', found: 4  },
  { name: 'MacArthur Foundation',           type: 'WEBSITE',      url: 'https://macfound.org/grants',            trusted: false, lastScan: '2025-07-15 06:00', found: 1  },
  { name: 'UNICEF Nigeria',                 type: 'ORGANIZATION', url: 'https://unicef.org/nigeria/careers',     trusted: true,  lastScan: '2025-07-15 06:00', found: 2  },
];

const RECENT_SENDS = [
  { subject: "New: Commonwealth LLM Award — Apply by Dec 2025", audience: 'Law Faculty',   recipients: 4120,   date: '2025-07-13 10:00' },
  { subject: "5 new scholarships added — check your Opportunities Hub", audience: 'All Students', recipients: 12411, date: '2025-07-10 09:00' },
  { subject: "Lagos State Bar Council Internship — Deadline 1 Aug", audience: 'Law Faculty',   recipients: 4120,   date: '2025-07-08 11:30' },
];

const MANAGERS = [
  {
    name: 'Adaeze Okonkwo', email: 'adaeze@tolumo.ng', initials: 'AO',
    perms: { viewOpp: true, approveReject: true, editOpp: true, deleteOpp: false, manageAI: false, manageScan: false, sendNotif: true, manageRoles: false },
  },
  {
    name: 'Emeka Chukwu', email: 'emeka@tolumo.ng', initials: 'EC',
    perms: { viewOpp: true, approveReject: false, editOpp: true, deleteOpp: false, manageAI: true, manageScan: false, sendNotif: false, manageRoles: false },
  },
  {
    name: 'Fatima Yusuf', email: 'fatima@tolumo.ng', initials: 'FY',
    perms: { viewOpp: true, approveReject: true, editOpp: true, deleteOpp: true, manageAI: true, manageScan: true, sendNotif: true, manageRoles: false },
  },
];

const PERM_LABELS: { key: keyof typeof MANAGERS[0]['perms']; label: string }[] = [
  { key: 'viewOpp',      label: 'View Opportunities'   },
  { key: 'approveReject',label: 'Approve / Reject'     },
  { key: 'editOpp',      label: 'Edit Opportunities'   },
  { key: 'deleteOpp',    label: 'Delete Opportunities' },
  { key: 'manageAI',     label: 'Manage AI Sources'    },
  { key: 'manageScan',   label: 'Manage Scan Settings' },
  { key: 'sendNotif',    label: 'Send Notifications'   },
  { key: 'manageRoles',  label: 'Manage Roles'         },
];

function PermPill({ on, label }: { on: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${on ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-50 text-muted-foreground'}`}>
      {on ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {label}
    </div>
  );
}

function ScholarshipsAdminPage() {
  const [tab, setTab] = useState<ScholarshipTab>('overview');
  const [opps, setOpps] = useState(OPPS);
  const [sources, setSources] = useState(AI_SOURCES.map((s, i) => ({ ...s, enabled: true })));
  const [autoDiscovery, setAutoDiscovery] = useState(true);
  const [scanFreq, setScanFreq] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [publishMode, setPublishMode] = useState<'review' | 'auto'>('review');
  const [lawOnly, setLawOnly] = useState(true);
  const [nigeriaOnly, setNigeriaOnly] = useState(false);
  const [oppSearch, setOppSearch] = useState('');
  const [notifFaculty, setNotifFaculty] = useState('All Faculties');
  const [notifDept, setNotifDept] = useState('All Departments');
  const [notifSubject, setNotifSubject] = useState('');
  const [notifMsg, setNotifMsg] = useState('');
  const [notifLink, setNotifLink] = useState('');

  const pending = opps.filter(o => o.status === 'Pending Review');
  const approve = (id: number) => setOpps(o => o.map(x => x.id === id ? { ...x, status: 'Published' } : x));
  const reject  = (id: number) => setOpps(o => o.map(x => x.id === id ? { ...x, status: 'Rejected'  } : x));

  const filteredOpps = opps.filter(o => o.title.toLowerCase().includes(oppSearch.toLowerCase()));

  const typeColors: Record<string, string> = {
    Scholarship: 'bg-sky-100 text-sky-700',
    Internship:  'bg-violet-100 text-violet-700',
    Fellowship:  'bg-amber-100 text-amber-700',
    Job:         'bg-teal-100 text-teal-700',
    Grant:       'bg-rose-100 text-rose-700',
  };

  const statusColors: Record<string, string> = {
    'Published':      'bg-emerald-100 text-emerald-700',
    'Pending Review': 'bg-amber-100 text-amber-700',
    'Rejected':       'bg-red-100 text-red-600',
    'Archived':       'bg-stone-100 text-stone-500',
  };

  const typeTabColors: Record<string, string> = {
    Overview:      'border-stone-300',
    Opportunities: 'border-amber-400',
    'AI Sources':  'border-stone-300',
    'Scan Settings': 'border-stone-300',
    Notifications: 'border-stone-300',
    'Roles & Perms': 'border-stone-300',
  };

  const TABS: { key: ScholarshipTab; label: string }[] = [
    { key: 'overview',       label: 'Overview'       },
    { key: 'opportunities',  label: 'Opportunities'  },
    { key: 'sources',        label: 'AI Sources'     },
    { key: 'scan',           label: 'Scan Settings'  },
    { key: 'notifications',  label: 'Notifications'  },
    { key: 'roles',          label: 'Roles & Perms'  },
  ];

  const recipients = notifFaculty === 'All Faculties' ? 12411 : 4120;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Scholarships &amp; Opportunities</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage AI discovery, curate listings, and reach students — powered by{' '}
            <span className="text-amber-600 font-medium">Goldcoast Developmental Foundation</span>
          </p>
        </div>
        <button className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold shadow-sm hover:bg-amber-600 transition-colors">
          <Clock className="h-4 w-4" /> {pending.length} pending review
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-0.5 bg-white border border-stone-200 rounded-xl px-3 py-1 overflow-x-auto">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              tab === t.key ? 'bg-stone-100 text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
            }`}>
            {t.key === 'opportunities' && pending.length > 0 && (
              <span className="min-w-[16px] h-[16px] px-1 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">{pending.length}</span>
            )}
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {tab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Opportunities', value: opps.length,                            icon: Award,      sub: 'View →' },
              { label: 'Pending Review',       value: pending.length,                         icon: Clock,      sub: 'View →' },
              { label: 'Auto-Discovered',      value: opps.filter(o => o.ai).length,          icon: Zap,        sub: 'View →' },
              { label: 'Added This Month',     value: opps.length,                            icon: TrendingUp, sub: 'View →' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <p className="text-2xl font-bold font-serif text-foreground mb-1">{s.value}</p>
                <button className="text-xs text-primary font-medium hover:underline">{s.sub}</button>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Breakdown by type */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h2 className="font-serif font-bold text-foreground mb-4">Breakdown by Type</h2>
              <div className="space-y-3">
                {[
                  { label: 'Scholarship', count: 3, pct: '38%', color: 'bg-[#1a4d35]',    w: '60%' },
                  { label: 'Internship',  count: 2, pct: '25%', color: 'bg-violet-500',   w: '40%' },
                  { label: 'Fellowship',  count: 1, pct: '13%', color: 'bg-amber-500',    w: '20%' },
                  { label: 'Job',         count: 1, pct: '13%', color: 'bg-teal-500',     w: '20%' },
                  { label: 'Grant',       count: 1, pct: '13%', color: 'bg-rose-500',     w: '20%' },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className="w-20 text-sm text-foreground">{r.label}</span>
                    <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div className={`h-full ${r.color} rounded-full`} style={{ width: r.w }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-14 text-right">{r.count} ({r.pct})</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <h2 className="font-serif font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {[
                  { icon: Clock,       label: `${pending.length} opportunities awaiting review`, action: 'Review Now', style: 'bg-amber-500 text-white',  onClick: () => setTab('opportunities') },
                  { icon: Activity,    label: 'Configure AI discovery sources',                  action: 'Manage',     style: 'bg-[#1a4d35] text-white',   onClick: () => setTab('sources')       },
                  { icon: Bell,        label: 'Send notification to law students',               action: 'Send',       style: 'bg-violet-600 text-white',   onClick: () => setTab('notifications') },
                  { icon: ShieldCheck, label: 'Manage module permissions',                       action: 'Configure',  style: 'bg-amber-500 text-white',    onClick: () => setTab('roles')         },
                ].map((a, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#fdf9f0] border border-amber-100">
                    <div className="h-7 w-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <a.icon className="h-3.5 w-3.5 text-amber-600" />
                    </div>
                    <p className="flex-1 text-sm text-foreground">{a.label}</p>
                    <button onClick={a.onClick} className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold ${a.style}`}>{a.action}</button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
            <h2 className="font-serif font-bold text-foreground mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { icon: Zap,        color: 'bg-violet-100 text-violet-600', text: 'AI scan completed — 3 new opportunities found',      time: '2 hours ago'  },
                { icon: Check,      color: 'bg-emerald-100 text-emerald-600',text: 'UNICEF Nigeria Legal Internship approved and published',time: '5 hours ago' },
                { icon: X,          color: 'bg-red-100 text-red-600',       text: 'MacArthur Foundation Grant rejected (not law-specific)', time: '1 day ago'  },
                { icon: Bell,       color: 'bg-amber-100 text-amber-600',   text: 'Notification sent to 4,120 Law faculty students',      time: '2 days ago'  },
                { icon: ShieldCheck,color: 'bg-sky-100 text-sky-600',       text: 'Law Pavilion added as trusted AI source',              time: '3 days ago'  },
              ].map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${a.color}`}>
                    <a.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{a.text}</p>
                    <p className="text-[10px] text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Opportunities ── */}
      {tab === 'opportunities' && (
        <div className="space-y-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-foreground">Opportunities</h2>
            <p className="text-xs text-muted-foreground mt-0.5">View, edit, approve, reject, archive or delete opportunities.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input value={oppSearch} onChange={e => setOppSearch(e.target.value)} placeholder="Search opportunities…"
                className="w-full pl-9 pr-3 h-9 rounded-xl bg-white border border-stone-200 text-sm outline-none" />
            </div>
            <select className="h-9 px-3 rounded-xl bg-white border border-stone-200 text-sm outline-none">
              <option>All Statuses</option>
              {['Published', 'Pending Review', 'Rejected', 'Archived'].map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="h-9 px-3 rounded-xl bg-white border border-stone-200 text-sm outline-none">
              <option>All Types</option>
              {['Scholarship', 'Internship', 'Fellowship', 'Job', 'Grant'].map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold">
              <Plus className="h-4 w-4" /> Add Opportunity
            </button>
          </div>
          <p className="text-xs text-muted-foreground">{filteredOpps.length} of {opps.length} opportunities</p>
          <div className="space-y-3">
            {filteredOpps.map(o => (
              <div key={o.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${typeColors[o.type] || 'bg-stone-100 text-stone-600'}`}>{o.type}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusColors[o.status] || 'bg-stone-100 text-stone-600'}`}>{o.status}</span>
                      {o.ai && (
                        <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-violet-50 text-violet-600 text-[9px] font-bold">
                          <Zap className="h-2.5 w-2.5" /> AI Discovered
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground leading-tight">{o.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{o.org} · {o.region} · Deadline: {o.deadline}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{o.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {o.status === 'Pending Review' && (
                      <>
                        <button onClick={() => approve(o.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700">
                          <Check className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button onClick={() => reject(o.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600">
                          <X className="h-3.5 w-3.5" /> Reject
                        </button>
                      </>
                    )}
                    <button className="p-1.5 rounded-lg hover:bg-stone-100 text-muted-foreground"><MoreVertical className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── AI Sources ── */}
      {tab === 'sources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-foreground">AI Sources</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Configure the trusted websites, APIs, and organisations the AI scans for opportunities.</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm text-foreground">Automatic Discovery</p>
              <p className="text-xs text-muted-foreground">When enabled, the AI continuously scans configured sources for new opportunities.</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setAutoDiscovery(v => !v)}
                className={`relative inline-flex h-6 w-10 rounded-full transition-colors ${autoDiscovery ? 'bg-[#1a4d35]' : 'bg-stone-200'}`}>
                <span className={`absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ${autoDiscovery ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <span className="text-xs font-semibold text-foreground">{autoDiscovery ? 'Enabled' : 'Disabled'}</span>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a4d35] text-white text-xs font-semibold">
                <RefreshCw className="h-3.5 w-3.5" /> Run Scan Now
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {sources.map((s, i) => {
              const typeColor = s.type === 'API' ? 'bg-violet-100 text-violet-700' : s.type === 'ORGANIZATION' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700';
              return (
                <div key={i} className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                    {s.type === 'API' ? <Activity className="h-4 w-4 text-violet-600" /> :
                     s.type === 'ORGANIZATION' ? <Building2 className="h-4 w-4 text-amber-600" /> :
                     <Globe className="h-4 w-4 text-sky-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                      <span className="font-semibold text-sm text-foreground">{s.name}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${typeColor}`}>{s.type}</span>
                      {s.trusted && <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[9px] font-bold"><Check className="h-2.5 w-2.5" /> Trusted</span>}
                    </div>
                    <p className="text-[10px] text-muted-foreground">{s.url}</p>
                    <p className="text-[10px] text-muted-foreground">Last scanned: {s.lastScan} · {s.found} opportunities found</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setSources(prev => prev.map((x, j) => j === i ? { ...x, enabled: !x.enabled } : x))}
                      className={`relative inline-flex h-5 w-8 rounded-full transition-colors ${s.enabled ? 'bg-[#1a4d35]' : 'bg-stone-200'}`}>
                      <span className={`absolute top-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform ${s.enabled ? 'translate-x-3' : 'translate-x-0.5'}`} />
                    </button>
                    <button className="p-1.5 text-muted-foreground hover:text-foreground"><ShieldCheck className="h-4 w-4" /></button>
                    <button className="p-1.5 text-muted-foreground hover:text-foreground"><ExternalLink className="h-4 w-4" /></button>
                    <button className="p-1.5 text-red-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              );
            })}
          </div>
          <button className="w-full py-2.5 rounded-xl border border-dashed border-stone-300 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" /> Add New Source
          </button>
        </div>
      )}

      {/* ── Scan Settings ── */}
      {tab === 'scan' && (
        <div className="space-y-5">
          <div>
            <h2 className="font-serif font-bold text-xl text-foreground">Scan Settings</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Control how and when the AI discovers and publishes new opportunities.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Scan Frequency</h3>
              </div>
              <div className="space-y-3">
                {[
                  { value: 'hourly', label: 'Hourly', desc: 'Scans every hour — highest coverage, highest compute cost' },
                  { value: 'daily',  label: 'Daily',  desc: 'Scans once daily at 06:00 WAT — recommended' },
                  { value: 'weekly', label: 'Weekly', desc: 'Scans every Monday at 06:00 WAT — lowest cost' },
                ].map(o => (
                  <label key={o.value} className="flex items-start gap-3 cursor-pointer">
                    <input type="radio" name="freq" value={o.value} checked={scanFreq === o.value}
                      onChange={() => setScanFreq(o.value as any)}
                      className="mt-0.5 accent-[#1a4d35]" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{o.label}</p>
                      <p className="text-xs text-muted-foreground">{o.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Publish Mode</h3>
              </div>
              <div className="space-y-4">
                {[
                  { value: 'review', label: 'Review Before Publishing', desc: "AI-discovered opportunities go to Pending — an admin approves before students see them." },
                  { value: 'auto',   label: 'Auto-Publish', desc: 'Opportunities from trusted sources are published immediately without review.' },
                ].map(o => (
                  <label key={o.value} className="flex items-start gap-3 cursor-pointer">
                    <input type="radio" name="publish" value={o.value} checked={publishMode === o.value}
                      onChange={() => setPublishMode(o.value as any)}
                      className="mt-0.5 accent-[#1a4d35]" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{o.label}</p>
                      <p className="text-xs text-muted-foreground">{o.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">Discovery Filters</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Max Results Per Scan</label>
                <input type="number" defaultValue={50} className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none" />
                <p className="text-[10px] text-muted-foreground mt-1">Cap the number of new results per scan cycle.</p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Minimum Relevance Score (%)</label>
                <input type="number" defaultValue={70} className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none" />
                <p className="text-[10px] text-muted-foreground mt-1">Discard opportunities below this AI confidence score.</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { val: lawOnly, set: setLawOnly, label: 'Law students only', desc: 'Only surface opportunities relevant to law / legal studies.' },
                { val: nigeriaOnly, set: setNigeriaOnly, label: 'Nigeria-based opportunities only', desc: 'Exclude international opportunities from auto-discovery.' },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <button onClick={() => t.set(v => !v)}
                    className={`relative shrink-0 mt-0.5 inline-flex h-5 w-9 rounded-full transition-colors ${t.val ? 'bg-[#1a4d35]' : 'bg-stone-200'}`}>
                    <span className={`absolute top-0.5 h-4 w-4 bg-white rounded-full shadow transition-transform ${t.val ? 'translate-x-4' : 'translate-x-0.5'}`} />
                  </button>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button className="px-6 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold shadow-sm hover:bg-[#14392a] transition-colors">Save Settings</button>
          </div>
        </div>
      )}

      {/* ── Notifications ── */}
      {tab === 'notifications' && (
        <div>
          <div className="mb-4">
            <h2 className="font-serif font-bold text-xl text-foreground">Notifications</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Send targeted notifications to students based on faculty or department.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Send className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Compose Notification</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Faculty</label>
                  <select value={notifFaculty} onChange={e => setNotifFaculty(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-stone-200 text-sm outline-none bg-white">
                    {['All Faculties', 'Law Faculty', 'Social Sciences', 'Arts & Humanities'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Department</label>
                  <select value={notifDept} onChange={e => setNotifDept(e.target.value)}
                    className="w-full h-9 px-3 rounded-xl border border-stone-200 text-sm outline-none bg-white">
                    {['All Departments', 'Public Law', 'Private Law', 'International Law'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2">
                <Users className="h-4 w-4 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-700 font-medium">{recipients.toLocaleString()} students will receive this notification</p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Subject</label>
                <input value={notifSubject} onChange={e => setNotifSubject(e.target.value)}
                  placeholder="e.g. New scholarship opportunity for law students"
                  className="w-full h-9 px-3 rounded-xl border border-stone-200 text-sm outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Message</label>
                <textarea value={notifMsg} onChange={e => setNotifMsg(e.target.value)}
                  placeholder="Write your notification message here..."
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-sm outline-none resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Link to Opportunity (Optional)</label>
                <input value={notifLink} onChange={e => setNotifLink(e.target.value)}
                  placeholder="https://..."
                  className="w-full h-9 px-3 rounded-xl border border-stone-200 text-sm outline-none" />
              </div>
              <button className="w-full py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#14392a] transition-colors">
                <Send className="h-4 w-4" /> Send Notification
              </button>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground">Recent Sends</h3>
              </div>
              <div className="space-y-2">
                {RECENT_SENDS.map((s, i) => (
                  <div key={i} className="p-3 rounded-xl bg-stone-50 border border-stone-100 hover:border-stone-200 transition-colors cursor-pointer">
                    <p className="text-sm font-medium text-foreground leading-snug mb-1">{s.subject}</p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {s.audience}</span>
                      <span>·</span>
                      <span>{s.recipients.toLocaleString()} recipients</span>
                      <span>·</span>
                      <span>{s.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Roles & Perms ── */}
      {tab === 'roles' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif font-bold text-xl text-foreground">Roles &amp; Permissions</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Control who can manage the Scholarships &amp; Opportunities module.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors">
              <Plus className="h-4 w-4" /> Add Manager
            </button>
          </div>

          <div className="space-y-4">
            {MANAGERS.map((m, i) => (
              <div key={i} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#1a4d35] text-white flex items-center justify-center text-xs font-bold shrink-0">{m.initials}</div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{m.name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-xs text-muted-foreground hover:text-foreground font-medium">Edit Permissions</button>
                    <button className="text-xs text-red-500 hover:text-red-700 font-medium">Remove</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PERM_LABELS.map(p => <PermPill key={p.key} on={m.perms[p.key]} label={p.label} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Stub ──────────────────────────────────────────────────────────────────────

function StubPage({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-serif font-bold text-foreground mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground">{desc}</p>
      <div className="mt-8 bg-white rounded-xl border border-stone-200 p-12 text-center">
        <p className="text-muted-foreground text-sm">Coming soon</p>
      </div>
    </div>
  );
}

// ── Admin Settings ────────────────────────────────────────────────────────────

type SettingsTab = 'profile' | 'team' | 'platform' | 'integrations' | 'audit' | 'notifications' | 'help' | 'account';

const SETTINGS_NAV: { key: SettingsTab; label: string; icon: React.ElementType; red?: boolean }[] = [
  { key: 'profile',       label: 'Profile',               icon: Users           },
  { key: 'team',          label: 'Team & Roles',          icon: UserCheck       },
  { key: 'platform',      label: 'Platform Notifications',icon: Activity        },
  { key: 'integrations',  label: 'Integrations',          icon: Zap             },
  { key: 'audit',         label: 'Audit Log',             icon: BookMarked      },
  { key: 'notifications', label: 'Notifications',         icon: Bell            },
  { key: 'help',          label: 'Help & Support',        icon: HelpCircle      },
  { key: 'account',       label: 'Account',               icon: LogOut, red: true },
];

const AUDIT_ENTRIES = [
  { action: 'Approved tutor account',  actor: 'Sade Balogun',  detail: 'Adeyemi Oluwaseun',           date: '2025-07-14 09:12' },
  { action: 'Subscription renewed',    actor: 'System',        detail: 'Chisom Okafor',                date: '2025-07-14 08:45' },
  { action: 'Published course content',actor: 'Emeka Nwosu',  detail: 'Criminal Law — Topic 3',       date: '2025-07-13 17:30' },
  { action: 'Resolved support ticket #841', actor: 'Fatima Yusuf', detail: 'Ticket #841',             date: '2025-07-13 14:11' },
  { action: 'Suspended user account',  actor: 'Sade Balogun',  detail: 'Tobenna Eze',                 date: '2025-07-12 11:55' },
];

const TEAM_MEMBERS = [
  { name: 'Sade Balogun',  email: 'sade@tolumo.ng',   initials: 'SB', role: 'Full Admin',      roleBg: 'bg-violet-100 text-violet-700' },
  { name: 'Emeka Nwosu',   email: 'emeka@tolumo.ng',  initials: 'EN', role: 'Content Curator', roleBg: 'bg-teal-100 text-teal-700'    },
  { name: 'Fatima Yusuf',  email: 'fatima@tolumo.ng', initials: 'FY', role: 'Support Staff',   roleBg: 'bg-stone-100 text-stone-600'  },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`relative shrink-0 inline-flex h-6 w-10 rounded-full transition-colors ${on ? 'bg-[#1a4d35]' : 'bg-stone-200'}`}>
      <span className={`absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  );
}

function SettingsRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-stone-100 last:border-b-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function AdminSettings() {
  const [tab, setTab] = useState<SettingsTab>('profile');

  // Profile state
  const [fullName, setFullName] = useState('Admin User');
  const [phone, setPhone] = useState('+234 800 000 0000');
  const [gender, setGender] = useState('Female');

  // Notifications
  const [push, setPush]               = useState(true);
  const [email, setEmail]             = useState(true);
  const [whatsapp, setWhatsapp]       = useState(false);
  const [newSignups, setNewSignups]   = useState(true);
  const [churnRisk, setChurnRisk]     = useState(true);
  const [sysAlerts, setSysAlerts]     = useState(true);
  const [platAnn, setPlatAnn]         = useState(true);

  // Platform notifications
  const [moduleSubmit, setModuleSubmit]   = useState(true);
  const [tutorApply, setTutorApply]       = useState(true);
  const [paymentFail, setPaymentFail]     = useState(true);
  const [securityAlert, setSecurityAlert] = useState(true);
  const [weeklyReport, setWeeklyReport]   = useState(false);

  // Audit search
  const [auditSearch, setAuditSearch] = useState('');
  const [revealKey, setRevealKey]     = useState(false);

  const filteredAudit = AUDIT_ENTRIES.filter(e =>
    e.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
    e.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
    e.detail.toLowerCase().includes(auditSearch.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Admin Account</p>
      </div>

      <div className="flex gap-0 bg-transparent">
        {/* Left nav */}
        <div className="w-44 shrink-0 bg-white rounded-xl border border-stone-200 shadow-sm py-2 h-fit">
          {SETTINGS_NAV.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors text-left relative ${
                tab === item.key ? 'text-foreground' : item.red ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <item.icon className={`h-4 w-4 shrink-0 ${item.red ? 'text-red-500' : ''}`} />
              {item.label}
              {tab === item.key && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1a4d35]" />}
            </button>
          ))}
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0 ml-4 bg-white rounded-xl border border-stone-200 shadow-sm p-6">

          {/* ── Profile ── */}
          {tab === 'profile' && (
            <div className="space-y-6">
              <h2 className="font-serif font-bold text-lg text-foreground">Profile</h2>

              {/* Avatar card */}
              <div className="flex items-center gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
                <div className="relative">
                  <div className="h-14 w-14 rounded-full bg-[#1a4d35] text-white flex items-center justify-center text-lg font-bold">CO</div>
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@tolumo.com</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">Full Admin</span>
                </div>
                <button className="ml-auto text-xs text-primary font-medium hover:underline">Upload photo</button>
              </div>

              {/* Personal Information */}
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Personal Information</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Full Name</label>
                    <input value={fullName} onChange={e => setFullName(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Email Address</label>
                    <input value="admin@tolumo.com" readOnly
                      className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm text-muted-foreground bg-stone-50 outline-none" />
                    <p className="text-[10px] text-muted-foreground mt-1">To change your email, contact Support.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Phone Number</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                    <p className="text-[10px] text-muted-foreground mt-1">Used for account recovery and notifications.</p>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Gender</label>
                    <select value={gender} onChange={e => setGender(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none bg-white appearance-none">
                      {['Female', 'Male', 'Prefer not to say'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Password & Security */}
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Password &amp; Security</p>
                <button className="text-sm font-medium text-primary hover:underline">Change password →</button>
              </div>

              <div className="flex justify-end">
                <button className="px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors shadow-sm">Save Changes</button>
              </div>
            </div>
          )}

          {/* ── Team & Roles ── */}
          {tab === 'team' && (
            <div className="space-y-5">
              <h2 className="font-serif font-bold text-lg text-foreground">Team &amp; Roles</h2>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Team Members</p>
                <div className="rounded-xl border border-stone-200 overflow-hidden divide-y divide-stone-100">
                  {TEAM_MEMBERS.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                      <div className="h-8 w-8 rounded-full bg-[#1a4d35] text-white flex items-center justify-center text-xs font-bold shrink-0">{m.initials}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.email}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${m.roleBg}`}>{m.role}</span>
                      <button className="p-1.5 text-red-400 hover:text-red-600 transition-colors"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors shadow-sm">
                <Plus className="h-4 w-4" /> Add Team Member
              </button>
            </div>
          )}

          {/* ── Platform Notifications ── */}
          {tab === 'platform' && (
            <div className="space-y-5">
              <h2 className="font-serif font-bold text-lg text-foreground">Platform Notifications</h2>
              <p className="text-sm text-muted-foreground">Control which platform events trigger admin alerts.</p>
              <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 px-4">
                <SettingsRow label="Module submission" desc="A tutor submits a new module for review.">
                  <Toggle on={moduleSubmit} onToggle={() => setModuleSubmit(v => !v)} />
                </SettingsRow>
                <SettingsRow label="Tutor application" desc="A new tutor applies to join the platform.">
                  <Toggle on={tutorApply} onToggle={() => setTutorApply(v => !v)} />
                </SettingsRow>
                <SettingsRow label="Payment failure" desc="A subscription or add-on payment fails.">
                  <Toggle on={paymentFail} onToggle={() => setPaymentFail(v => !v)} />
                </SettingsRow>
                <SettingsRow label="Security alert" desc="Unusual login activity or account breach attempt.">
                  <Toggle on={securityAlert} onToggle={() => setSecurityAlert(v => !v)} />
                </SettingsRow>
                <SettingsRow label="Weekly digest" desc="Summary of platform activity every Monday.">
                  <Toggle on={weeklyReport} onToggle={() => setWeeklyReport(v => !v)} />
                </SettingsRow>
              </div>
            </div>
          )}

          {/* ── Integrations ── */}
          {tab === 'integrations' && (
            <div className="space-y-5">
              <h2 className="font-serif font-bold text-lg text-foreground">Integrations</h2>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Payment Gateways</p>
                <div className="space-y-3">
                  {/* Paystack */}
                  <div className="rounded-xl border border-stone-200 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-foreground">Paystack</p>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Active</span>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground mb-2">
                      {revealKey ? 'sk_live_test_abc123_demo4a2f' : 'sk_live_••••••••••••4a2f'}
                    </p>
                    <div className="flex items-center gap-3">
                      <button onClick={() => setRevealKey(v => !v)} className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                        <ShieldCheck className="h-3 w-3" /> {revealKey ? 'Hide key' : 'Reveal key'}
                      </button>
                      <span className="text-stone-300">·</span>
                      <button className="text-xs text-primary font-medium hover:underline">Update key</button>
                    </div>
                  </div>
                  {/* Flutterwave */}
                  <div className="rounded-xl border border-stone-200 p-4">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-foreground">Flutterwave</p>
                      <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">Lapsed</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Not configured</p>
                  </div>
                  {/* Lawpavillon */}
                  <div className="rounded-xl border border-stone-200 p-4">
                    <div className="flex items-start justify-between mb-1">
                      <p className="font-semibold text-foreground">Lawpavillon API</p>
                      <span className="text-xs text-muted-foreground font-medium">Coming soon</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Coming soon</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Audit Log ── */}
          {tab === 'audit' && (
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-lg text-foreground">Audit Log</h2>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Activity Log</p>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                  <input value={auditSearch} onChange={e => setAuditSearch(e.target.value)}
                    placeholder="Search by actor or action…"
                    className="w-full h-9 pl-9 pr-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
                  {filteredAudit.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-muted-foreground">No matching entries.</p>
                  ) : filteredAudit.map((e, i) => (
                    <div key={i} className="flex items-start justify-between px-4 py-3.5 hover:bg-stone-50">
                      <div>
                        <p className="text-sm font-medium text-foreground">{e.action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{e.actor} · {e.detail}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono shrink-0 ml-4">{e.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {tab === 'notifications' && (
            <div className="space-y-5">
              <h2 className="font-serif font-bold text-lg text-foreground">Notifications</h2>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Channels</p>
                <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 px-4">
                  <SettingsRow label="Push notifications">
                    <Toggle on={push} onToggle={() => setPush(v => !v)} />
                  </SettingsRow>
                  <SettingsRow label="Email notifications">
                    <Toggle on={email} onToggle={() => setEmail(v => !v)} />
                  </SettingsRow>
                  <SettingsRow label="WhatsApp alerts" desc="Requires a verified WhatsApp number.">
                    <Toggle on={whatsapp} onToggle={() => setWhatsapp(v => !v)} />
                  </SettingsRow>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Notification Types</p>
                <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 px-4">
                  <SettingsRow label="New sign-ups" desc="Daily digest of new student registrations.">
                    <Toggle on={newSignups} onToggle={() => setNewSignups(v => !v)} />
                  </SettingsRow>
                  <SettingsRow label="Churn risk alerts" desc="Subscribers inactive for 14+ days.">
                    <Toggle on={churnRisk} onToggle={() => setChurnRisk(v => !v)} />
                  </SettingsRow>
                  <SettingsRow label="System alerts" desc="Payment gateway errors and infrastructure events.">
                    <Toggle on={sysAlerts} onToggle={() => setSysAlerts(v => !v)} />
                  </SettingsRow>
                  <SettingsRow label="Platform announcements" desc="Internal team communication.">
                    <Toggle on={platAnn} onToggle={() => setPlatAnn(v => !v)} />
                  </SettingsRow>
                </div>
              </div>
            </div>
          )}

          {/* ── Help & Support ── */}
          {tab === 'help' && (
            <div className="space-y-4">
              <h2 className="font-serif font-bold text-lg text-foreground">Help &amp; Support</h2>
              <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
                {[
                  { label: 'Help Centre & FAQs',    desc: 'Answers to common questions about courses, payments, and tutors.' },
                  { label: 'Contact Support',        desc: 'Reach our team via chat, email, or WhatsApp.' },
                  { label: 'Report a Problem',       desc: 'Flag a bug, incorrect content, or platform issue.' },
                  { label: 'Community Guidelines',   desc: 'Our standards for respectful academic interaction.' },
                  { label: 'Terms of Service',       desc: undefined },
                  { label: 'Privacy Policy',         desc: undefined },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 transition-colors text-left group">
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{item.label}</p>
                      {item.desc && <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>}
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Account ── */}
          {tab === 'account' && (
            <div className="space-y-5">
              <h2 className="font-serif font-bold text-lg text-foreground">Account</h2>
              <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
                {[
                  { label: 'Export account data',   desc: 'Download a copy of your admin account data.'  },
                  { label: 'Transfer admin role',    desc: 'Assign your Full Admin role to another team member.' },
                  { label: 'Deactivate account',    desc: 'Temporarily disable this admin account.', red: true },
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-stone-50 transition-colors text-left">
                    <div>
                      <p className={`text-sm font-medium ${item.red ? 'text-red-500' : 'text-foreground'}`}>{item.label}</p>
                      {item.desc && <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Admin Help Page ───────────────────────────────────────────────────────────

function AdminHelpPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Help &amp; Support</h1>
        <p className="text-sm text-muted-foreground mt-1">Admin resources and support channels.</p>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden">
        {[
          { label: 'Help Centre & FAQs',    desc: 'Answers to common questions about courses, payments, and tutors.' },
          { label: 'Contact Support',        desc: 'Reach our team via chat, email, or WhatsApp.' },
          { label: 'Report a Problem',       desc: 'Flag a bug, incorrect content, or platform issue.' },
          { label: 'Community Guidelines',   desc: 'Our standards for respectful academic interaction.' },
          { label: 'Terms of Service',       desc: undefined },
          { label: 'Privacy Policy',         desc: undefined },
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

// ── Router ────────────────────────────────────────────────────────────────────

export default function AdminPortal() {
  return (
    <AdminShell>
      <Switch>
        <Route path="/admin"               component={AdminDashboard}       />
        <Route path="/admin/users"         component={UsersPage}            />
        <Route path="/admin/modules"       component={ModulesPage}          />
        <Route path="/admin/subscriptions" component={SubscriptionsPage}    />
        <Route path="/admin/analytics"     component={AnalyticsPage}        />
        <Route path="/admin/announcements" component={AnnouncementsPage}    />
        <Route path="/admin/scholarships"  component={ScholarshipsAdminPage}/>
        <Route path="/admin/settings"  component={AdminSettings} />
        <Route path="/admin/help"      component={AdminHelpPage} />
        <Route component={AdminDashboard} />
      </Switch>
    </AdminShell>
  );
}
