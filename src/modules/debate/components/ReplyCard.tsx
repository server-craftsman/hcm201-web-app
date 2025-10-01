'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
    UserIcon,
    ClockIcon,
    LinkIcon,
    PhotoIcon,
    DocumentIcon,
    ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'
import { Reply } from '../api/argumentApi'

interface ReplyCardProps {
    reply: Reply
    index?: number
}

export const ReplyCard: React.FC<ReplyCardProps> = ({ reply, index = 0 }) => {
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return 'Vừa xong'
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`
    }

    const getFileTypeIcon = (url: string) => {
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return <PhotoIcon className="h-4 w-4 text-blue-500" />
        } else if (url.match(/\.(pdf|doc|docx)$/i)) {
            return <DocumentIcon className="h-4 w-4 text-red-500" />
        } else {
            return <LinkIcon className="h-4 w-4 text-gray-500" />
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative overflow-hidden bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/20 rounded-2xl border border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
            {/* Decorative gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start space-x-4 mb-4">
                    {/* Avatar */}
                    <div className="relative">
                        {/* Handle both author and authorId structures */}
                        {(() => {
                            const author = reply.author || (reply as any).authorId
                            const avatar = author?.avatar
                            const firstName = author?.firstName
                            const lastName = author?.lastName
                            const username = author?.username

                            return avatar && avatar.startsWith('http') ? (
                                <img
                                    src={avatar}
                                    alt={firstName || 'User'}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-blue-200 shadow-lg"
                                />
                            ) : (
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-lg font-bold border-2 border-blue-200 shadow-lg">
                                    {firstName?.charAt(0) || lastName?.charAt(0) || 'U'}
                                </div>
                            )
                        })()}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                            <ChatBubbleLeftRightIcon className="h-3 w-3 text-white" />
                        </div>
                    </div>

                    {/* Author Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                            <h4 className="text-lg font-bold text-gray-900 truncate">
                                {(() => {
                                    const author = reply.author || (reply as any).authorId
                                    return `${author?.firstName || ''} ${author?.lastName || ''}`.trim() || 'Người dùng'
                                })()}
                            </h4>
                            <span className="px-2 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold rounded-full shadow-lg">
                                Phản hồi
                            </span>
                        </div>
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                            <span className="flex items-center space-x-1">
                                <UserIcon className="h-4 w-4" />
                                <span>@{(() => {
                                    const author = reply.author || (reply as any).authorId
                                    return author?.username || 'user'
                                })()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <ClockIcon className="h-4 w-4" />
                                <span>{formatRelativeTime(reply.createdAt)}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                        {reply.title}
                    </h3>
                </div>

                {/* Content */}
                <div className="mb-6">
                    <div className="prose prose-sm max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {reply.content}
                        </p>
                    </div>
                </div>

                {/* Source */}
                {reply.source && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50">
                        <div className="flex items-center space-x-2 mb-2">
                            <LinkIcon className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-semibold text-blue-800">Nguồn tham khảo</span>
                        </div>
                        <a
                            href={reply.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline break-all"
                        >
                            {reply.source}
                        </a>
                    </div>
                )}

                {/* Evidence URLs */}
                {reply.evidenceUrls && reply.evidenceUrls.length > 0 && (
                    <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <DocumentIcon className="h-4 w-4 text-purple-600" />
                            <span className="text-sm font-semibold text-purple-800">Bằng chứng hỗ trợ</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {reply.evidenceUrls.map((url, index) => (
                                <motion.a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center space-x-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                                >
                                    {getFileTypeIcon(url)}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 truncate">
                                            {url.split('/').pop() || url}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {url}
                                        </p>
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? 'Hình ảnh' :
                                            url.match(/\.(pdf|doc|docx)$/i) ? 'Tài liệu' : 'Liên kết'}
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="pt-4 border-t border-gray-200/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>ID: {reply._id.slice(-8)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-emerald-700">Đã đăng</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
