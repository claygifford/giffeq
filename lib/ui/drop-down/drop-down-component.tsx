import React, { Children } from 'react';

type DropDownProps = {
  children: React.ReactNode;
};

export default function DropDownComponent(props: DropDownProps) {
  const { children } = props;
  return <div className='bg-red-300'>{children}</div>;
}