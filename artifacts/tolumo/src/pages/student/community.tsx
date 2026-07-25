import React, { useState, useRef, useEffect } from 'react';
import {
  Crown, Send, Trash2, VolumeX, Shield, ChevronDown, Users,
  MessageCircle, Bell, Video, Lock, X, CornerDownRight,
} from 'lucide-react';
import { useLocation } from 'wouter';

// ── Year-group room config ────────────────────────────────────────────────────
const YEAR_ROOMS = [
  { id: '100', label: '100 Level', tagline: 'First-year law students across Nigeria' },
  { id: '200', label: '200 Level', tagline: 'Second-year law students across Nigeria' },
  { id: '300', label: '300 Level', tagline: 'Third-year law students across Nigeria' },
  { id: '400', label: '400 Level', tagline: 'Final-year law students across Nigeria' },
  { id: 'llm',  label: 'LLM / BL',  tagline: 'Postgraduate & Bar Part students across Nigeria' },
];

const CURRENT_STUDENT = {
  name: 'Chisom Nwosu',
  initials: 'CN',
  school: 'University of Lagos',
  year: '200',
  isVip: false,
};

// ── Types ─────────────────────────────────────────────────────────────────────
type Reactions = Record<string, string[]>;

type Message = {
  id: string;
  authorName: string;
  authorInitials: string;
  authorSchool: string;
  authorYear: string;
  isVip: boolean;
  isLecturer?: boolean;
  text: string;
  videoUrl?: string;
  videoName?: string;
  ts: number;
  removed?: boolean;
  reactions?: Reactions;
  // threading
  replyToId?: string;    // direct parent message id
  replyToName?: string;  // author of the parent (for display)
  replyToText?: string;  // snippet of the parent (for display)
};

type CommNotif = { id: string; text: string; ts: number; read: boolean };

// ── Seed notifications ────────────────────────────────────────────────────────
const SEED_COMM_NOTIFS: CommNotif[] = [
  { id: 'cn1', text: 'Tunde Olatunji 👍 reacted to your message in 200 Level Community', ts: Date.now() - 1000 * 60 * 25, read: false },
  { id: 'cn2', text: 'Fatima Bello replied to your message in 200 Level Community', ts: Date.now() - 1000 * 60 * 12, read: false },
];

