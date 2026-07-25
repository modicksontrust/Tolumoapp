import { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';
import { useLocation } from 'wouter';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function founderImg() {
  return `${BASE}/founder.jpeg`;
}

function welcomedKey(userId: string) {
  return `tolumor_welcomed_${userId}`;
}

export default function WelcomePage() {
  const { user, isLoaded } = useUser();
  const [, setLocation] = useLocation();
  const [ready, setReady] = useState(false);

  const stored = (() => {
    try { return JSON.parse(sessionStorage.getItem('tolumor_signup') || '{}'); }
    catch { return {}; }
  })();

  const role = (user?.unsafeMetadata?.role as string) ?? stored.role ?? 'student';
  const isLecturer = role === 'tutor';
  const firstName = user?.firstName || stored.firstName || 'Friend';

  useEffect(() => {
    if (!isLoaded) return;
    if (user && localStorage.getItem(welcomedKey(user.id))) {
      setLocation('/onboarding');
      return;
    }
    setReady(true);
  }, [isLoaded, user]);

  function handleContinue() {
    sessionStorage.removeItem('tolumor_signup');
    if (user) localStorage.setItem(welcomedKey(user.id), '1');
    setLocation('/onboarding');
  }

  if (!isLoaded || !ready) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#1a4d35]">
        <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row overflow-hidden bg-[#1a4d35]">

      {/* Left panel — branding */}
      <div className="md:w-[38%] bg-[#1a4d35] flex flex-col justify-between px-10 py-10">
        <div>
          <img src={`${BASE}/logo-dark.svg`} alt="Tolumor" className="h-7 w-auto mb-2" />
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">A letter to you</p>
        </div>

        <div>
          <h1 className="font-serif text-5xl font-bold text-white leading-tight mb-4">
            Welcome.
          </h1>
          <p className="font-serif text-2xl font-semibold text-amber-400">
            Dear {firstName},
          </p>
        </div>

        {/* Founder */}
        <div className="flex items-center gap-4">
          <img
            src={founderImg()}
            alt="Dr Moses Oruaze Dickson"
            className="h-14 w-14 rounded-full object-cover object-top shrink-0 ring-2 ring-white/20"
          />
          <div>
            <p className="font-bold text-white text-sm leading-snug">Dr Moses Oruaze Dickson</p>
            <p className="text-xs text-white/50">LLB · BL · LLM · MSc · LLM · PhD</p>
            <p className="text-xs text-white/50">Founder, Tolumor</p>
          </div>
        </div>
      </div>

      {/* Right panel — letter body */}
      <div className="md:w-[62%] bg-[#F5F2EB] flex flex-col justify-between px-10 py-10">

        <div className="flex-1 flex flex-col justify-center max-w-lg">
          <div className="space-y-4 text-sm text-foreground leading-[1.85] text-justify">
            {isLecturer ? (
              <p>
                Welcome to Tolumor. For years, your knowledge lived inside four walls, shared with whoever was lucky enough to sit in your class. Not anymore. Here, your teaching outlives the semester, and your reach outgrows the classroom. Every lesson you upload becomes a lifeline for a student you may never meet, in a school you may never visit. This is bigger than content — it's your legacy, multiplied. Let's build it together.
              </p>
            ) : (
              <>
                <p>
                  Every great lawyer once sat where you're sitting now, unsure, a little afraid, wondering if they truly belonged in this. That feeling doesn't disappoint — it means you're standing at the beginning of something worth doing.
                </p>
                <p>
                  Law was never meant to be learned alone in the dark. It was meant to be taught, passed from one hand to the next, one mind lighting another. That's why Tolumor exists. Somewhere out there, a courtroom is waiting for you, a client is waiting for you, a life is waiting for you to learn well enough to change it.
                </p>
                <p>
                  So open the first lesson, ask the hard questions, fail the quiz if you must — then rise and pass it. This is not just a course. It's the start of the lawyer you're becoming.
                </p>
                <p className="font-medium text-primary">Welcome. Let's get to work.</p>
              </>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="pt-6 border-t border-border mt-6">
          <button
            onClick={handleContinue}
            className="w-full rounded-xl bg-[#1a4d35] text-white font-bold py-3.5 text-sm tracking-wide hover:bg-[#1a4d35]/90 transition-colors shadow-lg"
          >
            {isLecturer ? "Let's Build It →" : "Let's Get to Work →"}
          </button>
        </div>
      </div>

    </div>
  );
}
