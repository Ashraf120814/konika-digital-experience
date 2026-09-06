import { Link } from 'react-router-dom';
import { stories } from '../data/stories';
import { productImagePool, imgSrc } from '../data/images';

const cats = ['All', 'Education', 'Craftsmanship', 'Heritage', 'Styling', 'Bridal', 'Gifting', 'Behind The Scenes'];

export function StoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="text-center mb-12">
        <h1 className="font-serif text-3xl md:text-5xl mb-3">Stories Behind the Jewellery.</h1>
        <p className="text-muted max-w-lg mx-auto text-sm">
          Discover the craft, culture and inspiration behind timeless Indian jewellery. Demo editorial content.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {cats.map((c) => (
          <span key={c} className="text-[10px] tracking-widest uppercase border border-charcoal/15 px-3 py-1.5 text-muted">
            {c}
          </span>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((s) => (
          <Link key={s.id} to={`/stories/${s.slug}`} className="group border border-charcoal/8 hover:border-gold/40 transition-colors">
            <div className="aspect-[16/10] overflow-hidden bg-ivory-deep">
              <img
                src={imgSrc(productImagePool[parseInt(s.id.replace(/\D/g,'')||'1',10) % productImagePool.length], 1000)}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="text-[10px] tracking-widest uppercase text-gold-dark mb-1">{s.category} · {s.readingTime}</p>
              <h2 className="font-serif text-xl mb-2 group-hover:text-gold-dark transition-colors">{s.title}</h2>
              <p className="text-sm text-muted line-clamp-2">{s.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
      <p className="text-center text-[10px] text-muted mt-10">Fictional/demo articles for concept demonstration.</p>
    </div>
  );
}
