import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Heart, MessageCircle, Calendar } from 'lucide-react';
import { getProductBySlug, products, formatPrice } from '../data/products';
import { useStore } from '../context/StoreContext';
import { cn } from '../lib/utils';
import { imagesForProduct, imgSrc } from '../data/images';
import { ProductCard } from '../components/ProductCard';


function ProductGallery({ productId, category, name }: { productId: string; category: string; name: string }) {
  const [primary, secondary] = imagesForProduct(productId, category);
  const shots = [primary, secondary, primary, secondary];
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-sm bg-ivory-deep">
        <img
          src={imgSrc(shots[active], 1400)}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {shots.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'aspect-square overflow-hidden rounded-sm border-2',
              active === i ? 'border-gold' : 'border-transparent'
            )}
          >
            <img src={imgSrc(src, 300)} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export function ProductPage() {
  const { id } = useParams();
  const product = getProductBySlug(id || '') || products.find((p) => p.id === id);
  const { addToCart, toggleWishlist, isInWishlist, addRecentlyViewed } = useStore();
  const [pin, setPin] = useState('');
  const [pinMsg, setPinMsg] = useState('');

  useEffect(() => {
    if (product) addRecentlyViewed(product.id);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="font-serif text-2xl mb-4">Product not found</p>
        <Link to="/jewellery" className="text-xs tracking-widest uppercase text-gold-dark">
          Browse jewellery
        </Link>
      </div>
    );
  }

  const similar = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  const complete = products.filter((p) => p.collection === product.collection && p.id !== product.id).slice(0, 4);
  const wished = isInWishlist(product.id);
  const gst = Math.round(product.price * 0.03);
  const gold = product.goldValue ?? Math.round(product.price * 0.65);
  const making = product.makingCharges ?? Math.round(product.price * 0.2);
  const stone = product.stoneValue ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 pb-24 md:pb-8">
      <nav className="text-xs text-muted mb-6">
        <Link to="/" className="hover:text-gold-dark">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/jewellery" className="hover:text-gold-dark">Jewellery</Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10">
        <ProductGallery productId={product.id} category={product.category} name={product.name} />
        <div>
          <p className="text-[11px] tracking-widest uppercase text-gold-dark mb-2">
            {product.collection} · {product.category}
          </p>
          <h1 className="font-serif text-3xl md:text-4xl mb-2">{product.name}</h1>
          <p className="text-sm text-muted mb-1">★ {product.rating} · {product.reviews} reviews</p>
          <p className="text-2xl text-gold-dark font-medium mb-4">{formatPrice(product.price)}</p>
          <p className="text-sm text-muted mb-6 leading-relaxed">{product.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm mb-6">
            <div><span className="text-muted">Metal</span><p>{product.metal}</p></div>
            <div><span className="text-muted">Purity</span><p>{product.purity}</p></div>
            <div><span className="text-muted">Weight</span><p>{product.weight}</p></div>
            <div><span className="text-muted">Code</span><p>{product.productCode}</p></div>
          </div>
          <div className="flex flex-wrap gap-3 mb-6">
            <button type="button" onClick={() => addToCart(product)} className="flex-1 min-w-[140px] bg-charcoal text-ivory py-3.5 text-xs tracking-widest uppercase hover:bg-gold-dark">Add to Cart</button>
            <button type="button" onClick={() => addToCart(product)} className="flex-1 min-w-[140px] border border-charcoal text-charcoal py-3.5 text-xs tracking-widest uppercase hover:bg-charcoal hover:text-ivory">Buy Now</button>
            <button type="button" onClick={() => toggleWishlist(product.id)} className="p-3.5 border border-charcoal/15 hover:border-gold" aria-label="Wishlist">
              <Heart className={cn('h-5 w-5', wished && 'fill-gold text-gold')} />
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted mb-8">
            <button type="button" className="flex items-center gap-1.5 hover:text-gold-dark"><MessageCircle className="h-4 w-4" /> WhatsApp Enquiry</button>
            <Link to="/jewellery-finder" className="flex items-center gap-1.5 hover:text-gold-dark"><Calendar className="h-4 w-4" /> Book Consultation</Link>
          </div>
          <div className="border border-charcoal/10 p-4 mb-8">
            <p className="text-[10px] tracking-widest uppercase text-muted mb-3">Price breakdown (demo)</p>
            <ul className="space-y-1.5 text-sm">
              <li className="flex justify-between"><span>Gold value</span><span>{formatPrice(gold)}</span></li>
              <li className="flex justify-between"><span>Making charges</span><span>{formatPrice(making)}</span></li>
              {stone > 0 && <li className="flex justify-between"><span>Stone value</span><span>{formatPrice(stone)}</span></li>}
              <li className="flex justify-between"><span>GST (illustrative)</span><span>{formatPrice(gst)}</span></li>
              <li className="flex justify-between font-medium border-t border-charcoal/10 pt-2 mt-2"><span>Total</span><span>{formatPrice(product.price)}</span></li>
            </ul>
            <p className="text-[10px] text-muted mt-2">Illustrative breakdown for concept demo only.</p>
          </div>
          {product.story && (
            <div className="mb-8">
              <h2 className="font-serif text-xl mb-2">The Story Behind the Piece</h2>
              <p className="text-sm text-muted leading-relaxed">{product.story}</p>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN code" className="border border-charcoal/15 px-3 py-2 text-sm w-28" />
            <button type="button" onClick={() => setPinMsg(pin.length >= 6 ? 'Demo: delivery available in 5–7 days.' : 'Enter a valid 6-digit PIN (demo).')} className="text-xs tracking-widest uppercase border border-charcoal px-4 py-2 hover:bg-charcoal hover:text-ivory">Check</button>
          </div>
          {pinMsg && <p className="text-xs text-muted mt-2">{pinMsg}</p>}
        </div>
      </div>

      {complete.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl mb-6">Complete the Look</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{complete.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}
      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{similar.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        </section>
      )}

      <div className="md:hidden fixed bottom-0 inset-x-0 bg-ivory border-t border-charcoal/10 p-3 flex items-center gap-3 z-40">
        <p className="text-sm font-medium text-gold-dark">{formatPrice(product.price)}</p>
        <button type="button" onClick={() => addToCart(product)} className="flex-1 bg-charcoal text-ivory py-3 text-xs tracking-widest uppercase">Add to Cart</button>
        <button type="button" onClick={() => addToCart(product)} className="flex-1 border border-charcoal py-3 text-xs tracking-widest uppercase">Buy Now</button>
      </div>
    </div>
  );
}
