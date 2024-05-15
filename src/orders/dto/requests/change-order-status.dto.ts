import { IsEnum, IsMongoId } from "class-validator";
import { OrderStatus, OrderStatusList } from "../../enums/orders-status.enum";

export class ChangeOrderStatusDto {
  @IsMongoId()
  _id: string;
  @IsEnum(OrderStatusList)
  status: OrderStatus;
}