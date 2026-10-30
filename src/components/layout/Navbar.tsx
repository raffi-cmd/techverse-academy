'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Award,
  Shield,
  ChevronDown,
  Sparkles,
  Globe,
  X,
  BookOpen,
  ArrowRight,
  Menu
} from 'lucide-react';
import { getStoredLanguage, setStoredLanguage, translations, Language } from '@/lib/i18n';

interface SearchItem {
  title: string;
  category: string;
  href: string;
}

const STATIC_SEARCH_INDEX: SearchItem[] = [
  { title: 'About DEVORA (Tentang Kami)', category: 'Page', href: '/about' },
  { title: 'Curriculum Pathways Catalog', category: 'Page', href: '/pathways' },
  { title: 'IT Career Path Finder (30 Soal Rekomendasi)', category: 'Feature', href: '/career-finder' },
  { title: '100% Free Learning Manifesto', category: 'Page', href: '/pricing' },
  { title: 'Verify Certificate (Verifikasi Sertifikat)', category: 'Verification', href: '/verify' },
  { title: 'Frequently Asked Questions (FAQ)', category: 'Page', href: '/faq' },
  { title: 'How It Works (Panduan Belajar)', category: 'Page', href: '/how-it-works' },
  { title: 'Artificial Intelligence & LLM Engineering', category: 'Pathway', href: '/pathways/ai-and-llm-engineering' },
  { title: 'Full-Stack Software Engineering', category: 'Pathway', href: '/pathways/full-stack-web-development' },
  { title: 'Cybersecurity Fundamentals & Defensive Ops', category: 'Pathway', href: '/pathways/cybersecurity-fundamentals' },
  { title: 'Cloud Computing & DevOps Architecture', category: 'Pathway', href: '/pathways/cloud-and-devops-engineering' },
  { title: 'Data Analytics & Data Science Systems', category: 'Pathway', href: '/pathways/data-analytics' },
  { title: 'Mobile Application Engineering (Flutter/React Native)', category: 'Pathway', href: '/pathways/mobile-development' },
  { title: 'Computer and IT Fundamentals', category: 'Pathway', href: '/pathways/computer-and-it-fundamentals' },
  { title: 'Python Development & Automation', category: 'Pathway', href: '/pathways/python-development' },
];

