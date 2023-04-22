import React, { Children } from 'react';

type ContainerProps = {
  children?: React.ReactNode;
};

export default function ContainerComponent(props: ContainerProps) {
  const { children } = props;

  return <div className="flex flex-1 w-full overflow-hidden">{children}</div>;
}