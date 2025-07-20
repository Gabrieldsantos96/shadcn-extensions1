"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/src/components/ui/dialog";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import type { IDialogNestedProps } from "@/src/components/extensions/dialog-service";

interface LoadingDialogProps extends IDialogNestedProps<boolean> {
  title: string;
  message: string;
  duration?: number;
}

export function LoadingDialog({
  title,
  message,
  duration = 3000,
  onResolve,
}: LoadingDialogProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simula sucesso ou erro aleatório
      const success = Math.random() > 0.3;
      setStatus(success ? "success" : "error");

      // Auto-resolve após mostrar o resultado
      setTimeout(() => {
        onResolve(success);
      }, 1500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onResolve]);

  const getIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getMessage = () => {
    switch (status) {
      case "loading":
        return message;
      case "success":
        return "Operação concluída com sucesso!";
      case "error":
        return "Ocorreu um erro durante a operação";
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          {getIcon()}
          {title}
        </DialogTitle>
        <DialogDescription>{getMessage()}</DialogDescription>
      </DialogHeader>

      {status === "loading" && (
        <div className="flex justify-center py-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300 animate-pulse"
              style={{ width: "60%" }}
            />
          </div>
        </div>
      )}

      {status !== "loading" && (
        <div className="flex justify-center pt-4">
          <Button onClick={() => onResolve(status === "success")}>
            Fechar
          </Button>
        </div>
      )}
    </>
  );
}
