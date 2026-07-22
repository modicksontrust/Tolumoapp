import { useState } from 'react';
import { useSignUp } from '@clerk/react';

const NIGERIAN_UNIVERSITIES = [
  'University of Lagos (UNILAG)',
  'University of Nigeria, Nsukka (UNN)',
  'Obafemi Awolowo University (OAU)',
  'Ahmadu Bello University (ABU)',
  'University of Benin (UNIBEN)',
  'University of Ibadan (UI)',
  'University of Ilorin (UNILORIN)',
  'Rivers State University',
  'Bayero University, Kano (BUK)',
  'Delta State University (DELSU)',
  'Imo State University (IMSU)',
  'Ekiti State University (EKSU)',
  'Afe Babalola University (ABUAD)',
  'Babcock University',
  'Covenant University',
  'Lead City University',
  'Madonna University',
  'Redeemer\'s University',
  'Other',
];

const YEAR_LEVELS = [
  'Year 1 (100 Level)',
  'Year 2 (200 Level)',
  'Year 3 (300 Level)',
  'Year 4 (400 Level)',
  'Year 5 (500 Level)',
];

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors';
const labelClass = 'block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5';
const selectClass =
  'w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors appearance-none cursor-pointer';

export default function CustomSignUpForm() {
  const { signUp, isLoaded } = useSignUp();

  const [role, setRole] = useState<'student' | 'tutor'>('student');
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    yearLevel: '',
    gender: '',
    password: '',
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setError('');
    setLoading(true);
    try {
      await signUp.create({
        firstName: form.firstName,
        lastName: form.lastName,
        emailAddress: form.email,
        password: form.password,
        unsafeMetadata: {
          role,
          university: form.university,
          yearLevel: form.yearLevel,
          gender: form.gender,
        },
      });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep('verify');
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setError('');
    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === 'complete') {
        window.location.href = '/';
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Invalid code.');
    } finally {
      setLoading(false);
    }
  }

  if (step === 'verify') {
    return (
      <div>
        <p className="text-sm text-white/70 mb-4">
          We sent a 6-digit code to <strong className="text-white">{form.email}</strong>. Enter it below.
        </p>
        {error && <p className="text-red-300 text-sm mb-4">{error}</p>}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Verification Code</label>
            <input
              className={inputClass}
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: 'hsl(43,74%,49%)', color: '#fff' }}
            className="w-full rounded-lg py-2.5 text-sm font-semibold transition-opacity disabled:opacity-60"
          >
            {loading ? 'Verifying…' : 'Verify Email'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      {/* Role toggle */}
      <div className="flex rounded-lg bg-white/10 p-1 mb-5">
        {(['student', 'tutor'] as const).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              role === r ? 'bg-primary text-white shadow-sm' : 'text-white/60 hover:text-white'
            }`}
          >
            {r === 'student' ? 'Student' : 'Lecturer / Tutor'}
          </button>
        ))}
      </div>

      {error && <p className="text-red-300 text-sm mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First + Last name */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>First Name</label>
            <input className={inputClass} placeholder="Chisom" value={form.firstName} onChange={set('firstName')} required />
          </div>
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Last Name</label>
            <input className={inputClass} placeholder="Nwosu" value={form.lastName} onChange={set('lastName')} required />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Email Address</label>
          <input className={inputClass} type="email" placeholder="chisom@unilag.edu.ng" value={form.email} onChange={set('email')} required />
        </div>

        {/* University */}
        <div className="relative">
          <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>University / Institution</label>
          <select className={selectClass} value={form.university} onChange={set('university')} required>
            <option value="">Select your university</option>
            {NIGERIAN_UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <span className="pointer-events-none absolute right-3 top-[2.2rem] text-muted-foreground">▾</span>
        </div>

        {/* Year level — students only */}
        {role === 'student' && (
          <div className="relative">
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Current Year/Level (Law Programme)</label>
            <select className={selectClass} value={form.yearLevel} onChange={set('yearLevel')} required>
              <option value="">Select your year</option>
              {YEAR_LEVELS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-[2.2rem] text-muted-foreground">▾</span>
          </div>
        )}

        {/* Gender + Password */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Gender</label>
            <select className={selectClass} value={form.gender} onChange={set('gender')} required>
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Prefer not to say</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-[2.2rem] text-muted-foreground">▾</span>
          </div>
          <div>
            <label className={labelClass} style={{ color: 'rgba(255,255,255,0.6)' }}>Password</label>
            <input className={inputClass} type="password" placeholder="••••••••" value={form.password} onChange={set('password')} required minLength={8} />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{ backgroundColor: 'hsl(43,74%,49%)', color: '#fff' }}
          className="w-full rounded-lg py-3 text-sm font-semibold tracking-wide transition-opacity disabled:opacity-60 mt-2"
        >
          {loading ? 'Creating account…' : 'Create My Account'}
        </button>

        <p className="text-center text-xs text-white/40 pt-1">
          By signing up, you agree to our{' '}
          <a href="#" className="underline text-white/60 hover:text-white">Terms</a>{' '}
          and{' '}
          <a href="#" className="underline text-white/60 hover:text-white">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
}
