'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { Search, User, LogOut, LayoutDashboard, Award, Shield, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/explore?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  return (
    <header className="sticky top-0 z-50 bg-[#f5f6f8]/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* DEVORA Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-gray-300 shadow-sm shrink-0">
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
            <span className="font-black text-xl tracking-tight text-black leading-none">
              DEVORA
            </span>
            <span className="text-[9px] font-mono tracking-widest text-gray-500 uppercase font-semibold">
              Learn . Build . Prove
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="/about" className="hover:text-black transition-colors">About</Link>
          <Link href="/pathways" className="hover:text-black transition-colors">Pathways</Link>
          <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
          <Link href="/verify" className="hover:text-black transition-colors">Verify Certificate</Link>
        </nav>

        {/* Right Search Pill & User Controls */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search pathways..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/80 border border-gray-300 rounded-full pl-4 pr-10 py-1.5 text-xs text-gray-900 focus:outline-none focus:border-black w-48 focus:w-60 transition-all placeholder:text-gray-400"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black" aria-label="Search">
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
          ) : user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 text-xs font-semibold bg-white border border-gray-300 px-3 py-1.5 rounded-full hover:border-black transition-all text-gray-900"
              >
                <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  {user.name?.[0] || 'U'}
                </div>
                <span>{user.name?.split(' ')[0] || 'Learner'}</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
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
                      <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                    </Link>
                    <Link
                      href="/dashboard/certificates"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" /> My Certificates
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
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/auth/signin"
              className="btn-neo-dark text-xs py-2 px-5"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}