import { BookService } from "../../domains/book/services/BookService";
import { Result } from "../../domains/shared/utils/Response";
import { Book } from "../../infrastructure/orm/entities/Book";
import { CreateBookDto } from "../dtos/book/CreateBookDto";

export class CreateBookUseCase {
    constructor(private readonly bookService: BookService) {}

    async execute(createBookDto: CreateBookDto): Promise<Result<Book>> {
        return this.bookService.create(createBookDto);
    }
}