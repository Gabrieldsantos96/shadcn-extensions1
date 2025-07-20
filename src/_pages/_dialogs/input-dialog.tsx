"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/src/components/ui/dialog";
import type { IDialogNestedProps } from "@/src/components/extensions/dialog-service";

interface InputDialogProps extends IDialogNestedProps<string | null> {
  title: string;
  placeholder?: string;
  defaultValue?: string;
  label?: string;
}

export function InputDialog({
  title,
  placeholder,
  defaultValue = "",
  label,
  onResolve,
}: InputDialogProps) {
  const [value, setValue] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResolve(value.trim() || null);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          {label && <Label htmlFor="input">{label}</Label>}
          <Input
            id="input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onResolve(null)}
          >
            Cancelar
          </Button>
          <Button type="submit">Confirmar</Button>
        </DialogFooter>
      </form>
    </>
  );
}
