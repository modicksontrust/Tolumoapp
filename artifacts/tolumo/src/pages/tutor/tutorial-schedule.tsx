import { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, X, Pencil,
  CheckCircle2, Clock, Users, Video, Info,
  CreditCard, AlertTriangle, Play,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
type SessionStatus  = 'upcoming' | 'completed' | 'not_conducted' | 'cancelled';
type PaymentStatus  = 'held' | 'released' | 'refunded';

interface Session {
  id: string;
  day: DayKey;
  date: string;       // "Mon 28 Jul 2025"
  time: string;       // "6pm"
  topic: string;
  duration: string;   // "60 mins" | "90 mins" | "120 mins"
  capacity: number;
  price: number;      // ₦
  student?: string;
  status: SessionStatus;
  recordingUrl?: string;
  attended?: boolean;
  paymentStatus?: PaymentStatus;
}

interface Booking {
  id: string;
  sessionId: string;
  topic: string;
  date: string;
  time: string;
  duration: string;
  student: string;
  studentInitials: string;
  institution: string;
  paymentStatus: PaymentStatus;
  sessionStatus: SessionStatus;
  amount: number;
  joinLink: string;
}

interface DayAvailability {
  slots: string[];
  unavailable: boolean;
}

type Availability = Record<DayKey, DayAvailability>;

const DAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const TIMES = ['8am','9am','10am','11am','12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm'];
const DURATIONS = ['60 mins', '90 mins', '120 mins'];

const TOPICS = [
  'Origins of Nigerian Federalism', 'Supremacy of the Constitution',
  'Federalism & Devolution', 'Separation of Powers',
  'Fundamental Rights', 'Contract Law', 'Tort Law',
  'Criminal Law', 'Land Law', 'Equity & Trusts',
];

const SESSION_KEY  = 'tolumo_tutor_sessions';
const AVAIL_KEY    = 'tolumo_tutor_avail';
const BOOKING_KEY  = 'tolumo_tutor_bookings';

// ── Seed data ─────────────────────────────────────────────────────────────────
const DEFAULT_SESSIONS: Session[] = [
  { id: '1', day: 'Mon', date: 'Mon 28 Jul 2025', time: '6pm', topic: 'Federalism & Devolution', duration: '90 mins', capacity: 8, price: 3500, student: 'Chisom Nwosu',     status: 'upcoming' },
  { id: '2', day: 'Wed', date: 'Wed 30 Jul 2025', time: '5pm', topic: 'Contract Law',             duration: '90 mins', capacity: 8, price: 3500, student: 'Babatunde Okafor', status: 'upcoming' },
  { id: '3', day: 'Thu', date: 'Thu 31 Jul 2025', time: '6pm', topic: 'Federalism & Devolution', duration: '90 mins', capacity: 8, price: 3500, student: 'Amina Ibrahim',    status: 'upcoming' },
  { id: '4', day: 'Mon', date: 'Mon 21 Jul 2025', time: '10am', topic: 'Separation of Powers',   duration: '60 mins', capacity: 6, price: 2500, student: 'Emeka Okafor',    status: 'completed', attended: true,  paymentStatus: 'released', recordingUrl: 'https://recordings.tolumo.ng/sep-powers-jul21' },
  { id: '5', day: 'Tue', date: 'Tue 22 Jul 2025', time: '2pm',  topic: 'Contract Law',           duration: '90 mins', capacity: 8, price: 3500, student: 'Chisom Nwosu',   status: 'not_conducted', attended: false, paymentStatus: 'refunded', recordingUrl: '' },
];

const DEFAULT_BOOKINGS: Booking[] = [
  { id: 'b1', sessionId: '1', topic: 'Federalism & Devolution', date: 'Mon 28 Jul 2025', time: '6:00 PM', duration: '90 mins', student: 'Chisom Nwosu',     studentInitials: 'CN', institution: 'UNILAG',  paymentStatus: 'held',     sessionStatus: 'upcoming',       amount: 3500, joinLink: 'https://meet.tolumo.ng/fed-jul28-cn' },
  { id: 'b2', sessionId: '2', topic: 'Contract Law',             date: 'Wed 30 Jul 2025', time: '5:00 PM', duration: '90 mins', student: 'Babatunde Okafor', studentInitials: 'BO', institution: 'UniPort', paymentStatus: 'held',     sessionStatus: 'upcoming',       amount: 3500, joinLink: 'https://meet.tolumo.ng/contract-jul30-bo' },
  { id: 'b3', sessionId: '3', topic: 'Federalism & Devolution', date: 'Thu 31 Jul 2025', time: '6:00 PM', duration: '90 mins', student: 'Amina Ibrahim',    studentInitials: 'AI', institution: 'ABU',     paymentStatus: 'held',     sessionStatus: 'upcoming',       amount: 3500, joinLink: 'https://meet.tolumo.ng/fed-jul31-ai' },
  { id: 'b4', sessionId: '4', topic: 'Separation of Powers',    date: 'Mon 21 Jul 2025', time: '10:00 AM', duration: '60 mins', student: 'Emeka Okafor',    studentInitials: 'EO', institution: 'UniPort', paymentStatus: 'released', sessionStatus: 'completed',      amount: 2500, joinLink: 'https://meet.tolumo.ng/sep-jul21-eo' },
  { id: 'b5', sessionId: '5', topic: 'Contract Law',             date: 'Tue 22 Jul 2025', time: '2:00 PM',  duration: '90 mins', student: 'Chisom Nwosu',   studentInitials: 'CN', institution: 'UNILAG',  paymentStatus: 'refunded', sessionStatus: 'not_conducted', amount: 3500, joinLink: 'https://meet.tolumo.ng/contract-jul22-cn' },
];

const DEFAULT_AVAIL: Availability = {
  Mon: { slots: ['9am–12pm', '2pm–5pm'], unavailable: false },
  Tue: { slots: ['10am–1pm'],            unavailable: false },
  Wed: { slots: [],                      unavailable: true  },
  Thu: { slots: ['6pm–8pm'],             unavailable: false },
  Fri: { slots: ['2pm–5pm'],             unavailable: false },
};

const PAST_SESSIONS_DETAIL = [
  {
    id: 'p1', module: 'Constitutional Law',
    title: 'Federalism & the Second Schedule — Deep Dive',
    scheduledStart: 'Thu 10 Jul 2025 · 6:00 PM', joinedAt: '5:58 PM', punctuality: 'Early' as const,
    studentsAttended: 6, avgRating: 4.8, totalRatings: 19,
    onTimeEarly: 4, late: 2, stayedFull: 5,
    recordingUrl: 'https://recordings.tolumo.ng/fed-deep-jul10',
    recordingExpires: '10 Jan 2026',
  },
  {
    id: 'p2', module: 'Constitutional Law',
    title: 'Supremacy of the Constitution',
    scheduledStart: 'Thu 3 Jul 2025 · 6:00 PM', joinedAt: '6:00 PM', punctuality: 'On Time' as const,
    studentsAttended: 4, avgRating: 4.9, totalRatings: 16,
    onTimeEarly: 3, late: 1, stayedFull: 4,
    recordingUrl: 'https://recordings.tolumo.ng/supremacy-jul3',
    recordingExpires: '3 Jan 2026',
  },
];

// ── Loaders ───────────────────────────────────────────────────────────────────
function loadSessions(): Session[] {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || '') || DEFAULT_SESSIONS; }
  catch { return DEFAULT_SESSIONS; }
}
function loadAvail(): Availability {
  try { return JSON.parse(localStorage.getItem(AVAIL_KEY) || '') || DEFAULT_AVAIL; }
  catch { return DEFAULT_AVAIL; }
}
function loadBookings(): Booking[] {
  try { return JSON.parse(localStorage.getItem(BOOKING_KEY) || '') || DEFAULT_BOOKINGS; }
  catch { return DEFAULT_BOOKINGS; }
}