export function Navbar() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const [lang, setLang] = useState<Language>('id');
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchItem[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLang(getStoredLanguage());
    const handler = () => setLang(getStoredLanguage());
    window.addEventListener('devora_language_change', handler);
    return () => window.removeEventListener('devora_language_change', handler);
  }, []);

  const t = translations[lang];

  const handleToggleLang = (newLang: Language) => {
    setStoredLanguage(newLang);
    setLang(newLang);
  };

  // Live filter search query
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSearchResults(STATIC_SEARCH_INDEX.slice(0, 6));
      return;
    }
    const filtered = STATIC_SEARCH_INDEX.filter(item =>
      item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
    setSearchResults(filtered);
  }, [searchQuery]);

  // Handle keyboard shortcuts (Escape to close search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      router.push(searchResults[0].href);
      setSearchOpen(false);
      setSearchQuery('');
    } else {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <header className="sticky top-0 z-50 bg-[#07070a]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* DEVORA Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/15 shadow-sm shrink-0">
            <img
              src="/techverse-academy/devora-logo.png"
              alt="DEVORA Logo"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.endsWith('/devora-logo.png')) {
                  target.src = '/devora-logo.png';
                }
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tight text-white leading-none">
              DEVORA
            </span>
            <span className="text-[9px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
              Learn . Build . Prove
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">{t.nav.home}</Link>
          <Link href="/about" className="hover:text-white transition-colors">{t.nav.about}</Link>
          <Link href="/pathways" className="hover:text-white transition-colors">{t.nav.pathways}</Link>
          <Link href="/career-finder" className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            {t.nav.careerFinder}
          </Link>
          <Link href="/pricing" className="hover:text-white transition-colors text-emerald-400">
            {t.nav.freeModel}
          </Link>
          <Link href="/verify" className="hover:text-white transition-colors">{t.nav.verify}</Link>
        </nav>

        {/* Right Search Bar, Language Switcher & User Controls */}
        <div className="flex items-center gap-3">
          {/* Search Trigger Button */}
          <button
            onClick={() => {
              setSearchOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 50);
            }}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full px-3.5 py-1.5 text-xs text-gray-400 hover:text-white transition-all"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">{t.nav.searchPlaceholder}</span>
            <kbd className="hidden md:inline-block bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-400 ml-2">
              /
            </kbd>
          </button>

          {/* Language Switcher Button */}
          <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 text-[11px] font-mono font-bold">
            <button
              onClick={() => handleToggleLang('id')}
              className={`px-2 py-0.5 rounded-full transition-all ${lang === 'id' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              ID
            </button>
            <button
              onClick={() => handleToggleLang('en')}
              className={`px-2 py-0.5 rounded-full transition-all ${lang === 'en' ? 'bg-cyan-500 text-black' : 'text-gray-400 hover:text-white'}`}
            >
              EN
            </button>
          </div>

          {/* User Auth or Sign In */}
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-xs font-semibold bg-white/10 border border-white/15 px-3 py-1.5 rounded-full hover:border-cyan-400 transition-all text-white"
              >
                <div className="w-5 h-5 rounded-full bg-cyan-400 text-black font-extrabold flex items-center justify-center text-[10px]">
                  {user.name?.[0] || 'U'}
                </div>
                <span className="hidden sm:inline">{user.name?.split(' ')[0] || 'Learner'}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-[#0f1015] border border-white/10 rounded-2xl shadow-2xl p-2 z-50 text-white text-xs">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                      <p className="font-semibold truncate">{user.name}</p>
                      <p className="text-gray-400 text-[11px] truncate">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" /> {t.nav.dashboard}
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-yellow-400" /> {t.nav.myCertificates}
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5" /> Admin Console
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" /> {t.nav.signOut}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="btn-neo-light text-xs py-2 px-4 shrink-0 font-bold"
            >
              {t.nav.signIn}
            </Link>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
            aria-label="Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileNavOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0d0e14] px-6 py-4 space-y-3 text-xs font-semibold">
          <Link
            href="/"
            onClick={() => setMobileNavOpen(false)}
            className="block py-2 text-gray-300 hover:text-white border-b border-white/5"
          >
            {t.nav.home}
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileNavOpen(false)}
            className="block py-2 text-gray-300 hover:text-white border-b border-white/5"
          >
            {t.nav.about}
          </Link>
          <Link
            href="/pathways"
            onClick={() => setMobileNavOpen(false)}
            className="block py-2 text-gray-300 hover:text-white border-b border-white/5"
          >
            {t.nav.pathways}
          </Link>
          <Link
            href="/career-finder"
            onClick={() => setMobileNavOpen(false)}
            className="block py-2 text-cyan-400 hover:text-cyan-300 border-b border-white/5"
          >
            ★ {t.nav.careerFinder}
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileNavOpen(false)}
            className="block py-2 text-emerald-400 hover:text-emerald-300 border-b border-white/5"
          >
            ✓ {t.nav.freeModel}
          </Link>
          <Link
            href="/verify"
            onClick={() => setMobileNavOpen(false)}
            className="block py-2 text-gray-300 hover:text-white"
          >
            {t.nav.verify}
          </Link>
        </div>
      )}

      {/* Interactive Search Modal Overlay (Resolves 404 issue!) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-20">
          <div className="fixed inset-0" onClick={() => setSearchOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#0f1015] border border-white/15 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh]">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 p-4 border-b border-white/10 bg-[#12131b]">
              <Search className="w-5 h-5 text-cyan-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={lang === 'id' ? 'Ketik pencarian: About, FAQ, Pathways, Web, AI...' : 'Search: About, FAQ, Pathways, Web, AI...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-gray-500"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="text-gray-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-gray-400 hover:text-white border border-white/10 px-2 py-1 rounded"
              >
                ESC
              </button>
            </form>

            {/* Results List */}
            <div className="overflow-y-auto p-3 space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <div>
                        <p className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {item.title}
                        </p>
                        <span className="text-[10px] font-mono text-gray-500 uppercase">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-gray-500">
                  <p>Tidak ada hasil untuk &ldquo;{searchQuery}&rdquo;</p>
                  <p className="mt-1 text-[11px] text-gray-600">Coba kata kunci: About, FAQ, Pathways, AI, Python, Web</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-black/40 border-t border-white/5 text-[11px] text-gray-500 flex items-center justify-between px-4 font-mono">
              <span>DEVORA DIRECT NAVIGATION</span>
              <span>Tekan ENTER untuk memilih</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}