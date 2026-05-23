"use client";

import React, { useState, useRef } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "motion/react";

type TooltipSize = "sm" | "md" | "lg";

const sizeConfig: Record<TooltipSize, { avatar: string; image: string; overlap: string; top: string; fontSize: string }> = {
  sm: {
    avatar: "h-5 w-5",
    image: "h-5 w-5",
    overlap: "-mr-1.5",
    top: "-top-10",
    fontSize: "text-[10px]",
  },
  md: {
    avatar: "h-8 w-8",
    image: "h-8 w-8",
    overlap: "-mr-2.5",
    top: "-top-14",
    fontSize: "text-xs",
  },
  lg: {
    avatar: "h-14 w-14",
    image: "h-14 w-14",
    overlap: "-mr-4",
    top: "-top-16",
    fontSize: "text-base",
  },
};

export const AnimatedTooltip = ({
  items,
  size = "lg",
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
  }[];
  size?: TooltipSize;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const springConfig = { stiffness: 100, damping: 15 };
  const x = useMotionValue(0);
  const animationFrameRef = useRef<number | null>(null);

  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );

  const handleMouseMove = (event: React.MouseEvent<HTMLImageElement>) => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const target = event.currentTarget;
    const offsetX = event.nativeEvent.offsetX;

    animationFrameRef.current = requestAnimationFrame(() => {
      const halfWidth = target.offsetWidth / 2;
      x.set(offsetX - halfWidth);
    });
  };

  const cfg = sizeConfig[size];

  return (
    <>
      {items.map((item) => (
        <div
          className={`group relative ${cfg.overlap}`}
          key={item.id}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === item.id && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.6 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 10,
                  },
                }}
                exit={{ opacity: 0, y: 20, scale: 0.6 }}
                style={{
                  translateX: translateX,
                  rotate: rotate,
                  whiteSpace: "nowrap",
                }}
                className={`absolute ${cfg.top} left-1/2 z-50 flex -translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-3 py-1.5 ${cfg.fontSize} shadow-xl`}
              >
                <div className="relative z-30 font-bold text-white">
                  {item.name}
                </div>
                <div className="text-white/70">{item.designation}</div>
              </motion.div>
            )}
          </AnimatePresence>
          <img
            onMouseMove={handleMouseMove}
            height={100}
            width={100}
            src={item.image}
            alt={item.name}
            className={`relative !m-0 ${cfg.image} rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105`}
          />
        </div>
      ))}
    </>
  );
};
