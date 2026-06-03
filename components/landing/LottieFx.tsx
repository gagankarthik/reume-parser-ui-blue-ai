"use client";

// Generic, SSR-safe Lottie renderer. Animation data is passed in (imported in a
// server component and serialized), so this file stays content-agnostic and we
// avoid initialising lottie-web during server render. Respects reduced motion.

import { useEffect, useState } from "react";
import Lottie from "lottie-react";

export function LottieFx({
  data,
  className,
  loop = true,
}: {
  data: object;
  className?: string;
  loop?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    setMounted(true);
    setPlay(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (!mounted) return <div className={className} aria-hidden />;
  return (
    <Lottie
      // lottie-react's typings expect its internal AnimationData shape
      animationData={data as Parameters<typeof Lottie>[0]["animationData"]}
      loop={loop}
      autoplay={play}
      className={className}
      aria-hidden
    />
  );
}
