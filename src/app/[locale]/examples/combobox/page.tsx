import { ComboboxPage } from "@/src/_pages/_combobox";

export function Index() {
  return <ComboboxPage />;
}

export async function generateStaticParams() {
  const locales = ["pt", "en"];

  return locales.map((lang) => ({
    lang,
  }));
}
