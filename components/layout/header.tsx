'use client'

import Link from "next/link"
import { useState } from "react"
import { Container } from "./container"
import { Button } from "@/components/ui/button"
import { SearchDialog } from "@/components/search/search-dialog"
import { Search, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <header className="border-b bg-white">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold">
                Top Law Firms
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  Listings
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/united-states" className="cursor-pointer">
                      United States
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link
                href="/nominate"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Nominate
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchOpen(true)}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                Search
              </Button>
            </nav>
          </div>
        </Container>
      </header>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
