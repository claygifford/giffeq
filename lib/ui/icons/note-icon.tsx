import React, { Children } from 'react';

type IconProps = {
  className: string;
  height?: number;
  width?: number;
};

export default function NoteIcon(props: IconProps) {
  const { className, height = 141, width = 127 } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width={width}
      height={height}
      viewBox="0 0 254 282"
      className={className}
    >
      <g>
        <path
          d="M 228.5,8.5 C 229.5,8.5 230.5,8.5 231.5,8.5C 231.408,74.509 231.575,140.509 232,206.5C 222.917,232.202 204.75,243.036 177.5,239C 149.696,229.734 139.03,210.734 145.5,182C 155.878,159.307 173.545,149.973 198.5,154C 199.872,154.402 201.205,154.902 202.5,155.5C 203.667,128.506 203.833,101.506 203,74.5C 168.885,84.5931 134.718,94.5931 100.5,104.5C 99.9807,151.875 99.1474,199.209 98,246.5C 90.6014,266.062 76.4347,276.062 55.5,276.5C 32.665,275.832 18.165,264.499 12,242.5C 8.44051,215.426 19.6072,197.926 45.5,190C 53.9567,189.006 62.29,189.506 70.5,191.5C 71.1667,145.167 71.8333,98.8333 72.5,52.5C 124.701,38.12 176.701,23.4533 228.5,8.5 Z"
        />
      </g>
    </svg>
  );
}
