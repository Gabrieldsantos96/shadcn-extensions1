import { DialogsPage } from "@/src/_pages/_dialogs";

export function Index() {
  return <DialogsPage />;
}

export async function generateStaticParams() {
  const locales = ["pt", "en"];

  return locales.map((lang) => ({
    lang,
  }));
}
