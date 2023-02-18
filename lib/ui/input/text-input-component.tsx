import React from 'react';

type TextInputProps = {
    id: string;
    name: string;
    type: string;
    label: string;
    autoComplete?: string;
    placeHolder?: string;
    required?: boolean;
}
export default function TextInputComponent(props: TextInputProps) {
  const { label, name, id, type, autoComplete, placeHolder, required } = props;
  return (
    <div className="-space-y-px rounded-md shadow-sm">
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          className="relative mt-2 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder={placeHolder}
        />
      </div>
    </div>
  );
}
