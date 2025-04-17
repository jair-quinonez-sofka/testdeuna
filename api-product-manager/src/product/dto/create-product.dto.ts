import { PartialType } from "@nestjs/mapped-types";
import { ProductDTO } from "./product.dto";
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateProductDTO {
    @ApiProperty({
        example:  'Computer',
        description: 'Product name',
        uniqueItems: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3, { message: 'name must be at least 3 characters long' })
    name: string;

    @ApiProperty({
        example:  'This is a computer',
        description: 'Product description',
    })
    @IsString({ message: 'description must be a string' })
    @IsNotEmpty({ message: 'description must not be empty' })
    @MinLength(10, { message: 'description must be at least 10 characters long' })
    description: string;

    @ApiProperty({
        example:  50.20,
        description: 'Product price',
    })
    @IsNumber()
    @IsPositive({ message: 'price must be a positive number' })
    price: number;

    @ApiProperty({
        example:  10,
        description: 'Product stock quantity',
    })
    @IsInt({ message: 'stock must be an integer' })
    @IsPositive({ message: 'stock must be a positive number' })
    stock: number;

}
