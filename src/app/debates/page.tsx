'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button, Card, Input, Select } from '@/shared/components/ui'
import { useMediaQuery } from '@/shared/hooks'
import { DebateCard } from '@/modules/debate/components'
import { useDebates, useDebateThreads } from '@/modules/debate/hooks'
import { DEBATE_CATEGORIES, DIFFICULTY_LEVELS, DEBATE_CATEGORY_NAMES, DIFFICULTY_LEVEL_NAMES } from '@/shared/constants'
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
    const [sortBy, setSortBy] = useState('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
    const [showFilters, setShowFilters] = useState(false)
    const [hoveredStat, setHoveredStat] = useState<number | null>(null)

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
        status: '', // Empty means all statuses
        page: 1,
        limit: 20,
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

    // Use API data if available, fallback to mock data
    const finalDebates = apiThreads.length > 0 ? apiThreads.map(thread => ({
        id: thread._id,
        title: thread.title,
        description: thread.description,
        category: 'Tư tưởng HCM', // Default category since API doesn't have this field
        difficulty: 'medium' as const, // Default difficulty since API doesn't have this field
        status: thread.status.toLowerCase(),
        createdAt: thread.createdAt,
        updatedAt: thread.updatedAt,
        argumentCount: thread.totalArguments,
        viewCount: thread.totalVotes, // Using totalVotes as viewCount proxy
        author: {
            id: thread.createdBy._id,
            name: `${thread.createdBy.firstName} ${thread.createdBy.lastName}`,
            avatar: thread.createdBy.firstName?.[0]?.toUpperCase() || thread.createdBy.lastName?.[0]?.toUpperCase() || thread.createdBy.username?.[0]?.toUpperCase() || '👤'
        },
        // Additional API data
        totalApprovedArguments: thread.totalApprovedArguments,
        allowVoting: thread.allowVoting,
        allowArguments: thread.allowArguments,
        requireModeration: thread.requireModeration,
        isTicketRequest: thread.isTicketRequest,
        moderators: thread.moderators,
        modForSideA: thread.modForSideA,
        modForSideB: thread.modForSideB,
        // Computed fields
        isPinned: false, // Would come from user preferences
        isFeatured: thread.totalVotes > 5, // Mark as featured if many votes
        lastActivityAt: thread.updatedAt,
        authorId: thread.createdBy.username || thread.createdBy.email,
        tags: ['AI', 'Quyền riêng tư', 'Công nghệ'] // Default tags since API doesn't provide this
    })) : debates

    const isLoading = apiLoading || fallbackLoading
    const error = apiError || fallbackError
    const totalCount = apiMeta.total || fallbackTotalCount
    const totalPages = apiMeta.totalPages || fallbackTotalPages

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

    // Dynamic stats based on API data, fallback to mock data
    const stats = [
        {
            title: 'Tổng chủ đề',
            value: totalCount.toString(),
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
            title: 'Lượt tham gia',
            value: finalDebates.reduce((total, debate) => total + (debate.argumentCount || 0), 0).toString(),
            change: '+89 tuần này',
            icon: UsersIcon,
            color: 'from-green-500 to-green-600'
        },
        {
            title: 'Lượt xem',
            value: finalDebates.reduce((total, debate) => total + (debate.viewCount || 0), 0).toString(),
            change: '+234 tuần này',
            icon: EyeIcon,
            color: 'from-purple-500 to-purple-600'
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/50 dark:from-slate-900 dark:via-blue-900/20 dark:to-purple-900/30">
            {/* Luxury Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative overflow-hidden bg-gradient-to-r from-red-600 via-red-500 to-amber-500 dark:from-red-700 dark:via-red-600 dark:to-amber-600"
            >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full bg-repeat" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }} />
                </div>

                <div className="relative container mx-auto px-4 py-16 lg:py-24">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex-1"
                        >
                            <motion.h1
                                className="text-4xl lg:text-6xl font-bold text-white mb-4 font-serif tracking-tight"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                            >
                                Chủ đề tranh luận
                                <motion.span
                                    className="block text-xl lg:text-2xl font-light text-white/90 mt-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    Về tư tưởng Hồ Chí Minh
                                </motion.span>
                            </motion.h1>
                            <motion.p
                                className="text-lg text-white/85 max-w-2xl leading-relaxed"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                            >
                                Khám phá và tham gia thảo luận về các chủ đề tư tưởng Hồ Chí Minh.
                                Nơi giao lưu ý tưởng và phát triển tư duy phản biện.
                            </motion.p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Link href="/debates/create">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300"
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                                    />
                                    <span className="relative flex items-center gap-3">
                                        <PlusIcon className="h-6 w-6" />
                                        Tạo chủ đề mới
                                    </span>
                                </motion.button>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative bottom wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" className="w-full h-8 fill-slate-50 dark:fill-slate-900">
                        <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,69.3C960,85,1056,107,1152,112C1248,117,1344,107,1392,101.3L1440,96L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
                    </svg>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 -mt-4 relative z-10 space-y-12 pb-16">{/* Opening container div */}

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
                    {/* Decorative background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-amber-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
                    {/* Filter toggle for mobile */}
                    <div className="flex items-center justify-between mb-6 lg:hidden">
                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white font-geist">
                            Bộ lọc tìm kiếm
                        </h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <FunnelIcon className="h-4 w-4 mr-2" />
                            {showFilters ? 'Ẩn' : 'Hiện'} bộ lọc
                        </Button>
                    </div>

                    <AnimatePresence>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                                height: showFilters || isDesktop ? 'auto' : 0,
                                opacity: showFilters || isDesktop ? 1 : 0
                            }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Search */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        Tìm kiếm
                                    </label>
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

                                {/* Category filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        Danh mục
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Tất cả danh mục</option>
                                        {Object.entries(DEBATE_CATEGORY_NAMES).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Difficulty filter */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        Mức độ
                                    </label>
                                    <select
                                        value={selectedDifficulty}
                                        onChange={(e) => handleDifficultyChange(e.target.value)}
                                        className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                    >
                                        <option value="">Tất cả mức độ</option>
                                        {Object.entries(DIFFICULTY_LEVEL_NAMES).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sort */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                        Sắp xếp theo
                                    </label>
                                    <div className="flex gap-2">
                                        <select
                                            value={sortBy}
                                            onChange={(e) => handleSortChange(e.target.value)}
                                            className="flex-1 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                                        >
                                            <option value="date">Ngày tạo</option>
                                            <option value="popularity">Phổ biến</option>
                                            <option value="arguments">Số lượng tranh luận</option>
                                            <option value="views">Lượt xem</option>
                                        </select>
                                        <button
                                            onClick={handleSortOrderChange}
                                            className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
                                        >
                                            <ChevronUpDownIcon className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Filter summary and actions */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Hiển thị <span className="font-semibold text-neutral-900 dark:text-white">{finalDebates.length}</span> trong tổng số <span className="font-semibold text-neutral-900 dark:text-white">{totalCount}</span> chủ đề
                                </p>
                                {(searchTerm || selectedCategory || selectedDifficulty) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleResetFilters}
                                    >
                                        <XMarkIcon className="h-4 w-4 mr-2" />
                                        Xóa bộ lọc
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
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

                {/* Pagination */}
                {totalPages > 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <Card variant="glass" className="p-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="glass"
                                    disabled={currentPage === 1}
                                    onClick={() => loadDebates(currentPage - 1)}
                                    className="disabled:opacity-50"
                                >
                                    Trước
                                </Button>

                                <div className="flex items-center space-x-2">
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        const page = i + 1
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => loadDebates(page)}
                                                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200 ${currentPage === page
                                                    ? 'hcm-gradient-luxury text-white shadow-luxury'
                                                    : 'bg-white/60 text-neutral-600 hover:bg-white/80'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        )
                                    })}
                                </div>

                                <Button
                                    variant="glass"
                                    disabled={currentPage === totalPages}
                                    onClick={() => loadDebates(currentPage + 1)}
                                    className="disabled:opacity-50"
                                >
                                    Sau
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

            </div>{/* Closing container div */}
        </div>
    )
}