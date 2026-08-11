"use client";

import { NumberInput } from "@/components/ui/number-input";
import { parseDimensionInput } from "@/lib/validation/schemas";
import { useEffect, useRef, useState } from "react";

interface DimensionFieldsProps {
  width: number;
  height: number;
  onChange: (size: { width: number; height: number }) => void;
  disabled?: boolean;
}

export function DimensionFields({
  width,
  height,
  onChange,
  disabled,
}: DimensionFieldsProps) {
  const [widthText, setWidthText] = useState(String(width));
  const [heightText, setHeightText] = useState(String(height));
  const [error, setError] = useState<string | undefined>();
  const prevWidth = useRef(width);
  const prevHeight = useRef(height);

  useEffect(() => {
    if (prevWidth.current !== width || prevHeight.current !== height) {
      setWidthText(String(width));
      setHeightText(String(height));
      prevWidth.current = width;
      prevHeight.current = height;
    }
  }, [width, height]);

  const commit = (nextWidth: string, nextHeight: string) => {
    const parsed = parseDimensionInput(nextWidth, nextHeight);
    if (!parsed.success) {
      setError(parsed.error);
      return;
    }
    setError(undefined);
    if (parsed.data.width !== width || parsed.data.height !== height) {
      onChange(parsed.data);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <NumberInput
        label="Width (px)"
        value={widthText}
        disabled={disabled}
        min={1}
        max={8192}
        error={error}
        onValueChange={(value) => {
          setWidthText(value);
          commit(value, heightText);
        }}
      />
      <NumberInput
        label="Height (px)"
        value={heightText}
        disabled={disabled}
        min={1}
        max={8192}
        onValueChange={(value) => {
          setHeightText(value);
          commit(widthText, value);
        }}
      />
    </div>
  );
}
