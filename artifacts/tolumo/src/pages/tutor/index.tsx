import React, { useState, useRef, useEffect } from 'react';
import { Route, Switch, useLocation, Link } from 'wouter';
import MyContent from './my-content';
import TutorialSchedule from './tutorial-schedule';
import StudentAnalytics from './student-analytics';
import SettingsPage, { HelpSupportPage } from './settings';
import { useClerk, useUser } from '@clerk/react';
import {
  LayoutDashboard, BookOpen, Calendar, BarChart2,
  HelpCircle, Settings, LogOut, Bell, Search,
  ChevronLeft, ChevronRight, Menu, X,
  Edit, Trash2, Plus, Clock, Users, TrendingUp,
  CheckCircle2, Star, Award, Users2,
  MessageCircle, Send, Bot, Minimize2
} from 'lucide-react';
import {
  useGetTutorSummary,
  useListModules,
  useListBookings,
  useUpdateBooking,
  useCreateModule,
  useDeleteModule,
  useCreateLesson,
  useDeleteLesson,
  useGetModule,
  useGetMe,
  getListBookingsQueryKey,
  getGetTutorSummaryQueryKey,
  getListModulesQueryKey,
  getGetModuleQueryKey,
} from '@workspace/api-client-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

// ── Notification data ─────────────────────────────────────────────────────────
type Notif = {
  id: number;
  icon: React.FC<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  body: string;
  time: string;
  cta: string;
  ctaHref: string;
  unread: boolean;
};

const INITIAL_NOTIFS: Notif[] = [
  {
    id: 1,
    icon: Users2,
    iconBg: 'bg-stone-100',
    iconColor: 'text-stone-500',
    title: '3 new tutorial bookings',
    body: 'Chisom, Emeka, and Fatima have booked your Federalism session on 17 Jul.',
    time: '1h ago',
    cta: 'View schedule',
    ctaHref: '/tutor/schedule',
    unread: true,
  },
  {
    id: 2,
    icon: Star,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-400',
    title: 'New student rating',
    body: "You received a 5-star rating from a student on 'Supremacy of the Constitution'.",
    time: '4h ago',
    cta: 'View analytics',
    ctaHref: '/tutor/analytics',
    unread: true,
  },
  {
    id: 3,
    icon: Bell,
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-500',
    title: 'Topic 4 notes still pending',
    body: 'Topic 4: Separation of Powers is missing notes. Upload to unlock for students.',
    time: '1d ago',
    cta: 'Go to content',
    ctaHref: '/tutor/content',
    unread: true,
  },
  {
    id: 4,
    icon: Award,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-500',
    title: 'High-rating credits earned',
    body: 'Your 4.8★ average earned you 60 bonus credits this month. Redeem anytime.',
    time: '2d ago',
    cta: 'View earnings',
    ctaHref: '/tutor/analytics',
    unread: false,
  },
];

