import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Order } from "src/orders/schemas/order.schema";

@Schema()
export class User {
  _id?: string;
  @Prop({ required: true })
  firstName: string;
  @Prop({ required: true })
  lastName: string;
  @Prop({ unique: true, required: true, lowercase: true })
  email: string;
  @Prop({ required: true, minlength: 6 })
  password?: string;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({type: [String], default: ['user'] })
  role: string[];
  @Prop({ type: [String], default: [] })
  ordersIds: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);