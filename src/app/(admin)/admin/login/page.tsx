import Link from "next/link";
import { redirect } from "next/navigation";

import { loginAction } from "@/app/(admin)/admin/actions";
import { isAdminAuthenticated } from "@/lib/auth";

type AdminLoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const authenticated = await isAdminAuthenticated();

  if (authenticated) {
    redirect("/admin");
  }

  const params = await searchParams;
  const showError = params?.error === "1";

  return (
    <section className="section-space">
      <div className="container-shell">
        <div className="mx-auto max-w-xl rounded-[38px] bg-white p-8 shadow-card sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Admin Login</p>
          <h1 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937]">
            CMS dashboard access
          </h1>
          <p className="mt-4 text-sm leading-8 text-[#6b7280]">
            Use the demo admin credentials below, or replace them later with environment variables.
          </p>

          <div className="mt-6 rounded-[28px] bg-[#f8fbff] p-5 text-sm text-[#1f2937]">
            <p>
              Username: <span className="font-semibold">agaunny2000@gmail.com</span>
            </p>
            <p className="mt-2">
              Password: <span className="font-semibold">wicker123</span>
            </p>
          </div>

          {showError ? (
            <p className="mt-4 text-sm font-semibold text-[#EF4444]">Invalid login details.</p>
          ) : null}

          <form action={loginAction} className="mt-8 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#1f2937]">Email</span>
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2874F0]"
                defaultValue="agaunny2000@gmail.com"
                name="username"
                required
                type="email"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold text-[#1f2937]">Password</span>
              <input
                className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none focus:border-[#2874F0]"
                defaultValue="wicker123"
                name="password"
                required
                type="password"
              />
            </label>

            <button className="inline-flex h-12 items-center justify-center rounded-full bg-[#2874F0] px-6 text-sm font-semibold text-white" type="submit">
              Login to dashboard
            </button>
          </form>

          <Link className="mt-6 inline-block text-sm font-semibold text-[#2874F0]" href="/">
            Back to storefront
          </Link>
        </div>
      </div>
    </section>
  );
}
