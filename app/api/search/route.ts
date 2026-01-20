import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q') || ''
  const state = searchParams.get('state')
  const practiceArea = searchParams.get('practiceArea')
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 20

  try {
    // Build where clause
    const where: any = {}

    // Text search on firm name
    if (query) {
      where.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    }

    // Filter by state
    if (state) {
      where.offices = {
        some: {
          state: {
            slug: state,
          },
        },
      }
    }

    // Filter by practice area
    if (practiceArea) {
      where.practiceAreas = {
        some: {
          practiceArea: {
            slug: practiceArea,
          },
        },
      }
    }

    // Fetch firms
    const [firms, total] = await Promise.all([
      prisma.firm.findMany({
        where,
        take: pageSize,
        skip: (page - 1) * pageSize,
        orderBy: [
          { overallRanking: 'asc' },
          { name: 'asc' },
        ],
        include: {
          offices: {
            take: 1,
            include: { state: true },
          },
          practiceAreas: {
            take: 3,
            include: { practiceArea: true },
            orderBy: { tierLevel: 'asc' },
          },
        },
      }),
      prisma.firm.count({ where }),
    ])

    return NextResponse.json({
      firms,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Failed to search firms' },
      { status: 500 }
    )
  }
}
