import React from 'react';

type CheckboxInputProps = {
  id: string;
  name: string;
  label: string;
  value: boolean | undefined;
  onChange?: any;
};
export default function CheckboxInputComponent(props: CheckboxInputProps) {
  const { label, name, id, value, onChange } = props;
  return (
    <div className="flex items-center">
      <input
        id={id}
        name={name}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        value={value}
        onChange={onChange}
      />
      <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
        {label}
      </label>
    </div>
  );
}
