(function () {
  var DATA = window.WW_DATA;
  var STORE = window.WW_STORE;
  var page = document.body.dataset.page;
  var root = document.getElementById("admin-root");

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function setMeta(title, description) {
    document.title = title;
    var tag = document.querySelector('meta[name="description"]');
    if (tag && description) {
      tag.setAttribute("content", description);
    }
  }

  function renderLoginPage() {
    if (STORE.isLoggedIn()) {
      window.location.href = "admin.html";
      return;
    }

    setMeta("Admin Login | SUN SEATINGS", "Admin login for the SUN SEATINGS static CMS dashboard.");

    root.innerHTML =
      '<section class="admin-shell">' +
      '  <div class="container">' +
      '    <div class="surface page-hero" style="max-width:760px;margin:0 auto;">' +
      '      <p class="eyebrow">Admin Login</p>' +
      '      <h1 class="section-title">CMS dashboard access</h1>' +
      '      <p class="section-subtitle">Use the demo credentials below. This static version keeps the session in your browser via localStorage.</p>' +
      '      <div class="surface card" style="margin-top:24px;background:#f8fbff;">' +
      '        <p style="margin:0 0 10px;font-weight:800;">Email : xyz@gmail.com</p>' +
      '        <p style="margin:0;font-weight:800;">Password: xyz</p>' +
      "      </div>" +
      '      <form id="login-form" class="form-grid" style="margin-top:24px;">' +
      '        <div class="field-full"><label>Email</label><input class="input" type="email" name="username" value="" required></div>' +
      '        <div class="field-full"><label>Password</label><input class="input" type="password" name="password" value="" required></div>' +
      '        <div class="field-full"><button class="btn btn-blue" type="submit">Login to dashboard</button><p class="form-note" id="login-note"></p></div>' +
      "      </form>" +
      '      <div class="stack-actions"><a class="btn btn-outline" href="index.html">Back to storefront</a></div>' +
      "    </div>" +
      "  </div>" +
      "</section>";

    var form = document.getElementById("login-form");
    var note = document.getElementById("login-note");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var data = new FormData(form);
      var success = STORE.login(String(data.get("username") || ""), String(data.get("password") || ""));

      if (!success) {
        note.className = "form-note is-error";
        note.textContent = "Invalid login details.";
        return;
      }

      note.className = "form-note is-success";
      note.textContent = "Login successful. Redirecting...";
      window.setTimeout(function () {
        window.location.href = "admin.html";
      }, 400);
    });
  }

  function renderAdminPage() {
    if (!STORE.isLoggedIn()) {
      window.location.href = "admin-login.html";
      return;
    }

    var state = {
      tab: "dashboard",
      flash: null
    };

    function setFlash(type, message) {
      state.flash = {
        type: type,
        message: message
      };
    }

    function renderFlash() {
      if (!state.flash) {
        return "";
      }

      return (
        '<div class="surface admin-panel admin-flash">' +
        '  <div class="split-row">' +
        '    <div>' +
        '      <p class="eyebrow" style="margin:0;color:' +
        (state.flash.type === "error" ? "var(--brand-danger)" : "var(--brand-success)") +
        ';">' +
        (state.flash.type === "error" ? "Needs attention" : "Update saved") +
        "</p>" +
        '      <p style="margin:10px 0 0;font-weight:800;">' + escapeHtml(state.flash.message) + "</p>" +
        "    </div>" +
        '    <button class="circle-button" type="button" data-clear-flash="true" aria-label="Dismiss notice">✕</button>' +
        "  </div>" +
        "</div>"
      );
    }

    function shell() {
      root.innerHTML =
        '<section class="admin-shell">' +
        '  <div class="container admin-grid">' +
        '    <aside class="surface admin-sidebar">' +
        '      <p class="logo-title" style="font-size:42px;margin:0;">Admin CMS</p>' +
        '      <p class="card-copy">Manage catalogue content and incoming leads.</p>' +
        '      <div class="admin-nav">' +
        ['dashboard', 'products', 'categories', 'enquiries', 'banners', 'blog']
          .map(function (tab) {
            var labels = {
              dashboard: "Dashboard",
              products: "Product Manager",
              categories: "Category Manager",
              enquiries: "Enquiry Manager",
              banners: "Banner Manager",
              blog: "Blog Manager"
            };
            return '<button class="admin-tab' + (state.tab === tab ? " is-active" : "") + '" type="button" data-admin-tab="' + tab + '">' + labels[tab] + "</button>";
          })
          .join("") +
        '      </div>' +
        '      <div class="stack-actions">' +
        '        <a class="btn btn-outline" href="index.html">Open storefront</a>' +
        '        <button class="btn btn-dark" type="button" id="admin-logout">Logout</button>' +
        "      </div>" +
        "    </aside>" +
        '    <section id="admin-panel"></section>' +
        "  </div>" +
        "</section>";
    }

    function statsCards() {
      var products = STORE.getProducts();
      var categories = STORE.getCategories();
      var enquiries = STORE.getEnquiries();
      var posts = STORE.getBlogPosts();
      return (
        '<div class="stats-row">' +
        statCard("Products", products.length) +
        statCard("Categories", categories.length) +
        statCard("Enquiries", enquiries.length) +
        statCard("Blog Posts", posts.length) +
        "</div>"
      );
    }

    function statCard(label, value) {
      return (
        '<div class="surface stats-card">' +
        '  <p class="eyebrow" style="color:var(--brand-muted);margin:0;">' + escapeHtml(label) + "</p>" +
        '  <p class="stats-value">' + String(value) + "</p>" +
        "</div>"
      );
    }

    function renderDashboardTab() {
      var enquiries = STORE.getEnquiries();
      return (
        '<div class="surface admin-panel">' +
        '  <p class="eyebrow">Dashboard</p>' +
        '  <h1 class="section-title">SUN SEATINGS admin overview</h1>' +
        '  <div style="margin-top:24px;">' + statsCards() + "</div>" +
        '  <div class="surface card" style="margin-top:24px;">' +
        '    <div class="split-row"><h2 class="card-title" style="margin:0;font-size:34px;">Recent enquiries</h2><span class="badge badge-blue">Lead inbox</span></div>' +
        '    <div class="card-stack" style="margin-top:18px;">' +
        (enquiries.length
          ? enquiries
              .slice(0, 6)
              .map(function (enquiry) {
                return (
                  '<div class="entry-card">' +
                  '  <div class="split-row"><div><p style="margin:0;font-weight:800;">' + escapeHtml(enquiry.name) + '</p><p class="card-copy" style="margin-top:6px;">' + escapeHtml((enquiry.productName || "General enquiry") + " • " + enquiry.phone) + '</p></div><div style="text-align:right;"><span class="status-pill">' + escapeHtml(enquiry.status) + '</span><p class="card-copy" style="margin-top:6px;">' + DATA.formatDate(enquiry.createdAt) + "</p></div></div>" +
                  "</div>"
                );
              })
              .join("")
          : '<p class="card-copy">No enquiries yet. Submit the public form to test the workflow.</p>') +
        "    </div>" +
        "  </div>" +
        "</div>"
      );
    }

    function originPill(item) {
      return item.origin === "seed" ? '<span class="badge badge-blue">Seed</span>' : '<span class="badge badge-green">Custom</span>';
    }

    function renderProductsTab() {
      var categories = STORE.getCategories();
      var products = STORE.getProducts();
      return (
        '<div class="grid">' +
        '  <div class="surface admin-panel"><p class="eyebrow">Product Manager</p><h1 class="section-title">Add products and manage catalogue visibility</h1></div>' +
        '  <div class="two-col">' +
        '    <form class="surface admin-panel" id="product-form">' +
        '      <h2 class="card-title" style="margin:0 0 18px;font-size:34px;">Add product</h2>' +
        '      <div class="form-grid">' +
        '        <div class="field-full"><label>Product name</label><input class="input" name="name" required></div>' +
        '        <div class="field-full"><label>Category</label><select class="select" name="categorySlug">' +
        categories
          .map(function (category) {
            return '<option value="' + escapeHtml(category.slug) + '">' + escapeHtml(category.name) + "</option>";
          })
          .join("") +
        '</select></div>' +
        '        <div class="field-full"><label>Short tagline</label><input class="input" name="tagline" required></div>' +
        '        <div class="field-full"><label>Description</label><textarea class="textarea" name="description" required></textarea></div>' +
        '        <div class="field"><label>Price</label><input class="input" type="number" name="price" required></div>' +
        '        <div class="field"><label>Original price</label><input class="input" type="number" name="originalPrice"></div>' +
        '        <div class="field"><label>Material</label><input class="input" name="material" required></div>' +
        '        <div class="field"><label>Seating capacity</label><input class="input" name="seatingCapacity" required></div>' +
        '        <div class="field"><label>Availability</label><select class="select" name="availability"><option>In Stock</option><option>Preorder</option><option>Limited Stock</option></select></div>' +
        '        <div class="field"><label>Image path</label><input class="input" name="image" value="' + escapeHtml(DATA.assetPath("Sofa Sets", "Haven.png")) + '"></div>' +
        '        <div class="field-full"><label><input type="checkbox" name="featured"> Mark as featured product</label></div>' +
        '        <div class="field-full"><button class="btn btn-blue" type="submit">Save product</button><p class="form-note" data-admin-note="product"></p></div>' +
        "      </div>" +
        "    </form>" +
        '    <div class="surface admin-panel"><h2 class="card-title" style="margin:0 0 18px;font-size:34px;">Catalogue items</h2>' +
        '      <div style="overflow:auto;max-height:760px;"><table class="list-table"><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Status</th><th>Type</th><th>Action</th></tr></thead><tbody>' +
        products
          .map(function (product) {
            return (
              "<tr>" +
              "<td><strong>" + escapeHtml(product.name) + "</strong></td>" +
              "<td>" + escapeHtml(product.categoryName) + "</td>" +
              "<td>" + DATA.formatCurrency(product.price) + "</td>" +
              "<td>" + escapeHtml(product.availability) + "</td>" +
              "<td>" + originPill(product) + "</td>" +
              "<td>" +
              (product.origin === "custom"
                ? '<button class="btn btn-outline" type="button" data-delete-product="' + escapeHtml(product.id) + '">Delete</button>'
                : '<span class="muted">Read only</span>') +
              "</td>" +
              "</tr>"
            );
          })
          .join("") +
        "</tbody></table></div></div>" +
        "  </div>" +
        "</div>"
      );
    }

    function renderCategoriesTab() {
      var categories = STORE.getCategories();
      return (
        '<div class="grid">' +
        '  <div class="surface admin-panel"><p class="eyebrow">Category Manager</p><h1 class="section-title">Manage homepage categories and banners</h1></div>' +
        '  <div class="two-col">' +
        '    <form class="surface admin-panel" id="category-form">' +
        '      <h2 class="card-title" style="margin:0 0 18px;font-size:34px;">Add category</h2>' +
        '      <div class="form-grid">' +
        '        <div class="field-full"><label>Category name</label><input class="input" name="name" required></div>' +
        '        <div class="field-full"><label>Asset folder name</label><input class="input" name="folder" value="Sofa Sets"></div>' +
        '        <div class="field-full"><label>Description</label><textarea class="textarea" name="description" required></textarea></div>' +
        '        <div class="field-full"><label>Banner image path</label><input class="input" name="bannerImage" value="' + escapeHtml(DATA.assetPath("Sofa Sets", "Haven.png")) + '"></div>' +
        '        <div class="field-full"><button class="btn btn-blue" type="submit">Save category</button><p class="form-note" data-admin-note="category"></p></div>' +
        "      </div>" +
        "    </form>" +
        '    <div class="surface admin-panel"><h2 class="card-title" style="margin:0 0 18px;font-size:34px;">Current categories</h2><div class="card-stack">' +
        categories
          .map(function (category) {
            return (
              '<div class="entry-card">' +
              '  <div class="split-row"><div><p style="margin:0;font-weight:800;">' + escapeHtml(category.name) + '</p><p class="card-copy">' + escapeHtml(category.description) + '</p></div><div>' +
              originPill(category) +
              (category.origin === "custom"
                ? '<button class="btn btn-outline" type="button" data-delete-category="' + escapeHtml(category.id) + '" style="margin-left:10px;">Delete</button>'
                : '<span class="muted" style="margin-left:10px;">Read only</span>') +
              "</div></div>" +
              "</div>"
            );
          })
          .join("") +
        "</div></div>" +
        "  </div>" +
        "</div>"
      );
    }

    function renderEnquiriesTab() {
      var enquiries = STORE.getEnquiries();
      return (
        '<div class="grid">' +
        '  <div class="surface admin-panel"><p class="eyebrow">Enquiry Manager</p><h1 class="section-title">View, triage and close customer enquiries</h1></div>' +
        '  <div class="surface admin-panel"><div class="card-stack">' +
        (enquiries.length
          ? enquiries
              .map(function (enquiry) {
                return (
                  '<div class="entry-card">' +
                  '  <div class="split-row" style="align-items:flex-start;gap:24px;">' +
                  "    <div>" +
                  '      <p style="margin:0;font-size:20px;font-weight:800;">' + escapeHtml(enquiry.name) + "</p>" +
                  '      <p class="card-copy">' + escapeHtml(enquiry.phone + " • " + (enquiry.email || "No email") + " • " + (enquiry.city || "City not provided")) + "</p>" +
                  '      <p class="card-copy" style="color:var(--brand-text);">' + escapeHtml(enquiry.message || "") + "</p>" +
                  '      <p class="eyebrow" style="color:var(--brand-muted);margin-top:12px;">' + escapeHtml((enquiry.productName || "General enquiry") + " • " + DATA.formatDate(enquiry.createdAt)) + "</p>" +
                  "    </div>" +
                  '    <div style="display:grid;gap:10px;min-width:220px;">' +
                  '      <select class="select" data-enquiry-status="' + escapeHtml(enquiry.id) + '">' +
                  ["New", "Contacted", "Closed"]
                    .map(function (status) {
                      return '<option value="' + status + '"' + (enquiry.status === status ? " selected" : "") + ">" + status + "</option>";
                    })
                    .join("") +
                  "</select>" +
                  '      <button class="btn btn-blue" type="button" data-update-enquiry="' + escapeHtml(enquiry.id) + '">Update</button>' +
                  '      <button class="btn btn-outline" type="button" data-delete-enquiry="' + escapeHtml(enquiry.id) + '">Delete</button>' +
                  "    </div>" +
                  "  </div>" +
                  "</div>"
                );
              })
              .join("")
          : '<p class="card-copy">No enquiries yet. Submit the public form to test the workflow.</p>') +
        "</div></div>" +
        "</div>"
      );
    }

    function renderBannersTab() {
      var banners = STORE.getBanners();
      return (
        '<div class="grid">' +
        '  <div class="surface admin-panel"><p class="eyebrow">Banner Manager</p><h1 class="section-title">Manage homepage sliders and conversion banners</h1></div>' +
        '  <div class="two-col">' +
        '    <form class="surface admin-panel" id="banner-form">' +
        '      <h2 class="card-title" style="margin:0 0 18px;font-size:34px;">Add banner</h2>' +
        '      <div class="form-grid">' +
        '        <div class="field-full"><label>Banner title</label><input class="input" name="title" required></div>' +
        '        <div class="field-full"><label>Banner subtitle</label><input class="input" name="subtitle" required></div>' +
        '        <div class="field-full"><label>Image path</label><input class="input" name="image" value="' + escapeHtml(DATA.assetPath("Sofa Sets", "Haven.png")) + '"></div>' +
        '        <div class="field"><label>CTA label</label><input class="input" name="ctaLabel" value="Explore"></div>' +
        '        <div class="field"><label>CTA link</label><input class="input" name="ctaHref" value="shop.html"></div>' +
        '        <div class="field-full"><label><input type="checkbox" name="active" checked> Banner active</label></div>' +
        '        <div class="field-full"><button class="btn btn-blue" type="submit">Save banner</button><p class="form-note" data-admin-note="banner"></p></div>' +
        "      </div>" +
        "    </form>" +
        '    <div class="surface admin-panel"><h2 class="card-title" style="margin:0 0 18px;font-size:34px;">Current banners</h2><div class="card-stack">' +
        banners
          .map(function (banner) {
            return (
              '<div class="entry-card">' +
              '  <div class="split-row"><div><p style="margin:0;font-weight:800;">' + escapeHtml(banner.title) + '</p><p class="card-copy">' + escapeHtml(banner.subtitle) + '</p></div><div>' +
              originPill(banner) +
              (banner.origin === "custom"
                ? '<button class="btn btn-outline" type="button" data-delete-banner="' + escapeHtml(banner.id) + '" style="margin-left:10px;">Delete</button>'
                : '<span class="muted" style="margin-left:10px;">Read only</span>') +
              "</div></div>" +
              "</div>"
            );
          })
          .join("") +
        "</div></div>" +
        "  </div>" +
        "</div>"
      );
    }

    function renderBlogTab() {
      var posts = STORE.getBlogPosts();
      return (
        '<div class="grid">' +
        '  <div class="surface admin-panel"><p class="eyebrow">Blog Manager</p><h1 class="section-title">Publish SEO articles that support category and product pages</h1></div>' +
        '  <div class="two-col">' +
        '    <form class="surface admin-panel" id="blog-form">' +
        '      <h2 class="card-title" style="margin:0 0 18px;font-size:34px;">Add blog post</h2>' +
        '      <div class="form-grid">' +
        '        <div class="field-full"><label>Blog title</label><input class="input" name="title" required></div>' +
        '        <div class="field-full"><label>Short excerpt</label><input class="input" name="excerpt" required></div>' +
        '        <div class="field-full"><label>Full blog content</label><textarea class="textarea" name="body" required></textarea></div>' +
        '        <div class="field-full"><label>Featured image path</label><input class="input" name="featuredImage" value="' + escapeHtml(DATA.assetPath("Sofa Sets", "Haven.png")) + '"></div>' +
        '        <div class="field-full"><label>Tags (comma separated)</label><input class="input" name="tags"></div>' +
        '        <div class="field"><label>SEO title</label><input class="input" name="seoTitle"></div>' +
        '        <div class="field"><label>SEO description</label><input class="input" name="seoDescription"></div>' +
        '        <div class="field-full"><button class="btn btn-blue" type="submit">Publish post</button><p class="form-note" data-admin-note="blog"></p></div>' +
        "      </div>" +
        "    </form>" +
        '    <div class="surface admin-panel"><h2 class="card-title" style="margin:0 0 18px;font-size:34px;">Published posts</h2><div class="card-stack">' +
        posts
          .map(function (post) {
            return (
              '<div class="entry-card">' +
              '  <div class="split-row"><div><p style="margin:0;font-weight:800;">' + escapeHtml(post.title) + '</p><p class="card-copy">' + escapeHtml(post.excerpt) + '</p><p class="eyebrow" style="color:var(--brand-muted);margin-top:10px;">' + DATA.formatDate(post.publishedAt) + '</p></div><div>' +
              originPill(post) +
              (post.origin === "custom"
                ? '<button class="btn btn-outline" type="button" data-delete-post="' + escapeHtml(post.id) + '" style="margin-left:10px;">Delete</button>'
                : '<span class="muted" style="margin-left:10px;">Read only</span>') +
              "</div></div>" +
              "</div>"
            );
          })
          .join("") +
        "</div></div>" +
        "  </div>" +
        "</div>"
      );
    }

    function renderTab() {
      shell();
      setMeta("Admin Dashboard | SUN SEATINGS", "Local static CMS dashboard for products, categories, enquiries, banners and blog posts.");

      var panel = document.getElementById("admin-panel");
      if (state.tab === "dashboard") panel.innerHTML = renderDashboardTab();
      if (state.tab === "products") panel.innerHTML = renderProductsTab();
      if (state.tab === "categories") panel.innerHTML = renderCategoriesTab();
      if (state.tab === "enquiries") panel.innerHTML = renderEnquiriesTab();
      if (state.tab === "banners") panel.innerHTML = renderBannersTab();
      if (state.tab === "blog") panel.innerHTML = renderBlogTab();

      if (state.flash) {
        panel.insertAdjacentHTML("afterbegin", renderFlash());
      }

      bindEvents();
    }

    function bindEvents() {
      root.querySelectorAll("[data-admin-tab]").forEach(function (button) {
        button.addEventListener("click", function () {
          state.tab = button.getAttribute("data-admin-tab");
          renderTab();
        });
      });

      var logoutButton = document.getElementById("admin-logout");
      if (logoutButton) {
        logoutButton.addEventListener("click", function () {
          STORE.logout();
          window.location.href = "admin-login.html";
        });
      }

      var productForm = document.getElementById("product-form");
      if (productForm) {
        productForm.addEventListener("submit", function (event) {
          event.preventDefault();
          var data = new FormData(productForm);
          try {
            STORE.saveProduct({
              name: data.get("name"),
              categorySlug: data.get("categorySlug"),
              tagline: data.get("tagline"),
              description: data.get("description"),
              price: data.get("price"),
              originalPrice: data.get("originalPrice"),
              material: data.get("material"),
              seatingCapacity: data.get("seatingCapacity"),
              availability: data.get("availability"),
              featured: data.get("featured") === "on",
              image: data.get("image")
            });
            setFlash("success", "Product saved successfully.");
            renderTab();
          } catch (error) {
            setFlash("error", error.message || "Product could not be saved.");
            renderTab();
          }
        });
      }

      var categoryForm = document.getElementById("category-form");
      if (categoryForm) {
        categoryForm.addEventListener("submit", function (event) {
          event.preventDefault();
          var data = new FormData(categoryForm);
          try {
            STORE.saveCategory({
              name: data.get("name"),
              folder: data.get("folder"),
              description: data.get("description"),
              bannerImage: data.get("bannerImage")
            });
            setFlash("success", "Category saved successfully.");
            renderTab();
          } catch (error) {
            setFlash("error", error.message || "Category could not be saved.");
            renderTab();
          }
        });
      }

      var bannerForm = document.getElementById("banner-form");
      if (bannerForm) {
        bannerForm.addEventListener("submit", function (event) {
          event.preventDefault();
          var data = new FormData(bannerForm);
          try {
            STORE.saveBanner({
              title: data.get("title"),
              subtitle: data.get("subtitle"),
              image: data.get("image"),
              ctaLabel: data.get("ctaLabel"),
              ctaHref: data.get("ctaHref"),
              active: data.get("active") === "on"
            });
            setFlash("success", "Banner saved successfully.");
            renderTab();
          } catch (error) {
            setFlash("error", error.message || "Banner could not be saved.");
            renderTab();
          }
        });
      }

      var blogForm = document.getElementById("blog-form");
      if (blogForm) {
        blogForm.addEventListener("submit", function (event) {
          event.preventDefault();
          var data = new FormData(blogForm);
          try {
            STORE.saveBlogPost({
              title: data.get("title"),
              excerpt: data.get("excerpt"),
              body: data.get("body"),
              featuredImage: data.get("featuredImage"),
              tags: String(data.get("tags") || "")
                .split(",")
                .map(function (item) {
                  return item.trim();
                })
                .filter(Boolean),
              seoTitle: data.get("seoTitle"),
              seoDescription: data.get("seoDescription")
            });
            setFlash("success", "Post published successfully.");
            renderTab();
          } catch (error) {
            setFlash("error", error.message || "Blog post could not be published.");
            renderTab();
          }
        });
      }

      root.onclick = function (event) {
        var target = event.target;
        var clearFlashButton = target.closest("[data-clear-flash]");
        var deleteProductButton = target.closest("[data-delete-product]");
        var deleteCategoryButton = target.closest("[data-delete-category]");
        var deleteBannerButton = target.closest("[data-delete-banner]");
        var deletePostButton = target.closest("[data-delete-post]");
        var deleteEnquiryButton = target.closest("[data-delete-enquiry]");
        var updateEnquiryButton = target.closest("[data-update-enquiry]");

        if (clearFlashButton) {
          state.flash = null;
          renderTab();
          return;
        }

        if (deleteProductButton) {
          if (!window.confirm("Delete this custom product from the catalog?")) {
            return;
          }
          STORE.deleteProduct(deleteProductButton.getAttribute("data-delete-product"));
          setFlash("success", "Product deleted successfully.");
          renderTab();
        }

        if (deleteCategoryButton) {
          if (!window.confirm("Delete this custom category?")) {
            return;
          }
          try {
            STORE.deleteCategory(deleteCategoryButton.getAttribute("data-delete-category"));
            setFlash("success", "Category deleted successfully.");
          } catch (error) {
            setFlash("error", error.message || "Category could not be deleted.");
          }
          renderTab();
        }

        if (deleteBannerButton) {
          if (!window.confirm("Delete this custom banner?")) {
            return;
          }
          STORE.deleteBanner(deleteBannerButton.getAttribute("data-delete-banner"));
          setFlash("success", "Banner deleted successfully.");
          renderTab();
        }

        if (deletePostButton) {
          if (!window.confirm("Delete this custom blog post?")) {
            return;
          }
          STORE.deleteBlogPost(deletePostButton.getAttribute("data-delete-post"));
          setFlash("success", "Blog post deleted successfully.");
          renderTab();
        }

        if (deleteEnquiryButton) {
          if (!window.confirm("Delete this enquiry from the inbox?")) {
            return;
          }
          STORE.deleteEnquiry(deleteEnquiryButton.getAttribute("data-delete-enquiry"));
          setFlash("success", "Enquiry deleted successfully.");
          renderTab();
        }

        if (updateEnquiryButton) {
          var id = updateEnquiryButton.getAttribute("data-update-enquiry");
          var select = root.querySelector('[data-enquiry-status="' + id + '"]');
          if (!select) {
            setFlash("error", "Enquiry status could not be updated.");
            renderTab();
            return;
          }
          STORE.updateEnquiryStatus(id, select.value);
          setFlash("success", "Enquiry status updated to " + select.value + ".");
          renderTab();
        }
      };
    }

    renderTab();
  }

  if (page === "admin-login") {
    renderLoginPage();
  }

  if (page === "admin") {
    renderAdminPage();
  }
})();
