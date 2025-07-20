"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CustomCombobox } from "@/src/components/extensions/custom-combobox";
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import React, { useEffect } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { searchUserById, searchUsers } from "@/src/utils/api-utils";
import { useQuery } from "@tanstack/react-query";

const formSchema = z.object({
  vehicleModel: z.string(),
});

type FormData = z.infer<typeof formSchema>;

export const comboboxWithFormCode = `export function ComboboxWithForm() {
  const t = useTranslations("combobox.examples.form");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleModel: "",
    },
  });

  const { data } = useQuery({
    queryKey: ["1"],
    queryFn: () => searchUserById("1"),
  });

  useEffect(() => {
    if (!data) return;

    form.reset({
      vehicleModel: data?.id,
    });
  }, [data]);

  const onSubmit = (data: FormData) => {
    toast.success("formData id:", {
      description: data.vehicleModel,
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="vehicleModel"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Selecione:</FormLabel>
                <FormControl>
                  <CustomCombobox
                    value={field.value}
                    className="max-w-[320px]"
                    asyncSearchFn={searchUsers}
                    onSelect={(s) => field.onChange(s)}
                    placeholder={t("userSearchPlaceholder")}
                    searchPlaceholder={t("userSearchPlaceholder")}
                    emptyMessage={t("userEmptyMessage")}
                    loadingMessage={t("userLoadingMessage")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit">{t("submit")}</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset(undefined)}
            >
              {t("reset")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
`;

export function ComboboxWithForm() {
  const t = useTranslations("combobox.examples.form");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      vehicleModel: "",
    },
  });

  const { data } = useQuery({
    queryKey: ["1"],
    queryFn: () => searchUserById("1"),
  });

  useEffect(() => {
    if (!data) return;

    form.reset({
      vehicleModel: data?.id,
    });
  }, [data]);

  const onSubmit = (data: FormData) => {
    toast.success("formData", {
      description: data.vehicleModel,
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="vehicleModel"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Selecione:</FormLabel>
                <FormControl>
                  <CustomCombobox
                    value={field.value}
                    className="max-w-[320px]"
                    asyncSearchFn={searchUsers}
                    onSelect={(s) => field.onChange(s)}
                    placeholder={t("userSearchPlaceholder")}
                    searchPlaceholder={t("userSearchPlaceholder")}
                    emptyMessage={t("userEmptyMessage")}
                    loadingMessage={t("userLoadingMessage")}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit">{t("submit")}</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset(undefined)}
            >
              {t("reset")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
