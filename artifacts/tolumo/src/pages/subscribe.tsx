import { useLocation } from 'wouter';
import { useUser } from '@clerk/react';
import { CheckCircle2, ArrowRight, GraduationCap, BookOpen, Video, Users, Brain, Headphones } from 'lucide-react';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const PLAN_FEATURES = [
  { icon: Video,          text: 'Full access to all NUC-aligned video lessons' },
  { icon: Brain,          text: 'AI revision coach — ask questions anytime' },
  { icon: BookOpen,       text: 'Digital law research tools & case libraries' },
  { icon: Headphones,     text: 'One-on-one tutor sessions (book on demand)' },
  { icon: Users,          text: 'Access to like-minded student community' },
  { icon: GraduationCap,  text: 'Scholarship & career opportunity alerts' },
];

export default function SubscribePage() {
  const { user } = useUser();
  const [, setLocation] = useLocation();

  const stored = (() => {
    try { return JSON.parse(sessionStorage.getItem('tolumor_signup') || '{}'); } catch { return {}; }
  })();
  const firstName = user?.firstName || stored.firstName || 'Friend';

  return (
    <div className="min-h-[100dvh] bg-[#F5F2EB] flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-white">
        <img src={`${BASE}/logo-light.svg`} alt="Tolumor" className="h-7 w-auto" />
        <span className="text-xs text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{user?.primaryEmailAddress?.emailAddress ?? ''}</span>
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">

          {/* Heading */}
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/60 mb-2">One step left</p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-3">
              Unlock your dashboard, {firstName}.
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Choose a plan to access your full learning experience. Cancel anytime.
            </p>
          </div>

          {/* Plan card */}
          <div className="rounded-2xl border-2 border-primary bg-white shadow-xl overflow-hidden mb-6">
            {/* Plan badge */}
            <div className="bg-primary px-8 py-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-1">Student Plan</p>
                <p className="font-serif text-3xl font-bold text-white">
                  ₦5,000 <span className="text-base font-normal text-white/70">/ month</span>
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block rounded-full bg-amber-400 text-primary text-xs font-bold px-3 py-1">
                  Most Popular
                </span>
                <p className="text-white/60 text-xs mt-1">≈ $3 USD</p>
              </div>
            </div>

            {/* Features */}
            <ul className="px-8 py-6 space-y-4">
              {PLAN_FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="px-8 pb-8">
              <button
                onClick={() => {
                  // Subscription payment handler — wire up payment gateway here
                  alert('Payment integration coming soon. Redirecting to dashboard for now.');
                  setLocation('/student');
                }}
                className="w-full rounded-xl bg-[#1a4d35] hover:bg-[#1a4d35]/90 text-white font-bold py-4 text-base tracking-wide transition-colors shadow-md flex items-center justify-center gap-2"
              >
                Subscribe Now <ArrowRight className="h-5 w-5" />
              </button>
              <p className="text-center text-xs text-muted-foreground mt-3">
                Secure payment · Cancel anytime · Instant access
              </p>
            </div>
          </div>

          {/* Skip link (optional) */}
          <p className="text-center text-xs text-muted-foreground">
            Already subscribed?{' '}
            <button
              onClick={() => setLocation('/student')}
              className="underline hover:text-primary transition-colors"
            >
              Go to dashboard
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
