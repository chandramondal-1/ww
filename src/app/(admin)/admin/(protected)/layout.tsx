import type { ReactNode } from "react";
import Link from "next/link";

import { logoutAction } from "@/app/(admin)/admin/actions";
import { requireAdmin } from "@/lib/auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Product Manager" },
  { href: "/admin/categories", label: "Category Manager" },
  { href: "/admin/enquiries", label: "Enquiry Manager" },
  { href: "/admin/banners", label: "Banner Manager" },
  { href: "/admin/blog", label: "Blog Manager" }
];

export default async function AdminProtectedLayout({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div className="container-shell grid gap-6 py-6 lg:grid-cols-[280px,1fr]">
        <aside className="surface-card h-fit p-5 lg:sticky lg:top-6">
          <p className="font-[var(--font-heading)] text-4xl font-semibold text-[#1f2937]">
            Admin CMS
          </p>
          <p className="mt-2 text-sm text-[#6b7280]">Manage catalogue content and incoming leads.</p>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <Link className="block rounded-2xl bg-[#f8fbff] px-4 py-3 text-sm font-semibold text-[#1f2937]" href={item.href} key={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <form action={logoutAction} className="mt-8">
            <button className="inline-flex h-11 items-center justify-center rounded-full bg-[#1f2937] px-5 text-sm font-semibold text-white" type="submit">
              Logout
            </button>
          </form>
        </aside>

        <div>{children}</div>
      </div>
    </div>
  );
}
