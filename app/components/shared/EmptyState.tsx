type stateType = {
  value?: string;
  title?: string;
  message?: string;
};

export default function EmptyState({ value, title, message }: stateType) {
  return (
    <div className="w-full flex flex-col items-center text-center border border-dashed dark:border-zinc-700 border-zinc-300 px-6 py-10">
      <span className="mb-5 w-2.5 h-2.5 dark:bg-zinc-600 bg-zinc-400 shrink-0" aria-hidden="true" />
      <h3 className="font-incognito font-bold tracking-tight text-xl mb-3">
        {title ?? `No ${value} Found`}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
        {message ??
          `There are no ${
            value && value.toLowerCase()
          } available at this time. Check back again.`}
      </p>
    </div>
  );
}
