import React from 'react';
import { Target } from 'lucide-react';

const MODULES = [
  { code: 'LAW 201', title: 'Constitutional Law',  done: 3,  total: 12 },
  { code: 'LAW 202', title: 'Law of Contract',     done: 0,  total: 10 },
  { code: 'LAW 203', title: 'Criminal Law I',      done: 0,  total: 11 },
  { code: 'LAW 204', title: 'Law of Torts',        done: 0,  total: 9  },
  { code: 'LAW 205', title: 'Jurisprudence',       done: 0,  total: 8  },
  { code: 'LAW 206', title: 'Land Law I',          done: 0,  total: 10 },
];

export default function MyCertificate() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-foreground">My Certificate</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Awarded upon completing all NUC-approved modules in your selected academic year
        </p>
      </div>

      {/* Requirements card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Card header */}
        <div className="flex items-start gap-4 px-6 py-5 border-b border-stone-100">
          <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
            <Target className="h-4.5 w-4.5 text-amber-600" style={{ height: '1.125rem', width: '1.125rem' }} />
          </div>
          <div>
            <p className="font-bold text-foreground">Certificate Requirements — Year 2</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Complete ALL topics in ALL modules below to unlock your certificate
            </p>
          </div>
        </div>

        {/* Module rows */}
        <div className="divide-y divide-stone-100">
          {MODULES.map(m => {
            const pct = m.total > 0 ? Math.round((m.done / m.total) * 100) : 0;
            const complete = pct === 100;
            return (
              <div key={m.code} className="px-6 py-4 flex items-start gap-4">
                {/* Radio circle */}
                <div className={`mt-0.5 h-5 w-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors
                  ${complete ? 'border-[#1a4d35] bg-[#1a4d35]' : 'border-stone-300 bg-white'}`}>
                  {complete && <div className="h-2 w-2 rounded-full bg-white" />}
                </div>

                {/* Text + bar */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div>
                      <p className="font-semibold text-sm text-foreground leading-tight">{m.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.code} · {m.done}/{m.total} topics completed</p>
                    </div>
                    <span className={`text-sm font-bold shrink-0 ${complete ? 'text-[#1a4d35]' : pct > 0 ? 'text-[#1a4d35]' : 'text-muted-foreground'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1a4d35] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Amber callout */}
        <div className="mx-6 mb-6 mt-2 rounded-xl bg-amber-50 border border-amber-100 px-5 py-4 flex items-start gap-3">
          <span className="text-amber-500 shrink-0 mt-0.5 text-base">ⓘ</span>
          <p className="text-sm text-foreground leading-relaxed">
            <span className="font-semibold">Remember:</span> For each module, you must complete every topic by watching videos,
            reviewing notes, completing the AI Q&amp;A, and passing all tests before moving to the next topic.
          </p>
        </div>
      </div>
    </div>
  );
}
