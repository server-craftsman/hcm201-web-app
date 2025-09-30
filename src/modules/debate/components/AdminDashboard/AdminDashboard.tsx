import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChartBarIcon,
    UsersIcon,
    DocumentTextIcon,
    ChatBubbleLeftEllipsisIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    FlagIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    FireIcon,
    StarIcon,
    EyeIcon,
    HandThumbUpIcon,
    ExclamationTriangleIcon,
    Cog6ToothIcon,
    BellIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/shared/utils/shadcn'
import { ThreadApprovalQueue } from '@/modules/debate/components/ThreadApprovalQueue'
import { ModerationQueue } from '@/modules/debate/components/ModerationQueue'

interface AdminDashboardProps {
    userRole: 'ADMIN' | 'MODERATOR' | 'USER'
    className?: string
}

interface DashboardStats {
    totalThreads: number
    activeThreads: number
    totalArguments: number
    pendingArguments: number
    approvedArguments: number
    rejectedArguments: number
    totalVotes: number
    totalUsers: number
    activeUsers: number
    moderators: number
    pendingThreadRequests: number
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
    userRole,
    className
}) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'threads' | 'moderation' | 'analytics'>('overview')
    const [stats, setStats] = useState<DashboardStats>({
        totalThreads: 42,
        activeThreads: 38,
        totalArguments: 1247,
        pendingArguments: 23,
        approvedArguments: 1165,
        rejectedArguments: 59,
        totalVotes: 5623,
        totalUsers: 892,
        activeUsers: 156,
        moderators: 8,
        pendingThreadRequests: 5
    })
    const [isLoading, setIsLoading] = useState(false)

    // Mock data for charts
    const weeklyStats = [
        { day: 'T2', threads: 12, arguments: 45, votes: 234 },
        { day: 'T3', threads: 18, arguments: 67, votes: 456 },
        { day: 'T4', threads: 15, arguments: 52, votes: 378 },
        { day: 'T5', threads: 22, arguments: 89, votes: 567 },
        { day: 'T6', threads: 19, arguments: 73, votes: 445 },
        { day: 'T7', threads: 8, arguments: 34, votes: 234 },
        { day: 'CN', threads: 6, arguments: 28, votes: 189 }
    ]

    const topThreads = [
        { id: '1', title: 'Ảnh hưởng của tư tưởng Hồ Chí Minh đến giáo dục hiện đại', arguments: 89, votes: 567, trend: 'up' },
        { id: '2', title: 'Triết lý độc lập dân tộc trong thời đại toàn cầu hóa', arguments: 73, votes: 445, trend: 'up' },
        { id: '3', title: 'Tư tưởng đại đoàn kết dân tộc trong xây dựng đất nước', arguments: 65, votes: 378, trend: 'down' },
        { id: '4', title: 'Quan điểm về nhân dân và vai trò của nhân dân', arguments: 52, votes: 334, trend: 'up' },
        { id: '5', title: 'Tư tưởng văn hóa-xã hội của Hồ Chí Minh', arguments: 48, votes: 289, trend: 'stable' }
    ]

    const recentActivities = [
        { type: 'thread_created', user: 'Nguyễn Văn A', action: 'tạo chủ đề mới', target: 'Tư tưởng đại đoàn kết...', time: '5 phút trước' },
        { type: 'argument_approved', user: 'TS. Trần Thị B', action: 'duyệt luận điểm', target: 'Về giáo dục nhân cách...', time: '12 phút trước' },
        { type: 'argument_rejected', user: 'PGS. Lê Văn C', action: 'từ chối luận điểm', target: 'Quan điểm chưa rõ ràng...', time: '25 phút trước' },
        { type: 'vote_cast', user: 'Phạm Thị D', action: 'bình chọn', target: 'Triết lý độc lập dân tộc...', time: '1 giờ trước' },
        { type: 'thread_approved', user: 'Admin', action: 'phê duyệt chủ đề', target: 'Văn hóa trong tư tưởng HCM...', time: '2 giờ trước' }
    ]

    if (userRole !== 'ADMIN') {
        return (
            <div className="text-center py-12">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có quyền truy cập</h3>
                <p className="text-gray-600">Chỉ admin mới có thể truy cập dashboard quản trị.</p>
            </div>
        )
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'thread_created': return <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-blue-500" />
            case 'argument_approved': return <CheckCircleIcon className="h-4 w-4 text-green-500" />
            case 'argument_rejected': return <XCircleIcon className="h-4 w-4 text-red-500" />
            case 'vote_cast': return <HandThumbUpIcon className="h-4 w-4 text-purple-500" />
            case 'thread_approved': return <StarIcon className="h-4 w-4 text-amber-500" />
            default: return <ClockIcon className="h-4 w-4 text-gray-500" />
        }
    }

    return (
        <div className={cn("space-y-8", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                        <Cog6ToothIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản trị</h1>
                        <p className="text-gray-600">Tổng quan và quản lý hệ thống tranh luận</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                        <BellIcon className="h-6 w-6" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </button>
                    <div className="text-sm text-gray-500">
                        Cập nhật lần cuối: {new Date().toLocaleTimeString('vi-VN')}
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                {[
                    { id: 'overview', label: 'Tổng quan', icon: ChartBarIcon },
                    { id: 'threads', label: 'Chủ đề', icon: ChatBubbleLeftEllipsisIcon },
                    { id: 'moderation', label: 'Kiểm duyệt', icon: FlagIcon },
                    { id: 'analytics', label: 'Phân tích', icon: ArrowTrendingUpIcon }
                ].map((tab) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200",
                            activeTab === tab.id
                                ? "bg-white shadow-sm text-indigo-600"
                                : "text-gray-600 hover:text-gray-800 hover:bg-white/50"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <tab.icon className="h-5 w-5" />
                        <span>{tab.label}</span>
                    </motion.button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[
                                    {
                                        title: 'Tổng chủ đề',
                                        value: stats.totalThreads,
                                        subtitle: `${stats.activeThreads} đang hoạt động`,
                                        icon: ChatBubbleLeftEllipsisIcon,
                                        color: 'from-blue-500 to-blue-600',
                                        change: '+12%'
                                    },
                                    {
                                        title: 'Luận điểm',
                                        value: stats.totalArguments,
                                        subtitle: `${stats.pendingArguments} chờ duyệt`,
                                        icon: DocumentTextIcon,
                                        color: 'from-green-500 to-green-600',
                                        change: '+8%'
                                    },
                                    {
                                        title: 'Bình chọn',
                                        value: stats.totalVotes,
                                        subtitle: 'Trong 7 ngày qua',
                                        icon: HandThumbUpIcon,
                                        color: 'from-purple-500 to-purple-600',
                                        change: '+15%'
                                    },
                                    {
                                        title: 'Người dùng',
                                        value: stats.totalUsers,
                                        subtitle: `${stats.activeUsers} đang hoạt động`,
                                        icon: UsersIcon,
                                        color: 'from-amber-500 to-amber-600',
                                        change: '+5%'
                                    }
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.title}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 relative overflow-hidden"
                                    >
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={cn("p-3 rounded-lg bg-gradient-to-r", stat.color)}>
                                                <stat.icon className="h-6 w-6 text-white" />
                                            </div>
                                            <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                                                {stat.change}
                                            </span>
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                                        <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value.toLocaleString()}</p>
                                        <p className="text-sm text-gray-500">{stat.subtitle}</p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Charts and Activities */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Weekly Activity Chart */}
                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Hoạt động tuần qua</h3>
                                    <div className="space-y-4">
                                        {weeklyStats.map((day, index) => (
                                            <div key={day.day} className="flex items-center space-x-4">
                                                <div className="w-8 text-sm font-medium text-gray-600">{day.day}</div>
                                                <div className="flex-1 flex items-center space-x-2">
                                                    {/* Threads bar */}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                            <span>Chủ đề</span>
                                                            <span>{day.threads}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <motion.div
                                                                className="bg-blue-500 h-2 rounded-full"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(day.threads / 25) * 100}%` }}
                                                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                                            />
                                                        </div>
                                                    </div>
                                                    {/* Arguments bar */}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                            <span>Luận điểm</span>
                                                            <span>{day.arguments}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                                            <motion.div
                                                                className="bg-green-500 h-2 rounded-full"
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${(day.arguments / 100) * 100}%` }}
                                                                transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recent Activities */}
                                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Hoạt động gần đây</h3>
                                    <div className="space-y-4">
                                        {recentActivities.map((activity, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    {getActivityIcon(activity.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-900">
                                                        <span className="font-medium">{activity.user}</span>
                                                        {' '}{activity.action}{' '}
                                                        <span className="font-medium text-blue-600">{activity.target}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Top Performing Threads */}
                            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6">Chủ đề nổi bật</h3>
                                <div className="space-y-4">
                                    {topThreads.map((thread, index) => (
                                        <motion.div
                                            key={thread.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                                        >
                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900 mb-1 line-clamp-1">{thread.title}</h4>
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>{thread.arguments} luận điểm</span>
                                                    <span>{thread.votes} bình chọn</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                {thread.trend === 'up' && <ArrowTrendingUpIcon className="h-4 w-4 text-green-500" />}
                                                {thread.trend === 'down' && <ArrowTrendingDownIcon className="h-4 w-4 text-red-500" />}
                                                {thread.trend === 'stable' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                                                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                                                    <EyeIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Threads Tab */}
                    {activeTab === 'threads' && (
                        <ThreadApprovalQueue userRole={userRole} />
                    )}

                    {/* Moderation Tab */}
                    {activeTab === 'moderation' && (
                        <ModerationQueue userRole={userRole} />
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <div className="bg-white p-12 rounded-xl shadow-lg border border-gray-200 text-center">
                            <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Phân tích chi tiết</h3>
                            <p className="text-gray-600 mb-6">Tính năng phân tích nâng cao đang được phát triển</p>
                            <button className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors">
                                Sắp ra mắt
                            </button>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
