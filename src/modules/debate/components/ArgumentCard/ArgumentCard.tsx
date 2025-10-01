import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    HandThumbUpIcon,
    HandThumbDownIcon,
    UserIcon,
    ClockIcon,
    ExclamationTriangleIcon,
    StarIcon,
    LinkIcon,
    CheckBadgeIcon,
    ClockIcon as PendingIcon,
    XMarkIcon,
    FlagIcon,
    EllipsisHorizontalIcon,
    ChatBubbleLeftRightIcon,
    ChatBubbleOvalLeftIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    PlusIcon
} from '@heroicons/react/24/outline'
import {
    HandThumbUpIcon as HandThumbUpSolid,
    HandThumbDownIcon as HandThumbDownSolid,
    StarIcon as StarSolid
} from '@heroicons/react/24/solid'
import { cn } from '@/shared/utils/shadcn'
import { Argument, Reply, argumentApi } from '@/modules/debate/api/argumentApi'
import { ReplyForm } from '../ReplyForm'
import { ReplyCard } from '../ReplyCard'

interface ArgumentCardProps {
    argument: Argument
    onLike?: (argumentId: string) => void
    onDislike?: (argumentId: string) => void
    onModerate?: (argumentId: string, action: string, notes?: string) => void
    currentUserRole?: 'USER' | 'MODERATOR' | 'ADMIN'
    isCompact?: boolean
    showModerationActions?: boolean
    currentUser?: any
}

