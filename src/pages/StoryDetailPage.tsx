import { Link, useParams } from 'react-router-dom';
import { getStoryBySlug } from '../data/stories';
import { products } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export function StoryDetailPage() {
  const { slug } = useParams();
  const story = getStoryBySlug(slug || '');

  if (!story) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="font-serif text-2xl mb-4">Story not found</p>
        <Link to="/stories" className="text-xs tracking-widest uppercase text-gold-dark">Back to stories</Link>
      </div>
    );
  }

  const related = products.filter((p) => story.relatedProductIds.includes(p.id));

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:px-6">
      <nav className="text-xs text-muted mb-6">
        <Link to="/stories" className="hover:text-gold-dark">Stories</Link>
        <span className="mx-2">/</span>
        <span>{story.title}</span>
      </nav>
      <p className="text-[11px] tracking-widest uppercase text-gold-dark mb-2">
        {story.category} · {story.readingTime} · {story.author}
      </p>
      <h1 className="font-serif text-3xl md:text-5xl mb-6">{story.title}</h1>
      <div className="aspect-[21/9] bg-gradient-to-br from-beige to-ivory-deep mb-10 flex items-center justify-center">
        <span className="font-serif text-5xl text-gold/20">{story.title[0]}</span>
      </div>
      <div className="prose prose-stone max-w-none">
        {story.content.split('\n\n').map((para, i) => (
          <p key={i} className="text-muted leading-relaxed mb-4">{para}</p>
        ))}
      </div>
      <p className="text-[10px] text-muted mt-6 italic">Demo article — fictional content for concept presentation.</p>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl mb-6">Shop The Story</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
