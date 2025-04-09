import { prisma } from '@/lib/prisma/client'
import { Prisma } from '@prisma/client'

export class TipoAtencionService {
  async findAll(params: {
    skip?: number
    take?: number
    where?: Prisma.TIPO_ATENCIONWhereInput
    orderBy?: Prisma.TIPO_ATENCIONOrderByWithRelationInput
  }) {
    const { skip, take, where, orderBy } = params
    return prisma.tIPO_ATENCION.findMany({
      skip,
      take,
      where,
      orderBy,
    })
  }

  async findOne(id: string) {
    return prisma.tIPO_ATENCION.findUnique({
      where: { TIPO_ATENCION: id },
    })
  }

  async create(data: Prisma.TIPO_ATENCIONCreateInput) {
    return prisma.tIPO_ATENCION.create({
      data,
    })
  }

  async update(id: string, data: Prisma.TIPO_ATENCIONUpdateInput) {
    return prisma.tIPO_ATENCION.update({
      where: { TIPO_ATENCION: id },
      data,
    })
  }

  async delete(id: string) {
    return prisma.tIPO_ATENCION.delete({
      where: { TIPO_ATENCION: id },
    })
  }

  async count(params: {
    where?: Prisma.TIPO_ATENCIONWhereInput
  }) {
    const { where } = params
    return prisma.tIPO_ATENCION.count({
      where,
    })
  }
}
