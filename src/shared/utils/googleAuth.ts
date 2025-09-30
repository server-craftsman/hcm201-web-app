// Lightweight wrapper around Google Identity Services for client-side token retrieval

declare global {
    interface Window {
        google?: any
    }
}

export interface GoogleTokens {
    accessToken: string
    idToken: string
}

export function loadGoogleScript(clientId: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window === 'undefined') return reject(new Error('Window is undefined'))

        // Check if Google script is already loaded with full API
        if (window.google?.accounts?.oauth2 && window.google?.accounts?.id) {
            console.log('✅ Google API already fully available')
            return resolve()
        }

        console.log('🔄 Waiting for Google API to load...')

        let resolved = false
        const cleanup = () => {
            window.removeEventListener('googleScriptLoaded', handleScriptLoaded)
            window.removeEventListener('googleScriptError', handleScriptError)
        }

        // Listen for custom events from GoogleScript component
        const handleScriptLoaded = () => {
            if (window.google?.accounts?.oauth2 && window.google?.accounts?.id) {
                console.log('✅ Google API loaded via custom event')
                if (!resolved) {
                    resolved = true
                    cleanup()
                    resolve()
                }
            } else {
                console.log('⚠️ Script loaded but API not fully available, continuing to wait...')
            }
        }

        const handleScriptError = (event: any) => {
            console.error('❌ Google script error via custom event:', event.detail)
            if (!resolved) {
                resolved = true
                cleanup()
                // Try fallback loading
                console.log('🔄 Trying fallback loading...')
                loadGoogleScriptFallback()
                    .then(resolve)
                    .catch(reject)
            }
        }

        // Add event listeners
        window.addEventListener('googleScriptLoaded', handleScriptLoaded)
        window.addEventListener('googleScriptError', handleScriptError)

        // Poll for Google API availability as backup
        let attempts = 0
        const maxAttempts = 100 // 10 seconds max (100 * 100ms)

        const checkGoogleAPI = () => {
            attempts++

            if (window.google?.accounts?.oauth2 && window.google?.accounts?.id) {
                console.log('✅ Google API loaded successfully after', attempts, 'polling attempts')
                if (!resolved) {
                    resolved = true
                    cleanup()
                    resolve()
                }
            } else if (attempts >= maxAttempts) {
                console.error('❌ Google script timeout after polling. Trying fallback...')
                if (!resolved) {
                    resolved = true
                    cleanup()
                    // Fallback: Try to load script manually
                    loadGoogleScriptFallback()
                        .then(resolve)
                        .catch(reject)
                }
            } else {
                setTimeout(checkGoogleAPI, 100) // Check every 100ms
            }
        }

        // Start polling as backup
        setTimeout(checkGoogleAPI, 100)
    })
}

// Fallback script loading if Next.js Script fails
function loadGoogleScriptFallback(): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log('🔄 Attempting fallback script loading...')

        // Check if script already exists in DOM
        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
        if (existingScript) {
            console.log('📜 Script already in DOM, waiting for it to load...')
            existingScript.addEventListener('load', () => resolve())
            existingScript.addEventListener('error', () => reject(new Error('Existing script failed to load')))
            return
        }

        const script = document.createElement('script')
        script.src = 'https://accounts.google.com/gsi/client'
        script.async = true
        script.defer = true

        script.onload = () => {
            console.log('✅ Fallback script loaded successfully')
            // Wait for API to be available after script load
            let attempts = 0
            const checkAPI = () => {
                if (window.google?.accounts?.oauth2 && window.google?.accounts?.id) {
                    resolve()
                } else if (attempts < 50) { // 5 seconds max
                    attempts++
                    setTimeout(checkAPI, 100)
                } else {
                    reject(new Error('Google API not available after fallback loading'))
                }
            }
            setTimeout(checkAPI, 100)
        }

        script.onerror = (error) => {
            console.error('❌ Fallback script failed:', error)
            reject(new Error('Failed to load Google script via fallback. Check CSP settings and network connectivity.'))
        }

        try {
            document.head.appendChild(script)
            console.log('📜 Fallback script appended to DOM')
        } catch (error) {
            console.error('❌ Failed to append script:', error)
            reject(new Error(`CSP likely blocking script: ${error}`))
        }
    })
}

export async function getGoogleTokens(clientId: string, scope: string = 'openid email profile'): Promise<GoogleTokens> {
    await loadGoogleScript(clientId)

    return new Promise<GoogleTokens>((resolve, reject) => {
        try {
            console.log('🔐 Starting Google authentication with client ID:', clientId.substring(0, 20) + '...')

            // Use the simpler popup flow for more reliability
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: scope + ' openid', // Ensure openid scope is included for ID token
                callback: (response: any) => {
                    console.log('📝 Google OAuth response received:', response)

                    if (response && response.access_token) {
                        console.log('✅ Access token received successfully')

                        // Validate that we have both tokens
                        if (!response.id_token) {
                            console.error('❌ No ID token received from Google OAuth')
                            reject(new Error('ID token is required but not provided by Google'))
                            return
                        }

                        resolve({
                            accessToken: response.access_token,
                            idToken: response.id_token
                        })
                    } else if (response && response.error) {
                        console.error('❌ Google OAuth error:', response.error)
                        reject(new Error(`Google OAuth error: ${response.error}`))
                    } else {
                        console.error('❌ No tokens received from Google')
                        reject(new Error('No tokens received from Google'))
                    }
                },
                prompt: 'select_account',
                error_callback: (error: any) => {
                    console.error('❌ Google OAuth error callback:', error)
                    reject(new Error(`Google OAuth failed: ${error}`))
                }
            })

            console.log('🚀 Requesting Google access token...')
            tokenClient.requestAccessToken()

            // Add a timeout as safety measure
            setTimeout(() => {
                console.error('⏰ Google authentication timeout')
                reject(new Error('Google authentication timeout after 30 seconds'))
            }, 30000)

        } catch (err) {
            console.error('💥 Google authentication error:', err)
            reject(err as Error)
        }
    })
}


