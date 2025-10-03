'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * Theme type
 *  - light: always light mode
 *  - dark: always dark mode
 *  - system: follow OS preference (prefers-color-scheme)
 */
export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
    /** current theme preference (light | dark | system) */
    theme: Theme
    /** concrete theme applied after resolving system preference */
    actualTheme: 'light' | 'dark'
    /** set the theme */
    setTheme: (theme: Theme) => void
    /** toggle between light and dark theme */
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export const useTheme = (): ThemeContextValue => {
    const ctx = useContext(ThemeContext)
    if (!ctx) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return ctx
}

interface ThemeProviderProps {
    children: React.ReactNode
    /** initial theme value when nothing stored */
    defaultTheme?: Theme
    /** localStorage key */
    storageKey?: string
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = 'light',
    storageKey = 'hcm201-theme'
}) => {
    // stored user preference (light | dark | system)
    const [theme, setThemeState] = useState<Theme>(defaultTheme)
    // resolved theme that is actually applied
    const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

    // get OS preference
    const getSystemTheme = (): 'light' | 'dark' => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return 'light'
    }

    // resolve actual theme from preference
    const calculateActualTheme = (_pref: Theme): 'light' | 'dark' => 'light'

    /**
     * Persist preference to localStorage and update state
     */
    const setTheme = (_newTheme: Theme) => {
        // Ignore any attempts to change theme – always stay in light mode
        setThemeState('light')
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, 'light')
        }
    }

    /** Toggle between light and dark (system becomes light) */
    const toggleTheme = () => {
        const newTheme: Theme = actualTheme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
    }

    /**
     * On mount: load saved preference from localStorage (if exists)
     */
    // Remove effect that loads saved preference
    // useEffect(() => {
    //     if (typeof window !== 'undefined') {
    //         const stored = localStorage.getItem(storageKey) as Theme | null
    //         if (stored === 'light' || stored === 'dark' || stored === 'system') {
    //             setThemeState(stored)
    //         }
    //     }
    // }, [storageKey])

    /**
     * Whenever `theme` changes OR OS preference changes (when theme === system)
     * update actualTheme and apply to <html> element
     */
    useEffect(() => {
        setActualTheme('light')

        if (typeof window !== 'undefined') {
            const root = window.document.documentElement
            root.classList.remove('light', 'dark')
            root.classList.add('light')

            const meta = document.querySelector('meta[name="theme-color"]')
            if (meta) {
                meta.setAttribute('content', '#ffffff')
            }
        }
    }, [theme])



    const value: ThemeContextValue = {
        theme,
        actualTheme,
        setTheme,
        toggleTheme
    }

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// On mount: enforce defaultTheme and persist to localStorage
// useEffect(() => {
//     if (typeof window !== 'undefined') {
//       setThemeState(defaultTheme)
//       localStorage.setItem(storageKey, defaultTheme)
//     }
//   }, [defaultTheme, storageKey])

// Remove previous localStorage read effect (if any)
