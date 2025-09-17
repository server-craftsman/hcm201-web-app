'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button } from '@/shared/components/ui'
import { useUserDashboard } from '../../hooks/useUserDashboard'
import { formatRelativeTime, cn } from '@/shared/utils'

interface DashboardProps {
    className?: string
}

export const Dashboard: React.FC<DashboardProps> = ({ className }) => {
    const {
        stats,
        activity,
        isLoading,
        error,
        loadDashboard,
        clearError
    } = useUserDashboard()

    useEffect(() => {
        loadDashboard()
    }, [loadDashboard])

    if (isLoading) {
        return (
            <div className={cn('space-y-6', className)}>
                {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="skeleton h-32 rounded-lg"></div>
                ))}
            </div>
        )
    }

    if (error) {
        return (
            <Card className="text-center p-8">
                <div className="space-y-4">
                    <div className="text-error-600 text-lg">⚠️ Có lỗi xảy ra</div>
                    <p className="text-neutral-600">{error}</p>
                    <div className="flex justify-center gap-3">
                        <Button onClick={clearError} variant="outline">
                            Đóng
                        </Button>
                        <Button onClick={loadDashboard} variant="default">
                            Thử lại
                        </Button>
                    </div>
                </div>
            </Card>
        )
    }

    return (
        <div className={cn('space-y-6', className)}>
            {/* Welcome section */}
            <Card className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white" padding="lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold">
                            Chào mừng trở lại! 👋
                        </h1>
                        <p className="text-primary-100">
                            Tiếp tục hành trình khám phá tư tưởng Hồ Chí Minh của bạn
                        </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-3">
                        <Button variant="secondary" size="lg">
                            🗣️ Tạo tranh luận
                        </Button>
                        <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary-600">
                            📚 Học tập ngay
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Stats overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="text-center" padding="lg">
                    <div className="space-y-2">
                        <div className="text-3xl font-bold text-primary-600">
                            {stats?.totalDebates || 0}
                        </div>
                        <div className="text-sm text-neutral-600">Tranh luận đã tạo</div>
                    </div>
                </Card>

                <Card className="text-center" padding="lg">
                    <div className="space-y-2">
                        <div className="text-3xl font-bold text-secondary-600">
                            {stats?.totalArguments || 0}
                        </div>
                        <div className="text-sm text-neutral-600">Luận điểm đã đóng góp</div>
                    </div>
                </Card>

                <Card className="text-center" padding="lg">
                    <div className="space-y-2">
                        <div className="text-3xl font-bold text-success-600">
                            {Math.floor((stats?.studyProgress || 0) / 60)}h {(stats?.studyProgress || 0) % 60}m
                        </div>
                        <div className="text-sm text-neutral-600">Thời gian học tập</div>
                    </div>
                </Card>

                <Card className="text-center" padding="lg">
                    <div className="space-y-2">
                        <div className="text-3xl font-bold text-warning-600">
                            {stats?.studyProgress || 0}
                        </div>
                        <div className="text-sm text-neutral-600">Ngày liên tiếp</div>
                    </div>
                </Card>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent activity */}
                <div className="lg:col-span-2">
                    <Card padding="lg">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-neutral-900">
                                    Hoạt động gần đây
                                </h2>
                                <Button variant="ghost" size="sm">
                                    Xem tất cả →
                                </Button>
                            </div>

                            {activity && activity.length > 0 ? (
                                <div className="space-y-4">
                                    {activity.slice(0, 5).map((item) => (
                                        <div key={item.id} className="flex items-start gap-4 p-4 border border-neutral-200 rounded-lg">
                                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                                {getActivityIcon(item.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-neutral-900 truncate">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    <span className="text-xs text-neutral-500">
                                                        {formatRelativeTime(item.date)}
                                                    </span>
                                                    {typeof (item as any).points === 'number' && (
                                                        <span className="text-xs bg-success-100 text-success-700 px-2 py-1 rounded">
                                                            +{(item as any).points} điểm
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-neutral-500">
                                    <div className="text-4xl mb-4">📝</div>
                                    <p>Chưa có hoạt động nào gần đây</p>
                                    <p className="text-sm mt-2">Hãy bắt đầu tham gia thảo luận hoặc học tập!</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Study progress */}
                    <Card padding="lg">
                        <div className="space-y-4">
                            <h3 className="font-bold text-neutral-900">Tiến độ học tập</h3>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-neutral-600">Thẻ đã hoàn thành</span>
                                        <span className="text-sm font-medium">{stats?.studyProgress || 0}</span>
                                    </div>
                                    <div className="w-full bg-neutral-200 rounded-full h-2">
                                        <div
                                            className="bg-success-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${Math.min(((stats?.studyProgress || 0) / 100) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-neutral-600">Cần ôn tập</span>
                                        <span className="text-sm font-medium text-warning-600">
                                            {stats?.upcomingReviews || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <Button variant="success" size="sm" className="w-full">
                                📚 Tiếp tục học tập
                            </Button>
                        </div>
                    </Card>

                    {/* Achievements */}
                    <Card padding="lg">
                        <div className="space-y-4">
                            <h3 className="font-bold text-neutral-900">Thành tích</h3>

                            {stats?.achievements && stats.achievements.length > 0 ? (
                                <div className="space-y-3">
                                    {stats.achievements.slice(0, 3).map((achievement: any, index: number) => (
                                        <div key={index} className="flex items-center gap-3 p-3 bg-success-50 rounded-lg">
                                            <div className="text-2xl">{achievement.icon || '🏆'}</div>
                                            <div className="flex-1">
                                                <div className="font-medium text-sm">{achievement.name}</div>
                                                <div className="text-xs text-neutral-600">{achievement.description}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-neutral-500">
                                    <div className="text-3xl mb-2">🏆</div>
                                    <p className="text-sm">Chưa có thành tích nào</p>
                                </div>
                            )}

                            <Button variant="outline" size="sm" >
                                Xem tất cả thành tích
                            </Button>
                        </div>
                    </Card>

                    {/* Study areas */}
                    <Card padding="lg">
                        <div className="space-y-4">
                            <h3 className="font-bold text-neutral-900">Lĩnh vực học tập</h3>

                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm font-medium text-neutral-700 mb-2">Điểm mạnh</div>
                                    {stats?.strongAreas && stats.strongAreas.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {stats.strongAreas.slice(0, 3).map((area: string, index: number) => (
                                                <span key={index} className="px-2 py-1 bg-success-100 text-success-700 text-xs rounded">
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-neutral-500">Chưa xác định</p>
                                    )}
                                </div>

                                <div>
                                    <div className="text-sm font-medium text-neutral-700 mb-2">Cần cải thiện</div>
                                    {stats?.weakAreas && stats.weakAreas.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {stats.weakAreas.slice(0, 3).map((area: string, index: number) => (
                                                <span key={index} className="px-2 py-1 bg-warning-100 text-warning-700 text-xs rounded">
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-neutral-500">Tất cả đều tốt! 🎉</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

// Helper function to get activity icon
function getActivityIcon(type: string): string {
    switch (type) {
        case 'debate_created': return '🗣️'
        case 'argument_submitted': return '💭'
        case 'comment_posted': return '💬'
        case 'study_session_completed': return '📚'
        case 'achievement_unlocked': return '🏆'
        default: return '📝'
    }
}