export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto lg:px-0 px-8">
      <div className="flex items-center justify-between mb-6">
        <span className="w-52 h-11 dark:bg-zinc-800 bg-zinc-200 animate-pulse"></span>
        <div className="flex items-center gap-x-2">
          <span className="w-28 h-11 dark:bg-zinc-800 bg-zinc-200 animate-pulse"></span>
          <span className="w-28 h-11 dark:bg-zinc-800 bg-zinc-200 animate-pulse"></span>
        </div>
      </div>
      <div className="w-full h-96 mb-8 dark:bg-zinc-800 bg-zinc-200 animate-pulse"></div>
      <div className="flex flex-col gap-y-2">
        <span className="w-full h-5 dark:bg-zinc-800 bg-zinc-200 animate-pulse"></span>
        <span className="w-full h-5 dark:bg-zinc-800 bg-zinc-200 animate-pulse"></span>
      </div>
    </div>
  );
}
