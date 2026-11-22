type stateType = {
  value?: string;
  title?: string;
  message?: string;
};

export default function EmptyState({ value, title, message }: stateType) {
  return (
    <div className="w-full border-y border-line py-10">
      <span className="block mb-5 w-2 h-2 bg-muted" aria-hidden="true" />
      <h3 className="text-h3 mb-2">
        {title ?? `No ${value} Found`}
      </h3>
      <p className="text-body text-muted max-w-measure">
        {message ??
          `There are no ${
            value && value.toLowerCase()
          } available at this time. Check back soon.`}
      </p>
    </div>
  );
}
