import { IsString, IsUUID, IsUrl } from 'class-validator';


export class PaidOrderDto {



  @IsString()
  @IsUUID()
  orderId: string;



}