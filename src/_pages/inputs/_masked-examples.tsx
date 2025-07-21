"use client";

import { MaskedInput } from "@/src/components/extensions/masked-input";
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
import { MASKS } from "@/src/utils/mask";
import { sleep } from "@/src/utils/sleep";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import z from "zod";

import { CodeViewer } from "@/src/components/code-view";

const useStateExampleCode = `function MaskedAsyncUseStateExample() {
  const t = useTranslations("inputs.basicExamples")
  
  const { data, isFetching: loading, refetch } = useQuery({
    queryFn: fetchData,
    queryKey: ["MaskedAsyncUseStateExample"],
  })

  const [form, setForm] = useState({
    cpf: "",
    phone: "",
    cep: "",
    birthDate: "",
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
          <Label htmlFor="cpf-state">{t("fields.cpf.label")}</Label>
          <MaskedInput
            id="cpf-state"
            placeholder={loading ? t("fields.cpf.loading") : t("fields.cpf.placeholder")}
            mask={MASKS.CPF}
            value={loading ? "" : form.cpf}
            onChange={(e) => handleChange("cpf", e.target.value)}
          />
        </div>
        {/* ... more fields */}
      </CardContent>
    </Card>
  )
}`;

const reactHookFormExampleCode = `function MaskedAsyncFormExample() {
  const t = useTranslations("inputs.basicExamples")
  
  const { data, isFetching: loading, refetch } = useQuery({
    queryFn: fetchData,
    queryKey: ["MaskedAsyncFormExample"],
  })

  const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<MaskedFormData>({
    resolver: zodResolver(maskedFormSchema),
    defaultValues: {
      cpf: "",
      phone: "",
      cep: "",
      birthDate: "",
    },
  })

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data, reset])

  const onSubmit = (data: MaskedFormData) => {
    toast(\`\${t("buttons.submit")}: \${JSON.stringify(data, null, 2)}\`)
  }

  return (
    <Card>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="cpf"
            control={control}
            render={({ field }) => (
              <MaskedInput
                placeholder={loading ? t("fields.cpf.loading") : t("fields.cpf.placeholder")}
                disabled={loading}
                mask={MASKS.CPF}
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

const maskedInputComponentCode = `interface MaskedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  mask: string
}

