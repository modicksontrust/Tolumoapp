import React, { useState, useRef, useEffect } from 'react';
import {
  Crown, Send, Trash2, VolumeX, Shield, ChevronDown, Users,
  MessageCircle, Bell, Video, Lock, X, CornerDownRight, AlertCircle,
} from 'lucide-react';

// ── Year-group room config (mirrors student/community.tsx) ────────────────────
const YEAR_ROOMS = [
  { id: '100', label: '100 Level', tagline: 'First-year law students across Nigeria' },
  { id: '200', label: '200 Level', tagline: 'Second-year law students across Nigeria' },
  { id: '300', label: '300 Level', tagline: 'Third-year law students across Nigeria' },
  { id: '400', label: '400 Level', tagline: 'Final-year law students across Nigeria' },
  { id: 'llm',  label: 'LLM / BL', tagline: 'Postgraduate & Bar Part students across Nigeria' },
];

const LECTURER = {
  name: 'Prof. Oluwaseun Adeyemi',
  initials: 'OA',
  affiliation: 'Tolumor Faculty',
  isLecturer: true,
};

// ── Types ─────────────────────────────────────────────────────────────────────
type Reactions = Record<string, string[]>;

type Message = {
  id: string;
  authorName: string;
  authorInitials: string;
  authorSchool: string;
  isVip: boolean;
  isLecturer?: boolean;
  text: string;
  videoUrl?: string;
  videoName?: string;
  ts: number;
  removed?: boolean;
  reactions?: Reactions;
  replyToId?: string;
  replyToName?: string;
  replyToText?: string;
};

type CommNotif = { id: string; text: string; ts: number; read: boolean };

// ── Seed data (pulled from student community, matching state) ─────────────────
const EMOJIS = ['👍', '👎', '❤️', '🔥', '🎯'];

