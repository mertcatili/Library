import { Result } from "../../domains/shared/utils/Response";
import { User } from "../../infrastructure/orm/entities/User";
import { UserService } from "../../domains/user/services/UserService";

export class CreateUserUseCase {
    constructor(private userService: UserService) {}

    async execute(name: string): Promise<Result<User>> {
        return this.userService.create(name);
    }
}