const MaskedInput = forwardRef<HTMLInputElement, MaskedInputProps>(
  ({ className, mask, value, onChange, ...props }, ref) => {
    const applyMask = (inputValue: string, maskPattern: string) => {
      if (!inputValue) return ""

      const cleanValue = inputValue.replace(/\\D/g, "")
      let maskedValue = ""
      let valueIndex = 0

      for (let i = 0; i < maskPattern.length && valueIndex < cleanValue.length; i++) {
        if (maskPattern[i] === "9") {
          maskedValue += cleanValue[valueIndex]
          valueIndex++
        } else {
          maskedValue += maskPattern[i]
        }
      }

      return maskedValue
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const maskedValue = applyMask(inputValue, mask)

      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: maskedValue },
      }

      onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>)
    }

    return (
      <Input
        className={cn(className)}
        ref={ref}
        value={value ? applyMask(String(value), mask) : ""}
        onChange={handleChange}
        {...props}
      />
    )
  },
)`;

const maskedFormSchema = z.object({
  cpf: z
    .string()
    .min(11, "CPF deve ter 11 dígitos")
    .max(11, "CPF deve ter 11 dígitos"),
  phone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  cep: z
    .string()
    .min(8, "CEP deve ter 8 dígitos")
    .max(8, "CEP deve ter 8 dígitos"),
  birthDate: z.string().min(8, "Data deve ter 8 dígitos"),
});

type MaskedFormData = z.infer<typeof maskedFormSchema>;

async function fetchData() {
  await sleep(1000);
  const result = {
    cpf: Math.floor(Math.random() * 100000000000)
      .toString()
      .padStart(11, "0"),
    phone:
      "11" +
      Math.floor(Math.random() * 1000000000)
        .toString()
        .padStart(9, "0"),
    cep: Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, "0"),
    birthDate: "01011990",
  };
  return result;
}

function MaskedAsyncUseStateExample() {
  const t = useTranslations("inputs.basicExamples");

  const {
    data,
    isFetching: loading,
    refetch,
  } = useQuery({
    queryFn: fetchData,
    queryKey: ["MaskedAsyncUseStateExample"],
  });

  const [form, setForm] = useState({
    cpf: "",
    phone: "",
    cep: "",
    birthDate: "",
  });

  useEffect(() => {
    if (data) {
      setForm(data);
    }
  }, [data]);

  function handleRefresh() {
    setForm({
      cpf: "",
      phone: "",
      cep: "",
      birthDate: "",
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
          <Label htmlFor="cpf-state">{t("fields.cpf.label")}</Label>
          <MaskedInput
            id="cpf-state"
            placeholder={
              loading ? t("fields.cpf.loading") : t("fields.cpf.placeholder")
            }
            mask={MASKS.CPF}
            value={loading ? "" : form.cpf}
            onChange={(e) => handleChange("cpf", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {t("cleanValue")}: {form?.cpf}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone-state">{t("fields.phone.label")}</Label>
          <MaskedInput
            id="phone-state"
            placeholder={
              loading
                ? t("fields.phone.loading")
                : t("fields.phone.placeholder")
            }
            mask={MASKS.PHONE}
            value={loading ? "" : form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {t("cleanValue")}: {form?.phone}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cep-state">{t("fields.cep.label")}</Label>
          <MaskedInput
            id="cep-state"
            placeholder={
              loading ? t("fields.cep.loading") : t("fields.cep.placeholder")
            }
            mask={MASKS.CEP}
            value={loading ? "" : form.cep}
            onChange={(e) => handleChange("cep", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {t("cleanValue")}: {form?.cep}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="birth-date-state">
            {t("fields.birthDate.label")}
          </Label>
          <MaskedInput
            id="birth-date-state"
            placeholder={
              loading
                ? t("fields.birthDate.loading")
                : t("fields.birthDate.placeholder")
            }
            mask={MASKS.DATE}
            value={loading ? "" : form.birthDate}
            onChange={(e) => handleChange("birthDate", e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            {t("cleanValue")}: {form?.birthDate}
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">{t("summary.title")}:</h4>
          <p>
            {t("fields.cpf.label")}:{" "}
            {loading ? t("loading") : form?.cpf || t("notInformed")}
          </p>
          <p>
            {t("fields.phone.label")}:{" "}
            {loading ? t("loading") : form?.phone || t("notInformed")}
          </p>
          <p>
            {t("fields.cep.label")}:{" "}
            {loading ? t("loading") : form?.cep || t("notInformed")}
          </p>
          <p>
            {t("fields.birthDate.label")}:{" "}
            {loading ? t("loading") : form?.birthDate || t("notInformed")}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="flex-1"
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

function MaskedAsyncFormExample() {
  const t = useTranslations("inputs.basicExamples");

  const {
    data,
    isFetching: loading,
    refetch,
  } = useQuery({
    queryFn: fetchData,
    queryKey: ["MaskedAsyncFormExample"],
  });

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MaskedFormData>({
    resolver: zodResolver(maskedFormSchema),
    defaultValues: {
      cpf: "",
      phone: "",
      cep: "",
      birthDate: "",
    },
  });

  const watchedValues = watch();

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data, reset]);

  const onSubmit = (data: MaskedFormData) => {
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
            <Label htmlFor="cpf-async-form">{t("fields.cpf.label")} *</Label>
            <Controller
              name="cpf"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  id="cpf-async-form"
                  placeholder={
                    loading
                      ? t("fields.cpf.loading")
                      : t("fields.cpf.placeholder")
                  }
                  disabled={loading}
                  mask={MASKS.CPF}
                  value={loading ? "" : field.value}
                  onChange={(e) => !loading && field.onChange(e.target.value)}
                />
              )}
            />
            {errors.cpf && (
              <p className="text-sm text-destructive">{errors.cpf.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone-async-form">
              {t("fields.phone.label")} *
            </Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  id="phone-async-form"
                  placeholder={
                    loading
                      ? t("fields.phone.loading")
                      : t("fields.phone.placeholder")
                  }
                  disabled={loading}
                  mask={MASKS.PHONE}
                  value={loading ? "" : field.value}
                  onChange={(e) => !loading && field.onChange(e.target.value)}
                />
              )}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cep-async-form">{t("fields.cep.label")} *</Label>
            <Controller
              name="cep"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  id="cep-async-form"
                  placeholder={
                    loading
                      ? t("fields.cep.loading")
                      : t("fields.cep.placeholder")
                  }
                  disabled={loading}
                  mask={MASKS.CEP}
                  value={loading ? "" : field.value}
                  onChange={(e) => !loading && field.onChange(e.target.value)}
                />
              )}
            />
            {errors.cep && (
              <p className="text-sm text-destructive">{errors.cep.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="birth-date-async-form">
              {t("fields.birthDate.label")} *
            </Label>
            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <MaskedInput
                  id="birth-date-async-form"
                  placeholder={
                    loading
                      ? t("fields.birthDate.loading")
                      : t("fields.birthDate.placeholder")
                  }
                  disabled={loading}
                  mask={MASKS.DATE}
                  value={loading ? "" : field.value}
                  onChange={(e) => !loading && field.onChange(e.target.value)}
                />
              )}
            />
            {errors.birthDate && (
              <p className="text-sm text-destructive">
                {errors.birthDate.message}
              </p>
            )}
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">{t("currentValues")}:</h4>
            <p>
              {t("fields.cpf.label")}:{" "}
              {loading ? t("loading") : watchedValues.cpf || t("notInformed")}
            </p>
            <p>
              {t("fields.phone.label")}:{" "}
              {loading ? t("loading") : watchedValues.phone || t("notInformed")}
            </p>
            <p>
              {t("fields.cep.label")}:{" "}
              {loading ? t("loading") : watchedValues.cep || t("notInformed")}
            </p>
            <p>
              {t("fields.birthDate.label")}:{" "}
              {loading
                ? t("loading")
                : watchedValues.birthDate || t("notInformed")}
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={() => refetch()}
              variant="outline"
              className="flex-1"
            >
              {t("buttons.load")}
            </Button>
            <Button
              type="button"
              onClick={() =>
                reset({ birthDate: "", cep: "", cpf: "", phone: "" })
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

export function MaskedExamples() {
  const t = useTranslations("inputs.basicExamples");

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
          <MaskedAsyncUseStateExample />
        </TabsContent>

        <TabsContent value="reactHookForm" className="mt-6">
          <MaskedAsyncFormExample />
        </TabsContent>

        <TabsContent value="code" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("codeExamples.maskedInputComponent")}</CardTitle>
                <CardDescription>
                  {t("codeExamples.maskedInputDescription")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CodeViewer code={maskedInputComponentCode} language="tsx" />
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
