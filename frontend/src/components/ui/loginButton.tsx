import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
                                                children,
                                                variant = 'primary',
                                                isLoading = false,
                                                fullWidth = false,
                                                className = '',
                                                disabled,
                                                ...props
                                              }) => {
  // Uses project tokens (shadcn-style): bg-primary, text-primary-foreground, border-border, ring-ring, etc.
  const baseStyles =
      "inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
      "disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    primary:
        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md",
    secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
    outline:
        "border border-border bg-background text-foreground hover:bg-accent/10",
    ghost:
        "bg-transparent text-foreground hover:bg-accent/10",
  } as const;

  return (
      <button
          className={`
        ${baseStyles}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
          disabled={disabled || isLoading}
          {...props}
      >
        {isLoading && (
            <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
              <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
              />
              <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
        )}
        {children}
      </button>
  );
};
