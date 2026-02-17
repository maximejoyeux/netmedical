import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const baseInputClasses =
  "block w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm focus:outline-none focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:focus-visible:border-zinc-500 dark:focus-visible:ring-zinc-500 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500";

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const classes = className
      ? `${baseInputClasses} ${className}`
      : baseInputClasses;

    return <input ref={ref} className={classes} {...props} />;
  }
);

Input.displayName = "Input";

