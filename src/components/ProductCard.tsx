import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import type { Product } from '../types';
import { formatPrice, cn } from '../lib/utils';
import { useStore } from '../context/StoreContext';
import { imagesForProduct, imgSrc } from '../data/images';

interface ProductCardProps {
  product: Product;
  onQuickView?: (p: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const wished = isInWishlist(product.id);
  const [primary, secondary] = imagesForProduct(product.id, product.category);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-sm bg-ivory-deep">
        <Link to={`/product/${product.slug}`} className="absolute inset-0 block">
          <img
            src={imgSrc(primary, 800)}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <img
            src={imgSrc(secondary, 800)}
            alt=""
            loading="lazy"
            decoding="async"
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </Link>
        {(product.isNew || product.isBestseller) && (
          <span className="absolute top-3 left-3 z-10 bg-charcoal text-ivory text-[9px] tracking-widest uppercase px-2 py-1">
            {product.isNew ? 'New' : 'Bestseller'}
          </span>
        )}
        <button
          type="button"
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 z-10 p-2 bg-ivory/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={cn('h-4 w-4', wished && 'fill-gold text-gold')} />
        </button>
        <div className="absolute bottom-0 inset-x-0 z-10 p-3 flex gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="flex-1 bg-ivory/95 text-charcoal text-[10px] tracking-widest uppercase py-2.5 flex items-center justify-center gap-1.5 hover:bg-white"
            >
              <Eye className="h-3.5 w-3.5" /> Quick View
            </button>
          )}
          <button
            type="button"
            onClick={() => addToCart(product)}
            className="flex-1 bg-charcoal text-ivory text-[10px] tracking-widest uppercase py-2.5 flex items-center justify-center gap-1.5 hover:bg-gold-dark"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Add
          </button>
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-0.5">
        <Link
          to={`/product/${product.slug}`}
          className="font-serif text-base text-charcoal hover:text-gold-dark transition-colors line-clamp-1"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted">
          {product.metal} · {product.purity}
        </p>
        <p className="text-sm font-medium text-gold-dark mt-0.5">{formatPrice(product.price)}</p>
      </div>
    </article>
  );
}
