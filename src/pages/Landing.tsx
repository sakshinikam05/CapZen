import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart2, Shield, Users, Sparkles, FileSpreadsheet,
  TrendingUp, ArrowRight, Check
} from 'lucide-react';
import { Logo } from '@/components/Logo';

const Landing = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="lp-root">

      {/* ── NAV ── */}
      <header className="lp-nav">
        <div className="lp-nav-inner">
          <Logo size="lg" />
          <nav className="lp-nav-links">
            <a href="#features" className="lp-nav-link">Features</a>
            <a href="#how-it-works" className="lp-nav-link">How it works</a>
            <a href="#pricing" className="lp-nav-link">Pricing</a>
          </nav>
          <div className="lp-nav-actions">
            <Link to="/login" className="lp-btn-ghost">Sign in</Link>
            <Link to="/signup" className="lp-btn-cta">Get started</Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="lp-hero" style={{ minHeight: 'calc(100vh - 64px)' }}>
        {/* Left copy */}
        <div>
          <div className="lp-hero-badge">
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
            Built for Indian Founders
          </div>
          <h1 className="lp-hero-title">
            Your company's equity,<br />
            perfectly managed.
          </h1>
          <p className="lp-hero-desc">
            CapZen is a cap table management platform for Indian startups. Track shareholders, model funding rounds, manage ESOPs, and get AI-powered equity insights all in INR.
          </p>
          <div className="lp-hero-actions">
            <Link to="/signup" className="lp-btn-primary">
              Start for free <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="lp-btn-secondary">Sign in</Link>
          </div>
        </div>

        {/* Right preview */}
        <div className="lp-preview">
          <div className="lp-preview-topbar">
            <div className="lp-preview-dot" />
            <div className="lp-preview-dot" />
            <div className="lp-preview-dot" />
            <span className="lp-preview-title">CapZen Dashboard</span>
          </div>
          <div className="lp-preview-body">
            <div className="lp-preview-stats">
              <div className="lp-preview-stat">
                <div className="lp-preview-stat-val">5</div>
                <div className="lp-preview-stat-lbl">Shareholders</div>
              </div>
              <div className="lp-preview-stat">
                <div className="lp-preview-stat-val">₹5 Cr</div>
                <div className="lp-preview-stat-lbl">Valuation</div>
              </div>
              <div className="lp-preview-stat">
                <div className="lp-preview-stat-val">10%</div>
                <div className="lp-preview-stat-lbl">ESOP Pool</div>
              </div>
              <div className="lp-preview-stat">
                <div className="lp-preview-stat-val">1 Cr</div>
                <div className="lp-preview-stat-lbl">Shares</div>
              </div>
            </div>

            <div style={{ borderRadius: 10, overflow: 'hidden', border: '1px solid #f1f5f9' }}>
              <div className="lp-preview-table-head">
                <span>Shareholder</span>
                <span style={{ textAlign: 'right' }}>Shares</span>
                <span style={{ textAlign: 'right' }}>Ownership</span>
              </div>
              {[
                { name: 'Founder', shares: '50,00,000', pct: '50%' },
                { name: 'Co-Founder', shares: '30,00,000', pct: '30%' },
                { name: 'Angel Round', shares: '10,00,000', pct: '10%' },
                { name: 'ESOP Pool', shares: '10,00,000', pct: '10%' },
              ].map(r => (
                <div key={r.name} className="lp-preview-row">
                  <span className="lp-preview-name">{r.name}</span>
                  <span className="lp-preview-val">{r.shares}</span>
                  <span className="lp-preview-pct">{r.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-section lp-section-alt" id="features">
        <div className="lp-section-inner">
          <div className="lp-section-label">Features</div>
          <h2 className="lp-section-title">Everything you need to manage equity</h2>
          <p className="lp-section-sub">
            From seed to Series A and beyond — CapZen keeps your ownership structure clean and accurate.
          </p>

          <div className="lp-features">
            {[
              {
                icon: <FileSpreadsheet size={18} />,
                title: 'Cap Table Management',
                desc: 'Maintain an accurate, real-time record of all shareholders, share classes, and ownership percentages.'
              },
              {
                icon: <TrendingUp size={18} />,
                title: 'Funding Round Modeling',
                desc: 'Model seed, angel, and Series rounds in INR. See the exact dilution impact before you sign term sheets.'
              },
              {
                icon: <Users size={18} />,
                title: 'ESOP & Stock Grants',
                desc: 'Manage your employee stock option pool, vesting schedules, cliff periods, and grant records in one place.'
              },
              {
                icon: <Sparkles size={18} />,
                title: 'AI Equity Advisor',
                desc: 'Ask complex equity questions in plain English. Get instant, data-driven answers based on your actual cap table.'
              },
              {
                icon: <BarChart2 size={18} />,
                title: 'Waterfall Analysis',
                desc: 'Simulate exit scenarios and calculate exact payouts for each shareholder based on liquidation preferences.'
              },
              {
                icon: <Shield size={18} />,
                title: 'Convertible Notes & SAFEs',
                desc: 'Track SAFEs and convertible instruments, including discount rates, valuation caps, and conversion dates.'
              }
            ].map(f => (
              <div key={f.title} className="lp-feat-card">
                <div className="lp-feat-icon">{f.icon}</div>
                <div className="lp-feat-title">{f.title}</div>
                <p className="lp-feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="lp-section" id="how-it-works">
        <div className="lp-section-inner">
          <div className="lp-section-label">How it works</div>
          <h2 className="lp-section-title">Up and running in minutes</h2>
          <div className="lp-steps">
            {[
              { n: '01', title: 'Create your account', desc: 'Sign up free. Your data is securely stored and private to your account.' },
              { n: '02', title: 'Set up your company', desc: 'Enter your company name, authorized share count, and incorporation details.' },
              { n: '03', title: 'Add shareholders', desc: 'Add founders, investors, and employees with their share counts and types.' },
              { n: '04', title: 'Model & analyze', desc: 'Run round simulations, waterfall analyses, and ask the AI advisor anything.' }
            ].map(s => (
              <div key={s.n}>
                <div className="lp-step-num">STEP {s.n}</div>
                <div className="lp-step-title">{s.title}</div>
                <p className="lp-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="lp-section lp-section-alt" id="pricing">
        <div className="lp-section-inner">
          <div className="lp-section-label">Pricing</div>
          <h2 className="lp-section-title">Simple, transparent pricing</h2>
          <p className="lp-section-sub">No hidden fees. Start free, upgrade when you're ready.</p>

          <div className="lp-plans">
            <div className="lp-plan">
              <div className="lp-plan-name">Starter</div>
              <div className="lp-plan-price">₹0 <span className="lp-plan-per">/month</span></div>
              <ul className="lp-plan-feats">
                <li>Up to 10 shareholders</li>
                <li>1 funding round</li>
                <li>Basic cap table view</li>
                <li>XLSX export</li>
              </ul>
              <Link to="/signup" className="lp-plan-btn">Get started free</Link>
            </div>

            <div className="lp-plan lp-plan-popular">
              <div className="lp-plan-name">Pro</div>
              <div className="lp-plan-price">₹1,999 <span className="lp-plan-per">/month</span></div>
              <ul className="lp-plan-feats">
                <li>Unlimited shareholders</li>
                <li>Unlimited funding rounds</li>
                <li>AI Equity Advisor</li>
                <li>Waterfall analysis</li>
                <li>ESOP & convertible tracking</li>
              </ul>
              <Link to="/signup" className="lp-plan-btn">Start Pro trial</Link>
            </div>

            <div className="lp-plan">
              <div className="lp-plan-name">Enterprise</div>
              <div className="lp-plan-price" style={{ fontSize: '1.75rem' }}>Custom</div>
              <ul className="lp-plan-feats">
                <li>Everything in Pro</li>
                <li>Dedicated onboarding</li>
                <li>Legal compliance review</li>
                <li>Priority support</li>
              </ul>
              <a href="mailto:hello@capzen.in" className="lp-plan-btn">Contact us</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="lp-cta">
        <Logo className="justify-center mb-8" size="xxl" />
        <h2 className="lp-cta-title">Start managing your cap table today</h2>
        <p className="lp-cta-sub">Free to start. No credit card required.</p>
        <Link to="/signup" className="lp-cta-btn">
          Create free account <ArrowRight size={16} />
        </Link>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <Logo size="md" />
          <p className="lp-footer-copy">© {new Date().getFullYear()} CapZen. Built for Indian founders.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
