import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

interface SectionProps {
  children: ReactNode;
  /** Titre optionnel de la section */
  title?: string;
  /** Sous-titre optionnel */
  description?: string;
  /** Variante de fond */
  variant?: "default" | "muted" | "brand" | "brand-subtle";
  /** Padding vertical */
  size?: "sm" | "md" | "lg";
  className?: string;
  containerClassName?: string;
  /** Largeur du conteneur réduite (prose) */
  narrow?: boolean;
}

const variantClasses = {
  default: "bg-background",
  muted: "bg-muted/40",
  brand: "bg-brand-primary text-white",
  "brand-subtle": "bg-brand-subtle",
};

const sizeClasses = {
  sm: "py-10 sm:py-12",
  md: "py-14 sm:py-16",
  lg: "py-16 sm:py-20",
};

const accentBorderClasses = {
  default: "border-brand-primary",
  muted: "border-brand-primary",
  brand: "border-brand-accent-light",
  "brand-subtle": "border-brand-primary",
};

export function Section({
  children,
  title,
  description,
  variant = "default",
  size = "md",
  className,
  containerClassName,
  narrow,
}: SectionProps) {
  const isBrand = variant === "brand";

  return (
    <section
      className={cn(
        variantClasses[variant],
        sizeClasses[size],
        "overflow-hidden",
        className
      )}
    >
      <Container className={containerClassName} narrow={narrow}>
        {(title || description) && (
          <header className="text-left mb-10 sm:mb-12 animate-in">
            {title && (
              <h2
                className={cn(
                  "section-title text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight pl-4 border-l-4",
                  accentBorderClasses[variant],
                  isBrand ? "text-white" : "text-foreground"
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  "mt-4 text-base sm:text-lg max-w-2xl",
                  isBrand ? "text-brand-light/90" : "text-muted-foreground"
                )}
              >
                {description}
              </p>
            )}
          </header>
        )}
        <div>{children}</div>
      </Container>
    </section>
  );
}
