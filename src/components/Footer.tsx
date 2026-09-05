import { Link } from 'react-router-dom';

const cols = [
  {
    title: 'Jewellery',
    links: [
      { to: '/jewellery', label: 'All Jewellery' },
      { to: '/collections/rings', label: 'Rings' },
      { to: '/collections/earrings', label: 'Earrings' },
      { to: '/bridal', label: 'Bridal' },
      { to: '/bestsellers', label: 'Bestsellers' },
    ],
  },
  {
    title: 'Collections',
    links: [
      { to: '/collections/polki', label: 'Polki' },
      { to: '/collections/meenakari', label: 'Meenakari' },
      { to: '/collections/temple', label: 'Temple' },
      { to: '/collections/antique', label: 'Antique' },
      { to: '/collections/navratana', label: 'Navratana' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { to: '/purchase-plans', label: 'Purchase Plans' },
      { to: '/jewellery-finder', label: 'Find My Jewellery' },
      { to: '/stories', label: 'Stories' },
      { to: '/#consult', label: 'Consultation' },
    ],
  },
  {
    title: 'About',
    links: [
      { to: '/stories', label: 'Our Story' },
      { to: '/admin/analytics', label: 'Admin Demo' },
      { to: '/admin/saru', label: 'Saru AI Support' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-charcoal text-ivory/70 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="font-serif text-ivory text-sm tracking-wide mb-4">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-xs hover:text-gold-light transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link
            to="/"
            className="font-serif tracking-[0.18em] uppercase text-sm text-ivory"
          >
            Konika <span className="text-gold">Jewellery</span>
          </Link>
          <p className="text-[10px] text-ivory/40 text-center max-w-md">
            KONIKA JEWELLERY — DIGITAL EXPERIENCE CONCEPT. Independent UX/UI and
            ecommerce demonstration. Not officially affiliated with Konika Jewellery.
            Product prices and scheme details are mock/demo or based on publicly
            available information.
          </p>
        </div>
      </div>
    </footer>
  );
}
