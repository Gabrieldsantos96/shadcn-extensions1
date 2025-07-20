"use client";

import { SidebarTrigger } from "@/src/components/ui/sidebar";
import { Separator } from "@/src/components/ui/separator";
import { Button } from "@/src/components/ui/button";
import { Moon, Sun, Coffee } from "lucide-react";
import { useTheme } from "next-themes";
import { Locale, useTranslations } from "next-intl";
import LanguageSwitcher from "./language-switcher";

export function Header() {
  const tHeader = useTranslations("header");
  const { setTheme, theme } = useTheme();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex-1" />

      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950/20"
      >
        <a
          href="https://www.buymeacoffee.com/shadcnextensions"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1"
        >
          <Coffee className="h-4 w-4" />
          <span className="hidden sm:inline">{tHeader("coffee")}</span>
        </a>
      </Button>

      <LanguageSwitcher />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">{tHeader("toggleTheme")}</span>
      </Button>
    </header>
  );
}
