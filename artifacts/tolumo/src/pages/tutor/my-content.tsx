import { useState, useEffect } from 'react';
import { CheckCircle2, Upload, Pencil, Plus, X, ChevronDown, Newspaper, Send } from 'lucide-react';

// ── Topic legal updates ───────────────────────────────────────────────────────
const UPDATES_KEY = 'tolumo_topic_legal_updates';
type TopicUpdate = { id: string; topicId: string; text: string; ts: number; author: string };

const SEED_UPDATES: TopicUpdate[] = [
  {
    id: 'u1', topicId: '1',
    author: 'Prof. Oluwaseun Adeyemi',
    text: 'The Constitution of the Federal Republic of Nigeria (Third Alteration) Act 2023 received presidential assent on 12 June 2023. It amends Section 84 regarding the independence of the electoral commission. Students should note this development when answering questions on constitutional supremacy and federal legislative powers.',
    ts: Date.now() - 1000 * 60 * 60 * 18,
  },
  {
    id: 'u2', topicId: '1',
    author: 'Prof. Oluwaseun Adeyemi',
    text: 'The Supreme Court reaffirmed the "covering the field" doctrine in AG Lagos State v Eko Hotels Ltd (SC/CV/433/2021), decided March 2024. The Court held that federal legislation under the Exclusive List ousts any inconsistent state provision, even where the state legislation predates the federal enactment. This reinforces the A.-G. Ogun State principle covered in the Landmark Case section.',
    ts: Date.now() - 1000 * 60 * 60 * 72,
  },
];

function loadUpdates(): TopicUpdate[] {
  try {
    const raw = localStorage.getItem(UPDATES_KEY);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(UPDATES_KEY, JSON.stringify(SEED_UPDATES));
    return SEED_UPDATES;
  } catch { return SEED_UPDATES; }
}
function saveUpdates(u: TopicUpdate[]) {
  localStorage.setItem(UPDATES_KEY, JSON.stringify(u));
}

function fmtTs(ts: number): string {
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ── Types ────────────────────────────────────────────────────────────────────
type ContentItem = { url: string; name: string } | null;

interface Topic {
  id: string;
  title: string;
  video: ContentItem;
  notes: ContentItem;
  slides: ContentItem;
  qa: ContentItem;
  status: 'published' | 'draft';
}

const STORAGE_KEY = 'tolumo_tutor_content';

const DEFAULT_TOPICS: Topic[] = [
  {
    id: '1', title: 'Topic 1: Origins of Federalism',
    video: { url: '#', name: 'origins.mp4' },
    notes: { url: '#', name: 'origins_notes.pdf' },
    slides: { url: '#', name: 'origins_slides.pptx' },
    qa: { url: '#', name: 'Q&A Set' },
    status: 'published',
  },
  {
    id: '2', title: 'Topic 2: Supremacy of Constitution',
    video: { url: '#', name: 'supremacy.mp4' },
    notes: { url: '#', name: 'supremacy_notes.pdf' },
    slides: { url: '#', name: 'supremacy_slides.pptx' },
    qa: { url: '#', name: 'Q&A Set' },
    status: 'published',
  },
  {
    id: '3', title: 'Topic 3: Federalism & Devolution',
    video: { url: '#', name: 'devolution.mp4' },
    notes: { url: '#', name: 'devolution_notes.pdf' },
    slides: null,
    qa: { url: '#', name: 'Q&A Set' },
    status: 'published',
  },
  {
    id: '4', title: 'Topic 4: Separation of Powers',
    video: { url: '#', name: 'separation.mp4' },
    notes: null, slides: null, qa: null,
    status: 'draft',
  },
  {
    id: '5', title: 'Topic 5: Fundamental Rights',
    video: null, notes: null, slides: null, qa: null,
    status: 'draft',
  },
];

function load(): Topic[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_TOPICS;
  } catch { return DEFAULT_TOPICS; }
}
function save(t: Topic[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); }

// ── Post Update Modal ────────────────────────────────────────────────────────
function PostUpdateModal({ topic, onSave, onClose }: { topic: Topic; onSave: (text: string) => void; onClose: () => void }) {
  const [text, setText] = useState('');
  const MAX = 600;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <Newspaper className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">{topic.title}</p>
              <h3 className="font-serif font-bold text-base text-foreground leading-tight">Post a Legal Update</h3>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-muted-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Write a short plain-text note flagging a new case, statute, amendment, or legal development relevant to this topic.
            Students who have already completed this topic will be notified automatically.
          </p>
          <div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value.slice(0, MAX))}
              rows={6}
              placeholder="e.g. The Supreme Court ruled in ABC v XYZ [2024] that… This updates the position covered in this topic's Landmark Case section."
              className="w-full resize-none rounded-xl border border-stone-200 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#1a4d35]/40 transition-colors"
            />
            <p className="text-[11px] text-muted-foreground text-right mt-1">{text.length} / {MAX}</p>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-stone-200 py-2.5 text-sm font-semibold text-foreground hover:bg-stone-50 transition-colors">
              Cancel
            </button>
            <button
              disabled={text.trim().length < 20}
              onClick={() => { onSave(text.trim()); onClose(); }}
              style={{ backgroundColor: 'hsl(153,54%,15%)' }}
              className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Send className="h-3.5 w-3.5" /> Publish Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Upload / Q&A Modal ────────────────────────────────────────────────────────
