import React, { useState, useRef, useEffect } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import {
  Home, Users, Share2, DollarSign, CheckCircle2,
  MessageSquare, HelpCircle, Settings, LogOut,
  Bell, ChevronLeft, ChevronRight, Copy, Send,
  Download, Phone, Mail, ShieldCheck, Flag, Eye,
} from 'lucide-react';

// ── Shell ─────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { href: '/agent',                 label: 'Home',                 icon: Home          },
  { href: '/agent/students',        label: 'My Students',          icon: Users         },
  { href: '/agent/referral',        label: 'Referral Tools',       icon: Share2        },
  { href: '/agent/commission',      label: 'Commission',           icon: DollarSign    },
  { href: '/agent/verification',    label: 'Lecturer Verification',icon: CheckCircle2  },
  { href: '/agent/inbox',           label: 'Inbox',                icon: MessageSquare, badge: 1 },
];

function AgentShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const isActive = (href: string) =>
    href === '/agent' ? location === '/agent' : location.startsWith(href);

  const pageTitle = NAV_ITEMS.find(n => isActive(n.href))?.label ?? 'Home';

  return (
    <div className="flex h-screen bg-[#F5F2EB] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[170px] bg-[#1a4d35] flex flex-col h-full shrink-0">
        {/* Logo */}
        <div className="px-4 pt-5 pb-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-md bg-amber-400 flex items-center justify-center text-[#1a4d35] font-bold text-xs shrink-0">T</div>
            <span className="font-serif font-bold text-white text-sm">Tolumo</span>
          </div>
          {/* User */}
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-white/20 text-white text-[10px] font-bold flex items-center justify-center shrink-0">CA</div>
            <div className="min-w-0">
              <p className="text-white text-[11px] font-semibold leading-tight truncate">Chiamaka Adeyemi</p>
              <p className="text-white/50 text-[9px] leading-tight">Sub-Agent · Uni.ag</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2.5 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] font-medium transition-colors relative ${
                isActive(item.href) ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              {item.label}
              {item.badge ? (
                <span className="ml-auto h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{item.badge}</span>
              ) : null}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2.5 pb-5 border-t border-white/10 pt-2 space-y-0.5 mt-2">
          {[
            { href: '/agent/help',     label: 'Help & Support', icon: HelpCircle },
            { href: '/agent/settings', label: 'Settings',       icon: Settings   },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors">
              <item.icon className="h-3.5 w-3.5 shrink-0" />
              {item.label}
            </Link>
          ))}
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[11px] font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="h-3.5 w-3.5 shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-12 bg-[#F5F2EB] border-b border-stone-200 flex items-center px-6 gap-4 shrink-0">
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-stone-200 text-stone-400"><ChevronLeft className="h-4 w-4" /></button>
            <button className="p-1 rounded hover:bg-stone-200 text-stone-400"><ChevronRight className="h-4 w-4" /></button>
          </div>
          <h1 className="font-semibold text-sm text-foreground flex-1">{pageTitle}</h1>
          <div className="relative">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 text-white text-[8px] font-bold flex items-center justify-center">1</span>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// ── Home ─────────────────────────────────────────────────────────────────────

