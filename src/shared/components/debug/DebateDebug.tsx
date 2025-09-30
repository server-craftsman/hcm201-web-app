'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface DebateDebugProps {
    threadId?: string
    threads?: any[]
    currentThread?: any
    isLoading?: boolean
    arguments_?: any[]
    error?: string | null
}

export const DebateDebug: React.FC<DebateDebugProps> = ({
    threadId,
    threads = [],
    currentThread,
    isLoading,
    arguments_ = [],
    error
}) => {
    const [isExpanded, setIsExpanded] = useState(false)

    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 max-w-md"
            >
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-800 transition-colors rounded-t-lg"
                >
                    <div>
                        <h3 className="font-semibold text-sm">Debate Debug</h3>
                        <p className="text-xs text-gray-400">
                            {error ? 'Error detected' : isLoading ? 'Loading...' : 'Ready'}
                        </p>
                    </div>
                    {isExpanded ? (
                        <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                        <ChevronDownIcon className="h-4 w-4" />
                    )}
                </button>

                {/* Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-4 border-t border-gray-700 space-y-3 text-xs">
                                {/* Thread ID */}
                                <div>
                                    <span className="text-gray-400">Thread ID:</span>
                                    <span className="ml-2 text-green-400 font-mono">
                                        {threadId || 'Not set'}
                                    </span>
                                </div>

                                {/* Loading State */}
                                <div>
                                    <span className="text-gray-400">Loading:</span>
                                    <span className={`ml-2 ${isLoading ? 'text-yellow-400' : 'text-green-400'}`}>
                                        {isLoading ? 'Yes' : 'No'}
                                    </span>
                                </div>

                                {/* Threads Count */}
                                <div>
                                    <span className="text-gray-400">Available Threads:</span>
                                    <span className="ml-2 text-blue-400">
                                        {threads.length}
                                    </span>
                                </div>

                                {/* Current Thread */}
                                <div>
                                    <span className="text-gray-400">Current Thread:</span>
                                    <span className={`ml-2 ${currentThread ? 'text-green-400' : 'text-red-400'}`}>
                                        {currentThread ? 'Found' : 'Not found'}
                                    </span>
                                </div>

                                {/* Arguments Count */}
                                <div>
                                    <span className="text-gray-400">Arguments:</span>
                                    <span className="ml-2 text-purple-400">
                                        {arguments_.length}
                                    </span>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div>
                                        <span className="text-gray-400">Error:</span>
                                        <div className="mt-1 p-2 bg-red-900/50 rounded text-red-300 text-xs">
                                            {error}
                                        </div>
                                    </div>
                                )}

                                {/* Current Thread Details */}
                                {currentThread && (
                                    <div>
                                        <span className="text-gray-400">Thread Details:</span>
                                        <div className="mt-1 p-2 bg-gray-800 rounded text-xs overflow-x-auto">
                                            <pre className="text-gray-300">
                                                {JSON.stringify({
                                                    id: currentThread._id,
                                                    title: currentThread.title?.substring(0, 30) + '...',
                                                    status: currentThread.status,
                                                    createdBy: currentThread.createdBy?.firstName + ' ' + currentThread.createdBy?.lastName
                                                }, null, 2)}
                                            </pre>
                                        </div>
                                    </div>
                                )}

                                {/* Thread IDs comparison */}
                                {threads.length > 0 && (
                                    <div>
                                        <span className="text-gray-400">Thread IDs:</span>
                                        <div className="mt-1 p-2 bg-gray-800 rounded text-xs max-h-20 overflow-y-auto">
                                            {threads.slice(0, 3).map((thread, index) => (
                                                <div key={index} className={`${thread._id === threadId ? 'text-green-400' : 'text-gray-300'}`}>
                                                    {thread._id} {thread._id === threadId && '← Current'}
                                                </div>
                                            ))}
                                            {threads.length > 3 && (
                                                <div className="text-gray-500">...and {threads.length - 3} more</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
