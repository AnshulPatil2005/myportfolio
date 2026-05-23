import Image from "next/legacy/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import type { PostType } from "@/types";
import { BiChevronRight, BiSolidTime } from "react-icons/bi";
import { formatDate } from "../../utils/date";
import SharePost from "../../components/shared/SharePost";
import FeaturedPosts from "../../components/pages/FeaturedPosts";
import { Slide } from "../../animation/Slide";
import Comments from "@/app/components/shared/Comments";
import { HiCalendar, HiChat } from "react-icons/hi";
import PageHeading from "@/app/components/shared/PageHeading";
import { posts } from "@/lib/data";

type Props = {
  params: {
    post: string;
  };
};

const fallbackImage: string =
  "https://res.cloudinary.com/victoreke/image/upload/v1692636087/victoreke/blog.png";

export function generateStaticParams() {
  return posts.map((post) => ({ post: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.post);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    metadataBase: new URL(`https://anshulpatil.dev/blog/${post.slug}`),
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: post.canonicalLink || `https://anshulpatil.dev/blog/${post.slug}`,
    },
    openGraph: {
      images: post.coverImage?.image || fallbackImage,
      url: `https://anshulpatil.dev/blog/${post.slug}`,
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post._createdAt,
      modifiedTime: post._updatedAt || "",
    },
  };
}

export default function Post({ params }: Props) {
  const post = posts.find((p) => p.slug === params.post);
  if (!post) notFound();

  const readTime = `${Math.ceil(post.body.split(" ").length / 200)} min read`;

  return (
    <main className="max-w-7xl mx-auto md:px-16 px-6">
      <header>
        <Slide className="relative flex items-center gap-x-2 border-b dark:border-zinc-800 border-zinc-200 pb-8">
          <Link
            href="/blog"
            className="whitespace-nowrap dark:text-zinc-400 text-zinc-400 hover:dark:text-white hover:text-zinc-700 text-sm border-b dark:border-zinc-700 border-zinc-200"
          >
            cd ..
          </Link>
          <BiChevronRight />
          <p className="text-zinc-400 text-sm truncate">{post.title}</p>
        </Slide>
      </header>

      <article>
        <Slide
          className="grid lg:grid-cols-[75%,25%] grid-cols-1 relative"
          delay={0.1}
        >
          <div className="min-h-full lg:border-r border-r-0 dark:border-zinc-800 border-zinc-200 pt-10 pb-4 lg:pr-6 px-0">
            <div className="flex items-center flex-wrap gap-4 text-md mb-8 dark:text-zinc-400 text-zinc-600">
              <div className="flex items-center gap-x-2">
                <HiCalendar />
                <time dateTime={post.date ? post.date : post._createdAt}>
                  {post.date ? formatDate(post.date) : formatDate(post._createdAt)}
                </time>
              </div>
              <Link
                href="#comments"
                className="flex items-center gap-x-2 dark:text-primary-color text-tertiary-color"
              >
                <HiChat />
                <span>Comments</span>
              </Link>
              <div className="flex items-center gap-x-2">
                <BiSolidTime />
                <span>{readTime}</span>
              </div>
            </div>

            <PageHeading title={post.title} description={post.description} />

            <div className="relative w-full h-40 pt-[52.5%]">
              <Image
                className="rounded-xl border dark:border-zinc-800 border-zinc-100 object-cover"
                layout="fill"
                src={post.coverImage?.image || fallbackImage}
                alt={post.coverImage?.alt || post.title}
                quality={100}
              />
            </div>

            <div className="mt-8 dark:text-zinc-400 text-zinc-600 leading-relaxed tracking-tight text-lg whitespace-pre-wrap">
              {post.body}
            </div>
          </div>

          <aside className="flex flex-col lg:max-h-full h-max gap-y-8 sticky top-2 bottom-auto right-0 py-10 lg:px-6 px-0">
            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
              <p className="dark:text-zinc-400 text-zinc-500 text-sm">Written By</p>
              <address className="flex items-center gap-x-3 mt-4 not-italic">
                <div>
                  <h3 className="font-semibold text-lg tracking-tight">{post.author.name}</h3>
                </div>
              </address>
            </section>

            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
              <h3 className="text-xl font-semibold tracking-tight mb-4">Tags</h3>
              <ul className="flex flex-wrap items-center gap-2 tracking-tight">
                {post.tags.map((tag, id) => (
                  <li
                    key={id}
                    className="dark:bg-primary-bg bg-zinc-100 border dark:border-zinc-800 border-zinc-200 rounded-md px-2 py-1 text-sm"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </section>

            <SharePost
              title={post.title}
              slug={post.slug}
              description={post.description}
            />

            <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
              <h3 className="text-xl font-semibold tracking-tight mb-4">Featured</h3>
              <FeaturedPosts params={params.post} />
            </section>
          </aside>
        </Slide>
      </article>

      <section
        id="comments"
        className="max-w-3xl mt-10 lg:border-t dark:border-zinc-800 border-zinc-200 lg:py-10 pt-0"
      >
        <h3 className="lg:text-4xl text-3xl font-semibold tracking-tight mb-8">Comments</h3>
        <Comments />
      </section>
    </main>
  );
}
