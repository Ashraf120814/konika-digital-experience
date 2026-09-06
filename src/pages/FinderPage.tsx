import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecommendations, formatPrice, cn } from '../lib/utils';
import { imagesForProduct, imgSrc } from '../data/images';
import type { FinderAnswers, Occasion, Style } from '../types';
import { useStore } from '../context/StoreContext';

const steps = [
  {
    key: 'occasion' as const,
    title: 'What are you shopping for?',
    options: ['Wedding', 'Engagement', 'Festive', 'Everyday', 'Gift'] as Occasion[],
  },
  {
    key: 'style' as const,
    title: 'What style speaks to you?',
    options: ['Traditional', 'Contemporary', 'Minimal', 'Statement', 'Timeless'] as Style[],
  },
  {
    key: 'budget' as const,
    title: "What's your budget?",
    options: ['Under ₹25K', '₹25K–₹50K', '₹50K–₹1L', '₹1L+'],
  },
  {
    key: 'type' as const,
    title: 'What are you looking for?',
    options: ['Ring', 'Earrings', 'Necklace', 'Bracelet', 'Pendant', 'Anything'],
  },
  {
    key: 'recipient' as const,
    title: 'Who is it for?',
    options: ['Myself', 'Partner', 'Mother', 'Daughter', 'Friend', 'Family'],
  },
];

export function FinderPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<FinderAnswers>({
    occasion: null,
    style: null,
    budget: null,
    type: null,
    recipient: null,
  });
  const [done, setDone] = useState(false);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const current = steps[step];
  const currentVal = answers[current.key];

  const select = (val: string) => {
    setAnswers((a) => ({ ...a, [current.key]: val }));
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else setDone(true);
  };

  const results = done ? getRecommendations(answers) : [];

  if (done) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl md:text-4xl mb-2">Your Jewellery Recommendations</h1>
          <p className="text-sm text-muted">
            Based on <strong className="text-charcoal">{answers.occasion}</strong>,{' '}
            <strong className="text-charcoal">{answers.style}</strong>,{' '}
            <strong className="text-charcoal">{answers.budget}</strong>,{' '}
            <strong className="text-charcoal">{answers.type}</strong> for{' '}
            <strong className="text-charcoal">{answers.recipient}</strong>.
          </p>
          <button type="button" onClick={() => { setDone(false); setStep(0); }} className="text-xs text-gold-dark mt-3 tracking-wide uppercase">
            Start over
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((p) => (
            <article key={p.id} className="border border-charcoal/8 overflow-hidden">
              <div className="aspect-square relative overflow-hidden bg-ivory-deep">
                <img
                  src={imgSrc(imagesForProduct(p.id, p.category)[0], 800)}
                  alt={p.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-3 right-3 bg-charcoal text-gold-light text-[10px] px-2 py-1 tracking-wide">
                  {p.match}% Match
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-serif text-lg">{p.name}</h3>
                <p className="text-gold-dark text-sm mb-2">{formatPrice(p.price)}</p>
                <p className="text-xs text-muted mb-4">{p.why}</p>
                <div className="flex flex-wrap gap-2">
                  <Link to={`/product/${p.slug}`} className="text-[10px] tracking-widest uppercase bg-charcoal text-ivory px-3 py-2">View</Link>
                  <button type="button" onClick={() => toggleWishlist(p.id)} className="text-[10px] tracking-widest uppercase border border-charcoal/20 px-3 py-2">
                    {isInWishlist(p.id) ? 'Saved' : 'Wishlist'}
                  </button>
                  <button type="button" onClick={() => addToCart(p)} className="text-[10px] tracking-widest uppercase border border-charcoal/20 px-3 py-2">
                    Add to Cart
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="text-center mb-10">
        <p className="text-gold-dark text-[11px] tracking-[0.2em] uppercase mb-2">Personal Jewellery Finder</p>
        <h1 className="font-serif text-3xl md:text-4xl">Let's Find Something Made for You.</h1>
      </div>
      <div className="flex gap-1 mb-8">
        {steps.map((_, i) => (
          <div key={i} className={cn('h-0.5 flex-1 rounded', i <= step ? 'bg-gold' : 'bg-charcoal/10')} />
        ))}
      </div>
      <h2 className="font-serif text-2xl text-center mb-8">{current.title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
        {current.options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => select(opt)}
            className={cn(
              'py-4 px-3 text-sm border transition-all',
              currentVal === opt
                ? 'border-gold bg-gold/5 shadow-sm'
                : 'border-charcoal/10 hover:border-gold/40'
            )}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setStep(Math.max(0, step - 1))}
          className="text-sm text-muted"
          style={{ visibility: step > 0 ? 'visible' : 'hidden' }}
        >
          ← Back
        </button>
        <button
          type="button"
          disabled={!currentVal}
          onClick={next}
          className="bg-charcoal text-ivory px-6 py-3 text-xs tracking-widest uppercase disabled:opacity-40 hover:bg-gold-dark"
        >
          {step === steps.length - 1 ? 'See Recommendations' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
