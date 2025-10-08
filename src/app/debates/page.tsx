'use client'

import React, { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '@/shared/components/ui'
import { useMediaQuery } from '@/shared/hooks'
import { DebateCard } from '@/modules/debate/components/DebateCard/DebateCard'
import { useDebates, useDebateThreads } from '@/modules/debate/hooks'
import { HeroSection } from './hero-section'
import {
    MagnifyingGlassIcon,
    PlusIcon,
    ChevronUpDownIcon,
    XMarkIcon,
    ChatBubbleLeftRightIcon,
    FireIcon,
    UsersIcon,
    EyeIcon
} from '@heroicons/react/24/outline'

export default function DebatesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedDifficulty, setSelectedDifficulty] = useState('')
    const [sortBy, setSortBy] = useState('popular')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [currentPage, setCurrentPage] = useState(1)
    // API filters
    const [statusFilter, setStatusFilter] = useState<string>('ACTIVE')
    const [createdBy, setCreatedBy] = useState<string>('')
    const [moderatorId, setModeratorId] = useState<string>('')
    const [limit, setLimit] = useState<number>(20)
    const [minimum, setMinimum] = useState<number>(1)
    const [maximum, setMaximum] = useState<number>(100)

    const isDesktop = useMediaQuery('(min-width: 1024px)')

    // Use API hook for real data with all parameters
    const {
        threads: apiThreads,
        loading: apiLoading,
        error: apiError,
        meta: apiMeta,
        refetch: refetchThreads
    } = useDebateThreads({
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        createdBy: createdBy || undefined,
        moderatorId: moderatorId || undefined,
        page: currentPage,
        limit: Math.min(Math.max(limit, minimum), maximum), // Ensure limit is within bounds
        sort: sortBy // Use the sort parameter directly as expected by API
    })

    // Fallback to existing hook for UI compatibility
    const {
        debates,
        isLoading: fallbackLoading,
        error: fallbackError,
        totalCount: fallbackTotalCount,
        currentPage: fallbackCurrentPage,
        totalPages: fallbackTotalPages,
        loadDebates,
        setFilters,
        resetFilters,
        clearError
    } = useDebates({
        filters: {
            search: searchTerm,
            category: selectedCategory,
            difficulty: selectedDifficulty,
            sortBy,
            sortOrder,
        }
    })

    // Only use API data, no dummy/mocked data
    const finalDebates = apiThreads.map(thread => ({
        id: thread._id,
        title: thread.title,
        description: thread.description,
        status: thread.status?.toLowerCase() || '',
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
        argumentCount: thread.totalArguments,
        viewCount: thread.totalVotes,
        author: {
            id: thread.createdBy._id,
            name: `${thread.createdBy.firstName || ''} ${thread.createdBy.lastName || ''}`.trim() || thread.createdBy.username || 'User',
            avatar: (thread.createdBy as any).avatar || thread.createdBy.firstName?.[0]?.toUpperCase() || thread.createdBy.lastName?.[0]?.toUpperCase() || thread.createdBy.username?.[0]?.toUpperCase() || '👤'
        },
        totalApprovedArguments: thread.totalApprovedArguments,
        allowVoting: thread.allowVoting,
        allowArguments: thread.allowArguments,
        requireModeration: thread.requireModeration,
        isTicketRequest: thread.isTicketRequest,
        moderators: thread.moderators,
        modForSideA: thread.modForSideA as any,
        modForSideB: thread.modForSideB as any,
        isPinned: false,
        isFeatured: thread.totalVotes > 5,
        lastActivityAt: thread.updatedAt,
        authorId: thread.createdBy.username || thread.createdBy.email,
    }))

    const isLoading = apiLoading
    const error = apiError
    const totalCount = apiMeta.total
    const totalPages = apiMeta.totalPages

    const handleSearch = useCallback((value: string) => {
        setSearchTerm(value)
        setCurrentPage(1)
        setFilters({ search: value })
    }, [setFilters])

    const handleCategoryChange = useCallback((category: string) => {
        setSelectedCategory(category)
        setFilters({ category: category || undefined })
    }, [setFilters])

    const handleDifficultyChange = useCallback((difficulty: string) => {
        setSelectedDifficulty(difficulty)
        setFilters({ difficulty: difficulty || undefined })
    }, [setFilters])

    const handleSortChange = useCallback((newSortBy: string) => {
        setSortBy(newSortBy)
        setFilters({ sortBy: newSortBy })
    }, [setFilters])

    const handleLimitChange = useCallback((newLimit: number) => {
        const clampedLimit = Math.min(Math.max(newLimit, minimum), maximum)
        setLimit(clampedLimit)
        setCurrentPage(1) // Reset to first page when limit changes
    }, [minimum, maximum])

    const handleMinimumChange = useCallback((newMinimum: number) => {
        setMinimum(newMinimum)
        if (limit < newMinimum) {
            setLimit(newMinimum)
        }
    }, [limit])

    const handleMaximumChange = useCallback((newMaximum: number) => {
        setMaximum(newMaximum)
        if (limit > newMaximum) {
            setLimit(newMaximum)
        }
    }, [limit])

    const handleSortOrderChange = useCallback(() => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
        setSortOrder(newOrder)
        setFilters({ sortOrder: newOrder })
    }, [sortOrder, setFilters])

    const handleResetFilters = useCallback(() => {
        setSearchTerm('')
        setSelectedCategory('')
        setSelectedDifficulty('')
        setSortBy('popular')
        setSortOrder('desc')
        setCurrentPage(1)
        setStatusFilter('ACTIVE')
        setCreatedBy('')
        setModeratorId('')
        setLimit(20)
        setMinimum(1)
        setMaximum(100)
        resetFilters()
    }, [resetFilters])

    // Memoized stats based only on API data
    const stats = useMemo(() => [
        {
            title: 'Tổng chủ đề',
            value: (totalCount || 0).toString(),
            change: '+12 tuần này',
            icon: ChatBubbleLeftRightIcon,
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Đang hoạt động',
            value: finalDebates.filter(d => d.status === 'active').length.toString(),
            change: '+5 hôm nay',
            icon: FireIcon,
            color: 'from-red-500 to-red-600'
        },
        {
            title: 'Tổng luận điểm',
            value: finalDebates.reduce((total, debate) => total + (debate.argumentCount || 0), 0).toString(),
            change: '+89 tuần này',
            icon: UsersIcon,
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'Tổng bình chọn',
            value: finalDebates.reduce((total, debate) => total + (debate.viewCount || 0), 0).toString(),
            change: '+234 tuần này',
            icon: EyeIcon,
            color: 'from-purple-500 to-purple-600'
        }
    ], [totalCount, finalDebates])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/30">
            <HeroSection />

            <div className="container mx-auto px-4 relative z-10 space-y-12 pb-16">{/* Opening container div */}

                {/* Luxury Stats Grid */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 60, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{
                                duration: 0.6,
                                delay: 0.5 + index * 0.1,
                                type: "spring",
                                stiffness: 100
                            }}
                            onMouseEnter={() => setHoveredStat(index)}
                            onMouseLeave={() => setHoveredStat(null)}
                            className="group relative"
                        >
                            <motion.div
                                className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                                whileHover={{ y: -8, scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                                    animate={hoveredStat === index ? { scale: 1.1, rotate: 1 } : { scale: 1, rotate: 0 }}
                                />

                                <motion.div
                                    className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500`}
                                    animate={hoveredStat === index ? { scale: 1.05 } : { scale: 1 }}
                                />

                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-6">
                                        <motion.div
                                            className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                                            whileHover={{ rotate: 5, scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        >
                                            <stat.icon className="h-8 w-8 text-white drop-shadow-sm" />
                                        </motion.div>
                                        <motion.span
                                            className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.7 + index * 0.1 }}
                                        >
                                            {stat.change}
                                        </motion.span>
                                    </div>

                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 + index * 0.1 }}
                                    >
                                        <motion.p
                                            className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {stat.value}
                                        </motion.p>
                                        <p className="text-slate-600 dark:text-slate-400 font-medium text-sm tracking-wide">
                                            {stat.title}
                                        </p>
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div> */}

                {/* Luxury Filters Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 mt-8 border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
                >
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-amber-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-2xl" />

                    {/* Filters grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                        {/* Search */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Tìm kiếm</label>
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm chủ đề..."
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                />
                            </div>
                        </div>

                        {/* Sort field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Sắp xếp</label>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSortChange(e.target.value)}
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            >
                                <option value="popular">Phổ biến</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="newest">Mới nhất</option>
                                <option value="most_arguments">Nhiều luận điểm nhất</option>
                                {/* <option value="most_views">Nhiều lượt xem nhất</option> */}
                            </select>
                        </div>

                        {/* Limit */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Số mục/trang</label>
                            <input
                                type="number"
                                min={minimum}
                                max={maximum}
                                value={limit}
                                onChange={(e) => handleLimitChange(parseInt(e.target.value || '20'))}
                                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                            />
                        </div>
                    </div>

                    {/* Filter summary and actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 mt-6 border-t border-neutral-200 dark:border-neutral-700 relative z-10">
                        <div className="space-y-2">
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Trang <span className="font-semibold text-neutral-900 dark:text-white">{currentPage}</span> • Hiển thị <span className="font-semibold text-neutral-900 dark:text-white">{finalDebates.length}</span> mục / trang
                            </p>
                        </div>
                        {(searchTerm || statusFilter !== 'ACTIVE' || createdBy || moderatorId || limit !== 20 || sortBy !== 'popular' || minimum !== 1 || maximum !== 100) && (
                            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                                <XMarkIcon className="h-4 w-4 mr-2" />
                                Xóa bộ lọc
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Error message */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card variant="luxury" className="border-red-200 bg-red-50/80">
                                <div className="p-6 flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                                            <XMarkIcon className="h-5 w-5 text-red-600" />
                                        </div>
                                        <p className="text-red-800 font-medium">{error}</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={clearError}>
                                        <XMarkIcon className="h-5 w-5" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Simplified loading state */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                                <div className="space-y-4">
                                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-full" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                    <div className="flex space-x-3 mt-6">
                                        <div className="h-8 bg-gray-200 rounded-full w-16" />
                                        <div className="h-8 bg-gray-200 rounded-full w-20" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Simplified debates grid */}
                {!isLoading && finalDebates.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {finalDebates.map((debate) => (
                            <div key={debate.id} className="hover:transform hover:scale-105 transition-transform duration-200">
                                <DebateCard
                                    debate={debate}
                                    showActions={false}
                                    showAuthor={true}
                                    showStats={true}
                                    variant="featured"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Simplified empty state */}
                {!isLoading && finalDebates.length === 0 && !error && (
                    <Card variant="luxury" className="text-center py-16">
                        <div className="space-y-8">
                            <div className="text-8xl">🤔</div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold text-neutral-800 font-serif">
                                    Không tìm thấy chủ đề tranh luận
                                </h3>
                                <p className="text-lg text-neutral-600 max-w-2xl mx-auto leading-relaxed">
                                    {searchTerm || selectedCategory || selectedDifficulty
                                        ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm để xem nhiều kết quả hơn.'
                                        : 'Chưa có chủ đề tranh luận nào. Hãy tạo chủ đề đầu tiên!'
                                    }
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                {(searchTerm || selectedCategory || selectedDifficulty) && (
                                    <Button
                                        variant="glass"
                                        size="lg"
                                        onClick={handleResetFilters}
                                        leftIcon={<XMarkIcon className="h-5 w-5" />}
                                    >
                                        Xóa bộ lọc
                                    </Button>
                                )}
                                <Link href="/debates/request">
                                    <Button
                                        variant="luxury"
                                        size="lg"
                                        leftIcon={<PlusIcon className="h-5 w-5" />}
                                    >
                                        Tạo chủ đề mới
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Beautiful Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                            <div className="flex items-center justify-center gap-3">
                                {/* Previous Button */}
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:scale-105'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    Trước
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center space-x-2">
                                    {/* First page */}
                                    {currentPage > 3 && (
                                        <>
                                            <button
                                                onClick={() => setCurrentPage(1)}
                                                className="w-10 h-10 rounded-xl text-sm font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:scale-105"
                                            >
                                                1
                                            </button>
                                            {currentPage > 4 && (
                                                <span className="text-gray-400 font-bold">...</span>
                                            )}
                                        </>
                                    )}

                                    {/* Page range */}
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let page: number
                                        if (totalPages <= 5) {
                                            page = i + 1
                                        } else if (currentPage <= 3) {
                                            page = i + 1
                                        } else if (currentPage >= totalPages - 2) {
                                            page = totalPages - 4 + i
                                        } else {
                                            page = currentPage - 2 + i
                                        }

                                        const isActive = currentPage === page
                                        const isVisible = page >= 1 && page <= totalPages

                                        if (!isVisible) return null

                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 ${isActive
                                                    ? 'bg-[#dc2626] text-white shadow-lg shadow-red-500/25'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    })}

                                    {/* Last page */}
                                    {currentPage < totalPages - 2 && (
                                        <>
                                            {currentPage < totalPages - 3 && (
                                                <span className="text-gray-400 font-bold">...</span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(totalPages)}
                                                className="w-10 h-10 rounded-xl text-sm font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 hover:scale-105"
                                            >
                                                {totalPages}
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Next Button */}
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    className={`group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 ${currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 hover:shadow-lg hover:scale-105'
                                        }`}
                                >
                                    Sau
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            {/* Page info */}
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600 font-medium">
                                    Trang <span className="font-bold text-gray-900">{currentPage}</span> / <span className="font-bold text-gray-900">{totalPages}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Hiển thị <span className="font-semibold">{finalDebates.length}</span> trong tổng số <span className="font-semibold">{totalCount}</span> chủ đề
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </div>{/* Closing container div */}
        </div>
    )
}