"use client";

import { useEffect, useRef, useState } from "react";

interface ScaledIframeProps {
  src: string;
  title: string;
  width: number;
  height: number;
  className?: string;
}

export function ScaledIframe({ src, title, width, height, className }: ScaledIframeProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;
      const containerW = wrapperRef.current.clientWidth;
      setScale(Math.min(1, containerW / width));
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [width]);

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ height: height * scale, overflow: "hidden", display: "flex", justifyContent: "center" }}
    >
      <iframe
        src={src}
        title={title}
        scrolling="no"
        style={{
          width,
          height,
          border: "none",
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      />
    </div>
  );
}
