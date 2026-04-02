"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { HeroSlide } from "@/lib/types";
import { ArrowRightIcon, DownloadIcon } from "@/components/icons";

type HeroCarouselProps = {
  slides: HeroSlide[];
};

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active];

  return (
    <section className="section-space pt-8">
      <div className="container-shell">
        <div className="hero-gradient relative overflow-hidden rounded-[38px] px-6 py-10 shadow-soft sm:px-10 lg:px-14 lg:py-14">
          <div className="absolute inset-0 bg-hero-mesh opacity-80" />

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr,0.95fr]">
            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="text-white"
                exit={{ opacity: 0, y: 18 }}
                initial={{ opacity: 0, y: 18 }}
                key={slide.id}
                transition={{ duration: 0.4 }}
              >
                <div className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
                  {slide.eyebrow}
                </div>
                <h1 className="max-w-2xl font-[var(--font-heading)] text-5xl font-semibold leading-none sm:text-6xl lg:text-7xl">
                  {slide.title}
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                  {slide.subtitle}
                </p>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    className="inline-flex items-center gap-2 rounded-full bg-[#FF6A00] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#e85d00]"
                    href={slide.ctaPrimary.href}
                  >
                    {slide.ctaPrimary.label}
                    <ArrowRightIcon className="h-4 w-4" />
                  </Link>
                  <Link
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                    href={slide.ctaSecondary.href}
                  >
                    <DownloadIcon className="h-4 w-4" />
                    {slide.ctaSecondary.label}
                  </Link>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    ["100K+", "happy customers"],
                    ["90+", "Lighthouse-ready design"],
                    ["24 hrs", "quotation response target"]
                  ].map(([value, label]) => (
                    <div className="rounded-3xl border border-white/20 bg-white/10 p-4" key={label}>
                      <p className="text-2xl font-extrabold">{value}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-white/70">
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
                exit={{ opacity: 0, scale: 0.96 }}
                initial={{ opacity: 0, scale: 0.96 }}
                key={slide.image}
                transition={{ duration: 0.45 }}
              >
                <div className="relative mx-auto flex min-h-[430px] max-w-[600px] items-end justify-center overflow-hidden rounded-[34px] border border-white/20 bg-white/10 p-8 backdrop-blur">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.26),transparent_32%)]" />
                  <Image
                    alt={slide.title}
                    className="relative z-10 h-auto max-h-[380px] w-full object-contain drop-shadow-[0_24px_48px_rgba(15,23,42,0.35)]"
                    height={700}
                    priority
                    src={slide.image}
                    unoptimized
                    width={700}
                  />
                  <div className="absolute bottom-5 right-5 rounded-full bg-[#FF6A00] px-5 py-3 text-center text-sm font-bold text-white shadow-lg">
                    Up to 60% OFF
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative mt-8 flex items-center justify-center gap-3">
            {slides.map((item, index) => (
              <button
                className={`h-2.5 rounded-full transition ${
                  active === index ? "w-10 bg-white" : "w-2.5 bg-white/40"
                }`}
                key={item.id}
                onClick={() => setActive(index)}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
