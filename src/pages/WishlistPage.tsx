import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function WishlistPage() {
  const { wishlist, addToCart, toggleWishlist } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="font-serif text-2xl mb-2">Your jewellery story starts here.</p>
        <p className="text-muted text-sm mb-6">No saved pieces yet.</p>
        <Link to="/jewellery" className="inline-block bg-charcoal text-ivory px-6 py-3 text-xs tracking-widest uppercase">
          Explore Jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-serif text-3xl mb-8">Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map((p) => (
          <div key={p.id} className="relative">
            <ProductCard product={p} />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => { addToCart(p); toggleWishlist(p.id); }}
                className="flex-1 text-[10px] tracking-widest uppercase border border-charcoal py-2 hover:bg-charcoal hover:text-ivory"
              >
                Move to Cart
              </button>
              <button
                type="button"
                onClick={() => toggleWishlist(p.id)}
                className="text-[10px] tracking-widest uppercase text-muted px-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
