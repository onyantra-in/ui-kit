import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./base/select";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export interface SimpleSelectProps {
  options: SelectOption[] | SelectOptionGroup[];
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  size?: "default" | "sm";
  className?: string;
}

function isGrouped(options: SimpleSelectProps["options"]): options is SelectOptionGroup[] {
  return options.length > 0 && "options" in options[0];
}

export function SimpleSelect({
  options,
  placeholder = "Select…",
  value,
  onValueChange,
  disabled,
  size = "default",
  className,
}: SimpleSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger size={size} className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {isGrouped(options)
          ? (options as SelectOptionGroup[]).map((group, i) => (
              <>
                {i > 0 && <SelectSeparator key={`sep-${i}`} />}
                <SelectGroup key={group.label}>
                  <SelectLabel>{group.label}</SelectLabel>
                  {group.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </>
            ))
          : (options as SelectOption[]).map((opt) => (
              <SelectItem key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </SelectItem>
            ))}
      </SelectContent>
    </Select>
  );
}
