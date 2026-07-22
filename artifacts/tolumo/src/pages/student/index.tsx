import React, { useState, useRef, useEffect } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import { useClerk, useUser } from '@clerk/react';
import {
  LayoutDashboard, BookOpen, Calendar, HelpCircle, Settings, LogOut,
  Bell, Search, ChevronLeft, ChevronRight, X, Star, Clock,
  CheckCircle2, PlayCircle, TrendingUp, MessageCircle, Send, Bot,
  BarChart2, Brain, Menu, Minimize2, Users,
} from 'lucide-react';
import MyModules from './my-modules';
import TutorialSessions from './tutorial-sessions';
import AIStudyCoach from './ai-study-coach';
import StudentSettings from './settings';

// ── Notifications ─────────────────────────────────────────────────────────────
const NOTIFS = [
  { id: 1, title: 'Session Confirmed', body: 'Prof. Adeyemi confirmed your booking for Mon 14 Jul at 10:00am', time: '2h ago', unread: true },
  { id: 2, title: 'Quiz Results Ready', body: 'Your LAW 201 Topic 3 quiz results are now available', time: '5h ago', unread: true },
  { id: 3, title: 'New Module Available', body: 'LAW 202: Law of Contract is now fully uploaded', time: '1d ago', unread: true },
  { id: 4, title: 'Progress Milestone', body: "You've completed 25% of Constitutional Law. Keep going!", time: '2d ago', unread: false },
];

