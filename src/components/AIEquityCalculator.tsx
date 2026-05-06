import React, { useState } from 'react';
import { Sparkles, Send, Loader2, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface AIEquityCalculatorProps {
  currentData: any;
}

const EXAMPLE_PROMPTS = [
  "If I raise ₹2 Cr at a ₹10 Cr pre-money valuation, what is my dilution?",
  "How many shares should I reserve for a 10% ESOP pool?",
  "An angel is investing ₹50 Lakhs. What percentage do they get at my current valuation?",
];

export const AIEquityCalculator: React.FC<AIEquityCalculatorProps> = ({ currentData }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async (question?: string) => {
    const q = question ?? prompt;
    if (!q.trim()) return;
    if (question) setPrompt(question);

    setLoading(true);
    setResponse('');
    try {
      const res = await fetch('http://localhost:3001/api/ai/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q, currentCapTable: currentData }),
      });
      if (!res.ok) throw new Error('AI request failed');
      const data = await res.json();
      setResponse(data.result);
    } catch {
      toast({
        title: 'Could not reach AI server',
        description: 'Make sure the backend is running on port 3001.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header / Intro */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-200">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4 backdrop-blur-sm border border-white/10">
              Powered by AI
            </div>
            <h2 className="text-3xl font-black tracking-tight mb-3">AI Equity Advisor</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Ask complex equity questions in plain English. Our advisor analyzes your current cap table to provide accurate dilution, ownership, and exit simulations.
            </p>
          </div>
          <div className="hidden md:flex bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm items-start gap-3 max-w-xs">
            <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-normal italic">
              "Dilution is the process where existing shareholders see their ownership percentage decrease as new shares are issued."
            </p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Your Question</p>
              <div className="relative">
                <textarea
                  placeholder="e.g. What happens if I raise ₹1 Cr from an angel?"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCalculate(); }}
                  className="w-full h-32 p-4 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all resize-none font-medium"
                />
                <div className="absolute bottom-3 right-3 text-[10px] text-slate-400">
                  CMD + Enter to ask
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  onClick={() => handleCalculate()}
                  disabled={loading || !prompt.trim()}
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-8 h-12 font-bold transition-all shadow-lg shadow-slate-200 active:scale-95"
                >
                  {loading ? <><Loader2 size={16} className="mr-2 animate-spin" /> Analyzing...</> : <><Send size={16} className="mr-2" /> Ask Advisor</>}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Response area */}
          {response && (
            <Card className="border-none shadow-xl shadow-slate-100 rounded-2xl overflow-hidden bg-white">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Info size={18} className="text-slate-900" />
                  </div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Advisor Insight</p>
                </div>
                <div className="text-slate-800 leading-relaxed space-y-4 text-[15px]">
                  {response.split('\n').map((line, i) => (
                    <p key={i} className={line.startsWith('-') || line.startsWith('*') ? 'pl-4 border-l-2 border-slate-100' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Examples Sidebar */}
        <div className="space-y-4">
          <p className="text-xs font-extrabold text-slate-400 uppercase tracking-widest px-1">Common Queries</p>
          {EXAMPLE_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => handleCalculate(p)}
              className="w-full text-left p-4 bg-white border border-slate-100 rounded-2xl hover:border-slate-900 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 p-1 rounded bg-slate-50 text-slate-400 group-hover:text-slate-900 transition-colors">
                  <Send size={10} />
                </div>
                <span className="text-xs font-bold text-slate-600 leading-relaxed group-hover:text-slate-900">
                  {p}
                </span>
              </div>
            </button>
          ))}
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
            <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-2">Pro Tip</h4>
            <p className="text-[11px] text-slate-800 leading-relaxed opacity-70">
              Include specific numbers for more accurate simulations. The AI considers your current shareholders, authorized shares, and liquidation preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
