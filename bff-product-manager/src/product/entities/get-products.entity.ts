import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Product } from './product.entity';

@ObjectType()
export class GetProducts {

    @Field(() => Int)
    size: number;

    @Field(() => [Product])
    products: Product[];


}