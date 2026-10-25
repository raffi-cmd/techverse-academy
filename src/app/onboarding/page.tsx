'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Loader2, Target, Award } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [recommendations, setRecommendations] = useState<any>(null);

  // Form State
  const [goals, setGoals] = useState<string[]>(['web']);
  const [experience, setExperience] = useState('beginner');
  const [activities, setActivities] = useState<string[]>(['building', 'logic']);
  const [style, setStyle] = useState('projects');
  const [equipment, setEquipment] = useState('browser');

  const toggleItem = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learningGoals: goals,
          experienceLevel: experience,
          knownTechnologies: [],
          preferredActivities: activities,
          learningPreferences: { style },
          equipmentInfo: { equipment }
        })
      });

      const data = await res.json();
      if (res.ok && data.recommendations) {
        setRecommendations(data.recommendations);
        setStep(6);
      } else {
        alert(data.error || 'Failed to generate recommendations. Please ensure you are logged in.');
      }
    } catch {
      alert('Network error calculating pathway recommendations.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            STEP {step} OF 6 // CAREER ORIENTATION ENGINE
          </span>
          <h1 className="font-display-title text-3xl sm:text-5xl text-white">
            {step === 1 && 'What are your learning goals?'}
            {step === 2 && 'What is your current experience?'}
            {step === 3 && 'Which activities excite you?'}
            {step === 4 && 'How do you learn best?'}
            {step === 5 && 'What equipment do you use?'}
            {step === 6 && 'Your Personalized Pathways'}
          </h1>
        </div>

        {/* STEP 1: GOALS */}
        {step === 1 && (
          <div className="neo-card p-8 bg-[#0f1015] space-y-3">
            {[
              { id: 'fundamentals', label: 'Learn Computer & IT Fundamentals from Zero', desc: 'No prior coding experience required.' },
              { id: 'web', label: 'Build Full-Stack Web Applications & APIs', desc: 'Frontend, backend, databases, and deployment.' },
              { id: 'ai', label: 'Master Artificial Intelligence & LLM Engineering', desc: 'Machine learning, model integration, prompt systems.' },
              { id: 'security', label: 'Learn Defensive Cybersecurity & SOC Operations', desc: 'Ethical, authorized defensive system security.' },
              { id: 'cloud', label: 'Architect Cloud Systems & DevOps Automation', desc: 'Containers, CI/CD pipelines, and infrastructure.' }
            ].map(opt => {
              const active = goals.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleItem(goals, setGoals, opt.id)}
                  className={`w-full text-left p-4 rounded-xl text-xs transition-all flex items-center justify-between border ${
                    active ? 'bg-cyan-950/40 border-cyan-400 text-white font-semibold' : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <div>
                    <p className="font-bold text-sm text-white">{opt.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</p>
                  </div>
                  {active && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 ml-4" />}
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 2: EXPERIENCE */}
        {step === 2 && (
          <div className="neo-card p-8 bg-[#0f1015] space-y-3">
            {[
              { id: 'beginner', label: 'Complete Beginner', desc: 'Have never written code before.' },
              { id: 'basic', label: 'Basic Computer Knowledge', desc: 'Familiar with digital tools but new to programming.' },
              { id: 'intermediate', label: 'Intermediate Learner', desc: 'Have built small projects or completed basic tutorials.' },
              { id: 'advanced', label: 'Experienced Developer', desc: 'Seeking advanced specialization or new technical domain.' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setExperience(opt.id)}
                className={`w-full text-left p-4 rounded-xl text-xs transition-all flex items-center justify-between border ${
                  experience === opt.id ? 'bg-cyan-950/40 border-cyan-400 text-white font-semibold' : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                <div>
                  <p className="font-bold text-sm text-white">{opt.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</p>
                </div>
                {experience === opt.id && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* STEP 3: ACTIVITIES */}
        {step === 3 && (
          <div className="neo-card p-8 bg-[#0f1015] space-y-3">
            {[
              { id: 'building', label: 'Building Functional User-Facing Applications' },
              { id: 'logic', label: 'Solving Algorithmic & Logical Puzzles' },
              { id: 'data', label: 'Extracting Insights From Raw Data & Metrics' },
              { id: 'security', label: 'Analyzing Security Vulnerabilities Defensively' },
              { id: 'automation', label: 'Automating Repetitive Tasks & Infrastructure' }
            ].map(opt => {
              const active = activities.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  onClick={() => toggleItem(activities, setActivities, opt.id)}
                  className={`w-full text-left p-4 rounded-xl text-xs transition-all flex items-center justify-between border ${
                    active ? 'bg-cyan-950/40 border-cyan-400 text-white font-semibold' : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/20'
                  }`}
                >
                  <span className="font-semibold text-sm text-white">{opt.label}</span>
                  {active && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 4: PREFERENCES */}
        {step === 4 && (
          <div className="neo-card p-8 bg-[#0f1015] space-y-3">
            {[
              { id: 'projects', label: 'Hands-On Projects & Code Exercises', desc: 'Learn primarily by building real software.' },
              { id: 'guided', label: 'Step-by-Step Guided Walkthroughs', desc: 'Progressive concept breakdowns with annotated examples.' },
              { id: 'theory', label: 'Deep Architectural Principles', desc: 'Foundational computer science theory and system design.' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setStyle(opt.id)}
                className={`w-full text-left p-4 rounded-xl text-xs transition-all flex items-center justify-between border ${
                  style === opt.id ? 'bg-cyan-950/40 border-cyan-400 text-white font-semibold' : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                <div>
                  <p className="font-bold text-sm text-white">{opt.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</p>
                </div>
                {style === opt.id && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* STEP 5: EQUIPMENT */}
        {step === 5 && (
          <div className="neo-card p-8 bg-[#0f1015] space-y-3">
            {[
              { id: 'browser', label: 'Standard Computer with Web Browser', desc: 'No special setup needed; learning exercises work in-browser.' },
              { id: 'advanced', label: 'Developer Laptop with Local Code Editor', desc: 'VS Code, Git, and local runtime configured.' }
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => setEquipment(opt.id)}
                className={`w-full text-left p-4 rounded-xl text-xs transition-all flex items-center justify-between border ${
                  equipment === opt.id ? 'bg-cyan-950/40 border-cyan-400 text-white font-semibold' : 'bg-white/5 border-white/5 text-gray-300 hover:border-white/20'
                }`}
              >
                <div>
                  <p className="font-bold text-sm text-white">{opt.label}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{opt.desc}</p>
                </div>
                {equipment === opt.id && <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />}
              </button>
            ))}
          </div>
        )}

        {/* STEP 6: RECOMMENDATION RESULTS */}
        {step === 6 && recommendations && (
          <div className="space-y-6">
            {/* Primary Recommendation */}
            <div className="neo-card p-8 bg-[#0a0d17] border-cyan-500/40 shadow-2xl">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
                TOP RECOMMENDED PATHWAY // FIT SCORE {recommendations.primary.score}%
              </span>
              <h2 className="font-display-title text-3xl text-white mb-3">
                {recommendations.primary.name}
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">
                {recommendations.primary.reason}
              </p>
              <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400">Enrolled automatically</span>
                <Link
                  href={`/pathways/${recommendations.primary.slug}`}
                  className="btn-neo-light text-xs py-2.5 px-6"
                >
                  Start Learning Now &rarr;
                </Link>
              </div>
            </div>

            {/* Alternatives */}
            {recommendations.alternatives?.length > 0 && (
              <div>
                <h3 className="font-bold text-sm text-gray-400 uppercase tracking-wider mb-3">
                  Alternative Matches
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {recommendations.alternatives.map((alt: any) => (
                    <div key={alt.id} className="neo-card p-5 bg-[#0f1015]">
                      <h4 className="font-bold text-sm text-white mb-1">{alt.name}</h4>
                      <p className="text-[11px] text-gray-400 mb-4">{alt.reason}</p>
                      <Link href={`/pathways/${alt.slug}`} className="text-xs font-semibold text-cyan-400 hover:underline">
                        Explore Pathway &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Navigation Buttons */}
        {step < 6 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="btn-neo-outline text-xs py-2.5 px-5 disabled:opacity-20 text-gray-300 border-white/10"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back
            </button>

            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="btn-neo-light text-xs py-2.5 px-6"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={submitting}
                className="btn-neo-light text-xs py-2.5 px-8 bg-cyan-400 text-black font-bold hover:bg-cyan-300"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Calculate My Pathways'}
              </button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
