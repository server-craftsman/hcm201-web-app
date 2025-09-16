'use client'

import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/shared/utils/shadcn'
import { Loader2 } from 'lucide-react'
// import { motion } from 'framer-motion' // Will be added when framer-motion is installed

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-semibold ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden group",
    {
        variants: {
            variant: {
                default: "bg-[hsl(var(--primary))] text-white hover:opacity-90 hover:-translate-y-0.5 shadow-elegant",
                luxury: "btn-luxury-primary",
                glass: "btn-luxury-secondary",
                destructive: "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:opacity-90 hover:-translate-y-0.5 shadow-luxury-red",
                outline: "border-2 border-primary-200 bg-white/80 backdrop-blur-lg hover:bg-primary-50 hover:border-primary-300 hover:-translate-y-0.5 text-primary-700 shadow-elegant",
                secondary: "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] hover:opacity-90 hover:-translate-y-0.5 shadow-luxury-gold",
                ghost: "hover:bg-white/80 hover:text-primary-600 hover:backdrop-blur-lg hover:-translate-y-0.5 rounded-2xl",
                link: "text-[hsl(var(--primary))] underline-offset-4 hover:underline hover:text-primary-600",
                vietnamese: "hcm-gradient-luxury text-white hover:shadow-premium hover:-translate-y-1 shadow-luxury",
                success: "bg-emerald-600 text-white hover:bg-emerald-700 hover:-translate-y-0.5 shadow-elegant",
                warning: "bg-amber-600 text-white hover:bg-amber-700 hover:-translate-y-0.5 shadow-elegant",
                premium: "bg-gradient-to-r from-luxury-gold-600 via-luxury-gold-500 to-luxury-gold-600 text-white hover:shadow-luxury-gold hover:-translate-y-1 shadow-premium bg-size-200 hover:bg-pos-0",
            },
            size: {
                default: "h-12 px-6 py-3",
                sm: "h-10 rounded-xl px-4 text-sm",
                lg: "h-14 rounded-2xl px-8 text-base",
                xl: "h-16 rounded-3xl px-12 text-lg font-bold",
                icon: "h-12 w-12 rounded-xl",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    shimmer?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, isLoading, leftIcon, rightIcon, shimmer, children, disabled, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"

        return (
            <Comp
                className={cn(
                    buttonVariants({ variant, size }),
                    shimmer && "animate-shimmer-luxury",
                    "group-hover:translate-y-0 active:scale-98",
                    className
                )}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {/* Shimmer effect overlay */}
                {shimmer && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                )}

                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <span className="animate-pulse">Đang tải...</span>
                    </>
                ) : (
                    <>
                        {leftIcon && (
                            <span className="mr-2 flex items-center transition-transform duration-200 group-hover:scale-110">
                                {leftIcon}
                            </span>
                        )}
                        <span className="relative z-10">{children}</span>
                        {rightIcon && (
                            <span className="ml-2 flex items-center transition-transform duration-200 group-hover:scale-110">
                                {rightIcon}
                            </span>
                        )}
                    </>
                )}
            </Comp>
        )
    }
)

Button.displayName = "Button"