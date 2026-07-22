import React, { useState } from 'react';
import { Calendar, Clock, Play, Star, Video, X } from 'lucide-react';

// ── Rating Modal ──────────────────────────────────────────────────────────────
function RatingModal({
  session,
  onSubmit,
  onClose,
}: {
  session: PastSession;
  onSubmit: (id: number, stars: number, comment: string) => void;
  onClose: () => void;
}) {
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        {/* Green header */}
        <div className="bg-[#1a4d35] px-6 py-5 relative">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">{session.module}</p>
          <p className="font-serif font-bold text-white text-base mb-0.5">{session.title}</p>
          <p className="text-sm text-white/70">{session.tutor}</p>
          <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          <p className="font-semibold text-foreground text-base text-center">How would you rate this tutorial session?</p>

          {/* Stars */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setStars(n)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-8 w-8 transition-colors ${n <= (hover || stars) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                />
              </button>
            ))}
          </div>

          {/* Comment */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Comment (optional)</p>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              rows={4}
              placeholder="Share what you found most helpful..."
              className="w-full rounded-xl bg-stone-100 border-0 px-4 py-3 text-sm text-foreground placeholder:text-stone-400 outline-none resize-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => { if (stars > 0) onSubmit(session.id, stars, comment); }}
              disabled={stars === 0}
              className="flex-1 py-3 rounded-xl bg-[#5a8a72] text-white font-semibold text-sm hover:bg-[#4a7a62] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Rating
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-stone-200 text-foreground font-semibold text-sm hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Past sessions ─────────────────────────────────────────────────────────────
type PastSession = {
  id: number;
  module: string;
  title: string;
  tutor: string;
  tutorInitials: string;
  date: string;
  scheduledStart: string;
  joinedAt: string;
  joinedLate: boolean;   // true → joined after start
  joinedEarly: boolean;  // true → joined before start
  offline: boolean;      // true → never joined
  stayedFull: boolean;
  rated: boolean;
};

const PAST: PastSession[] = [
  {
    id: 1,
    module: 'Constitutional Law',
    title: 'Separation of Powers — Checks & Balances',
    tutor: 'Prof. Oluwaseun Adeyemi',
    tutorInitials: 'OA',
    date: 'Thu 3 Jul 2025',
    scheduledStart: '6:00 PM',
    joinedAt: '5:57 PM',
    joinedLate: false,
    joinedEarly: true,
    offline: false,
    stayedFull: true,
    rated: false,
  },
  {
    id: 2,
    module: 'Law of Contract',
    title: 'Offer & Acceptance — Postal Rule',
    tutor: 'Dr. Ngozi Eze',
    tutorInitials: 'NE',
    date: 'Wed 25 Jun 2025',
    scheduledStart: '5:00 PM',
    joinedAt: '5:08 PM',
    joinedLate: true,
    joinedEarly: false,
    offline: false,
    stayedFull: true,
    rated: false,
  },
  {
    id: 3,
    module: 'Constitutional Law',
    title: 'Supremacy of the Constitution',
    tutor: 'Prof. Oluwaseun Adeyemi',
    tutorInitials: 'OA',
    date: 'Thu 10 Jul 2025',
    scheduledStart: '6:00 PM',
    joinedAt: '6:00 PM',
    joinedLate: false,
    joinedEarly: false,
    offline: true,
    stayedFull: true,
    rated: false,
  },
];

// ── Upcoming sessions ─────────────────────────────────────────────────────────
type UpcomingSession = {
  id: number;
  module: string;
  title: string;
  tutor: string;
  tutorInitials: string;
  date: string;
  time: string;
  duration: string;
  videoLink: string;
};

const UPCOMING: UpcomingSession[] = [
  {
    id: 1,
    module: 'Constitutional Law',
    title: 'Federalism & the Second Schedule — Deep Dive',
    tutor: 'Prof. Oluwaseun Adeyemi',
    tutorInitials: 'OA',
    date: 'Thu 17 Jul 2025',
    time: '6:00 PM',
    duration: '90 mins',
    videoLink: 'https://meet.tolumo.ng/fed-deep-dive-jul17',
  },
];

// ── Stat banner ───────────────────────────────────────────────────────────────
const onTime  = PAST.filter(s => !s.joinedLate && !s.offline).length;
const late    = PAST.filter(s => s.joinedLate).length;
const total   = PAST.length;
const stayed  = PAST.filter(s => s.stayedFull).length;

// ── Badge helper ──────────────────────────────────────────────────────────────
function Badge({ session }: { session: PastSession }) {
  if (session.offline)     return <span className="px-2.5 py-1 rounded-full bg-stone-200 text-stone-600 text-[10px] font-bold uppercase tracking-wide">Offline</span>;
  if (session.joinedLate)  return <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-600   text-[10px] font-bold uppercase tracking-wide">Joined Late</span>;
  if (session.joinedEarly) return <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide">Joined Early</span>;
  return null;
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function TutorialSessions() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [ratingSession, setRatingSession] = useState<PastSession | null>(null);

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">My Tutorial Sessions</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          All tutorial sessions you have booked. Book more directly from any topic screen.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 bg-stone-100 rounded-xl p-1 w-fit">
        {([['upcoming', 'Upcoming Sessions'], ['past', 'Past Sessions & Recordings']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap
              ${tab === key ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ══ UPCOMING SESSIONS ══ */}
      {tab === 'upcoming' && (
        <div className="space-y-4">
          {UPCOMING.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-12 text-center">
              <Calendar className="h-10 w-10 text-stone-300 mx-auto mb-3" />
              <p className="font-semibold text-foreground">No upcoming sessions</p>
              <p className="text-sm text-muted-foreground mt-1">Book a session directly from any topic screen.</p>
            </div>
          ) : (
            UPCOMING.map(s => (
              <div key={s.id} className="rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
                {/* Dark green header */}
                <div className="bg-[#1a4d35] px-6 py-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
                    {s.module} · Tutorial Session
                  </p>
                  <h2 className="font-serif font-bold text-white text-lg mb-3">{s.title}</h2>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <span className="text-white text-[10px] font-bold">{s.tutorInitials}</span>
                    </div>
                    <span className="text-sm text-white/80">{s.tutor}</span>
                  </div>
                </div>

                {/* White details */}
                <div className="bg-white px-6 py-5 space-y-4">
                  {/* Date / time / duration + Join button */}
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-5 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 shrink-0" />
                        {s.date} · {s.time}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 shrink-0" />
                        {s.duration}
                      </span>
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#1a4d35]/90 transition-colors shrink-0">
                      <Video className="h-4 w-4" />
                      Join Session
                    </button>
                  </div>

                  {/* Video call link box */}
                  <div className="rounded-xl bg-amber-50 border border-amber-100 px-5 py-3.5 space-y-0.5">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Video call link:</span>{' '}
                      <a href={s.videoLink} className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors break-all">
                        {s.videoLink}
                      </a>
                    </p>
                    <p className="text-xs text-amber-700">Recording will be available here within 2 hours after the session ends.</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ══ PAST SESSIONS & RECORDINGS ══ */}
      {tab === 'past' && (
        <div className="space-y-4">

          {/* Stats banner */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm px-6 py-4 flex items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Attended {total} tutorial{total !== 1 ? 's' : ''} — on time for {onTime}, late for {late}
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs ml-auto">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                {onTime} on time / early
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
                {late} late
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-foreground inline-block" />
                {stayed} stayed for full session
              </span>
            </div>
          </div>

          {/* Session cards */}
          {PAST.map(s => (
            <div key={s.id} className="rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              {/* Dark green header */}
              <div className="bg-[#1a4d35] px-6 py-5 relative">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">
                  {s.module} · Past Session
                </p>
                <h2 className="font-serif font-bold text-white text-lg mb-3">{s.title}</h2>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold">{s.tutorInitials}</span>
                  </div>
                  <span className="text-sm text-white/80">{s.tutor}</span>
                </div>
                {/* Status badge */}
                <div className="absolute top-5 right-5">
                  <Badge session={s} />
                </div>
              </div>

              {/* White details */}
              <div className="bg-white px-6 py-5 space-y-4">
                {/* 4-stat row */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Date', value: s.date, red: false },
                    { label: 'Scheduled Start', value: s.scheduledStart, red: false },
                    { label: 'You Joined At', value: s.offline ? '—' : s.joinedAt, red: s.joinedLate },
                    { label: 'Stayed Full', value: s.stayedFull ? 'Yes ✓' : 'No', red: false },
                  ].map(({ label, value, red }) => (
                    <div key={label} className="bg-stone-50 rounded-xl px-4 py-3 border border-stone-100">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{label}</p>
                      <p className={`text-sm font-semibold ${red ? 'text-red-600' : 'text-foreground'}`}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Action row */}
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#1a4d35]/90 transition-colors">
                    <Play className="h-3.5 w-3.5 fill-white" />
                    Watch Recording
                  </button>

                  {/* Rate this Lecturer */}
                  {ratings[s.id] ? (
                    <div className="flex items-center gap-1 ml-1">
                      {[1, 2, 3, 4, 5].map(n => (
                        <Star key={n} className={`h-4 w-4 ${n <= ratings[s.id] ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`} />
                      ))}
                      <span className="ml-1 text-xs text-muted-foreground">Rated</span>
                    </div>
                  ) : (
                    <button
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-semibold text-foreground hover:border-amber-400 hover:text-amber-600 transition-colors group"
                      onClick={() => setRatingSession(s)}
                    >
                      <Star className="h-3.5 w-3.5 text-stone-400 group-hover:text-amber-500 transition-colors" />
                      Rate this Lecturer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating modal */}
      {ratingSession && (
        <RatingModal
          session={ratingSession}
          onSubmit={(id, stars, _comment) => {
            setRatings(r => ({ ...r, [id]: stars }));
            setRatingSession(null);
          }}
          onClose={() => setRatingSession(null)}
        />
      )}
    </div>
  );
}
