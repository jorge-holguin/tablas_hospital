import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class CuentaService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.CUENTAWhereInput
    orderBy?: Prisma.CUENTAOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.cUENTA.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.cUENTA.findUnique({
      where: { CUENTAID: id },
    })
  }

  async create(data: Prisma.CUENTACreateInput) {
    return prisma.cUENTA.create({
      data,
    })
  }

  async update(id: string, data: Prisma.CUENTAUpdateInput) {
    return prisma.cUENTA.update({
      where: { CUENTAID: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.cUENTA.delete({
      where: { CUENTAID: id },
    })
  }
}
