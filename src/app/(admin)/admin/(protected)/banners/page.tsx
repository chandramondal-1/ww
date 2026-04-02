import { createBannerAction } from "@/app/(admin)/admin/actions";
import { getAllBanners } from "@/lib/store";

export default async function AdminBannersPage() {
  const banners = await getAllBanners();

  return (
    <div className="space-y-6">
      <div className="rounded-[34px] bg-white p-8 shadow-card">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Banner Manager</p>
        <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937]">
          Manage homepage sliders and conversion banners
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <form action={createBannerAction} className="surface-card space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-[#1f2937]">Add banner</h2>
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="title" placeholder="Banner title" required />
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="subtitle" placeholder="Banner subtitle" required />
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="image" placeholder="/assets/catalog/Sofa Sets/Haven.png" />
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="ctaLabel" placeholder="CTA label" />
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="ctaHref" placeholder="/shop" />
          <label className="flex items-center gap-3 text-sm font-semibold text-[#1f2937]">
            <input defaultChecked name="active" type="checkbox" />
            Banner active
          </label>
          <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#2874F0] px-6 text-sm font-semibold text-white" type="submit">
            Save banner
          </button>
        </form>

        <div className="surface-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-[#1f2937]">Current banners</h2>
          <div className="space-y-4">
            {banners.map((banner) => (
              <div className="rounded-[24px] border border-slate-200 p-5" key={banner.id}>
                <p className="font-semibold text-[#1f2937]">{banner.title}</p>
                <p className="mt-2 text-sm text-[#6b7280]">{banner.subtitle}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-[#2874F0]">
                  {banner.active ? "Active" : "Paused"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
