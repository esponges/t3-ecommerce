import { useOutsideClick } from "@/lib/hooks/useOutsideClick";
import { useRef, useState } from "react";
import { Icon } from "semantic-ui-react";

type Option = { label: string; value: string, onClick?: () => void };

export interface DropdownProps {
  trigger: React.ReactNode;
  options: Option[];
  className?: string;
}
export const Dropdown = ({ options, trigger, className }: DropdownProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Option>();

  // outside click listener
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref: dropdownRef,
    onOutsideClick: () => setOpen(false),
  });

  const handleSelect = (option: Option) => {
    setSelected(option);
    setOpen(false);

    if (option.onClick) {
      option.onClick();
    }
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  return (
    <div className={`relative ${className || ''}`} ref={dropdownRef}>
      <div className="flex items-center" onClick={handleOpen}>
        {trigger}
        <div className="ml-2">
          <Icon name="chevron down" size="small" />
        </div>
      </div>
      <div className={`absolute top-8 left-0 w-full z-10 ${open ? 'block' : 'hidden'}`}>
        <div className="bg-white shadow rounded-md overflow-hidden">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selected?.value === option.value ? 'bg-gray-100' : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
