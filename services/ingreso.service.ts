import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class IngresoService {
  async findOne(id: string) {
    try {
      const ingreso = await prisma.iNGRESOC.findUnique({
        where: { INGRESOID: id },
      });
      
      return ingreso;
    } catch (error) {
      console.error('Error in IngresoService.findOne:', error);
      throw error;
    }
  }
}
