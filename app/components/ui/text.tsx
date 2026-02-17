import * as React from "react";

type Variant = "body" | "muted" | "label" | "caption";

export interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: Variant;
}

const baseTextClasses = "text-sm text-zinc-800 dark:text-zinc-200";

const variantClasses: Record<Variant, string> = {
  body: "",
  muted: "text-zinc-500 dark:text-zinc-400",
  label: "text-sm font-medium text-zinc-700 dark:text-zinc-300",
  caption: "text-xs text-zinc-500 dark:text-zinc-400",
};

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant = "body", ...props }, ref) => {
    const classes = [
      baseTextClasses,
      variantClasses[variant],
      className || "",
    ]
      .filter(Boolean)
      .join(" ");

    return <p ref={ref} className={classes} {...props} />;
  }
);

Text.displayName = "Text";

