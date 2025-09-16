import type { Config } from 'tailwindcss'

const config: Config = {
    darkMode: ["class", ".dark"],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
        './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                // Shadcn/UI CSS variables
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#dc2626', // Vietnamese red - more elegant
                    600: '#b91c1c',
                    700: '#991b1b',
                    800: '#7f1d1d',
                    900: '#5c1417',
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#d97706', // Vietnamese gold - more refined
                    600: '#b45309',
                    700: '#92400e',
                    800: '#78350f',
                    900: '#5c2909',
                },
                // Luxury color palette
                luxury: {
                    gold: {
                        50: '#fffdf7',
                        100: '#fdf9e8',
                        200: '#faf0c4',
                        300: '#f6e397',
                        400: '#f0d669',
                        500: '#e6c643', // Rich gold
                        600: '#d4af37', // Classic gold
                        700: '#b8941f',
                        800: '#997a18',
                        900: '#7d6316',
                    },
                    platinum: {
                        50: '#fafafa',
                        100: '#f5f5f5',
                        200: '#e8e8e8',
                        300: '#d1d1d1',
                        400: '#a3a3a3',
                        500: '#737373',
                        600: '#525252',
                        700: '#404040',
                        800: '#262626',
                        900: '#171717',
                    },
                    crimson: {
                        50: '#fef2f2',
                        100: '#fee2e2',
                        200: '#fecaca',
                        300: '#fca5a5',
                        400: '#f87171',
                        500: '#dc143c', // Deep crimson
                        600: '#b91c1c',
                        700: '#991b1b',
                        800: '#7f1d1d',
                        900: '#5c1417',
                    }
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                },
                error: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                }
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
                serif: ['Georgia', 'Times New Roman', 'serif'],
                mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
                vietnamese: ['Roboto', 'Open Sans', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1' }],
                '6xl': ['3.75rem', { lineHeight: '1' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
                'luxury-float': 'luxuryFloat 6s ease-in-out infinite',
                'luxury-pulse': 'luxuryPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'luxury-glow': 'luxuryGlow 3s ease-in-out infinite alternate',
                'smooth-appear': 'smoothAppear 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                'elegant-slide': 'elegantSlide 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                'shimmer': 'shimmer 2.5s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-4px)' },
                },
                luxuryFloat: {
                    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                    '33%': { transform: 'translateY(-8px) rotate(1deg)' },
                    '66%': { transform: 'translateY(4px) rotate(-1deg)' },
                },
                luxuryPulse: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '1' },
                    '50%': { transform: 'scale(1.05)', opacity: '0.8' },
                },
                luxuryGlow: {
                    '0%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.2)' },
                    '100%': { boxShadow: '0 0 40px rgba(220, 38, 38, 0.4), 0 0 60px rgba(217, 119, 6, 0.2)' },
                },
                smoothAppear: {
                    '0%': { opacity: '0', transform: 'translateY(40px) scale(0.95)' },
                    '100%': { opacity: '1', transform: 'translateY(0px) scale(1)' },
                },
                elegantSlide: {
                    '0%': { opacity: '0', transform: 'translateX(-30px)' },
                    '100%': { opacity: '1', transform: 'translateX(0px)' },
                },
                shimmer: {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'medium': '0 4px 25px -2px rgba(0, 0, 0, 0.1), 0 8px 20px -2px rgba(0, 0, 0, 0.06)',
                'large': '0 10px 40px -4px rgba(0, 0, 0, 0.12), 0 4px 25px -5px rgba(0, 0, 0, 0.08)',
                'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                'luxury-gold': '0 20px 40px -8px rgba(217, 119, 6, 0.3), 0 8px 32px -8px rgba(217, 119, 6, 0.2)',
                'luxury-red': '0 20px 40px -8px rgba(220, 38, 38, 0.3), 0 8px 32px -8px rgba(220, 38, 38, 0.2)',
                'elegant': '0 8px 30px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                'premium': '0 32px 64px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            },
            backdropBlur: {
                'xs': '2px',
                'luxury': '20px',
            },
            screens: {
                'xs': '475px',
                '3xl': '1600px',
                '4xl': '1920px',
            },
            backgroundImage: {
                'luxury-gradient': 'linear-gradient(135deg, #dc2626 0%, #d97706 100%)',
                'luxury-gradient-reverse': 'linear-gradient(135deg, #d97706 0%, #dc2626 100%)',
                'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                'premium-mesh': 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)',
            },
            transitionTimingFunction: {
                'luxury': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                'elegant': 'cubic-bezier(0.16, 1, 0.3, 1)',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        require('tailwindcss-animate'),
    ],
}

export default config