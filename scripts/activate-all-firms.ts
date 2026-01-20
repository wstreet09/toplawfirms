import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const result = await prisma.firm.updateMany({
    data: {
      isActive: true,
    },
  })

  console.log(`✅ Updated ${result.count} firms to active status`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
