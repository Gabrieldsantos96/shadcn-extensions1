"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Code, Coffee, Heart, Puzzle, Zap } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function Home() {
  const t = useTranslations("home");

  const translations = {
    title: t("title"),
    subtitle: t("subtitle"),
    description: t("description"),
    getStarted: t("getStarted"),
    components: t("components"),
    comboboxTitle: t("comboboxTitle"),
    comboboxDescription: t("comboboxDescription"),
    comboboxPagination: t("comboboxExamplesPaginationTitle"),
    comboboxSimple: t("comboboxExamplesSimpleTitle"),
    comboboxForm: t("comboboxExamplesFormTitle"),
    inputsTitle: t("inputsTitle"),
    inputsDescription: t("inputsDescription"),
    inputsMasked: t("inputsExamplesMaskedTitle"),
    inputsCurrency: t("inputsExamplesCurrencyTitle"),
    dialogsTitle: t("dialogsTitle"),
    dialogsDescription: t("dialogsDescription"),
    dialogsConfirm: t("dialogsExamplesConfirmTitle"),
    dialogsInput: t("dialogsExamplesInputTitle"),
    dialogsSelect: t("dialogsExamplesSelectTitle"),
    support: t("support"),
    github: t("github"),
    coffee: t("coffee"),
    search: t("search"),
    validation: t("validation"),
    installation: t("installation"),
    tests: t("tests"),
    updates: t("updates"),
    weekly: t("weekly"),
    supportMessage: t("supportMessage"),
    installationDescription: t("installationDescription"),
    componentsDescription: t("componentsDescription"),
    configuration: t("configuration"),
    configurationDescription: t("configurationDescription"),
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Puzzle className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">{translations.title}</h1>
        </div>
        <p className="text-xl text-muted-foreground mb-6">
          {translations.subtitle}
        </p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="text-sm">
            <Code className="h-3 w-3 mr-1" />
            TypeScript
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <Zap className="h-3 w-3 mr-1" />
            ShadCN
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Tailwind CSS
          </Badge>
          <Badge variant="secondary" className="text-sm">
            React-Hook-Form
          </Badge>

          <Badge variant="secondary" className="text-sm">
            React-Query
          </Badge>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="h-5 w-5" />
            {t("aboutProject", { projectName: "shadcn Extensions" })}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {t("aboutDescription", {
              projectName: "shadcn Extensions",
            })}
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 mb-8">
        <h2 className="text-2xl font-semibold">{translations.components}</h2>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{translations.comboboxTitle}</CardTitle>
              </div>
              <Badge>{t("new")}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {translations.comboboxDescription}
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/examples/combobox">{t("viewExamples")}</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/examples/combobox#api">{t("apiReference")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{translations.inputsTitle}</CardTitle>
              </div>
              <Badge>{t("new")}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {translations.inputsDescription}
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/examples/inputs">{t("viewExamples")}</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/examples/inputs#api">{t("apiReference")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{translations.dialogsTitle}</CardTitle>
              </div>
              <Badge>{t("new")}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {translations.dialogsDescription}
            </p>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link href="/examples/dialogs">{t("viewExamples")}</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/examples/dialogs#api">{t("apiReference")}</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{translations.getStarted}</CardTitle>
          <CardDescription>
            {translations.installationDescription}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">
              {t("installDependencies")}
            </p>
            <code className="text-sm bg-background px-2 py-1 rounded">
              npm install @tanstack/react-query lucide-react
            </code>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">{t("setupShadcn")}</p>
            <code className="text-sm bg-background px-2 py-1 rounded">
              npx shadcn@latest init
            </code>
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium mb-2">{t("copyComponent")}</p>
            <p className="text-sm text-muted-foreground">
              {t("copyComponentDescription")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 border-orange-200 dark:border-orange-800 mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-orange-600" />
            {translations.support}
          </CardTitle>
          <CardDescription>{translations.supportMessage}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("supportDescription")}
          </p>
          <div className="flex gap-3">
            <Button asChild className="bg-orange-600 hover:bg-orange-700">
              <a
                href="https://www.buymeacoffee.com/shadcnextensions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Coffee className="h-4 w-4" />
                {translations.coffee}
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a
                href="https://github.com/sponsors"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                {t("sponsor")}
              </a>
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>{t("supportAppreciation")}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
