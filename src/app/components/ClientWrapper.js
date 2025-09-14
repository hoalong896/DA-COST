"use client";

import { ThemeProvider } from "next-themes";

export default function ClientWrapper({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {children}
    </ThemeProvider>
  );
}
