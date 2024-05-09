import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import { ChangeOrderStatusDto, CreateOrderDto, OrderPaginationDto, PaidOrderDto } from './dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,

    private readonly productsService: ProductsService
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    try {      
      const productIds = createOrderDto.items.map((item) => item.productId); 
      const products = await this.productsService.validateProducts(productIds);
      const totalAmount = createOrderDto.items.reduce((acc, orderItem) => {
        const price = products.find((product) => product._id.toString() === orderItem.productId).price;
        return acc + (price * orderItem.quantity);
      } , 0);

      const totalItems = createOrderDto.items.reduce((acc, orderItem) => acc + orderItem.quantity, 0);

      const orderItemsData = createOrderDto.items.map((orderItem) => ({
        price: products.find((product) => product._id.toString() === orderItem.productId).price,
        model: products.find((product) => product._id.toString() === orderItem.productId).model,
        productId: orderItem.productId,
        quantity: orderItem.quantity
    }));

      const order = new this.orderModel({
        user: userId.toString(),
        totalAmount,
        totalItems,
        orderItem: orderItemsData
      });

      await order.save(); 
      return order;
    } catch (error) {
      throw new BadRequestException('Error al crear la orden');
    }  
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {
    const totalPages = await this.orderModel.countDocuments();
    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;
    let data;

    console.log(orderPaginationDto.status);
    
    if (!orderPaginationDto.status) {
      data = await this.orderModel.find().skip((currentPage - 1) * perPage).limit(perPage);
    } else {
      data = await this.orderModel.find({ status: orderPaginationDto.status }).skip((currentPage - 1) * perPage).limit(perPage);
    }

    return {
      data: data,
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages / perPage),
      },
    };
  }

  async findOne(id: string): Promise<Order> {
    if (!isMongoId(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }

    const order = await this.orderModel.findById(id);

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  async changeStatus(changeOrderStatusDto: ChangeOrderStatusDto) {
    const { _id: id, status } = changeOrderStatusDto;
    await this.findOne(id);

    const order = await this.orderModel.findById(id);
 
    if (order.status === status) { 
      return order;
    }

    order.status = status;

    await order.save();

    return order;
  }

  async paidOrder( paidOrderDto: PaidOrderDto ) {
    const { orderId } = paidOrderDto;

    await this.findOne(orderId);

    const order = await this.orderModel.findById(paidOrderDto.orderId);

    order.paid = true;
    order.paidAt = new Date();

    await order.save();

    return order;

  }
}
