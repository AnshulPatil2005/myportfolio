import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  animate?: boolean;
}

export default function EngravingImage({
  src,
  alt,
  className = "",
  priority,
}: Props) {
  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      aria-hidden="true"
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 1024px) 100vw, 520px"
        className="object-cover object-center"
        style={{ filter: "url(#amber-duotone)" }}
      />
    </div>
  );
}
