import { RECEIPTS } from "@/lib/receipts";

// Numbers on a CV are assertions until someone can check them. These render a
// short row of verifiable links beside a role or product.
export default function Receipts({ id }: { id: string }) {
  const items = RECEIPTS[id];
  if (!items?.length) return null;
  return (
    <ul className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mt-4 font-mono text-meta">
      <li className="text-muted">evidence</li>
      {items.map(r => (
        <li key={r.url}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            {r.label} ↗
          </a>
        </li>
      ))}
    </ul>
  );
}
