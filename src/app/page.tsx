import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import {
  ArrowRight,
  Play,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Brain,
  Gamepad2,
  Sparkles,
  Layers,
  Award,
  CheckCircle2,
  ShieldCheck,
  Search
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#07070a] text-white">
      {/* Top Navbar */}
      <Navbar />

      {/* =========================================================
          SECTION 1: HERO SECTION (LIGHT HIGH-TECH CONTRAST)
          Matches the reference image's white high-contrast header
          ========================================================= */}
      <section className="relative bg-[#f5f6f8] text-black pt-12 pb-24 md:pb-36 overflow-hidden hero-diagonal-split">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-300 text-[11px] font-bold tracking-widest uppercase mb-6 bg-white/60">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                FUTURISTIC / 01
              </div>

              <h1 className="font-display-title text-5xl sm:text-7xl lg:text-8xl text-black mb-8 tracking-tight">
                NEW <span className="font-stylized-italic font-normal text-indigo-900">DIGITAL</span><br />
                UNIVERSE
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-14">
                <Link href="/auth/signup" className="btn-neo-dark text-sm px-8 py-3.5 shadow-xl">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link href="/pathways" className="btn-neo-outline text-sm px-8 py-3.5">
                  Explore Pathways
                </Link>
              </div>

              {/* Sub-hero stats & avatars row matching reference */}
              <div className="pt-8 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-6 max-w-xl">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2.5 overflow-hidden">
                    {['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'].map((c, i) => (
                      <div
                        key={i}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                        style={{ backgroundColor: c }}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                    <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-black text-white text-[10px] font-bold flex items-center justify-center">
                      20k+
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 uppercase tracking-wider">Active Cohort</p>
                    <p className="text-[11px] text-gray-500">Graduating Certified Engineers</p>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-black">472k</span>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Exercises Solved</span>
                </div>
              </div>
            </div>

            {/* Right Column: Futuristic Spatial Visual matching reference */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[4/5] rounded-3xl bg-gradient-to-b from-gray-200 to-gray-300 p-1 shadow-2xl flex items-center justify-center overflow-hidden border border-white">
                <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

                {/* Stylized Cyber Headset / Visor SVG Art */}
                <div className="relative z-10 flex flex-col items-center text-center p-6">
                  <div className="w-56 h-36 rounded-full bg-gradient-to-r from-gray-900 via-gray-800 to-black border-2 border-white/40 shadow-2xl flex items-center justify-center relative overflow-hidden mb-6">
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 top-1/2 -translate-y-1/2 blur-sm" />
                    <div className="w-48 h-8 rounded-full bg-black/80 border border-white/20 flex items-center justify-center">
                      <span className="text-[10px] font-mono tracking-widest text-cyan-400">TECHVERSE // SPATIAL OS</span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-gray-800 tracking-wide max-w-xs mb-2">
                    Next-Gen Spatial & AI Academy
                  </p>
                  <p className="text-[11px] text-gray-500 max-w-xs leading-relaxed">
                    Bridging foundational IT education, neural networks, and scalable system engineering into one unified curriculum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 2: ABOUT US / THE DIGITAL FRONTIER
          Transition into pure Obsidian Dark (#07070a)
          ========================================================= */}
      <section className="py-24 md:py-36 relative bg-[#07070a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left: Cyber Helmet / Visor graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md aspect-[4/5] rounded-3xl bg-[#0f1015] border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex justify-between items-center text-xs text-gray-500 font-mono">
                  <span>SYSTEM_INIT // 2024</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>

                <div className="my-auto text-center py-12">
                  <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-b from-gray-800 to-black border border-white/20 flex items-center justify-center shadow-2xl relative">
                    <div className="w-32 h-16 rounded-2xl bg-black border border-cyan-500/40 flex items-center justify-center">
                      <Cpu className="w-8 h-8 text-cyan-400" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4 flex justify-between items-end text-xs text-gray-400">
                  <div>
                    <p className="font-semibold text-white">Curriculum Rigor</p>
                    <p className="text-[11px]">50 Chapters per complete pathway</p>
                  </div>
                  <span className="font-mono text-cyan-400">100% VERIFIABLE</span>
                </div>
              </div>
            </div>

            {/* Right: "ABOUT US" and "THE DIGITAL FRONTIER" */}
            <div className="lg:col-span-7">
              <span className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-4 block">
                ABOUT US
              </span>

              <h2 className="font-display-title text-4xl sm:text-6xl text-white mb-6">
                THE DIGITAL<br />
                FRONTIER
              </h2>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="neo-pill text-white border-white/20 bg-white/5">Digital</span>
                <span className="neo-pill">Reality</span>
                <span className="neo-pill">Next-Gen</span>
              </div>

              <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-6 max-w-xl">
                TechVerse Academy exists where the boundaries between foundational computing, enterprise software systems, and AI engineering dissolve.
                We reject superficial video overviews in favor of deep, 50-chapter structured technical pathways with code verification and verifiable completion credentials.
              </p>

              <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xl">
                Whether you are stepping into coding for the first time or architecting multi-region distributed networks, our deterministic progression engine ensures you master every layer of modern software.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/pathways" className="btn-neo-light text-xs px-8 py-3.5">
                  Learn More
                </Link>
                <Link href="/verify" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-white px-5 py-3.5 rounded-full border border-white/10 hover:border-white/30 transition-all">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Verify Certificate
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 3: OUR SERVICE (CURRICULUM DISCIPLINES)
          Matches the 3 card layout with circular arrows in reference
          ========================================================= */}
      <section className="py-24 bg-[#0a0a0e] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display-title text-3xl sm:text-5xl text-white">
              OUR SERVICE
            </h2>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-400 hover:text-white transition-colors" aria-label="Previous">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full border border-white/10 hover:border-white/30 flex items-center justify-center text-gray-400 hover:text-white transition-colors" aria-label="Next">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="neo-card p-8 flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-cyan-400">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white mb-3">Software & Web Engineering</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  End-to-end full-stack development, modern TypeScript, resilient backend APIs, and distributed database engineering.
                </p>
              </div>
              <Link href="/pathways/full-stack-development" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mt-8 group">
                Learn More
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="neo-card p-8 flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-purple-400">
                  <Brain className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white mb-3">AI & Neural Systems</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Generative AI, Large Language Model pipelines, prompt engineering frameworks, and machine learning infrastructure.
                </p>
              </div>
              <Link href="/pathways/artificial-intelligence-engineering" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mt-8 group">
                Learn More
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="neo-card p-8 flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-white mb-3">Cybersecurity & Cloud</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Defensive security fundamentals, SOC monitoring, zero-trust network engineering, and Kubernetes orchestration.
                </p>
              </div>
              <Link href="/pathways/cybersecurity-fundamentals" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white mt-8 group">
                Learn More
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 4: LIMITLESS POSSIBILITIES WITH TECHVERSE
          Matches the bento card section from the reference image
          ========================================================= */}
      <section className="py-24 md:py-36 bg-[#07070a]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-display-title text-3xl sm:text-6xl text-white mb-8">
            LIMITLESS POSSIBILITIES<br />
            WITH TECHVERSE
          </h2>

          <div className="flex items-center gap-6 text-xs font-semibold text-gray-400 mb-10 border-b border-white/5 pb-4">
            <span className="text-white border-b-2 border-white pb-4 -mb-4">Innovation</span>
            <span className="hover:text-white cursor-pointer">Technology</span>
            <span className="hover:text-white cursor-pointer">Experience</span>
          </div>

          {/* Bento Card matching reference */}
          <div className="neo-card p-6 md:p-8 grid md:grid-cols-12 gap-8 items-center bg-[#0d0e14]">
            <div className="md:col-span-5 aspect-video md:aspect-square rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-white/10 flex items-center justify-center relative overflow-hidden">
              <div className="w-28 h-28 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-cyan-400" />
              </div>
            </div>

            <div className="md:col-span-7 flex flex-col justify-between py-2">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase mb-2 block">
                  TECHNICAL BRIEFING
                </span>
                <h3 className="font-bold text-2xl text-white mb-4">
                  How AI & Full-Stack Systems are Transforming Education
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6">
                  Traditional academies rely on passive video watching. TechVerse Academy deploys an active, chapter-by-chapter progression engine where every learner solves code problems, passes server-graded assessments, and unlocks verifiable cryptographic credentials.
                </p>
                <Link href="/pathways" className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full transition-colors">
                  Explore Catalog
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-gray-500 border-t border-white/5 pt-4 mt-8">
                <span>Updated Live</span>
                <span>•</span>
                <span>60 Pathways Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 5: VOICES OF THE FUTURE (TESTIMONIALS)
          Matches the stacked card layout on the right in reference
          ========================================================= */}
      <section className="py-24 bg-[#0a0a0e] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left title & description */}
            <div className="lg:col-span-5">
              <h2 className="font-display-title text-3xl sm:text-5xl text-white mb-6">
                VOICES OF<br />
                THE FUTURE
              </h2>
              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-8">
                Hear from software engineers, university students, and career pivoters who transformed their technical capabilities through TechVerse&apos;s 50-chapter curriculum.
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-indigo-600 rounded-full" />
            </div>

            {/* Right stacked cards matching reference */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  quote: "TechVerse completely transformed how our engineering team trains new developers. The 50-chapter depth is unmatched.",
                  author: "James Field",
                  role: "Staff Platform Engineer",
                  initials: "JF"
                },
                {
                  quote: "Passing the rigorous assessments and earning verifiable certificates gave me the tangible proof I needed to land my role in AI.",
                  author: "Samantha Reynolds",
                  role: "Machine Learning Engineer",
                  initials: "SR"
                },
                {
                  quote: "I've tried every online coding platform. Nothing matches TechVerse's combination of structured depth and verifiable credentials.",
                  author: "Mark Trevor",
                  role: "Full-Stack Developer",
                  initials: "MT"
                }
              ].map((t, i) => (
                <div key={i} className="neo-card p-6 flex items-center justify-between gap-6 bg-[#0f1015]/80 hover:bg-[#15161f]">
                  <div>
                    <p className="text-xs text-gray-300 leading-relaxed mb-3">&ldquo;{t.quote}&rdquo;</p>
                    <p className="font-bold text-xs text-white">{t.author}</p>
                    <p className="text-[11px] text-gray-500">{t.role}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-white shrink-0">
                    {t.initials}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SECTION 6: DIVE INTO THE FUTURE (CINEMATIC CALL TO ACTION)
          Matches the dark banner with circular play button in reference
          ========================================================= */}
      <section className="py-24 bg-[#07070a]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#14151f] via-[#0d0e14] to-black border border-white/15 p-10 md:p-20 overflow-hidden text-center shadow-2xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto">
              {/* Glowing circular icon button matching reference */}
              <div className="w-16 h-16 mx-auto rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-8 backdrop-blur-md hover:scale-105 transition-transform cursor-pointer">
                <Play className="w-6 h-6 text-white fill-white ml-1" />
              </div>

              <h2 className="font-display-title text-4xl sm:text-6xl text-white mb-6">
                DIVE INTO THE<br />
                FUTURE
              </h2>

              <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-10 max-w-lg mx-auto">
                Discover your personalized IT pathway today. Join thousands of developers mastering software engineering, artificial intelligence, and cloud architecture.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/auth/signup" className="btn-neo-light text-xs px-8 py-3.5">
                  Get Started Free
                </Link>
                <Link href="/onboarding" className="btn-neo-outline text-xs px-8 py-3.5 text-white border-white/20 hover:border-white">
                  Take Career Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