// ── Notification popup ────────────────────────────────────────────────────────
function NotificationPanel({
  notifs,
  onMarkAll,
  onClose,
}: {
  notifs: Notif[];
  onMarkAll: () => void;
  onClose: () => void;
}) {
  const unreadCount = notifs.filter(n => n.unread).length;
  const [, setLocation] = useLocation();

  const navigate = (href: string) => {
    setLocation(href);
    onClose();
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-[360px] bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-stone-100">
        <div className="flex items-center gap-2.5">
          <span className="font-serif font-bold text-base text-foreground">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={onMarkAll}
          className="text-xs font-semibold text-primary hover:underline"
        >
          Mark all read
        </button>
      </div>

      {/* Items */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100">
        {notifs.map(n => {
          const Icon = n.icon;
          return (
            <div key={n.id} className="relative px-5 py-4 hover:bg-stone-50 transition-colors">
              {/* Unread dot */}
              {n.unread && (
                <span className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-green-500" />
              )}
              <div className="flex gap-3">
                {/* Icon */}
                <div className={`h-9 w-9 rounded-full ${n.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className={`h-4 w-4 ${n.iconColor}`} />
                </div>
                {/* Content */}
                <div className="flex-1 min-w-0 pr-4">
                  <p className="text-sm font-semibold text-foreground leading-snug">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.body}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{n.time}</span>
                    <button
                      onClick={() => navigate(n.ctaHref)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      {n.cta} →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-stone-100 bg-stone-50">
        <p className="text-xs text-muted-foreground text-center">
          Notifications are cleared after 7 days.
        </p>
      </div>
    </div>
  );
}

// ── Sidebar nav config ────────────────────────────────────────────────────────
const NAV = [
  { href: '/tutor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/tutor/content', label: 'My Content', icon: BookOpen },
  { href: '/tutor/schedule', label: 'Tutorial Schedule', icon: Calendar },
  { href: '/tutor/analytics', label: 'Student Analytics', icon: BarChart2 },
];

const NAV_BOTTOM = [
  { href: '/tutor/help', label: 'Help & Support', icon: HelpCircle },
  { href: '/tutor/settings', label: 'Settings', icon: Settings },
];

// ── Shared Portal Shell ───────────────────────────────────────────────────────
function TutorShell({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(INITIAL_NOTIFS);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [notifOpen]);

  const unreadCount = notifs.filter(n => n.unread).length;
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, unread: false })));

  const displayName = user?.fullName ||
    (user?.unsafeMetadata as any)?.firstName ||
    'Adeyemi Oluwaseun';

  const initials = (
    [user?.firstName, user?.lastName].filter(Boolean).map(s => s![0]).join('').toUpperCase() ||
    displayName.split(' ').map((s: string) => s[0]).join('').toUpperCase().slice(0, 2)
  );

  const isActive = (href: string) =>
    href === '/tutor' ? location === '/tutor' : location.startsWith(href);

  return (
    <div className="min-h-[100dvh] flex bg-[#F5F2EB]">
      {/* ── Sidebar ── */}
      <aside className={`
        ${mobileOpen ? 'flex' : 'hidden'} md:flex flex-col
        w-64 bg-primary text-white shrink-0
        fixed md:sticky top-0 h-[100dvh] z-20
      `}>
        {/* Logo */}
        <div className="px-6 pt-6 pb-4 flex items-center gap-3">
          <img src={`${basePath}/logo.svg`} alt="" className="h-8 w-8" />
          <span className="font-serif font-bold text-xl text-white tracking-tight">Tolumo</span>
        </div>

        <div className="px-6 pb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
            Tutor Portal
          </p>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-white/15 text-white'
                  : 'text-white/65 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        {/* Bottom nav */}
        <div className="px-3 pb-6 space-y-0.5 border-t border-white/10 pt-4">
          {NAV_BOTTOM.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {label}
            </Link>
          ))}
          <button
            onClick={() => signOut().then(() => setLocation('/sign-in'))}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-white/65 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="h-[18px] w-[18px] shrink-0" />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center gap-4 px-6 bg-white border-b border-stone-200 sticky top-0 z-10">
          {/* Mobile menu toggle */}
          <button className="md:hidden" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Back / Forward */}
          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => history.back()} className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-stone-100 transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => history.forward()} className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-stone-100 transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-sm hidden md:flex items-center gap-2 bg-stone-100 rounded-full px-4 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
              placeholder="Search courses, topics…"
            />
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notification bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="relative h-9 w-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-stone-100 transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <NotificationPanel
                  notifs={notifs}
                  onMarkAll={markAllRead}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-[#1a4d35] text-white flex items-center justify-center text-sm font-bold">
                {initials}
              </div>
              <div className="hidden md:block leading-none">
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">Tutor</p>
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

// ── AI Chat Widget ────────────────────────────────────────────────────────────
type ChatMsg = {
  role: 'ai' | 'user';
  text: string;
  time: string;
  chips?: string[];
  helpful?: null | 'up' | 'down';
};

function nowTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const AI_REPLIES: { text: string; chips?: string[] }[] = [
  {
    text: "Thanks for your message, Prof. Adeyemi. I want to make sure I give you the right help. Could you tell me a bit more about what you're looking for? I can help with learning support, platform navigation, or connecting you with our support team.",
    chips: ['Help with studying', 'Navigate the platform', 'Subscription help', 'Talk to support'],
  },
  {
    text: 'You have 3 upcoming bookings this week. The next session is Monday 14 Jul at 10:00am with Chisom Nwosu on Federalism & Devolution.',
    chips: ['View schedule', 'Reschedule a session'],
  },
  {
    text: 'Your estimated earnings this month are ₦255,600 (gross). After the 15% platform fee, your net payout is approximately ₦217,260.',
    chips: ['View payout details', 'Change payout schedule'],
  },
  {
    text: 'Topic 4: Separation of Powers notes are still pending upload. Uploading them will unlock that module for all enrolled students.',
    chips: ['Go to My Content', 'Upload now'],
  },
  {
    text: "Your current average rating is 4.8 ★ — excellent! Students most frequently highlight your clarity and responsiveness.",
    chips: ['View all feedback', 'View analytics'],
  },
  {
    text: 'You can reach Tolumo support via the Help & Support section in Settings, or email support@tolumo.com. Our team responds within 24 hours.',
    chips: ['Open Help & Support', 'Submit a ticket'],
  },
];

let replyIdx = 0;
function getAIReply(input: string): { text: string; chips?: string[] } {
  const q = input.toLowerCase();
  if (q.match(/booking|session|schedule|appointment/)) return AI_REPLIES[1];
  if (q.match(/earn|payout|money|revenue|income|payment/)) return AI_REPLIES[2];
  if (q.match(/content|upload|notes|video|slide/)) return AI_REPLIES[3];
  if (q.match(/rating|review|feedback|star/)) return AI_REPLIES[4];
  if (q.match(/help|support|contact|issue|problem/)) return AI_REPLIES[5];
  // For chips / anything else, cycle through contextual replies
  const r = AI_REPLIES[replyIdx % AI_REPLIES.length];
  replyIdx++;
  return r;
}

function AIChatWidget() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      role: 'ai',
      text: "Hi Prof. Adeyemi 👋 I'm your Tolumo AI assistant. Ask me anything about your students, content, earnings, or the platform.",
      time: nowTime(),
      chips: ['View my schedule', 'Check my earnings', 'Pending content', 'Student feedback'],
      helpful: null,
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
    const userMsg: ChatMsg = { role: 'user', text, time: nowTime() };
    setMsgs(prev => [...prev, userMsg]);
    setTyping(true);
    setTimeout(() => {
      const { text: aiText, chips } = getAIReply(text);
      setMsgs(prev => [
        ...prev,
        { role: 'ai', text: aiText, time: nowTime(), chips, helpful: null },
      ]);
      setTyping(false);
    }, 1000);
  };

  const setHelpful = (idx: number, val: 'up' | 'down') =>
    setMsgs(prev => prev.map((m, i) => (i === idx ? { ...m, helpful: val } : m)));

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(input); }
  };

  // Logo icon component (matches the reference's building mark)
  const TolumoMark = () => (
    <img src={`${basePath}/logo.svg`} alt="" className="h-full w-full object-contain" />
  );

  return (
    <>
      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-6 w-[340px] h-[520px] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden z-50">

          {/* ── Header ── */}
          <div className="flex items-center gap-3 px-4 py-3 bg-primary shrink-0">
            {/* Logo mark */}
            <div className="h-9 w-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 overflow-hidden p-1">
              <TolumoMark />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white leading-tight">Tolumo AI</p>
              <p className="flex items-center gap-1.5 text-[11px] text-white/70 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
                Online · Tolumo Assistant
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="h-7 w-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/15 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-white">
            {msgs.map((m, i) => (
              <div key={i}>
                {/* Timestamp */}
                <p className="text-[10px] text-stone-400 text-center mb-2">{m.time}</p>

                {m.role === 'user' ? (
                  /* User bubble */
                  <div className="flex items-end justify-end gap-2">
                    <div className="max-w-[75%] bg-primary text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-sm leading-relaxed">
                      {m.text}
                    </div>
                    {/* Gold avatar */}
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-white" />
                    </div>
                  </div>
                ) : (
                  /* AI bubble */
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 overflow-hidden p-1 mt-0.5">
                      <TolumoMark />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="bg-stone-100 text-foreground text-sm px-4 py-3 rounded-2xl rounded-tl-sm leading-relaxed">
                        {m.text}
                      </div>
                      {/* Quick-reply chips */}
                      {m.chips && m.chips.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {m.chips.map(chip => (
                            <button
                              key={chip}
                              onClick={() => sendText(chip)}
                              className="px-3 py-1.5 rounded-full border border-stone-300 text-xs font-medium text-foreground bg-white hover:border-primary hover:text-primary transition-colors"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                      {/* Helpful? */}
                      {m.helpful !== undefined && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] text-stone-400">Was this helpful?</span>
                          <button
                            onClick={() => setHelpful(i, 'up')}
                            className={`p-1 rounded transition-colors ${m.helpful === 'up' ? 'text-green-600' : 'text-stone-400 hover:text-green-600'}`}
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z"/><path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/></svg>
                          </button>
                          <button
                            onClick={() => setHelpful(i, 'down')}
                            className={`p-1 rounded transition-colors ${m.helpful === 'down' ? 'text-red-500' : 'text-stone-400 hover:text-red-500'}`}
                          >
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}><path d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z"/><path d="M17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17"/></svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div>
                <p className="text-[10px] text-stone-400 text-center mb-2">{nowTime()}</p>
                <div className="flex items-start gap-2">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0 overflow-hidden p-1">
                    <TolumoMark />
                  </div>
                  <div className="bg-stone-100 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1 items-center">
                      {[0, 1, 2].map(j => (
                        <span key={j} className="h-2 w-2 rounded-full bg-stone-400 animate-bounce" style={{ animationDelay: `${j * 0.18}s` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* ── Input ── */}
          <div className="shrink-0 border-t border-stone-100 bg-white">
            <div className="flex items-center gap-2 px-3 py-3">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message..."
                className="flex-1 text-sm px-4 py-2.5 rounded-full border border-stone-200 outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 bg-stone-50 placeholder:text-stone-400"
              />
              <button
                onClick={() => sendText(input)}
                disabled={!input.trim()}
                className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shrink-0 disabled:opacity-35 hover:bg-primary/90 transition-colors"
              >
                <Send className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-[10px] text-stone-400 text-center pb-2.5">
              Powered by Tolumo AI · Responses may be imperfect
            </p>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-xl hover:bg-primary/90 transition-all flex items-center justify-center z-50"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
const TOPICS = [
  { label: 'Topic 1: Origins of Nigerian Federalism', pct: 95 },
  { label: 'Topic 2: Supremacy of the Constitution', pct: 88 },
  { label: 'Topic 3: Federalism & Devolution of Powers', pct: 71 },
  { label: 'Topic 4: Separation of Powers', pct: 54 },
  { label: 'Topic 5: Fundamental Rights', pct: 38 },
];

const STRUGGLES = [
  { topic: 'Concurrent List conflict resolution (s. 4(5))', asks: 284 },
  { topic: 'Residual powers vs. Exclusive List distinction', asks: 211 },
  { topic: 'Federal supremacy doctrine', asks: 178 },
  { topic: "Interpretation of 'covering the held'", asks: 134 },
  { topic: 's. 4(4) limitation on state legislatures', asks: 99 },
];

const SESSIONS = [
  { name: 'Chisom Nwosu', topic: 'Federalism & Devolution', date: 'Mon 14 Jul · 10:00am', status: 'confirmed', initials: 'CN' },
  { name: 'Babatunde Okafor', topic: 'Constitutional Law Revision', date: 'Tue 15 Jul · 2:00pm', status: 'pending', initials: 'BO' },
  { name: 'Amina Ibrahim', topic: 'Human Rights Law', date: 'Wed 16 Jul · 11:00am', status: 'confirmed', initials: 'AI' },
];

function barColor(pct: number) {
  if (pct >= 80) return 'bg-primary';
  if (pct >= 55) return 'bg-accent';
  return 'bg-red-400';
}

function TutorDashboard() {
  const { user } = useUser();
  const displayName = user?.fullName || 'Prof. Adeyemi';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
          Welcome, {displayName}
        </h1>
        <p className="text-muted-foreground mt-1">Here's how your modules are performing this month.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Students', value: '3,840', delta: '+12% this month', icon: Users, iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
          { label: 'Avg. Quiz Score', value: '74.2%', delta: '+3.1% this month', icon: TrendingUp, iconBg: 'bg-amber-50', iconColor: 'text-amber-500' },
          { label: 'Completion Rate', value: '61%', delta: '+5% this month', icon: CheckCircle2, iconBg: 'bg-green-50', iconColor: 'text-green-600' },
          { label: 'Bookings This Month', value: '38', delta: '+8 this month', icon: Calendar, iconBg: 'bg-purple-50', iconColor: 'text-purple-500' },
        ].map(({ label, value, delta, icon: Icon, iconBg, iconColor }) => (
          <div key={label} className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium leading-tight">{label}</p>
              <div className={`h-8 w-8 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
            </div>
            <p className="text-2xl font-bold font-serif text-foreground">{value}</p>
            <p className="text-xs text-green-600 font-medium mt-1">{delta}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Topics by Completion */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <h2 className="font-serif font-bold text-lg text-foreground mb-5">Topics by Student Completion</h2>
          <div className="space-y-4">
            {TOPICS.map(({ label, pct }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-muted-foreground text-xs">{label}</span>
                  <span className="font-semibold text-foreground text-xs">{pct}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${barColor(pct)}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Struggle Points */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <h2 className="font-serif font-bold text-lg text-foreground mb-1">Student Struggle Points</h2>
          <p className="text-xs text-muted-foreground mb-5">Concepts students most frequently asked about in AI Q&A sessions this week:</p>
          <div className="space-y-3">
            {STRUGGLES.map(({ topic, asks }) => (
              <div key={topic} className="flex items-center justify-between gap-4">
                <p className="text-sm text-foreground leading-snug">{topic}</p>
                <span className="text-xs font-semibold text-primary shrink-0">{asks} asks</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-serif font-bold text-lg text-foreground">Upcoming Tutorial Sessions</h2>
          <Link href="/tutor/schedule" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
            View all <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="divide-y divide-stone-100">
          {SESSIONS.map(({ name, topic, date, status, initials }) => (
            <div key={name} className="flex items-center gap-4 px-6 py-4">
              <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{name}</p>
                <p className="text-xs text-muted-foreground">{topic}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">{date}</p>
                <span className={`text-xs font-semibold mt-0.5 inline-block ${
                  status === 'confirmed' ? 'text-green-600' : 'text-amber-600'
                }`}>
                  {status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ── Lesson manager ────────────────────────────────────────────────────────────
function LessonManager({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const { data: module, isLoading } = useGetModule(id, { query: { enabled: !!id, queryKey: getGetModuleQueryKey(id) } });
  const createLesson = useCreateLesson();
  const deleteLesson = useDeleteLesson();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  if (isLoading || !module) return <div className="p-8 text-muted-foreground">Loading…</div>;

  const handleAddLesson = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    createLesson.mutate({
      id,
      data: {
        title: fd.get('title') as string,
        description: fd.get('description') as string,
        durationMinutes: parseInt(fd.get('durationMinutes') as string),
        videoUrl: fd.get('videoUrl') as string,
        position: ((module as any).lessons?.length || 0) + 1,
      }
    }, {
      onSuccess: () => {
        toast({ title: 'Lesson added' });
        queryClient.invalidateQueries({ queryKey: getGetModuleQueryKey(id) });
        (e.target as HTMLFormElement).reset();
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => setLocation('/tutor/content')}>← Back</Button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">{(module as any).code}: {(module as any).title}</h1>
          <p className="text-muted-foreground text-sm">Manage lessons and content</p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <h2 className="text-lg font-serif font-bold mb-4 flex items-center gap-2"><Plus className="h-5 w-5 text-accent" /> Add Lesson</h2>
        <form onSubmit={handleAddLesson} className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Title</label>
            <input name="title" required className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Duration (minutes)</label>
            <input type="number" name="durationMinutes" required className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Video URL (optional)</label>
            <input name="videoUrl" type="url" className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Notes</label>
            <textarea name="description" rows={2} className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="sm:col-span-2"><Button type="submit" disabled={createLesson.isPending}>Add Lesson</Button></div>
        </form>
      </div>
      <div className="space-y-3">
        <h2 className="text-xl font-serif font-bold text-foreground">Lessons</h2>
        {!(module as any).lessons?.length ? (
          <div className="text-center p-8 text-muted-foreground bg-white border border-stone-200 rounded-xl">No lessons yet.</div>
        ) : (
          <div className="bg-white border border-stone-200 rounded-xl shadow-sm divide-y divide-stone-100">
            {(module as any).lessons.sort((a: any, b: any) => a.position - b.position).map((lesson: any, i: number) => (
              <div key={lesson.id} className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded-full bg-stone-100 text-muted-foreground flex items-center justify-center font-bold text-sm">{i + 1}</div>
                  <div>
                    <p className="font-semibold text-sm">{lesson.title}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {lesson.durationMinutes} min</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10"
                  onClick={() => confirm('Delete lesson?') && deleteLesson.mutate({ id: lesson.id }, {
                    onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetModuleQueryKey(id) })
                  })}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Placeholder pages ─────────────────────────────────────────────────────────
const Placeholder = ({ title }: { title: string }) => (
  <div className="max-w-6xl mx-auto">
    <h1 className="text-3xl font-serif font-bold text-foreground mb-2">{title}</h1>
    <p className="text-muted-foreground">This section is coming soon.</p>
  </div>
);

// ── Root export ───────────────────────────────────────────────────────────────
export default function TutorPortal() {
  return (
    <TutorShell>
      <Switch>
        <Route path="/tutor" component={TutorDashboard} />
        <Route path="/tutor/content" component={MyContent} />
        <Route path="/tutor/content/:id" component={LessonManager} />
        <Route path="/tutor/schedule" component={TutorialSchedule} />
        <Route path="/tutor/analytics" component={StudentAnalytics} />
        <Route path="/tutor/help">{() => <div className="max-w-6xl mx-auto"><HelpSupportPage /></div>}</Route>
        <Route path="/tutor/settings">{() => <SettingsPage />}</Route>
      </Switch>
    </TutorShell>
  );
}