// ── Seed messages ─────────────────────────────────────────────────────────────
const SEED_200: Message[] = [
  {
    id: 'm1', authorName: 'Tunde Olatunji', authorInitials: 'TO',
    authorSchool: 'University of Ibadan', authorYear: '200', isVip: true,
    text: 'Has anyone else found the separation of powers topic in Module 2 particularly dense? I had to re-watch the video twice before it clicked for me. The diagram in the lecture notes helped a lot.',
    ts: Date.now() - 1000 * 60 * 47,
    reactions: { '👍': ['Adaeze Okonkwo', 'Chisom Nwosu'], '🔥': ['Kelechi Amara'] },
  },
  {
    id: 'm1-r1', authorName: 'Adaeze Okonkwo', authorInitials: 'AO',
    authorSchool: 'University of Nigeria, Nsukka', authorYear: '200', isVip: false,
    text: 'Same! The diagram saved me honestly. I also ended up drawing my own version by hand while re-watching — that really cemented it.',
    ts: Date.now() - 1000 * 60 * 43,
    reactions: { '🎯': ['Tunde Olatunji'] },
    replyToId: 'm1', replyToName: 'Tunde Olatunji',
    replyToText: 'Has anyone else found the separation of powers topic in Module 2 particularly dense?',
  },
  {
    id: 'm1-r2', authorName: 'Kelechi Amara', authorInitials: 'KA',
    authorSchool: 'Rivers State University', authorYear: '200', isVip: false,
    text: 'The AI Q&A on that topic is also very helpful — I kept asking follow-up questions and it gave detailed answers with case references.',
    ts: Date.now() - 1000 * 60 * 40,
    reactions: {},
    replyToId: 'm1', replyToName: 'Tunde Olatunji',
    replyToText: 'Has anyone else found the separation of powers topic in Module 2 particularly dense?',
  },
  {
    id: 'm3', authorName: 'Fatima Bello', authorInitials: 'FB',
    authorSchool: 'Ahmadu Bello University', authorYear: '200', isVip: true,
    text: 'Quick reminder to everyone — the Part 2 written test requires you to apply the law to a scenario, not just define it. I failed first attempt by just defining "federalism". Apply it to the given facts!',
    ts: Date.now() - 1000 * 60 * 28,
    reactions: { '🎯': ['Tunde Olatunji', 'Emeka Eze'], '👍': ['Adaeze Okonkwo'] },
  },
  {
    id: 'm3-r1', authorName: 'Chisom Nwosu', authorInitials: 'CN',
    authorSchool: 'University of Lagos', authorYear: '200', isVip: false,
    text: "Thank you for this Fatima — I nearly made that exact mistake. I was going to just define federalism and move on. Saving this message!",
    ts: Date.now() - 1000 * 60 * 24,
    reactions: { '❤️': ['Fatima Bello'] },
    replyToId: 'm3', replyToName: 'Fatima Bello',
    replyToText: 'Quick reminder to everyone — the Part 2 written test requires you to apply the law to a scenario, not just define it.',
  },
  {
    id: 'm4', authorName: 'Emeka Eze', authorInitials: 'EE',
    authorSchool: 'Enugu State University', authorYear: '200', isVip: false,
    text: "That's such an important point Fatima, thank you! I passed the MCQs first try but the written section caught me off guard. The keyword matching is stricter than I expected.",
    ts: Date.now() - 1000 * 60 * 21,
    reactions: {},
  },
  {
    id: 'm5', authorName: 'Prof. Oluwaseun Adeyemi', authorInitials: 'OA',
    authorSchool: 'Tolumor Faculty', authorYear: '200', isVip: false, isLecturer: true,
    text: 'Great discussion here. For Part 2, think like a judge — you have the facts, identify the constitutional issue, cite the relevant provision, then apply it. IRAC method works perfectly. Keep pushing! 📚',
    ts: Date.now() - 1000 * 60 * 14,
    reactions: { '❤️': ['Fatima Bello', 'Chisom Nwosu', 'Emeka Eze'] },
  },
  {
    id: 'm6', authorName: 'Kelechi Amara', authorInitials: 'KA',
    authorSchool: 'Rivers State University', authorYear: '200', isVip: false,
    text: 'Does anyone know if the tutorial sessions with Prof. Adeyemi are recorded for later? I have a clash on the slot I wanted to book.',
    ts: Date.now() - 1000 * 60 * 7,
    reactions: {},
  },
  {
    id: 'm7', authorName: 'Tunde Olatunji', authorInitials: 'TO',
    authorSchool: 'University of Ibadan', authorYear: '200', isVip: true,
    text: 'Yes! All sessions are auto-recorded and you get a replay link in My Tutorial Sessions for 6 months from the date. Just book whichever slot works, the recording will be there.',
    ts: Date.now() - 1000 * 60 * 3,
    reactions: { '👍': ['Kelechi Amara'] },
    replyToId: 'm6', replyToName: 'Kelechi Amara',
    replyToText: 'Does anyone know if the tutorial sessions with Prof. Adeyemi are recorded for later?',
  },
];

