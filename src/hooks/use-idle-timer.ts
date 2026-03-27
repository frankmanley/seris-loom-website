"use client";

import { useEffect, useRef, useState } from "react";

export function useIdleTimer(idleThreshold: number = 5000): boolean {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const resetTimer = () => {
      setIsIdle(false);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsIdle(true), idleThreshold);
    };

    resetTimer();

    window.addEventListener("mousemove", resetTimer, { passive: true });
    window.addEventListener("touchmove", resetTimer, { passive: true });

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("touchmove", resetTimer);
    };
  }, [idleThreshold]);

  return isIdle;
}