function AgentHome() {
  const [, nav] = useLocation();
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <h2 className="text-xl font-serif font-bold text-foreground">Good morning, Chiamaka 👋</h2>
        <p className="text-sm text-muted-foreground">University of Lagos — Sub-Agent Dashboard</p>
      </div>

      {/* 4 stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'ACTIVE STUDENTS',       value: '8',        sub: '+2 this month',      subColor: 'text-emerald-600' },
          { label: 'COMMISSION (JUL)',       value: '₦42,000',  sub: '+20% vs Jun',        subColor: 'text-emerald-600' },
          { label: 'INSTITUTION PENETRATION',value: '4.2%',     sub: '8 of ~190 law students', subColor: 'text-muted-foreground' },
          { label: 'PENDING VERIFICATIONS',  value: '2',        sub: 'Awaiting your review',   subColor: 'text-muted-foreground' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 shadow-sm p-4">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{s.label}</p>
            <p className="text-2xl font-serif font-bold text-foreground">{s.value}</p>
            <p className={`text-[10px] mt-0.5 ${s.subColor}`}>↗ {s.sub}</p>
          </div>
        ))}
      </div>

      {/* Institution Penetration card */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Institution Penetration</p>
        <p className="text-3xl font-serif font-bold text-foreground mb-1">4.2%</p>
        <p className="text-sm text-muted-foreground mb-3">8 active students out of an estimated 190 law students at University of Lagos</p>
        <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#1a4d35] rounded-full" style={{ width: '4.2%' }} />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Quick Actions</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => nav('/agent/referral')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors">
            <Share2 className="h-3.5 w-3.5" /> Share My Link
          </button>
          <button onClick={() => nav('/agent/verification')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm font-semibold hover:bg-stone-50 transition-colors">
            <CheckCircle2 className="h-3.5 w-3.5" /> Review Verifications
            <span className="h-4 w-4 rounded-full bg-[#1a4d35] text-white text-[9px] font-bold flex items-center justify-center">2</span>
          </button>
          <button onClick={() => nav('/agent/students')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 bg-white text-sm font-semibold hover:bg-stone-50 transition-colors">
            <Users className="h-3.5 w-3.5" /> My Students
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Recent Activity</p>
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden">
          {[
            { ago: '2h ago',  text: 'Adaeze Nwosu signed up via your referral link'         },
            { ago: '5h ago',  text: 'Commission payout of ₦42,000 processed for July'        },
            { ago: '1d ago',  text: 'Lecturer verification request: Dr. Olumide Babatunde'  },
            { ago: '2d ago',  text: "Fatima Yusuf's subscription lapsed — consider re-engagement" },
            { ago: '3d ago',  text: 'Emeka Obi upgraded from Monthly to Annual plan'        },
          ].map((a, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <span className="text-[10px] text-muted-foreground font-mono shrink-0 w-10">{a.ago}</span>
              <p className="text-sm text-foreground">{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── My Students ───────────────────────────────────────────────────────────────

const STUDENTS_DATA = [
  { name: 'Adaeze Nwosu',   uni: 'University of Lagos', date: '12 Jun 2025', plan: 'Monthly', status: 'Active'  },
  { name: 'Emeka Obi',      uni: 'University of Lagos', date: '5 Jun 2025',  plan: 'Annual',  status: 'Active'  },
  { name: 'Fatima Yusuf',   uni: 'University of Lagos', date: '28 May 2025', plan: 'Monthly', status: 'Lapsed'  },
  { name: 'Kingsley Eze',   uni: 'University of Lagos', date: '20 May 2025', plan: 'Monthly', status: 'Active'  },
  { name: 'Blessing Okoro', uni: 'University of Lagos', date: '14 May 2025', plan: 'Annual',  status: 'Active'  },
  { name: 'Tunde Bakare',   uni: 'University of Lagos', date: '3 May 2025',  plan: 'Monthly', status: 'Lapsed'  },
  { name: 'Chidinma Igwe',  uni: 'University of Lagos', date: '22 Apr 2025', plan: 'Monthly', status: 'Active'  },
  { name: 'Seun Adeyemi',   uni: 'University of Lagos', date: '10 Apr 2025', plan: 'Annual',  status: 'Active'  },
];

function ReEngageModal({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-4">
        <h2 className="font-serif font-bold text-lg text-foreground">Re-engage {name}</h2>
        <p className="text-sm text-muted-foreground">
          Reach out through your own channels — Tolumo doesn't share personal contact details directly.
          Use the message below as a template via WhatsApp, SMS, or any platform you both use.
        </p>
        <div className="bg-stone-50 rounded-xl p-4 font-mono text-sm text-foreground leading-relaxed">
          Hi! Just checking in — your Tolumo subscription lapsed and you might be missing new course content.
          Monthly plan is still just ₦3,500. Rejoin with my link: tolumo.ng/ref/08472
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold hover:bg-green-600 transition-colors">
            <span>⬛</span> WhatsApp
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-stone-200 text-sm font-semibold hover:bg-stone-50 transition-colors">
            <Mail className="h-3.5 w-3.5" /> Email
          </button>
          <button onClick={onClose} className="ml-auto text-sm text-muted-foreground hover:text-foreground">Close</button>
        </div>
      </div>
    </div>
  );
}

function MyStudents() {
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [reEngage, setReEngage] = useState<string | null>(null);

  const filtered = STUDENTS_DATA.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchPlan   = planFilter === 'All'   || s.plan === planFilter;
    const matchStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  return (
    <>
      {reEngage && <ReEngageModal name={reEngage} onClose={() => setReEngage(null)} />}
      <div className="max-w-3xl mx-auto space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..."
              className="w-full pl-9 pr-3 h-9 rounded-xl bg-white border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <select value={planFilter} onChange={e => setPlanFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white border border-stone-200 text-sm outline-none">
            {['All', 'Monthly', 'Annual'].map(o => <option key={o}>{o}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white border border-stone-200 text-sm outline-none">
            {['All', 'Active', 'Lapsed'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto] text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-5 py-2.5 border-b border-stone-100">
            <span>Name</span>
            <span className="mr-8">Sign-up</span>
            <span className="mr-8">Plan</span>
            <span>Status</span>
          </div>
          {filtered.map((s, i) => (
            <div key={i} className="grid grid-cols-[1fr_auto_auto_auto] items-center px-5 py-3.5 border-b border-stone-50 last:border-b-0 hover:bg-stone-50">
              <div>
                <p className="text-sm font-semibold text-foreground">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.uni}</p>
              </div>
              <span className="text-xs text-muted-foreground mr-8">{s.date}</span>
              <span className={`mr-8 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                s.plan === 'Annual' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'
              }`}>{s.plan}</span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  s.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'
                }`}>{s.status}</span>
                {s.status === 'Lapsed' && (
                  <button onClick={() => setReEngage(s.name)}
                    className="px-2.5 py-1 rounded-full text-[10px] font-bold border border-stone-300 text-foreground hover:bg-stone-100 transition-colors">
                    Re-engage
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Referral Tools ────────────────────────────────────────────────────────────

const INVITE_HISTORY = [
  { contact: 'adaobi.eze@gmail.com', date: '10 Jul 2025', status: 'Signed Up',   statusColor: 'text-emerald-600 bg-emerald-50' },
  { contact: '+234 812 345 6789',    date: '8 Jul 2025',  status: 'Sent',        statusColor: 'text-sky-600 bg-sky-50'          },
  { contact: 'tunde.bakare@yahoo.com', date: '5 Jul 2025', status: 'No Response', statusColor: 'text-muted-foreground bg-stone-100' },
];

const MARKETING = [
  { title: 'WhatsApp Flyer — Jul 2025',   type: 'Image', date: '1 Jul 2025'  },
  { title: 'SMS Blast Template',          type: 'Text',  date: '28 Jun 2025' },
  { title: 'Instagram Story — Law Month', type: 'Image', date: '15 Jun 2025' },
  { title: 'Email Campaign Template',     type: 'Email', date: '10 Jun 2025' },
];

function ReferralTools() {
  const [inviteTab, setInviteTab] = useState<'Email' | 'Phone'>('Email');
  const [inviteContact, setInviteContact] = useState('');
  const [inviteNote, setInviteNote] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  function copy(text: string, set: (v: boolean) => void) {
    navigator.clipboard.writeText(text).catch(() => {});
    set(true);
    setTimeout(() => set(false), 1500);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Referral Identity */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-3">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Your Referral Identity</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground">Code</p>
            <p className="font-serif font-bold text-lg text-foreground">TOLUMO-UNILAG-08472</p>
          </div>
          <button onClick={() => copy('TOLUMO-UNILAG-08472', setCopied)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold hover:bg-stone-50 transition-colors">
            <Copy className="h-3 w-3" /> {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>
        <div className="flex items-center gap-2 bg-stone-50 rounded-lg px-3 py-2">
          <span className="text-sm text-muted-foreground flex-1">tolumo.ng/ref/08472</span>
          <button onClick={() => copy('tolumo.ng/ref/08472', setCopiedLink)}
            className="text-xs font-semibold text-primary hover:underline">{copiedLink ? 'Copied!' : 'Copy'}</button>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition-colors">WhatsApp</button>
          <button className="px-4 py-1.5 rounded-lg bg-stone-700 text-white text-xs font-semibold hover:bg-stone-800 transition-colors">SMS</button>
          <button className="px-4 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-semibold hover:bg-sky-600 transition-colors">Email</button>
        </div>
      </div>

      {/* Invite Tool */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-3">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Invite Tool</p>
        <div className="flex gap-1 w-fit">
          {(['Email', 'Phone'] as const).map(t => (
            <button key={t} onClick={() => setInviteTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${inviteTab === t ? 'bg-[#1a4d35] text-white' : 'text-muted-foreground hover:text-foreground border border-stone-200'}`}>
              {t}
            </button>
          ))}
        </div>
        <input value={inviteContact} onChange={e => setInviteContact(e.target.value)}
          placeholder={inviteTab === 'Email' ? 'student@email.com' : '+234 000 000 0000'}
          className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        <input value={inviteNote} onChange={e => setInviteNote(e.target.value)}
          placeholder="Optional personal note..."
          className="w-full h-10 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1a4d35]/80 text-white text-sm font-semibold hover:bg-[#1a4d35] transition-colors">
          <Send className="h-3.5 w-3.5" /> Send Invite
        </button>

        {/* History */}
        <div className="mt-2 divide-y divide-stone-100">
          {INVITE_HISTORY.map((h, i) => (
            <div key={i} className="flex items-center justify-between py-2.5">
              <div>
                <p className="text-sm font-medium text-foreground">{h.contact}</p>
                <p className="text-xs text-muted-foreground">{h.date}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${h.statusColor}`}>{h.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing Materials */}
      <div>
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Marketing Materials</p>
        <div className="grid grid-cols-2 gap-3">
          {MARKETING.map((m, i) => (
            <div key={i} className="bg-white rounded-xl border border-stone-200 shadow-sm p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                  <Download className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground leading-tight">{m.title}</p>
                  <p className="text-[10px] text-muted-foreground">{m.type} · Updated {m.date}</p>
                  <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded bg-stone-100 text-[9px] text-muted-foreground font-medium">Includes your code</span>
                </div>
              </div>
              <button className="text-xs font-semibold text-primary hover:underline shrink-0">Get</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Commission ────────────────────────────────────────────────────────────────

const EARNINGS = [
  { month: 'Feb', val: 20000, h: '33%' },
  { month: 'Mar', val: 28000, h: '46%' },
  { month: 'Apr', val: 31000, h: '52%' },
  { month: 'May', val: 32000, h: '53%' },
  { month: 'Jun', val: 35000, h: '58%' },
  { month: 'Jul', val: 42000, h: '70%' },
];

const PAYOUTS = [
  { date: '30 Jun 2025', method: 'Bank Transfer', amount: '₦35,000' },
  { date: '31 May 2025', method: 'Bank Transfer', amount: '₦27,500' },
  { date: '30 Apr 2025', method: 'Bank Transfer', amount: '₦31,000' },
];

function Commission() {
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* 3 stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'EARNED THIS MONTH', value: '₦42,000', sub: '↗ +20% vs last month', subColor: 'text-emerald-600' },
          { label: 'LIFETIME TOTAL',    value: '₦185,000', sub: undefined               },
          { label: 'NEXT PAYOUT',       value: '31 Jul 2025', sub: 'Bank Transfer',      subColor: 'text-muted-foreground' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 shadow-sm p-4">
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{s.label}</p>
            <p className="text-2xl font-serif font-bold text-foreground">{s.value}</p>
            {s.sub && <p className={`text-[10px] mt-0.5 ${s.subColor}`}>{s.sub}</p>}
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Monthly Earnings (₦)</p>
        <div className="flex items-end gap-4 h-40">
          {EARNINGS.map((e, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full bg-[#1a4d35] rounded-t" style={{ height: e.h }} />
              <span className="text-[10px] text-muted-foreground">{e.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest px-5 py-3 border-b border-stone-100">Payout History</p>
        {PAYOUTS.map((p, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-stone-50 last:border-b-0">
            <div>
              <p className="text-sm font-semibold text-foreground">{p.date}</p>
              <p className="text-xs text-muted-foreground">{p.method}</p>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm font-bold text-foreground">{p.amount}</p>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">Paid</span>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-5">
        <p className="font-semibold text-foreground text-sm mb-1">How your commission works</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          You earn <strong className="text-foreground">10% recurring commission</strong> for every student who subscribes via your referral link.
          Commission accrues each month the student remains active and pauses if they lapse — resuming automatically when they resubscribe.
          Payouts are processed on the last business day of each month.
        </p>
      </div>
    </div>
  );
}

// ── Lecturer Verification ─────────────────────────────────────────────────────

type Decision = 'Confirmed' | 'Flagged' | null;

const PENDING_LECTURERS = [
  { initials: 'DO', name: 'Dr. Olumide Babatunde', dept: 'Department of Public Law',   rank: 'Senior Lecturer, 8 years', phone: '+234 802 341 7890', email: 'o.babatunde@unilag.edu.ng' },
  { initials: 'MN', name: 'Mrs. Ngozi Okeke',       dept: 'Department of Private Law',  rank: 'Lecturer II, 3 years',     phone: '+234 706 198 5523', email: 'n.okeke@unilag.edu.ng'    },
];

const REVIEWED_LECTURERS = [
  { name: 'Mr. Chukwuemeka Ozo',  dept: 'Dept. of Commercial Law',    decision: 'Confirmed', adminOutcome: 'Approved' },
  { name: 'Dr. Aisha Mohammed',   dept: 'Dept. of International Law', decision: 'Flagged',   adminOutcome: 'Rejected' },
];

function LecturerVerification() {
  const [tab, setTab] = useState<'Pending' | 'Reviewed'>('Pending');
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Tab toggle */}
      <div className="flex gap-1 bg-white border border-stone-200 rounded-xl p-1 w-fit">
        {(['Pending', 'Reviewed'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-[#1a4d35] text-white' : 'text-muted-foreground hover:text-foreground'}`}>
            {t}
            {t === 'Pending' && <span className="h-4 w-4 rounded-full bg-white/20 text-white text-[9px] font-bold flex items-center justify-center">{tab === 'Pending' ? '' : '2'}</span>}
            {t === 'Pending' && tab === 'Pending' && <span className="h-4 w-4 rounded-full bg-white/30 text-white text-[9px] font-bold flex items-center justify-center">2</span>}
          </button>
        ))}
      </div>

      {tab === 'Pending' && (
        <div className="space-y-3">
          {PENDING_LECTURERS.map((l, i) => {
            const dec = decisions[l.name];
            return (
              <div key={i} className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-10 w-10 rounded-full bg-[#1a4d35] text-white font-bold text-sm flex items-center justify-center shrink-0">{l.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">{l.name}</p>
                      <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Eye className="h-3 w-3" /> View Details
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">{l.dept}</p>
                    <p className="text-xs text-muted-foreground">{l.rank}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {l.phone}</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {l.email}</span>
                    </div>
                  </div>
                </div>
                {dec ? (
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${dec === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                      {dec === 'Confirmed' ? '✓ Confirmed as Genuine Staff Member' : '⚑ Concern Flagged'}
                    </span>
                    <button onClick={() => setDecisions(d => ({ ...d, [l.name]: null }))}
                      className="text-xs text-muted-foreground hover:text-foreground underline">Undo</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setDecisions(d => ({ ...d, [l.name]: 'Confirmed' }))}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#14392a] transition-colors">
                      <ShieldCheck className="h-3.5 w-3.5" /> Confirm — Genuine Staff Member
                    </button>
                    <button onClick={() => setDecisions(d => ({ ...d, [l.name]: 'Flagged' }))}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                      <Flag className="h-3.5 w-3.5" /> Flag Concern
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {tab === 'Reviewed' && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm divide-y divide-stone-100 overflow-hidden">
          {REVIEWED_LECTURERS.map((l, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-semibold text-foreground text-sm">{l.name}</p>
                <p className="text-xs text-muted-foreground">{l.dept}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Your decision</p>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${l.decision === 'Confirmed' ? 'bg-sky-100 text-sky-700' : 'bg-red-100 text-red-600'}`}>{l.decision}</span>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Admin outcome</p>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${l.adminOutcome === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{l.adminOutcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Inbox ─────────────────────────────────────────────────────────────────────

const INITIAL_MESSAGES = [
  {
    from: 'agent' as const,
    sender: 'Olu Martins',
    subtitle: 'Super Agent · Tolumo HQ',
    broadcast: true,
    text: "Good morning Chiamaka! Quick update — we're running a referral push campaign this month. I'll be sharing updated flyers shortly. Please ensure all your active students have the latest course module info.",
    time: '9:14 AM',
  },
  {
    from: 'me' as const,
    text: "Thanks Olu! Noted. I've already shared the update with my network. Also, two of my students are asking about the new Criminal Law module — when does it go live?",
    time: '9:32 AM',
  },
  {
    from: 'agent' as const,
    sender: 'Olu Martins',
    broadcast: false,
    text: "Criminal Law Topic 4 goes live Monday 14 July. I'll confirm once the Content team signs off. In the meantime, please review the two pending lecturer verifications from your institution — they've been in queue for 4 days.",
    time: '9:45 AM',
  },
  {
    from: 'me' as const,
    text: "On it — I'll review them today and submit my decision before end of day.",
    time: '10:02 AM',
  },
];

function Inbox() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages(m => [...m, { from: 'me', text, time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) }]);
    setInput('');
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 96px)' }}>
      {/* Agent header */}
      <div className="bg-white rounded-t-xl border border-stone-200 shadow-sm px-5 py-4 flex items-center gap-3 shrink-0">
        <div className="h-9 w-9 rounded-full bg-[#1a4d35] text-white font-bold text-sm flex items-center justify-center shrink-0">OM</div>
        <div>
          <p className="font-semibold text-foreground text-sm">Olu Martins</p>
          <p className="text-xs text-muted-foreground">Super Agent · Tolumo HQ</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-[#F5F2EB] border-x border-stone-200 px-5 py-4 space-y-4">
        {messages.map((m, i) => (
          m.from === 'agent' ? (
            <div key={i} className="max-w-[75%]">
              {m.broadcast && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-muted-foreground">Olu Martins (Super Agent)</span>
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-700 text-[9px] font-bold uppercase tracking-widest">Broadcast</span>
                </div>
              )}
              {!m.broadcast && <p className="text-[10px] text-muted-foreground mb-1">{m.sender} (Super Agent)</p>}
              <div className="bg-white rounded-2xl rounded-tl-sm border border-stone-200 px-4 py-3 text-sm text-foreground leading-relaxed shadow-sm">
                {m.text}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">{m.time}</p>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="max-w-[75%]">
                <div className="bg-[#1a4d35] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed shadow-sm">
                  {m.text}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 text-right">{m.time}</p>
              </div>
            </div>
          )
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white rounded-b-xl border border-stone-200 shadow-sm px-4 py-3 flex items-center gap-3 shrink-0">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Type a message to your Super Agent..."
          className="flex-1 h-10 px-3 rounded-xl bg-stone-50 border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
        <button onClick={send}
          className="h-9 w-9 rounded-xl bg-[#1a4d35] text-white flex items-center justify-center hover:bg-[#14392a] transition-colors shrink-0">
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// ── Router ────────────────────────────────────────────────────────────────────

export default function AgentPortal() {
  return (
    <AgentShell>
      <Switch>
        <Route path="/agent"              component={AgentHome}             />
        <Route path="/agent/students"     component={MyStudents}            />
        <Route path="/agent/referral"     component={ReferralTools}         />
        <Route path="/agent/commission"   component={Commission}            />
        <Route path="/agent/verification" component={LecturerVerification}  />
        <Route path="/agent/inbox"        component={Inbox}                 />
        <Route component={AgentHome} />
      </Switch>
    </AgentShell>
  );
}
