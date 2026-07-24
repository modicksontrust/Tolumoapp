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

  // Determine role from Clerk unsafeMetadata (set during signup)
  const role = (user?.unsafeMetadata?.role as string) ?? 'student';
  const isLecturer = role === 'tutor';
  const firstName = user?.firstName || 'Friend';

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setLocation('/sign-in');
      return;
    }
    // If already welcomed, skip straight to onboarding/portal
    if (localStorage.getItem(welcomedKey(user.id))) {
      setLocation('/onboarding');
      return;
    }
    setReady(true);
  }, [isLoaded, user]);

  function handleContinue() {
    if (!user) return;
    localStorage.setItem(welcomedKey(user.id), '1');
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
    <div className="min-h-[100dvh] bg-[#1a4d35] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl mx-auto">
        {/* Card */}
        <div className="rounded-3xl bg-white shadow-2xl overflow-hidden">

          {/* Green header band */}
          <div className="bg-[#1a4d35] px-8 pt-10 pb-8 text-center">
            <img
              src={`${BASE}/logo-dark.svg`}
              alt="Tolumor"
              className="h-8 w-auto mx-auto mb-8"
            />
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50 mb-1">
              {isLecturer ? 'Lecturer Welcome' : 'Student Welcome'}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-white mb-1">
              Welcome,
            </h1>
            <p className="font-serif text-2xl md:text-3xl font-semibold text-amber-400">
              Dear {firstName}.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-8">
            {/* Note */}
            <p className="text-sm text-muted-foreground leading-[1.85] mb-8">
              {isLecturer ? (
                <>
                  Welcome to Tolumor. For years, your knowledge lived inside four walls, shared with whoever was lucky enough to sit in your class. Not anymore. Here, your teaching outlives the semester, and your reach outgrows the classroom. Every lesson you upload becomes a lifeline for a student you may never meet, in a school you may never visit. This is bigger than content, it's your legacy, multiplied. Let's build it together.
                </>
              ) : (
                <>
                  Every great lawyer once sat where you're sitting now, unsure, a little afraid, wondering if they truly belonged in this. That feeling doesn't disappoint, it means you're standing at the beginning of something worth doing. Law was never meant to be learned alone in the dark, it was meant to be taught, passed from one hand to the next, one mind lighting another. That's why Tolumor exists. Somewhere out there, a courtroom is waiting for you, a client is waiting for you, a life is waiting for you to learn well enough to change it. So open the first lesson, ask the hard questions, fail the quiz if you must, then rise and pass it. This is not just a course, it's the start of the lawyer you're becoming. Welcome, let's get to work.
                </>
              )}
            </p>

            {/* Divider */}
            <div className="border-t border-border mb-8" />

            {/* Founder signature */}
            <div className="flex items-center gap-5 mb-8">
              <img
                src={founderImg()}
                alt="Dr Moses Oruaze Dickson"
                className="h-20 w-20 rounded-full object-cover object-top shrink-0 shadow-md ring-2 ring-[#1a4d35]/20"
              />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-1">Signed,</p>
                <p className="font-bold text-primary text-sm leading-snug">Dr Moses Oruaze Dickson</p>
                <p className="text-xs text-muted-foreground">LLB · BL · LLM · MSc · LLM · PhD</p>
                <p className="text-xs text-muted-foreground font-medium">Founder, Tolumor</p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleContinue}
              className="w-full rounded-xl bg-[#1a4d35] text-white font-bold py-3.5 text-sm tracking-wide hover:bg-[#1a4d35]/90 transition-colors shadow-lg"
            >
              {isLecturer ? 'Let\'s Build It →' : 'Let\'s Get to Work →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
