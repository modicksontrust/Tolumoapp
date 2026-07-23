import React, { useState } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { useClerk } from '@clerk/react';
import {
  LayoutDashboard, Ticket, Settings, Users, Shield, BarChart2,
  ClipboardList, Bell, LogOut, ChevronDown, AlertTriangle,
  Zap, Clock, CheckCircle2, UserPlus, Lock, Search, X,
  Download, Plus, ChevronRight, ArrowRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

// ── Palette ───────────────────────────────────────────────────────────────────
const SIDEBAR = '#161e30';

// ── Sample Data ───────────────────────────────────────────────────────────────
const TICKETS_DATA = [
  { id: 'TKT-1001', subject: 'Subscription payment failed after card update', requester: 'Chisom Nwosu', team: 'Payment Support', priority: 'Critical', status: 'Escalated', sla: 'Breached', assigned: 'Amara Eze',    created: '2025-07-15' },
  { id: 'TKT-1002', subject: 'Commission payout not reflecting in dashboard',  requester: 'Yemi Abiola',   team: 'Account Support', priority: 'High',     status: 'In Progress','sla': 'At Risk',  assigned: 'Ngozi Okeke', created: '2025-07-16' },
  { id: 'TKT-1003', subject: 'Unable to access course after enrolment',        requester: 'Kola Balogun',  team: 'Content Support', priority: 'Medium',   status: 'Open',       sla: 'On Track', assigned: null,          created: '2025-07-17' },
  { id: 'TKT-1004', subject: 'Lecturer certificate not uploading',              requester: 'Bisi Okafor',   team: 'Content Support', priority: 'Medium',   status: 'Open',       sla: 'On Track', assigned: 'Amara Eze',    created: '2025-07-17' },
  { id: 'TKT-1005', subject: 'Password reset link not working',                 requester: 'Emeka Ibrahim', team: 'Account Support', priority: 'Low',      status: 'In Progress','sla': 'On Track', assigned: 'Ngozi Okeke', created: '2025-07-17' },
  { id: 'TKT-1006', subject: 'Student referral code not applying discount',     requester: 'Ada Obi',       team: 'Payment Support', priority: 'Medium',   status: 'Open',       sla: 'On Track', assigned: null,          created: '2025-07-18' },
  { id: 'TKT-1007', subject: 'Lecturer verification pending over 5 days',       requester: 'Olu Martins',   team: 'Agent Support',   priority: 'Medium',   status: 'Escalated',  sla: 'Breached', assigned: 'Tunde Okafor', created: '2025-07-15' },
  { id: 'TKT-1008', subject: 'Duplicate charge on July subscription',           requester: 'Remi Taiwo',    team: 'Payment Support', priority: 'High',     status: 'Resolved',   sla: 'On Track', assigned: 'Amara Eze',    created: '2025-07-14' },
];

const AGENTS = ['Amara Eze', 'Tunde Okafor', 'Ngozi Okeke', 'Sade Balogun', 'Emeka Okafor'];

const AUDIT_LOG = [
  { action: 'Escalation Level 2', actor: 'System (Auto)',  role: 'System',      ticket: 'TKT-1001', desc: 'SLA breached — escalated to CRM Manager automatically.',                ts: '2025-07-15 14:12' },
  { action: 'Assigned to Agent',  actor: 'Amara Eze',      role: 'Supervisor',  ticket: 'TKT-1001', desc: 'Assigned to Amara Eze (Payment Support).',                              ts: '2025-07-15 10:30' },
  { action: 'Status Changed',     actor: 'Tunde Okafor',   role: 'Agent',       ticket: 'TKT-1002', desc: 'Open → In Progress.',                                                   ts: '2025-07-16 11:00' },
  { action: 'Resolved',           actor: 'Amara Eze',      role: 'Supervisor',  ticket: 'TKT-1008', desc: 'Refund issued ₦24,000. Duplicate charge confirmed and reversed.',        ts: '2025-07-14 11:18' },
  { action: 'Escalation Level 3', actor: 'Funmi Adeyemi',  role: 'CRM Manager', ticket: 'TKT-1007', desc: 'Escalated to Super Admin after 5-day breach.',                          ts: '2025-07-17 09:00' },
  { action: 'Ticket Created',     actor: 'System (Portal)', role: 'System',     ticket: 'TKT-1003', desc: 'New ticket submitted via chat portal.',                                  ts: '2025-07-17 14:30' },
  { action: 'Response Sent',      actor: 'Ngozi Okeke',    role: 'Agent',       ticket: 'TKT-1005', desc: 'Password reset link sent. Awaiting student confirmation.',               ts: '2025-07-17 12:00' },
  { action: 'Assigned to Agent',  actor: 'Sade Balogun',   role: 'Supervisor',  ticket: 'TKT-1004', desc: 'Assigned to Amara Eze (Payment Support).',                              ts: '2025-07-17 09:15' },
  { action: 'SLA At-Risk',        actor: 'System (Auto)',  role: 'System',      ticket: 'TKT-1002', desc: '75% of SLA time elapsed. Supervisor notified.',                          ts: '2025-07-17 06:45' },
  { action: 'Ticket Created',     actor: 'System (Email)', role: 'System',      ticket: 'TKT-1001', desc: 'Ticket created from inbound email.',                                    ts: '2025-07-15 08:12' },
];

const NOTIFS = [
  { id: 1, title: 'SLA Breached — TKT-1001',        desc: 'Payment failure ticket has exceeded 4-hour SLA. Auto-escalated to CRM Manager.', time: '2 hrs ago',  unread: true,  icon: Zap,          color: 'text-red-600    bg-red-100'    },
  { id: 2, title: 'New Escalation — TKT-1007',      desc: 'Verification delay ticket escalated to Level 3. Requires Super Admin review.',    time: '4 hrs ago',  unread: true,  icon: AlertTriangle, color: 'text-orange-600 bg-orange-100' },
  { id: 3, title: 'SLA At-Risk — TKT-1002',         desc: 'Commission ticket at 79% of SLA. Assigned agent notified.',                       time: '6 hrs ago',  unread: true,  icon: Clock,         color: 'text-amber-600  bg-amber-100'  },
  { id: 4, title: 'Ticket Resolved — TKT-1008',     desc: 'Duplicate charge resolved by Amara Eze. CSAT: 5★',                               time: 'Yesterday',  unread: false, icon: CheckCircle2,  color: 'text-emerald-600 bg-emerald-100'},
  { id: 5, title: 'New Agent Added',                desc: 'Remi Taiwo added to Content Support team by Funmi Adeyemi.',                      time: 'Yesterday',  unread: false, icon: UserPlus,      color: 'text-blue-600   bg-blue-100'   },
  { id: 6, title: 'Permission Role Updated',        desc: "Supervisor role: 'Reassign Tickets' permission enabled by Super Admin.",          time: '2 days ago', unread: false, icon: Lock,          color: 'text-purple-600 bg-purple-100' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function PriorityBadge({ p }: { p: string }) {
  const cls: Record<string, string> = {
    Critical: 'bg-red-100 text-red-700 border border-red-200',
    High:     'bg-orange-100 text-orange-700',
    Medium:   'bg-amber-100 text-amber-700',
    Low:      'bg-stone-100 text-stone-500',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls[p] ?? ''}`}>{p}</span>;
}
function StatusBadge({ s }: { s: string }) {
  const cls: Record<string, string> = {
    Open:        'bg-blue-100 text-blue-700',
    'In Progress':'bg-amber-100 text-amber-700',
    Escalated:   'bg-red-100 text-red-700',
    Resolved:    'bg-emerald-100 text-emerald-700',
    Closed:      'bg-stone-100 text-stone-500',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls[s] ?? ''}`}>{s}</span>;
}
function SLABadge({ s }: { s: string }) {
  if (s === 'Breached') return <span className="text-[10px] font-bold text-red-600">● Breached</span>;
  if (s === 'At Risk')  return <span className="text-[10px] font-bold text-amber-600">● At Risk</span>;
  return <span className="text-[10px] font-bold text-emerald-600">● On Track</span>;
}
function RoleBadge({ role }: { role: string }) {
  const cls: Record<string, string> = {
    System:      'bg-stone-100 text-stone-600',
    Agent:       'bg-blue-100 text-blue-700',
    Supervisor:  'bg-purple-100 text-purple-700',
    'CRM Manager':'bg-amber-100 text-amber-700',
  };
  return <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${cls[role] ?? 'bg-stone-100 text-stone-600'}`}>{role}</span>;
}
function Toggle({ on, onToggle, disabled }: { on: boolean; onToggle: () => void; disabled?: boolean }) {
  return (
    <button onClick={disabled ? undefined : onToggle} disabled={disabled}
      className={`relative shrink-0 inline-flex h-6 w-11 rounded-full transition-colors ${on ? 'bg-[#1a4d35]' : 'bg-stone-200'} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}>
      <span className={`absolute top-0.5 h-5 w-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { href: '/crm',               label: 'Dashboard',          icon: LayoutDashboard, badge: 0 },
  { href: '/crm/tickets',       label: 'Tickets',            icon: Ticket,          badge: 2 },
  { href: '/crm/sla',           label: 'SLA Management',     icon: Clock,           badge: 0 },
  { href: '/crm/teams',         label: 'Teams',              icon: Users,           badge: 0 },
  { href: '/crm/roles',         label: 'Roles & Permissions',icon: Shield,          badge: 0 },
  { href: '/crm/analytics',     label: 'Analytics',          icon: BarChart2,       badge: 0 },
  { href: '/crm/audit',         label: 'Audit Trail',        icon: ClipboardList,   badge: 0 },
  { href: '/crm/notifications', label: 'Notifications',      icon: Bell,            badge: 3 },
];

function CRMShell({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { signOut } = useClerk();
  const isActive = (href: string) =>
    href === '/crm' ? location === '/crm' : location.startsWith(href);
  const pageTitle = NAV_ITEMS.find(n => isActive(n.href))?.label ?? 'Dashboard';
  const unreadNotifs = NOTIFS.filter(n => n.unread).length;

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-44 shrink-0 flex flex-col h-full" style={{ background: SIDEBAR }}>
        {/* Logo */}
        <div className="px-4 pt-5 pb-3 flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#1a4d35] flex items-center justify-center shrink-0">
            <span className="text-white text-[11px] font-black">T</span>
          </div>
          <span className="text-white font-serif font-bold text-sm">Tolumo CRM</span>
        </div>

        {/* Role dropdown */}
        <div className="px-3 pb-2">
          <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest mb-1">Demo Role</p>
          <button className="w-full flex items-center justify-between bg-white/8 hover:bg-white/12 transition-colors rounded-lg px-2.5 py-1.5">
            <span className="text-white text-xs font-semibold">Super Admin</span>
            <ChevronDown className="h-3 w-3 text-white/50" />
          </button>
        </div>

        {/* User */}
        <div className="mx-3 mb-3 flex items-center gap-2 p-2 rounded-lg bg-white/5">
          <div className="h-7 w-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">SA</div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-[11px] font-semibold truncate">Funmi Adeyemi</p>
            <span className="inline-block bg-red-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wide">Super Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] font-medium transition-colors ${
                isActive(item.href) ? 'bg-white/15 text-white' : 'text-white/55 hover:bg-white/8 hover:text-white/90'
              }`}>
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge > 0 && (
                <span className="h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{item.badge}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-3 border-t border-white/8 mt-2">
          <button onClick={() => signOut().then(() => setLocation('/sign-in'))}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] font-medium text-white/55 hover:bg-white/8 hover:text-white/90 transition-colors">
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-50">
        {/* Top bar */}
        <header className="h-12 border-b border-stone-200 bg-white flex items-center justify-between px-6 shrink-0">
          <span className="font-semibold text-sm text-foreground">{pageTitle}</span>
          <Link href="/crm/notifications" className="relative">
            <Bell className="h-4.5 w-4.5 text-muted-foreground" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 bg-red-500 rounded-full text-white text-[8px] font-bold flex items-center justify-center">{unreadNotifs}</span>
            )}
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
const VOL_DATA  = [{ d:'Mon',v:8},{ d:'Tue',v:14},{ d:'Wed',v:16},{ d:'Thu',v:22},{ d:'Fri',v:13},{ d:'Sat',v:5},{ d:'Sun',v:3}];
const RES_DATA  = [{ p:'Critical',actual:3,sla:4},{ p:'High',actual:18,sla:24},{ p:'Medium',actual:55,sla:72},{ p:'Low',actual:140,sla:168}];
const AGENTS_PERF = [
  { name:'Amara Eze',    team:'Payment Support',  open:4, resolved:7, avg:3.2, csat:94, online:true  },
  { name:'Tunde Okafor', team:'Agent Support',    open:6, resolved:3, avg:5.8, csat:87, online:true  },
  { name:'Ngozi Okeke',  team:'Account Support',  open:3, resolved:5, avg:2.9, csat:96, online:true  },
  { name:'Sade Balogun', team:'Account Support',  open:2, resolved:9, avg:2.1, csat:98, online:true  },
  { name:'Emeka Okafor', team:'Payment Support',  open:0, resolved:4, avg:4.5, csat:91, online:false },
];

function Dashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-serif font-bold text-foreground">CRM Overview</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Live snapshot — last updated just now</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { label:'Total Tickets', value:8,  sub:'All time',           icon:Ticket,        color:'text-stone-600   bg-stone-100'   },
          { label:'Open',          value:2,  sub:'Needs assignment',   icon:AlertTriangle, color:'text-blue-600    bg-blue-100'    },
          { label:'Escalated',     value:2,  sub:'Requires attention', icon:Zap,           color:'text-red-600     bg-red-100'     },
          { label:'SLA Breached',  value:2,  sub:'Urgent action needed',icon:AlertTriangle,color:'text-red-600     bg-red-100'     },
          { label:'At Risk',       value:1,  sub:'Watch closely',      icon:Clock,         color:'text-amber-600   bg-amber-100'   },
          { label:'Resolved Today',value:1,  sub:'CSAT avg 93%',       icon:CheckCircle2,  color:'text-emerald-600 bg-emerald-100' },
        ].map((s, i) => {
          const [tc, bg] = s.color.split(' ');
          return (
            <div key={i} className="bg-white rounded-xl border border-stone-200 shadow-sm p-4">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center mb-2 ${bg} ${tc}`}>
                <s.icon className="h-3.5 w-3.5" />
              </div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
              <p className="text-xl font-serif font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* SLA Health */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-4">SLA Health</p>
        <div className="flex items-end gap-8 mb-3">
          <div><p className="text-2xl font-serif font-bold text-emerald-600">63%</p><p className="text-xs text-muted-foreground">On Track</p></div>
          <div><p className="text-2xl font-serif font-bold text-amber-500">13%</p><p className="text-xs text-muted-foreground">At Risk</p></div>
          <div><p className="text-2xl font-serif font-bold text-red-600">25%</p><p className="text-xs text-muted-foreground">Breached</p></div>
        </div>
        <div className="flex gap-1 h-2 rounded-full overflow-hidden">
          <div className="bg-emerald-500 rounded-l-full" style={{ width: '63%' }} />
          <div className="bg-amber-400" style={{ width: '13%' }} />
          <div className="bg-red-500 rounded-r-full" style={{ width: '25%' }} />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Ticket Volume — Last 7 Days</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={VOL_DATA} margin={{ top:4, right:4, left:-20, bottom:0 }}>
              <XAxis dataKey="d" tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize:11, borderRadius:8, border:'1px solid #e5e7eb' }} />
              <Bar dataKey="v" fill="#1a4d35" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Avg Resolution vs SLA Target (Hrs)</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={RES_DATA} margin={{ top:4, right:4, left:-20, bottom:0 }}>
              <XAxis dataKey="p" tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ fontSize:11, borderRadius:8, border:'1px solid #e5e7eb' }} />
              <Bar dataKey="actual" fill="#1a4d35" radius={[4,4,0,0]} name="Actual" />
              <Bar dataKey="sla"    fill="#d1d5db" radius={[4,4,0,0]} name="SLA Target" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Escalations */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <p className="px-5 py-3.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-b border-stone-100">Escalations Requiring Action</p>
        {[
          { id:'TKT-1001', subject:'Subscription payment failed after card update', person:'Chisom Nwosu', level:'L2 escalation', priority:'Critical', status:'Escalated' },
          { id:'TKT-1007', subject:'Lecturer verification pending over 5 days',      person:'Olu Martins',   level:'L3 escalation', priority:'Medium',  status:'Escalated' },
        ].map((e, i) => (
          <div key={i} className="flex items-center px-5 py-3.5 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
            <div className="w-1.5 h-10 rounded-full mr-4 shrink-0" style={{ background: e.priority === 'Critical' ? '#ef4444' : '#f59e0b' }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{e.subject}</p>
              <p className="text-[10px] text-muted-foreground">{e.id} · {e.person} · {e.level}</p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <PriorityBadge p={e.priority} />
              <StatusBadge s={e.status} />
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
        ))}
      </div>

      {/* Agent Performance */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <p className="px-5 py-3.5 text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-b border-stone-100">Agent Performance — Today</p>
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>{['Agent','Open','Resolved','Avg (Hrs)','CSAT'].map(h => (
              <th key={h} className="px-4 py-2.5 text-left text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {AGENTS_PERF.map((a, i) => (
              <tr key={i} className="hover:bg-stone-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full shrink-0 ${a.online ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                    <div>
                      <p className="font-semibold text-foreground">{a.name}</p>
                      <p className="text-[10px] text-muted-foreground">{a.team}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{a.open}</td>
                <td className="px-4 py-3 font-medium">{a.resolved}</td>
                <td className="px-4 py-3 font-medium">{a.avg}</td>
                <td className="px-4 py-3 font-bold text-emerald-600">{a.csat}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Tickets ───────────────────────────────────────────────────────────────────
function Tickets() {
  const [tickets, setTickets] = useState(TICKETS_DATA.map(t => ({ ...t })));
  const [query, setQuery] = useState('');
  const [statusF, setStatusF] = useState('All');
  const [priorityF, setPriorityF] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title:'', priority:'Medium', category:'Technical Issues', description:'' });

  const filtered = tickets.filter(t => {
    const q = query.toLowerCase();
    return (
      (t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.requester.toLowerCase().includes(q)) &&
      (statusF === 'All' || t.status === statusF) &&
      (priorityF === 'All' || t.priority === priorityF)
    );
  });

  function createTicket() {
    if (!form.title.trim()) return;
    const id = `TKT-${1009 + tickets.length}`;
    setTickets(prev => [{ id, subject: form.title, requester:'Funmi Adeyemi', team:'Payment Support', priority: form.priority, status:'Open', sla:'On Track', assigned: null, created: '2025-07-23' }, ...prev]);
    setForm({ title:'', priority:'Medium', category:'Technical Issues', description:'' });
    setShowModal(false);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      {/* Toolbar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search tickets, requesters..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={statusF} onChange={e => setStatusF(e.target.value)}
          className="h-10 px-3 rounded-xl border border-stone-200 bg-white text-sm outline-none appearance-none">
          {['All','Open','In Progress','Escalated','Resolved','Closed'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={priorityF} onChange={e => setPriorityF(e.target.value)}
          className="h-10 px-3 rounded-xl border border-stone-200 bg-white text-sm outline-none appearance-none">
          {['All','Critical','High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
        </select>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors">
          <Plus className="h-4 w-4" /> Create Ticket
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>{['Ticket','Requester','Team','Priority','Status','SLA','Assigned'].map(h => (
              <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-stone-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-mono text-[10px] text-muted-foreground mb-0.5">{t.id}</p>
                  <p className="font-semibold text-foreground text-sm truncate max-w-[220px]">{t.subject}</p>
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{t.requester}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground">{t.team}</td>
                <td className="px-4 py-3"><PriorityBadge p={t.priority} /></td>
                <td className="px-4 py-3"><StatusBadge s={t.status} /></td>
                <td className="px-4 py-3"><SLABadge s={t.sla} /></td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{t.assigned ?? <span className="text-stone-400 italic">Unassigned</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-[480px] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-serif font-bold text-lg text-foreground">Create New Ticket</h2>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Title</label>
              <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))}
                placeholder="Describe the issue briefly"
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Priority</label>
                <select value={form.priority} onChange={e => setForm(f => ({...f, priority: e.target.value}))}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none bg-white appearance-none">
                  {['Critical','High','Medium','Low'].map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
                  className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none bg-white appearance-none">
                  {['Technical Issues','Billing & Payments','Account Access','Content Issues','Agent Issues'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
                placeholder="Full details of the issue..." rows={4}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-foreground hover:bg-stone-50 transition-colors">Cancel</button>
              <button onClick={createTicket}
                className="px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors">Create Ticket</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SLA Management ─────────────────────────────────────────────────────────────
type SLARow = { priority: string; dot: string; firstResponse: number; resolution: number; escalateAt: number; autoEscalate: boolean };

function SLAManagement() {
  const [rows, setRows] = useState<SLARow[]>([
    { priority:'Critical', dot:'bg-red-500',    firstResponse:1,  resolution:4,   escalateAt:80, autoEscalate:true  },
    { priority:'High',     dot:'bg-orange-500', firstResponse:4,  resolution:24,  escalateAt:75, autoEscalate:true  },
    { priority:'Medium',   dot:'bg-amber-400',  firstResponse:24, resolution:72,  escalateAt:80, autoEscalate:false },
    { priority:'Low',      dot:'bg-emerald-500',firstResponse:48, resolution:168, escalateAt:90, autoEscalate:false },
  ]);

  function update(i: number, field: keyof SLARow, val: number | boolean) {
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">SLA Policies</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Configure response and resolution targets per priority level.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors">Save Policies</button>
      </div>

      {/* Policy table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200">
            <tr className="bg-stone-50">
              {['Priority','First Response','Resolution','Escalate At','Auto-Escalate'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((r, i) => (
              <tr key={r.priority} className="hover:bg-stone-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`h-2 w-2 rounded-full ${r.dot}`} />
                    <span className="text-sm font-semibold text-foreground">{r.priority}</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <input type="number" value={r.firstResponse} onChange={e => update(i, 'firstResponse', +e.target.value)}
                      className="w-16 h-9 px-2 rounded-lg border border-stone-200 text-sm text-center outline-none focus:ring-2 focus:ring-primary/20" />
                    <span className="text-xs text-muted-foreground">hrs</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <input type="number" value={r.resolution} onChange={e => update(i, 'resolution', +e.target.value)}
                      className="w-16 h-9 px-2 rounded-lg border border-stone-200 text-sm text-center outline-none focus:ring-2 focus:ring-primary/20" />
                    <span className="text-xs text-muted-foreground">hrs</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <input type="number" value={r.escalateAt} onChange={e => update(i, 'escalateAt', +e.target.value)}
                      className="w-16 h-9 px-2 rounded-lg border border-stone-200 text-sm text-center outline-none focus:ring-2 focus:ring-primary/20" />
                    <span className="text-xs text-muted-foreground">%</span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Toggle on={r.autoEscalate} onToggle={() => update(i, 'autoEscalate', !r.autoEscalate)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Escalation chain */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Escalation Chain</p>
        <div className="space-y-3">
          {[
            { from:'L1', to:'L2', left:'Agent',       right:'Supervisor',  desc:'SLA at escalate% threshold or agent manual escalation.' },
            { from:'L2', to:'L3', left:'Supervisor',   right:'CRM Manager', desc:'SLA breach or supervisor manual escalation.'            },
            { from:'L3', to:'L4', left:'CRM Manager',  right:'Super Admin', desc:'L2 escalation after 2 hours or CRM Manager manual escalation.' },
          ].map((e, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="text-xs font-bold text-muted-foreground w-10 shrink-0">{e.from} → {e.to}</span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold">{e.left}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-700 text-xs font-semibold">{e.right}</span>
              </div>
              <p className="flex-1 text-xs text-muted-foreground text-right">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Teams ─────────────────────────────────────────────────────────────────────
const TEAMS_DATA = [
  { name:'Payment Support', desc:'Payments, subscriptions, refunds',    active:12, members:[{n:'Amara Eze',sup:true},{n:'Emeka Okafor',sup:false},{n:'Kola Ade',sup:false}],  supervisor:'Amara Eze'  },
  { name:'Agent Support',   desc:'Sub-Agent & Super Agent issues',      active:7,  members:[{n:'Tunde Okafor',sup:true},{n:'Bisi Martins',sup:false}],                        supervisor:'Tunde Okafor'},
  { name:'Account Support', desc:'Login, access, account issues',       active:9,  members:[{n:'Sade Balogun',sup:true},{n:'Ngozi Okeke',sup:false},{n:'Yemi Abiola',sup:false}], supervisor:'Sade Balogun'},
  { name:'Content Support', desc:'Courses, videos, certificates',       active:5,  members:[{n:'Chibundo Osei',sup:false},{n:'Remi Taiwo',sup:false}],                        supervisor:'Funmi Adeyemi'},
];

function Teams() {
  const [teams, setTeams] = useState(TEAMS_DATA);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name:'', specialization:'', supervisor:'Amara Eze' });

  function createTeam() {
    if (!form.name.trim()) return;
    setTeams(prev => [...prev, { name: form.name, desc: form.specialization, active: 0, members: [], supervisor: form.supervisor }]);
    setForm({ name:'', specialization:'', supervisor:'Amara Eze' });
    setShowModal(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Support Teams</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{teams.length} teams · {teams.reduce((a,t) => a + t.members.length, 0)} total agents</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors">
          <Plus className="h-4 w-4" /> New Team
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {teams.map((t, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.desc}</p>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{t.active} active</span>
            </div>
            <div>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Members ({t.members.length})</p>
              <div className="flex flex-wrap gap-1.5 items-center">
                {t.members.map((m, j) => (
                  <span key={j} className="flex items-center gap-1 px-2 py-0.5 bg-stone-100 rounded-full text-xs font-medium text-foreground">
                    <span className="h-4 w-4 rounded-full bg-[#1a4d35] text-white text-[8px] font-bold flex items-center justify-center">{m.n[0]}</span>
                    {m.n.split(' ')[0]}
                    {m.sup && <span className="text-[8px] font-black text-muted-foreground">SUP</span>}
                  </span>
                ))}
                <button className="text-[10px] font-semibold text-[#1a4d35] hover:underline">+ Add</button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Supervisor: <span className="font-semibold text-foreground">{t.supervisor}</span></p>
              <button className="text-xs font-semibold text-[#1a4d35] hover:underline">Edit team</button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-96 p-6 space-y-4">
            <h2 className="font-serif font-bold text-lg text-foreground">Create New Team</h2>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Team Name</label>
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                placeholder="e.g. Premium Support"
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Specialization</label>
              <input value={form.specialization} onChange={e => setForm(f => ({...f, specialization: e.target.value}))}
                placeholder="e.g. VIP students and tutors"
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Supervisor</label>
              <select value={form.supervisor} onChange={e => setForm(f => ({...f, supervisor: e.target.value}))}
                className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none bg-white appearance-none">
                {AGENTS.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-foreground hover:bg-stone-50 transition-colors">Cancel</button>
              <button onClick={createTeam}
                className="px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors">Create Team</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Roles & Permissions ────────────────────────────────────────────────────────
type RoleKey = 'super_admin' | 'crm_manager' | 'supervisor' | 'support_agent';
type PermKey = string;

const PERM_GROUPS = [
  { section: 'Tickets',    perms: ['View All Tickets','Create Tickets','Assign Tickets','Reassign Tickets','Close / Resolve Tickets','Delete Tickets','Escalate Tickets','View Team Tickets Only'] },
  { section: 'Analytics',  perms: ['View Analytics','Export Reports'] },
  { section: 'Teams',      perms: ['Manage Teams','Add / Remove Agents'] },
  { section: 'Roles',      perms: ['Manage Roles & Permissions'] },
  { section: 'SLA',        perms: ['Configure SLA Policies','Configure Escalation Rules'] },
  { section: 'Audit',      perms: ['View Audit Trail'] },
];

const DEFAULT_PERMS: Record<RoleKey, Record<PermKey, boolean>> = {
  super_admin:   Object.fromEntries(PERM_GROUPS.flatMap(g => g.perms.map(p => [p, true]))),
  crm_manager:   Object.fromEntries(PERM_GROUPS.flatMap(g => g.perms.map(p => [p, !['Delete Tickets','Manage Roles & Permissions'].includes(p)]))),
  supervisor:    Object.fromEntries(PERM_GROUPS.flatMap(g => g.perms.map(p => [p, ['View All Tickets','Assign Tickets','Reassign Tickets','Close / Resolve Tickets','Escalate Tickets','View Analytics','View Audit Trail'].includes(p)]))),
  support_agent: Object.fromEntries(PERM_GROUPS.flatMap(g => g.perms.map(p => [p, ['View Team Tickets Only','Create Tickets'].includes(p)]))),
};

function RolesPermissions() {
  const [role, setRole] = useState<RoleKey>('super_admin');
  const [perms, setPerms] = useState(DEFAULT_PERMS);

  const TABS: { key: RoleKey; label: string }[] = [
    { key:'super_admin',   label:'Super Admin'   },
    { key:'crm_manager',   label:'CRM Manager'   },
    { key:'supervisor',    label:'Supervisor'     },
    { key:'support_agent', label:'Support Agent'  },
  ];

  function toggle(perm: PermKey) {
    if (role === 'super_admin') return; // fixed
    setPerms(prev => ({
      ...prev,
      [role]: { ...prev[role], [perm]: !prev[role][perm] },
    }));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Roles &amp; Permissions</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Configure what each role can do. Super Admin permissions are fixed.</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors">Save Changes</button>
      </div>

      {/* Role tabs */}
      <div className="flex gap-2">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setRole(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${role === t.key ? 'bg-[#1a4d35] text-white' : 'bg-white border border-stone-200 text-foreground hover:bg-stone-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Permissions */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {PERM_GROUPS.map(g => (
          <React.Fragment key={g.section}>
            <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{g.section}</p>
            </div>
            {g.perms.map(p => (
              <div key={p} className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100 last:border-0 hover:bg-stone-50/50 transition-colors">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <span className="text-sm font-medium text-foreground">{p}</span>
                </div>
                <Toggle on={perms[role][p]} onToggle={() => toggle(p)} disabled={role === 'super_admin'} />
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ── Analytics ─────────────────────────────────────────────────────────────────
const WEEKLY = [
  { w:'W1 Jun',tickets:42,resolved:38},{ w:'W2 Jun',tickets:48,resolved:41},
  { w:'W3 Jun',tickets:35,resolved:35},{ w:'W4 Jun',tickets:52,resolved:44},
  { w:'W1 Jul',tickets:38,resolved:35},{ w:'W2 Jul',tickets:55,resolved:46},{ w:'W3 Jul',tickets:61,resolved:50},
];

function Analytics() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-serif font-bold text-foreground">Analytics</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Performance metrics across the CRM.</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label:'Total Tickets (Jul)',  value:'61',   sub:'↑ 11% vs Jun'  },
          { label:'Resolution Rate',      value:'82%',  sub:'Target 90%'    },
          { label:'Avg CSAT',             value:'93%',  sub:'↑ 2pts vs Jun' },
          { label:'SLA Compliance',       value:'75%',  sub:'Target 85%'    },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 shadow-sm p-4">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{s.label}</p>
            <p className="text-2xl font-serif font-bold text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Weekly Tickets — Opened vs Resolved</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={WEEKLY} margin={{ top:4, right:4, left:-20, bottom:0 }}>
            <XAxis dataKey="w" tick={{ fontSize:9, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:10, fill:'#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize:11, borderRadius:8, border:'1px solid #e5e7eb' }} />
            <Bar dataKey="tickets"  fill="#1a4d35" radius={[4,4,0,0]} name="Opened"   />
            <Bar dataKey="resolved" fill="#86efac" radius={[4,4,0,0]} name="Resolved" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-stone-100">
          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Agent Leaderboard — July</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>{['Agent','Team','Tickets Resolved','Avg Resolution','CSAT'].map(h => (
              <th key={h} className="px-4 py-2.5 text-left text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {AGENTS_PERF.sort((a,b) => b.csat - a.csat).map((a, i) => (
              <tr key={i} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-semibold">{a.name}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{a.team}</td>
                <td className="px-4 py-3">{a.resolved}</td>
                <td className="px-4 py-3">{a.avg}h</td>
                <td className="px-4 py-3 font-bold text-emerald-600">{a.csat}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Audit Trail ───────────────────────────────────────────────────────────────
function AuditTrail() {
  const [query, setQuery] = useState('');
  const [actorFilter, setActorFilter] = useState('All Actors');

  const actors = ['All Actors', ...Array.from(new Set(AUDIT_LOG.map(l => l.actor)))];
  const filtered = AUDIT_LOG.filter(l =>
    (actorFilter === 'All Actors' || l.actor === actorFilter) &&
    (l.action.toLowerCase().includes(query.toLowerCase()) ||
     l.desc.toLowerCase().includes(query.toLowerCase()) ||
     l.ticket.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-serif font-bold text-foreground">Audit Trail</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Complete immutable log of all CRM actions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 bg-white text-sm font-semibold hover:bg-stone-50 transition-colors">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search actions, actors, tickets..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <select value={actorFilter} onChange={e => setActorFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-stone-200 bg-white text-sm outline-none appearance-none">
          {actors.map(a => <option key={a}>{a}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden">
        {filtered.map((l, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-4 hover:bg-stone-50 transition-colors">
            <div className="h-7 w-7 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center shrink-0 mt-0.5">
              <ClipboardList className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-sm font-semibold text-foreground">{l.action}</p>
                <RoleBadge role={l.role} />
                <span className="text-[10px] font-mono font-bold text-muted-foreground">{l.ticket}</span>
              </div>
              <p className="text-xs text-muted-foreground">{l.desc}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{l.actor} · {l.ts}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Notifications ─────────────────────────────────────────────────────────────
function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFS);
  function markAllRead() { setNotifs(n => n.map(i => ({ ...i, unread: false }))); }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold text-foreground">Notification Centre</h1>
        <button onClick={markAllRead} className="text-sm font-semibold text-[#1a4d35] hover:underline">Mark all read</button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden">
        {notifs.map(n => {
          const [ic, bg] = n.color.split(' ');
          return (
            <div key={n.id} className={`flex items-start gap-4 px-5 py-4 hover:bg-stone-50 transition-colors ${n.unread ? 'bg-orange-50/40' : ''}`}>
              <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${bg}`}>
                <n.icon className={`h-4 w-4 ${ic}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{n.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{n.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
              </div>
              {n.unread && <span className="h-2 w-2 rounded-full bg-red-500 shrink-0 mt-2" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Router ─────────────────────────────────────────────────────────────────────
export default function CrmPortal() {
  return (
    <CRMShell>
      <Switch>
        <Route path="/crm"               component={Dashboard}       />
        <Route path="/crm/tickets"       component={Tickets}         />
        <Route path="/crm/sla"           component={SLAManagement}   />
        <Route path="/crm/teams"         component={Teams}           />
        <Route path="/crm/roles"         component={RolesPermissions} />
        <Route path="/crm/analytics"     component={Analytics}       />
        <Route path="/crm/audit"         component={AuditTrail}      />
        <Route path="/crm/notifications" component={Notifications}   />
        <Route component={Dashboard} />
      </Switch>
    </CRMShell>
  );
}
