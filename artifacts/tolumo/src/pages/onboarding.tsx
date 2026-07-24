import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useUser } from '@clerk/react';
import { useUpsertMe } from '@workspace/api-client-react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProfileInputRole } from '@workspace/api-client-react';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

const LAW_AREAS = [
  'Criminal Law',
  'Corporate & Commercial Law',
  'Constitutional & Public Law',
  'Property & Land Law',
  'Family Law',
  'Tort Law',
  'Jurisprudence & Legal Theory',
  'International Law',
  'Labour & Employment Law',
  'Intellectual Property Law',
  'Not sure yet',
];

const STUDY_GOALS = [
  'Pass my LL.B exams with distinction',
  'Prepare for the Nigerian Bar Exam (BL)',
  'Deepen my understanding of specific subjects',
  'Get ahead before the next semester',
  'Supplement my lectures with better resources',
];

const YEAR_LEVELS = [
  'Year 1 (100 Level)',
  'Year 2 (200 Level)',
  'Year 3 (300 Level)',
  'Year 4 (400 Level)',
  'Year 5 (500 Level)',
];

const TEACHING_AREAS = [
  'Criminal Law',
  'Corporate & Commercial Law',
  'Constitutional & Public Law',
  'Property & Land Law',
  'Family Law',
  'Tort Law',
  'Jurisprudence & Legal Theory',
  'International Law',
  'Labour & Employment Law',
  'Intellectual Property Law',
  'Multiple subjects',
];

const inputClass =
  'flex h-11 w-full rounded-lg border border-border bg-white px-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors';
const selectClass =
  'flex h-11 w-full rounded-lg border border-border bg-white px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors appearance-none cursor-pointer';
const labelClass = 'block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2';

export default function OnboardingPage() {
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const upsertMe = useUpsertMe();

  // Role is already known from sign-up — read from Clerk metadata or sessionStorage fallback
  const stored = (() => {
    try { return JSON.parse(sessionStorage.getItem('tolumor_signup') || '{}'); } catch { return {}; }
  })();
  const role: string = (user?.unsafeMetadata?.role as string) ?? stored.role ?? 'student';
  const isStudent = role !== 'tutor';

  const [displayName, setDisplayName] = useState(
    user?.fullName || (stored.firstName ? stored.firstName : '')
  );
  const [lawArea, setLawArea] = useState('');
  const [studyGoal, setStudyGoal] = useState('');
  const [yearLevel, setYearLevel] = useState((user?.unsafeMetadata?.yearLevel as string) ?? stored.yearLevel ?? '');
  // Tutor fields
  const [teachingArea, setTeachingArea] = useState('');
  const [yearsExp, setYearsExp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast({ title: 'Name required', description: 'Please enter your display name.', variant: 'destructive' });
      return;
    }

    const apiRole = role === 'tutor' ? ProfileInputRole.tutor : ProfileInputRole.student;

    upsertMe.mutate(
      { data: { name: displayName.trim(), role: apiRole } },
      {
        onSuccess: (data) => {
          sessionStorage.removeItem('tolumor_signup');
          switch (data.role) {
            case 'student': setLocation('/student'); break;
            case 'tutor': setLocation('/tutor'); break;
            case 'admin': setLocation('/admin'); break;
            case 'sub_agent': setLocation('/agent'); break;
            case 'super_agent': setLocation('/super-agent'); break;
            case 'support': setLocation('/crm'); break;
            default: setLocation('/');
          }
        },
        onError: () => {
          toast({ title: 'Error', description: 'Could not save profile. Please try again.', variant: 'destructive' });
        },
      }
    );
  };

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Left panel */}
      <div className="md:w-[40%] bg-[#1a4d35] text-white p-8 md:p-12 flex flex-col relative overflow-hidden">
        <div className="flex-1 flex flex-col justify-between relative z-10">
          <img src={`${BASE}/logo-dark.svg`} alt="Tolumor" className="h-8 w-auto" />

          <div className="max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50 mb-3">
              Almost there
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-5">
              {isStudent ? 'Set up your student profile.' : 'Set up your lecturer profile.'}
            </h1>
            <p className="text-white/70 text-base leading-relaxed">
              {isStudent
                ? 'Tell us a little more so we can personalise your learning experience from day one.'
                : 'Help us understand your expertise so students can find your modules easily.'}
            </p>
          </div>

          <p className="text-xs text-white/30">© {new Date().getFullYear()} Tolumor Educational Services</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="md:w-[60%] bg-[#F5F2EB] overflow-y-auto flex flex-col">
        <div className="flex flex-col max-w-lg mx-auto w-full px-8 md:px-12 py-12">

          <h2 className="font-serif text-2xl font-bold text-primary mb-1">
            {isStudent ? 'Your learning profile' : 'Your teaching profile'}
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            {isStudent
              ? `Welcome, ${displayName || 'friend'}. Let's get your profile ready.`
              : `Welcome, ${displayName || 'friend'}. A few details about your teaching.`}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Display name */}
            <div>
              <label className={labelClass}>Display Name</label>
              <input
                className={inputClass}
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="How should we address you?"
                required
              />
            </div>

            {isStudent ? (
              <>
                {/* Area of law */}
                <div>
                  <label className={labelClass}>Area of Law You're Most Interested In</label>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={lawArea}
                      onChange={e => setLawArea(e.target.value)}
                      required
                    >
                      <option value="">Select an area</option>
                      {LAW_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▼</span>
                  </div>
                </div>

                {/* Study goal */}
                <div>
                  <label className={labelClass}>My Primary Study Goal</label>
                  <div className="space-y-2">
                    {STUDY_GOALS.map(goal => (
                      <label
                        key={goal}
                        className={`flex items-start gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                          studyGoal === goal
                            ? 'border-primary bg-primary/5'
                            : 'border-border bg-white hover:border-primary/40'
                        }`}
                      >
                        <input
                          type="radio"
                          name="studyGoal"
                          value={goal}
                          checked={studyGoal === goal}
                          onChange={() => setStudyGoal(goal)}
                          className="mt-0.5 accent-[#1a4d35]"
                          required
                        />
                        <span className="text-sm text-foreground">{goal}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Teaching area */}
                <div>
                  <label className={labelClass}>Primary Teaching Area</label>
                  <div className="relative">
                    <select
                      className={selectClass}
                      value={teachingArea}
                      onChange={e => setTeachingArea(e.target.value)}
                      required
                    >
                      <option value="">Select subject area</option>
                      {TEACHING_AREAS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">▼</span>
                  </div>
                </div>

                {/* Years of experience */}
                <div>
                  <label className={labelClass}>Years of Teaching Experience</label>
                  <input
                    className={inputClass}
                    type="number"
                    min="0"
                    max="60"
                    value={yearsExp}
                    onChange={e => setYearsExp(e.target.value)}
                    placeholder="e.g. 5"
                    required
                  />
                </div>
              </>
            )}

            {/* Submit */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Signing in as&nbsp;
                <span className="font-medium text-foreground">
                  {user?.primaryEmailAddress?.emailAddress ?? stored.firstName ?? 'you'}
                </span>
              </p>
              <button
                type="submit"
                disabled={upsertMe.isPending}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1a4d35] hover:bg-[#1a4d35]/90 text-white font-semibold px-6 py-2.5 text-sm transition-colors disabled:opacity-60"
              >
                {upsertMe.isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                ) : (
                  <>Go to Dashboard <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
