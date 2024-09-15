import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';
import { BookRepository } from '../../book/repositories/BookRepository';
import { DataSource } from 'typeorm';
import { User } from '../../../infrastructure/orm/entities/User';
import { Book } from '../../../infrastructure/orm/entities/Book';
import { RedisLock } from '../../../infrastructure/redis/RedisLock';
import { BadRequestError } from '../../shared/utils/AppError';

jest.mock('../../../infrastructure/redis/redisClient', () => ({
    default: {
        set: jest.fn(),
        del: jest.fn(),
    },
}));

describe('UserService', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockBookRepository: jest.Mocked<BookRepository>;
    let mockDataSource: jest.Mocked<DataSource>;
    let mockRedisLock: jest.Mocked<RedisLock>;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByIdWithBooks: jest.fn(),
            findActiveBorrowing: jest.fn(),
            saveBorrowing: jest.fn(),
        } as any;

        mockBookRepository = {
            findById: jest.fn(),
            save: jest.fn(),
        } as any;

        mockDataSource = {
            createQueryRunner: jest.fn().mockReturnValue({
                connect: jest.fn(),
                startTransaction: jest.fn(),
                commitTransaction: jest.fn(),
                rollbackTransaction: jest.fn(),
                release: jest.fn(),
                manager: {
                    save: jest.fn(),
                },
            }),
        } as any;

        mockRedisLock = {
            acquire: jest.fn(),
            release: jest.fn(),
        } as any;

        userService = new UserService(mockUserRepository, mockBookRepository, mockDataSource);
        (userService as any).redisLock = mockRedisLock;
    });

    describe('create', () => {
        it('should create a user successfully', async () => {
            const name = 'John Doe';
            const user = new User();
            user.firstName = 'John';
            user.lastName = 'Doe';

            mockUserRepository.save.mockResolvedValue(user);

            const result = await userService.create(name);

            expect(result.status).toBe(true);
            expect(result.data).toEqual(user);
            expect(mockUserRepository.save).toHaveBeenCalledWith(expect.objectContaining({
                firstName: 'John',
                lastName: 'Doe'
            }));
        });
    });

    describe('getAllUsers', () => {
        it('should return all users', async () => {
            const users = [new User(), new User()];
            mockUserRepository.findAll.mockResolvedValue(users);

            const result = await userService.getAllUsers();

            expect(result.status).toBe(true);
            expect(result.data).toEqual(users);
        });
    });

    describe('borrowBook', () => {
        it('should borrow a book successfully', async () => {
            const userId = 1;
            const bookId = 1;
            const user = new User();
            const book = new Book();
            book.isActive = true;

            mockUserRepository.findById.mockResolvedValue(user);
            mockBookRepository.findById.mockResolvedValue(book);
            mockRedisLock.acquire.mockResolvedValue(true);

            const result = await userService.borrowBook(userId, bookId);

            expect(result.status).toBe(true);
            expect(mockRedisLock.acquire).toHaveBeenCalled();
            expect(mockDataSource.createQueryRunner().startTransaction).toHaveBeenCalled();
            expect(mockDataSource.createQueryRunner().commitTransaction).toHaveBeenCalled();
            expect(mockDataSource.createQueryRunner().manager.save).toHaveBeenCalledTimes(2);
            expect(mockRedisLock.release).toHaveBeenCalled();
        });

        it('should fail to borrow an inactive book', async () => {
            const userId = 1;
            const bookId = 1;
            const user = new User();
            const book = new Book();
            book.isActive = false;

            mockUserRepository.findById.mockResolvedValue(user);
            mockBookRepository.findById.mockResolvedValue(book);
            mockRedisLock.acquire.mockResolvedValue(true);

            await expect(userService.borrowBook(userId, bookId)).rejects.toThrow(BadRequestError);
            await expect(userService.borrowBook(userId, bookId)).rejects.toThrow("Book is not available for borrowing");
        });
    });
});