import Link from "next/link";

import { getAllBlogPosts, getAllCategories, getAllProducts, getStoredEnquiries } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [products, categories, enquiries, blogPosts] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
    getStoredEnquiries(),
    getAllBlogPosts()
  ]);

  return (
    <div className="space-y-6">
      <div className="rounded-[34px] bg-white p-8 shadow-card">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Dashboard</p>
        <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937]">
          SUN SEATINGS admin overview
        </h1>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Products", String(products.length)],
          ["Categories", String(categories.length)],
          ["Enquiries", String(enquiries.length)],
          ["Blog Posts", String(blogPosts.length)]
        ].map(([label, value]) => (
          <div className="surface-card p-6" key={label}>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#6b7280]">{label}</p>
            <p className="mt-3 text-4xl font-extrabold text-[#1f2937]">{value}</p>
          </div>
        ))}
      </div>

      <div className="surface-card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1f2937]">Recent enquiries</h2>
          <Link className="text-sm font-semibold text-[#2874F0]" href="/admin/enquiries">
            Open manager
          </Link>
        </div>

        <div className="space-y-4">
          {enquiries.slice(0, 6).map((enquiry) => (
            <div className="rounded-[24px] border border-slate-200 p-5" key={enquiry.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-[#1f2937]">{enquiry.name}</p>
                  <p className="text-sm text-[#6b7280]">
                    {enquiry.productName || "General enquiry"} • {enquiry.phone}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#2874F0]">{enquiry.status}</p>
                  <p className="text-xs text-[#6b7280]">{formatDate(enquiry.createdAt)}</p>
                </div>
              </div>
            </div>
          ))}

          {enquiries.length === 0 ? (
            <p className="text-sm text-[#6b7280]">No enquiries yet. Public forms will populate this section.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
