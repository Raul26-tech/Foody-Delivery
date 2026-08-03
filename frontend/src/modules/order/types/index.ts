export type OrderStatus =
  | "RECEBIDO"
  | "EM_PREPARO"
  | "SAIU_PARA_ENTREGA"
  | "ENTREGUE"
  | "CANCELADO";

export type DeliveryAddress = {
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string | null;
};

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
  customerPhone: string;
  customerEmail: string | null;
  deliveryAddress: DeliveryAddress;
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

export type CreateDeliveryAddressRequest = {
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string | null;
};

export type CreateOrderRequest = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  deliveryAddress: CreateDeliveryAddressRequest;
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