export const ArgumentCard: React.FC<ArgumentCardProps> = ({
    argument,
    onLike,
    onDislike,
    onModerate,
    currentUserRole = 'USER',
    isCompact = false,
    showModerationActions = false,
    currentUser
}) => {
    const [isLiked, setIsLiked] = useState(false)
    const [isDisliked, setIsDisliked] = useState(false)
    const [showModerationMenu, setShowModerationMenu] = useState(false)
    const [moderationNotes, setModerationNotes] = useState('')
    const [showReplies, setShowReplies] = useState(false)
    const [showReplyForm, setShowReplyForm] = useState(false)
    const [replies, setReplies] = useState<Reply[]>([])
    const [isLoadingReplies, setIsLoadingReplies] = useState(false)
    const [isSubmittingReply, setIsSubmittingReply] = useState(false)

    // Support both old fields (likesCount/dislikesCount) and new API fields (upvotes/downvotes)
    const [likesCount, setLikesCount] = useState<number>(
        (argument as any)?.likesCount ?? (argument as any)?.upvotes ?? 0
    )
    const [dislikesCount, setDislikesCount] = useState<number>(
        (argument as any)?.dislikesCount ?? (argument as any)?.downvotes ?? 0
    )

    // Normalize author object: prefer argument.author, fallback to argument.authorId (new API shape)
    const author: any = (argument as any)?.author ?? (argument as any)?.authorId ?? null

    const handleLike = async () => {
        if (isLiked) return

        setIsLiked(true)
        setIsDisliked(false)
        setLikesCount(prev => prev + 1)
        if (isDisliked) setDislikesCount(prev => prev - 1)

        onLike?.(argument._id)
    }

    const handleDislike = async () => {
        if (isDisliked) return

        setIsDisliked(true)
        setIsLiked(false)
        setDislikesCount(prev => prev + 1)
        if (isLiked) setLikesCount(prev => prev - 1)

        onDislike?.(argument._id)
    }

    const handleModeration = (action: string) => {
        onModerate?.(argument._id, action, moderationNotes)
        setShowModerationMenu(false)
        setModerationNotes('')
    }

    const loadReplies = async () => {
        setIsLoadingReplies(true)
        try {
            const response = await argumentApi.getReplies(argument._id)
            setReplies(response.items)
        } catch (error) {
            console.error('Error loading replies:', error)
            setReplies([])
        } finally {
            setIsLoadingReplies(false)
        }
    }

    const handleReplySubmit = async (data: any) => {
        setIsSubmittingReply(true)
        try {
            const newReply = await argumentApi.replyToArgument(argument._id, data)
            setReplies(prev => [newReply, ...prev])
            setShowReplyForm(false)
        } catch (error) {
            console.error('Error submitting reply:', error)
        } finally {
            setIsSubmittingReply(false)
        }
    }

    const toggleReplies = () => {
        if (!showReplies && replies.length === 0) {
            loadReplies()
        }
        setShowReplies(!showReplies)
    }

    const getStatusConfig = () => {
        switch (argument.status) {
            case 'APPROVED':
                return {
                    icon: CheckBadgeIcon,
                    label: 'Đã duyệt',
                    color: 'text-green-700 bg-green-100 border-green-200'
                }
            case 'PENDING':
                return {
                    icon: PendingIcon,
                    label: 'Chờ duyệt',
                    color: 'text-amber-700 bg-amber-100 border-amber-200'
                }
            case 'REJECTED':
                return {
                    icon: XMarkIcon,
                    label: 'Bị từ chối',
                    color: 'text-red-700 bg-red-100 border-red-200'
                }
            case 'FLAGGED':
                return {
                    icon: FlagIcon,
                    label: 'Được đánh dấu',
                    color: 'text-purple-700 bg-purple-100 border-purple-200'
                }
            default:
                return {
                    icon: ClockIcon,
                    label: 'Chưa xác định',
                    color: 'text-gray-700 bg-gray-100 border-gray-200'
                }
        }
    }

    const getTypeConfig = () => {
        switch (argument.argumentType) {
            case 'SUPPORT':
                return {
                    label: 'Ủng hộ',
                    color: 'bg-emerald-500',
                    borderColor: 'border-emerald-200',
                    bgGradient: 'from-emerald-50 to-green-50',
                    icon: '👍'
                }
            case 'OPPOSE':
                return {
                    label: 'Phản đối',
                    color: 'bg-rose-500',
                    borderColor: 'border-rose-200',
                    bgGradient: 'from-rose-50 to-red-50',
                    icon: '👎'
                }
            case 'NEUTRAL':
                return {
                    label: 'Trung lập',
                    color: 'bg-slate-500',
                    borderColor: 'border-slate-200',
                    bgGradient: 'from-slate-50 to-gray-50',
                    icon: '🤔'
                }
            default:
                return {
                    label: 'Khác',
                    color: 'bg-gray-500',
                    borderColor: 'border-gray-200',
                    bgGradient: 'from-gray-50 to-slate-50',
                    icon: '💬'
                }
        }
    }

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

        if (diffInMinutes < 1) return 'Vừa xong'
        if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`
    }

    const statusConfig = getStatusConfig()
    const typeConfig = getTypeConfig()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={cn(
                "relative group",
                isCompact ? "mb-3" : "mb-6"
            )}
        >
            {/* Highlight glow effect */}
            {argument.isHighlighted && (
                <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 rounded-xl opacity-75 blur"
                    animate={{
                        opacity: [0.5, 0.8, 0.5],
                        scale: [1, 1.02, 1]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            )}

            <div className={cn(
                "relative bg-white border-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300",
                typeConfig.borderColor,
                `bg-gradient-to-br ${typeConfig.bgGradient}`,
                argument.isHighlighted && "ring-2 ring-amber-300 ring-opacity-50",
                isCompact ? "p-4" : "p-6"
            )}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                        {/* Type indicator with icon */}
                        <div className="flex items-center space-x-2">
                            <div className={cn(
                                "w-3 h-3 rounded-full",
                                typeConfig.color
                            )} />
                            <span className="text-lg">{typeConfig.icon}</span>
                        </div>

                        {/* Argument type badge */}
                        <motion.span
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-full border",
                                typeConfig.borderColor,
                                `bg-gradient-to-r ${typeConfig.bgGradient}`
                            )}
                            whileHover={{ scale: 1.05 }}
                        >
                            {typeConfig.label}
                        </motion.span>

                        {/* Highlighted star */}
                        {argument.isHighlighted && (
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                                className="text-amber-500"
                                title="Luận điểm nổi bật"
                            >
                                <StarSolid className="h-4 w-4" />
                            </motion.div>
                        )}
                    </div>

                    {/* Status badge */}
                    <div className={cn(
                        "flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border",
                        statusConfig.color
                    )}>
                        <statusConfig.icon className="h-3 w-3" />
                        <span>{statusConfig.label}</span>
                    </div>
                </div>

                {/* Title */}
                <motion.h3
                    className={cn(
                        "font-bold text-gray-900 mb-3 leading-tight",
                        isCompact ? "text-base" : "text-lg"
                    )}
                    whileHover={{ scale: 1.01 }}
                >
                    <ChatBubbleOvalLeftIcon className="h-5 w-5 inline mr-2 text-gray-400" />
                    {argument.title}
                </motion.h3>

                {/* Content */}
                <div className={cn(
                    "text-gray-700 mb-4 leading-relaxed",
                    isCompact ? "text-sm line-clamp-3" : "text-base"
                )}>
                    {argument.content}
                </div>

                {/* Evidence URLs */}
                {argument.evidenceUrls && argument.evidenceUrls.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-600 mb-2 flex items-center">
                            <LinkIcon className="h-4 w-4 mr-1" />
                            Tài liệu tham khảo:
                        </h4>
                        <div className="space-y-1">
                            {argument.evidenceUrls.slice(0, 2).map((url, index) => (
                                <motion.a
                                    key={index}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline block truncate bg-blue-50 px-2 py-1 rounded"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    🔗 {url}
                                </motion.a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Source */}
                {argument.source && (
                    <div className="mb-4 p-3 bg-slate-50 rounded-lg border-l-4 border-slate-300">
                        <p className="text-sm text-slate-600 italic">
                            <strong>Nguồn:</strong> {argument.source}
                        </p>
                    </div>
                )}

                {/* Author and time */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 hcm-gradient-luxury rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {author?.lastName?.[0]?.toUpperCase() || author?.firstName?.[0]?.toUpperCase() || '👤'}
                        </div>
                        <span className="font-medium">
                            {(author?.firstName || '')} {(author?.lastName || '')}
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{formatRelativeTime(argument.createdAt)}</span>
                    </div>
                </div>

                {/* Moderation notes */}
                {argument.moderationNotes && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                            <ExclamationTriangleIcon className="h-4 w-4 inline mr-1" />
                            <strong>Ghi chú kiểm duyệt:</strong> {argument.moderationNotes}
                        </p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    {/* Like/Dislike buttons */}
                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLike}
                            className={cn(
                                "flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200",
                                isLiked
                                    ? "bg-green-100 text-green-700 border border-green-300 shadow-sm"
                                    : "hover:bg-green-50 text-gray-600 hover:text-green-600"
                            )}
                        >
                            {isLiked ? (
                                <HandThumbUpSolid className="h-4 w-4" />
                            ) : (
                                <HandThumbUpIcon className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">{likesCount}</span>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleDislike}
                            className={cn(
                                "flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-200",
                                isDisliked
                                    ? "bg-red-100 text-red-700 border border-red-300 shadow-sm"
                                    : "hover:bg-red-50 text-gray-600 hover:text-red-600"
                            )}
                        >
                            {isDisliked ? (
                                <HandThumbDownSolid className="h-4 w-4" />
                            ) : (
                                <HandThumbDownIcon className="h-4 w-4" />
                            )}
                            <span className="text-sm font-medium">{dislikesCount}</span>
                        </motion.button>

                        <motion.button
                            onClick={toggleReplies}
                            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-all duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <ChatBubbleLeftRightIcon className="h-4 w-4" />
                            <span className="text-sm">Thảo luận</span>
                            {replies.length > 0 && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                    {replies.length}
                                </span>
                            )}
                            {showReplies ? (
                                <ChevronUpIcon className="h-4 w-4" />
                            ) : (
                                <ChevronDownIcon className="h-4 w-4" />
                            )}
                        </motion.button>
                    </div>

                    {/* Moderation actions */}
                    {showModerationActions && (currentUserRole === 'MODERATOR' || currentUserRole === 'ADMIN') && (
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowModerationMenu(!showModerationMenu)}
                                className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <EllipsisHorizontalIcon className="h-5 w-5" />
                            </motion.button>

                            <AnimatePresence>
                                {showModerationMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border z-10"
                                    >
                                        <div className="p-2 space-y-1">
                                            {argument.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => handleModeration('APPROVE')}
                                                        className="w-full text-left px-3 py-2 text-sm text-green-700 hover:bg-green-50 rounded-md transition-colors"
                                                    >
                                                        ✅ Duyệt
                                                    </button>
                                                    <button
                                                        onClick={() => handleModeration('REJECT')}
                                                        className="w-full text-left px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                                    >
                                                        ❌ Từ chối
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleModeration('FLAG')}
                                                className="w-full text-left px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-md transition-colors"
                                            >
                                                🚩 Đánh dấu
                                            </button>
                                            <button
                                                onClick={() => handleModeration(argument.isHighlighted ? 'UNHIGHLIGHT' : 'HIGHLIGHT')}
                                                className="w-full text-left px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 rounded-md transition-colors"
                                            >
                                                {argument.isHighlighted ? '🌟 Bỏ nổi bật' : '⭐ Nổi bật'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>

            {/* Replies Section */}
            <AnimatePresence>
                {showReplies && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 border-t border-gray-200 pt-4"
                    >
                        {/* Reply Form */}
                        {currentUser && (
                            <div className="mb-6">
                                {showReplyForm ? (
                                    <ReplyForm
                                        argumentId={argument._id}
                                        onSubmit={handleReplySubmit}
                                        onCancel={() => setShowReplyForm(false)}
                                        isLoading={isSubmittingReply}
                                    />
                                ) : (
                                    <motion.button
                                        onClick={() => setShowReplyForm(true)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                                    >
                                        <PlusIcon className="h-5 w-5 text-blue-600" />
                                        <span className="text-blue-700 font-medium">Thêm phản hồi</span>
                                    </motion.button>
                                )}
                            </div>
                        )}

                        {/* Replies List */}
                        <div className="space-y-4">
                            {isLoadingReplies ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                        <span className="text-gray-600">Đang tải phản hồi...</span>
                                    </div>
                                </div>
                            ) : replies.length === 0 ? (
                                <div className="text-center py-8">
                                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có phản hồi</h3>
                                    <p className="text-gray-600 mb-4">
                                        {currentUser ? 'Hãy là người đầu tiên phản hồi luận điểm này.' : 'Đăng nhập để thêm phản hồi đầu tiên.'}
                                    </p>
                                    {currentUser && !showReplyForm && (
                                        <motion.button
                                            onClick={() => setShowReplyForm(true)}
                                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Thêm phản hồi đầu tiên
                                        </motion.button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                                        <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />
                                        <span>Phản hồi ({replies.length})</span>
                                    </h4>
                                    {replies.map((reply, index) => (
                                        <ReplyCard key={reply._id} reply={reply} index={index} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
