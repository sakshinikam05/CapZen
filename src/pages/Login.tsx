import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Fill in all fields', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      toast({ title: 'Sign in failed', description: result.error || 'Invalid credentials.', variant: 'destructive' });
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <Logo className="justify-center mb-8" size="lg" />

        <h1 className="auth-form-title">Welcome back</h1>
        <p className="auth-form-sub">Sign in to your CapZen account</p>

        <form onSubmit={handleSubmit} id="login-form">
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">Email address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="auth-input"
              autoComplete="email"
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label htmlFor="login-password" className="auth-label">Password</label>
            <div className="auth-pw-wrap">
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="auth-input"
                autoComplete="current-password"
              />
              <button type="button" className="auth-pw-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1} id="login-toggle-pw">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={submitting} id="login-submit">
            {submitting ? <><Loader2 size={15} className="spin" /> Signing in…</> : 'Sign in'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/signup" id="login-to-signup">Create one free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
