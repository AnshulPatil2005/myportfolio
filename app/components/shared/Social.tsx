import { socialLinks } from "../../data/social";
import RefLink from "./RefLink";

export default function Social({ type }: { type: "social" | "publication" }) {
  return (
    <ul className="flex items-baseline flex-wrap gap-x-6 gap-y-2 font-mono text-meta">
      {socialLinks
        .filter((item) => item.status === type)
        .map((value) => (
          <li key={value.id}>
            <RefLink href={value.url} className="link-muted">
              {value.name}
            </RefLink>
          </li>
        ))}
    </ul>
  );
}
