
export default function Loading() {
  return (
    <main className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#FAF7F2]">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium tracking-[0.3em] text-[#29231F]">
          LOADING
        </span>

        <span className="h-2 w-2 animate-pulse rounded-full bg-[#A56A43]" />
      </div>
    </main>
  );
}
