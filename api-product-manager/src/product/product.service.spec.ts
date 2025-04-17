import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { CacheService } from '../cache/cache.service';
import { KafkaService } from '../kafka/kafka.service';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockProductRepository = (): jest.Mocked<Partial<Repository<Product>>> => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOneBy: jest.fn(),
  preload: jest.fn(),
  remove: jest.fn(),
});


const mockKafkaService = (): jest.Mocked<Partial<KafkaService>> => ({
  publishMessage: jest.fn(),
});

const mockCacheService = (): jest.Mocked<Partial<CacheService>> => ({
  getData: jest.fn(),
  setData: jest.fn(),
});


describe('ProductService', () => {



  let service: ProductService;
  let productRepository: jest.Mocked<Repository<Product>>;
  let kafkaService: jest.Mocked<KafkaService>;
  let cacheService: jest.Mocked<CacheService>;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: getRepositoryToken(Product), useFactory: mockProductRepository },
        { provide: KafkaService, useFactory: mockKafkaService },
        { provide: CacheService, useFactory: mockCacheService },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productRepository = module.get(getRepositoryToken(Product)) as jest.Mocked<Repository<Product>>;
    kafkaService = module.get(KafkaService) as jest.Mocked<KafkaService>;
    cacheService = module.get(CacheService) as jest.Mocked<CacheService>;


  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create and return the product', async () => {
      const createProductDto = { name: 'Product 1', description: 'A sample product', price: 100, stock: 10 };
      const newProduct = { id: '1', ...createProductDto };

      productRepository.create.mockReturnValue(newProduct);
      productRepository.save.mockResolvedValue(newProduct);

      const result = await service.createProduct(createProductDto);

      expect(result).toEqual({
        id: newProduct.id,
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        stock: newProduct.stock,
      });
      expect(productRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productRepository.save).toHaveBeenCalledWith(newProduct);
      expect(kafkaService.publishMessage).toHaveBeenCalledWith('product-created', JSON.stringify(newProduct));
    });

    it('should throw BadRequestException on DB error', async () => {
      const createProductDto = { name: 'Product 1', description: 'A sample product', price: 100, stock: 10, id: 'uuid' };
      const error = { code: '23505', message: 'Duplicated product' };

      productRepository.create.mockReturnValue(createProductDto);
      productRepository.save.mockRejectedValue(error);

      await expect(service.createProduct(createProductDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllProducts', () => {
    it('should return products from cache if available', async () => {
      const cacheData = { size: 2, products: [{ id: '1', name: 'Product 1', price: 100, stock: 10 }] };
      cacheService.getData.mockResolvedValue(cacheData);

      const result = await service.findAllProducts({ limit: 10, offset: 0 });

      expect(result).toEqual(cacheData);
      expect(cacheService.getData).toHaveBeenCalled();
    });

    it('should return products from DB if not in cache', async () => {
      const productData = [{ id: '1', name: 'Product 1', price: 100, stock: 10, description: 'A sample product' }];
      const resultData = {
        size: productData.length,
        products: productData.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          description: product.description,
        })),
      };

      cacheService.getData.mockResolvedValue(null);
      productRepository.find.mockResolvedValue(productData);
      cacheService.setData.mockResolvedValue(undefined);

      const result = await service.findAllProducts({ limit: 10, offset: 0 });

      expect(result).toEqual(resultData);
      expect(cacheService.getData).toHaveBeenCalled();
      expect(productRepository.find).toHaveBeenCalledWith({ take: 10, skip: 0 });
      expect(cacheService.setData).toHaveBeenCalledWith('products-list-0-10', resultData, 3600);
    });
  });

  describe('findProduct', () => {
    it('should return the product if found', async () => {
      const product = { id: '1', name: 'Product 1', price: 100, stock: 10, description: 'A sample product' };
      productRepository.findOneBy.mockResolvedValue(product);

      const result = await service.findProduct('1');

      expect(result).toEqual(product);
    });

    it('should throw NotFoundException if product not found', async () => {
      productRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findProduct('non-existing-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should update and return the product', async () => {
      const updateProductDto = { id: '1', name: 'Updated Product', price: 120, stock: 15, description: 'Updated product description' };
      const updatedProduct = { id: '1',name: 'Updated Product', price: 120, stock: 15, description: 'Updated product description' };

      productRepository.preload.mockResolvedValue(updatedProduct);
      productRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.updateProduct(updateProductDto);

      expect(result).toEqual(updatedProduct);
      expect(productRepository.preload).toHaveBeenCalledWith(updateProductDto);
      expect(productRepository.save).toHaveBeenCalledWith(updatedProduct);
      expect(kafkaService.publishMessage).toHaveBeenCalledWith('product-updated', JSON.stringify(updatedProduct));
    });

    it('should throw NotFoundException if product not found', async () => {
      const updateProductDto = { id: 'non-existing-id', name: 'Updated Product', price: 120, stock: 15 };
      productRepository.preload.mockResolvedValue(undefined);

      await expect(service.updateProduct(updateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeProduct', () => {
    it('should remove the product and return a success message', async () => {
      const product = { id: '1', name: 'Product 1', description: 'A sample product', price: 100, stock: 10 };
      productRepository.findOneBy.mockResolvedValue(product);
      productRepository.remove.mockResolvedValue(product);

      const result = await service.removeProduct('1');

      expect(result).toBe('Product remove with name:  Product 1 and id: 1');
      expect(productRepository.remove).toHaveBeenCalledWith(product);
      expect(kafkaService.publishMessage).toHaveBeenCalledWith('product-deleted', 'Product remove with name:  Product 1 and id: 1');
    });

    it('should throw NotFoundException if product not found', async () => {
      productRepository.findOneBy.mockResolvedValue(null);

      await expect(service.removeProduct('non-existing-id')).rejects.toThrow(NotFoundException);
    });
  });
});
