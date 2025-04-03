import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class MedicoService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.MEDICOWhereInput
    orderBy?: Prisma.MEDICOOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.mEDICO.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.mEDICO.findUnique({
      where: { MEDICO: id },
    })
  }

  async create(data: Prisma.MEDICOCreateInput) {
    return prisma.mEDICO.create({
      data,
    })
  }

  async update(id: string, data: Prisma.MEDICOUpdateInput) {
    return prisma.mEDICO.update({
      where: { MEDICO: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.mEDICO.delete({
      where: { MEDICO: id },
    })
  }
}