type ColKey = 'video' | 'notes' | 'slides' | 'qa';

const COL_META: Record<ColKey, { label: string; accept: string; hint: string }> = {
  video:  { label: 'Video',      accept: 'video/*',       hint: 'MP4, MOV, or WebM · max 2 GB' },
  notes:  { label: 'Notes',      accept: '.pdf,.doc,.docx', hint: 'PDF or Word document' },
  slides: { label: 'Slides',     accept: '.pptx,.pdf',    hint: 'PowerPoint or PDF' },
  qa:     { label: 'Q&A Prompts', accept: '.pdf,.csv,.txt', hint: 'Upload a prompt file or type questions below' },
};

interface UploadModalProps {
  topic: Topic;
  col: ColKey;
  onSave: (file: ContentItem) => void;
  onClose: () => void;
}

function UploadModal({ topic, col, onSave, onClose }: UploadModalProps) {
  const meta = COL_META[col];
  const existing = topic[col];
  const [fileName, setFileName] = useState(existing?.name ?? '');
  const [qaText, setQaText] = useState('');
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    setFileName(file.name);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = col === 'qa' && !fileName ? 'Q&A Set' : (fileName || 'Uploaded');
    onSave({ url: '#', name });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <p className="text-xs text-muted-foreground">{topic.title}</p>
            <h3 className="font-serif font-bold text-lg text-foreground">{meta.label}</h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-muted-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragging ? 'border-primary bg-primary/5' : 'border-stone-200 hover:border-primary/50'}`}
          >
            <input
              type="file"
              accept={meta.accept}
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            {fileName ? (
              <p className="text-sm font-semibold text-primary">{fileName}</p>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground mb-1">Click or drag to upload</p>
                <p className="text-xs text-muted-foreground">{meta.hint}</p>
              </>
            )}
          </div>

          {/* Q&A extra text area */}
          {col === 'qa' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Or type Q&A prompts
              </label>
              <textarea
                rows={4}
                value={qaText}
                onChange={e => setQaText(e.target.value)}
                placeholder="Q1: What is the meaning of federalism?&#10;Q2: Explain the exclusive list..."
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm font-semibold text-foreground hover:bg-stone-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              style={{ backgroundColor: 'hsl(153,54%,15%)' }}
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
              {existing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Add / Edit Topic Modal ────────────────────────────────────────────────────
function TopicModal({ topic, onSave, onClose }: {
  topic?: Topic; onSave: (title: string, status: 'published' | 'draft') => void; onClose: () => void;
}) {
  const [title, setTitle] = useState(topic?.title ?? '');
  const [status, setStatus] = useState<'published' | 'draft'>(topic?.status ?? 'draft');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="font-serif font-bold text-lg">{topic ? 'Edit Topic' : 'Add Topic'}</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-stone-100 text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(title, status); onClose(); }} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Topic Title</label>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Topic 6: Customary Law"
              className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Status</label>
            <div className="relative">
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full h-10 px-3 rounded-lg border border-stone-300 text-sm appearance-none outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg border border-stone-300 py-2.5 text-sm font-semibold hover:bg-stone-50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              style={{ backgroundColor: 'hsl(153,54%,15%)' }}
              className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity">
              {topic ? 'Save Changes' : 'Add Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Cell component ────────────────────────────────────────────────────────────
function ContentCell({ value, onUpload, onEdit }: {
  value: ContentItem; onUpload: () => void; onEdit: () => void;
}) {
  if (value) {
    return (
      <div className="space-y-1">
        <button onClick={onEdit} className="flex items-center gap-1.5 text-xs font-semibold text-green-600 hover:text-green-700">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {value.name === 'Q&A Set' ? 'Set' : 'Uploaded'}
        </button>
        <button onClick={onEdit} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary">
          <Pencil className="h-3 w-3" /> Edit
        </button>
      </div>
    );
  }
  return (
    <button onClick={onUpload} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary font-medium underline underline-offset-2">
      <Upload className="h-3 w-3" /> Upload
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function MyContent() {
  const [topics, setTopics] = useState<Topic[]>(load);
  const [updates, setUpdates] = useState<TopicUpdate[]>(loadUpdates);
  const [addOpen, setAddOpen] = useState(false);
  const [editTopic, setEditTopic] = useState<Topic | null>(null);
  const [upload, setUpload] = useState<{ topicId: string; col: ColKey } | null>(null);
  const [postingUpdateFor, setPostingUpdateFor] = useState<Topic | null>(null);

  useEffect(() => { save(topics); }, [topics]);
  useEffect(() => { saveUpdates(updates); }, [updates]);

  function addUpdate(topicId: string, text: string) {
    const u: TopicUpdate = {
      id: `upd-${Date.now()}`,
      topicId,
      text,
      ts: Date.now(),
      author: 'Prof. Oluwaseun Adeyemi',
    };
    setUpdates(prev => [u, ...prev]);
  }

  function addTopic(title: string, status: 'published' | 'draft') {
    const id = Date.now().toString();
    setTopics(t => [...t, { id, title, video: null, notes: null, slides: null, qa: null, status }]);
  }

  function updateTopic(id: string, title: string, status: 'published' | 'draft') {
    setTopics(t => t.map(x => x.id === id ? { ...x, title, status } : x));
  }

  function updateContent(topicId: string, col: ColKey, value: ContentItem) {
    setTopics(t => t.map(x => x.id === topicId ? { ...x, [col]: value } : x));
  }

  function toggleStatus(id: string) {
    setTopics(t => t.map(x => x.id === id ? { ...x, status: x.status === 'published' ? 'draft' : 'published' } : x));
  }

  const COLS: { key: ColKey; label: string }[] = [
    { key: 'video', label: 'VIDEO' },
    { key: 'notes', label: 'NOTES' },
    { key: 'slides', label: 'SLIDES' },
    { key: 'qa', label: 'Q&A PROMPTS' },
  ];

  const uploadingTopic = upload ? topics.find(t => t.id === upload.topicId) : null;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-foreground">My Content</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage videos, notes, slides, and Q&A prompts per topic</p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          style={{ backgroundColor: 'hsl(153,54%,15%)' }}
          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-opacity shrink-0"
        >
          <Plus className="h-4 w-4" /> Add Topic
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100 bg-stone-50/60">
                <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground w-[30%]">Topic</th>
                {COLS.map(c => (
                  <th key={c.key} className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{c.label}</th>
                ))}
                <th className="text-left px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {topics.map(topic => (
                <tr key={topic.id} className="hover:bg-stone-50/50 transition-colors">
                  {/* Topic name */}
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground text-sm">{topic.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <button
                        onClick={() => setEditTopic(topic)}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <span className="text-stone-300">·</span>
                      <button
                        onClick={() => setPostingUpdateFor(topic)}
                        className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                      >
                        <Newspaper className="h-3 w-3" /> Post Update
                        {updates.filter(u => u.topicId === topic.id).length > 0 && (
                          <span className="ml-0.5 text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded-full">
                            {updates.filter(u => u.topicId === topic.id).length}
                          </span>
                        )}
                      </button>
                    </div>
                  </td>

                  {/* Content columns */}
                  {COLS.map(({ key }) => (
                    <td key={key} className="px-4 py-4">
                      <ContentCell
                        value={topic[key]}
                        onUpload={() => setUpload({ topicId: topic.id, col: key })}
                        onEdit={() => setUpload({ topicId: topic.id, col: key })}
                      />
                    </td>
                  ))}

                  {/* Status */}
                  <td className="px-4 py-4">
                    <button
                      onClick={() => toggleStatus(topic.id)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        topic.status === 'published'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                      }`}
                    >
                      {topic.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {topics.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <p className="text-sm">No topics yet. Click <strong>Add Topic</strong> to get started.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {addOpen && (
        <TopicModal onSave={addTopic} onClose={() => setAddOpen(false)} />
      )}
      {editTopic && (
        <TopicModal
          topic={editTopic}
          onSave={(title, status) => updateTopic(editTopic.id, title, status)}
          onClose={() => setEditTopic(null)}
        />
      )}
      {upload && uploadingTopic && (
        <UploadModal
          topic={uploadingTopic}
          col={upload.col}
          onSave={val => updateContent(upload.topicId, upload.col, val)}
          onClose={() => setUpload(null)}
        />
      )}
      {postingUpdateFor && (
        <PostUpdateModal
          topic={postingUpdateFor}
          onSave={text => addUpdate(postingUpdateFor.id, text)}
          onClose={() => setPostingUpdateFor(null)}
        />
      )}
    </div>
  );
}
