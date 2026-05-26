import { Book } from '@prisma/client'

import { prisma } from '@/lib/prisma'

export class BookRepository {
  async create(title: string): Promise<Book> {
    return await prisma.book.create({
      data: {
        title,
        isAvailable: true,
      },
    })
  }

  async findById(id: string): Promise<Book | null> {
    return await prisma.book.findUnique({
      where: { id },
    })
  }
}
