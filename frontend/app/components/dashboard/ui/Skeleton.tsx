/** Grey placeholder blocks shown while data loads (keeps the layout from jumping). */
export function Skeleton({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`block animate-pulse rounded-lg bg-gray-100 ${className}`} />;
}

export function SkeletonRows({ rows = 3, className = "h-20" }: { rows?: number; className?: string }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, index) => <Skeleton key={index} className={`w-full rounded-2xl ${className}`} />)}
    </div>
  );
}
