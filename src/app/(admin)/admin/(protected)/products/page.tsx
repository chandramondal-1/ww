import { createProductAction } from "@/app/(admin)/admin/actions";
import { getAllCategories, getAllProducts } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getAllProducts(), getAllCategories()]);

  return (
    <div className="space-y-6">
      <div className="rounded-[34px] bg-white p-8 shadow-card">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Product Manager</p>
        <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937]">
          Add products and manage catalogue visibility
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <form action={createProductAction} className="surface-card space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-[#1f2937]">Add product</h2>
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="name" placeholder="Product name" required />
          <select className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="categorySlug" required>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="tagline" placeholder="Short tagline" required />
          <textarea className="min-h-[120px] w-full rounded-3xl border border-slate-200 px-4 py-3" name="description" placeholder="Description" required />
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="price" placeholder="Price" required type="number" />
            <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="originalPrice" placeholder="Original price" type="number" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="material" placeholder="Material" required />
            <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="seatingCapacity" placeholder="Seating capacity" required />
          </div>
          <select className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="availability">
            <option>In Stock</option>
            <option>Preorder</option>
            <option>Limited Stock</option>
          </select>
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="image" placeholder="/assets/catalog/Sofa Sets/Haven.png" />
          <label className="flex items-center gap-3 text-sm font-semibold text-[#1f2937]">
            <input name="featured" type="checkbox" />
            Mark as featured product
          </label>
          <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#2874F0] px-6 text-sm font-semibold text-white" type="submit">
            Save product
          </button>
        </form>

        <div className="surface-card overflow-hidden p-6">
          <h2 className="mb-4 text-2xl font-semibold text-[#1f2937]">Catalogue items</h2>
          <div className="thin-scrollbar max-h-[760px] overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-slate-200 text-[#6b7280]">
                  <th className="px-2 py-3">Name</th>
                  <th className="px-2 py-3">Category</th>
                  <th className="px-2 py-3">Price</th>
                  <th className="px-2 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr className="border-b border-slate-100" key={product.id}>
                    <td className="px-2 py-3 font-semibold text-[#1f2937]">{product.name}</td>
                    <td className="px-2 py-3 text-[#6b7280]">{product.categoryName}</td>
                    <td className="px-2 py-3 text-[#1f2937]">{formatCurrency(product.price)}</td>
                    <td className="px-2 py-3 text-[#6b7280]">{product.availability}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
