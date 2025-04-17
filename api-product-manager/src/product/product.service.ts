import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { IProductService } from './interfaces/product.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { KafkaService } from '../kafka/kafka.service';
import { CacheService } from '../cache/cache.service';


@Injectable()
export class ProductService implements IProductService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly kafkaService: KafkaService,
    private readonly cacheService: CacheService,
  ) {

  }

  async createProduct(createProductDto: CreateProductDTO) {
    try {
      const newProduct = this.productRepository.create(createProductDto);

      await this.productRepository.save(newProduct);

      
      this.kafkaService.publishMessage('product-created', JSON.stringify(newProduct));
      
      return {
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        stock: newProduct.stock,
      }

    } catch (error) {
      this.handleDBErrors(error);
    }

  }

  async findAllProducts(pagination: PaginationDTO) {
    const { limit = 100, offset = 0 } = pagination;
    const cacheKey = `products-list-${offset}-${limit}`;

    const cachedProducts = await this.cacheService.getData(cacheKey);
    if (cachedProducts) {
      return cachedProducts;
    }

    try {
      const productsFound = await this.productRepository.find({
        take: limit,
        skip: offset,
      });
      const result = {
        size: productsFound.length,
        products: productsFound.map(product => {
          return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            stock: product.stock,
          };
        })
      }
      await this.cacheService.setData(cacheKey, result, 3600);

      return result;

    
    

    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findProduct(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async updateProduct(updateProductDto: UpdateProductDTO) {
    const { id } = updateProductDto;
    const product = await this.productRepository.preload({
      id,
      name: updateProductDto.name,
      description: updateProductDto.description,
      price: updateProductDto.price,
      stock: updateProductDto.stock,
    });

    if (!product) throw new NotFoundException('Product not found');

    try {
      await this.productRepository.save(product);
      this.kafkaService.publishMessage('product-updated', JSON.stringify(product));
      return product;

    } catch (error) {
      this.handleDBErrors(error);

    }

  }

  async removeProduct(id: string) {
    
    const product = await this.productRepository.findOneBy({ id });
    let message: string;
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    message = `Product remove with name:  ${product.name} and id: ${product.id}`;
    await this.productRepository.remove(product);
    this.kafkaService.publishMessage('product-deleted', message);

    return message;
  }

  private handleDBErrors(error: any) {
    this.logger.error(error.message, error.code);

    if (error.code === '23505') {
      throw new BadRequestException('Duplicated product name', error.detail);
    }
    throw new InternalServerErrorException('Unexpected error creating product');
  }
}
