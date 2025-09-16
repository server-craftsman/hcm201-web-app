/**
 * Theme configuration for Ho Chi Minh Thought Debate Website
 * Vietnamese-themed design system with Shadcn/UI integration
 */

export const themeConfig = {
    // Brand colors based on Vietnamese flag
    colors: {
        primary: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444', // Main red
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
            DEFAULT: 'hsl(0 84% 60%)',
            foreground: 'hsl(210 40% 98%)',
        },
        secondary: {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b', // Gold/yellow
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            DEFAULT: 'hsl(45 93% 47%)',
            foreground: 'hsl(222.2 84% 4.9%)',
        },
    },

    // Typography for Vietnamese text
    typography: {
        fontFamily: {
            sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
            vietnamese: ['Roboto', 'Open Sans', 'system-ui', 'sans-serif'],
            mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace'],
        },
        fontSize: {
            xs: ['0.75rem', { lineHeight: '1rem' }],
            sm: ['0.875rem', { lineHeight: '1.25rem' }],
            base: ['1rem', { lineHeight: '1.5rem' }],
            lg: ['1.125rem', { lineHeight: '1.75rem' }],
            xl: ['1.25rem', { lineHeight: '1.75rem' }],
            '2xl': ['1.5rem', { lineHeight: '2rem' }],
            '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
            '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        },
    },

    // Component variants
    components: {
        button: {
            vietnamese: {
                base: 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700',
                focus: 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            },
            success: {
                base: 'bg-success-600 text-white hover:bg-success-700',
                focus: 'focus:ring-2 focus:ring-success-500 focus:ring-offset-2',
            },
            warning: {
                base: 'bg-warning-600 text-white hover:bg-warning-700',
                focus: 'focus:ring-2 focus:ring-warning-500 focus:ring-offset-2',
            },
        },
        card: {
            vietnamese: {
                base: 'bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-200',
                elevated: 'shadow-lg border-primary-300',
            },
            debate: {
                base: 'border-l-4 pl-4 py-2',
                pro: 'border-l-success-500 bg-success-50',
                con: 'border-l-destructive bg-destructive/5',
                neutral: 'border-l-warning-500 bg-warning-50',
                question: 'border-l-blue-500 bg-blue-50',
            },
        },
        badge: {
            primary: 'bg-primary text-primary-foreground',
            secondary: 'bg-secondary text-secondary-foreground',
            success: 'bg-success-100 text-success-800',
            warning: 'bg-warning-100 text-warning-800',
            destructive: 'bg-destructive/10 text-destructive',
        },
    },

    // Animation and transitions
    animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
        slideUp: 'slideUp 0.3s ease-out',
        slideDown: 'slideDown 0.3s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        bounceSubtle: 'bounceSubtle 0.6s ease-in-out',
    },

    // Shadows
    shadows: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        medium: '0 4px 25px -2px rgba(0, 0, 0, 0.1), 0 8px 20px -2px rgba(0, 0, 0, 0.06)',
        large: '0 10px 40px -4px rgba(0, 0, 0, 0.12), 0 4px 25px -5px rgba(0, 0, 0, 0.08)',
        vietnamese: '0 8px 32px -4px rgba(239, 68, 68, 0.15), 0 4px 16px -2px rgba(245, 158, 11, 0.1)',
    },

    // Spacing scale
    spacing: {
        xs: '0.5rem',    // 8px
        sm: '0.75rem',   // 12px
        md: '1rem',      // 16px
        lg: '1.5rem',    // 24px
        xl: '2rem',      // 32px
        '2xl': '3rem',   // 48px
        '3xl': '4rem',   // 64px
    },

    // Border radius
    borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
    },

    // Vietnamese specific elements
    vietnamese: {
        quotes: {
            primary: '\"',
            secondary: '"',
        },
        punctuation: {
            comma: ',',
            period: '.',
            question: '?',
            exclamation: '!',
        },
        honorifics: {
            bac: 'Bác',
            chu_tich: 'Chủ tịch',
            dong_chi: 'Đồng chí',
        },
    },

    // Breakpoints
    breakpoints: {
        xs: '475px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1600px',
    },

    // Z-index scale
    zIndex: {
        hide: -1,
        auto: 'auto',
        base: 0,
        docked: 10,
        dropdown: 1000,
        sticky: 1100,
        banner: 1200,
        overlay: 1300,
        modal: 1400,
        popover: 1500,
        skipLink: 1600,
        toast: 1700,
        tooltip: 1800,
    },
} as const

// Type exports
export type ThemeConfig = typeof themeConfig
export type ThemeColors = typeof themeConfig.colors
export type ComponentVariants = typeof themeConfig.components

// Helper functions
export const getComponentVariant = (component: keyof typeof themeConfig.components, variant: string) => {
    return themeConfig.components[component]?.[variant as keyof typeof themeConfig.components[typeof component]]
}

export const getVietnameseColor = (type: 'primary' | 'secondary', shade: keyof typeof themeConfig.colors.primary = 500) => {
    return themeConfig.colors[type][shade]
}

export default themeConfig