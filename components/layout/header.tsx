'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={`border-b bg-white sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
        <Container>
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-28'}`}>
            <div className="flex items-center">
              <Link href="/" className="transition-all duration-300">
                <img
                  src="/images/logo.png"
                  alt="Top Law Firms"
                  className={`transition-all duration-300 ${scrolled ? 'h-14' : 'h-24'} w-auto`}
                />
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
              <Link
                href="/contact"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
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
