import {
  Banner,
  BlogPost,
  Category,
  HeroSlide,
  InstagramShot,
  Product,
  Testimonial,
  TrustPoint,
  SiteConfig
} from "@/lib/types";
import { assetPath, cleanProductName, slugify } from "@/lib/utils";

const CATEGORY_BLUEPRINTS: Omit<Category, "id">[] = [
  {
    name: "Outdoor Sofa",
    slug: "outdoor-sofa",
    folder: "Sofa Sets",
    description:
      "Signature all-weather sofa sets designed for terraces, lawns and premium outdoor lounges.",
    bannerImage: assetPath("Sofa Sets", "Haven.png"),
    accentFrom: "#2874F0",
    accentTo: "#00C6FF",
    badge: "Top Seller",
    order: 1,
    heroStat: "48-hour quote turnaround"
  },
  {
    name: "Coffee Sets",
    slug: "coffee-sets",
    folder: "Coffee Sets",
    description:
      "Compact conversation sets curated for balconies, patios and hospitality corners.",
    bannerImage: assetPath("Coffee Sets", "Ivan.png"),
    accentFrom: "#0F4C81",
    accentTo: "#38BDF8",
    badge: "Luxury Pick",
    order: 2,
    heroStat: "Best for balconies"
  },
  {
    name: "Dining Sets",
    slug: "dining-sets",
    folder: "Dining Sets",
    description:
      "Premium outdoor dining collections crafted for family gatherings and resort projects.",
    bannerImage: assetPath("Dining Sets", "WW-44 (4 chair + 1 table).png"),
    accentFrom: "#1F2937",
    accentTo: "#2874F0",
    badge: "Family Favorite",
    order: 3,
    heroStat: "Resort-ready finishes"
  },
  {
    name: "Hanging Swings",
    slug: "swings",
    folder: "Swings",
    description:
      "Statement wicker swings that create a sculptural lounge moment indoors or outdoors.",
    bannerImage: assetPath("Swings", "Saturn.png"),
    accentFrom: "#243B53",
    accentTo: "#0EA5E9",
    badge: "Statement Design",
    order: 4,
    heroStat: "Designer silhouettes"
  },
  {
    name: "Loungers",
    slug: "loungers",
    folder: "Loungers",
    description:
      "Sun-chasing loungers with plush comfort, easy maintenance and hotel-grade detailing.",
    bannerImage: assetPath("Loungers", "Zen.png"),
    accentFrom: "#14532D",
    accentTo: "#10B981",
    badge: "Poolside Ready",
    order: 5,
    heroStat: "UV-ready cushions"
  },
  {
    name: "Sunbeds",
    slug: "sunbeds",
    folder: "Sunbeds",
    description:
      "Long-form relaxation pieces designed for rooftops, poolsides and luxury staycations.",
    bannerImage: assetPath("Sunbeds", "Glade.png"),
    accentFrom: "#92400E",
    accentTo: "#F59E0B",
    badge: "Resort Standard",
    order: 6,
    heroStat: "Hospitality grade"
  },
  {
    name: "Umbrellas",
    slug: "umbrellas",
    folder: "Umbrella",
    description:
      "High coverage outdoor umbrellas built to complete shaded dining and lounge spaces.",
    bannerImage: assetPath("Umbrella", "WW- U1 (Beige).png"),
    accentFrom: "#7C2D12",
    accentTo: "#FB923C",
    badge: "Shade Essential",
    order: 7,
    heroStat: "Wind-stable build"
  },
  {
    name: "Bar Sets",
    slug: "bar-sets",
    folder: "Bar Sets",
    description:
      "Entertaining-focused bar furniture for terraces, clubhouses, rooftops and cafés.",
    bannerImage: assetPath("Bar Sets", "Martini.png"),
    accentFrom: "#312E81",
    accentTo: "#60A5FA",
    badge: "Entertainer Edit",
    order: 8,
    heroStat: "Commercial friendly"
  }
];

