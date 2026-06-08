import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "flex h-11 w-full rounded-xl border border-border bg-card px-4 text-sm transition-colors",
          "placeholder:text-muted focus:border-paom-blue focus:outline-none focus:ring-2 focus:ring-paom-blue/20",
          error && "border-paom-red focus:border-paom-red focus:ring-paom-red/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-paom-red">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ className, label, error, id, ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-border bg-card px-4 py-3 text-sm transition-colors",
          "placeholder:text-muted focus:border-paom-blue focus:outline-none focus:ring-2 focus:ring-paom-blue/20",
          error && "border-paom-red focus:border-paom-red focus:ring-paom-red/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-paom-red">{error}</p>}
    </div>
  );
}
