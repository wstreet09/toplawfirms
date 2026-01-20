import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to create slugs
function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function main() {
  console.log('🌱 Starting seed...')

  // Create or get Country
  console.log('Creating/getting country...')
  const usa = await prisma.country.upsert({
    where: { code: 'US' },
    update: {},
    create: {
      name: 'United States',
      slug: 'united-states',
      code: 'US',
    },
  })

  // Create States - All 50 US States + DC
  console.log('Creating states...')
  const statesData = [
    { name: 'Alabama', code: 'AL' },
    { name: 'Alaska', code: 'AK' },
    { name: 'Arizona', code: 'AZ' },
    { name: 'Arkansas', code: 'AR' },
    { name: 'California', code: 'CA' },
    { name: 'Colorado', code: 'CO' },
    { name: 'Connecticut', code: 'CT' },
    { name: 'Delaware', code: 'DE' },
    { name: 'District of Columbia', code: 'DC' },
    { name: 'Florida', code: 'FL' },
    { name: 'Georgia', code: 'GA' },
    { name: 'Hawaii', code: 'HI' },
    { name: 'Idaho', code: 'ID' },
    { name: 'Illinois', code: 'IL' },
    { name: 'Indiana', code: 'IN' },
    { name: 'Iowa', code: 'IA' },
    { name: 'Kansas', code: 'KS' },
    { name: 'Kentucky', code: 'KY' },
    { name: 'Louisiana', code: 'LA' },
    { name: 'Maine', code: 'ME' },
    { name: 'Maryland', code: 'MD' },
    { name: 'Massachusetts', code: 'MA' },
    { name: 'Michigan', code: 'MI' },
    { name: 'Minnesota', code: 'MN' },
    { name: 'Mississippi', code: 'MS' },
    { name: 'Missouri', code: 'MO' },
    { name: 'Montana', code: 'MT' },
    { name: 'Nebraska', code: 'NE' },
    { name: 'Nevada', code: 'NV' },
    { name: 'New Hampshire', code: 'NH' },
    { name: 'New Jersey', code: 'NJ' },
    { name: 'New Mexico', code: 'NM' },
    { name: 'New York', code: 'NY' },
    { name: 'North Carolina', code: 'NC' },
    { name: 'North Dakota', code: 'ND' },
    { name: 'Ohio', code: 'OH' },
    { name: 'Oklahoma', code: 'OK' },
    { name: 'Oregon', code: 'OR' },
    { name: 'Pennsylvania', code: 'PA' },
    { name: 'Rhode Island', code: 'RI' },
    { name: 'South Carolina', code: 'SC' },
    { name: 'South Dakota', code: 'SD' },
    { name: 'Tennessee', code: 'TN' },
    { name: 'Texas', code: 'TX' },
    { name: 'Utah', code: 'UT' },
    { name: 'Vermont', code: 'VT' },
    { name: 'Virginia', code: 'VA' },
    { name: 'Washington', code: 'WA' },
    { name: 'West Virginia', code: 'WV' },
    { name: 'Wisconsin', code: 'WI' },
    { name: 'Wyoming', code: 'WY' },
  ]

  const states = await Promise.all(
    statesData.map((state) =>
      prisma.state.upsert({
        where: {
          countryId_slug: {
            countryId: usa.id,
            slug: createSlug(state.name),
          },
        },
        update: {},
        create: {
          name: state.name,
          slug: createSlug(state.name),
          code: state.code,
          countryId: usa.id,
        },
      })
    )
  )

  const stateMap: Record<string, any> = {}
  states.forEach((state) => {
    stateMap[state.code] = state
  })

  // Create Metros
  console.log('Creating metros...')
  const metros = await Promise.all([
    // California
    prisma.metro.create({
      data: {
        name: 'San Francisco Bay Area',
        slug: 'san-francisco',
        stateId: stateMap['CA'].id,
      },
    }),
    prisma.metro.create({
      data: {
        name: 'Los Angeles',
        slug: 'los-angeles',
        stateId: stateMap['CA'].id,
      },
    }),
    prisma.metro.create({
      data: {
        name: 'San Diego',
        slug: 'san-diego',
        stateId: stateMap['CA'].id,
      },
    }),
    // New York
    prisma.metro.create({
      data: {
        name: 'New York City',
        slug: 'new-york-city',
        stateId: stateMap['NY'].id,
      },
    }),
    // Texas
    prisma.metro.create({
      data: {
        name: 'Houston',
        slug: 'houston',
        stateId: stateMap['TX'].id,
      },
    }),
    prisma.metro.create({
      data: {
        name: 'Dallas',
        slug: 'dallas',
        stateId: stateMap['TX'].id,
      },
    }),
    prisma.metro.create({
      data: {
        name: 'Austin',
        slug: 'austin',
        stateId: stateMap['TX'].id,
      },
    }),
    // Illinois
    prisma.metro.create({
      data: {
        name: 'Chicago',
        slug: 'chicago',
        stateId: stateMap['IL'].id,
      },
    }),
    // Massachusetts
    prisma.metro.create({
      data: {
        name: 'Boston',
        slug: 'boston',
        stateId: stateMap['MA'].id,
      },
    }),
    // Washington
    prisma.metro.create({
      data: {
        name: 'Seattle',
        slug: 'seattle',
        stateId: stateMap['WA'].id,
      },
    }),
  ])

  // Create Practice Areas
  console.log('Creating practice areas...')
  const practiceAreasData = [
    { name: 'Corporate Law', description: 'Business formation, M&A, corporate governance' },
    { name: 'Litigation', description: 'Civil and commercial litigation' },
    { name: 'Intellectual Property', description: 'Patents, trademarks, copyrights' },
    { name: 'Tax Law', description: 'Tax planning and controversy' },
    { name: 'Real Estate', description: 'Commercial and residential real estate' },
    { name: 'Labor & Employment', description: 'Employment law and workplace issues' },
    { name: 'Mergers & Acquisitions', description: 'M&A transactions and deals' },
    { name: 'Banking & Finance', description: 'Financial services and banking law' },
    { name: 'Healthcare', description: 'Healthcare regulatory and compliance' },
    { name: 'Environmental Law', description: 'Environmental compliance and litigation' },
    { name: 'Personal Injury', description: 'Personal injury and accident claims' },
    { name: 'Family Law', description: 'Divorce, custody, and family matters' },
    { name: 'Criminal Defense', description: 'Criminal defense representation' },
    { name: 'Immigration', description: 'Immigration and visa services' },
    { name: 'Bankruptcy', description: 'Bankruptcy and restructuring' },
  ]

  const practiceAreas = await Promise.all(
    practiceAreasData.map((pa) =>
      prisma.practiceArea.create({
        data: {
          name: pa.name,
          slug: createSlug(pa.name),
          description: pa.description,
        },
      })
    )
  )

  // Create Law Firms
  console.log('Creating law firms...')
  const firmsData = [
    {
      name: 'Kirkland & Ellis LLP',
      website: 'https://www.kirkland.com',
      founded: 1908,
      employeeCount: 3000,
      tierLevel: 1,
      overallRanking: 1,
      description:
        'Kirkland & Ellis is a leading global law firm with more than 3,000 lawyers representing clients in complex corporate transactions, intellectual property, litigation, and other matters.',
    },
    {
      name: 'Latham & Watkins LLP',
      website: 'https://www.lw.com',
      founded: 1934,
      employeeCount: 2800,
      tierLevel: 1,
      overallRanking: 2,
      description:
        'Latham & Watkins is a global law firm providing innovative solutions to complex legal and business challenges worldwide.',
    },
    {
      name: 'Cravath, Swaine & Moore LLP',
      website: 'https://www.cravath.com',
      founded: 1819,
      employeeCount: 500,
      tierLevel: 1,
      overallRanking: 3,
      description:
        'Cravath is known for pioneering the modern business law firm model and representing many of the world\'s preeminent companies.',
    },
    {
      name: 'Skadden, Arps, Slate, Meagher & Flom LLP',
      website: 'https://www.skadden.com',
      founded: 1948,
      employeeCount: 1700,
      tierLevel: 1,
      overallRanking: 4,
      description:
        'Skadden provides legal services to corporations, financial institutions, and governmental entities globally.',
    },
    {
      name: 'Sullivan & Cromwell LLP',
      website: 'https://www.sullcrom.com',
      founded: 1879,
      employeeCount: 875,
      tierLevel: 1,
      overallRanking: 5,
      description:
        'Sullivan & Cromwell is a premier law firm with a long history of serving leading companies in their most important transactions and litigation.',
    },
    {
      name: 'Jones Walker LLP',
      website: 'https://www.joneswalker.com',
      founded: 1937,
      employeeCount: 350,
      tierLevel: 2,
      overallRanking: 15,
      description:
        'Jones Walker is among the largest 150 law firms in the United States, with offices throughout the Gulf South.',
    },
    {
      name: 'Wachtell, Lipton, Rosen & Katz',
      website: 'https://www.wlrk.com',
      founded: 1965,
      employeeCount: 260,
      tierLevel: 1,
      overallRanking: 6,
      description:
        'Wachtell Lipton is a prominent law firm focused on M&A, corporate governance, and complex litigation.',
    },
    {
      name: 'Gibson, Dunn & Crutcher LLP',
      website: 'https://www.gibsondunn.com',
      founded: 1890,
      employeeCount: 1400,
      tierLevel: 1,
      overallRanking: 7,
      description:
        'Gibson Dunn is a leading global law firm providing legal services across industries and practice areas.',
    },
    {
      name: 'Davis Polk & Wardwell LLP',
      website: 'https://www.davispolk.com',
      founded: 1849,
      employeeCount: 950,
      tierLevel: 1,
      overallRanking: 8,
      description:
        'Davis Polk is a global law firm with world-class practices in corporate, litigation, and regulatory law.',
    },
    {
      name: 'Cleary Gottlieb Steen & Hamilton LLP',
      website: 'https://www.clearygottlieb.com',
      founded: 1946,
      employeeCount: 1200,
      tierLevel: 1,
      overallRanking: 9,
      description:
        'Cleary Gottlieb is a leading international law firm with a focus on cross-border transactions and litigation.',
    },
    {
      name: 'Simpson Thacher & Bartlett LLP',
      website: 'https://www.stblaw.com',
      founded: 1884,
      employeeCount: 1000,
      tierLevel: 1,
      overallRanking: 10,
      description:
        'Simpson Thacher advises many of the world\'s leading private equity firms and companies on high-stakes transactions.',
    },
    {
      name: 'Paul, Weiss, Rifkind, Wharton & Garrison LLP',
      website: 'https://www.paulweiss.com',
      founded: 1875,
      employeeCount: 1000,
      tierLevel: 1,
      overallRanking: 11,
      description:
        'Paul Weiss is known for its M&A, private equity, and litigation practices.',
    },
    {
      name: 'Wilson Sonsini Goodrich & Rosati',
      website: 'https://www.wsgr.com',
      founded: 1961,
      employeeCount: 900,
      tierLevel: 2,
      overallRanking: 12,
      description:
        'Wilson Sonsini is the premier legal advisor to technology, life sciences, and growth enterprises.',
    },
    {
      name: 'Morrison & Foerster LLP',
      website: 'https://www.mofo.com',
      founded: 1883,
      employeeCount: 1000,
      tierLevel: 2,
      overallRanking: 13,
      description:
        'Morrison & Foerster is a global firm with a focus on technology, finance, and litigation.',
    },
    {
      name: 'Cooley LLP',
      website: 'https://www.cooley.com',
      founded: 1920,
      employeeCount: 1600,
      tierLevel: 2,
      overallRanking: 14,
      description:
        'Cooley offers a full range of legal services for technology and life sciences companies.',
    },
    {
      name: 'Fenwick & West LLP',
      website: 'https://www.fenwick.com',
      founded: 1972,
      employeeCount: 400,
      tierLevel: 2,
      overallRanking: 16,
      description:
        'Fenwick is a leading law firm providing comprehensive legal services to technology and life sciences clients.',
    },
    {
      name: 'Goodwin Procter LLP',
      website: 'https://www.goodwinlaw.com',
      founded: 1912,
      employeeCount: 1600,
      tierLevel: 2,
      overallRanking: 17,
      description:
        'Goodwin is a law firm focused on serving the world\'s most innovative companies and investors.',
    },
    {
      name: 'Ropes & Gray LLP',
      website: 'https://www.ropesgray.com',
      founded: 1865,
      employeeCount: 1400,
      tierLevel: 2,
      overallRanking: 18,
      description:
        'Ropes & Gray is a preeminent global law firm serving clients in major centers of business and finance.',
    },
    {
      name: 'WilmerHale',
      website: 'https://www.wilmerhale.com',
      founded: 2004,
      employeeCount: 1000,
      tierLevel: 2,
      overallRanking: 19,
      description:
        'WilmerHale is a leading law firm providing legal representation across a comprehensive range of practice areas.',
    },
    {
      name: 'Debevoise & Plimpton LLP',
      website: 'https://www.debevoise.com',
      founded: 1931,
      employeeCount: 700,
      tierLevel: 2,
      overallRanking: 20,
      description:
        'Debevoise is a premier law firm with a global presence and expertise in complex transactions and disputes.',
    },
    {
      name: 'Orrick, Herrington & Sutcliffe LLP',
      website: 'https://www.orrick.com',
      founded: 1863,
      employeeCount: 1100,
      tierLevel: 2,
      overallRanking: 21,
      description:
        'Orrick is a global law firm focused on serving technology and innovation companies.',
    },
    {
      name: 'Perkins Coie LLP',
      website: 'https://www.perkinscoie.com',
      founded: 1912,
      employeeCount: 1100,
      tierLevel: 2,
      overallRanking: 22,
      description:
        'Perkins Coie provides full legal services with a particular emphasis on technology companies.',
    },
    {
      name: 'Sidley Austin LLP',
      website: 'https://www.sidley.com',
      founded: 1866,
      employeeCount: 2100,
      tierLevel: 2,
      overallRanking: 23,
      description:
        'Sidley is one of the world\'s leading law firms with a reputation for providing quality legal services.',
    },
    {
      name: 'Baker McKenzie',
      website: 'https://www.bakermckenzie.com',
      founded: 1949,
      employeeCount: 4700,
      tierLevel: 2,
      overallRanking: 24,
      description:
        'Baker McKenzie is a global law firm helping clients navigate complex legal challenges across borders.',
    },
    {
      name: 'DLA Piper',
      website: 'https://www.dlapiper.com',
      founded: 2005,
      employeeCount: 3700,
      tierLevel: 3,
      overallRanking: 25,
      description:
        'DLA Piper is a global law firm with reach across the Americas, Asia Pacific, Europe, Africa, and the Middle East.',
    },
  ]

  const firms = []
  for (const firmData of firmsData) {
    const firm = await prisma.firm.create({
      data: {
        name: firmData.name,
        slug: createSlug(firmData.name),
        website: firmData.website,
        founded: firmData.founded,
        employeeCount: firmData.employeeCount,
        tierLevel: firmData.tierLevel,
        overallRanking: firmData.overallRanking,
        description: firmData.description,
        countryId: usa.id,
      },
    })
    firms.push(firm)
  }

  console.log(`Created ${firms.length} law firms`)

  // Create Offices for firms
  console.log('Creating offices...')
  const officesData: any[] = [
    // Kirkland & Ellis
    { firmIndex: 0, city: 'New York', stateCode: 'NY', metroIndex: 3, address: '601 Lexington Avenue', isPrimary: true },
    { firmIndex: 0, city: 'Chicago', stateCode: 'IL', metroIndex: 7, address: '300 North LaSalle' },
    { firmIndex: 0, city: 'Palo Alto', stateCode: 'CA', metroIndex: 0, address: '333 University Avenue' },
    // Latham & Watkins
    { firmIndex: 1, city: 'Los Angeles', stateCode: 'CA', metroIndex: 1, address: '355 South Grand Avenue', isPrimary: true },
    { firmIndex: 1, city: 'New York', stateCode: 'NY', metroIndex: 3, address: '1271 Avenue of the Americas' },
    { firmIndex: 1, city: 'San Francisco', stateCode: 'CA', metroIndex: 0, address: '505 Montgomery Street' },
    // Cravath
    { firmIndex: 2, city: 'New York', stateCode: 'NY', metroIndex: 3, address: 'Worldwide Plaza, 825 Eighth Avenue', isPrimary: true },
    // Skadden
    { firmIndex: 3, city: 'New York', stateCode: 'NY', metroIndex: 3, address: 'One Manhattan West', isPrimary: true },
    { firmIndex: 3, city: 'Boston', stateCode: 'MA', metroIndex: 8, address: '500 Boylston Street' },
    { firmIndex: 3, city: 'Palo Alto', stateCode: 'CA', metroIndex: 0, address: '525 University Avenue' },
    // Sullivan & Cromwell
    { firmIndex: 4, city: 'New York', stateCode: 'NY', metroIndex: 3, address: '125 Broad Street', isPrimary: true },
    { firmIndex: 4, city: 'Los Angeles', stateCode: 'CA', metroIndex: 1, address: '1888 Century Park East' },
    // Jones Walker
    { firmIndex: 5, city: 'Houston', stateCode: 'TX', metroIndex: 4, address: '811 Main Street', isPrimary: true },
    // Wachtell Lipton
    { firmIndex: 6, city: 'New York', stateCode: 'NY', metroIndex: 3, address: '51 West 52nd Street', isPrimary: true },
    // Gibson Dunn
    { firmIndex: 7, city: 'Los Angeles', stateCode: 'CA', metroIndex: 1, address: '333 South Grand Avenue', isPrimary: true },
    { firmIndex: 7, city: 'New York', stateCode: 'NY', metroIndex: 3, address: '200 Park Avenue' },
    { firmIndex: 7, city: 'San Francisco', stateCode: 'CA', metroIndex: 0, address: '555 Mission Street' },
    // Davis Polk
    { firmIndex: 8, city: 'New York', stateCode: 'NY', metroIndex: 3, address: '450 Lexington Avenue', isPrimary: true },
    // Cleary Gottlieb
    { firmIndex: 9, city: 'New York', stateCode: 'NY', metroIndex: 3, address: 'One Liberty Plaza', isPrimary: true },
    // Simpson Thacher
    { firmIndex: 10, city: 'New York', stateCode: 'NY', metroIndex: 3, address: '425 Lexington Avenue', isPrimary: true },
    { firmIndex: 10, city: 'Palo Alto', stateCode: 'CA', metroIndex: 0, address: '2475 Hanover Street' },
    // Paul Weiss
    { firmIndex: 11, city: 'New York', stateCode: 'NY', metroIndex: 3, address: '1285 Avenue of the Americas', isPrimary: true },
    // Wilson Sonsini
    { firmIndex: 12, city: 'Palo Alto', stateCode: 'CA', metroIndex: 0, address: '650 Page Mill Road', isPrimary: true },
    { firmIndex: 12, city: 'San Francisco', stateCode: 'CA', metroIndex: 0, address: 'One Market Plaza' },
    { firmIndex: 12, city: 'Seattle', stateCode: 'WA', metroIndex: 9, address: '701 Fifth Avenue' },
    // Morrison & Foerster
    { firmIndex: 13, city: 'San Francisco', stateCode: 'CA', metroIndex: 0, address: '425 Market Street', isPrimary: true },
    { firmIndex: 13, city: 'New York', stateCode: 'NY', metroIndex: 3, address: '250 West 55th Street' },
    // Cooley
    { firmIndex: 14, city: 'Palo Alto', stateCode: 'CA', metroIndex: 0, address: '3175 Hanover Street', isPrimary: true },
    { firmIndex: 14, city: 'San Francisco', stateCode: 'CA', metroIndex: 0, address: '101 California Street' },
    { firmIndex: 14, city: 'Boston', stateCode: 'MA', metroIndex: 8, address: '500 Boylston Street' },
  ]

  for (const office of officesData) {
    await prisma.office.create({
      data: {
        firmId: firms[office.firmIndex].id,
        address: office.address,
        city: office.city,
        stateId: stateMap[office.stateCode].id,
        metroId: office.metroIndex !== undefined ? metros[office.metroIndex].id : undefined,
        isPrimary: office.isPrimary || false,
        phone: `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
      },
    })
  }

  console.log('Created offices')

  // Associate firms with practice areas
  console.log('Creating firm-practice area relationships...')
  const firmPracticeAreas = []

  // Top tier firms get multiple practice areas
  for (let i = 0; i < Math.min(15, firms.length); i++) {
    const firm = firms[i]
    const numPracticeAreas = Math.floor(Math.random() * 5) + 3 // 3-7 practice areas
    const selectedPracticeAreas = practiceAreas
      .sort(() => Math.random() - 0.5)
      .slice(0, numPracticeAreas)

    for (let j = 0; j < selectedPracticeAreas.length; j++) {
      await prisma.firmPracticeArea.create({
        data: {
          firmId: firm.id,
          practiceAreaId: selectedPracticeAreas[j].id,
          ranking: j + 1,
          tierLevel: Math.min(firm.tierLevel! + j, 5),
        },
      })
    }
  }

  console.log('Created firm-practice area relationships')

  // Create some lawyers
  console.log('Creating lawyers...')
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Jennifer', 'William', 'Jessica', 'James', 'Lisa', 'Thomas', 'Karen', 'Daniel']
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson']

  for (let i = 0; i < Math.min(10, firms.length); i++) {
    const firm = firms[i]
    const numLawyers = Math.floor(Math.random() * 8) + 5 // 5-12 lawyers per firm

    for (let j = 0; j < numLawyers; j++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
      const isRecognized = Math.random() > 0.5

      const lawyer = await prisma.lawyer.create({
        data: {
          firstName,
          lastName,
          slug: createSlug(`${firstName}-${lastName}-${firm.slug}-${i}-${j}`),
          title: Math.random() > 0.3 ? 'Partner' : 'Associate',
          firmId: firm.id,
          isRecognized,
          recognitionTier: isRecognized ? Math.floor(Math.random() * 3) + 1 : undefined,
          yearsExperience: Math.floor(Math.random() * 30) + 5,
          bio: `${firstName} ${lastName} is a ${Math.random() > 0.3 ? 'Partner' : 'Associate'} at ${firm.name}, specializing in corporate law and litigation.`,
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${firm.slug}.com`,
        },
      })

      // Associate with 1-3 practice areas
      const lawyerPracticeAreas = practiceAreas
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1)

      for (let k = 0; k < lawyerPracticeAreas.length; k++) {
        await prisma.lawyerPracticeArea.create({
          data: {
            lawyerId: lawyer.id,
            practiceAreaId: lawyerPracticeAreas[k].id,
            isPrimary: k === 0,
          },
        })
      }
    }
  }

  console.log('Created lawyers')

  // Create client comments
  console.log('Creating client comments...')
  const comments = [
    'Outstanding work on our M&A transaction. The team was responsive and strategic.',
    'Excellent representation in complex litigation. Highly recommended.',
    'The firm provided exceptional guidance on our corporate restructuring.',
    'Professional, knowledgeable, and results-oriented. A pleasure to work with.',
    'Their expertise in intellectual property is unmatched.',
    'Responsive and practical advice for our business needs.',
    'Top-tier legal service with a deep understanding of our industry.',
  ]

  for (let i = 0; i < Math.min(15, firms.length); i++) {
    const firm = firms[i]
    const numComments = Math.floor(Math.random() * 4) + 2 // 2-5 comments per firm

    for (let j = 0; j < numComments; j++) {
      await prisma.clientComment.create({
        data: {
          firmId: firm.id,
          content: comments[Math.floor(Math.random() * comments.length)],
          clientName: Math.random() > 0.3 ? `Fortune 500 Company` : null,
          projectType: ['M&A Deal', 'Litigation', 'Corporate Governance', 'IP Protection'][Math.floor(Math.random() * 4)],
          year: 2020 + Math.floor(Math.random() * 5),
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
        },
      })
    }
  }

  console.log('Created client comments')
  console.log('✅ Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
