import { InputType, Int, Field, Float } from '@nestjs/graphql';
import { IsString, IsNotEmpty, MinLength, IsNumber, IsPositive, IsInt } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'name must be at least 3 characters long' })
  name: string;

  @Field(() => String)
  @IsString({ message: 'description must be a string' })
  @IsNotEmpty({ message: 'description must not be empty' })
  @MinLength(10, { message: 'description must be at least 10 characters long' })
  description: string;

  @Field(() => Float)
  @IsNumber()
  @IsPositive({ message: 'price must be a positive number' })
  price: number;

  @Field(() => Int)
  @IsInt({ message: 'stock must be an integer' })
  @IsPositive({ message: 'stock must be a positive number' })
  stock: number;
}
