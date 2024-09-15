import { Book } from "../../../infrastructure/orm/entities/Book";

export interface BookRepository {
    findById(id: number): Promise<Book | null>;
    save(user: Book): Promise<Book>;
    delete(id: number): Promise<void>;
    findAll(): Promise<Book[]>;
    findActiveBooks(): Promise<Book[]>;
}
