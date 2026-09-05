import { useState } from 'react';
import { Link } from 'react-router-dom';
import { loadKnowledge, saveKnowledge } from '../../saru/knowledge';
import type { KnowledgeItem } from '../../types/saru';

const types: KnowledgeItem['type'][] = [
  'faq',
  'policy',
  'shipping',
  'returns',
  'store',
  'offer',
  'care',
  'custom',
];

export function SaruKnowledgePage() {
  const [items, setItems] = useState<KnowledgeItem[]>(() => loadKnowledge());
  const [editing, setEditing] = useState<KnowledgeItem | null>(null);
  const [msg, setMsg] = useState('');

  const persist = (next: KnowledgeItem[]) => {
    setItems(next);
    saveKnowledge(next);
    setMsg('Knowledge base updated — Saru will use this immediately.');
  };

  const blank = (): KnowledgeItem => ({
    id: `kb-${Date.now()}`,
    type: 'faq',
    title: '',
    content: '',
    tags: [],
    updatedAt: new Date().toISOString(),
    active: true,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gold-dark">Saru AI · Admin</p>
          <h1 className="font-serif text-3xl">Knowledge Management</h1>
        </div>
        <div className="flex gap-2 text-xs">
          <Link to="/admin/saru" className="border border-charcoal/15 px-3 py-2 hover:border-gold">
            Reports
          </Link>
          <button
            type="button"
            onClick={() => setEditing(blank())}
            className="bg-charcoal text-ivory px-3 py-2 tracking-widest uppercase hover:bg-gold-dark"
          >
            Add entry
          </button>
        </div>
      </div>
      {msg && <p className="text-xs text-emerald-800 mb-4">{msg}</p>}
      <p className="text-sm text-muted mb-6 max-w-2xl">
        Update FAQs, policies, shipping, returns, offers, and store information without code changes.
        Product prices always come from the live catalogue — do not invent prices here.
      </p>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border p-4 ${item.active ? 'border-charcoal/10' : 'border-charcoal/5 opacity-60'}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="text-[9px] tracking-widest uppercase text-gold-dark">{item.type}</span>
                <h3 className="font-serif text-lg">{item.title}</h3>
                <p className="text-sm text-muted line-clamp-2 mt-1">{item.content}</p>
                <p className="text-[10px] text-muted mt-2">
                  Tags: {item.tags.join(', ') || '—'} · Updated {new Date(item.updatedAt).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <button type="button" onClick={() => setEditing({ ...item })} className="underline">
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    persist(
                      items.map((i) =>
                        i.id === item.id ? { ...i, active: !i.active, updatedAt: new Date().toISOString() } : i
                      )
                    )
                  }
                  className="underline"
                >
                  {item.active ? 'Disable' : 'Enable'}
                </button>
                <button
                  type="button"
                  onClick={() => persist(items.filter((i) => i.id !== item.id))}
                  className="underline text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4">
          <form
            className="bg-ivory w-full max-w-lg p-6 rounded-lg shadow-xl space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const next = items.some((i) => i.id === editing.id)
                ? items.map((i) => (i.id === editing.id ? { ...editing, updatedAt: new Date().toISOString() } : i))
                : [...items, { ...editing, updatedAt: new Date().toISOString() }];
              persist(next);
              setEditing(null);
            }}
          >
            <h3 className="font-serif text-xl mb-2">{items.some((i) => i.id === editing.id) ? 'Edit' : 'Add'} knowledge</h3>
            <select
              value={editing.type}
              onChange={(e) => setEditing({ ...editing, type: e.target.value as KnowledgeItem['type'] })}
              className="w-full border border-charcoal/15 px-3 py-2 text-sm"
            >
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              required
              placeholder="Title"
              value={editing.title}
              onChange={(e) => setEditing({ ...editing, title: e.target.value })}
              className="w-full border border-charcoal/15 px-3 py-2 text-sm"
            />
            <textarea
              required
              rows={5}
              placeholder="Content — only verified information"
              value={editing.content}
              onChange={(e) => setEditing({ ...editing, content: e.target.value })}
              className="w-full border border-charcoal/15 px-3 py-2 text-sm"
            />
            <input
              placeholder="Tags (comma separated)"
              value={editing.tags.join(', ')}
              onChange={(e) =>
                setEditing({
                  ...editing,
                  tags: e.target.value
                    .split(',')
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              className="w-full border border-charcoal/15 px-3 py-2 text-sm"
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.active}
                onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
              />
              Active
            </label>
            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => setEditing(null)} className="px-4 py-2 text-xs tracking-widest uppercase">
                Cancel
              </button>
              <button type="submit" className="bg-charcoal text-ivory px-4 py-2 text-xs tracking-widest uppercase">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
