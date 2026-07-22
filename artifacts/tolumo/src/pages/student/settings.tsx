import React, { useState } from 'react';
import { useUser } from '@clerk/react';
import {
  User, Building2, CreditCard, Star, Bell, Bookmark,
  SlidersHorizontal, HelpCircle, LogOut, CheckCircle2,
  Camera, CreditCard as CardIcon, ExternalLink, AlertTriangle,
  ChevronRight, X,
} from 'lucide-react';
import { useLocation } from 'wouter';
import { useClerk } from '@clerk/react';

// ── helpers ───────────────────────────────────────────────────────────────────
function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative h-6 w-11 rounded-full transition-colors shrink-0 ${on ? 'bg-[#1a4d35]' : 'bg-stone-200'}`}
    >
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${on ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

function Field({ label, sublabel, children }: { label: string; sublabel?: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-0.5">{label}</p>
      {sublabel && <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-1.5">{sublabel}</p>}
      {children}
    </div>
  );
}

// ── nav items ─────────────────────────────────────────────────────────────────
const NAV = [
  { id: 'profile',        label: 'Profile',                icon: User,             red: false },
  { id: 'school',         label: 'School & Level',         icon: Building2,        red: false },
  { id: 'billing',        label: 'Subscription & Billing', icon: CreditCard,       red: false },
  { id: 'credits',        label: 'Credits & Redemption',   icon: Star,             red: false },
  { id: 'notifications',  label: 'Notifications',          icon: Bell,             red: false },
  { id: 'saved',          label: 'Saved Opportunities',    icon: Bookmark,         red: false },
  { id: 'preferences',    label: 'Preferences',            icon: SlidersHorizontal,red: false },
  { id: 'help',           label: 'Help & Support',         icon: HelpCircle,       red: false },
  { id: 'account',        label: 'Account',                icon: LogOut,           red: true  },
] as const;
type SectionId = typeof NAV[number]['id'];

// ── component ─────────────────────────────────────────────────────────────────
export default function StudentSettings() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [, setLocation] = useLocation();
  const [active, setActive] = useState<SectionId>('profile');

  // profile
  const [name, setName] = useState(user?.fullName || 'Chisom Nwosu');
  const [phone, setPhone] = useState('+234 803 456 7890');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const email = user?.primaryEmailAddress?.emailAddress || 'chisom@example.com';
  const initials = name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);

  // school
  const [university, setUniversity] = useState('University of Lagos');
  const [studyYear, setStudyYear] = useState('Year 2 (200 Level)');

  // notifications
  const [notifs, setNotifs] = useState({
    push: true, email: true, whatsapp: false,
    contentUnlocks: true, tutorialReminders: true,
    paymentBilling: true, feedbackPrompts: true, platformAnnouncements: true,
  });

  // preferences
  const [appearance, setAppearance] = useState<'Light' | 'Dark' | 'System'>('System');
  const [language, setLanguage] = useState('English');

  // save feedback
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Student Account</p>
      </div>

      <div className="flex gap-5 items-start">
        {/* ── Sidebar ── */}
        <aside className="w-56 shrink-0">
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden divide-y divide-stone-100">
            {NAV.map(n => {
              const isActive = active === n.id;
              return (
                <button key={n.id} onClick={() => setActive(n.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left
                    ${isActive ? 'bg-stone-50 text-foreground' : n.red ? 'text-red-500 hover:bg-red-50' : 'text-foreground hover:bg-stone-50'}`}>
                  <n.icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-foreground' : n.red ? 'text-red-400' : 'text-muted-foreground'}`} />
                  <span>{n.label}</span>
                  {isActive && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1a4d35]" />}
                </button>
              );
            })}
          </div>
        </aside>

        {/* ── Panel ── */}
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-stone-200 shadow-sm p-7 space-y-6">

          {/* ── Profile ─────────────────────────────────────────────── */}
          {active === 'profile' && (
            <>
              <h2 className="font-serif font-bold text-lg text-foreground">Profile</h2>

              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setPhotoUrl(URL.createObjectURL(f)); }} />

              {/* Avatar row */}
              <div className="flex items-center gap-4 p-5 bg-stone-50 border border-stone-100 rounded-xl">
                <div className="relative">
                  {photoUrl
                    ? <img src={photoUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
                    : <div className="h-14 w-14 rounded-full bg-[#1a4d35] text-white flex items-center justify-center text-lg font-bold">{initials}</div>}
                  <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">{name}</p>
                  <p className="text-xs text-muted-foreground">{email}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-xs text-green-600 font-semibold flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</span>
                    <button onClick={() => fileRef.current?.click()} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                      <Camera className="h-3.5 w-3.5" /> {photoUrl ? 'Change photo' : 'Upload photo'}
                    </button>
                    {photoUrl && <button onClick={() => setPhotoUrl(null)} className="text-xs text-red-500 hover:underline">Remove</button>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Full Name',     value: name,  onChange: setName  },
                  { label: 'Phone Number',  value: phone, onChange: setPhone },
                ].map(f => (
                  <Field key={f.label} label={f.label}>
                    <input value={f.value} onChange={e => f.onChange(e.target.value)}
                      className="w-full h-10 rounded-xl border border-stone-200 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" />
                  </Field>
                ))}
                <Field label="Email Address">
                  <input value={email} readOnly className="w-full h-10 rounded-xl border border-stone-200 px-3 text-sm text-muted-foreground bg-stone-50 cursor-not-allowed" />
                  <p className="text-xs text-muted-foreground mt-1">To change your email, contact Support.</p>
                </Field>
              </div>

              <button onClick={save} className="px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#1a4d35]/90 transition-colors">
                {saved ? '✓ Saved' : 'Save Changes'}
              </button>
            </>
          )}

          {/* ── School & Level ──────────────────────────────────────── */}
          {active === 'school' && (
            <>
              <h2 className="font-serif font-bold text-lg text-foreground">School &amp; Level</h2>

              <div className="space-y-5">
                <Field label="Institution" sublabel="University / Law School">
                  <select value={university} onChange={e => setUniversity(e.target.value)}
                    className="w-full h-10 rounded-xl border border-stone-200 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white appearance-none">
                    {['University of Lagos', 'University of Ibadan', 'Ahmadu Bello University', 'Obafemi Awolowo University', 'University of Nigeria, Nsukka'].map(u => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </Field>

                <Field label="Year of Study" sublabel="Current Level">
                  <select value={studyYear} onChange={e => setStudyYear(e.target.value)}
                    className="w-full h-10 rounded-xl border border-stone-200 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white appearance-none">
                    {['Year 1 (100 Level)', 'Year 2 (200 Level)', 'Year 3 (300 Level)', 'Year 4 (400 Level)', 'Year 5 (500 Level)'].map(y => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </Field>

                <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                  <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">Changing your year of study may affect which courses and modules you can access.</p>
                </div>
              </div>

              <button onClick={save} className="px-5 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#1a4d35]/90 transition-colors">
                {saved ? '✓ Saved' : 'Save Changes'}
              </button>
            </>
          )}

          {/* ── Subscription & Billing ──────────────────────────────── */}
          {active === 'billing' && (
            <>
              <h2 className="font-serif font-bold text-lg text-foreground">Subscription &amp; Billing</h2>

              {/* Current plan */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Current Plan</p>
                <div className="rounded-xl border border-stone-200 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-stone-100 text-foreground text-xs font-semibold">Monthly</span>
                    <span className="text-xs text-muted-foreground">Renews 1 Aug 2025</span>
                  </div>
                  <p className="font-serif font-bold text-2xl text-foreground">₦3,500 <span className="text-base font-normal text-muted-foreground">/ month</span></p>
                  <button className="w-full py-2.5 rounded-xl bg-amber-400 text-stone-900 text-sm font-bold hover:bg-amber-300 transition-colors">
                    Switch to Annual — Save 17% (₦35,000/yr)
                  </button>
                </div>
              </div>

              {/* Payment method */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Payment Method</p>
                <div className="rounded-xl border border-stone-200 px-5 py-4 flex items-center gap-3">
                  <CardIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground tracking-wider">•••• •••• •••• 4521</p>
                    <p className="text-xs text-muted-foreground">Expires 09/27</p>
                  </div>
                  <button className="text-sm text-primary font-semibold hover:underline">Update</button>
                </div>
              </div>

              {/* Billing history */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Billing History</p>
                <div className="rounded-xl border border-stone-200 divide-y divide-stone-100">
                  {[
                    { date: '1 Jul 2025', amount: '₦3,500' },
                    { date: '1 Jun 2025', amount: '₦3,500' },
                    { date: '1 May 2025', amount: '₦3,500' },
                  ].map(h => (
                    <div key={h.date} className="flex items-center justify-between px-5 py-3 text-sm">
                      <span className="text-foreground">{h.date}</span>
                      <span className="font-medium text-foreground">{h.amount}</span>
                      <span className="text-green-600 font-semibold">Paid</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                <X className="h-4 w-4" /> Cancel Subscription
              </button>
            </>
          )}

          {/* ── Credits & Redemption ────────────────────────────────── */}
          {active === 'credits' && (
            <>
              <h2 className="font-serif font-bold text-lg text-foreground">Credits &amp; Redemption</h2>
              <div className="rounded-xl bg-stone-50 border border-stone-200 p-6 text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
                  <Star className="h-6 w-6 text-amber-500" />
                </div>
                <p className="font-semibold text-foreground">0 Credits</p>
                <p className="text-sm text-muted-foreground">Credits are earned by completing modules, rating sessions, and referring friends. They can be used to unlock add-on modules or extend your subscription.</p>
              </div>
              <div className="rounded-xl border border-stone-200 p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Redeem a Code</p>
                <div className="flex gap-2">
                  <input placeholder="Enter promo or gift code" className="flex-1 h-10 rounded-xl border border-stone-200 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20" />
                  <button className="px-4 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#1a4d35]/90 transition-colors">Apply</button>
                </div>
              </div>
            </>
          )}

          {/* ── Notifications ───────────────────────────────────────── */}
          {active === 'notifications' && (
            <>
              <h2 className="font-serif font-bold text-lg text-foreground">Notifications</h2>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Channels</p>
                <div className="rounded-xl border border-stone-200 divide-y divide-stone-100">
                  {[
                    { key: 'push',     label: 'Push notifications',   sub: null },
                    { key: 'email',    label: 'Email notifications',   sub: null },
                    { key: 'whatsapp', label: 'WhatsApp alerts',       sub: 'Requires a verified WhatsApp number.' },
                  ].map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
                      </div>
                      <Toggle on={notifs[key as keyof typeof notifs]} onChange={v => setNotifs(n => ({ ...n, [key]: v }))} />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Notification Types</p>
                <div className="rounded-xl border border-stone-200 divide-y divide-stone-100">
                  {[
                    { key: 'contentUnlocks',        label: 'Content unlocks',          sub: 'When new topics and modules become available.' },
                    { key: 'tutorialReminders',      label: 'Tutorial reminders',        sub: '24-hour and 1-hour reminders before booked sessions.' },
                    { key: 'paymentBilling',         label: 'Payment & billing',         sub: 'Receipts, renewals, and failed payment alerts.' },
                    { key: 'feedbackPrompts',        label: 'Feedback prompts',          sub: 'Reminders to rate sessions and topics.' },
                    { key: 'platformAnnouncements',  label: 'Platform announcements',    sub: 'New features, maintenance windows, and semester updates.' },
                  ].map(({ key, label, sub }) => (
                    <div key={key} className="flex items-center justify-between px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                      </div>
                      <Toggle on={notifs[key as keyof typeof notifs]} onChange={v => setNotifs(n => ({ ...n, [key]: v }))} />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── Saved Opportunities ─────────────────────────────────── */}
          {active === 'saved' && (
            <>
              <h2 className="font-serif font-bold text-lg text-foreground">Saved Opportunities</h2>

              <div className="rounded-xl border border-stone-200 p-5 space-y-3">
                <p className="font-semibold text-foreground">Scholarships &amp; Opportunities Hub</p>
                <p className="text-sm text-muted-foreground leading-relaxed">Browse and manage your bookmarked scholarships, fellowships, internships, and job postings. This section lives in the main hub — your bookmarks travel with your account.</p>
                <a href="/student/scholarships"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1a4d35] text-white text-sm font-semibold hover:bg-[#1a4d35]/90 transition-colors">
                  <ExternalLink className="h-4 w-4" /> Open Opportunities Hub
                </a>
              </div>

              <p className="text-sm text-muted-foreground">Your saved opportunities are synced to your account and accessible across all devices.</p>
            </>
          )}

          {/* ── Preferences ─────────────────────────────────────────── */}
          {active === 'preferences' && (
            <>
              <h2 className="font-serif font-bold text-lg text-foreground">Preferences</h2>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Appearance</p>
                <div className="grid grid-cols-3 gap-3">
                  {(['Light', 'Dark', 'System'] as const).map(mode => {
                    const icons = { Light: '☀️', Dark: '🌙', System: '🖥' };
                    return (
                      <button key={mode} onClick={() => setAppearance(mode)}
                        className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 text-sm font-medium transition-colors
                          ${appearance === mode ? 'border-[#1a4d35] bg-[#1a4d35]/5 text-foreground' : 'border-stone-200 text-muted-foreground hover:border-stone-300'}`}>
                        <span className="text-xl">{icons[mode]}</span>
                        {mode}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Language</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-2">Display Language</p>
                <select value={language} onChange={e => setLanguage(e.target.value)}
                  className="w-full h-10 rounded-xl border border-stone-200 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 bg-white appearance-none">
                  <option>English</option>
                  <option>Yoruba</option>
                  <option>Igbo</option>
                  <option>Hausa</option>
                </select>
              </div>
            </>
          )}

          {/* ── Help & Support ──────────────────────────────────────── */}
          {active === 'help' && (
            <>
              <h2 className="font-serif font-bold text-lg text-foreground">Help &amp; Support</h2>
              <div className="space-y-3">
                {[
                  { label: 'Help Centre',             desc: 'Browse FAQs and how-to guides' },
                  { label: 'Contact Support',         desc: 'Open a ticket with our team' },
                  { label: 'Report a Bug',            desc: 'Tell us what went wrong' },
                  { label: 'Request a Feature',       desc: 'Suggest improvements to Tolumo' },
                  { label: 'Privacy Policy',          desc: 'How we handle your data' },
                  { label: 'Terms of Service',        desc: 'Platform rules and agreements' },
                ].map(item => (
                  <button key={item.label}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-200 hover:border-primary/30 hover:bg-stone-50 transition-colors text-left">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ── Account ─────────────────────────────────────────────── */}
          {active === 'account' && (
            <>
              <h2 className="font-serif font-bold text-lg text-foreground">Account</h2>
              <div className="space-y-3">
                {[
                  { label: 'Change Password',            desc: 'Update your account password' },
                  { label: 'Two-Factor Authentication',  desc: 'Add an extra layer of security' },
                  { label: 'Download My Data',           desc: 'Get a copy of your learning data' },
                  { label: 'Connected Accounts',         desc: 'Manage linked social logins' },
                ].map(a => (
                  <button key={a.label}
                    className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-200 hover:border-primary/30 hover:bg-stone-50 transition-colors text-left">
                    <div>
                      <p className="text-sm font-medium text-foreground">{a.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>

              <div className="border-t border-stone-100 pt-5 space-y-3">
                <button
                  onClick={() => signOut().then(() => setLocation('/sign-in'))}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-200 hover:bg-stone-50 transition-colors text-left">
                  <div>
                    <p className="text-sm font-medium text-foreground">Sign Out</p>
                    <p className="text-xs text-muted-foreground">Sign out of your Tolumo account</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 hover:bg-red-50 transition-colors text-left">
                  <div>
                    <p className="text-sm font-medium text-red-600">Delete Account</p>
                    <p className="text-xs text-red-400">Permanently delete your account and all data</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-red-400 shrink-0" />
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
