import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { type Category } from "@/lib/actions/categories"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type CategoryStyleVariant = "post" | "project" | "member"

export function getCategoryStyle(catName: string, categories: Category[], variant: CategoryStyleVariant = "post") {
  const cat = categories.find(c => c.name === catName)
  const color = cat?.color || "primary"

  switch (variant) {
    case "project":
      // Na seção de projetos, os cards têm fundo escuro, então usamos cores sólidas
      if (color === "primary") return "bg-primary text-primary-foreground"
      return `bg-${color}-500 text-white`
    
    case "member":
      if (color === "primary") return "bg-primary/15 text-primary border-primary/30"
      return `bg-${color}-500/15 text-${color}-700 dark:text-${color}-400 border-${color}-500/30`
    
    case "post":
    default:
      return `bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 border border-${color}-500/20`
  }
}
