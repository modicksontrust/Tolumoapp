import React, { useState, useRef, useEffect } from 'react';
import { Crown, Send, Trash2, VolumeX, Shield, ChevronDown, Users, MessageCircle } from 'lucide-react';

// ── Year-group room config ───────────────────────────────────────────────────
const YEAR_ROOMS = [
  { id: '100', label: '100 Level', tagline: 'First-year law students across Nigeria' },
  { id: '200', label: '200 Level', tagline: 'Second-year law students across Nigeria' },
  { id: '300', label: '300 Level', tagline: 'Third-year law students across Nigeria' },
  { id: '400', label: '400 Level', tagline: 'Final-year law students across Nigeria' },
  { id: 'llm',  label: 'LLM / BL',  tagline: 'Postgraduate & Bar Part students across Nigeria' },
];

// The current student — in production this comes from Clerk user metadata
const CURRENT_STUDENT = {
  name: 'Chisom Nwosu',
  initials: 'CN',
  school: 'University of Lagos',
  year: '200',
  isVip: false,
};

// ── Seed messages ────────────────────────────────────────────────────────────
type Message = {
  id: string;
  authorName: string;
  authorInitials: string;
  authorSchool: string;
  authorYear: string;
  isVip: boolean;
  isLecturer?: boolean;
  text: string;
  ts: number; // unix ms
  removed?: boolean;
  muted?: boolean;
};

const SEED_200: Message[] = [
  {
    id: 'm1',
    authorName: 'Tunde Olatunji',
    authorInitials: 'TO',
    authorSchool: 'University of Ibadan',
    authorYear: '200',
    isVip: true,
    text: 'Has anyone else found the separation of powers topic in Module 2 particularly dense? I had to re-watch the video twice before it clicked for me. The diagram in the lecture notes helped a lot.',
    ts: Date.now() - 1000 * 60 * 47,
  },
  {
    id: 'm2',
    authorName: 'Adaeze Okonkwo',
    authorInitials: 'AO',
    authorSchool: 'University of Nigeria, Nsukka',
    authorYear: '200',
    isVip: false,
    text: 'Same! The diagram saved me honestly. Also, the AI Q&A on that topic is really helpful — I kept asking follow-up questions and it gave me very detailed answers with case references.',
    ts: Date.now() - 1000 * 60 * 40,
  },
  {
    id: 'm3',
    authorName: 'Fatima Bello',
    authorInitials: 'FB',
    authorSchool: 'Ahmadu Bello University',
    authorYear: '200',
    isVip: true,
    text: 'Quick reminder to everyone — the Part 2 written test requires you to apply the law to a scenario, not just define it. I failed first attempt by just defining "federalism". Apply it to the given facts!',
    ts: Date.now() - 1000 * 60 * 28,
  },
  {
    id: 'm4',
    authorName: 'Emeka Eze',
    authorInitials: 'EE',
    authorSchool: 'Enugu State University',
    authorYear: '200',
    isVip: false,
    text: 'That\'s such an important point Fatima, thank you! I passed the MCQs first try but the written section caught me off guard. The keyword matching is stricter than I expected.',
    ts: Date.now() - 1000 * 60 * 21,
  },
  {
    id: 'm5',
    authorName: 'Prof. Oluwaseun Adeyemi',
    authorInitials: 'OA',
    authorSchool: 'Tolumor Faculty',
    authorYear: '200',
    isVip: false,
    isLecturer: true,
    text: 'Great discussion here. For Part 2, think like a judge — you have the facts, identify the constitutional issue, cite the relevant provision, then apply it. IRAC method works perfectly. Keep pushing! 📚',
    ts: Date.now() - 1000 * 60 * 14,
  },
  {
    id: 'm6',
    authorName: 'Kelechi Amara',
    authorInitials: 'KA',
    authorSchool: 'Rivers State University',
    authorYear: '200',
    isVip: false,
    text: 'Does anyone know if the tutorial sessions with Prof. Adeyemi are recorded for later? I have a clash on the slot I wanted to book.',
    ts: Date.now() - 1000 * 60 * 7,
  },
  {
    id: 'm7',
    authorName: 'Tunde Olatunji',
    authorInitials: 'TO',
    authorSchool: 'University of Ibadan',
    authorYear: '200',
    isVip: true,
    text: '@Kelechi — yes! All sessions are auto-recorded and you get a replay link in My Tutorial Sessions for 6 months from the date. Just book whichever slot works, the recording will be there.',
    ts: Date.now() - 1000 * 60 * 3,
  },
];

