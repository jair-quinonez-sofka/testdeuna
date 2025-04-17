import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationDTO {

    @ApiProperty({
        example:  10,
        description: 'Number of items to return',
        required: false,
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number;

    @ApiProperty({
        example:  10,
        description: 'Number of items to skip',
        required: false,
    })
    @IsOptional()
    @IsPositive()   
    @Type(() => Number)
    offset?: number;
}