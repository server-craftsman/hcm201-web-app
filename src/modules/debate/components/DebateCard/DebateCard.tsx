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

                <CardHeader className={cn("space-y-4 relative z-10", isCompact && "p-4")}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/debates/${debate.id}`}
                                className="block group-hover:text-primary-600 transition-colors duration-300"
                            >
                                <motion.h3
                                    className={cn(
                                        'font-bold text-neutral-800 line-clamp-2 font-serif leading-tight',
                                        isCompact ? 'text-base' : 'text-xl',
                                        'group-hover:hcm-text-gradient-luxury transition-all duration-300'
                                    )}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    {debate.title}
                                </motion.h3>
                            </Link>

                            {!isCompact && (
                                <motion.p
                                    className="text-neutral-600 text-sm line-clamp-2 mt-3 leading-relaxed"
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
                                            className="h-8 w-8 hover:shadow-lg"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                )}
                                {onPin && (
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="glass"
                                            size="icon"
                                            onClick={onPin}
                                            className="h-8 w-8 hover:shadow-lg"
                                        >
                                            <MapPinIcon className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                )}
                                {onFeature && (
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="glass"
                                            size="icon"
                                            onClick={onFeature}
                                            className="h-8 w-8 hover:shadow-lg"
                                        >
                                            <StarIcon className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                )}
                                {onDelete && (
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                                        <Button
                                            variant="glass"
                                            size="icon"
                                            onClick={onDelete}
                                            className="h-8 w-8 text-destructive hover:text-destructive hover:shadow-lg"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Tags and metadata */}
                    <motion.div
                        className="flex flex-wrap items-center gap-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 hcm-gradient-luxury text-white rounded-full text-xs font-semibold shadow-md"
                            whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(220, 38, 38, 0.3)" }}
                        >
                            <SparklesIcon className="h-3 w-3" />
                            {categoryName}
                        </motion.span>

                        <motion.span
                            className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md",
                                getDifficultyVariant(debate.difficulty || '')
                            )}
                            whileHover={{ scale: 1.05 }}
                        >
                            {difficultyName}
                        </motion.span>

                        {debate.tags?.slice(0, isCompact ? 2 : 3).map((tag, index) => (
                            <motion.span
                                key={index}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/60 backdrop-blur-sm text-neutral-700 rounded-full text-xs font-medium border border-neutral-200 shadow-sm"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.8)" }}
                            >
                                <TagIcon className="h-3 w-3" />
                                {tag}
                            </motion.span>
                        ))}

                        {debate.tags?.length && debate.tags.length > (isCompact ? 2 : 3) && (
                            <motion.span
                                className="text-xs text-neutral-500 font-medium px-2 py-1 bg-neutral-100/60 rounded-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                +{debate.tags.length - (isCompact ? 2 : 3)} thẻ khác
                            </motion.span>
                        )}
                    </motion.div>
                </CardHeader>

                <CardContent className={cn("pt-0 relative z-10", isCompact && "p-4 pt-3")}>
                    {/* Author and stats */}
                    <motion.div
                        className="flex items-center justify-between text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.5 }}
                    >
                        <div className="flex items-center gap-4">
                            {showAuthor && debate.authorId && (
                                <motion.div
                                    className="flex items-center gap-2.5"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="w-7 h-7 hcm-gradient-luxury rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white/20">
                                        {debate.authorId.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-neutral-700 hover:text-primary-600 transition-colors">
                                        {debate.authorId}
                                    </span>
                                </motion.div>
                            )}

                            <div className="flex items-center gap-1.5 text-neutral-500">
                                <ClockIcon className="h-4 w-4" />
                                <span className="font-medium">
                                    {formatRelativeTime(debate.lastActivityAt as any)}
                                </span>
                            </div>
                        </div>

                        {showStats && (
                            <motion.div
                                className="flex items-center gap-4 text-neutral-600"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4, delay: 0.6 }}
                            >
                                <motion.div
                                    className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <ChatBubbleLeftRightIcon className="h-4 w-4" />
                                    <span className="font-semibold">{debate.argumentCount || 0}</span>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-1.5 hover:text-secondary-600 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <EyeIcon className="h-4 w-4" />
                                    <span className="font-semibold">{debate.viewCount || 0}</span>
                                </motion.div>

                                <motion.div
                                    className="flex items-center gap-1.5 hover:text-primary-600 transition-colors"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <UserIcon className="h-4 w-4" />
                                    <span className="font-semibold">{debate.argumentCount || 0}</span>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    )
}