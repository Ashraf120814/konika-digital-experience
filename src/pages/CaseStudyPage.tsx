import { Link } from 'react-router-dom';

export function CaseStudyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <p className="text-[11px] tracking-[0.2em] uppercase text-gold-dark mb-3">Portfolio case study</p>
      <h1 className="font-serif text-4xl md:text-5xl mb-6">Konika Jewellery — Digital Experience Concept</h1>
      <p className="text-muted leading-relaxed mb-10">
        An independent UX/UI, ecommerce strategy and web-development concept created to demonstrate
        how technology, content and design can improve the jewellery customer journey. This is not
        the official Konika Jewellery website and is not affiliated with the brand.
      </p>

      {[
        {
          t: 'Challenge',
          b: 'Jewellery purchase is high-consideration. Visitors need discovery, education, trust and guidance — not only a catalogue. Brands also need content systems and performance visibility.',
        },
        {
          t: 'Approach',
          b: 'One unified design system and product database powering both customer journeys (discover → personalise → purchase → consult) and internal tools (content studio, calendar, analytics).',
        },
        {
          t: 'Ecommerce Experience',
          b: 'Editorial homepage, collection filters, conversion-focused product pages with price breakdown, cart/wishlist, search overlay, and mobile sticky purchase bar.',
        },
        {
          t: 'Personalization',
          b: 'Rule-based Jewellery Finder (structured for future AI API) matching occasion, style, budget, type and recipient to curated recommendations with match scores.',
        },
        {
          t: 'Content Strategy',
          b: 'Stories hub, product-integrated articles, campaign landing “The Stories We Wear”, and Content Studio for multi-format generation from a single product.',
        },
        {
          t: 'Marketing & Analytics',
          b: 'Campaign experience with lead forms; mock analytics dashboard with funnel, top products, campaign ROAS and demo insights — ready to connect to real data later.',
        },
        {
          t: 'Expected Business Impact',
          b: 'Reduce product discovery friction · Improve product engagement · Increase qualified enquiries · Create reusable marketing content · Improve ecommerce decision-making. (Expected outcomes only — not claimed results.)',
        },
      ].map((s) => (
        <section key={s.t} className="mb-8">
          <h2 className="font-serif text-xl mb-2">{s.t}</h2>
          <p className="text-sm text-muted leading-relaxed">{s.b}</p>
        </section>
      ))}

      <div className="flex flex-wrap gap-3 mt-12">
        <Link to="/" className="bg-charcoal text-ivory px-6 py-3 text-xs tracking-widest uppercase">Explore Experience</Link>
        <Link to="/jewellery-finder" className="border border-charcoal px-6 py-3 text-xs tracking-widest uppercase">Try Finder</Link>
        <Link to="/admin/analytics" className="border border-charcoal px-6 py-3 text-xs tracking-widest uppercase">View Analytics</Link>
      </div>
    </div>
  );
}
