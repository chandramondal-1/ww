import { updateEnquiryStatusAction } from "@/app/(admin)/admin/actions";
import { getStoredEnquiries } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default async function AdminEnquiriesPage() {
  const enquiries = await getStoredEnquiries();

  return (
    <div className="space-y-6">
      <div className="rounded-[34px] bg-white p-8 shadow-card">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#2874F0]">Enquiry Manager</p>
        <h1 className="mt-3 font-[var(--font-heading)] text-5xl font-semibold text-[#1f2937]">
          View, triage and close customer enquiries
        </h1>
      </div>

      <div className="surface-card p-6">
        <div className="space-y-4">
          {enquiries.map((enquiry) => (
            <div className="rounded-[24px] border border-slate-200 p-5" key={enquiry.id}>
              <div className="grid gap-4 lg:grid-cols-[1fr,auto]">
                <div>
                  <p className="text-lg font-semibold text-[#1f2937]">{enquiry.name}</p>
                  <p className="mt-1 text-sm text-[#6b7280]">
                    {enquiry.phone} • {enquiry.email || "No email"} • {enquiry.city || "City not provided"}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[#374151]">{enquiry.message}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.25em] text-[#6b7280]">
                    {enquiry.productName || "General enquiry"} • {formatDate(enquiry.createdAt)}
                  </p>
                </div>

                <form action={updateEnquiryStatusAction} className="flex items-center gap-3">
                  <input name="id" type="hidden" value={enquiry.id} />
                  <select className="h-11 rounded-full border border-slate-200 px-4 text-sm font-semibold" defaultValue={enquiry.status} name="status">
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Closed</option>
                  </select>
                  <button className="inline-flex h-11 items-center justify-center rounded-full bg-[#2874F0] px-5 text-sm font-semibold text-white" type="submit">
                    Update
                  </button>
                </form>
              </div>
            </div>
          ))}

          {enquiries.length === 0 ? (
            <p className="text-sm text-[#6b7280]">No enquiries yet. Submit the public form to test the workflow.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
