import { IsNumber, Min, Max } from 'class-validator';

export class ReturnBookDto {
    @IsNumber()
    @Min(1)
    @Max(10)
    score!: number;
}