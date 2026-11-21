import { HeroeType } from "@/types";
import EasterEgg from "../shared/EasterEgg";
import SectionHead from "../shared/SectionHead";
import RefLink from "../shared/RefLink";
import { heroes } from "@/lib/data";

export default function Heroes() {
  return (
    <section className="mt-20 md:mt-24">
      <SectionHead title="Heroes" />
      <div className="folio">
        <p className="lg:col-start-4 lg:col-span-6 text-lead text-muted">
          Inspired by{" "}
          <RefLink
            href="https://rafa.design"
            className="link"
          >
            Rafael Condo&apos;s
          </RefLink>{" "}
          heroes list, here&apos;s my own curated lineup of code conjurers and
          digital dynamos that I&apos;m absolutely stoked to meet someday.{" "}
          <strong className="font-medium text-fg">
            &quot;In no particular order&quot;
          </strong>
        </p>
      </div>

      {heroes.length > 0 && (
        <ul className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mt-12">
          {heroes.map((heroe) => (
            <li
              key={heroe._id}
              className="flex items-center gap-x-2 border border-line px-2 py-1"
            >
              <EasterEgg isMet={heroe.met} />
              <RefLink
                href={heroe.url}
                className={`tracking-wide hover:underline ${
                  heroe.met && "text-fg"
                }`}
              >
                {heroe.name}
              </RefLink>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
