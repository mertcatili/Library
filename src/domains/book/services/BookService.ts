import _ from 'lodash';
import { Book } from "../../../infrastructure/orm/entities/Book";
import { BookRepository } from "../repositories/BookRepository";
import { BorrowingRepository } from "../../borrowing/repositories/BorrowingRepositories";
import { CreateBookDto } from '../../../application/dtos/book/CreateBookDto';
import { BookWithScore } from '../types/BookTypes';
import { Result, SuccessResult, ErrorResult } from '../../shared/utils/Response';
import { BadRequestError, NotFoundError } from '../../shared/utils/AppError';

export class BookService {
    constructor(
        private bookRepository: BookRepository,
        private borrowingRepository: BorrowingRepository
    ) {}

    public async getAll(): Promise<Result<Book[]>> {
        try {
            return new SuccessResult(await this.bookRepository.findAll());
        } catch (error) {
            throw new BadRequestError(`Failed to fetch books: ${error}`);
        }
    }

    public async getById(id: number): Promise<Result<BookWithScore>> {
        try {
            const book = await this.bookRepository.findById(id);
            if (_.isNil(book)) {
                throw new NotFoundError("Book not found");
            }
            const bookWithScore = await this.addAverageScore(book);
            return new SuccessResult(bookWithScore);
        } catch (error) {
            throw new BadRequestError(`Failed to fetch book: ${error}`);
        }
    }

    public async create(createBookDto: CreateBookDto): Promise<Result<Book>> {
        try {
            const newBook = _.assign(new Book(), 
            {   name: createBookDto.name,
                isActive: true
            });
            const savedBook = await this.bookRepository.save(newBook);
            return new SuccessResult(savedBook);
        } catch (error) {
            throw new BadRequestError(`Failed to create book: ${error}`);
        }
    }

    private async addAverageScore(book: Book): Promise<BookWithScore> {
        const borrowings = await this.borrowingRepository.findByBook(book.id);

        const completedBorrowings = borrowings.filter(b => b.returnDate !== null && b.score !== null);
        const scores = completedBorrowings.map(b => b.score as number);
        let averageScore: number | null = null;
        
        if (scores.length > 0) {
            averageScore = _.mean(scores);
        }
        
        return { ...book, score: averageScore };
    }
}