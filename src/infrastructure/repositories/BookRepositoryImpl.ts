import { BookRepository } from "../../domains/book/repositories/BookRepository";
import { Repository } from "typeorm";
import { Book } from "../orm/entities/Book";

export class BookRepositoryImpl implements BookRepository {
    constructor(private repository: Repository<Book>) {}

    async save(book: Book): Promise<Book> {
        return this.repository.save(book);
    }

    async findById(id: number): Promise<Book | null> {
        return this.repository.findOne({ where: { id } });
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async findAll(): Promise<Book[]> {
        return this.repository.find();
    }

    async findActiveBooks(): Promise<Book[]> {
        return this.repository.find({ where: { isActive: true } });
    }
}