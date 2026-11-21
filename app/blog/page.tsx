import { Metadata } from "next";
import Posts from "../components/pages/Posts";
import Social from "../components/shared/Social";
import { Slide } from "../animation/Slide";
import PageHeading from "@/app/components/shared/PageHeading";

export const metadata: Metadata = {
  title: "Blog | Anshul Patil",
  metadataBase: new URL("https://anshulpatil.dev/blog"),
  description: "Read stories and articles from Anshul Patil's Blog",
  openGraph: {
    title: "Blog | Anshul Patil",
    url: "https://anshulpatil.dev/blog",
    description: "Read stories and articles from Anshul Patil's Blog",
  },
};

export default async function Blog() {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
      <PageHeading
        title="Blog"
        description="Welcome to my blog domain where I share personal stories about things I've learned, projects I'm hacking on and just general findings. I also write for other publications."
      >
        <Social type="publication" />
      </PageHeading>

      <Slide className="folio">
        <div className="lg:col-span-3 mb-6">
          <h2 className="font-mono text-meta text-muted">Explore All</h2>
        </div>
        <div className="lg:col-start-4 lg:col-span-9">
        <Posts />
        </div>
      </Slide>
    </main>
  );
}
