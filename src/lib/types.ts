export type Availability = "In Stock" | "Preorder" | "Limited Stock";
export type EnquiryStatus = "New" | "Contacted" | "Closed";
export type EnquiryType = "product" | "general" | "catalog";

export interface Category {
  id: string;
  name: string;
  slug: string;
  folder: string;
  description: string;
  bannerImage: string;
  accentFrom: string;
  accentTo: string;
  badge: string;
  order: number;
  heroStat: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  tagline: string;
  description: string;
  marketingCopy: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  material: string;
  seatingCapacity: string;
  availability: Availability;
  featured: boolean;
  badge: string;
  images: string[];
  primaryImage: string;
  highlights: string[];
  specifications: ProductSpecification[];
  faqs: FAQItem[];
  onlyFewLeft: boolean;
  isNew: boolean;
  bestSeller: boolean;
  deliveryEstimate: string;
  warranty: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Enquiry {
  id: string;
  type: EnquiryType;
  productId?: string;
  productName?: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  source: string;
  status: EnquiryStatus;
  createdAt: string;
}

export interface ProductDraft {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  material: string;
  seatingCapacity: string;
  availability: Availability;
  featured: boolean;
  image: string;
  createdAt: string;
}

export interface CategoryDraft {
  id: string;
  name: string;
  slug: string;
  folder?: string;
  description: string;
  bannerImage: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  active: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  featuredImage: string;
  tags: string[];
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
}

export interface TrustPoint {
  id: string;
  title: string;
  description: string;
  stat: string;
}

export interface Testimonial {
  id: string;
  name: string;
  city: string;
  quote: string;
  rating: number;
  image: string;
}

export interface InstagramShot {
  id: string;
  caption: string;
  image: string;
}

export interface HeroSlide {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
}

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  address: string;
  supportHours: string;
}
