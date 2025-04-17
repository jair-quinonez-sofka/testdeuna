import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/inputs/create-product.input';
import { UpdateProductInput } from './dto/inputs/update-product.input';
import axios from 'axios';
import { Product } from './entities/product.entity';
import { GetProducts } from './entities/get-products.entity';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
const API_URL_TEST = 'http://api-product-manager:3000/api/v1/product';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductInput: CreateProductInput = {
        name: 'Test Product',
        description: 'Test Description',
        price: 19.99,
        stock: 10,
      };
      const mockProduct: Product = {
        id: '123',
        name: 'Test Product',
        description: 'Test Description',
        price: 19.99,

        stock: 10,

      };

      mockedAxios.post.mockResolvedValue({ data: mockProduct });

      const result = await productService.create(createProductInput);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        API_URL_TEST + '/create',
        createProductInput,
      );
      expect(result).toEqual(mockProduct);
    });

    it('should handle errors during product creation', async () => {
      const createProductInput: CreateProductInput = {
        name: 'Test Product',
        description: 'Test Description',
        price: 19.99,
        stock: 10,
      };

      mockedAxios.post.mockRejectedValue({
        isAxiosError: true,
        response: { data: { message: 'Creation failed' } },
        message: 'Creation failed',
      });

      await expect(productService.create(createProductInput)).rejects.toThrow('Creation failed');
    });
  });

  describe('findAll', () => {
    it('should find all products successfully', async () => {
      const mockProducts: GetProducts = {
        products: [
          {
            id: '1',
            name: 'Product 1',
            description: 'Description 1',
            price: 10,
            stock: 10,
          },
          {
            id: '2',
            name: 'Product 2',
            description: 'Description 2',
            price: 20,
            stock: 20,
          },
        ],
        size: 2
      };

      mockedAxios.get.mockResolvedValue({ data: mockProducts });

      const result = await productService.findAll();

      expect(mockedAxios.get).toHaveBeenCalledWith(
        API_URL_TEST + '/getAll?'
      );
      expect(result).toEqual(mockProducts);
    });

    it('should find all products with limit and offset successfully', async () => {
      const mockProducts: GetProducts = {
        products: [
          {
            id: '1',
            name: 'Product 1',
            description: 'Description 1',
            price: 10,
            stock: 10,
          }
        ],
        size: 1
      };

      mockedAxios.get.mockResolvedValue({ data: mockProducts });

      const result = await productService.findAll(10, 0);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        API_URL_TEST + '/getAll?limit=10'
      );
      expect(result).toEqual(mockProducts);
    });


    it('should handle errors during finding all products', async () => {
      mockedAxios.get.mockRejectedValue({
        isAxiosError: true,
        response: { data: { message: 'Failed to get products' } },
        message: 'Failed to get products',
      });

      await expect(productService.findAll()).rejects.toThrow('Failed to get products');
    });
  });

  describe('findOne', () => {
    it('should find a product by ID successfully', async () => {
      const mockProduct: Product[] = [
        {
          id: '123',
          name: 'Test Product',
          description: 'Test Description',
          price: 19.99,
          stock: 10,
        },
      ];

      mockedAxios.get.mockResolvedValue({ data: mockProduct });

      const result = await productService.findOne('123');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        API_URL_TEST + '/getById/123',
      );
      expect(result).toEqual(mockProduct);
    });
  });

  describe('update', () => {
    it('should update a product successfully', async () => {
      const updateProductInput: UpdateProductInput = {
        id: '123',
        name: 'Updated Product',
        description: 'Updated Description',
        price: 29.99,
      };
      const mockProduct: Product = {
        id: '123',
        name: 'Updated Product',
        description: 'Updated Description',
        price: 29.99,
        stock: 10,
      };

      mockedAxios.post.mockResolvedValue({ data: mockProduct });

      const result = await productService.update(updateProductInput);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        API_URL_TEST + '/update',
        updateProductInput,
      );
      expect(result).toEqual(mockProduct);
    });

    it('should handle errors during product update', async () => {
      const updateProductInput: UpdateProductInput = {
        id: '123',
        name: 'Updated Product',
        description: 'Updated Description',
        price: 29.99,
      };

      mockedAxios.post.mockRejectedValue({
        isAxiosError: true,
        response: { data: { message: 'Update failed' } },
        message: 'Update failed',
      });

      await expect(productService.update(updateProductInput)).rejects.toThrow('Update failed');
    });
  });

  describe('remove', () => {
    it('should remove a product successfully', async () => {
      mockedAxios.post.mockResolvedValue({ data: 'Product removed' });

      const result = await productService.remove('123');

      expect(mockedAxios.post).toHaveBeenCalledWith(
        API_URL_TEST + '/remove',
        { id: '123' },
      );
      expect(result).toEqual('Product removed');
    });

    it('should handle errors during product removal', async () => {
      mockedAxios.post.mockRejectedValue({
        isAxiosError: true,
        response: { data: { message: 'Removal failed' } },
        message: 'Removal failed',
      });

      await expect(productService.remove('123')).rejects.toThrow('Removal failed');
    });
  });
});