import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, Users, TrendingUp, ArrowRight, Check, Shield, Zap, Mail, ChevronDown, Award, PieChart
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Footer } from '@/components/Footer';

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    { q: "Is CapZen compliant with Indian regulations?", a: "Yes, CapZen is built specifically for Indian startups and supports all standard corporate structures and instruments like CCPS and Equity Shares." },
    { q: "Can I export my data?", a: "Always. You can export your entire cap table, shareholder list, and round history to a professional-grade XLSX format anytime." },
    { q: "How secure is my data?", a: "We use enterprise-grade encryption for all data at rest and in transit. Your cap table is protected by multi-factor authentication." }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Navigation */}
      <header className="border-b border-slate-100 py-4 fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50">
        <div className="container mx-auto px-6 flex items-center justify-between" style={{ maxWidth: 1200 }}>
          <Logo size="md" />
          <div className="flex items-center gap-6">
            <nav className="hidden lg:flex items-center gap-6">
              <a href="#features" className="text-[11px] font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-[0.15em]">Features</a>
              <a href="#how-it-works" className="text-[11px] font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-[0.15em]">Process</a>
              <a href="#faq" className="text-[11px] font-black text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-[0.15em]">FAQ</a>
            </nav>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link to="/dashboard" className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 transition-all">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-[11px] font-black text-slate-900 uppercase tracking-widest px-2">Log In</Link>
                  <Link to="/signup" className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-bold hover:bg-slate-800 transition-all">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="container mx-auto text-center" style={{ maxWidth: 1200 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[9px] font-black uppercase tracking-widest text-slate-500 mb-6">
            <Award size={10} /> The Standard for Indian Startups
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
            Clean Equity Management. <br/>
            <span className="text-slate-300 italic">Pure Clarity.</span>
          </h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
            CapZen is the minimalist, high-performance infrastructure for your startup's cap table. Precise, secure, and built for INR from day one.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link to="/dashboard" className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 text-white rounded-md text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Go to Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 text-white rounded-md text-sm font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  Start for Free <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-5 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-md text-sm font-bold hover:border-slate-900 transition-all flex items-center justify-center">
                  Live Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50/50">
        <div className="container mx-auto px-6" style={{ maxWidth: 1200 }}>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-tight mb-4">Set up in minutes.</h2>
            <p className="text-slate-500 font-medium text-sm">Three steps to a professional cap table.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-8 bg-white border border-slate-100 rounded-2xl">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm mb-6 shadow-lg shadow-slate-200">1</div>
              <h3 className="text-lg font-black mb-3">Add Company</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">Input your basic company details and authorized share capital to create your workspace.</p>
            </div>
            <div className="relative p-8 bg-white border border-slate-100 rounded-2xl">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm mb-6 shadow-lg shadow-slate-200">2</div>
              <h3 className="text-lg font-black mb-3">Import Data</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">Add shareholders, investment rounds, and grants manually or via our bulk importer.</p>
            </div>
            <div className="relative p-8 bg-white border border-slate-100 rounded-2xl">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center font-black text-sm mb-6 shadow-lg shadow-slate-200">3</div>
              <h3 className="text-lg font-black mb-3">Get Insights</h3>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">Use AI Equity Advisor to model rounds, track dilution, and export professional reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Detail Section - Abstracted */}
      <section id="features" className="py-24 px-6">
        <div className="container mx-auto" style={{ maxWidth: 1000 }}>
          <div className="flex flex-col md:flex-row items-center gap-16 mb-24">
            <div className="flex-1 space-y-6">
              <div className="p-2 w-max bg-slate-100 rounded-lg text-slate-900">
                <PieChart size={20} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Real-time Visualizations</h2>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">
                See your ownership structure instantly with dynamic charts. Visualize dilution across rounds and identify key stakeholder concentrations before they become a problem.
              </p>
              <ul className="space-y-3">
                {["Automatic Chart Generation", "Stakeholder Grouping", "Preference Analysis"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    <Check size={14} className="text-slate-900" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 bg-slate-50 rounded-3xl border border-slate-100 p-8 flex flex-col gap-4">
              <div className="h-4 w-3/4 bg-slate-200 rounded-full" />
              <div className="h-4 w-1/2 bg-slate-200 rounded-full" />
              <div className="flex gap-4 mt-4">
                <div className="h-20 w-20 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin-slow" />
                <div className="flex flex-col gap-2 justify-center flex-1">
                  <div className="h-3 w-full bg-slate-100 rounded-full" />
                  <div className="h-3 w-2/3 bg-slate-100 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-6">
              <div className="p-2 w-max bg-slate-100 rounded-lg text-slate-900">
                <Mail size={20} />
              </div>
              <h2 className="text-3xl font-black tracking-tight">Seamless Grants</h2>
              <p className="text-slate-500 font-medium leading-relaxed text-sm">
                Manage your ESOP pool and stock grants in one place. Automatic vesting tracking and easy document generation for your employees.
              </p>
              <ul className="space-y-3">
                {["Vesting Automation", "Grant History", "Exercise Tracking"].map(f => (
                  <li key={f} className="flex items-center gap-3 text-[11px] font-black text-slate-700 uppercase tracking-wider">
                    <Check size={14} className="text-slate-900" /> {f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 bg-slate-50 rounded-3xl border border-slate-100 p-8 flex flex-col gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-white border border-slate-100 rounded-xl flex items-center px-4 gap-4">
                  <div className="w-6 h-6 bg-slate-100 rounded-full" />
                  <div className="flex-1 h-2 bg-slate-50 rounded-full" />
                  <div className="w-12 h-2 bg-slate-900/10 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 bg-slate-50/50 border-t border-slate-100">
        <div className="container mx-auto" style={{ maxWidth: 800 }}>
          <h2 className="text-3xl font-black tracking-tight mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-5 flex items-center justify-between text-left transition-colors hover:bg-slate-50"
                >
                  <span className="text-sm font-black text-slate-900">{faq.q}</span>
                  <ChevronDown size={16} className={`transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="p-5 pt-0 text-[13px] font-medium text-slate-500 leading-relaxed border-t border-slate-50 bg-slate-50/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-slate-900 text-white text-center">
        <div className="container mx-auto" style={{ maxWidth: 600 }}>
          <h2 className="text-4xl font-black tracking-tight mb-6">Built for founders, <br/>by founders.</h2>
          <p className="text-slate-400 mb-10 font-medium">Join the next generation of Indian startups on CapZen.</p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/signup" className="px-6 py-2.5 bg-white text-slate-900 rounded-md text-xs font-black hover:bg-slate-100 transition-all flex items-center gap-2 uppercase tracking-widest">
              Launch Now
            </Link>
            <Link to="/login" className="px-6 py-2.5 bg-slate-800 text-white rounded-md text-xs font-black hover:bg-slate-700 transition-all border border-slate-700 uppercase tracking-widest">
              Demo Access
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
