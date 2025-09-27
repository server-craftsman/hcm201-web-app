'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'framer-motion'
import {
    ChatBubbleLeftRightIcon,
    EyeIcon,
    UserIcon,
    ClockIcon,
    PencilIcon,
    TrashIcon,
    MapPinIcon,
    StarIcon,
    TagIcon,
    SparklesIcon
} from '@heroicons/react/24/outline'
import {
    StarIcon as StarSolidIcon,
    MapPinIcon as PinSolidIcon
} from '@heroicons/react/24/solid'
import { Card, CardContent, CardHeader, Button } from '@/shared/components/ui'
import { DebateTopic } from '@/shared/types'
import { formatRelativeTime, formatDate, cn } from '@/shared/utils'
import { DEBATE_CATEGORY_NAMES, DIFFICULTY_LEVEL_NAMES } from '@/shared/constants'

interface DebateCardProps {
    debate: DebateTopic
    showActions?: boolean
    showAuthor?: boolean
    showStats?: boolean
    variant?: 'default' | 'compact' | 'featured'
    onEdit?: () => void
    onDelete?: () => void
    onPin?: () => void
    onFeature?: () => void
    className?: string
}

export const DebateCard: React.FC<DebateCardProps> = ({
    debate,
    showActions = false,
    showAuthor = true,
    showStats = true,
    variant = 'default',
    onEdit,
    onDelete,
    onPin,
    onFeature,
    className,
}) => {
    const categoryName = DEBATE_CATEGORY_NAMES[debate.category as keyof typeof DEBATE_CATEGORY_NAMES] || debate.category
    const difficultyName = DIFFICULTY_LEVEL_NAMES[debate.difficulty as keyof typeof DIFFICULTY_LEVEL_NAMES] || debate.difficulty

    const getDifficultyVariant = (difficulty: string) => {
        switch (difficulty) {
            case 'basic': return 'text-success-600 bg-success-100/80 border border-success-200 shadow-success-100/50'
            case 'intermediate': return 'text-warning-600 bg-warning-100/80 border border-warning-200 shadow-warning-100/50'
            case 'advanced': return 'text-destructive bg-destructive/10 border border-destructive/20 shadow-destructive/10'
            default: return 'text-muted-foreground bg-muted/80 border border-muted-200'
        }
    }

    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95,
            filter: 'blur(4px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
                duration: 0.6,
                type: 'tween'
            }
        }
    }

    const hoverVariants = {
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                duration: 0.3,
                ease: 'easeOut'
            }
        }
    }

    const isCompact = variant === 'compact'
    const isFeatured = variant === 'featured'

    return (
        <motion.div
            variants={cardVariants as any}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={cn('block', className)}
        >
            <Card
                variant={isFeatured ? "luxury" : "glass"}
                className={cn(
                    'group relative overflow-hidden backdrop-blur-sm border-0',
                    'bg-gradient-to-br from-white/90 via-white/80 to-primary-50/30',
                    'shadow-luxury hover:shadow-luxury-lg',
                    isFeatured && 'ring-2 ring-primary-300/50 bg-gradient-to-br from-primary-50/90 to-secondary-50/80',
                    isCompact && 'p-3',
                    'before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none'
                )}
            >
                {/* Status badges */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <AnimatePresence>
                        {debate.isFeatured && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                exit={{ opacity: 0, scale: 0, rotate: 180 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 hcm-gradient-luxury text-white rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm"
                            >
                                <StarSolidIcon className="h-3.5 w-3.5 animate-luxury-glow" />
                                <span>Nổi bật</span>
                            </motion.div>
                        )}
                        {debate.isPinned && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0, y: -20 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-full text-xs font-semibold shadow-lg backdrop-blur-sm"
                            >
                                <PinSolidIcon className="h-3.5 w-3.5" />
                                <span>Ghim</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 hcm-gradient-luxury opacity-60" />
                <div className="absolute -top-20 -right-20 w-32 h-32 bg-primary-200/20 rounded-full blur-2xl group-hover:bg-primary-300/30 transition-colors duration-500" />

                <CardHeader className={cn("space-y-3 relative z-10 pb-3", isCompact && "p-3")}>
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/debates/${debate.id}`}
                                className="block group-hover:text-primary-600 transition-colors duration-300"
                            >
                                <motion.h3
                                    className={cn(
                                        'font-bold text-neutral-800 line-clamp-2 leading-tight',
                                        isCompact ? 'text-sm' : 'text-lg',
                                        'group-hover:hcm-text-gradient-luxury transition-all duration-300'
                                    )}
                                    whileHover={{ scale: 1.01 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {debate.title}
                                </motion.h3>
                            </Link>

                            {!isCompact && (
                                <motion.p
                                    className="text-neutral-600 text-sm line-clamp-2 mt-2 leading-relaxed"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                >
                                    {debate.description}
                                </motion.p>
                            )}
                        </div>

                        {showActions && (
                            <motion.div
                                className="flex items-center gap-1"
                                initial={{ opacity: 0, x: 20 }}
                                whileHover={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {onEdit && (
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="glass"
                                            size="icon"
                                            onClick={onEdit}
                                            className="h-6 w-6 hover:shadow-lg"
                                        >
                                            <PencilIcon className="h-3 w-3" />
                                        </Button>
                                    </motion.div>
                                )}
                                {onPin && (
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="glass"
                                            size="icon"
                                            onClick={onPin}
                                            className="h-6 w-6 hover:shadow-lg"
                                        >
                                            <MapPinIcon className="h-3 w-3" />
                                        </Button>
                                    </motion.div>
                                )}
                                {onFeature && (
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="glass"
                                            size="icon"
                                            onClick={onFeature}
                                            className="h-6 w-6 hover:shadow-lg"
                                        >
                                            <StarIcon className="h-3 w-3" />
                                        </Button>
                                    </motion.div>
                                )}
                                {onDelete && (
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="glass"
                                            size="icon"
                                            onClick={onDelete}
                                            className="h-6 w-6 text-destructive hover:text-destructive hover:shadow-lg"
                                        >
                                            <TrashIcon className="h-3 w-3" />
                                        </Button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Tags and metadata - Compact Version */}
                    <motion.div
                        className="flex flex-wrap items-center gap-1.5"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-1 px-2 py-1 hcm-gradient-luxury text-white rounded-md text-xs font-medium shadow-sm"
                            whileHover={{ scale: 1.05 }}
                        >
                            <SparklesIcon className="h-3 w-3" />
                            Tư tưởng HCM
                        </motion.span>

                        <motion.div
                            className={cn(
                                "inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium",
                                debate.status === 'active' ?
                                    'bg-green-100 text-green-700' :
                                    debate.status === 'closed' ?
                                        'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                            )}
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className={cn(
                                "w-2 h-2 rounded-full",
                                debate.status === 'active' ? 'bg-green-500' :
                                    debate.status === 'closed' ? 'bg-red-500' :
                                        'bg-yellow-500'
                            )} />
                            {debate.status === 'active' ? 'Hoạt động' :
                                debate.status === 'closed' ? 'Đã đóng' : 'Chờ duyệt'}
                        </motion.div>

                        {/* Compact Features */}
                        {(debate as any).allowVoting && (
                            <motion.span
                                className="inline-flex items-center px-1.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                                whileHover={{ scale: 1.05 }}
                                title="Cho phép bình chọn"
                            >
                                Bỏ phiếu
                            </motion.span>
                        )}

                        {(debate as any).requireModeration && (
                            <motion.span
                                className="inline-flex items-center px-1.5 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium"
                                whileHover={{ scale: 1.05 }}
                                title="Yêu cầu kiểm duyệt"
                            >
                                Kiểm duyệt
                            </motion.span>
                        )}

                        {/* Tags - Only show first 2 */}
                        {debate.tags?.slice(0, 2).map((tag, index) => (
                            <motion.span
                                key={index}
                                className="inline-flex items-center px-1.5 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                {tag}
                            </motion.span>
                        ))}
                    </motion.div>
                </CardHeader>

                <CardContent className={cn("pt-0 relative z-10 p-4", isCompact && "p-3")}>
                    {/* Author and stats */}
                    <motion.div
                        className="flex items-center justify-between text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        {/* Left side: Author info */}
                        {showAuthor && debate.author && (
                            <motion.div
                                className="flex items-center gap-2"
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="w-6 h-6 hcm-gradient-luxury rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {debate.author.avatar === '👤' ? '👤' : (debate.author.avatar || debate.author.name?.charAt(0)?.toUpperCase() || '👤')}
                                </div>
                                <span className="font-medium text-neutral-700 text-sm">
                                    {debate.author.name}
                                </span>
                            </motion.div>
                        )}

                        {/* Right side: Time */}
                        <div className="flex items-center gap-1 text-neutral-500">
                            <ClockIcon className="h-3 w-3" />
                            <span className="text-xs">
                                {formatRelativeTime(debate.createdAt)}
                            </span>
                        </div>
                    </motion.div>

                    {/* Stats Section */}
                    {showStats && (
                        <motion.div
                            className="flex items-center justify-between mt-3 pt-3 border-t border-neutral-200/50"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                        >
                            {/* Stats Row */}
                            <div className="flex items-center gap-4 text-neutral-600 text-xs">
                                <motion.div
                                    className="flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    title="Luận điểm"
                                >
                                    <ChatBubbleLeftRightIcon className="h-3 w-3" />
                                    <span>{debate.argumentCount || 0}</span>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    title="Đã duyệt"
                                >
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{(debate as any).totalApprovedArguments || 0}</span>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-1"
                                    whileHover={{ scale: 1.05 }}
                                    title="Bình chọn"
                                >
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5T6.5 15a2.5 2.5 0 002.5-2.5V6.5z" />
                                    </svg>
                                    <span>{debate.viewCount || 0}</span>
                                </motion.div>
                            </div>

                            {/* Moderators info */}
                            {(debate as any).moderators && (debate as any).moderators.length > 0 && (
                                <div className="flex items-center gap-1 text-xs text-neutral-500">
                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span>{(debate as any).moderators.length} KDV</span>
                                </div>
                            )}
                        </motion.div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    )
}