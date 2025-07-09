import React from "react";
import RangeInputComponent from "../../../lib/ui/range/range-component";

type Props = {
  duration?: { value: number; max: number };
  onSeek: (value: number) => void;
};

export default function DurationComponent(props: Props) {
  const { duration, onSeek } = props;

  return (
    <RangeInputComponent
      value={duration ? duration.value : 0}
      min={0}
      max={duration ? duration.max : 1}
      step={1}
      disabled={!duration}
      onChange={(e) => onSeek(+e.target.value)}
    ></RangeInputComponent>
  );
}
