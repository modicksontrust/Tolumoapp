import React from 'react';
import { Link } from 'wouter';
import { useClerk } from '@clerk/react';
import { LogOut, BookOpen, User, CheckCircle2, Search, HelpCircle, Mail, MapPin, Phone, GraduationCap, Scale, Users } from 'lucide-react';
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
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-primary pt-24 pb-32 md:pt-32 md:pb-40">
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/95 to-primary/80" />
          
          <div className="container relative mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent mb-6 backdrop-blur-sm">
                <span className="flex h-2 w-2 rounded-full bg-accent mr-2 animate-pulse"></span>
                NUC Approved Curriculum
              </div>
              
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
                Learn Law From <br />
                <span className="font-serif italic text-gold-gradient block mt-2">Nigeria's Top</span>
                Lecturers.
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl leading-relaxed">
                Complete your 5-year LL.B degree online with expert video tutorials, AI-guided revision, and personalized one-on-one sessions.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/sign-up" className="inline-flex h-12 items-center justify-center rounded-md bg-accent px-8 py-3 text-base font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent/90 hover:scale-105">
                  Try the Platform
                </Link>
                <a href="#modules" className="inline-flex h-12 items-center justify-center rounded-md border border-white/20 bg-white/5 px-8 py-3 text-base font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white">
                  View Curriculum
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Band */}
        <section className="border-b border-border bg-white shadow-sm relative z-10 -mt-10 mx-4 md:mx-auto md:max-w-5xl rounded-xl">
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
        </section>

        {/* Try the Platform (Portal Links) */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Choose Your Path</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Tolumo provides tailored experiences for students, educators, and partners. 
                Log in to the portal that fits your role.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Student Portal */}
              <div className="group relative rounded-2xl border border-border bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-accent/50 text-center overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-accent/5 transition-transform group-hover:scale-150"></div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary mb-6">
                  <BookOpen className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary mb-3">Student Portal</h3>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                  Access your modules, track progress, book tutor sessions, and master the law with AI-guided revision.
                </p>
                <Link href="/sign-up" className="inline-flex w-full items-center justify-center rounded-md border border-primary/20 bg-transparent px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white">
                  Student Access →
                </Link>
              </div>
              
              {/* Tutor Portal */}
              <div className="group relative rounded-2xl border border-border bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-accent/50 text-center overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-accent/5 transition-transform group-hover:scale-150"></div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary mb-6">
                  <User className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary mb-3">Faculty Portal</h3>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                  Manage your courses, upload lectures, track student performance, and conduct one-on-one sessions.
                </p>
                <Link href="/sign-in" className="inline-flex w-full items-center justify-center rounded-md border border-primary/20 bg-transparent px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white">
                  Tutor Access →
                </Link>
              </div>
              
              {/* Agent Portal */}
              <div className="group relative rounded-2xl border border-border bg-white p-8 shadow-sm transition-all hover:shadow-md hover:border-accent/50 text-center overflow-hidden">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-accent/5 transition-transform group-hover:scale-150"></div>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/5 text-primary mb-6">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-primary mb-3">Partner Network</h3>
                <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                  Join our agent network. Manage acquisitions, track your pipeline, and view your commission statements.
                </p>
                <Link href="/sign-in" className="inline-flex w-full items-center justify-center rounded-md border border-primary/20 bg-transparent px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white">
                  Partner Access →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Modules / Curriculum */}
        <section id="modules" className="py-20 md:py-32 bg-white scroll-mt-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-sm text-accent mb-4 font-medium">
                NUC Approved Curriculum
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">Explore Our Modules</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A complete 5-year LL.B curriculum, from Legal Methods to Jurisprudence — taught by Nigeria's finest legal minds.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {(modules ?? []).slice(0, 9).map((mod) => (
                <div key={mod.id} className="group rounded-xl border border-border bg-background p-6 transition-all hover:shadow-md hover:border-accent/50">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center rounded-md bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary tracking-wide">{mod.code}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Year {mod.year}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-primary mb-2">{mod.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{mod.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" /> {mod.lessonCount} lessons</span>
                    {mod.tutorName && <span className="inline-flex items-center gap-1"><User className="h-3.5 w-3.5" /> {mod.tutorName}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/sign-up" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-semibold text-white shadow transition-colors hover:bg-primary/90">
                Enroll to Access All Modules
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
