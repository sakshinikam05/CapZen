import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPw) {
      toast({ title: 'Fill in all fields', variant: 'destructive' });
      return;
    }
    if (password !== confirmPw) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    const result = await signup(name, email, password);
    setSubmitting(false);
    if (result.success) {
      toast({ title: 'Welcome to CapZen!' });
      navigate('/dashboard');
    } else {
      toast({ title: 'Sign up failed', description: result.error || 'Could not create account.', variant: 'destructive' });
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <Link to="/" className="auth-card-logo">CapZen</Link>

        <h1 className="auth-form-title">Create your account</h1>
        <p className="auth-form-sub">Free to start. No credit card required.</p>

        <form onSubmit={handleSubmit} id="signup-form">
          <div className="auth-field">
            <label htmlFor="signup-name" className="auth-label">Full name</label>
            <input
              id="signup-name"
              type="text"
              placeholder="Rahul Sharma"
              value={name}
              onChange={e => setName(e.target.value)}
              className="auth-input"
              autoComplete="name"
              autoFocus
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-email" className="auth-label">Email address</label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="auth-input"
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="signup-password" className="auth-label">Password</label>
            <div className="auth-pw-wrap">
              <input
                id="signup-password"
                type={showPw ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="auth-input"
                autoComplete="new-password"
              />
              <button type="button" className="auth-pw-eye" onClick={() => setShowPw(!showPw)} tabIndex={-1} id="signup-toggle-pw">
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="signup-confirm-pw" className="auth-label">Confirm password</label>
            <input
              id="signup-confirm-pw"
              type={showPw ? 'text' : 'password'}
              placeholder="Re-enter your password"
              value={confirmPw}
              onChange={e => setConfirmPw(e.target.value)}
              className="auth-input"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="auth-submit" disabled={submitting} id="signup-submit">
            {submitting ? <><Loader2 size={15} className="spin" /> Creating account…</> : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <Link to="/login" id="signup-to-login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
