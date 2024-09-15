import { Borrowing } from "../../../infrastructure/orm/entities/Borrowings";
import { User } from "../../../infrastructure/orm/entities/User";


export interface UserRepository {
    findById(id: number): Promise<User | null>;
    save(user: User): Promise<User>;
    delete(id: number): Promise<void>;
    findAll(): Promise<User[]>;
    findByIdWithBooks(id: number): Promise<User | null>;
    saveBorrowing(borrowing: Borrowing): Promise<Borrowing>;
    findActiveBorrowing(userId: number, bookId: number): Promise<Borrowing | null>;
}
