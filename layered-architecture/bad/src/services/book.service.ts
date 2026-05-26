import { Book } from '@prisma/client'

import { BookRepository } from '@/repositories/book.repository'

export class BookService {
  private bookRepository: BookRepository

  constructor() {
    this.bookRepository = new BookRepository()
  }

  async add(title: string): Promise<Book> {
    return await this.bookRepository.create(title)
  }

  async findById(id: string): Promise<Book | null> {
    return await this.bookRepository.findById(id)
  }
}
