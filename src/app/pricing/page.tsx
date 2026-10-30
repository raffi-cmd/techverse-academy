import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';

const plans = [
  {
    id: 'plan_starter',
    name: 'Starter Pathway',
    description: 'Perfect for beginners starting their IT journey with fundamental coding and computing concepts.',
    priceDisplay: 'Rp 0',
    period: 'Gratis Selamanya',
    isPopular: false,
    features: [
      'Access to foundational chapters in all 60 pathways',
      'Interactive browser lesson workspace',
      'Chapter knowledge check quizzes',
      'Community discussion & curriculum notes',
      'Self-paced learning schedule'
    ],
    ctaText: 'Start Learning Free',
    ctaLink: '/pathways'
  },
  {
    id: 'plan_pro',
    name: 'DEVORA Pro',
    description: 'Complete access to all 60 engineering pathways, advanced architectural lessons, and certificates.',
    priceDisplay: 'Rp 149.000',
    period: '/ bulan',
    isPopular: true,
    features: [
      'Unrestricted access to all 1,250+ chapters',
      'Authoritative chapter assessments (70% pass threshold)',
      'Verifiable landscape A4 PDF certificates with crypto ID',
      'DEVORA AI Learning Assistant for 24/7 code clarification',
      'Real-world system design and implementation exercises',
      'Public verifiable portfolio credentials'
    ],
    ctaText: 'Upgrade to Pro',
    ctaLink: '/pathways'
  },
  {
    id: 'plan_career',
    name: 'Career Track Lifetime',
    description: 'All-inclusive lifetime access with priority certificate verification and career portfolio tools.',
    priceDisplay: 'Rp 499.000',
    period: 'Sekali Bayar (Lifetime)',
    isPopular: false,
    features: [
      'Lifetime access to all current and future 60+ pathways',
      'Unlimited verifiable completion certificates',
      'Direct priority verification badge at devora.academy',
      'Comprehensive career project portfolio artifacts',
      'Founder & Curriculum Board digital signature endorsement',
      'Early access to new cutting-edge tech pathways'
    ],
    ctaText: 'Get Lifetime Access',
    ctaLink: '/pathways'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            DEVORA TUITION // TRANSPARENT ACCESS
          </span>
          <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-4">
            AFFORDABLE IT EDUCATION
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Begin with foundational curriculum chapters for free. Upgrade to unlock all 60 pathways, comprehensive assessments, and verifiable DEVORA completion certificates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {plans.map((p) => {
            return (
              <div
                key={p.id}
                className={`neo-card p-8 flex flex-col justify-between relative ${
                  p.isPopular
                    ? 'bg-[#0f111a] border-cyan-500/40 shadow-2xl ring-1 ring-cyan-500/30'
                    : 'bg-[#0d0e14]'
                }`}
              >
                {p.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-black font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3 h-3" /> Recommended
                  </div>
                )}

                <div>
                  <h2 className="font-bold text-xl text-white mb-2">{p.name}</h2>
                  <p className="text-xs text-gray-400 mb-6">{p.description}</p>

                  <div className="flex items-baseline gap-1.5 mb-8">
                    <span className="font-display-title text-3xl sm:text-4xl text-white">{p.priceDisplay}</span>
                    <span className="text-xs text-gray-400 font-mono">{p.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {p.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={p.ctaLink}
                  className={`w-full py-3 rounded-full text-xs font-bold transition-all text-center block ${
                    p.isPopular ? 'btn-neo-light' : 'btn-neo-dark'
                  }`}
                >
                  {p.ctaText}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="max-w-3xl mx-auto neo-card p-6 bg-[#0c0d14] border border-white/5 flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
          <div>
            <p className="text-xs font-bold text-white mb-1">DEVORA Quality & Educational Integrity Commitment</p>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Every chapter curriculum is continuously maintained to match real production software engineering standards. Certificates reflect genuine mastery and validated quiz passing scores.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}