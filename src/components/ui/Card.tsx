import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
}

export function Card({
  className,
  hover = false,
  padding = "md",
  children,
  ...props
}: CardProps) {
  const paddingClass = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }[padding];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-card shadow-card",
        hover && "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft",
        paddingClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted", className)} {...props}>
      {children}
    </p>
  );
}