const SEED_BY_ROOM: Record<string, Message[]> = {
  '100': [
    { id: 'r1m1', authorName: 'Sade Adeyemi', authorInitials: 'SA', authorSchool: 'OAU Ile-Ife', authorYear: '100', isVip: false, text: 'Just started the Introduction to Nigerian Legal System topic. The video is really well done! Is anyone else on Module 1?', ts: Date.now() - 1000 * 60 * 55, reactions: {} },
    { id: 'r1m2', authorName: 'Dayo Fashola', authorInitials: 'DF', authorSchool: 'Lagos State University', authorYear: '100', isVip: false, text: "Yes! I'm on Module 1 as well. The lecture notes after the video are very detailed — worth printing out if you can.", ts: Date.now() - 1000 * 60 * 35, reactions: { '👍': ['Sade Adeyemi'] }, replyToId: 'r1m1', replyToName: 'Sade Adeyemi', replyToText: 'Just started the Introduction to Nigerian Legal System topic.' },
  ],
  '200': SEED_200,
  '300': [
    { id: 'r3m1', authorName: 'Ngozi Obi', authorInitials: 'NO', authorSchool: 'UNIZIK Awka', authorYear: '300', isVip: true, text: 'Third year and still using Tolumor daily. The module progression system really keeps you accountable — love the streak counter.', ts: Date.now() - 1000 * 60 * 90, reactions: { '🔥': ['Seun Abiodun'] } },
    { id: 'r3m2', authorName: 'Seun Abiodun', authorInitials: 'SA', authorSchool: 'University of Ilorin', authorYear: '300', isVip: false, text: 'Agreed. Also the Q&A AI is much better than I expected at referencing actual Nigerian statutes. Really useful for exam prep.', ts: Date.now() - 1000 * 60 * 45, reactions: {} },
  ],
  '400': [
    { id: 'r4m1', authorName: 'Chidera Ude', authorInitials: 'CU', authorSchool: 'University of Calabar', authorYear: '400', isVip: true, text: 'Final year vibes 🎓 Anyone else already thinking about Bar Part? The LLM/BL room is available too once we move up.', ts: Date.now() - 1000 * 60 * 120, reactions: { '🔥': ['Ngozi Obi'] } },
  ],
  'llm': [
    { id: 'rllmm1', authorName: 'Barrister Amaka Osei', authorInitials: 'AO', authorSchool: 'Nigerian Law School, Abuja', authorYear: 'llm', isVip: true, text: "Welcome to the postgrad room. Bar Part is tough but Tolumor's structured flow genuinely helps. Stick to the daily plan.", ts: Date.now() - 1000 * 60 * 200, reactions: {} },
  ],
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const EMOJIS = ['👍', '👎', '❤️', '🔥', '🎯'];

function formatTs(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Walk up the reply chain to find the root (top-level) message id */
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
      title={name}
    >
      {initials}
    </div>
  );
}

const IS_MODERATOR = false;

