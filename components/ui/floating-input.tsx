import * as React from "react"
import { cn } from "@/lib/utils"

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  labelClassName?: string
  containerClassName?: string
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, labelClassName, containerClassName, id, disabled, ...props }, ref) => {
    // Generate an ID if not provided, for the htmlFor linkage
    const inputId = id || React.useId()

    return (
      <div className={cn("relative group", containerClassName)}>
        <input
          id={inputId}
          ref={ref}
          placeholder=" "
          className={cn(
            "block w-full rounded-md border border-input bg-transparent px-3 pb-2 pt-6 text-sm text-foreground shadow-sm transition-colors peer",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          disabled={disabled}
          {...props}
        />
        <label
          htmlFor={inputId}
          className={cn(
            "absolute left-3 top-3.5 z-10 origin-[0] -translate-y-2.5 scale-75 transform text-sm text-muted-foreground duration-200",
            "peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100",
            "peer-focus:-translate-y-2.5 peer-focus:scale-75 peer-focus:text-primary",
            "pointer-events-none",
            labelClassName
          )}
        >
          {label}
        </label>
      </div>
    )
  }
)
FloatingInput.displayName = "FloatingInput"

export { FloatingInput }
