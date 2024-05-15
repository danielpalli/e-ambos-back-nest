import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { isMongoId } from 'class-validator';
import { ChangeOrderStatusRequest, CreateOrderRequest, OrderPaginationRequest, PaidOrderRequest } from './dto';
import { ProductsService } from 'src/products/products.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<Order>,
    private readonly productsService: ProductsService,
    private readonly userService: UsersService,
  ) {}

  create = async (createOrderRequest: CreateOrderRequest): Promise<Order> => {
    try {
      const { userId, ...orderRequest } = createOrderRequest;
      const productIds = orderRequest.items.map((item) => item.productId);
      const products = await this.productsService.validateProducts(productIds);
      const totalAmount = orderRequest.items.reduce((acc, orderItem) => {
        const price = products.find((product) => product._id.toString() === orderItem.productId).price;
        return acc + price * orderItem.quantity;
      }, 0);
      const totalItems = orderRequest.items.reduce((acc, orderItem) => acc + orderItem.quantity, 0);
      const orderItemsData = orderRequest.items.map((orderItem) => ({
        price: products.find((product) => product._id.toString() === orderItem.productId).price,
        model: products.find((product) => product._id.toString() === orderItem.productId).model,
        productId: orderItem.productId,
        quantity: orderItem.quantity,
      }));
      const order = new this.orderModel({
        userId: userId.toString(),
        totalAmount,
        totalItems,
        orderItem: orderItemsData,
      });
      
      await this.userService.addOrder(userId, order._id.toString());
      await order.save();

      return order;
    } catch (error) {
      throw new BadRequestException('Error al crear la orden');
    }
  };

  findAll = async (orderPaginationRequest: OrderPaginationRequest) => {
    const totalPages = await this.orderModel.countDocuments();
    const currentPage = orderPaginationRequest.page;
    const perPage = orderPaginationRequest.limit;
    let data;

    if (!orderPaginationRequest.status) {
      data = await this.orderModel
        .find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    } else {
      data = await this.orderModel
        .find({ status: orderPaginationRequest.status })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
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

  findOne = async (id: string): Promise<Order> => {
    if (!isMongoId(id)) {
      throw new BadRequestException(`Invalid id: ${id}`);
    }

    const order = await this.orderModel.findById(id);

    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }

    return order;
  }

  changeStatus = async (changeOrderStatusRequest: ChangeOrderStatusRequest): Promise<Order> => {
    const { _id: id, status } = changeOrderStatusRequest;
    await this.findOne(id);

    const order = await this.orderModel.findById(id);

    if (order.status === status) {
      return order;
    }

    order.status = status;

    await order.save();

    return order;
  }

  paidOrder = async (paidOrderRequest: PaidOrderRequest): Promise<Order> => {
    const { orderId } = paidOrderRequest;

    await this.findOne(orderId);

    const order = await this.orderModel.findById(paidOrderRequest.orderId);

    order.paid = true;
    order.paidAt = new Date();

    await order.save();

    return order;
  }
}
