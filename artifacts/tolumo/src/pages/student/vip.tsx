import React from 'react';
import { useLocation } from 'wouter';
import {
  Crown, CalendarCheck, BadgeCheck, Zap, Sparkles,
  Briefcase, Users, Mic, Star, ArrowLeft, ChevronRight,
} from 'lucide-react';

const BENEFITS = [
  {
    icon: CalendarCheck,
    title: 'Priority Tutor Booking',
    body: "When exam season hits and every student is racing to book the same top-rated tutors, you'll already have first access, ahead of the queue.",
  },
  {
    icon: BadgeCheck,
    title: 'Blue Verified Badge',
    body: "Your profile carries a blue verified badge, so lecturers and fellow students see the commitment you've put in.",
  },
  {
    icon: Zap,
    title: 'AI Revision Coach — No Queue',
    body: "Instead of waiting in line for the AI Revision Coach during busy periods, you go straight through.",
  },
  {
    icon: Sparkles,
    title: 'First Access to New Features & Courses',
    body: "You'll be the first to try new features and courses before anyone else even knows they exist.",
  },
  {
    icon: Briefcase,
    title: 'Early Opportunities on the Careers Hub',
    body: "On the Careers and Opportunities Hub, new scholarships, jobs, and opportunities land in front of you before regular students ever see them.",
  },
  {
    icon: Users,
    title: 'Personal Onboarding & Career Coaching',
    body: "You get real, one-on-one time — a personalized onboarding session with an actual staff member, and a dedicated human career coaching touchpoint, not just AI matching.",
  },
  {
    icon: Mic,
    title: 'Voice Q&A Sessions',
    body: "Your pre-test Q&A sessions open up to voice, so you can talk through what's unclear the way you would with a real tutor.",
  },
  {
    icon: Star,
    title: 'Faster Credits & Double Referrals',
    body: "Your credits grow faster too — bonus credits just for being VIP, plus double credits on referrals, feedback, and everyday course activity.",
  },
];

export default function VIPUpgradePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="max-w-3xl mx-auto pb-16">

      {/* Back link */}
      <button onClick={() => history.back()}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0f2d1e] border border-white/8 shadow-xl mb-8">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-amber-500/8 pointer-events-none" />
        <div className="absolute -bottom-16 -left-12 w-56 h-56 rounded-full bg-amber-500/6 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 75% 30%, rgba(245,158,11,0.07) 0%, transparent 60%)' }} />

        <div className="relative px-8 py-10 md:px-12 md:py-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 mb-6">
            <Crown className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400">Tolumor VIP</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-5">
            You've been showing up,{' '}
            <span className="text-amber-400">learning</span>, and{' '}
            <span className="text-amber-400">growing</span>.
            <br />VIP takes that further.
          </h1>

          <p className="text-white/65 text-base leading-relaxed max-w-xl">
            When exam season hits and every student is racing to book the same top-rated tutors, you'll already have first access, ahead of the queue. Your profile carries a blue verified badge, so lecturers and fellow students see the commitment you've put in.
          </p>
        </div>
      </div>

      {/* ── Full copy ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-7 mb-8">
        <p className="text-base text-foreground leading-[1.85] font-serif">
          You've been showing up, learning, and growing. VIP takes that further. When exam season hits and every student is racing to book the same top-rated tutors, you'll already have first access, ahead of the queue. Your profile carries a blue verified badge, so lecturers and fellow students see the commitment you've put in. Instead of waiting in line for the AI Revision Coach during busy periods, you go straight through. You'll be the first to try new features and courses before anyone else even knows they exist. On the Careers and Opportunities Hub, new scholarships, jobs, and opportunities land in front of you before regular students ever see them. You get real, one-on-one time, a personalized onboarding session with an actual staff member, and a dedicated human career coaching touchpoint, not just AI matching. Your pre-test Q&A sessions open up to voice, so you can talk through what's unclear the way you would with a real tutor. And your credits grow faster too, bonus credits just for being VIP, plus double credits on referrals, feedback, and everyday course activity.
        </p>
        <p className="mt-6 text-base font-bold text-foreground leading-relaxed">
          This isn't just a subscription upgrade. It's you, choosing to move faster, stand out, and get more out of every part of Tolumor.
        </p>
      </div>

      {/* ── Benefits grid ── */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {BENEFITS.map(({ icon: Icon, title, body }) => (
          <div key={title}
            className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 flex gap-4 hover:border-amber-200 hover:shadow-md transition-all">
            <div className="h-11 w-11 rounded-xl shrink-0 flex items-center justify-center bg-[#0f2d1e]">
              <Icon className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm mb-1.5">{title}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Closing CTA panel ── */}
      <div className="bg-[#0f2d1e] rounded-3xl border border-white/8 shadow-xl overflow-hidden">
        <div className="px-8 py-8 md:px-12 md:py-10">
          <div className="flex items-start gap-4 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center shrink-0">
              <Crown className="h-6 w-6 text-amber-400" />
            </div>
            <p className="text-white/80 text-base leading-relaxed font-serif italic">
              "This isn't just a subscription upgrade. It's you, choosing to move faster, stand out, and get more out of every part of Tolumor."
            </p>
          </div>

          {/* Price row */}
          <div className="flex items-end gap-3 mb-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">VIP Plan</p>
              <p className="text-4xl font-bold font-serif text-white leading-none">₦6,500</p>
              <p className="text-sm text-white/50 mt-1">per month · Cancel anytime</p>
            </div>
            <div className="mb-1 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/25">
              <p className="text-xs font-bold text-amber-400">vs ₦3,500 Standard</p>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={() => alert('VIP checkout — coming soon!')}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all
              bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-white shadow-lg shadow-amber-500/25">
            <Crown className="h-5 w-5" />
            Upgrade to VIP
            <ChevronRight className="h-5 w-5" />
          </button>

          <p className="text-center text-xs text-white/35 mt-3">
            Your existing credits, progress, and certificate are fully preserved.
          </p>
        </div>
      </div>

    </div>
  );
}
