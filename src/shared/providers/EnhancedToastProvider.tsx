'use client'

import React, { createContext, useContext, useMemo, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastItem {
    id: string
    type: ToastType
    title?: string
    message: string
    duration?: number
    action?: {
        label: string
        onClick: () => void
    }
}

interface ToastContextValue {
    show: (toast: Omit<ToastItem, 'id'>) => void
    success: (message: string, title?: string, action?: ToastItem['action']) => void
    error: (message: string, title?: string, action?: ToastItem['action']) => void
    info: (message: string, title?: string, action?: ToastItem['action']) => void
    warning: (message: string, title?: string, action?: ToastItem['action']) => void
    dismiss: (id: string) => void
    dismissAll: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toastIcons = {
    success: CheckCircleIcon,
    error: XCircleIcon,
    warning: ExclamationTriangleIcon,
    info: InformationCircleIcon,
}

const toastStyles = {
    success: {
        container: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-400/20',
        icon: 'text-emerald-100',
        glow: 'shadow-emerald-500/25'
    },
    error: {
        container: 'bg-gradient-to-r from-red-500 to-rose-500 text-white border-red-400/20',
        icon: 'text-red-100',
        glow: 'shadow-red-500/25'
    },
    warning: {
        container: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400/20',
        icon: 'text-amber-100',
        glow: 'shadow-amber-500/25'
    },
    info: {
        container: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-blue-400/20',
        icon: 'text-blue-100',
        glow: 'shadow-blue-500/25'
    },
}

const ToastComponent: React.FC<{ toast: ToastItem; onDismiss: (id: string) => void }> = ({ toast, onDismiss }) => {
    const Icon = toastIcons[toast.type]
    const styles = toastStyles[toast.type]

    return (
        <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95, rotateX: -15 }}
            animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotateX: 0,
                transition: {
                    type: 'spring',
                    damping: 20,
                    stiffness: 300,
                    duration: 0.6
                }
            }}
            exit={{
                opacity: 0,
                y: -20,
                scale: 0.95,
                transition: {
                    duration: 0.3,
                    ease: 'easeInOut'
                }
            }}
            whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 }
            }}
            className={`
                relative overflow-hidden rounded-2xl border backdrop-blur-sm
                shadow-xl ${styles.glow} ${styles.container}
                max-w-sm w-full mx-auto
            `}
            style={{
                backdropFilter: 'blur(20px)',
                boxShadow: `0 25px 50px -12px ${toast.type === 'success' ? 'rgba(16, 185, 129, 0.25)' :
                    toast.type === 'error' ? 'rgba(239, 68, 68, 0.25)' :
                        toast.type === 'warning' ? 'rgba(245, 158, 11, 0.25)' :
                            'rgba(59, 130, 246, 0.25)'}`
            }}
        >
            {/* Animated background gradient */}
            <div className="absolute inset-0">
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                    animate={{
                        x: ['-100%', '100%'],
                    }}
                    transition={{
                        duration: 2,
                        ease: 'linear',
                        repeat: Infinity,
                        repeatType: 'loop',
                    }}
                />
            </div>

            {/* Content */}
            <div className="relative flex items-start gap-4 p-6">
                {/* Icon with animation */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                        scale: 1,
                        rotate: 0,
                        transition: {
                            delay: 0.2,
                            type: 'spring',
                            damping: 15,
                            stiffness: 300
                        }
                    }}
                    className={`flex-shrink-0 p-2 rounded-full bg-white/20 ${styles.icon}`}
                >
                    <Icon className="h-6 w-6" />
                </motion.div>

                {/* Text content */}
                <div className="flex-1 min-w-0 pt-1">
                    {toast.title && (
                        <motion.h4
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                transition: { delay: 0.3, duration: 0.3 }
                            }}
                            className="text-sm font-semibold text-white mb-1"
                        >
                            {toast.title}
                        </motion.h4>
                    )}
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: toast.title ? 0.4 : 0.3, duration: 0.3 }
                        }}
                        className="text-sm text-white/90 leading-relaxed"
                    >
                        {toast.message}
                    </motion.p>

                    {/* Action button */}
                    {toast.action && (
                        <motion.button
                            initial={{ opacity: 0, y: 10 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: 0.5, duration: 0.3 }
                            }}
                            onClick={toast.action.onClick}
                            className="mt-3 text-xs font-medium text-white/90 hover:text-white 
                                     bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg
                                     transition-all duration-200 transform hover:scale-105"
                        >
                            {toast.action.label}
                        </motion.button>
                    )}
                </div>

                {/* Close button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        transition: { delay: 0.4, duration: 0.2 }
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDismiss(toast.id)}
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white/20 
                             transition-colors duration-200 group"
                >
                    <XMarkIcon className="h-4 w-4 text-white/70 group-hover:text-white transition-colors" />
                </motion.button>
            </div>

            {/* Progress bar for auto-dismiss */}
            {toast.duration && toast.duration > 0 && (
                <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-white/30"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{
                        duration: toast.duration / 1000,
                        ease: 'linear'
                    }}
                />
            )}
        </motion.div>
    )
}

export function EnhancedToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([])

    const dismiss = useCallback((id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const dismissAll = useCallback(() => {
        setToasts([])
    }, [])

    const show = useCallback((toast: Omit<ToastItem, 'id'>) => {
        const id = Math.random().toString(36).slice(2, 11)
        const newToast = { ...toast, id }

        setToasts(prev => {
            // Remove oldest toast if we have too many
            const updated = prev.length >= 5 ? prev.slice(1) : prev
            return [...updated, newToast]
        })

        // Auto-dismiss if duration is specified
        if (toast.duration !== 0) {
            const duration = toast.duration || 5000
            setTimeout(() => dismiss(id), duration)
        }
    }, [dismiss])

    const api: ToastContextValue = useMemo(() => ({
        show,
        success: (message, title, action) => show({
            type: 'success',
            message,
            title,
            action,
            duration: 4000
        }),
        error: (message, title, action) => show({
            type: 'error',
            message,
            title,
            action,
            duration: 6000
        }),
        info: (message, title, action) => show({
            type: 'info',
            message,
            title,
            action,
            duration: 5000
        }),
        warning: (message, title, action) => show({
            type: 'warning',
            message,
            title,
            action,
            duration: 5000
        }),
        dismiss,
        dismissAll,
    }), [show, dismiss, dismissAll])

    return (
        <ToastContext.Provider value={api}>
            {children}

            {/* Toast container */}
            <div className="fixed top-6 right-6 z-[9999] space-y-4 max-w-sm w-full pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <div key={toast.id} className="pointer-events-auto">
                            <ToastComponent
                                toast={toast}
                                onDismiss={dismiss}
                            />
                        </div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}

export function useEnhancedToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useEnhancedToast must be used within EnhancedToastProvider')
    return ctx
}

export function useEnhancedToastOptional(): ToastContextValue {
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
        dismiss: noop,
        dismissAll: noop,
    }
}
