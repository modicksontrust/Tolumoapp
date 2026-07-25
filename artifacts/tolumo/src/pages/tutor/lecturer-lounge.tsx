import React, { useState, useRef, useEffect } from 'react';
import {
  Send, Shield, ChevronDown, Users, MessageCircle, Bell,
  X, CornerDownRight, Crown,
} from 'lucide-react';

// ── Lecturer-only rooms ───────────────────────────────────────────────────────
const LOUNGE_ROOMS = [
  { id: 'general',    label: 'General Discussion',        tagline: 'Open conversation for Tolumor lecturers' },
  { id: 'pedagogy',  label: 'Teaching Methods',           tagline: 'Pedagogy, assessment design, and classroom approaches' },
  { id: 'research',  label: 'Research & Publications',    tagline: 'Collaborate on research, share publications, find co-authors' },
  { id: 'platform',  label: 'Platform Feedback',          tagline: 'Ideas, bugs, and suggestions for the Tolumor platform' },
  { id: 'events',    label: 'Events & Conferences',       tagline: 'CFPs, conferences, seminars, and workshops' },
];

const CURRENT_LECTURER = {
  name: 'Prof. Oluwaseun Adeyemi',
  initials: 'OA',
  department: 'Constitutional & Administrative Law',
  institution: 'University of Lagos',
};

// ── Types ─────────────────────────────────────────────────────────────────────
type Reactions = Record<string, string[]>;

type LoungeMessage = {
  id: string;
  authorName: string;
  authorInitials: string;
  authorDept: string;
  authorInstitution: string;
  text: string;
  ts: number;
  removed?: boolean;
  reactions?: Reactions;
  replyToId?: string;
  replyToName?: string;
  replyToText?: string;
};

type LoungeNotif = { id: string; text: string; ts: number; read: boolean };

// ── Helpers ───────────────────────────────────────────────────────────────────
const EMOJIS = ['👍', '👎', '❤️', '🔥', '🎯'];

