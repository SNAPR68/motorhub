"use client";

export default function ShowroomLoading() {
  return (
    <div
      className="min-h-dvh flex items-center justify-center"
      style={{ background: "#111621" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-[#195de6]" />
        <p className="text-sm text-slate-500">Loading showroom...</p>
      </div>
    </div>
  );
}
