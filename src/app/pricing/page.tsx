import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import db from '@/lib/db';

export default function PricingPage() {
  const plans = db.prepare('SELECT * FROM product_plans ORDER BY price_monthly ASC').all() as any[];

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            TRANSPARENT TUITION // NO HIDDEN FEES
          </span>
          <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-4">
            AFFORDABLE ACCESS TO ADVANCED IT
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Begin with foundational chapters for free. Upgrade to unlock all 60 pathways, 50+ chapters per track, hands-on projects, and verifiable credentials.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((p) => {
            const features = JSON.parse(p.features || '[]');
            const isPopular = p.slug === 'premium';

            return (
              <div
                key={p.id}
                className={`neo-card p-8 flex flex-col justify-between relative ${
                  isPopular
                    ? 'bg-[#0f111a] border-cyan-500/40 shadow-2xl ring-1 ring-cyan-500/30'
                    : 'bg-[#0d0e14]'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-black font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full">
                    Recommended
                  </div>
                )}

                <div>
                  <h2 className="font-bold text-xl text-white mb-2">{p.name}</h2>
                  <p className="text-xs text-gray-400 mb-6">{p.description}</p>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="font-display-title text-4xl text-white">${p.price_monthly}</span>
                    <span className="text-xs text-gray-400 font-mono">/month</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {features.map((f: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={p.price_monthly === 0 ? '/auth/signup' : `/auth/signup?plan=${p.slug}`}
                  className={`w-full py-3 rounded-full text-xs font-bold transition-all text-center ${
                    isPopular ? 'btn-neo-light' : 'btn-neo-dark'
                  }`}
                >
                  {p.price_monthly === 0 ? 'Start Free' : 'Choose Plan'}
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}
