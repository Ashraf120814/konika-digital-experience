import { Link } from 'react-router-dom';

const week = [
  { day: 'Monday', theme: 'Education', status: 'Published', item: 'Understanding 22K Gold' },
  { day: 'Tuesday', theme: 'Product Story', status: 'In Production', item: 'Temple Lakshmi Ring feature' },
  { day: 'Wednesday', theme: 'Styling Reel', status: 'Planned', item: 'How to style temple jewellery' },
  { day: 'Thursday', theme: 'Craftsmanship', status: 'Idea', item: 'Meenakari process BTS' },
  { day: 'Friday', theme: 'New Arrival', status: 'Planned', item: 'Polki stud launch' },
  { day: 'Saturday', theme: 'Customer Story', status: 'Idea', item: 'Bridal journey series' },
  { day: 'Sunday', theme: 'Collection Feature', status: 'Published', item: 'Antique collection edit' },
];

const statusColor: Record<string, string> = {
  Idea: 'bg-stone-100 text-stone-600',
  Planned: 'bg-amber-50 text-amber-800',
  'In Production': 'bg-blue-50 text-blue-800',
  Published: 'bg-emerald-50 text-emerald-800',
};

export function CalendarPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-[10px] tracking-widest uppercase text-gold-dark">Internal · Demo</p>
          <h1 className="font-serif text-3xl">Content Calendar</h1>
        </div>
        <Link to="/admin/content" className="text-xs border border-charcoal/15 px-3 py-2 hover:border-gold">Content Studio</Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {week.map((d) => (
          <div key={d.day} className="border border-charcoal/10 p-4 min-h-[140px]">
            <p className="text-[10px] tracking-widest uppercase text-muted mb-1">{d.day}</p>
            <p className="font-serif text-sm mb-2">{d.theme}</p>
            <p className="text-xs text-muted mb-3 line-clamp-2">{d.item}</p>
            <span className={`text-[9px] tracking-wide uppercase px-2 py-0.5 ${statusColor[d.status]}`}>
              {d.status}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted mt-6">Demo calendar — drag-and-drop can be added with a library in a later iteration.</p>
    </div>
  );
}
