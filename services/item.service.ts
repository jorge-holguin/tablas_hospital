import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class ItemService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.ITEMWhereInput
    orderBy?: Prisma.ITEMOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.iTEM.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async count(params: {
    where?: Prisma.ITEMWhereInput
  }) {
    const { where } = params
    return prisma.iTEM.count({
      where,
    })
  }

  async findOne(id: string) {
    return prisma.iTEM.findUnique({
      where: { ITEM: id },
    })
  }

  async create(data: Prisma.ITEMCreateInput) {
    return prisma.iTEM.create({
      data,
    })
  }

  async update(id: string, data: Prisma.ITEMUpdateInput) {
    return prisma.iTEM.update({
      where: { ITEM: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.iTEM.delete({
      where: { ITEM: id },
    })
  }
}
