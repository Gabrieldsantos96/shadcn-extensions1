import { MaskedExamples } from "@/src/_pages/inputs/_masked-examples";
import { CurrencyExamples } from "@/src/_pages/inputs/_currency-examples";

export default function Index() {
  return (
    <>
      <MaskedExamples />
      <CurrencyExamples />;
    </>
  );
}

export async function generateStaticParams() {
  const locales = ["pt", "en"];

  return locales.map((lang) => ({
    lang,
  }));
}
