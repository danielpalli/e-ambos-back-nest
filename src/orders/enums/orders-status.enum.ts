export enum OrderStatus {
  PENDING   = 'PENDIENTE',
  CONFIRMED = 'CONFIRMADO',
  REFUSED   = 'RECHAZADO',
  DELIVERED = 'ENTREGADO',
}

export const OrderStatusList = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.REFUSED,
  OrderStatus.DELIVERED,
];
