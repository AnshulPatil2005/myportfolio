"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Mounts its children only once the reader scrolls near them. Used for the
// widgets that fetch third-party data, so they cost nothing on first load.
// The reserved height keeps the page from jumping when they arrive.
export default function WhenVisible({
  children,
  minHeight,
  rootMargin = "800px 0px",
}: {
  children: ReactNode;
  minHeight: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={show ? undefined : { minHeight }}>
      {show ? children : null}
    </div>
  );
}
