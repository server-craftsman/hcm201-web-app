'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeftIcon,
    PlayIcon,
    PauseIcon,
    SpeakerWaveIcon,
    SpeakerXMarkIcon,
    BookOpenIcon,
    ClockIcon,
    EyeIcon,
    HeartIcon,
    ShareIcon,
    BookmarkIcon,
    AdjustmentsHorizontalIcon,
    SunIcon,
    MoonIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { WORKS_DETAIL, WorkDetail, Chapter } from '../shared-data'
import toast from 'react-hot-toast'

export default function WorkDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [work, setWork] = useState<WorkDetail | null>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentChapter, setCurrentChapter] = useState(0)
    const [isDarkMode, setIsDarkMode] = useState(false)
    // Sửa lại fontSize thành số thực tế (em/rem) và dùng state cho đơn vị
    const [fontSize, setFontSize] = useState(1.125) // 1.125rem = 18px mặc định
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isLiked, setIsLiked] = useState(false)

    const MIN_FONT_SIZE = 0.75 // rem ~ 12px
    const MAX_FONT_SIZE = 1.5 // rem ~ 24px
    const FONT_STEP = 0.125 // rem ~ 2px

    const synthRef = useRef<SpeechSynthesis | null>(null)
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
    const isPlayingRef = useRef(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis
        }

        const workId = params.id as string
        const workData = WORKS_DETAIL[workId]
        if (workData) {
            setWork(workData)
        }
    }, [params.id])

    const handlePlayPause = () => {
        if (!work || !synthRef.current) return

        if (isPlaying) {
            synthRef.current.pause()
            setIsPlaying(false)
            isPlayingRef.current = false
        } else {
            startContinuousReading()
        }
    }

    const startContinuousReading = () => {
        if (!work || !synthRef.current) return

        // Stop any current speech
        synthRef.current.cancel()

        const readChapter = (chapterIndex: number) => {
            if (chapterIndex >= work.chapters.length) {
                setIsPlaying(false)
                isPlayingRef.current = false
                console.log('Finished reading all chapters')
                return
            }

            const chapterData = work.chapters[chapterIndex]
            if (!chapterData) {
                setIsPlaying(false)
                isPlayingRef.current = false
                console.log('No chapter data found')
                return
            }

            console.log(`Reading chapter ${chapterIndex + 1}/${work.chapters.length}: ${chapterData.title}`)

            // Update current chapter immediately
            setCurrentChapter(chapterIndex)

            const utterance = new SpeechSynthesisUtterance(chapterData.content)
            utterance.lang = 'vi-VN'
            utterance.rate = 0.8
            utterance.pitch = 1
            utterance.volume = 0.8

            utterance.onstart = () => {
                console.log(`Started reading chapter ${chapterIndex + 1}`)
            }

            utterance.onend = () => {
                console.log(`Finished reading chapter ${chapterIndex + 1}`)
                // Continue to next chapter after a short delay
                setTimeout(() => {
                    if (isPlayingRef.current && chapterIndex < work.chapters.length - 1) {
                        console.log(`Moving to chapter ${chapterIndex + 2}`)
                        readChapter(chapterIndex + 1)
                    } else if (chapterIndex >= work.chapters.length - 1) {
                        console.log('All chapters completed')
                        setIsPlaying(false)
                        isPlayingRef.current = false
                        toast.success('🎉 Đã đọc xong toàn bộ tác phẩm!', {
                            duration: 4000,
                            style: {
                                background: '#f0fdf4',
                                color: '#16a34a',
                                border: '1px solid #bbf7d0',
                                borderRadius: '12px',
                                padding: '16px',
                                fontSize: '14px',
                                fontWeight: '500'
                            }
                        })
                    }
                }, 800) // Slightly longer delay for better UX
            }

            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event)
                setIsPlaying(false)
                isPlayingRef.current = false
            }

            utteranceRef.current = utterance
            synthRef.current?.speak(utterance)
        }

        setIsPlaying(true)
        isPlayingRef.current = true
        readChapter(currentChapter)
    }

    const handleStop = () => {
        if (synthRef.current) {
            synthRef.current.cancel()
            setIsPlaying(false)
            isPlayingRef.current = false
        }
    }

    const handleChapterSelect = (index: number) => {
        // Stop audio first if playing
        if (isPlaying) {
            handleStop()
        }
        setCurrentChapter(index)
    }

    if (!work) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/40 to-amber-50/40 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-300">Đang tải tác phẩm...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-rose-50/40 to-amber-50/40'}`}>
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-rose-400/20 to-amber-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-amber-400/20 to-rose-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-rose-300/10 to-amber-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-50 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-lg"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <Link
                                href="/ho-chi-minh/works"
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105"
                            >
                                <ArrowLeftIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </Link>
                            <div>
                                <h1 className="text-lg text-transparent font-bold bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text">{work.title}</h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{work.year}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            {/* <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 hover:scale-105"
                            >
                                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                            </button> */}

                            <div className="flex items-center space-x-1 bg-slate-100/80 dark:bg-slate-700/80 backdrop-blur rounded-xl p-1 border border-slate-200/50 dark:border-slate-600/50">
                                <button
                                    onClick={() => setFontSize(prev => Math.max(MIN_FONT_SIZE, parseFloat((prev - FONT_STEP).toFixed(3))))}
                                    className="px-3 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                                    aria-label="Giảm cỡ chữ"
                                >
                                    A-
                                </button>
                                <span className="text-sm text-slate-500 dark:text-slate-400 px-2">{Math.round(fontSize * 16)}px</span>
                                <button
                                    onClick={() => setFontSize(prev => Math.min(MAX_FONT_SIZE, parseFloat((prev + FONT_STEP).toFixed(3))))}
                                    className="px-3 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors"
                                    aria-label="Tăng cỡ chữ"
                                >
                                    A+
                                </button>
                            </div>

                            {/* <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${isBookmarked
                                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 shadow-lg'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <BookmarkIcon className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-2 rounded-xl transition-all duration-300 hover:scale-105 ${isLiked
                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 shadow-lg'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <HeartIcon className="w-5 h-5" />
                            </button> */}
                        </div>
                    </div>
                </div>
            </motion.header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Sidebar - Chapters & Controls */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl p-6 shadow-2xl hover:shadow-3xl transition-all duration-300"
                        >
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                                <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-amber-500 rounded-xl flex items-center justify-center mr-3">
                                    <BookOpenIcon className="w-5 h-5 text-white" />
                                </div>
                                Mục lục
                            </h3>

                            <div className="space-y-3 mb-8">
                                {work.chapters.map((chapter, index) => (
                                    <motion.button
                                        key={chapter.id}
                                        onClick={() => handleChapterSelect(index)}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${currentChapter === index
                                            ? 'bg-gradient-to-r from-rose-100 to-amber-100 text-rose-700 dark:from-rose-900/20 dark:to-amber-900/20 dark:text-rose-300 shadow-lg border border-rose-200/50 dark:border-rose-700/50'
                                            : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        <div className="font-semibold text-sm mb-1">{chapter.title}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                                            <ClockIcon className="w-3 h-3 mr-1" />
                                            {chapter.duration} phút
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Audio Controls */}
                            {/* <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-6">
                                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center">
                                    <SpeakerWaveIcon className="w-4 h-4 mr-2" />
                                    Điều khiển âm thanh
                                </h4>

                                <div className="flex items-center space-x-3 mb-6">
                                    <motion.button
                                        onClick={handlePlayPause}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6" />}
                                    </motion.button>

                                    <motion.button
                                        onClick={handleStop}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center justify-center w-12 h-12 bg-slate-500 hover:bg-slate-600 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <SpeakerXMarkIcon className="w-6 h-6" />
                                    </motion.button>

                                    <div className="flex-1">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-700/50 rounded-lg p-2">
                                            {work.chapters[currentChapter]?.title}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center justify-center p-3 bg-slate-100/50 dark:bg-slate-700/50 rounded-xl">
                                        <ClockIcon className="w-4 h-4 mr-2 text-rose-500" />
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{work.readingTime} phút</span>
                                    </div>
                                    <div className="flex items-center justify-center p-3 bg-slate-100/50 dark:bg-slate-700/50 rounded-xl">
                                        <EyeIcon className="w-4 h-4 mr-2 text-amber-500" />
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{work.views}</span>
                                    </div>
                                </div>

                                {isPlaying && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 p-3 bg-gradient-to-r from-rose-100 to-amber-100 dark:from-rose-900/20 dark:to-amber-900/20 rounded-xl border border-rose-200/50 dark:border-rose-700/50"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-rose-700 dark:text-rose-300 flex items-center">
                                                <SpeakerWaveIcon className="w-4 h-4 mr-2 animate-pulse" />
                                                Đang đọc liên tục
                                            </span>
                                            <span className="text-xs text-rose-600 dark:text-rose-400">
                                                {currentChapter + 1} / {work.chapters.length}
                                            </span>
                                        </div>
                                        <div className="w-full bg-rose-200 dark:bg-rose-800 rounded-full h-2 overflow-hidden">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${((currentChapter + 1) / work.chapters.length) * 100}%` }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                        <div className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                                            {work.chapters[currentChapter]?.title}
                                        </div>
                                    </motion.div>
                                )}
                            </div> */}
                        </motion.div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300"
                        >
                            {/* Cover Image */}
                            <div className="relative h-80 overflow-hidden">
                                <img
                                    src={work.cover}
                                    alt={work.title}
                                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <motion.h2
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent"
                                    >
                                        {work.title}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                        className="text-white/90 text-base leading-relaxed"
                                    >
                                        {work.summary}
                                    </motion.p>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute top-4 right-4 flex space-x-2">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur"
                                    >
                                        <BookOpenIcon className="w-4 h-4 text-white" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-8">
                                {/* Tags */}
                                <div className="flex flex-wrap gap-3 mb-8">
                                    {work.tags?.map((tag, index) => (
                                        <motion.span
                                            key={tag}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="px-4 py-2 rounded-2xl text-sm font-semibold bg-gradient-to-r from-rose-100 to-amber-100 text-rose-700 dark:from-rose-900/20 dark:to-amber-900/20 dark:text-rose-300 border border-rose-200/50 dark:border-rose-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            {tag}
                                        </motion.span>
                                    ))}
                                </div>

                                {/* Chapter Content */}
                                <motion.div
                                    key={currentChapter}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="prose prose-slate dark:prose-invert max-w-none"
                                    style={{ fontSize: `${fontSize}rem` }}
                                >
                                    <h3
                                        className="text-2xl font-bold mb-6 bg-gradient-to-r from-rose-600 to-amber-600 bg-clip-text text-transparent"
                                        style={{ fontSize: `calc(${fontSize}rem + 0.5rem)` }}
                                    >
                                        {work.chapters[currentChapter]?.title}
                                    </h3>

                                    <div
                                        className="text-slate-700 dark:text-slate-300 leading-relaxed"
                                        style={{ fontSize: `${fontSize}rem` }}
                                    >
                                        {work.chapters[currentChapter]?.content}
                                    </div>
                                </motion.div>

                                {/* Action Buttons */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-10 flex flex-col sm:flex-row gap-4"
                                >
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Link
                                            href={`/ho-chi-minh/works/${work.id}/reader`}
                                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold rounded-2xl hover:from-rose-600 hover:to-amber-600 transition-all duration-300 shadow-xl hover:shadow-2xl"
                                        >
                                            <BookOpenIcon className="w-6 h-6 mr-3" />
                                            <span>Đọc sách</span>
                                        </Link>
                                    </motion.div>

                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Link
                                            href="/debates"
                                            className="inline-flex items-center px-8 py-4 bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-white dark:hover:bg-slate-600 transition-all duration-300 border-2 border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl backdrop-blur"
                                        >
                                            <ShareIcon className="w-6 h-6 mr-3" />
                                            <span>Thảo luận</span>
                                        </Link>
                                    </motion.div>
                                </motion.div>

                                {/* Progress Indicator */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-8 p-4 bg-slate-100/50 dark:bg-slate-700/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Tiến độ đọc</span>
                                        <span className="text-sm text-slate-500 dark:text-slate-400">
                                            {currentChapter + 1} / {work.chapters.length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((currentChapter + 1) / work.chapters.length) * 100}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
