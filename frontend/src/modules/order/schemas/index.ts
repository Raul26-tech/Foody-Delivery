import { z } from "zod";

export const createOrderItemSchema = z.object({
  description: z
    .string()
    .min(1, "Informe a descricao do item")
    .max(200, "A descricao deve ter no maximo 200 caracteres"),
  quantity: z.coerce
    .number({ invalid_type_error: "Informe a quantidade" })
    .int("A quantidade deve ser um numero inteiro")
    .min(1, "A quantidade deve ser maior que zero"),
  unitPrice: z.coerce
    .number({ invalid_type_error: "Informe o valor unitario" })
    .min(0.01, "O valor unitario deve ser maior que zero")
    .refine((value) => Number.isFinite(value), "Informe o valor unitario")
    .refine(
      (value) => /^\d{1,10}(\.\d{1,2})?$/.test(String(value)),
      "O valor deve ter no maximo 10 digitos e 2 casas decimais",
    ),
});

export const createOrderSchema = z.object({
  customerName: z
    .string()
    .min(1, "Informe o nome do cliente")
    .max(120, "O nome deve ter no maximo 120 caracteres"),
  deliveryAddress: z
    .string()
    .min(1, "Informe o endereco de entrega")
    .max(300, "O endereco deve ter no maximo 300 caracteres"),
  items: z
    .array(createOrderItemSchema)
    .min(1, "O pedido deve conter pelo menos um item"),
});

export type CreateOrderFormDto = z.infer<typeof createOrderSchema>;
