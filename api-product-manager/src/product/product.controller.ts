import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { IDProductDTO } from './dto/id-product.dto';
import { PaginationDTO } from '../common/dto/pagination.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductDTO } from './dto/product.dto';

@ApiTags('Products')
@Controller('api/v1/product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post('/create')
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type:ProductDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProductDto: CreateProductDTO) {
    return this.productService.createProduct(createProductDto);
  }

  

  @ApiResponse({
    status: 200,
    description: 'Products retrieved successfully',
    type:[ProductDTO]
  })
  @HttpCode(HttpStatus.OK)
  @Get('/getAll')
  findAll(@Query() paginationDto: PaginationDTO) {
    return this.productService.findAllProducts(paginationDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Product retrieved successfully',
    type:ProductDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.OK)
  @Get('/getById/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.findProduct(id);
  }

  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type:ProductDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @Post('/update')
  @HttpCode(HttpStatus.OK)
  update(
    @Body() updateProductDto: UpdateProductDTO
  ) {
    return this.productService.updateProduct(updateProductDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Product removed successfully',
    type:ProductDTO
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error',
  })
  @HttpCode(HttpStatus.OK)
  @Post('/remove')
  remove(
    @Body() deleteProductDto: IDProductDTO
  ) {
    return this.productService.removeProduct(deleteProductDto.id);
  }
}
