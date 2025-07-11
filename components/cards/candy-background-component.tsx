import React from "react";
// heropatterns.com
type Item = {
  colors: string[];
  index: number;
};

const getPath = ({ colors, index }: Item) => {
  if (index === 1) {
    return (
      <pattern
        id={`bg${index}`}
        patternUnits="userSpaceOnUse"
        width="40"
        height="40"
      >
        <path
          fill={`${colors[1]}`}
          d="M0 38.59l2.83-2.83 1.41
      1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59
      40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83
      2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83
      2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83
      1.41-1.41L20 18.59z"
        ></path>
      </pattern>
    );
  }

  return (
    <pattern
      id={`bg${index}`}
      patternUnits="userSpaceOnUse"
      width="28"
      height="49"
    >
      <path
        fill={`${colors[2]}`}
        d="M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z"
      ></path>
    </pattern>
  );
};

export default function CandyBackgroundComponent({ colors, index }: Item) {
  return (
    <div className={`h-full w-full`}>
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        <defs>{getPath({ colors, index })}</defs>
        <rect width="100%" height="100%" fill={`url(#bg${index})`} />
      </svg>
    </div>
  );
}
