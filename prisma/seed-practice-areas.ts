import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const practiceAreas = [
  "Administrative / Regulatory Law",
  "Admiralty and Maritime Law",
  "Advertising Law",
  "Antitrust Law",
  "Appellate Practice",
  "Arbitration",
  "Aviation Law",
  "Banking and Finance Law",
  "Bankruptcy and Creditor Debtor Rights / Insolvency and Reorganization Law",
  "Bet-the-Company Litigation",
  "Biotechnology and Life Sciences Practice",
  "Business Organizations (including LLCs and Partnerships)",
  "Civil Rights Law",
  "Closely Held Companies and Family Businesses Law",
  "Commercial Finance Law",
  "Commercial Litigation",
  "Commercial Transactions / UCC Law",
  "Communications Law",
  "Construction Law",
  "Copyright Law",
  "Corporate Compliance Law",
  "Corporate Governance Law",
  "Corporate Law",
  "Criminal Defense: General Practice",
  "Criminal Defense: White-Collar",
  "Derivatives and Futures Law",
  "DUI / DWI Defense",
  "Economic Development Law",
  "Education Law",
  "Elder Law",
  "Eminent Domain and Condemnation Law",
  "Employee Benefits (ERISA) Law",
  "Employment Law - Individuals",
  "Employment Law - Management",
  "Energy Law",
  "Energy Regulatory Law",
  "Entertainment Law - Motion Pictures and Television",
  "Entertainment Law - Music",
  "Environmental Law",
  "Equipment Finance Law",
  "Ethics and Professional Responsibility Law",
  "Family Law",
  "Family Law Mediation",
  "FDA Law",
  "Financial Services Regulation Law",
  "First Amendment Law",
  "Franchise Law",
  "Gaming Law",
  "Government Relations Practice",
  "Health Care Law",
  "Immigration Law",
  "Information Technology Law",
  "Insurance Law",
  "International Arbitration - Commercial",
  "International Arbitration - Governmental",
  "International Mergers and Acquisitions",
  "International Trade and Finance Law",
  "Labor Law - Management",
  "Labor Law - Union",
  "Land Use and Zoning Law",
  "Legal Malpractice Law - Defendants",
  "Legal Malpractice Law - Plaintiffs",
  "Leisure and Hospitality Law",
  "Leveraged Buyouts and Private Equity Law",
  "Litigation - Antitrust",
  "Litigation - Banking and Finance",
  "Litigation - Bankruptcy",
  "Litigation - Construction",
  "Litigation - Environmental",
  "Litigation - ERISA",
  "Litigation - First Amendment",
  "Litigation - Health Care",
  "Litigation - Insurance",
  "Litigation - Intellectual Property",
  "Litigation - Labor and Employment",
  "Litigation - Land Use and Zoning",
  "Litigation - Mergers and Acquisitions",
  "Litigation - Municipal",
  "Litigation - Patent",
  "Litigation - Real Estate",
  "Litigation - Regulatory Enforcement (SEC, Telecom, Energy)",
  "Litigation - Securities",
  "Litigation - Trusts and Estates",
  "Litigation and Controversy - Tax",
  "Mass Tort Litigation / Class Actions - Defendants",
  "Mass Tort Litigation / Class Actions - Plaintiffs",
  "Media Law",
  "Mediation",
  "Medical Malpractice Law - Defendants",
  "Medical Malpractice Law - Plaintiffs",
  "Mergers and Acquisitions Law",
  "Mining Law",
  "Mortgage Banking Foreclosure Law",
  "Municipal Law",
  "Mutual Funds Law",
  "Native American Law",
  "Natural Resources Law",
  "Nonprofit / Charities Law",
  "Oil and Gas Law",
  "Patent Law",
  "Personal Injury Litigation - Defendants",
  "Personal Injury Litigation - Plaintiffs",
  "Privacy and Data Security Law",
  "Private Funds / Hedge Funds Law",
  "Product Liability Litigation - Defendants",
  "Product Liability Litigation - Plaintiffs",
  "Professional Malpractice Law - Defendants",
  "Professional Malpractice Law - Plaintiffs",
  "Project Finance Law",
  "Public Finance Law",
  "Railroad Law",
  "Real Estate Law",
  "Securities / Capital Markets Law",
  "Securities Regulation",
  "Securitization and Structured Finance Law",
  "Sports Law",
  "Tax Law",
  "Technology Law",
  "Timber Law",
  "Trademark Law",
  "Transportation Law",
  "Trusts and Estates",
  "Utilities Law",
  "Venture Capital Law",
  "Water Law",
  "Workers' Compensation Law - Claimants",
  "Workers' Compensation Law - Employers"
]

async function main() {
  console.log('Starting to seed practice areas...')

  for (const name of practiceAreas) {
    const slug = slugify(name)

    try {
      await prisma.practiceArea.upsert({
        where: { slug },
        update: { name },
        create: {
          name,
          slug,
        },
      })
      console.log(`✓ Added/Updated: ${name}`)
    } catch (error) {
      console.error(`✗ Failed to add ${name}:`, error)
    }
  }

  console.log(`\n✅ Finished seeding ${practiceAreas.length} practice areas`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
