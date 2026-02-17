import * as React from "react";

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

const baseLabelClasses =
  "text-sm font-medium text-zinc-700 dark:text-zinc-300";

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    const classes = className
      ? `${baseLabelClasses} ${className}`
      : baseLabelClasses;

    return <label ref={ref} className={classes} {...props} />;
  }
);

Label.displayName = "Label";

