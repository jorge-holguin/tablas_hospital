import { NextRequest, NextResponse } from 'next/server'
import { PersonalService } from '@/services/personal.service'
import { Prisma } from '@prisma/client'

const personalService = new PersonalService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const personal = await personalService.findOne(params.id)
    if (!personal) {
      return NextResponse.json({ error: 'Personal no encontrado' }, { status: 404 })
    }
    return NextResponse.json(personal)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()
    const personal = await personalService.update(params.id, data)
    return NextResponse.json(personal)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await personalService.delete(params.id)
    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
