import React from 'react';
import { Link } from 'wouter';
import { useClerk } from '@clerk/react';
import { LogOut, BookOpen, User, CheckCircle2, Search, HelpCircle, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
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
            <a href="#modules" className="text-muted-foreground hover:text-primary transition-colors">Curriculum</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a>
            <a href="#tutors" className="text-muted-foreground hover:text-primary transition-colors">Faculty</a>
            <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">About</a>
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

        {/* Feature Highlights */}
        <section id="how-it-works" className="py-20 md:py-32 bg-white">
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
                <li><a href="#" className="hover:text-accent transition-colors">Our Curriculum</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Pricing & Plans</a></li>
                <li><Link href="/sign-in" className="hover:text-accent transition-colors">Student Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-lg mb-4 font-serif">Company</h4>
              <ul className="space-y-3 text-sm text-primary-foreground/70">
                <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
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
