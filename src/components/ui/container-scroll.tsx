"use client";

import React, { useRef, useEffect, useState } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";

interface ContainerScrollProps {
  titleComponent: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContainerScroll({
  titleComponent,
  children,
  className,
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [0.7, 0.9] : [1.05, 1]
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, -140]);

  return (
    <div
      className={`h-[60rem] md:h-[80rem] flex items-start justify-center relative p-2 md:p-20 pt-24 md:pt-32 ${className ?? ""}`}
      ref={containerRef}
    >
      <div
        className="w-full relative"
        style={{ perspective: "1000px" }}
      >
        <ScrollHeader translate={translate} titleComponent={titleComponent} />
        <ScrollCard rotate={rotate} scale={scale}>
          {children}
        </ScrollCard>
      </div>
    </div>
  );
}

function ScrollHeader({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: React.ReactNode;
}) {
  return (
    <motion.div
      style={{ translateY: translate }}
      className="max-w-5xl mx-auto text-center"
    >
      {titleComponent}
    </motion.div>
  );
}

function ScrollCard({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        boxShadow:
          "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
      }}
      className="max-w-5xl mt-8 mx-auto h-[30rem] md:h-[40rem] w-full border border-dark-border p-2 md:p-4 bg-screen-black rounded-[--radius-card] shadow-2xl"
    >
      <div className="h-full w-full overflow-hidden rounded-[--radius-card]">
        {children}
      </div>
    </motion.div>
  );
}
