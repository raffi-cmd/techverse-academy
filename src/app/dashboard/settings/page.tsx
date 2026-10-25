'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { ArrowLeft, Save, CheckCircle, Loader2 } from 'lucide-react';

export default function LearnerSettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const [certName, setCertName] = useState('');
  const [bio, setBio] = useState('');
  const [goal, setGoal] = useState('30');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      fetch('/api/user/dashboard')
        .then(res => res.json())
        .then(data => {
          if (data.profile?.certificate_name) setCertName(data.profile.certificate_name);
          else if (user.name) setCertName(user.name);
          if (data.profile?.bio) setBio(data.profile.bio);
          if (data.preferences?.study_time_goal) setGoal(String(data.preferences.study_time_goal));
        });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificateName: certName,
          bio,
          studyTimeGoal: Number(goal)
        })
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
        </Link>

        <div className="mb-10">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            PREFERENCES // PROFILE CONFIGURATION
          </span>
          <h1 className="font-display-title text-3xl sm:text-5xl text-white">
            LEARNER SETTINGS
          </h1>
          <p className="text-xs text-gray-400 mt-2">
            Configure how your name appears on cryptographic certificates and adjust study metrics.
          </p>
        </div>

        <form onSubmit={handleSave} className="neo-card p-8 bg-[#0f1015] space-y-6">
          {saved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Preferences successfully saved.
            </div>
          )}

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1.5">
              Name on Certificates
            </label>
            <input
              type="text"
              required
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              placeholder="Your full legal or professional name"
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <p className="text-[10px] text-gray-500 mt-1">
              This exact name will be rendered onto server-generated PDF certificates when you pass chapter assessments.
            </p>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1.5">
              Daily Study Goal (Minutes)
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="15">15 Minutes / Day</option>
              <option value="30">30 Minutes / Day (Recommended)</option>
              <option value="45">45 Minutes / Day</option>
              <option value="60">60 Minutes / Day (Intensive)</option>
              <option value="90">90 Minutes / Day (Bootcamp)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1.5">
              Personal Bio / Learning Goals
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Aspiring cloud architect focusing on Kubernetes and high-availability systems..."
              className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-neo-light text-xs py-2.5 px-6 flex items-center gap-2"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <>Save Preferences <Save className="w-3.5 h-3.5" /></>}
          </button>
        </form>
      </main>

      <Footer />
    </div>
  );
}
