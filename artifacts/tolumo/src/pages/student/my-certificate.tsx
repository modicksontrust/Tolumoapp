import React from 'react';
import { useUser } from '@clerk/react';
import { Award, CheckCircle2, Lock, Download, Share2, BookOpen } from 'lucide-react';

const MODULES = [
  { code: 'LAW 201', title: 'Constitutional Law', done: 8, total: 12, pct: 67 },
  { code: 'LAW 202', title: 'Law of Contract', done: 4, total: 10, pct: 40 },
  { code: 'LAW 203', title: 'Criminal Law I', done: 6, total: 11, pct: 55 },
  { code: 'LAW 204', title: 'Law of Torts', done: 2, total: 9, pct: 22 },
  { code: 'LAW 205', title: 'Jurisprudence', done: 1, total: 8, pct: 13 },
  { code: 'LAW 206', title: 'Land Law I', done: 0, total: 10, pct: 0 },
];

export default function MyCertificate() {
  const { user } = useUser();
  const displayName = user?.fullName || 'Chisom Nwosu';

  const totalTopics = MODULES.reduce((s, m) => s + m.total, 0);
  const doneTopics = MODULES.reduce((s, m) => s + m.done, 0);
  const overallPct = Math.round((doneTopics / totalTopics) * 100);
  const allComplete = overallPct === 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">My Certificate</h1>
        <p className="text-muted-foreground mt-0.5">Complete all Year 2 topics to earn your Tolumo LL.B Certificate of Completion.</p>
      </div>

      {/* Certificate preview */}
      <div className={`relative rounded-2xl overflow-hidden border-2 ${allComplete ? 'border-accent shadow-lg shadow-accent/20' : 'border-stone-200'}`}>
        <div className="bg-gradient-to-br from-[#1a4d35] to-[#0f2e20] px-10 py-10 text-white text-center relative">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_50%,white_1px,transparent_1px)] bg-[length:24px_24px]" />
          <div className="relative">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px flex-1 bg-white/20" />
              <div className="h-14 w-14 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                <Award className="h-8 w-8 text-accent" />
              </div>
              <div className="h-px flex-1 bg-white/20" />
            </div>
            <p className="text-xs font-bold text-white/50 uppercase tracking-[0.3em] mb-2">Certificate of Completion</p>
            <h2 className="text-2xl font-serif font-bold text-white mb-1">Tolumo LL.B Learning Platform</h2>
            <p className="text-sm text-white/60 mb-8">Year 2 (200 Level) — Nigerian Law Programme</p>
            {allComplete ? (
              <>
                <p className="text-sm text-white/60 mb-2">This certifies that</p>
                <p className="text-3xl font-serif font-bold text-accent mb-2">{displayName}</p>
                <p className="text-sm text-white/60 mb-6">has successfully completed all 60 topics across 6 Year 2 LL.B modules with a passing grade.</p>
                <div className="flex items-center justify-center gap-3">
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors">
                    <Download className="h-4 w-4" /> Download PDF
                  </button>
                  <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden w-64 mx-auto">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${overallPct}%` }} />
                </div>
                <p className="text-sm text-white/70">{overallPct}% complete — {doneTopics}/{totalTopics} topics done</p>
                <div className="flex items-center justify-center gap-2 text-sm text-white/40">
                  <Lock className="h-4 w-4" /> Complete all topics to unlock your certificate
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Module progress */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="font-serif font-bold text-foreground">Module Completion</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Complete every topic in every module to earn your certificate.</p>
        </div>
        <div className="divide-y divide-stone-100">
          {MODULES.map(m => (
            <div key={m.code} className="px-6 py-4 flex items-center gap-4">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 ${m.pct === 100 ? 'bg-green-100' : 'bg-stone-100'}`}>
                {m.pct === 100 ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-[10px] font-bold text-muted-foreground">{m.code}</span>
                    <p className="font-medium text-sm text-foreground">{m.title}</p>
                  </div>
                  <span className={`text-sm font-bold ${m.pct === 100 ? 'text-green-600' : 'text-primary'}`}>{m.pct}%</span>
                </div>
                <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${m.pct === 100 ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${m.pct}%` }} />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{m.done}/{m.total} topics completed</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {!allComplete && (
        <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 text-center">
          <p className="text-sm text-foreground font-medium mb-1">
            You need <strong>{totalTopics - doneTopics} more topics</strong> to unlock your certificate.
          </p>
          <p className="text-xs text-muted-foreground">At your current pace, you're on track to complete Year 2 within the semester.</p>
        </div>
      )}
    </div>
  );
}
