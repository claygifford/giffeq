{
  /* <svg width="160" height="160" viewBox="0 0 160 160" style="transform: rotate(-90deg)">
  <circle r="70" cx="80" cy="80" fill="transparent" stroke="#e0e0e0" stroke-width="12px"></circle>
  <circle r="70" cx="80" cy="80" fill="transparent" stroke="#60e6a8" stroke-linecap="round" stroke-width="12px" stroke-dasharray="439.6px" stroke-dashoffset="109.9px"></circle>
</svg> */
}

import React from 'react';

type ScoreProps = {
  message?: string;
};

export default function ScoreComponent(props: ScoreProps) {
  return (
    <div className="relative h-[80px] w-[80px]">
      <svg
        width="80"
        height="80"
        viewBox="0 0 160 160"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          r="70"
          cx="80"
          cy="80"
          fill="white"
          stroke="#d1d5db"
          stroke-width="20px"
        ></circle>
        <circle
          r="70"
          cx="80"
          cy="80"
          fill="transparent"
          stroke="#16a34a"
          stroke-width="20px"
          stroke-dasharray="439.6px"
          stroke-dashoffset="109.9px"
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
