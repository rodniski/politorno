import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const getRowStyles = (variant: string, index: number) => {
  const baseStyles = "transition-all duration-200 hover:bg-accent/50";
  const borderStyles = {
    default: "border-l-primary",
    secondary: "border-l-secondary",
    outline: "border-l-muted-foreground",
    destructive: "border-l-destructive",
  };

  return `${baseStyles} ${
    borderStyles[variant as keyof typeof borderStyles] || borderStyles.default
  }`;
};

export const getIconStyles = (variant: string) => {
  const iconStyles = {
    default: "text-primary bg-primary/10",
    secondary: "text-secondary-foreground bg-secondary",
    outline: "text-muted-foreground bg-muted",
    destructive: "text-destructive bg-destructive/10",
  };

  return iconStyles[variant as keyof typeof iconStyles] || iconStyles.default;
};
