import { OrderStatus } from "../enums/orders-status.enum";

export interface OrderWithProducts {
  OrderItem: {
    model: string;
    quantity: number;
    price: number;
    productId: string;
  }[];
  _id: string;
  totalAmount: number;
  totalItems: number;
  status: OrderStatus;
  paid: boolean;
  paidAt: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;  
}