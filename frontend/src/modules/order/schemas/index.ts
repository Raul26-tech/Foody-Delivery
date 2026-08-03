import { z } from "zod";

export const createDeliveryAddressSchema = z.object({
  street: z
    .string()
    .min(1, "Informe a rua")
    .max(150, "A rua deve ter no maximo 150 caracteres"),
  number: z
    .string()
    .min(1, "Informe o numero")
    .max(30, "O numero deve ter no maximo 30 caracteres"),
  complement: z
    .string()
    .max(100, "O complemento deve ter no maximo 100 caracteres"),
  neighborhood: z
    .string()
    .min(1, "Informe o bairro")
    .max(100, "O bairro deve ter no maximo 100 caracteres"),
  city: z
    .string()
    .min(1, "Informe a cidade")
    .max(100, "A cidade deve ter no maximo 100 caracteres"),
  state: z
    .string()
    .min(1, "Informe a UF")
    .regex(/^[A-Za-z]{2}$/, "A UF deve conter exatamente 2 letras"),
  zipCode: z.string().max(10, "O CEP deve ter no maximo 10 caracteres"),
});

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
  customerPhone: z
    .string()
    .min(1, "Informe o telefone do cliente")
    .max(20, "O telefone deve ter no maximo 20 caracteres"),
  customerEmail: z
    .string()
    .max(180, "O e-mail deve ter no maximo 180 caracteres")
    .refine(
      (value) => value.trim() === "" || z.string().email().safeParse(value).success,
      "Informe um e-mail valido",
    ),
  deliveryAddress: createDeliveryAddressSchema,
  items: z
    .array(createOrderItemSchema)
    .min(1, "O pedido deve conter pelo menos um item"),
});

export type CreateOrderFormDto = z.infer<typeof createOrderSchema>;
