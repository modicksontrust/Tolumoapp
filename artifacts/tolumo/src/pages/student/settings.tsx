import React, { useState } from 'react';
import { useUser } from '@clerk/react';
import { User, CreditCard, Bell, Shield, ChevronRight, CheckCircle2, Camera } from 'lucide-react';

function SaveBar({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button onClick={onSave} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
        Save Changes
      </button>
      {saved && (
        <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
          <CheckCircle2 className="h-4 w-4" /> Saved
        </span>
      )}
    </div>
  );
}

const SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Account', icon: Shield },
];

export default function StudentSettings() {
  const { user } = useUser();
  const [active, setActive] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(user?.fullName || 'Chisom Anieke');
  const [phone, setPhone] = useState('+234 803 456 7890');
  const [university, setUniversity] = useState('University of Lagos');
  const [level, setLevel] = useState('200');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  // Notification toggles
  const [notifs, setNotifs] = useState({
    sessionConfirmations: true,
    quizResults: true,
    newModules: true,
    progressReminders: true,
    promotions: false,
  });

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const email = user?.primaryEmailAddress?.emailAddress || 'chisom.anieke@example.com';
  const initials = name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-0.5">Student Account</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <aside className="w-52 shrink-0">
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-colors border-b border-stone-100 last:border-b-0 ${active === s.id ? 'bg-primary/5 text-primary' : 'text-foreground hover:bg-stone-50'}`}>
                <s.icon className={`h-4 w-4 ${active === s.id ? 'text-primary' : 'text-muted-foreground'}`} />
                {s.label}
                {active === s.id && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </aside>

        {/* Panel */}
        <div className="flex-1 bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-6">

          {/* Profile */}
          {active === 'profile' && (
            <>
              <div>
                <h2 className="text-lg font-serif font-bold text-foreground">Profile</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Manage your account identity.</p>
              </div>

              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) setPhotoUrl(URL.createObjectURL(f)); }} />

              {/* Avatar */}
              <div className="flex items-center gap-4 p-5 bg-stone-50 border border-stone-200 rounded-xl">
                <div className="relative">
                  {photoUrl ? (
                    <img src={photoUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-[#1a4d35] text-white flex items-center justify-center text-xl font-bold">{initials}</div>
                  )}
                  <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                    <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-foreground">{name}</p>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</span>
                    <button onClick={() => fileRef.current?.click()} className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline">
                      <Camera className="h-3.5 w-3.5" /> {photoUrl ? 'Change photo' : 'Upload photo'}
                    </button>
                    {photoUrl && <button onClick={() => setPhotoUrl(null)} className="text-xs text-red-500 hover:underline">Remove</button>}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Full Name', value: name, onChange: setName },
                  { label: 'Phone Number', value: phone, onChange: setPhone },
                  { label: 'University', value: university, onChange: setUniversity },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">{f.label}</label>
                    <input value={f.value} onChange={e => f.onChange(e.target.value)}
                      className="w-full h-10 rounded-xl border border-stone-200 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Email Address</label>
                  <input value={email} readOnly className="w-full h-10 rounded-xl border border-stone-200 px-3 text-sm text-muted-foreground bg-stone-50 cursor-not-allowed" />
                  <p className="text-xs text-muted-foreground mt-1">To change your email, contact Support.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wide mb-1.5">Academic Level</label>
                  <select value={level} onChange={e => setLevel(e.target.value)}
                    className="w-full h-10 rounded-xl border border-stone-200 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 bg-white">
                    {['100','200','300','400','500'].map(l => <option key={l} value={l}>{l} Level</option>)}
                  </select>
                </div>
              </div>
              <SaveBar onSave={save} saved={saved} />
            </>
          )}

          {/* Subscription */}
          {active === 'subscription' && (
            <>
              <div>
                <h2 className="text-lg font-serif font-bold text-foreground">Subscription</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Manage your learning plan.</p>
              </div>

              {/* Current plan */}
              <div className="border-2 border-primary rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-accent text-white text-[10px] font-bold uppercase tracking-wide mb-2">Active Plan</span>
                    <h3 className="font-serif font-bold text-lg text-foreground">Monthly Plan</h3>
                    <p className="text-muted-foreground text-sm">Full Year 2 access, billed monthly</p>
                  </div>
                  <span className="text-2xl font-bold text-primary">₦3,500<span className="text-sm font-normal text-muted-foreground">/mo</span></span>
                </div>
                <ul className="mt-4 space-y-2">
                  {['All Year 2 module videos', 'Downloadable lecture notes & slides', 'AI Revision Coach (5 Q&As per topic)', 'MCQ + practical essay quizzes', 'Tutorial session marketplace access', 'Certificate of completion'].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5 flex items-center gap-3">
                  <button className="px-5 py-2.5 rounded-xl border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors">Cancel Plan</button>
                  <span className="text-xs text-muted-foreground">Renews 14 Aug 2025</span>
                </div>
              </div>

              {/* Upgrade */}
              <div className="bg-stone-900 text-white rounded-xl p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2.5 py-1 rounded-full bg-accent/80 text-white text-[10px] font-bold uppercase tracking-wide mb-2">Save ₦7,000/yr</span>
                    <h3 className="font-semibold text-lg">Switch to Annual</h3>
                    <p className="text-white/60 text-sm">₦35,000/year · 2 months free</p>
                  </div>
                  <span className="text-2xl font-bold">₦35,000<span className="text-sm font-normal text-white/60">/yr</span></span>
                </div>
                <button className="mt-4 w-full py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors">Switch to Annual Plan</button>
              </div>
            </>
          )}

          {/* Notifications */}
          {active === 'notifications' && (
            <>
              <div>
                <h2 className="text-lg font-serif font-bold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Choose what you hear from Tolumo.</p>
              </div>
              <div className="space-y-4">
                {(Object.entries({
                  sessionConfirmations: 'Session confirmations & reminders',
                  quizResults: 'Quiz results & AI feedback',
                  newModules: 'New modules & content updates',
                  progressReminders: 'Weekly progress reports',
                  promotions: 'Promotions & special offers',
                }) as [keyof typeof notifs, string][]).map(([key, label]) => (
                  <label key={key} className="flex items-center justify-between py-3 border-b border-stone-100 cursor-pointer">
                    <span className="text-sm font-medium text-foreground">{label}</span>
                    <button
                      onClick={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                      className={`relative h-6 w-11 rounded-full transition-colors ${notifs[key] ? 'bg-primary' : 'bg-stone-200'}`}
                    >
                      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${notifs[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </label>
                ))}
              </div>
              <SaveBar onSave={save} saved={saved} />
            </>
          )}

          {/* Account */}
          {active === 'account' && (
            <>
              <div>
                <h2 className="text-lg font-serif font-bold text-foreground">Account</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Security and account management.</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Change Password', desc: 'Update your account password' },
                  { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security' },
                  { label: 'Download My Data', desc: 'Get a copy of your learning data' },
                  { label: 'Privacy Settings', desc: 'Control how your data is used' },
                ].map(a => (
                  <button key={a.label} className="w-full flex items-center justify-between p-4 rounded-xl border border-stone-200 hover:border-primary/30 hover:bg-stone-50 transition-colors text-left">
                    <div>
                      <p className="font-medium text-sm text-foreground">{a.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </button>
                ))}
              </div>
              <div className="pt-4 border-t border-stone-100">
                <h3 className="text-sm font-semibold text-red-600 mb-3">Danger Zone</h3>
                <button className="px-5 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors">
                  Delete Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
