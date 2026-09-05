import { Link } from 'react-router-dom';

/** All metrics are MOCK / DEMO data for concept presentation */

const kpis = [
  { label: 'Website Visitors', value: '48,320', change: '+12.4%' },
  { label: 'Product Views', value: '126,890', change: '+8.1%' },
  { label: 'Add to Cart', value: '9,420', change: '+15.2%' },
  { label: 'Checkout Started', value: '3,180', change: '+6.7%' },
  { label: 'Purchases', value: '1,245', change: '+9.3%' },
  { label: 'Conversion Rate', value: '2.58%', change: '+0.3pp' },
  { label: 'Avg Order Value', value: '₹42,800', change: '+4.1%' },
];

const funnel = [
  { stage: 'Visitors', value: 48320, pct: 100 },
  { stage: 'Product Views', value: 126890, pct: 0 },
  { stage: 'Add to Cart', value: 9420, pct: 19.5 },
  { stage: 'Checkout', value: 3180, pct: 33.8 },
  { stage: 'Purchase', value: 1245, pct: 39.2 },
];

const topProducts = [
  { name: 'Classic Gold Mangalsutra', views: 8420, atc: 920, sales: 312, conv: '3.7%' },
  { name: 'Antique Jhumka Earrings', views: 6210, atc: 780, sales: 245, conv: '3.9%' },
  { name: 'Temple Lakshmi Gold Ring', views: 5100, atc: 610, sales: 198, conv: '3.9%' },
  { name: 'Minimal Solitaire Band', views: 4890, atc: 540, sales: 176, conv: '3.6%' },
];

const campaigns = [
  { name: 'The Stories We Wear', spend: '₹1,20,000', reach: '2.1L', clicks: '8,420', leads: 312, conv: 48, roas: '3.2x' },
  { name: 'Bridal Season', spend: '₹95,000', reach: '1.4L', clicks: '6,100', leads: 280, conv: 62, roas: '4.1x' },
  { name: 'Festive Polki', spend: '₹72,000', reach: '98K', clicks: '4,200', leads: 145, conv: 28, roas: '2.8x' },
];

export function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gold-dark">Internal · Demo</p>
          <h1 className="font-serif text-3xl">Digital Performance</h1>
        </div>
        <div className="flex gap-2 text-xs">
          <Link to="/admin/content" className="border border-charcoal/15 px-3 py-2 hover:border-gold">Content Studio</Link>
          <Link to="/admin/calendar" className="border border-charcoal/15 px-3 py-2 hover:border-gold">Calendar</Link>
        </div>
      </div>
      <p className="text-[10px] text-muted mb-8 uppercase tracking-wide">Every metric is mock/demo data</p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-10">
        {kpis.map((k) => (
          <div key={k.label} className="border border-charcoal/8 p-4 bg-white">
            <p className="text-[10px] text-muted tracking-wide uppercase mb-1">{k.label}</p>
            <p className="font-serif text-xl">{k.value}</p>
            <p className="text-[11px] text-emerald-700 mt-1">{k.change}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        <div className="border border-charcoal/8 p-6">
          <h2 className="font-serif text-xl mb-4">Sales Funnel</h2>
          <div className="space-y-3">
            {[
              { stage: 'Visitors', value: '48,320' },
              { stage: 'Product Views', value: '1,26,890' },
              { stage: 'Add to Cart', value: '9,420 · 19.5%' },
              { stage: 'Checkout', value: '3,180 · 33.8%' },
              { stage: 'Purchase', value: '1,245 · 39.2%' },
            ].map((f, i) => (
              <div key={f.stage} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-gold text-gold-dark text-xs flex items-center justify-center">{i + 1}</div>
                <div className="flex-1">
                  <p className="text-sm">{f.stage}</p>
                  <div className="h-1.5 bg-charcoal/5 rounded mt-1">
                    <div className="h-full bg-gold rounded" style={{ width: `${100 - i * 18}%` }} />
                  </div>
                </div>
                <span className="text-xs text-muted">{f.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-charcoal/8 p-6">
          <h2 className="font-serif text-xl mb-4">DEMO INSIGHTS</h2>
          <ul className="space-y-3">
            {[
              'Bridal collection is receiving strong product engagement.',
              'Video content is generating higher product clicks.',
              'Educational content is driving website discovery.',
            ].map((insight) => (
              <li key={insight} className="text-sm border-l-2 border-gold pl-3 text-muted">
                <span className="text-[9px] tracking-widest uppercase text-gold-dark block mb-0.5">Demo insight</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border border-charcoal/8 p-6 mb-10 overflow-x-auto">
        <h2 className="font-serif text-xl mb-4">Top Products</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-[10px] tracking-widest uppercase text-muted border-b border-charcoal/10">
              <th className="py-2 pr-4">Product</th>
              <th className="py-2 pr-4">Views</th>
              <th className="py-2 pr-4">Add to Cart</th>
              <th className="py-2 pr-4">Sales</th>
              <th className="py-2">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p) => (
              <tr key={p.name} className="border-b border-charcoal/5">
                <td className="py-3 pr-4 font-medium">{p.name}</td>
                <td className="py-3 pr-4">{p.views.toLocaleString()}</td>
                <td className="py-3 pr-4">{p.atc}</td>
                <td className="py-3 pr-4">{p.sales}</td>
                <td className="py-3">{p.conv}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border border-charcoal/8 p-6 overflow-x-auto">
        <h2 className="font-serif text-xl mb-4">Campaign Performance</h2>
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-[10px] tracking-widest uppercase text-muted border-b border-charcoal/10">
              <th className="py-2 pr-3">Campaign</th>
              <th className="py-2 pr-3">Spend</th>
              <th className="py-2 pr-3">Reach</th>
              <th className="py-2 pr-3">Clicks</th>
              <th className="py-2 pr-3">Leads</th>
              <th className="py-2 pr-3">Conv.</th>
              <th className="py-2">ROAS</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c.name} className="border-b border-charcoal/5">
                <td className="py-3 pr-3 font-medium">{c.name}</td>
                <td className="py-3 pr-3">{c.spend}</td>
                <td className="py-3 pr-3">{c.reach}</td>
                <td className="py-3 pr-3">{c.clicks}</td>
                <td className="py-3 pr-3">{c.leads}</td>
                <td className="py-3 pr-3">{c.conv}</td>
                <td className="py-3 text-emerald-700">{c.roas}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        {['Create Campaign', 'Add Product', 'Create Content', 'Export Report', 'View Customer Leads'].map((a) => (
          <button key={a} type="button" className="text-xs tracking-widest uppercase border border-charcoal/20 px-4 py-2.5 hover:border-gold hover:bg-gold/5">
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}
