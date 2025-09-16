'use client'

import React from 'react'
import { cn } from '@/shared/utils/shadcn'
import { AlertCircle } from 'lucide-react'
// import { motion } from 'framer-motion' // Will be added when framer-motion is installed

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    hint?: string
    resize?: 'none' | 'both' | 'horizontal' | 'vertical'
    variant?: 'default' | 'luxury' | 'glass'
    autoResize?: boolean
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, hint, resize = 'vertical', variant = 'default', autoResize, ...props }, ref) => {
        const resizeClass = {
            none: 'resize-none',
            both: 'resize',
            horizontal: 'resize-x',
            vertical: 'resize-y',
        }[resize]

        const variantClass = {
            default: 'bg-white/80 border-white/30 backdrop-blur-lg hover:bg-white/90 focus:bg-white/95 hover:border-primary-200 focus:border-primary-300',
            luxury: 'form-input-luxury min-h-[120px]',
            glass: 'bg-white/60 border-white/40 backdrop-blur-xl hover:bg-white/80 focus:bg-white/90',
        }[variant]

        return (
            <div className="space-y-3">
                {label && (
                    <label className="form-label-luxury text-neutral-700">
                        {label}
                        {props.required && (
                            <span className="text-red-500 ml-1 font-bold">*</span>
                        )}
                    </label>
                )}

                <div className="relative group">
                    <textarea
                        className={cn(
                            "flex min-h-[120px] w-full rounded-2xl border transition-all duration-300 px-4 py-3 text-sm ring-offset-background placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 focus:shadow-elegant focus:-translate-y-0.5",
                            variantClass,
                            resizeClass,
                            autoResize && 'resize-none',
                            error && "border-red-300 focus-visible:ring-red-500 bg-red-50/80",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />

                    {/* Floating effect overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none" />
                </div>

                {error && (
                    <div className="flex items-center space-x-2 animate-smooth-appear">
                        <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-600 font-medium">{error}</p>
                    </div>
                )}

                {hint && !error && (
                    <p className="text-sm text-neutral-500 leading-relaxed">{hint}</p>
                )}
            </div>
        )
    }
)

Textarea.displayName = "Textarea"

export { Textarea }