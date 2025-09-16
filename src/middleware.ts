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

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // For now, just add security headers without authentication logic
    const response = NextResponse.next()

    // Add security headers
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=()'
    )

    // CSP for development
    if (process.env.NODE_ENV === 'development') {
        response.headers.set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' ws: wss:;"
        )
    } else {
        // Stricter CSP for production
        response.headers.set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';"
        )
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