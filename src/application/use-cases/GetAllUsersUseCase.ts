import { User } from "../../infrastructure/orm/entities/User";
import { UserService } from "../../domains/user/services/UserService";
import { Result } from "../../domains/shared/utils/Response";

export class GetAllUsersUseCase {
    constructor(private userService: UserService) {}

    async execute(): Promise<Result<User[]>> {
        return this.userService.getAllUsers();
    }
}