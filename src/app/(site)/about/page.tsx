import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About SUN SEATINGS",
  description: "Learn about the SUN SEATINGS brand, luxury positioning and quotation-first customer experience."
};

export default function AboutPage() {
  return (
    <section className="section-space pt-8">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
          <div className="surface-card p-8 sm:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">About Brand</p>
            <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937] sm:text-6xl">
              A luxury outdoor brand built for modern Indian spaces.
            </h1>
            <p className="mt-5 text-sm leading-8 text-[#6b7280] sm:text-base">
              SUN SEATINGS blends premium catalogue merchandising with personal quotation support.
              The site is designed to feel familiar to shoppers used to Flipkart, Amazon and Meesho,
              while elevating the brand with a cleaner, more luxurious finish.
            </p>
          </div>

          <div className="surface-card p-8 sm:p-10">
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                ["Luxury-first", "Elevated brand expression with high-conversion ecommerce patterns."],
                ["Catalog model", "No cart or checkout. The journey ends in enquiry, WhatsApp or call."],
                ["Project-ready", "Made for homeowners, cafés, villas, resorts and architects."],
                ["CMS powered", "Admin can manage products, categories, banners, blog posts and enquiries."]
              ].map(([title, copy]) => (
                <div className="rounded-[28px] bg-[#f8fbff] p-5" key={title}>
                  <p className="text-lg font-semibold text-[#1f2937]">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-[#6b7280]">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
