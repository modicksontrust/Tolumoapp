import { useState } from 'react';
import { Search, ChevronRight, Play, Clock, Users, Star, BookOpen, Zap, Globe, Briefcase, Brain, Scale, Filter } from 'lucide-react';

/* ── Types ── */
interface Skill {
  id: number;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  enrolled: number;
  rating: number;
  img: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

/* ── Data ── */
const CATEGORIES = [
  { label: 'All Skills', value: 'all', icon: BookOpen },
  { label: 'Communication', value: 'communication', icon: Globe },
  { label: 'Digital Skills', value: 'digital', icon: Zap },
  { label: 'Legal Research & Tech', value: 'legal-tech', icon: Scale },
  { label: 'Entrepreneurship', value: 'entrepreneurship', icon: Briefcase },
  { label: 'Emotional Intelligence', value: 'emotional', icon: Brain },
];

const SKILLS: Skill[] = [
  {
    id: 1,
    title: 'Advanced Legal Drafting & Document Precision',
    category: 'communication',
    level: 'Advanced',
    duration: '4h 20m',
    enrolled: 2140,
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=800&auto=format&fit=crop',
    description: "Master the craft of precise legal language — from pleadings and affidavits to agreements and briefs. Ideal for lecturers who want to sharpen their students' written advocacy.",
    tags: ['Drafting', 'Contracts', 'Pleadings'],
    featured: true,
  },
  {
    id: 2,
    title: 'Negotiation & Dispute Resolution for Legal Professionals',
    category: 'communication',
    level: 'Intermediate',
    duration: '3h 10m',
    enrolled: 1830,
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop',
    description: 'Practical negotiation frameworks adapted for Nigerian legal practice — ADR, mediation, arbitration, and client-facing communication skills.',
    tags: ['Negotiation', 'ADR', 'Mediation'],
    featured: true,
  },
  {
    id: 3,
    title: 'Public Speaking & Moot Court Confidence',
    category: 'communication',
    level: 'Beginner',
    duration: '2h 45m',
    enrolled: 3210,
    rating: 4.7,
    img: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
    description: 'Build compelling oral advocacy skills. Techniques for structured argument, controlling courtroom nerves, and persuading a bench — drawn from seasoned Nigerian litigators.',
    tags: ['Mooting', 'Advocacy', 'Public Speaking'],
  },
  {
    id: 4,
    title: 'Legal Technology & AI Tools for Lawyers',
    category: 'digital',
    level: 'Intermediate',
    duration: '3h 50m',
    enrolled: 1590,
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=800&auto=format&fit=crop',
    description: 'Navigate AI-assisted legal research, document review automation, and digital court filing. Equip your students to practise law in a technology-forward environment.',
    tags: ['AI', 'LegalTech', 'Automation'],
    featured: true,
  },
  {
    id: 5,
    title: 'Digital Productivity for Legal Academics',
    category: 'digital',
    level: 'Beginner',
    duration: '1h 55m',
    enrolled: 2780,
    rating: 4.6,
    img: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
    description: 'Zotero for citations, Notion for research organisation, and collaboration tools built for academic law. Designed for lecturers who want to modernise their workflow.',
    tags: ['Productivity', 'Research Tools', 'Organisation'],
  },
  {
    id: 6,
    title: 'Online Teaching & Pedagogy for Law Lecturers',
    category: 'digital',
    level: 'Intermediate',
    duration: '2h 30m',
    enrolled: 1120,
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
    description: 'Design engaging online law modules — recording tips, quiz design, live session facilitation, and student engagement analytics. Built specifically for Tolumor lecturers.',
    tags: ['E-learning', 'Pedagogy', 'Module Design'],
  },
  {
    id: 7,
    title: 'Advanced Legal Research with Nigerian Databases',
    category: 'legal-tech',
    level: 'Advanced',
    duration: '4h 05m',
    enrolled: 980,
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=800&auto=format&fit=crop',
    description: 'Deep-dive into LawPavilion, NJLR, NigeriaCases.com, and advanced Boolean search techniques for legislation, case law, and academic commentary in Nigerian jurisprudence.',
    tags: ['Legal Research', 'LawPavilion', 'Databases'],
    featured: true,
  },
  {
    id: 8,
    title: 'Academic Publishing & Research Dissemination',
    category: 'legal-tech',
    level: 'Intermediate',
    duration: '3h 15m',
    enrolled: 760,
    rating: 4.7,
    img: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=800&auto=format&fit=crop',
    description: 'Navigate peer-reviewed journals, conference submissions, and open-access publishing for Nigerian and international law academia. Includes citation management and impact metrics.',
    tags: ['Publishing', 'Research', 'Academia'],
  },
  {
    id: 9,
    title: 'Law Firm Management & Legal Entrepreneurship',
    category: 'entrepreneurship',
    level: 'Advanced',
    duration: '5h 10m',
    enrolled: 1340,
    rating: 4.8,
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
    description: 'From setting up a firm to managing client relationships and billing — practical legal entrepreneurship grounded in Nigerian regulatory and business realities.',
    tags: ['Law Firm', 'Entrepreneurship', 'Management'],
  },
  {
    id: 10,
    title: 'Grant Writing & Research Funding for Academics',
    category: 'entrepreneurship',
    level: 'Intermediate',
    duration: '2h 50m',
    enrolled: 640,
    rating: 4.6,
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop',
    description: 'Write compelling grant proposals for TETFund, British Academy, Carnegie, and international research bodies. Covers budgeting, impact statements, and compliance reporting.',
    tags: ['Grant Writing', 'Funding', 'Research'],
  },
  {
    id: 11,
    title: 'Emotional Intelligence in Legal Practice & Teaching',
    category: 'emotional',
    level: 'Intermediate',
    duration: '3h 00m',
    enrolled: 2050,
    rating: 4.9,
    img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=800&auto=format&fit=crop',
    description: 'Develop self-awareness, empathy, and regulation strategies essential for effective teaching, client relationships, and collegial collaboration in high-pressure legal environments.',
    tags: ['EQ', 'Leadership', 'Wellbeing'],
    featured: true,
  },
  {
    id: 12,
    title: 'Conflict Resolution & Difficult Conversations',
    category: 'emotional',
    level: 'Beginner',
    duration: '2h 20m',
    enrolled: 1670,
    rating: 4.7,
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=800&auto=format&fit=crop',
    description: 'Navigate student grievances, faculty disputes, and professional disagreements with clarity and composure. Frameworks grounded in both legal ethics and organisational psychology.',
    tags: ['Conflict', 'Communication', 'Wellbeing'],
  },
];

const LEVEL_COLORS: Record<string, string> = {
  Beginner: 'bg-green-100 text-green-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Advanced: 'bg-red-100 text-red-700',
};

/* ── Component ── */
export default function TutorSkillsHub() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const filtered = SKILLS.filter(s => {
    const matchCat = activeCategory === 'all' || s.category === activeCategory;
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchLevel = levelFilter === 'all' || s.level === levelFilter;
    return matchCat && matchSearch && matchLevel;
  });

