import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class PersonalService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.PERSONAL_BORRARWhereInput
    orderBy?: Prisma.PERSONAL_BORRAROrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.pERSONAL_BORRAR.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.pERSONAL_BORRAR.findUnique({
      where: { PERSONAL: id },
    })
  }

  async create(data: Prisma.PERSONAL_BORRARCreateInput) {
    return prisma.pERSONAL_BORRAR.create({
      data,
    })
  }

  async update(id: string, data: Prisma.PERSONAL_BORRARUpdateInput) {
    return prisma.pERSONAL_BORRAR.update({
      where: { PERSONAL: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.pERSONAL_BORRAR.delete({
      where: { PERSONAL: id },
    })
  }

  async count(params: {
    where?: Prisma.PERSONAL_BORRARWhereInput
  }) {
    const { where } = params
    return prisma.pERSONAL_BORRAR.count({
      where,
    })
  }
}
