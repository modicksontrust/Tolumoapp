import { useState } from 'react';
import { useSignIn } from '@clerk/react';

const inputClass =
  'w-full rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors';
const labelClass =
  'block text-[10px] font-semibold uppercase tracking-widest text-white/60 mb-1.5';

export default function CustomSignInForm() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) return;
    setError('');
    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
      }
      // Whether complete or needs_second_factor, go straight to the app.
      // Auth guards are off during development.
      window.location.href = '/';
    } catch (err: any) {
      setError(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass}>Email Address</label>
        <input
          className={inputClass}
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
      </div>
      <div>
        <label className={labelClass}>Password</label>
        <input
          className={inputClass}
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
      </div>

      {error && <p className="text-red-300 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        style={{ backgroundColor: 'hsl(43,74%,49%)', color: '#fff' }}
        className="w-full rounded-lg py-3 text-sm font-semibold tracking-wide transition-opacity disabled:opacity-60"
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
