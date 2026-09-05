import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

const categories = [
  { name: 'Rings', to: '/jewellery?category=Rings', emoji: '💍' },
  { name: 'Earrings', to: '/jewellery?category=Earrings', emoji: '✨' },
  { name: 'Necklaces', to: '/jewellery?category=Necklaces', emoji: '📿' },
  { name: 'Bracelets', to: '/jewellery?category=Bracelets', emoji: '🔗' },
  { name: 'Pendants', to: '/jewellery?category=Pendants', emoji: '◆' },
  { name: 'Mangalsutra', to: '/jewellery?category=Mangalsutra', emoji: '🖤' },
];

const occasions = ['Wedding', 'Engagement', 'Festive', 'Everyday', 'Gifting'];

const collections = [
  { name: 'Polki', slug: 'polki', story: 'Uncut diamonds, traditional settings — quiet sparkle.' },
  { name: 'Meenakari', slug: 'meenakari', story: 'Enamel art on gold — colour that lasts centuries.' },
  { name: 'Temple', slug: 'temple', story: 'South Indian grandeur, deity motifs, royalty.' },
  { name: 'Antique', slug: 'antique', story: 'Heritage finish, timeless motifs, heirloom presence.' },
  { name: 'Navratana', slug: 'navratana', story: 'Nine gems, planetary balance, spiritual elegance.' },
];

