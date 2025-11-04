import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva("animate-spin text-primary", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-6 w-6",
      lg: "h-10 w-10",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {}

export function Spinner({ className, size, ...props }: SpinnerProps) {
  return (
    <Loader2 className={cn(spinnerVariants({ size, className }))} {...props} />
  );
}

const overlayVariants = cva(
  "absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50",
  {
    variants: {
      variant: {
        container: "absolute",
        page: "fixed",
      },
    },
    defaultVariants: {
      variant: "container",
    },
  },
);

interface SpinnerOverlayProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof overlayVariants> {
  spinnerSize?: VariantProps<typeof spinnerVariants>["size"];
}

export function SpinnerOverlay({
  className,
  variant,
  spinnerSize,
  ...props
}: SpinnerOverlayProps) {
  return (
    <div
      data-testid="spinner-overlay"
      className={cn(overlayVariants({ variant, className }))}
      {...props}
    >
      <Spinner size={spinnerSize} />
    </div>
  );
}
