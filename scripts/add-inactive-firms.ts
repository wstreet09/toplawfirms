import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get California state
  const california = await prisma.state.findFirst({
    where: { code: 'CA' },
  })

  if (!california) {
    console.error('California state not found')
    return
  }

  // Get United States country
  const usa = await prisma.country.findFirst({
    where: { code: 'US' },
  })

  if (!usa) {
    console.error('United States country not found')
    return
  }

  // Get some practice areas
  const practiceAreas = await prisma.practiceArea.findMany({
    take: 5,
  })

  const inactiveFirms = [
    {
      name: 'Thompson & Associates Law Group',
      city: 'San Francisco',
      description: 'Boutique law firm specializing in corporate transactions and business law.',
      practiceAreaNames: ['Corporate Law', 'Business Law'],
    },
    {
      name: 'Martinez Legal Partners',
      city: 'Los Angeles',
      description: 'Full-service law firm providing comprehensive legal solutions.',
      practiceAreaNames: ['Real Estate Law', 'Tax Law'],
    },
    {
      name: 'Chen & Rodriguez LLP',
      city: 'San Diego',
      description: 'Experienced attorneys serving individuals and businesses.',
      practiceAreaNames: ['Employment Law', 'Litigation'],
    },
    {
      name: 'Pacific Coast Legal Advisors',
      city: 'San Jose',
      description: 'Technology-focused law firm serving startups and established companies.',
      practiceAreaNames: ['Intellectual Property', 'Corporate Law'],
    },
    {
      name: 'Golden State Law Firm',
      city: 'Sacramento',
      description: 'Trusted legal counsel for businesses and individuals throughout California.',
      practiceAreaNames: ['Family Law', 'Estate Planning'],
    },
  ]

  for (const firmData of inactiveFirms) {
    const slug = firmData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    // Create firm
    const firm = await prisma.firm.create({
      data: {
        name: firmData.name,
        slug,
        description: firmData.description,
        isActive: false, // Inactive profile
        countryId: usa.id,
      },
    })

    // Create office
    await prisma.office.create({
      data: {
        firmId: firm.id,
        city: firmData.city,
        address: '123 Main Street',
        stateId: california.id,
        isPrimary: true,
      },
    })

    // Add practice areas
    for (const paName of firmData.practiceAreaNames) {
      const practiceArea = await prisma.practiceArea.findFirst({
        where: {
          name: {
            contains: paName,
            mode: 'insensitive',
          },
        },
      })

      if (practiceArea) {
        await prisma.firmPracticeArea.create({
          data: {
            firmId: firm.id,
            practiceAreaId: practiceArea.id,
          },
        })
      }
    }

    console.log(`✅ Created inactive firm: ${firm.name} in ${firmData.city}, CA`)
  }

  console.log(`\n✅ Successfully created ${inactiveFirms.length} inactive law firms in California`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
