'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { X } from 'lucide-react'

interface SearchFiltersProps {
  states: Array<{ id: string; name: string; slug: string }>
  practiceAreas: Array<{ id: string; name: string; slug: string }>
  currentParams: {
    q?: string
    state?: string
    practiceArea?: string
    page?: string
  }
}

export function SearchFilters({ states, practiceAreas, currentParams }: SearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [query, setQuery] = useState(currentParams.q || '')

  const updateFilters = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams()

    // Keep existing params
    Object.entries(currentParams).forEach(([key, value]) => {
      if (value && key !== 'page') {
        params.set(key, value)
      }
    })

    // Apply updates
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ q: query })
  }

  const clearFilters = () => {
    setQuery('')
    router.push(pathname)
  }

  const hasActiveFilters = currentParams.q || currentParams.state || currentParams.practiceArea

  return (
    <div className="space-y-6">
      {/* Search Query */}
      <div>
        <Label htmlFor="search">Search</Label>
        <form onSubmit={handleSearch} className="flex gap-2 mt-2">
          <Input
            id="search"
            type="text"
            placeholder="Firm name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit">Go</Button>
        </form>
      </div>

      {/* State Filter */}
      <div>
        <Label htmlFor="state">State</Label>
        <Select
          value={currentParams.state || 'all'}
          onValueChange={(value) => updateFilters({ state: value === 'all' ? undefined : value })}
        >
          <SelectTrigger id="state" className="mt-2">
            <SelectValue placeholder="All states" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All states</SelectItem>
            {states.map((state) => (
              <SelectItem key={state.id} value={state.slug}>
                {state.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Practice Area Filter */}
      <div>
        <Label htmlFor="practiceArea">Practice Area</Label>
        <Select
          value={currentParams.practiceArea || 'all'}
          onValueChange={(value) => updateFilters({ practiceArea: value === 'all' ? undefined : value })}
        >
          <SelectTrigger id="practiceArea" className="mt-2">
            <SelectValue placeholder="All practice areas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All practice areas</SelectItem>
            {practiceAreas.map((pa) => (
              <SelectItem key={pa.id} value={pa.slug}>
                {pa.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-sm">Active Filters</h4>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          </div>
          <div className="space-y-2">
            {currentParams.q && (
              <div className="flex items-center gap-2 text-sm bg-accent px-3 py-1.5 rounded-md">
                <span>Query: {currentParams.q}</span>
                <button
                  onClick={() => {
                    setQuery('')
                    updateFilters({ q: undefined })
                  }}
                  className="ml-auto hover:bg-background rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {currentParams.state && (
              <div className="flex items-center gap-2 text-sm bg-accent px-3 py-1.5 rounded-md">
                <span>
                  State: {states.find((s) => s.slug === currentParams.state)?.name}
                </span>
                <button
                  onClick={() => updateFilters({ state: undefined })}
                  className="ml-auto hover:bg-background rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            {currentParams.practiceArea && (
              <div className="flex items-center gap-2 text-sm bg-accent px-3 py-1.5 rounded-md">
                <span>
                  Practice: {practiceAreas.find((pa) => pa.slug === currentParams.practiceArea)?.name}
                </span>
                <button
                  onClick={() => updateFilters({ practiceArea: undefined })}
                  className="ml-auto hover:bg-background rounded p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
