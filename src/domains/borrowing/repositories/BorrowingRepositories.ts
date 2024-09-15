import { Borrowing } from "../../../infrastructure/orm/entities/Borrowings";

export interface BorrowingRepository {
    findById(id: number): Promise<Borrowing | null>;
    findAll(): Promise<Borrowing[]>;
    findByBook(bookId: number): Promise<Borrowing[]>;
}
