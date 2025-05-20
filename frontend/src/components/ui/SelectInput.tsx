import type { ChangeEvent } from "react";
import { ErrorMessage } from "./ErrorMessage";

type Option = {
  label: string;
  value: string;
};

type Props = {
  label: string;
  name: string;
  value: string;
  options: Option[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  error?: string;
};

export function SelectInput({
  label,
  name,
  value,
  options,
  onChange,
  required = false,
  error,
}: Props) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <div
        className={`flex items-center justify-between border rounded-md px-3 py-2 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="block w-full border-0 p-0 text-gray-900 focus:ring-0 focus:outline-none text-sm"
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
