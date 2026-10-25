import Link from "next/link";
import {
  BookOpen,
  Mail,
  MapPin,
  Github,
  Globe,
  Linkedin,
} from "lucide-react";

const footerSections = [
  {
    title: "Learn",
    links: [
      { label: "Explore Fields", href: "/explore" },
      { label: "All Pathways", href: "/pathways" },
      { label: "How It Works", href: "/how-it-works" },
      { label: "Course Catalog", href: "/catalog" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Getting Started", href: "/how-it-works" },
      { label: "FAQ", href: "/faq" },
      { label: "Verify Certificate", href: "/verify" },
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/privacy#cookies" },
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
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                <span className="text-gray-900 font-bold text-sm">TV</span>
              </div>
              <span className="font-bold text-lg text-white">
                TechVerse Academy
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-sm mb-6 leading-relaxed">
              Master IT skills through structured learning pathways, hands-on
              projects, and verifiable completion certificates across 60+
              technology disciplines.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
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
                  <li key={link.href}>
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
            &copy; 2026 TechVerse Academy. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Certificates issued by this platform are learning completion
            certificates, not government-accredited professional certifications.
          </p>
        </div>
      </div>
    </footer>
  );
}
