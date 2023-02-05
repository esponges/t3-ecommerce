import { useState } from "react";

interface Props  {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
  type?: "checkbox" | "radio";
  value: string;
}

export const Checkbox = ({ checked, onChange, label, disabled, className, type, value }: Props) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
    onChange(e.target.checked);
  };

  return (
    <label className={className}>
      <input
        type={type || "checkbox"}
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        value={value}
        className="mr-2"
      />
      {label}
    </label>
  );
};
