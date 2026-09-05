export type Category =
  | 'Rings'
  | 'Earrings'
  | 'Necklaces'
  | 'Bracelets'
  | 'Pendants'
  | 'Mangalsutra';

export type Collection =
  | 'Gold'
  | 'Diamond'
  | 'Polki'
  | 'Meenakari'
  | 'Temple'
  | 'Antique'
  | 'Navratana'
  | 'Bridal';

export type Occasion =
  | 'Wedding'
  | 'Engagement'
  | 'Festive'
  | 'Everyday'
  | 'Gift';

export type Style =
  | 'Traditional'
  | 'Contemporary'
  | 'Minimal'
  | 'Statement'
  | 'Timeless';

export type Metal = 'Gold' | 'Rose Gold' | 'White Gold' | 'Platinum';

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: Category;
  collection: Collection;
  price: number;
  metal: Metal;
  purity: string;
  weight: string;
  images: string[];
  description: string;
  occasion: Occasion[];
  style: Style[];
  rating: number;
  reviews: number;
  isNew: boolean;
  isBestseller: boolean;
  goldValue?: number;
  makingCharges?: number;
  stoneValue?: number;
  productCode: string;
  story?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  readingTime: string;
  author: string;
  image: string;
  relatedProductIds: string[];
  featured?: boolean;
}

export interface ConsultationLead {
  id: string;
  name: string;
  phone: string;
  email: string;
  occasion?: string;
  budget?: string;
  message?: string;
  preferredDate?: string;
  source: string;
  createdAt: string;
}

export interface FinderAnswers {
  occasion: Occasion | null;
  style: Style | null;
  budget: string | null;
  type: string | null;
  recipient: string | null;
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-asc'
  | 'price-desc'
  | 'bestselling';
