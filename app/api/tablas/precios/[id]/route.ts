import { NextRequest, NextResponse } from 'next/server'
import { PrecioService } from '@/services/precio.service'

const precioService = new PrecioService()

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const precio = await precioService.findOne(params.id)
    if (!precio) {
      return NextResponse.json({ error: 'Precio not found' }, { status: 404 })
    }
    return NextResponse.json(precio)
  } catch (error) {
    console.error('Error fetching precio:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json()
    const precio = await precioService.update(params.id, data)
    return NextResponse.json(precio)
  } catch (error) {
    console.error('Error updating precio:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const precio = await precioService.delete(params.id)
    return NextResponse.json(precio)
  } catch (error) {
    console.error('Error deleting precio:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
