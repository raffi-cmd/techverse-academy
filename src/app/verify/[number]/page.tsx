import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export async function generateStaticParams() {
  return [{ number: 'sample' }];
}

export default async function CertificatePermalinkPage({
  params
}: {
  params: Promise<{ number: string }>
}) {
  const { number } = await params;

  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-20">
        <Link href="/verify" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Registry
        </Link>

        <div className="neo-card p-12 text-center bg-[#0d0e14]">
          <h1 className="text-2xl font-bold mb-2">Certificate Verification</h1>
          <p className="text-sm text-gray-400 mb-4">Certificate Number: <span className="font-mono text-cyan-400">{number}</span></p>
          <p className="text-xs text-gray-500 mb-6">
            Certificate verification registry lookup is available on live systems.
          </p>
          <Link href="/verify" className="btn-neo-light text-xs py-2.5 px-6">Back to Registry</Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}