import { IoMdCheckmark } from "react-icons/io";

type CustomCheckboxProps = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  className?: string;
};

export function CustomCheckbox({ checked, onChange, label, className = "" }: CustomCheckboxProps) {
  return (
    <label className={`inline-flex items-center cursor-pointer gap-2 ${className}`}>
      <span className="relative w-5 h-5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="peer appearance-none w-5 h-5 rounded border border-gray-400 bg-white checked:bg-orange-500 checked:border-orange-500 focus:outline-none transition"
        />
        {checked && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <IoMdCheckmark className="text-white text-lg" />
          </span>
        )}
      </span>
      {label && <span className="text-gray-700 select-none">{label}</span>}
    </label>
  );
}
