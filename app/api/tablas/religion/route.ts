import { NextRequest, NextResponse } from 'next/server'
import { ReligionService } from '@/services/religion.service'
import { Prisma } from '@prisma/client'

const religionService = new ReligionService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.RELIGIONWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { RELIGION: { contains: search } },
          { NOMBRE: { contains: search } },
        ]
      }
    }
    
    const religion = await religionService.findAll({ take, skip, where })
    return NextResponse.json(religion)
  } catch (error) {
    console.error('Error fetching religion:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const religion = await religionService.create(data)
    return NextResponse.json(religion, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
