import { createBlogPostAction } from "@/app/(admin)/admin/actions";
import { getAllBlogPosts } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default async function AdminBlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="space-y-6">
      <div className="rounded-[34px] bg-white p-8 shadow-card">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Blog Manager</p>
        <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937]">
          Publish SEO articles that support category and product pages
        </h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <form action={createBlogPostAction} className="surface-card space-y-4 p-6">
          <h2 className="text-2xl font-semibold text-[#1f2937]">Add blog post</h2>
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="title" placeholder="Blog title" required />
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="excerpt" placeholder="Short excerpt" required />
          <textarea className="min-h-[200px] w-full rounded-3xl border border-slate-200 px-4 py-3" name="body" placeholder="Full blog content" required />
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="featuredImage" placeholder="/assets/catalog/Sofa Sets/Haven.png" />
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="tags" placeholder="tag1, tag2, tag3" />
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="seoTitle" placeholder="SEO title" />
          <input className="h-12 w-full rounded-2xl border border-slate-200 px-4" name="seoDescription" placeholder="SEO description" />
          <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#2874F0] px-6 text-sm font-semibold text-white" type="submit">
            Publish post
          </button>
        </form>

        <div className="surface-card p-6">
          <h2 className="mb-4 text-2xl font-semibold text-[#1f2937]">Published posts</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div className="rounded-[24px] border border-slate-200 p-5" key={post.id}>
                <p className="font-semibold text-[#1f2937]">{post.title}</p>
                <p className="mt-2 text-sm leading-7 text-[#6b7280]">{post.excerpt}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-[#2874F0]">
                  {formatDate(post.publishedAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
