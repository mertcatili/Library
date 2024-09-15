import { BookService } from "../../domains/book/services/BookService";
import { Book } from "../../infrastructure/orm/entities/Book";
import { Result } from "../../domains/shared/utils/Response";
export class GetBookByIdUseCase {
    constructor(private readonly bookService: BookService) {}

    async execute(id: number): Promise<Result<Book>> {
        return this.bookService.getById(id);
    }
}