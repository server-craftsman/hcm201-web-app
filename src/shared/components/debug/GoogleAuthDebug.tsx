'use client'

import React, { useState, useEffect } from 'react'
import authConfig from '@/core/config/auth.config'

export function GoogleAuthDebug() {
    const [googleAPILoaded, setGoogleAPILoaded] = useState(false)
    const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false)
    const [clientId, setClientId] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [logs, setLogs] = useState<string[]>([])

    useEffect(() => {
        const addLog = (message: string) => {
            setLogs(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`])
        }

        const checkGoogleAPI = () => {
            if (typeof window !== 'undefined') {
                const scriptLoaded = !!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
                const apiLoaded = !!window.google?.accounts?.oauth2
                const idLoaded = !!window.google?.accounts?.id

                setGoogleScriptLoaded(scriptLoaded)
                setGoogleAPILoaded(apiLoaded && idLoaded)
                setClientId(authConfig.google.clientId)

                addLog(`Script: ${scriptLoaded ? '✅' : '❌'}, OAuth: ${apiLoaded ? '✅' : '❌'}, ID: ${idLoaded ? '✅' : '❌'}`)
            }
        }

        // Check initially
        checkGoogleAPI()

        // Set up listeners for Google script events
        const handleScriptLoaded = () => {
            console.log('🔔 Google script loaded event received')
            addLog('✅ Script loaded event received')
            checkGoogleAPI()
        }

        const handleScriptError = (event: any) => {
            console.log('🔔 Google script error event received:', event.detail)
            addLog(`❌ Script error: ${event.detail}`)
            setError(`Google script error: ${event.detail}`)
        }

        window.addEventListener('googleScriptLoaded', handleScriptLoaded)
        window.addEventListener('googleScriptError', handleScriptError)

        // Also check periodically
        const interval = setInterval(checkGoogleAPI, 1000)

        return () => {
            window.removeEventListener('googleScriptLoaded', handleScriptLoaded)
            window.removeEventListener('googleScriptError', handleScriptError)
            clearInterval(interval)
        }
    }, [])

    const manualLoadScript = async () => {
        try {
            setError(null)
            console.log('🔧 Manually loading Google script...')

            // Remove existing script if any
            const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
            if (existingScript) {
                existingScript.remove()
                console.log('🗑️ Removed existing script')
            }

            // Create new script
            const script = document.createElement('script')
            script.src = 'https://accounts.google.com/gsi/client'
            script.async = true
            script.defer = true

            script.onload = () => {
                console.log('✅ Manual script load successful')
                setError('Manual script load successful')
                setTimeout(() => {
                    if (typeof window !== 'undefined') {
                        window.dispatchEvent(new CustomEvent('googleScriptLoaded'))
                    }
                }, 100)
            }

            script.onerror = (error) => {
                console.error('❌ Manual script load failed:', error)
                setError(`Manual script load failed: ${error}`)
            }

            document.head.appendChild(script)
            console.log('📜 Manual script added to DOM')
        } catch (err) {
            console.error('❌ Manual load error:', err)
            setError(`Manual load error: ${(err as Error).message}`)
        }
    }

    const testGoogleAuth = async () => {
        try {
            setError(null)
            console.log('🧪 Testing Google Auth...')

            if (!window.google?.accounts?.oauth2) {
                throw new Error('Google API not loaded')
            }

            if (!clientId) {
                throw new Error('Google Client ID not configured')
            }

            // Test token initialization
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: 'openid email profile',
                callback: (response: any) => {
                    console.log('✅ Token response:', response)
                    setError(null)
                },
                prompt: 'select_account',
            })

            // Test ID initialization
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: (response: any) => {
                    console.log('✅ ID response:', response)
                },
                auto_select: false,
            })

            console.log('✅ Google Auth test completed successfully')
            setError('Test completed successfully - check console for details')
        } catch (err) {
            console.error('❌ Google Auth test failed:', err)
            setError(`Test failed: ${(err as Error).message}`)
        }
    }

    if (process.env.NODE_ENV !== 'development') {
        return null
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4">
            <h3 className="font-bold text-sm mb-2">🔍 Google Auth Debug</h3>

            <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                    <span>Script:</span>
                    <span className={googleScriptLoaded ? 'text-green-600' : 'text-red-600'}>
                        {googleScriptLoaded ? '✅ Loaded' : '❌ Missing'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>API:</span>
                    <span className={googleAPILoaded ? 'text-green-600' : 'text-red-600'}>
                        {googleAPILoaded ? '✅ Ready' : '❌ Not ready'}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span>Client ID:</span>
                    <span className={clientId ? 'text-green-600' : 'text-red-600'}>
                        {clientId ? '✅ Set' : '❌ Missing'}
                    </span>
                </div>

                {clientId && (
                    <div className="text-xs text-gray-500 break-all">
                        ID: {clientId.substring(0, 20)}...
                    </div>
                )}

                {logs.length > 0 && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <div className="font-semibold mb-1">Recent Events:</div>
                        {logs.map((log, i) => (
                            <div key={i} className="text-xs">{log}</div>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded">
                        {error}
                    </div>
                )}

                <div className="space-y-1">
                    <button
                        onClick={testGoogleAuth}
                        className="w-full px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Test Google Auth
                    </button>

                    {!googleScriptLoaded && (
                        <button
                            onClick={manualLoadScript}
                            className="w-full px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600"
                        >
                            Force Load Script
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
