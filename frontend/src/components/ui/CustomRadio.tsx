type CustomRadioProps = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  className?: string;
  name: string;
  value: string;
};

export function CustomRadio({
  checked,
  onChange,
  label,
  className = "",
  name,
  value,
}: CustomRadioProps) {
  return (
    <label className={`inline-flex items-center cursor-pointer gap-2 ${className}`}>
      <span className="relative w-5 h-5">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          name={name}
          value={value}
          className="peer appearance-none w-5 h-5 rounded-full border border-gray-400 bg-white checked:bg-orange-500 checked:border-orange-500 focus:outline-none transition"
        />
        {checked && (
          <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="w-3 h-3 rounded-full bg-white" />
          </span>
        )}
      </span>
      {label && <span className="text-gray-700 select-none">{label}</span>}
    </label>
  );
}
