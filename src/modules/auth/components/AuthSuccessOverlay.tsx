'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

interface AuthSuccessOverlayProps {
    isVisible: boolean
    title: string
    message: string
    actionText?: string
    onAction?: () => void
    type?: 'login' | 'register' | 'google'
}

export const AuthSuccessOverlay: React.FC<AuthSuccessOverlayProps> = ({
    isVisible,
    title,
    message,
    actionText,
    onAction,
    type = 'login'
}) => {
    const getGradient = () => {
        switch (type) {
            case 'register':
                return 'from-emerald-500 via-green-500 to-teal-600'
            case 'google':
                return 'from-blue-500 via-indigo-500 to-purple-600'
            default:
                return 'from-red-500 via-pink-500 to-rose-600'
        }
    }

    const getEmoji = () => {
        switch (type) {
            case 'register': return '🎊'
            case 'google': return '🌐'
            default: return '🎉'
        }
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 20 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            y: 0,
                            transition: {
                                type: 'spring',
                                damping: 20,
                                stiffness: 300,
                                delay: 0.1
                            }
                        }}
                        exit={{
                            scale: 0.9,
                            opacity: 0,
                            transition: { duration: 0.2 }
                        }}
                        className={`
                            relative max-w-md w-full bg-gradient-to-br ${getGradient()}
                            rounded-3xl p-8 text-white text-center overflow-hidden
                            shadow-2xl
                        `}
                    >
                        {/* Animated background particles */}
                        <div className="absolute inset-0 overflow-hidden">
                            {[...Array(12)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-white/20 rounded-full"
                                    initial={{
                                        x: Math.random() * 100 + '%',
                                        y: '100%',
                                        scale: 0
                                    }}
                                    animate={{
                                        y: '-20%',
                                        scale: [0, 1, 0],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 3,
                                        delay: i * 0.2,
                                        repeat: Infinity,
                                        ease: 'easeOut'
                                    }}
                                />
                            ))}
                        </div>

                        {/* Success icon */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{
                                scale: 1,
                                rotate: 0,
                                transition: {
                                    type: 'spring',
                                    damping: 15,
                                    stiffness: 300,
                                    delay: 0.3
                                }
                            }}
                            className="relative z-10 mb-6"
                        >
                            <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <CheckCircleIcon className="w-10 h-10 text-white" />
                            </div>

                            {/* Floating emoji */}
                            <motion.div
                                initial={{ scale: 0, y: 20 }}
                                animate={{
                                    scale: 1,
                                    y: 0,
                                    transition: { delay: 0.5, type: 'spring' }
                                }}
                                className="absolute -top-2 -right-2 text-2xl"
                            >
                                {getEmoji()}
                            </motion.div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                                opacity: 1,
                                y: 0,
                                transition: { delay: 0.4 }
                            }}
                            className="relative z-10"
                        >
                            <h3 className="text-2xl font-bold mb-3">{title}</h3>
                            <p className="text-white/90 leading-relaxed mb-6">{message}</p>

                            {actionText && onAction && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        scale: 1,
                                        transition: { delay: 0.6 }
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={onAction}
                                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 
                                             px-6 py-3 rounded-xl font-medium transition-all duration-200
                                             backdrop-blur-sm border border-white/20"
                                >
                                    <span>{actionText}</span>
                                    <ArrowRightIcon className="w-4 h-4" />
                                </motion.button>
                            )}
                        </motion.div>

                        {/* Progress ring */}
                        <motion.div
                            className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, transition: { delay: 0.8 } }}
                        >
                            <motion.div
                                className="w-8 h-8 border-2 border-white/20 rounded-full relative"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            >
                                <motion.div
                                    className="absolute inset-0 border-2 border-transparent border-t-white/60 rounded-full"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
