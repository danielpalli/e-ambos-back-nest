import { IsEnum, IsOptional } from "class-validator";
import { OrderStatus, OrderStatusList } from "../../enums/orders-status.enum";

export class StatusDto {
  @IsOptional() @IsEnum(OrderStatusList)
  status: OrderStatus;
}