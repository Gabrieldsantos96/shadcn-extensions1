import { use } from "react";
import { setRequestLocale } from "next-intl/server";
import { Home } from "@/src/_pages/home";

export default function RootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = use(params);
  setRequestLocale(locale);

  return <Home />;
}
