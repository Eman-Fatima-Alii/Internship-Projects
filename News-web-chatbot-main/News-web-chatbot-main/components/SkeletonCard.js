export default function SkeletonCard({ featured = false }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden glass-card shadow-sm ${
        featured ? "md:col-span-2 md:row-span-2" : ""
      }`}
    >
      <div className={`shimmer animate-shimmer ${featured ? "h-64 sm:h-80 md:h-96" : "h-48"}`} />
      <div className="p-4 sm:p-5 space-y-3.5">
        <div className="shimmer animate-shimmer h-3.5 w-24 rounded-full" />
        <div className="shimmer animate-shimmer h-5 w-full rounded-md" />
        <div className="shimmer animate-shimmer h-4 w-4/5 rounded-md" />
        {featured && <div className="shimmer animate-shimmer h-3.5 w-3/5 rounded-md mt-2" />}
      </div>
    </div>
  );
}


