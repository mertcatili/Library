import { BookService } from '../services/BookService';
import { BookRepository } from '../repositories/BookRepository';
import { BorrowingRepository } from '../../borrowing/repositories/BorrowingRepositories';
import { Book } from '../../../infrastructure/orm/entities/Book';
import { CreateBookDto } from '../../../application/dtos/book/CreateBookDto';
import { BadRequestError } from '../../shared/utils/AppError';

describe('BookService', () => {
    let bookService: BookService;
    let mockBookRepository: jest.Mocked<BookRepository>;
    let mockBorrowingRepository: jest.Mocked<BorrowingRepository>;

    beforeEach(() => {
        mockBookRepository = {
            findAll: jest.fn(),
            findById: jest.fn(),
            save: jest.fn(),
        } as any;

        mockBorrowingRepository = {
            findByBook: jest.fn(),
        } as any;

        bookService = new BookService(mockBookRepository, mockBorrowingRepository);
    });

    describe('getAll', () => {
        it('should return all books', async () => {
            const books = [new Book(), new Book()];
            mockBookRepository.findAll.mockResolvedValue(books);

            const result = await bookService.getAll();

            expect(result.status).toBe(true);
            expect(result.data).toEqual(books);
        });
    });

    describe('getById', () => {
        test('should return error if book not found', async () => {
            mockBookRepository.findById.mockResolvedValue(null);

            await expect(bookService.getById(999)).rejects.toThrow(BadRequestError);
            await expect(bookService.getById(999)).rejects.toThrow('Failed to fetch book: NotFoundError: Book not found');
        });

        test('should throw BadRequestError for other errors', async () => {
            mockBookRepository.findById.mockRejectedValue(new Error("Database error"));

            await expect(bookService.getById(1)).rejects.toThrow(BadRequestError);
            await expect(bookService.getById(1)).rejects.toThrow("Failed to fetch book: Error: Database error");
        });

        test('should return book with score if found', async () => {
            const mockBook = new Book();
            mockBook.id = 1;
            mockBook.name = 'Test Book';
            mockBookRepository.findById.mockResolvedValue(mockBook);
            mockBorrowingRepository.findByBook.mockResolvedValue([]);

            const result = await bookService.getById(1);

            expect(result.status).toBe(true);
            expect(result.data).toEqual({ ...mockBook, score: null });
        });
    });

    describe('create', () => {
        it('should create a book successfully', async () => {
            const createBookDto: CreateBookDto = { name: 'New Book' };
            const savedBook = new Book();
            savedBook.id = 1;
            savedBook.name = 'New Book';
            savedBook.isActive = true;

            mockBookRepository.save.mockResolvedValue(savedBook);

            const result = await bookService.create(createBookDto);

            expect(result.status).toBe(true);
            expect(result.data).toEqual(savedBook);
            expect(mockBookRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                name: 'New Book',
                isActive: true
            }));
        });
    });
});