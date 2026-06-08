import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
        new_submission: "bg-blue-100 text-paom-blue dark:bg-blue-900/30 dark:text-blue-300",
        screening: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
        draft: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        submitted: "bg-blue-100 text-paom-blue dark:bg-blue-900/30 dark:text-blue-300",
        under_review: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        revision_required: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        revision: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
        accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        scheduled: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        published: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        archived: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        available: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        limited: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        unavailable: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        open: "bg-blue-100 text-paom-blue dark:bg-blue-900/30 dark:text-blue-300",
        review: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
        production: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
        planning: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
        in_press: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function StatusBadge({ className, variant, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}
