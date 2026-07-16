"use client";

// A single word in a headline that cycles through a set on a timer, each new
// word rising into place. The box reserves the width of the longest word so the
// surrounding line never reflows or jitters — important on mobile, where a
// recentring headline reads as a bug. Screen readers get the full list once.

import { useEffect, useState } from "react";

export function RotatingWord({
  words,
  interval = 2200,
  className = "",
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");

  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className="relative inline-block overflow-hidden align-baseline">
      {/* reserves width + height; invisible */}
      <span aria-hidden className="invisible">
        {longest}
      </span>
      {/* the animated word, overlaid and re-mounted on each change */}
      <span key={i} aria-hidden className={"animate-word absolute inset-0 " + className}>
        {words[i]}
      </span>
      <span className="sr-only">{words.join(", ")}</span>
    </span>
  );
}
