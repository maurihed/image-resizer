import { Input } from "@/components/ui/input";
import type { InputHTMLAttributes } from "react";

interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  error?: string;
  value: number | string;
  onValueChange: (value: string) => void;
}

export function NumberInput({
  label,
  error,
  value,
  onValueChange,
  ...props
}: NumberInputProps) {
  return (
    <Input
      label={label}
      error={error}
      type="number"
      inputMode="numeric"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
      {...props}
    />
  );
}