// ── Reaction row ──────────────────────────────────────────────────────────────
function ReactionRow({ msgId, reactions = {}, isOwn, onReact }: {
  msgId: string; reactions?: Reactions; isOwn: boolean; onReact: (msgId: string, emoji: string) => void;
}) {
  return (
    <div className={`flex items-center gap-1 mt-1 flex-wrap ${isOwn ? 'justify-end' : ''}`}>
      {EMOJIS.map(emoji => {
        const reactors = reactions[emoji] ?? [];
        const count = reactors.length;
        const youReacted = reactors.includes(CURRENT_STUDENT.name);
        return (
          <button
            key={emoji}
            onClick={() => onReact(msgId, emoji)}
            title={count > 0 ? reactors.join(', ') : emoji}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border transition-all
              ${youReacted
                ? 'bg-[#1a4d35]/10 border-[#1a4d35]/30 text-[#1a4d35]'
                : count > 0
                  ? 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  : 'bg-transparent border-stone-150 text-stone-400 hover:bg-stone-50 hover:border-stone-200'
              }`}
          >
            {emoji}{count > 0 && <span className="ml-0.5">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}

// ── Notification bell dropdown ────────────────────────────────────────────────
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
        <p className="font-bold text-sm text-foreground">Community Notifications</p>
        {notifs.some(n => !n.read) && (
          <button onClick={onMarkAll} className="text-[11px] font-semibold text-[#1a4d35] hover:underline">Mark all read</button>
        )}
      </div>
      {notifs.length === 0
        ? <p className="px-4 py-6 text-xs text-muted-foreground text-center">No notifications yet.</p>
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

// ── VIP video attachment ──────────────────────────────────────────────────────
function VideoAttachment({ name, own }: { name: string; own: boolean }) {
  return own ? (
    <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-black/20 border border-white/20 max-w-[220px]">
      <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0"><Video className="h-4 w-4 text-white" /></div>
      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-white truncate">{name}</p><p className="text-[10px] text-white/60">Video clip</p></div>
    </div>
  ) : (
    <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 max-w-[220px]">
      <div className="h-8 w-8 rounded-lg bg-[#1a4d35]/10 flex items-center justify-center shrink-0"><Video className="h-4 w-4 text-[#1a4d35]" /></div>
      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-foreground truncate">{name}</p><p className="text-[10px] text-muted-foreground">Video clip · VIP</p></div>
    </div>
  );
}

// ── Single message bubble (reusable for top-level and replies) ────────────────
function MessageBubble({
  msg, isOwn, isReply = false,
  onReact, onReply, onRemove, onMute,
}: {
  msg: Message; isOwn: boolean; isReply?: boolean;
  onReact: (id: string, emoji: string) => void;
  onReply: (msg: Message) => void;
  onRemove: (id: string) => void;
  onMute: (name: string) => void;
}) {
  return (
    <div className={`flex gap-2.5 group ${isOwn ? 'flex-row-reverse' : ''}`}>
      <AuthorAvatar
        name={msg.authorName} initials={msg.authorInitials}
        isLecturer={msg.isLecturer} isVip={msg.isVip}
        size={isReply ? 'sm' : 'md'}
      />
      <div className={`max-w-[78%] flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Identity row */}
        <div className={`flex items-center gap-1.5 flex-wrap ${isOwn ? 'justify-end' : ''}`}>
          <span className="text-xs font-bold text-foreground">{isOwn ? 'You' : msg.authorName}</span>
          {msg.isLecturer && (
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

        {/* Bubble */}
        <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isOwn
            ? 'bg-[#1a4d35] text-white rounded-tr-sm'
            : msg.isLecturer
              ? 'bg-[#1a4d35]/10 text-foreground border border-[#1a4d35]/20 rounded-tl-sm'
              : 'bg-white text-foreground border border-stone-200 shadow-sm rounded-tl-sm'
          }`}
        >
          {/* Quoted reply-to snippet */}
          {msg.replyToText && (
            <p className={`text-[11px] mb-1.5 truncate italic border-l-2 pl-2 leading-snug
              ${isOwn ? 'text-white/60 border-white/30' : 'text-muted-foreground border-stone-300'}`}>
              {msg.replyToName}: {msg.replyToText}
            </p>
          )}
          {msg.text}
          {msg.videoName && <VideoAttachment name={msg.videoName} own={isOwn} />}

          {/* Mod actions */}
          {IS_MODERATOR && !isOwn && (
            <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
              <button onClick={() => onRemove(msg.id)} title="Remove"
                className="p-1 rounded-lg bg-white/80 hover:bg-red-50 text-red-500 shadow border border-stone-200 transition-colors">
                <Trash2 className="h-3 w-3" />
              </button>
              <button onClick={() => onMute(msg.authorName)} title="Mute"
                className="p-1 rounded-lg bg-white/80 hover:bg-stone-100 text-stone-500 shadow border border-stone-200 transition-colors">
                <VolumeX className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Reactions + Reply button */}
        <div className={`flex items-center gap-2 flex-wrap ${isOwn ? 'justify-end' : ''}`}>
          <ReactionRow msgId={msg.id} reactions={msg.reactions} isOwn={isOwn} onReact={onReact} />
          <button
            onClick={() => onReply(msg)}
            className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-[#1a4d35] transition-colors"
          >
            <CornerDownRight className="h-3 w-3" />
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main community page ───────────────────────────────────────────────────────
export default function CommunityPage() {
  const [, setLocation] = useLocation();
  const assignedRoom = CURRENT_STUDENT.year;
  const [roomId, setRoomId] = useState(assignedRoom);
  const [roomPickerOpen, setRoomPickerOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>(SEED_BY_ROOM);
  const [draft, setDraft] = useState('');
  const [mutedIds, setMutedIds] = useState<Set<string>>(new Set());
  const [commNotifs, setCommNotifs] = useState<CommNotif[]>(SEED_COMM_NOTIFS);
  const [notifOpen, setNotifOpen] = useState(false);
  const [pendingVideo, setPendingVideo] = useState<{ url: string; name: string } | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string; text: string } | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const allRoomMsgs = (messages[roomId] ?? []).filter(m => !m.removed && !mutedIds.has(m.authorName));
  const currentRoom = YEAR_ROOMS.find(r => r.id === roomId)!;
  const unreadCount = commNotifs.filter(n => !n.read).length;

  // Group: top-level messages + their full thread of replies
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

  function cancelReply() {
    setReplyingTo(null);
  }

  function handleSend() {
    const text = draft.trim();
    if (!text && !pendingVideo) return;
    const msg: Message = {
      id: `u-${Date.now()}`,
      authorName: CURRENT_STUDENT.name,
      authorInitials: CURRENT_STUDENT.initials,
      authorSchool: CURRENT_STUDENT.school,
      authorYear: CURRENT_STUDENT.year,
      isVip: CURRENT_STUDENT.isVip,
      text,
      videoUrl: pendingVideo?.url,
      videoName: pendingVideo?.name,
      ts: Date.now(),
      reactions: {},
      ...(replyingTo ? {
        replyToId: replyingTo.id,
        replyToName: replyingTo.name,
        replyToText: replyingTo.text,
      } : {}),
    };
    setMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] ?? []), msg] }));
    setDraft('');
    setPendingVideo(null);
    setReplyingTo(null);
  }

  function handleReact(msgId: string, emoji: string) {
    setMessages(prev => {
      const room = prev[roomId] ?? [];
      const updated = room.map(m => {
        if (m.id !== msgId) return m;
        const reacts = { ...(m.reactions ?? {}) };
        const cur = reacts[emoji] ?? [];
        if (cur.includes(CURRENT_STUDENT.name)) {
          reacts[emoji] = cur.filter(n => n !== CURRENT_STUDENT.name);
        } else {
          reacts[emoji] = [...cur, CURRENT_STUDENT.name];
        }
        return { ...m, reactions: reacts };
      });
      return { ...prev, [roomId]: updated };
    });
  }

  function removeMessage(id: string) {
    setMessages(prev => ({
      ...prev,
      [roomId]: prev[roomId].map(m => m.id === id ? { ...m, removed: true } : m),
    }));
  }

  function muteAuthor(name: string) {
    setMutedIds(prev => new Set([...prev, name]));
  }

  function handleVideoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingVideo({ url: URL.createObjectURL(file), name: file.name });
    e.target.value = '';
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100dvh-0px)] bg-[#fafaf9]">

      {/* ── Header ── */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#1a4d35]/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-[#1a4d35]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-serif font-bold text-foreground">{currentRoom.label} Community</h1>
                {roomId === assignedRoom && (
                  <span className="text-[10px] font-bold bg-[#1a4d35]/10 text-[#1a4d35] px-2 py-0.5 rounded-full uppercase tracking-wide">Your room</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{currentRoom.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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
                  onMarkAll={() => setCommNotifs(prev => prev.map(n => ({ ...n, read: true })))}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>

            {IS_MODERATOR && (
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
                        {r.id === assignedRoom && <span className="ml-2 text-[10px] text-muted-foreground">(yours)</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
          Peer-to-peer space for Nigerian law students at the same stage. Content stays within this room — no resharing or forwarding.
          Lecturers and admins may view and moderate all rooms.
        </p>
      </div>

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {topLevel.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <MessageCircle className="h-10 w-10 text-stone-300 mb-3" />
            <p className="font-semibold text-stone-500">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">Be the first to start the conversation.</p>
          </div>
        )}

        {topLevel.map(msg => {
          const replies = threadReplies(msg.id);
          const isOwn = msg.authorName === CURRENT_STUDENT.name;
          return (
            <div key={msg.id}>
              {/* Top-level message */}
              <MessageBubble
                msg={msg} isOwn={isOwn}
                onReact={handleReact} onReply={handleReply}
                onRemove={removeMessage} onMute={muteAuthor}
              />

              {/* Threaded replies */}
              {replies.length > 0 && (
                <div className={`mt-2 space-y-2 pl-11 relative ${isOwn ? 'pr-0' : ''}`}>
                  {/* Vertical thread line */}
                  <div className="absolute left-[22px] top-0 bottom-2 w-px bg-stone-200" />
                  {replies.map(reply => (
                    <MessageBubble
                      key={reply.id}
                      msg={reply}
                      isOwn={reply.authorName === CURRENT_STUDENT.name}
                      isReply
                      onReact={handleReact} onReply={handleReply}
                      onRemove={removeMessage} onMute={muteAuthor}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Compose ── */}
      <div className="bg-white border-t border-stone-200 px-4 py-3 shrink-0">

        {/* Replying-to banner */}
        {replyingTo && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-[#1a4d35]/5 border border-[#1a4d35]/20">
            <CornerDownRight className="h-3.5 w-3.5 text-[#1a4d35] shrink-0" />
            <span className="text-xs text-[#1a4d35] font-semibold shrink-0">Replying to {replyingTo.name}:</span>
            <span className="text-xs text-muted-foreground truncate flex-1">{replyingTo.text}</span>
            <button onClick={cancelReply} className="text-muted-foreground hover:text-red-500 transition-colors shrink-0">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* Video preview */}
        {pendingVideo && (
          <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-xl bg-stone-50 border border-stone-200">
            <Video className="h-4 w-4 text-[#1a4d35] shrink-0" />
            <span className="text-xs text-foreground flex-1 truncate">{pendingVideo.name}</span>
            <button onClick={() => setPendingVideo(null)} className="text-muted-foreground hover:text-red-500 transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2">
          <AuthorAvatar name={CURRENT_STUDENT.name} initials={CURRENT_STUDENT.initials} isVip={CURRENT_STUDENT.isVip} />

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                if (e.key === 'Escape') cancelReply();
              }}
              placeholder={replyingTo ? `Reply to ${replyingTo.name}…` : `Message ${currentRoom.label} Community…`}
              rows={1}
              className="w-full resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#1a4d35]/40 focus:bg-white transition-colors max-h-32 overflow-y-auto"
              style={{ minHeight: '42px' }}
            />
          </div>

          {/* VIP video upload */}
          <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={handleVideoSelect} />
          <div className="relative group">
            <button
              onClick={() => CURRENT_STUDENT.isVip ? videoInputRef.current?.click() : setLocation('/student/vip')}
              title={CURRENT_STUDENT.isVip ? 'Attach video clip' : 'VIP exclusive — upgrade to attach videos'}
              className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 transition-all border
                ${CURRENT_STUDENT.isVip
                  ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100'
                  : 'bg-stone-50 border-stone-200 text-stone-300 cursor-pointer'}`}
            >
              {CURRENT_STUDENT.isVip
                ? <Video className="h-4 w-4" />
                : <span className="relative"><Video className="h-4 w-4" /><Lock className="h-2.5 w-2.5 absolute -bottom-0.5 -right-1 text-stone-400" /></span>
              }
            </button>
            {!CURRENT_STUDENT.isVip && (
              <div className="absolute bottom-12 right-0 w-44 bg-stone-900 text-white text-[11px] leading-snug px-3 py-2 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <span className="font-bold text-amber-400">VIP exclusive</span> — upgrade to attach video clips to your messages.
              </div>
            )}
          </div>

          <button
            onClick={handleSend}
            disabled={!draft.trim() && !pendingVideo}
            className="h-10 w-10 rounded-2xl bg-[#1a4d35] text-white flex items-center justify-center shrink-0 hover:bg-[#1a4d35]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 pl-12">
          Enter to send · Shift+Enter for a new line{replyingTo ? ' · Esc to cancel reply' : ''}
        </p>
      </div>
    </div>
  );
}
