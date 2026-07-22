import React, { useState } from 'react';
import { Star, Calendar, Clock, CheckCircle2, X, ChevronRight } from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────
const TUTORS = [
  { id: 1, name: 'Prof. O. Adeyemi', subject: 'Constitutional & Administrative Law', specialties: ['Federalism', 'Human Rights', 'Electoral Law'], rating: 4.9, reviews: 87, price: '₦2,500', initials: 'OA', color: 'bg-[#1a4d35]', availability: 'Mon, Wed, Fri' },
  { id: 2, name: 'Dr. N. Eze', subject: 'Law of Contract & Commercial Law', specialties: ['Offer & Acceptance', 'Breach', 'Remedies'], rating: 4.8, reviews: 63, price: '₦2,000', initials: 'NE', color: 'bg-slate-700', availability: 'Tue, Thu, Sat' },
  { id: 3, name: 'Prof. B. Olawale', subject: 'Criminal Law & Procedure', specialties: ['Criminal Liability', 'Defences', 'Sentencing'], rating: 4.9, reviews: 54, price: '₦2,500', initials: 'BO', color: 'bg-stone-700', availability: 'Mon, Tue, Thu' },
  { id: 4, name: 'Dr. A. Okafor', subject: 'Law of Torts & Remedies', specialties: ['Negligence', 'Occupiers\' Liability', 'Defamation'], rating: 4.7, reviews: 41, price: '₦1,800', initials: 'AO', color: 'bg-amber-800', availability: 'Wed, Fri' },
  { id: 5, name: 'Prof. C. Nwachukwu', subject: 'Jurisprudence & Legal Theory', specialties: ['Natural Law', 'Legal Positivism', 'Critical Theory'], rating: 4.8, reviews: 38, price: '₦2,200', initials: 'CN', color: 'bg-green-800', availability: 'Tue, Sat' },
  { id: 6, name: 'Dr. F. Al-Hassan', subject: 'Land Law & Property Rights', specialties: ['Land Use Act', 'Customary Tenure', 'Mortgages'], rating: 4.6, reviews: 29, price: '₦1,800', initials: 'FA', color: 'bg-teal-800', availability: 'Mon, Wed, Fri' },
];

type Session = {
  id: number;
  tutor: string;
  tutorInitials: string;
  tutorColor: string;
  subject: string;
  date: string;
  time: string;
  notes: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  price: string;
  rating?: number;
};

const INITIAL_SESSIONS: Session[] = [
  { id: 1, tutor: 'Prof. O. Adeyemi', tutorInitials: 'OA', tutorColor: 'bg-[#1a4d35]', subject: 'Federalism & Devolution of Powers', date: 'Mon 14 Jul 2025', time: '10:00am', notes: 'Focus on the Second Schedule and s.4(5)', status: 'confirmed', price: '₦2,500' },
];

const PAST_SESSIONS: Session[] = [
  { id: 101, tutor: 'Prof. O. Adeyemi', tutorInitials: 'OA', tutorColor: 'bg-[#1a4d35]', subject: 'Supremacy of the Constitution', date: 'Thu 3 Jul 2025', time: '6:00pm', notes: '', status: 'completed', price: '₦2,500', rating: 5 },
];

