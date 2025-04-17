import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => String, { description: 'Example field (placeholder)' })
  id: string;
  
  @Field(() =>  String)
  name: string;


  @Field(() =>  String)
  description: string;

  @Field(() =>  Number)
  price: number;  

  @Field(() =>  Int)
  stock: number;

}
