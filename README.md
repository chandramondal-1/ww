# SUN SEATINGS

This workspace now contains a plain `HTML + CSS + JavaScript` version of the SUN SEATINGS luxury furniture catalog website.

## Static entry files

- `index.html`
- `shop.html`
- `categories.html`
- `category.html?slug=outdoor-sofa`
- `product.html?category=outdoor-sofa&slug=haven`
- `about.html`
- `contact.html`
- `catalog.html`
- `blog.html`
- `blog-post.html?slug=choose-outdoor-furniture-indian-weather`
- `admin-login.html`
- `admin.html`

## Static asset files

- `assets/css/styles.css`
- `assets/js/data.js`
- `assets/js/store.js`
- `assets/js/app.js`
- `assets/js/admin.js`

## Catalog assets

All provided furniture images remain in:

- `public/assets/catalog`

The static site reads them directly from there.

## How the static CMS works

- Public product, category, banner and blog seed data comes from `assets/js/data.js`
- Admin-created products, categories, banners, blog posts and enquiries are saved in browser `localStorage`
- This means the admin dashboard is fully static and works without Node, but data is browser-local rather than server-shared

## Demo admin login

- Email: `agaunny2000@gmail.com`
- Password: `wicker123`

## Notes

- The older Next.js scaffold is still present in `src/` if you want to reuse it later
- The pure static version is the one served by the root `.html` files
- Because this is now static, server features like PostgreSQL, SMTP and Cloudinary are not active in the HTML/JS version unless you reconnect them later through a real backend
