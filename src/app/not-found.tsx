import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="mx-auto max-w-3xl rounded-[38px] bg-white p-8 text-center shadow-card sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">404</p>
          <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937]">
            The page you requested is not in this collection.
          </h1>
          <p className="mt-4 text-sm leading-8 text-[#6b7280]">
            Try browsing the product catalogue, category pages or the homepage hero sections.
          </p>
          <Link className="mt-8 inline-flex rounded-full bg-[#2874F0] px-6 py-3 text-sm font-semibold text-white" href="/">
            Back to homepage
          </Link>
        </div>
      </div>
    </section>
  );
}
