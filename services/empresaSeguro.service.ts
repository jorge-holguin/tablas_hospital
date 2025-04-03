import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class EmpresaSeguroService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.EMPRESASEGUROWhereInput
    orderBy?: Prisma.EMPRESASEGUROOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.eMPRESASEGURO.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.eMPRESASEGURO.findUnique({
      where: { EMPRESASEGURO: id },
    })
  }

  async create(data: Prisma.EMPRESASEGUROCreateInput) {
    return prisma.eMPRESASEGURO.create({
      data,
    })
  }

  async update(id: string, data: Prisma.EMPRESASEGUROUpdateInput) {
    return prisma.eMPRESASEGURO.update({
      where: { EMPRESASEGURO: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.eMPRESASEGURO.delete({
      where: { EMPRESASEGURO: id },
    })
  }
}
