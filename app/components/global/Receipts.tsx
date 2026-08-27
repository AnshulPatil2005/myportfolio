import { RECEIPTS } from "@/lib/receipts";

// Numbers on a CV are assertions until someone can check them. These render a
// short row of verifiable links beside a role or product.
export default function Receipts({ id }: { id: string }) {
  const items = RECEIPTS[id];
  if (!items?.length) return null;
  return (
    <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5">
      <li className="font-mono text-[9px] uppercase tracking-[0.2em] dark:text-zinc-600 text-zinc-400">
        evidence
      </li>
      {items.map(r => (
        <li key={r.url}>
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[10px] dark:text-zinc-400 text-zinc-500 border-b dark:border-zinc-700 border-zinc-300 hover:dark:text-zinc-100 hover:text-zinc-900 hover:dark:border-zinc-400 hover:border-zinc-500 transition-colors"
          >
            {r.label} ↗
          </a>
        </li>
      ))}
    </ul>
  );
}
