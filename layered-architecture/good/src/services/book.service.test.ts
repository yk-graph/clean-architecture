import { BookRepositoryInterface } from '@/repositories/book.repository.interface'
import { BookService } from './book.service'
import { Book } from '@prisma/client'

const mockBookRepository: jest.Mocked<BookRepositoryInterface> = {
  create: jest.fn(),
  findById: jest.fn(),
}

describe('BookService', () => {
  let bookService: BookService

  beforeEach(() => {
    bookService = new BookService(mockBookRepository)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should add a book', async () => {
    const mockBook: Book = {
      id: '1',
      title: 'Test Book',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockBookRepository.create.mockResolvedValue(mockBook)

    const result = await bookService.add('Test Book')
    expect(mockBookRepository.create).toHaveBeenCalledWith('Test Book')
    expect(result).toEqual(mockBook)
  })

  it('should find a book by id', async () => {
    const mockBook: Book = {
      id: '1',
      title: 'Test Book',
      isAvailable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockBookRepository.findById.mockResolvedValue(mockBook)

    const result = await bookService.findById('1')
    expect(mockBookRepository.findById).toHaveBeenCalledWith('1')
    expect(result).toEqual(mockBook)
  })
})
