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
          // lazy even for the frontispiece: on a phone it sits below the fold
          // and must not compete with the text; on a desktop it is on screen
          // and the browser fetches it as soon as layout says so
          loading="lazy"
          // engraved line work survives heavier compression than photographs
          quality={60}
          sizes={sizes}
          className="object-cover plate-img"
          style={{ objectPosition: position }}
        />
      </div>
    </div>
  );
}