const PRODUCT_FILES: Record<string, string[]> = {
  "outdoor-sofa": [
    "Haven.png",
    "Vista.png",
    "Meadow.png",
    "Horizon.png",
    "Cascade.png",
    "Alipine.png",
    "Solstice.png",
    "Breeze.png",
    "Ember.png",
    "Enden.png",
    "Skyline.png",
    "Summit.png"
  ],
  "coffee-sets": [
    "Ivan.png",
    "WW-09 (2 chair + 1 table).png",
    "Qube.png",
    "WW-05 (2 chair + 1 table).png",
    "WW-08 (2 Chair + 1 table).png",
    "Wave.png",
    "Cairo.png",
    "WW-43 (2 chair + 1 table).png",
    "Nest.png",
    "WW-12 ( 2 Chair + 1 table).png",
    "WW-12 (2 Chair +1 table).png",
    "Egg.png"
  ],
  "dining-sets": [
    "WW-44 (4 chair + 1 table).png",
    "WW-69 (4 chair + 1 table).png",
    "WW-57 (4 chair + 1 table).png",
    "WW-08B (4 chair + 1 table).png",
    "WW-50 (4 chair + 1 table).png",
    "WW-26 w arm (4 chair + 1 table).png",
    "WW-43 (4 chair + 1 table).png",
    "WW-26 w:o arm (4 chair + 1 table).png",
    "WW-08 (4 chair + 1 table).png",
    "WW-12 (4 chair + 1 table).png",
    "WW-12 (4 chair + 1 table)s.png",
    "WW-63 (4 chair + 1 table).png",
    "WW-43 (6 chair + 1 table)r.png",
    "WW-26 (6 chair + 1 table).png",
    "WW-43 (6 chair + 1 table)s.png",
    "WW-43 Net (6 chair + 1 table).png",
    "WW-09 (4 chair + 1 table).png",
    "WW-15 (4 chair + 1 table).png"
  ],
  swings: [
    "Spoon.png",
    "Celestial -01.png",
    "Spider.png",
    "Celestial -02.png",
    "Sway.png",
    "Double Seater-01.png",
    "Double Seater-02.png",
    "Vortex.png",
    "Knight.png",
    "Avocado.png",
    "Melody.png",
    "Glide.png",
    "Spider HR.png",
    "Saturn.png"
  ],
  loungers: ["Bean.png", "Melt.png", "Fuse.png", "Curve.png", "Zen.png", "Plush.png"],
  sunbeds: ["Glade.png", "Oasis.png", "Echo.png", "Bloom.png"],
  umbrellas: ["WW- U3 (Green).png", "WW- U1 (Beige).png", "WW - U1 (Maroon) .png", "WW- U2 (Green).png"],
  "bar-sets": [
    "Riveria.png",
    "Brew-02.png",
    "Brew-01.png",
    "Bubble.png",
    "Martini.png",
    "Noble.png",
    "Pacific.png",
    "Bistro.png",
    "Serving Cart-01.png",
    "Autumn.png",
    "Vatican.png",
    "Canvas.png"
  ]
};

const CATEGORY_COPY: Record<
  string,
  {
    material: string;
    highlights: string[];
    leadTime: string;
    warranty: string;
  }
