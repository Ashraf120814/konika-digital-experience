import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { products } from '../data/products';
import { stories } from '../data/stories';
import { formatPrice } from '../lib/utils';

const popular = ['gold earrings', 'polki', 'mangalsutra', 'temple', 'bridal'];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: Props) {
  const [q, setQ] = useState('');
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('konika_recent_search') || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const results = useMemo(() => {
    if (!q.trim()) return { products: [], stories: [] };
    const term = q.toLowerCase();
    return {
      products: products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term) ||
            p.collection.toLowerCase().includes(term)
        )
        .slice(0, 6),
      stories: stories
        .filter(
          (s) =>
            s.title.toLowerCase().includes(term) ||
            s.category.toLowerCase().includes(term)
        )
        .slice(0, 3),
    };
  }, [q]);

  const commit = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 5);
    setRecent(next);
    localStorage.setItem('konika_recent_search', JSON.stringify(next));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] bg-ivory">
      <div className="mx-auto max-w-2xl px-4 pt-8">
        <div className="flex items-center gap-3 border-b border-charcoal/15 pb-3">
          <Search className="h-5 w-5 text-muted" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && q.trim()) commit(q.trim());
            }}
            placeholder="Search jewellery, collections, stories…"
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted/60"
          />
          <button type="button" onClick={onClose} aria-label="Close search">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!q && (
          <div className="mt-8 space-y-6">
            {recent.length > 0 && (
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted mb-2">Recent</p>
                <div className="flex flex-wrap gap-2">
                  {recent.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setQ(r)}
                      className="text-sm border border-charcoal/10 px-3 py-1.5 hover:border-gold"
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div>
              <p className="text-[10px] tracking-widest uppercase text-muted mb-2">Popular</p>
              <div className="flex flex-wrap gap-2">
                {popular.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setQ(r)}
                    className="text-sm border border-charcoal/10 px-3 py-1.5 hover:border-gold"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {q && (
          <div className="mt-8 space-y-8 max-h-[70vh] overflow-y-auto">
            {results.products.length > 0 && (
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted mb-3">Products</p>
                <ul className="space-y-2">
                  {results.products.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/product/${p.slug}`}
                        onClick={onClose}
                        className="flex justify-between py-2 border-b border-charcoal/5 hover:text-gold-dark"
                      >
                        <span className="font-serif">{p.name}</span>
                        <span className="text-sm text-muted">{formatPrice(p.price)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.stories.length > 0 && (
              <div>
                <p className="text-[10px] tracking-widest uppercase text-muted mb-3">Stories</p>
                <ul className="space-y-2">
                  {results.stories.map((s) => (
                    <li key={s.id}>
                      <Link
                        to={`/stories/${s.slug}`}
                        onClick={onClose}
                        className="block py-2 border-b border-charcoal/5 hover:text-gold-dark font-serif"
                      >
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {results.products.length === 0 && results.stories.length === 0 && (
              <p className="text-muted text-sm">We couldn't find a piece matching your search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
