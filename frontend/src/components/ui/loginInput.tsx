import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
    endIcon?: React.ReactNode;
    onEndIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, icon, endIcon, onEndIconClick, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                <label className="block text-sm font-medium text-foreground mb-1.5">
                    {label}
                </label>

                <div className="relative">
                    <input
                        ref={ref}
                        className={`
              w-full px-4 py-2.5 rounded-lg border bg-background text-foreground placeholder:text-muted-foreground
              transition-all duration-200 ease-in-out
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background
              disabled:opacity-50 disabled:pointer-events-none
              ${icon ? 'pl-10' : ''}
              ${endIcon ? 'pr-10' : ''}
              ${
                            error
                                ? 'border-destructive focus-visible:ring-destructive/40'
                                : 'border-border hover:border-border/80'
                        }
              ${className}
            `}
                        {...props}
                    />

                    {icon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                            {icon}
                        </div>
                    )}

                    {endIcon && (
                        <button
                            type="button"
                            className={`absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors ${
                                onEndIconClick ? 'cursor-pointer hover:text-foreground' : 'pointer-events-none'
                            }`}
                            onClick={onEndIconClick}
                            tabIndex={-1}
                        >
                            {endIcon}
                        </button>
                    )}
                </div>

                {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
            </div>
        );
    }
);

Input.displayName = 'Input';
