import { ReactNode } from "react";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export function AdminCard({ children, className = "", padding = "md" }: AdminCardProps) {
  const paddingClass = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  }[padding];

  return (
    <div
      className={`rounded-xl border border-border bg-white shadow-sm overflow-hidden ${paddingClass} ${className}`}
    >
      {children}
    </div>
  );
}
