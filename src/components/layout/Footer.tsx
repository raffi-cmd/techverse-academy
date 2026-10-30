'use client';

import Link from "next/link";
import { Globe } from "lucide-react";

const footerSections = [
  {
    title: "Learn",
    links: [
      { label: "Explore Fields", href: "/explore" },
      { label: "All Pathways", href: "/pathways" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Curriculum Pathways", href: "/pathways" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Getting Started", href: "/how-it-works" },
      { label: "FAQ", href: "/faq" },
      { label: "Verify Certificate", href: "/verify" },
      { label: "About DEVORA", href: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="container-main py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 mb-4 lg:mb-0">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-white flex items-center justify-center p-0.5">
                <img
                  src="/techverse-academy/devora-logo.png"
                  alt="DEVORA"
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
              Devora is an IT Learning & Career Platform that helps learners develop
              practical technology skills through structured learning pathways,
              comprehensive assessments, and verified credentials.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://raffi-cmd.github.io/techverse-academy/"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors text-gray-300"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link sections */}
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

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            &copy; 2026 DEVORA. All rights reserved.
          </p>
          <p className="text-xs text-gray-600 text-center sm:text-right">
            Devora provides hands-on career development curriculum and verifiable completion records.
          </p>
        </div>
      </div>
    </footer>
  );
}