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
        {/* Brand Logo matching reference */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center text-white font-bold text-sm tracking-tighter">
            <div className="w-4 h-4 rounded-full border-2 border-white/80 border-t-transparent animate-spin-slow" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-black">
            TechVerse
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <Link href="/about" className="hover:text-black transition-colors">About</Link>
          <Link href="/pathways" className="hover:text-black transition-colors">Pathways</Link>
          <Link href="/pricing" className="hover:text-black transition-colors">Pricing</Link>
          <Link href="/verify" className="hover:text-black transition-colors">Verify Certificate</Link>
        </nav>

        {/* Right Search Pill & User Controls matching reference */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search technologies..."
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
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] uppercase tracking-wider bg-white/10 text-gray-300">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-gray-200"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
                      Learner Dashboard
                    </Link>

                    <Link
                      href="/dashboard/certificates"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-gray-200"
                    >
                      <Award className="w-3.5 h-3.5 text-yellow-400" />
                      My Certificates
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors text-gray-200"
                      >
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        Admin Console
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-left mt-1 border-t border-white/5 pt-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/signin" className="text-xs font-semibold px-4 py-2 rounded-full hover:text-black text-gray-700">
                Sign In
              </Link>
              <Link href="/auth/signup" className="btn-neo-dark text-xs py-2 px-5">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