function NotificationPanel({ onClose }: { onClose: () => void }) {
  const [notifs, setNotifs] = useState(NOTIFS);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, unread: false })));

  return (
    <div ref={ref} className="absolute top-14 right-4 w-80 bg-white rounded-xl shadow-2xl border border-stone-200 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <span className="font-semibold text-sm text-foreground">Notifications</span>
        <div className="flex items-center gap-3">
          <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
        {notifs.map(n => (
          <div key={n.id} className={`px-4 py-3 flex gap-3 ${n.unread ? 'bg-primary/5' : ''}`}>
            <div className="mt-0.5 shrink-0">
              {n.unread && <span className="h-2 w-2 rounded-full bg-primary block mt-1" />}
              {!n.unread && <span className="h-2 w-2 rounded-full bg-transparent block mt-1" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
              <p className="text-[10px] text-stone-400 mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI Chat Widget ─────────────────────────────────────────────────────────────
type ChatMsg = { role: 'ai' | 'user'; text: string; time: string; chips?: string[] };

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const STUDENT_REPLIES: Record<string, { text: string; chips?: string[] }> = {
  default: {
    text: "I'm here to support your LL.B studies. I can help you understand case law, break down concepts, quiz you on a topic, or help you prepare for your exams. What would you like to work on?",
    chips: ['Quiz me on a topic', 'Explain a concept', 'Help me revise', 'Find a tutor'],
  },
  quiz: {
    text: "Great! Let's test your knowledge. In *Lakanmi v. A.G. Western State*, which constitutional principle was central to the Supreme Court's decision?\n\nA) Separation of Powers\nB) Federal Supremacy\nC) Fundamental Rights\nD) Rule of Law",
    chips: ['A) Separation of Powers', 'B) Federal Supremacy', 'C) Fundamental Rights', 'D) Rule of Law'],
  },
  explain: {
    text: "Of course! Which concept would you like me to explain? I cover all Year 2 (200 Level) modules including Constitutional Law, Law of Contract, Criminal Law, Law of Torts, Jurisprudence, and Land Law.",
    chips: ['Federal Supremacy', 'Offer & Acceptance', 'Mens Rea', 'Duty of Care'],
  },
  revise: {
    text: "Let's revise! You've completed 3 topics in Constitutional Law. Here are the key points from Topic 3 — Federalism & Devolution of Powers:\n\n• The Second Schedule divides powers between Federal and State\n• Section 4(5): Federal law prevails over inconsistent State law\n• Residual powers vest in States by exclusion",
    chips: ['Quiz me on this', 'Next topic', 'Book a tutor session'],
  },
  tutor: {
    text: "You can browse and book 1-on-1 tutorial sessions with verified lecturers in the Tutorial Sessions section. Sessions run from ₦1,800–₦2,500 per hour. Prof. Adeyemi has availability this week!",
    chips: ['Go to Tutorial Sessions', 'Check Prof. Adeyemi'],
  },
  booking: {
    text: "Your next session is with Prof. Adeyemi on Monday 14 Jul at 10:00am covering Federalism & Devolution of Powers. You should receive a video call link 30 minutes before the session.",
    chips: ['View all sessions', 'Contact support'],
  },
  score: {
    text: "Your latest quiz scores:\n• Topic 1 (Federalism Origins): 4/5 MCQ — 74% ✓\n• Topic 2 (Constitutional Supremacy): 5/5 MCQ — 88% ✓\n• Topic 3 (Devolution of Powers): 3/5 MCQ — 62% ✗\n\nTopic 3 needs a little more revision. Want me to quiz you on it?",
    chips: ['Quiz me on Topic 3', 'Explain where I went wrong'],
  },
};

function getStudentReply(input: string) {
  const q = input.toLowerCase();
  if (q.match(/quiz|test|question/)) return STUDENT_REPLIES.quiz;
  if (q.match(/explain|what is|tell me|define/)) return STUDENT_REPLIES.explain;
  if (q.match(/revis|summary|recap|notes/)) return STUDENT_REPLIES.revise;
  if (q.match(/tutor|book|session|lectur/)) return STUDENT_REPLIES.tutor;
  if (q.match(/booking|confirmed|schedule|appointment/)) return STUDENT_REPLIES.booking;
  if (q.match(/score|result|quiz|mark|grade/)) return STUDENT_REPLIES.score;
  return STUDENT_REPLIES.default;
}

function AIChatWidget() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      role: 'ai',
      text: "Hi there! 👋 I'm your Tolumo AI Study Coach. I can quiz you, explain concepts, help you revise, or guide you to the right tutor. What do you need today?",
      time: nowTime(),
      chips: ['Quiz me on a topic', 'Explain a concept', 'My quiz scores', 'Book a tutor'],
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, [msgs, open, typing]);

  const sendText = (text: string) => {
    if (!text.trim()) return;
    setInput('');
    setMsgs(prev => [...prev, { role: 'user', text, time: nowTime() }]);
    setTyping(true);
    setTimeout(() => {
      const { text: aiText, chips } = getStudentReply(text);
      setMsgs(prev => [...prev, { role: 'ai', text: aiText, time: nowTime(), chips }]);
      setTyping(false);
    }, 1000);
  };

  const TolumoMark = () => <img src={`${basePath}/logo.svg`} alt="" className="h-full w-full object-contain" />;

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-6 w-[340px] h-[520px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden z-50">
          <div className="flex items-center gap-3 px-4 py-3 bg-primary shrink-0">
            <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 overflow-hidden p-1">
              <TolumoMark />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight">AI Study Coach</p>
              <p className="flex items-center gap-1.5 text-[11px] text-white/70 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
                Online · Powered by Tolumo
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="h-7 w-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/15 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
            {msgs.map((m, i) => (
              <div key={i}>
                <p className="text-[10px] text-stone-400 text-center mb-2">{m.time}</p>
                {m.role === 'user' ? (
                  <div className="flex items-end justify-end gap-2">
                    <div className="max-w-[75%] bg-primary text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm leading-relaxed whitespace-pre-line">{m.text}</div>
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 overflow-hidden p-1 mt-0.5">
                      <TolumoMark />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-stone-100 text-foreground text-sm px-4 py-3 rounded-2xl rounded-tl-sm leading-relaxed whitespace-pre-line">{m.text}</div>
                      {m.chips && m.chips.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {m.chips.map(chip => (
                            <button key={chip} onClick={() => sendText(chip)}
                              className="px-3 py-1.5 rounded-full border border-stone-300 text-xs font-medium text-foreground bg-white hover:border-primary hover:text-primary transition-colors">
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {typing && (
              <div>
                <p className="text-[10px] text-stone-400 text-center mb-2">{nowTime()}</p>
                <div className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 overflow-hidden p-1">
                    <TolumoMark />
                  </div>
                  <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      {[0,1,2].map(j => <span key={j} className="h-2 w-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: `${j * 0.18}s` }} />)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="shrink-0 border-t border-stone-100 bg-white">
            <div className="flex items-center gap-2 px-3 py-3">
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(input); } }}
                placeholder="Type a message..."
                className="flex-1 text-sm px-4 py-2.5 rounded-full border border-stone-200 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 bg-stone-50 placeholder:text-stone-400" />
              <button onClick={() => sendText(input)} disabled={!input.trim()}
                className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0 disabled:opacity-35 hover:bg-primary/90 transition-colors">
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 text-center pb-2.5">Powered by Tolumo AI · Responses may be imperfect</p>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center z-50">
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}

// ── Shell ──────────────────────────────────────────────────────────────────────
function NavItem({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-white/15 text-white' : 'text-white/65 hover:bg-white/10 hover:text-white'}`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-white/50'}`} />
      {label}
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

  const displayName = user?.fullName || 'Chisom Anieke';
  const initials = displayName.split(' ').map((s: string) => s[0]).join('').toUpperCase().slice(0, 2);
  const unreadCount = NOTIFS.filter(n => n.unread).length;

  const topNav = [
    { href: '/student', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/student/modules', label: 'My Modules', icon: BookOpen },
    { href: '/student/sessions', label: 'Tutorial Sessions', icon: Calendar },
    { href: '/student/ai-coach', label: 'AI Study Coach', icon: Brain },
  ];
  const bottomNav = [
    { href: '/student/help', label: 'Help & Support', icon: HelpCircle },
    { href: '/student/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (href: string) =>
    href === '/student' ? location === '/student' : location.startsWith(href);

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed md:relative inset-y-0 left-0 z-30 w-60 bg-[#1a4d35] flex flex-col h-full shrink-0 transition-transform duration-200 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3">
          <img src={`${basePath}/logo.svg`} alt="Tolumo" className="h-8 w-8" />
          <span className="font-serif font-bold text-xl text-white tracking-tight">Tolumo</span>
        </div>
        <div className="px-5 pb-4">
          <span className="text-[10px] font-bold text-white/35 uppercase tracking-[0.2em]">Student Portal</span>
        </div>

        {/* Top nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {topNav.map(item => <NavItem key={item.href} {...item} active={isActive(item.href)} />)}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 pt-3 pb-5 border-t border-white/10 space-y-0.5">
          {bottomNav.map(item => <NavItem key={item.href} {...item} active={isActive(item.href)} />)}
          <button
            onClick={() => signOut().then(() => setLocation('/sign-in'))}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/65 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0 text-white/50" />
            Sign out
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
            <button onClick={() => history.back()} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-stone-100 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => history.forward()} className="h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:bg-stone-100 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
              <input placeholder="Search modules, topics..." className="w-full h-9 pl-9 pr-3 rounded-full bg-stone-100 border-0 text-sm text-foreground placeholder:text-stone-400 outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-colors" />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors" onClick={() => setShowNotifs(v => !v)}>
              <Bell className="h-5 w-5 text-stone-500" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifs && <NotificationPanel onClose={() => setShowNotifs(false)} />}

            {/* Avatar */}
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#1a4d35] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">Student</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </main>
      </div>

      {/* AI Chat Widget */}
      <AIChatWidget />
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
const ENROLLED_MODULES = [
  { id: 1, code: 'LAW 201', title: 'Constitutional Law', tutor: 'Prof. O. Adeyemi', topics: 12, done: 3, color: 'bg-amber-700' },
  { id: 2, code: 'LAW 202', title: 'Law of Contract', tutor: 'Dr. N. Eze', topics: 10, done: 0, color: 'bg-slate-700' },
];

const UPCOMING_SESSIONS = [
  { tutor: 'Prof. O. Adeyemi', topic: 'Federalism & Devolution of Powers', date: 'Mon 14 Jul · 10:00am', status: 'confirmed', initials: 'OA' },
];

const RECENT_QUIZZES = [
  { module: 'LAW 201', topic: 'Topic 1: Origins of Nigerian Federalism', mcq: '4/5', score: 74, passed: true },
  { module: 'LAW 201', topic: 'Topic 2: Supremacy of the Constitution', mcq: '5/5', score: 88, passed: true },
  { module: 'LAW 201', topic: 'Topic 3: Federalism & Devolution', mcq: '3/5', score: 62, passed: false },
];

function StudentDashboard() {
  const { user } = useUser();
  const displayName = user?.firstName || 'Chisom';
  const [, setLocation] = useLocation();

  const stats = [
    { label: 'Enrolled Modules', value: '2', icon: BookOpen, sub: 'Year 2 (200 Level)', color: 'text-primary' },
    { label: 'Topics Completed', value: '3', icon: CheckCircle2, sub: 'of 22 total', color: 'text-green-600' },
    { label: 'Avg. Quiz Score', value: '74.7%', icon: BarChart2, sub: '+2.1% this week', color: 'text-accent' },
    { label: 'Upcoming Sessions', value: '1', icon: Calendar, sub: 'Mon 14 Jul', color: 'text-primary' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
          Welcome back, {displayName} 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's your LL.B progress today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="h-9 w-9 rounded-lg bg-stone-50 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
            </div>
            <p className={`text-2xl font-bold font-serif ${s.color}`}>{s.value}</p>
            <p className="text-sm font-medium text-foreground mt-0.5">{s.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="font-serif font-bold text-foreground">Continue Learning</h2>
            <button onClick={() => setLocation('/student/modules')} className="text-xs font-semibold text-primary hover:underline">View all →</button>
          </div>
          <div className="divide-y divide-stone-100">
            {ENROLLED_MODULES.map(m => {
              const pct = Math.round((m.done / m.topics) * 100);
              return (
                <div key={m.id} className="px-6 py-5 flex items-center gap-4 hover:bg-stone-50 transition-colors">
                  <div className={`h-11 w-11 rounded-xl ${m.color} text-white flex items-center justify-center text-xs font-bold shrink-0`}>
                    {m.code.split(' ')[1]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground">{m.code}</p>
                    <p className="font-semibold text-foreground truncate">{m.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.done}/{m.topics} topics · {m.tutor}</p>
                    <div className="mt-2 h-1.5 bg-stone-100 rounded-full overflow-hidden w-full">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{pct}%</p>
                    <button
                      onClick={() => setLocation(`/student/modules/${m.id}`)}
                      className="mt-2 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
                    >
                      {m.done > 0 ? 'Continue' : 'Start'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Upcoming session */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
              <h2 className="font-serif font-bold text-foreground">Next Session</h2>
              <button onClick={() => setLocation('/student/sessions')} className="text-xs font-semibold text-primary hover:underline">View all →</button>
            </div>
            {UPCOMING_SESSIONS.map((s, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-9 w-9 rounded-full bg-[#1a4d35] text-white text-xs font-bold flex items-center justify-center shrink-0">{s.initials}</div>
                  <div>
                    <p className="font-semibold text-sm text-foreground">{s.tutor}</p>
                    <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide">{s.status}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{s.topic}</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-foreground">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {s.date}
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-2.5">
            <h2 className="font-serif font-bold text-foreground mb-3">Quick Actions</h2>
            {[
              { label: 'Start AI Revision', sub: 'Continue where you left off', icon: Brain, href: '/student/ai-coach', color: 'bg-primary/10 text-primary' },
              { label: 'Browse Modules', sub: 'Explore the full curriculum', icon: BookOpen, href: '/student/modules', color: 'bg-accent/10 text-accent' },
              { label: 'Book a Tutor', sub: 'Schedule a 1-on-1 session', icon: Calendar, href: '/student/sessions', color: 'bg-green-50 text-green-700' },
            ].map(a => (
              <button key={a.href} onClick={() => setLocation(a.href)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:border-primary/30 hover:bg-stone-50 transition-colors text-left">
                <div className={`h-9 w-9 rounded-lg ${a.color} flex items-center justify-center shrink-0`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Quiz Results */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-serif font-bold text-foreground">Recent Quiz Results</h2>
          <button onClick={() => setLocation('/student/ai-coach')} className="text-xs font-semibold text-primary hover:underline">Practice more →</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Topic</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Module</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">MCQ</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {RECENT_QUIZZES.map((q, i) => (
                <tr key={i} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{q.topic}</td>
                  <td className="px-4 py-4 text-muted-foreground font-mono text-xs">{q.module}</td>
                  <td className="px-4 py-4 text-center font-semibold">{q.mcq}</td>
                  <td className="px-4 py-4 text-center font-bold" style={{ color: q.score >= 70 ? '#16a34a' : '#dc2626' }}>{q.score}%</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${q.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {q.passed ? '✓ Pass' : '✗ Fail'}
                    </span>
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

// ── Router ─────────────────────────────────────────────────────────────────────
export default function StudentPortal() {
  return (
    <StudentShell>
      <Switch>
        <Route path="/student" component={StudentDashboard} />
        <Route path="/student/modules/:id">{(params) => <MyModules moduleId={parseInt(params.id)} />}</Route>
        <Route path="/student/modules" component={MyModules} />
        <Route path="/student/sessions" component={TutorialSessions} />
        <Route path="/student/ai-coach" component={AIStudyCoach} />
        <Route path="/student/settings" component={StudentSettings} />
        <Route path="/student/help" component={StudentSettings} />
        <Route component={StudentDashboard} />
      </Switch>
    </StudentShell>
  );
}
