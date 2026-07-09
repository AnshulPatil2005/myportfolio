import { HeroeType } from "@/types";
import EasterEgg from "../shared/EasterEgg";
import { Slide } from "../../animation/Slide";
import RefLink from "../shared/RefLink";
import { heroes } from "@/lib/data";

export default function Heroes() {
  return (
    <section className="mt-32 max-w-5xl">
      <Slide delay={0.17}>
        <h2 className="text-4xl mb-4 font-bold tracking-tight">Heroes</h2>
        <p className="dark:text-zinc-400 text-zinc-600 max-w-2xl">
          Inspired by{" "}
          <RefLink
            href="https://rafa.design"
            className="dark:text-blue-400 text-blue-500 underline"
          >
            Rafael Condo&apos;s
          </RefLink>{" "}
          heroes list, here&apos;s my own curated lineup of code conjurers and
          digital dynamos that I&apos;m absolutely stoked to meet someday.{" "}
          <strong className="font-semibold">
            &quot;In no particular order&quot;
          </strong>
        </p>
      </Slide>

      {heroes.length > 0 && (
        <ul className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 mt-12 tracking-tight">
          {heroes.map((heroe) => (
            <li
              key={heroe._id}
              className="flex items-center gap-x-2 border dark:border-zinc-800 border-zinc-300 px-2 py-1"
            >
              <EasterEgg isMet={heroe.met} />
              <RefLink
                href={heroe.url}
                className={`font-incognito tracking-wide hover:underline ${
                  heroe.met && "dark:text-green-300 text-green-800"
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
