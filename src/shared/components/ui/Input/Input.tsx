'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/shadcn'
import { AlertCircle, CheckCircle } from 'lucide-react'
// import { motion } from 'framer-motion' // Will be added when framer-motion is installed

const inputVariants = cva(
    "flex w-full rounded-2xl border transition-all duration-300 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 group",
    {
        variants: {
            variant: {
                default: "bg-white/80 border-white/30 backdrop-blur-lg hover:bg-white/90 focus:bg-white/95 hover:border-primary-200 focus:border-primary-300",
                luxury: "form-input-luxury",
                ghost: "border-0 bg-transparent focus-visible:ring-1 hover:bg-white/50",
                filled: "bg-primary-50/80 border-primary-100 hover:bg-primary-50 focus:bg-white backdrop-blur-lg",
                glass: "bg-white/60 border-white/40 backdrop-blur-xl hover:bg-white/80 focus:bg-white/90",
            },
            inputSize: {
                default: "h-12 px-4 py-3",
                sm: "h-10 px-3 py-2 text-sm",
                lg: "h-14 px-6 py-4 text-base",
                xl: "h-16 px-8 py-5 text-lg",
            },
            state: {
                default: "",
                error: "border-red-300 focus-visible:ring-red-500 bg-red-50/80",
                success: "border-emerald-300 focus-visible:ring-emerald-500 bg-emerald-50/80",
                warning: "border-amber-300 focus-visible:ring-amber-500 bg-amber-50/80",
            }
        },
        defaultVariants: {
            variant: "default",
            inputSize: "default",
            state: "default",
        },
    }
)

interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
    label?: string
    error?: string
    hint?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    required?: boolean
    fullWidth?: boolean
    showValidation?: boolean
    isValid?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
        className,
        variant,
        inputSize,
        state,
        label,
        error,
        hint,
        leftIcon,
        rightIcon,
        required,
        fullWidth,
        showValidation,
        isValid,
        ...props
    }, ref) => {
        const inputState = error ? 'error' : isValid && showValidation ? 'success' : state

        return (
            <div className={cn("space-y-3", fullWidth && "w-full")}>
                {label && (
                    <label className="form-label-luxury text-neutral-700">
                        {label}
                        {required && (
                            <span className="text-red-500 ml-1 font-bold">*</span>
                        )}
                    </label>
                )}

                <div className="relative group">
                    {leftIcon && (
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 transition-colors duration-200 group-focus-within:text-primary-500">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        className={cn(
                            inputVariants({ variant, inputSize, state: inputState }),
                            leftIcon && "pl-12",
                            (rightIcon || error || (isValid && showValidation)) && "pr-12",
                            "focus:shadow-elegant focus:-translate-y-0.5",
                            className
                        )}
                        ref={ref}
                        {...props}
                    />

                    {(rightIcon || error || (isValid && showValidation)) && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-200">
                            {error ? (
                                <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
                            ) : isValid && showValidation ? (
                                <CheckCircle className="h-5 w-5 text-emerald-500 animate-pulse" />
                            ) : (
                                <span className="text-neutral-400 group-focus-within:text-primary-500">
                                    {rightIcon}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Floating label effect */}
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

Input.displayName = "Input"