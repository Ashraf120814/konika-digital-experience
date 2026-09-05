import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';
import { useState } from 'react';
import { useStore } from '../context/StoreContext';

const sections = [
  { title: 'The Bride', copy: 'Pieces for the beginning of forever.', cta: 'Shop Bridal', to: '/bridal', filter: (p: typeof products[0]) => p.occasion.includes('Wedding') || p.collection === 'Bridal' },
  { title: 'The Celebration', copy: 'Jewellery for moments worth remembering.', cta: 'Explore Festive', to: '/jewellery?occasion=Festive', filter: (p: typeof products[0]) => p.occasion.includes('Festive') },
  { title: 'The Gift', copy: "Give them something they'll keep forever.", cta: 'Shop Gifts', to: '/jewellery?occasion=Gift', filter: (p: typeof products[0]) => p.occasion.includes('Gift') },
  { title: 'Everyday', copy: 'Make ordinary moments extraordinary.', cta: 'Explore Everyday', to: '/jewellery?occasion=Everyday', filter: (p: typeof products[0]) => p.occasion.includes('Everyday') },
];

export function CampaignPage() {
  const { addLead } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', email: '', occasion: '', budget: '' });
  const [sent, setSent] = useState(false);

  return (
    <div>
      <section className="bg-charcoal text-ivory min-h-[60vh] flex items-center justify-center text-center px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(184,154,98,0.12),_transparent_70%)]" />
        <div className="relative z-10 max-w-2xl">
          <p className="text-gold text-[11px] tracking-[0.25em] uppercase mb-4">Campaign · The Stories We Wear</p>
          <h1 className="font-serif text-4xl md:text-6xl mb-4">Every Occasion Deserves a Story.</h1>
          <p className="text-ivory/70 mb-8 font-light">Discover jewellery created for the moments you'll remember.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/jewellery" className="bg-ivory text-charcoal px-7 py-3.5 text-xs tracking-widest uppercase hover:bg-gold-light">Explore Collection</Link>
            <Link to="/jewellery-finder" className="border border-ivory/40 text-ivory px-7 py-3.5 text-xs tracking-widest uppercase hover:border-gold hover:text-gold">Find My Jewellery</Link>
          </div>
        </div>
      </section>

      {sections.map((sec) => {
        const items = products.filter(sec.filter).slice(0, 4);
        return (
          <section key={sec.title} className="mx-auto max-w-7xl px-4 py-14 md:px-6">
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl mb-2">{sec.title}</h2>
              <p className="text-muted text-sm mb-4">{sec.copy}</p>
              <Link to={sec.to} className="text-xs tracking-widest uppercase text-gold-dark hover:underline">{sec.cta}</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        );
      })}

      <section className="bg-ivory-deep py-14">
        <div className="max-w-md mx-auto px-4">
          <h2 className="font-serif text-2xl text-center mb-2">Need Help Choosing?</h2>
          <p className="text-sm text-muted text-center mb-6">Get personal recommendations.</p>
          {sent ? (
            <p className="text-center text-sm">Thank you. We'll be in touch. (Demo)</p>
          ) : (
            <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); addLead({ ...form, source: 'campaign' }); setSent(true); }}>
              <input required placeholder="Name" className="w-full border border-charcoal/15 px-3 py-2.5 text-sm bg-white" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input required type="tel" placeholder="Phone" className="w-full border border-charcoal/15 px-3 py-2.5 text-sm bg-white" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input required type="email" placeholder="Email" className="w-full border border-charcoal/15 px-3 py-2.5 text-sm bg-white" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <select className="border border-charcoal/15 px-3 py-2.5 text-sm bg-white" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
                  <option value="">Occasion</option>
                  {['Wedding', 'Engagement', 'Festive', 'Everyday', 'Gift'].map((o) => <option key={o}>{o}</option>)}
                </select>
                <select className="border border-charcoal/15 px-3 py-2.5 text-sm bg-white" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                  <option value="">Budget</option>
                  {['Under ₹25K', '₹25K–₹50K', '₹50K–₹1L', '₹1L+'].map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-charcoal text-ivory py-3 text-xs tracking-widest uppercase">Get Personal Recommendations</button>
            </form>
          )}
        </div>
      </section>

      <a href="https://wa.me/917397085346" target="_blank" rel="noreferrer" className="fixed bottom-6 right-6 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg text-2xl" aria-label="WhatsApp">
        💬
      </a>
    </div>
  );
}
