import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
          LEGAL & COMPLIANCE // DATA INTEGRITY
        </span>
        <h1 className="font-display-title text-4xl sm:text-5xl text-white mb-8">
          PRIVACY POLICY
        </h1>

        <div className="neo-card p-8 bg-[#0f1015] space-y-6 text-xs text-gray-300 leading-relaxed">
          <section>
            <h2 className="font-bold text-sm text-white mb-2">1. Data Collected</h2>
            <p>
              We collect user account details (name, email address, password hash via PBKDF2), learning progress records, assessment attempt scores, and certificate issuance records necessary to deliver your verified curriculum.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-sm text-white mb-2">2. Certificate Verification Registry</h2>
            <p>
              When a certificate is issued, the recipient&apos;s chosen display name, chapter title, pathway name, and issue date are stored in our public verification index. No private email addresses, passwords, or personal billing credentials are ever exposed publicly.
            </p>
          </section>

          <section id="cookies">
            <h2 className="font-bold text-sm text-white mb-2">3. Cookies & Session Storage</h2>
            <p>
              We use strictly necessary HTTP-only authentication cookies to maintain your login session. We do not use intrusive third-party cross-site advertising tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-sm text-white mb-2">4. Audit Logs & Security</h2>
            <p>
              Administrative actions, such as certificate revocations and logins, are preserved in an immutable audit table for platform security and compliance review.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
