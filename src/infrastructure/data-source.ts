import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./orm/entities/User";
import { Book } from "./orm/entities/Book";
import { Borrowing } from "./orm/entities/Borrowings";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "Mert",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "postgres",
    synchronize: true,
    logging: false,
    entities: [User, Book, Borrowing],
    migrations: [],
    subscribers: [],
});
