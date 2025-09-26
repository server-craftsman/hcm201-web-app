'use client'

import React, { createContext, useContext, useMemo, useState } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
    id: string
    type: ToastType
    message: string
}

interface ToastContextValue {
    show: (message: string, type?: ToastType) => void
    success: (message: string) => void
    error: (message: string) => void
    info: (message: string) => void
    warning: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const api: ToastContextValue = useMemo(() => ({
        show(message, type = 'info') {
            const id = Math.random().toString(36).slice(2)
            setToasts(prev => [...prev, { id, type, message }])
            setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
        },
        success(message) { this.show(message, 'success') },
        error(message) { this.show(message, 'error') },
        info(message) { this.show(message, 'info') },
        warning(message) { this.show(message, 'warning') },
    }), [])

    return (
        <ToastContext.Provider value={api}>
            {children}
            <div className="fixed top-6 right-6 z-[9999] space-y-3 max-w-md">
                {toasts.map(t => (
                    <div
                        key={t.id}
                        className={`
                            flex items-center gap-4 px-6 py-4 rounded-xl shadow-lg
                            transform transition-all duration-300 ease-out
                            animate-in slide-in-from-right-5 fade-in-0
                            ${t.type === 'success'
                                ? 'bg-green-500 text-white'
                                : t.type === 'error'
                                    ? 'bg-red-500 text-white'
                                    : t.type === 'warning'
                                        ? 'bg-orange-500 text-white'
                                        : 'bg-blue-500 text-white'
                            }
                        `}
                    >
                        {/* Icon */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            {t.type === 'success' && (
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                            {t.type === 'error' && (
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            )}
                            {t.type === 'warning' && (
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                            {t.type === 'info' && (
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                            )}
                        </div>

                        {/* Message */}
                        <div className="flex-1 min-w-0">
                            <p className="text-white font-medium text-sm leading-5">
                                {t.message}
                            </p>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={() => setToasts(prev => prev.filter(toast => toast.id !== t.id))}
                            className="flex-shrink-0 p-1 rounded-md hover:bg-white/20 transition-colors"
                        >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}

export function useToastOptional(): ToastContextValue {
    const ctx = useContext(ToastContext)
    if (ctx) return ctx
    // Fallback no-op API to avoid crashes when provider isn't mounted yet
    const noop = () => { }
    return {
        show: noop,
        success: noop,
        error: noop,
        info: noop,
        warning: noop,
    }
}