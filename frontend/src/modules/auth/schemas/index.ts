import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Informe o e-mail")
    .email("Informe um e-mail valido"),
  password: z.string().min(1, "Informe a senha"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Informe o nome")
    .max(120, "O nome deve ter no maximo 120 caracteres"),
  email: z
    .string()
    .min(1, "Informe o e-mail")
    .email("Informe um e-mail valido")
    .max(180, "O e-mail deve ter no maximo 180 caracteres"),
  password: z
    .string()
    .min(8, "A senha deve ter pelo menos 8 caracteres")
    .max(72, "A senha deve ter no maximo 72 caracteres"),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type RegisterDto = z.infer<typeof registerSchema>;
