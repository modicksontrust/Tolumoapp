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
              <p className="text-foreground max-w-lg mx-auto">
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
                <p className="text-foreground max-w-sm text-sm leading-relaxed">
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
        <section id="about" className="py-20 md:py-28 bg-[#F5F2EB] scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-16 items-start">
              {/* Left: story */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">Our Story</p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-8 leading-snug">
                  Built for the African University Experience
                </h2>
                <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Tolumo was born from a simple observation: Nigerian law students are among the hardest-working students in the world, yet thousands fail preventable exams every year — not from lack of effort, but from lack of access to quality teaching resources.
                  </p>
                  <p>
                    In Nigerian law faculties, a single lecturer often teaches hundreds of students with limited time for individual support. Textbooks are expensive, past questions are scattered, and revision support is inconsistent across institutions.
                  </p>
                  <p>
                    Tolumo changes that. Built by <strong className="text-primary font-semibold">Solalina</strong> in partnership with practising lawyers and academics, we've built a structured, NUC-aligned learning platform that meets students where they are — whether studying in Lagos, Zaria, Nsukka or Port Harcourt.
                  </p>
                  <p>
                    Every feature — from the AI Study Coach to the post-quiz feedback loop — was designed with one goal: to help more Nigerian law students pass their exams, graduate on time, and enter the profession with confidence.
                  </p>
                </div>

                {/* Stat pills */}
                <div className="mt-10 flex flex-wrap gap-3">
                  {[
                    { value: '2024', label: 'Founded' },
                    { value: '7', label: 'Universities' },
                    { value: '48', label: 'Verified Tutors' },
                    { value: '94%', label: 'Student Pass Rate' },
                  ].map(({ value, label }) => (
                    <div key={label} className="rounded-xl border border-border bg-white px-5 py-3 text-center min-w-[90px]">
                      <div className="font-serif text-xl font-bold text-primary">{value}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: commitment card */}
              <div className="rounded-2xl border border-border bg-white p-8">
                <h3 className="font-bold text-primary text-base mb-6">Our Commitment to Quality</h3>
                <ul className="space-y-4">
                  {[
                    'All modules aligned to the NUC Law curriculum',
                    'Every lecturer vetted by Triax Solicitors',
                    'Student feedback reviewed monthly to improve content',
                    'Platform audited for accessibility across low-bandwidth connections',
                    'Data protected under Nigerian Data Protection Act (NDPA) 2023',
                  ].map(item => (
                    <li key={item} className="flex gap-3 items-start text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Founder's Note */}
        <section className="py-20 md:py-28 bg-white">
          <div className="container mx-auto px-4 md:px-6 max-w-6xl">
            {/* Header */}
            <div className="text-center mb-14">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">From the Desk of the Founder</p>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-3">Founder's Note</h2>
              <div className="mx-auto w-12 h-0.5 bg-accent rounded-full" />
            </div>

            <div className="grid md:grid-cols-[280px_1fr] gap-12 items-start">
              {/* Left: sticky founder card */}
              <div className="md:sticky md:top-24 space-y-5">
                {/* Profile card */}
                <div className="rounded-2xl bg-primary p-8 text-white text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent text-white font-serif text-2xl font-bold">
                    M
                  </div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/40 mb-3">Dr Moses Oruaze Dickson</p>
                  <p className="text-[9px] text-white/40 tracking-wider">LLB · BL · LLM · MSc · LLM · PhD</p>
                </div>
                {/* Name + title below card */}
                <div>
                  <p className="font-bold text-primary text-sm">Dr Moses Oruaze Dickson</p>
                  <p className="text-xs text-muted-foreground">LLB · BL · LLM · MSc · LLM · PhD</p>
                  <p className="text-xs text-muted-foreground">Founder, Tolumo.</p>
                </div>
                {/* Pull quote */}
                <blockquote className="border-l-4 border-accent pl-4 text-sm text-muted-foreground italic leading-relaxed">
                  "Tolumo is the classroom I wish every student could have had: a place where complex ideas become crystal clear, where fear loosens its grip, and where every learner is reminded they are not a mistake, not an afterthought, and never too late."
                </blockquote>
              </div>

              {/* Right: long-form letter */}
              <div className="prose prose-sm prose-primary max-w-none text-muted-foreground leading-relaxed space-y-5 text-sm">
                <p>I did not become a lawyer because the road was kind. I became one because I refused to let the road decide my name.</p>
                <p>Like so many of you, I grew up at a time and home where nothing was promised and every chance had to be fought for. Hope was not something we found lying around; it was something we built, brick by brick, with trembling hands and stubborn hearts. Daily, we stared hardship in the face and chose not to bow. As students, we walked into admission offices with fear in our chests and faith in our feet. Some days, we sat through lectures on empty stomachs, listening for a voice that would say, "You can," when the world so often whispered, "You can't."</p>
                <p>Some lecturers lit lamps inside us. Others tried to convince us that the light was not ours to carry. But we made a quiet promise: where we started would not write the final sentence of our story.</p>
                <p><strong className="text-primary">By God's grace, after 5 years of toil, I graduated.</strong></p>
                <p>Yet graduation was not the finish line; it was the beginning of a deeper hunger. I wanted more — not just for me, but for every student who had ever felt small in a big system. So, education carried me across oceans. I learned in classrooms near and far, in libraries that smelled of old paper and new dreams. And when it was time to choose what to do with all I had gathered, I chose to come back home to the very university where I earned my LLB.</p>
                <p><strong className="text-primary">I came home to teach. To help others rise.</strong></p>
                <p>One day, I walked into the exact classroom where I had once sat as a student — head bent, heart racing, wondering if I belonged. This time, I stood at the front as a lecturer. As I looked out at those faces, I saw my younger self in every row. Every lesson became a conversation with the student I used to be: the one who needed clarity instead of confusion, patience instead of pressure, and belief instead of doubt.</p>
                <p><strong className="text-primary">So, I taught the way I wished I had been taught, encouraged and supported.</strong></p>
                <p>I spoke as if every student mattered — because they do. I explained as if no one should be left behind — because no one should. Slowly, the room shifted. The classroom filled to capacity, not because the law had suddenly become easy, but because learning finally made sense. Hope had found a new address.</p>

                {/* Pullquote block */}
                <div className="rounded-xl bg-primary px-8 py-6 not-prose my-8">
                  <p className="font-serif text-lg font-bold text-white leading-snug mb-2">"And then it struck me: if one classroom could change lives, what could a classroom without walls do?"</p>
                  <p className="text-sm text-white/60 italic">That question became Tolumo.</p>
                </div>

                <p>In my native Ijaw language, <strong className="text-primary">Tolumo</strong> means "to teach." But to me, it is much more than a word; it is a promise. Tolumo is the classroom I wish every student could have had: a place where complex ideas become crystal clear, where fear loosens its grip, and where every learner is reminded that they are not a mistake, not an afterthought, and never "too late" or "too little." You are exactly who you need to be to begin.</p>
                <p>Tolumo is not just a platform. It is a movement of second chances, of "try again," and of "you are closer than you think." It is built on the unwavering belief that while talent is everywhere, opportunity is not — and we are here to change that.</p>
                <p>With the support of my old classmates who survived those early hardships alongside me, fellow academics, mentors, and partners who share this dream, we are turning what once lived only in my heart into something you can hold in your hands and use to build your future.</p>

                <p className="font-semibold text-primary">This is our classroom without walls.</p>
                <p className="font-semibold text-primary">This is where we teach like every student matters, because you do.</p>
                <p className="font-semibold text-primary">This is where we learn like the future is listening, because it is.</p>

                <p><strong className="text-primary">Welcome to Tolumo!<br />I am honored to walk this road with you.</strong></p>

                {/* Signature */}
                <div className="flex items-center gap-3 pt-6 border-t border-border not-prose">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white font-serif font-bold text-sm">M</div>
                  <div>
                    <p className="text-sm font-bold text-primary">Dr Moses Oruaze Dickson</p>
                    <p className="text-xs text-muted-foreground">LLB · BL · LLM · MSc · LLM · PhD &nbsp;·&nbsp; Founder, Tolumo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border pt-14 pb-8">
        <div className="container mx-auto px-4 md:px-6 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-12 mb-12">
            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <img src={`${import.meta.env.BASE_URL.replace(/\/$/, "")}/logo.svg`} alt="Tolumo" className="h-8 w-8" />
                <span className="font-serif font-bold text-xl tracking-tight text-primary">Tolumo</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Africa's premier law tutorial platform. Real tutors. AI-guided revision, and a proven learning structure built for the Nigerian university experience.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Twitter / X', 'LinkedIn', 'Instagram', 'Facebook'].map(s => (
                  <a key={s} href="#" className="inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Platform */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">Platform</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                <li><a href="#modules" className="hover:text-primary transition-colors">NUC Modules</a></li>
                <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><Link href="/sign-in" className="hover:text-primary transition-colors">Tutorial Marketplace</Link></li>
                <li><Link href="/sign-up" className="hover:text-primary transition-colors">Become a Tutor</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">Support</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Centre</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Use</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">NDPA Compliance</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-5">Company</p>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><a href="#about" className="hover:text-primary transition-colors">About Tolumo</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Solalina</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Triax Solicitors</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Goldcoast Foundation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Press Enquiries</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <p>© 2025 Tolumo · Operated by Solalina. All rights reserved.</p>
            <p>Built for African students, by educators who care.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
