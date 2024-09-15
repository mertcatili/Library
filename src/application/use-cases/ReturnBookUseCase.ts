import { Result } from "../../domains/shared/utils/Response";
import { UserService } from "../../domains/user/services/UserService";
import { ReturnBookDto } from "../dtos/borrowing/ReturnBookDto";

export class ReturnBookUseCase {
    constructor(private readonly userService: UserService) {}

    async execute(userId: number, bookId: number, dto: ReturnBookDto): Promise<Result<{ score: number }>> {
        return this.userService.returnBook(userId, bookId, dto.score);
    }
}