import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  /** Fond: image URL ou "gradient" pour dégradé seul */
  background?: "gradient" | string;
  children?: ReactNode;
  className?: string;
}

export function PageHero({
  title,
  subtitle,
  background = "gradient",
  children,
  className,
}: PageHeroProps) {
  const isImage = background !== "gradient" && background.length > 0;

  return (
    <section
      className={cn(
        "relative flex items-center py-16 sm:py-20",
        isImage ? "min-h-[320px] sm:min-h-[380px]" : "min-h-[200px] bg-transparent",
        className
      )}
    >
      {isImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${background})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-primary-dark/85 via-brand-primary-dark/50 to-transparent" />
        </>
      )}
      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1
          className={cn(
            "font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-left uppercase",
            isImage ? "text-white" : "text-foreground"
          )}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "mt-4 text-left text-lg sm:text-xl max-w-2xl font-light",
              isImage ? "text-white" : "text-muted-foreground"
            )}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
