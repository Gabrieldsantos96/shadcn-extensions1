"use client";

import { Button } from "@/src/components/ui/button";

import { confirmDialog, inputDialog, selectDialog } from "./actions";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { CodeViewer } from "../code-view";

const DialogExamplesCode = `export function DialogExamples() {
  const t = useTranslations("dialogs");

  const handleConfirmDialog = async () => {
    const result = await confirmDialog(
      t("examples.confirmation.title"),
      t("examples.confirmation.description")
    );

    if (result) {
      toast.success(t("messages.confirmed"));
    } else {
      toast.info(t("messages.cancelled"));
    }
  };

  const handleDestructiveDialog = async () => {
    const result = await confirmDialog(
      t("examples.destructive.title"),
      t("examples.destructive.description")
    );

    if (result) {
      toast.success(t("messages.deleted"));
    } else {
      toast.info(t("messages.cancelled"));
    }
  };

  const handleInputDialog = async () => {
    const result = await inputDialog(
      t("examples.input.title"),
      t("examples.input.description"),
      "default value"
    );

    if (result) {
      toast.success(t("messages.saved"), {
        description: result,
      });
    } else {
      toast.info(t("messages.cancelled"));
    }
  };

  const handleSelectDialog = async () => {
    const options = [
      { value: "option1", label: "option1" },
      { value: "option2", label: "option2" },
      { value: "option3", label: "option3" },
    ];

    const result = await selectDialog(
      t("examples.input.title"),
      options,
      options[0]?.value
    );

    if (result) {
      toast.success(t("messages.selected"), {
        description:,
      });
    } else {
      toast.info(t("messages.cancelled"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button onClick={handleConfirmDialog} variant="default">
          {t("buttons.simpleConfirm")}
        </Button>
        <Button onClick={handleDestructiveDialog} variant="destructive">
          {t("buttons.destructiveConfirm")}
        </Button>
        <Button onClick={handleInputDialog} variant="outline">
          {t("buttons.textInput")}
        </Button>
        <Button onClick={handleSelectDialog} variant="secondary">
          {t("buttons.optionSelect")}
        </Button>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <CodeViewer code={currencyInputComponentCode} language="tsx" />
      </div>
    </div>
  );
}
`;

const EventManagerCode = `
export type EventManagerListener<T> = (payload: T | null) => void

export interface IEventManager<T> {
  listeners: Map<string, EventManagerListener<T>[]>
  emit(event: string, payload: T | null): void
  on(event: string, listener: EventManagerListener<T>): void
  removeListener(event: string, listenerToRemove: EventManagerListener<T>): void
}

export class EventManager<T> implements IEventManager<T> {
  public readonly listeners: Map<string, EventManagerListener<T>[]>

  constructor() {
    this.listeners = new Map()
  }

  on(event: string, listener: EventManagerListener<T>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(listener)
  }

  emit(event: string, payload: T | null) {
    if (!this.listeners.has(event)) return
    this.listeners.get(event)!.forEach((listener: EventManagerListener<T>) => {
      listener(payload)
    })
  }

  removeListener(event: string, listenerToRemove: EventManagerListener<T>) {
    const listeners = this.listeners.get(event)
    if (!listeners) return
    const filteredListeners = listeners.filter((listener: EventManagerListener<T>) => listener !== listenerToRemove)
    this.listeners.set(event, filteredListeners)
  }
}

`;

const openDialogCode = `
import type React from "react";
import {
  dialogEventManager,
  type IDialogEventProps,
} from "@/src/components/extensions/dialog-service";

export function openDialog<T = unknown>(
  component: React.ComponentType<any>,
  props?: {
    componentProps?: Record<string, unknown>;
    dialogProps?: IDialogEventProps["dialogProps"];
    contentProps?: IDialogEventProps["contentProps"];
    className?: string;
  }
): Promise<T> {
  return new Promise((resolve) => {
    const id = crypto.randomUUID();

    const dialogProps: IDialogEventProps = {
      id,
      component,
      componentProps: props?.componentProps,
      dialogProps: props?.dialogProps,
      contentProps: props?.contentProps,
      className: props?.className,
      resolver: resolve as (data: unknown) => void,
    };

    dialogEventManager.emit("dialog", dialogProps);
  });
}

`;

