import React, { ChangeEventHandler } from "react";

type RangeInputProps = {
  value: number;
  min: number;
  max: number;
  onChange: ChangeEventHandler<HTMLInputElement>;
};
export default function RangeInputComponent(props: RangeInputProps) {
  const { min, max, value, onChange } = props;
  return (
    <div>
      <input
        id="default-range"
        type="range"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        //className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      {/* <div className='w-full bg-orange-200 h-full'></div> */}
    </div>
  );
}
