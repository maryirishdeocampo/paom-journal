"use client";

import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-paom-blue focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-paom-red text-white shadow-sm hover:bg-red-700 hover:shadow-md active:scale-[0.98]",
        secondary:
          "bg-paom-blue text-white shadow-sm hover:bg-blue-900 hover:shadow-md active:scale-[0.98]",
        outline:
          "border-2 border-border bg-transparent hover:bg-card hover:border-paom-blue/30",
        ghost: "hover:bg-card hover:text-paom-blue",
        gold: "bg-paom-gold text-foreground shadow-sm hover:brightness-95",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

export function Button({
  className,
  variant,
  size,
  href,
  children,
  ...props
}: ButtonProps) {
  if (href) {
    return (
      <Link href={href} className={cn(buttonVariants({ variant, size, className }))}>
        {children}
      </Link>
    );
  }

  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {children}
    </button>
  );
}
