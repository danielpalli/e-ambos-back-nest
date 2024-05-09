import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, OrderPaginationDto, PaidOrderDto, StatusDto } from './dto';
import { Order } from './schemas/order.schema';
import { PaginationDto } from 'src/common';
import { Auth, CurrentUser } from 'src/auth/decorators';
import { User } from 'src/users/schemas/user.schema';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Auth(ValidRoles.USER)
  create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() user: User) {
    return this.ordersService.create(createOrderDto, user._id);
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @Get('id/:id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.ordersService.findAll({
      ...paginationDto,
      status: statusDto.status,
    });
  }

  @Patch(':id')
  changeStatus(@Param('id') id: string, @Body() statusDto: StatusDto) {
    return this.ordersService.changeStatus({
      _id: id,
      status: statusDto.status,
    });
  }
  @Patch('paid')
  paidOrder(@Body() paidOrderDto: PaidOrderDto ) {
    return this.ordersService.paidOrder( paidOrderDto );
  }
}
