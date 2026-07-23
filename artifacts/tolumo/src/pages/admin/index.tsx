import React, { useState } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { useClerk } from '@clerk/react';
import {
  LayoutDashboard, Users, BookOpen, CreditCard, BarChart2,
  Megaphone, Award, HelpCircle, Settings, LogOut,
  ChevronLeft, ChevronRight, Bell, Search, Menu,
  BookMarked, UserCheck, X,
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
    { href: '/admin',               label: 'Overview',              icon: LayoutDashboard },
    { href: '/admin/users',         label: 'Users',                 icon: Users           },
    { href: '/admin/modules',       label: 'Modules',               icon: BookOpen        },
    { href: '/admin/subscriptions', label: 'Subscriptions',         icon: CreditCard      },
    { href: '/admin/analytics',     label: 'Analytics',             icon: BarChart2       },
    { href: '/admin/announcements', label: 'Announcements',         icon: Megaphone       },
    { href: '/admin/scholarships',  label: 'Scholarships & Opps',   icon: Award           },
  ];

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      {mobileOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-30 w-[200px] bg-[#1a4d35] flex flex-col h-full shrink-0 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-4 py-4 flex items-center gap-2.5">
          <img src={`${basePath}/logo.svg`} alt="Tolumo" className="h-8 w-8 shrink-0" />
          <div>
            <p className="font-serif font-bold text-lg text-white leading-none">Tolumo</p>
            <p className="text-[8px] font-bold text-white/35 uppercase tracking-[0.2em] mt-0.5">Admin Portal</p>
          </div>
        </div>

        <nav className="flex-1 px-2.5 space-y-0.5 overflow-y-auto py-2">
          {topNav.map(item => (
            <NavItem key={item.href} {...item} active={isActive(item.href)} />
          ))}
        </nav>

        <div className="px-2.5 pt-2 pb-5 border-t border-white/10 space-y-0.5">
          <NavItem href="/admin/help"     label="Help & Support" icon={HelpCircle} active={isActive('/admin/help')} />
          <NavItem href="/admin/settings" label="Settings"       icon={Settings}   active={isActive('/admin/settings')} />
          <button
            onClick={() => signOut().then(() => setLocation('/sign-in'))}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" /> Sign out
          </button>
        </div>
      </aside>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 shrink-0 bg-white border-b border-stone-200 flex items-center gap-3 px-4">
          <button className="md:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-stone-100" onClick={() => setMobileOpen(v => !v)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => history.back()} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-stone-100">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => history.forward()} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-stone-100">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input
                placeholder="Search courses, topics…"
                className="w-full h-9 pl-9 pr-3 rounded-full bg-stone-100 border-0 text-sm placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors"
              />
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
  {
    icon: BookMarked,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    label: '4 modules awaiting approval',
    action: 'Review',
    actionStyle: 'bg-[#1a4d35] text-white hover:bg-[#14392a]',
  },
  {
    icon: UserCheck,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    label: '3 new tutor applications',
    action: 'Review',
    actionStyle: 'bg-[#1a4d35] text-white hover:bg-[#14392a]',
  },
  {
    icon: CreditCard,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    label: '2 payment disputes to resolve',
    action: 'View',
    actionStyle: 'bg-[#1a4d35] text-white hover:bg-[#14392a]',
  },
  {
    icon: Megaphone,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    label: 'Platform announcement due (new semester)',
    action: 'Draft',
    actionStyle: 'bg-[#1a4d35] text-white hover:bg-[#14392a]',
  },
];

function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Heading */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Platform Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">Tolumo admin dashboard — July 2025</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Students',
            value: '12,411',
            sub: '+284 this week',
            icon: Users,
            iconColor: 'text-stone-500',
          },
          {
            label: 'Active Tutors',
            value: '48',
            sub: '+3 pending approval',
            icon: UserCheck,
            iconColor: 'text-amber-500',
          },
          {
            label: 'Monthly Revenue',
            value: '₦18.4M',
            sub: '+14% vs last month',
            icon: CreditCard,
            iconColor: 'text-teal-500',
          },
          {
            label: 'Modules Live',
            value: '23',
            sub: '4 pending review',
            icon: BookOpen,
            iconColor: 'text-violet-500',
          },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-2">{s.label}</p>
              <p className="text-2xl font-bold font-serif text-foreground leading-none mb-1.5">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.sub}</p>
            </div>
            <div className="h-9 w-9 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0">
              <s.icon className={`h-4.5 w-4.5 ${s.iconColor}`} style={{ height: '1.125rem', width: '1.125rem' }} />
            </div>
          </div>
        ))}
      </div>

      {/* 2-col cards */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Monthly Subscriptions */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
          <h2 className="font-serif font-bold text-lg text-foreground mb-5">Monthly Subscriptions</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Monthly (₦3,500/mo)</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">3,723 subs</span>
                  <span className="text-sm font-bold text-foreground">₦13.0M</span>
                </div>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1a4d35] rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Semester (₦9,500/sem)</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">548 subs</span>
                  <span className="text-sm font-bold text-foreground">₦5.2M</span>
                </div>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1a4d35]/40 rounded-full" style={{ width: '23%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Annual (₦24,000/yr)</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">112 subs</span>
                  <span className="text-sm font-bold text-foreground">₦2.7M</span>
                </div>
              </div>
              <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#1a4d35]/25 rounded-full" style={{ width: '8%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
          <h2 className="font-serif font-bold text-lg text-foreground mb-5">Pending Actions</h2>
          <div className="space-y-3">
            {PENDING_ACTIONS.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#fdf9f0] border border-amber-100">
                <div className={`h-8 w-8 rounded-lg ${item.iconBg} flex items-center justify-center shrink-0`}>
                  <item.icon className={`h-4 w-4 ${item.iconColor}`} />
                </div>
                <p className="flex-1 text-sm text-foreground font-medium leading-snug">{item.label}</p>
                <button className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${item.actionStyle}`}>
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
  { id: 1, name: 'Chisom Nwosu',    email: 'chisom@example.com',   role: 'student', joined: '2025-01-15' },
  { id: 2, name: 'Prof. Adeyemi',   email: 'adeyemi@example.com',  role: 'tutor',   joined: '2024-09-01' },
  { id: 3, name: 'Dr. Eze',         email: 'eze@example.com',      role: 'tutor',   joined: '2024-09-01' },
  { id: 4, name: 'Tunde Balogun',   email: 'tunde@example.com',    role: 'student', joined: '2025-02-20' },
  { id: 5, name: 'Ngozi Okafor',    email: 'ngozi@example.com',    role: 'student', joined: '2025-03-10' },
  { id: 6, name: 'Prof. Olawale',   email: 'olawale@example.com',  role: 'tutor',   joined: '2024-09-01' },
  { id: 7, name: 'Fatima Aliyu',    email: 'fatima@example.com',   role: 'student', joined: '2025-04-05' },
  { id: 8, name: 'Emeka Chukwu',   email: 'emeka@example.com',    role: 'student', joined: '2025-05-18' },
];

function UsersPage() {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState(MOCK_USERS);
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{users.length} total accounts</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search users…"
            className="pl-9 pr-3 h-9 rounded-xl bg-white border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 w-56"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[#1a4d35] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      {u.name.charAt(0)}
                    </div>
                    <span className="font-medium text-foreground">{u.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{u.email}</td>
                <td className="px-5 py-3.5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    u.role === 'admin'   ? 'bg-violet-100 text-violet-700' :
                    u.role === 'tutor'  ? 'bg-amber-100 text-amber-700' :
                                          'bg-blue-100 text-blue-700'
                  }`}>{u.role}</span>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{new Date(u.joined).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                <td className="px-5 py-3.5">
                  <select
                    value={u.role}
                    onChange={e => setUsers(prev => prev.map(p => p.id === u.id ? { ...p, role: e.target.value } : p))}
                    className="text-xs border border-stone-200 rounded-lg bg-white px-2 py-1.5 outline-none focus:border-primary/40"
                  >
                    {['student', 'tutor', 'admin'].map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="px-5 py-12 text-center text-muted-foreground text-sm">No users match your search.</div>
        )}
      </div>
    </div>
  );
}

