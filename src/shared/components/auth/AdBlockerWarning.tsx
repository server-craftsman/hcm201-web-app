'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ExclamationTriangleIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

interface AdBlockerWarningProps {
    isVisible: boolean
    onClose: () => void
}

export function AdBlockerWarning({ isVisible, onClose }: AdBlockerWarningProps) {
    const [isDismissed, setIsDismissed] = useState(false)

    useEffect(() => {
        if (isVisible) {
            setIsDismissed(false)
        }
    }, [isVisible])

    const handleClose = () => {
        setIsDismissed(true)
        onClose()
    }

    if (!isVisible || isDismissed) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
            >
                <div className="bg-amber-50 border border-amber-200 rounded-xl shadow-lg p-4">
                    <div className="flex items-start">
                        <div className="flex-shrink-0">
                            <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
                        </div>
                        <div className="ml-3 flex-1">
                            <h3 className="text-sm font-medium text-amber-800">
                                Google Sign-In bị chặn
                            </h3>
                            <div className="mt-2 text-sm text-amber-700">
                                <p>
                                    Trình chặn quảng cáo hoặc trình duyệt đang chặn Google Sign-In.
                                    Để sử dụng tính năng đăng nhập, vui lòng:
                                </p>
                                <ul className="mt-2 space-y-1 list-disc list-inside">
                                    <li>Tắt trình chặn quảng cáo cho trang web này</li>
                                    <li>Thử trình duyệt khác (Chrome, Firefox, Safari)</li>
                                    <li>Sử dụng chế độ ẩn danh</li>
                                </ul>
                            </div>
                            <div className="mt-3 flex items-center space-x-3">
                                <button
                                    onClick={handleClose}
                                    className="text-amber-600 hover:text-amber-800 text-sm font-medium"
                                >
                                    Đóng
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-amber-600 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-amber-700"
                                >
                                    Thử lại
                                </button>
                            </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                            <button
                                onClick={handleClose}
                                className="text-amber-400 hover:text-amber-600"
                            >
                                <XMarkIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
