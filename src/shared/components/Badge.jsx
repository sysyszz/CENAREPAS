import { cn } from '../utils/cn';

function Badge({
  className,
  variant = 'default',
  children,
  ...props
}) {
  const variantStyles = {
    default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
    destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
    outline: "text-slate-900 border-slate-200 hover:bg-slate-100",
  };

  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-colors",
        variantStyles[variant] || variantStyles.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
