import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, ChevronDown, BarChart3, Users, FileText, TrendingUp, Shield, Cpu } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Footer } from '@/components/Footer';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <BarChart3 size={28} />,
      title: 'Cap Table Management',
      desc: 'A real-time, always-accurate cap table. Track every share class, round, and ownership change from day one.',
    },
    {
      icon: <TrendingUp size={28} />,
      title: 'Dilution Modeling',
      desc: 'Run funding round simulations instantly. See exactly how new investors affect existing ownership percentages.',
    },
    {
      icon: <Users size={28} />,
      title: 'Shareholder Registry',
      desc: 'Maintain a clean, auditable record of every shareholder — founders, angels, VCs, and employees.',
    },
    {
      icon: <FileText size={28} />,
      title: 'ESOP & Grants',
      desc: 'Design and manage your employee equity pool. Track vesting schedules and exercise rights with precision.',
    },
    {
      icon: <Cpu size={28} />,
      title: 'AI Equity Advisor',
      desc: 'Ask complex equity questions in plain English. Get instant, data-driven answers tailored to your cap table.',
    },
    {
      icon: <Shield size={28} />,
      title: 'Export & Reports',
      desc: 'Generate board-ready reports and export to Excel with one click. Share data securely with advisors and lawyers.',
    },
  ];

  const faqs = [
    { q: 'Is CapZen built for Indian startups?', a: 'Yes. CapZen natively supports INR, Indian share classes like CCPS and Equity Shares, and standard Indian convertible note structures.' },
    { q: 'Can I export my cap table?', a: 'Absolutely. Export a complete, board-ready XLSX report of your cap table, shareholders, and investment rounds at any time.' },
    { q: 'Is my data secure?', a: 'Your data is encrypted at rest and in transit. Every account uses secure password hashing and session management.' },
    { q: 'Does data persist after logout?', a: 'Yes. All your cap table data is saved to our database and restored automatically when you log back in.' },
  ];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen bg-white text-slate-900">

      {/* ── NAV ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <Logo size="md" />
            <nav className="hidden md:flex items-center gap-8">
              {['Features', 'Process', 'FAQ'].map(l => (
                <a key={l} href={`#${l.toLowerCase()}`} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                  {l}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all">
                Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">Log in</Link>
                <Link to="/signup" className="px-5 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold uppercase tracking-widest mb-8">
            Built for India's founders
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-7">
            Equity management,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-700 to-slate-400">
              simplified.
            </span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            CapZen is the all-in-one platform for Indian startups to manage cap tables, model dilution, track ESOPs, and get AI-powered equity advice — all in INR.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl text-base font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                Open Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 text-white rounded-xl text-base font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2">
                  Start for free <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 text-slate-800 border border-slate-200 rounded-xl text-base font-semibold hover:border-slate-400 transition-all flex items-center justify-center">
                  Log in
                </Link>
              </>
            )}
          </div>
          <p className="mt-5 text-xs text-slate-400 font-medium">No credit card required · Free to start · INR native</p>
        </div>

        {/* Hero Visual */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-100">
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="w-3 h-3 rounded-full bg-slate-200" />
              <div className="ml-4 flex-1 h-6 bg-slate-100 rounded-full max-w-xs" />
            </div>
            {/* Mock dashboard content */}
            <div className="p-8 grid grid-cols-3 gap-4">
              {[
                { label: 'Total Shareholders', val: '—' },
                { label: 'Authorized Shares', val: '—' },
                { label: 'Valuation', val: '₹ —' },
              ].map(c => (
                <div key={c.label} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{c.label}</p>
                  <p className="text-2xl font-black text-slate-200">{c.val}</p>
                </div>
              ))}
            </div>
            <div className="px-8 pb-8 grid grid-cols-5 gap-2">
              {['Company', 'Shareholders', 'Rounds', 'AI Advisor', 'Cap Table'].map(t => (
                <div key={t} className={`py-2 text-center rounded-lg text-[11px] font-bold ${t === 'Shareholders' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>{t}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Everything your startup needs</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">A complete equity toolkit — from incorporation to exit.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-8 bg-white border border-slate-100 rounded-2xl hover:border-slate-300 hover:shadow-lg hover:shadow-slate-100 transition-all group">
                <div className="text-slate-400 group-hover:text-slate-900 transition-colors mb-5">{f.icon}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="process" className="py-24 px-6 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">Get set up in minutes</h2>
          <p className="text-lg text-slate-500">Three steps from zero to a fully managed cap table.</p>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { n: '1', title: 'Create your company', desc: 'Enter your company details, share capital structure, and jurisdiction to set up your workspace.' },
            { n: '2', title: 'Add shareholders & rounds', desc: 'Import founders, investors, and employees. Log investment rounds with valuation and share details.' },
            { n: '3', title: 'Model, analyze & export', desc: 'Use the AI Advisor to simulate future rounds, view dilution, and export board-ready reports.' },
          ].map(step => (
            <div key={step.n} className="relative bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-extrabold mb-6 shadow-lg shadow-slate-200">
                {step.n}
              </div>
              <h3 className="text-lg font-bold mb-3">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHAT'S INCLUDED ── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-extrabold tracking-tight mb-6">All the tools. <br/>One platform.</h2>
            <p className="text-slate-500 text-base leading-relaxed mb-8">
              Stop switching between spreadsheets, lawyers' emails, and disconnected tools. CapZen gives every Indian startup a single source of truth for equity.
            </p>
            <ul className="space-y-4">
              {[
                'Real-time ownership percentages',
                'SAFE & convertible note tracking',
                'ESOP pool management & vesting',
                'Waterfall & exit scenario modeling',
                'AI-powered dilution calculator',
                'One-click XLSX export',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <div className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-white" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 space-y-4">
            {['Cap Table', 'Shareholders', 'Investment Rounds', 'AI Advisor', 'ESOP Grants', 'Waterfall Analysis'].map((tab, i) => (
              <div key={tab} className={`flex items-center gap-4 p-4 rounded-xl border ${i === 1 ? 'bg-white border-slate-200 shadow-sm' : 'border-transparent'}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${i === 1 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {tab.charAt(0)}
                </div>
                <span className={`text-sm font-semibold ${i === 1 ? 'text-slate-900' : 'text-slate-400'}`}>{tab}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-extrabold tracking-tight mb-12 text-center">Common questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <span className="text-base font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 flex-shrink-0 ml-4 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-5 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Ready to take control <br/>of your equity?
          </h2>
          <p className="text-lg text-slate-500 mb-10">Join founders who trust CapZen to manage their most valuable asset.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl text-base font-semibold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
              Start for free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 border border-slate-200 text-slate-700 rounded-xl text-base font-semibold hover:border-slate-400 transition-all flex items-center justify-center">
              Log in
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
