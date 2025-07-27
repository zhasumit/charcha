"use client";

import React, { useEffect } from "react";

const PageLoader = ({
  loading = true,
  size = 25,
  margin = 2,
  speedMultiplier = 1,
  className = "text-primary",
  theme,
  ...props
}) => {
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes react-spinners-PacmanLoader-pacman-1 {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(-44deg); }
      }

      @keyframes react-spinners-PacmanLoader-pacman-2 {
        0% { transform: rotate(0deg); }
        50% { transform: rotate(44deg); }
      }

      @keyframes react-spinners-PacmanLoader-ball {
        75% { opacity: 0.7; }
        100% { transform: translate(-${4 * size}px, -${size / 4}px); }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, [size]);

  // Apply `data-theme` on <html> during loading
  useEffect(() => {
    if (!loading) return;

    const originalTheme = document.documentElement.getAttribute("data-theme");

    if (theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }

    return () => {
      if (originalTheme) {
        document.documentElement.setAttribute("data-theme", originalTheme);
      } else {
        document.documentElement.removeAttribute("data-theme");
      }
    };
  }, [loading, theme]);

  if (!loading) return null;

  const pacmanStyle = (top) => ({
    width: 0,
    height: 0,
    borderRight: `${size}px solid transparent`,
    borderLeft: `${size}px solid currentColor`,
    borderTop: top ? `${size}px solid transparent` : `${size}px solid currentColor`,
    borderBottom: top ? `${size}px solid currentColor` : `${size}px solid transparent`,
    borderRadius: `${size}px`,
    position: "absolute",
    animation: `react-spinners-PacmanLoader-${top ? "pacman-1" : "pacman-2"} ${0.8 / speedMultiplier}s infinite ease-in-out`,
    animationFillMode: "both",
  });

  const ballStyle = (i) => ({
    width: `${size / 3}px`,
    height: `${size / 3}px`,
    backgroundColor: "currentColor",
    margin: `${margin}px`,
    borderRadius: "100%",
    position: "absolute",
    top: `${size}px`,
    left: `${size * 4}px`,
    transform: `translate(0, -${size / 4}px)`,
    animation: `react-spinners-PacmanLoader-ball ${1 / speedMultiplier}s ${i * 0.25}s infinite linear`,
    animationFillMode: "both",
  });

  return (
    <div
      className="flex items-center justify-center h-screen w-screen"
      style={{ transform: "translateX(-4%)" }}
      {...props}
    >
      <span
        className={className}
        style={{
          display: "inline-block",
          position: "relative",
          fontSize: 0,
          height: `${size * 2}px`,
          width: `${size * 2}px`,
          color: "currentColor",
        }}
      >
        <span style={pacmanStyle(true)} />
        <span style={pacmanStyle(false)} />
        {[2, 3, 4, 5].map((i) => (
          <span key={i} style={ballStyle(i)} />
        ))}
      </span>
    </div>
  );
};

export default PageLoader;
