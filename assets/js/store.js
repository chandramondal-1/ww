(function () {
  var DATA = window.WW_DATA;

  var STORAGE_KEYS = {
    products: "ww_custom_products",
    categories: "ww_custom_categories",
    enquiries: "ww_enquiries",
    banners: "ww_custom_banners",
    blogPosts: "ww_custom_blog_posts",
    adminSession: "ww_admin_session"
  };

  function read(key, fallback) {
    try {
      var raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  function createId(prefix) {
    return prefix + "_" + Math.random().toString(36).slice(2, 10);
  }

  function cleanString(value) {
    return String(value == null ? "" : value).trim();
  }

  function toNumber(value) {
    var number = Number(value);
    return Number.isFinite(number) ? number : 0;
  }

  function normalizeImageList(images, fallbackImages) {
    var list = Array.isArray(images)
      ? images
      : String(images || "")
          .split(",")
          .map(function (item) {
            return cleanString(item);
          });

    var map = {};
    var normalized = list.filter(function (item) {
      if (!item || map[item]) {
        return false;
      }
      map[item] = true;
      return true;
    });

    if (normalized.length) {
      return normalized;
    }

    return (fallbackImages || []).filter(Boolean);
  }

  function ensureRequired(value, label) {
    if (!cleanString(value)) {
      throw new Error(label + " is required.");
    }
  }

  function createUniqueSlug(slug, entries, matcher) {
    var candidate = DATA.slugify(cleanString(slug));
    var baseSlug = candidate || "item";
    var nextSlug = baseSlug;
    var suffix = 2;

    while (
      entries.some(function (entry) {
        return matcher(entry, nextSlug);
      })
    ) {
      nextSlug = baseSlug + "-" + String(suffix);
      suffix += 1;
    }

    return nextSlug;
  }

  function normalizeCustomCategory(draft, index) {
    return {
      id: draft.id,
      origin: "custom",
      name: draft.name,
      slug: draft.slug || DATA.slugify(draft.name),
      folder: draft.folder || "Sofa Sets",
      description: draft.description,
      bannerImage: draft.bannerImage || DATA.assetPath("Sofa Sets", "Haven.png"),
      accentFrom: draft.accentFrom || "#2874F0",
      accentTo: draft.accentTo || "#00C6FF",
      badge: draft.badge || "Custom Category",
      order: 100 + index,
      heroStat: draft.heroStat || "Custom collection",
      createdAt: draft.createdAt
    };
  }

  function getCategories() {
    var custom = read(STORAGE_KEYS.categories, []);
    return DATA.categories.concat(custom.map(normalizeCustomCategory)).sort(function (a, b) {
      return (a.order || 0) - (b.order || 0);
    });
  }

  function normalizeCustomProduct(draft, categories) {
    var category =
      categories.find(function (item) {
        return item.slug === draft.categorySlug;
      }) ||
      categories.find(function (item) {
        return item.slug === "outdoor-sofa";
      }) ||
      DATA.categories[0];

    var primaryImage = cleanString(draft.primaryImage || draft.image || category.bannerImage || DATA.assetPath("Sofa Sets", "Haven.png"));
    var fallbackImages = [primaryImage, category.bannerImage].filter(Boolean);
    var images = normalizeImageList(draft.images, fallbackImages);
    var price = toNumber(draft.price || 0);
    var originalPrice = toNumber(draft.originalPrice || Math.round(price * 1.18));
    if (originalPrice < price) {
      originalPrice = Math.round(price * 1.18);
    }
    var discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return {
      id: draft.id,
      origin: "custom",
      name: cleanString(draft.name),
      slug: cleanString(draft.slug) || DATA.slugify(draft.name),
      sku: draft.sku || ("WW-CUSTOM-" + draft.id.slice(-5).toUpperCase()),
      categoryId: category.id,
      categorySlug: category.slug,
      categoryName: category.name,
      tagline: cleanString(draft.tagline),
      description: cleanString(draft.description),
      marketingCopy: cleanString(draft.marketingCopy || draft.description),
      price: price,
      originalPrice: originalPrice,
      discountPercentage: discountPercentage,
      rating: Number(draft.rating || 4.8),
      reviewCount: Number(draft.reviewCount || 12),
      material: cleanString(draft.material),
      materialTags: DATA.getMaterialTags(draft.material),
      seatingCapacity: cleanString(draft.seatingCapacity),
      availability: cleanString(draft.availability) || "In Stock",
      featured: Boolean(draft.featured),
      badge: cleanString(draft.badge) || (draft.featured ? "Featured" : "Custom"),
      images: images,
      primaryImage: images[0],
      highlights:
        Array.isArray(draft.highlights) && draft.highlights.length
          ? draft.highlights
          : ["Admin managed product", "CMS ready entry", "Available for quotations"],
      specifications:
        draft.specifications && draft.specifications.length
          ? draft.specifications
          : [
              { label: "Material", value: cleanString(draft.material) },
              { label: "Seating Capacity", value: cleanString(draft.seatingCapacity) },
              { label: "Availability", value: cleanString(draft.availability) || "In Stock" }
            ],
      faqs:
        draft.faqs && draft.faqs.length
          ? draft.faqs
          : [
              {
                question: "Can I customise this product?",
                answer: "Yes. Use the Request Quote form to ask about finishes, quantity and dispatch lead time."
              }
            ],
      onlyFewLeft: Boolean(draft.onlyFewLeft),
      isNew: draft.isNew !== false,
      bestSeller: Boolean(draft.bestSeller || draft.featured),
      deliveryEstimate: cleanString(draft.deliveryEstimate) || "Custom dispatch timeline on request",
      warranty: cleanString(draft.warranty) || "As per quotation",
      seoTitle: cleanString(draft.seoTitle) || cleanString(draft.name) + " | " + category.name + " by SUN SEATINGS",
      seoDescription: cleanString(draft.seoDescription) || cleanString(draft.description),
      createdAt: draft.createdAt
    };
  }

  function getProducts() {
    var categories = getCategories();
    var custom = read(STORAGE_KEYS.products, []);
    return DATA.products.concat(
      custom.map(function (item) {
        return normalizeCustomProduct(item, categories);
      })
    );
  }

  function getProductBySlug(categorySlug, slug) {
    return getProducts().find(function (product) {
      return product.categorySlug === categorySlug && product.slug === slug;
    });
  }

  function getRelatedProducts(product) {
    var products = getProducts();
    var sameCategory = products
      .filter(function (item) {
        return item.categorySlug === product.categorySlug && item.slug !== product.slug;
      })
      .slice(0, 4);

    if (sameCategory.length >= 4) {
      return sameCategory;
    }

    return sameCategory.concat(
      products
        .filter(function (item) {
          return item.slug !== product.slug && item.categorySlug !== product.categorySlug;
        })
        .sort(function (a, b) {
          return Math.abs(a.price - product.price) - Math.abs(b.price - product.price);
        })
        .slice(0, 4 - sameCategory.length)
    );
  }

  function getFeaturedProducts() {
    return getProducts()
      .filter(function (item) {
        return item.featured;
      })
      .slice(0, 12);
  }

  function searchProducts(query) {
    var needle = cleanString(query).toLowerCase();
    if (!needle) {
      return getProducts().slice(0, 6);
    }
    return getProducts()
      .filter(function (item) {
        var searchable = [
          item.name,
          item.categoryName,
          item.material,
          item.tagline,
          item.description,
          item.marketingCopy,
          (item.highlights || []).join(" "),
          (item.materialTags || []).join(" "),
          (item.specifications || [])
            .map(function (spec) {
              return spec.label + " " + spec.value;
            })
            .join(" ")
        ]
          .join(" ")
          .toLowerCase();
        return (
          searchable.indexOf(needle) !== -1
        );
      })
      .slice(0, 8);
  }

  function searchCategories(query) {
    var needle = cleanString(query).toLowerCase();
    var categories = getCategories();

    if (!needle) {
      return categories.slice(0, 4);
    }

    return categories
      .filter(function (item) {
        return [item.name, item.description, item.badge, item.heroStat].join(" ").toLowerCase().indexOf(needle) !== -1;
      })
      .slice(0, 5);
  }

  function searchCatalog(query) {
    return {
      products: searchProducts(query),
      categories: searchCategories(query)
    };
  }

  function getBanners() {
    return DATA.banners.concat(read(STORAGE_KEYS.banners, []));
  }

  function getBlogPosts() {
    return DATA.blogPosts.concat(read(STORAGE_KEYS.blogPosts, [])).sort(function (a, b) {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }

  function getBlogPostBySlug(slug) {
    return getBlogPosts().find(function (post) {
      return post.slug === slug;
    });
  }

  function getEnquiries() {
    return read(STORAGE_KEYS.enquiries, []);
  }

  function saveEnquiry(payload) {
    ensureRequired(payload.name, "Name");
    ensureRequired(payload.phone, "Phone");

    if (cleanString(payload.phone).replace(/\D/g, "").length < 10) {
      throw new Error("Phone must contain at least 10 digits.");
    }

    var next = [
      {
        id: createId("enquiry"),
        type: cleanString(payload.type) || "general",
        productId: cleanString(payload.productId),
        productName: cleanString(payload.productName),
        name: cleanString(payload.name),
        phone: cleanString(payload.phone),
        phoneDigits: cleanString(payload.phone).replace(/\D/g, ""),
        email: cleanString(payload.email),
        city: cleanString(payload.city),
        message: cleanString(payload.message),
        source: cleanString(payload.source) || "Website",
        status: "New",
        createdAt: new Date().toISOString()
      }
    ].concat(getEnquiries());

    write(STORAGE_KEYS.enquiries, next);
    return next[0];
  }

  function updateEnquiryStatus(id, status) {
    var next = getEnquiries().map(function (item) {
      return item.id === id ? Object.assign({}, item, { status: status }) : item;
    });
    write(STORAGE_KEYS.enquiries, next);
    return next.find(function (item) {
      return item.id === id;
    });
  }

  function deleteEnquiry(id) {
    var next = getEnquiries().filter(function (item) {
      return item.id !== id;
    });
    write(STORAGE_KEYS.enquiries, next);
    return next;
  }

  function saveProduct(payload) {
    var current = read(STORAGE_KEYS.products, []);
    var categories = getCategories();
    var category = categories.find(function (item) {
      return item.slug === cleanString(payload.categorySlug);
    });
    var price = toNumber(payload.price);
    var originalPrice = toNumber(payload.originalPrice);
    var primaryImage = cleanString(payload.image) || DATA.assetPath("Sofa Sets", "Haven.png");

    ensureRequired(payload.name, "Product name");
    ensureRequired(payload.categorySlug, "Category");
    ensureRequired(payload.tagline, "Short tagline");
    ensureRequired(payload.description, "Description");
    ensureRequired(payload.material, "Material");
    ensureRequired(payload.seatingCapacity, "Seating capacity");

    if (!category) {
      throw new Error("Select a valid category.");
    }

    if (price <= 0) {
      throw new Error("Price must be greater than 0.");
    }

    if (!originalPrice || originalPrice < price) {
      originalPrice = Math.round(price * 1.18);
    }

    var nextId = createId("product");
    var nextSlug = createUniqueSlug(payload.slug || payload.name, getProducts(), function (entry, slug) {
      return entry.categorySlug === category.slug && entry.slug === slug;
    });

    current.push({
      id: nextId,
      name: cleanString(payload.name),
      slug: nextSlug,
      categorySlug: category.slug,
      tagline: cleanString(payload.tagline),
      description: cleanString(payload.description),
      marketingCopy: cleanString(payload.marketingCopy || payload.description),
      price: price,
      originalPrice: originalPrice,
      material: cleanString(payload.material),
      seatingCapacity: cleanString(payload.seatingCapacity),
      availability: cleanString(payload.availability) || "In Stock",
      featured: Boolean(payload.featured),
      badge: cleanString(payload.badge) || (payload.featured ? "Featured" : "Custom"),
      image: primaryImage,
      primaryImage: primaryImage,
      images: normalizeImageList(payload.images || payload.image, [primaryImage, category.bannerImage]),
      createdAt: new Date().toISOString()
    });
    write(STORAGE_KEYS.products, current);
    return current;
  }

  function deleteProduct(id) {
    var next = read(STORAGE_KEYS.products, []).filter(function (item) {
      return item.id !== id;
    });
    write(STORAGE_KEYS.products, next);
    return next;
  }

  function saveCategory(payload) {
    var current = read(STORAGE_KEYS.categories, []);
    ensureRequired(payload.name, "Category name");
    ensureRequired(payload.description, "Description");

    var nextSlug = createUniqueSlug(payload.slug || payload.name, getCategories(), function (entry, slug) {
      return entry.slug === slug;
    });

    current.push({
      id: createId("category"),
      name: cleanString(payload.name),
      slug: nextSlug,
      folder: cleanString(payload.folder) || "Sofa Sets",
      description: cleanString(payload.description),
      bannerImage: cleanString(payload.bannerImage) || DATA.assetPath("Sofa Sets", "Haven.png"),
      badge: cleanString(payload.badge) || "Custom Category",
      createdAt: new Date().toISOString()
    });
    write(STORAGE_KEYS.categories, current);
    return current;
  }

  function deleteCategory(id) {
    var category = read(STORAGE_KEYS.categories, []).find(function (item) {
      return item.id === id;
    });

    if (!category) {
      return read(STORAGE_KEYS.categories, []);
    }

    var hasLinkedProducts = read(STORAGE_KEYS.products, []).some(function (item) {
      return item.categorySlug === category.slug;
    });

    if (hasLinkedProducts) {
      throw new Error("Delete or move custom products in this category before removing it.");
    }

    var next = read(STORAGE_KEYS.categories, []).filter(function (item) {
      return item.id !== id;
    });
    write(STORAGE_KEYS.categories, next);
    return next;
  }

  function saveBanner(payload) {
    var current = read(STORAGE_KEYS.banners, []);
    ensureRequired(payload.title, "Banner title");
    ensureRequired(payload.subtitle, "Banner subtitle");
    current.push({
      id: createId("banner"),
      origin: "custom",
      title: cleanString(payload.title),
      subtitle: cleanString(payload.subtitle),
      image: cleanString(payload.image) || DATA.assetPath("Sofa Sets", "Haven.png"),
      ctaLabel: cleanString(payload.ctaLabel) || "Explore",
      ctaHref: cleanString(payload.ctaHref) || "shop.html",
      active: payload.active !== false
    });
    write(STORAGE_KEYS.banners, current);
    return current;
  }

  function deleteBanner(id) {
    var next = read(STORAGE_KEYS.banners, []).filter(function (item) {
      return item.id !== id;
    });
    write(STORAGE_KEYS.banners, next);
    return next;
  }

  function saveBlogPost(payload) {
    var current = read(STORAGE_KEYS.blogPosts, []);
    ensureRequired(payload.title, "Blog title");
    ensureRequired(payload.excerpt, "Short excerpt");
    ensureRequired(payload.body, "Full blog content");

    var nextSlug = createUniqueSlug(payload.slug || payload.title, getBlogPosts(), function (entry, slug) {
      return entry.slug === slug;
    });

    current.push({
      id: createId("blog"),
      origin: "custom",
      title: cleanString(payload.title),
      slug: nextSlug,
      excerpt: cleanString(payload.excerpt),
      body: cleanString(payload.body),
      featuredImage: cleanString(payload.featuredImage) || DATA.assetPath("Sofa Sets", "Haven.png"),
      tags: payload.tags || [],
      publishedAt: new Date().toISOString(),
      seoTitle: cleanString(payload.seoTitle) || cleanString(payload.title),
      seoDescription: cleanString(payload.seoDescription) || cleanString(payload.excerpt)
    });
    write(STORAGE_KEYS.blogPosts, current);
    return current;
  }

  function deleteBlogPost(id) {
    var next = read(STORAGE_KEYS.blogPosts, []).filter(function (item) {
      return item.id !== id;
    });
    write(STORAGE_KEYS.blogPosts, next);
    return next;
  }

  function login(username, password) {
    var isValid =
      username === "agaunny2000@gmail.com" &&
      password === "wicker123";

    if (isValid) {
      window.localStorage.setItem(STORAGE_KEYS.adminSession, "authenticated");
    }
    return isValid;
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEYS.adminSession);
  }

  function isLoggedIn() {
    return window.localStorage.getItem(STORAGE_KEYS.adminSession) === "authenticated";
  }

  window.WW_STORE = {
    getCategories: getCategories,
    getProducts: getProducts,
    getProductBySlug: getProductBySlug,
    getRelatedProducts: getRelatedProducts,
    getFeaturedProducts: getFeaturedProducts,
    searchProducts: searchProducts,
    searchCategories: searchCategories,
    searchCatalog: searchCatalog,
    getBanners: getBanners,
    getBlogPosts: getBlogPosts,
    getBlogPostBySlug: getBlogPostBySlug,
    getEnquiries: getEnquiries,
    saveEnquiry: saveEnquiry,
    updateEnquiryStatus: updateEnquiryStatus,
    deleteEnquiry: deleteEnquiry,
    saveProduct: saveProduct,
    deleteProduct: deleteProduct,
    saveCategory: saveCategory,
    deleteCategory: deleteCategory,
    saveBanner: saveBanner,
    deleteBanner: deleteBanner,
    saveBlogPost: saveBlogPost,
    deleteBlogPost: deleteBlogPost,
    login: login,
    logout: logout,
    isLoggedIn: isLoggedIn
  };
})();
