import { NextRequest, NextResponse } from 'next/server'
import { ReligionService } from '@/services/religion.service'
import { Prisma } from '@prisma/client'

const religionService = new ReligionService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const searchTerm = searchParams.get("search") || ""
    const active = searchParams.get("active")
    
    let where: Prisma.RELIGIONWhereInput = {}

    const count = await religionService.count({ where })
    return NextResponse.json({ count })
  } catch (error) {
    console.error('Error counting religion:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