> = {
  "outdoor-sofa": {
    material: "All-weather wicker with powder-coated aluminium frame",
    highlights: ["Weather resistant weave", "Deep comfort cushions", "Low-maintenance luxury"],
    leadTime: "7-14 business days",
    warranty: "3 year structural warranty"
  },
  "coffee-sets": {
    material: "Wicker weave with tempered glass tops",
    highlights: ["Balcony-sized footprint", "Premium weave texture", "Easy-clean surfaces"],
    leadTime: "5-10 business days",
    warranty: "2 year warranty"
  },
  "dining-sets": {
    material: "PE rattan weave with coated metal under-structure",
    highlights: ["Hospitality-grade finish", "Family dining comfort", "Suitable for outdoor projects"],
    leadTime: "7-16 business days",
    warranty: "3 year structural warranty"
  },
  swings: {
    material: "Designer wicker shell with cushioned seat pads",
    highlights: ["Statement silhouette", "Comfort-first seating", "Indoor-outdoor flexibility"],
    leadTime: "7-12 business days",
    warranty: "2 year warranty"
  },
  loungers: {
    material: "Sun-safe woven body with premium outdoor upholstery",
    highlights: ["Resort-inspired comfort", "Quick-dry cushions", "Modern sculpted profiles"],
    leadTime: "5-10 business days",
    warranty: "2 year warranty"
  },
  sunbeds: {
    material: "Outdoor-grade wicker with corrosion-resistant frame",
    highlights: ["Poolside built", "Relaxed recline geometry", "Fade-resistant finishing"],
    leadTime: "6-12 business days",
    warranty: "2 year warranty"
  },
  umbrellas: {
    material: "Outdoor canopy with reinforced support arm",
    highlights: ["High coverage shade", "UV-ready fabric", "Strong outdoor base support"],
    leadTime: "4-8 business days",
    warranty: "1 year warranty"
  },
  "bar-sets": {
    material: "Premium wicker shell with elevated dining frames",
    highlights: ["Entertaining-focused design", "Indoor-outdoor placement", "Commercial friendly"],
    leadTime: "6-12 business days",
    warranty: "2 year warranty"
  }
};

const PRICE_BASE: Record<string, number> = {
  "outdoor-sofa": 52999,
  "coffee-sets": 24999,
  "dining-sets": 44999,
  swings: 21999,
  loungers: 18999,
  sunbeds: 25999,
  umbrellas: 9999,
  "bar-sets": 28999
};

const PRICE_STEP: Record<string, number> = {
  "outdoor-sofa": 3200,
  "coffee-sets": 1800,
  "dining-sets": 2400,
  swings: 1400,
  loungers: 1200,
  sunbeds: 1600,
  umbrellas: 600,
  "bar-sets": 1900
};

export const siteConfig: SiteConfig = {
  name: "SUN SEATINGS",
  tagline: "Exclusive Outdoor Furniture",
  description:
    "Luxury outdoor furniture catalog for modern homes, hospitality projects and premium terraces across India.",
  phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "+91 70295 19022",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "917029519022",
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "agaunny2000@gmail.com",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL || "https://www.instagram.com/sunseatings",
  facebookUrl:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    "https://www.facebook.com/profile.php?id=61580987248000",
  address: process.env.NEXT_PUBLIC_SHOWROOM_ADDRESS || "PCM Tower, Sevoke Road, Siliguri 734001",
  supportHours: process.env.NEXT_PUBLIC_SUPPORT_HOURS || "Mon-Sat - 10:00 AM to 7:00 PM"
};

export const categories: Category[] = CATEGORY_BLUEPRINTS.map((category, index) => ({
  ...category,
  id: `category_${index + 1}`
}));

const categoryMap = new Map(categories.map((category) => [category.slug, category]));

