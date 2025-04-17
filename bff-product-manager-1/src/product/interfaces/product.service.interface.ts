import { CreateProductInput } from "../dto/inputs/create-product.input";
import { UpdateProductInput } from "../dto/inputs/update-product.input";
import { GetProducts } from "../entities/get-products.entity";
import { Product } from "../entities/product.entity";

export interface ProductServiceInterface {
  create(createProductInput: CreateProductInput): Promise<Product | undefined>;
  findAll(limit?: number, offset?: number): Promise<GetProducts | undefined>;
  findOne(id: string): Promise<Product[]|undefined>;
  update(updateProductInput: UpdateProductInput): Promise<Product | undefined>;
  remove(id: string): Promise<string  | undefined>;
}