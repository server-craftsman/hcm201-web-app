'use client'

import React from 'react'
import { useAuthContext } from '@/modules/auth'

export const AuthDebug: React.FC = () => {
    const { user, isAuthenticated, isLoading, isInitialized } = useAuthContext()

    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    return (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
            <h3 className="font-bold mb-2">🐛 Auth Debug</h3>
            <div className="space-y-1">
                <div>isAuthenticated: <span className={isAuthenticated ? 'text-green-400' : 'text-red-400'}>{String(isAuthenticated)}</span></div>
                <div>isLoading: <span className={isLoading ? 'text-yellow-400' : 'text-gray-400'}>{String(isLoading)}</span></div>
                <div>isInitialized: <span className={isInitialized ? 'text-green-400' : 'text-red-400'}>{String(isInitialized)}</span></div>
                <div>user: <span className={user ? 'text-green-400' : 'text-red-400'}>{user ? 'exists' : 'null'}</span></div>
                {user && (
                    <div className="mt-2 text-xs">
                        <div>ID: {user.id}</div>
                        <div>Username: {user.username}</div>
                        <div>Email: {user.email}</div>
                        <div>Role: {user.role}</div>
                        <div>Verified: {String(user.isVerified)}</div>
                    </div>
                )}
                <div className="mt-2">
                    <div>Token: <span className={typeof window !== 'undefined' && localStorage.getItem('accessToken') ? 'text-green-400' : 'text-red-400'}>
                        {typeof window !== 'undefined' && localStorage.getItem('accessToken') ? 'exists' : 'none'}
                    </span></div>
                </div>
            </div>
        </div>
    )
}
