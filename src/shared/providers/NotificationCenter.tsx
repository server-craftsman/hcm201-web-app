'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    InformationCircleIcon,
    XMarkIcon,
    ArrowRightIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon
} from '@heroicons/react/24/outline'

type NotificationType = 'success' | 'error' | 'warning' | 'info'
type NotificationVariant = 'modal' | 'banner' | 'inline' | 'corner'

interface NotificationAction {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'danger'
}

interface BaseNotification {
    id: string
    type: NotificationType
    variant: NotificationVariant
    title: string
    message: string
    duration?: number
    actions?: NotificationAction[]
    dismissible?: boolean
    sound?: boolean
    haptic?: boolean
    position?: 'top' | 'center' | 'bottom'
}

interface NotificationContextValue {
    notifications: BaseNotification[]
    show: (notification: Omit<BaseNotification, 'id'>) => string
    dismiss: (id: string) => void
    dismissAll: () => void
    showModal: (config: Omit<BaseNotification, 'id' | 'variant'>) => string
    showBanner: (config: Omit<BaseNotification, 'id' | 'variant'>) => string
    showInline: (config: Omit<BaseNotification, 'id' | 'variant'>) => string
    showCorner: (config: Omit<BaseNotification, 'id' | 'variant'>) => string
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

const notificationStyles = {
    success: {
        gradient: 'from-emerald-500 via-green-500 to-teal-600',
        icon: CheckCircleIcon,
        color: 'emerald',
        sound: '/audios/success.mp3'
    },
    error: {
        gradient: 'from-red-500 via-rose-500 to-pink-600',
        icon: XCircleIcon,
        color: 'red',
        sound: '/audios/error.mp3'
    },
    warning: {
        gradient: 'from-amber-500 via-orange-500 to-yellow-600',
        icon: ExclamationTriangleIcon,
        color: 'amber',
        sound: '/audios/warning.mp3'
    },
    info: {
        gradient: 'from-blue-500 via-indigo-500 to-purple-600',
        icon: InformationCircleIcon,
        color: 'blue',
        sound: '/audios/info.mp3'
    }
}

// Modal Notification Component
const ModalNotification: React.FC<{
    notification: BaseNotification
    onDismiss: () => void
}> = ({ notification, onDismiss }) => {
    const { gradient, icon: Icon } = notificationStyles[notification.type]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-md flex items-center justify-center p-4"
            onClick={onDismiss}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    transition: { type: 'spring', damping: 25, stiffness: 300 }
                }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`
          relative w-full max-w-md bg-gradient-to-br ${gradient}
          rounded-3xl p-8 text-white shadow-2xl overflow-hidden
        `}
            >
                {/* Animated background */}
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                </div>

                {/* Header */}
                <div className="relative z-10 flex items-start justify-between mb-6">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center"
                    >
                        <Icon className="w-6 h-6" />
                    </motion.div>

                    {notification.dismissible && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            onClick={onDismiss}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </motion.button>
                    )}
                </div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="relative z-10 mb-8"
                >
                    <h3 className="text-xl font-bold mb-3">{notification.title}</h3>
                    <p className="text-white/90 leading-relaxed">{notification.message}</p>
                </motion.div>

                {/* Actions */}
                {notification.actions && notification.actions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative z-10 flex gap-3"
                    >
                        {notification.actions.map((action, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={action.onClick}
                                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl font-medium
                  transition-all duration-200 ${action.variant === 'primary'
                                        ? 'bg-white text-gray-900 hover:bg-white/90'
                                        : action.variant === 'danger'
                                            ? 'bg-red-500/20 border border-red-300/20 hover:bg-red-500/30'
                                            : 'bg-white/20 border border-white/20 hover:bg-white/30'
                                    }
                `}
                            >
                                <span>{action.label}</span>
                                <ArrowRightIcon className="w-4 h-4" />
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    )
}

// Banner Notification Component
const BannerNotification: React.FC<{
    notification: BaseNotification
    onDismiss: () => void
}> = ({ notification, onDismiss }) => {
    const { icon: Icon, color } = notificationStyles[notification.type]

    return (
        <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className={`
        fixed top-0 left-0 right-0 z-[9998] 
        bg-gradient-to-r ${notificationStyles[notification.type].gradient}
        text-white shadow-lg
      `}
        >
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Icon className="w-6 h-6 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold">{notification.title}</h4>
                            <p className="text-sm text-white/90">{notification.message}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {notification.actions?.map((action, index) => (
                            <button
                                key={index}
                                onClick={action.onClick}
                                className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                            >
                                {action.label}
                            </button>
                        ))}

                        {notification.dismissible && (
                            <button
                                onClick={onDismiss}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

// Corner Notification Component (floating corner cards)
const CornerNotification: React.FC<{
    notification: BaseNotification
    onDismiss: () => void
}> = ({ notification, onDismiss }) => {
    const { gradient, icon: Icon } = notificationStyles[notification.type]

    return (
        <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className={`
        bg-white rounded-2xl shadow-xl border border-gray-200
        p-6 max-w-sm relative overflow-hidden
      `}
        >
            {/* Colored accent */}
            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />

            <div className="flex items-start gap-4">
                <div className={`
          w-10 h-10 bg-gradient-to-br ${gradient} 
          rounded-full flex items-center justify-center flex-shrink-0
        `}>
                    <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 mb-1">{notification.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>

                    {notification.actions && notification.actions.length > 0 && (
                        <div className="flex gap-2 mt-3">
                            {notification.actions.map((action, index) => (
                                <button
                                    key={index}
                                    onClick={action.onClick}
                                    className={`
                    text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${action.variant === 'primary'
                                            ? `bg-gradient-to-r ${gradient} text-white hover:opacity-90`
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }
                  `}
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {notification.dismissible && (
                    <button
                        onClick={onDismiss}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        <XMarkIcon className="w-4 h-4 text-gray-400" />
                    </button>
                )}
            </div>
        </motion.div>
    )
}

// Sound Manager
const playNotificationSound = (type: NotificationType, enabled: boolean) => {
    if (!enabled) return

    try {
        const audio = new Audio(notificationStyles[type].sound)
        audio.volume = 0.3
        audio.play().catch(() => { }) // Ignore errors if sound can't play
    } catch (error) {
        // Ignore sound errors
    }
}

// Haptic Feedback
const triggerHapticFeedback = (type: NotificationType, enabled: boolean) => {
    if (!enabled || typeof navigator === 'undefined' || !navigator.vibrate) return

    const patterns = {
        success: [100, 50, 100],
        error: [200, 100, 200, 100, 200],
        warning: [150, 75, 150],
        info: [100]
    }

    navigator.vibrate(patterns[type])
}

export function NotificationCenter({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<BaseNotification[]>([])
    const [soundEnabled, setSoundEnabled] = useState(true)

    const dismiss = useCallback((id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id))
    }, [])

    const dismissAll = useCallback(() => {
        setNotifications([])
    }, [])

    const show = useCallback((notification: Omit<BaseNotification, 'id'>) => {
        const id = `notification-${Date.now()}-${Math.random().toString(36).slice(2)}`
        const newNotification = {
            ...notification,
            id,
            dismissible: notification.dismissible ?? true,
            sound: notification.sound ?? true,
            haptic: notification.haptic ?? true
        }

        setNotifications(prev => [...prev, newNotification])

        // Play sound and haptic feedback
        if (newNotification.sound) {
            playNotificationSound(newNotification.type, soundEnabled)
        }
        if (newNotification.haptic) {
            triggerHapticFeedback(newNotification.type, true)
        }

        // Auto-dismiss if duration is set
        if (newNotification.duration && newNotification.duration > 0) {
            setTimeout(() => dismiss(id), newNotification.duration)
        }

        return id
    }, [dismiss, soundEnabled])

    // Helper methods for specific variants
    const showModal = useCallback((config: Omit<BaseNotification, 'id' | 'variant'>) => {
        return show({ ...config, variant: 'modal' })
    }, [show])

    const showBanner = useCallback((config: Omit<BaseNotification, 'id' | 'variant'>) => {
        return show({ ...config, variant: 'banner' })
    }, [show])

    const showInline = useCallback((config: Omit<BaseNotification, 'id' | 'variant'>) => {
        return show({ ...config, variant: 'inline' })
    }, [show])

    const showCorner = useCallback((config: Omit<BaseNotification, 'id' | 'variant'>) => {
        return show({ ...config, variant: 'corner', duration: config.duration || 5000 })
    }, [show])

    const contextValue: NotificationContextValue = {
        notifications,
        show,
        dismiss,
        dismissAll,
        showModal,
        showBanner,
        showInline,
        showCorner
    }

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}

            {/* Render Modal Notifications */}
            <AnimatePresence>
                {notifications
                    .filter(n => n.variant === 'modal')
                    .map(notification => (
                        <ModalNotification
                            key={notification.id}
                            notification={notification}
                            onDismiss={() => dismiss(notification.id)}
                        />
                    ))}
            </AnimatePresence>

            {/* Render Banner Notifications */}
            <AnimatePresence>
                {notifications
                    .filter(n => n.variant === 'banner')
                    .map(notification => (
                        <BannerNotification
                            key={notification.id}
                            notification={notification}
                            onDismiss={() => dismiss(notification.id)}
                        />
                    ))}
            </AnimatePresence>

            {/* Render Corner Notifications */}
            <div className="fixed top-6 right-6 z-[9997] space-y-4 max-w-sm pointer-events-none">
                <AnimatePresence>
                    {notifications
                        .filter(n => n.variant === 'corner')
                        .map(notification => (
                            <div key={notification.id} className="pointer-events-auto">
                                <CornerNotification
                                    notification={notification}
                                    onDismiss={() => dismiss(notification.id)}
                                />
                            </div>
                        ))}
                </AnimatePresence>
            </div>

            {/* Sound Toggle */}
            <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="fixed bottom-6 right-6 z-[9996] p-3 bg-white/90 backdrop-blur-sm 
                   rounded-full shadow-lg border border-white/20 hover:scale-105 
                   transition-transform"
                title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            >
                {soundEnabled ? (
                    <SpeakerWaveIcon className="w-5 h-5 text-gray-700" />
                ) : (
                    <SpeakerXMarkIcon className="w-5 h-5 text-gray-400" />
                )}
            </button>
        </NotificationContext.Provider>
    )
}

export function useNotificationCenter() {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotificationCenter must be used within NotificationCenter')
    }
    return context
}

export function useNotificationCenterOptional(): NotificationContextValue {
    const context = useContext(NotificationContext)
    if (context) return context

    // Fallback no-op API
    const noop = () => ''
    return {
        notifications: [],
        show: noop,
        dismiss: () => { },
        dismissAll: () => { },
        showModal: noop,
        showBanner: noop,
        showInline: noop,
        showCorner: noop,
    }
}
