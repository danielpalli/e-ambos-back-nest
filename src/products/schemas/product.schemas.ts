import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Product {
  @Prop({ type: String, required: true })
  public model: string;
  @Prop({ type: String, required: true })
  public gender: string;
  @Prop({ type: String, required: true })
  public sizeAmbo: string;
  @Prop({ type: [String], required: true })
  public colourAmbo: string[];
  @Prop({ type: String, required: true })
  public sizePants: string;
  @Prop({ type: [String], required: true })
  public colourPants: string[];
  @Prop({ type: String, required: true })
  public details: string;
  @Prop({ type: String, default: 'PENDIENTE' })
  public status: string;
  @Prop({ type: Number, default: 42000.0 })
  public price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
