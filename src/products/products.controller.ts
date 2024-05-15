import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductRequest } from './dto/create-product.request';
import { UpdateProductRequest } from './dto/update-product.request';
import { PaginationRequest } from 'src/common';
import { Product } from './schemas/product.schemas';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductRequest: CreateProductRequest): Promise<Product> {
    return this.productsService.create(createProductRequest);
  }

  @Get()
  findAll(@Query() paginationRequest: PaginationRequest) {
    return this.productsService.findAll(paginationRequest);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductRequest: UpdateProductRequest) {
    return this.productsService.update(id, updateProductRequest);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Boolean> {
    return this.productsService.remove(id);
  }

  validateProduct(ids: string[]) {
    return this.productsService.validateProducts(ids);
  }
}