export function Home() {
  const newArrivals = products.filter((p) => p.isNew).slice(0, 8);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[72vh] flex items-center justify-center overflow-hidden bg-charcoal">
        <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-soft to-charcoal opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(184,154,98,0.15),_transparent_60%)]" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto py-20">
          <p className="text-gold text-[11px] tracking-[0.25em] uppercase mb-4">
            Craftsmanship · Heritage · Modern Luxury
          </p>
          <h1 className="font-serif text-4xl md:text-6xl text-ivory leading-tight text-balance">
            Jewellery That Carries a Story.
          </h1>
          <p className="mt-5 text-ivory/70 text-base md:text-lg font-light max-w-lg mx-auto">
            Timeless craftsmanship, thoughtfully created for the moments that matter.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/jewellery"
              className="inline-flex items-center gap-2 bg-ivory text-charcoal px-7 py-3.5 text-xs tracking-[0.12em] uppercase font-medium hover:bg-gold-light transition-colors"
            >
              Explore Jewellery
            </Link>
            <Link
              to="/jewellery-finder"
              className="inline-flex items-center gap-2 border border-ivory/40 text-ivory px-7 py-3.5 text-xs tracking-[0.12em] uppercase font-medium hover:border-gold hover:text-gold transition-colors"
            >
              Find My Jewellery
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by jewellery */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="text-center mb-10">
          <p className="text-gold-dark text-[11px] tracking-[0.2em] uppercase mb-2">Shop by jewellery</p>
          <h2 className="font-serif text-3xl md:text-4xl">Find Your Form</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              to={c.to}
              className="group aspect-[3/4] bg-ivory-deep rounded-sm flex flex-col items-center justify-center gap-3 border border-transparent hover:border-gold/40 transition-all"
            >
              <span className="text-2xl opacity-60 group-hover:scale-110 transition-transform">{c.emoji}</span>
              <span className="text-xs tracking-widest uppercase text-charcoal/80 group-hover:text-gold-dark">
                {c.name}
              </span>
              <span className="text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                Explore <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Occasion */}
      <section className="bg-ivory-deep py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-10">
            <p className="text-gold-dark text-[11px] tracking-[0.2em] uppercase mb-2">Shop by occasion</p>
            <h2 className="font-serif text-3xl md:text-4xl">Moments Worth Wearing</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {occasions.map((o) => (
              <Link
                key={o}
                to={`/jewellery?occasion=${o === 'Gifting' ? 'Gift' : o}`}
                className="bg-charcoal text-ivory py-10 px-4 text-center rounded-sm hover:bg-gold-dark transition-colors"
              >
                <span className="font-serif text-lg">{o}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="text-center mb-10">
          <p className="text-gold-dark text-[11px] tracking-[0.2em] uppercase mb-2">Featured collections</p>
          <h2 className="font-serif text-3xl md:text-4xl">Stories in Metal & Stone</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <Link
              key={col.slug}
              to={`/collections/${col.slug}`}
              className="group border border-charcoal/8 p-6 hover:border-gold/50 transition-colors"
            >
              <div className="aspect-[16/10] bg-gradient-to-br from-beige to-ivory-deep mb-4 flex items-center justify-center">
                <span className="font-serif text-4xl text-gold/30 group-hover:text-gold/50 transition-colors">
                  {col.name[0]}
                </span>
              </div>
              <h3 className="font-serif text-xl mb-1">{col.name}</h3>
              <p className="text-sm text-muted mb-3">{col.story}</p>
              <span className="text-[11px] tracking-widest uppercase text-gold-dark flex items-center gap-1">
                Explore Collection <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-gold-dark text-[11px] tracking-[0.2em] uppercase mb-1">Just in</p>
            <h2 className="font-serif text-3xl">New Arrivals</h2>
          </div>
          <Link to="/new-arrivals" className="text-xs tracking-widest uppercase text-muted hover:text-gold-dark hidden sm:inline">
            View all
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section className="bg-ivory-deep py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-gold-dark text-[11px] tracking-[0.2em] uppercase mb-1">Most loved</p>
              <h2 className="font-serif text-3xl">Bestsellers</h2>
            </div>
            <Link to="/bestsellers" className="text-xs tracking-widest uppercase text-muted hover:text-gold-dark hidden sm:inline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestsellers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Finder CTA */}
      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 text-center">
        <p className="text-gold-dark text-[11px] tracking-[0.2em] uppercase mb-3">Personalisation</p>
        <h2 className="font-serif text-3xl md:text-4xl mb-4">Not Sure What to Choose?</h2>
        <p className="text-muted max-w-md mx-auto mb-8">
          Let us help you discover a piece that feels made for you — by occasion, style and budget.
        </p>
        <Link
          to="/jewellery-finder"
          className="inline-flex items-center gap-2 bg-charcoal text-ivory px-8 py-3.5 text-xs tracking-[0.12em] uppercase font-medium hover:bg-gold-dark transition-colors"
        >
          Find My Jewellery <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Heritage */}
      <section className="bg-charcoal text-ivory py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-gold text-[11px] tracking-[0.2em] uppercase mb-3">Heritage</p>
          <h2 className="font-serif text-3xl md:text-4xl mb-5">Crafted With Meaning.</h2>
          <p className="text-ivory/70 font-light leading-relaxed mb-8">
            Drawing inspiration from publicly shared brand heritage — decades of craftsmanship in
            gold, polki and diamond jewellery across South India. This concept explores how
            storytelling and digital experience can deepen trust and discovery.
          </p>
          <Link
            to="/stories"
            className="inline-flex items-center gap-2 border border-ivory/30 text-ivory px-7 py-3 text-xs tracking-[0.12em] uppercase hover:border-gold hover:text-gold transition-colors"
          >
            Discover Our Story
          </Link>
        </div>
      </section>

      {/* Purchase plan */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 text-center">
        <p className="text-gold-dark text-[11px] tracking-[0.2em] uppercase mb-3">Purchase plans</p>
        <h2 className="font-serif text-3xl md:text-4xl mb-4">
          Plan Today. Wear Your Dream Jewellery Tomorrow.
        </h2>
        <p className="text-muted max-w-lg mx-auto mb-8">
          Based on publicly available Zero% Gold Purchase Plan information. Monthly contributions
          over 11 months with scheme benefits at maturity.
        </p>
        <Link
          to="/purchase-plans"
          className="inline-flex items-center gap-2 bg-charcoal text-ivory px-8 py-3.5 text-xs tracking-[0.12em] uppercase font-medium hover:bg-gold-dark transition-colors"
        >
          Explore Purchase Plans
        </Link>
      </section>

      {/* Trust */}
      <section className="border-t border-charcoal/8 py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { t: 'Hallmarked Jewellery', d: 'Purity you can verify' },
            { t: 'Certified Diamonds', d: 'Clarity with confidence' },
            { t: 'Secure Shopping', d: 'Protected checkout' },
            { t: 'Customer Support', d: 'Guidance when you need it' },
          ].map((item) => (
            <div key={item.t}>
              <p className="font-serif text-lg mb-1">{item.t}</p>
              <p className="text-xs text-muted">{item.d}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-muted mt-6 px-4">
          Trust features shown as typical jewellery ecommerce expectations for this concept demo.
        </p>
      </section>

      {/* Newsletter */}
      <section className="bg-ivory-deep py-14">
        <div className="mx-auto max-w-md px-4 text-center">
          <h2 className="font-serif text-2xl mb-2">Enter the World of Konika.</h2>
          <p className="text-sm text-muted mb-6">Style notes and new arrivals. Demo form only.</p>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              alert('Demo only — subscription not sent.');
            }}
          >
            <input
              type="email"
              required
              placeholder="Your email"
              className="flex-1 border border-charcoal/15 bg-white px-4 py-3 text-sm focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              className="bg-charcoal text-ivory px-5 py-3 text-xs tracking-widest uppercase hover:bg-gold-dark"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
