import { Prop, Schema } from "@nestjs/mongoose";


@Schema()
export class OrderItem {
    @Prop({ type: String })
    model: string;
    @Prop({ type: Number })
    quantity: number;
    @Prop({ type: Number })
    price: number;
    @Prop({ type: String, required: true })
    productId: string;
}
