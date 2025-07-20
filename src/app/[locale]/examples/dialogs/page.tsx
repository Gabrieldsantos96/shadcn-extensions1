"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";

import { DialogExamples } from "@/src/_pages/_dialogs/dialog-examples";
import { useTranslations } from "next-intl";

export default function DialogsPage() {
  const t = useTranslations("dialogs");

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <p className="text-lg text-muted-foreground max-w-3xl">{t("title")}</p>
      </div>

      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t("howItWorks.title")}</CardTitle>
            <CardDescription>{t("howItWorks.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">
                    🎯 {t("howItWorks.features.promiseBased.title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("howItWorks.features.promiseBased.description")}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">
                    🔧 {t("howItWorks.features.typescript.title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("howItWorks.features.typescript.description")}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">
                    ⚡ {t("howItWorks.features.eventDriven.title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("howItWorks.features.eventDriven.description")}
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">
                    🎨 {t("howItWorks.features.customizable.title")}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {t("howItWorks.features.customizable.description")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("examples.confirmation.title")}</CardTitle>
            <CardDescription>
              {t("examples.confirmation.description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DialogExamples />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
