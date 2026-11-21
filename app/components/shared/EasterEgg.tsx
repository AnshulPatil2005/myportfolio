"use client";

import Image from "next/image";
import { useState } from "react";
import funImage from "@/public/yeah-right.png";

export default function EasterEgg({ isMet }: { isMet: boolean }) {
  const [image, setImage] = useState(false);

  const toggleImage = () => {
    const interval = setInterval(() => {
      setImage(true);
    });

    setTimeout(() => {
      setImage(false);
      clearInterval(interval);
    }, 3000);
  };

  return (
    <>
      <button onClick={toggleImage} aria-hidden="true">
        <span
          className={`inline-block w-5 h-5 border border-muted ${
            isMet === true ? "bg-fg" : ""
          }`}
        />
      </button>

      <Image
        className={`fixed z-30 bottom-1/2 duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] ${
          image ? "left-0" : "-left-80"
        }`}
        src={funImage}
        width={250}
        height={250}
        quality={100}
        alt="yeah right"
      />
    </>
  );
}
