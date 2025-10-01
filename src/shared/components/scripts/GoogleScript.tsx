'use client'

import Script from 'next/script'
import { useEffect } from 'react'

export function GoogleScript() {
    useEffect(() => {
        // Additional verification that script is loaded
        const checkGoogleAPI = () => {
            if (window.google?.accounts) {
                console.log('🟢 Google API verified as loaded')
                window.dispatchEvent(new CustomEvent('googleScriptLoaded'))
                return true
            }
            return false
        }

        // Check immediately if already loaded
        if (checkGoogleAPI()) return

        // Poll for API availability as backup
        let attempts = 0
        const maxAttempts = 100 // 10 seconds max
        const pollInterval = setInterval(() => {
            attempts++
            if (checkGoogleAPI()) {
                clearInterval(pollInterval)
            } else if (attempts >= maxAttempts) {
                console.error('⚠️ Google API failed to load after polling')
                clearInterval(pollInterval)
                window.dispatchEvent(new CustomEvent('googleScriptError', {
                    detail: 'Google API not available after 10 seconds'
                }))
            }
        }, 100)

        return () => clearInterval(pollInterval)
    }, [])

    return (
        <>
            <Script
                src="https://accounts.google.com/gsi/client"
                strategy="afterInteractive"
                onLoad={() => {
                    console.log('✅ Google script loaded successfully via Next.js Script')
                    // Add a small delay to ensure API is fully available
                    setTimeout(() => {
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('googleScriptLoaded'))
                        }
                    }, 100)
                }}
                onError={(e) => {
                    console.error('❌ Google script failed to load via Next.js Script:', e)
                    console.log('🔄 This might be due to ad blockers. Attempting direct script injection as fallback...')

                    // Check if it's likely an ad blocker issue
                    const isAdBlockerIssue = e?.toString().includes('ERR_BLOCKED_BY_CLIENT') ||
                        e?.toString().includes('blocked') ||
                        e?.toString().includes('net::ERR_BLOCKED_BY_CLIENT')

                    if (isAdBlockerIssue) {
                        console.warn('⚠️ Google Sign-In appears to be blocked by an ad blocker')
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('googleScriptError', {
                                detail: 'Google Sign-In is blocked by ad blocker. Please disable ad blockers for this site.'
                            }))
                        }
                        return
                    }

                    // Try direct script injection as fallback
                    const script = document.createElement('script')
                    script.src = 'https://accounts.google.com/gsi/client'
                    script.async = true
                    script.defer = true

                    script.onload = () => {
                        console.log('✅ Direct script injection successful')
                        setTimeout(() => {
                            if (typeof window !== 'undefined') {
                                window.dispatchEvent(new CustomEvent('googleScriptLoaded'))
                            }
                        }, 100)
                    }

                    script.onerror = (error) => {
                        console.error('❌ Direct script injection also failed:', error)
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('googleScriptError', {
                                detail: 'Google Sign-In is blocked by ad blocker. Please disable ad blockers for this site.'
                            }))
                        }
                    }

                    try {
                        document.head.appendChild(script)
                        console.log('📜 Direct script element added to DOM')
                    } catch (err) {
                        console.error('❌ Failed to add direct script element:', err)
                        if (typeof window !== 'undefined') {
                            window.dispatchEvent(new CustomEvent('googleScriptError', {
                                detail: 'Google Sign-In is blocked by ad blocker. Please disable ad blockers for this site.'
                            }))
                        }
                    }
                }}
                onReady={() => {
                    console.log('🎯 Google script is ready and accessible')
                }}
            />
        </>
    )
}
