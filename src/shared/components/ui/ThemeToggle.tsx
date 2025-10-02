'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import { useTheme } from '@/shared/contexts/ThemeContext'
import { cn } from '@/shared/utils/shadcn'

interface ThemeToggleProps {
    variant?: 'button' | 'dropdown'
    className?: string
    showLabel?: boolean
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
    variant = 'button',
    className = '',
    showLabel = false
}) => {
    const { theme, actualTheme, setTheme, toggleTheme } = useTheme()
    const [isOpen, setIsOpen] = React.useState(false)

    const themes = [
        {
            value: 'light' as const,
            label: 'Sáng',
            icon: SunIcon,
            description: 'Giao diện sáng'
        },
        {
            value: 'dark' as const,
            label: 'Tối',
            icon: MoonIcon,
            description: 'Giao diện tối'
        },
        {
            value: 'system' as const,
            label: 'Hệ thống',
            icon: ComputerDesktopIcon,
            description: 'Theo hệ thống'
        }
    ]

    const currentThemeData = themes.find(t => t.value === theme) || themes[0]
    const CurrentIcon = currentThemeData.icon

    if (variant === 'button') {
        return (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleTheme}
                className={cn(
                    'relative p-2 rounded-full transition-all duration-300',
                    'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700',
                    'border border-slate-200 dark:border-slate-700',
                    'shadow-sm hover:shadow-md',
                    className
                )}
                title={`Chuyển sang ${actualTheme === 'light' ? 'giao diện tối' : 'giao diện sáng'}`}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={actualTheme}
                        initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center"
                    >
                        {actualTheme === 'light' ? (
                            <SunIcon className="h-5 w-5 text-amber-500" />
                        ) : (
                            <MoonIcon className="h-5 w-5 text-blue-400" />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Subtle glow effect */}
                <div className={cn(
                    'absolute inset-0 rounded-full opacity-0 transition-opacity duration-300',
                    actualTheme === 'light'
                        ? 'bg-amber-400/20 group-hover:opacity-100'
                        : 'bg-blue-400/20 group-hover:opacity-100'
                )} />
            </motion.button>
        )
    }

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200',
                    'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700',
                    'border border-slate-200 dark:border-slate-700',
                    'text-slate-700 dark:text-slate-300',
                    className
                )}
            >
                <CurrentIcon className="h-4 w-4" />
                {showLabel && <span className="text-sm font-medium">{currentThemeData.label}</span>}
                <motion.svg
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    className="w-3 h-3 text-slate-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </motion.svg>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 mt-2 w-48 z-20 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            <div className="py-1">
                                {themes.map((themeOption) => {
                                    const Icon = themeOption.icon
                                    const isSelected = theme === themeOption.value

                                    return (
                                        <motion.button
                                            key={themeOption.value}
                                            whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                                            onClick={() => {
                                                setTheme(themeOption.value)
                                                setIsOpen(false)
                                            }}
                                            className={cn(
                                                'w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-150',
                                                'hover:bg-slate-50 dark:hover:bg-slate-700',
                                                isSelected && 'bg-slate-100 dark:bg-slate-700'
                                            )}
                                        >
                                            <Icon className={cn(
                                                'h-4 w-4',
                                                isSelected
                                                    ? 'text-blue-500 dark:text-blue-400'
                                                    : 'text-slate-400 dark:text-slate-500'
                                            )} />
                                            <div className="flex-1">
                                                <div className={cn(
                                                    'text-sm font-medium',
                                                    isSelected
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : 'text-slate-700 dark:text-slate-300'
                                                )}>
                                                    {themeOption.label}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">
                                                    {themeOption.description}
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full"
                                                />
                                            )}
                                        </motion.button>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
