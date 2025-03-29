import * as React from "react";
import { cn } from "@/lib/utils";

interface CustomSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function CustomSeparator({
  className,
  label,
  ...props
}: CustomSeparatorProps) {
  return (
    <div
      className={cn(
        "flex items-center w-full my-2",
        className
      )}
      {...props}
    >
      <div className="h-px flex-1 bg-border/50" />
      {label && (
        <div className="px-2 text-xs font-medium text-muted-foreground">
          {label}
        </div>
      )}
      <div className="h-px flex-1 bg-border/50" />
    </div>
  );
}
