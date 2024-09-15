import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Borrowing } from "./Borrowings";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100, nullable: false })
    firstName!: string;

    @Column({ length: 100, nullable: false })
    lastName!: string;

    @OneToMany(() => Borrowing, borrowing => borrowing.user)
    borrowings!: Borrowing[];
}