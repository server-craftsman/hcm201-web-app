'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { toast } from 'react-hot-toast'
import { uploadAvatar } from '@/shared/utils/cloudinary'
import {
    CameraIcon,
    PhotoIcon,
    XMarkIcon,
    CheckIcon,
    ExclamationTriangleIcon,
    ArrowUpTrayIcon
} from '@heroicons/react/24/outline'

interface AvatarUploadProps {
    currentAvatar?: string
    onAvatarChange: (newAvatarUrl: string) => void
    userId?: string
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({
    currentAvatar,
    onAvatarChange,
    userId,
    size = 'lg',
    className = ''
}) => {
    const [isUploading, setIsUploading] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [dragActive, setDragActive] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Size configurations
    const sizeConfig = {
        sm: { container: 'w-16 h-16', icon: 'h-4 w-4', text: 'text-xs' },
        md: { container: 'w-20 h-20', icon: 'h-5 w-5', text: 'text-sm' },
        lg: { container: 'w-24 h-24', icon: 'h-6 w-6', text: 'text-sm' },
        xl: { container: 'w-32 h-32', icon: 'h-8 w-8', text: 'text-base' }
    }

    const config = sizeConfig[size]

    // Handle file selection
    const handleFileSelect = async (file: File) => {
        try {
            // Validate file
            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file hình ảnh', {
                    duration: 3000,
                    style: {
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '500'
                    },
                    icon: '❌'
                })
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước file không được vượt quá 5MB', {
                    duration: 3000,
                    style: {
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: '1px solid #fecaca',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '500'
                    },
                    icon: '❌'
                })
                return
            }

            // Create preview
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string)
            }
            reader.readAsDataURL(file)

            // Upload to Cloudinary
            setIsUploading(true)
            const avatarUrl = await uploadAvatar(file, userId)

            // Update parent component
            onAvatarChange(avatarUrl)

            // Clear preview
            setPreviewUrl(null)

            toast.success('Cập nhật avatar thành công!', {
                duration: 3000,
                style: {
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                },
                icon: '✅'
            })

        } catch (error) {
            console.error('Avatar upload error:', error)
            toast.error('Có lỗi xảy ra khi upload avatar', {
                duration: 3000,
                style: {
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '12px',
                    padding: '16px',
                    fontSize: '14px',
                    fontWeight: '500'
                },
                icon: '❌'
            })
            setPreviewUrl(null)
        } finally {
            setIsUploading(false)
        }
    }

    // Handle drag events
    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0])
        }
    }

    // Handle click to open file dialog
    const handleClick = () => {
        if (!isUploading) {
            fileInputRef.current?.click()
        }
    }

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0])
        }
    }

    return (
        <div className={`relative ${className}`}>
            {/* Avatar Container */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative ${config.container} rounded-full overflow-hidden cursor-pointer group`}
                onClick={handleClick}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600"></div>

                {/* Current Avatar or Preview */}
                {(previewUrl || currentAvatar) ? (
                    <Image
                        src={previewUrl || currentAvatar!}
                        alt="Avatar"
                        fill
                        className="object-cover z-10"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white text-2xl font-bold z-10">
                        <PhotoIcon className={`${config.icon} opacity-70`} />
                    </div>
                )}

                {/* Upload Overlay */}
                <AnimatePresence>
                    {(dragActive || isUploading) && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20"
                        >
                            {isUploading ? (
                                <div className="text-center text-white">
                                    <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                    <p className={`${config.text} font-medium`}>Đang upload...</p>
                                </div>
                            ) : (
                                <div className="text-center text-white">
                                    <ArrowUpTrayIcon className={`${config.icon} mx-auto mb-2`} />
                                    <p className={`${config.text} font-medium`}>Thả để upload</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Camera Icon Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg transform translate-x-1 translate-y-1 z-30 group-hover:scale-110 transition-transform duration-200"
                >
                    <CameraIcon className="h-4 w-4 text-gray-600" />
                </motion.div>

                {/* Upload Progress Indicator */}
                {isUploading && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-0 right-0 bg-green-500 rounded-full p-1 shadow-lg z-30"
                    >
                        <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    </motion.div>
                )}
            </motion.div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
            />

            {/* Upload Instructions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-center"
            >
                <p className={`${config.text} text-gray-500 mb-1`}>
                    {isUploading ? 'Đang upload...' : 'Click để thay đổi avatar'}
                </p>
                <p className="text-xs text-gray-400">
                    Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
                </p>
            </motion.div>

            {/* Drag and Drop Instructions */}
            <AnimatePresence>
                {dragActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-40"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <ArrowUpTrayIcon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Thả file để upload</p>
                                <p className="text-xs text-gray-500">Hình ảnh sẽ được tối ưu tự động</p>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default AvatarUpload
