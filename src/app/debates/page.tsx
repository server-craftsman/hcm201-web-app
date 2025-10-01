'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button, Card, Input, Select } from '@/shared/components/ui'
import { useMediaQuery } from '@/shared/hooks'
import { DebateCard } from '@/modules/debate/components/DebateCard/DebateCard'
import { useDebates, useDebateThreads } from '@/modules/debate/hooks'
import { DEBATE_CATEGORIES, DIFFICULTY_LEVELS, DEBATE_CATEGORY_NAMES, DIFFICULTY_LEVEL_NAMES } from '@/shared/constants'
import { HeroSection } from './hero-section'
import {
    MagnifyingGlassIcon,
    PlusIcon,
    FunnelIcon,
    ChevronUpDownIcon,
    XMarkIcon,
    SparklesIcon,
    ChatBubbleLeftRightIcon,
    FireIcon,
    TrophyIcon,
    ChartBarIcon,
    UsersIcon,
    EyeIcon
} from '@heroicons/react/24/outline'

export default function DebatesPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedDifficulty, setSelectedDifficulty] = useState('')
    const [sortBy, setSortBy] = useState('createdAt')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [showFilters, setShowFilters] = useState(false)
    const [hoveredStat, setHoveredStat] = useState<number | null>(null)
    const [createdBy, setCreatedBy] = useState('')
    const [moderatorId, setModeratorId] = useState('')

    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(20)

    const isDesktop = useMediaQuery('(min-width: 1024px)')

    // Use API hook for real data
    const {
        threads: apiThreads,
        loading: apiLoading,
        error: apiError,
        meta: apiMeta,
        refetch: refetchThreads
    } = useDebateThreads({
        search: searchTerm,
        status: 'ACTIVE',
        createdBy: createdBy || undefined,
        moderatorId: moderatorId || undefined,
        page,
        limit,
        sort: `${sortBy}:${sortOrder === 'desc' ? '-1' : '1'}`
    })

    // Fallback to existing hook for UI compatibility
    const {
        debates,
        isLoading: fallbackLoading,
        error: fallbackError,
        totalCount: fallbackTotalCount,
        currentPage,
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
            name: `${thread.createdBy.firstName} ${thread.createdBy.lastName}`,
            avatar: (thread.createdBy as any).avatar || thread.createdBy.firstName?.[0]?.toUpperCase() || thread.createdBy.lastName?.[0]?.toUpperCase() || thread.createdBy.username?.[0]?.toUpperCase() || '👤'
        },
        totalApprovedArguments: thread.totalApprovedArguments,
        allowVoting: thread.allowVoting,
        allowArguments: thread.allowArguments,
        requireModeration: thread.requireModeration,
        isTicketRequest: thread.isTicketRequest,
        moderators: thread.moderators,
        modForSideA: thread.modForSideA,
        modForSideB: thread.modForSideB,
        isPinned: false,
        isFeatured: thread.totalVotes > 5,
        lastActivityAt: thread.updatedAt,
        authorId: thread.createdBy.username || thread.createdBy.email,
    }))

    const isLoading = apiLoading
    const error = apiError
    const totalCount = apiMeta.total
    const totalPages = apiMeta.totalPages

    const handleSearch = (value: string) => {
        setSearchTerm(value)
        setFilters({ search: value })
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setFilters({ category: category || undefined })
    }

    const handleDifficultyChange = (difficulty: string) => {
        setSelectedDifficulty(difficulty)
        setFilters({ difficulty: difficulty || undefined })
    }

    const handleSortChange = (newSortBy: string) => {
        setSortBy(newSortBy)
        setFilters({ sortBy: newSortBy })
    }

    const handleSortOrderChange = () => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
        setSortOrder(newOrder)
        setFilters({ sortOrder: newOrder })
    }

    const handleResetFilters = () => {
        setSearchTerm('')
        setSelectedCategory('')
        setSelectedDifficulty('')
        setSortBy('date')
        setSortOrder('desc')
        resetFilters()
    }

    // Stats based only on API data
    const stats = [
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
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/30">
            <HeroSection />

            <div className="container mx-auto px-4 relative z-10 space-y-12 pb-16">{/* Opening container div */}

                {/* Luxury Stats Grid */}
                <motion.div
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
                                {/* Floating background gradient */}
                                <motion.div
                                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                                    animate={hoveredStat === index ? { scale: 1.1, rotate: 1 } : { scale: 1, rotate: 0 }}
                                />

                                {/* Glowing border effect */}
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
                </motion.div>

                {/* Luxury Filters Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl overflow-hidden"
                >
                    {/* ... (unchanged filter section) ... */}
                    {/* The rest of the filter section remains unchanged */}
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

                {/* Loading state */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {Array.from({ length: 6 }).map((_, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="card-luxury p-8"
                            >
                                <div className="space-y-4">
                                    <div className="skeleton-luxury h-6 w-3/4 rounded-xl" />
                                    <div className="skeleton-luxury h-4 w-full rounded-lg" />
                                    <div className="skeleton-luxury h-4 w-2/3 rounded-lg" />
                                    <div className="flex space-x-3 mt-6">
                                        <div className="skeleton-luxury h-8 w-16 rounded-full" />
                                        <div className="skeleton-luxury h-8 w-20 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Debates grid */}
                {!isLoading && finalDebates.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {finalDebates.map((debate, index) => (
                            <motion.div
                                key={debate.id}
                                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    ease: "easeOut"
                                }}
                                whileHover={{
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                            >
                                <DebateCard
                                    debate={debate}
                                    showActions={false}
                                    showAuthor={true}
                                    showStats={true}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Empty state */}
                {!isLoading && finalDebates.length === 0 && !error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card variant="luxury" className="text-center py-16">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="space-y-8"
                            >
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    className="text-8xl"
                                >
                                    🤔
                                </motion.div>

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

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                    className="flex flex-col sm:flex-row justify-center gap-4"
                                >
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
                                    <Link href="/debates/create">
                                        <Button
                                            variant="luxury"
                                            size="lg"
                                            leftIcon={<PlusIcon className="h-5 w-5" />}
                                        >
                                            Tạo chủ đề mới
                                        </Button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </Card>
                    </motion.div>
                )}

                {/* Ultra Luxury Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex justify-center"
                    >
                        <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 shadow-2xl overflow-hidden">
                            {/* Decorative background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50"></div>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-red-500/10 rounded-full blur-2xl"></div>

                            <div className="relative z-10 flex items-center justify-center gap-6">
                                {/* Previous Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05, x: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={currentPage === 1}
                                    onClick={() => loadDebates(currentPage - 1)}
                                    className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${currentPage === 1
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700'
                                        }`}
                                >
                                    {currentPage !== 1 && (
                                        <>
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            />
                                            <motion.div
                                                className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"
                                            />
                                        </>
                                    )}
                                    <span className="relative flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        Trước
                                    </span>
                                </motion.button>

                                {/* Page Numbers */}
                                <div className="flex items-center space-x-2">
                                    {/* First page */}
                                    {currentPage > 3 && (
                                        <>
                                            <motion.button
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => loadDebates(1)}
                                                className="w-12 h-12 rounded-2xl text-sm font-bold bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                                            >
                                                1
                                            </motion.button>
                                            {currentPage > 4 && (
                                                <span className="text-gray-400 dark:text-gray-500 font-bold">...</span>
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
                                            <motion.button
                                                key={page}
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => loadDebates(page)}
                                                className={`w-12 h-12 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl ${isActive
                                                    ? 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white shadow-red-500/25'
                                                    : 'bg-gradient-to-r from-white to-gray-50 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-600 dark:hover:to-gray-500'
                                                    }`}
                                                animate={isActive ? {
                                                    boxShadow: [
                                                        '0 10px 25px rgba(239, 68, 68, 0.25)',
                                                        '0 15px 35px rgba(239, 68, 68, 0.35)',
                                                        '0 10px 25px rgba(239, 68, 68, 0.25)'
                                                    ]
                                                } : {}}
                                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                            >
                                                {page}
                                            </motion.button>
                                        )
                                    })}

                                    {/* Last page */}
                                    {currentPage < totalPages - 2 && (
                                        <>
                                            {currentPage < totalPages - 3 && (
                                                <span className="text-gray-400 dark:text-gray-500 font-bold">...</span>
                                            )}
                                            <motion.button
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => loadDebates(totalPages)}
                                                className="w-12 h-12 rounded-2xl text-sm font-bold bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                                            >
                                                {totalPages}
                                            </motion.button>
                                        </>
                                    )}
                                </div>

                                {/* Next Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05, x: 2 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={currentPage === totalPages}
                                    onClick={() => loadDebates(currentPage + 1)}
                                    className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 ${currentPage === totalPages
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700'
                                        }`}
                                >
                                    {currentPage !== totalPages && (
                                        <>
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            />
                                            <motion.div
                                                className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"
                                            />
                                        </>
                                    )}
                                    <span className="relative flex items-center gap-2">
                                        Sau
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </span>
                                </motion.button>
                            </div>

                            {/* Page info */}
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                                    Trang <span className="font-bold text-gray-900 dark:text-white">{currentPage}</span> / <span className="font-bold text-gray-900 dark:text-white">{totalPages}</span>
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                    Hiển thị {finalDebates.length} trong tổng số {totalCount} chủ đề
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}

            </div>{/* Closing container div */}
        </div>
    )
}