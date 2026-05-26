import { Book } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { BookRepositoryInterface } from './book.repository.interface'

export class BookRepository implements BookRepositoryInterface {
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
