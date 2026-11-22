import { Metadata } from "next";
import Posts from "../components/pages/Posts";
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
    <main id="main" className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
      <PageHeading
        title="Blog"
        description="Notes on what I'm learning and the things I'm building."
      />

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
