import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { CartItem, ConsultationLead, Product } from '../types';

interface StoreContextValue {
  cart: CartItem[];
  wishlist: string[];
  recentlyViewed: string[];
  leads: ConsultationLead[];
  addToCart: (product: Product, qty?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  addRecentlyViewed: (productId: string) => void;
  addLead: (lead: Omit<ConsultationLead, 'id' | 'createdAt'>) => void;
  cartCount: number;
  cartTotal: number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

const LS_CART = 'konika_concept_cart';
const LS_WISH = 'konika_concept_wishlist';
const LS_RECENT = 'konika_concept_recent';
const LS_LEADS = 'konika_concept_leads';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => load(LS_CART, []));
  const [wishlist, setWishlist] = useState<string[]>(() => load(LS_WISH, []));
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() =>
    load(LS_RECENT, [])
  );
  const [leads, setLeads] = useState<ConsultationLead[]>(() => load(LS_LEADS, []));

  useEffect(() => {
    localStorage.setItem(LS_CART, JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem(LS_WISH, JSON.stringify(wishlist));
  }, [wishlist]);
  useEffect(() => {
    localStorage.setItem(LS_RECENT, JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);
  useEffect(() => {
    localStorage.setItem(LS_LEADS, JSON.stringify(leads));
  }, [leads]);

  const value = useMemo<StoreContextValue>(() => {
    const addToCart = (product: Product, qty = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.product.id === product.id);
        if (existing) {
          return prev.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + qty }
              : i
          );
        }
        return [...prev, { product, quantity: qty }];
      });
    };

    const removeFromCart = (productId: string) => {
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
    };

    const updateQty = (productId: string, qty: number) => {
      if (qty < 1) {
        removeFromCart(productId);
        return;
      }
      setCart((prev) =>
        prev.map((i) =>
          i.product.id === productId ? { ...i, quantity: qty } : i
        )
      );
    };

    const clearCart = () => setCart([]);

    const toggleWishlist = (productId: string) => {
      setWishlist((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    };

    const isInWishlist = (productId: string) => wishlist.includes(productId);

    const addRecentlyViewed = (productId: string) => {
      setRecentlyViewed((prev) => {
        const next = [productId, ...prev.filter((id) => id !== productId)];
        return next.slice(0, 12);
      });
    };

    const addLead = (lead: Omit<ConsultationLead, 'id' | 'createdAt'>) => {
      const entry: ConsultationLead = {
        ...lead,
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      setLeads((prev) => [entry, ...prev]);
    };

    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
    const cartTotal = cart.reduce(
      (s, i) => s + i.product.price * i.quantity,
      0
    );

    return {
      cart,
      wishlist,
      recentlyViewed,
      leads,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      toggleWishlist,
      isInWishlist,
      addRecentlyViewed,
      addLead,
      cartCount,
      cartTotal,
    };
  }, [cart, wishlist, recentlyViewed, leads]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
