"use client";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Label } from "@/src/components/ui/label";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import type { IDialogNestedProps } from "@/src/components/extensions/dialog-service";

interface SelectDialogProps<T> extends IDialogNestedProps<T | null> {
  title: string;
  options: Array<{ label: string; value: T }>;
  defaultValue?: T;
}

export function SelectDialog<T>({
  title,
  options,
  defaultValue,
  onResolve,
}: SelectDialogProps<T>) {
  const [selectedValue, setSelectedValue] = useState<T | undefined>(
    defaultValue
  );

  const handleSubmit = () => {
    onResolve(selectedValue || null);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <RadioGroup
          value={selectedValue ? String(selectedValue) : undefined}
          onValueChange={(value) => {
            const option = options.find((opt) => String(opt.value) === value);
            if (option) setSelectedValue(option.value);
          }}
        >
          {options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem
                value={String(option.value)}
                id={`option-${index}`}
              />
              <Label htmlFor={`option-${index}`}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={() => onResolve(null)}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit} disabled={!selectedValue}>
          Confirmar
        </Button>
      </DialogFooter>
    </>
  );
}
