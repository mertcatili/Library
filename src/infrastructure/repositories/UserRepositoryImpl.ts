import { Repository } from "typeorm";
import { User } from "../orm/entities/User";
import { UserRepository } from "../../domains/user/repositories/UserRepository";
import { Borrowing } from "../orm/entities/Borrowings";

export class UserRepositoryImpl implements UserRepository {
    constructor(
        private repository: Repository<User>,
        private borrowingRepository: Repository<Borrowing>
    ) {}

    async save(user: User): Promise<User> {
        return this.repository.save(user);
    }

    async findById(id: number): Promise<User | null> {
        return this.repository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async findAll(): Promise<User[]> {
        return this.repository.find();
    }
    
    async findByIdWithBooks(id: number): Promise<User | null> {
        return this.repository.createQueryBuilder("user")
            .leftJoinAndSelect("user.borrowings", "borrowing")
            .leftJoinAndSelect("borrowing.book", "book")
            .where("user.id = :id", { id })
            .getOne();
    }

    async saveBorrowing(borrowing: Borrowing): Promise<Borrowing> {
        return this.borrowingRepository.save(borrowing);
    }

    async findActiveBorrowing(userId: number, bookId: number): Promise<Borrowing | null> {
        return this.borrowingRepository.createQueryBuilder("borrowing")
            .leftJoinAndSelect("borrowing.book", "book")
            .leftJoinAndSelect("borrowing.user", "user")
            .where("user.id = :userId", { userId })
            .andWhere("book.id = :bookId", { bookId })
            .andWhere("borrowing.returnDate IS NULL")
            .getOne();
    }
}