// ── Stub pages ────────────────────────────────────────────────────────────────

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

// ── Router ─────────────────────────────────────────────────────────────────────

export default function AdminPortal() {
  return (
    <AdminShell>
      <Switch>
        <Route path="/admin"               component={AdminDashboard} />
        <Route path="/admin/users"         component={UsersPage} />
        <Route path="/admin/modules">      {() => <StubPage title="Modules" desc="Review and approve module content submitted by tutors." />}        </Route>
        <Route path="/admin/subscriptions">{() => <StubPage title="Subscriptions" desc="Manage all student subscription plans and billing." />}      </Route>
        <Route path="/admin/analytics">    {() => <StubPage title="Analytics" desc="Platform-wide engagement and revenue analytics." />}             </Route>
        <Route path="/admin/announcements">{() => <StubPage title="Announcements" desc="Draft and publish platform-wide announcements." />}          </Route>
        <Route path="/admin/scholarships"> {() => <StubPage title="Scholarships & Opps" desc="Manage verified opportunities shown to students." />}  </Route>
        <Route path="/admin/settings">     {() => <StubPage title="Settings" desc="Platform configuration and admin preferences." />}               </Route>
        <Route path="/admin/help">         {() => <StubPage title="Help & Support" desc="Admin help centre and support resources." />}               </Route>
        <Route component={AdminDashboard} />
      </Switch>
    </AdminShell>
  );
}
