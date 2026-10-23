'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import axios from 'axios';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await axios.post('/api/login', { email, password });
      router.replace('/dashboard');
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? String(err.response.data.message)
          : 'Login failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="ps-card ps-glow w-full max-w-[420px] p-9 animate-fade-in">
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 bg-gradient-to-br from-ps-primary to-ps-primary-hover ps-glow">
            <span className="text-white font-extrabold text-2xl">P</span>
          </div>
          <h1 className="text-white font-bold text-[22px]">ParkSense AI</h1>
          <p className="text-ps-text-muted text-[13px] mt-1">
            Smart parking for smarter cities
          </p>
          <p className="text-ps-text-muted text-[11px] mt-3">
            Test account: <span className="text-white">test@example.com</span> /{' '}
            <span className="text-white">password</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ps-text-muted" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="ps-input w-full h-12 pl-10 pr-3 text-white placeholder:text-ps-text-muted text-sm"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-ps-text-muted" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="ps-input w-full h-12 pl-10 pr-10 text-white placeholder:text-ps-text-muted text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ps-text-muted hover:text-white ps-transition"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="flex justify-end">
            <Link href="/login" className="text-ps-primary text-xs hover:text-ps-primary-hover ps-transition">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="text-ps-occupied text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-btn bg-ps-primary text-white font-semibold text-sm hover:bg-ps-primary-hover hover:ps-glow ps-transition disabled:opacity-60"
          >
            {submitting ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-ps-text-muted text-xs">or continue with</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <button
          type="button"
          disabled
          className="w-full h-12 rounded-btn bg-ps-card-2 border border-white/10 flex items-center justify-center gap-3 text-white text-sm font-medium opacity-50 cursor-not-allowed"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="text-center text-ps-text-muted text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-ps-primary font-semibold hover:text-ps-primary-hover ps-transition">
            Register
          </Link>
        </p>
      </div>

      <p className="flex items-center gap-2 text-ps-text-muted text-xs mt-6">
        <ShieldCheck size={14} />
        Protected by AI-powered security
      </p>
    </main>
  );
}
