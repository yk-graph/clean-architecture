import { Book } from '@prisma/client'

import { BookRepositoryInterface } from '@/repositories/book.repository.interface'
import { BookServiceInterface } from './book.service.interface'

export class BookService implements BookServiceInterface {
  constructor(private readonly bookRepository: BookRepositoryInterface) {}

  async add(title: string): Promise<Book> {
    return await this.bookRepository.create(title)
  }

  async findById(id: string): Promise<Book | null> {
    return await this.bookRepository.findById(id)
  }
}
