import _ from 'lodash';
import { DataSource } from 'typeorm';

import { User } from "../../../infrastructure/orm/entities/User";
import { UserRepository } from "../repositories/UserRepository";
import { BookDto } from '../../book/types/BookTypes';
import { UserWithBooksDto } from '../types/UserTypes';
import { Borrowing } from '../../../infrastructure/orm/entities/Borrowings';
import { Result, SuccessResult, ErrorResult } from '../../shared/utils/Response';
import { BookRepository } from '../../book/repositories/BookRepository';
import { BaseService } from '../../shared/services/BaseService';

import { RedisLock } from '../../../infrastructure/redis/RedisLock';
import redisClient from '../../../infrastructure/redis/redisClient';
import { NotFoundError, BadRequestError } from '../../shared/utils/AppError';



export class UserService extends BaseService {
    private redisLock: RedisLock;

    constructor(
        private userRepository: UserRepository,
        private bookRepository: BookRepository,
        private dataSource: DataSource
    ) {
        super();
        this.redisLock = new RedisLock(redisClient);
    }

    public async create(name: string): Promise<Result<User>> {
        try {
            const { firstName, lastName } = this.parseFullName(name);
            const user = _.assign(new User(), { firstName, lastName });
            const savedUser = await this.userRepository.save(user);
            return new SuccessResult(savedUser);
        } catch (error) {
            throw new BadRequestError(`Failed to create user: ${error}`);
        }
    }

    public async getAllUsers(): Promise<Result<User[]>> {
        try {
            const users = await this.userRepository.findAll();
            return new SuccessResult(users);
        } catch (error) {
            throw new BadRequestError(`Failed to fetch users: ${error}`);
        }
    }

    public async getUserByIdWithBooks(id: number): Promise<Result<UserWithBooksDto>> {
        const user = await this.userRepository.findByIdWithBooks(id);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        return new SuccessResult(this.mapUserToUserWithBooksDto(user));
    }

    public async borrowBook(userId: number, bookId: number): Promise<Result<Borrowing>> {
        const lockKey = `book_lock:${bookId}`;
        const lockTTL = 100000;

        const acquired = await this.redisLock.acquire(lockKey, lockTTL);
        if (!acquired) {
            throw new BadRequestError("Book is currently being processed. Please try again later.");
        }

        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            const book = await this.bookRepository.findById(bookId);
            if (!book) {
                throw new Error("Book not found");
            }

            if (!book.isActive) {
                throw new Error("Book is not available for borrowing");
            }

            const borrowing = new Borrowing();
            borrowing.user = user;
            borrowing.book = book;
            borrowing.borrowDate = this.now();

            book.isActive = false;

            await queryRunner.manager.save(borrowing);
            await queryRunner.manager.save(book);

            await queryRunner.commitTransaction();
            return new SuccessResult(borrowing);
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestError(`Failed to borrow book: ${error}`);
        } finally {
            await queryRunner.release();
            await this.redisLock.release(lockKey);
        }
    }

    public async returnBook(userId: number, bookId: number, score: number): Promise<Result<{ score: number }>> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const borrowing = await this.userRepository.findActiveBorrowing(userId, bookId);
            if (!borrowing) {
                throw new Error("No active borrowing found for this user and book");
            }

            borrowing.returnDate = this.now();
            borrowing.score = score;

            const book = borrowing.book;
            book.isActive = true;

            await queryRunner.manager.save(borrowing);
            await queryRunner.manager.save(book);

            await queryRunner.commitTransaction();
            return new SuccessResult({ score });
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestError(`Failed to return book: ${error}`);
        } finally {
            await queryRunner.release();
        }
    }

    private mapUserToUserWithBooksDto(user: User): UserWithBooksDto {
        const groupedBooks = this.groupBooksByStatus(user.borrowings);

        return {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            books: {
                past: this.mapBorrowingsToBookDtos(groupedBooks.past),
                present: this.mapBorrowingsToBookDtos(groupedBooks.present)
            }
        };
    }

    private groupBooksByStatus(borrowings: Borrowing[]): { past: Borrowing[], present: Borrowing[] } {
        const grouped = _.groupBy(borrowings, borrowing => borrowing.returnDate ? 'past' : 'present');
        return {
            past: grouped.past || [],
            present: grouped.present || []
        };
    }

    private mapBorrowingsToBookDtos(borrowings: Borrowing[] = []): BookDto[] {
        return borrowings.map(this.mapBorrowingToBookDto);
    }

    private mapBorrowingToBookDto(borrowing: Borrowing): BookDto {
        return {
            id: borrowing.book.id,
            name: borrowing.book.name,
            borrowDate: borrowing.borrowDate,
            returnDate: borrowing.returnDate
        };
    }

    private parseFullName(fullName: string): { firstName: string, lastName: string } {
        const nameParts = _.words(fullName);
        this.validateFullName(nameParts);

        const lastName = _.last(nameParts) || '';
        const firstName = _.initial(nameParts).join(' ');

        return { firstName, lastName };
    }

    private validateFullName(nameParts: string[]): void {
        if (nameParts.length < 2) {
            throw new Error("Full name must include at least a first name and a last name");
        }
    }
}
