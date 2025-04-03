import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class FamiliaService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.FAMILIAWhereInput
    orderBy?: Prisma.FAMILIAOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.fAMILIA.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.fAMILIA.findUnique({
      where: { FAMILIA: id },
    })
  }

  async create(data: Prisma.FAMILIACreateInput) {
    return prisma.fAMILIA.create({
      data,
    })
  }

  async update(id: string, data: Prisma.FAMILIAUpdateInput) {
    return prisma.fAMILIA.update({
      where: { FAMILIA: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.fAMILIA.delete({
      where: { FAMILIA: id },
    })
  }
}
