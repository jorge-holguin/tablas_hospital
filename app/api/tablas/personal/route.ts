import { NextRequest, NextResponse } from 'next/server'
import { PersonalService } from '@/services/personal.service'
import { Prisma } from '@prisma/client'

const personalService = new PersonalService()

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take = searchParams.get('take') ? Number(searchParams.get('take')) : 10
    const skip = searchParams.get('skip') ? Number(searchParams.get('skip')) : 0
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    
    let where: Prisma.PERSONAL_BORRARWhereInput = {}
    
    // Add search filter if provided
    if (search) {
      where = {
        OR: [
          { NOMBRE: { contains: search } },
          { PERSONAL: { contains: search } }
        ]
      }
    }
    
    // Add active filter if provided
    if (active !== null && active !== undefined) {
      where = {
        ...where,
        ACTIVO: active
      }
    }
    
    const personal = await personalService.findAll({ take, skip, where })
    return NextResponse.json(personal)
  } catch (error) {
    console.error('Error fetching personal:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const personal = await personalService.create(data)
    return NextResponse.json(personal, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
