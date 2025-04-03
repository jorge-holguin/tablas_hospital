import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class GenericoService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.GENERICOWhereInput
    orderBy?: Prisma.GENERICOOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.gENERICO.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.gENERICO.findUnique({
      where: { GENERICO: id },
    })
  }

  async create(data: Prisma.GENERICOCreateInput) {
    return prisma.gENERICO.create({
      data,
    })
  }

  async update(id: string, data: Prisma.GENERICOUpdateInput) {
    return prisma.gENERICO.update({
      where: { GENERICO: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.gENERICO.delete({
      where: { GENERICO: id },
    })
  }
}
