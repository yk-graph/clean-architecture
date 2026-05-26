import express from 'express'

import { BookController } from '@/controllers/book.controller'
import { BookRepository } from '@/repositories/book.repository'
import { createBookRouter } from '@/routes/book.router'
import { BookService } from '@/services/book.service'

const app = express()

const PORT = process.env.PORT || 8000

app.use(express.json())

const bookRepository = new BookRepository()
const bookService = new BookService(bookRepository)
const bookController = new BookController(bookService)
const bookRouter = createBookRouter(bookController)

app.use('/books', bookRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})
