"use client";
import { forwardRef } from "react";
import { cn } from "../../../../lib/utils";
import { motion } from "motion/react";

export const BentoGrid = ({ children, className = "", ...props }) => {
  return (
    <div
      className={cn(
        "grid w-full auto-rows-[22rem] grid-cols-3 gap-4",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const BentoCard = forwardRef(
  (
    {
      name = "",
      className = "",
      background,
      Icon,
      description = "",
      href = "#",
      cta = "",
      initial,
      animate,
      transition,
      direction,
      ...props
    },
    ref
  ) => {
    // Set animation based on direction
    const getInitial = () => {
      if (direction === "fromLeft") return { x: -100, opacity: 0 };
      if (direction === "fromRight") return { x: 100, opacity: 0 };
      if (direction === "fromBottom") return { y: 100, opacity: 0 };
      return initial || { opacity: 0 };
    };

    const getAnimate = () => {
      return animate || { x: 0, y: 0, opacity: 1 };
    };

    return (
      <motion.div
        initial={initial || getInitial()}
        whileInView={animate || getAnimate()}
        transition={transition || { duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
        ref={ref}
        className={cn(
          "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
          // light styles
          "bg-gradient-to-br from-gray-900 to-gray-800 [box-shadow:0_0_0_1px_rgba(255,255,255,.1),0_2px_4px_rgba(0,0,0,.2),0_12px_24px_rgba(0,0,0,.3)]",
          className
        )}
        {...props}
      >
      <div className="w-full min-h-full">{background}</div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
        {Icon && (
          <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
        )}
        <h3 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
          {name}
        </h3>
        <p className="max-w-lg text-neutral-400">{description}</p>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        )}
      ></div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-white/[.03]" />
      </motion.div>
    );
  }
);

BentoCard.displayName = "BentoCard";

