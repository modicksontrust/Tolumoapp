import { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Plus, X, Pencil,
  CheckCircle2, Clock, Users, Video,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type DayKey = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

interface Session {
  id: string;
  day: DayKey;
  time: string;       // e.g. "6pm"
  topic: string;
  student?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  recordingUrl?: string;
  attended?: boolean;
}

interface DayAvailability {
  slots: string[];    // e.g. ["9am–12pm", "2pm–5pm"]
  unavailable: boolean;
}

type Availability = Record<DayKey, DayAvailability>;

const DAYS: DayKey[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const TIMES = [
  '8am', '9am', '10am', '11am', '12pm',
  '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm',
];

const TOPICS = [
  'Origins of Nigerian Federalism',
  'Supremacy of the Constitution',
  'Federalism & Devolution',
  'Separation of Powers',
  'Fundamental Rights',
  'Contract Law',
  'Tort Law',
  'Criminal Law',
  'Land Law',
  'Equity & Trusts',
];

const SESSION_KEY = 'tolumo_tutor_sessions';
const AVAIL_KEY   = 'tolumo_tutor_avail';

// ── Defaults ──────────────────────────────────────────────────────────────────
const DEFAULT_SESSIONS: Session[] = [
  { id: '1', day: 'Mon', time: '6pm', topic: 'Federalism & Devolution',   student: 'Chisom Nwosu',    status: 'upcoming' },
  { id: '2', day: 'Wed', time: '5pm', topic: 'Contract Law',              student: 'Babatunde Okafor', status: 'upcoming' },
  { id: '3', day: 'Thu', time: '6pm', topic: 'Federalism & Devolution',   student: 'Amina Ibrahim',   status: 'upcoming' },
  { id: '4', day: 'Mon', time: '10am', topic: 'Separation of Powers',     student: 'Emeka Okafor',    status: 'completed', attended: true,  recordingUrl: '#' },
  { id: '5', day: 'Tue', time: '2pm',  topic: 'Contract Law',             student: 'Chisom Nwosu',    status: 'completed', attended: false, recordingUrl: '#' },
];

const DEFAULT_AVAIL: Availability = {
  Mon: { slots: ['9am–12pm', '2pm–5pm'], unavailable: false },
  Tue: { slots: ['10am–1pm'],            unavailable: false },
  Wed: { slots: [],                      unavailable: true  },
  Thu: { slots: ['6pm–8pm'],             unavailable: false },
  Fri: { slots: ['2pm–5pm'],             unavailable: false },
};

function loadSessions(): Session[] {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || '') || DEFAULT_SESSIONS; }
  catch { return DEFAULT_SESSIONS; }
}
function loadAvail(): Availability {
  try { return JSON.parse(localStorage.getItem(AVAIL_KEY) || '') || DEFAULT_AVAIL; }
  catch { return DEFAULT_AVAIL; }
}

// ── Helper: get Mon–Fri dates for a week offset ───────────────────────────────
function getWeekDates(offset: number) {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + offset * 7);

  return DAYS.map((d, i) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    return { key: d, date: dt.getDate(), month: dt.toLocaleString('en', { month: 'short' }) };
  });
}

// ── Session card colours ──────────────────────────────────────────────────────
function cardStyle(idx: number) {
  const styles = [
    { bg: 'bg-primary',        text: 'text-white' },
    { bg: 'bg-accent',         text: 'text-white' },
    { bg: 'bg-primary/80',     text: 'text-white' },
    { bg: 'bg-stone-600',      text: 'text-white' },
  ];
  return styles[idx % styles.length];
}

