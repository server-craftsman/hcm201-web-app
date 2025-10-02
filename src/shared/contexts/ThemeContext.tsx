'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    actualTheme: 'light' | 'dark'
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
    children,
    defaultTheme = 'system',
    storageKey = 'hcm201-theme'
}) => {
    const [theme, setThemeState] = useState<Theme>(defaultTheme)
    const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

    // Get system theme preference
    const getSystemTheme = (): 'light' | 'dark' => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return 'light'
    }

    // Calculate actual theme based on current theme setting
    const calculateActualTheme = (currentTheme: Theme): 'light' | 'dark' => {
        if (currentTheme === 'system') {
            return getSystemTheme()
        }
        return currentTheme
    }

    // Set theme and persist to localStorage
    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        if (typeof window !== 'undefined') {
            localStorage.setItem(storageKey, newTheme)
        }
    }

    // Toggle between light and dark (skip system)
    const toggleTheme = () => {
        const newTheme = actualTheme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
    }

    // Initialize theme from localStorage or system preference
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem(storageKey) as Theme
            if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
                setThemeState(savedTheme)
            }
        }
    }, [storageKey])

    // Update actual theme when theme changes or system preference changes
    useEffect(() => {
        const newActualTheme = calculateActualTheme(theme)
        setActualTheme(newActualTheme)

        // Apply theme to document
        if (typeof window !== 'undefined') {
            const root = window.document.documentElement
            root.classList.remove('light', 'dark')
            root.classList.add(newActualTheme)

            // Update meta theme-color for mobile browsers
            const metaThemeColor = document.querySelector('meta[name="theme-color"]')
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', newActualTheme === 'dark' ? '#1e293b' : '#ffffff')
            }
        }
    }, [theme])

    // Listen for system theme changes
    useEffect(() => {
        if (typeof window === 'undefined') return

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = () => {
            if (theme === 'system') {
                const newActualTheme = calculateActualTheme('system')
                setActualTheme(newActualTheme)

                // Apply theme to document
                const root = window.document.documentElement
                root.classList.remove('light', 'dark')
                root.classList.add(newActualTheme)
            }
        }

        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme])

    const value: ThemeContextType = {
        theme,
        actualTheme,
        setTheme,
        toggleTheme
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
