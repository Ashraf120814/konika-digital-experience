import { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { formatPrice } from '../../lib/utils';

const formats = [
  'Instagram Caption',
  'Instagram Carousel',
  'Reel Script',
  'Facebook Ad',
  'Google Ad',
  'WhatsApp Message',
  'Email',
  'Product Description',
];

export function ContentStudioPage() {
  const [productId, setProductId] = useState(products[16]?.id || products[0].id);
  const [format, setFormat] = useState('Instagram Caption');
  const product = products.find((p) => p.id === productId) || products[0];

  const caption = `Made for moments that matter.\n\n${product.name} — ${product.metal} ${product.purity}, crafted with care.\n\n${product.description.slice(0, 120)}…\n\nExplore now. #KonikaConcept #${product.collection}`;

  const reel = `Scene 1: Jewellery close-up\nText: "Made for moments that matter."\n\nScene 2: Model wearing jewellery\n\nScene 3: Craftsmanship close-up\n\nScene 4: Product + CTA\nCTA: Explore Now`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gold-dark">Internal · Demo</p>
          <h1 className="font-serif text-3xl">Konika Content Studio</h1>
        </div>
        <Link to="/admin/analytics" className="text-xs border border-charcoal/15 px-3 py-2 hover:border-gold">Analytics</Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 text-[10px] tracking-widest uppercase">
        {['Products', 'Social Content', 'Ad Creatives', 'Campaigns', 'Calendar'].map((t, i) => (
          <span key={t} className={`px-3 py-1.5 border ${i === 0 ? 'border-gold bg-gold/10' : 'border-charcoal/10 text-muted'}`}>{t}</span>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="text-[10px] tracking-widest uppercase text-muted block mb-2">Select product</label>
          <select value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full border border-charcoal/15 px-3 py-2 text-sm mb-4">
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <div className="border border-charcoal/10 p-4 mb-4">
            <p className="font-serif text-lg">{product.name}</p>
            <p className="text-sm text-gold-dark">{formatPrice(product.price)}</p>
            <p className="text-xs text-muted mt-1">{product.collection} · {product.metal} {product.purity}</p>
            <p className="text-xs text-muted mt-2">{product.description}</p>
          </div>
          <label className="text-[10px] tracking-widest uppercase text-muted block mb-2">Content format</label>
          <div className="flex flex-wrap gap-2">
            {formats.map((f) => (
              <button key={f} type="button" onClick={() => setFormat(f)} className={`text-[10px] px-2.5 py-1.5 border ${format === f ? 'border-gold bg-gold/10' : 'border-charcoal/10'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-serif text-xl mb-3">Generated · {format}</h2>
          <pre className="bg-ivory-deep p-4 text-sm whitespace-pre-wrap border border-charcoal/8 min-h-[160px]">
            {format === 'Reel Script' ? reel : caption}
          </pre>

          <div className="mt-6 border border-charcoal/10 p-4">
            <p className="text-[10px] tracking-widest uppercase text-muted mb-3">Meta-style ad preview</p>
            <div className="bg-white border border-charcoal/10 max-w-sm">
              <div className="p-3 flex items-center gap-2 border-b border-charcoal/5">
                <div className="w-8 h-8 rounded-full bg-gold/30" />
                <span className="text-xs font-medium">Konika Jewellery</span>
              </div>
              <div className="aspect-square bg-gradient-to-br from-beige to-ivory-deep flex items-center justify-center">
                <span className="font-serif text-3xl text-gold/30">◆</span>
              </div>
              <div className="p-3">
                <p className="text-xs mb-1">{caption.slice(0, 80)}…</p>
                <p className="text-sm font-medium">{product.name}</p>
                <button type="button" className="mt-2 w-full bg-[#1877F2] text-white text-xs py-2 rounded">Shop Now</button>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[10px] tracking-widest uppercase text-muted mb-3">Content repurposing</p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              {['1 Product', '1 Product Page', '1 Instagram Post', '2 Reels', '3 Stories', '1 Facebook Ad', '1 WhatsApp', '1 Email'].map((s, i) => (
                <span key={s} className="flex items-center gap-2">
                  <span className="border border-charcoal/15 px-2 py-1">{s}</span>
                  {i < 7 && <span>→</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
