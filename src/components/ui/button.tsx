import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { 
      className, 
      variant = "primary", 
      size = "md", 
      isLoading = false, 
      children, 
      disabled, 
      ...props 
    },
    ref
  ) => {
    const baseStyles = "inline-flex items-center justify-center font-medium tracking-tight transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta/50 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-terracotta text-white shadow-soft hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0 active:shadow-soft",
      secondary: "bg-stone text-ink shadow-soft-sm hover:bg-sage-light hover:shadow-soft active:shadow-soft-sm",
      outline: "bg-transparent text-ink border border-ink/20 hover:border-ink/40 hover:bg-stone/50",
      ghost: "bg-transparent text-ink-light hover:text-ink hover:bg-stone/50",
      danger: "bg-red-500/90 text-white shadow-soft hover:bg-red-600 hover:shadow-hover hover:-translate-y-0.5 active:translate-y-0",
    };

    const sizes = {
      sm: "h-9 px-4 text-sm rounded-lg",
      md: "h-11 px-6 text-sm rounded-lg",
      lg: "h-12 px-8 text-base rounded-lg",
      icon: "h-10 w-10 p-0 rounded-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
