import { createCategoryAction } from "@/app/(admin)/admin/actions";
import { getAllCategories } from "@/lib/store";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div className="rounded-[34px] bg-white p-8 shadow-card">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Category Manager</p>
        <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937]">
          Manage homepage categories and banners
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr,1.1fr]">
        <form action={createCategoryAction} className="surface-card space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-[#1f2937]">Add category</h2>
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="name" placeholder="Category name" required />
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="folder" placeholder="Asset folder name" />
          <textarea className="min-h-[140px] w-full rounded-3xl border border-slate-200 px-4 py-3" name="description" placeholder="Description" required />
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="bannerImage" placeholder="/assets/catalog/Sofa Sets/Haven.png" />
          <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#2874F0] px-6 text-sm font-semibold text-white" type="submit">
            Save category
          </button>
        </form>

        <div className="surface-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-[#1f2937]">Current categories</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {categories.map((category) => (
              <div className="rounded-[24px] border border-slate-200 p-5" key={category.id}>
                <p className="font-semibold text-[#1f2937]">{category.name}</p>
                <p className="mt-2 text-sm leading-7 text-[#6b7280]">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
