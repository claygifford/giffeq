import React, { Children } from 'react';

type ButtonProps = {
  type?: string;
  children: React.ReactNode;
  onClick?;
};

export default function ButtonComponent(props: ButtonProps) {
  const { type, children, onClick } = props;
  return (
    <button
      onClick={onClick}
      type="submit"
      className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
    >
      {children}
    </button>
  );
}
