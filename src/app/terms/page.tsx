import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block mb-2">
          GOVERNANCE // TERMS OF SERVICE
        </span>
        <h1 className="font-display-title text-4xl sm:text-5xl text-white mb-8">
          TERMS OF SERVICE
        </h1>

        <div className="neo-card p-8 bg-[#0f1015] space-y-6 text-xs text-gray-300 leading-relaxed">
          <section>
            <h2 className="font-bold text-sm text-white mb-2">1. Nature of Educational Certificates</h2>
            <p className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-lg text-yellow-300">
              DEVORA certificates are educational completion credentials verifying that the holder has completed curriculum tasks and passed automated technical assessments. They are not accredited college degrees, vocational licenses, or governmental certifications.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-sm text-white mb-2">2. Assessment Integrity & Revocation</h2>
            <p>
              Learners must independently answer all assessment questions. Scripted automated cheating, reverse engineering of answer keys, or fraudulent completion claims will result in immediate certificate revocation and account termination.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-sm text-white mb-2">3. Acceptable Use</h2>
            <p>
              Users may not probe, scan, or test the vulnerability of the system without prior written authorization from DEVORA security administrators.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-sm text-white mb-2">4. Commercial Entitlements</h2>
            <p>
              Access to advanced pathways, AI tutoring, and bulk certificates is subject to the active subscription plan. Subscriptions renew monthly and can be canceled at any time.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
