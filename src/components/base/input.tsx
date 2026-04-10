import * as React from "react"

import { cn } from "../../lib/utils"

const NUMERIC_PATTERNS = {
  number: '^-?[0-9]\\d*\\.?\\d*$',
  int: '^-?[0-9]\\d*$',
} as const

type NumericType = keyof typeof NUMERIC_PATTERNS

type InputProps = Omit<React.ComponentProps<"input">, "type"> & {
  type?: React.ComponentProps<"input">["type"] | "int"
}

const INPUT_CLASS =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

function Input({ className, type, value, onChange, ...props }: InputProps) {
  const isNumericType = type === "number" || type === "int"
  const numericType = isNumericType ? (type as NumericType) : null

  if (isNumericType && numericType) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const changeVal = e.target.value
      if (!e.target.validity.valid && changeVal !== "" && changeVal !== "-") {
        e.target.value = (value ?? "").toString();
        return
      }
      onChange?.(e)
    }

    return (
      <input
        type="tel"
        inputMode={numericType === "int" ? "numeric" : "decimal"}
        data-slot="input"
        pattern={NUMERIC_PATTERNS[numericType]}
        autoComplete="off"
        value={value}
        onChange={handleChange}
        className={cn(INPUT_CLASS, className)}
        {...props}
      />
    )
  }

  return (
    <input
      type={type as React.ComponentProps<"input">["type"]}
      data-slot="input"
      autoComplete="off"
      value={value}
      onChange={onChange}
      className={cn(INPUT_CLASS, className)}
      {...props}
    />
  )
}

export { Input }
export type { InputProps }
