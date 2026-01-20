'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface SearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onOpenChange(false)
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  // Reset query when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('')
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Search Law Firms</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search by firm name..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <Button type="submit" disabled={!query.trim()}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            <p>You can also:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Browse by state or practice area from the navigation</li>
              <li>Use advanced filters on the search results page</li>
            </ul>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
