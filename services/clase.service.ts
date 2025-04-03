import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class ClaseService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.CLASEWhereInput
    orderBy?: Prisma.CLASEOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.cLASE.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.cLASE.findUnique({
      where: { CLASE: id },
    })
  }

  async create(data: Prisma.CLASECreateInput) {
    return prisma.cLASE.create({
      data,
    })
  }

  async update(id: string, data: Prisma.CLASEUpdateInput) {
    return prisma.cLASE.update({
      where: { CLASE: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.cLASE.delete({
      where: { CLASE: id },
    })
  }
}