export const products: Product[] = Object.entries(PRODUCT_FILES).flatMap(([categorySlug, files]) => {
  const category = categoryMap.get(categorySlug);
  const copy = CATEGORY_COPY[categorySlug];

  if (!category || !copy) {
    return [];
  }

  return files.map((file, index) => {
    const displayName = cleanProductName(file);
    const price = PRICE_BASE[categorySlug] + PRICE_STEP[categorySlug] * index;
    const originalPrice = Math.round(price * 1.22);
    const discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
    const rating = Number((4.3 + (index % 5) * 0.12).toFixed(1));
    const reviewCount = 24 + index * 9;
    const seatingCapacity =
      categorySlug === "dining-sets"
        ? index > 11
          ? "6 seater"
          : "4 seater"
        : categorySlug === "outdoor-sofa"
          ? ["4 seater", "5 seater", "6 seater"][index % 3]
          : categorySlug === "coffee-sets"
            ? "2 seater"
            : categorySlug === "bar-sets"
              ? ["2 seater", "4 seater"][index % 2]
              : categorySlug === "umbrellas"
                ? "Shade unit"
                : "1 seater";

    const availability =
      index % 7 === 0 ? "Limited Stock" : index % 5 === 0 ? "Preorder" : "In Stock";

    const primaryImage = assetPath(category.folder, file);
    const titleSlug = slugify(displayName);
    const productSlug = titleSlug || `${category.slug}-${index + 1}`;
    const sku = `WW-${category.slug.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, "0")}`;

    return {
      id: `product_${category.slug}_${index + 1}`,
      name: displayName,
      slug: productSlug,
      sku,
      categoryId: category.id,
      categorySlug: category.slug,
      categoryName: category.name,
      tagline: `${category.name} crafted for premium Indian outdoor living.`,
      description: `${displayName} is part of the ${category.name} collection by SUN SEATINGS, built to bring hotel-style comfort to private homes, terraces, gardens and hospitality lounges.`,
      marketingCopy: `${displayName} combines refined silhouette, weather-ready materials and an easy-luxury finish so your outdoor space feels intentional, polished and ready to host.`,
      price,
      originalPrice,
      discountPercentage,
      rating,
      reviewCount,
      material: copy.material,
      seatingCapacity,
      availability,
      featured: index < 4 || (categorySlug === "swings" && index < 6),
      badge:
        index % 6 === 0 ? "Trending" : index % 4 === 0 ? "Best Seller" : discountPercentage > 16 ? "Deal" : "New Launch",
      images: [primaryImage, primaryImage, primaryImage],
      primaryImage,
      highlights: copy.highlights,
      specifications: [
        {
          label: "Material",
          value: copy.material
        },
        {
          label: "Seating Capacity",
          value: seatingCapacity
        },
        {
          label: "Warranty",
          value: copy.warranty
        },
        {
          label: "Lead Time",
          value: copy.leadTime
        },
        {
          label: "Finish",
          value: "UV-stable, handwoven outdoor finish"
        }
      ],
      faqs: [
        {
          question: "Can this be used outdoors through the year?",
          answer:
            "Yes. The structure is intended for outdoor use, though we recommend covers during heavy rain or non-use for maximum life."
        },
        {
          question: "Do you offer Pan India delivery?",
          answer:
            "Yes. Delivery and installation support can be arranged across major Indian cities and project locations."
        },
        {
          question: "Can I request a project quotation?",
          answer:
            "Absolutely. Use the Request Quote CTA and our team will respond with pricing, lead time and bulk-order support."
        }
      ],
      onlyFewLeft: index % 4 === 0,
      isNew: index < 2,
      bestSeller: index % 3 === 0,
      deliveryEstimate: copy.leadTime,
      warranty: copy.warranty,
      seoTitle: `${displayName} | ${category.name} by SUN SEATINGS`,
      seoDescription: `${displayName} from the ${category.name} collection. Explore dimensions, highlights, project-ready pricing and quotation support from SUN SEATINGS.`
    };
  });
});

