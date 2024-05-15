import { ArrayMinSize, IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OrderItemRequest } from './order-item.request';
import { Type } from 'class-transformer';

export class CreateOrderRequest {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemRequest)
  public items: OrderItemRequest[];

  @IsOptional()
  public userId?: string;  
}
