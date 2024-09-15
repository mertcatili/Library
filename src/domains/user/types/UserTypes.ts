import { BookDto } from "../../book/types/BookTypes";

export type User = {
    id: number;
    firstName: string;
    lastName: string;
};

export type UserWithBooksDto = {
    id: number;
    name: string;
    books: {
        past: BookDto[];
        present: BookDto[];
    };
};