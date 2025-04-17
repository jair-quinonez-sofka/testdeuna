import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsNumber, IsPositive, IsString, IsUUID, Min, MinLength } from "class-validator";

export class ProductDTO {
    
    @ApiProperty({
        example:  'ef70186a-fbe3-494d-a0ca-883127dd7c2c',
        description: 'Product ID',
        uniqueItems: true,
    })
    id: string

    @ApiProperty({
        example:  'Computer',
        description: 'Product name',
        uniqueItems: true,
    })
    name: string;
    
    @ApiProperty({
        example:  'This is a computer',
        description: 'Product description',
    })
    description: string;

    @ApiProperty({
        example:  50.20,
        description: 'Product price',
    })
    price: number;

    @ApiProperty({
        example:  10,
        description: 'Product stock quantity',
    })
    stock: number;
}