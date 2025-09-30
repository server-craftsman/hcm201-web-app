import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircleIcon,
    XCircleIcon,
    FlagIcon,
    StarIcon,
    ClockIcon,
    EyeIcon,
    UserIcon,
    DocumentTextIcon,
    ChatBubbleLeftEllipsisIcon,
    ExclamationTriangleIcon,
    AdjustmentsHorizontalIcon,
    MagnifyingGlassIcon,
    FunnelIcon
} from '@heroicons/react/24/outline'
import {
    StarIcon as StarSolid
} from '@heroicons/react/24/solid'
import { cn } from '@/shared/utils/shadcn'
import { argumentApi, Argument, ModerationAction } from '@/modules/debate/api/argumentApi'

interface ModerationQueueProps {
    userRole: 'ADMIN' | 'MODERATOR' | 'USER'
    className?: string
}

export const ModerationQueue: React.FC<ModerationQueueProps> = ({
    userRole,
    className
}) => {
    const [arguments_, setArguments] = useState<Argument[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'FLAGGED'>('PENDING')
    const [threadFilter, setThreadFilter] = useState<string>('')
    const [typeFilter, setTypeFilter] = useState<'ALL' | 'SUPPORT' | 'OPPOSE' | 'NEUTRAL'>('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedArgument, setSelectedArgument] = useState<Argument | null>(null)
    const [showModerationModal, setShowModerationModal] = useState(false)
    const [moderationAction, setModerationAction] = useState<string>('')
    const [moderationNotes, setModerationNotes] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)

    useEffect(() => {
        loadArguments()
    }, [filter, threadFilter, typeFilter, searchQuery])

    const loadArguments = async () => {
        setIsLoading(true)
        try {
            const response = await argumentApi.getArguments({
                status: filter === 'ALL' ? undefined : filter,
                threadId: threadFilter || undefined,
                argumentType: typeFilter === 'ALL' ? undefined : typeFilter,
                search: searchQuery || undefined
            })
            setArguments(response.data.items)
        } catch (error) {
            console.error('Error loading arguments:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleModeration = async () => {
        if (!selectedArgument || !moderationAction) return

        setIsProcessing(true)
        try {
            const action: ModerationAction = {
                argumentId: selectedArgument._id,
                action: moderationAction as any,
                notes: moderationNotes
            }

            const updatedArgument = await argumentApi.moderateArgument(action)

            setArguments(prev => prev.map(arg =>
                arg._id === selectedArgument._id ? updatedArgument : arg
            ))

            setShowModerationModal(false)
            setSelectedArgument(null)
            setModerationAction('')
            setModerationNotes('')
        } catch (error) {
            console.error('Error moderating argument:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const quickModeration = async (argumentId: string, action: string) => {
        setIsProcessing(true)
        try {
            const moderationData: ModerationAction = {
                argumentId,
                action: action as any,
                notes: `Hành động nhanh: ${action}`
            }

            const updatedArgument = await argumentApi.moderateArgument(moderationData)

            setArguments(prev => prev.map(arg =>
                arg._id === argumentId ? updatedArgument : arg
            ))
        } catch (error) {
            console.error('Error with quick moderation:', error)
        } finally {
            setIsProcessing(false)
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

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PENDING':
                return {
                    icon: ClockIcon,
                    label: 'Chờ duyệt',
                    color: 'text-amber-700 bg-amber-100 border-amber-300'
                }
            case 'APPROVED':
                return {
                    icon: CheckCircleIcon,
                    label: 'Đã duyệt',
                    color: 'text-green-700 bg-green-100 border-green-300'
                }
            case 'REJECTED':
                return {
                    icon: XCircleIcon,
                    label: 'Bị từ chối',
                    color: 'text-red-700 bg-red-100 border-red-300'
                }
            case 'FLAGGED':
                return {
                    icon: FlagIcon,
                    label: 'Được đánh dấu',
                    color: 'text-purple-700 bg-purple-100 border-purple-300'
                }
            default:
                return {
                    icon: ClockIcon,
                    label: 'Không xác định',
                    color: 'text-gray-700 bg-gray-100 border-gray-300'
                }
        }
    }

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'SUPPORT':
                return {
                    label: 'Ủng hộ',
                    color: 'bg-emerald-500',
                    icon: '👍'
                }
            case 'OPPOSE':
                return {
                    label: 'Phản đối',
                    color: 'bg-rose-500',
                    icon: '👎'
                }
            case 'NEUTRAL':
                return {
                    label: 'Trung lập',
                    color: 'bg-slate-500',
                    icon: '🤔'
                }
            default:
                return {
                    label: 'Khác',
                    color: 'bg-gray-500',
                    icon: '💬'
                }
        }
    }

    if (userRole === 'USER') {
        return (
            <div className="text-center py-12">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có quyền truy cập</h3>
                <p className="text-gray-600">Chỉ moderator và admin mới có thể xem hàng chờ kiểm duyệt.</p>
            </div>
        )
    }

    const filteredArguments = arguments_.filter(arg => {
        if (filter === 'PENDING' && arg.status !== 'PENDING') return false
        if (filter === 'FLAGGED' && arg.status !== 'FLAGGED') return false
        return true
    })

    return (
        <div className={cn("space-y-6", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-500 rounded-lg">
                        <AdjustmentsHorizontalIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Hàng chờ kiểm duyệt</h2>
                        <p className="text-gray-600">Quản lý và kiểm duyệt luận điểm từ cộng đồng</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center space-x-4 text-sm">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">{arguments_.filter(a => a.status === 'PENDING').length}</p>
                        <p className="text-gray-600">Chờ duyệt</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{arguments_.filter(a => a.status === 'FLAGGED').length}</p>
                        <p className="text-gray-600">Đánh dấu</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm luận điểm..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="PENDING">Chờ duyệt</option>
                        <option value="FLAGGED">Đã đánh dấu</option>
                        <option value="ALL">Tất cả trạng thái</option>
                    </select>

                    {/* Type Filter */}
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        <option value="ALL">Tất cả loại</option>
                        <option value="SUPPORT">Ủng hộ</option>
                        <option value="OPPOSE">Phản đối</option>
                        <option value="NEUTRAL">Trung lập</option>
                    </select>

                    {/* Thread Filter */}
                    <input
                        type="text"
                        placeholder="Lọc theo chủ đề..."
                        value={threadFilter}
                        onChange={(e) => setThreadFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Arguments List */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Luận điểm cần kiểm duyệt ({filteredArguments.length})
                    </h3>
                </div>

                <div className="divide-y divide-gray-200">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-gray-600">Đang tải...</span>
                            </div>
                        </div>
                    ) : filteredArguments.length === 0 ? (
                        <div className="text-center py-12">
                            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Không có luận điểm nào</h3>
                            <p className="text-gray-600">
                                {filter === 'PENDING' ? 'Hiện tại không có luận điểm nào chờ duyệt.' : 'Không tìm thấy luận điểm phù hợp với bộ lọc.'}
                            </p>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {filteredArguments.map((argument, index) => {
                                const statusConfig = getStatusConfig(argument.status)
                                const typeConfig = getTypeConfig(argument.argumentType)

                                return (
                                    <motion.div
                                        key={argument._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="space-y-4">
                                            {/* Header */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        {/* Type indicator */}
                                                        <div className="flex items-center space-x-2">
                                                            <div className={cn("w-3 h-3 rounded-full", typeConfig.color)} />
                                                            <span className="text-lg">{typeConfig.icon}</span>
                                                            <span className="text-sm font-medium text-gray-600">{typeConfig.label}</span>
                                                        </div>

                                                        {/* Highlighted indicator */}
                                                        {argument.isHighlighted && (
                                                            <div className="flex items-center space-x-1 text-amber-600">
                                                                <StarSolid className="h-4 w-4" />
                                                                <span className="text-xs font-medium">Nổi bật</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                                        {argument.title}
                                                    </h4>

                                                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                                                        {argument.content}
                                                    </p>

                                                    {/* Author and time */}
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <div className="flex items-center space-x-2">
                                                            <div className="w-6 h-6 hcm-gradient-luxury rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                                {argument.author.avatar || argument.author.firstName?.[0]?.toUpperCase() || '👤'}
                                                            </div>
                                                            <span>
                                                                {argument.author.firstName} {argument.author.lastName}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <ClockIcon className="h-4 w-4" />
                                                            <span>{formatRelativeTime(argument.createdAt)}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1">
                                                            <span>👍 {argument.likesCount}</span>
                                                            <span>👎 {argument.dislikesCount}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Status Badge */}
                                                <div className={cn(
                                                    "flex items-center space-x-1 px-3 py-1 text-xs font-medium rounded-full border ml-4",
                                                    statusConfig.color
                                                )}>
                                                    <statusConfig.icon className="h-3 w-3" />
                                                    <span>{statusConfig.label}</span>
                                                </div>
                                            </div>

                                            {/* Source and Evidence */}
                                            {(argument.source || (argument.evidenceUrls && argument.evidenceUrls.length > 0)) && (
                                                <div className="bg-gray-50 p-3 rounded-lg">
                                                    {argument.source && (
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            <strong>Nguồn:</strong> {argument.source}
                                                        </p>
                                                    )}
                                                    {argument.evidenceUrls && argument.evidenceUrls.length > 0 && (
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-600 mb-1">Tài liệu:</p>
                                                            {argument.evidenceUrls.slice(0, 2).map((url, i) => (
                                                                <a
                                                                    key={i}
                                                                    href={url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-blue-600 hover:underline block truncate"
                                                                >
                                                                    🔗 {url}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Moderation Notes */}
                                            {argument.moderationNotes && (
                                                <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                                                    <p className="text-sm text-blue-800">
                                                        <strong>Ghi chú kiểm duyệt:</strong> {argument.moderationNotes}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            {argument.status === 'PENDING' && (
                                                <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
                                                    <motion.button
                                                        onClick={() => quickModeration(argument._id, 'APPROVE')}
                                                        disabled={isProcessing}
                                                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                        <span>Duyệt</span>
                                                    </motion.button>

                                                    <motion.button
                                                        onClick={() => quickModeration(argument._id, 'REJECT')}
                                                        disabled={isProcessing}
                                                        className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <XCircleIcon className="h-4 w-4" />
                                                        <span>Từ chối</span>
                                                    </motion.button>

                                                    <motion.button
                                                        onClick={() => quickModeration(argument._id, 'FLAG')}
                                                        disabled={isProcessing}
                                                        className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <FlagIcon className="h-4 w-4" />
                                                        <span>Đánh dấu</span>
                                                    </motion.button>

                                                    <motion.button
                                                        onClick={() => quickModeration(argument._id, argument.isHighlighted ? 'UNHIGHLIGHT' : 'HIGHLIGHT')}
                                                        disabled={isProcessing}
                                                        className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <StarIcon className="h-4 w-4" />
                                                        <span>{argument.isHighlighted ? 'Bỏ nổi bật' : 'Nổi bật'}</span>
                                                    </motion.button>

                                                    <motion.button
                                                        onClick={() => {
                                                            setSelectedArgument(argument)
                                                            setShowModerationModal(true)
                                                        }}
                                                        className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                        <span>Chi tiết</span>
                                                    </motion.button>
                                                </div>
                                            )}

                                            {argument.status === 'FLAGGED' && (
                                                <div className="flex items-center space-x-3 pt-3 border-t border-gray-200">
                                                    <motion.button
                                                        onClick={() => quickModeration(argument._id, 'APPROVE')}
                                                        disabled={isProcessing}
                                                        className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                        <span>Duyệt</span>
                                                    </motion.button>

                                                    <motion.button
                                                        onClick={() => quickModeration(argument._id, 'REJECT')}
                                                        disabled={isProcessing}
                                                        className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <XCircleIcon className="h-4 w-4" />
                                                        <span>Từ chối</span>
                                                    </motion.button>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* Detailed Moderation Modal */}
            <AnimatePresence>
                {showModerationModal && selectedArgument && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900">Kiểm duyệt chi tiết</h3>
                                <p className="text-gray-600 mt-1">Xem xét và đưa ra quyết định kiểm duyệt</p>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Argument Details */}
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h4 className="font-semibold text-gray-900 mb-3">{selectedArgument.title}</h4>
                                    <p className="text-gray-700 mb-4 leading-relaxed">{selectedArgument.content}</p>

                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-600">Tác giả:</span>
                                            <span className="ml-2">{selectedArgument.author.firstName} {selectedArgument.author.lastName}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Thời gian:</span>
                                            <span className="ml-2">{formatRelativeTime(selectedArgument.createdAt)}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Loại:</span>
                                            <span className="ml-2">{getTypeConfig(selectedArgument.argumentType).label}</span>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Trạng thái:</span>
                                            <span className="ml-2">{getStatusConfig(selectedArgument.status).label}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Moderation Action */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Hành động kiểm duyệt *
                                        </label>
                                        <select
                                            value={moderationAction}
                                            onChange={(e) => setModerationAction(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="">Chọn hành động...</option>
                                            <option value="APPROVE">Duyệt luận điểm</option>
                                            <option value="REJECT">Từ chối luận điểm</option>
                                            <option value="FLAG">Đánh dấu cần xem xét</option>
                                            <option value="HIGHLIGHT">Nổi bật luận điểm</option>
                                            <option value="UNHIGHLIGHT">Bỏ nổi bật</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Moderation Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ghi chú kiểm duyệt
                                    </label>
                                    <textarea
                                        value={moderationNotes}
                                        onChange={(e) => setModerationNotes(e.target.value)}
                                        placeholder="Ghi chú lý do kiểm duyệt, hướng dẫn cho tác giả..."
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    />
                                </div>
                            </div>

                            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowModerationModal(false)
                                        setSelectedArgument(null)
                                        setModerationAction('')
                                        setModerationNotes('')
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Hủy
                                </button>
                                <motion.button
                                    onClick={handleModeration}
                                    disabled={isProcessing || !moderationAction}
                                    className={cn(
                                        "px-6 py-2 bg-purple-500 text-white rounded-lg font-medium transition-colors flex items-center space-x-2",
                                        isProcessing || !moderationAction
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-purple-600"
                                    )}
                                    whileHover={!isProcessing && moderationAction ? { scale: 1.05 } : {}}
                                    whileTap={!isProcessing && moderationAction ? { scale: 0.95 } : {}}
                                >
                                    {isProcessing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            <span>Đang xử lý...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircleIcon className="h-4 w-4" />
                                            <span>Thực hiện kiểm duyệt</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
