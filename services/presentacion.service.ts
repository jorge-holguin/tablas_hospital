import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class PresentacionService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.PRESENTACIONWhereInput
    orderBy?: Prisma.PRESENTACIONOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.pRESENTACION.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.pRESENTACION.findUnique({
      where: { PRESENTACION: id },
    })
  }

  async create(data: Prisma.PRESENTACIONCreateInput) {
    return prisma.pRESENTACION.create({
      data,
    })
  }

  async update(id: string, data: Prisma.PRESENTACIONUpdateInput) {
    return prisma.pRESENTACION.update({
      where: { PRESENTACION: id },
      data,
    })
  }

  async deleteMany(ids: string[]) {
    return prisma.pRESENTACION.deleteMany({
      where: { PRESENTACION: { in: ids } },
    })
  }

  async delete(id: string) {
    return prisma.pRESENTACION.delete({
      where: { PRESENTACION: id },
    })
  }
}
