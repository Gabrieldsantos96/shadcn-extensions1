"use client";

import { Button } from "@/src/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/src/components/ui/dialog";
import { AlertTriangle, CheckCircle } from "lucide-react";
import type { IDialogNestedProps } from "@/src/components/extensions/dialog-service";

interface ConfirmDialogProps extends IDialogNestedProps<boolean> {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
}

export function ConfirmDialog({
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "default",
  onResolve,
}: ConfirmDialogProps) {
  const isDestructive = variant === "destructive";

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {isDestructive ? (
            <AlertTriangle className="h-5 w-5 text-destructive" />
          ) : (
            <CheckCircle className="h-5 w-5 text-primary" />
          )}
          {title}
        </DialogTitle>
        <DialogDescription>{message}</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button variant="outline" onClick={() => onResolve(false)}>
          {cancelText}
        </Button>
        <Button
          variant={isDestructive ? "destructive" : "default"}
          onClick={() => onResolve(true)}
        >
          {confirmText}
        </Button>
      </DialogFooter>
    </>
  );
}