export const heroSlides: HeroSlide[] = [
  {
    id: "hero_1",
    eyebrow: "Summer Sale • Up to 60% OFF",
    title: "Luxury outdoor furniture with a premium marketplace feel.",
    subtitle:
      "Discover statement sofa sets, dining collections and designer swings that elevate terraces, lawns and hospitality spaces.",
    image: assetPath("Sofa Sets", "Haven.png"),
    ctaPrimary: {
      label: "Explore Collection",
      href: "/shop"
    },
    ctaSecondary: {
      label: "Get Catalog PDF",
      href: "/catalog"
    }
  },
  {
    id: "hero_2",
    eyebrow: "Hospitality-grade craftsmanship",
    title: "Resort-inspired dining and lounge pieces for modern Indian homes.",
    subtitle:
      "Built with all-weather materials, fast quotation support and a full-service catalogue experience for buyers and architects.",
    image: assetPath("Dining Sets", "WW-44 (4 chair + 1 table).png"),
    ctaPrimary: {
      label: "Shop by Category",
      href: "/categories"
    },
    ctaSecondary: {
      label: "Talk to Expert",
      href: "/contact"
    }
  },
  {
    id: "hero_3",
    eyebrow: "Designer silhouettes",
    title: "Signature swings and loungers that turn quiet corners into destination spaces.",
    subtitle:
      "From statement hanging chairs to poolside loungers, every collection is designed to feel elevated, comfortable and instantly share-worthy.",
    image: assetPath("Swings", "Saturn.png"),
    ctaPrimary: {
      label: "Browse Swings",
      href: "/categories/swings"
    },
    ctaSecondary: {
      label: "Request Quote",
      href: "/contact"
    }
  }
];

export const trustPoints: TrustPoint[] = [
  {
    id: "trust_1",
    title: "Premium quality",
    description: "Hand-finished outdoor collections with hotel-style detailing.",
    stat: "300+ designs"
  },
  {
    id: "trust_2",
    title: "100K+ customers",
    description: "Trusted by homeowners, cafés, villas and hospitality teams.",
    stat: "100K+ happy buyers"
  },
  {
    id: "trust_3",
    title: "Pan India delivery",
    description: "End-to-end assistance with quote, dispatch and support.",
    stat: "28 states served"
  },
  {
    id: "trust_4",
    title: "Warranty backed",
    description: "Coverage on structure and support from a responsive team.",
    stat: "Up to 3 years"
  }
];

export const testimonials: Testimonial[] = [
  {
    id: "testimonial_1",
    name: "Ritika Sharma",
    city: "Gurugram",
    quote:
      "The catalogue felt like a premium marketplace, but the quotation support was far more personal. Our terrace set arrived exactly as promised.",
    rating: 5,
    image: assetPath("Coffee Sets", "Ivan.png")
  },
  {
    id: "testimonial_2",
    name: "Aman Khanna",
    city: "Pune",
    quote:
      "We shortlisted a dining set, raised an enquiry and got finish options, dimensions and delivery guidance within a day. Smooth experience.",
    rating: 5,
    image: assetPath("Dining Sets", "WW-69 (4 chair + 1 table).png")
  },
  {
    id: "testimonial_3",
    name: "Leena Batra",
    city: "Jaipur",
    quote:
      "The swing looks stunning in our patio. The detail page answered almost everything and the team handled the rest on WhatsApp.",
    rating: 5,
    image: assetPath("Swings", "Sway.png")
  }
];

export const instagramShots: InstagramShot[] = [
  {
    id: "insta_1",
    caption: "Terrace-ready hosting corners",
    image: assetPath("Coffee Sets", "Wave.png")
  },
  {
    id: "insta_2",
    caption: "Modern outdoor dining",
    image: assetPath("Dining Sets", "WW-50 (4 chair + 1 table).png")
  },
  {
    id: "insta_3",
    caption: "Statement swing zones",
    image: assetPath("Swings", "Knight.png")
  },
  {
    id: "insta_4",
    caption: "Poolside calm",
    image: assetPath("Loungers", "Zen.png")
  },
  {
    id: "insta_5",
    caption: "Shade-led outdoor dining",
    image: assetPath("Umbrella", "WW- U1 (Beige).png")
  },
  {
    id: "insta_6",
    caption: "Luxury seating stories",
    image: assetPath("Sofa Sets", "Skyline.png")
  }
];