// ── Create Session Modal ──────────────────────────────────────────────────────
function CreateSessionModal({
  prefillDay, onSave, onClose,
}: {
  prefillDay?: DayKey;
  onSave: (s: Omit<Session, 'id'>) => void;
  onClose: () => void;
}) {
  const [day, setDay]       = useState<DayKey>(prefillDay || 'Mon');
  const [time, setTime]     = useState('6pm');
  const [topic, setTopic]   = useState(TOPICS[0]);
  const [student, setStudent] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({ day, time, topic, student, status: 'upcoming' });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="font-serif font-bold text-lg">Create New Session</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Day</label>
              <select value={day} onChange={e => setDay(e.target.value as DayKey)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary appearance-none">
                {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Time</label>
              <select value={time} onChange={e => setTime(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary appearance-none">
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Topic</label>
            <select value={topic} onChange={e => setTopic(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary appearance-none">
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Student Name <span className="text-muted-foreground/50 normal-case tracking-normal font-normal">(optional)</span></label>
            <input value={student} onChange={e => setStudent(e.target.value)}
              placeholder="e.g. Chisom Nwosu"
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm font-semibold hover:bg-stone-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              style={{ backgroundColor: 'hsl(153,54%,15%)' }}
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              Create Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit Availability Modal ───────────────────────────────────────────────────
function EditAvailModal({
  day, current, onSave, onClose,
}: {
  day: DayKey;
  current: DayAvailability;
  onSave: (a: DayAvailability) => void;
  onClose: () => void;
}) {
  const [slots, setSlots] = useState(current.slots.join('\n'));
  const [unavail, setUnavail] = useState(current.unavailable);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      slots: unavail ? [] : slots.split('\n').map(s => s.trim()).filter(Boolean),
      unavailable: unavail,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="font-serif font-bold text-lg">Edit {day} Availability</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={unavail} onChange={e => setUnavail(e.target.checked)}
              className="rounded border-stone-300" />
            <span className="text-sm font-medium">Mark as Unavailable</span>
          </label>
          {!unavail && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Time Slots <span className="normal-case font-normal tracking-normal">(one per line, e.g. 9am–12pm)</span>
              </label>
              <textarea value={slots} onChange={e => setSlots(e.target.value)}
                rows={4} placeholder="9am–12pm&#10;2pm–5pm"
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary resize-none" />
            </div>
          )}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm font-semibold hover:bg-stone-50">Cancel</button>
            <button type="submit"
              style={{ backgroundColor: 'hsl(153,54%,15%)' }}
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white hover:opacity-90">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Upcoming Sessions Tab ─────────────────────────────────────────────────────
function UpcomingSessions({
  sessions, avail, weekOffset, onWeekChange, onCreateAt, onDeleteSession,
}: {
  sessions: Session[];
  avail: Availability;
  weekOffset: number;
  onWeekChange: (n: number) => void;
  onCreateAt: (day: DayKey) => void;
  onDeleteSession: (id: string) => void;
}) {
  const weekDates = getWeekDates(weekOffset);
  const upcoming  = sessions.filter(s => s.status === 'upcoming');

  const weekLabel = (() => {
    const dates = getWeekDates(weekOffset);
    const first = dates[0];
    const last  = dates[4];
    return `Week of ${first.date}–${last.date} ${first.month} ${new Date().getFullYear()}`;
  })();

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-6">
      {/* Calendar */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Week header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <h2 className="font-serif font-semibold text-foreground">{weekLabel}</h2>
          <div className="flex items-center gap-1">
            <button onClick={() => onWeekChange(weekOffset - 1)}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-muted-foreground transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button onClick={() => onWeekChange(weekOffset + 1)}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-muted-foreground transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Day columns */}
        <div className="grid grid-cols-5 divide-x divide-stone-100 min-h-[240px]">
          {weekDates.map(({ key, date, month }) => {
            const daySessions = upcoming.filter(s => s.day === key);
            return (
              <div key={key} className="flex flex-col p-3 gap-2">
                {/* Day label */}
                <div className="text-center mb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{key} {date}</p>
                </div>

                {/* Sessions */}
                {daySessions.map((s, i) => {
                  const { bg, text } = cardStyle(i + (key === 'Wed' ? 1 : 0));
                  return (
                    <div key={s.id} className={`${bg} ${text} rounded-lg p-2 text-xs relative group`}>
                      <p className="font-bold">{s.time}</p>
                      <p className="truncate">{s.topic.split(' ').slice(0, 2).join(' ')}</p>
                      <button
                        onClick={() => onDeleteSession(s.id)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-4 w-4 rounded-full bg-white/20 flex items-center justify-center"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </div>
                  );
                })}

                {/* Add slot */}
                <button onClick={() => onCreateAt(key)}
                  className="mt-auto mx-auto h-6 w-6 rounded-full border border-stone-200 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors">
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Availability sidebar */}
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

// Availability row — self-contained so it can open its own modal
function AvailRow({ day, info }: { day: DayKey; info: DayAvailability }) {
  const [editing, setEditing] = useState(false);
  const [local, setLocal]     = useState(info);

  // sync upward via custom event so parent re-renders
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
                <span key={s} className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full mr-1">
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setEditing(true)} className="text-muted-foreground hover:text-primary transition-colors shrink-0">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
      {editing && (
        <EditAvailModal day={day} current={local} onSave={save} onClose={() => setEditing(false)} />
      )}
    </>
  );
}

// ── Recordings & Attendance Tab ───────────────────────────────────────────────
function RecordingsTab({ sessions }: { sessions: Session[] }) {
  const completed = sessions.filter(s => s.status === 'completed');

  return (
    <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-stone-100 bg-stone-50/60">
        <h2 className="font-serif font-semibold text-foreground">Past Sessions</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Review recordings and mark attendance</p>
      </div>
      {completed.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground text-sm">No completed sessions yet.</div>
      ) : (
        <div className="divide-y divide-stone-100">
          {completed.map(s => (
            <RecordingRow key={s.id} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}

function RecordingRow({ session }: { session: Session }) {
  const [attended, setAttended] = useState(session.attended ?? false);

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
        <Video className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground">{session.topic}</p>
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Clock className="h-3 w-3" /> {session.day} · {session.time}
          {session.student && <><Users className="h-3 w-3 ml-1" /> {session.student}</>}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {/* Attendance toggle */}
        <button
          onClick={() => setAttended(v => !v)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors ${
            attended
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-stone-100 text-muted-foreground hover:bg-stone-200'
          }`}
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {attended ? 'Attended' : 'Mark Attended'}
        </button>

        {/* Recording link */}
        {session.recordingUrl && (
          <a href={session.recordingUrl}
            className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
            <Video className="h-3.5 w-3.5" /> Recording
          </a>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function TutorialSchedule() {
  const [sessions, setSessions] = useState<Session[]>(loadSessions);
  const [avail, setAvail]       = useState<Availability>(loadAvail);
  const [tab, setTab]           = useState<'upcoming' | 'recordings'>('upcoming');
  const [weekOffset, setWeekOffset] = useState(0);
  const [createModal, setCreateModal] = useState<{ open: boolean; day?: DayKey }>({ open: false });

  // Persist
  useEffect(() => { localStorage.setItem(SESSION_KEY, JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem(AVAIL_KEY,   JSON.stringify(avail));    }, [avail]);

  // Listen for availability edits from AvailRow
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Tutorial Schedule</h1>
        <button
          onClick={() => setCreateModal({ open: true })}
          style={{ backgroundColor: 'hsl(153,54%,15%)' }}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Create New Session
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-stone-100 p-1 rounded-xl w-fit mb-6">
        {[
          { key: 'upcoming',    label: 'Upcoming Sessions' },
          { key: 'recordings',  label: 'Recordings & Attendance' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === key
                ? 'bg-white text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'upcoming' ? (
        <UpcomingSessions
          sessions={sessions}
          avail={avail}
          weekOffset={weekOffset}
          onWeekChange={setWeekOffset}
          onCreateAt={day => setCreateModal({ open: true, day })}
          onDeleteSession={deleteSession}
        />
      ) : (
        <RecordingsTab sessions={sessions} />
      )}

      {/* Modals */}
      {createModal.open && (
        <CreateSessionModal
          prefillDay={createModal.day}
          onSave={addSession}
          onClose={() => setCreateModal({ open: false })}
        />
      )}
    </div>
  );
}
