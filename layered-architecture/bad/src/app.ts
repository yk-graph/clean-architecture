import express from 'express'

import { BookController } from '@/controllers/book.controller'
import { createBookRouter } from '@/routes/book.router'

const app = express()

const PORT = process.env.PORT || 8000

app.use(express.json())

const bookController = new BookController()
const bookRouter = createBookRouter(bookController)

app.use('/books', bookRouter)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`)
})
