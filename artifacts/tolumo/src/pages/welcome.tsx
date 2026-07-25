import { useEffect, useState } from 'react';
import { useUser } from '@clerk/react';
import { useLocation } from 'wouter';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

function founderImg() { return `${BASE}/founder.jpeg`; }
function welcomedKey(userId: string) { return `tolumor_welcomed_${userId}`; }

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
      <div className="h-[100dvh] flex items-center justify-center bg-[#1a4d35]">
        <div className="h-8 w-8 rounded-full border-2 border-white/30 border-t-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-[#1a4d35] flex flex-col overflow-hidden">

      {/* Logo — centered at top */}
      <div className="flex justify-center pt-3 pb-0 shrink-0">
        <img src={`${BASE}/logo-dark.svg`} alt="Tolumor" className="h-6 w-auto" />
      </div>

      {/* "A Letter to You" — centered, standalone */}
      <div className="flex justify-center pt-1 pb-0 shrink-0">
        <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-white/40">
          A letter to you
        </p>
      </div>

      {/* "Welcome." — alone, centered */}
      <div className="flex justify-center pt-1 pb-2 shrink-0">
        <h1 className="font-serif text-4xl font-bold text-white leading-none">
          Welcome.
        </h1>
      </div>

      {/* Letter card */}
      <div className="flex-1 flex flex-col mx-auto w-full max-w-2xl px-5 pb-4 min-h-0">
        <div className="flex-1 bg-[#F5F2EB] rounded-2xl flex flex-col px-9 pt-6 pb-6 min-h-0">

          {/* Opening */}
          <p className="font-serif text-xl font-semibold text-amber-700 mb-3 shrink-0">
            Dear {firstName},
          </p>

          {/* Body */}
          <div className="flex flex-col gap-3 pb-1">
            {isLecturer ? (
              <>
                <p className="text-sm text-foreground leading-[1.9] text-justify">
                  Welcome to Tolumor. For years, your knowledge lived inside four walls, shared with whoever was lucky enough to sit in your class. Not anymore. Here, your teaching outlives the semester, and your reach outgrows the classroom.
                </p>
                <p className="text-sm text-foreground leading-[1.9] text-justify mt-2">
                  Every lesson you upload becomes a lifeline for a student you may never meet, in a school you may never visit. This is bigger than content — it's your legacy, multiplied. Let's build it together.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-foreground leading-[1.9] text-justify">
                  Every great lawyer once sat where you're sitting now, unsure, a little afraid, wondering if they truly belonged in this. That feeling doesn't disappoint — it means you're standing at the beginning of something worth doing.
                </p>
                <p className="text-sm text-foreground leading-[1.9] text-justify">
                  Law was never meant to be learned alone in the dark. It was meant to be taught, passed from one hand to the next, one mind lighting another. That's why Tolumor exists. Somewhere out there, a courtroom is waiting for you, a client is waiting for you, a life is waiting for you to learn well enough to change it. So open the first lesson, ask the hard questions, fail the quiz if you must — then rise and pass it. This is not just a course. It's the start of the lawyer you're becoming.
                </p>
                <p className="text-sm text-foreground leading-[1.9]">
                  Welcome. Let's get to work.
                </p>
              </>
            )}
          </div>

          {/* Sign-off — under the letter */}
          <div className="flex items-center justify-between pt-4 mt-3 border-t-2 border-[#1a4d35]/15">
            <div className="flex items-center gap-4">
              <img
                src={founderImg()}
                alt="Dr Moses Oruaze Dickson"
                className="h-14 w-14 rounded-full object-cover object-top ring-2 ring-[#1a4d35]/30 shadow-md"
              />
              <div>
                <p className="font-bold text-[#1a4d35] text-sm leading-snug">Dr Moses Oruaze Dickson</p>
                <p className="text-xs text-[#1a4d35]/70 mt-0.5">LLB · BL · LLM · MSc · LLM · PhD</p>
                <p className="text-xs font-medium text-[#1a4d35]/70">Founder, Tolumor</p>
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="rounded-xl bg-[#1a4d35] text-white font-bold px-7 py-3 text-sm tracking-wide hover:bg-[#1a4d35]/90 transition-colors shadow-lg shrink-0"
            >
              {isLecturer ? "Let's Build It →" : "Let's Get to Work →"}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