// ── Week helpers ──────────────────────────────────────────────────────────────
function getWeekDates(offset: number) {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);
  return DAYS.map((d, i) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    return { key: d, date: dt.getDate(), month: dt.toLocaleString('en', { month: 'short' }) };
  });
}

function cardStyle(idx: number) {
  const styles = [
    { bg: 'bg-primary', text: 'text-white' },
    { bg: 'bg-accent',  text: 'text-white' },
    { bg: 'bg-primary/80', text: 'text-white' },
    { bg: 'bg-stone-600',  text: 'text-white' },
  ];
  return styles[idx % styles.length];
}

// ── Badges ────────────────────────────────────────────────────────────────────
function PaymentBadge({ status }: { status: PaymentStatus }) {
  const map: Record<PaymentStatus, { cls: string; label: string }> = {
    held:     { cls: 'bg-amber-100 text-amber-700 border-amber-200',   label: 'Held' },
    released: { cls: 'bg-green-100 text-green-700 border-green-200',   label: 'Released' },
    refunded: { cls: 'bg-stone-100 text-stone-600 border-stone-200',   label: 'Refunded' },
  };
  const { cls, label } = map[status];
  return <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${cls}`}>{label}</span>;
}

function SessionBadge({ status }: { status: SessionStatus }) {
  const map: Record<SessionStatus, { cls: string; label: string }> = {
    upcoming:      { cls: 'bg-blue-100 text-blue-700 border-blue-200',   label: 'Upcoming' },
    completed:     { cls: 'bg-green-100 text-green-700 border-green-200', label: 'Completed' },
    not_conducted: { cls: 'bg-red-100 text-red-700 border-red-200',       label: 'Not Conducted' },
    cancelled:     { cls: 'bg-stone-100 text-stone-600 border-stone-200', label: 'Cancelled' },
  };
  const { cls, label } = map[status];
  return <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full border ${cls}`}>{label}</span>;
}

