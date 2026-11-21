import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  animate?: boolean;
  /** CSS object-position for the crop */
  position?: string;
  sizes?: string;
}

// An engraving printed as a plate: the image in the page's ink, inset inside
// a hairline plate mark on a slightly darker paper.
export default function EngravingImage({
  src,
  alt,
  className = "",
  priority,
  position = "center",
  sizes = "(max-width: 1024px) 100vw, 460px",
}: Props) {
  return (
    <div
      className={`select-none border border-line bg-wash p-2 sm:p-3 ${className}`}
      aria-hidden="true"
    >
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover plate-img"
          style={{ objectPosition: position }}
        />
      </div>
    </div>
  );
}
