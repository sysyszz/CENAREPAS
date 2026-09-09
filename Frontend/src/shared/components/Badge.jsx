import { cn } from '../utils/cn';

function Badge({
  className,
  variant = 'default',
  children,
  ...props
}) {
  const variantStyles = {
    default: "border-transparent bg-[#C1502D] text-white hover:bg-[#8A3418]",
    secondary: "bg-[#FFFBF0] text-[#2D2926] border-[#E8B23D]/40 hover:bg-[#F7F1E7]",
    destructive: "border-transparent bg-[#C1502D] text-white hover:bg-[#8A3418]",
    success: "border-transparent bg-[#5A7A3A] text-white hover:bg-[#48632E]",
    warning: "border-transparent bg-[#E8B23D] text-[#2D2926] hover:bg-[#D99B26]",
    outline: "text-[#2D2926] border-[#E8E1D7] hover:bg-[#FFFBF0]",
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
