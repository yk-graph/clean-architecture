import { Request, Response } from 'express'

import { Book } from '@prisma/client'
import { BookServiceInterface } from '@/services/book.service.interface'

export class BookController {
  constructor(private readonly bookService: BookServiceInterface) {}

  async add(req: Request, res: Response): Promise<void> {
    try {
      const { title } = req.body as Book
      const book = await this.bookService.add(title)
      res.status(201).json(book)
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }

  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string
      const book = await this.bookService.findById(id)

      if (book) {
        res.status(200).json(book)
      } else {
        res.status(404).json({ error: 'Book not found' })
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message })
        return
      }
      res.status(500).json({ error: 'An unknown error occurred' })
    }
  }
}
