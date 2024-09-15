import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Book } from "./Book";

@Entity("borrowings")
export class Borrowing {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, user => user.borrowings)
    @JoinColumn({ name: "userId" })
    user!: User;

    @Column()
    bookId!: number;

    @ManyToOne(() => Book, book => book.borrowings)
    @JoinColumn({ name: "bookId" })
    book!: Book;

    @Column({ type: "timestamp", nullable: false })
    borrowDate!: Date;

    @Column({ type: "timestamp", nullable: true })
    returnDate?: Date;

    @Column("float", { nullable: true })
    score?: number;
}