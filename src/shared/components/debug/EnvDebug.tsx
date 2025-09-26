'use client'

import React from 'react'

export function EnvDebug() {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    const envVars = {
        NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID,
        NODE_ENV: process.env.NODE_ENV,
    }

    return (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-green-400 p-4 rounded-lg shadow-lg max-w-md text-xs font-mono z-50">
            <div className="font-bold text-yellow-400 mb-2">🔧 Environment Debug</div>
            <div className="space-y-1">
                {Object.entries(envVars).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                        <span className="text-blue-400">{key}:</span>
                        <span className={value ? 'text-green-400' : 'text-red-400'}>
                            {value ? (key.includes('CLIENT_ID') ? `${value.substring(0, 10)}...` : value) : 'undefined'}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-2 border-t border-gray-700">
                <div className="text-purple-400 font-bold mb-1">Google OAuth Status:</div>
                <div className="space-y-1">
                    <div className="flex gap-2">
                        <span className="text-blue-400">Client ID:</span>
                        <span className={envVars.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'text-green-400' : 'text-red-400'}>
                            {envVars.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? '✅ OK' : '❌ Missing'}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID:</span>
                        <span className={envVars.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ? 'text-green-400' : 'text-red-400'}>
                            {envVars.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID ? '✅ OK' : '❌ Missing'}
                        </span>
                    </div>
                    <div className="flex gap-2">
                        <span className="text-blue-400">CSP Script:</span>
                        <span className="text-yellow-400">Check Console</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