// ── Create Session Modal ──────────────────────────────────────────────────────
function CreateSessionModal({ prefillDay, onSave, onClose }: {
  prefillDay?: DayKey;
  onSave: (s: Omit<Session, 'id'>) => void;
  onClose: () => void;
}) {
  const [day,      setDay]      = useState<DayKey>(prefillDay || 'Mon');
  const [date,     setDate]     = useState('');
  const [time,     setTime]     = useState('6pm');
  const [topic,    setTopic]    = useState(TOPICS[0]);
  const [duration, setDuration] = useState('90 mins');
  const [capacity, setCapacity] = useState(8);
  const [price,    setPrice]    = useState(3500);
  const [student,  setStudent]  = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ day, date, time, topic, duration, capacity, price, student, status: 'upcoming' });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 sticky top-0 bg-white z-10">
          <h3 className="font-serif font-bold text-lg">Create Tutorial Slot</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          {/* Topic */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Topic</label>
            <select value={topic} onChange={e => setTopic(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary appearance-none">
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Day + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Day</label>
              <select value={day} onChange={e => setDay(e.target.value as DayKey)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary appearance-none">
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Full Date <span className="normal-case font-normal tracking-normal">(e.g. Mon 4 Aug 2025)</span>
              </label>
              <input value={date} onChange={e => setDate(e.target.value)} placeholder="Mon 4 Aug 2025"
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          {/* Time + Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Start Time</label>
              <select value={time} onChange={e => setTime(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary appearance-none">
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Duration</label>
              <select value={duration} onChange={e => setDuration(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary appearance-none">
                {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          {/* Capacity + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Student Capacity</label>
              <input type="number" min={1} max={20} value={capacity} onChange={e => setCapacity(+e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Price per Student (₦)</label>
              <input type="number" min={0} step={500} value={price} onChange={e => setPrice(+e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          {/* Student (optional) */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Student Name <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">(optional — leave blank for open booking)</span>
            </label>
            <input value={student} onChange={e => setStudent(e.target.value)} placeholder="e.g. Chisom Nwosu"
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>

          {/* Record notice */}
          <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3 text-xs text-amber-800">
            <span className="font-semibold">Auto-recorded:</span> All sessions are recorded automatically. No opt-in required.
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm font-semibold hover:bg-stone-50 transition-colors">Cancel</button>
            <button type="submit" style={{ backgroundColor: 'hsl(153,54%,15%)' }}
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">Create Slot</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit Availability Modal ───────────────────────────────────────────────────
function EditAvailModal({ day, current, onSave, onClose }: {
  day: DayKey; current: DayAvailability;
  onSave: (a: DayAvailability) => void; onClose: () => void;
}) {
  const [slots,   setSlots]   = useState(current.slots.join('\n'));
  const [unavail, setUnavail] = useState(current.unavailable);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ slots: unavail ? [] : slots.split('\n').map(s => s.trim()).filter(Boolean), unavailable: unavail });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="font-serif font-bold text-lg">Edit {day} Availability</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={unavail} onChange={e => setUnavail(e.target.checked)} className="rounded border-stone-300" />
            <span className="text-sm font-medium">Mark as Unavailable</span>
          </label>
          {!unavail && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Time Slots <span className="normal-case font-normal tracking-normal">(one per line, e.g. 9am–12pm)</span>
              </label>
              <textarea value={slots} onChange={e => setSlots(e.target.value)} rows={4} placeholder="9am–12pm&#10;2pm–5pm"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm font-semibold hover:bg-stone-50">Cancel</button>
            <button type="submit" style={{ backgroundColor: 'hsl(153,54%,15%)' }} className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white hover:opacity-90">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Avail Row ─────────────────────────────────────────────────────────────────
function AvailRow({ day, info }: { day: DayKey; info: DayAvailability }) {
  const [editing, setEditing] = useState(false);
  const [local,   setLocal]   = useState(info);

  function save(a: DayAvailability) {
    setLocal(a);
    window.dispatchEvent(new CustomEvent('tolumo:avail', { detail: { day, avail: a } }));
  }

  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-foreground w-24 shrink-0">{day}</p>
        <div className="flex-1">
          {local.unavailable ? (
            <p className="text-xs text-muted-foreground">Unavailable</p>
          ) : local.slots.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No slots set</p>
          ) : (
            <div className="space-y-0.5">
              {local.slots.map(s => (
                <span key={s} className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full mr-1">{s}</span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-primary transition-colors shrink-0">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
      {editing && <EditAvailModal day={day} current={local} onSave={save} onClose={() => setEditing(false)} />}
    </>
  );
}

// ── Tab 1: Schedule (calendar) ────────────────────────────────────────────────
function ScheduleTab({ sessions, avail, weekOffset, onWeekChange, onCreateAt, onDeleteSession }: {
  sessions: Session[]; avail: Availability; weekOffset: number;
  onWeekChange: (n: number) => void;
  onCreateAt: (day: DayKey) => void;
  onDeleteSession: (id: string) => void;
}) {
  const weekDates = getWeekDates(weekOffset);
  const upcoming  = sessions.filter(s => s.status === 'upcoming');

  const weekLabel = (() => {
    const dates = getWeekDates(weekOffset);
    return `Week of ${dates[0].date}–${dates[4].date} ${dates[0].month} ${new Date().getFullYear()}`;
  })();

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-6">
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="font-serif font-semibold text-foreground">{weekLabel}</h2>
          <div className="flex items-center gap-1">
            <button onClick={() => onWeekChange(weekOffset - 1)} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-muted-foreground transition-colors"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={() => onWeekChange(weekOffset + 1)} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-muted-foreground transition-colors"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="grid grid-cols-5 divide-x divide-stone-100 min-h-[240px]">
          {weekDates.map(({ key, date, month }) => {
            const daySessions = upcoming.filter(s => s.day === key);
            return (
              <div key={key} className="flex flex-col p-3 gap-2">
                <div className="text-center mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{key} {date}</p>
                </div>
                {daySessions.map((s, i) => {
                  const { bg, text } = cardStyle(i);
                  return (
                    <div key={s.id} className={`${bg} ${text} rounded-lg p-2 text-xs relative group`}>
                      <p className="font-bold">{s.time}</p>
                      <p className="truncate">{s.topic.split(' ').slice(0, 2).join(' ')}</p>
                      <p className="text-[9px] opacity-70">₦{s.price.toLocaleString()} · {s.capacity} seats</p>
                      <button onClick={() => onDeleteSession(s.id)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 rounded-full bg-white/20 flex items-center justify-center">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  );
                })}
                <button onClick={() => onCreateAt(key)}
                  className="mt-auto mx-auto h-6 w-6 rounded-full border border-stone-200 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-5">
        <h3 className="font-serif font-semibold text-foreground mb-4">My Availability</h3>
        <div className="space-y-3">
          {(Object.entries(avail) as [DayKey, DayAvailability][]).map(([day, info]) => (
            <AvailRow key={day} day={day} info={info} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Tab 2: Bookings Overview ──────────────────────────────────────────────────
function BookingsTab({ bookings, onMarkComplete, onMarkNotConducted }: {
  bookings: Booking[];
  onMarkComplete: (id: string) => void;
  onMarkNotConducted: (id: string) => void;
}) {
  const [topicFilter, setTopicFilter] = useState('All');
  const topics = ['All', ...Array.from(new Set(bookings.map(b => b.topic)))];
  const filtered = topicFilter === 'All' ? bookings : bookings.filter(b => b.topic === topicFilter);

  return (
    <div className="space-y-5">
      {/* Filter */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-sm font-semibold text-foreground shrink-0">Filter by topic:</p>
        <div className="flex gap-2 flex-wrap">
          {topics.map(t => (
            <button key={t} onClick={() => setTopicFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${topicFilter === t ? 'bg-[#1a4d35] text-white' : 'bg-stone-100 text-muted-foreground hover:bg-stone-200'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings list */}
      <div className="space-y-3">
        {filtered.map(b => (
          <div key={b.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 flex items-start gap-4 flex-wrap">
              {/* Student */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-full bg-[#1a4d35]/10 flex items-center justify-center shrink-0">
                  <span className="text-[#1a4d35] font-bold text-xs">{b.studentInitials}</span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm">{b.student}</p>
                  <p className="text-xs text-muted-foreground">{b.institution}</p>
                </div>
              </div>
              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{b.topic}</p>
                <p className="text-xs text-muted-foreground">{b.date} · {b.time} · {b.duration}</p>
              </div>
              {/* Badges + amount */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="flex gap-1.5">
                  <SessionBadge status={b.sessionStatus} />
                  <PaymentBadge status={b.paymentStatus} />
                </div>
                <p className="text-sm font-bold text-foreground">₦{b.amount.toLocaleString()}</p>
              </div>
            </div>

            {/* Actions row */}
            <div className="px-5 py-3 border-t border-stone-50 bg-stone-50/60 flex items-center gap-3 flex-wrap">
              {/* Join link */}
              <a href={b.joinLink} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                <Video className="h-3.5 w-3.5" /> Join Link
              </a>

              {/* Mark actions (only for upcoming bookings) */}
              {b.sessionStatus === 'upcoming' && (
                <>
                  <button onClick={() => onMarkComplete(b.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-colors">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                  </button>
                  <button onClick={() => onMarkNotConducted(b.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors">
                    <AlertTriangle className="h-3.5 w-3.5" /> Not Conducted
                  </button>
                </>
              )}
              {b.sessionStatus === 'completed' && (
                <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Payout released · ₦{b.amount.toLocaleString()}
                </span>
              )}
              {b.sessionStatus === 'not_conducted' && (
                <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5" /> Student refunded
                </span>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No bookings for this topic yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Tab 3: Payments ───────────────────────────────────────────────────────────
function PaymentsTab({ bookings }: { bookings: Booking[] }) {
  const held     = bookings.filter(b => b.paymentStatus === 'held');
  const released = bookings.filter(b => b.paymentStatus === 'released');
  const refunded = bookings.filter(b => b.paymentStatus === 'refunded');

  const totalHeld     = held.reduce((s, b) => s + b.amount, 0);
  const totalReleased = released.reduce((s, b) => s + b.amount, 0);
  const totalRefunded = refunded.reduce((s, b) => s + b.amount, 0);

  const stats = [
    { label: 'Held (Pending Sessions)',   value: `₦${totalHeld.toLocaleString()}`,     sub: `${held.length} booking${held.length !== 1 ? 's' : ''}`,     color: 'text-amber-600' },
    { label: 'Released (Earned)',          value: `₦${totalReleased.toLocaleString()}`, sub: `${released.length} session${released.length !== 1 ? 's' : ''} completed`, color: 'text-green-600' },
    { label: 'Refunded',                   value: `₦${totalRefunded.toLocaleString()}`, sub: `${refunded.length} session${refunded.length !== 1 ? 's' : ''} not conducted`, color: 'text-stone-500' },
  ];

  return (
    <div className="space-y-5">
      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {stats.map(({ label, value, sub, color }) => (
          <div key={label} className="bg-white rounded-xl border border-stone-200 shadow-sm px-5 py-4">
            <p className="text-xs text-muted-foreground mb-1">{label}</p>
            <p className={`text-2xl font-bold font-serif ${color}`}>{value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Payment terms note */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl px-5 py-3.5">
        <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 leading-relaxed">
          <span className="font-semibold">How payouts work:</span> Student payments are held securely by the platform until you mark a session as completed. Marking it complete triggers the payout release immediately. Marking it as not conducted triggers an automatic full refund to the student — no manual action needed.
        </p>
      </div>

      {/* Transaction table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <p className="font-semibold text-foreground">All Transactions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-stone-100">
                {['Student', 'Topic', 'Date', 'Amount', 'Payment', 'Session'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-[#1a4d35]/10 flex items-center justify-center shrink-0">
                        <span className="text-[#1a4d35] text-[10px] font-bold">{b.studentInitials}</span>
                      </div>
                      <span className="font-medium text-foreground">{b.student}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground text-xs">{b.topic}</td>
                  <td className="px-5 py-3 text-foreground text-xs">{b.date}</td>
                  <td className="px-5 py-3 font-bold text-foreground">₦{b.amount.toLocaleString()}</td>
                  <td className="px-5 py-3"><PaymentBadge status={b.paymentStatus} /></td>
                  <td className="px-5 py-3"><SessionBadge status={b.sessionStatus} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Tab 4: Previous Tutorials ─────────────────────────────────────────────────
function PreviousTutorialsTab({ sessions: _sessions }: { sessions: Session[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const stats = [
    { label: 'Sessions Conducted',      value: '2',        color: 'text-foreground' },
    { label: 'Started On Time / Early', value: '2 / 2',    color: 'text-primary' },
    { label: 'Reliability Score',       value: '100%',     color: 'text-green-600' },
    { label: 'Avg Student Rating',      value: '4.85 / 5', color: 'text-amber-500' },
  ];

  const STUDENT_ROWS = [
    { name: 'Chisom Nwosu',     initials: 'CN', institution: 'UNILAG',  joinedAt: '5:57 PM', status: 'Early'   as const, stayed: true  },
    { name: 'Emeka Okafor',     initials: 'EO', institution: 'UniPort', joinedAt: '6:01 PM', status: 'Late'    as const, stayed: true  },
    { name: 'Amara Diallo',     initials: 'AD', institution: 'UNN',     joinedAt: '6:00 PM', status: 'On Time' as const, stayed: true  },
    { name: 'Ngozi Eze',        initials: 'NE', institution: 'OAU',     joinedAt: '5:58 PM', status: 'Early'   as const, stayed: true  },
    { name: 'Babatunde Okafor', initials: 'BO', institution: 'ABU',     joinedAt: '6:03 PM', status: 'Late'    as const, stayed: false },
    { name: 'Tunde Adeleke',    initials: 'TA', institution: 'LASU',    joinedAt: '5:59 PM', status: 'Early'   as const, stayed: true  },
  ];

  return (
    <div className="space-y-5">
      {/* Retention policy notice */}
      <div className="flex items-start gap-3 bg-stone-100 border border-stone-200 rounded-xl px-5 py-3.5">
        <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Recording policy:</span> Every session is recorded automatically — no opt-in required. Recordings remain available for{' '}
          <strong className="text-foreground">6 months from the session date</strong>, after which they are automatically and permanently deleted. Both you and your student can access the recording within 2 hours of the session ending.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl border border-stone-200 shadow-sm px-5 py-4 text-center">
            <p className={`text-2xl font-bold font-serif ${color}`}>{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Past session cards */}
      {PAST_SESSIONS_DETAIL.map(ps => (
        <div key={ps.id} className="rounded-xl overflow-hidden border border-stone-200 shadow-sm">
          <div className="bg-primary px-6 py-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">{ps.module} · Previous Tutorial</p>
              <h3 className="font-serif font-bold text-white text-lg leading-snug">{ps.title}</h3>
            </div>
            <span className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
              ps.punctuality === 'Early'
                ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                : 'bg-white/10 text-white/70 border border-white/20'
            }`}>You: {ps.punctuality}</span>
          </div>

          <div className="bg-white px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Scheduled Start',   value: ps.scheduledStart },
                { label: 'You Joined At',     value: ps.joinedAt },
                { label: 'Students Attended', value: `${ps.studentsAttended} students` },
                { label: 'Avg Rating',        value: `${ps.avgRating} / 5 (${ps.totalRatings} ratings)` },
              ].map(({ label, value }) => (
                <div key={label} className="bg-[#F5F2EB] rounded-lg px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                  <p className="text-sm font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>

            {/* Attendance dots */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500 inline-block" />{ps.onTimeEarly} on-time / early</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-red-400 inline-block" />{ps.late} late</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-stone-400 inline-block" />{ps.stayedFull} stayed full</span>
            </div>

            {/* Recording */}
            <div className="rounded-lg bg-stone-50 border border-stone-100 px-4 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-foreground flex items-center gap-1.5"><Video className="h-3.5 w-3.5 text-muted-foreground" />Session Recording</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Available until {ps.recordingExpires} · deleted permanently after 6 months</p>
              </div>
              <a href={ps.recordingUrl}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1a4d35] text-white text-xs font-bold hover:bg-[#1a4d35]/90 transition-colors">
                <Play className="h-3 w-3 fill-white" /> Watch
              </a>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-5 pt-1">
              <button onClick={() => setExpanded(expanded === ps.id ? null : ps.id)}
                className="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors">
                <Users className="h-4 w-4" />
                View Attendance Detail
                <ChevronRight className={`h-4 w-4 transition-transform ${expanded === ps.id ? 'rotate-90' : ''}`} />
              </button>
            </div>

            {/* Expanded attendance */}
            {expanded === ps.id && (
              <div className="border-t border-stone-100 pt-4 -mx-6 px-6 overflow-x-auto">
                <table className="w-full text-sm min-w-[560px]">
                  <thead>
                    <tr className="border-b border-stone-100">
                      {['Student', 'Institution', 'Joined At', 'Punctuality', 'Stayed Full'].map(h => (
                        <th key={h} className="text-left pb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground pr-4 last:pr-0">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {STUDENT_ROWS.slice(0, ps.studentsAttended).map(s => (
                      <tr key={s.name} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-bold text-primary">{s.initials}</span>
                            </div>
                            <span className="font-medium text-foreground">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground text-xs">{s.institution}</td>
                        <td className="py-3 pr-4 font-semibold text-foreground">{s.joinedAt}</td>
                        <td className="py-3 pr-4">
                          <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            s.status === 'Late' ? 'bg-red-100 text-red-600' : s.status === 'Early' ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'
                          }`}>{s.status}</span>
                        </td>
                        <td className="py-3">
                          {s.stayed
                            ? <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle2 className="h-4 w-4" />Yes</span>
                            : <span className="text-muted-foreground text-sm">—</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
type Tab = 'schedule' | 'bookings' | 'payments' | 'previous';

export default function TutorialSchedule() {
  const [sessions, setSessions] = useState<Session[]>(loadSessions);
  const [avail,    setAvail]    = useState<Availability>(loadAvail);
  const [bookings, setBookings] = useState<Booking[]>(loadBookings);
  const [tab,      setTab]      = useState<Tab>('schedule');
  const [weekOffset, setWeekOffset]   = useState(0);
  const [createModal, setCreateModal] = useState<{ open: boolean; day?: DayKey }>({ open: false });

  useEffect(() => { localStorage.setItem(SESSION_KEY,  JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem(AVAIL_KEY,    JSON.stringify(avail));    }, [avail]);
  useEffect(() => { localStorage.setItem(BOOKING_KEY,  JSON.stringify(bookings)); }, [bookings]);

  useEffect(() => {
    const handler = (e: Event) => {
      const { day, avail: a } = (e as CustomEvent).detail;
      setAvail(prev => ({ ...prev, [day]: a }));
    };
    window.addEventListener('tolumo:avail', handler);
    return () => window.removeEventListener('tolumo:avail', handler);
  }, []);

  function addSession(s: Omit<Session, 'id'>) {
    setSessions(prev => [...prev, { ...s, id: Date.now().toString() }]);
  }
  function deleteSession(id: string) {
    setSessions(prev => prev.filter(s => s.id !== id));
  }
  function markComplete(bookingId: string) {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, sessionStatus: 'completed', paymentStatus: 'released' } : b
    ));
  }
  function markNotConducted(bookingId: string) {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, sessionStatus: 'not_conducted', paymentStatus: 'refunded' } : b
    ));
  }

  const TABS: { key: Tab; label: string }[] = [
    { key: 'schedule',  label: 'Schedule' },
    { key: 'bookings',  label: 'Bookings' },
    { key: 'payments',  label: 'Payments' },
    { key: 'previous',  label: 'Previous Tutorials' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Tutorial Schedule</h1>
        <button onClick={() => setCreateModal({ open: true })}
          style={{ backgroundColor: 'hsl(153,54%,15%)' }}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Create New Slot
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit mb-6 flex-wrap">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'schedule' && (
        <ScheduleTab sessions={sessions} avail={avail} weekOffset={weekOffset}
          onWeekChange={setWeekOffset} onCreateAt={day => setCreateModal({ open: true, day })}
          onDeleteSession={deleteSession} />
      )}
      {tab === 'bookings' && (
        <BookingsTab bookings={bookings} onMarkComplete={markComplete} onMarkNotConducted={markNotConducted} />
      )}
      {tab === 'payments' && <PaymentsTab bookings={bookings} />}
      {tab === 'previous' && <PreviousTutorialsTab sessions={sessions} />}

      {/* Create modal */}
      {createModal.open && (
        <CreateSessionModal prefillDay={createModal.day} onSave={addSession} onClose={() => setCreateModal({ open: false })} />
      )}
    </div>
  );
}
