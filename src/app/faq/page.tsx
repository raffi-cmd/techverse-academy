import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export default function FAQPage() {
  const faqs = [
    {
      q: 'Are certificates accredited by universities or governments?',
      a: 'No. TechVerse Academy issues educational completion certificates that verify you have met curriculum objectives and passed server-graded chapter assessments (score >= 80%). They document technical proficiency but are not accredited academic degrees or government licenses.'
    },
    {
      q: 'How many chapters are in each learning pathway?',
      a: 'All published primary pathways feature a full 50-chapter curriculum organized across 10 progressive modules. Pathways still under curriculum construction are clearly labeled as "In Development" to uphold complete transparency.'
    },
    {
      q: 'How does certificate verification work?',
      a: 'Every certificate is assigned a unique alphanumeric identifier (e.g., TV-2024-XXXX-XXXX). Anyone can enter this identifier into our public verification portal (/verify) to confirm the recipient name, chapter title, issue date, and validity status without creating an account.'
    },
    {
      q: 'What happens if I fail a chapter quiz?',
      a: 'You can review the lesson materials and retake the assessment. The server records all attempts and requires a score of 80% or higher before unlocking the certificate claiming workflow.'
    },
    {
      q: 'Can an administrator revoke a certificate?',
      a: 'Yes. In cases of academic dishonesty or administrative review, administrators have the capability to revoke a certificate. When checked on the verification registry, revoked certificates clearly display their revocation status and administrative reason.'
    },
    {
      q: 'How does the AI Learning Assistant operate?',
      a: 'The AI assistant operates via standard OpenAI-compatible endpoints when an API key is configured in the environment. If no key is set, the platform operates seamlessly in offline mode, and all lessons, quizzes, and certificates remain 100% functional.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
            HELP CENTER // FREQUENTLY ASKED QUESTIONS
          </span>
          <h1 className="font-display-title text-4xl sm:text-6xl text-white mb-4">
            QUESTIONS & ANSWERS
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            Everything you need to know about curriculum structure, certificates, assessments, and verification.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, i) => (
            <div key={i} className="neo-card p-6 bg-[#0f1015]">
              <h2 className="font-bold text-base text-white mb-2">{f.q}</h2>
              <p className="text-xs text-gray-400 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 text-xs text-gray-500">
          Have more questions?{' '}
          <Link href="/contact" className="text-cyan-400 hover:underline">
            Contact our technical team
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
