'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Mail, MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            SUPPORT & INQUIRIES // CONNECT
          </span>
          <h1 className="font-display-title text-4xl sm:text-5xl text-white mb-3">
            GET IN TOUCH
          </h1>
          <p className="text-xs text-gray-400">
            Have questions about institutional licensing, enterprise cohorts, or technical curriculum?
          </p>
        </div>

        {submitted ? (
          <div className="neo-card p-10 bg-[#0a0d17] border-emerald-500/30 text-center">
            <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-white mb-2">Message Dispatched</h2>
            <p className="text-xs text-gray-400 mb-6">
              Thank you for reaching out. A curriculum specialist will reply to {form.email} within 24 business hours.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
              className="btn-neo-light text-xs py-2 px-6"
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="neo-card p-8 bg-[#0f1015] shadow-2xl space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Taylor Smith"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="taylor@example.com"
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Subject</label>
              <input
                type="text"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Institutional Licensing / Curriculum Question"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">Message</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Provide details about your query..."
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-neo-light text-xs py-3 justify-center mt-2 flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Send Message <Send className="w-3.5 h-3.5" /></>}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
