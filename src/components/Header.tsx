import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Heart, Search, ShoppingBag, Menu, X, User } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { cn } from '../lib/utils';

const nav = [
  { to: '/new-arrivals', label: 'New Arrivals' },
  { to: '/jewellery', label: 'Jewellery' },
  { to: '/collections/polki', label: 'Collections' },
  { to: '/bridal', label: 'Bridal' },
  { to: '/bestsellers', label: 'Bestsellers' },
  { to: '/stories', label: 'Stories' },
  { to: '/purchase-plans', label: 'Purchase Plans' },
];

interface HeaderProps {
  onSearch: () => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { cartCount, wishlist } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="bg-charcoal text-gold-light text-center text-[10px] tracking-[0.2em] uppercase py-1.5 px-4">
        Independent digital experience concept · Not the official Konika Jewellery website
      </div>
      <header
        className={cn(
          'sticky top-0 z-50 border-b border-charcoal/5 bg-ivory/95 backdrop-blur-md transition-all duration-300',
          scrolled && 'shadow-sm py-0'
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <button
            type="button"
            className="md:hidden p-2 -ml-2"
            aria-label="Menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            to="/"
            className="font-serif text-lg md:text-xl tracking-[0.18em] uppercase text-charcoal"
          >
            Konika <span className="text-gold">Jewellery</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6" aria-label="Main">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'text-[11px] tracking-[0.12em] uppercase font-medium text-charcoal/70 hover:text-gold-dark transition-colors',
                    isActive && 'text-charcoal'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={onSearch}
              className="p-2 text-charcoal/80 hover:text-gold-dark transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to="/wishlist"
              className="relative p-2 text-charcoal/80 hover:text-gold-dark transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-charcoal text-[9px] text-ivory px-1">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="hidden sm:inline-flex p-2 text-charcoal/80 hover:text-gold-dark"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </button>
            <Link
              to="/cart"
              className="relative p-2 text-charcoal/80 hover:text-gold-dark transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-charcoal text-[9px] text-ivory px-1">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={cn(
          'fixed inset-0 z-[60] md:hidden transition-opacity',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        <button
          type="button"
          className="absolute inset-0 bg-charcoal/40"
          aria-label="Close menu"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            'absolute left-0 top-0 h-full w-[80%] max-w-xs bg-ivory p-6 shadow-xl transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className="flex items-center justify-between mb-8">
            <span className="font-serif tracking-widest uppercase text-sm">Menu</span>
            <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm tracking-wide uppercase text-charcoal/80 hover:text-gold-dark"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/jewellery-finder" className="text-sm tracking-wide uppercase text-gold-dark mt-2">
              Find My Jewellery
            </Link>
            <Link to="/admin/analytics" className="text-xs tracking-wide uppercase text-muted mt-4">
              Admin · Analytics
            </Link>
            <Link to="/admin/saru" className="text-xs tracking-wide uppercase text-muted">
              Admin · Saru AI Support
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
