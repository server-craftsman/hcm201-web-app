'use client'

import React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { cn } from '@/shared/utils/shadcn'
// import { motion } from 'framer-motion' // Will be added when framer-motion is installed

// Primitive components
const SelectRoot = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value

const SelectTrigger = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
        ref={ref}
        className={cn(
            "flex h-12 w-full items-center justify-between rounded-2xl border border-white/30 bg-white/80 backdrop-blur-lg px-4 py-3 text-sm ring-offset-background placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 transition-all duration-300 hover:bg-white/90 focus:bg-white/95 hover:border-primary-200 focus:border-primary-300 focus:shadow-elegant focus:-translate-y-0.5 group",
            className
        )}
        {...props}
    >
        {children}
        <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-5 w-5 text-neutral-400 transition-all duration-200 group-focus:text-primary-500 group-hover:text-primary-400" />
        </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectScrollUpButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollUpButton
        ref={ref}
        className={cn(
            "flex cursor-default items-center justify-center py-2 transition-colors hover:bg-primary-50",
            className
        )}
        {...props}
    >
        <ChevronUp className="h-4 w-4 text-primary-600" />
    </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

const SelectScrollDownButton = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.ScrollDownButton
        ref={ref}
        className={cn(
            "flex cursor-default items-center justify-center py-2 transition-colors hover:bg-primary-50",
            className
        )}
        {...props}
    >
        <ChevronDown className="h-4 w-4 text-primary-600" />
    </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName

const SelectContent = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
        <SelectPrimitive.Content
            ref={ref}
            className={cn(
                "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-2xl border border-white/30 bg-white/95 backdrop-blur-xl text-popover-foreground shadow-luxury data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                position === "popper" &&
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                className
            )}
            position={position}
            {...props}
        >
            <SelectScrollUpButton />
            <SelectPrimitive.Viewport
                className={cn(
                    "p-2",
                    position === "popper" &&
                    "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
                )}
            >
                {children}
            </SelectPrimitive.Viewport>
            <SelectScrollDownButton />
        </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Label
        ref={ref}
        className={cn("py-2 pl-10 pr-3 text-sm font-bold text-primary-700", className)}
        {...props}
    />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
        ref={ref}
        className={cn(
            "relative flex w-full cursor-default select-none items-center rounded-xl py-3 pl-10 pr-3 text-sm outline-none focus:bg-primary-50 focus:text-primary-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-all duration-200 hover:bg-primary-50/50 hover:translate-x-1",
            className
        )}
        {...props}
    >
        <span className="absolute left-3 flex h-4 w-4 items-center justify-center">
            <SelectPrimitive.ItemIndicator>
                <Check className="h-4 w-4 text-primary-600" />
            </SelectPrimitive.ItemIndicator>
        </span>

        <SelectPrimitive.ItemText className="font-medium">{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <SelectPrimitive.Separator
        ref={ref}
        className={cn("-mx-1 my-2 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent", className)}
        {...props}
    />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// Form field Select component
interface SelectOption {
    value: string
    label: string
    icon?: React.ReactNode
}

interface SelectProps {
    label?: string
    options: SelectOption[]
    value?: string
    onChange?: (value: string) => void
    onValueChange?: (value: string) => void
    error?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
    className?: string
    variant?: 'default' | 'luxury' | 'glass'
}

const Select = React.forwardRef<
    React.ElementRef<typeof SelectPrimitive.Trigger>,
    SelectProps
>(({
    label,
    options,
    value,
    onChange,
    onValueChange,
    error,
    placeholder,
    required,
    disabled,
    className,
    variant = 'default'
}, ref) => {
    const handleValueChange = (newValue: string) => {
        onChange?.(newValue)
        onValueChange?.(newValue)
    }

    const triggerClassName = cn(
        variant === 'luxury' && "form-input-luxury h-12",
        variant === 'glass' && "bg-white/60 backdrop-blur-xl",
        error && "border-red-300 focus-visible:ring-red-500 bg-red-50/80"
    )

    return (
        <div className={cn("space-y-3", className)}>
            {label && (
                <label className="form-label-luxury text-neutral-700">
                    {label}
                    {required && (
                        <span className="text-red-500 ml-1 font-bold">*</span>
                    )}
                </label>
            )}

            <div className="relative group">
                <SelectRoot value={value} onValueChange={handleValueChange} disabled={disabled}>
                    <SelectTrigger ref={ref} className={triggerClassName}>
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                <div className="flex items-center space-x-2">
                                    {option.icon && (
                                        <span className="text-primary-500">{option.icon}</span>
                                    )}
                                    <span>{option.label}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectRoot>

                {/* Floating effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 opacity-0 group-focus-within:opacity-10 transition-opacity duration-300 pointer-events-none" />
            </div>

            {error && (
                <div className="flex items-center space-x-2 animate-smooth-appear">
                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}
        </div>
    )
})

Select.displayName = "Select"

export {
    Select,
    SelectRoot,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
}