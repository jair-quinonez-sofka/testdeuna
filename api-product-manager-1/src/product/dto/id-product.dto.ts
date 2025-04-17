import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class IDProductDTO {
    @ApiProperty({
        example: 'ef70186a-fbe3-494d-a0ca-883127dd7c2c',
        description: 'Product ID',
        uniqueItems: true,
    })
    @IsUUID()
    id: string;
}