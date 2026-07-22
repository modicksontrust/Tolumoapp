import React, { useState } from 'react';
import {
  User, Globe, CreditCard, CalendarCog, Bell, Archive,
  HelpCircle, LogOut, CheckCircle, ChevronDown, ChevronUp,
  Eye, EyeOff, Camera, Shield, Trash2, Plus, X, ExternalLink,
  MessageSquare, Clock, AlertTriangle, Lock, Smartphone,
  Mail, BookOpen, Video, Mic, FileText, Search
} from 'lucide-react';
import { useUser } from '@clerk/react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Section =
  | 'profile'
  | 'public-profile'
  | 'payout'
  | 'tutorial-defaults'
  | 'notifications'
  | 'content-archive'
  | 'help'
  | 'account';

// ── Shared form primitives ────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1.5">
      {children}
    </p>
  );
}

function Field({
  label, value, onChange, readOnly, hint, type = 'text', placeholder
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
  hint?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        readOnly={readOnly}
        value={value}
        placeholder={placeholder}
        onChange={e => onChange?.(e.target.value)}
        className={`w-full h-10 px-3 rounded-lg border text-sm outline-none transition-colors ${
          readOnly
            ? 'bg-stone-50 border-stone-200 text-muted-foreground cursor-not-allowed'
            : 'border-stone-300 bg-white focus:ring-2 focus:ring-primary/30 focus:border-primary'
        }`}
      />
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function Select({
  label, value, onChange, options, hint
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  hint?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-10 px-3 pr-8 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none"
        >
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: {
  label: string; desc?: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-stone-300'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

function SaveBar({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        onClick={onSave}
        className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
      >
        Save Changes
      </button>
      {saved && (
        <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
          <CheckCircle className="h-4 w-4" /> Saved
        </span>
      )}
    </div>
  );
}

// ── Section: Profile ──────────────────────────────────────────────────────────
function ProfileSection() {
  const { user } = useUser();
  const [name, setName] = useState(user?.fullName || 'Adeyemi Oluwaseun');
  const [phone, setPhone] = useState('+234 802 341 7890');
  const [gender, setGender] = useState('female');
  const [bio, setBio] = useState(
    'Senior Lecturer in Constitutional & Administrative Law with 12 years of experience teaching at the University of Lagos. Passionate about making Nigerian law accessible and practical for undergraduate students.'
  );
  const [title, setTitle] = useState('Professor of Constitutional Law');
  const [saved, setSaved] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const email = user?.primaryEmailAddress?.emailAddress || 'o.adeyemi@tolumo.com';
  const initials = name.split(' ').map(s => s[0]).join('').toUpperCase().slice(0, 2);

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPhotoUrl(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-serif font-bold text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account identity and personal details.</p>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Avatar card */}
      <div className="flex items-center gap-4 p-5 bg-stone-50 border border-stone-200 rounded-xl">
        <div className="relative">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-[#1a4d35] text-white flex items-center justify-center text-xl font-bold">
              {initials}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
            <CheckCircle className="h-2.5 w-2.5 text-white" />
          </div>
        </div>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
              <CheckCircle className="h-3.5 w-3.5" /> Verified
            </span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-primary font-medium hover:underline"
            >
              <Camera className="h-3.5 w-3.5" /> {photoUrl ? 'Change photo' : 'Upload photo'}
            </button>
            {photoUrl && (
              <button
                onClick={() => { setPhotoUrl(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                className="text-xs text-red-500 font-medium hover:underline"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <Label>Personal Information</Label>
        <div className="space-y-5 mt-3">
          <Field label="Full Name" value={name} onChange={setName} />
          <Field
            label="Email Address"
            value={email}
            readOnly
            hint="To change your email, contact Support."
          />
          <Field
            label="Phone Number"
            value={phone}
            onChange={setPhone}
            hint="Visible to your assigned Sub-Agent for identity verification."
          />
          <Select
            label="Gender"
            value={gender}
            onChange={setGender}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'prefer-not', label: 'Prefer not to say' },
            ]}
          />
        </div>
      </div>

      {/* Professional Details */}
      <div>
        <Label>Professional Details</Label>
        <div className="space-y-5 mt-3">
          <Field label="Professional Title" value={title} onChange={setTitle} placeholder="e.g. Senior Lecturer in Constitutional Law" />
          <div>
            <Label>Bio / About Me</Label>
            <textarea
              value={bio}
              onChange={e => setBio(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">{bio.length}/500 characters</p>
          </div>
        </div>
      </div>

      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ── Section: Public Profile ───────────────────────────────────────────────────
const EXPERTISE_OPTIONS = [
  'Constitutional Law', 'Administrative Law', 'Criminal Law', 'Contract Law',
  'Tort Law', 'Land Law', 'Commercial Law', 'Equity & Trusts', 'Family Law',
  'International Law', 'Human Rights', 'Company Law',
];

function PublicProfileSection() {
  const [visible, setVisible] = useState(true);
  const [headline, setHeadline] = useState('Nigeria\'s Leading Constitutional Law Tutor');
  const [tagline, setTagline] = useState('Helping LL.B students master constitutional principles with clarity and confidence.');
  const [expertise, setExpertise] = useState(['Constitutional Law', 'Administrative Law', 'Human Rights']);
  const [years, setYears] = useState('12');
  const [linkedin, setLinkedin] = useState('https://linkedin.com/in/adeyemi-oluwaseun');
  const [saved, setSaved] = useState(false);

  const toggleExpertise = (tag: string) => {
    setExpertise(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-serif font-bold text-foreground">Public Profile</h2>
        <p className="text-sm text-muted-foreground mt-0.5">What students and prospective clients see on your profile page.</p>
      </div>

      <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-xl">
        <div>
          <p className="text-sm font-semibold text-foreground">Profile Visibility</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {visible ? 'Your profile is visible to students on the platform.' : 'Your profile is hidden from search and discovery.'}
          </p>
        </div>
        <button
          onClick={() => setVisible(v => !v)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
            visible
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-stone-100 border-stone-300 text-muted-foreground'
          }`}
        >
          {visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {visible ? 'Visible' : 'Hidden'}
        </button>
      </div>

      <div className="space-y-5">
        <Field label="Headline" value={headline} onChange={setHeadline} placeholder="e.g. Nigeria's Leading Constitutional Law Tutor" />
        <div>
          <Label>Tagline / Short Bio</Label>
          <textarea
            value={tagline}
            onChange={e => setTagline(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
          />
        </div>
        <div>
          <Label>Areas of Expertise</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {EXPERTISE_OPTIONS.map(tag => (
              <button
                key={tag}
                onClick={() => toggleExpertise(tag)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  expertise.includes(tag)
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white border-stone-300 text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">{expertise.length} selected</p>
        </div>
        <Field label="Years of Experience" value={years} onChange={setYears} type="number" />
        <Field label="LinkedIn URL" value={linkedin} onChange={setLinkedin} type="url" />
      </div>

      <div className="flex items-center gap-3">
        <SaveBar onSave={save} saved={saved} />
        <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 text-sm font-medium text-foreground hover:bg-stone-50 transition-colors">
          <ExternalLink className="h-3.5 w-3.5" /> Preview Profile
        </button>
      </div>
    </div>
  );
}

// ── Section: Payout Details ───────────────────────────────────────────────────
const NIGERIAN_BANKS = [
  { value: '', label: 'Select bank…' },
  { value: 'access', label: 'Access Bank' },
  { value: 'citibank', label: 'Citibank Nigeria' },
  { value: 'ecobank', label: 'Ecobank Nigeria' },
  { value: 'fcmb', label: 'FCMB' },
  { value: 'fidelity', label: 'Fidelity Bank' },
  { value: 'firstbank', label: 'First Bank of Nigeria' },
  { value: 'gtb', label: 'Guaranty Trust Bank (GTB)' },
  { value: 'heritage', label: 'Heritage Bank' },
  { value: 'keystone', label: 'Keystone Bank' },
  { value: 'opay', label: 'OPay' },
  { value: 'palmpay', label: 'PalmPay' },
  { value: 'polaris', label: 'Polaris Bank' },
  { value: 'providus', label: 'Providus Bank' },
  { value: 'sterling', label: 'Sterling Bank' },
  { value: 'uba', label: 'United Bank for Africa (UBA)' },
  { value: 'union', label: 'Union Bank' },
  { value: 'unity', label: 'Unity Bank' },
  { value: 'wema', label: 'Wema Bank' },
  { value: 'zenith', label: 'Zenith Bank' },
];

function PayoutSection() {
  const [bank, setBank] = useState('gtb');
  const [accountName, setAccountName] = useState('Adeyemi Oluwaseun');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [bvn, setBvn] = useState('••••••••••');
  const [showBvn, setShowBvn] = useState(false);
  const [schedule, setSchedule] = useState('monthly');
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-serif font-bold text-foreground">Payout Details</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your bank account for session earnings and withdrawals.</p>
      </div>

      {/* Verified badge */}
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
        <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-green-800">Identity Verified</p>
          <p className="text-xs text-green-700 mt-0.5">Your BVN and account details have been verified by our Sub-Agent team.</p>
        </div>
      </div>

      {/* Bank details */}
      <div className="space-y-5">
        <Label>Bank Account Details</Label>
        <Select label="Bank Name" value={bank} onChange={setBank} options={NIGERIAN_BANKS} />
        <Field label="Account Name" value={accountName} onChange={setAccountName} readOnly hint="Account name must match your BVN records." />
        <Field label="Account Number" value={accountNumber} onChange={setAccountNumber} />
        <div>
          <Label>Bank Verification Number (BVN)</Label>
          <div className="relative">
            <input
              type={showBvn ? 'text' : 'password'}
              value={bvn}
              onChange={e => setBvn(e.target.value)}
              className="w-full h-10 px-3 pr-10 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary tracking-widest"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setShowBvn(v => !v)}
            >
              {showBvn ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Your BVN is encrypted and only used for identity verification.</p>
        </div>
      </div>

      {/* Payout schedule */}
      <div>
        <Label>Payout Schedule</Label>
        <div className="grid grid-cols-3 gap-3 mt-2">
          {[
            { value: 'weekly', label: 'Weekly', desc: 'Every Monday' },
            { value: 'biweekly', label: 'Bi-weekly', desc: 'Every 2 weeks' },
            { value: 'monthly', label: 'Monthly', desc: '1st of the month' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setSchedule(opt.value)}
              className={`p-3 rounded-xl border text-left transition-colors ${
                schedule === opt.value
                  ? 'bg-primary/5 border-primary text-foreground'
                  : 'border-stone-200 text-muted-foreground hover:border-stone-300'
              }`}
            >
              <p className={`text-sm font-semibold ${schedule === opt.value ? 'text-primary' : ''}`}>{opt.label}</p>
              <p className="text-xs mt-0.5">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Platform fee notice */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
        <p className="font-semibold mb-1">Platform Fee: 15%</p>
        <p className="text-xs">Tolumo retains 15% of each session fee. You receive 85% net of all completed, non-refunded sessions. Fees are deducted before payout.</p>
      </div>

      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ── Section: Tutorial Defaults ────────────────────────────────────────────────
function TutorialDefaultsSection() {
  const [duration, setDuration] = useState('60');
  const [sessionType, setSessionType] = useState('video');
  const [rate, setRate] = useState('8500');
  const [currency] = useState('NGN');
  const [buffer, setBuffer] = useState('15');
  const [autoAccept, setAutoAccept] = useState(false);
  const [cancelHours, setCancelHours] = useState('24');
  const [maxStudents, setMaxStudents] = useState('1');
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-serif font-bold text-foreground">Tutorial Defaults</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Pre-set preferences applied when creating new tutorial sessions.</p>
      </div>

      <div className="space-y-5">
        {/* Session duration */}
        <div>
          <Label>Default Session Duration</Label>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {['30', '45', '60', '90'].map(d => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                  duration === d
                    ? 'bg-primary text-white border-primary'
                    : 'border-stone-300 text-muted-foreground hover:border-primary hover:text-primary'
                }`}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        {/* Session type */}
        <div>
          <Label>Default Session Type</Label>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { value: 'video', label: 'Video Call', icon: Video },
              { value: 'audio', label: 'Audio Only', icon: Mic },
              { value: 'text', label: 'Text / Chat', icon: MessageSquare },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setSessionType(value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-colors ${
                  sessionType === value
                    ? 'bg-primary/5 border-primary'
                    : 'border-stone-200 text-muted-foreground hover:border-stone-300'
                }`}
              >
                <Icon className={`h-5 w-5 ${sessionType === value ? 'text-primary' : ''}`} />
                <span className={`text-xs font-semibold ${sessionType === value ? 'text-primary' : ''}`}>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rate */}
        <div>
          <Label>Hourly Rate ({currency})</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">₦</span>
            <input
              type="number"
              value={rate}
              onChange={e => setRate(e.target.value)}
              className="w-full h-10 pl-7 pr-3 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">Students see this as the per-session rate. You can override per booking.</p>
        </div>

        {/* Buffer time */}
        <Select
          label="Buffer Time Between Sessions"
          value={buffer}
          onChange={setBuffer}
          options={[
            { value: '0', label: 'No buffer' },
            { value: '10', label: '10 minutes' },
            { value: '15', label: '15 minutes' },
            { value: '30', label: '30 minutes' },
            { value: '60', label: '1 hour' },
          ]}
          hint="Time automatically blocked after each session ends."
        />

        {/* Max students */}
        <Select
          label="Session Type"
          value={maxStudents}
          onChange={setMaxStudents}
          options={[
            { value: '1', label: '1-on-1 (Individual)' },
            { value: '5', label: 'Small group (up to 5)' },
            { value: '10', label: 'Group session (up to 10)' },
          ]}
        />

        {/* Cancellation */}
        <Select
          label="Cancellation Notice Required"
          value={cancelHours}
          onChange={setCancelHours}
          options={[
            { value: '2', label: '2 hours notice' },
            { value: '6', label: '6 hours notice' },
            { value: '12', label: '12 hours notice' },
            { value: '24', label: '24 hours notice' },
            { value: '48', label: '48 hours notice' },
          ]}
          hint="Bookings cancelled within this window will not be refunded."
        />
      </div>

      {/* Auto-accept */}
      <div className="border border-stone-200 rounded-xl p-4 divide-y divide-stone-100">
        <Toggle
          label="Auto-accept Booking Requests"
          desc="New booking requests are automatically confirmed without manual review."
          checked={autoAccept}
          onChange={setAutoAccept}
        />
      </div>

      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ── Section: Notifications ────────────────────────────────────────────────────
function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    bookingRequest: true,
    bookingConfirm: true,
    bookingReminder: true,
    bookingCancel: true,
    studentMessage: true,
    earningsUpdate: true,
    weeklyReport: false,
    platformUpdates: false,
    newReview: true,
    contentApproval: true,
  });

  const toggle = (key: keyof typeof prefs) =>
    setPrefs(p => ({ ...p, [key]: !p[key] }));

  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const groups = [
    {
      title: 'Bookings',
      items: [
        { key: 'bookingRequest', label: 'New booking requests', desc: 'When a student submits a session booking.' },
        { key: 'bookingConfirm', label: 'Booking confirmations', desc: 'When a booking is confirmed or paid.' },
        { key: 'bookingReminder', label: 'Session reminders', desc: '1 hour before a scheduled session.' },
        { key: 'bookingCancel', label: 'Booking cancellations', desc: 'When a student cancels a session.' },
      ],
    },
    {
      title: 'Messages & Reviews',
      items: [
        { key: 'studentMessage', label: 'Student messages', desc: 'When a student sends you a direct message.' },
        { key: 'newReview', label: 'New student feedback', desc: 'When a student leaves a rating or review.' },
      ],
    },
    {
      title: 'Earnings & Content',
      items: [
        { key: 'earningsUpdate', label: 'Earnings payouts', desc: 'When a payout is processed to your account.' },
        { key: 'contentApproval', label: 'Content status updates', desc: 'When uploaded content is approved or flagged.' },
        { key: 'weeklyReport', label: 'Weekly analytics report', desc: 'Summary of student engagement every Monday.' },
      ],
    },
    {
      title: 'Platform',
      items: [
        { key: 'platformUpdates', label: 'Platform updates & news', desc: 'New features, maintenance notices, and announcements.' },
      ],
    },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-serif font-bold text-foreground">Notifications</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Control which email and in-app alerts you receive.</p>
      </div>

      {/* Delivery channels notice */}
      <div className="flex items-start gap-3 p-4 bg-stone-50 border border-stone-200 rounded-xl">
        <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Notifications are sent to <span className="font-semibold text-foreground">o.adeyemi@tolumo.com</span>.
          To update your email, go to <span className="font-semibold text-foreground">Profile</span> and contact Support.
        </p>
      </div>

      {groups.map(group => (
        <div key={group.title}>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-1">{group.title}</p>
          <div className="border border-stone-200 rounded-xl px-4 divide-y divide-stone-100">
            {group.items.map(({ key, label, desc }) => (
              <Toggle
                key={key}
                label={label}
                desc={desc}
                checked={prefs[key as keyof typeof prefs]}
                onChange={() => toggle(key as keyof typeof prefs)}
              />
            ))}
          </div>
        </div>
      ))}

      <SaveBar onSave={save} saved={saved} />
    </div>
  );
}

// ── Section: Content Archive ──────────────────────────────────────────────────
const ARCHIVED = [
  { id: 1, title: 'Introduction to Customary Law', type: 'Video', module: 'Jurisprudence', archived: '12 Mar 2025', size: '320 MB' },
  { id: 2, title: 'Lecture Notes — Week 3', type: 'Notes', module: 'Criminal Law', archived: '5 Apr 2025', size: '1.2 MB' },
  { id: 3, title: 'Equity Quiz Set A', type: 'Q&A', module: 'Equity & Trusts', archived: '18 May 2025', size: '—' },
  { id: 4, title: 'Torts Revision Slides', type: 'Slides', module: 'Tort Law', archived: '2 Jun 2025', size: '4.8 MB' },
];

const TYPE_COLORS: Record<string, string> = {
  Video: 'bg-blue-100 text-blue-700',
  Notes: 'bg-amber-100 text-amber-700',
  Slides: 'bg-purple-100 text-purple-700',
  'Q&A': 'bg-green-100 text-green-700',
};

function ContentArchiveSection() {
  const [items, setItems] = useState(ARCHIVED);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const filtered = items.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase()) ||
    i.module.toLowerCase().includes(search.toLowerCase())
  );

  const restore = (id: number) =>
    setItems(prev => prev.filter(i => i.id !== id));

  const deleteItem = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    setConfirmDelete(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-serif font-bold text-foreground">Content Archive</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Content you've removed from your active library. Restore or permanently delete.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Archived Items', value: String(items.length) },
          { label: 'Storage Used', value: '326 MB' },
          { label: 'Auto-delete In', value: '47 days' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-center">
            <p className="text-xl font-bold font-serif text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800">
          Archived content is automatically <strong>permanently deleted after 90 days</strong>. Restore items before this deadline if you want to keep them.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search archived content…"
          className="w-full h-10 pl-9 pr-3 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Archive className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No archived content found.</p>
        </div>
      ) : (
        <div className="border border-stone-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Module</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Archived</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground leading-snug">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.size}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TYPE_COLORS[item.type] || 'bg-stone-100 text-muted-foreground'}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{item.module}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{item.archived}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => restore(item.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
                      >
                        Restore
                      </button>
                      {confirmDelete === item.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => deleteItem(item.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-stone-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(item.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Section: Help & Support ───────────────────────────────────────────────────
const FAQS = [
  {
    q: 'How do I update my session availability?',
    a: 'Go to Tutorial Schedule → My Availability. You can set your available days and hours per day. Students can only book within your declared availability windows.',
  },
  {
    q: 'When are earnings paid out?',
    a: 'Earnings are paid according to your selected payout schedule (weekly, bi-weekly, or monthly). Tolumo retains a 15% platform fee before disbursement. All payouts go to the bank account registered in Payout Details.',
  },
  {
    q: 'How do I get my content approved?',
    a: 'Upload your content via My Content. Our team reviews submissions within 2–3 business days. You\'ll receive an email notification when approved or if changes are required.',
  },
  {
    q: 'Can I cancel or reschedule a booked session?',
    a: 'Yes. Open Tutorial Schedule, find the session, and use the "Reschedule" or "Cancel" action. Note: cancellations within your configured notice window may not qualify for a full refund to the student.',
  },
  {
    q: 'How do I change my hourly rate?',
    a: 'Go to Settings → Tutorial Defaults and update your Hourly Rate. The new rate applies to future bookings only — confirmed sessions are not affected.',
  },
  {
    q: 'What happens to my content if I deactivate my account?',
    a: 'Your content is archived for 90 days before permanent deletion. During this period, you can reactivate your account and restore all content. Enrolled students lose access immediately upon deactivation.',
  },
  {
    q: 'How do I contact a specific student?',
    a: 'Navigate to Student Analytics → Student Performance. Click on any student\'s name to open their profile, from which you can send a direct message.',
  },
];

export function HelpSupportPage() {
  const [open, setOpen] = useState<number | null>(null);
  const [ticketName, setTicketName] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketBody, setTicketBody] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = FAQS.filter(
    f =>
      f.q.toLowerCase().includes(search.toLowerCase()) ||
      f.a.toLowerCase().includes(search.toLowerCase())
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTicketName('');
    setTicketSubject('');
    setTicketBody('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  const TICKETS = [
    { id: 'TKT-0041', subject: 'Payout not received for June sessions', status: 'resolved', date: '3 Jul 2025' },
    { id: 'TKT-0038', subject: 'Video upload stuck at 94%', status: 'resolved', date: '19 Jun 2025' },
    { id: 'TKT-0031', subject: 'Student bookings not showing in schedule', status: 'closed', date: '4 May 2025' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-serif font-bold text-foreground">Help & Support</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Find answers, contact our team, or view your past support tickets.</p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: MessageSquare, label: 'Live Chat', desc: 'Chat with support Mon–Fri, 9am–6pm WAT', color: 'bg-blue-50 text-blue-600' },
          { icon: Mail, label: 'Email Support', desc: 'support@tolumo.com · reply within 24h', color: 'bg-green-50 text-green-600' },
        ].map(({ icon: Icon, label, desc, color }) => (
          <button
            key={label}
            className="flex items-center gap-4 p-4 bg-white border border-stone-200 rounded-xl hover:border-primary/40 transition-colors text-left"
          >
            <div className={`h-10 w-10 rounded-full ${color} flex items-center justify-center shrink-0`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* FAQ */}
      <div>
        <h3 className="font-serif font-bold text-foreground mb-3">Frequently Asked Questions</h3>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search help articles…"
            className="w-full h-10 pl-9 pr-3 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground px-4 py-6 text-center">No results for "{search}"</p>
          ) : (
            filtered.map((faq, i) => (
              <div key={i}>
                <button
                  className="w-full flex items-center justify-between gap-4 px-4 py-4 text-left hover:bg-stone-50 transition-colors"
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="text-sm font-medium text-foreground">{faq.q}</span>
                  {open === i ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                {open === i && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Submit ticket */}
      <div>
        <h3 className="font-serif font-bold text-foreground mb-1">Submit a Support Ticket</h3>
        <p className="text-sm text-muted-foreground mb-4">Can't find what you need? Our team typically responds within 24 hours.</p>
        {submitted ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-sm font-semibold text-green-800">Ticket submitted! We'll respond within 24 hours.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <Field label="Your Name" value={ticketName} onChange={setTicketName} placeholder="Adeyemi Oluwaseun" />
            <Field label="Subject" value={ticketSubject} onChange={setTicketSubject} placeholder="Brief description of the issue" />
            <div>
              <Label>Message</Label>
              <textarea
                value={ticketBody}
                onChange={e => setTicketBody(e.target.value)}
                rows={5}
                required
                placeholder="Describe your issue in detail…"
                className="w-full px-3 py-2.5 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Submit Ticket
            </button>
          </form>
        )}
      </div>

      {/* Ticket history */}
      <div>
        <h3 className="font-serif font-bold text-foreground mb-3">Your Support Tickets</h3>
        <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden">
          {TICKETS.map(t => (
            <div key={t.id} className="flex items-center gap-4 px-4 py-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono text-muted-foreground">{t.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    t.status === 'resolved'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-stone-100 text-muted-foreground'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-snug">{t.subject}</p>
              </div>
              <p className="text-xs text-muted-foreground shrink-0">{t.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HelpSection() {
  return <HelpSupportPage />;
}

// ── Section: Account ──────────────────────────────────────────────────────────
function AccountSection() {
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [pwdSaved, setPwdSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [showDelete, setShowDelete] = useState(false);

  const savePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSaved(true);
    setCurrentPwd('');
    setNewPwd('');
    setConfirmPwd('');
    setTimeout(() => setPwdSaved(false), 2500);
  };

  const SESSIONS_DATA = [
    { device: 'Chrome on macOS', location: 'Lagos, Nigeria', last: 'Now — current session', current: true },
    { device: 'Safari on iPhone 14', location: 'Lagos, Nigeria', last: '2 hours ago', current: false },
    { device: 'Chrome on Windows', location: 'Abuja, Nigeria', last: '3 days ago', current: false },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-lg font-serif font-bold text-foreground">Account</h2>
        <p className="text-sm text-muted-foreground mt-0.5">Security settings and account management.</p>
      </div>

      {/* Change password */}
      <div>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" /> Change Password
        </h3>
        <form onSubmit={savePassword} className="space-y-4 max-w-sm">
          {/* Current */}
          <div>
            <Label>Current Password</Label>
            <div className="relative">
              <input
                type={showCurrent ? 'text' : 'password'}
                value={currentPwd}
                onChange={e => setCurrentPwd(e.target.value)}
                required
                className="w-full h-10 px-3 pr-10 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowCurrent(v => !v)}>
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {/* New */}
          <div>
            <Label>New Password</Label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
                required
                className="w-full h-10 px-3 pr-10 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowNew(v => !v)}>
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPwd && (
              <div className="mt-1.5 flex gap-1">
                {[
                  newPwd.length >= 8,
                  /[A-Z]/.test(newPwd),
                  /[0-9]/.test(newPwd),
                  /[^a-zA-Z0-9]/.test(newPwd),
                ].map((ok, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${ok ? 'bg-green-500' : 'bg-stone-200'}`} />
                ))}
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">Min 8 chars, uppercase, number, special character.</p>
          </div>
          {/* Confirm */}
          <div>
            <Label>Confirm New Password</Label>
            <input
              type="password"
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-lg border border-stone-300 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
            {confirmPwd && newPwd !== confirmPwd && (
              <p className="text-xs text-red-600 mt-1">Passwords do not match.</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={newPwd !== confirmPwd || !currentPwd}
              className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Password
            </button>
            {pwdSaved && (
              <span className="flex items-center gap-1.5 text-sm text-green-600 font-medium">
                <CheckCircle className="h-4 w-4" /> Password updated
              </span>
            )}
          </div>
        </form>
      </div>

      {/* 2FA */}
      <div>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-muted-foreground" /> Two-Factor Authentication
        </h3>
        <div className="border border-stone-200 rounded-xl p-4">
          <Toggle
            label="Enable Two-Factor Authentication"
            desc="Add an extra layer of security. You'll be asked for a verification code each time you sign in from a new device."
            checked={twoFA}
            onChange={setTwoFA}
          />
          {twoFA && (
            <div className="mt-3 pt-3 border-t border-stone-100">
              <p className="text-sm text-muted-foreground">Set up via an authenticator app (Google Authenticator or Authy recommended).</p>
              <button className="mt-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors">
                Set Up Authenticator App
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" /> Active Sessions
        </h3>
        <div className="border border-stone-200 rounded-xl divide-y divide-stone-100 overflow-hidden">
          {SESSIONS_DATA.map((s, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3">
              <div className={`h-2 w-2 rounded-full shrink-0 ${s.current ? 'bg-green-500' : 'bg-stone-300'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{s.device}</p>
                <p className="text-xs text-muted-foreground">{s.location} · {s.last}</p>
              </div>
              {!s.current && (
                <button className="text-xs text-red-600 font-semibold hover:underline shrink-0">
                  Revoke
                </button>
              )}
              {s.current && (
                <span className="text-xs text-green-600 font-semibold shrink-0">Current</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div>
        <h3 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" /> Danger Zone
        </h3>
        <div className="border border-red-200 rounded-xl p-5 bg-red-50">
          <p className="text-sm font-semibold text-red-800 mb-1">Deactivate Account</p>
          <p className="text-sm text-red-700 mb-4">
            Deactivating your account immediately removes you from student search and hides all your content.
            Your data is retained for 90 days, after which it is permanently deleted. This action cannot be undone.
          </p>
          {!showDelete ? (
            <button
              onClick={() => setShowDelete(true)}
              className="px-4 py-2 rounded-lg border border-red-400 text-red-700 text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5 inline mr-1.5" />
              Deactivate Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-red-800">
                Type <strong>DELETE</strong> to confirm deactivation:
              </p>
              <input
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full max-w-xs h-10 px-3 rounded-lg border border-red-300 bg-white text-sm outline-none focus:ring-2 focus:ring-red-300"
              />
              <div className="flex items-center gap-3">
                <button
                  disabled={deleteConfirm !== 'DELETE'}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Confirm Deactivation
                </button>
                <button
                  onClick={() => { setShowDelete(false); setDeleteConfirm(''); }}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-sm font-semibold hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Nav items ─────────────────────────────────────────────────────────────────
const SETTINGS_NAV: { key: Section; label: string; icon: React.FC<{ className?: string }> }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'public-profile', label: 'Public Profile', icon: Globe },
  { key: 'payout', label: 'Payout Details', icon: CreditCard },
  { key: 'tutorial-defaults', label: 'Tutorial Defaults', icon: CalendarCog },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'content-archive', label: 'Content Archive', icon: Archive },
  { key: 'help', label: 'Help & Support', icon: HelpCircle },
  { key: 'account', label: 'Account', icon: LogOut },
];

const SECTION_COMPONENTS: Record<Section, React.FC> = {
  'profile': ProfileSection,
  'public-profile': PublicProfileSection,
  'payout': PayoutSection,
  'tutorial-defaults': TutorialDefaultsSection,
  'notifications': NotificationsSection,
  'content-archive': ContentArchiveSection,
  'help': HelpSection,
  'account': AccountSection,
};

// ── Main export ───────────────────────────────────────────────────────────────
interface SettingsPageProps {
  initialSection?: Section;
}

export default function SettingsPage({ initialSection = 'profile' }: SettingsPageProps) {
  const [active, setActive] = useState<Section>(initialSection);
  const ActiveSection = SECTION_COMPONENTS[active];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Tutor Account</p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Settings sidebar */}
        <aside className="w-56 shrink-0 bg-white border border-stone-200 rounded-xl overflow-hidden sticky top-4">
          <nav className="py-1.5">
            {SETTINGS_NAV.map(({ key, label, icon: Icon }) => {
              const isActive = active === key;
              const isDanger = key === 'account';
              return (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'bg-primary/5 text-primary'
                      : isDanger
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-muted-foreground hover:bg-stone-50 hover:text-foreground'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isDanger && !isActive ? 'text-red-500' : ''}`} />
                  <span className="flex-1 text-left">{label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 bg-white border border-stone-200 rounded-xl p-8">
          <ActiveSection />
        </div>
      </div>
    </div>
  );
}
