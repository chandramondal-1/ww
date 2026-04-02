(function () {
  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  }

  function assetPath(folder, file) {
    return encodeURI("public/assets/catalog/" + folder + "/" + file);
  }

  function cleanProductName(fileName) {
    return String(fileName)
      .replace(/\.[^.]+$/, "")
      .replace(/\bw:o\b/gi, "without arm")
      .replace(/\bw arm\b/gi, "with arm")
      .replace(/\s+-\s+/g, " ")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function uniqueValues(values) {
    var map = {};
    return values.filter(function (value) {
      if (!value || map[value]) {
        return false;
      }
      map[value] = true;
      return true;
    });
  }

  function getMaterialTags(material) {
    var text = String(material || "").toLowerCase();
    var tags = [];

    if (/(rattan|wicker|weave|cane|\bpe\b)/.test(text)) {
      tags.push("rattan", "wicker");
    }

    if (/(wood|teak|acacia)/.test(text)) {
      tags.push("wood");
    }

    if (/(metal|aluminium|aluminum|steel|iron)/.test(text)) {
      tags.push("metal");
    }

    if (/(fabric|upholstery|cushion)/.test(text)) {
      tags.push("fabric");
    }

    return uniqueValues(tags);
  }

  function buildGalleryImages(folder, files, index) {
    if (!files || !files.length) {
      return [];
    }

    return uniqueValues(
      [files[index], files[(index + 1) % files.length], files[(index + 2) % files.length]].map(function (file) {
        return assetPath(folder, file);
      })
    );
  }

  function heroAsset(fileName) {
    return "assets/images/hero/" + fileName;
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(new Date(value));
  }

  function buildWhatsAppLink(phone, productName) {
    var message = productName
      ? "I am interested in " + productName + ". Please share pricing, lead time and catalogue details."
      : "Hello, I would like to know more about the Wicker & Weave collection.";
    return "https://wa.me/" + String(phone).replace(/\D/g, "") + "?text=" + encodeURIComponent(message);
  }

  function buildPhoneLink(phone) {
    return "tel:" + String(phone).replace(/\s+/g, "");
  }

  function categoryUrl(slug) {
    return "category.html?slug=" + encodeURIComponent(slug);
  }

  function productUrl(product) {
    return (
      "product.html?category=" +
      encodeURIComponent(product.categorySlug) +
      "&slug=" +
      encodeURIComponent(product.slug)
    );
  }

  function blogPostUrl(slug) {
    return "blog-post.html?slug=" + encodeURIComponent(slug);
  }

  var siteConfig = {
    name: "Wicker & Weave",
    tagline: "Exclusive Outdoor Furniture",
    description:
      "Luxury outdoor furniture catalog for modern homes, hospitality projects and premium terraces across India.",
    phone: "+91 70295 19022",
    whatsappNumber: "917029519022",
    email: "agaunny2000@gmail.com",
    address: "Jaipur Design Studio, Rajasthan, India",
    supportHours: "Mon-Sat - 10:00 AM to 7:00 PM"
  };

  var categoryBlueprints = [
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
      cardImageFit: "contain",
      cardImageScale: 1.02,
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
      cardImageFit: "contain",
      cardImageScale: 0.82,
      cardMediaBackground: "linear-gradient(180deg, #fffdf9 0%, #f6efe6 100%)",
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
        "Entertaining-focused bar furniture for terraces, clubhouses, rooftops and cafes.",
      bannerImage: assetPath("Bar Sets", "Martini.png"),
      accentFrom: "#312E81",
      accentTo: "#60A5FA",
      badge: "Entertainer Edit",
      cardImageFit: "contain",
      cardImageScale: 1.1,
      cardMediaBackground: "linear-gradient(180deg, #fffdf9 0%, #f6efe6 100%)",
      order: 8,
      heroStat: "Commercial friendly"
    }
  ];

  var productFiles = {
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

  var categoryCopy = {
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

  var priceBase = {
    "outdoor-sofa": 52999,
    "coffee-sets": 24999,
    "dining-sets": 44999,
    swings: 21999,
    loungers: 18999,
    sunbeds: 25999,
    umbrellas: 9999,
    "bar-sets": 28999
  };

  var priceStep = {
    "outdoor-sofa": 3200,
    "coffee-sets": 1800,
    "dining-sets": 2400,
    swings: 1400,
    loungers: 1200,
    sunbeds: 1600,
    umbrellas: 600,
    "bar-sets": 1900
  };

  var categories = categoryBlueprints.map(function (category, index) {
    return {
      id: "category_" + String(index + 1),
      origin: "seed",
      name: category.name,
      slug: category.slug,
      folder: category.folder,
      description: category.description,
      bannerImage: category.bannerImage,
      accentFrom: category.accentFrom,
      accentTo: category.accentTo,
      badge: category.badge,
      cardImageFit: category.cardImageFit,
      cardImageScale: category.cardImageScale,
      cardMediaBackground: category.cardMediaBackground,
      order: category.order,
      heroStat: category.heroStat
    };
  });

  var categoryMap = {};
  categories.forEach(function (category) {
    categoryMap[category.slug] = category;
  });

  var products = [];
  Object.keys(productFiles).forEach(function (categorySlug) {
    var category = categoryMap[categorySlug];
    var copy = categoryCopy[categorySlug];

    if (!category || !copy) {
      return;
    }

    productFiles[categorySlug].forEach(function (fileName, index) {
      var displayName = cleanProductName(fileName);
      var price = priceBase[categorySlug] + priceStep[categorySlug] * index;
      var originalPrice = Math.round(price * 1.22);
      var discountPercentage = Math.round(((originalPrice - price) / originalPrice) * 100);
      var rating = Number((4.3 + (index % 5) * 0.12).toFixed(1));
      var reviewCount = 24 + index * 9;
      var seatingCapacity;

      if (categorySlug === "dining-sets") {
        seatingCapacity = index > 11 ? "6 seater" : "4 seater";
      } else if (categorySlug === "outdoor-sofa") {
        seatingCapacity = ["4 seater", "5 seater", "6 seater"][index % 3];
      } else if (categorySlug === "coffee-sets") {
        seatingCapacity = "2 seater";
      } else if (categorySlug === "bar-sets") {
        seatingCapacity = ["2 seater", "4 seater"][index % 2];
      } else if (categorySlug === "umbrellas") {
        seatingCapacity = "Shade unit";
      } else {
        seatingCapacity = "1 seater";
      }

      var availability = index % 7 === 0 ? "Limited Stock" : index % 5 === 0 ? "Preorder" : "In Stock";
      var primaryImage = assetPath(category.folder, fileName);
      var productSlug = slugify(displayName) || category.slug + "-" + String(index + 1);
      var sku = "WW-" + category.slug.slice(0, 3).toUpperCase() + "-" + String(index + 1).padStart(3, "0");

      products.push({
        id: "product_" + category.slug + "_" + String(index + 1),
        origin: "seed",
        name: displayName,
        slug: productSlug,
        sku: sku,
        categoryId: category.id,
        categorySlug: category.slug,
        categoryName: category.name,
        tagline: category.name + " crafted for premium Indian outdoor living.",
        description:
          displayName +
          " is part of the " +
          category.name +
          " collection by Wicker & Weave, built to bring hotel-style comfort to private homes, terraces, gardens and hospitality lounges.",
        marketingCopy:
          displayName +
          " combines refined silhouette, weather-ready materials and an easy-luxury finish so your outdoor space feels intentional, polished and ready to host.",
        price: price,
        originalPrice: originalPrice,
        discountPercentage: discountPercentage,
        rating: rating,
        reviewCount: reviewCount,
        material: copy.material,
        materialTags: getMaterialTags(copy.material),
        seatingCapacity: seatingCapacity,
        availability: availability,
        featured: index < 4 || (categorySlug === "swings" && index < 6),
        badge: index % 6 === 0 ? "Trending" : index % 4 === 0 ? "Best Seller" : discountPercentage > 16 ? "Deal" : "New Launch",
        images: buildGalleryImages(category.folder, productFiles[categorySlug], index),
        primaryImage: primaryImage,
        highlights: copy.highlights.slice(),
        specifications: [
          { label: "Material", value: copy.material },
          { label: "Seating Capacity", value: seatingCapacity },
          { label: "Warranty", value: copy.warranty },
          { label: "Lead Time", value: copy.leadTime },
          { label: "Finish", value: "UV-stable, handwoven outdoor finish" }
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
        seoTitle: displayName + " | " + category.name + " by Wicker & Weave",
        seoDescription:
          displayName +
          " from the " +
          category.name +
          " collection. Explore dimensions, highlights, project-ready pricing and quotation support from Wicker & Weave."
      });
    });
  });

  var heroSlides = [
    {
      id: "hero_1",
      eyebrow: "Quiet Luxury Living",
      title: "Designer comfort that makes the room feel instantly elevated.",
      subtitle:
        "Explore refined sofas, lounge furniture and statement pieces presented like a private showroom, with enquiry-first buying made simple.",
      image: heroAsset("premium-living-4.png"),
      ctaPrimary: { label: "Explore Collection", href: "shop.html" },
      ctaSecondary: { label: "Request Quote", href: "contact.html" },
      badges: ["Full-screen showroom look", "Pan India delivery", "Quotation in 24 hrs"],
      highlights: [
        "Warm neutral styling that feels premium from the first glance",
        "Made for villas, penthouses, lounges and design-forward homes",
        "Move from inspiration to quote without cart or checkout friction"
      ],
      stats: [
        { value: "120+", label: "signature designs" },
        { value: "24 hrs", label: "quote response target" },
        { value: "3 yrs", label: "coverage support" }
      ],
      spotlightLabel: "Living room signature",
      spotlightTitle: "Soft-tone statement sofa",
      spotlightCopy: "Balanced proportions, tactile upholstery and a calm architectural mood.",
      spotlightHref: productUrl({ categorySlug: "outdoor-sofa", slug: "haven" }),
      offerBadge: "Curated hero edit",
      trustLine: "Made for refined homes, villas, penthouses and hospitality interiors."
    },
    {
      id: "hero_2",
      eyebrow: "Modern Interior Story",
      title: "Furniture styled like a premium editorial spread, ready for your space.",
      subtitle:
        "A cleaner catalog experience for buyers who want strong visuals, clear details and fast support on WhatsApp, call or quotation.",
      image: heroAsset("premium-living-1.avif"),
      ctaPrimary: { label: "Shop by Category", href: "categories.html" },
      ctaSecondary: { label: "Get Catalog PDF", href: "catalog.html" },
      badges: ["Editorial styling", "Premium browsing", "Fast lead capture"],
      highlights: [
        "Full-size scenes that help products feel aspirational and premium",
        "A luxury look that still keeps ecommerce clarity and conversion cues",
        "Easy for homeowners, architects and hospitality buyers to shortlist"
      ],
      stats: [
        { value: "300+", label: "catalog pieces" },
        { value: "28", label: "states served" },
        { value: "1 click", label: "whatsapp connect" }
      ],
      spotlightLabel: "Interior-focused visual",
      spotlightTitle: "Soft modern seating story",
      spotlightCopy: "A premium composition built around texture, calm light and sculpted form.",
      spotlightHref: productUrl({ categorySlug: "dining-sets", slug: "ww-44-4-chair-1-table" }),
      offerBadge: "Premium styling",
      trustLine: "Built to feel high-end, clean and conversion-ready across desktop and mobile."
    },
    {
      id: "hero_3",
      eyebrow: "Architectural Comfort",
      title: "Spaces that feel layered, tactile and quietly luxurious.",
      subtitle:
        "From sofa statements to dining and lounge pieces, discover a catalog crafted to look more like a luxury brand campaign than a generic grid.",
      image: heroAsset("premium-living-2.avif"),
      ctaPrimary: { label: "Browse Best Sellers", href: "shop.html?sort=popular" },
      ctaSecondary: { label: "Talk to Expert", href: "contact.html" },
      badges: ["Architect-ready", "Luxury textures", "Premium presentation"],
      highlights: [
        "Designed to help every hero image land with more atmosphere and depth",
        "Useful for projects where the first impression needs to feel elevated",
        "Perfect for premium homes, studios, showrooms and design consultations"
      ],
      stats: [
        { value: "4.8/5", label: "average ratings" },
        { value: "60%", label: "seasonal savings" },
        { value: "100K+", label: "happy buyers" }
      ],
      spotlightLabel: "Comfort-led moodboard",
      spotlightTitle: "Layered living composition",
      spotlightCopy: "A showroom-style frame that helps the catalog feel richer and more cinematic.",
      spotlightHref: "shop.html?sort=featured",
      offerBadge: "Luxury look",
      trustLine: "Built for stronger first impressions, richer storytelling and faster enquiries."
    },
    {
      id: "hero_4",
      eyebrow: "Curated Catalogue Experience",
      title: "A full-width premium banner that moves like a luxury storefront.",
      subtitle:
        "The hero now side-slides automatically, holds focus on full-size imagery and keeps quotation, WhatsApp and catalog access close to the first interaction.",
      image: heroAsset("premium-living-3.avif"),
      ctaPrimary: { label: "View All Products", href: "shop.html" },
      ctaSecondary: { label: "Open WhatsApp", href: buildWhatsAppLink(siteConfig.whatsappNumber) },
      badges: ["Auto side slider", "Full-size imagery", "Luxury-first UI"],
      highlights: [
        "Clean motion every 2.3 seconds for a polished banner experience",
        "Large-format imagery that gives the site a high-end campaign feel",
        "Direct conversion paths without interrupting the visual storytelling"
      ],
      stats: [
        { value: "2.3 sec", label: "auto slide timing" },
        { value: "Full size", label: "hero imagery" },
        { value: "90+", label: "premium ui score" }
      ],
      spotlightLabel: "Hero experience",
      spotlightTitle: "Side-sliding luxury banner",
      spotlightCopy: "Designed to feel immersive first, while staying sharp, readable and sales-focused.",
      spotlightHref: "shop.html",
      offerBadge: "New hero",
      trustLine: "A premium landing experience with bigger imagery and smoother rhythm."
    }
  ];

  var trustPoints = [
    {
      id: "trust_1",
      title: "Premium quality",
      description: "Hand-finished outdoor collections with hotel-style detailing.",
      stat: "300+ designs"
    },
    {
      id: "trust_2",
      title: "100K+ customers",
      description: "Trusted by homeowners, cafes, villas and hospitality teams.",
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

  var testimonials = [
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

  var instagramShots = [
    { id: "insta_1", caption: "Terrace-ready hosting corners", image: assetPath("Coffee Sets", "Wave.png") },
    { id: "insta_2", caption: "Modern outdoor dining", image: assetPath("Dining Sets", "WW-50 (4 chair + 1 table).png") },
    { id: "insta_3", caption: "Statement swing zones", image: assetPath("Swings", "Knight.png") },
    { id: "insta_4", caption: "Poolside calm", image: assetPath("Loungers", "Zen.png") },
    { id: "insta_5", caption: "Shade-led outdoor dining", image: assetPath("Umbrella", "WW- U1 (Beige).png") },
    { id: "insta_6", caption: "Luxury seating stories", image: assetPath("Sofa Sets", "Skyline.png") }
  ];

  var seedBanners = [
    {
      id: "banner_1",
      origin: "seed",
      title: "Summer Sale - Up to 60% OFF",
      subtitle: "Luxury outdoor living, priced for faster decisions.",
      image: assetPath("Sofa Sets", "Vista.png"),
      ctaLabel: "Shop Featured",
      ctaHref: "shop.html?sort=featured",
      active: true
    },
    {
      id: "banner_2",
      origin: "seed",
      title: "Talk to our furniture expert",
      subtitle: "Get project pricing, finish support and fast quotation guidance.",
      image: assetPath("Swings", "Melody.png"),
      ctaLabel: "Request Quote",
      ctaHref: "contact.html",
      active: true
    }
  ];

  var blogPosts = [
    {
      id: "blog_1",
      origin: "seed",
      title: "How to choose luxury outdoor furniture for Indian weather",
      slug: "choose-outdoor-furniture-indian-weather",
      excerpt:
        "A practical guide to selecting weather-ready wicker, cushions and finishes without compromising on style.",
      body:
        "Luxury outdoor furniture should look refined, but it also needs to withstand heat, humidity and regular use.\n\nStart with an all-weather frame, ask for UV-ready weave quality and check if cushions are designed for faster drying. For terraces and rooftops, modular sofa sets and compact coffee sets usually deliver the best layout flexibility.\n\nFor hospitality projects, dining collections and loungers should balance comfort with easy maintenance. Wicker & Weave recommends choosing by space usage first, then by finish, then by quotation lead time.",
      featuredImage: assetPath("Sofa Sets", "Cascade.png"),
      tags: ["Outdoor Furniture", "Buying Guide", "Luxury Living"],
      publishedAt: "2026-03-14T09:00:00.000Z",
      seoTitle: "How to choose luxury outdoor furniture in India | Wicker & Weave",
      seoDescription:
        "Learn how to choose outdoor furniture for Indian weather, from wicker quality and cushions to layouts and maintenance."
    },
    {
      id: "blog_2",
      origin: "seed",
      title: "Outdoor dining set ideas for terraces, lawns and cafes",
      slug: "outdoor-dining-set-ideas",
      excerpt:
        "See how to style outdoor dining collections for homes, hospitality projects and compact entertaining spaces.",
      body:
        "Outdoor dining should feel effortless.\n\nFour-seater sets work beautifully for balconies and compact terraces, while six-seater formats suit lawns and weekend hosting. Layer umbrellas for shade, choose material palettes that complement surrounding flooring and make sure table surfaces are easy to clean.\n\nFor cafes and project work, stackable or low-maintenance frames are a practical win. The right dining set turns underused space into a destination for everyday living.",
      featuredImage: assetPath("Dining Sets", "WW-43 (6 chair + 1 table)s.png"),
      tags: ["Dining Sets", "Outdoor Styling", "Hospitality"],
      publishedAt: "2026-03-18T09:00:00.000Z",
      seoTitle: "Outdoor dining set ideas for terraces and cafes | Wicker & Weave",
      seoDescription:
        "Explore layout and styling ideas for luxury outdoor dining collections across homes, lawns and commercial spaces."
    },
    {
      id: "blog_3",
      origin: "seed",
      title: "Why hanging swings are the statement piece of 2026",
      slug: "hanging-swings-statement-piece-2026",
      excerpt:
        "Designer swings are reshaping outdoor corners, lounge spaces and even indoor reading nooks.",
      body:
        "Few pieces add personality as quickly as a sculptural swing.\n\nThey photograph beautifully, create a defined relaxation spot and bring softness to architectural outdoor settings. When selecting one, check the base stability, the comfort of the seat cushion and the clearance needed around the frame.\n\nNeutral wicker tones keep the look versatile, while bold cushions help the swing act as a focal point.",
      featuredImage: assetPath("Swings", "Saturn.png"),
      tags: ["Swings", "Trends", "Luxury Decor"],
      publishedAt: "2026-03-22T09:00:00.000Z",
      seoTitle: "Hanging swing design trend 2026 | Wicker & Weave",
      seoDescription:
        "Discover why hanging swings are becoming a statement piece for luxury terraces, patios and indoor-outdoor spaces."
    }
  ];

  var popularSearches = [
    "4 seater dining set",
    "hanging wicker swing",
    "outdoor sofa set",
    "poolside lounger",
    "garden umbrella"
  ];

  window.WW_DATA = {
    siteConfig: siteConfig,
    categories: categories,
    products: products,
    heroSlides: heroSlides,
    trustPoints: trustPoints,
    testimonials: testimonials,
    instagramShots: instagramShots,
    banners: seedBanners,
    blogPosts: blogPosts,
    popularSearches: popularSearches,
    slugify: slugify,
    assetPath: assetPath,
    cleanProductName: cleanProductName,
    getMaterialTags: getMaterialTags,
    formatCurrency: formatCurrency,
    formatDate: formatDate,
    buildWhatsAppLink: buildWhatsAppLink,
    buildPhoneLink: buildPhoneLink,
    categoryUrl: categoryUrl,
    productUrl: productUrl,
    blogPostUrl: blogPostUrl
  };
})();