const SEED_200: Message[] = [
  {
    id: 't1', authorName: 'Fatima Bello', authorInitials: 'FB',
    authorSchool: 'Ahmadu Bello University', isVip: true,
    text: 'Can someone explain the "covering the field" doctrine simply? I understand it means federal law can override state law on concurrent matters, but when exactly does it kick in? Does the federal law have to explicitly say it covers the field?',
    ts: Date.now() - 1000 * 60 * 72,
    reactions: { '👍': ['Tunde Olatunji', 'Chisom Nwosu', 'Kelechi Amara'], '🔥': ['Emeka Eze'] },
  },
  {
    id: 't1-r1', authorName: 'Tunde Olatunji', authorInitials: 'TO',
    authorSchool: 'University of Ibadan', isVip: true,
    text: 'No, it doesn\'t need to be explicit. The court asks whether the federal legislation is so comprehensive that it "covers the field" — leaving no room for state legislation on the same subject. Even silence can be deliberate. The intent of Parliament matters more than the words.',
    ts: Date.now() - 1000 * 60 * 65,
    reactions: { '👍': ['Fatima Bello', 'Adaeze Okonkwo'], '🎯': ['Chisom Nwosu'] },
    replyToId: 't1', replyToName: 'Fatima Bello',
    replyToText: 'Can someone explain the "covering the field" doctrine simply?',
  },
  {
    id: 't1-r2', authorName: 'Adaeze Okonkwo', authorInitials: 'AO',
    authorSchool: 'University of Nigeria, Nsukka', isVip: false,
    text: 'The landmark case is A.-G. Ogun State v A.-G. Federation (1982). The Supreme Court held that where federal law comprehensively covers a concurrent-list subject, any state law on that same subject is void for inconsistency — even if the state law predates the federal one.',
    ts: Date.now() - 1000 * 60 * 58,
    reactions: { '🎯': ['Tunde Olatunji', 'Fatima Bello', 'Emeka Eze'] },
    replyToId: 't1', replyToName: 'Fatima Bello',
    replyToText: 'Can someone explain the "covering the field" doctrine simply?',
  },
  {
    id: 't2', authorName: 'Prof. Oluwaseun Adeyemi', authorInitials: 'OA',
    authorSchool: 'Tolumor Faculty', isVip: false, isLecturer: true,
    text: 'Reminder to everyone: the Part 2 written test requires you to apply the law to a scenario — not just define it. Use IRAC. Identify the constitutional issue, cite the relevant provision (section number + CFRN 1999), then apply it to the given facts. That is what earns marks.',
    ts: Date.now() - 1000 * 60 * 38,
    reactions: { '❤️': ['Fatima Bello', 'Chisom Nwosu', 'Emeka Eze', 'Kelechi Amara'], '👍': ['Adaeze Okonkwo', 'Tunde Olatunji'] },
  },
  {
    id: 't2-r1', authorName: 'Emeka Eze', authorInitials: 'EE',
    authorSchool: 'Enugu State University', isVip: false,
    text: 'Prof, does citing the section number alone count, or do we need the full heading too? For example, "S.4(2), CFRN 1999" vs "Section 4(2) — Legislative Powers of the National Assembly, CFRN 1999"?',
    ts: Date.now() - 1000 * 60 * 31,
    reactions: { '👍': ['Kelechi Amara', 'Fatima Bello'] },
    replyToId: 't2', replyToName: 'Prof. Oluwaseun Adeyemi',
    replyToText: 'Reminder to everyone: the Part 2 written test requires you to apply the law to a scenario — not just define it.',
  },
  {
    id: 't2-r2', authorName: 'Prof. Oluwaseun Adeyemi', authorInitials: 'OA',
    authorSchool: 'Tolumor Faculty', isVip: false, isLecturer: true,
    text: 'Good question Emeka. Section number + year of the Constitution is sufficient. "S.4(2) CFRN 1999" is perfectly acceptable. Adding the heading does no harm but is not required. What matters is accuracy — wrong section, no mark.',
    ts: Date.now() - 1000 * 60 * 24,
    reactions: { '👍': ['Emeka Eze', 'Kelechi Amara', 'Chisom Nwosu'], '🎯': ['Fatima Bello'] },
    replyToId: 't2', replyToName: 'Prof. Oluwaseun Adeyemi',
    replyToText: 'Reminder to everyone: the Part 2 written test requires you to apply the law to a scenario — not just define it.',
  },
  {
    id: 't3', authorName: 'Kelechi Amara', authorInitials: 'KA',
    authorSchool: 'Rivers State University', isVip: false,
    text: 'For those struggling with the MCQ format — the trick I found useful: eliminate the two obviously wrong options first, then compare the remaining two against the exact wording of the provision. The answers are usually in the statute, not your memory.',
    ts: Date.now() - 1000 * 60 * 11,
    reactions: { '👍': ['Tunde Olatunji', 'Emeka Eze'], '🔥': ['Chisom Nwosu'] },
  },
  {
    id: 't4', authorName: 'Adaeze Okonkwo', authorInitials: 'AO',
    authorSchool: 'University of Nigeria, Nsukka', isVip: false,
    text: 'Anyone booked a tutorial session yet? I\'m torn between the Thursday 10am and Friday 2pm slots with Prof. Adeyemi — which would you pick?',
    ts: Date.now() - 1000 * 60 * 4,
    reactions: {},
  },
];

