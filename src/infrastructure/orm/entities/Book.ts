import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Borrowing } from "./Borrowings";

@Entity("books")
export class Book {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, nullable: false })
    name!: string;

    @Column({ default: true })
    isActive!: boolean;

    @OneToMany(() => Borrowing, borrowing => borrowing.book)
    borrowings!: Borrowing[];
}