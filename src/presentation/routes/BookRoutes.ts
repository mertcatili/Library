import { Router } from "express";
import { DataSource } from "typeorm";
import { BookRepositoryImpl } from "../../infrastructure/repositories/BookRepositoryImpl";
import { BookService } from "../../domains/book/services/BookService";
import { GetAllBooksUseCase } from "../../application/use-cases/GetAllBooksUseCase";
import { BookController } from "../controllers/BookController";
import { Book } from "../../infrastructure/orm/entities/Book";
import { GetBookByIdUseCase } from "../../application/use-cases/GetBookByIdUseCase";
import { validateRequest } from "../middlewares/validateRequest";
import { CreateBookUseCase } from "../../application/use-cases/CreateBookUseCase";
import { BorrowingRepositoryImpl } from "../../infrastructure/repositories/BorrowingRepositoryImpl";
import { Borrowing } from "../../infrastructure/orm/entities/Borrowings";
import { CreateBookDto } from "../../application/dtos/book/CreateBookDto";

export function createBookRoutes(dataSource: DataSource): Router {
    const bookRepository = new BookRepositoryImpl(dataSource.getRepository(Book));
    const borrowingRepository = new BorrowingRepositoryImpl(dataSource.getRepository(Borrowing));
    const bookService = new BookService(bookRepository, borrowingRepository);

    const getAllBooksUseCase = new GetAllBooksUseCase(bookService);
    const getBookByIdUseCase = new GetBookByIdUseCase(bookService);
    const createBookUseCase = new CreateBookUseCase(bookService);

    const bookController = new BookController(getAllBooksUseCase, getBookByIdUseCase, createBookUseCase);
    const router = Router();

    router.get("", (req, res) => bookController.getAll(req, res));
    router.get("/:id", (req, res) => bookController.getById(req, res));
    router.post("", validateRequest(CreateBookDto), (req, res) => bookController.create(req, res));

    return router;
}