  const featured = SKILLS.filter(s => s.featured);

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-1">Your Development</p>
        <h1 className="font-serif text-3xl font-bold text-primary">Skills Hub</h1>
        <p className="text-muted-foreground text-sm mt-1">Practical training to sharpen your teaching, research, and professional practice.</p>
      </div>

      {/* Featured strip */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Featured This Month</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.slice(0, 3).map(skill => (
            <button
              key={skill.id}
              onClick={() => setSelectedSkill(skill)}
              className="relative rounded-2xl overflow-hidden h-36 group text-left"
            >
              <img src={skill.img} alt={skill.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-0.5">{skill.category.replace('-', ' ')}</p>
                <p className="text-sm font-bold text-white leading-snug line-clamp-2">{skill.title}</p>
              </div>
              <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="h-3 w-3 text-white fill-white" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search skills, topics…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="all">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === value
                ? 'bg-primary text-white border-primary'
                : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-primary'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Skills grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-muted-foreground text-sm">No skills match your search.</div>
        )}
        {filtered.map(skill => (
          <button
            key={skill.id}
            onClick={() => setSelectedSkill(skill)}
            className="bg-white rounded-2xl border border-border overflow-hidden text-left hover:shadow-md hover:-translate-y-0.5 transition-all group"
          >
            <div className="relative h-40 overflow-hidden">
              <img src={skill.img} alt={skill.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${LEVEL_COLORS[skill.level]}`}>
                {skill.level}
              </span>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{skill.category.replace('-', ' ')}</p>
              <p className="font-semibold text-sm text-foreground leading-snug mb-2 line-clamp-2">{skill.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{skill.description}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{skill.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{skill.enrolled.toLocaleString()}</span>
                <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{skill.rating}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedSkill(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="relative h-52 overflow-hidden">
              <img src={selectedSkill.img} alt={selectedSkill.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <button onClick={() => setSelectedSkill(null)} className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full p-1.5 text-white hover:bg-white/30">✕</button>
              <span className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${LEVEL_COLORS[selectedSkill.level]}`}>
                {selectedSkill.level}
              </span>
            </div>
            <div className="p-6">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">{selectedSkill.category.replace('-', ' ')}</p>
              <h2 className="font-serif text-xl font-bold text-primary mb-3">{selectedSkill.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{selectedSkill.description}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-5">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{selectedSkill.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{selectedSkill.enrolled.toLocaleString()} enrolled</span>
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{selectedSkill.rating} rating</span>
              </div>
              <div className="flex gap-2 flex-wrap mb-5">
                {selectedSkill.tags.map(tag => (
                  <span key={tag} className="text-xs bg-accent/10 text-accent font-medium px-2.5 py-1 rounded-full">{tag}</span>
                ))}
              </div>
              <button className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
                <Play className="h-4 w-4 fill-white" /> Start Learning
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
