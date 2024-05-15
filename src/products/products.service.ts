import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './schemas/product.schemas';
import { Model } from 'mongoose';
import { PaginationRequest } from 'src/common';
import { isMongoId } from 'class-validator';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const product = new this.productModel(createProductDto);
      await product.save();
      return product;
    } catch (error) {
      throw new BadRequestException('Error al crear el producto');
    }
  }

  async findAll(paginationDto: PaginationRequest) {
    const { limit, page } = paginationDto;
    const totalPages = await this.productModel.where().countDocuments();
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.productModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit),
      meta: {
        page,
        limit,
        totalPages,
        lastPage,
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    if (!isMongoId(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }

    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    await this.findOne(id);

    const product = await this.productModel.findByIdAndUpdate(
      { _id: id },
      updateProductDto,
      {
        new: true,
      },
    );

    return product;
  }

  async remove(id: string): Promise<Boolean> {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return true;
  }

  async validateProducts(ids: string[]) {
    ids = Array.from(new Set(ids));

    const products = await this.productModel.find({
      _id: { $in: ids },
    });

    if (products.length !== ids.length) {
      throw new BadRequestException('Some products were not found');
    }

    return products;
  }
}