function formatTs(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function getThreadRoot(msgId: string, allMsgs: LoungeMessage[]): string {
  const msg = allMsgs.find(m => m.id === msgId);
  if (!msg?.replyToId) return msgId;
  return getThreadRoot(msg.replyToId, allMsgs);
}

// ── Seed data ─────────────────────────────────────────────────────────────────
const SEED_GENERAL: LoungeMessage[] = [
  {
    id: 'g1',
    authorName: 'Dr. Chidinma Okafor', authorInitials: 'CO',
    authorDept: 'Commercial Law', authorInstitution: 'University of Nigeria, Nsukka',
    text: 'Good to see the lecturer lounge up and running! I have been hoping for a space where we can talk shop without students present. For starters — is anyone else finding that students are significantly less prepared when they arrive at the tutorial booking stage than they used to be?',
    ts: Date.now() - 1000 * 60 * 180,
    reactions: { '👍': ['Prof. Oluwaseun Adeyemi', 'Dr. Amara Eze'], '🔥': ['Barrister Folake Balogun'] },
  },
  {
    id: 'g1-r1',
    authorName: 'Dr. Amara Eze', authorInitials: 'AE',
    authorDept: 'Criminal Law & Procedure', authorInstitution: 'Enugu State University',
    text: 'Yes, and I think it is partly because the module video does a lot of the heavy lifting. Students arrive having watched and passed the MCQ, but without having genuinely wrestled with the material. The AI Q&A tends to confirm what they already think rather than challenge it.',
    ts: Date.now() - 1000 * 60 * 162,
    reactions: { '🎯': ['Dr. Chidinma Okafor', 'Prof. Oluwaseun Adeyemi'] },
    replyToId: 'g1', replyToName: 'Dr. Chidinma Okafor',
    replyToText: 'Good to see the lecturer lounge up and running! I have been hoping for a space where we can talk shop without students present.',
  },
  {
    id: 'g1-r2',
    authorName: 'Prof. Oluwaseun Adeyemi', authorInitials: 'OA',
    authorDept: 'Constitutional & Administrative Law', authorInstitution: 'University of Lagos',
    text: 'I raised this with the platform team. One solution they are exploring is making the AI Q&A phase include Socratic-style follow-up questions rather than just confirmations — so the student has to defend their answer. Worth tracking. For now, I open every tutorial with a 5-minute cold call on the written test scenario before we discuss.',
    ts: Date.now() - 1000 * 60 * 140,
    reactions: { '👍': ['Dr. Chidinma Okafor', 'Dr. Amara Eze', 'Barrister Folake Balogun'] },
    replyToId: 'g1', replyToName: 'Dr. Chidinma Okafor',
    replyToText: 'Good to see the lecturer lounge up and running!',
  },
  {
    id: 'g2',
    authorName: 'Barrister Folake Balogun', authorInitials: 'FB',
    authorDept: 'Legal Drafting & Practice', authorInstitution: 'Ahmadu Bello University',
    text: 'The booking system is excellent — students pick their slot, I confirm, they get the link. Much cleaner than WhatsApp coordination. Only feedback: I would love the ability to add a pre-session reading requirement to the booking confirmation email.',
    ts: Date.now() - 1000 * 60 * 95,
    reactions: { '👍': ['Dr. Amara Eze', 'Dr. Chidinma Okafor'], '🎯': ['Prof. Oluwaseun Adeyemi'] },
  },
];

const SEED_PEDAGOGY: LoungeMessage[] = [
  {
    id: 'p1',
    authorName: 'Dr. Amara Eze', authorInitials: 'AE',
    authorDept: 'Criminal Law & Procedure', authorInstitution: 'Enugu State University',
    text: 'Has anyone experimented with flipped classroom approaches for the tutorial sessions? I am considering having students post their Part 2 answer attempt to the discussion thread before the tutorial, so we spend the session on critique and refinement rather than basic explanation.',
    ts: Date.now() - 1000 * 60 * 240,
    reactions: { '🔥': ['Prof. Oluwaseun Adeyemi', 'Barrister Folake Balogun'], '👍': ['Dr. Chidinma Okafor'] },
  },
  {
    id: 'p1-r1',
    authorName: 'Prof. Oluwaseun Adeyemi', authorInitials: 'OA',
    authorDept: 'Constitutional & Administrative Law', authorInstitution: 'University of Lagos',
    text: 'I tried something similar last term. The students who did the pre-work got significantly more out of the session. The challenge was getting all of them to actually post beforehand — about 30% held back because they did not want to be wrong in front of peers. Might be worth making it the grade trigger for booking.',
    ts: Date.now() - 1000 * 60 * 220,
    reactions: { '🎯': ['Dr. Amara Eze', 'Barrister Folake Balogun'] },
    replyToId: 'p1', replyToName: 'Dr. Amara Eze',
    replyToText: 'Has anyone experimented with flipped classroom approaches for the tutorial sessions?',
  },
  {
    id: 'p2',
    authorName: 'Barrister Folake Balogun', authorInitials: 'FB',
    authorDept: 'Legal Drafting & Practice', authorInstitution: 'Ahmadu Bello University',
    text: 'For the written IRAC test — I notice students over-narrate their facts and under-apply the law. I now give them a one-page model answer breakdown: Issue (1 sentence), Rule (2–3 sentences + citation), Application (5–7 sentences, fact-by-fact), Conclusion (1 sentence). Scoring is a checklist. Has anyone else moved toward rubric-based grading?',
    ts: Date.now() - 1000 * 60 * 180,
    reactions: { '👍': ['Dr. Amara Eze', 'Prof. Oluwaseun Adeyemi', 'Dr. Chidinma Okafor'], '🎯': ['Dr. Amara Eze'] },
  },
  {
    id: 'p2-r1',
    authorName: 'Dr. Chidinma Okafor', authorInitials: 'CO',
    authorDept: 'Commercial Law', authorInstitution: 'University of Nigeria, Nsukka',
    text: 'Yes and it changed everything. Students stopped asking "why did I lose marks" — the rubric makes it self-evident. I weight Application at 60% because that is where the real legal thinking shows up.',
    ts: Date.now() - 1000 * 60 * 155,
    reactions: { '🎯': ['Prof. Oluwaseun Adeyemi', 'Barrister Folake Balogun'] },
    replyToId: 'p2', replyToName: 'Barrister Folake Balogun',
    replyToText: 'For the written IRAC test — I notice students over-narrate their facts and under-apply the law.',
  },
];

const SEED_RESEARCH: LoungeMessage[] = [
  {
    id: 'r1',
    authorName: 'Prof. Oluwaseun Adeyemi', authorInitials: 'OA',
    authorDept: 'Constitutional & Administrative Law', authorInstitution: 'University of Lagos',
    text: 'I am working on a paper about the judicial treatment of the "covering the field" doctrine post-2020 in the Supreme Court. If anyone is researching overlapping areas (federal legislative competence, Section 4 CFRN, or state concurrent powers) and interested in co-authoring or citing, please reach out.',
    ts: Date.now() - 1000 * 60 * 300,
    reactions: { '🔥': ['Dr. Chidinma Okafor'], '👍': ['Dr. Amara Eze'] },
  },
  {
    id: 'r2',
    authorName: 'Dr. Chidinma Okafor', authorInitials: 'CO',
    authorDept: 'Commercial Law', authorInstitution: 'University of Nigeria, Nsukka',
    text: 'The Journal of African Law is accepting submissions for its 2026 issue on technology law and regulation in sub-Saharan Africa. Deadline is 30 September. I am submitting something on AI liability under Nigerian tort law. Happy to share the call for papers if useful.',
    ts: Date.now() - 1000 * 60 * 120,
    reactions: { '👍': ['Barrister Folake Balogun', 'Prof. Oluwaseun Adeyemi', 'Dr. Amara Eze'] },
  },
];

const SEED_PLATFORM: LoungeMessage[] = [
  {
    id: 'pl1',
    authorName: 'Barrister Folake Balogun', authorInitials: 'FB',
    authorDept: 'Legal Drafting & Practice', authorInstitution: 'Ahmadu Bello University',
    text: 'Feature request: I would love to see module-level analytics broken down by question — so I can see which MCQ options students are picking most often. Right now I only see the pass rate, but knowing that 60% of students chose option C on question 3 would tell me exactly where the misconception is.',
    ts: Date.now() - 1000 * 60 * 200,
    reactions: { '🔥': ['Prof. Oluwaseun Adeyemi', 'Dr. Amara Eze', 'Dr. Chidinma Okafor'] },
  },
  {
    id: 'pl1-r1',
    authorName: 'Dr. Amara Eze', authorInitials: 'AE',
    authorDept: 'Criminal Law & Procedure', authorInstitution: 'Enugu State University',
    text: 'This is exactly what I want too. Plus: seeing the distribution of Part 2 scores (not just pass/fail) so I can calibrate difficulty. A histogram would be enough.',
    ts: Date.now() - 1000 * 60 * 185,
    reactions: { '👍': ['Barrister Folake Balogun', 'Prof. Oluwaseun Adeyemi'] },
    replyToId: 'pl1', replyToName: 'Barrister Folake Balogun',
    replyToText: 'Feature request: I would love to see module-level analytics broken down by question.',
  },
  {
    id: 'pl2',
    authorName: 'Prof. Oluwaseun Adeyemi', authorInitials: 'OA',
    authorDept: 'Constitutional & Administrative Law', authorInstitution: 'University of Lagos',
    text: 'The Recent Updates banner for legal developments on topics is very good — I use it every time there is a Supreme Court decision relevant to my modules. One improvement: allow attachments (PDF of the judgment or a summary) rather than text only.',
    ts: Date.now() - 1000 * 60 * 90,
    reactions: { '👍': ['Dr. Chidinma Okafor', 'Barrister Folake Balogun', 'Dr. Amara Eze'] },
  },
];

const SEED_EVENTS: LoungeMessage[] = [
  {
    id: 'e1',
    authorName: 'Dr. Amara Eze', authorInitials: 'AE',
    authorDept: 'Criminal Law & Procedure', authorInstitution: 'Enugu State University',
    text: 'The Nigerian Institute of Advanced Legal Studies is hosting a two-day conference on "Legal Education Reform in the 21st Century" in Abuja, 18–19 September. Free registration for full-time academics. Particularly relevant given the platform discussions here. Link: nials.edu.ng/conference2026.',
    ts: Date.now() - 1000 * 60 * 360,
    reactions: { '👍': ['Prof. Oluwaseun Adeyemi', 'Barrister Folake Balogun'], '🔥': ['Dr. Chidinma Okafor'] },
  },
  {
    id: 'e2',
    authorName: 'Dr. Chidinma Okafor', authorInitials: 'CO',
    authorDept: 'Commercial Law', authorInstitution: 'University of Nigeria, Nsukka',
    text: 'Call for Papers — African Law Professors Association Annual Symposium. Theme: "Decolonising Legal Curricula: What Should Nigerian Law Schools Teach?" Submissions by 31 August. 300-word abstract to alpa.submissions@gmail.com.',
    ts: Date.now() - 1000 * 60 * 150,
    reactions: { '👍': ['Dr. Amara Eze', 'Prof. Oluwaseun Adeyemi'] },
  },
];

const SEED_BY_ROOM: Record<string, LoungeMessage[]> = {
  general:  SEED_GENERAL,
  pedagogy: SEED_PEDAGOGY,
  research: SEED_RESEARCH,
  platform: SEED_PLATFORM,
  events:   SEED_EVENTS,
};

const SEED_NOTIFS: LoungeNotif[] = [
  { id: 'lon1', text: 'Dr. Amara Eze replied to your message in General Discussion', ts: Date.now() - 1000 * 60 * 140, read: false },
  { id: 'lon2', text: 'Barrister Balogun 🎯 reacted to your post in Teaching Methods', ts: Date.now() - 1000 * 60 * 85, read: false },
];

// ── Sub-components ────────────────────────────────────────────────────────────
function LecturerAvatar({ name, initials, size = 'md' }: { name: string; initials: string; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-9 w-9 text-xs';
  const isMe = name === CURRENT_LECTURER.name;
  return (
    <div className={`${dim} rounded-full flex items-center justify-center shrink-0 font-bold
      ${isMe ? 'bg-[#1a4d35] text-white' : 'bg-stone-700 text-white'}`}
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
        const youReacted = reactors.includes(CURRENT_LECTURER.name);
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
  notifs: LoungeNotif[]; onMarkAll: () => void; onClose: () => void;
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
        <p className="font-bold text-sm text-foreground">Lounge Notifications</p>
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

function MessageBubble({
  msg, isOwn, isReply = false, onReact, onReply,
}: {
  msg: LoungeMessage; isOwn: boolean; isReply?: boolean;
  onReact: (id: string, emoji: string) => void;
  onReply: (msg: LoungeMessage) => void;
}) {
  return (
    <div className={`flex gap-2.5 group ${isOwn ? 'flex-row-reverse' : ''}`}>
      <LecturerAvatar name={msg.authorName} initials={msg.authorInitials} size={isReply ? 'sm' : 'md'} />
      <div className={`max-w-[78%] flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-center gap-1.5 flex-wrap ${isOwn ? 'justify-end' : ''}`}>
          <span className="text-xs font-bold text-foreground">{isOwn ? 'You' : msg.authorName}</span>
          {/* All participants are lecturers */}
          <span className="flex items-center gap-1 text-[10px] font-bold bg-[#1a4d35] text-white px-1.5 py-0.5 rounded-full">
            <Shield className="h-2.5 w-2.5" /> Lecturer
          </span>
          {!isReply && (
            <span className="text-[10px] text-muted-foreground">{msg.authorDept} · {msg.authorInstitution}</span>
          )}
          <span className="text-[10px] text-stone-300">·</span>
          <span className="text-[10px] text-muted-foreground">{formatTs(msg.ts)}</span>
        </div>

        <div className={`relative px-4 py-2.5 rounded-2xl text-sm leading-relaxed
          ${isOwn
            ? 'bg-[#1a4d35] text-white rounded-tr-sm'
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
export default function LecturerLounge() {
  const [roomId, setRoomId] = useState('general');
  const [roomPickerOpen, setRoomPickerOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, LoungeMessage[]>>(SEED_BY_ROOM);
  const [draft, setDraft] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string; name: string; text: string } | null>(null);
  const [notifs, setNotifs] = useState<LoungeNotif[]>(SEED_NOTIFS);
  const [notifOpen, setNotifOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const allRoomMsgs = (messages[roomId] ?? []).filter(m => !m.removed);
  const currentRoom = LOUNGE_ROOMS.find(r => r.id === roomId)!;
  const unreadCount = notifs.filter(n => !n.read).length;

  const topLevel = allRoomMsgs.filter(m => !m.replyToId);
  function threadReplies(rootId: string): LoungeMessage[] {
    return allRoomMsgs.filter(m => m.replyToId && getThreadRoot(m.id, allRoomMsgs) === rootId);
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allRoomMsgs.length, roomId]);

  function handleReply(msg: LoungeMessage) {
    setReplyingTo({ id: msg.id, name: msg.authorName, text: msg.text });
    textareaRef.current?.focus();
  }

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    const msg: LoungeMessage = {
      id: `ll-${Date.now()}`,
      authorName: CURRENT_LECTURER.name,
      authorInitials: CURRENT_LECTURER.initials,
      authorDept: CURRENT_LECTURER.department,
      authorInstitution: CURRENT_LECTURER.institution,
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
          reacts[emoji] = cur.includes(CURRENT_LECTURER.name)
            ? cur.filter(n => n !== CURRENT_LECTURER.name)
            : [...cur, CURRENT_LECTURER.name];
          return { ...m, reactions: reacts };
        }),
      };
    });
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100dvh-0px)] bg-[#fafaf9]">

      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-stone-800/10 flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-stone-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-serif font-bold text-foreground">{currentRoom.label}</h1>
                <span className="text-[10px] font-bold bg-stone-800 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Lecturer Lounge</span>
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
                  notifs={notifs}
                  onMarkAll={() => setNotifs(p => p.map(n => ({ ...n, read: true })))}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>

            <div className="relative">
              <button onClick={() => setRoomPickerOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm font-semibold text-foreground hover:bg-stone-50 transition-colors">
                Switch room <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {roomPickerOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-stone-200 w-64 overflow-hidden">
                  {LOUNGE_ROOMS.map(r => (
                    <button key={r.id} onClick={() => { setRoomId(r.id); setRoomPickerOpen(false); }}
                      className={`w-full text-left px-4 py-3 border-b border-stone-50 last:border-0 transition-colors ${r.id === roomId ? 'bg-[#1a4d35]/5 font-bold text-[#1a4d35]' : 'text-foreground hover:bg-stone-50'}`}>
                      <p className="text-sm">{r.label}</p>
                      <p className="text-[10px] text-muted-foreground font-normal mt-0.5">{r.tagline}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Privacy note */}
        <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
          <span className="font-semibold text-foreground">Lecturer-only space.</span> Students cannot view or access any content in the Lecturer Lounge. Connect, collaborate, and speak freely with colleagues across the platform.
        </p>
      </div>

      {/* Participants strip */}
      <div className="px-6 py-2.5 bg-white border-b border-stone-100 flex items-center gap-3">
        <div className="flex -space-x-2">
          {[
            { i: 'OA', name: 'Prof. Adeyemi' },
            { i: 'AE', name: 'Dr. Eze' },
            { i: 'CO', name: 'Dr. Okafor' },
            { i: 'FB', name: 'Barrister Balogun' },
          ].map(({ i, name }) => (
            <div key={i} title={name}
              className={`h-6 w-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold
                ${i === 'OA' ? 'bg-[#1a4d35] text-white' : 'bg-stone-700 text-white'}`}>
              {i}
            </div>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">4 lecturers in this lounge</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {topLevel.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <MessageCircle className="h-10 w-10 text-stone-300 mb-3" />
            <p className="font-semibold text-stone-500">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start the conversation with your colleagues.</p>
          </div>
        )}

        {topLevel.map(msg => {
          const replies = threadReplies(msg.id);
          const isOwn = msg.authorName === CURRENT_LECTURER.name;
          return (
            <div key={msg.id}>
              <MessageBubble msg={msg} isOwn={isOwn} onReact={handleReact} onReply={handleReply} />
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
                        isOwn={reply.authorName === CURRENT_LECTURER.name}
                        isReply
                        onReact={handleReact} onReply={handleReply}
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
          <LecturerAvatar name={CURRENT_LECTURER.name} initials={CURRENT_LECTURER.initials} />
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                if (e.key === 'Escape') setReplyingTo(null);
              }}
              placeholder={replyingTo ? `Reply to ${replyingTo.name}…` : `Post to ${currentRoom.label}…`}
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
