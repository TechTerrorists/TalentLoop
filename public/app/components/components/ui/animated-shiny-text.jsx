"use client";
import { motion } from "motion/react";

export const AnimatedShinyText = ({
  children,
  className = "",
}) => {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <span className="relative inline-block">
        <span className="relative z-10">{children}</span>
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent opacity-0"
          animate={{
            opacity: [0, 0.5, 0],
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {children}
        </motion.span>
      </span>
    </motion.div>
  );
};

