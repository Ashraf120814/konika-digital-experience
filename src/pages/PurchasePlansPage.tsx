import { useState } from 'react';
import { formatPrice } from '../lib/utils';
import { useStore } from '../context/StoreContext';

const plans = [
  { amount: 2000, months: 11, total: 22000, benefitA: 'No wastage up to 10% & no making charges on 916 gold jewellery', benefitB: '1 month bonus (₹2,000) after maturity' },
  { amount: 5000, months: 11, total: 55000, benefitA: 'No wastage up to 10% & no making charges on 916 gold jewellery', benefitB: '1 month bonus (₹5,000) after maturity' },
  { amount: 10000, months: 11, total: 110000, benefitA: 'No wastage up to 10% & no making charges on 916 gold jewellery', benefitB: '1 month bonus (₹10,000) after maturity' },
];

export function PurchasePlansPage() {
  const [monthly, setMonthly] = useState(5000);
  const [selected, setSelected] = useState<number | null>(5000);
  const { addLead } = useStore();
  const [form, setForm] = useState({ name: '', phone: '', email: '', occasion: '', budget: '' });
  const [sent, setSent] = useState(false);

  const total = monthly * 11;

  return (
    <div>
      <section className="bg-charcoal text-ivory py-16 text-center px-4">
        <p className="text-gold text-[11px] tracking-[0.2em] uppercase mb-3">Zero% Gold Purchase Plan</p>
        <h1 className="font-serif text-3xl md:text-5xl mb-4">Plan Today. Wear Your Dream Jewellery Tomorrow.</h1>
        <p className="text-ivory/70 max-w-xl mx-auto text-sm font-light">
          Based on publicly available Konika Zero% Gold Purchase Plan details. Monthly premiums for 11 months; benefits depend on Option A or B at enrolment.
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid md:grid-cols-3 gap-4 mb-4">
          {plans.map((p) => (
            <button
              key={p.amount}
              type="button"
              onClick={() => { setSelected(p.amount); setMonthly(p.amount); }}
              className={`text-left border p-6 transition-all ${selected === p.amount ? 'border-gold bg-gold/5' : 'border-charcoal/10 hover:border-gold/40'}`}
            >
              <p className="font-serif text-3xl text-gold-dark">{formatPrice(p.amount)}</p>
              <p className="text-[10px] tracking-widest uppercase text-muted mb-3">per month · 11 months</p>
              <p className="text-sm mb-1">Total contribution</p>
              <p className="font-medium mb-4">{formatPrice(p.total)}</p>
              <p className="text-xs text-muted border-t border-charcoal/8 pt-3">
                Option A: {p.benefitA}<br /><br />Option B: {p.benefitB}
              </p>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted text-center italic mb-12">
          Verified from public Purchase Scheme information. Members choose Option A or B at enrolment. Terms apply.
        </p>

        <div className="max-w-md mx-auto border border-charcoal/10 p-6 mb-16">
          <h2 className="font-serif text-xl text-center mb-6">Illustrative Calculator</h2>
          <label className="block text-[10px] tracking-widest uppercase text-muted mb-1">Monthly contribution</label>
          <select value={monthly} onChange={(e) => setMonthly(Number(e.target.value))} className="w-full border border-charcoal/15 px-3 py-2 mb-4 text-sm">
            <option value={2000}>₹2,000</option>
            <option value={5000}>₹5,000</option>
            <option value={10000}>₹10,000</option>
          </select>
          <label className="block text-[10px] tracking-widest uppercase text-muted mb-1">Duration</label>
          <select className="w-full border border-charcoal/15 px-3 py-2 mb-4 text-sm" defaultValue={11}>
            <option value={11}>11 months (official tenure)</option>
          </select>
          <div className="bg-ivory-deep p-4 text-center">
            <p className="text-[10px] tracking-widest uppercase text-muted">Total contribution</p>
            <p className="font-serif text-3xl text-gold-dark">{formatPrice(total)}</p>
          </div>
          <p className="text-[10px] text-muted mt-3 text-center">
            Illustrative calculation. Final benefits depend on applicable scheme terms.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-16 text-center">
          {['Choose Plan', 'Contribute Monthly', 'Complete Plan', 'Choose Jewellery', 'Purchase'].map((label, i) => (
            <div key={label} className="flex items-center gap-4">
              <div>
                <div className="w-9 h-9 rounded-full border border-gold text-gold-dark text-sm flex items-center justify-center mx-auto mb-1">{i + 1}</div>
                <p className="text-[10px] tracking-wide uppercase text-muted">{label}</p>
              </div>
              {i < 4 && <span className="text-gold/40 hidden md:inline">→</span>}
            </div>
          ))}
        </div>

        <div className="max-w-lg mx-auto border border-charcoal/10 p-6 bg-white">
          <h2 className="font-serif text-xl text-center mb-2">Need Help Choosing?</h2>
          <p className="text-sm text-muted text-center mb-6">Talk to a jewellery consultant.</p>
          {sent ? (
            <p className="text-center text-sm py-6">Thank you. A jewellery consultant will contact you. (Demo — saved locally.)</p>
          ) : (
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                addLead({ ...form, source: 'purchase-plans' });
                setSent(true);
              }}
            >
              <input required placeholder="Name" className="w-full border border-charcoal/15 px-3 py-2.5 text-sm" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <input required type="tel" placeholder="Phone" className="w-full border border-charcoal/15 px-3 py-2.5 text-sm" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input required type="email" placeholder="Email" className="w-full border border-charcoal/15 px-3 py-2.5 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <select className="border border-charcoal/15 px-3 py-2.5 text-sm" value={form.occasion} onChange={(e) => setForm({ ...form, occasion: e.target.value })}>
                  <option value="">Occasion</option>
                  {['Wedding', 'Engagement', 'Festive', 'Everyday', 'Gift', 'Purchase plan'].map((o) => <option key={o}>{o}</option>)}
                </select>
                <select className="border border-charcoal/15 px-3 py-2.5 text-sm" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}>
                  <option value="">Budget</option>
                  {['Under ₹25K', '₹25K–₹50K', '₹50K–₹1L', '₹1L+', 'Monthly plan'].map((b) => <option key={b}>{b}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-gold to-gold-dark text-white py-3 text-xs tracking-widest uppercase">
                Talk to a Jewellery Consultant
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
