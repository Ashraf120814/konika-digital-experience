import type { Product, FinderAnswers } from '../types';
import { products } from '../data/products';

export function formatPrice(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function productGradient(product: Product): string {
  const hues: Record<string, string> = {
    Temple: 'from-amber-100 via-yellow-50 to-orange-100',
    Diamond: 'from-slate-100 via-blue-50 to-indigo-50',
    Polki: 'from-yellow-50 via-amber-50 to-stone-100',
    Meenakari: 'from-rose-100 via-orange-50 to-amber-100',
    Antique: 'from-stone-200 via-amber-100 to-yellow-100',
    Navratana: 'from-emerald-50 via-violet-50 to-amber-50',
    Bridal: 'from-rose-50 via-amber-50 to-yellow-50',
    Gold: 'from-yellow-50 via-amber-50 to-orange-50',
  };
  return hues[product.collection] || 'from-stone-100 to-amber-50';
}

/**
 * Rule-based recommendations — structured for future AI API.
 * Replace body with API call when backend is ready.
 */
export function getRecommendations(
  answers: FinderAnswers
): (Product & { match: number; why: string })[] {
  const typeMap: Record<string, string> = {
    Ring: 'Rings',
    Earrings: 'Earrings',
    Necklace: 'Necklaces',
    Bracelet: 'Bracelets',
    Pendant: 'Pendants',
  };

  const scored = products.map((product) => {
    let score = 40;
    const reasons: string[] = [];
    const wantCat = answers.type ? typeMap[answers.type] : null;

    if (answers.type === 'Anything' || (wantCat && product.category === wantCat)) {
      score += 20;
      if (wantCat) reasons.push(product.category.toLowerCase());
    } else if (wantCat) {
      score -= 12;
    }

    if (
      answers.occasion &&
      product.occasion.includes(answers.occasion as Product['occasion'][number])
    ) {
      score += 18;
      reasons.push(`${answers.occasion.toLowerCase()} occasion`);
    }
    if (
      answers.style &&
      product.style.includes(answers.style as Product['style'][number])
    ) {
      score += 15;
      reasons.push(`${answers.style.toLowerCase()} style`);
    }

    const budgetMap: Record<string, (p: number) => boolean> = {
      'Under ₹25K': (p) => p < 25000,
      '₹25K–₹50K': (p) => p >= 25000 && p < 50000,
      '₹50K–₹1L': (p) => p >= 50000 && p < 100000,
      '₹1L+': (p) => p >= 100000,
    };
    if (answers.budget && budgetMap[answers.budget]?.(product.price)) {
      score += 12;
      reasons.push('selected budget');
    } else if (answers.budget) {
      score -= 6;
    }

    score = Math.min(98, Math.max(55, Math.round(score)));
    const why =
      reasons.length > 0
        ? `Selected because it matches your ${reasons.slice(0, 3).join(', ')}.`
        : `Curated for your ${answers.occasion?.toLowerCase() || 'occasion'} and ${answers.style?.toLowerCase() || 'style'} preference.`;

    return { ...product, match: score, why };
  });

  scored.sort((a, b) => b.match - a.match);
  return scored.slice(0, 6);
}
