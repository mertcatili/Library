import { Repository } from "typeorm";
import { Borrowing } from "../orm/entities/Borrowings";
import { BorrowingRepository } from "../../domains/borrowing/repositories/BorrowingRepositories";

export class BorrowingRepositoryImpl implements BorrowingRepository {
    constructor(private repository: Repository<Borrowing>) {}

    async findAll(): Promise<Borrowing[]> {
        return this.repository.find();
    }

    async findById(id: number): Promise<Borrowing | null> {
        return this.repository.findOne({ where: { id } });
    }

    async findByBook(bookId: number): Promise<Borrowing[]> {
        const borrowings = await this.repository.createQueryBuilder("borrowing")
            .innerJoinAndSelect("borrowing.book", "book")
            .where("borrowing.bookId = :bookId", { bookId })
            .andWhere("borrowing.returnDate IS NOT NULL")
            .andWhere("borrowing.score IS NOT NULL")
            .getMany();

        return borrowings;
    }
}