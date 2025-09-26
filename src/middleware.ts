import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Create a response
    const response = NextResponse.next()

    // Add CSP headers only in development
    if (process.env.NODE_ENV === 'development') {
        const csp = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: blob: https:",
            "font-src 'self' data:",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "frame-ancestors 'none'",
            // Allow localhost connections for development
            "connect-src 'self' ws: wss: https: http://localhost:* http://127.0.0.1:* ws://localhost:* ws://127.0.0.1:*",
        ].join('; ')

        response.headers.set('Content-Security-Policy', csp)
    }

    return response
}

// Apply middleware to all routes
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}