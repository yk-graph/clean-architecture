import { Book } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { BookRepositoryInterface } from './book.repository.interface'

export class BookRepository implements BookRepositoryInterface {
  create = async (title: string): Promise<Book> => {
    return await prisma.book.create({
      data: {
        title,
        isAvailable: true,
      },
    })
  }

  findById = async (id: string): Promise<Book | null> => {
    return await prisma.book.findUnique({
      where: { id },
    })
  }
}
