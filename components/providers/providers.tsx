"use client";

import { ThemeProvider } from "./theme-providers";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
