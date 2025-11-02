"use client";
import React from "react";

export const Ripple = ({
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  className,
  ...props
}) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 select-none [mask-image:linear-gradient(to_bottom,white,transparent)] ${className || ""}`}
      {...props}
    >
      {Array.from({ length: numCircles }, (_, i) => {
        const size = mainCircleSize + i * 70;
        const opacity = mainCircleOpacity - i * 0.03;
        const animationDelay = `${i * 0.06}s`;

        return (
          <div
            key={i}
            className="absolute rounded-full border border-white/25 shadow-xl animate-ripple"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              opacity,
              animationDelay,
              borderStyle: "solid",
              borderWidth: "1px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) scale(1)",
            }}
          />
        );
      })}
    </div>
  );
};

