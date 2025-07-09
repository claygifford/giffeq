import React, { ChangeEventHandler } from "react";

type RangeInputProps = {
  value: number;
  min: number;
  max: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  orient?: string;
  step: string | number;
  disabled?: boolean;
};
export default function RangeInputComponent(props: RangeInputProps) {
  const {
    min,
    max,
    value,
    onChange,
    orient = "horizontal",
    step,
    disabled,
  } = props;
  return (
    <input
      id="default-range"
      type="range"
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      disabled={disabled}
      className={`${orient === "vertical" ? "is-vertical" : "is-horizontal"}`}
      //className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
    />
  );
}
