'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
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

    // Speech synthesis state
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
    const [speechSupported, setSpeechSupported] = useState<boolean>(true)
    const [speechRate, setSpeechRate] = useState(0.8) // Tốc độ đọc (0.1 - 2.0)
    const [speechVolume, setSpeechVolume] = useState(0.9) // Âm lượng (0.0 - 1.0)
    const [speechPitch, setSpeechPitch] = useState(1) // Cao độ giọng nói (0.1 - 2.0)

    // Continuous reading state
    const [isContinuousMode, setIsContinuousMode] = useState(true) // Bật continuous mode mặc định
    const [readingProgress, setReadingProgress] = useState(0) // Tiến độ đọc hiện tại
    const [totalReadingTime, setTotalReadingTime] = useState(0) // Tổng thời gian đọc
    const [currentReadingTime, setCurrentReadingTime] = useState(0) // Thời gian đọc hiện tại
    const readingIntervalRef = useRef<NodeJS.Timeout | null>(null)
    const isReadingRef = useRef(false)

    useEffect(() => {
        const workId = params.id as string
        const workData = WORK_READER_DATA[workId]
        if (workData) {
            setWork(workData)
        }
    }, [params.id])

    // Check for speech synthesis support on mount
    useEffect(() => {
        const checkSpeechSupport = () => {
            if (typeof window === 'undefined') {
                setSpeechSupported(false)
                return
            }

            // Kiểm tra các API cần thiết
            const hasAPI = !!(window.speechSynthesis && window.SpeechSynthesisUtterance)

            if (!hasAPI) {
                console.log('❌ Speech Synthesis API không được hỗ trợ')
                setSpeechSupported(false)
                return
            }

            // Kiểm tra xem có giọng nói không
            const voices = window.speechSynthesis.getVoices()
            console.log('🔊 Available voices:', voices.length)

            // Nếu chưa có giọng, đợi một chút rồi kiểm tra lại
            if (voices.length === 0) {
                setTimeout(() => {
                    const retryVoices = window.speechSynthesis.getVoices()
                    console.log('🔊 Retry voices:', retryVoices.length)
                    setSpeechSupported(true) // Vẫn cho phép sử dụng ngay cả khi chưa có voices
                }, 1000)
            } else {
                setSpeechSupported(true)
            }
        }

        checkSpeechSupport()

        // Lắng nghe sự kiện voiceschanged
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.addEventListener('voiceschanged', checkSpeechSupport)
            return () => {
                window.speechSynthesis.removeEventListener('voiceschanged', checkSpeechSupport)
            }
        }
    }, [])

    // Stop speech when unmounting or page changes
    useEffect(() => {
        return () => {
            if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel()
            }
        }
    }, [])

    // Stop reading interval when component unmounts
    useEffect(() => {
        return () => {
            if (readingIntervalRef.current) {
                clearInterval(readingIntervalRef.current)
            }
        }
    }, [])

    // Don't auto-stop when page changes in continuous mode
    useEffect(() => {
        // Only reset reading time when manually changing pages (not in continuous mode)
        if (!isReadingRef.current) {
            setCurrentReadingTime(0)
            setReadingProgress(0)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])

    // Calculate total reading time for progress tracking
    const calculateTotalReadingTime = useCallback(() => {
        if (!work) return 0
        return work.pages.reduce((total, page) => {
            // Estimate ~3 seconds per 100 characters at normal speed
            const estimatedTime = (page.content.length / 100) * 3 / speechRate
            return total + estimatedTime
        }, 0)
    }, [work, speechRate])

    // Start continuous reading from current page
    const startContinuousReading = useCallback(() => {
        if (!work || !speechSupported) return

        console.log('🎆 Starting continuous reading from page:', currentPage + 1)
        setIsPlaying(true)
        isReadingRef.current = true
        setTotalReadingTime(calculateTotalReadingTime())
        setCurrentReadingTime(0)
        setReadingProgress(0)

        // Start reading timer
        readingIntervalRef.current = setInterval(() => {
            setCurrentReadingTime(prev => {
                const newTime = prev + 1
                const totalTime = calculateTotalReadingTime()
                setReadingProgress((newTime / totalTime) * 100)
                return newTime
            })
        }, 1000)

        readPageRecursively(currentPage)
    }, [work, speechSupported, currentPage, calculateTotalReadingTime])

    // Recursive function to read pages continuously
    const readPageRecursively = useCallback((pageIndex: number) => {
        // Check if we should stop reading
        if (!work || !isReadingRef.current) {
            // Stopped by user
            setIsPlaying(false)
            isReadingRef.current = false
            if (readingIntervalRef.current) {
                clearInterval(readingIntervalRef.current)
            }
            return
        }

        if (pageIndex >= work.pages.length) {
            // End of book - completed reading
            setIsPlaying(false)
            isReadingRef.current = false
            if (readingIntervalRef.current) {
                clearInterval(readingIntervalRef.current)
            }

            toast.success('🎆 Đã đọc xong toàn bộ tác phẩm!', {
                duration: 4000,
                style: {
                    background: '#f0fdf4',
                    color: '#16a34a',
                    border: '1px solid #bbf7d0',
                    borderRadius: '12px',
                    fontSize: '16px',
                    fontWeight: '600'
                }
            })
            return
        }

        const pageData = work.pages[pageIndex]
        if (!pageData || !pageData.content) {
            // Skip to next page if no content
            setTimeout(() => readPageRecursively(pageIndex + 1), 500)
            return
        }

        console.log(`📖 Reading page ${pageIndex + 1}/${work.pages.length}: ${pageData.title}`)

        // Update current page immediately
        setCurrentPage(pageIndex)

        // Cancel any ongoing speech
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel()
        }

        // Wait for cancel to complete
        setTimeout(() => {
            if (!isReadingRef.current) return

            const utterance = new window.SpeechSynthesisUtterance(pageData.content)
            utterance.lang = 'vi-VN'
            utterance.rate = speechRate
            utterance.pitch = speechPitch
            utterance.volume = speechVolume

            utterance.onstart = () => {
                console.log(`🎤 Started reading page ${pageIndex + 1}`)
                if (isContinuousMode && pageIndex === currentPage) {
                    toast.success(`🔊 Đang đọc: ${pageData.title}`, {
                        duration: 2000,
                        style: {
                            background: '#f0fdf4',
                            color: '#16a34a'
                        }
                    })
                }
            }

            utterance.onend = () => {
                console.log(`✅ Finished reading page ${pageIndex + 1}`)

                if (!isReadingRef.current) return

                if (isContinuousMode && pageIndex < work.pages.length - 1) {
                    // Auto-advance to next page after a short pause
                    setTimeout(() => {
                        if (isReadingRef.current) {
                            readPageRecursively(pageIndex + 1)
                        }
                    }, 1000) // 1 second pause between pages
                } else {
                    // End of continuous reading or single page mode
                    setIsPlaying(false)
                    isReadingRef.current = false
                    if (readingIntervalRef.current) {
                        clearInterval(readingIntervalRef.current)
                    }

                    if (pageIndex >= work.pages.length - 1) {
                        toast.success('🎆 Đã đọc xong toàn bộ tác phẩm!', {
                            duration: 4000,
                            style: {
                                background: '#f0fdf4',
                                color: '#16a34a',
                                border: '1px solid #bbf7d0',
                                borderRadius: '12px',
                                fontSize: '16px',
                                fontWeight: '600'
                            }
                        })
                    } else {
                        toast.success(`✅ Đã đọc xong: ${pageData.title}`, {
                            duration: 2000,
                            style: {
                                background: '#f0f9ff',
                                color: '#0369a1'
                            }
                        })
                    }
                }
            }

            utterance.onerror = (event) => {
                console.error(`❌ Error reading page ${pageIndex + 1}:`, event)
                toast.error(`❌ Lỗi khi đọc trang ${pageIndex + 1}: ${event.error}`, {
                    duration: 3000,
                    style: {
                        background: '#fef2f2',
                        color: '#dc2626'
                    }
                })

                // Try to continue with next page after error
                if (isContinuousMode && pageIndex < work.pages.length - 1) {
                    setTimeout(() => {
                        if (isReadingRef.current) {
                            readPageRecursively(pageIndex + 1)
                        }
                    }, 2000)
                } else {
                    setIsPlaying(false)
                    isReadingRef.current = false
                    if (readingIntervalRef.current) {
                        clearInterval(readingIntervalRef.current)
                    }
                }
            }

            utteranceRef.current = utterance

            try {
                window.speechSynthesis.speak(utterance)
            } catch (error) {
                console.error('❌ Error starting speech:', error)
                toast.error('❌ Lỗi khi bắt đầu đọc')
                setIsPlaying(false)
                isReadingRef.current = false
            }
        }, 200)
    }, [work, speechRate, speechPitch, speechVolume, isContinuousMode, currentPage])

    // Play/pause handler
    const handlePlayPause = useCallback(() => {
        if (!work) {
            toast.error('Chưa tải được dữ liệu tác phẩm.')
            return
        }

        if (typeof window === 'undefined' || !window.speechSynthesis || !window.SpeechSynthesisUtterance) {
            toast.error('❌ Trình duyệt không hỗ trợ tính năng đọc văn bản.', {
                duration: 4000,
                style: {
                    background: '#fef2f2',
                    color: '#dc2626',
                    border: '1px solid #fecaca'
                }
            })
            setSpeechSupported(false)
            return
        }

        // If currently playing, pause
        if (isPlaying) {
            console.log('🔇 Pausing continuous reading')
            setIsPlaying(false)
            isReadingRef.current = false

            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel()
            }

            if (readingIntervalRef.current) {
                clearInterval(readingIntervalRef.current)
            }

            toast.success('⏸️ Đã tạm dừng đọc', {
                duration: 1500,
                style: {
                    background: '#f0f9ff',
                    color: '#0369a1'
                }
            })
            return
        }

        // Start continuous reading
        startContinuousReading()
    }, [work, isPlaying, speechSupported, startContinuousReading])

    const handleStop = useCallback(() => {
        console.log('🚫 Stopping all reading')

        setIsPlaying(false)
        isReadingRef.current = false

        if (typeof window !== 'undefined' && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel()
        }

        if (readingIntervalRef.current) {
            clearInterval(readingIntervalRef.current)
        }

        setCurrentReadingTime(0)
        setReadingProgress(0)

        toast.success('🚫 Đã dừng đọc hoàn toàn', {
            duration: 2000,
            style: {
                background: '#fef3c7',
                color: '#d97706',
                fontWeight: '600'
            }
        })
    }, [])

    const handlePageChange = (direction: 'prev' | 'next') => {
        if (!work) return

        // Only stop if not in continuous reading mode or manually triggered
        if (isPlaying && !isReadingRef.current) {
            handleStop()
        }

        let newPage = currentPage
        if (direction === 'prev' && currentPage > 0) {
            newPage = currentPage - 1
        } else if (direction === 'next' && currentPage < work.pages.length - 1) {
            newPage = currentPage + 1
        }

        // If in continuous reading mode, stop current and start from new page
        if (isPlaying && isReadingRef.current) {
            handleStop()
            setCurrentPage(newPage)
            // Small delay then restart from new page
            setTimeout(() => {
                startContinuousReading()
            }, 500)
        } else {
            setCurrentPage(newPage)
        }
    }

    const handlePageSelect = (pageIndex: number) => {
        // If in continuous reading mode, stop current and start from selected page
        if (isPlaying && isReadingRef.current) {
            handleStop()
            setCurrentPage(pageIndex)
            // Small delay then restart from selected page
            setTimeout(() => {
                startContinuousReading()
            }, 500)
        } else {
            // Stop audio first if playing in single mode
            if (isPlaying) {
                handleStop()
            }
            setCurrentPage(pageIndex)
        }
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
                                            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isPlaying
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg animate-pulse'
                                                : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-md'
                                                }`}
                                            type="button"
                                            disabled={!speechSupported}
                                            title={isPlaying ? 'Ấn để tạm dừng' : 'Ấn để bắt đầu đọc'}
                                        >
                                            {isPlaying ? (
                                                <PauseIcon className="w-6 h-6 text-white" />
                                            ) : (
                                                <PlayIcon className="w-6 h-6 text-white ml-0.5" />
                                            )}

                                            {/* Animated ring khi đang phát */}
                                            {isPlaying && (
                                                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping"></div>
                                            )}
                                        </button>

                                        <button
                                            onClick={handleStop}
                                            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${isPlaying
                                                ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg'
                                                : 'bg-slate-400 hover:bg-slate-500 shadow-sm'
                                                }`}
                                            type="button"
                                            disabled={!speechSupported || !isPlaying}
                                            title="Dừng đọc"
                                        >
                                            <SpeakerXMarkIcon className="w-5 h-5 text-white" />
                                        </button>
                                    </div>

                                    {/* Continuous Mode Toggle */}
                                    <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <label className="text-sm font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                                                    🔄 Chế độ đọc liên tục
                                                </label>
                                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                    {isContinuousMode ? 'Tự động chuyển trang khi hết nội dung' : 'Chỉ đọc trang hiện tại'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setIsContinuousMode(!isContinuousMode)}
                                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${isContinuousMode ? 'bg-gradient-to-r from-blue-500 to-indigo-600' : 'bg-gray-300 dark:bg-gray-600'
                                                    }`}
                                            >
                                                <span
                                                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${isContinuousMode ? 'translate-x-6' : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status indicator */}
                                    <div className="mb-3">
                                        {isPlaying ? (
                                            <div className="flex items-center text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-200 dark:border-green-700">
                                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                                {isContinuousMode ? 'Đang đọc liên tục' : 'Đang phát âm thanh'}
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                                                Sẵn sàng đọc {isContinuousMode ? 'liên tục' : ''}
                                            </div>
                                        )}
                                    </div>

                                    {/* Reading Progress */}
                                    {/* {isPlaying && isContinuousMode && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mb-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center">
                                                    📚 Đang đọc liên tục
                                                </span>
                                                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                                    Trang {currentPage + 1} / {work.pages.length}
                                                </span>
                                            </div>

                                            <div className="mb-2">
                                                <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                                                    <span>Tiến độ toàn bộ</span>
                                                    <span>{Math.round(readingProgress)}%</span>
                                                </div>
                                                <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2 overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${readingProgress}%` }}
                                                        transition={{ duration: 0.5 }}
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
                                                <span>Đã đọc: {Math.floor(currentReadingTime / 60)}:{(currentReadingTime % 60).toString().padStart(2, '0')}</span>
                                                <span>Dự kiến: {Math.floor(totalReadingTime / 60)}:{Math.floor(totalReadingTime % 60).toString().padStart(2, '0')}</span>
                                            </div>

                                            <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 text-center font-medium">
                                                🎙️ {work.pages[currentPage]?.title}
                                            </div>
                                        </motion.div>
                                    )} */}
                                    {!speechSupported && (
                                        <div className="text-xs text-red-600 dark:text-red-400 mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                                            ❌ Trình duyệt của bạn không hỗ trợ tính năng đọc văn bản.
                                            <br />
                                            Vui lòng sử dụng Chrome, Firefox hoặc Safari mới nhất.
                                        </div>
                                    )}

                                    {/* Quick Actions */}
                                    <div className="space-y-2 mb-4">
                                        {speechSupported && (
                                            <button
                                                onClick={() => {
                                                    const testUtterance = new window.SpeechSynthesisUtterance('Xin chào! Đây là bài kiểm tra giọng nói.')
                                                    testUtterance.lang = 'vi-VN'
                                                    testUtterance.rate = speechRate
                                                    testUtterance.pitch = speechPitch
                                                    testUtterance.volume = speechVolume
                                                    window.speechSynthesis.speak(testUtterance)
                                                    toast.success('🎤 Kiểm tra giọng nói')
                                                }}
                                                className="w-full text-xs py-2 px-3 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-800/30 text-blue-700 dark:text-blue-300 rounded-lg transition-colors"
                                            >
                                                🎤 Kiểm tra giọng nói
                                            </button>
                                        )}

                                        {/* {isContinuousMode && (
                                            <button
                                                onClick={() => {
                                                    if (isPlaying) {
                                                        handleStop()
                                                    }
                                                    setCurrentPage(0)
                                                    setTimeout(() => {
                                                        startContinuousReading()
                                                    }, 500)
                                                }}
                                                className="w-full text-xs py-2 px-3 bg-gradient-to-r from-emerald-100 to-teal-100 hover:from-emerald-200 hover:to-teal-200 dark:from-emerald-900/20 dark:to-teal-900/20 dark:hover:from-emerald-800/30 dark:hover:to-teal-800/30 text-emerald-700 dark:text-emerald-300 rounded-lg transition-colors font-medium"
                                                disabled={!speechSupported}
                                            >
                                                🚀 Đọc từ đầu tác phẩm
                                            </button>
                                        )} */}
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

                                    {/* Voice Settings */}
                                    <div className="mt-4 space-y-3 text-slate-700 dark:text-slate-300">
                                        <div>
                                            <label className="text-xs">Tốc độ đọc: {speechRate.toFixed(1)}x</label>
                                            <input
                                                type="range"
                                                min={0.5}
                                                max={1.5}
                                                step={0.1}
                                                value={speechRate}
                                                onChange={(e) => setSpeechRate(Number(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs">Âm lượng: {Math.round(speechVolume * 100)}%</label>
                                            <input
                                                type="range"
                                                min={0}
                                                max={1}
                                                step={0.1}
                                                value={speechVolume}
                                                onChange={(e) => setSpeechVolume(Number(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs">Cao độ: {speechPitch.toFixed(1)}</label>
                                            <input
                                                type="range"
                                                min={0.5}
                                                max={1.5}
                                                step={0.1}
                                                value={speechPitch}
                                                onChange={(e) => setSpeechPitch(Number(e.target.value))}
                                                className="w-full"
                                            />
                                        </div>
                                    </div>

                                    {/* Đã tắt đọc liên tục, không hiển thị tiến trình đọc liên tục */}
                                    {isPlaying && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-3 bg-gradient-to-r from-rose-100 to-amber-100 dark:from-rose-900/20 dark:to-amber-900/20 rounded-xl border border-rose-200/50 dark:border-rose-700/50"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-semibold text-rose-700 dark:text-rose-300 flex items-center">
                                                    <SpeakerWaveIcon className="w-4 h-4 mr-2 animate-pulse" />
                                                    Đang đọc trang này
                                                </span>
                                                <span className="text-xs text-rose-600 dark:text-rose-400">
                                                    {currentPage + 1} / {work.pages.length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-rose-200 dark:bg-rose-800 rounded-full h-2 overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `100%` }}
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
