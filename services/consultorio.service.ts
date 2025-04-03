import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class ConsultorioService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.CONSULTORIOWhereInput
    orderBy?: Prisma.CONSULTORIOOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.cONSULTORIO.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.cONSULTORIO.findUnique({
      where: { CONSULTORIO: id },
    })
  }

  async create(data: Prisma.CONSULTORIOCreateInput) {
    return prisma.cONSULTORIO.create({
      data,
    })
  }

  async update(id: string, data: Prisma.CONSULTORIOUpdateInput) {
    return prisma.cONSULTORIO.update({
      where: { CONSULTORIO: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.cONSULTORIO.delete({
      where: { CONSULTORIO: id },
    })
  }
}
