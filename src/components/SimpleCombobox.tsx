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

interface SimpleComboboxBaseProps {
  options: ComboboxOption[];
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

export interface SimpleComboboxSingleProps extends SimpleComboboxBaseProps {
  multiple?: false;
  value?: string;
  onValueChange?: (value: string) => void;
}

export interface SimpleComboboxMultipleProps extends SimpleComboboxBaseProps {
  multiple: true;
  value?: string[];
  onValueChange?: (values: string[]) => void;
}

export type SimpleComboboxProps = SimpleComboboxSingleProps | SimpleComboboxMultipleProps;

export function SimpleCombobox(props: SimpleComboboxProps) {
  const {
    options,
    placeholder = "Select…",
    emptyMessage = "No results found.",
    label,
    id,
    className,
    disabled,
  } = props;

  if (props.multiple) {
    const { value = [], onValueChange } = props;
    const selectedOptions = options.filter((o) => value.includes(o.value));
    const inputPlaceholder =
      selectedOptions.length > 0
        ? selectedOptions.map((o) => o.label).join(", ")
        : placeholder;

    return (
      <div className={cn("w-full space-y-1.5", className)}>
        {label && <Label htmlFor={id}>{label}</Label>}
        <Combobox
          multiple
          items={options}
          value={selectedOptions}
          onValueChange={(opts) => onValueChange?.((opts ?? []).map((o) => o.value))}
        >
          <ComboboxInput
            id={id}
            placeholder={inputPlaceholder}
            showClear={value.length > 0}
            disabled={disabled}
            className="w-full"
          />
          <ComboboxContent>
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

  const { value, onValueChange } = props;
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
        <ComboboxContent>
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

