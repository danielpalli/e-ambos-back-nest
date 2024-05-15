import { IsEnum, IsOptional } from "class-validator";
import { PaginationRequest } from "src/common";
import { ProductStatusList } from "src/products/enums";
import { OrderStatus } from "../../enums/orders-status.enum";

export class OrderPaginationRequest extends PaginationRequest {
  @IsOptional() @IsEnum(ProductStatusList)
  public status?: OrderStatus;
}