const dialogServiceCode = `
"use client";

import type React from "react";
import { EventManager } from "@/src/lib/event-manager";
import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { cn } from "@/src/lib/utils";

export type IDialogEventProps = {
  component: any;
  componentProps?: Record<string, unknown>;
  dialogProps?: React.ComponentProps<typeof Dialog>;
  contentProps?: React.ComponentProps<typeof DialogContent>;
  className?: string;
  resolver: (data: unknown) => void;
  id: string;
};

export type IDialogNestedProps<T> = {
  onResolve: (data: T) => void;
};

export const dialogEventManager = new EventManager<IDialogEventProps>();

export function DialogService() {
  const [dialogs, setDialogs] = useState<IDialogEventProps[]>([]);

  useEffect(() => {
    function onOpenDialog(dialog: IDialogEventProps | null) {
      if (dialog) {
        setDialogs((prev) => [...prev, dialog]);
      }
    }

    dialogEventManager.on("dialog", onOpenDialog);
    return () => dialogEventManager.removeListener("dialog", onOpenDialog);
  }, []);

  const closeDialog = (id: string, result: unknown) => {
    const dialog = dialogs.find((d) => d.id === id);
    dialog?.resolver(result);
    setDialogs((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <>
      {dialogs.map((dialog) => {
        const Component = dialog.component;
        return (
          <Dialog
            key={dialog.id}
            open={true}
            onOpenChange={(open) => {
              if (!open) {
                closeDialog(dialog.id, null);
              }
            }}
            {...dialog.dialogProps}
          >
            <DialogContent
              className={cn(
                "backdrop-blur-md bg-background/80 border-border/50",
                dialog.className
              )}
              {...dialog.contentProps}
            >
              <Component
                {...dialog.componentProps}
                onResolve={(result: unknown) => closeDialog(dialog.id, result)}
              />
            </DialogContent>
          </Dialog>
        );
      })}
    </>
  );
}

`;

const providerCode = `
export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <Providers>
          <NextIntlClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <Header />
                  <main className="flex-1">{children}</main>
                </SidebarInset>
              </SidebarProvider>
              <DialogService /> // DialogService in rootLayout
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
`;

export function DialogExamples() {
  const t = useTranslations("dialogs");

  const handleConfirmDialog = async () => {
    const result = await confirmDialog(
      t("examples.confirmation.title"),
      t("examples.confirmation.description")
    );

    if (result) {
      toast.success(t("messages.confirmed"));
    } else {
      toast.info(t("messages.cancelled"));
    }
  };

  const handleDestructiveDialog = async () => {
    const result = await confirmDialog(
      t("examples.destructive.title"),
      t("examples.destructive.description")
    );

    if (result) {
      toast.success(t("messages.deleted"));
    } else {
      toast.info(t("messages.cancelled"));
    }
  };

  const handleInputDialog = async () => {
    const result = await inputDialog(
      t("examples.input.title"),
      t("examples.input.description"),
      "default value"
    );

    if (result) {
      toast.success(t("messages.saved"), {
        description: `${t("labels.value")}: ${result}`,
      });
    } else {
      toast.info(t("messages.cancelled"));
    }
  };

  const handleSelectDialog = async () => {
    const options = [
      { value: "option1", label: "option1" },
      { value: "option2", label: "option2" },
      { value: "option3", label: "option3" },
    ];

    const result = await selectDialog(
      t("examples.input.title"),
      options,
      options[0]?.value
    );

    if (result) {
      toast.success(t("messages.selected"), {
        description: `: ${result}`,
      });
    } else {
      toast.info(t("messages.cancelled"));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Button onClick={handleConfirmDialog} variant="default">
          {t("buttons.simpleConfirm")}
        </Button>
        <Button onClick={handleDestructiveDialog} variant="destructive">
          {t("buttons.destructiveConfirm")}
        </Button>
        <Button onClick={handleInputDialog} variant="outline">
          {t("buttons.textInput")}
        </Button>
        <Button onClick={handleSelectDialog} variant="secondary">
          {t("buttons.optionSelect")}
        </Button>
      </div>

      <div className="p-4 rounded-lg">
        <p className="p-2">{t("step1")}</p>
        <CodeViewer code={EventManagerCode} />
        <p className="p-2">{t("step2")}</p>
        <CodeViewer code={dialogServiceCode} />
        <p className="p-2">{t("step3")}</p>
        <CodeViewer code={providerCode} />
        <p className="p-2">{t("step4")}</p>
        <CodeViewer code={openDialogCode} />
        <p className="p-2">{t("step5")}</p>
        <CodeViewer code={DialogExamplesCode} language="tsx" />
      </div>
    </div>
  );
}
