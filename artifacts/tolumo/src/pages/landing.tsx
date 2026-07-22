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
        <div className="container mx-auto px-4 md:px-6 max-w-6xl h-16 flex items-center justify-between">
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

        {/* How It Works */}
        <section id="how-it-works" className="py-20 md:py-28 bg-[#F5F2EB] scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">The Learning Journey</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">How Tolumo Works</h2>
              <p className="text-muted-foreground max-w-lg mx-auto">
                We've rebuilt the university law learning experience from scratch — structured, progressive, and proven to improve exam results.
              </p>
            </div>

            {/* 4 numbered steps */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
              {[
                {
                  n: '01', icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
                  title: 'Subscribe & Select Your Year',
                  body: 'Choose your current academic year (Year 1–5) and subscribe monthly at ₦3,500. Every NUC-approved module for that year unlocks instantly. Failed a module? Add it as a carryover for ₦7,500 extra.',
                },
                {
                  n: '02', icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M15 10l4.553-2.277A1 1 0 0121 8.677V15.5a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/></svg>,
                  title: 'Watch Expert Video Lectures',
                  body: 'Each topic opens with a high-quality video lecture from verified Nigerian law lecturers. Pause, rewind, and rewatch as many times as you need. Downloadable lecture notes and slides included.',
                },
                {
                  n: '03', icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/></svg>,
                  title: 'Revise With Your AI Study Coach',
                  body: 'After each video, your AI coach asks you up to 5 guided questions to test your understanding before the quiz. It adapts to your answers, deepening comprehension where you need it most.',
                },
                {
                  n: '04', icon: <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"/></svg>,
                  title: 'Pass Quizzes & Earn Your Certificate',
                  body: 'Complete the MCQ and practical essay quiz for each topic. Pass all modules in your year to earn a shareable, LinkedIn-ready certificate co-signed by our partner institutions.',
                },
              ].map(({ n, icon, title, body }) => (
                <div key={n} className="rounded-2xl border border-border bg-white p-7 flex flex-col gap-5">
                  <div className="flex items-start justify-between">
                    <span className="font-serif text-5xl font-bold text-primary/10 leading-none select-none">{n}</span>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    {icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-[0.95rem] leading-snug mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 3 feature cards */}
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  icon: <BookOpen className="h-5 w-5" />,
                  title: 'Topic-by-Topic Progression',
                  body: 'Topics unlock sequentially. Complete the video, notes, AI Q&A, and quiz for each topic before advancing. If you fail a quiz, the topic resets — ensuring genuine mastery, not just memorisation.',
                },
                {
                  icon: <GraduationCap className="h-5 w-5" />,
                  title: 'Book One-on-One Tutorial Sessions',
                  body: 'Access a live marketplace of tutorial sessions hosted by verified lecturers across multiple universities. Filter by topic, see ratings, compare prices, and book with one click. Video call link provided on confirmation.',
                },
                {
                  icon: <HelpCircle className="h-5 w-5" />,
                  title: 'Your Feedback Shapes Teaching',
                  body: "After every quiz, you're invited to rate your lecturer and leave a short note. Lecturers see aggregated feedback and trend data per topic, enabling continuous improvement across the platform.",
                },
              ].map(({ icon, title, body }) => (
                <div key={title} className="rounded-2xl border border-border bg-white/60 p-7">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/5 text-primary mb-5">
                    {icon}
                  </div>
                  <h3 className="font-bold text-primary text-[0.95rem] mb-2">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Modules / Curriculum */}
        <section id="modules" className="py-20 md:py-28 bg-white scroll-mt-16">
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

        {/* Testimonials */}
        <section className="py-20 md:py-28 bg-[#F5F2EB]">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">Student Stories</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">What Students Say</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  quote: '"I\'d failed Constitutional Law twice before Tolumo. The way Prof. Adeyemi breaks down the Second Schedule finally made it click. I passed with a B+ this time."',
                  name: 'Chisom Anieke',
                  school: 'University of Lagos',
                  initials: 'CA',
                  color: 'bg-rose-400',
                },
                {
                  quote: '"The AI Q&A before each quiz is the feature I didn\'t know I needed. It forces you to think through what you\'ve actually learned — not just what you skimmed."',
                  name: 'Emeka Okafor',
                  school: 'University of Port Harcourt',
                  initials: 'EO',
                  color: 'bg-amber-600',
                },
                {
                  quote: '"I booked a one-on-one with Prof. Adeyemi two weeks before finals. That single session was worth every naira of the entire month\'s subscription."',
                  name: 'Amara Diallo',
                  school: 'Ahmadu Bello University',
                  initials: 'AD',
                  color: 'bg-teal-600',
                },
              ].map(({ quote, name, school, initials, color }) => (
                <div key={name} className="rounded-2xl border border-border bg-white p-7 flex flex-col gap-6">
                  {/* Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-4 w-4 fill-accent text-accent" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">{quote}</p>
                  {/* Author */}
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold ${color}`}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">{name}</p>
                      <p className="text-xs text-muted-foreground">{school}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 md:py-28 bg-primary scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-3">Transparent Pricing</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">Straightforward. No Hidden Fees.</h2>
              <p className="text-white/60 max-w-md mx-auto text-sm leading-relaxed">
                One subscription unlocks every module for your selected academic year. Save more with our annual plan or top up with individual carryover modules as needed.
              </p>
            </div>

            {/* Cards */}
            <div className="grid md:grid-cols-3 gap-5 items-stretch mb-5">
              {/* Monthly — Most Popular */}
              <div className="relative rounded-2xl border-2 border-accent bg-white/5 p-8 flex flex-col">
                <span className="inline-flex w-fit items-center rounded-full bg-accent px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider mb-5">Most Popular</span>
                <h3 className="font-serif text-2xl font-bold text-white mb-1">Monthly</h3>
                <p className="text-sm text-white/50 mb-6">Full year access, billed monthly</p>
                <div className="mb-8">
                  <span className="font-serif text-4xl font-bold text-white">₦3,500</span>
                  <span className="text-white/50 text-sm"> / month</span>
                </div>
                <ul className="space-y-3 text-sm text-white/70 mb-8 flex-1">
                  {['All module videos for your year', 'Downloadable lecture notes & slides', 'AI Revision Coach (5 Q&As per topic)', 'MCQ + practical essay quizzes', 'Tutorial session marketplace access', 'Certificate of completion', 'Cancel any time'].map(f => (
                    <li key={f} className="flex gap-2 items-start"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />{f}</li>
                  ))}
                </ul>
                <Link href="/sign-up" className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-bold text-white transition-colors hover:bg-primary/80">
                  Start Monthly Plan
                </Link>
              </div>

              {/* Annual */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col">
                <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold text-white/80 uppercase tracking-wider mb-5">Save ₦7,000/year</span>
                <h3 className="font-serif text-2xl font-bold text-white mb-1">Annual</h3>
                <p className="text-sm text-white/50 mb-6">Full year access, paid upfront</p>
                <div className="mb-8">
                  <span className="font-serif text-4xl font-bold text-white">₦35,000</span>
                  <span className="text-white/50 text-sm"> / year</span>
                  <p className="text-sm text-white/30 line-through mt-1">₦42,000 if billed monthly</p>
                </div>
                <ul className="space-y-3 text-sm text-white/70 mb-8 flex-1">
                  {['Everything in Monthly', '2 months free vs monthly plan', 'Priority support', 'Early access to new modules', 'Annual recap progress report'].map(f => (
                    <li key={f} className="flex gap-2 items-start"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />{f}</li>
                  ))}
                </ul>
                <Link href="/sign-up" className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-bold text-white transition-colors hover:bg-accent/90">
                  Start Annual Plan
                </Link>
              </div>

              {/* Carryover */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col">
                <span className="inline-flex w-fit items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold text-white/80 uppercase tracking-wider mb-5">Add-On</span>
                <h3 className="font-serif text-2xl font-bold text-white mb-1">Carryover Module</h3>
                <p className="text-sm text-white/50 mb-6">Purchase individual failed modules</p>
                <div className="mb-8">
                  <span className="font-serif text-4xl font-bold text-white">₦7,500</span>
                  <span className="text-white/50 text-sm"> / module</span>
                </div>
                <ul className="space-y-3 text-sm text-white/70 mb-8 flex-1">
                  {['Any single NUC-approved module', 'Instant access after payment', 'Full video, notes & quizzes', 'No subscription required', 'Combines with any active plan'].map(f => (
                    <li key={f} className="flex gap-2 items-start"><CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />{f}</li>
                  ))}
                </ul>
                <Link href="/sign-up" className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/20 text-sm font-bold text-white transition-colors hover:bg-white/10">
                  Browse Carryover Modules
                </Link>
              </div>
            </div>

            {/* Footer note */}
            <div className="rounded-xl border border-white/10 bg-white/5 px-6 py-4 text-center text-sm text-white/50">
              <span className="font-semibold text-white/80">Tutorial sessions are priced separately</span> — set by each lecturer (typically ₦1,500–₦3,500 per session) and booked directly through the marketplace. Platform fee of 15% applies per booking.
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
