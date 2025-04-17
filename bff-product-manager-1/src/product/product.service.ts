import { Injectable } from '@nestjs/common';
import { CreateProductInput } from './dto/inputs/create-product.input';
import { UpdateProductInput } from './dto/inputs/update-product.input';
import { firstValueFrom, Observable } from 'rxjs';
import axios, { Axios, AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { Product } from './entities/product.entity';
import { GetProducts } from './entities/get-products.entity';
import { ProductServiceInterface } from './interfaces/product.service.interface';

const API_URL = 'http://api-product-manager:3000/api/v1/product';


@Injectable()
export class ProductService implements ProductServiceInterface {
  
  constructor() { }



  async create(createProductInput: CreateProductInput) {

    try {
      const { data } = await axios.post<Product>(`${API_URL}/create`, createProductInput);
      return data;
    } catch (error) {
      this.handleApiErrors(error);
    }

  }

  async findAll(limit?: number, offset?: number) {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    try {
      const { data } = await axios.get<GetProducts>(`${API_URL}/getAll?${params.toString()}`);
      return data;

    } catch (error) {
      this.handleApiErrors(error);
    }


  }

  async findOne(id: string) {
    const { data } = await axios.get<Product[]>(`${API_URL}/getById/${id}`);
    return data;
  }

  async update(updateProductInput: UpdateProductInput) {
    try {
      const { data } = await axios.post<Product>(`${API_URL}/update`, updateProductInput);
      return data;
    } catch (error) {
      this.handleApiErrors(error);
    }
  }

  async remove(id: string) {
    try {
      const { data } = await axios.post<string>(`${API_URL}/remove`, { id });
      return data;
    } catch (error) {
      this.handleApiErrors(error);
    }

  }

  private handleApiErrors(error: any) {
    if (axios.isAxiosError(error)) {
      console.error('Error message:', error.message);

      if (error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data?.message || 'Unexpected API error');
      }
    }

    throw new Error(error.response.data.message);
  }
}
