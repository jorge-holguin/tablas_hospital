import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class PrecioService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.PRECIOWhereInput
    orderBy?: Prisma.PRECIOOrderByWithRelationInput
  }) {
    try {
      const { skip, take, where, orderBy } = params
      
      const precios = await prisma.pRECIO.findMany({
        skip,
        take,
        where,
        orderBy,
      });
      
      // Convert Decimal fields to Number for proper handling in UI
      return precios.map(precio => ({
        ...precio,
        PROMEDIO: precio.PROMEDIO ? Number(precio.PROMEDIO) : 0,
        COSTO: precio.COSTO ? Number(precio.COSTO) : 0,
        UTILIDAD: precio.UTILIDAD ? Number(precio.UTILIDAD) : 0,
        PRECIOPUB: precio.PRECIOPUB ? Number(precio.PRECIOPUB) : 0,
        DESCUENTO: precio.DESCUENTO ? Number(precio.DESCUENTO) : 0,
        PRECIO: precio.PRECIO ? Number(precio.PRECIO) : 0,
      }));
    } catch (error) {
      console.error('Error in PrecioService.findAll:', error);
      throw error;
    }
  }

  async count(params: {
    where?: Prisma.PRECIOWhereInput
  }) {
    try {
      const { where } = params
      return prisma.pRECIO.count({
        where,
      });
    } catch (error) {
      console.error('Error in PrecioService.count:', error);
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const precio = await prisma.pRECIO.findUnique({
        where: { IDRECORD: Number(id) },
      });
      
      if (!precio) return null;
      
      // Convert Decimal fields to Number for proper handling in UI
      return {
        ...precio,
        PROMEDIO: precio.PROMEDIO ? Number(precio.PROMEDIO) : 0,
        COSTO: precio.COSTO ? Number(precio.COSTO) : 0,
        UTILIDAD: precio.UTILIDAD ? Number(precio.UTILIDAD) : 0,
        PRECIOPUB: precio.PRECIOPUB ? Number(precio.PRECIOPUB) : 0,
        DESCUENTO: precio.DESCUENTO ? Number(precio.DESCUENTO) : 0,
        PRECIO: precio.PRECIO ? Number(precio.PRECIO) : 0,
      };
    } catch (error) {
      console.error('Error in PrecioService.findOne:', error);
      throw error;
    }
  }

  async create(data: Prisma.PRECIOCreateInput) {
    return prisma.pRECIO.create({
      data,
    })
  }

  async update(id: string, data: Prisma.PRECIOUpdateInput) {
    return prisma.pRECIO.update({
      where: { IDRECORD: Number(id) },
      data,
    })
  }

  async delete(id: string) {
    return prisma.pRECIO.delete({
      where: { IDRECORD: Number(id) },
    })
  }
}
