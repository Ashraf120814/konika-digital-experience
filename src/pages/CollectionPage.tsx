import { useMemo, useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import type { SortOption } from '../types';
import { formatPrice } from '../lib/utils';

interface Props {
  title?: string;
  filterCollection?: string;
  bestsellers?: boolean;
  newest?: boolean;
}

export function CollectionPage({ title, filterCollection, bestsellers, newest }: Props) {
  const { collection } = useParams();
  const [params] = useSearchParams();
  const [sort, setSort] = useState<SortOption>('featured');
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categoryParam = params.get('category');
  const occasionParam = params.get('occasion');

  const colName = filterCollection || (collection
    ? collection.charAt(0).toUpperCase() + collection.slice(1)
    : undefined);

  const pageTitle =
    title ||
    (colName ? `${colName} Collection` : 'Jewellery');

  const filtered = useMemo(() => {
    let list = [...products];
    if (bestsellers) list = list.filter((p) => p.isBestseller);
    if (newest) list = list.filter((p) => p.isNew);
    if (colName && !title) {
      const c = colName.toLowerCase();
      list = list.filter(
        (p) =>
          p.collection.toLowerCase() === c ||
          p.category.toLowerCase() === c ||
          p.category.toLowerCase() === c + 's'
      );
    }
    if (filterCollection) {
      list = list.filter((p) => p.collection === filterCollection);
    }
    if (categoryParam) list = list.filter((p) => p.category === categoryParam);
    if (occasionParam) {
      list = list.filter((p) =>
        p.occasion.some((o) => o.toLowerCase() === occasionParam.toLowerCase())
      );
    }
    if (priceMax) list = list.filter((p) => p.price <= priceMax);

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'bestselling':
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
        break;
      default:
        break;
    }
    return list;
  }, [colName, title, filterCollection, bestsellers, newest, categoryParam, occasionParam, priceMax, sort]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <nav className="text-xs text-muted mb-4">
        <Link to="/" className="hover:text-gold-dark">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{pageTitle}</span>
      </nav>
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl mb-2">{pageTitle}</h1>
        <p className="text-muted text-sm max-w-xl">
          Curated pieces from the demo catalogue. Filters and sort work on mock data.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sticky top-16 z-30 bg-ivory/95 py-3 border-b border-charcoal/5">
        <button
          type="button"
          onClick={() => setShowFilters((s) => !s)}
          className="text-xs tracking-widest uppercase border border-charcoal/20 px-4 py-2 hover:border-gold"
        >
          Filters
        </button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="text-xs border border-charcoal/15 bg-white px-3 py-2"
        >
          <option value="featured">Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="bestselling">Bestselling</option>
        </select>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 border border-charcoal/10 bg-white flex flex-wrap gap-3">
          {[10000, 25000, 50000, 100000, 200000].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriceMax(priceMax === p ? null : p)}
              className={`text-xs px-3 py-1.5 border ${
                priceMax === p ? 'border-gold bg-gold/10' : 'border-charcoal/15'
              }`}
            >
              Under {formatPrice(p)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPriceMax(null)}
            className="text-xs text-muted underline"
          >
            Reset
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-serif text-xl mb-2">We couldn't find a piece matching your selection.</p>
          <button
            type="button"
            onClick={() => setPriceMax(null)}
            className="text-xs tracking-widest uppercase text-gold-dark"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
