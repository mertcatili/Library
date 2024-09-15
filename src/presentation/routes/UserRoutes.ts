import { Router } from "express";
import { DataSource } from "typeorm";

import { UserController } from "../controllers/UserController";
import { UserService } from "../../domains/user/services/UserService";

import { UserRepositoryImpl } from "../../infrastructure/repositories/UserRepositoryImpl";

import { validateRequest } from "../middlewares/validateRequest";
import { CreateUserDto } from "../../application/dtos/user/CreateUserDto";

import { User } from "../../infrastructure/orm/entities/User";
import { Borrowing } from "../../infrastructure/orm/entities/Borrowings";

import { CreateUserUseCase } from "../../application/use-cases/CreateUserUseCase";
import { GetAllUsersUseCase } from "../../application/use-cases/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../../application/use-cases/GetUserByIdUseCase";
import { BookRepositoryImpl } from "../../infrastructure/repositories/BookRepositoryImpl";
import { Book } from "../../infrastructure/orm/entities/Book";
import { BorrowBookUseCase } from "../../application/use-cases/BorrowBookUseCase";
import { ReturnBookUseCase } from "../../application/use-cases/ReturnBookUseCase";
import { ReturnBookDto } from "../../application/dtos/borrowing/ReturnBookDto";
import { authMiddleware } from "../middlewares/authenticationMiddleware";




export function createUserRoutes(dataSource: DataSource): Router {
    const userRepository = new UserRepositoryImpl(dataSource.getRepository(User), dataSource.getRepository(Borrowing));
    const bookRepository = new BookRepositoryImpl(dataSource.getRepository(Book));
    const userService = new UserService(userRepository, bookRepository, dataSource);
    const createUserUseCase = new CreateUserUseCase(userService);
    const getAllUsersUseCase = new GetAllUsersUseCase(userService);
    const getUserByIdUseCase = new GetUserByIdUseCase(userService);
    const borrowBookUseCase = new BorrowBookUseCase(userService);
    const returnBookUseCase = new ReturnBookUseCase(userService);
    const userController = new UserController(createUserUseCase, getAllUsersUseCase, getUserByIdUseCase, borrowBookUseCase, returnBookUseCase);

    const router = Router();

    router.use(authMiddleware);

    router.post("", validateRequest(CreateUserDto), (req, res, next) => userController.create(req, res, next));
    router.get("", (req, res, next) => userController.getAll(req, res, next));
    router.get("/:id", (req, res, next) => userController.getById(req, res, next));
    router.post("/:userId/borrow/:bookId", (req, res, next) => userController.borrowBook(req, res, next));
    router.post("/:userId/return/:bookId", validateRequest(ReturnBookDto), (req, res, next) => userController.returnBook(req, res, next));

    return router;
}