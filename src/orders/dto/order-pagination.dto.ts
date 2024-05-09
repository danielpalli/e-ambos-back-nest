import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common";
import { ProductStatusList } from "src/products/enums";
import { OrderStatus } from "../enums/orders-status.enum";

export class OrderPaginationDto extends PaginationDto {
  @IsOptional() @IsEnum(ProductStatusList)
  public status?: OrderStatus;
}