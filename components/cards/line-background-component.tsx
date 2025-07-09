import React from "react";

type Item = {
  colors: string[];
};

export default function LineBackgroundComponent({ colors }: Item) {
  return (
    <div className={`flex flex-col`}>
      <div className={`h-4`} style={{ backgroundColor: `${colors[2]}` }}></div>
      <div className={`h-6`} style={{ backgroundColor: `${colors[1]}` }}></div>
      <div className={`h-8`} style={{ backgroundColor: `${colors[0]}` }}></div>
    </div>
  );
}
