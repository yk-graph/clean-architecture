import { Router } from 'express'
import { BookController } from '@/controllers/book.controller'

export const createBookRouter = (bookController: BookController): Router => {
  const router = Router()

  router.post('/', bookController.add.bind(bookController))
  router.get('/:id', bookController.findById.bind(bookController))

  return router
}
