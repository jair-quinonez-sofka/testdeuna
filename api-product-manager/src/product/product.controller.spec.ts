import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { ProductDTO } from './dto/product.dto';
import { KafkaService } from '../kafka/kafka.service';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { IDProductDTO } from './dto/id-product.dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProductService = {
    createProduct: jest.fn(),
    findAllProducts: jest.fn(),
    findProduct: jest.fn(),
    updateProduct: jest.fn(),
    removeProduct: jest.fn(),
  };
  const mockKafkaClient = {
    send: jest.fn(),
  };

  const mockRedisService = {
    set: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [{
        provide: ProductService,
        useValue: {
          ...mockProductService,
          kasfkaClient: mockKafkaClient,
          redisService: mockRedisService,
        },
      }],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);

  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a product successfully', async () => {
    const createProductDto: CreateProductDTO = { name: 'Product 1', price: 100, stock: 10, description: 'This is a product' };
    const result: ProductDTO = { id: 'uuid', ...createProductDto };
    mockProductService.createProduct.mockResolvedValue(result);

    expect(await controller.create(createProductDto)).toEqual(result);
    expect(mockProductService.createProduct).toHaveBeenCalledWith(createProductDto);
    expect(mockProductService.createProduct).toHaveBeenCalledTimes(1);
  });

  it('should return all products', async () => {
    const paginationDto: PaginationDTO = { offset: 1, limit: 10 };
    const result: ProductDTO[] = [{ id: 'uuid', name: 'Product 1', price: 100,  stock: 10, description: 'This is a product' }];
    mockProductService.findAllProducts.mockResolvedValue(result);

    expect(await controller.findAll(paginationDto)).toEqual(result);
    expect(mockProductService.findAllProducts).toHaveBeenCalledWith(paginationDto);
  });

  it('should return a product by id', async () => {
    const id = 'uuid';
    const result: ProductDTO = { id, name: 'Product 1', price: 100, stock: 10, description: 'This is a product' };
    mockProductService.findProduct.mockResolvedValue(result);

    expect(await controller.findOne(id)).toEqual(result);
    expect(mockProductService.findProduct).toHaveBeenCalledWith(id);
  });

  it('should update a product successfully', async () => {
    const updateProductDto: UpdateProductDTO = { id: 'uuid', name: 'Updated Product', price: 150 };
    const result: ProductDTO = { id: 'uuid', name: 'Updated Product', price: 150, description: 'This is a product', stock: 10 };
    mockProductService.updateProduct.mockResolvedValue(result);

    expect(await controller.update(updateProductDto)).toEqual(result);
    expect(mockProductService.updateProduct).toHaveBeenCalledWith(updateProductDto);
  });

  it('should remove a product successfully', async () => {
    const deleteProductDto: IDProductDTO = { id: 'uuid' };
    const result: ProductDTO = { id: 'uuid', name: 'Product 1', price: 100, stock: 10, description: 'This is a product' };
    mockProductService.removeProduct.mockResolvedValue(result);

    expect(await controller.remove(deleteProductDto)).toEqual(result);
    expect(mockProductService.removeProduct).toHaveBeenCalledWith(deleteProductDto.id);
  });




});
