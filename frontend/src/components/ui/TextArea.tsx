import type { ChangeEvent } from "react";
import { ErrorMessage } from "./ErrorMessage";

type Props = {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  rows?: number;
  error?: string;
};

export function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  maxLength,
  required = false,
  rows = 4,
  error,
}: Props) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        rows={rows}
        className={`block w-full border rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
