export type OrderStatus =
  | "RECEBIDO"
  | "EM_PREPARO"
  | "SAIU_PARA_ENTREGA"
  | "ENTREGUE"
  | "CANCELADO";

export type OrderItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
};

export type Order = {
  id: string;
  customerName: string;
  deliveryAddress: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateOrderItemRequest = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type CreateOrderRequest = {
  customerName: string;
  deliveryAddress: string;
  items: CreateOrderItemRequest[];
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};
