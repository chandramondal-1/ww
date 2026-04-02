"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

import { Category } from "@/lib/types";
import { popularSearches, siteConfig } from "@/data/catalog";
import { assetPath, buildPhoneLink, buildWhatsAppLink } from "@/lib/utils";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  WhatsappIcon
} from "@/components/icons";

type SearchItem = {
  slug: string;
  categorySlug: string;
  name: string;
  categoryName: string;
  image: string;
};

type SiteChromeProps = {
  categories: Category[];
  searchIndex: SearchItem[];
  children: ReactNode;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export function SiteChrome({ categories, searchIndex, children }: SiteChromeProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [showTopButton, setShowTopButton] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredSearch = useMemo(() => {
    if (!search.trim()) {
      return searchIndex.slice(0, 5);
    }

    const query = search.toLowerCase();
    return searchIndex
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query) || item.categoryName.toLowerCase().includes(query)
      )
      .slice(0, 6);
  }, [search, searchIndex]);

  return (
    <div className="min-h-screen">
      <div className="bg-[#0f4db9] text-white">
        <div className="container-shell flex min-h-10 items-center justify-center text-center text-xs font-semibold tracking-[0.22em] sm:text-sm">
          Summer Sale • Up to 60% OFF • Free styling advice • Pan India delivery
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/90 backdrop-blur-xl">
        <div className="container-shell flex h-20 items-center gap-4">
          <Link className="flex min-w-0 items-center" href="/">
            <div className="relative h-[52px] w-[168px] shrink-0 overflow-hidden sm:h-[60px] sm:w-[238px]">
              <Image
                alt="SUN SEATINGS logo"
                fill
                className="object-contain"
                src={assetPath("LOGO", "SUN SEATINGS.png")}
                unoptimized
              />
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              const isCategories = link.href === "/categories";

              return (
                <div className="group relative" key={link.href}>
                  <Link
                    className={`flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
                      active ? "bg-[#2874F0] text-white" : "text-[#1f2937] hover:bg-[#eef4ff]"
                    }`}
                    href={link.href}
                  >
                    {link.label}
                    {isCategories ? <ChevronDownIcon className="h-4 w-4" /> : null}
                  </Link>

                  {isCategories ? (
                    <div className="invisible absolute left-0 top-full z-20 mt-4 w-[560px] rounded-[28px] border border-slate-200 bg-white p-5 opacity-0 shadow-soft transition-all group-hover:visible group-hover:opacity-100">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="font-[var(--font-heading)] text-2xl font-semibold text-[#1f2937]">
                            Shop by category
                          </p>
                          <p className="text-sm text-[#6b7280]">
                            Premium outdoor pieces curated for every space.
                          </p>
                        </div>
                        <Link
                          className="text-sm font-semibold text-[#2874F0]"
                          href="/categories"
                        >
                          View all
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {categories.map((category) => (
                          <Link
                            className="group/item flex items-center gap-3 rounded-2xl border border-slate-100 p-3 transition hover:border-[#2874F0]/30 hover:bg-[#f8fbff]"
                            href={`/categories/${category.slug}`}
                            key={category.slug}
                          >
                            <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#f5f7fa]">
                              <Image
                                alt={category.name}
                                fill
                                className="object-contain p-1.5 transition duration-300 group-hover/item:scale-105"
                                src={category.bannerImage}
                                unoptimized
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-[#1f2937]">{category.name}</p>
                              <p className="text-xs text-[#6b7280]">{category.badge}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </nav>

          <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
            <div className="relative w-full max-w-md">
              <button
                className="flex h-12 w-full items-center gap-3 rounded-full border border-slate-200 bg-[#f8fbff] px-4 text-left text-sm text-[#6b7280] transition hover:border-[#2874F0]/40"
                onClick={() => setSearchOpen((current) => !current)}
                type="button"
              >
                <SearchIcon className="h-4 w-4 text-[#2874F0]" />
                Search collections, materials, category names...
              </button>

              <AnimatePresence>
                {searchOpen ? (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute left-0 right-0 top-[calc(100%+14px)] z-30 rounded-[28px] border border-slate-200 bg-white p-4 shadow-soft"
                    exit={{ opacity: 0, y: -8 }}
                    initial={{ opacity: 0, y: -8 }}
                  >
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4">
                      <SearchIcon className="h-4 w-4 text-[#2874F0]" />
                      <input
                        className="h-12 w-full bg-transparent text-sm outline-none"
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search for Haven, swings, dining..."
                        value={search}
                      />
                    </div>

                    <div className="mt-4 space-y-2">
                      {filteredSearch.map((item) => (
                        <Link
                          className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-[#f8fbff]"
                          href={`/${item.categorySlug}/${item.slug}`}
                          key={`${item.categorySlug}-${item.slug}`}
                          onClick={() => setSearchOpen(false)}
                        >
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-[#f5f7fa]">
                            <Image
                              alt={item.name}
                              fill
                              className="object-contain p-1.5"
                              src={item.image}
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#1f2937]">{item.name}</p>
                            <p className="text-xs text-[#6b7280]">{item.categoryName}</p>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-4">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#6b7280]">
                        Popular searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((item) => (
                          <button
                            className="rounded-full bg-[#f5f7fa] px-3 py-2 text-xs font-semibold text-[#1f2937] transition hover:bg-[#2874F0] hover:text-white"
                            key={item}
                            onClick={() => setSearch(item)}
                            type="button"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <Link
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white transition hover:brightness-95"
              href={buildWhatsAppLink(siteConfig.whatsappNumber)}
              rel="noreferrer"
              target="_blank"
            >
              <WhatsappIcon className="h-4 w-4" />
              WhatsApp
            </Link>
          </div>

          <button
            className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-[#1f2937] lg:hidden"
            onClick={() => setMobileOpen(true)}
            type="button"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-slate-200 bg-[#111827] text-white">
        <div className="container-shell grid gap-10 py-14 lg:grid-cols-[1.4fr,1fr,1fr,1fr]">
          <div>
            <p className="font-[var(--font-heading)] text-4xl font-semibold tracking-[0.08em]">
              SUN SEATINGS
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
              A luxury furniture catalog designed to feel like a premium commerce experience, with
              quotation-first conversion for homes, architects, cafés and hospitality projects.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-300">
              <p>{siteConfig.address}</p>
              <p>{siteConfig.phone}</p>
              <p>{siteConfig.email}</p>
              <p>{siteConfig.supportHours}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                aria-label="Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                href={siteConfig.instagramUrl}
                rel="noreferrer"
                target="_blank"
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <rect height="18" rx="5" ry="5" stroke="currentColor" strokeWidth="1.8" width="18" x="3" y="3" />
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                  <circle cx="17.5" cy="6.5" fill="currentColor" r="1" />
                </svg>
              </a>
              <a
                aria-label="Facebook"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white/15"
                href={siteConfig.facebookUrl}
                rel="noreferrer"
                target="_blank"
              >
                <svg aria-hidden="true" className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Shop</p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <Link href="/shop">All Products</Link>
              <Link href="/categories">Categories</Link>
              <Link href="/catalog">Catalog PDF</Link>
              <Link href="/blog">Design Journal</Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Categories</p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              {categories.slice(0, 6).map((category) => (
                <Link href={`/categories/${category.slug}`} key={category.slug}>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-slate-400">Support</p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <Link href="/about">About Brand</Link>
              <Link href="/contact">Contact & Enquiry</Link>
              <Link href="/admin">Admin Dashboard</Link>
              <Link href={buildPhoneLink(siteConfig.phone)}>Call Now</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="container-shell flex flex-col gap-4 py-5 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
            <p>© 2026 SUN SEATINGS. Built for luxury catalogue selling.</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white/5 px-3 py-1">SEO Ready</span>
              <span className="rounded-full bg-white/5 px-3 py-1">Lead Capture</span>
              <span className="rounded-full bg-white/5 px-3 py-1">Admin CMS</span>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3">
        <Link
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105"
          href={buildWhatsAppLink(siteConfig.whatsappNumber)}
          rel="noreferrer"
          target="_blank"
        >
          <WhatsappIcon className="h-6 w-6" />
        </Link>

        <Link
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#2874F0] text-white shadow-lg transition hover:scale-105"
          href={buildPhoneLink(siteConfig.phone)}
        >
          <PhoneIcon className="h-5 w-5" />
        </Link>

        {showTopButton ? (
          <button
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#1f2937] shadow-lg transition hover:-translate-y-1"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            type="button"
          >
            ↑
          </button>
        ) : null}
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.button
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              type="button"
            />
            <motion.aside
              animate={{ x: 0 }}
              className="fixed right-0 top-0 z-[60] flex h-full w-full max-w-sm flex-col bg-white p-6 shadow-soft"
              exit={{ x: "100%" }}
              initial={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
            >
              <div className="mb-8 flex items-center justify-between">
                <p className="font-[var(--font-heading)] text-3xl font-semibold text-[#1f2937]">
                  Menu
                </p>
                <button
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200"
                  onClick={() => setMobileOpen(false)}
                  type="button"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {navLinks.map((link) => (
                  <Link
                    className="rounded-2xl bg-[#f8fbff] px-4 py-3 text-sm font-semibold text-[#1f2937]"
                    href={link.href}
                    key={link.href}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-[#6b7280]">
                  Categories
                </p>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#1f2937]"
                      href={`/categories/${category.slug}`}
                      key={category.slug}
                      onClick={() => setMobileOpen(false)}
                    >
                      {category.name}
                      <ArrowRightIcon className="h-4 w-4" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-auto space-y-3 pt-8">
                <Link
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white"
                  href={buildWhatsAppLink(siteConfig.whatsappNumber)}
                  rel="noreferrer"
                  target="_blank"
                >
                  <WhatsappIcon className="h-4 w-4" />
                  WhatsApp Expert
                </Link>
                <Link
                  className="flex items-center justify-center gap-2 rounded-full bg-[#2874F0] px-5 py-3 text-sm font-semibold text-white"
                  href={buildPhoneLink(siteConfig.phone)}
                >
                  <PhoneIcon className="h-4 w-4" />
                  Call Now
                </Link>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
