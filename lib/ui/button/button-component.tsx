import React, { Children } from 'react';

type ButtonProps = {
  type?: string;
  children: React.ReactNode;
  onClick?;
  variant?: string;
};

const SideBarClass =
  'group relative flex justify-center rounded-full border border-transparent py-1 px-1 text-sm font-medium text-white hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-200';
const StandardClass =
  'group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';

export default function ButtonComponent(props: ButtonProps) {
  const { type, children, onClick, variant = 'standard' } = props;

  const variantClass = (() => {
    switch (variant) {
      case 'sidebar':
        return SideBarClass;
      case 'standard':
        return StandardClass;
    }
  })();

  return (
    <button onClick={onClick} type="submit" className={variantClass}>
      {children}
    </button>
  );
}
