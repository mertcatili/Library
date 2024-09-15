import { BookService } from "../../domains/book/services/BookService";
import { Result } from "../../domains/shared/utils/Response";
import { Book } from "../../infrastructure/orm/entities/Book";

export class GetAllBooksUseCase {
    constructor(private readonly bookService: BookService) {}

    async execute(): Promise<Result<Book[]>> {
        return this.bookService.getAll();
    }
}