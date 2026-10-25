import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Target, BookOpen, HelpCircle, Award, CheckCircle, ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Discover Your Optimal Pathway',
      desc: 'Take our 6-step guided onboarding assessment. Our deterministic scoring engine matches your career goals, experience level, and preferred activities to recommended learning tracks.',
      icon: Target
    },
    {
      num: '02',
      title: 'Engage with 50 Sequential Chapters',
      desc: 'Each complete pathway contains 10 structured modules and 50 progressive chapters. You master foundational mental models first, advancing into complex production architectures.',
      icon: BookOpen
    },
    {
      num: '03',
      title: 'Verify Mastery with Server-Graded Quizzes',
      desc: 'At the end of every chapter, test your knowledge with interactive assessments. The server deterministically grades your answers against technical specifications (passing threshold: 80%).',
      icon: HelpCircle
    },
    {
      num: '04',
      title: 'Issue Cryptographic PDF Certificates',
      desc: 'Upon passing a chapter, an immutable completion record is created and an authentic landscape A4 Navy/Gold certificate is generated with a unique ID and public verification URL.',
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            METHODOLOGY // STEP-BY-STEP
          </span>
          <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-4">
            HOW TECHVERSE WORKS
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            A battle-tested instructional design methodology created to produce certified, competent software engineers.
          </p>
        </div>

        <div className="space-y-8 mb-16">
          {steps.map((s) => (
            <div key={s.num} className="neo-card p-8 bg-[#0f1015] flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-cyan-400">
                <s.icon className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">STEP {s.num}</span>
                <h3 className="font-bold text-xl text-white mt-1 mb-2">{s.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/onboarding" className="btn-neo-light text-xs py-3 px-8">
            Start Career Orientation Assessment
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
