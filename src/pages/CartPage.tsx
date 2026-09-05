import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../lib/utils';

export function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotal, toggleWishlist } = useStore();
  const gst = Math.round(cartTotal * 0.03);

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="font-serif text-2xl mb-2">Your jewellery story starts here.</p>
        <p className="text-muted text-sm mb-6">Your cart is empty.</p>
        <Link to="/jewellery" className="inline-block bg-charcoal text-ivory px-6 py-3 text-xs tracking-widest uppercase">
          Explore Jewellery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <h1 className="font-serif text-3xl mb-8">Cart</h1>
      <div className="grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-4">
          {cart.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 border-b border-charcoal/8 pb-4">
              <div className="w-24 h-24 bg-ivory-deep flex items-center justify-center shrink-0">
                <span className="text-gold/40 font-serif text-xl">◆</span>
              </div>
              <div className="flex-1">
                <Link to={`/product/${product.slug}`} className="font-serif text-lg hover:text-gold-dark">
                  {product.name}
                </Link>
                <p className="text-sm text-muted">{product.metal} · {product.purity}</p>
                <p className="text-gold-dark text-sm mt-1">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button type="button" onClick={() => updateQty(product.id, quantity - 1)} className="w-8 h-8 border border-charcoal/15">−</button>
                  <span className="text-sm w-6 text-center">{quantity}</span>
                  <button type="button" onClick={() => updateQty(product.id, quantity + 1)} className="w-8 h-8 border border-charcoal/15">+</button>
                  <button type="button" onClick={() => { toggleWishlist(product.id); removeFromCart(product.id); }} className="text-xs text-muted ml-2 hover:text-gold-dark">Wishlist</button>
                  <button type="button" onClick={() => removeFromCart(product.id)} className="text-xs text-muted hover:text-charcoal">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="border border-charcoal/10 p-6 h-fit">
          <h2 className="font-serif text-xl mb-4">Summary</h2>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(cartTotal)}</span></div>
            <div className="flex justify-between"><span>GST (demo)</span><span>{formatPrice(gst)}</span></div>
            <div className="flex justify-between font-medium border-t border-charcoal/10 pt-2 mt-2">
              <span>Total</span><span>{formatPrice(cartTotal + gst)}</span>
            </div>
          </div>
          <button type="button" className="w-full bg-charcoal text-ivory py-3.5 text-xs tracking-widest uppercase hover:bg-gold-dark">
            Proceed to Checkout
          </button>
          <p className="text-[10px] text-muted mt-3 text-center">Demo checkout — no payment processed.</p>
        </div>
      </div>
    </div>
  );
}
