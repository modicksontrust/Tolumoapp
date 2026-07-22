import React, { useState } from 'react';
import { Award, Calendar, ExternalLink, Search, Filter } from 'lucide-react';

const SCHOLARSHIPS = [
  { id: 1, title: 'Goldcoast Developmental Foundation — Law Scholarship', type: 'Scholarship', amount: '₦500,000', deadline: '31 Aug 2025', org: 'Goldcoast Developmental Foundation', desc: 'Full scholarship for outstanding Nigerian LL.B students demonstrating financial need and academic excellence. Open to 200–400 Level students.', tags: ['200 Level', 'Merit-based', 'Nationwide'], isNew: true },
  { id: 2, title: 'NBA Section on Business Law — Young Lawyers Internship', type: 'Internship', amount: 'Paid · ₦80,000/mo', deadline: '15 Aug 2025', org: 'Nigerian Bar Association', desc: '3-month paid internship at a top commercial law firm in Lagos. Open to 300–400 Level law students with min 3.5 GPA.', tags: ['Lagos', '300–400 Level', 'Commercial Law'], isNew: true },
  { id: 3, title: 'FIDA Nigeria — Women in Law Fellowship', type: 'Fellowship', amount: '₦250,000 stipend', deadline: '20 Sep 2025', org: 'FIDA Nigeria', desc: 'Six-month fellowship for female law students interested in family law, human rights, and gender justice. Includes mentorship with senior female lawyers.', tags: ['Women only', 'Human Rights', 'Family Law'], isNew: true },
  { id: 4, title: 'Stanbic IBTC — Future Lawyers Programme', type: 'Scholarship', amount: '₦1,000,000', deadline: '30 Sep 2025', org: 'Stanbic IBTC Bank', desc: 'Annual scholarship covering tuition and living expenses for second and third year law students. Recipients also receive banking & finance internship placement.', tags: ['200–300 Level', 'Banking Law', 'Merit-based'], isNew: true },
  { id: 5, title: 'Young African Leaders Initiative (YALI) — Law & Governance Track', type: 'Fellowship', amount: 'Fully funded (USA)', deadline: '1 Oct 2025', org: 'US Embassy / YALI', desc: 'Prestigious 4-week leadership programme in the United States. Open to outstanding Nigerian students under 35 with interest in law, governance, or civil society.', tags: ['International', 'Under 35', 'Leadership'], isNew: true },
  { id: 6, title: 'Nigerian Law School — Moot Competition Prize', type: 'Competition', amount: '₦150,000 prize', deadline: '10 Aug 2025', org: 'Council of Legal Education', desc: 'Annual national moot court competition for undergraduate law students. Top 3 teams receive cash prizes plus fast-track recommendation for Bar finals.', tags: ['Nationwide', 'Moot', 'All Levels'], isNew: false },
  { id: 7, title: 'British Council — IELTS Law Scholarship', type: 'Scholarship', amount: 'Full UK tuition', deadline: '15 Nov 2025', org: 'British Council Nigeria', desc: 'Full scholarship for LLM study at a UK university. Open to students with a minimum Second Class Upper LL.B and relevant work experience.', tags: ['UK', 'LLM', 'Second Class Upper'], isNew: false },
  { id: 8, title: 'HURIWA — Human Rights Law Internship', type: 'Internship', amount: 'Unpaid · Certificate', deadline: 'Rolling', org: 'HURIWA', desc: '3-month virtual internship at Nigeria\'s foremost human rights NGO. Gain practical experience in public interest litigation and advocacy.', tags: ['Human Rights', 'Virtual', 'All Levels'], isNew: false },
];

const TYPES = ['All', 'Scholarship', 'Internship', 'Fellowship', 'Competition'];
const TYPE_COLORS: Record<string, string> = {
  Scholarship: 'bg-blue-100 text-blue-700',
  Internship: 'bg-green-100 text-green-700',
  Fellowship: 'bg-purple-100 text-purple-700',
  Competition: 'bg-amber-100 text-amber-700',
};

export default function Scholarships() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = SCHOLARSHIPS.filter(s =>
    (filter === 'All' || s.type === filter) &&
    (search === '' || s.title.toLowerCase().includes(search.toLowerCase()) || s.org.toLowerCase().includes(search.toLowerCase()))
  );

  const newCount = SCHOLARSHIPS.filter(s => s.isNew).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl font-serif font-bold text-foreground">Scholarships & Opportunities</h1>
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">{newCount} new</span>
          </div>
          <p className="text-muted-foreground text-sm">Curated for Nigerian law students · Updated weekly · Powered by <span className="text-amber-600 font-medium">Goldcoast Developmental Foundation</span></p>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search opportunities..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-stone-200 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40" />
        </div>
        <div className="flex gap-1 bg-white border border-stone-200 rounded-xl p-1">
          {TYPES.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === t ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {filtered.map(s => (
          <div key={s.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${TYPE_COLORS[s.type] || 'bg-stone-100 text-stone-600'}`}>{s.type}</span>
                {s.isNew && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold uppercase">New</span>}
              </div>
              <span className="text-sm font-bold text-primary shrink-0">{s.amount}</span>
            </div>

            <h3 className="font-semibold text-foreground mb-1 leading-snug">{s.title}</h3>
            <p className="text-xs text-muted-foreground mb-3">{s.org}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-4 flex-1">{s.desc}</p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {s.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 text-[10px] font-medium">{tag}</span>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-stone-100 pt-4">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Deadline: <strong className="text-foreground">{s.deadline}</strong>
              </span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
                Apply <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 bg-white rounded-xl border border-stone-200 p-12 text-center">
            <Award className="h-10 w-10 text-stone-300 mx-auto mb-3" />
            <p className="text-muted-foreground">No opportunities match your search.</p>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">Tolumo does not endorse or guarantee any of these opportunities. Always verify details directly with the awarding organization.</p>
    </div>
  );
}
