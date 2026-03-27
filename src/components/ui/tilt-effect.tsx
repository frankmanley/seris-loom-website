"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

export type TiltEffectProps = {
  children: React.ReactNode;
  tiltFactor?: number;
  perspective?: number;
  className?: string;
};

export const TiltEffect: React.FC<TiltEffectProps> = ({
  children,
  tiltFactor = 10,
  perspective = 1000,
  className,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [elementSize, setElementSize] = useState({ width: 0, height: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 400, mass: 0.5 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rotateX = useTransform(
    ySpring,
    [-elementSize.height / 2, elementSize.height / 2],
    [tiltFactor, -tiltFactor]
  );
  const rotateY = useTransform(
    xSpring,
    [-elementSize.width / 2, elementSize.width / 2],
    [-tiltFactor, tiltFactor]
  );

  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        setElementSize({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    x.set(mouseX - elementSize.width / 2);
    y.set(mouseY - elementSize.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        perspective,
        transformStyle: "preserve-3d",
      }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};
