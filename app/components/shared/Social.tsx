import { socialLinks } from "../../data/social";
import RefLink from "./RefLink";

export default function Social({ type }: { type: "social" | "publication" }) {
  return (
    <ul className="flex items-center flex-wrap gap-x-6 gap-y-3 my-10 font-mono text-sm">
      {socialLinks
        .filter((item) => item.status === type)
        .map((value) => (
          <li key={value.id}>
            <RefLink
              href={value.url}
              className="border-b dark:border-zinc-700 border-zinc-300 pb-0.5 dark:text-zinc-400 text-zinc-500 dark:hover:text-zinc-100 hover:text-zinc-900 dark:hover:border-zinc-500 hover:border-zinc-500 transition-colors duration-150"
            >
              {value.name}
            </RefLink>
          </li>
        ))}
    </ul>
  );
}
