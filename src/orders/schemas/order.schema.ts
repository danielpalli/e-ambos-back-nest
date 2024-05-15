import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderItem } from './order-item.schema';

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Number, required: true })
  totalAmount: number;
  @Prop({ type: Number, required: true })
  totalItems: number;
  @Prop({ type: String, default: 'PENDIENTE' })
  status: string;
  @Prop({ type: Boolean, default: false })
  paid: boolean;
  @Prop({ type: Date, default: null })
  paidAt: Date;
  @Prop({ type: [OrderItem], required: true })
  orderItem: OrderItem[];
  @Prop({ type: String })
  userId: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);