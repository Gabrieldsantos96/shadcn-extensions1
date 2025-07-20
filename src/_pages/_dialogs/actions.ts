import { openDialog } from "@/src/lib/dialog-utils";

export async function confirmDialog(
  title: string,
  message: string,
  options?: {
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
  }
): Promise<boolean> {
  const { ConfirmDialog } = await import(
    "@/src/components/dialogs/confirm-dialog"
  );
  return openDialog<boolean>(ConfirmDialog, {
    componentProps: {
      title,
      message,
      confirmText: options?.confirmText || "Confirmar",
      cancelText: options?.cancelText || "Cancelar",
      variant: options?.variant || "default",
    },
  });
}

export async function inputDialog(
  title: string,
  placeholder?: string,
  defaultValue?: string
): Promise<string | null> {
  const { InputDialog } = await import("@/src/components/dialogs/input-dialog");
  return openDialog<string | null>(InputDialog, {
    componentProps: {
      title,
      placeholder,
      defaultValue,
    },
  });
}

export async function selectDialog<T>(
  title: string,
  options: Array<{ label: string; value: T }>,
  defaultValue?: T
): Promise<T | null> {
  const { SelectDialog } = await import(
    "@/src/components/dialogs/select-dialog"
  );
  return openDialog<T | null>(SelectDialog, {
    componentProps: {
      title,
      options,
      defaultValue,
    },
  });
}

export async function loadingDialog(
  title: string,
  message: string,
  duration?: number
): Promise<boolean> {
  const { LoadingDialog } = await import(
    "@/src/components/dialogs/loading-dialog"
  );
  return openDialog<boolean>(LoadingDialog, {
    componentProps: {
      title,
      message,
      duration,
    },
  });
}
