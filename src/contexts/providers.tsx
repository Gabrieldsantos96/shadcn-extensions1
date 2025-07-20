"use client";

import { queryClient } from "@/src/lib/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import type React from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
