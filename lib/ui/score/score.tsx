import React from "react";

export default function ScoreComponent() {
  return (
    <div className="relative h-[80px] w-[80px]">
      <svg
        width="80"
        height="80"
        viewBox="0 0 160 160"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          r="70"
          cx="80"
          cy="80"
          fill="white"
          stroke="#d1d5db"
          strokeWidth="20px"
        ></circle>
        <circle
          r="70"
          cx="80"
          cy="80"
          fill="transparent"
          stroke="#16a34a"
          strokeWidth="20px"
          strokeDasharray="439.6px"
          strokeDashoffset="109.9px"
        ></circle>
      </svg>
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="flex">
          <span className="invisible text-sm">%</span>
          <span className="text-slate-700 text-2xl font-bold">75</span>
          <span className="text-slate-500 text-sm">%</span>
        </div>
      </div>
    </div>
  );
}
