import Link from "next/link"
import { Container } from "./container"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <Container>
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <Link href="/">
                <img
                  src="/images/logo.png"
                  alt="Top Law Firms"
                  className="h-12 w-auto mb-4"
                />
              </Link>
              <p className="text-sm text-muted-foreground">
                Discover top-ranked law firms across the United States.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/browse/states" className="text-muted-foreground hover:text-foreground transition-colors">
                    Browse by State
                  </Link>
                </li>
                <li>
                  <Link href="/browse/practice-areas" className="text-muted-foreground hover:text-foreground transition-colors">
                    Browse by Practice Area
                  </Link>
                </li>
                <li>
                  <Link href="/united-states" className="text-muted-foreground hover:text-foreground transition-colors">
                    United States
                  </Link>
                </li>
                <li>
                  <Link href="/nominate" className="text-muted-foreground hover:text-foreground transition-colors">
                    Nominate
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/methodology" className="text-muted-foreground hover:text-foreground transition-colors">
                    Methodology
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {currentYear} Top Law Firms. All rights reserved.</p>
          </div>
        </div>
      </Container>
    </footer>
  )
}
