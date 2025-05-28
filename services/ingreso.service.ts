import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class IngresoService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.INGRESOCWhereInput
    orderBy?: Prisma.INGRESOCOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.iNGRESOC.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.iNGRESOC.findUnique({
      where: { INGRESOID: id },
    })
  }

  async create(data: Prisma.INGRESOCCreateInput) {
    return prisma.iNGRESOC.create({
      data,
    })
  }

  async update(id: string, data: Prisma.INGRESOCUpdateInput) {
    return prisma.iNGRESOC.update({
      where: { INGRESOID: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.iNGRESOC.delete({
      where: { INGRESOID: id }, 
    })
  }
  async count(where?: Prisma.INGRESOCWhereInput) {
    return prisma.iNGRESOC.count({ where })
  }
}
