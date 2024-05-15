import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.request';
import { UpdateProductRequest } from './dto/update-product.request';
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

  create = async(createProductRequest: CreateProductRequest): Promise<Product> => {
    try {
      const product = new this.productModel(createProductRequest);
      await product.save();
      return product;
    } catch (error) {
      throw new BadRequestException('Error al crear el producto');
    }
  }

  findAll = async (paginationRequest: PaginationRequest) => {
    const { limit, page } = paginationRequest;
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

  findOne = async (id: string): Promise<Product> => {
    if (!isMongoId(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }

    const product = await this.productModel.findById(id);

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return product;
  }

  update = async (
    id: string,
    updateProductRequest: UpdateProductRequest,
  ): Promise<Product> => {
    await this.findOne(id);

    const product = await this.productModel.findByIdAndUpdate(
      { _id: id },
      updateProductRequest,
      {
        new: true,
      },
    );

    return product;
  }

  remove = async (id: string): Promise<Boolean> => {
    const product = await this.productModel.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }

    return true;
  }

  validateProducts = async (ids: string[]) => {
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
