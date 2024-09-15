import { Router } from "express";
import { DataSource } from "typeorm";
import { createUserRoutes } from "./UserRoutes";
import { createBookRoutes } from "./BookRoutes";

export function createMainRouter(dataSource: DataSource): Router {
    const mainRouter = Router();

    mainRouter.use("/users", createUserRoutes(dataSource));
    mainRouter.use("/books", createBookRoutes(dataSource));

    return mainRouter;
}