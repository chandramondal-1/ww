"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Testimonial } from "@/lib/types";
import { QuoteIcon, StarIcon } from "@/components/icons";

type ReviewSliderProps = {
  items: Testimonial[];
};

export function ReviewSlider({ items }: ReviewSliderProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [items.length]);

  const item = items[active];

  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="surface-card overflow-hidden p-6 sm:p-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">
                Customer Reviews
              </p>
              <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-semibold text-[#1f2937] sm:text-5xl">
                Social proof that helps the page sell harder.
              </h2>
            </div>
            <QuoteIcon className="hidden h-16 w-16 text-[#2874F0]/20 sm:block" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]"
              exit={{ opacity: 0, y: -12 }}
              initial={{ opacity: 0, y: 12 }}
              key={item.id}
            >
              <div className="rounded-[28px] bg-[#f8fbff] p-6 sm:p-8">
                <div className="mb-4 flex gap-1 text-[#f59e0b]">
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <StarIcon className="h-5 w-5" key={index} />
                  ))}
                </div>
                <p className="text-lg leading-8 text-[#1f2937] sm:text-xl">{item.quote}</p>
                <div className="mt-6">
                  <p className="font-semibold text-[#1f2937]">{item.name}</p>
                  <p className="text-sm text-[#6b7280]">{item.city} • Verified luxury buyer</p>
                </div>
              </div>

              <div className="relative min-h-[320px] overflow-hidden rounded-[28px] bg-white">
                <Image
                  alt={item.name}
                  className="object-contain p-8"
                  fill
                  src={item.image}
                  unoptimized
                />
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-center gap-3">
            {items.map((entry, index) => (
              <button
                className={`h-2.5 rounded-full transition ${
                  active === index ? "w-10 bg-[#2874F0]" : "w-2.5 bg-[#cbd5e1]"
                }`}
                key={entry.id}
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