export const seedBanners: Banner[] = [
  {
    id: "banner_1",
    title: "Summer Sale • Up to 60% OFF",
    subtitle: "Luxury outdoor living, priced for faster decisions.",
    image: assetPath("Sofa Sets", "Vista.png"),
    ctaLabel: "Shop Featured",
    ctaHref: "/shop?sort=featured",
    active: true
  },
  {
    id: "banner_2",
    title: "Talk to our furniture expert",
    subtitle: "Get project pricing, finish support and fast quotation guidance.",
    image: assetPath("Swings", "Melody.png"),
    ctaLabel: "Request Quote",
    ctaHref: "/contact",
    active: true
  }
];

export const seedBlogPosts: BlogPost[] = [
  {
    id: "blog_1",
    title: "How to choose luxury outdoor furniture for Indian weather",
    slug: "choose-outdoor-furniture-indian-weather",
    excerpt:
      "A practical guide to selecting weather-ready wicker, cushions and finishes without compromising on style.",
    body:
      "Luxury outdoor furniture should look refined, but it also needs to withstand heat, humidity and regular use. Start with an all-weather frame, ask for UV-ready weave quality and check if cushions are designed for faster drying. For terraces and rooftops, modular sofa sets and compact coffee sets usually deliver the best layout flexibility. For hospitality projects, dining collections and loungers should balance comfort with easy maintenance. SUN SEATINGS recommends choosing by space usage first, then by finish, then by quotation lead time.",
    featuredImage: assetPath("Sofa Sets", "Cascade.png"),
    tags: ["Outdoor Furniture", "Buying Guide", "Luxury Living"],
    publishedAt: "2026-03-14T09:00:00.000Z",
    seoTitle: "How to choose luxury outdoor furniture in India | SUN SEATINGS",
    seoDescription:
      "Learn how to choose outdoor furniture for Indian weather, from wicker quality and cushions to layouts and maintenance."
  },
  {
    id: "blog_2",
    title: "Outdoor dining set ideas for terraces, lawns and cafés",
    slug: "outdoor-dining-set-ideas",
    excerpt:
      "See how to style outdoor dining collections for homes, hospitality projects and compact entertaining spaces.",
    body:
      "Outdoor dining should feel effortless. Four-seater sets work beautifully for balconies and compact terraces, while six-seater formats suit lawns and weekend hosting. Layer umbrellas for shade, choose material palettes that complement surrounding flooring and make sure table surfaces are easy to clean. For cafés and project work, stackable or low-maintenance frames are a practical win. The right dining set turns underused space into a destination for everyday living.",
    featuredImage: assetPath("Dining Sets", "WW-43 (6 chair + 1 table)s.png"),
    tags: ["Dining Sets", "Outdoor Styling", "Hospitality"],
    publishedAt: "2026-03-18T09:00:00.000Z",
    seoTitle: "Outdoor dining set ideas for terraces and cafés | SUN SEATINGS",
    seoDescription:
      "Explore layout and styling ideas for luxury outdoor dining collections across homes, lawns and commercial spaces."
  },
  {
    id: "blog_3",
    title: "Why hanging swings are the statement piece of 2026",
    slug: "hanging-swings-statement-piece-2026",
    excerpt:
      "Designer swings are reshaping outdoor corners, lounge spaces and even indoor reading nooks.",
    body:
      "Few pieces add personality as quickly as a sculptural swing. They photograph beautifully, create a defined relaxation spot and bring softness to architectural outdoor settings. When selecting one, check the base stability, the comfort of the seat cushion and the clearance needed around the frame. Neutral wicker tones keep the look versatile, while bold cushions help the swing act as a focal point.",
    featuredImage: assetPath("Swings", "Saturn.png"),
    tags: ["Swings", "Trends", "Luxury Decor"],
    publishedAt: "2026-03-22T09:00:00.000Z",
    seoTitle: "Hanging swing design trend 2026 | SUN SEATINGS",
    seoDescription:
      "Discover why hanging swings are becoming a statement piece for luxury terraces, patios and indoor-outdoor spaces."
  }
];

export const popularSearches = [
  "4 seater dining set",
  "hanging wicker swing",
  "outdoor sofa set",
  "poolside lounger",
  "garden umbrella"
];
