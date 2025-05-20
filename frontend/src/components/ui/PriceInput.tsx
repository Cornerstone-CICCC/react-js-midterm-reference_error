import type { ChangeEvent } from "react";
import { ErrorMessage } from "./ErrorMessage";

type Props = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  min?: number;
  step?: number;
  required?: boolean;
  error?: string;
};

export function PriceInput({
  value,
  onChange,
  label = "Price",
  min = 5,
  step = 1,
  required = false,
  error,
}: Props) {
  const sellingFee = value ? Number.parseFloat(value) * 0.1 : 0;

  return (
    <div className="mb-4">
      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-orange-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          type="number"
          id="price"
          name="price"
          value={value}
          onChange={onChange}
          placeholder="5"
          className={`pl-7 block w-full border rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          min={min}
          step={step}
          required={required}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? "price-error" : undefined}
        />
      </div>
      <div className="flex justify-between mt-2 text-sm">
        <div>Selling Fee (10%)</div>
        <div>${sellingFee.toFixed(2)}</div>
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
