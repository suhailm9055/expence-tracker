"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Wallet, Mail, KeyRound } from "lucide-react";

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
      <path fill="#4285F4" d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.2c1.9-1.7 3.1-4.3 3.1-7.4Z" />
      <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.3H2.9v2.6A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.2 13.7A6 6 0 0 1 5.9 12c0-.6.1-1.2.3-1.7V7.7H2.9A10 10 0 0 0 2 12c0 1.6.4 3.1.9 4.3l3.3-2.6Z" />
      <path fill="#EA4335" d="M12 6c1.5 0 2.9.5 3.9 1.5l2.9-2.9C17 2.9 14.7 2 12 2a10 10 0 0 0-9.1 5.7l3.3 2.6C7 7.8 9.3 6 12 6Z" />
    </svg>
  );
}

export default function LoginPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(new URLSearchParams(window.location.search).get("error"));
  }, []);

  async function handleEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  async function handlePasswordAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "signIn") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      window.location.assign("/dashboard");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else if (data.session) {
      window.location.assign("/dashboard");
    } else {
      setSent(true);
    }
  }

  async function handleGoogle() {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) setError(error.message);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm card p-8">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Wallet size={18} className="text-primary" />
          </div>
          <span className="font-semibold text-lg">Expense Tracker</span>
        </div>

        {sent ? (
          <div className="text-sm text-text">
            <p className="mb-2 font-medium">Check your inbox</p>
            <p className="text-muted">
              We sent a confirmation or sign-in link to <span className="text-text">{email}</span>.
            </p>
            <button type="button" onClick={() => setSent(false)} className="text-primary text-xs mt-5 hover:underline">
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            {/* <button
              onClick={handleGoogle}
              className="btn-ghost w-full flex items-center justify-center gap-2 mb-4"
            >
              <GoogleLogo />
              Continue with Google
            </button> */}

            {/* <div className="flex items-center gap-3 my-4">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted">OR USE PASSWORD</span>
              <div className="h-px bg-border flex-1" />
            </div> */}

            <form onSubmit={handlePasswordAuth} className="space-y-3">
              <label className="text-xs text-muted">Email address</label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input w-full !pl-9"
                />
              </div>
              <label className="text-xs text-muted">Password</label>
              <div className="relative">
                <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete={mode === "signIn" ? "current-password" : "new-password"}
                  className="input w-full !pl-9"
                />
              </div>
              {error && <p className="text-xs text-danger">{error}</p>}
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Please wait..." : mode === "signIn" ? "Sign in" : "Create account"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode((current) => (current === "signIn" ? "signUp" : "signIn"));
                setError(null);
              }}
              className="text-primary text-xs mt-4 hover:underline"
            >
              {mode === "signIn" ? "New here? Create an account" : "Already have an account? Sign in"}
            </button>

            <div className="flex items-center gap-3 my-5">
              <div className="h-px bg-border flex-1" />
              <span className="text-xs text-muted">OR</span>
              <div className="h-px bg-border flex-1" />
            </div>

            <form onSubmit={handleEmailOtp}>
              <button type="submit" disabled={loading || !email} className="btn-ghost w-full">
                Send a magic link instead
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