const SEED_BY_ROOM: Record<string, Message[]> = {
  '100': [
    { id: 'r1m1', authorName: 'Sade Adeyemi', authorInitials: 'SA', authorSchool: 'OAU Ile-Ife', isVip: false, text: 'Just started the Introduction to Nigerian Legal System topic. The video is really well done! Is anyone else on Module 1?', ts: Date.now() - 1000 * 60 * 55, reactions: {} },
    { id: 'r1m2', authorName: 'Dayo Fashola', authorInitials: 'DF', authorSchool: 'Lagos State University', isVip: false, text: "Yes! I'm on Module 1 as well. The lecture notes after the video are very detailed — worth printing out if you can.", ts: Date.now() - 1000 * 60 * 35, reactions: { '👍': ['Sade Adeyemi'] }, replyToId: 'r1m1', replyToName: 'Sade Adeyemi', replyToText: 'Just started the Introduction to Nigerian Legal System topic.' },
  ],
  '200': SEED_200,
  '300': [
    { id: 'r3m1', authorName: 'Ngozi Obi', authorInitials: 'NO', authorSchool: 'UNIZIK Awka', isVip: true, text: 'Third year and still using Tolumor daily. The module progression system really keeps you accountable — love the streak counter.', ts: Date.now() - 1000 * 60 * 90, reactions: { '🔥': ['Seun Abiodun'] } },
    { id: 'r3m2', authorName: 'Seun Abiodun', authorInitials: 'SA', authorSchool: 'University of Ilorin', isVip: false, text: 'Agreed. Also the Q&A AI is much better than I expected at referencing actual Nigerian statutes. Really useful for exam prep.', ts: Date.now() - 1000 * 60 * 45, reactions: {} },
  ],
  '400': [
    { id: 'r4m1', authorName: 'Chidera Ude', authorInitials: 'CU', authorSchool: 'University of Calabar', isVip: true, text: 'Final year vibes 🎓 Anyone else already thinking about Bar Part? The LLM/BL room is available too once we move up.', ts: Date.now() - 1000 * 60 * 120, reactions: { '🔥': ['Ngozi Obi'] } },
  ],
  'llm': [
    { id: 'rllmm1', authorName: 'Barrister Amaka Osei', authorInitials: 'AO', authorSchool: 'Nigerian Law School, Abuja', isVip: true, text: "Welcome to the postgrad room. Bar Part is tough but Tolumor's structured flow genuinely helps. Stick to the daily plan.", ts: Date.now() - 1000 * 60 * 200, reactions: {} },
  ],
};

