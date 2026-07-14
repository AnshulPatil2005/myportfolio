"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export default function ScrambleIndex({ target }: { target: string }) {
  const [display, setDisplay] = useState(target);
  const ref = useRef<HTMLSpanElement>(null!);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const digits = "0123456789";
    let frame = 0;
    const totalFrames = 14;
    const id = setInterval(() => {
      setDisplay(
        target
          .split("")
          .map((char, i) =>
            frame / totalFrames > i / target.length
              ? char
              : digits[Math.floor(Math.random() * digits.length)]
          )
          .join("")
      );
      frame++;
      if (frame > totalFrames) {
        setDisplay(target);
        clearInterval(id);
      }
    }, 35);
    return () => clearInterval(id);
  }, [inView, target]);

  return <span ref={ref}>{display}</span>;
}
