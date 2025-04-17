import { InputType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsUUID } from "class-validator";

@InputType()
export class RemoveProductInput  {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  id: string;
}