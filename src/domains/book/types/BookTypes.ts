import { Book } from "../../../infrastructure/orm/entities/Book";

export type BookDto = {
    id: number;
    name: string;
    borrowDate: Date;
    returnDate?: Date;
};

export type BookWithScore = Book & { score: number | null };
