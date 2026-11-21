import { Slide } from "../animation/Slide";
import Image from "next/image";
import { Metadata } from "next";
import PageHeading from "@/app/components/shared/PageHeading";

const images = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1585618256754-241cfe4e8113?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=100",
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1585619203238-70e7631cc672?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwcm9maWxlLXBhZ2V8OXx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "3",
    src: "https://images.unsplash.com/photo-1585619443911-c2bb23fb2a49?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
  },
];

export const metadata: Metadata = {
  title: "Photos | Anshul Patil",
  metadataBase: new URL("https://anshulpatil.dev/photos"),
  description: "Explore photos from Anshul Patil",
  openGraph: {
    title: "Photos | Anshul Patil",
    url: "https://anshulpatil.dev/photos",
    description: "Explore photos from Anshul Patil",
  },
};

export default function Photos() {
  return (
    <main className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
      <PageHeading
        title="Photos"
        description="This page is still under construction..."
      />
      <figure className="folio">
        <Slide className="lg:col-start-4 lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {images.map((image, i) => (
            <Image
              key={image.id}
              src={image.src}
              alt="playing guitar"
              width={350}
              height={800}
              priority={i === 0}
              sizes="(max-width: 640px) 92vw, 300px"
              className="w-full h-auto aspect-[3/4] object-cover bg-wash border border-line p-2"
            />
          ))}
        </Slide>
      </figure>
    </main>
  );
}
