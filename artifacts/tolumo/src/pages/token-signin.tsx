import { useEffect, useState } from 'react';
import { useSignIn } from '@clerk/react';

export default function TokenSignIn() {
  const { signIn, isLoaded, setActive } = useSignIn();
  const [status, setStatus] = useState('Signing you in…');

  useEffect(() => {
    if (!isLoaded) return;
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) { setStatus('No token provided.'); return; }

    signIn
      .create({ strategy: 'ticket', ticket: token })
      .then(async result => {
        if (result.status === 'complete') {
          await setActive({ session: result.createdSessionId });
          window.location.href = '/';
        } else {
          setStatus('Sign-in incomplete: ' + result.status);
        }
      })
      .catch(err => {
        setStatus(err?.errors?.[0]?.longMessage ?? err?.message ?? 'Sign-in failed.');
      });
  }, [isLoaded]);

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#F5F2EB]">
      <p className="text-primary font-serif text-lg">{status}</p>
    </div>
  );
}
