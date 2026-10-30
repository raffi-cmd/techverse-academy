import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldCheck, BookOpen, Award, Cpu, UserCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="max-w-3xl mb-16">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            DEVORA CHARTER // MISSION
          </span>
          <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-6">
            LEARN. BUILD. PROVE.
          </h1>
          <p className="text-base text-gray-300 leading-relaxed">
            DEVORA was founded on a simple principle: technical excellence is earned through structured, progressive, hands-on practice, not superficial video overviews. We empower aspiring engineers and technology professionals with deterministic pathways and verifiable credentials.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="neo-card p-6 bg-[#0f1015]">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">Structured Depth</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Every curriculum pathway is organized into progressive modules and sequential chapters, guiding learners from fundamental mental models to enterprise-ready production architecture.
            </p>
          </div>

          <div className="neo-card p-6 bg-[#0f1015]">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">Verifiable Credentials</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Certificates are awarded only after passing rigorous chapter evaluations with a score of &ge; 70%. Each carries an authoritative cryptographic ID verifiable in our public registry.
            </p>
          </div>

          <div className="neo-card p-6 bg-[#0f1015]">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white mb-2">60 Disciplines</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Covering full-stack web engineering, artificial intelligence, LLM systems, cloud infrastructure, cybersecurity, Linux systems engineering, and data science.
            </p>
          </div>
        </div>

        {/* Founder Section */}
        <div className="neo-card p-8 bg-[#0d0e14] border-cyan-500/20 mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg shadow-cyan-500/20">
              <UserCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">
                PLATFORM LEADERSHIP & FOUNDER
              </span>
              <h2 className="text-xl font-bold text-white mb-2">
                Raffi Dwi Putra
              </h2>
              <p className="text-xs text-gray-300 leading-relaxed">
                Founder & Lead Architect of DEVORA. Dedicated to building accessible, high-rigor technical education infrastructure that enables developers and IT professionals worldwide to learn through real code, build production software, and prove their capability with integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Educational Credential Statement */}
        <div className="neo-card p-8 bg-[#0a0d17] border-white/10 mb-16">
          <h2 className="font-bold text-lg text-white mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Educational Credential Statement
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed mb-4">
            DEVORA issues learning completion certificates that verify a learner has successfully mastered specific chapters and met assessment thresholds (&ge; 70%).
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            These certificates document technical achievement and active participation within the DEVORA platform. They are not government-accredited university degrees or statutory occupational licenses. We value truth in advertising and integrity in all educational records.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center py-8">
          <Link href="/pathways" className="btn-neo-light text-xs py-3 px-8">
            Explore All 60 Pathways
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}