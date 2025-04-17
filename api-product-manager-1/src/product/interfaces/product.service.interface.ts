import { PaginationDTO } from "../../common/dto/pagination.dto";
import { CreateProductDTO, } from "../dto/create-product.dto";
import { ProductDTO } from "../dto/product.dto";
import { UpdateProductDTO } from "../dto/update-product.dto";

export interface IProductService {
  createProduct(createProductDto: CreateProductDTO): Promise<ProductDTO | undefined>;
  findAllProducts(pagination: PaginationDTO): Promise<{
    products: ProductDTO[], size: number
  } | undefined>;
  findProduct(id: string): Promise<ProductDTO | null>;
  updateProduct(updateProductDto: UpdateProductDTO): Promise<ProductDTO | undefined>;
  removeProduct(id: string): Promise<string | undefined>;
}