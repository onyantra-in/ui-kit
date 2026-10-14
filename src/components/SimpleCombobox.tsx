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
import { rankItem } from "@tanstack/match-sorter-utils";

export interface ComboboxOption {
  value: string;
  label: string;
}

export type ComboboxFilter = (
  option: ComboboxOption,
  query: string,
) => boolean;

/** Returns the text the default fuzzy filter matches against. */
export type ComboboxFilterLabel = (option: ComboboxOption) => string;

/** Fuzzy match on `getText(option)` (default `label`) — e.g. "52" matches "5,235/-". */
export const fuzzyComboboxFilter = (
  option: ComboboxOption,
  query: string,
  getText: ComboboxFilterLabel = (o) => o.label,
): boolean => !query || rankItem(getText(option), query).passed;

interface SimpleComboboxBaseProps {
  options: ComboboxOption[];
  placeholder?: string;
  emptyMessage?: string;
  label?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
  showClear?: boolean;
  defaultOpen?: boolean;
  /** Seeds the search input on mount — e.g. a character typed to open the combobox. */
  defaultInputValue?: string;
  /** Custom option filter. Overrides `filterLabel`. Defaults to fuzzy match. */
  filter?: ComboboxFilter;
  /** Text to fuzzy-match each option against instead of `label`. */
  filterLabel?: ComboboxFilterLabel;
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
    showClear,
    defaultOpen,
    defaultInputValue,
    filterLabel,
  } = props;
  const filter: ComboboxFilter =
    props.filter ?? ((option, query) => fuzzyComboboxFilter(option, query, filterLabel));

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
          defaultOpen={defaultOpen}
          defaultInputValue={defaultInputValue}
          autoHighlight="always"
          filter={filter}
          onValueChange={(opts) => onValueChange?.((opts ?? []).map((o) => o.value))}
        >
          <ComboboxInput
            id={id}
            placeholder={inputPlaceholder}
            showClear={showClear ?? value.length > 0}
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
        defaultOpen={defaultOpen}
        defaultInputValue={defaultInputValue}
        autoHighlight="always"
        filter={filter}
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

