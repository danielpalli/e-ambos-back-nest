import { IsMongoId, IsNumber, IsPositive } from "class-validator";

export class OrderItemDto {
  @IsNumber() @IsPositive()
  quantity: number;
  @IsNumber() @IsPositive()
  price: number;
  @IsMongoId()
  productId: string;
}
