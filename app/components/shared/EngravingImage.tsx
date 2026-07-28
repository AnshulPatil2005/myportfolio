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
      {/* Corner bracket decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-3 left-3 w-5 h-5 border-t border-l dark:border-accent/35 border-amber-500/35" />
        <div className="absolute top-3 right-3 w-5 h-5 border-t border-r dark:border-accent/35 border-amber-500/35" />
        <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l dark:border-accent/35 border-amber-500/35" />
        <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r dark:border-accent/35 border-amber-500/35" />
      </div>
    </div>
  );
}
