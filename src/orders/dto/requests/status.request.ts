import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, OrderStatusList } from "../../enums/orders-status.enum";

export class StatusRequest {
  @IsOptional() @IsEnum(OrderStatusList)
  status: OrderStatus;
}