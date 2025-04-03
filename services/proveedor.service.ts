import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class ProveedorService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.PROVEEDORWhereInput
    orderBy?: Prisma.PROVEEDOROrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.pROVEEDOR.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.pROVEEDOR.findUnique({
      where: { PROVEEDOR: id },
    })
  }

  async create(data: Prisma.PROVEEDORCreateInput) {
    return prisma.pROVEEDOR.create({
      data,
    })
  }

  async update(id: string, data: Prisma.PROVEEDORUpdateInput) {
    return prisma.pROVEEDOR.update({
      where: { PROVEEDOR: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.pROVEEDOR.delete({
      where: { PROVEEDOR: id },
    })
  }
}
