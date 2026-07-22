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
  "Redeemer's University",
  'Other',
];

const YEAR_LEVELS = [
  'Year 1 (100 Level)',
  'Year 2 (200 Level)',
  'Year 3 (300 Level)',
  'Year 4 (400 Level)',
  'Year 5 (500 Level)',
];

const POSITIONS = [
  'Lecturer I',
  'Lecturer II',
  'Senior Lecturer',
  'Associate Professor',
  'Professor',
  'Visiting Lecturer',
  'Legal Practitioner / Tutor',
];

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors';
const labelClass =
  'block text-[10px] font-semibold uppercase tracking-widest mb-1.5';
const selectClass =
  'w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors appearance-none cursor-pointer';

const labelStyle = { color: 'rgba(255,255,255,0.6)' };

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
    phone: '',
    university: '',
    yearLevel: '',
    department: '',
    position: '',
    gender: '',
    password: '',
  });

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
          ...(role === 'student'
            ? { yearLevel: form.yearLevel }
            : { phone: form.phone, department: form.department, position: form.position }),
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

  /* ── Verification step ─────────────────────────────────── */
  if (step === 'verify') {
    return (
      <div>
        <p className="text-sm text-white/70 mb-4">
          We sent a 6-digit code to{' '}
          <strong className="text-white">{form.email}</strong>. Enter it below.
        </p>
        {error && <p className="text-red-300 text-sm mb-4">{error}</p>}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className={labelClass} style={labelStyle}>
              Verification Code
            </label>
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

  /* ── Main form ─────────────────────────────────────────── */
  return (
    <div>
      {/* Dynamic heading */}
      <div className="mb-5">
        <h1 className="font-serif text-2xl font-bold text-white mb-1">
          {role === 'student' ? 'Start your learning journey' : 'Apply as a Lecturer'}
        </h1>
        <p className="text-sm text-white/60">
          {role === 'student'
            ? 'Join 12,400+ African university students already on Tolumo.'
            : 'Join our growing network of verified Nigerian law lecturers.'}
        </p>
      </div>

      {/* Role toggle */}
      <div className="flex rounded-lg bg-white/10 p-1 mb-5">
        {(['student', 'tutor'] as const).map(r => (
          <button
            key={r}
            type="button"
            onClick={() => setRole(r)}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-colors ${
              role === r
                ? 'bg-primary text-white shadow-sm'
                : 'text-white/60 hover:text-white'
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
            <label className={labelClass} style={labelStyle}>
              First Name
            </label>
            <input
              className={inputClass}
              placeholder={role === 'student' ? 'Chisom' : 'Olumide'}
              value={form.firstName}
              onChange={set('firstName')}
              required
            />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>
              Last Name
            </label>
            <input
              className={inputClass}
              placeholder={role === 'student' ? 'Nwosu' : 'Babatunde'}
              value={form.lastName}
              onChange={set('lastName')}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className={labelClass} style={labelStyle}>
            Email Address
          </label>
          <input
            className={inputClass}
            type="email"
            placeholder={
              role === 'student' ? 'chisom@unilag.edu.ng' : 'o.babatunde@unilag.edu.ng'
            }
            value={form.email}
            onChange={set('email')}
            required
          />
        </div>

        {/* Phone — tutor only */}
        {role === 'tutor' && (
          <div>
            <label className={labelClass} style={labelStyle}>
              Phone Number <span className="text-accent">*</span>
            </label>
            <input
              className={inputClass}
              type="tel"
              placeholder="+234 800 000 0000"
              value={form.phone}
              onChange={set('phone')}
              required
            />
            <p className="text-[11px] text-white/40 mt-1">
              Used by your assigned Sub-Agent to verify your identity.
            </p>
          </div>
        )}

        {/* University */}
        <div className="relative">
          <label className={labelClass} style={labelStyle}>
            University / Institution
          </label>
          <select
            className={selectClass}
            value={form.university}
            onChange={set('university')}
            required
          >
            <option value="">Select your university</option>
            {NIGERIAN_UNIVERSITIES.map(u => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-[2.2rem] text-muted-foreground">
            ▾
          </span>
        </div>

        {/* Department — tutor only */}
        {role === 'tutor' && (
          <div>
            <label className={labelClass} style={labelStyle}>
              Department / Faculty
            </label>
            <input
              className={inputClass}
              placeholder="e.g. Department of Public Law"
              value={form.department}
              onChange={set('department')}
              required
            />
          </div>
        )}

        {/* Position — tutor only */}
        {role === 'tutor' && (
          <div className="relative">
            <label className={labelClass} style={labelStyle}>
              Position / Title
            </label>
            <select
              className={selectClass}
              value={form.position}
              onChange={set('position')}
              required
            >
              <option value="">Select position</option>
              {POSITIONS.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-[2.2rem] text-muted-foreground">
              ▾
            </span>
          </div>
        )}

        {/* Year level — student only */}
        {role === 'student' && (
          <div className="relative">
            <label className={labelClass} style={labelStyle}>
              Current Year/Level (Law Programme)
            </label>
            <select
              className={selectClass}
              value={form.yearLevel}
              onChange={set('yearLevel')}
              required
            >
              <option value="">Select your year</option>
              {YEAR_LEVELS.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-3 top-[2.2rem] text-muted-foreground">
              ▾
            </span>
          </div>
        )}

        {/* Gender + Password */}
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <label className={labelClass} style={labelStyle}>
              Gender
            </label>
            <select
              className={selectClass}
              value={form.gender}
              onChange={set('gender')}
              required
            >
              <option value="">Select</option>
              <option>Male</option>
              <option>Female</option>
              <option>Prefer not to say</option>
            </select>
            <span className="pointer-events-none absolute right-3 top-[2.2rem] text-muted-foreground">
              ▾
            </span>
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>
              Password
            </label>
            <input
              className={inputClass}
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set('password')}
              required
              minLength={8}
            />
          </div>
        </div>

        {/* Tutor info box */}
        {role === 'tutor' && (
          <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-900 leading-relaxed">
            After registration your application goes to a local Sub-Agent for identity
            verification. You'll receive an email once approved — usually within 1–2 business
            days.
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={
            role === 'student'
              ? { backgroundColor: 'hsl(43,74%,49%)', color: '#fff' }
              : { backgroundColor: 'hsl(153,54%,15%)', color: '#fff' }
          }
          className="w-full rounded-lg py-3 text-sm font-semibold tracking-wide transition-opacity disabled:opacity-60 mt-1"
        >
          {loading
            ? role === 'student'
              ? 'Creating account…'
              : 'Submitting application…'
            : role === 'student'
            ? 'Create My Account'
            : 'Submit Application'}
        </button>

        <p className="text-center text-xs text-white/40 pt-1">
          By signing up, you agree to our{' '}
          <a href="#" className="underline text-white/60 hover:text-white">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="underline text-white/60 hover:text-white">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
}
