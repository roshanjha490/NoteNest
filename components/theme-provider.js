"use client"

import React from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeProviderProps } from "next-themes/dist/types"

const ThemeProvider = ({ children, ...props }) => {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export default ThemeProvider