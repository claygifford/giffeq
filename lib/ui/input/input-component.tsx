import React, { ChangeEventHandler } from 'react';

type InputProps = {
  id: string;
  name: string;
  type: string;
  label?: string;
  autoComplete?: string;
  spellCheck?: boolean;
  placeHolder?: string;
  required?: boolean;
  value?: string | ReadonlyArray<string> | number | undefined;
  onChange?: any;
  onKeyDown?: any;
  children: any;
};
export default function InputComponent(props: InputProps) {
  const {
    label,
    name,
    id,
    type,
    autoComplete,
    spellCheck,
    placeHolder,
    required,
    value,
    onChange,
    onKeyDown,
    children,
  } = props;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center mt-2 gap-2">
        <input
          id={id}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          className="bg-blue-100 shadow-sm max-w-[400px] relative block w-full appearance-none rounded-md px-3 py-2 text-gray-900 placeholder-gray-700 sm:text-sm border-transparent focus:outline-none focus:ring focus:ring-blue-300"
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          spellCheck={spellCheck}
        />
        {children}
      </div>
    </div>
  );
}
