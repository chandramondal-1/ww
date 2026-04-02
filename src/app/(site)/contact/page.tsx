import Link from "next/link";
import { Metadata } from "next";

import { EnquiryForm } from "@/components/enquiry-form";
import { siteConfig } from "@/data/catalog";
import { buildPhoneLink, buildWhatsAppLink } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact & Enquiry",
  description: "Send a product enquiry, request quotation, call or start a WhatsApp conversation with SUN SEATINGS."
};

export default function ContactPage() {
  return (
    <section className="section-space pt-8">
      <div className="container-shell">
        <div className="mb-8 rounded-[38px] bg-white p-8 shadow-card sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Contact / Enquiry</p>
          <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937] sm:text-6xl">
            Request quotation, WhatsApp support or a quick callback.
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr,1.1fr]">
          <div className="space-y-5">
            {[
              ["Phone", siteConfig.phone, buildPhoneLink(siteConfig.phone)],
              ["WhatsApp", "Chat with expert", buildWhatsAppLink(siteConfig.whatsappNumber)],
              ["Email", siteConfig.email, `mailto:${siteConfig.email}`],
              ["Studio", siteConfig.address, "#"]
            ].map(([label, value, href]) => (
              <Link className="surface-card block p-6" href={href} key={label} target={label === "Studio" ? undefined : "_blank"}>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#6b7280]">{label}</p>
                <p className="mt-3 text-lg font-semibold text-[#1f2937]">{value}</p>
              </Link>
            ))}
          </div>

          <EnquiryForm title="General enquiry form" type="general" />
        </div>
      </div>
    </section>
  );
}
