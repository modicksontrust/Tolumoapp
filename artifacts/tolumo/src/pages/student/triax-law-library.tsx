import React, { useState, useEffect, useRef } from 'react';
import {
  X, Search, Home, BookOpen, BookMarked, FileText, PenLine,
  ChevronRight, ChevronDown, Bookmark, BookmarkCheck, Share2,
  TrendingUp, Scale, Zap, Star,
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────

const CASES = [
  {
    id: 1,
    title: "A.-G. Ogun State v A.-G. Federation",
    citation: "(1982) 3 NCLR 166",
    court: "Supreme Court of Nigeria",
    year: 1982,
    tags: ["Constitutional Law", "Federalism"],
    appellant: "Attorney-General, Ogun State",
    respondent: "Attorney-General, Federation",
    coram: "Fatayi-Williams CJN · Idigbe JSC · Bello JSC · Obaseki JSC · Aniagolu JSC",
    facts: "The plaintiff challenged the validity of the Land Use Decree 1978 enacted by the Federal Military Government on the ground that it encroached upon matters within the residual legislative competence of state governments.",
    decision: "The Supreme Court upheld the Land Use Decree, holding that land matters could be placed on the exclusive or concurrent legislative list by constitutional amendment. The court also confirmed the 'covering the field' doctrine in Nigeria — where federal and state legislation conflict on concurrent matters, federal law prevails to the extent of inconsistency.",
    ratiodecidendi: "Where the National Assembly has legislated comprehensively on a subject on the concurrent list, state legislation on the same subject is void to the extent of its inconsistency with the federal legislation. The doctrine of covering the field applies as a constitutional principle in Nigeria's federal structure.",
    legislation: ["Constitution of the Federal Republic of Nigeria 1979", "Land Use Decree 1978"],
    topicTags: ["#federalism", "#legislative powers", "#covering the field", "#concurrent list", "#land use"],
    relatedCases: [
      { id: 3, title: "Tukur v Government of Gongola State", citation: "(1989) 4 NWLR (Pt 117) 517" },
      { id: 4, title: "General Sani Abacha v Gani Fawehinmi", citation: "(2000) 6 NWLR (Pt 660) 228" },
    ],
  },
  {
    id: 2,
    title: "Rotimi Amaechi v INEC & Ors",
    citation: "(2008) 5 NWLR (Pt 1080) 227",
    court: "Supreme Court of Nigeria",
    year: 2008,
    tags: ["Electoral Law", "Constitutional Law"],
    appellant: "Rt. Hon. Rotimi Amaechi",
    respondent: "INEC & Ors",
    coram: "Oguntade JSC · Onnoghen JSC · Tobi JSC · Chukwuma-Eneh JSC · Chuku JSC",
    facts: "The appellant was substituted as governorship candidate by his political party without justifiable cause. He challenged the substitution in court.",
    decision: "The Supreme Court held that the substitution of a validly nominated candidate without reasonable cause violates the provisions of the Electoral Act and the Constitution.",
    ratiodecidendi: "A political party cannot substitute a duly sponsored candidate without reasonable cause, and where a candidate wins an election, the victory belongs to him personally and not the party.",
    legislation: ["Electoral Act 2006", "Constitution of the Federal Republic of Nigeria 1999"],
    topicTags: ["#electoral law", "#substitution", "#political parties", "#governorship"],
    relatedCases: [
      { id: 5, title: "Muhammadu Buhari v INEC", citation: "(2008) 19 NWLR (Pt 1120) 246" },
    ],
  },
  {
    id: 3,
    title: "Tukur v Government of Gongola State",
    citation: "(1989) 4 NWLR (Pt 117) 517",
    court: "Supreme Court of Nigeria",
    year: 1989,
    tags: ["Constitutional Law", "Fundamental Rights"],
    appellant: "Alhaji Muhammadu Tukur",
    respondent: "Government of Gongola State",
    coram: "Karibi-Whyte JSC · Oputa JSC · Nnaemeka-Agu JSC",
    facts: "The appellant's chieftaincy title was deposed by the Government. He challenged the action on grounds of breach of his fundamental rights.",
    decision: "The court held that fundamental rights enforcement procedure cannot be used where the real complaint is a breach of statutory right rather than fundamental right.",
    ratiodecidendi: "Fundamental rights enforcement is not available to vindicate breaches of rights that are not constitutionally guaranteed. Jurisdiction must be determined by the substance of the claim.",
    legislation: ["Constitution of the Federal Republic of Nigeria 1979"],
    topicTags: ["#fundamental rights", "#chieftaincy", "#jurisdiction"],
    relatedCases: [{ id: 1, title: "A.-G. Ogun State v A.-G. Federation", citation: "(1982) 3 NCLR 166" }],
  },
  {
    id: 4,
    title: "General Sani Abacha v Gani Fawehinmi",
    citation: "(2000) 6 NWLR (Pt 660) 228",
    court: "Supreme Court of Nigeria",
    year: 2000,
    tags: ["Constitutional Law", "International Law", "Human Rights"],
    appellant: "General Sani Abacha",
    respondent: "Chief Gani Fawehinmi",
    coram: "Ogwuegbu JSC · Uwais CJN · Achike JSC · Iguh JSC · Kutigi JSC",
    facts: "Fawehinmi challenged his detention under Decree No. 2 of 1984 as a violation of his fundamental rights under the African Charter on Human and Peoples' Rights.",
    decision: "The Supreme Court held that the African Charter on Human and Peoples' Rights (Ratification and Enforcement) Act has the force of law in Nigeria and is superior to other domestic statutes but subordinate to the Constitution.",
    ratiodecidendi: "An international treaty ratified and domesticated by Nigeria forms part of domestic law. Where there is conflict between such a treaty and other domestic statutes, the treaty prevails unless the Constitution itself is in conflict.",
    legislation: ["African Charter on Human and Peoples' Rights (Ratification and Enforcement) Act", "Decree No. 2 of 1984"],
    topicTags: ["#international law", "#human rights", "#treaty", "#detention"],
    relatedCases: [{ id: 1, title: "A.-G. Ogun State v A.-G. Federation", citation: "(1982) 3 NCLR 166" }],
  },
  {
    id: 5,
    title: "Muhammadu Buhari v INEC",
    citation: "(2008) 19 NWLR (Pt 1120) 246",
    court: "Supreme Court of Nigeria",
    year: 2008,
    tags: ["Electoral Law"],
    appellant: "Gen. Muhammadu Buhari",
    respondent: "Independent National Electoral Commission",
    coram: "Oguntade JSC · Onnoghen JSC · Tobi JSC",
    facts: "The appellant challenged the declaration of the 2007 presidential election results, alleging widespread malpractice.",
    decision: "The petition was dismissed. The court found insufficient evidence to nullify the entire election.",
    ratiodecidendi: "An election will not be set aside on grounds of malpractice unless the petitioner proves that the malpractice substantially affected the outcome of the election.",
    legislation: ["Electoral Act 2006"],
    topicTags: ["#presidential election", "#electoral malpractice", "#burden of proof"],
    relatedCases: [{ id: 2, title: "Rotimi Amaechi v INEC & Ors", citation: "(2008) 5 NWLR (Pt 1080) 227" }],
  },
  {
    id: 6,
    title: "Savanah Bank of Nigeria Ltd v Ajilo",
    citation: "(1989) 1 NWLR (Pt 97) 305",
    court: "Supreme Court of Nigeria",
    year: 1989,
    tags: ["Commercial Law", "Contract", "Banking"],
    appellant: "Savanah Bank of Nigeria Ltd",
    respondent: "Mrs Ajilo",
    coram: "Bello CJN · Karibi-Whyte JSC · Oputa JSC",
    facts: "The bank mortgaged property without obtaining the required consent of the Governor under the Land Use Act. The mortgagee sought to enforce the mortgage.",
    decision: "The Supreme Court held that a mortgage created without the Governor's consent under the Land Use Act is void and unenforceable.",
    ratiodecidendi: "Any transaction involving land held under a statutory right of occupancy requires the Governor's consent. Failure to obtain this consent renders the alienation void ab initio.",
    legislation: ["Land Use Act 1978"],
    topicTags: ["#mortgage", "#land use act", "#governor's consent", "#void transaction"],
    relatedCases: [],
  },
  {
    id: 7,
    title: "Eke v Ogbonkwo",
    citation: "(2006) 18 NWLR (Pt 1012) 506",
    court: "Supreme Court of Nigeria",
    year: 2006,
    tags: ["Land Law", "Customary Law"],
    appellant: "Emmanuel Eke",
    respondent: "Francis Ogbonkwo",
    coram: "Ogwuegbu JSC · Onnoghen JSC · Musdapher JSC",
    facts: "The parties disputed ownership of farmland. The plaintiff claimed title through a customary land grant.",
    decision: "Title was established through evidence of long possession and farming under customary law.",
    ratiodecidendi: "Customary grants of land can be proved by evidence of long, open, and uncontested possession and user.",
    legislation: ["Evidence Act 2011"],
    topicTags: ["#customary law", "#land title", "#possession"],
    relatedCases: [],
  },
  {
    id: 8,
    title: "Odogwu v Odogwu",
    citation: "(1992) 2 NWLR (Pt 225) 539",
    court: "Supreme Court of Nigeria",
    year: 1992,
    tags: ["Family Law", "Customary Law", "Succession"],
    appellant: "A. Odogwu",
    respondent: "B. Odogwu",
    coram: "Belgore JSC · Olatawura JSC · Kutigi JSC",
    facts: "The parties disputed inheritance under Nnewi customary law following the death of the patriarch.",
    decision: "The court upheld the customary law of primogeniture as applicable in Nnewi and awarded the family home to the eldest son.",
    ratiodecidendi: "Courts must apply applicable customary law where proven, provided it is not repugnant to natural justice, equity, and good conscience.",
    legislation: ["Marriage Act"],
    topicTags: ["#succession", "#primogeniture", "#customary law", "#family law"],
    relatedCases: [],
  },
  {
    id: 9,
    title: "Ladoja v INEC",
    citation: "(2007) 12 NWLR (Pt 1047) 119",
    court: "Supreme Court of Nigeria",
    year: 2007,
    tags: ["Electoral Law", "Constitutional Law"],
    appellant: "Senator Rashidi Ladoja",
    respondent: "INEC",
    coram: "Oguntade JSC · Onnoghen JSC",
    facts: "The appellant was impeached as Governor of Oyo State. He challenged the legality of the impeachment process.",
    decision: "The Supreme Court upheld the impeachment, finding that the procedure was substantially complied with.",
    ratiodecidendi: "Where an impeachment procedure substantially complies with constitutional requirements, it will be upheld even if minor procedural irregularities exist.",
    legislation: ["Constitution of the Federal Republic of Nigeria 1999"],
    topicTags: ["#impeachment", "#governor", "#constitutional procedure"],
    relatedCases: [{ id: 5, title: "Muhammadu Buhari v INEC", citation: "(2008) 19 NWLR (Pt 1120) 246" }],
  },
];

const LEGISLATION = [
  { id: 'cfrn', code: "CFRN 1999", name: "Constitution of the Federal Republic of Nigeria 1999", desc: "The supreme law of Nigeria. Establishes the three arms of government, the federal structure, fundamental rights (Chapter IV), citizenship, and all other foundational constitutional arrangements." },
  { id: 'ea', code: "EA 2011", name: "Evidence Act 2011", desc: "Governs the rules of evidence in all federal courts and the FCT. The 2011 revision significantly updated the law to accommodate electronic evidence and computer-generated documents." },
  { id: 'cama', code: "CAMA 2020", name: "Companies and Allied Matters Act 2020", desc: "Repealed CAMA 1990. Introduced single-member private companies, limited liability partnerships, electronic filing, statutory derivative action, and strengthened minority shareholder rights." },
  { id: 'acja', code: "ACJA 2015", name: "Administration of Criminal Justice Act 2015", desc: "Applies in the FCT and to federal offences. Modernises criminal procedure — abolishes holding charges, provides for plea bargaining, victim impact assessments, and pre-trial settlements." },
  { id: 'lua', code: "LUA 1978", name: "Land Use Decree 1978 (Land Use Act)", desc: "Vests all land in each state in the Governor. Landholders obtain a right of occupancy, and alienation requires Gubernatorial consent. Applies throughout Nigeria by virtue of the Constitution." },
];

const LATEST_JUDGEMENTS = [
  {
    id: 'j1',
    title: "Okeke v Federal Republic of Nigeria — Digital Evidence Admissibility",
    badge: "Landmark",
    court: "Supreme Court of Nigeria",
    date: "11 April 2025",
    ref: "SC/508/2024",
    summary: "The court upheld the admissibility of WhatsApp conversation logs as documentary evidence under s. 84 of the Evidence Act 2011, provided a proper certificate of authenticity accompanies the printout.",
    tags: ["Evidence", "Criminal Law", "Technology"],
  },
  {
    id: 'j2',
    title: "Adeyemi & Anor v CAC — Single-Member Company Validity",
    badge: "Notable",
    court: "Court of Appeal",
    date: "3 March 2025",
    ref: "CA/L/250/2024",
    summary: "The Court of Appeal affirmed that a single-member private company incorporated under CAMA 2020 is a distinct legal entity from its sole member, and the sole member cannot be personally liable for the company's debts in the absence of fraud.",
    tags: ["Company Law", "CAMA 2020"],
  },
  {
    id: 'j3',
    title: "Yakubu v Attorney-General, Kaduna State — Customary Divorce",
    badge: "Notable",
    court: "Federal High Court",
    date: "14 February 2025",
    ref: "FHC/KD/112/2024",
    summary: "The Federal High Court held that a customary law divorce that excludes the wife from any share in the matrimonial home violates section 42 of the Constitution and Articles 18 and 19 of the African Charter.",
    tags: ["Family Law", "Customary Law", "Human Rights"],
  },
  {
    id: 'j4',
    title: "Shell Petroleum v Gbemre Community — Environmental Remediation",
    badge: "Landmark",
    court: "Federal High Court",
    date: "22 January 2025",
    ref: "FHC/WA/55/2023",
    summary: "Court ordered Shell to remediate 3,200 hectares of contaminated land within 24 months and awarded community damages of ₦12 billion, applying the polluter-pays principle under the National Environmental Standards Act.",
    tags: ["Environmental Law", "Oil and Gas"],
  },
  {
    id: 'j5',
    title: "Eze v First Bank — Banker-Customer Duty of Care",
    badge: "Notable",
    court: "Court of Appeal",
    date: "5 May 2025",
    ref: "CA/PH/178/2024",
    summary: "The court extended the banker's duty of care to include reasonable steps to prevent social-engineering fraud where the bank has actual knowledge of suspicious account activity.",
    tags: ["Banking Law", "Torts", "Contract"],
  },
  {
    id: 'j6',
    title: "Dangote Industries v PENCOM — Pension Liability Scope",
    badge: "Landmark",
    court: "National Industrial Court",
    date: "17 June 2025",
    ref: "NICN/ABJ/12/2024",
    summary: "The NICN ruled that the Pension Reform Act 2014 applies to all employees regardless of contract type, including independent contractors who work exclusively for a single employer for more than 12 months.",
    tags: ["Labour Law", "Pensions"],
  },
];

const INIT_SAVED = new Set([1, 4]);

// ── Sub-components ────────────────────────────────────────────────────────────

function CaseRow({ c, onOpen, saved, onToggleSave }: {
  c: typeof CASES[0]; onOpen: () => void; saved: boolean; onToggleSave: () => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100 last:border-b-0 hover:bg-stone-50 group">
      <button onClick={onOpen} className="flex-1 min-w-0 text-left">
        <p className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">{c.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{c.citation} · {c.court}</p>
        <div className="flex flex-wrap gap-1 mt-1.5">
          {c.tags.map(t => <span key={t} className="px-1.5 py-0.5 rounded bg-stone-100 text-[10px] text-muted-foreground font-medium">{t}</span>)}
        </div>
      </button>
      <button onClick={onToggleSave} className="shrink-0 p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
        {saved
          ? <BookmarkCheck className="h-4 w-4 text-amber-500 fill-amber-500" />
          : <Bookmark className="h-4 w-4 text-stone-400" />}
      </button>
    </div>
  );
}

function CaseDetail({ c, onBack, saved, onToggleSave }: {
  c: typeof CASES[0]; onBack: () => void; saved: boolean; onToggleSave: () => void;
}) {
  const [ratioOpen, setRatioOpen] = useState(false);
  return (
    <div className="h-full overflow-y-auto">
      {/* breadcrumb */}
      <div className="flex items-center gap-1.5 px-5 py-3 border-b border-stone-100 text-xs text-muted-foreground">
        <span className="hover:text-foreground cursor-pointer" onClick={onBack}>Home</span>
        <span>›</span>
        <span className="text-foreground font-medium truncate">{c.title}</span>
      </div>

      <div className="px-5 py-4 space-y-5">
        {/* header */}
        <div>
          <div className="flex items-start justify-between gap-3 mb-2">
            <button onClick={onBack} className="mt-0.5 shrink-0 p-1 rounded hover:bg-stone-100 transition-colors">
              <ChevronRight className="h-4 w-4 text-muted-foreground rotate-180" />
            </button>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={onToggleSave} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                {saved
                  ? <BookmarkCheck className="h-4 w-4 text-amber-500 fill-amber-500" />
                  : <Bookmark className="h-4 w-4 text-stone-400" />}
              </button>
              <button className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                <Share2 className="h-4 w-4 text-stone-400" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] font-semibold text-foreground uppercase tracking-wide">Case</span>
            {c.tags.map(t => <span key={t} className="px-2 py-0.5 rounded bg-stone-100 text-[10px] font-medium text-muted-foreground">{t}</span>)}
          </div>
          <h2 className="text-lg font-serif font-bold text-foreground leading-snug">{c.title}</h2>
          <p className="text-xs text-muted-foreground mt-1">{c.citation} · {c.court} · {c.year}</p>
        </div>

        {/* parties */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Appellant</p>
            <p className="text-sm font-semibold text-foreground">{c.appellant}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Respondent</p>
            <p className="text-sm font-semibold text-foreground">{c.respondent}</p>
          </div>
        </div>

        {/* coram */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Coram</p>
          <p className="text-xs text-foreground">{c.coram}</p>
        </div>

        {/* facts */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Facts &amp; Background</p>
          <p className="text-sm text-foreground leading-relaxed">{c.facts}</p>
        </div>

        {/* decision box */}
        <div className="rounded-xl border border-stone-200 p-4 bg-stone-50">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Decision / Holding</p>
          <p className="text-sm text-foreground leading-relaxed">{c.decision}</p>
        </div>

        {/* ratio decidendi collapsible */}
        <div className="rounded-xl border border-stone-200 overflow-hidden">
          <button
            onClick={() => setRatioOpen(v => !v)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-stone-50 transition-colors"
          >
            <span className="text-[11px] font-bold text-foreground uppercase tracking-widest">Ratio Decidendi</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${ratioOpen ? 'rotate-180' : ''}`} />
          </button>
          {ratioOpen && (
            <div className="px-4 pb-4 pt-1 bg-white border-t border-stone-100">
              <p className="text-sm text-foreground leading-relaxed">{c.ratiodecidendi}</p>
            </div>
          )}
        </div>

        {/* legislation cited */}
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Legislation Cited</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {c.legislation.map(l => (
              <span key={l} className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-200 text-xs text-foreground font-medium">
                <FileText className="h-3 w-3 text-muted-foreground" /> {l}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {c.topicTags.map(t => (
              <span key={t} className="text-xs text-muted-foreground hover:text-foreground cursor-pointer">{t}</span>
            ))}
          </div>
        </div>

        {/* AI Case Analysis */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-stone-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">AI Case Analysis</p>
              <p className="text-xs text-muted-foreground">Upgrade to Premium Annual for AI-powered analysis of this case.</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wide">Premium</span>
        </div>

        {/* Research Notes */}
        <div className="rounded-xl border border-stone-200 bg-white overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <div className="flex items-center gap-1.5">
              <PenLine className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] font-bold text-foreground uppercase tracking-widest">My Research Notes</span>
            </div>
            <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
              <PenLine className="h-3 w-3" /> Add note
            </button>
          </div>
          <div className="px-4 py-4">
            <p className="text-xs text-muted-foreground">No notes yet. Click "Add note" to write research notes for this case.</p>
          </div>
        </div>

        {/* Related Cases */}
        {c.relatedCases.length > 0 && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Related Cases</p>
            <div className="rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
              {c.relatedCases.map(r => (
                <div key={r.id} className="flex items-center justify-between px-4 py-3 hover:bg-stone-50 cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                      <Scale className="h-3.5 w-3.5 text-stone-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.citation}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type NavTab = 'home' | 'browse' | 'judgements' | 'saved' | 'notes';
type BrowseFilter = 'all' | 'cases' | 'legislation' | 'rules' | 'journals' | 'textbooks';

interface Props {
  open: boolean;
  onClose: () => void;
  initialTab?: NavTab;
}

export default function TriaxLawLibrary({ open, onClose, initialTab = 'home' }: Props) {
  const [tab, setTab] = useState<NavTab>(initialTab);
  const [browseFilter, setBrowseFilter] = useState<BrowseFilter>('all');
  const [savedIds, setSavedIds] = useState<Set<number>>(INIT_SAVED);
  const [openCase, setOpenCase] = useState<typeof CASES[0] | null>(null);
  const [query, setQuery] = useState('');
  const overlayRef = useRef<HTMLDivElement>(null);

  // Sync initial tab when prop changes
  useEffect(() => { if (open) { setTab(initialTab); setOpenCase(null); } }, [open, initialTab]);

  // Close on Escape
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);

  const toggleSave = (id: number) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const savedCases = CASES.filter(c => savedIds.has(c.id));

  if (!open) return null;

  const navItems: { key: NavTab; icon: React.ElementType; label: string; badge?: number }[] = [
    { key: 'home', icon: Home, label: 'Home' },
    { key: 'browse', icon: Search, label: 'Browse' },
    { key: 'judgements', icon: TrendingUp, label: 'Latest Judgements' },
    { key: 'saved', icon: BookMarked, label: 'Saved Cases', badge: savedIds.size },
    { key: 'notes', icon: PenLine, label: 'My Research Notes' },
  ];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-stretch justify-end bg-black/40"
      onClick={e => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Panel */}
      <div className="w-full max-w-[560px] flex flex-col h-full bg-white shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">

        {/* Dark green header */}
        <div className="bg-[#1a4d35] flex items-center gap-3 px-4 py-3 shrink-0">
          <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
            <Scale className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Triax Law Library</span>
              <span className="px-2 py-0.5 rounded-full bg-green-500/25 text-green-300 text-[9px] font-bold uppercase tracking-wider">✦ Premium Licensed</span>
            </div>
            <p className="text-[10px] text-white/55">Powered by Triax Solicitors</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/15 transition-colors text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search bar */}
        <div className="border-b border-stone-200 px-4 py-3 shrink-0">
          <div className="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search cases, legislation, journals, textbooks..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>
        </div>

        {/* Body: sidebar + content */}
        <div className="flex flex-1 min-h-0">

          {/* Left sidebar */}
          <div className="w-[170px] shrink-0 bg-[#fafaf9] border-r border-stone-200 flex flex-col overflow-y-auto">
            <nav className="flex-1 py-2 space-y-0.5 px-2">
              {navItems.map(item => (
                <button
                  key={item.key}
                  onClick={() => { setTab(item.key); setOpenCase(null); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                    tab === item.key && !openCase
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="text-xs flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-stone-200 text-stone-600 text-[9px] font-bold flex items-center justify-center">{item.badge}</span>
                  )}
                </button>
              ))}
            </nav>

            {/* Plan */}
            <div className="px-3 pb-4">
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Plan</p>
              <div className="bg-stone-100 rounded-lg px-3 py-2.5">
                <p className="text-xs font-bold text-foreground">Monthly</p>
                <p className="text-[10px] text-muted-foreground">₦3,500 · per month</p>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">Upgrade to Annual for offline save.</p>
            </div>
          </div>

          {/* Right content */}
          <div className="flex-1 min-w-0 overflow-y-auto bg-[#fdf9f4]">
            {openCase ? (
              <CaseDetail
                c={openCase}
                onBack={() => setOpenCase(null)}
                saved={savedIds.has(openCase.id)}
                onToggleSave={() => toggleSave(openCase.id)}
              />
            ) : tab === 'home' ? (
              <HomePanel
                savedCases={savedCases}
                onOpenCase={setOpenCase}
                savedIds={savedIds}
                onToggleSave={toggleSave}
                onTabChange={setTab}
              />
            ) : tab === 'browse' ? (
              <BrowsePanel
                filter={browseFilter}
                setFilter={setBrowseFilter}
                onOpenCase={setOpenCase}
                savedIds={savedIds}
                onToggleSave={toggleSave}
              />
            ) : tab === 'judgements' ? (
              <JudgementsPanel />
            ) : tab === 'saved' ? (
              <SavedPanel
                savedCases={savedCases}
                onOpenCase={setOpenCase}
                onToggleSave={toggleSave}
              />
            ) : (
              <NotesPanel />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Home Panel ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'Constitutional Law', count: 284, icon: '⚖️' },
  { label: 'Criminal Law', count: 391, icon: '🔒' },
  { label: 'Land Law', count: 178, icon: '🏘️' },
  { label: 'Electoral Law', count: 142, icon: '🗳️' },
  { label: 'Company Law', count: 203, icon: '🏢' },
  { label: 'Family Law', count: 119, icon: '👨‍👩‍👧' },
];

const STATS = [
  { value: '1,840', label: 'Cases', icon: Scale },
  { value: '312', label: 'Statutes', icon: FileText },
  { value: '95', label: 'Journals', icon: BookOpen },
  { value: '180', label: 'Textbooks', icon: BookMarked },
];

function HomePanel({ savedCases, onOpenCase, savedIds, onToggleSave, onTabChange }: {
  savedCases: typeof CASES;
  onOpenCase: (c: typeof CASES[0]) => void;
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
  onTabChange: (t: NavTab) => void;
}) {
  return (
    <div className="p-4 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {STATS.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-3 flex flex-col items-center gap-1">
            <s.icon className="h-4 w-4 text-amber-500" />
            <p className="text-lg font-bold font-serif text-foreground">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Browse by Category */}
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Browse by Category</p>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map(c => (
            <button key={c.label} onClick={() => onTabChange('browse')}
              className="flex items-center gap-2.5 bg-white rounded-xl border border-stone-200 px-3 py-2.5 hover:border-primary/30 hover:bg-stone-50 transition-colors text-left">
              <span className="text-base">{c.icon}</span>
              <div>
                <p className="text-xs font-semibold text-foreground">{c.label}</p>
                <p className="text-[10px] text-muted-foreground">{c.count} items</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Recent Searches</p>
        <div className="flex flex-wrap gap-2">
          {['Federalism', 'Electoral law', 'Land Use Act'].map(s => (
            <span key={s} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-200 bg-white text-xs text-foreground hover:border-primary/30 cursor-pointer hover:bg-stone-50 transition-colors">
              <Search className="h-3 w-3 text-muted-foreground" /> {s}
            </span>
          ))}
        </div>
      </div>

      {/* Saved Cases */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Saved Cases</p>
          <button onClick={() => onTabChange('saved')} className="text-[10px] text-primary font-medium hover:underline">View all</button>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
          {savedCases.slice(0, 3).map(c => (
            <button key={c.id} onClick={() => onOpenCase(c)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors text-left group">
              <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Bookmark className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.citation}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Latest Judgements */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Latest Judgements</p>
          <button onClick={() => onTabChange('judgements')} className="text-[10px] text-primary font-medium hover:underline">See all</button>
        </div>
        <div className="space-y-2">
          {LATEST_JUDGEMENTS.slice(0, 3).map(j => (
            <div key={j.id} className="bg-white rounded-xl border border-stone-200 p-3 hover:border-primary/30 hover:bg-stone-50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-foreground leading-tight">{j.title}</p>
                <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${j.badge === 'Landmark' ? 'bg-amber-100 text-amber-700' : 'bg-violet-100 text-violet-700'}`}>{j.badge}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mb-1">{j.court} · {j.date}</p>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{j.summary}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Browse Panel ──────────────────────────────────────────────────────────────

const BROWSE_FILTERS: { key: BrowseFilter; label: string; count: number }[] = [
  { key: 'all', label: 'All', count: 29 },
  { key: 'cases', label: 'Cases', count: 9 },
  { key: 'legislation', label: 'Legislation', count: 5 },
  { key: 'rules', label: 'Rules', count: 4 },
  { key: 'journals', label: 'Journals', count: 5 },
  { key: 'textbooks', label: 'Textbooks', count: 6 },
];

function BrowsePanel({ filter, setFilter, onOpenCase, savedIds, onToggleSave }: {
  filter: BrowseFilter;
  setFilter: (f: BrowseFilter) => void;
  onOpenCase: (c: typeof CASES[0]) => void;
  savedIds: Set<number>;
  onToggleSave: (id: number) => void;
}) {
  const showCases = filter === 'all' || filter === 'cases';
  const showLegislation = filter === 'all' || filter === 'legislation';

  return (
    <div>
      {/* filter tabs */}
      <div className="sticky top-0 bg-[#fdf9f4] border-b border-stone-200 px-4 py-3 z-10">
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {BROWSE_FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === f.key ? 'bg-primary text-white' : 'bg-white border border-stone-200 text-foreground hover:border-primary/30'
              }`}
            >
              {f.label} <span className={`text-[10px] ${filter === f.key ? 'text-white/80' : 'text-muted-foreground'}`}>({f.count})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Cases */}
        {showCases && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Cases</p>
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
              {CASES.map(c => (
                <CaseRow key={c.id} c={c} onOpen={() => onOpenCase(c)} saved={savedIds.has(c.id)} onToggleSave={() => onToggleSave(c.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Legislation */}
        {showLegislation && (
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">Legislation</p>
            <div className="space-y-2">
              {LEGISLATION.map(l => (
                <div key={l.id} className="bg-white rounded-xl border border-stone-200 p-4 hover:border-primary/30 hover:bg-stone-50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-sm font-bold text-foreground">{l.code}</span>
                    <span className="px-2 py-0.5 rounded bg-stone-100 text-[10px] font-medium text-muted-foreground">Legislation</span>
                  </div>
                  <p className="text-xs font-semibold text-foreground mb-1">{l.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{l.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Latest Judgements Panel ───────────────────────────────────────────────────

function JudgementsPanel() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-4 w-4 text-primary" />
        <p className="text-[11px] font-bold text-foreground uppercase tracking-widest">Latest Judgements — 2025</p>
      </div>
      <div className="space-y-3">
        {LATEST_JUDGEMENTS.map(j => (
          <div key={j.id} className="bg-white rounded-xl border border-stone-200 p-4 hover:border-primary/30 hover:bg-stone-50 transition-colors cursor-pointer">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-sm font-semibold text-foreground leading-snug">{j.title}</p>
              <span className={`shrink-0 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${j.badge === 'Landmark' ? 'bg-amber-100 text-amber-700' : 'bg-violet-100 text-violet-700'}`}>{j.badge}</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">{j.court} · {j.date} · <span className="font-mono">{j.ref}</span></p>
            <p className="text-xs text-foreground leading-relaxed mb-2">{j.summary}</p>
            <div className="flex flex-wrap gap-1.5">
              {j.tags.map(t => <span key={t} className="px-2 py-0.5 rounded bg-stone-100 text-[10px] text-muted-foreground font-medium">{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Saved Cases Panel ─────────────────────────────────────────────────────────

function SavedPanel({ savedCases, onOpenCase, onToggleSave }: {
  savedCases: typeof CASES;
  onOpenCase: (c: typeof CASES[0]) => void;
  onToggleSave: (id: number) => void;
}) {
  return (
    <div className="p-4">
      {/* breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <span>Home</span>
        <span>›</span>
        <span className="text-foreground font-medium">Saved Cases</span>
      </div>

      <p className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-3">{savedCases.length} Saved Cases</p>

      {savedCases.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="h-10 w-10 text-stone-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-muted-foreground">No saved cases yet</p>
          <p className="text-xs text-muted-foreground mt-1">Bookmark cases from Browse to save them here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100 overflow-hidden">
          {savedCases.map(c => (
            <div key={c.id} className="flex items-center gap-3 px-4 py-3 hover:bg-stone-50 group">
              <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <Bookmark className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              </div>
              <button onClick={() => onOpenCase(c)} className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{c.title}</p>
                <p className="text-xs text-muted-foreground">{c.citation} · {c.court}</p>
              </button>
              <button onClick={() => onToggleSave(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                <X className="h-4 w-4 text-stone-400 hover:text-red-500" />
              </button>
              <button onClick={() => onOpenCase(c)} className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
                <ChevronRight className="h-4 w-4 text-stone-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── My Research Notes Panel ───────────────────────────────────────────────────

function NotesPanel() {
  return (
    <div className="p-4">
      {/* breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
        <span>Home</span>
        <span>›</span>
        <span className="text-foreground font-medium">My Research Notes</span>
      </div>

      <p className="text-[11px] font-bold text-foreground uppercase tracking-widest mb-6">0 Research Notes</p>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="h-14 w-14 rounded-full bg-stone-100 flex items-center justify-center mb-4">
          <PenLine className="h-7 w-7 text-stone-400" />
        </div>
        <p className="text-sm font-semibold text-foreground mb-1">No research notes yet</p>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[200px]">
          Open a case and click "Add note" to start.
        </p>
      </div>
    </div>
  );
}
