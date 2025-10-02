'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
    ArrowLeftIcon,
    ArrowRightIcon,
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
    MoonIcon,
    MagnifyingGlassIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    HomeIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { WORK_READER_DATA, WorkReader, Page } from '../../shared-data'
import toast from 'react-hot-toast'


export default function WorkReaderPage() {
    const params = useParams()
    const router = useRouter()
    const [work, setWork] = useState<WorkReader | null>(null)
    const [currentPage, setCurrentPage] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [fontSize, setFontSize] = useState(16)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [showSidebar, setShowSidebar] = useState(true)
    const [zoom, setZoom] = useState(100)

    const synthRef = useRef<SpeechSynthesis | null>(null)
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
    const isPlayingRef = useRef(false)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synthRef.current = window.speechSynthesis
        }

        const workId = params.id as string
        const workData = WORK_READER_DATA[workId]
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

        const readPage = (pageIndex: number) => {
            if (pageIndex >= work.pages.length) {
                setIsPlaying(false)
                isPlayingRef.current = false
                console.log('Finished reading all pages')
                return
            }

            const pageData = work.pages[pageIndex]
            if (!pageData) {
                setIsPlaying(false)
                isPlayingRef.current = false
                console.log('No page data found')
                return
            }

            console.log(`Reading page ${pageIndex + 1}/${work.pages.length}: ${pageData.title}`)

            // Update current page immediately
            setCurrentPage(pageIndex)

            const utterance = new SpeechSynthesisUtterance(pageData.content)
            utterance.lang = 'vi-VN'
            utterance.rate = 0.8
            utterance.pitch = 1
            utterance.volume = 0.8

            utterance.onstart = () => {
                console.log(`Started reading page ${pageIndex + 1}`)
            }

            utterance.onend = () => {
                console.log(`Finished reading page ${pageIndex + 1}`)
                // Continue to next page after a short delay
                setTimeout(() => {
                    if (isPlayingRef.current && pageIndex < work.pages.length - 1) {
                        console.log(`Moving to page ${pageIndex + 2}`)
                        readPage(pageIndex + 1)
                    } else if (pageIndex >= work.pages.length - 1) {
                        console.log('All pages completed')
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
        readPage(currentPage)
    }

    const handleStop = () => {
        if (synthRef.current) {
            synthRef.current.cancel()
            setIsPlaying(false)
            isPlayingRef.current = false
        }
    }

    const handlePageChange = (direction: 'prev' | 'next') => {
        if (!work) return

        // Stop audio first if playing
        if (isPlaying) {
            handleStop()
        }

        if (direction === 'prev' && currentPage > 0) {
            setCurrentPage(currentPage - 1)
        } else if (direction === 'next' && currentPage < work.pages.length - 1) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePageSelect = (pageIndex: number) => {
        // Stop audio first if playing
        if (isPlaying) {
            handleStop()
        }
        setCurrentPage(pageIndex)
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

    const currentPageData = work.pages[currentPage]

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-rose-50/40 to-amber-50/40'}`}>
            {/* Top Navigation Bar */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur border-b border-slate-200 dark:border-slate-700"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center space-x-4">
                            <Link
                                href={`/ho-chi-minh/works/${work.id}`}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <ArrowLeftIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            </Link>
                            <div>
                                <h1 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-amber-500 dark:text-white">{work.title}</h1>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{work.year}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                <BookOpenIcon className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setIsDarkMode(!isDarkMode)}
                                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                            >
                                {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                            </button>

                            <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                                <button
                                    onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                                    className="px-2 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                                >
                                    A-
                                </button>
                                <span className="text-sm text-slate-500 dark:text-slate-400">{fontSize}px</span>
                                <button
                                    onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                                    className="px-2 py-1 text-sm hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                                >
                                    A+
                                </button>
                            </div>

                            <button
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`p-2 rounded-lg transition-colors ${isBookmarked
                                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <BookmarkIcon className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-2 rounded-lg transition-colors ${isLiked
                                    ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }`}
                            >
                                <HeartIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </motion.header>

            <div className="flex h-[calc(100vh-3.5rem)]">
                {/* Left Sidebar - Table of Contents */}
                <AnimatePresence>
                    {showSidebar && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 300, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-r border-slate-200 dark:border-slate-700 overflow-y-auto"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center">
                                    <BookOpenIcon className="w-5 h-5 mr-2" />
                                    Mục lục
                                </h3>

                                <div className="space-y-2 mb-6">
                                    {work.pages.map((page, index) => (
                                        <button
                                            key={page.id}
                                            onClick={() => handlePageSelect(index)}
                                            className={`w-full text-left p-3 rounded-lg transition-colors ${currentPage === index
                                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300'
                                                : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                                }`}
                                        >
                                            <div className="font-medium text-sm text-slate-600 dark:text-slate-300">{page.title}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                Trang {page.pageNumber}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Audio Controls */}
                                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Điều khiển âm thanh</h4>

                                    <div className="flex items-center space-x-2 mb-4">
                                        <button
                                            onClick={handlePlayPause}
                                            className="flex items-center justify-center w-10 h-10 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-colors"
                                        >
                                            {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                                        </button>

                                        <button
                                            onClick={handleStop}
                                            className="flex items-center justify-center w-10 h-10 bg-slate-500 hover:bg-slate-600 text-white rounded-full transition-colors"
                                        >
                                            <SpeakerXMarkIcon className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center">
                                            <ClockIcon className="w-4 h-4 mr-1" />
                                            {work.readingTime} phút
                                        </div>
                                        <div className="flex items-center">
                                            <EyeIcon className="w-4 h-4 mr-1" />
                                            {work.views} lượt xem
                                        </div>
                                    </div>

                                    {/* Continuous Reading Progress */}
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
                                                    {currentPage + 1} / {work.pages.length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-rose-200 dark:bg-rose-800 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${((currentPage + 1) / work.pages.length) * 100}%` }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </div>
                                            <div className="text-xs text-rose-600 dark:text-rose-400 mt-1">
                                                {work.pages[currentPage]?.title}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Reading Area */}
                <div className="flex-1 flex flex-col">
                    {/* Page Navigation */}
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-b border-slate-200 dark:border-slate-700 px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => handlePageChange('prev')}
                                    disabled={currentPage === 0}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeftIcon className="w-5 h-5" />
                                </button>

                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {currentPage + 1} / {work.pages.length}
                                </span>

                                <button
                                    onClick={() => handlePageChange('next')}
                                    disabled={currentPage === work.pages.length - 1}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRightIcon className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Zoom:</span>
                                    <input
                                        type="range"
                                        min="50"
                                        max="150"
                                        value={zoom}
                                        onChange={(e) => setZoom(Number(e.target.value))}
                                        className="w-20"
                                    />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">{zoom}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Book Content */}
                    <div className="flex-1 overflow-y-auto p-8">
                        <motion.div
                            key={currentPage}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="max-w-4xl mx-auto"
                            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                        >
                            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                {/* Page Header */}
                                <div className="bg-gradient-to-r from-rose-500 to-amber-500 text-white p-6">
                                    <h2 className="text-2xl font-bold text-white">{currentPageData.title}</h2>
                                    <p className="text-white/90 mt-2">Trang {currentPageData.pageNumber}</p>
                                </div>

                                {/* Page Content */}
                                <div className="p-8">
                                    <div
                                        className="prose prose-slate dark:prose-invert max-w-none"
                                        style={{ fontSize: `${fontSize}px` }}
                                    >
                                        <div className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                            {currentPageData.content}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur border-t border-slate-200 dark:border-slate-700 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => handlePageChange('prev')}
                                    disabled={currentPage === 0}
                                    className="flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeftIcon className="w-4 h-4 mr-2" />
                                    Trang trước
                                </button>

                                <button
                                    onClick={() => handlePageChange('next')}
                                    disabled={currentPage === work.pages.length - 1}
                                    className="flex items-center px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trang sau
                                    <ChevronRightIcon className="w-4 h-4 ml-2" />
                                </button>
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
                                <span>Tiến độ: {Math.round(((currentPage + 1) / work.pages.length) * 100)}%</span>
                                <div className="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300"
                                        style={{ width: `${((currentPage + 1) / work.pages.length) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
