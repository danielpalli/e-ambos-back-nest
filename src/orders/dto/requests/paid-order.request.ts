import { IsString, IsUUID, IsUrl } from 'class-validator';

export class PaidOrderRequest {
  @IsString()
  @IsUUID()
  orderId: string;
}
