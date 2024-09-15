import { Request, Response } from "express";

import { GetAllBooksUseCase } from "../../application/use-cases/GetAllBooksUseCase";
import { GetBookByIdUseCase } from "../../application/use-cases/GetBookByIdUseCase";
import { CreateBookUseCase } from "../../application/use-cases/CreateBookUseCase";
import { CreateBookDto } from "../../application/dtos/book/CreateBookDto";
import { Result, SuccessResult, ErrorResult } from "../../domains/shared/utils/Response";

export class BookController {
    constructor(
        private readonly getAllBooksUseCase: GetAllBooksUseCase,
        private readonly getBookByIdUseCase: GetBookByIdUseCase,
        private readonly createBookUseCase: CreateBookUseCase
    ) {}

    async getAll(req: Request, res: Response): Promise<Result<Response>> {
        const books = await this.getAllBooksUseCase.execute();
        return new SuccessResult(res.status(200).json(books));
    }

    async getById(req: Request, res: Response): Promise<Result<Response>> {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return new ErrorResult("Invalid ID format");
        }

        try {
            const book = await this.getBookByIdUseCase.execute(id);
            return new SuccessResult(res.status(200).json(book));
        } catch (error) {
            return new ErrorResult("Book not found");
        }
    }

    async create(req: Request, res: Response): Promise<Result<Response>> {
        const dto = req.body as CreateBookDto;
        try {
            const book = await this.createBookUseCase.execute(dto);
            return new SuccessResult(res.status(201).json(book));
        } catch (error) {
            return new ErrorResult("Failed to create book");
        }
    }    
}