import { NextRequest, NextResponse } from 'next/server'

// Routes that might require authentication (for future implementation)
const protectedRoutes = [
    '/debates/create',
    '/debates/edit',
    '/profile',
    '/dashboard',
    '/study',
    '/admin',
]

// Routes for authentication (for future implementation)
const authRoutes = [
    '/login',
    '/register',
    '/forgot-password',
]

function generateNonce(): string {
    // 16 bytes random base64
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Buffer.from(array).toString('base64')
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Generate a per-request nonce and pass it downstream so Next can attach it to scripts
    const nonce = generateNonce()
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-nonce', nonce)

    const response = NextResponse.next({ request: { headers: requestHeaders } })

    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()'
    )

    // CSP for development: relaxed to support HMR
    if (process.env.NODE_ENV === 'development') {
        response.headers.set(
            'Content-Security-Policy',
            [
                "default-src 'self'",
                "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                "font-src 'self' https://fonts.gstatic.com",
                "img-src 'self' data: https:",
                "connect-src 'self' ws: wss:",
                "base-uri 'self'",
                "object-src 'none'",
            ].join('; ')
        )
    } else {
        // Stricter CSP for production using nonces and strict-dynamic
        const cspParts = [
            "default-src 'self'",
            `script-src 'self' 'strict-dynamic' 'nonce-${nonce}'`,
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: https:",
            "connect-src 'self'",
            "base-uri 'self'",
            "object-src 'none'",
        ]
        response.headers.set('Content-Security-Policy', cspParts.join('; '))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public directory)
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
}