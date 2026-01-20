/**
 * Format employee count into a readable range
 */
export function formatEmployeeCount(count: number | null | undefined): string {
  if (!count) return "Not specified"

  if (count < 50) return "1-49 employees"
  if (count < 100) return "50-99 employees"
  if (count < 250) return "100-249 employees"
  if (count < 500) return "250-499 employees"
  if (count < 1000) return "500-999 employees"
  if (count < 2500) return "1,000-2,499 employees"
  if (count < 5000) return "2,500-4,999 employees"
  if (count < 10000) return "5,000-9,999 employees"

  return "10,000+ employees"
}
