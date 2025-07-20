import type React from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "@/src/styles/globals.css";
import { ThemeProvider } from "@/src/contexts/theme-provider";
import { AppSidebar } from "@/src/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/src/components/ui/sidebar";
import { Header } from "@/src/components/header";
import { Providers } from "@/src/contexts/providers";
import { DialogService } from "@/src/components/extensions/dialog-service";
import { Toaster } from "sonner";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { routing } from "@/src/i18n/routing";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
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
              <DialogService />
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
