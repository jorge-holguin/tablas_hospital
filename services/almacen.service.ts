import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class AlmacenService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.ALMACENWhereInput
    orderBy?: Prisma.ALMACENOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.aLMACEN.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.aLMACEN.findUnique({
      where: { ALMACEN: id },
    })
  }

  async create(data: Prisma.ALMACENCreateInput) {
    return prisma.aLMACEN.create({
      data,
    })
  }

  async update(id: string, data: Prisma.ALMACENUpdateInput) {
    return prisma.aLMACEN.update({
      where: { ALMACEN: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.aLMACEN.delete({
      where: { ALMACEN: id },
    })
  }

  async count(params: {
    where?: Prisma.ALMACENWhereInput
  }) {
    const { where } = params
    return prisma.aLMACEN.count({
      where,
    })
  }
}
