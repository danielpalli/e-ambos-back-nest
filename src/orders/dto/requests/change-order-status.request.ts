import { IsEnum, IsMongoId } from "class-validator";
import { OrderStatus, OrderStatusList } from "../../enums/orders-status.enum";

export class ChangeOrderStatusRequest {
  @IsMongoId()
  _id: string;
  @IsEnum(OrderStatusList)
  status: OrderStatus;
}