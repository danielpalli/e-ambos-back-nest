import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderRequest, OrderPaginationRequest, PaidOrderRequest, StatusRequest } from './dto';
import { Order } from './schemas/order.schema';
import { PaginationRequest } from 'src/common';
import { Auth, CurrentUser } from 'src/auth/decorators';
import { User } from 'src/users/schemas/user.schema';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Auth(ValidRoles.USER)
  create(@Body() createOrderRequest: CreateOrderRequest, @CurrentUser() user: User) {
    return this.ordersService.create({
      ...createOrderRequest,
      userId: user._id.toString(),
    });
  }

  @Get()
  findAll(@Query() orderPaginationRequest: OrderPaginationRequest) {
    return this.ordersService.findAll(orderPaginationRequest);
  }

  @Get('id/:id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusRequest: StatusRequest,
    @Query() paginationRequest: PaginationRequest,
  ) {
    return this.ordersService.findAll({
      ...paginationRequest,
      status: statusRequest.status,
    });
  }

  @Patch('change-status/:id')
  changeStatus(@Param('id') id: string, @Body() statusRequest: StatusRequest) {
    return this.ordersService.changeStatus({
      _id: id,
      status: statusRequest.status,
    });
  }

  @Patch('paid')
  paidOrder(@Body() paidOrderRequest: PaidOrderRequest ) {
    return this.ordersService.paidOrder(paidOrderRequest);
  }
}
