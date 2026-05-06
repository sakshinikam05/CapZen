import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building, Users, TrendingUp, ArrowRight, Check, Shield, Globe, Zap
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { Footer } from '@/components/Footer';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Simple Navigation */}
      <header className="border-b border-slate-100 py-6">
        <div className="container mx-auto px-6 flex items-center justify-between" style={{ maxWidth: 1200 }}>
          <Logo size="md" />
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Features</a>
              <a href="#pricing" className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Pricing</a>
            </nav>
            <div className="flex items-center gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-bold text-slate-900 uppercase tracking-widest">Sign in</Link>
                  <Link to="/signup" className="px-6 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 transition-all">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Simple Hero Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto text-center" style={{ maxWidth: 1200 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8">
            <Zap size={12} fill="currentColor" /> Premium Cap Table Infrastructure
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8">
            Manage Equity with <br/>
            <span className="text-slate-400">Absolute Clarity.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            CapZen provides Indian startups with enterprise-grade cap table management. Track shareholders, model dilution, and manage ESOPs — strictly in INR.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl text-lg font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                Go to Dashboard <ArrowRight size={20} />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl text-lg font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  Start for Free <ArrowRight size={20} />
                </Link>
                <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-900 rounded-xl text-lg font-bold hover:border-slate-900 transition-all flex items-center justify-center">
                  Book a Demo
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="container mx-auto px-6" style={{ maxWidth: 1200 }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white mb-6">
                <Building size={24} />
              </div>
              <h3 className="text-xl font-black mb-3">Cap Table Management</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                A single source of truth for your equity. Track common shares, preferred stock, and convertibles with ease.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white mb-6">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-black mb-3">Dilution Modeling</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Model future funding rounds and understand how they impact current shareholders using our AI-powered advisor.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-black mb-3">ESOP Management</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Design and manage employee stock option pools. Automate vesting schedules and grant letters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto text-center" style={{ maxWidth: 800 }}>
          <h2 className="text-4xl font-black tracking-tight mb-6">Ready to streamline your equity?</h2>
          <p className="text-slate-500 mb-10 font-medium">Join 500+ Indian startups managing their cap tables on CapZen.</p>
          <Link to="/signup" className="px-10 py-4 bg-slate-900 text-white rounded-xl text-lg font-bold hover:bg-slate-800 transition-all inline-flex items-center gap-2">
            Get Started Now <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
