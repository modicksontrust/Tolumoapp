import React, { useState } from 'react';
import {
  X, Star, Clock, Users, CreditCard, CheckCircle2,
  Calendar, Video, ChevronRight, ArrowLeft,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type BookingPhase = 'browse' | 'review' | 'confirmed';

interface SlotOption {
  id: string;
  date: string;
  time: string;
  duration: string;
  capacity: number;
  booked: number;
  price: number;
}

interface TutorOption {
  id: string;
  name: string;
  initials: string;
  credentials: string;
  avgRating: number;
  totalRatings: number;
  slots: SlotOption[];
}

// ── Mock tutors — filtered to topic on the fly ─────────────────────────────
const ALL_TUTORS: TutorOption[] = [
  {
    id: 't1',
    name: 'Prof. Oluwaseun Adeyemi',
    initials: 'OA',
    credentials: 'LL.B (Hons), LL.M, PhD · Founding Lecturer',
    avgRating: 4.9,
    totalRatings: 142,
    slots: [
      { id: 's1', date: 'Mon 28 Jul 2025', time: '6:00 PM', duration: '90 mins', capacity: 8, booked: 3, price: 3500 },
      { id: 's2', date: 'Thu 31 Jul 2025', time: '6:00 PM', duration: '90 mins', capacity: 8, booked: 7, price: 3500 },
    ],
  },
  {
    id: 't2',
    name: 'Dr. Chidinma Okafor',
    initials: 'CO',
    credentials: 'LL.B, LL.M · Senior Lecturer, Faculty of Law',
    avgRating: 4.7,
    totalRatings: 89,
    slots: [
      { id: 's3', date: 'Tue 29 Jul 2025', time: '5:00 PM', duration: '60 mins', capacity: 6, booked: 2, price: 2500 },
      { id: 's4', date: 'Fri 1 Aug 2025',  time: '4:00 PM', duration: '60 mins', capacity: 6, booked: 0, price: 2500 },
    ],
  },
];

function generateJoinLink() {
  return `https://meet.tolumo.ng/${Math.random().toString(36).slice(2, 10)}`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function BookingModal({
  topic,
  onClose,
}: {
  topic: string;
  onClose: () => void;
}) {
  const [phase, setPhase]               = useState<BookingPhase>('browse');
  const [selectedTutor, setSelectedTutor] = useState<TutorOption | null>(null);
  const [selectedSlot, setSelectedSlot]   = useState<SlotOption | null>(null);
  const [joinLink]                        = useState(generateJoinLink);
  const [paying, setPaying]               = useState(false);

  function selectSlot(tutor: TutorOption, slot: SlotOption) {
    setSelectedTutor(tutor);
    setSelectedSlot(slot);
    setPhase('review');
  }

  function confirmPayment() {
    setPaying(true);
    setTimeout(() => { setPaying(false); setPhase('confirmed'); }, 1800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-[#1a4d35] px-6 py-5 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-start gap-3">
            {phase === 'review' && (
              <button onClick={() => setPhase('browse')}
                className="text-white/60 hover:text-white transition-colors mt-0.5 shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-0.5">Book a Personal Tutorial</p>
              <p className="font-serif font-bold text-white text-base leading-snug">{topic}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors shrink-0 mt-0.5">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ════ BROWSE ════ */}
          {phase === 'browse' && (
            <div className="p-5 space-y-5">
              <p className="text-sm text-muted-foreground">
                The following lecturers have sessions scheduled for this topic. Select an available slot to book.
              </p>

              {ALL_TUTORS.map(tutor => {
                const anyAvailable = tutor.slots.some(s => s.booked < s.capacity);
                return (
                  <div key={tutor.id} className="rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                    {/* Tutor header */}
                    <div className="px-5 py-4 flex items-center gap-4 border-b border-stone-100 bg-stone-50/60">
                      <div className="h-12 w-12 rounded-full bg-[#1a4d35] flex items-center justify-center shrink-0">
                        <span className="text-white font-bold text-sm">{tutor.initials}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-foreground">{tutor.name}</p>
                        <p className="text-xs text-muted-foreground">{tutor.credentials}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-foreground text-sm">{tutor.avgRating}</span>
                        <span className="text-xs text-muted-foreground">({tutor.totalRatings})</span>
                      </div>
                    </div>

                    {/* Slots */}
                    <div className="p-4 space-y-2">
                      {tutor.slots.map(slot => {
                        const full = slot.booked >= slot.capacity;
                        const seatsLeft = slot.capacity - slot.booked;
                        return (
                          <button key={slot.id} onClick={() => !full && selectSlot(tutor, slot)} disabled={full}
                            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl border text-left transition-all
                              ${full
                                ? 'border-stone-100 bg-stone-50 opacity-50 cursor-not-allowed'
                                : 'border-stone-200 hover:border-[#1a4d35] hover:bg-[#1a4d35]/5 cursor-pointer'
                              }`}>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground">{slot.date} · {slot.time}</p>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" /> {slot.duration}
                                </span>
                                <span className={`flex items-center gap-1 text-xs font-medium ${full ? 'text-stone-400' : seatsLeft <= 2 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                                  <Users className="h-3 w-3" />
                                  {full ? 'Full' : `${seatsLeft} seat${seatsLeft !== 1 ? 's' : ''} left`}
                                </span>
                              </div>
                            </div>
                            <div className="shrink-0 text-right flex items-center gap-2">
                              <p className="text-sm font-bold text-foreground">₦{slot.price.toLocaleString()}</p>
                              {!full && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                            </div>
                          </button>
                        );
                      })}
                      {!anyAvailable && (
                        <p className="text-xs text-center text-muted-foreground py-2">
                          All slots for this lecturer are currently full.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ════ REVIEW & PAY ════ */}
          {phase === 'review' && selectedTutor && selectedSlot && (
            <div className="p-5 space-y-5">
              {/* Booking summary */}
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <div className="bg-stone-50 px-5 py-4 border-b border-stone-100">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Your Booking</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#1a4d35] flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-sm">{selectedTutor.initials}</span>
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{selectedTutor.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-semibold text-foreground">{selectedTutor.avgRating}</span>
                        <span className="text-xs text-muted-foreground">({selectedTutor.totalRatings} ratings)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-4 grid grid-cols-2 gap-4">
                  {[
                    { label: 'Topic',    value: topic },
                    { label: 'Date',     value: selectedSlot.date },
                    { label: 'Time',     value: selectedSlot.time },
                    { label: 'Duration', value: selectedSlot.duration },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
                      <p className="text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment terms */}
              <div className="rounded-xl bg-amber-50 border border-amber-100 px-5 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-700 mb-2">Payment Terms</p>
                <p className="text-sm text-amber-900 leading-relaxed">
                  Your payment is <strong>held securely by the platform</strong> until the session is confirmed as conducted. If the session does not take place, you receive a full refund automatically — no request needed.
                </p>
              </div>

              {/* Price + CTA */}
              <div className="rounded-xl border-2 border-[#1a4d35]/20 bg-[#1a4d35]/5 px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">Amount</p>
                  <p className="text-3xl font-bold font-serif text-foreground">₦{selectedSlot.price.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Held · released after session</p>
                </div>
                <button onClick={confirmPayment} disabled={paying}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#1a4d35] text-white font-bold text-sm hover:bg-[#1a4d35]/90 transition-colors disabled:opacity-60 shrink-0">
                  {paying ? (
                    <><span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing…</>
                  ) : (
                    <><CreditCard className="h-4 w-4" />Confirm &amp; Pay</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ════ CONFIRMED ════ */}
          {phase === 'confirmed' && selectedTutor && selectedSlot && (
            <div className="p-5 space-y-5">
              {/* Success header */}
              <div className="text-center py-5">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground mb-1">Booking Confirmed!</h3>
                <p className="text-sm text-muted-foreground">
                  Payment held. It is released to your lecturer only after the session is completed.
                </p>
              </div>

              {/* Confirmation card */}
              <div className="rounded-xl border border-stone-200 shadow-sm overflow-hidden">
                <div className="bg-[#1a4d35] px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1">Booking Confirmation</p>
                  <p className="font-serif font-bold text-white leading-snug">{topic}</p>
                </div>
                <div className="px-5 py-5 space-y-4">
                  {/* Lecturer row */}
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-[#1a4d35]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#1a4d35] font-bold text-xs">{selectedTutor.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{selectedTutor.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-muted-foreground">{selectedTutor.avgRating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Date + time */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Calendar, label: 'Date',     value: selectedSlot.date },
                      { icon: Clock,    label: 'Time',     value: selectedSlot.time },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="bg-stone-50 rounded-lg px-4 py-3 border border-stone-100">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Icon className="h-3 w-3 text-muted-foreground" />
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
                        </div>
                        <p className="text-sm font-semibold text-foreground">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Join link */}
                  <div className="rounded-lg bg-amber-50 border border-amber-100 px-4 py-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Video className="h-3 w-3 text-amber-700" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-700">Your Join Link</p>
                    </div>
                    <a href={joinLink} className="text-sm font-medium text-primary underline underline-offset-2 break-all">
                      {joinLink}
                    </a>
                    <p className="text-xs text-amber-700 mt-2">
                      Reminders sent 24 hours, 1 hour, and 10 minutes before the session.
                      The session is recorded automatically — your recording will appear in Past Tutorials within 2 hours of the session ending.
                    </p>
                  </div>
                </div>
              </div>

              <button onClick={onClose}
                className="w-full py-3.5 rounded-xl bg-[#1a4d35] text-white font-bold text-sm hover:bg-[#1a4d35]/90 transition-colors flex items-center justify-center gap-2">
                Done <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
