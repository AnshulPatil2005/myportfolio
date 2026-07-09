"use client";

type props = {
  title: string;
  slug: string;
  description: string;
};

export default function SharePost({ title, slug, description }: props) {
  const blog = encodeURIComponent("https://anshulpatil.dev/blog/");
  const options = [
    {
      name: "Twitter",
      shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        "Thank you for writing this post."
      )}.%0A%0A${title}%0A%0A${blog}${slug}`,
    },
    {
      name: "LinkedIn",
      shareUrl: `https://linkedin.com/sharing/share-offsite/?url=${blog}${slug}&title=${title}&summary=${description}`,
    },
    {
      name: "Facebook",
      shareUrl: `https://www.facebook.com/sharer/sharer.php?u=${blog}${slug}`,
    },
    {
      name: "WhatsApp",
      shareUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(
        "Read this amazing article."
      )}.%0A%0A${title}%0A%0A${blog}${slug}`,
    },
  ];

  const openPopup = (url: string) => {
    window.open(
      url,
      "Social Share",
      "width=600,height=600,resizable=yes,scrollbars=yes,status=yes"
    );
  };

  return (
    <section className="border-b dark:border-zinc-800 border-zinc-200 pb-10">
      <h3 className="text-xl font-semibold tracking-tight mb-4">Share Post</h3>

      <div className="flex flex-wrap items-center gap-2 tracking-tight font-mono text-xs">
        {options.map((data, id) => (
          <button
            key={id}
            onClick={() => openPopup(data.shareUrl)}
            title={`Share to ${data.name}`}
            aria-label={`Share to ${data.name}`}
            className="px-3 py-2 border dark:border-zinc-800 border-zinc-300 dark:hover:border-zinc-600 hover:border-zinc-400"
          >
            {data.name}
          </button>
        ))}
      </div>
    </section>
  );
}
