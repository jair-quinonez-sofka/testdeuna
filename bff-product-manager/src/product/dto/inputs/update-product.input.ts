
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateProductInput } from './create-product.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateProductInput extends PartialType(CreateProductInput) {
  @Field(() => String)
  @IsUUID()
  id: string;
}
