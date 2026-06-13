import { Input } from "@/components/ui/input"

import { useFieldContext } from "../contexts"

type FormFieldProps = {
  label: string
  placeholder?: string
  disabled?: boolean
  srOnlyLabel?: boolean
}

export function FormField({
  label,
  placeholder,
  disabled,
  srOnlyLabel = false,
}: FormFieldProps) {
  const field = useFieldContext<string>()
  const showError = field.state.meta.isDirty || field.state.meta.isTouched
  const error = field.state.meta.errors[0]

  return (
    <label className={srOnlyLabel ? "flex-1 space-y-2" : "space-y-2"}>
      <span
        className={
          srOnlyLabel
            ? "sr-only"
            : "text-xs font-medium tracking-wide text-muted-foreground uppercase"
        }
      >
        {label}
      </span>
      <Input
        value={field.state.value}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={showError && Boolean(error)}
      />
      {showError && error ? (
        <p className="text-xs text-destructive">{String(error)}</p>
      ) : null}
    </label>
  )
}
