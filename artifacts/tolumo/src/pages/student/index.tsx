import React, { useState, useRef, useEffect } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { useClerk, useUser } from '@clerk/react';
import {
  Home, BookOpen, PlayCircle, Calendar, Award, CreditCard, GraduationCap,
  HelpCircle, Settings, LogOut,
  Bell, Search, ChevronLeft, ChevronRight, X, Star, Lock,
  CheckCircle2, Clock, MessageCircle, Send, Users,
  Menu, ChevronRight as ArrowRight, Unlock, LibraryBig,
} from 'lucide-react';
import MyModules from './my-modules';
import TutorialSessions from './tutorial-sessions';
import StudentSettings from './settings';
import CurrentTopic from './current-topic';
import Scholarships from './scholarships';
import MyCertificate from './my-certificate';

// ── Notification bell panel ────────────────────────────────────────────────────
const BELL_NOTIFS = [
  { id: 1, title: 'Complete Topic 3 to unlock Topic 4', body: 'Fundamental Rights is waiting for you.', time: 'Now', unread: true },
  { id: 2, title: 'New topic unlocked in Constitutional Law', body: 'You can now access Topic 4.', time: '2h ago', unread: true },
  { id: 3, title: 'Tutorial confirmed — Mon 14 Jul at 10:00am', body: 'Prof. Adeyemi confirmed your session.', time: '1d ago', unread: true },
  { id: 4, title: 'You scored 88% on Criminal Law Topic 1!', body: 'Great work — keep it up.', time: '3d ago', unread: false },
];

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState(BELL_NOTIFS);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);
  return (
    <div ref={ref} className="absolute top-14 right-4 w-80 bg-white rounded-xl shadow-2xl border border-stone-200 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <span className="font-semibold text-sm text-foreground">Notifications</span>
        <div className="flex items-center gap-3">
          <button onClick={() => setNotifs(n => n.map(x => ({ ...x, unread: false })))} className="text-xs text-primary hover:underline">Mark all read</button>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
        {notifs.map(n => (
          <div key={n.id} className={`px-4 py-3 flex gap-3 ${n.unread ? 'bg-primary/5' : ''}`}>
            <span className={`h-2 w-2 rounded-full mt-2 shrink-0 ${n.unread ? 'bg-primary' : 'bg-transparent'}`} />
            <div>
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
              <p className="text-[10px] text-stone-400 mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI Chat Widget ─────────────────────────────────────────────────────────────
type ChatMsg = { role: 'ai' | 'user'; text: string; chips?: string[] };

function nowTime() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

const REPLIES: Record<string, { text: string; chips?: string[] }> = {
  default: { text: "Hi! I'm your Tolumo AI Study Coach. Ask me to explain a concept, quiz you on a topic, or help you prepare for your test.", chips: ['Quiz me on federalism', 'Explain mens rea', 'Help me revise Contract Law', 'Book a tutor'] },
  quiz: { text: "Let's go! In *Lakanmi v. A.G. Western State*, the Supreme Court held that:\n\nA) Military decrees override the Constitution\nB) The Constitution is supreme over military decrees ✓\nC) States have sovereign immunity\nD) Emergency powers are absolute", chips: ['A', 'B ✓', 'C', 'D'] },
  explain: { text: "Of course! Which concept from your modules would you like explained? I cover Constitutional Law, Law of Contract, Criminal Law, Law of Torts, Jurisprudence, and Land Law.", chips: ['Federalism', 'Offer & Acceptance', 'Mens Rea', 'Duty of Care'] },
  booking: { text: "Your next session is with Prof. Adeyemi on Mon 14 Jul at 10:00am covering Federalism & Devolution of Powers.", chips: ['View Tutorial Sessions'] },
};

function getReply(t: string) {
  const q = t.toLowerCase();
  if (q.match(/quiz|test|question|mcq/)) return REPLIES.quiz;
  if (q.match(/explain|what|tell|define/)) return REPLIES.explain;
  if (q.match(/book|session|tutor/)) return REPLIES.booking;
  return REPLIES.default;
}

function AIChatWidget() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([{ role: 'ai', text: "Hi there! 👋 I'm your AI Study Coach. How can I help you study today?", chips: ['Quiz me', 'Explain a concept', 'My scores', 'Book a tutor'] }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50); }, [msgs, open, typing]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setInput('');
    setMsgs(p => [...p, { role: 'user', text }]);
    setTyping(true);
    setTimeout(() => { const { text: t, chips } = getReply(text); setMsgs(p => [...p, { role: 'ai', text: t, chips }]); setTyping(false); }, 1000);
  };

  const Logo = () => <img src={`${basePath}/logo.svg`} alt="" className="h-full w-full object-contain" />;

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 w-[340px] h-[500px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden z-50">
          <div className="flex items-center gap-3 px-4 py-3 bg-primary shrink-0">
            <div className="h-9 w-9 rounded-xl bg-white/15 p-1 overflow-hidden shrink-0"><Logo /></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">AI Study Coach</p>
              <p className="flex items-center gap-1.5 text-[11px] text-white/70 mt-0.5"><span className="h-2 w-2 rounded-full bg-green-400" />Online · Powered by Tolumo</p>
            </div>
            <button onClick={() => setOpen(false)} className="h-7 w-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/15"><X className="h-4 w-4" /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {msgs.map((m, i) => (
              <div key={i}>
                {m.role === 'user' ? (
                  <div className="flex items-end justify-end gap-2">
                    <div className="max-w-[78%] bg-primary text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm leading-relaxed whitespace-pre-line">{m.text}</div>
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shrink-0"><Users className="h-4 w-4 text-white" /></div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary p-1 overflow-hidden shrink-0 mt-0.5"><Logo /></div>
                    <div>
                      <div className="bg-stone-100 text-sm px-4 py-3 rounded-2xl rounded-tl-sm leading-relaxed whitespace-pre-line">{m.text}</div>
                      {m.chips && <div className="flex flex-wrap gap-2 mt-2">{m.chips.map(c => <button key={c} onClick={() => send(c)} className="px-3 py-1.5 rounded-full border border-stone-300 text-xs font-medium text-foreground bg-white hover:border-primary hover:text-primary transition-colors">{c}</button>)}</div>}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {typing && <div className="flex items-start gap-2"><div className="h-8 w-8 rounded-full bg-primary p-1 overflow-hidden shrink-0"><Logo /></div><div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3"><div className="flex gap-1">{[0,1,2].map(j => <span key={j} className="h-2 w-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: `${j*0.18}s` }} />)}</div></div></div>}
            <div ref={bottomRef} />
          </div>
          <div className="shrink-0 border-t border-stone-100 px-3 py-3 bg-white">
            <div className="flex items-center gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }} placeholder="Type a message..." className="flex-1 text-sm px-4 py-2.5 rounded-full border border-stone-200 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 bg-stone-50 placeholder:text-stone-400" />
              <button onClick={() => send(input)} disabled={!input.trim()} className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0 disabled:opacity-35 hover:bg-primary/90"><Send className="h-4 w-4 text-white" /></button>
            </div>
            <p className="text-[10px] text-stone-400 text-center mt-2">Powered by Tolumo AI</p>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(v => !v)} className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center z-50">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────────────
function NavItem({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}>
      <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-white/50'}`} />
      <span className="truncate">{label}</span>
    </Link>
  );
}

function StudentShell({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [location, setLocation] = useLocation();
  const [showNotifs, setShowNotifs] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

  const displayName = user?.fullName || 'Chisom Nwosu';
  const firstName = user?.firstName || 'Chisom';
  const initials = displayName.split(' ').map((s: string) => s[0]).join('').toUpperCase().slice(0, 2);
  const unread = BELL_NOTIFS.filter(n => n.unread).length;

  const topNav = [
    { href: '/student', label: 'Home', icon: Home },
    { href: '/student/modules', label: 'Module Library', icon: LibraryBig },
    { href: '/student/topic', label: 'Current Topic', icon: PlayCircle },
    { href: '/student/sessions', label: 'My Tutorial Sessions', icon: Calendar },
    { href: '/student/scholarships', label: 'Scholarships & Opportunities', icon: Award },
    { href: '/student/subscription', label: 'Subscription', icon: CreditCard },
    { href: '/student/certificate', label: 'My Certificate', icon: GraduationCap },
  ];

  const isActive = (href: string) => href === '/student' ? location === '/student' : location.startsWith(href);

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      {mobileOpen && <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-30 w-[200px] bg-[#1a4d35] flex flex-col h-full shrink-0 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="px-4 py-4 flex items-center gap-2.5">
          <img src={`${basePath}/logo.svg`} alt="Tolumo" className="h-8 w-8 shrink-0" />
          <div>
            <p className="font-serif font-bold text-lg text-white leading-none">Tolumo</p>
            <p className="text-[8px] font-bold text-white/35 uppercase tracking-[0.2em] mt-0.5">Learning Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-2.5 space-y-0.5 overflow-y-auto py-2">
          {topNav.map(item => <NavItem key={item.href} {...item} active={isActive(item.href)} />)}
        </nav>
        <div className="px-2.5 pt-2 pb-5 border-t border-white/10 space-y-0.5">
          {[{ href: '/student/settings', label: 'Help & Support', icon: HelpCircle }, { href: '/student/settings', label: 'Settings', icon: Settings }].map(item => (
            <NavItem key={item.label} {...item} active={false} />
          ))}
          <button onClick={() => signOut().then(() => setLocation('/sign-in'))} className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors">
            <LogOut className="h-4 w-4 shrink-0 text-white/50" />Sign out
          </button>
        </div>
      </aside>

      {/* Right panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 shrink-0 bg-white border-b border-stone-200 flex items-center gap-3 px-4 relative">
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
              <input placeholder="Search courses, topics…" className="w-full h-9 pl-9 pr-3 rounded-full bg-stone-100 border-0 text-sm placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors" />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors" onClick={() => setShowNotifs(v => !v)}>
              <Bell className="h-5 w-5 text-stone-500" />
              {unread > 0 && <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">{unread}</span>}
            </button>
            {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#1a4d35] text-white flex items-center justify-center text-xs font-bold shrink-0">{initials}</div>
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-[10px] text-muted-foreground">University of Lagos · Year 2 (200 Level)</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      <AIChatWidget />
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
const ENROLLED_MODULES = [
  { code: 'L201', title: 'Constitutional Law', tutor: 'Prof. Adeyemi', done: 8, total: 12, avgScore: 82, id: 1 },
  { code: 'L202', title: 'Law of Contract', tutor: 'Dr. Eze', done: 4, total: 10, avgScore: 70, id: 2 },
  { code: 'L203', title: 'Criminal Law I', tutor: 'Prof. Olawale', done: 6, total: 11, avgScore: 76, id: 3 },
  { code: 'L204', title: 'Law of Torts', tutor: 'Dr. Bello', done: 2, total: 9, avgScore: null, id: 4 },
  { code: 'L205', title: 'Jurisprudence', tutor: 'Prof. Nnamdi', done: 1, total: 8, avgScore: null, id: 5 },
  { code: 'L206', title: 'Land Law I', tutor: 'Dr. Adebayo', done: 0, total: 10, avgScore: null, id: 6 },
];

const DASH_NOTIFS = [
  { icon: Lock, color: 'bg-purple-100 text-purple-600', title: 'Complete Topic 3 to unlock Topic 4: Fundamental Rights', time: 'Now' },
  { icon: Unlock, color: 'bg-amber-100 text-amber-700', title: 'New topic unlocked in Constitutional Law', time: '2h ago' },
  { icon: Calendar, color: 'bg-teal-100 text-teal-600', title: 'Tutorial with Prof. Adeyemi — Mon 14 Jul at 10:00am', time: '1d ago' },
  { icon: Star, color: 'bg-yellow-100 text-yellow-600', title: 'You scored 88% on Criminal Law Topic 1 — great work!', time: '3d ago' },
];

function StudentDashboard() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const firstName = user?.firstName || 'Chisom';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const totalTopics = ENROLLED_MODULES.reduce((s, m) => s + m.total, 0);
  const doneTopics = ENROLLED_MODULES.reduce((s, m) => s + m.done, 0);
  const scores = ENROLLED_MODULES.filter(m => m.avgScore !== null).map(m => m.avgScore as number);
  const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Greeting row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">{greeting}, {firstName} 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">University of Lagos · Year 2 (200 Level)</p>
          <p className="text-sm text-foreground mt-1">You're on track — keep going. Your next test unlocks in 2 days.</p>
        </div>
        <button onClick={() => setLocation('/student/topic')} className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors shadow-sm">
          <Search className="h-4 w-4" /> Triax Law Library
        </button>
      </div>

      {/* Topic Progression Requirements info */}
      <div className="flex gap-3 bg-primary/5 border border-primary/15 rounded-xl px-5 py-4">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground mb-1">Topic Progression Requirements</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To advance to the next topic: <strong className="text-foreground">watch the video</strong> → <strong className="text-foreground">review notes</strong> → <strong className="text-foreground">complete the AI Q&A</strong> → <strong className="text-foreground">pass the test</strong> (3/5 MCQ minimum). If you fail, the topic resets and you rewatch from the start. Once a topic is passed, you can revisit it freely at any time.
          </p>
        </div>
      </div>

      {/* Continue where you left off */}
      <div className="bg-[#1a4d35] rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-56 h-56 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
        <p className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] mb-3">Continue where you left off</p>
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-serif font-bold text-white mb-1">Topic 3: Federalism & Devolution of Powers</h2>
            <p className="text-sm text-white/65 mb-4">Constitutional Law 201 · Prof. Adeyemi</p>
            <div className="h-1.5 bg-white/15 rounded-full overflow-hidden mb-1.5 w-full">
              <div className="h-full bg-accent rounded-full" style={{ width: '37%' }} />
            </div>
            <p className="text-[11px] text-white/50 mb-5">Step 2 of 4</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setLocation('/student/topic')} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors shadow-md">
                ▶ Start Topic
              </button>
              <button onClick={() => setLocation('/student/topic')} className="px-5 py-2.5 rounded-xl border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
                Watch Video
              </button>
            </div>
          </div>
          <div className="shrink-0 flex flex-col gap-2 text-right">
            {[
              { label: 'Video', done: true },
              { label: 'Notes', current: true },
              { label: 'Q&A', done: false },
              { label: 'Topic Quiz', done: false },
            ].map((s, i) => (
              <div key={i} className={`flex items-center gap-2 justify-end text-sm font-medium ${s.done ? 'text-green-400' : s.current ? 'text-accent' : 'text-white/35'}`}>
                {s.label}
                {s.done && <CheckCircle2 className="h-4 w-4" />}
                {s.current && <span className="font-bold">→</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4 stat boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Year 2 Modules', value: '6 / 6', icon: BookOpen },
          { label: 'Topics Completed', value: `${doneTopics} / ${totalTopics}`, icon: CheckCircle2 },
          { label: 'Average Quiz Score', value: `${avgScore}%`, icon: Star },
          { label: 'Next Booking', value: 'Mon 14 Jul', icon: Calendar },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className="text-xl font-bold font-serif text-foreground">{s.value}</p>
            </div>
            <div className="h-8 w-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
              <s.icon className="h-4 w-4 text-primary" />
            </div>
          </div>
        ))}
      </div>

      {/* Triax Law Library card */}
      <div className="bg-[#1a4d35] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <span className="text-xl">⚖️</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-bold text-white">Triax Law Library</p>
            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold uppercase tracking-wide">Active</span>
          </div>
          <p className="text-xs text-white/60">1,840 cases · 312 statutes · 95 journals · Referenced directly in your lessons.</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {['Search Library', 'Latest Judgements', 'Saved Cases'].map(btn => (
              <button key={btn} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/20 text-white text-xs font-medium hover:bg-white/10 transition-colors">
                <Search className="h-3 w-3" /> {btn}
              </button>
            ))}
          </div>
        </div>
        <div className="sm:ml-auto shrink-0 text-right">
          <span className="text-[9px] font-bold text-white/35 uppercase tracking-widest block mb-1">Demo Plan</span>
          <select className="text-xs bg-white/10 text-white border border-white/20 rounded-lg px-3 py-1.5 outline-none">
            <option>monthly</option>
            <option>annual</option>
          </select>
        </div>
      </div>

      {/* 2-col: Enrolled Modules + Notifications */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Enrolled Modules */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
            <h2 className="font-serif font-bold text-foreground">My Enrolled Modules</h2>
            <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" /> Complete all to earn certificate
            </div>
          </div>
          <div className="divide-y divide-stone-100">
            {ENROLLED_MODULES.map(m => {
              const pct = Math.round((m.done / m.total) * 100);
              return (
                <button key={m.code} onClick={() => setLocation(`/student/modules/${m.id}`)}
                  className="w-full px-5 py-3.5 flex items-center gap-3.5 hover:bg-stone-50 transition-colors text-left">
                  <div className="h-9 w-9 rounded-full bg-[#1a4d35] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                    {m.code}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div>
                        <p className="font-semibold text-sm text-foreground">{m.title}</p>
                        <p className="text-xs text-muted-foreground">{m.tutor}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {m.avgScore !== null && (
                          <p className="text-xs font-bold text-primary">Avg Score {m.avgScore}%</p>
                        )}
                        <p className="text-[11px] text-muted-foreground">{m.done}/{m.total} topics</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1a4d35] rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-stone-300 shrink-0" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <h2 className="font-serif font-bold text-foreground">Notifications</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {DASH_NOTIFS.map((n, i) => (
              <div key={i} className="px-4 py-3.5 flex gap-3">
                <div className={`h-8 w-8 rounded-full ${n.color} flex items-center justify-center shrink-0 mt-0.5`}>
                  <n.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground leading-relaxed">{n.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scholarships Hub */}
      <button onClick={() => setLocation('/student/scholarships')}
        className="w-full flex items-center gap-4 bg-white rounded-xl border border-stone-200 shadow-sm px-5 py-4 hover:border-primary/30 hover:bg-stone-50 transition-colors text-left">
        <div className="h-11 w-11 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Award className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="font-semibold text-foreground">Scholarships & Opportunities Hub</p>
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold">12 new</span>
          </div>
          <p className="text-xs text-muted-foreground">Curated scholarships, internships, fellowships, and jobs for Nigerian law students. Updated weekly.</p>
          <p className="text-[10px] text-amber-600 font-medium mt-1">Powered by Goldcoast Developmental Foundation</p>
        </div>
        <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
      </button>
    </div>
  );
}

// ── Subscription (simple page) ────────────────────────────────────────────────
function Subscription() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Subscription</h1>
        <p className="text-muted-foreground mt-0.5">Manage your Tolumo learning plan.</p>
      </div>
      <div className="border-2 border-primary rounded-2xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-block px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase mb-2">Active</span>
            <h2 className="font-serif font-bold text-xl text-foreground">Monthly Plan</h2>
            <p className="text-muted-foreground text-sm">Full Year 2 (200 Level) access</p>
          </div>
          <span className="text-2xl font-bold text-primary">₦3,500<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
        </div>
        <ul className="space-y-2 mb-5">
          {['All 6 Year 2 module video lectures', 'Downloadable notes & slides per topic', 'AI Q&A per topic (unlimited)', 'MCQ & essay quiz per topic', 'Tutorial session marketplace', 'Triax Law Library (demo access)', 'Certificate of completion'].map(f => (
            <li key={f} className="flex items-center gap-2 text-sm text-foreground"><CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" /> {f}</li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">Cancel Plan</button>
          <span className="text-xs text-muted-foreground">Renews 14 Aug 2025</span>
        </div>
      </div>
      <div className="bg-stone-900 text-white rounded-2xl p-6 flex items-start justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-full bg-accent/80 text-white text-[10px] font-bold uppercase mb-2">Save ₦7,000</span>
          <h3 className="font-semibold text-lg">Switch to Annual</h3>
          <p className="text-white/60 text-sm">₦35,000/year · equivalent to 2 months free</p>
        </div>
        <button className="shrink-0 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors">Upgrade Now</button>
      </div>
    </div>
  );
}

// ── Router ─────────────────────────────────────────────────────────────────────
export default function StudentPortal() {
  return (
    <StudentShell>
      <Switch>
        <Route path="/student" component={StudentDashboard} />
        <Route path="/student/modules/:id">{(params) => <MyModules moduleId={parseInt(params.id)} />}</Route>
        <Route path="/student/modules" component={MyModules} />
        <Route path="/student/topic" component={CurrentTopic} />
        <Route path="/student/sessions" component={TutorialSessions} />
        <Route path="/student/scholarships" component={Scholarships} />
        <Route path="/student/subscription" component={Subscription} />
        <Route path="/student/certificate" component={MyCertificate} />
        <Route path="/student/settings" component={StudentSettings} />
        <Route component={StudentDashboard} />
      </Switch>
    </StudentShell>
  );
}
