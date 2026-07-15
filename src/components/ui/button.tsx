import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "accent";
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
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-none font-mono text-[11px] uppercase tracking-[0.06em] leading-[14px] transition-all duration-[160ms] ease-[cubic-bezier(.2,.8,.2,1)] cursor-pointer hover:-translate-y-px hover:shadow-[inset_0_-2px_0_0_currentColor] active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-ink text-white-ink border border-ink",
      secondary: "bg-cream text-ink border border-ink",
      outline: "bg-transparent text-ink border border-ink",
      ghost: "bg-transparent text-ink border border-transparent hover:border-ink",
      danger: "bg-yellow text-ink border border-ink",
      accent: "bg-pink text-ink border border-ink",
    };

    const sizes = {
      sm: "h-9 px-4",
      md: "h-11 px-6",
      lg: "h-11 px-8",
      icon: "h-10 w-10 p-0",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
            className="mr-2 h-4 w-4 animate-spin"
          >
            <path
              d="M50 18c-10-13-31-7-32 8-2 18 22 25 31 11 8-12-10-22-18-12-7 9 5 17 13 11"
              fill="none"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
            />
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