const SEED_NOTIFS: CommNotif[] = [
  { id: 'ln1', text: 'Emeka Eze asked you a question in the 200 Level room', ts: Date.now() - 1000 * 60 * 31, read: false },
  { id: 'ln2', text: 'Fatima Bello 👍 reacted to your message in the 200 Level room', ts: Date.now() - 1000 * 60 * 22, read: false },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTs(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getThreadRoot(msgId: string, allMsgs: Message[]): string {
  const msg = allMsgs.find(m => m.id === msgId);
  if (!msg?.replyToId) return msgId;
  return getThreadRoot(msg.replyToId, allMsgs);
}

function AuthorAvatar({ name, initials, isLecturer, isVip, size = 'md' }: {
  name: string; initials: string; isLecturer?: boolean; isVip?: boolean; size?: 'sm' | 'md';
}) {
  const dim = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs';
  return (
    <div className={`${dim} rounded-full flex items-center justify-center shrink-0 font-bold
      ${isLecturer ? 'bg-[#1a4d35] text-white' : isVip ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-700'}`}
      title={name}>
      {initials}
    </div>
  );
}

function ReactionRow({ msgId, reactions = {}, isOwn, onReact }: {
  msgId: string; reactions?: Reactions; isOwn: boolean;
  onReact: (msgId: string, emoji: string) => void;
}) {
  return (
    <div className={`flex items-center gap-1 mt-1 flex-wrap ${isOwn ? 'justify-end' : ''}`}>
      {EMOJIS.map(emoji => {
        const reactors = reactions[emoji] ?? [];
        const count = reactors.length;
        const youReacted = reactors.includes(LECTURER.name);
        return (
          <button key={emoji} onClick={() => onReact(msgId, emoji)}
            title={count > 0 ? reactors.join(', ') : emoji}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border transition-all
              ${youReacted
                ? 'bg-[#1a4d35]/10 border-[#1a4d35]/30 text-[#1a4d35]'
                : count > 0
                  ? 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  : 'bg-transparent border-stone-150 text-stone-400 hover:bg-stone-50 hover:border-stone-200'
              }`}>
            {emoji}{count > 0 && <span className="ml-0.5">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

function NotifDropdown({ notifs, onMarkAll, onClose }: {
  notifs: CommNotif[]; onMarkAll: () => void; onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-stone-200 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
        <p className="font-bold text-sm text-foreground">Student Room Activity</p>
        {notifs.some(n => !n.read) && (
          <button onClick={onMarkAll} className="text-[11px] font-semibold text-[#1a4d35] hover:underline">Mark all read</button>
        )}
      </div>
      {notifs.length === 0
        ? <p className="px-4 py-6 text-xs text-muted-foreground text-center">No activity yet.</p>
        : (
          <div className="max-h-72 overflow-y-auto divide-y divide-stone-50">
            {notifs.map(n => (
              <div key={n.id} className={`px-4 py-3 flex items-start gap-2.5 ${n.read ? '' : 'bg-[#1a4d35]/5'}`}>
                <span className={`h-2 w-2 rounded-full shrink-0 mt-1 ${n.read ? 'bg-transparent' : 'bg-[#1a4d35]'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{formatTs(n.ts)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}

function MessageBubble({
  msg, isOwn, isReply = false, onReact, onReply, onRemove,
}: {
  msg: Message; isOwn: boolean; isReply?: boolean;
  onReact: (id: string, emoji: string) => void;
  onReply: (msg: Message) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className={`flex gap-2.5 group ${isOwn ? 'flex-row-reverse' : ''}`}>
      <AuthorAvatar
        name={msg.authorName} initials={msg.authorInitials}
        isLecturer={msg.isLecturer} isVip={msg.isVip}
        size={isReply ? 'sm' : 'md'}
      />
      <div className={`max-w-[78%] flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-1.5 flex-wrap ${isOwn ? 'justify-end' : ''}`}>
          <span className="text-xs font-bold text-foreground">{isOwn ? 'You (Lecturer)' : msg.authorName}</span>
          {msg.isLecturer && !isOwn && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-[#1a4d35] text-white px-1.5 py-0.5 rounded-full">
              <Shield className="h-2.5 w-2.5" /> Lecturer
            </span>
          )}
          {isOwn && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-[#1a4d35] text-white px-1.5 py-0.5 rounded-full">
              <Shield className="h-2.5 w-2.5" /> Lecturer
            </span>
          )}
          {msg.isVip && !msg.isLecturer && (
            <span className="flex items-center gap-1 text-[10px] font-bold bg-amber-400 text-white px-1.5 py-0.5 rounded-full">
              <Crown className="h-2.5 w-2.5" /> VIP
            </span>
          )}
          {!isReply && <span className="text-[10px] text-muted-foreground">{msg.authorSchool}</span>}
          <span className="text-[10px] text-stone-300">·</span>
          <span className="text-[10px] text-muted-foreground">{formatTs(msg.ts)}</span>
        </div>

        <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isOwn
            ? 'bg-[#1a4d35] text-white rounded-tr-sm'
            : msg.isLecturer
              ? 'bg-[#1a4d35]/10 text-foreground border border-[#1a4d35]/20 rounded-tl-sm'
              : 'bg-white text-foreground border border-stone-200 shadow-sm rounded-tl-sm'
          }`}
        >
          {msg.replyToText && (
            <p className={`text-[11px] mb-1.5 truncate italic border-l-2 pl-2 leading-snug
              ${isOwn ? 'text-white/60 border-white/30' : 'text-muted-foreground border-stone-300'}`}>
              {msg.replyToName}: {msg.replyToText}
            </p>
          )}
          {msg.text}

          {/* Moderator remove */}
          <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
            {!isOwn && (
              <button onClick={() => onRemove(msg.id)} title="Remove message"
                className="p-1 rounded-lg bg-white/80 hover:bg-red-50 text-red-500 shadow border border-stone-200 transition-colors">
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <div className={`flex items-center gap-2 flex-wrap ${isOwn ? 'justify-end' : ''}`}>
          <ReactionRow msgId={msg.id} reactions={msg.reactions} isOwn={isOwn} onReact={onReact} />
          <button
            onClick={() => onReply(msg)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-[#1a4d35] transition-colors"
          >
            <CornerDownRight className="h-3 w-3" /> Reply
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TutorStudentCommunity() {
  const [roomId, setRoomId] = useState('200');
  const [roomPickerOpen, setRoomPickerOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>(SEED_BY_ROOM);
  const [draft, setDraft] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string; text: string } | null>(null);
  const [commNotifs, setCommNotifs] = useState<CommNotif[]>(SEED_NOTIFS);
  const [notifOpen, setNotifOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const allRoomMsgs = (messages[roomId] ?? []).filter(m => !m.removed);
  const currentRoom = YEAR_ROOMS.find(r => r.id === roomId)!;
  const unreadCount = commNotifs.filter(n => !n.read).length;

  const topLevel = allRoomMsgs.filter(m => !m.replyToId);
  function threadReplies(rootId: string): Message[] {
    return allRoomMsgs.filter(m => m.replyToId && getThreadRoot(m.id, allRoomMsgs) === rootId);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allRoomMsgs.length, roomId]);

  function handleReply(msg: Message) {
    setReplyingTo({ id: msg.id, name: msg.authorName, text: msg.text });
    textareaRef.current?.focus();
  }

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    const msg: Message = {
      id: `lc-${Date.now()}`,
      authorName: LECTURER.name,
      authorInitials: LECTURER.initials,
      authorSchool: LECTURER.affiliation,
      isVip: false,
      isLecturer: true,
      text,
      ts: Date.now(),
      reactions: {},
      ...(replyingTo ? { replyToId: replyingTo.id, replyToName: replyingTo.name, replyToText: replyingTo.text } : {}),
    };
    setMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] ?? []), msg] }));
    setDraft('');
    setReplyingTo(null);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }

  function handleReact(msgId: string, emoji: string) {
    setMessages(prev => {
      const room = prev[roomId] ?? [];
      return {
        ...prev,
        [roomId]: room.map(m => {
          if (m.id !== msgId) return m;
          const reacts = { ...(m.reactions ?? {}) };
          const cur = reacts[emoji] ?? [];
          reacts[emoji] = cur.includes(LECTURER.name)
            ? cur.filter(n => n !== LECTURER.name)
            : [...cur, LECTURER.name];
          return { ...m, reactions: reacts };
        }),
      };
    });
  }

  function removeMessage(id: string) {
    setMessages(prev => ({
      ...prev,
      [roomId]: prev[roomId].map(m => m.id === id ? { ...m, removed: true } : m),
    }));
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100dvh-0px)] bg-[#fafaf9]">

      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#1a4d35]/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-[#1a4d35]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-serif font-bold text-foreground">{currentRoom.label} Community</h1>
                <span className="text-[10px] font-bold bg-[#1a4d35] text-white px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                  <Shield className="h-2.5 w-2.5" /> Lecturer View
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{currentRoom.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Notification bell */}
            <div className="relative">
              <button onClick={() => setNotifOpen(o => !o)}
                className="relative h-9 w-9 flex items-center justify-center rounded-xl hover:bg-stone-100 transition-colors border border-stone-200">
                <Bell className="h-4 w-4 text-stone-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <NotifDropdown
                  notifs={commNotifs}
                  onMarkAll={() => setCommNotifs(p => p.map(n => ({ ...n, read: true })))}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>

            {/* Room switcher — always visible for lecturers */}
            <div className="relative">
              <button onClick={() => setRoomPickerOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm font-semibold text-foreground hover:bg-stone-50 transition-colors">
                Switch room <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {roomPickerOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-stone-200 w-56 overflow-hidden">
                  {YEAR_ROOMS.map(r => (
                    <button key={r.id} onClick={() => { setRoomId(r.id); setRoomPickerOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-stone-50 transition-colors ${r.id === roomId ? 'font-bold text-[#1a4d35]' : 'text-foreground'}`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Lecturer context note */}
        <div className="mt-3 flex items-start gap-2 text-[11px] text-muted-foreground leading-relaxed bg-[#1a4d35]/5 rounded-lg px-3 py-2 border border-[#1a4d35]/10">
          <AlertCircle className="h-3.5 w-3.5 text-[#1a4d35] shrink-0 mt-0.5" />
          <span>
            You are viewing and posting as <span className="font-semibold text-[#1a4d35]">Prof. Oluwaseun Adeyemi</span>. Your messages appear with the Lecturer badge. Students cannot access rooms outside their own level. You have moderator access to all rooms.
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {topLevel.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <MessageCircle className="h-10 w-10 text-stone-300 mb-3" />
            <p className="font-semibold text-stone-500">No messages yet in this room</p>
            <p className="text-xs text-muted-foreground mt-1">Post something to start the conversation.</p>
          </div>
        )}

        {topLevel.map(msg => {
          const replies = threadReplies(msg.id);
          const isOwn = msg.authorName === LECTURER.name;
          return (
            <div key={msg.id}>
              <MessageBubble msg={msg} isOwn={isOwn} onReact={handleReact} onReply={handleReply} onRemove={removeMessage} />
              {replies.length > 0 && (
                <div className="mt-2 ml-11 rounded-2xl border border-stone-200 bg-stone-50 overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-stone-200 bg-white/70">
                    <CornerDownRight className="h-3.5 w-3.5 text-stone-400" />
                    <span className="text-[11px] font-semibold text-stone-500">
                      {replies.length} {replies.length === 1 ? 'reply' : 'replies'}
                    </span>
                  </div>
                  <div className="px-4 py-3 space-y-4">
                    {replies.map(reply => (
                      <MessageBubble key={reply.id} msg={reply}
                        isOwn={reply.authorName === LECTURER.name}
                        isReply
                        onReact={handleReact} onReply={handleReply} onRemove={removeMessage}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Compose */}
      <div className="bg-white border-t border-stone-200 px-4 py-3 shrink-0">
        {replyingTo && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-[#1a4d35]/5 border border-[#1a4d35]/20">
            <CornerDownRight className="h-3.5 w-3.5 text-[#1a4d35] shrink-0" />
            <span className="text-xs text-[#1a4d35] font-semibold shrink-0">Replying to {replyingTo.name}:</span>
            <span className="text-xs text-muted-foreground truncate flex-1">{replyingTo.text}</span>
            <button onClick={() => setReplyingTo(null)} className="text-muted-foreground hover:text-red-500 transition-colors shrink-0">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <AuthorAvatar name={LECTURER.name} initials={LECTURER.initials} isLecturer={true} />
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                if (e.key === 'Escape') setReplyingTo(null);
              }}
              placeholder={replyingTo ? `Reply to ${replyingTo.name}…` : `Post to ${currentRoom.label} Community as Lecturer…`}
              rows={1}
              className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#1a4d35]/40 focus:bg-white transition-colors max-h-32 overflow-y-auto"
              style={{ minHeight: '42px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            className="h-10 w-10 rounded-2xl bg-[#1a4d35] text-white flex items-center justify-center shrink-0 hover:bg-[#1a4d35]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 pl-12">
          Enter to send · Shift+Enter for new line{replyingTo ? ' · Esc to cancel reply' : ''}
        </p>
      </div>
    </div>
  );
}
