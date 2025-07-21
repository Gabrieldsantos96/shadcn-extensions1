"use client";

import { CurrencyInput } from "@/src/components/extensions/currency-input";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { sleep } from "@/src/utils/sleep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import z from "zod";
import { CodeViewer } from "@/src/components/code-view";
import { useQuery } from "@tanstack/react-query";
import currency from "currency.js";

const useStateExampleCode = `function CurrencyAsyncUseStateExample() {
  const t = useTranslations("inputs.currencyExamples")
  
  const { data, isFetching: loading, refetch } = useQuery({
    queryFn: fetchCurrencyData,
    queryKey: ["CurrencyAsyncUseStateExample"],
  })

  const [form, setForm] = useState({
    salary: "",
    bonus: "",
    investment: "",
    savings: "",
  })

  useEffect(() => {
    if (data) {
      setForm(data)
    }
  }, [data])

  function handleChange(field: string, value: string) {
    setForm((s) => ({ ...s, [field]: value }))
  }

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="salary-state">{t("fields.salary.label")}</Label>
          <CurrencyInput
            id="salary-state"
            placeholder={loading ? t("fields.salary.loading") : t("fields.salary.placeholder")}
            currency="USD"
            value={loading ? "" : form.salary}
            onChange={(e) => handleChange("salary", e.target.value)}
          />
        </div>
        {/* ... more fields */}
      </CardContent>
    </Card>
  )
}`;

const reactHookFormExampleCode = `function CurrencyAsyncFormExample() {
  const t = useTranslations("inputs.currencyExamples")
  
  const { data, isFetching: loading, refetch } = useQuery({
    queryFn: fetchCurrencyData,
    queryKey: ["CurrencyAsyncFormExample"],
  })

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<CurrencyFormData>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: {
      salary: "",
      bonus: "",
      investment: "",
      savings: "",
    },
  })

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data, reset])

  const onSubmit = (data: CurrencyFormData) => {
    toast(\`\${t("buttons.submit")}: \${JSON.stringify(data, null, 2)}\`)
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="salary"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                placeholder={loading ? t("fields.salary.loading") : t("fields.salary.placeholder")}
                disabled={loading}
                currency="USD"
                value={loading ? "" : field.value}
                onChange={(e) => !loading && field.onChange(e.target.value)}
              />
            )}
          />
          {/* ... more fields */}
        </form>
      </CardContent>
    </Card>
  )
}`;

const currencyInputComponentCode = `interface CurrencyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  currency?: string
}

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ className, currency = "USD", value, onChange, ...props }, ref) => {
    const formatCurrency = (inputValue: string) => {
      if (!inputValue) return ""
      const cleanValue = inputValue.replace(/\\D/g, "")
      if (!cleanValue) return ""
      const number = Number.parseInt(cleanValue)
      return new Intl.NumberFormat().format(number)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const formattedValue = formatCurrency(inputValue)
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: formattedValue },
      }
      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
    }

    const getCurrencySymbol = (curr: string) => {
      const symbols: Record<string, string> = {
        USD: "$", EUR: "€", BRL: "R$", GBP: "£",
      }
      return symbols[curr] || curr
    }

    return (
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-muted-foreground">
          {getCurrencySymbol(currency)}
        </span>
        <Input
          className={cn("pl-10", className)}
          ref={ref}
          value={value ? formatCurrency(String(value)) : ""}
          onChange={handleChange}
          {...props}
        />
      </div>
    )
  },
)`;

const currencyFormSchema = z.object({
  salary: z.string().min(1, "Salary is required"),
  bonus: z.string().min(1, "Bonus is required"),
  investment: z.string().min(1, "Investment amount is required"),
  savings: z.string().min(1, "Savings amount is required"),
});

type CurrencyFormData = z.infer<typeof currencyFormSchema>;

async function fetchCurrencyData() {
  await sleep(1500);
  const result = {
    salary: Math.floor(Math.random() * 100000 + 50000).toString(),
    bonus: Math.floor(Math.random() * 20000 + 5000).toString(),
    investment: Math.floor(Math.random() * 50000 + 10000).toString(),
    savings: Math.floor(Math.random() * 30000 + 5000).toString(),
  };
  return result;
}

