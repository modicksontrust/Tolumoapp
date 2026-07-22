import React from 'react';
import { Link } from 'wouter';
import { useClerk } from '@clerk/react';
import { LogOut, BookOpen, User, CheckCircle2, Search, HelpCircle, Mail, MapPin, Phone, GraduationCap, Scale, Users, ChevronRight, Play, Shield, Headphones, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useListModules } from '@workspace/api-client-react';

export default function LandingPage() {
  const { data: modules } = useListModules();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background selection:bg-accent selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/logo.svg`} alt="Tolumo" className="h-8 w-8" />
            <span className="font-serif font-bold text-xl tracking-tight text-primary">Tolumo</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium text-sm">
            <a href="#modules" className="text-muted-foreground hover:text-primary transition-colors">Modules</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/sign-up" className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Enroll Now
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section — two-column layout */}
        <section className="relative overflow-hidden bg-primary">
          {/* subtle radial gradient: darker bottom-left, lighter top-right */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary via-primary to-[#2d5a3d]/90" />

          <div className="container relative mx-auto px-4 md:px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-12 items-center py-20 md:py-24">

              {/* Left: copy */}
              <div>
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 mb-8 backdrop-blur-sm gap-2">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse"></span>
                  Now live — Law Faculty, University of Lagos
                </div>

                <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.08]">
                  Learn Law From{' '}
                  <span className="italic text-accent">Nigeria's Top</span>{' '}
                  Lecturers
                </h1>

                <p className="text-white/70 text-lg leading-relaxed mb-10 max-w-md">
                  Complete your 5-year LL.B with expert video tutorials, AI-guided revision, and one-on-one tutorial sessions — every module fully NUC-approved.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mb-10">
                  <Link href="/sign-up" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-7 text-sm font-bold text-white shadow-lg shadow-accent/30 transition-all hover:bg-accent/90 hover:scale-[1.02]">
                    Start Learning Today →
                  </Link>
                  <a href="#modules" className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-7 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10">
                    <Play className="h-4 w-4 fill-white" /> Watch a Sample Lecture
                  </a>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/60">
                  {['AI Revision Coach', 'Expert Tutors', 'NUC-Approved Modules', 'Certificate on Completion'].map(f => (
                    <span key={f} className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent/80 shrink-0" /> {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: portal card panel */}
              <div className="hidden md:block">
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-white/10">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Try the Platform</p>
                  </div>

                  {/* Platform portals */}
                  <div className="divide-y divide-white/5">
                    {[
                      { label: 'Student View', sub: 'Browse modules & learn', href: '/sign-up', icon: BookOpen },
                      { label: 'Tutor View', sub: 'Manage content & bookings', href: '/sign-in', icon: GraduationCap },
                      { label: 'Admin View', sub: 'Platform management', href: '/sign-in', icon: Shield },
                    ].map(({ label, sub, href, icon: Icon }) => (
                      <Link key={label} href={href} className="flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors group">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/70 group-hover:bg-white/15 transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white">{label}</p>
                          <p className="text-xs text-white/50">{sub}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white/60 transition-colors" />
                      </Link>
                    ))}
                  </div>

                  {/* Agent portals divider */}
                  <div className="px-5 py-2 border-y border-white/10 bg-white/5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Agent Portals</p>
                  </div>

                  <div className="divide-y divide-white/5">
                    {[
                      { label: 'Sub-Agent', sub: 'Acquisition & commission', href: '/sign-in', accent: true },
                      { label: 'Super Agent', sub: 'Manage all Sub-Agents', href: '/sign-in', accent: true },
                      { label: 'CRM Portal', sub: 'Support, SLA & ticketing system', href: '/sign-in', accent: false },
                    ].map(({ label, sub, href, accent }) => (
                      <Link key={label} href={href} className={`flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-colors group ${accent ? 'bg-accent/10' : ''}`}>
                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${accent ? 'bg-accent/20 text-accent group-hover:bg-accent/30' : 'bg-white/10 text-white/70 group-hover:bg-white/15'}`}>
                          {label === 'CRM Portal' ? <Headphones className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-semibold ${accent ? 'text-accent' : 'text-white'}`}>{label}</p>
                          <p className="text-xs text-white/50">{sub}</p>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-colors ${accent ? 'text-accent/50 group-hover:text-accent' : 'text-white/30 group-hover:text-white/60'}`} />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Stats Band */}
        <section className="border-b border-border bg-white shadow-sm">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-border/50">
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-primary font-serif mb-1">12,400+</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Students Enrolled</div>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-accent font-serif mb-1">94%</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Exam Pass Rate</div>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-primary font-serif mb-1">5 Years</div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Full LL.B Coverage</div>
              </div>
              <div className="p-6 text-center">
                <div className="text-3xl font-bold text-primary font-serif mb-1 flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                  NUC
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Approved Curriculum</div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules / Curriculum */}
        <section id="modules" className="py-20 md:py-28 bg-[#F5F2EB] scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            {/* Section header */}
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-2">Currently Available</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3">NUC-Approved Modules</h2>
                <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                  All modules follow the National Universities Commission curriculum. Every video is recorded and reviewed by practising Nigerian lawyers and academics.
                </p>
              </div>
              <Link href="/sign-up" className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-accent transition-colors whitespace-nowrap pb-1">
                Browse all →
              </Link>
            </div>

            {/* Module cards grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {(modules ?? []).slice(0, 6).map((mod, i) => {
                const images = [
                  "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=800&auto=format&fit=crop", // grand law library
                  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop", // signing contract
                  "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop", // gavel on desk
                  "https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=800&auto=format&fit=crop", // law books shelf
                  "https://images.unsplash.com/photo-1453945619913-79ec89a82c51?q=80&w=800&auto=format&fit=crop", // scales of justice
                  "https://images.unsplash.com/photo-1554224154-26032ffc0d07?q=80&w=800&auto=format&fit=crop", // person writing
                ];
                const ratings = [4.9, 4.8, 4.9, 4.7, 4.8, 4.6];
                const reviews = [3840, 2910, 2140, 1980, 1650, 1430];
                return (
                  <div key={mod.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer">
                    {/* Cover image */}
                    <div className="relative h-44 overflow-hidden bg-primary/10">
                      <img
                        src={images[i % images.length]}
                        alt={mod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className="absolute bottom-3 left-3 inline-flex items-center rounded-full bg-accent px-3 py-1 text-xs font-bold text-white">
                        Year {mod.year}
                      </span>
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground mb-1">
                        {mod.code.replace(/([A-Z]+)(\d)/, "$1 $2")}
                      </p>
                      <h3 className="font-serif text-[1.1rem] font-bold text-primary mb-1 leading-snug">{mod.title}</h3>
                      {mod.tutorName && (
                        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                          <User className="h-3 w-3" /> {mod.tutorName}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" /> {mod.lessonCount} topics
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <svg className="h-3.5 w-3.5 text-accent fill-accent" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                          {ratings[i % ratings.length].toFixed(1)} ({(reviews[i % reviews.length]).toLocaleString()})
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Coming soon banner */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-primary px-8 py-6">
              <div>
                <p className="font-bold text-white mb-1">Year 1, 3, 4 &amp; 5 modules coming soon</p>
                <p className="text-sm text-white/70">We're currently live with all Year 2 (200 Level) modules. Additional years are in production and will be released progressively.</p>
              </div>
              <Link href="/sign-up" className="shrink-0 inline-flex h-11 items-center justify-center rounded-xl bg-white px-6 text-sm font-bold text-primary shadow transition-colors hover:bg-white/90">
                Get Early Access
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights */}
        <section id="how-it-works" className="py-20 md:py-32 bg-background scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1505664177941-bd93952ba19e?q=80&w=1200&auto=format&fit=crop" 
                  alt="Law student studying" 
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">The Future of Legal Education in Nigeria</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Tolumo blends traditional academic rigor with modern technology. Our curriculum is built specifically for the Nigerian Legal System.
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-xl mb-1">Pre-recorded Lectures</h4>
                      <p className="text-muted-foreground">High-quality video content from Senior Advocates and esteemed professors.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-xl mb-1">Interactive Tutorials</h4>
                      <p className="text-muted-foreground">Book 1-on-1 sessions to drill down into complex topics like Customary Law or Evidence.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-xl mb-1">AI-Guided Revision</h4>
                      <p className="text-muted-foreground">Practice past questions and get instant feedback on your answers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 md:py-32 bg-white scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Invest in your legal career with plans built for every stage of your LL.B journey.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
              <div className="rounded-2xl border border-border bg-background p-8 flex flex-col">
                <h3 className="font-serif text-2xl font-bold text-primary mb-2">Per Module</h3>
                <p className="text-sm text-muted-foreground mb-6">Perfect for retakes or focused study.</p>
                <div className="mb-6">
                  <span className="font-serif text-4xl font-bold text-primary">₦25,000</span>
                  <span className="text-muted-foreground text-sm"> / module</span>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground mb-8 flex-1">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Full video lecture library for one module</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> AI-guided revision & past questions</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Progress tracking</li>
                </ul>
                <Link href="/sign-up" className="inline-flex h-11 w-full items-center justify-center rounded-md border border-primary/20 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white">Get Started</Link>
              </div>

              <div className="relative rounded-2xl border-2 border-accent bg-primary p-8 flex flex-col shadow-xl shadow-primary/20">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">Most Popular</div>
                <h3 className="font-serif text-2xl font-bold text-white mb-2">Full Year</h3>
                <p className="text-sm text-white/70 mb-6">Everything you need to pass the year.</p>
                <div className="mb-6">
                  <span className="font-serif text-4xl font-bold text-white">₦180,000</span>
                  <span className="text-white/70 text-sm"> / year</span>
                </div>
                <ul className="space-y-3 text-sm text-white/80 mb-8 flex-1">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> All modules for your academic year</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Monthly 1-on-1 tutor sessions</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> AI Revision Coach with instant feedback</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Priority support</li>
                </ul>
                <Link href="/sign-up" className="inline-flex h-11 w-full items-center justify-center rounded-md bg-accent text-sm font-semibold text-white shadow transition-colors hover:bg-accent/90">Enroll Now</Link>
              </div>

              <div className="rounded-2xl border border-border bg-background p-8 flex flex-col">
                <h3 className="font-serif text-2xl font-bold text-primary mb-2">Full Degree</h3>
                <p className="text-sm text-muted-foreground mb-6">The complete 5-year LL.B pathway.</p>
                <div className="mb-6">
                  <span className="font-serif text-4xl font-bold text-primary">₦750,000</span>
                  <span className="text-muted-foreground text-sm"> one-time</span>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground mb-8 flex-1">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> All 5 years of the LL.B curriculum</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Unlimited tutor sessions</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Bar exam preparation resources</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" /> Dedicated academic advisor</li>
                </ul>
                <Link href="/sign-up" className="inline-flex h-11 w-full items-center justify-center rounded-md border border-primary/20 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white">Get Started</Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Us */}
        <section id="about" className="py-20 md:py-32 bg-background scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-6">About Tolumo</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Tolumo was founded on a simple belief: every aspiring Nigerian lawyer deserves access to
                  world-class legal education, no matter where they live.
                </p>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  We partner with Senior Advocates of Nigeria, esteemed professors, and practising barristers to
                  deliver an NUC-approved curriculum entirely online. From Legal Methods in your first year to
                  Jurisprudence in your final year, our platform pairs rigorous academics with modern technology —
                  video lectures, AI-guided revision, and personal tutorship.
                </p>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent mb-3"><Scale className="h-5 w-5" /></div>
                    <div className="font-bold text-primary mb-1">Rigour</div>
                    <p className="text-xs text-muted-foreground">NUC-approved, exam-focused curriculum.</p>
                  </div>
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent mb-3"><GraduationCap className="h-5 w-5" /></div>
                    <div className="font-bold text-primary mb-1">Excellence</div>
                    <p className="text-xs text-muted-foreground">Taught by Nigeria's top legal educators.</p>
                  </div>
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent mb-3"><Users className="h-5 w-5" /></div>
                    <div className="font-bold text-primary mb-1">Community</div>
                    <p className="text-xs text-muted-foreground">12,400+ students learning together.</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-primary p-10 md:p-12 text-white">
                <div className="font-serif text-2xl md:text-3xl font-bold leading-snug mb-6">
                  “Our mission is to raise the next generation of Nigerian legal minds — one student at a time.”
                </div>
                <p className="text-white/70 text-sm mb-8">— The Tolumo Faculty</p>
                <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-8">
                  <div>
                    <div className="font-serif text-3xl font-bold text-accent mb-1">94%</div>
                    <div className="text-xs text-white/70 uppercase tracking-wider">Exam Pass Rate</div>
                  </div>
                  <div>
                    <div className="font-serif text-3xl font-bold text-accent mb-1">12,400+</div>
                    <div className="text-xs text-white/70 uppercase tracking-wider">Students Enrolled</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground border-t border-primary-foreground/10 pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <img src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/logo.svg`} alt="Tolumo" className="h-8 w-8 brightness-0 invert" />
                <span className="font-serif font-bold text-xl tracking-tight">Tolumo</span>
              </div>
              <p className="text-primary-foreground/70 text-sm leading-relaxed mb-6">
                Nigeria's premier digital law academy. Learn from the best, at your own pace.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 font-serif">Platform</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><Link href="/sign-up" className="hover:text-accent transition-colors">Apply Now</Link></li>
                <li><a href="#modules" className="hover:text-accent transition-colors">Our Curriculum</a></li>
                <li><a href="#pricing" className="hover:text-accent transition-colors">Pricing & Plans</a></li>
                <li><Link href="/sign-in" className="hover:text-accent transition-colors">Student Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 font-serif">Company</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><a href="#about" className="hover:text-accent transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Faculty Directory</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Agent Program</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 font-serif">Contact</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
                  <span>14 Law School Drive,<br />Victoria Island, Lagos</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-accent" />
                  <span>+234 800 TOLUMO</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-accent" />
                  <span>admissions@tolumo.edu.ng</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/50">
            <p>© {new Date().getFullYear()} Tolumo Educational Services. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
