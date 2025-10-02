'use client'

import React, { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
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
    SparklesIcon,
    FireIcon,
    BoltIcon,
    HeartIcon,
    ShareIcon,
    BookmarkIcon
} from '@heroicons/react/24/outline'
import {
    StarIcon as StarSolidIcon,
    MapPinIcon as PinSolidIcon,
    FireIcon as FireSolidIcon,
    HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid'
import { Card, CardContent, CardHeader, Button } from '@/shared/components/ui'
import { DebateTopic } from '@/shared/types'
import { formatRelativeTime, formatDate, cn } from '@/shared/utils'
import { DEBATE_CATEGORY_NAMES, DIFFICULTY_LEVEL_NAMES } from '@/shared/constants'

interface LuxuryDebateCardProps {
    debate: DebateTopic
    showActions?: boolean
    showAuthor?: boolean
    showStats?: boolean
    variant?: 'platinum' | 'diamond' | 'emerald' | 'ruby' | 'sapphire'
    onEdit?: () => void
    onDelete?: () => void
    onPin?: () => void
    onFeature?: () => void
    className?: string
}

export const LuxuryDebateCard: React.FC<LuxuryDebateCardProps> = ({
    debate,
    showActions = false,
    showAuthor = true,
    showStats = true,
    variant = 'platinum',
    onEdit,
    onDelete,
    onPin,
    onFeature,
    className,
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const cardRef = useRef<HTMLDivElement>(null)

    // Mouse tracking for 3D effect
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 500, damping: 30 })
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 500, damping: 30 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return

        const rect = cardRef.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseXRelative = (e.clientX - rect.left - width / 2) / width
        const mouseYRelative = (e.clientY - rect.top - height / 2) / height

        mouseX.set(mouseXRelative)
        mouseY.set(mouseYRelative)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        mouseX.set(0)
        mouseY.set(0)
    }

    const categoryName = DEBATE_CATEGORY_NAMES[debate.category as keyof typeof DEBATE_CATEGORY_NAMES] || debate.category
    const difficultyName = DIFFICULTY_LEVEL_NAMES[debate.difficulty as keyof typeof DIFFICULTY_LEVEL_NAMES] || debate.difficulty

    const getVariantStyles = (variant: string) => {
        switch (variant) {
            case 'diamond':
                return {
                    gradient: 'from-slate-50 via-blue-50 to-indigo-100',
                    border: 'border-gradient-to-r from-slate-300 to-blue-400',
                    accent: 'from-blue-500 to-indigo-600',
                    glow: 'shadow-[0_0_50px_rgba(59,130,246,0.3)]',
                    particle: 'bg-blue-400'
                }
            case 'emerald':
                return {
                    gradient: 'from-emerald-50 via-teal-50 to-green-100',
                    border: 'border-gradient-to-r from-emerald-300 to-teal-400',
                    accent: 'from-emerald-500 to-teal-600',
                    glow: 'shadow-[0_0_50px_rgba(16,185,129,0.3)]',
                    particle: 'bg-emerald-400'
                }
            case 'ruby':
                return {
                    gradient: 'from-rose-50 via-red-50 to-pink-100',
                    border: 'border-gradient-to-r from-rose-300 to-red-400',
                    accent: 'from-rose-500 to-red-600',
                    glow: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
                    particle: 'bg-rose-400'
                }
            case 'sapphire':
                return {
                    gradient: 'from-indigo-50 via-purple-50 to-violet-100',
                    border: 'border-gradient-to-r from-indigo-300 to-purple-400',
                    accent: 'from-indigo-500 to-purple-600',
                    glow: 'shadow-[0_0_50px_rgba(129,140,248,0.3)]',
                    particle: 'bg-purple-400'
                }
            default: // platinum
                return {
                    gradient: 'from-gray-50 via-slate-50 to-zinc-100',
                    border: 'border-gradient-to-r from-gray-300 to-slate-400',
                    accent: 'from-gray-600 to-slate-700',
                    glow: 'shadow-[0_0_50px_rgba(148,163,184,0.3)]',
                    particle: 'bg-slate-400'
                }
        }
    }

    const variantStyles = getVariantStyles(variant)

    const getDifficultyStyle = (difficulty: string) => {
        switch (difficulty) {
            case 'basic':
                return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
            case 'intermediate':
                return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
            case 'advanced':
                return 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
            default:
                return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white'
        }
    }

    // Floating particles animation
    const ParticleField = () => (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className={`absolute w-1 h-1 ${variantStyles.particle} rounded-full opacity-30`}
                    initial={{
                        x: Math.random() * 400,
                        y: Math.random() * 300,
                        scale: 0
                    }}
                    animate={{
                        y: [null, Math.random() * 300, Math.random() * 300],
                        x: [null, Math.random() * 400, Math.random() * 400],
                        scale: [0, 1, 0],
                        opacity: [0, 0.6, 0]
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 2
                    }}
                />
            ))}
        </div>
    )

    return (
        <motion.div
            ref={cardRef}
            className={cn('relative perspective-1000', className)}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <motion.div
                style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative"
            >
                {/* Glow effect */}
                <motion.div
                    className={`absolute -inset-4 rounded-3xl opacity-0 ${variantStyles.glow} blur-xl`}
                    animate={{
                        opacity: isHovered ? 0.6 : 0,
                        scale: isHovered ? 1.05 : 1
                    }}
                    transition={{ duration: 0.3 }}
                />

                {/* Main Card */}
                <Card className={`
                    relative overflow-hidden border-0 backdrop-blur-xl
                    bg-gradient-to-br ${variantStyles.gradient}
                    shadow-2xl hover:shadow-3xl
                    transition-all duration-500
                    before:absolute before:inset-0 
                    before:bg-gradient-to-br before:from-white/40 before:via-white/20 before:to-transparent 
                    before:backdrop-blur-sm before:pointer-events-none
                    after:absolute after:inset-0 
                    after:bg-gradient-to-t after:from-black/5 after:via-transparent after:to-white/10
                    after:pointer-events-none
                    group
                `}>

                    {/* Particle Field */}
                    <AnimatePresence>
                        {isHovered && <ParticleField />}
                    </AnimatePresence>

                    {/* Luxury Border Effect */}
                    <div className="absolute inset-0 rounded-2xl">
                        <motion.div
                            className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${variantStyles.accent} opacity-0`}
                            animate={{
                                opacity: isHovered ? 0.1 : 0,
                                scale: isHovered ? 1.01 : 1
                            }}
                            transition={{ duration: 0.3 }}
                        />
                        <motion.div
                            className="absolute inset-[1px] rounded-2xl bg-white/90 backdrop-blur-xl"
                            initial={{ opacity: 1 }}
                        />
                    </div>

                    {/* Status Badges */}
                    <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                        <AnimatePresence>
                            {debate.isFeatured && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    exit={{ opacity: 0, scale: 0, rotate: 180 }}
                                    className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-full text-xs font-bold shadow-lg backdrop-blur-sm"
                                >
                                    <StarSolidIcon className="h-4 w-4" />
                                    <span>FEATURED</span>
                                    <motion.div
                                        className="absolute inset-0 rounded-full bg-white/20"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.div>
                            )}
                            {debate.isPinned && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full text-xs font-bold shadow-lg"
                                >
                                    <PinSolidIcon className="h-3.5 w-3.5" />
                                    <span>PINNED</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Difficulty Badge */}
                        <motion.div
                            className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${getDifficultyStyle(debate.difficulty || '')}`}
                            whileHover={{ scale: 1.05 }}
                        >
                            {difficultyName.toUpperCase()}
                        </motion.div>
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-6 left-6 z-20 flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsLiked(!isLiked)}
                            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isLiked
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'bg-white/30 text-gray-600 hover:bg-white/50'
                                }`}
                        >
                            {isLiked ? (
                                <HeartSolidIcon className="h-4 w-4" />
                            ) : (
                                <HeartIcon className="h-4 w-4" />
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setIsBookmarked(!isBookmarked)}
                            className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${isBookmarked
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'bg-white/30 text-gray-600 hover:bg-white/50'
                                }`}
                        >
                            <BookmarkIcon className="h-4 w-4" />
                        </motion.button>
                    </div>

                    {/* Premium Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl" />
                    <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-white/10 to-transparent rounded-full blur-3xl" />

                    <Link href={`/debates/${debate.id}`} className="block relative z-10">
                        <CardHeader className="p-8 pb-4">
                            {/* Category Tag */}
                            <motion.div
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 bg-gradient-to-r ${variantStyles.accent} text-white shadow-lg`}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                            >
                                <TagIcon className="h-3 w-3" />
                                <span>{categoryName}</span>
                            </motion.div>

                            {/* Title */}
                            <motion.h3
                                className="text-2xl font-bold text-gray-800 leading-tight mb-4 line-clamp-2"
                                whileHover={{
                                    background: `linear-gradient(135deg, ${variantStyles.accent.split(' ')[1]} 0%, ${variantStyles.accent.split(' ')[3]} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                                transition={{ duration: 0.3 }}
                            >
                                {debate.title}
                            </motion.h3>

                            {/* Description */}
                            <motion.p
                                className="text-gray-600 text-base leading-relaxed line-clamp-3"
                                initial={{ opacity: 0.8 }}
                                whileHover={{ opacity: 1 }}
                            >
                                {debate.description}
                            </motion.p>
                        </CardHeader>

                        <CardContent className="px-8 pb-8">
                            {/* Author Section */}
                            {showAuthor && debate.author && (
                                <motion.div
                                    className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-white/40 backdrop-blur-sm"
                                    whileHover={{
                                        backgroundColor: 'rgba(255,255,255,0.6)',
                                        scale: 1.02
                                    }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="relative">
                                        {debate.author.avatar && debate.author.avatar !== '👤' && !debate.author.avatar.startsWith('http') ? (
                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${variantStyles.accent} flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
                                                {debate.author.avatar}
                                            </div>
                                        ) : debate.author.avatar && debate.author.avatar.startsWith('http') ? (
                                            <img
                                                src={debate.author.avatar}
                                                alt={debate.author.name}
                                                className="w-12 h-12 rounded-2xl object-cover shadow-lg"
                                            />
                                        ) : (
                                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${variantStyles.accent} flex items-center justify-center text-white text-lg font-bold shadow-lg`}>
                                                {debate.author.name?.charAt(0)?.toUpperCase() || '👤'}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                                    </div>

                                    <div className="flex-1">
                                        <div className="font-bold text-gray-800 text-base">
                                            {debate.author.name}
                                        </div>
                                        <div className="text-gray-500 text-sm flex items-center gap-2">
                                            <ClockIcon className="h-4 w-4" />
                                            {formatRelativeTime(debate.createdAt)}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Stats Section */}
                            {showStats && (
                                <motion.div
                                    className="grid grid-cols-3 gap-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    {[
                                        {
                                            icon: ChatBubbleLeftRightIcon,
                                            value: debate.argumentCount || 0,
                                            label: 'Luận điểm',
                                            color: 'from-blue-500 to-cyan-600'
                                        },
                                        {
                                            icon: EyeIcon,
                                            value: debate.viewCount || 0,
                                            label: 'Lượt xem',
                                            color: 'from-green-500 to-emerald-600'
                                        },
                                        {
                                            icon: FireIcon,
                                            value: (debate as any).totalApprovedArguments || 0,
                                            label: 'Đã duyệt',
                                            color: 'from-orange-500 to-red-600'
                                        }
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            className="relative group"
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg backdrop-blur-sm`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <stat.icon className="h-5 w-5 opacity-80" />
                                                    <motion.div
                                                        className="text-xl font-bold"
                                                        initial={{ scale: 1 }}
                                                        animate={{ scale: isHovered ? 1.1 : 1 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        {stat.value}
                                                    </motion.div>
                                                </div>
                                                <div className="text-xs font-medium opacity-90">
                                                    {stat.label}
                                                </div>
                                            </div>

                                            {/* Glow effect for stat cards */}
                                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </CardContent>
                    </Link>

                    {/* Premium Shine Effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                        initial={{ x: '-100%', opacity: 0 }}
                        animate={{
                            x: isHovered ? '200%' : '-100%',
                            opacity: isHovered ? 1 : 0
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                </Card>
            </motion.div>
        </motion.div>
    )
}