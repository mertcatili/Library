import { NextFunction, Request, Response } from "express";
import { CreateUserDto } from "../../application/dtos/user/CreateUserDto";
import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { GetAllUsersUseCase } from "../../application/use-cases/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/GetUserByIdUseCase";
import { BorrowBookUseCase } from "../../application/use-cases/BorrowBookUseCase";
import { ReturnBookUseCase } from "../../application/use-cases/ReturnBookUseCase";
import { ReturnBookDto } from "../../application/dtos/borrowing/ReturnBookDto";
import { BadRequestError } from "../../domains/shared/utils/AppError";
import { Result, SuccessResult } from "../../domains/shared/utils/Response";

export class UserController {
    constructor(
        private createUserUseCase: CreateUserUseCase,
        private getAllUsersUseCase: GetAllUsersUseCase,
        private getUserByIdUseCase: GetUserByIdUseCase,
        private borrowBookUseCase: BorrowBookUseCase,
        private returnBookUseCase: ReturnBookUseCase
    ) {}

    async create(req: Request, res: Response, next: NextFunction): Promise<Result<Response> | void> {
        try {
            const dto = req.body as CreateUserDto;
            const result = await this.createUserUseCase.execute(dto.name);
            return new SuccessResult(res.status(201).json(result));
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction): Promise<Result<Response> | void> {
        try {
            const result = await this.getAllUsersUseCase.execute();
            return new SuccessResult(res.status(200).json(result));
        } catch (error) {
            next(error);
        }
    }

    async getById(req: Request, res: Response, next: NextFunction): Promise<Result<Response> | void> {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                throw new BadRequestError("Invalid ID format");
            }
            const result = await this.getUserByIdUseCase.execute(id);
            return new SuccessResult(res.status(200).json(result));
        } catch (error) {
            next(error);
        }
    }

    async borrowBook(req: Request, res: Response, next: NextFunction): Promise<Result<Response> | void> {
        try {
            const userId = parseInt(req.params.userId);
            const bookId = parseInt(req.params.bookId);
            if (isNaN(userId) || isNaN(bookId)) {
                throw new BadRequestError("Invalid user ID or book ID");
            }
            const result = await this.borrowBookUseCase.execute(userId, bookId);
            return new SuccessResult(res.status(200).json(result));
        } catch (error) {
            next(error);
        }
    }

    async returnBook(req: Request, res: Response, next: NextFunction): Promise<Result<Response> | void> {
        try {
            const userId = parseInt(req.params.userId);
            const bookId = parseInt(req.params.bookId);
            const dto = req.body as ReturnBookDto;
            if (isNaN(userId) || isNaN(bookId)) {
                throw new BadRequestError("Invalid user ID or book ID");
            }
            const result = await this.returnBookUseCase.execute(userId, bookId, dto);
            return new SuccessResult(res.status(200).json(result));
        } catch (error) {
            next(error);
        }
    }
}