// ── Booking Modal ──────────────────────────────────────────────────────────────
function BookingModal({ tutor, onClose, onBook }: { tutor: typeof TUTORS[0]; onClose: () => void; onBook: (session: Session) => void }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;
    const newSession: Session = {
      id: Date.now(),
      tutor: tutor.name,
      tutorInitials: tutor.initials,
      tutorColor: tutor.color,
      subject: notes || tutor.specialties[0],
      date: new Date(date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }),
      time,
      notes,
      status: 'pending',
      price: tutor.price,
    };
    onBook(newSession);
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h2 className="font-serif font-bold text-foreground">Book a Session</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-stone-100 transition-colors"><X className="h-4 w-4" /></button>
        </div>

        {success ? (
          <div className="px-6 py-10 text-center">
            <div className="h-14 w-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <h3 className="font-serif font-bold text-foreground text-lg mb-1">Request Sent!</h3>
            <p className="text-sm text-muted-foreground mb-6">{tutor.name} will confirm your session shortly. You'll receive a notification once confirmed.</p>
            <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">Done</button>
          </div>
        ) : (
          <form onSubmit={handleBook} className="px-6 py-5 space-y-4">
            {/* Tutor info */}
            <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl">
              <div className={`h-11 w-11 rounded-full ${tutor.color} text-white font-bold text-sm flex items-center justify-center shrink-0`}>{tutor.initials}</div>
              <div>
                <p className="font-semibold text-foreground">{tutor.name}</p>
                <p className="text-xs text-muted-foreground">{tutor.subject}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span className="text-xs font-semibold text-foreground">{tutor.rating}</span>
                  <span className="text-xs text-muted-foreground">· {tutor.price}/session</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5">Date</label>
              <input required type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full h-10 rounded-xl border border-stone-200 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5">Time</label>
              <select required value={time} onChange={e => setTime(e.target.value)}
                className="w-full h-10 rounded-xl border border-stone-200 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 bg-white">
                <option value="">Select a time...</option>
                {['9:00am','10:00am','11:00am','12:00pm','1:00pm','2:00pm','3:00pm','4:00pm','5:00pm','6:00pm'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground uppercase tracking-wide mb-1.5">Topic / Notes <span className="font-normal text-muted-foreground normal-case">(optional)</span></label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="What do you want to cover?"
                className="w-full rounded-xl border border-stone-200 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 resize-none" />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">Session fee: <strong className="text-foreground">{tutor.price}</strong></span>
              <button type="submit" className="px-6 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">
                Confirm Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function TutorialSessions() {
  const [tab, setTab] = useState<'book' | 'upcoming' | 'history'>('book');
  const [bookingTutor, setBookingTutor] = useState<typeof TUTORS[0] | null>(null);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [ratingModal, setRatingModal] = useState<number | null>(null);
  const [ratings, setRatings] = useState<Record<number, number>>({});

  const addSession = (s: Session) => {
    setUpcomingSessions(prev => [...prev, s]);
  };

  const cancelSession = (id: number) => {
    setUpcomingSessions(prev => prev.map(s => s.id === id ? { ...s, status: 'cancelled' } : s));
  };

  const statusColor = (status: Session['status']) => {
    if (status === 'confirmed') return 'bg-green-100 text-green-700';
    if (status === 'pending') return 'bg-amber-100 text-amber-700';
    if (status === 'cancelled') return 'bg-red-100 text-red-600';
    return 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Tutorial Sessions</h1>
        <p className="text-muted-foreground mt-0.5">Book 1-on-1 sessions with verified NUC-approved lecturers.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-stone-200 rounded-xl p-1 w-fit shadow-sm">
        {([['book', 'Book a Session'], ['upcoming', 'Upcoming'], ['history', 'History']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === key ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>
            {label}
            {key === 'upcoming' && upcomingSessions.filter(s => s.status !== 'cancelled').length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded-full bg-accent text-white text-[10px] font-bold">
                {upcomingSessions.filter(s => s.status !== 'cancelled').length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Book a Session ── */}
      {tab === 'book' && (
        <div>
          <p className="text-sm text-muted-foreground mb-5">Sessions run 1 hour · Priced ₦1,800–₦2,500 · Video call link sent on confirmation · Platform fee of 15% applies</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TUTORS.map(t => (
              <div key={t.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`h-12 w-12 rounded-full ${t.color} text-white font-bold flex items-center justify-center text-sm shrink-0`}>{t.initials}</div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground truncate">{t.name}</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t.subject}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`h-3.5 w-3.5 ${s <= Math.floor(t.rating) ? 'fill-amber-500 text-amber-500' : 'text-stone-200'}`} />)}
                    <span className="ml-1 text-xs font-semibold text-foreground">{t.rating}</span>
                    <span className="text-xs text-muted-foreground ml-0.5">({t.reviews})</span>
                  </div>
                  <span className="font-bold text-primary text-sm">{t.price}</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {t.specialties.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">{s}</span>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Available: {t.availability}</span>
                </div>

                <button onClick={() => setBookingTutor(t)}
                  className="mt-auto w-full py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                  Book Session <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Upcoming ── */}
      {tab === 'upcoming' && (
        <div className="space-y-4">
          {upcomingSessions.filter(s => s.status !== 'cancelled' && s.status !== 'completed').length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-12 text-center">
              <Calendar className="h-10 w-10 text-stone-300 mx-auto mb-3" />
              <p className="font-semibold text-foreground">No upcoming sessions</p>
              <p className="text-sm text-muted-foreground mt-1 mb-5">Book a 1-on-1 with one of our verified lecturers.</p>
              <button onClick={() => setTab('book')} className="px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors">Browse Tutors</button>
            </div>
          ) : (
            upcomingSessions.filter(s => s.status !== 'cancelled' && s.status !== 'completed').map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full ${s.tutorColor} text-white font-bold text-sm flex items-center justify-center shrink-0`}>{s.tutorInitials}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColor(s.status)}`}>{s.status}</span>
                      </div>
                      <p className="font-semibold text-foreground">{s.tutor}</p>
                      <p className="text-sm text-muted-foreground">{s.subject}</p>
                    </div>
                  </div>
                  <button onClick={() => cancelSession(s.id)} className="text-xs text-muted-foreground hover:text-red-500 transition-colors shrink-0">Cancel</button>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-stone-100 pt-4">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {s.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {s.time}</span>
                  <span className="font-semibold text-foreground">{s.price}</span>
                </div>
                {s.notes && <p className="mt-3 text-sm bg-stone-50 rounded-lg px-4 py-2.5 text-muted-foreground border border-stone-100">📝 {s.notes}</p>}
                {s.status === 'confirmed' && (
                  <div className="mt-3 flex items-center gap-3">
                    <button className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
                      Join Video Call
                    </button>
                    <button className="px-4 py-2 rounded-lg border border-stone-200 text-muted-foreground text-xs font-semibold hover:border-primary hover:text-primary transition-colors">
                      Add to Calendar
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── History ── */}
      {tab === 'history' && (
        <div className="space-y-4">
          {[...PAST_SESSIONS, ...upcomingSessions.filter(s => s.status === 'completed' || s.status === 'cancelled')].length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-12 text-center">
              <p className="text-muted-foreground">No session history yet.</p>
            </div>
          ) : (
            [...PAST_SESSIONS, ...upcomingSessions.filter(s => s.status === 'completed' || s.status === 'cancelled')].map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full ${s.tutorColor} text-white font-bold text-sm flex items-center justify-center shrink-0`}>{s.tutorInitials}</div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColor(s.status)}`}>{s.status}</span>
                      </div>
                      <p className="font-semibold text-foreground">{s.tutor}</p>
                      <p className="text-sm text-muted-foreground">{s.subject}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-primary text-sm shrink-0">{s.price}</span>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-stone-100 pt-4">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {s.date}</span>
                  <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {s.time}</span>
                </div>
                {s.status === 'completed' && (
                  <div className="mt-3">
                    {ratings[s.id] ? (
                      <div className="flex items-center gap-1">
                        {[1,2,3,4,5].map(n => <Star key={n} className={`h-4 w-4 ${n <= ratings[s.id] ? 'fill-amber-500 text-amber-500' : 'text-stone-200'}`} />)}
                        <span className="ml-1 text-xs text-muted-foreground">Your rating</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Rate this session:</span>
                        {[1,2,3,4,5].map(n => (
                          <button key={n} onClick={() => setRatings(r => ({ ...r, [s.id]: n }))}
                            className="text-stone-300 hover:text-amber-500 transition-colors">
                            <Star className="h-5 w-5" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Booking modal */}
      {bookingTutor && (
        <BookingModal
          tutor={bookingTutor}
          onClose={() => setBookingTutor(null)}
          onBook={(s) => { addSession(s); setBookingTutor(null); setTab('upcoming'); }}
        />
      )}
    </div>
  );
}
