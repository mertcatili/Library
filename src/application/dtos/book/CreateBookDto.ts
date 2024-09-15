import { IsString, IsNotEmpty, Length, IsNumber, Min, Max } from 'class-validator';

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name!: string;
}