const SEED_BY_ROOM: Record<string, Message[]> = {
  '100': [
    { id: 'r1m1', authorName: 'Sade Adeyemi', authorInitials: 'SA', authorSchool: 'OAU Ile-Ife', authorYear: '100', isVip: false, text: 'Just started the Introduction to Nigerian Legal System topic. The video is really well done! Is anyone else on Module 1?', ts: Date.now() - 1000 * 60 * 55 },
    { id: 'r1m2', authorName: 'Dayo Fashola', authorInitials: 'DF', authorSchool: 'Lagos State University', authorYear: '100', isVip: false, text: 'Yes! I\'m on Module 1 as well. The lecture notes after the video are very detailed — worth printing out if you can.', ts: Date.now() - 1000 * 60 * 35 },
  ],
  '200': SEED_200,
  '300': [
    { id: 'r3m1', authorName: 'Ngozi Obi', authorInitials: 'NO', authorSchool: 'UNIZIK Awka', authorYear: '300', isVip: true, text: 'Third year and still using Tolumor daily. The module progression system really keeps you accountable — love the streak counter.', ts: Date.now() - 1000 * 60 * 90 },
    { id: 'r3m2', authorName: 'Seun Abiodun', authorInitials: 'SA', authorSchool: 'University of Ilorin', authorYear: '300', isVip: false, text: 'Agreed. Also the Q&A AI is much better than I expected at referencing actual Nigerian statutes. Really useful for exam prep.', ts: Date.now() - 1000 * 60 * 45 },
  ],
  '400': [
    { id: 'r4m1', authorName: 'Chidera Ude', authorInitials: 'CU', authorSchool: 'University of Calabar', authorYear: '400', isVip: true, text: 'Final year vibes 🎓 Anyone else already thinking about Bar Part? The LLM/BL room is available too once we move up.', ts: Date.now() - 1000 * 60 * 120 },
  ],
  'llm': [
    { id: 'rllmm1', authorName: 'Barrister Amaka Osei', authorInitials: 'AO', authorSchool: 'Nigerian Law School, Abuja', authorYear: 'llm', isVip: true, text: 'Welcome to the postgrad room. Bar Part is tough but Tolumor\'s structured flow genuinely helps. Stick to the daily plan.', ts: Date.now() - 1000 * 60 * 200 },
  ],
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function formatTs(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function AuthorAvatar({ name, initials, isLecturer, isVip }: { name: string; initials: string; isLecturer?: boolean; isVip?: boolean }) {
  return (
    <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold
      ${isLecturer ? 'bg-[#1a4d35] text-white' : isVip ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-700'}`}
      title={name}
    >
      {initials}
    </div>
  );
}

// ── Moderation menu ──────────────────────────────────────────────────────────
// In production: only visible to lecturers/admins. Here we keep a simple toggle.
const IS_MODERATOR = false; // flip to true to preview mod tools

// ── Main community page ───────────────────────────────────────────────────────
export default function CommunityPage() {
  const assignedRoom = CURRENT_STUDENT.year;
  const [roomId, setRoomId] = useState(assignedRoom);
  const [roomPickerOpen, setRoomPickerOpen] = useState(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>(SEED_BY_ROOM);
  const [draft, setDraft] = useState('');
  const [mutedIds, setMutedIds] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);

  const roomMessages = (messages[roomId] ?? []).filter(m => !m.removed && !mutedIds.has(m.authorName));
  const currentRoom = YEAR_ROOMS.find(r => r.id === roomId)!;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages.length, roomId]);

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    const msg: Message = {
      id: `u-${Date.now()}`,
      authorName: CURRENT_STUDENT.name,
      authorInitials: CURRENT_STUDENT.initials,
      authorSchool: CURRENT_STUDENT.school,
      authorYear: CURRENT_STUDENT.year,
      isVip: CURRENT_STUDENT.isVip,
      text,
      ts: Date.now(),
    };
    setMessages(prev => ({ ...prev, [roomId]: [...(prev[roomId] ?? []), msg] }));
    setDraft('');
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

          {/* Room switcher — moderators can browse all rooms */}
          {IS_MODERATOR && (
            <div className="relative">
              <button
                onClick={() => setRoomPickerOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm font-semibold text-foreground hover:bg-stone-50 transition-colors"
              >
                Switch room <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {roomPickerOpen && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl shadow-xl border border-stone-200 w-56 overflow-hidden">
                  {YEAR_ROOMS.map(r => (
                    <button
                      key={r.id}
                      onClick={() => { setRoomId(r.id); setRoomPickerOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-stone-50 transition-colors ${r.id === roomId ? 'font-bold text-[#1a4d35]' : 'text-foreground'}`}
                    >
                      {r.label}
                      {r.id === assignedRoom && <span className="ml-2 text-[10px] text-muted-foreground">(yours)</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Conduct notice */}
        <p className="mt-3 text-[11px] text-muted-foreground leading-relaxed bg-stone-50 rounded-lg px-3 py-2 border border-stone-100">
          This is a peer-to-peer space for law students at the same stage. Be respectful and constructive.
          Lecturers and admins may view and moderate all rooms.
        </p>
      </div>

      {/* ── Message list ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {roomMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <MessageCircle className="h-10 w-10 text-stone-300 mb-3" />
            <p className="font-semibold text-stone-500">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">Be the first to start the conversation.</p>
          </div>
        )}

        {roomMessages.map((msg) => {
          const isOwn = msg.authorName === CURRENT_STUDENT.name;
          return (
            <div key={msg.id} className={`flex gap-3 group ${isOwn ? 'flex-row-reverse' : ''}`}>
              <AuthorAvatar
                name={msg.authorName}
                initials={msg.authorInitials}
                isLecturer={msg.isLecturer}
                isVip={msg.isVip}
              />
              <div className={`max-w-[78%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
                {/* Identity line */}
                <div className={`flex items-center gap-1.5 flex-wrap ${isOwn ? 'justify-end' : ''}`}>
                  <span className="text-xs font-bold text-foreground">
                    {isOwn ? 'You' : msg.authorName}
                  </span>
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
                  <span className="text-[10px] text-muted-foreground">{msg.authorSchool}</span>
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
                  {msg.text}

                  {/* Mod actions */}
                  {IS_MODERATOR && !isOwn && (
                    <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                      <button
                        onClick={() => removeMessage(msg.id)}
                        title="Remove message"
                        className="p-1 rounded-lg bg-white/80 hover:bg-red-50 text-red-500 hover:text-red-600 shadow border border-stone-200 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => muteAuthor(msg.authorName)}
                        title="Mute student"
                        className="p-1 rounded-lg bg-white/80 hover:bg-stone-100 text-stone-500 hover:text-stone-700 shadow border border-stone-200 transition-colors"
                      >
                        <VolumeX className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* ── Compose ── */}
      <div className="bg-white border-t border-stone-200 px-4 py-3 shrink-0">
        <div className="flex items-end gap-3">
          <AuthorAvatar
            name={CURRENT_STUDENT.name}
            initials={CURRENT_STUDENT.initials}
            isVip={CURRENT_STUDENT.isVip}
          />
          <div className="flex-1 relative">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder={`Message ${currentRoom.label} Community…`}
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
          Press Enter to send · Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}
