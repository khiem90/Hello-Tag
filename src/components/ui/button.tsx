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
    const baseStyles = "inline-flex items-center justify-center font-heading font-bold uppercase tracking-wide transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-4 focus-visible:ring-offset-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";
    
    const variants = {
      primary: "bg-bubble-blue text-white border-2 border-black shadow-cartoon hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-cartoon",
      secondary: "bg-sunshine-yellow text-soft-graphite border-2 border-black shadow-cartoon hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-cartoon",
      outline: "bg-white text-soft-graphite border-2 border-black shadow-cartoon hover:-translate-y-1 hover:bg-warm-cloud active:translate-y-0 active:shadow-cartoon",
      ghost: "bg-transparent text-soft-graphite hover:bg-black/5 hover:text-black",
      danger: "bg-candy-coral text-white border-2 border-black shadow-cartoon hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-cartoon",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs rounded-full",
      md: "h-11 px-6 text-sm rounded-full",
      lg: "h-14 px-8 text-base rounded-full",
      icon: "h-10 w-10 p-0 rounded-full",
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

