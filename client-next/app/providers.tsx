"use client"

import { Toaster } from "@/components/ui/toaster";
import type * as React from "react"
import { Attribute, ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"

interface ThemeProviderProps extends React.PropsWithChildren {
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  storageKey?: string
}

function Providers({ attribute, defaultTheme, enableSystem, storageKey, children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute={attribute as Attribute}
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      storageKey={storageKey}
    >
      {children}
      <Toaster />
    </NextThemesProvider>
  )
}

function useTheme() {
  // Use the actual hook from next-themes instead of the stub
  return useNextTheme()
}

export { Providers, useTheme }

