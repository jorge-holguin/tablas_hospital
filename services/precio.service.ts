import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class PrecioService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.PRECIOWhereInput
    orderBy?: Prisma.PRECIOOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.pRECIO.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async count(params: {
    where?: Prisma.PRECIOWhereInput
  }) {
    const { where } = params
    return prisma.pRECIO.count({
      where,
    })
  }

  async findOne(id: string) {
    return prisma.pRECIO.findUnique({
      where: { IDRECORD: Number(id) },
    })
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
