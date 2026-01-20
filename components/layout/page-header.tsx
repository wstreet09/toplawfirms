import { cn } from "@/lib/utils"

interface PageHeaderProps {
  heading: string
  description?: string
  className?: string
}

export function PageHeader({ heading, description, className }: PageHeaderProps) {
  return (
    <div className={cn("space-y-2 pb-8", className)}>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {heading}
      </h1>
      {description && (
        <p className="text-lg text-muted-foreground max-w-3xl">
          {description}
        </p>
      )}
    </div>
  )
}
