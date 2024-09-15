import { Result } from "../../domains/shared/utils/Response";
import { UserService } from "../../domains/user/services/UserService";
import { Borrowing } from "../../infrastructure/orm/entities/Borrowings";

export class BorrowBookUseCase {
    constructor(private readonly userService: UserService) {}

    async execute(userId: number, bookId: number): Promise<Result<Borrowing>> {
        return await this.userService.borrowBook(userId, bookId);
    }
}