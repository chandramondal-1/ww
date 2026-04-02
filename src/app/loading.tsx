export default function Loading() {
  return (
    <div className="section-space">
      <div className="container-shell">
        <div className="animate-pulse space-y-6">
          <div className="h-12 w-48 rounded-full bg-slate-200" />
          <div className="h-[420px] rounded-[38px] bg-slate-200" />
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="h-72 rounded-[30px] bg-slate-200" key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
