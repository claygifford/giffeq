import React from "react";
import { useLayout } from "../../context/layout-context";
import styles from "./background.module.css";

export default function BackgroundComponent() {
  const { colors } = useLayout();
  return (
    <div className="absolute -z-50 h-full w-full">
      <svg
        viewBox="0 0 500 250"
        preserveAspectRatio="none"
        className={styles.BackgroundSvg}
      >
        <path
          fill={`${colors[0]}`}
          d="M 0 50 C 215 150 250 0 500 100 L 500 0 L 0 0"
        ></path>
        <path
          fill={`${colors[1]}`}
          d="M 0 50 C 150 150 300 0 500 80 L 500 0 L 0 0"
        ></path>
        <path
          fill={`${colors[2]}`}
          d="M 0 50 C 150 150 330 -30 500 50 L 500 0 L 0 0"
        ></path>
      </svg>
    </div>
  );
}
