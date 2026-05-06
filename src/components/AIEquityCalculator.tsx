import React, { useState } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
    <div style={{ maxWidth: 720 }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={18} color="#f59e0b" /> AI Equity Advisor
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
          Ask any question about your cap table — dilution, ownership, rounds — in plain English.
        </p>
      </div>

      {/* Example prompts */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>
          Try asking
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {EXAMPLE_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => handleCalculate(p)}
              style={{
                textAlign: 'left',
                background: '#f8fafc',
                border: '1.5px solid #f1f5f9',
                borderRadius: 8,
                padding: '0.625rem 0.875rem',
                fontSize: '0.875rem',
                color: '#334155',
                cursor: 'pointer',
                transition: 'border-color 0.15s, background 0.15s',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#e2e8f0'; (e.currentTarget as HTMLButtonElement).style.background = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#f1f5f9'; (e.currentTarget as HTMLButtonElement).style.background = '#f8fafc'; }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div style={{ marginBottom: '0.75rem' }}>
        <textarea
          placeholder="Or type your own question here…"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleCalculate(); }}
          rows={3}
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '0.9rem',
            color: '#0f172a',
            background: '#fff',
            border: '1.5px solid #e2e8f0',
            borderRadius: 10,
            outline: 'none',
            resize: 'vertical',
            fontFamily: 'inherit',
            lineHeight: 1.55,
            transition: 'border-color 0.15s',
            boxSizing: 'border-box',
          }}
          onFocus={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = '#0f172a'; }}
          onBlur={e => { (e.currentTarget as HTMLTextAreaElement).style.borderColor = '#e2e8f0'; }}
        />
      </div>

      <button
        onClick={() => handleCalculate()}
        disabled={loading || !prompt.trim()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          height: 44,
          padding: '0 1.5rem',
          background: loading || !prompt.trim() ? '#e2e8f0' : '#0f172a',
          color: loading || !prompt.trim() ? '#94a3b8' : '#fff',
          fontWeight: 700,
          fontSize: '0.9rem',
          border: 'none',
          borderRadius: 9,
          cursor: loading || !prompt.trim() ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          transition: 'background 0.15s',
        }}
      >
        {loading ? <><Loader2 size={15} className="spin" /> Thinking…</> : <><Send size={14} /> Ask AI</>}
      </button>

      {/* Response */}
      {response && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          background: '#f8fafc',
          border: '1.5px solid #f1f5f9',
          borderRadius: 12,
        }}>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={12} color="#f59e0b" /> AI Response
          </p>
          <div style={{ fontSize: '0.9rem', color: '#1e293b', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {response}
          </div>
        </div>
      )}
    </div>
  );
};
