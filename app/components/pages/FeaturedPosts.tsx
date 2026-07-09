import Link from "next/link";
import Image from "next/legacy/image";
import type { PostType } from "@/types";
import { posts } from "@/lib/data";

export default function FeaturedPosts({ params }: { params?: string }) {
  const featuredPosts = posts.filter(
    (post) => post.featured === true && post.isPublished === true
  );

  return (
    <>
      {featuredPosts.map((post) => (
        <article
          key={post._id}
          className={`mb-4 ${
            post.slug === params ? "hidden" : "flex lg:flex-row flex-col"
          }`}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="flex flex-col gap-4 p-5 border dark:border-zinc-800 border-zinc-300"
          >
            {post.coverImage?.image && (
              <Image
                src={post.coverImage.image}
                className="dark:bg-zinc-800 bg-zinc-100 rounded-md object-cover"
                alt={post.coverImage?.alt || post.title}
                width={400}
                height={230}
                quality={100}
                loading="lazy"
              />
            )}
            <div className="max-w-lg">
              <h2 className="max-w-sm text-lg tracking-tight mb-4">
                {post.title}
              </h2>
              <p className="dark:text-zinc-400 text-zinc-600 text-sm">
                {post.description.slice(0, 80).padEnd(83, "...")}
              </p>
            </div>
          </Link>
        </article>
      ))}
    </>
  );
}
