(function () {
  var DATA = window.WW_DATA;
  var STORE = window.WW_STORE;
  var page = document.body.dataset.page;
  var content = document.getElementById("page-content");
  var chrome = document.getElementById("site-chrome");
  var footer = document.getElementById("site-footer");
  var modalRoot = document.getElementById("modal-root");
  var activeHeroIndex = 0;
  var activeReviewIndex = 0;
  var heroTimer = null;
  var reviewTimer = null;
  var shopObserver = null;

  function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeText(value) {
    return String(value == null ? "" : value).trim().toLowerCase();
  }

  function formatRichText(value) {
    return String(value == null ? "" : value)
      .split(/\n\s*\n/)
      .map(function (paragraph) {
        return paragraph.trim();
      })
      .filter(Boolean)
      .map(function (paragraph) {
        return '<p class="rich-text-paragraph">' + escapeHtml(paragraph) + "</p>";
      })
      .join("");
  }

  function matchesMaterialFilter(product, filter) {
    if (filter === "all") {
      return true;
    }

    var haystack = [
      product.material,
      (product.materialTags || []).join(" ")
    ]
      .join(" ")
      .toLowerCase();

    var aliases = {
      rattan: ["rattan", "wicker", "weave", "cane", "pe"],
      wicker: ["wicker", "weave", "rattan", "cane", "pe"],
      wood: ["wood", "teak", "acacia"],
      metal: ["metal", "aluminium", "aluminum", "steel", "iron"]
    };

    return (aliases[filter] || [filter]).some(function (term) {
      return haystack.indexOf(term) !== -1;
    });
  }

  function matchesProductQuery(product, query) {
    if (!normalizeText(query)) {
      return true;
    }

    var searchable = [
      product.name,
      product.categoryName,
      product.material,
      product.tagline,
      product.description,
      product.marketingCopy,
      product.seatingCapacity,
      (product.highlights || []).join(" "),
      (product.materialTags || []).join(" "),
      (product.specifications || [])
        .map(function (spec) {
          return spec.label + " " + spec.value;
        })
        .join(" ")
    ]
      .join(" ")
      .toLowerCase();

    return searchable.indexOf(normalizeText(query)) !== -1;
  }

  function setMeta(title, description) {
    if (title) {
      document.title = title;
    }

    var descriptionTag = document.querySelector('meta[name="description"]');
    if (descriptionTag && description) {
      descriptionTag.setAttribute("content", description);
    }
  }

  function currentFile() {
    var raw = window.location.pathname.split("/").pop();
    return raw || "index.html";
  }

  function getScrollY() {
    return window.scrollY || window.pageYOffset || 0;
  }

  function socialIconMarkup(type) {
    if (type === "instagram") {
      return (
        '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '  <rect x="3" y="3" width="18" height="18" rx="5" ry="5"></rect>' +
        '  <circle cx="12" cy="12" r="4"></circle>' +
        '  <circle cx="17.5" cy="6.5" r="1"></circle>' +
        "</svg>"
      );
    }

    return (
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
      '  <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1z"></path>' +
      "</svg>"
    );
  }

  function socialLinkMarkup(label, href, type) {
    return (
      '<a class="footer-social-link" href="' +
      href +
      '" target="_blank" rel="noreferrer" aria-label="' +
      escapeHtml(label) +
      '">' +
      socialIconMarkup(type) +
      "</a>"
    );
  }

  function mountSiteLoader() {
    if (!document.body) {
      return;
    }

    var loader = document.createElement("div");
    var duration = 2200;
    var startTime = Date.now();
    var countRaf = null;

    document.body.classList.add("is-loading");
    loader.className = "site-loader";
    loader.innerHTML =
      '<div class="site-loader-shell">' +
      '  <div class="site-loader-orb" aria-hidden="true"></div>' +
      '  <div class="site-loader-mark">' +
      '    <img src="' + DATA.siteConfig.loaderLogo + '" alt="SUN SEATINGS crafted for comfort">' +
      '    <div class="site-loader-shine" aria-hidden="true"></div>' +
      "  </div>" +
      '  <div class="site-loader-status">' +
      '    <span class="site-loader-dot" aria-hidden="true"></span>' +
      '    <span class="site-loader-copy">Crafted For Comfort</span>' +
      '    <span class="site-loader-count" data-loader-count>00%</span>' +
      "  </div>" +
      '  <div class="site-loader-bar" aria-hidden="true"></div>' +
      "</div>";

    document.body.appendChild(loader);

    function tickLoaderCount() {
      var progress = Math.min((Date.now() - startTime) / duration, 1);
      var count = loader.querySelector("[data-loader-count]");

      if (count) {
        count.textContent = String(Math.round(progress * 100)).padStart(2, "0") + "%";
      }

      if (progress < 1) {
        countRaf = window.requestAnimationFrame(tickLoaderCount);
      }
    }

    window.requestAnimationFrame(function () {
      loader.classList.add("is-visible");
      countRaf = window.requestAnimationFrame(tickLoaderCount);
    });

    window.setTimeout(function () {
      if (countRaf) {
        window.cancelAnimationFrame(countRaf);
      }

      loader.classList.add("is-hiding");
      document.body.classList.remove("is-loading");

      window.setTimeout(function () {
        if (loader.parentNode) {
          loader.parentNode.removeChild(loader);
        }
      }, 720);
    }, duration);
  }

  function navItems() {
    return [
      { href: "index.html", label: "Home", match: "home" },
      { href: "shop.html", label: "Shop", match: "shop" },
      { href: "categories.html", label: "Categories", match: "categories" },
      { href: "about.html", label: "About", match: "about" },
      { href: "contact.html", label: "Contact", match: "contact" }
    ];
  }

  function renderChrome() {
    var categories = STORE.getCategories();
    var activeFile = currentFile();

    chrome.innerHTML =
      '<div class="announcement-bar">Summer Sale • Up to 60% OFF • Free styling advice • Pan India delivery</div>' +
      '<header class="site-header">' +
      '  <div class="container header-row">' +
      '    <a class="logo-wrap logo-wrap-brand" href="index.html">' +
      '      <span class="logo-box logo-box-wide"><img src="' + DATA.assetPath("LOGO", "SUN SEATINGS.png") + '" alt="SUN SEATINGS logo"></span>' +
      '    </a>' +
      '    <nav class="nav">' +
      navItems()
        .map(function (item) {
          var isActive = activeFile === item.href || page === item.match;
          if (item.label === "Categories") {
            return (
              '<div class="nav-item">' +
              '  <a class="nav-link' + (isActive ? " is-active" : "") + '" href="' + item.href + '">' + item.label + ' <span class="nav-chevron">▾</span></a>' +
              '  <div class="mega-menu">' +
              '    <div class="mega-menu-head">' +
              '      <div>' +
              '        <p class="mega-menu-title">Shop by category</p>' +
              '        <p class="mega-menu-copy">Premium outdoor pieces curated for every space.</p>' +
              "      </div>" +
              '      <a class="eyebrow" href="categories.html">View all</a>' +
              "    </div>" +
              '    <div class="mega-grid">' +
              categories
                .map(function (category) {
                  return (
                    '<a class="mega-card" href="' + DATA.categoryUrl(category.slug) + '">' +
                    '  <span class="mega-card-media"><img src="' + category.bannerImage + '" alt="' + escapeHtml(category.name) + '"></span>' +
                    '  <span>' +
                    '    <strong class="mega-card-title">' + escapeHtml(category.name) + "</strong>" +
                    '    <span class="mega-card-copy">' + escapeHtml(category.badge) + "</span>" +
                    "  </span>" +
                    "</a>"
                  );
                })
                .join("") +
              "    </div>" +
              "  </div>" +
              "</div>"
            );
          }
          return '<a class="nav-link' + (isActive ? " is-active" : "") + '" href="' + item.href + '">' + item.label + "</a>";
        })
        .join("") +
      "    </nav>" +
      '    <div class="header-tools">' +
      '      <div class="search-wrap">' +
      '        <form class="search-form" id="global-search-form">' +
      '          <span>🔎</span>' +
      '          <input id="global-search-input" type="search" placeholder="Search collections, materials, category names..." autocomplete="off">' +
      "        </form>" +
      '        <div class="search-panel" id="search-panel"></div>' +
      "      </div>" +
      '      <a class="btn btn-green" href="' + DATA.buildWhatsAppLink(DATA.siteConfig.whatsappNumber) + '" target="_blank" rel="noreferrer">WhatsApp</a>' +
      '      <button class="mobile-toggle" id="mobile-toggle" aria-label="Open menu">☰</button>' +
      "    </div>" +
      "  </div>" +
      "</header>" +
      '<div class="mobile-drawer" id="mobile-drawer">' +
      '  <div class="mobile-backdrop" data-close-drawer="true"></div>' +
      '  <div class="mobile-panel">' +
      '    <div class="split-row">' +
      '      <div><p class="logo-title" style="font-size:32px;margin:0;">Menu</p></div>' +
      '      <button class="circle-button" data-close-drawer="true">✕</button>' +
      "    </div>" +
      '    <div class="mobile-nav">' +
      navItems()
        .map(function (item) {
          return '<a class="mobile-link" href="' + item.href + '">' + item.label + "</a>";
        })
        .join("") +
      "    </div>" +
      '    <div class="mobile-link-row">' +
      categories
        .map(function (category) {
          return '<a class="mobile-link" href="' + DATA.categoryUrl(category.slug) + '">' + escapeHtml(category.name) + "</a>";
        })
        .join("") +
      '    </div>' +
      '    <div class="stack-actions">' +
      '      <a class="btn btn-green" href="' + DATA.buildWhatsAppLink(DATA.siteConfig.whatsappNumber) + '" target="_blank" rel="noreferrer">WhatsApp Expert</a>' +
      '      <a class="btn btn-blue" href="' + DATA.buildPhoneLink(DATA.siteConfig.phone) + '">Call Now</a>' +
      "    </div>" +
      "  </div>" +
      "</div>" +
      '<div class="floating-stack">' +
      '  <a class="floating-button is-whatsapp" href="' + DATA.buildWhatsAppLink(DATA.siteConfig.whatsappNumber) + '" target="_blank" rel="noreferrer" aria-label="Open WhatsApp">💬</a>' +
      '  <a class="floating-button is-call" href="' + DATA.buildPhoneLink(DATA.siteConfig.phone) + '" aria-label="Call">📞</a>' +
      '  <button class="floating-button is-top" id="scroll-top" aria-label="Scroll to top">↑</button>' +
      "</div>";

    footer.innerHTML =
      '<footer class="footer">' +
      '  <div class="container footer-grid">' +
      "    <div>" +
      '      <p class="footer-title">SUN SEATINGS</p>' +
      '      <p class="footer-copy">A luxury furniture catalog designed to feel like a premium commerce experience, with quotation-first conversion for homes, architects, cafes and hospitality projects.</p>' +
      '      <div class="footer-link-list">' +
      '        <span class="footer-meta">' + escapeHtml(DATA.siteConfig.address) + "</span>" +
      '        <a href="' + DATA.buildPhoneLink(DATA.siteConfig.phone) + '">' + escapeHtml(DATA.siteConfig.phone) + "</a>" +
      '        <a href="mailto:' + escapeHtml(DATA.siteConfig.email) + '">' + escapeHtml(DATA.siteConfig.email) + "</a>" +
      '        <span class="footer-meta">' + escapeHtml(DATA.siteConfig.supportHours) + "</span>" +
      "      </div>" +
      '      <div class="footer-socials">' +
      socialLinkMarkup("Instagram", DATA.siteConfig.instagramUrl, "instagram") +
      socialLinkMarkup("Facebook", DATA.siteConfig.facebookUrl, "facebook") +
      "      </div>" +
      "    </div>" +
      "    <div>" +
      '      <div class="footer-head">Shop</div>' +
      '      <div class="footer-link-list">' +
      '        <a href="shop.html">All Products</a>' +
      '        <a href="categories.html">Categories</a>' +
      '        <a href="' + DATA.siteConfig.catalogPdf + '" target="_blank" rel="noreferrer">Catalog PDF</a>' +
      '        <a href="blog.html">Design Journal</a>' +
      "      </div>" +
      "    </div>" +
      "    <div>" +
      '      <div class="footer-head">Categories</div>' +
      '      <div class="footer-link-list">' +
      STORE.getCategories()
        .slice(0, 6)
        .map(function (category) {
          return '<a href="' + DATA.categoryUrl(category.slug) + '">' + escapeHtml(category.name) + "</a>";
        })
        .join("") +
      "      </div>" +
      "    </div>" +
      "    <div>" +
      '      <div class="footer-head">Support</div>' +
      '      <div class="footer-link-list">' +
      '        <a href="about.html">About Brand</a>' +
      '        <a href="contact.html">Contact & Enquiry</a>' +
      '        <a href="admin-login.html">Admin Dashboard</a>' +
      '        <a href="' + DATA.buildPhoneLink(DATA.siteConfig.phone) + '">Call Now</a>' +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      '  <div class="container footer-bottom">' +
      '    <span class="footer-meta">© 2026 SUN SEATINGS. Built for luxury catalogue selling.</span>' +
      "  </div>" +
      "</footer>";
  }

  function bindChromeEvents() {
    var mobileToggle = document.getElementById("mobile-toggle");
    var mobileDrawer = document.getElementById("mobile-drawer");
    var searchForm = document.getElementById("global-search-form");
    var searchInput = document.getElementById("global-search-input");
    var searchPanel = document.getElementById("search-panel");
    var scrollTopButton = document.getElementById("scroll-top");
    var initialQuery = getParam("q") || "";

    if (mobileToggle && mobileDrawer) {
      mobileToggle.addEventListener("click", function () {
        mobileDrawer.classList.add("is-open");
      });

      mobileDrawer.addEventListener("click", function (event) {
        if (
          (event.target && event.target.getAttribute("data-close-drawer")) ||
          event.target.closest("a")
        ) {
          mobileDrawer.classList.remove("is-open");
        }
      });
    }

    function renderSearchResults(query) {
      var results = STORE.searchCatalog(query);
      var normalizedQuery = String(query || "").trim();
      var searchHref = "shop.html" + (normalizedQuery ? "?q=" + encodeURIComponent(normalizedQuery) : "");
      searchPanel.innerHTML =
        '<div class="search-section">' +
        '  <div class="search-section-head">' +
        '    <p class="search-section-title">Products</p>' +
        '    <a class="search-see-all" href="' + searchHref + '">' + (normalizedQuery ? 'View all results' : "Open shop") + "</a>" +
        "  </div>" +
        (results.products.length
          ? results.products
              .map(function (item) {
                return (
                  '<a class="search-result" href="' + DATA.productUrl(item) + '">' +
                  '  <span class="search-result-media"><img src="' + item.primaryImage + '" alt="' + escapeHtml(item.name) + '"></span>' +
                  "  <span>" +
                  '    <strong class="mega-card-title">' + escapeHtml(item.name) + "</strong>" +
                  '    <span class="mega-card-copy">' + escapeHtml(item.categoryName) + "</span>" +
                  "  </span>" +
                  "</a>"
                );
              })
              .join("")
          : '<p class="search-empty">No products matched this search yet.</p>') +
        "</div>" +
        '<div class="search-section">' +
        '  <p class="search-section-title">Categories</p>' +
        (results.categories.length
          ? results.categories
              .map(function (item) {
                return (
                  '<a class="search-chip" href="' + DATA.categoryUrl(item.slug) + '">' +
                  '  <span class="search-chip-title">' + escapeHtml(item.name) + "</span>" +
                  '  <span class="search-chip-copy">' + escapeHtml(item.badge || item.heroStat || "Explore collection") + "</span>" +
                  "</a>"
                );
              })
              .join("")
          : '<p class="search-empty">Try a product type like outdoor sofa or dining set.</p>') +
        "</div>" +
        '<div class="search-tags">' +
        DATA.popularSearches
          .map(function (tag) {
            return '<button class="pill-tag" type="button" data-search-tag="' + escapeHtml(tag) + '">' + escapeHtml(tag) + "</button>";
          })
          .join("") +
        "</div>";
    }

    if (searchInput && searchPanel && searchForm) {
      searchInput.value = initialQuery;
      renderSearchResults(initialQuery);

      searchInput.addEventListener("focus", function () {
        searchPanel.classList.add("is-open");
      });

      searchInput.addEventListener("input", function () {
        renderSearchResults(searchInput.value);
        searchPanel.classList.add("is-open");
      });

      searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        var query = encodeURIComponent(searchInput.value.trim());
        window.location.href = "shop.html" + (query ? "?q=" + query : "");
      });

      searchPanel.addEventListener("click", function (event) {
        var button = event.target.closest("[data-search-tag]");
        if (!button) {
          return;
        }
        searchInput.value = button.getAttribute("data-search-tag");
        renderSearchResults(searchInput.value);
      });

      document.addEventListener("click", function (event) {
        if (!event.target.closest(".search-wrap")) {
          searchPanel.classList.remove("is-open");
        }
      });

      document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") {
          return;
        }

        searchPanel.classList.remove("is-open");
        if (mobileDrawer) {
          mobileDrawer.classList.remove("is-open");
        }
        if (modalRoot.innerHTML) {
          closeModal();
        }
      });
    }

    if (scrollTopButton) {
      scrollTopButton.addEventListener("click", function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  function productCardMarkup(product) {
    return (
      '<article class="surface card product-card">' +
      '  <div class="sale-badges">' +
      '    <span class="badge badge-red">' + escapeHtml(product.discountPercentage + "% OFF") + "</span>" +
      (product.onlyFewLeft ? '<span class="badge badge-green">Only few left</span>' : "") +
      "  </div>" +
      '  <button class="wishlist-button" type="button" aria-label="Wishlist">♡</button>' +
      '  <a href="' + DATA.productUrl(product) + '" class="product-card-media">' +
      '    <img src="' + product.primaryImage + '" alt="' + escapeHtml(product.name) + '">' +
      "  </a>" +
      '  <div class="product-card-body">' +
      '    <div class="rating-row"><span>★★★★★</span><span class="rating-meta">' + escapeHtml(product.rating + " (" + product.reviewCount + ")") + "</span></div>" +
      '    <a href="' + DATA.productUrl(product) + '"><h3 class="card-title">' + escapeHtml(product.name) + "</h3></a>" +
      '    <p class="card-copy">' + escapeHtml(product.tagline) + "</p>" +
      '    <div class="product-price">' +
      '      <span class="price-current">' + DATA.formatCurrency(product.price) + "</span>" +
      '      <span class="price-original">' + DATA.formatCurrency(product.originalPrice) + "</span>" +
      "    </div>" +
      '    <div class="product-actions">' +
      '      <button class="btn btn-outline" type="button" data-quick-view="' + escapeHtml(product.id) + '">Quick View</button>' +
      '      <a class="btn btn-primary" href="' + DATA.buildWhatsAppLink(DATA.siteConfig.whatsappNumber, product.name) + '" target="_blank" rel="noreferrer">Enquire Now</a>' +
      "    </div>" +
      "  </div>" +
      "</article>"
    );
  }

  function categoryCardMarkup(category, count) {
    var mediaStyle =
      "background:" +
      (category.cardMediaBackground ||
        ("linear-gradient(135deg," +
          category.accentFrom +
          " 0%," +
          category.accentTo +
          " 100%)")) +
      ";" +
      (category.cardImageFit ? "--category-image-fit:" + String(category.cardImageFit) + ";" : "") +
      (category.cardImageScale ? "--category-image-scale:" + String(category.cardImageScale) + ";" : "");

    return (
      '<a class="surface card category-card" href="' + DATA.categoryUrl(category.slug) + '">' +
      '  <div class="category-card-media" style="' + mediaStyle + '">' +
      '    <img class="category-card-image" src="' + category.bannerImage + '" alt="' + escapeHtml(category.name) + '">' +
      "  </div>" +
      '  <div class="category-card-body">' +
      '    <div class="split-row">' +
      '      <h3 class="card-title" style="margin-top:0;font-size:24px;">' + escapeHtml(category.name) + "</h3>" +
      '      <span class="badge badge-blue">' + escapeHtml(category.badge) + "</span>" +
      "    </div>" +
      '    <p class="card-copy">' + escapeHtml(category.description) + "</p>" +
      '    <div class="split-row" style="margin-top:14px;">' +
      '      <strong>' + String(count || 0) + " products</strong>" +
      '      <span class="eyebrow" style="margin:0;">Shop Now</span>' +
      "    </div>" +
      "  </div>" +
      "</a>"
    );
  }

  function enquiryFormMarkup(options) {
    var message = options.message || "";
    return (
      '<div class="surface ' + (options.compact ? "" : "card") + '">' +
      '  <div class="' + (options.compact ? "" : "card") + '">' +
      '    <p class="eyebrow">Enquiry System</p>' +
      '    <h3 class="section-title" style="font-size:44px;margin-top:10px;">' + escapeHtml(options.title) + "</h3>" +
      '    <p class="section-subtitle">' +
      escapeHtml(
        options.description ||
          "Fill the form and the SUN SEATINGS team can call, WhatsApp or email you with pricing, delivery timeline and catalog assistance."
      ) +
      "</p>" +
      '    <form class="form-grid enquiry-form" data-enquiry-type="' + escapeHtml(options.type) + '" data-product-id="' + escapeHtml(options.productId || "") + '" data-product-name="' + escapeHtml(options.productName || "") + '">' +
      '      <div class="field"><label>Name</label><input class="input" name="name" required></div>' +
      '      <div class="field"><label>Phone</label><input class="input" name="phone" required></div>' +
      '      <div class="field"><label>Email</label><input class="input" type="email" name="email"></div>' +
      '      <div class="field"><label>City</label><input class="input" name="city"></div>' +
      '      <div class="field-full"><label>Message</label><textarea class="textarea" name="message">' + escapeHtml(message) + "</textarea></div>" +
      '      <input class="hidden" type="text" name="website" autocomplete="off" tabindex="-1">' +
      (options.productName
        ? '<div class="field-full"><div class="status-pill">Product auto-filled: ' + escapeHtml(options.productName) + "</div></div>"
        : "") +
      '      <div class="field-full">' +
      '        <button class="btn btn-primary" type="submit">Request Quote</button>' +
      '        <p class="form-note" data-form-note="true"></p>' +
      "      </div>" +
      "    </form>" +
      "  </div>" +
      "</div>"
    );
  }

  function openModal(innerHtml) {
    document.body.classList.add("modal-open");
    modalRoot.innerHTML = '<div class="modal-overlay"><div class="modal-card" role="dialog" aria-modal="true">' + innerHtml + "</div></div>";
  }

  function closeModal() {
    document.body.classList.remove("modal-open");
    modalRoot.innerHTML = "";
  }

  function bindModalEvents() {
    if (!modalRoot) {
      return;
    }
    modalRoot.addEventListener("click", function (event) {
      if (event.target.classList.contains("modal-overlay") || event.target.closest("[data-close-modal]")) {
        closeModal();
      }
    });
  }

  function openQuickView(product) {
    openModal(
      '<div style="padding:24px;">' +
      '  <div class="split-row" style="margin-bottom:18px;">' +
      '    <div>' +
      '      <p class="eyebrow">' + escapeHtml(product.categoryName) + "</p>" +
      '      <h3 class="section-title" style="font-size:50px;margin-top:10px;">' + escapeHtml(product.name) + "</h3>" +
      "    </div>" +
      '    <button class="modal-close" type="button" data-close-modal="true">✕</button>' +
      "  </div>" +
      '  <div class="product-layout" style="grid-template-columns:minmax(0,0.9fr) minmax(0,1.1fr);">' +
      '    <div class="product-card-media" style="min-height:360px;"><img src="' + product.primaryImage + '" alt="' + escapeHtml(product.name) + '" style="height:360px;"></div>' +
      '    <div>' +
      '      <p class="card-copy">' + escapeHtml(product.description) + "</p>" +
      '      <div class="product-price"><span class="price-current">' + DATA.formatCurrency(product.price) + '</span><span class="price-original">' + DATA.formatCurrency(product.originalPrice) + "</span></div>" +
      '      <div class="grid grid-2" style="margin-top:18px;">' +
      product.specifications
        .slice(0, 4)
        .map(function (spec) {
          return (
            '<div class="info-card">' +
            '  <p class="eyebrow" style="margin:0;color:var(--brand-muted);">' + escapeHtml(spec.label) + "</p>" +
            '  <p style="margin:10px 0 0;font-weight:800;">' + escapeHtml(spec.value) + "</p>" +
            "</div>"
          );
        })
        .join("") +
      "      </div>" +
      '      <div class="stack-actions">' +
      '        <a class="btn btn-green" href="' + DATA.buildWhatsAppLink(DATA.siteConfig.whatsappNumber, product.name) + '" target="_blank" rel="noreferrer">WhatsApp</a>' +
      '        <a class="btn btn-blue" href="' + DATA.buildPhoneLink(DATA.siteConfig.phone) + '">Call Now</a>' +
      '        <a class="btn btn-outline" href="' + DATA.productUrl(product) + '">View full details</a>' +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "</div>"
    );
  }

  function openQuoteModal(product) {
    openModal(
      '<div style="padding:24px;">' +
      '  <div class="split-row" style="margin-bottom:16px;">' +
      '    <div>' +
      '      <p class="eyebrow">Product enquiry</p>' +
      '      <h3 class="section-title" style="font-size:48px;margin-top:10px;">Request a quote for ' + escapeHtml(product.name) + "</h3>" +
      "    </div>" +
      '    <button class="modal-close" type="button" data-close-modal="true">✕</button>' +
      "  </div>" +
      enquiryFormMarkup({
        type: "product",
        title: "Share your requirement",
        compact: true,
        productId: product.id,
        productName: product.name,
        message: "I would like pricing and delivery details for " + product.name + "."
      }) +
      "</div>"
    );

    bindEnquiryForms(modalRoot);
  }

  function findProductById(id) {
    return STORE.getProducts().find(function (product) {
      return product.id === id;
    });
  }

  function bindCommonProductActions(root) {
    root.onclick = function (event) {
      var quickViewButton = event.target.closest("[data-quick-view]");
      var quoteButton = event.target.closest("[data-open-quote]");

      if (quickViewButton) {
        var product = findProductById(quickViewButton.getAttribute("data-quick-view"));
        if (product) {
          openQuickView(product);
        }
      }

      if (quoteButton) {
        var productId = quoteButton.getAttribute("data-open-quote");
        var quoteProduct = findProductById(productId);
        if (quoteProduct) {
          openQuoteModal(quoteProduct);
        }
      }
    };
  }

  function bindEnquiryForms(scope) {
    scope.querySelectorAll(".enquiry-form").forEach(function (form) {
      if (form.dataset.bound === "true") {
        return;
      }

      form.dataset.bound = "true";
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        var data = new FormData(form);
        var note = form.querySelector("[data-form-note]");

        if (String(data.get("website") || "").trim()) {
          if (note) {
            note.className = "form-note is-success";
            note.textContent = "Enquiry submitted successfully.";
          }
          return;
        }

        var phoneDigits = String(data.get("phone") || "").replace(/\D/g, "");
        if (phoneDigits.length < 10) {
          if (note) {
            note.className = "form-note is-error";
            note.textContent = "Please enter a valid phone number.";
          }
          return;
        }

        try {
          STORE.saveEnquiry({
            type: form.getAttribute("data-enquiry-type") || "general",
            productId: form.getAttribute("data-product-id") || "",
            productName: form.getAttribute("data-product-name") || "",
            name: String(data.get("name") || ""),
            phone: String(data.get("phone") || ""),
            email: String(data.get("email") || ""),
            city: String(data.get("city") || ""),
            message: String(data.get("message") || ""),
            source: form.getAttribute("data-product-name") ? "Product Page" : "Website"
          });

          form.reset();
          if (note) {
            note.className = "form-note is-success";
            note.textContent = "Enquiry submitted successfully. The admin dashboard now has this lead.";
          }

          if (form.closest(".modal-card")) {
            window.setTimeout(closeModal, 1100);
          }
        } catch (error) {
          if (note) {
            note.className = "form-note is-error";
            note.textContent = error.message || "We could not submit your enquiry.";
          }
        }
      });
    });
  }

  function heroSlideMarkup(slide, index) {
    return (
      '<article class="hero-slide' + (index === 0 ? " is-active" : "") + '" data-hero-slide="' + index + '" aria-label="' + escapeHtml(slide.title || ("Hero slide " + String(index + 1))) + '" aria-hidden="' + (index === 0 ? "false" : "true") + '" style="background-image:url(\'' + slide.image + '\')">' +
      '<div class="hero-slide-inner" aria-hidden="true"></div>' +
      "</article>"
    );
  }

  function reviewMarkup(item) {
    return (
      '<div class="review-panel">' +
      '  <div class="rating-row" style="font-size:16px;">★★★★★</div>' +
      '  <p class="review-quote">' + escapeHtml(item.quote) + "</p>" +
      '  <p style="margin-top:20px;font-size:18px;font-weight:800;">' + escapeHtml(item.name) + "</p>" +
      '  <p class="muted" style="margin-top:6px;">' + escapeHtml(item.city) + " • Verified luxury buyer</p>" +
      "</div>" +
      '<div class="review-media"><img src="' + item.image + '" alt="' + escapeHtml(item.name) + '"></div>'
    );
  }

  function renderHome() {
    var categories = STORE.getCategories();
    var products = STORE.getProducts();
    var featuredProducts = STORE.getFeaturedProducts();

    var counts = {};
    products.forEach(function (product) {
      counts[product.categorySlug] = (counts[product.categorySlug] || 0) + 1;
    });

    content.innerHTML =
      '<section class="hero-banner-section">' +
      '  <div class="hero-shell">' +
      '    <div class="hero-track" id="hero-track">' +
      DATA.heroSlides
        .map(function (slide, index) {
          return heroSlideMarkup(slide, index);
        })
        .join("") +
      "    </div>" +
      '    <div class="hero-controls">' +
      '      <div class="dots" id="hero-dots">' +
      DATA.heroSlides
        .map(function (_, index) {
          return '<button class="dot' + (index === 0 ? " is-active" : "") + '" type="button" data-hero-dot="' + index + '" aria-label="Go to hero slide ' + String(index + 1) + '"></button>';
        })
        .join("") +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "</section>" +
      '<section class="section">' +
      '  <div class="container">' +
      '    <div class="section-heading"><p class="eyebrow">Category Grid</p><h2 class="section-title">Browse collections the way shoppers do on top ecommerce sites.</h2></div>' +
      '    <div class="grid grid-4">' +
      categories
        .map(function (category) {
          return categoryCardMarkup(category, counts[category.slug] || 0);
        })
        .join("") +
      "    </div>" +
      "  </div>" +
      "</section>" +
      '<section class="section">' +
      '  <div class="container">' +
      '    <div class="split-row section-heading">' +
      '      <div><p class="eyebrow">Featured products</p><h2 class="section-title">Trending catalog pieces that feel marketplace-ready.</h2></div>' +
      '      <div class="carousel-controls"><button class="circle-button" type="button" id="featured-prev">←</button><button class="circle-button" type="button" id="featured-next">→</button></div>' +
      "    </div>" +
      '    <div class="featured-track" id="featured-track">' +
      featuredProducts.map(productCardMarkup).join("") +
      "    </div>" +
      "  </div>" +
      "</section>" +
      '<section class="section">' +
      '  <div class="container surface card">' +
      '    <div class="section-heading"><p class="eyebrow">Why Choose Us</p><h2 class="section-title">Trust signals built to convert catalogue visits into enquiries.</h2></div>' +
      '    <div class="trust-grid">' +
      DATA.trustPoints
        .map(function (point) {
          return (
            '<div class="trust-card">' +
            '  <p class="eyebrow" style="color:var(--brand-muted);">' + escapeHtml(point.stat) + "</p>" +
            '  <h3 class="card-title" style="margin-top:14px;font-size:24px;">' + escapeHtml(point.title) + "</h3>" +
            '  <p class="card-copy">' + escapeHtml(point.description) + "</p>" +
            "</div>"
          );
        })
        .join("") +
      "    </div>" +
      "  </div>" +
      "</section>" +
      '<section class="section">' +
      '  <div class="container surface review-shell">' +
      '    <div class="section-heading"><p class="eyebrow">Customer Reviews</p><h2 class="section-title">Social proof that helps the page sell harder.</h2></div>' +
      '    <div class="review-layout" id="review-grid">' + reviewMarkup(DATA.testimonials[0]) + "</div>" +
      '    <div class="dots" id="review-dots">' +
      DATA.testimonials
        .map(function (_, index) {
          return '<button class="dot' + (index === 0 ? " is-active" : "") + '" type="button" data-review-dot="' + index + '" aria-label="Go to customer review ' + String(index + 1) + '"></button>';
        })
        .join("") +
      "    </div>" +
      "  </div>" +
      "</section>" +
      '<section class="section">' +
      '  <div class="container surface promo-band">' +
      '    <div class="hero-grid">' +
      '      <div>' +
      '        <p class="eyebrow" style="color:rgba(255,255,255,0.75);">WhatsApp Banner</p>' +
      '        <h2 class="section-title" style="color:#fff;">Talk to our furniture expert.</h2>' +
      '        <p class="section-subtitle" style="color:rgba(255,255,255,0.82);">Share a product link, a rough layout or just your space type. We can help with finish suggestions, delivery estimates and quotation support on WhatsApp.</p>' +
      '        <div class="stack-actions">' +
      '          <a class="btn btn-green" href="' + DATA.buildWhatsAppLink(DATA.siteConfig.whatsappNumber) + '" target="_blank" rel="noreferrer">Open WhatsApp Chat</a>' +
      '          <a class="btn btn-light-outline" href="contact.html">Request Quotation</a>' +
      "        </div>" +
      "      </div>" +
      '      <div class="grid grid-2">' +
      featuredProducts
        .slice(0, 2)
        .map(function (product) {
          return (
            '<div class="surface card" style="background:rgba(255,255,255,0.1);color:#fff;border-color:rgba(255,255,255,0.16);">' +
            '  <div class="square-media" style="height:190px;background:rgba(255,255,255,0.08);"><img src="' + product.primaryImage + '" alt="' + escapeHtml(product.name) + '" style="height:190px;padding:16px;"></div>' +
            '  <div class="product-card-body"><p class="card-title" style="margin-top:0;font-size:22px;color:#fff;">' + escapeHtml(product.name) + '</p><p class="card-copy" style="color:rgba(255,255,255,0.7);">' + escapeHtml(product.categoryName) + "</p></div>" +
            "</div>"
          );
        })
        .join("") +
      "      </div>" +
      "    </div>" +
      "  </div>" +
      "</section>" +
      '<section class="section">' +
      '  <div class="container">' +
      '    <div class="section-heading"><p class="eyebrow">Instagram Gallery</p><h2 class="section-title">A social-style inspiration grid built from your real catalogue assets.</h2></div>' +
      '    <div class="grid grid-3">' +
      DATA.instagramShots
        .map(function (shot) {
          return (
            '<div class="surface card">' +
            '  <div class="gallery-shot"><img src="' + shot.image + '" alt="' + escapeHtml(shot.caption) + '"></div>' +
            '  <div class="product-card-body"><p class="card-title" style="margin-top:0;font-size:22px;">' + escapeHtml(shot.caption) + "</p></div>" +
            "</div>"
          );
        })
        .join("") +
      "    </div>" +
      "  </div>" +
      "</section>";

    bindCommonProductActions(content);
    startHeroSlider();
    startReviewSlider();

    var track = document.getElementById("featured-track");
    var prev = document.getElementById("featured-prev");
    var next = document.getElementById("featured-next");

    if (track && prev && next) {
      prev.addEventListener("click", function () {
        track.scrollBy({ left: -340, behavior: "smooth" });
      });
      next.addEventListener("click", function () {
        track.scrollBy({ left: 340, behavior: "smooth" });
      });
    }
  }

  function startHeroSlider() {
    var track = document.getElementById("hero-track");
    var dots = document.getElementById("hero-dots");
    var heroShell = content.querySelector(".hero-shell");
    var slides = track ? track.querySelectorAll(".hero-slide") : [];

    if (!track || !dots || !slides.length) {
      return;
    }

    function updateHero(index) {
      activeHeroIndex = index;
      track.style.transform = "translate3d(-" + String(index * 100) + "%, 0, 0)";
      slides.forEach(function (slide, slideIndex) {
        var isActive = slideIndex === index;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", isActive ? "false" : "true");
      });
      dots.querySelectorAll(".dot").forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function startAutoplay() {
      if (heroTimer) {
        clearInterval(heroTimer);
      }

      heroTimer = setInterval(function () {
        updateHero((activeHeroIndex + 1) % DATA.heroSlides.length);
      }, 3000);
    }

    dots.addEventListener("click", function (event) {
      var button = event.target.closest("[data-hero-dot]");
      if (!button) {
        return;
      }
      updateHero(Number(button.getAttribute("data-hero-dot")));
      startAutoplay();
    });

    if (heroShell) {
      heroShell.addEventListener("mouseenter", function () {
        if (heroTimer) {
          clearInterval(heroTimer);
        }
      });
      heroShell.addEventListener("mouseleave", startAutoplay);
    }

    updateHero(activeHeroIndex);
    startAutoplay();
  }

  function startReviewSlider() {
    var grid = document.getElementById("review-grid");
    var dots = document.getElementById("review-dots");

    if (!grid || !dots) {
      return;
    }

    function updateReview(index) {
      activeReviewIndex = index;
      grid.innerHTML = reviewMarkup(DATA.testimonials[index]);
      dots.querySelectorAll(".dot").forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === index);
      });
    }

    function restartAutoplay() {
      if (reviewTimer) {
        clearInterval(reviewTimer);
      }

      reviewTimer = setInterval(function () {
        updateReview((activeReviewIndex + 1) % DATA.testimonials.length);
      }, 4200);
    }

    dots.addEventListener("click", function (event) {
      var button = event.target.closest("[data-review-dot]");
      if (!button) {
        return;
      }
      updateReview(Number(button.getAttribute("data-review-dot")));
      restartAutoplay();
    });

    restartAutoplay();
  }

  function filteredProducts(state) {
    var all = STORE.getProducts();
    return all
      .filter(function (product) {
        var matchesCategory = state.category === "all" || product.categorySlug === state.category;
        var matchesMaterial = matchesMaterialFilter(product, state.material);
        var matchesSeating = state.seating === "all" || product.seatingCapacity === state.seating;
        var matchesPrice = product.price <= state.price;
        var matchesQuery = matchesProductQuery(product, state.query);

        return matchesCategory && matchesMaterial && matchesSeating && matchesPrice && matchesQuery;
      })
      .sort(function (a, b) {
        if (state.sort === "price-asc") return a.price - b.price;
        if (state.sort === "price-desc") return b.price - a.price;
        if (state.sort === "new") return Number(b.isNew) - Number(a.isNew);
        if (state.sort === "popular") return b.reviewCount - a.reviewCount;
        return Number(b.featured) - Number(a.featured);
      });
  }

  function renderShopPage(initialCategorySlug, heading) {
    var categories = STORE.getCategories();
    var products = STORE.getProducts();
    var maxPrice = Math.max.apply(
      null,
      products.map(function (product) {
        return product.price;
      })
    );

    var state = {
      category: initialCategorySlug || "all",
      material: "all",
      seating: "all",
      sort: getParam("sort") || "featured",
      price: maxPrice,
      query: getParam("q") || "",
      view: "grid",
      visible: 12,
      loadingMore: false,
      lastLoadTriggerY: getScrollY()
    };

    function renderShopFilters() {
      return (
        '<div class="split-row"><div><p class="card-title" style="margin:0;font-size:28px;">Filter products</p><p class="card-copy">Flipkart-style browsing controls</p></div><span class="badge badge-blue">Smart filters</span></div>' +
        '      <div class="toolbar-actions" style="margin-top:18px;"><button class="btn btn-outline" data-clear-filters type="button">Reset Filters</button></div>' +
        renderFilterGroup("Category", ["all"].concat(categories.map(function (category) { return category.slug; })), state.category, "category", function (slug) {
          return slug === "all"
            ? "All Products"
            : categories.find(function (category) {
                return category.slug === slug;
              }).name;
        }) +
        '<div class="filter-group"><p class="filter-title">Price range</p><input data-price-range type="range" min="5000" max="' + maxPrice + '" value="' + state.price + '" style="width:100%;accent-color:var(--brand-blue);"><p class="range-value" data-price-value>Up to ' + DATA.formatCurrency(state.price) + "</p></div>" +
        renderFilterGroup("Material", ["all", "rattan", "wood", "metal", "wicker"], state.material, "material", function (item) { return item; }) +
        renderFilterGroup("Seating capacity", ["all", "1 seater", "2 seater", "4 seater", "5 seater", "6 seater"], state.seating, "seating", function (item) { return item; })
      );
    }

    function render() {
      var items = filteredProducts(state);
      var visible = items.slice(0, state.visible);
      var globalSearchInput = document.getElementById("global-search-input");
      setMeta(heading.title + " | SUN SEATINGS", heading.description);

      content.innerHTML =
        '<section class="section">' +
        '  <div class="container">' +
        '    <div class="surface page-hero">' +
        '      <p class="eyebrow">' + escapeHtml(heading.eyebrow) + "</p>" +
        '      <h1 class="section-title">' + escapeHtml(heading.title) + "</h1>" +
        '      <p class="section-subtitle">' + escapeHtml(heading.description) + "</p>" +
        "    </div>" +
        "  </div>" +
        "</section>" +
        '<section class="section" style="padding-top:0;">' +
        '  <div class="container shop-layout">' +
        '    <aside class="surface filter-panel">' + renderShopFilters() + "</aside>" +
        '    <section class="surface shop-panel">' +
        '      <div class="shop-toolbar">' +
        '        <p class="muted">Showing <strong style="color:var(--brand-text);">' + visible.length + "</strong> of " + items.length + " products</p>" +
        '        <div class="toolbar-actions">' +
        '          <button class="btn btn-outline shop-filter-toggle" type="button" data-open-shop-filters>Filters</button>' +
        '          <div class="view-toggle">' +
        '            <button class="view-button' + (state.view === "grid" ? " is-active" : "") + '" type="button" data-view="grid">▦</button>' +
        '            <button class="view-button' + (state.view === "list" ? " is-active" : "") + '" type="button" data-view="list">☰</button>' +
        "          </div>" +
        '          <select class="select" id="sort-select" style="min-width:210px;">' +
        renderSortOptions(state.sort) +
        "          </select>" +
        "        </div>" +
        "      </div>" +
        (state.query
          ? '<div class="shop-query-banner">Showing results for <strong>"' + escapeHtml(state.query) + '"</strong>.</div>'
          : "") +
        '      <div class="shop-grid' + (state.view === "list" ? " is-list" : "") + '" id="shop-grid">' +
        (visible.length
          ? visible.map(productCardMarkup).join("")
          : '<div class="empty-state"><p class="eyebrow">No products found</p><h2 class="card-title" style="margin-top:12px;font-size:34px;">Try adjusting your filters or search.</h2><p class="card-copy">We could not find a match for this combination. Reset filters, raise the price range or browse all products again.</p><div class="stack-actions"><button class="btn btn-blue" type="button" id="empty-reset">Show all products</button><a class="btn btn-outline" href="contact.html">Request help</a></div></div>') +
        "      </div>" +
        '      <div id="shop-sentinel"></div>' +
        (visible.length < items.length ? '<p class="load-note">Loading more products as you scroll...</p>' : "") +
        "    </section>" +
        "  </div>" +
        '  <div class="shop-filter-drawer" id="shop-filter-drawer">' +
        '    <div class="mobile-backdrop" data-close-shop-filters="true"></div>' +
        '    <div class="mobile-panel shop-filter-panel">' +
        '      <div class="split-row">' +
        '        <div><p class="logo-title" style="font-size:32px;margin:0;">Filters</p><p class="card-copy" style="margin-top:8px;">Refine the catalog without losing your place.</p></div>' +
        '        <button class="circle-button" type="button" data-close-shop-filters="true">✕</button>' +
        "      </div>" +
               renderShopFilters() +
        "    </div>" +
        "  </div>" +
        "</section>";

      if (globalSearchInput) {
        globalSearchInput.value = state.query;
      }

      bindCommonProductActions(content);
      bindShopInteractions();
      bindShopObserver(items.length);
    }

    function bindShopInteractions() {
      var shopFilterDrawer = document.getElementById("shop-filter-drawer");
      var openShopFiltersButton = content.querySelector("[data-open-shop-filters]");
      content.querySelectorAll("[data-filter-group]").forEach(function (button) {
        button.addEventListener("click", function () {
          state[button.getAttribute("data-filter-group")] = button.getAttribute("data-filter-value");
          state.visible = 12;
          state.lastLoadTriggerY = getScrollY();
          closeShopFilterDrawer();
          render();
        });
      });

      var priceRanges = content.querySelectorAll("[data-price-range]");
      var sortSelect = document.getElementById("sort-select");
      var clearFiltersButtons = content.querySelectorAll("[data-clear-filters]");
      var emptyResetButton = document.getElementById("empty-reset");

      function closeShopFilterDrawer() {
        if (shopFilterDrawer) {
          shopFilterDrawer.classList.remove("is-open");
        }
        document.body.classList.remove("modal-open");
      }

      if (openShopFiltersButton && shopFilterDrawer) {
        openShopFiltersButton.addEventListener("click", function () {
          shopFilterDrawer.classList.add("is-open");
          document.body.classList.add("modal-open");
        });

        shopFilterDrawer.addEventListener("click", function (event) {
          if (event.target && event.target.getAttribute("data-close-shop-filters")) {
            closeShopFilterDrawer();
          }
        });
      }

      priceRanges.forEach(function (priceRange) {
        priceRange.addEventListener("input", function () {
          state.price = Number(priceRange.value);
          content.querySelectorAll("[data-price-value]").forEach(function (priceValue) {
            priceValue.textContent = "Up to " + DATA.formatCurrency(state.price);
          });
        });

        priceRange.addEventListener("change", function () {
          state.price = Number(priceRange.value);
          state.visible = 12;
          state.lastLoadTriggerY = getScrollY();
          closeShopFilterDrawer();
          render();
        });
      });

      if (sortSelect) {
        sortSelect.addEventListener("change", function () {
          state.sort = sortSelect.value;
          render();
        });
      }

      content.querySelectorAll("[data-view]").forEach(function (button) {
        button.addEventListener("click", function () {
          state.view = button.getAttribute("data-view");
          render();
        });
      });

      clearFiltersButtons.forEach(function (clearFiltersButton) {
        clearFiltersButton.addEventListener("click", function () {
          state.category = initialCategorySlug || "all";
          state.material = "all";
          state.seating = "all";
          state.sort = "featured";
          state.price = maxPrice;
          state.query = "";
          state.visible = 12;
          state.lastLoadTriggerY = getScrollY();
          closeShopFilterDrawer();
          render();
        });
      });

      if (emptyResetButton) {
        emptyResetButton.addEventListener("click", function () {
          state.category = initialCategorySlug || "all";
          state.material = "all";
          state.seating = "all";
          state.sort = "featured";
          state.price = maxPrice;
          state.query = "";
          state.visible = 12;
          state.lastLoadTriggerY = getScrollY();
          closeShopFilterDrawer();
          render();
        });
      }
    }

    function bindShopObserver(total) {
      if (shopObserver) {
        shopObserver.disconnect();
      }

      var sentinel = document.getElementById("shop-sentinel");
      if (!sentinel || state.visible >= total || !("IntersectionObserver" in window)) {
        return;
      }

      shopObserver = new IntersectionObserver(
        function (entries) {
          if (entries[0] && entries[0].isIntersecting) {
            var scrollY = getScrollY();

            if (state.loadingMore || scrollY <= state.lastLoadTriggerY + 140) {
              return;
            }

            state.loadingMore = true;
            state.lastLoadTriggerY = scrollY;
            state.visible = Math.min(state.visible + 8, total);
            render();
            state.loadingMore = false;
          }
        },
        { rootMargin: "120px" }
      );
      shopObserver.observe(sentinel);
    }

    render();
  }

  function renderFilterGroup(title, options, selected, key, labelFn) {
    return (
      '<div class="filter-group"><p class="filter-title">' + escapeHtml(title) + "</p><div class=\"filter-options\">" +
      options
        .map(function (option) {
          return (
            '<button class="filter-option' + (selected === option ? " is-active" : "") + '" type="button" data-filter-group="' + key + '" data-filter-value="' + escapeHtml(option) + '">' +
            escapeHtml(labelFn(option)) +
            "</button>"
          );
        })
        .join("") +
      "</div></div>"
    );
  }

  function renderSortOptions(selected) {
    var options = [
      { value: "featured", label: "Featured" },
      { value: "popular", label: "Popular" },
      { value: "new", label: "New arrivals" },
      { value: "price-asc", label: "Price low → high" },
      { value: "price-desc", label: "Price high → low" }
    ];

    return options
      .map(function (option) {
        return '<option value="' + option.value + '"' + (selected === option.value ? " selected" : "") + ">" + option.label + "</option>";
      })
      .join("");
  }

  function renderCategoriesPage() {
    var categories = STORE.getCategories();
    var products = STORE.getProducts();
    var counts = {};
    products.forEach(function (product) {
      counts[product.categorySlug] = (counts[product.categorySlug] || 0) + 1;
    });

    setMeta("Categories | SUN SEATINGS", "Explore all SUN SEATINGS categories, from outdoor sofas to swings, umbrellas and bar sets.");

    content.innerHTML =
      '<section class="section">' +
      '  <div class="container">' +
      '    <div class="surface page-hero"><p class="eyebrow">Categories</p><h1 class="section-title">Browse the SUN SEATINGS collection by furniture type.</h1></div>' +
      '  </div>' +
      "</section>" +
      '<section class="section" style="padding-top:0;"><div class="container"><div class="grid grid-4">' +
      categories
        .map(function (category) {
          return categoryCardMarkup(category, counts[category.slug] || 0);
        })
        .join("") +
      "</div></div></section>";
  }

  function renderCategoryPage() {
    var slug = getParam("slug") || "outdoor-sofa";
    var category = STORE.getCategories().find(function (item) {
      return item.slug === slug;
    });

    if (!category) {
      renderNotFound("This category is not available.");
      return;
    }

    renderShopPage(slug, {
      eyebrow: "Category Page",
      title: category.name,
      description: category.description
    });
  }

  function renderProductPage() {
    var categorySlug = getParam("category") || "outdoor-sofa";
    var slug = getParam("slug") || "haven";
    var product = STORE.getProductBySlug(categorySlug, slug);

    if (!product) {
      renderNotFound("This product is not available.");
      return;
    }

    var related = STORE.getRelatedProducts(product);
    var activeImage = product.images[0];
    var activeTab = "Description";

    function render() {
      setMeta(product.seoTitle, product.seoDescription);

      content.innerHTML =
        '<section class="section">' +
        '  <div class="container">' +
        '    <div class="breadcrumbs"><a href="index.html">Home</a> / <a href="' + DATA.categoryUrl(product.categorySlug) + '">' + escapeHtml(product.categoryName) + "</a> / <strong style=\"color:var(--brand-text);\">" + escapeHtml(product.name) + "</strong></div>" +
        '    <div class="product-layout">' +
        '      <div class="surface product-gallery">' +
        '        <div class="product-hero-media">' +
          '          <span class="sale-badges"><span class="badge badge-red">' + escapeHtml(product.discountPercentage + "% OFF") + "</span></span>" +
          '          <img id="product-main-image" src="' + activeImage + '" alt="' + escapeHtml(product.name) + '">' +
        '          <span class="product-image-hint">Hover image to inspect details</span>' +
        "        </div>" +
        '        <div class="thumb-grid">' +
        product.images
          .map(function (image, index) {
            return (
              '<button class="thumb-button' + (image === activeImage ? " is-active" : "") + '" type="button" data-thumb="' + index + '" aria-label="View product image ' + String(index + 1) + '">' +
              '  <img src="' + image + '" alt="' + escapeHtml(product.name) + " thumbnail\">" +
              "</button>"
            );
          })
          .join("") +
        "        </div>" +
        "      </div>" +
        '      <div class="surface product-info">' +
        '        <div class="badge-row"><span class="badge badge-blue">' + escapeHtml(product.categoryName) + '</span><span class="badge badge-green">' + escapeHtml(product.availability) + "</span></div>" +
        '        <h1 class="section-title" style="font-size:64px;margin-top:18px;">' + escapeHtml(product.name) + "</h1>" +
        '        <p class="section-subtitle">' + escapeHtml(product.marketingCopy) + "</p>" +
        '        <div class="product-price"><span class="price-current">' + DATA.formatCurrency(product.price) + '</span><span class="price-original">' + DATA.formatCurrency(product.originalPrice) + '</span><span class="badge badge-green">You save ' + DATA.formatCurrency(product.originalPrice - product.price) + "</span></div>" +
        '        <div class="info-grid">' +
        [
          { label: "Material", value: product.material },
          { label: "Warranty", value: product.warranty },
          { label: "Delivery", value: "Pan India support" }
        ]
          .map(function (item) {
            return (
              '<div class="info-card"><p class="eyebrow" style="margin:0;color:var(--brand-muted);">' + escapeHtml(item.label) + '</p><p style="margin:12px 0 0;font-weight:800;">' + escapeHtml(item.value) + "</p></div>"
            );
          })
          .join("") +
        "        </div>" +
        '        <div class="product-actions" style="grid-template-columns:repeat(2,minmax(0,1fr));">' +
        '          <a class="btn btn-green" href="' + DATA.buildWhatsAppLink(DATA.siteConfig.whatsappNumber, product.name) + '" target="_blank" rel="noreferrer">WhatsApp Now</a>' +
        '          <a class="btn btn-blue" href="' + DATA.buildPhoneLink(DATA.siteConfig.phone) + '">Call Now</a>' +
        '          <a class="btn btn-outline" href="' + DATA.buildEmailLink(DATA.siteConfig.email, product.name) + '">📧 Email</a>' +
        '          <a class="btn btn-outline" href="' + DATA.siteConfig.catalogPdf + '" target="_blank" rel="noreferrer">📥 Download Catalog</a>' +
        "        </div>" +
        '        <div class="highlights"><p class="eyebrow" style="margin:0;color:var(--brand-muted);">Product Highlights</p><ul class="highlight-list">' +
        product.highlights
          .map(function (item) {
            return '<li><span class="highlight-check">✓</span><span>' + escapeHtml(item) + "</span></li>";
          })
          .join("") +
        "</ul></div>" +
        "      </div>" +
        "    </div>" +
        '    <div class="surface tab-shell" style="margin-top:28px;">' +
        '      <div class="tabs">' +
        ["Description", "Specifications", "Shipping info", "FAQ"]
          .map(function (tab) {
            return '<button class="tab-button' + (activeTab === tab ? " is-active" : "") + '" type="button" data-tab="' + tab + '">' + tab + "</button>";
          })
          .join("") +
        "      </div>" +
        '      <div class="tab-content">' + renderProductTab(product, activeTab) + "</div>" +
        "    </div>" +
        '    <div class="section-heading" style="margin-top:30px;"><p class="eyebrow">Related products</p><h2 class="section-title">More from the same collection</h2></div>' +
        '    <div class="grid grid-4">' +
        related.map(productCardMarkup).join("") +
        "    </div>" +
        "  </div>" +
        "</section>";

      bindCommonProductActions(content);
      bindProductEvents();
    }

    function bindProductEvents() {
      content.querySelectorAll("[data-thumb]").forEach(function (button) {
        button.addEventListener("click", function () {
          activeImage = product.images[Number(button.getAttribute("data-thumb"))];
          render();
        });
      });

      content.querySelectorAll("[data-tab]").forEach(function (button) {
        button.addEventListener("click", function () {
          activeTab = button.getAttribute("data-tab");
          render();
        });
      });
    }

    render();
  }

  function renderProductTab(product, tab) {
    if (tab === "Specifications") {
      return (
        '<div class="spec-table">' +
        product.specifications
          .map(function (specification) {
            return (
              '<div class="spec-row"><strong>' + escapeHtml(specification.label) + "</strong><span>" + escapeHtml(specification.value) + "</span></div>"
            );
          })
          .join("") +
        "</div>"
      );
    }

    if (tab === "Shipping info") {
      return (
        '<div class="grid grid-3">' +
        [
          { label: "Lead time", value: product.deliveryEstimate },
          { label: "Coverage", value: "Pan India delivery and dispatch support" },
          { label: "Packaging", value: "Protective packaging with transit coordination" }
        ]
          .map(function (item) {
            return '<div class="stack-card"><p class="eyebrow" style="margin:0;color:var(--brand-muted);">' + escapeHtml(item.label) + '</p><p class="card-copy" style="margin-top:10px;color:var(--brand-text);">' + escapeHtml(item.value) + "</p></div>";
          })
          .join("") +
        "</div>"
      );
    }

    if (tab === "FAQ") {
      return (
        '<div class="faq-list">' +
        product.faqs
          .map(function (faq) {
            return '<div class="faq-card"><strong>' + escapeHtml(faq.question) + '</strong><p class="card-copy">' + escapeHtml(faq.answer) + "</p></div>";
          })
          .join("") +
        "</div>"
      );
    }

    return '<div class="card-stack"><p class="card-copy" style="margin-top:0;">' + escapeHtml(product.description) + "</p><p class=\"card-copy\">" + escapeHtml(product.marketingCopy) + "</p></div>";
  }

  function renderAboutPage() {
    setMeta("About | SUN SEATINGS", "Learn about the SUN SEATINGS brand, luxury positioning and quotation-first customer experience.");
    content.innerHTML =
      '<section class="section"><div class="container"><div class="two-col">' +
      '  <div class="surface card"><p class="eyebrow">About Brand</p><h1 class="section-title">A luxury outdoor brand built for modern Indian spaces.</h1><p class="section-subtitle">SUN SEATINGS blends premium catalogue merchandising with personal quotation support. The site is designed to feel familiar to shoppers used to Flipkart, Amazon and Meesho, while elevating the brand with a cleaner, more luxurious finish.</p></div>' +
      '  <div class="surface card"><div class="grid grid-2">' +
      [
        ["Luxury-first", "Elevated brand expression with high-conversion ecommerce patterns."],
        ["Catalog model", "No cart or checkout. The journey ends in enquiry, WhatsApp or call."],
        ["Project-ready", "Made for homeowners, cafes, villas, resorts and architects."],
        ["CMS powered", "Admin can manage products, categories, banners, blog posts and enquiries."]
      ]
        .map(function (item) {
          return '<div class="trust-card"><h3 class="card-title" style="margin-top:0;font-size:24px;">' + item[0] + '</h3><p class="card-copy">' + item[1] + "</p></div>";
        })
        .join("") +
      "  </div></div>" +
      "</div></div></section>";
  }

  function renderContactPage() {
    setMeta("Contact | SUN SEATINGS", "Send a product enquiry, request quotation, call or start a WhatsApp conversation with SUN SEATINGS.");
    content.innerHTML =
      '<section class="section">' +
      '  <div class="container">' +
      '    <div class="surface page-hero"><p class="eyebrow">Contact / Enquiry</p><h1 class="section-title">Request quotation, WhatsApp support or a quick callback.</h1></div>' +
      '    <div class="two-col" style="margin-top:24px;">' +
      '      <div class="grid">' +
      contactCard("Phone", DATA.siteConfig.phone, DATA.buildPhoneLink(DATA.siteConfig.phone)) +
      contactCard("WhatsApp", "Chat with expert", DATA.buildWhatsAppLink(DATA.siteConfig.whatsappNumber), true) +
      contactCard("Email", DATA.siteConfig.email, "mailto:" + DATA.siteConfig.email) +
      contactCard("Studio", DATA.siteConfig.address, "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(DATA.siteConfig.address), true) +
      "      </div>" +
      enquiryFormMarkup({ type: "general", title: "General enquiry form" }) +
      "    </div>" +
      "  </div>" +
      "</section>";
    bindEnquiryForms(content);
  }

  function contactCard(label, value, href, external) {
    return (
      '<a class="surface card" href="' + href + '"' + (external ? ' target="_blank" rel="noreferrer"' : "") + ">" +
      '  <p class="eyebrow" style="color:var(--brand-muted);margin:0;">' + escapeHtml(label) + "</p>" +
      '  <p class="card-title" style="margin-top:12px;font-size:28px;">' + escapeHtml(value) + "</p>" +
      "</a>"
    );
  }

  function renderCatalogPage() {
    var categories = STORE.getCategories();
    var products = STORE.getProducts();
    setMeta("Catalog PDF | SUN SEATINGS", "Request the SUN SEATINGS digital catalog and get a quotation-ready product guide.");

    content.innerHTML =
      '<section class="section"><div class="container">' +
      '  <div class="two-col">' +
      '    <div class="surface card"><p class="eyebrow">Catalog PDF download page</p><h1 class="section-title">Open the digital catalog instantly.</h1><p class="section-subtitle">When you click the button below, you will be redirected to the SUN SEATINGS catalog on Google Drive.</p><div class="stack-actions"><a class="btn btn-primary" href="' + DATA.siteConfig.catalogPdf + '" target="_blank" rel="noreferrer">Open Catalog PDF</a><a class="btn btn-outline" href="' + DATA.siteConfig.catalogPdf + '" target="_blank" rel="noreferrer">Go to Google Drive</a></div></div>' +
      '    <div class="surface card"><div class="grid grid-2"><div class="trust-card"><p class="eyebrow" style="color:var(--brand-muted);margin:0;">Categories</p><p class="stats-value">' + categories.length + '</p></div><div class="trust-card"><p class="eyebrow" style="color:var(--brand-muted);margin:0;">Products</p><p class="stats-value">' + products.length + "</p></div></div></div>" +
      "  </div>" +
      '  <div class="surface card" style="margin-top:24px;text-align:center;"><p class="card-copy" style="margin-top:0;">Catalog access is hosted on Google Drive for easier sharing and viewing across devices.</p><div class="stack-actions" style="justify-content:center;"><a class="btn btn-primary" href="' + DATA.siteConfig.catalogPdf + '" target="_blank" rel="noreferrer">Open Catalog</a></div></div>' +
      "</div></section>";
  }

  function renderBlogPage() {
    var posts = STORE.getBlogPosts();
    setMeta("Blog | SUN SEATINGS", "SEO-ready blog for SUN SEATINGS covering outdoor furniture buying guides, styling and trends.");

    content.innerHTML =
      '<section class="section"><div class="container">' +
      '  <div class="surface page-hero"><p class="eyebrow">Blog / SEO Engine</p><h1 class="section-title">Design stories and search-friendly buying guides.</h1></div>' +
      '  <div class="grid grid-3" style="margin-top:24px;">' +
      posts
        .map(function (post) {
          return (
            '<article class="surface card">' +
            '  <div class="blog-card-media" style="height:260px;"><img src="' + post.featuredImage + '" alt="' + escapeHtml(post.title) + '" style="height:260px;padding:22px;"></div>' +
            '  <div class="blog-card-body">' +
            '    <div class="badge-row">' +
            post.tags
              .map(function (tag) {
                return '<span class="badge badge-blue">' + escapeHtml(tag) + "</span>";
              })
              .join("") +
            "    </div>" +
            '    <h2 class="card-title">' + escapeHtml(post.title) + "</h2>" +
            '    <p class="card-copy">' + escapeHtml(post.excerpt) + "</p>" +
            '    <a class="eyebrow" style="margin-top:16px;display:inline-flex;" href="' + DATA.blogPostUrl(post.slug) + '">Read article</a>' +
            "  </div>" +
            "</article>"
          );
        })
        .join("") +
      "  </div>" +
      "</div></section>";
  }

  function renderBlogPostPage() {
    var slug = getParam("slug") || DATA.blogPosts[0].slug;
    var post = STORE.getBlogPostBySlug(slug);

    if (!post) {
      renderNotFound("This article is not available.");
      return;
    }

    setMeta(post.seoTitle || post.title, post.seoDescription || post.excerpt);

    content.innerHTML =
      '<section class="section"><div class="container">' +
      '  <article class="surface card" style="max-width:980px;margin:0 auto;">' +
      '    <div class="blog-card-media" style="height:340px;"><img src="' + post.featuredImage + '" alt="' + escapeHtml(post.title) + '" style="height:340px;padding:28px;"></div>' +
      '    <p class="eyebrow" style="margin-top:24px;">' + DATA.formatDate(post.publishedAt) + "</p>" +
      '    <h1 class="section-title">' + escapeHtml(post.title) + "</h1>" +
      '    <p class="section-subtitle">' + escapeHtml(post.excerpt) + "</p>" +
      '    <div class="badge-row" style="margin-top:18px;">' +
      post.tags
        .map(function (tag) {
          return '<span class="badge badge-blue">' + escapeHtml(tag) + "</span>";
        })
        .join("") +
      "    </div>" +
      '    <div class="rich-text" style="margin-top:24px;">' + formatRichText(post.body) + "</div>" +
      "  </article>" +
      "</div></section>";
  }

  function renderNotFound(message) {
    setMeta("Not Found | SUN SEATINGS", "The requested content could not be found.");
    content.innerHTML =
      '<section class="section"><div class="container"><div class="surface page-hero" style="text-align:center;max-width:880px;margin:0 auto;">' +
      '  <p class="eyebrow">404</p>' +
      '  <h1 class="section-title">The page you requested is not in this collection.</h1>' +
      '  <p class="section-subtitle">' + escapeHtml(message) + "</p>" +
      '  <div class="stack-actions" style="justify-content:center;"><a class="btn btn-blue" href="index.html">Back to homepage</a></div>' +
      "</div></div></section>";
  }

  function initializePage() {
    renderChrome();
    bindChromeEvents();
    bindModalEvents();

    if (page === "home") {
      renderHome();
    } else if (page === "shop") {
      renderShopPage("all", {
        eyebrow: "Shop / All Products",
        title: "Luxury furniture catalogue with filters, quick view and enquiry-first CTAs.",
        description:
          "This is the largest catalog page in the experience. Filter by price, material and seating capacity, then open a quick view or jump into a full detail page."
      });
    } else if (page === "categories") {
      renderCategoriesPage();
    } else if (page === "category") {
      renderCategoryPage();
    } else if (page === "product") {
      renderProductPage();
    } else if (page === "about") {
      renderAboutPage();
    } else if (page === "contact") {
      renderContactPage();
    } else if (page === "catalog") {
      renderCatalogPage();
    } else if (page === "blog") {
      renderBlogPage();
    } else if (page === "blog-post") {
      renderBlogPostPage();
    } else {
      renderNotFound("The page type was not recognised.");
    }

    bindEnquiryForms(document);
  }

  mountSiteLoader();
  initializePage();
})();
