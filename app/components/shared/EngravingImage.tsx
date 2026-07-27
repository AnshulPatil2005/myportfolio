import Image from "next/image";

interface Props {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function EngravingImage({ src, alt, className = "", priority }: Props) {
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
        className="object-cover object-center"
        style={{ filter: "url(#amber-duotone)" }}
      />
    </div>
  );
}
