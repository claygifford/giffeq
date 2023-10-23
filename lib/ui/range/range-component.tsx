import React from 'react';

type RangeInputProps = {
  value: number;
  min: number;
  max: number;
};
export default function RangeInputComponent(props: RangeInputProps) {
  const { min, max, value } = props;
  return (
    <input
      id="default-range"
      type="range"
      value={value}
      min={min}
      max={max}
      //className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
  );
}
