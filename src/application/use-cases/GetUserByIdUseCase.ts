import { UserWithBooksDto } from "../../domains/user/types/UserTypes";
import { UserService } from "../../domains/user/services/UserService";
import { Result } from "../../domains/shared/utils/Response";

export class GetUserByIdUseCase {
    constructor(private userService: UserService) {}

    async execute(id: number): Promise<Result<UserWithBooksDto>> {
        return this.userService.getUserByIdWithBooks(id);
    }
}