function CurrencyAsyncUseStateExample() {
  const t = useTranslations("inputs.currencyExamples");

  const {
    data,
    isFetching: loading,
    refetch,
  } = useQuery({
    queryFn: fetchCurrencyData,
    queryKey: ["CurrencyAsyncUseStateExample"],
  });

  const [form, setForm] = useState({
    salary: "",
    bonus: "",
    investment: "",
    savings: "",
  });

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  function handleRefresh() {
    setForm({
      salary: "",
      bonus: "",
      investment: "",
      savings: "",
    });
  }

  function handleChange(field: string, value: string) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("useState.title")}</CardTitle>
        <CardDescription>{t("useState.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="salary-state">{t("fields.salary.label")}</Label>
          <CurrencyInput
            id="salary-state"
            placeholder={
              loading
                ? t("fields.salary.loading")
                : t("fields.salary.placeholder")
            }
            currency="USD"
            value={form.salary}
            onChange={(e) => handleChange("salary", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {t("cleanValue")}: {form.salary}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bonus-state">{t("fields.bonus.label")}</Label>
          <CurrencyInput
            id="bonus-state"
            placeholder={
              loading
                ? t("fields.bonus.loading")
                : t("fields.bonus.placeholder")
            }
            currency="USD"
            value={form.bonus}
            onChange={(e) => handleChange("bonus", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {t("cleanValue")}: {form.bonus}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="investment-state">
            {t("fields.investment.label")}
          </Label>
          <CurrencyInput
            id="investment-state"
            placeholder={
              loading
                ? t("fields.investment.loading")
                : t("fields.investment.placeholder")
            }
            currency="USD"
            value={form.investment}
            onChange={(e) => handleChange("investment", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {t("cleanValue")}: {form.investment}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="savings-state">{t("fields.savings.label")}</Label>
          <CurrencyInput
            id="savings-state"
            placeholder={
              loading
                ? t("fields.savings.loading")
                : t("fields.savings.placeholder")
            }
            currency="USD"
            value={form.savings}
            onChange={(e) => handleChange("savings", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {t("cleanValue")}: {form.savings}
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">{t("summary.title")}:</h4>
          <p>
            {t("fields.salary.label")}:{" "}
            {loading
              ? t("loading")
              : form.salary
              ? currency(form.salary, { fromCents: true }).format()
              : t("notInformed")}
          </p>
          <p>
            {t("fields.bonus.label")}:{" "}
            {loading
              ? t("loading")
              : form.bonus
              ? currency(form.bonus, { fromCents: true }).format()
              : t("notInformed")}
          </p>
          <p>
            {t("fields.investment.label")}:{" "}
            {loading
              ? t("loading")
              : form.investment
              ? currency(form.investment, { fromCents: true }).format()
              : t("notInformed")}
          </p>
          <p>
            {t("fields.savings.label")}:{" "}
            {loading
              ? t("loading")
              : form.savings
              ? currency(form.savings, { fromCents: true }).format()
              : t("notInformed")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="flex-1 bg-transparent"
            disabled={loading}
          >
            {t("buttons.load")}
          </Button>
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="flex-1 bg-transparent"
          >
            {t("buttons.reset")}
          </Button>
          <Button type="submit" className="flex-1">
            {t("buttons.submit")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CurrencyAsyncFormExample() {
  const t = useTranslations("inputs.currencyExamples");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CurrencyFormData>({
    resolver: zodResolver(currencyFormSchema),
    defaultValues: {
      salary: "",
      bonus: "",
      investment: "",
      savings: "",
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const refetch = async () => {
    setLoading(true);
    try {
      const result = await fetchCurrencyData();
      setData(result);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: CurrencyFormData) => {
    toast(`${t("buttons.submit")}: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("reactHookForm.title")}</CardTitle>
        <CardDescription>{t("reactHookForm.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salary-async-form">
              {t("fields.salary.label")} *
            </Label>
            <Controller
              name="salary"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="salary-async-form"
                  placeholder={
                    loading
                      ? t("fields.salary.loading")
                      : t("fields.salary.placeholder")
                  }
                  disabled={loading}
                  currency="USD"
                  value={field.value}
                  onChange={(e) => !loading && field.onChange(e.target.value)}
                />
              )}
            />
            {errors.salary && (
              <p className="text-sm text-destructive">
                {errors.salary.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bonus-async-form">
              {t("fields.bonus.label")} *
            </Label>
            <Controller
              name="bonus"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="bonus-async-form"
                  placeholder={
                    loading
                      ? t("fields.bonus.loading")
                      : t("fields.bonus.placeholder")
                  }
                  disabled={loading}
                  currency="USD"
                  value={field.value}
                  onChange={(e) => !loading && field.onChange(e.target.value)}
                />
              )}
            />
            {errors.bonus && (
              <p className="text-sm text-destructive">{errors.bonus.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="investment-async-form">
              {t("fields.investment.label")} *
            </Label>
            <Controller
              name="investment"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="investment-async-form"
                  placeholder={
                    loading
                      ? t("fields.investment.loading")
                      : t("fields.investment.placeholder")
                  }
                  disabled={loading}
                  currency="USD"
                  value={field.value}
                  onChange={(e) => !loading && field.onChange(e.target.value)}
                />
              )}
            />
            {errors.investment && (
              <p className="text-sm text-destructive">
                {errors.investment.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="savings-async-form">
              {t("fields.savings.label")} *
            </Label>
            <Controller
              name="savings"
              control={control}
              render={({ field }) => (
                <CurrencyInput
                  id="savings-async-form"
                  placeholder={
                    loading
                      ? t("fields.savings.loading")
                      : t("fields.savings.placeholder")
                  }
                  disabled={loading}
                  currency="USD"
                  value={field.value}
                  onChange={(e) => !loading && field.onChange(e.target.value)}
                />
              )}
            />
            {errors.savings && (
              <p className="text-sm text-destructive">
                {errors.savings.message}
              </p>
            )}
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">{t("currentValues")}:</h4>
            <p>
              {t("fields.salary.label")}:{" "}
              {loading
                ? t("loading")
                : watchedValues.salary
                ? currency(watchedValues.salary, { fromCents: true }).format()
                : t("notInformed")}
            </p>
            <p>
              {t("fields.bonus.label")}:{" "}
              {loading
                ? t("loading")
                : watchedValues.bonus
                ? currency(watchedValues.bonus, { fromCents: true }).format()
                : t("notInformed")}
            </p>
            <p>
              {t("fields.investment.label")}:{" "}
              {loading
                ? t("loading")
                : watchedValues.investment
                ? currency(watchedValues.investment, {
                    fromCents: true,
                  }).format()
                : t("notInformed")}
            </p>
            <p>
              {t("fields.savings.label")}:{" "}
              {loading
                ? t("loading")
                : watchedValues.savings
                ? currency(watchedValues.savings, { fromCents: true }).format()
                : t("notInformed")}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={refetch}
              variant="outline"
              className="flex-1 bg-transparent"
              disabled={loading}
            >
              {t("buttons.load")}
            </Button>
            <Button
              type="button"
              onClick={() =>
                reset({ salary: "", bonus: "", investment: "", savings: "" })
              }
              variant="outline"
              className="flex-1"
            >
              {t("buttons.reset")}
            </Button>
            <Button type="submit" className="flex-1">
              {t("buttons.submit")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export function CurrencyExamples() {
  const t = useTranslations("inputs.currencyExamples");

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("pageTitle")}</h1>
        <p className="text-muted-foreground">{t("pageDescription")}</p>
      </div>

      <Tabs defaultValue="useState" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="useState">{t("tabs.useState")}</TabsTrigger>
          <TabsTrigger value="reactHookForm">
            {t("tabs.reactHookForm")}
          </TabsTrigger>
          <TabsTrigger value="code">{t("tabs.code")}</TabsTrigger>
        </TabsList>

        <TabsContent value="useState" className="mt-6">
          <CurrencyAsyncUseStateExample />
        </TabsContent>

        <TabsContent value="reactHookForm" className="mt-6">
          <CurrencyAsyncFormExample />
        </TabsContent>

        <TabsContent value="code" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {t("codeExamples.currencyInputComponent")}
                </CardTitle>
                <CardDescription>
                  {t("codeExamples.currencyInputDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeViewer code={currencyInputComponentCode} language="tsx" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("codeExamples.useStateExample")}</CardTitle>
                <CardDescription>
                  {t("codeExamples.useStateDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeViewer code={useStateExampleCode} language="tsx" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("codeExamples.reactHookFormExample")}</CardTitle>
                <CardDescription>
                  {t("codeExamples.reactHookFormDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeViewer code={reactHookFormExampleCode} language="tsx" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
