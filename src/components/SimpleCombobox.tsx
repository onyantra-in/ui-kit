import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./base/combobox";
import { Label } from "./base/label";
import { cn } from "../lib/utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface SimpleComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export function SimpleCombobox({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  emptyMessage = "No results found.",
  label,
  id,
  className,
  disabled,
}: SimpleComboboxProps) {
  const selectedOption = value ? (options.find((o) => o.value === value) ?? null) : null;

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Combobox
        items={options}
        value={selectedOption}
        onValueChange={(opt) => onValueChange?.(opt?.value ?? "")}
      >
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          showClear={!!value}
          disabled={disabled}
          className="w-full"
        />
        <ComboboxContent >
          <ComboboxList>
            <ComboboxCollection>
              {(option: ComboboxOption) => (
                <ComboboxItem key={option.value} value={option}>
                  {option.label}
                </ComboboxItem>
              )}
            </ComboboxCollection>
            <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

