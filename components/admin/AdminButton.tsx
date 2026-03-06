import Link from "next/link";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

const variantStyles: Record<Variant, string> = {
  primary: "bg-gradient-to-r from-brand-primary to-brand-accent text-white hover:opacity-95 shadow-sm",
  secondary: "bg-brand-subtle text-brand-primary-dark hover:bg-brand-primary/10",
  outline: "border border-border bg-white hover:bg-brand-subtle hover:border-brand-primary/30",
  ghost: "hover:bg-brand-subtle text-foreground",
  danger: "bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/20",
};

interface AdminButtonProps {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  target?: string;
}

export function AdminButton({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  className = "",
  disabled = false,
  type = "button",
  onClick,
  target,
}: AdminButtonProps) {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-sm gap-2",
  };

  const baseStyles = `inline-flex items-center font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={baseStyles} target={target}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {icon}
      {children}
    </button>
  );
}
