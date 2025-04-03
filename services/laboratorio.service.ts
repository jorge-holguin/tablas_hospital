import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class LaboratorioService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.LABORATORIOWhereInput
    orderBy?: Prisma.LABORATORIOOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.lABORATORIO.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.lABORATORIO.findUnique({
      where: { LABORATORIO: id },
    })
  }

  async create(data: Prisma.LABORATORIOCreateInput) {
    return prisma.lABORATORIO.create({
      data,
    })
  }

  async update(id: string, data: Prisma.LABORATORIOUpdateInput) {
    return prisma.lABORATORIO.update({
      where: { LABORATORIO: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.lABORATORIO.delete({
      where: { LABORATORIO: id },
    })
  }
}
