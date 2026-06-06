export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto lg:px-0 px-8">
      <div className="w-20 h-5 dark:bg-primary-bg bg-zinc-200 rounded animate-pulse mb-8" />
      <div className="w-3/4 h-10 dark:bg-primary-bg bg-zinc-200 rounded animate-pulse mb-4" />
      <div className="w-full h-5 dark:bg-primary-bg bg-zinc-200 rounded animate-pulse mb-2" />
      <div className="w-2/3 h-5 dark:bg-primary-bg bg-zinc-200 rounded animate-pulse mb-6" />
      <div className="flex gap-2 mb-10">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-16 h-7 dark:bg-primary-bg bg-zinc-200 rounded animate-pulse" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="w-full h-5 dark:bg-primary-bg bg-zinc-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
