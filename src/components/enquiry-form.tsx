"use client";

import { useState } from "react";

type EnquiryFormProps = {
  type: "product" | "general" | "catalog";
  title?: string;
  productId?: string;
  productName?: string;
  compact?: boolean;
};

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  message: string;
  website: string;
};

const emptyState: FormState = {
  name: "",
  phone: "",
  email: "",
  city: "",
  message: "",
  website: ""
};

export function EnquiryForm({
  type,
  title = "Request a quotation",
  productId,
  productName,
  compact = false
}: EnquiryFormProps) {
  const [state, setState] = useState<FormState>({
    ...emptyState,
    message: productName ? `I would like pricing and delivery details for ${productName}.` : ""
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...state,
          type,
          productId,
          productName,
          source: productName ? "Product Page" : "Website"
        })
      });

      if (!response.ok) {
        throw new Error("Unable to submit enquiry");
      }

      setStatus("success");
      setState(emptyState);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className={`surface-card ${compact ? "p-5" : "p-6 sm:p-8"}`}>
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">
          Enquiry System
        </p>
        <h3 className="mt-3 font-[var(--font-heading)] text-3xl font-semibold text-[#1f2937]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-7 text-[#6b7280]">
          Fill the form and the Wicker & Weave team can call, WhatsApp or email you with pricing,
          delivery timeline and catalog assistance.
        </p>
      </div>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-[#1f2937]">Name</span>
          <input
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-[#2874F0]"
            onChange={(event) => setState((current) => ({ ...current, name: event.target.value }))}
            required
            value={state.name}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-[#1f2937]">Phone</span>
          <input
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-[#2874F0]"
            onChange={(event) => setState((current) => ({ ...current, phone: event.target.value }))}
            required
            value={state.phone}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-[#1f2937]">Email</span>
          <input
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-[#2874F0]"
            onChange={(event) => setState((current) => ({ ...current, email: event.target.value }))}
            type="email"
            value={state.email}
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-semibold text-[#1f2937]">City</span>
          <input
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 outline-none transition focus:border-[#2874F0]"
            onChange={(event) => setState((current) => ({ ...current, city: event.target.value }))}
            value={state.city}
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-semibold text-[#1f2937]">Message</span>
          <textarea
            className="min-h-[140px] w-full rounded-3xl border border-slate-200 px-4 py-3 outline-none transition focus:border-[#2874F0]"
            onChange={(event) => setState((current) => ({ ...current, message: event.target.value }))}
            value={state.message}
          />
        </label>

        <input
          autoComplete="off"
          className="hidden"
          name="website"
          onChange={(event) => setState((current) => ({ ...current, website: event.target.value }))}
          tabIndex={-1}
          value={state.website}
        />

        {productName ? (
          <div className="md:col-span-2">
            <div className="rounded-2xl bg-[#f8fbff] px-4 py-3 text-sm text-[#1f2937]">
              Product auto-filled: <span className="font-semibold">{productName}</span>
            </div>
          </div>
        ) : null}

        <div className="md:col-span-2 flex flex-wrap items-center gap-4">
          <button
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#FF6A00] px-6 text-sm font-semibold text-white transition hover:bg-[#e85d00] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={status === "loading"}
            type="submit"
          >
            {status === "loading" ? "Submitting..." : "Request Quote"}
          </button>

          {status === "success" ? (
            <p className="text-sm font-semibold text-[#10B981]">
              Enquiry submitted successfully. The admin team can now manage it from the dashboard.
            </p>
          ) : null}

          {status === "error" ? (
            <p className="text-sm font-semibold text-[#EF4444]">
              Something went wrong. Please try again or use WhatsApp.
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
