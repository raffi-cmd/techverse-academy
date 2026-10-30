'use client';

import Link from "next/link";
import { Globe, Heart, Sparkles } from "lucide-react";

const footerSections = [
  {
    title: "Belajar & Karier",
    links: [
      { label: "Jalur Belajar (Pathways)", href: "/pathways" },
      { label: "Tes Rekomendasi Karier IT", href: "/career-finder" },
      { label: "Eksplorasi Disiplin", href: "/explore" },
      { label: "100% Gratis (Tanpa Biaya)", href: "/pricing" },
      { label: "Panduan Belajar", href: "/how-it-works" },
    ],
  },
  {
    title: "Sumber Daya",
    links: [
      { label: "Tentang DEVORA", href: "/about" },
      { label: "Tanya Jawab (FAQ)", href: "/faq" },
      { label: "Verifikasi Sertifikat", href: "/verify" },
    ],
  },
  {
    title: "Kebijakan & Privasi",
    links: [
      { label: "Kebijakan Privasi", href: "/privacy" },
      { label: "Ketentuan Layanan", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 border-t border-white/5">
      <div className="container-main py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 mb-4 lg:mb-0">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white flex items-center justify-center p-0.5">
                <img
                  src="/techverse-academy/devora-logo.png"
                  alt="DEVORA Logo"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.endsWith('/devora-logo.png')) {
                      target.src = '/devora-logo.png';
                    }
                  }}
                />
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight block leading-none">
                  DEVORA
                </span>
                <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                  Learn . Build . Prove
                </span>
              </div>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
              Devora adalah platform pembelajaran IT gratis yang membantu pembelajar menguasai keterampilan teknologi praktis melalui jalur kurikulum bertahap, ujian pemahaman, dan sertifikat yang dapat diverifikasi secara online.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://raffi-cmd.github.io/techverse-academy/"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors text-gray-300"
                aria-label="DEVORA Portal"
              >
                <Globe className="w-4 h-4" />
              </a>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <Heart className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" /> 100% Free Open Education
              </span>
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Attribution */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; 2026 DEVORA. All rights reserved. 100% Free IT Education.
          </p>
          <p className="text-xs text-gray-600 text-center sm:text-right">
            Sertifikat DEVORA adalah bukti penyelesaian kurikulum teknis dan verifikasi pencapaian kompetensi.
          </p>
        </div>
      </div>
    </footer>
  );
}