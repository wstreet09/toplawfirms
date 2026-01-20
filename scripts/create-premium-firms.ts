import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Get California state
  const california = await prisma.state.findFirst({
    where: { slug: 'california' }
  })

  if (!california) {
    console.error('California state not found')
    return
  }

  // Get United States country
  const usa = await prisma.country.findFirst({
    where: { slug: 'united-states' }
  })

  if (!usa) {
    console.error('United States country not found')
    return
  }

  // Get some practice areas
  const practiceAreas = await prisma.practiceArea.findMany({
    take: 5
  })

  // Create first premium firm
  const firm1 = await prisma.firm.create({
    data: {
      name: 'Morrison & Foerster LLP',
      slug: 'morrison-foerster',
      description: 'Morrison & Foerster is a global firm of exceptional credentials. Our clients include some of the largest financial institutions, technology companies, and life sciences companies.',
      website: 'https://www.mofo.com',
      phone: '+1 (415) 268-7000',
      founded: 1883,
      employeeCount: 1000,
      countryId: usa.id,
      isActive: true,
      isPremium: true,
      tierLevel: 1,
    }
  })

  // Create office for firm 1
  await prisma.office.create({
    data: {
      firmId: firm1.id,
      stateId: california.id,
      city: 'San Francisco',
      address: '425 Market Street',
      postalCode: '94105',
      isPrimary: true,
    }
  })

  // Add practice areas to firm 1
  for (const pa of practiceAreas.slice(0, 3)) {
    await prisma.firmPracticeArea.create({
      data: {
        firmId: firm1.id,
        practiceAreaId: pa.id,
        tierLevel: 1,
      }
    })
  }

  console.log('Created premium firm:', firm1.name)

  // Create second premium firm
  const firm2 = await prisma.firm.create({
    data: {
      name: 'Cooley LLP',
      slug: 'cooley',
      description: 'Cooley LLP is a global law firm that provides clients with strategic legal counsel and specializes in emerging companies, venture capital, M&A, and IP litigation.',
      website: 'https://www.cooley.com',
      phone: '+1 (650) 843-5000',
      founded: 1920,
      employeeCount: 1400,
      countryId: usa.id,
      isActive: true,
      isPremium: true,
      tierLevel: 1,
    }
  })

  // Create office for firm 2
  await prisma.office.create({
    data: {
      firmId: firm2.id,
      stateId: california.id,
      city: 'Palo Alto',
      address: '3175 Hanover Street',
      postalCode: '94304',
      isPrimary: true,
    }
  })

  // Add practice areas to firm 2
  for (const pa of practiceAreas.slice(0, 3)) {
    await prisma.firmPracticeArea.create({
      data: {
        firmId: firm2.id,
        practiceAreaId: pa.id,
        tierLevel: 1,
      }
    })
  }

  console.log('Created premium firm:', firm2.name)
  console.log('\nSuccessfully created 2 premium firms in California!')
}

main()
  .catch((e) => {
    console.error('Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
