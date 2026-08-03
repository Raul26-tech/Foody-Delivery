import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SaveIcon from "@mui/icons-material/Save";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import { AppLayout } from "../../../components/layout";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../service/api";
import { createOrderSchema, type CreateOrderFormDto } from "../schemas";
import type { CreateOrderRequest, Order, OrderStatus } from "../types";

type StatusMeta = {
  label: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  dotColor: string;
};

const statusMeta: Record<OrderStatus, StatusMeta> = {
  RECEBIDO: {
    label: "Recebido",
    color: "#1d4ed8",
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    dotColor: "#2563eb",
  },
  EM_PREPARO: {
    label: "Em Preparo",
    color: "#c2410c",
    backgroundColor: "#fff7ed",
    borderColor: "#fed7aa",
    dotColor: "#f59e0b",
  },
  SAIU_PARA_ENTREGA: {
    label: "Saiu p/ Entrega",
    color: "#dc2626",
    backgroundColor: "#fff1f2",
    borderColor: "#fecdd3",
    dotColor: "#e80000",
  },
  ENTREGUE: {
    label: "Entregue",
    color: "#15803d",
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
    dotColor: "#10b981",
  },
  CANCELADO: {
    label: "Cancelado",
    color: "#e11d48",
    backgroundColor: "#fff1f2",
    borderColor: "#fecdd3",
    dotColor: "#9ca3af",
  },
};

const progressStatuses: OrderStatus[] = [
  "RECEBIDO",
  "EM_PREPARO",
  "SAIU_PARA_ENTREGA",
  "ENTREGUE",
];

const progressStepIcons: Record<OrderStatus, React.ReactNode> = {
  RECEBIDO: <AccessTimeIcon sx={{ fontSize: 16 }} />,
  EM_PREPARO: <RestaurantIcon sx={{ fontSize: 16 }} />,
  SAIU_PARA_ENTREGA: <DeliveryDiningIcon sx={{ fontSize: 17 }} />,
  ENTREGUE: <CheckCircleIcon sx={{ fontSize: 16 }} />,
  CANCELADO: <ErrorOutlineOutlinedIcon sx={{ fontSize: 16 }} />,
};

const quickStatuses: OrderStatus[] = [
  "RECEBIDO",
  "EM_PREPARO",
  "SAIU_PARA_ENTREGA",
  "ENTREGUE",
  "CANCELADO",
];

const compactTextFieldSx = {
  "& .MuiFormHelperText-root": {
    fontSize: 10,
    mx: 0,
  },
  "& .MuiInputLabel-root": {
    fontSize: 12,
  },
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.2,
    fontSize: 13,
    height: 36,
  },
  "& .MuiOutlinedInput-input": {
    py: 0,
  },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value);
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--/--/----, --:--";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatOrderCode(id: string): string {
  const rawCode = id.replace(/\D/g, "").slice(-4).padStart(4, "0");

  return `#PED-${rawCode}`;
}

function getProgressIndex(status: OrderStatus): number {
  return progressStatuses.indexOf(status);
}

function StatusChip({ status }: { status: OrderStatus }) {
  const meta = statusMeta[status];

  return (
    <Chip
      label={meta.label}
      size="small"
      sx={{
        bgcolor: meta.backgroundColor,
        border: "1px solid",
        borderColor: meta.borderColor,
        color: meta.color,
        fontSize: 11,
        fontWeight: 900,
        height: 24,
      }}
    />
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <Box sx={{ alignItems: "center", display: "flex", gap: 0.75, mb: 1.5 }}>
      {icon}
      <Typography
        sx={{
          color: "text.secondary",
          fontSize: 11,
          fontWeight: 900,
          letterSpacing: 0,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}

async function findOrderById(orderId: string): Promise<Order> {
  const response = await api.get<Order>(`/orders/${orderId}`);

  return response.data;
}

async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<Order> {
  const response = await api.patch<Order>(`/orders/${orderId}/status`, {
    status,
  });

  return response.data;
}

async function createOrder(payload: CreateOrderRequest): Promise<Order> {
  const response = await api.post<Order>("/orders", payload);

  return response.data;
}

export function FormOrderPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { orderId } = useParams<{ orderId: string }>();
  const isCreateMode = !orderId;

  const createOrderForm = useForm<CreateOrderFormDto>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      deliveryAddress: {
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
        zipCode: "",
      },
      items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    },
  });

  const orderItemsFieldArray = useFieldArray({
    control: createOrderForm.control,
    name: "items",
  });

  const watchedItems =
    useWatch({
      control: createOrderForm.control,
      name: "items",
    }) ?? [];
  const createOrderTotal = watchedItems.reduce((total, item) => {
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unitPrice) || 0;

    return total + quantity * unitPrice;
  }, 0);

  const orderQuery = useQuery({
    enabled: Boolean(orderId),
    queryKey: ["orders", "detail", orderId],
    queryFn: () => findOrderById(orderId!),
  });

  const statusMutation = useMutation({
    mutationFn: (status: OrderStatus) => updateOrderStatus(orderId!, status),
    onSuccess: async (updatedOrder) => {
      queryClient.setQueryData(["orders", "detail", orderId], updatedOrder);
      await queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async (createdOrder) => {
      await queryClient.invalidateQueries({ queryKey: ["orders", "list"] });
      navigate(`/orders/${createdOrder.id}`, { replace: true });
    },
  });

  const order = orderQuery.data;

  function handleCreateSubmit(values: CreateOrderFormDto): void {
    createOrderMutation.mutate({
      customerName: values.customerName.trim(),
      customerPhone: values.customerPhone.trim(),
      customerEmail: values.customerEmail.trim() || null,
      deliveryAddress: {
        street: values.deliveryAddress.street.trim(),
        number: values.deliveryAddress.number.trim(),
        complement: values.deliveryAddress.complement.trim() || null,
        neighborhood: values.deliveryAddress.neighborhood.trim(),
        city: values.deliveryAddress.city.trim(),
        state: values.deliveryAddress.state.trim().toUpperCase(),
        zipCode: values.deliveryAddress.zipCode.trim() || null,
      },
      items: values.items.map((item) => ({
        description: item.description.trim(),
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    });
  }

  function handleStatusChange(status: OrderStatus): void {
    if (!order || order.status === status || statusMutation.isPending) {
      return;
    }

    statusMutation.mutate(status);
  }

  if (isCreateMode) {
    return (
      <AppLayout>
        <Box
          sx={{
            alignItems: { xs: "flex-start", sm: "center" },
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1.25,
            mb: 2,
            pb: 1.5,
          }}
        >
          <Button
            onClick={() => navigate("/orders")}
            startIcon={<ArrowBackIcon />}
            variant="outlined"
            sx={{
              borderColor: "divider",
              borderRadius: 1.3,
              color: "#111827",
              fontSize: 12,
              fontWeight: 800,
              height: 32,
              textTransform: "none",
            }}
          >
            Voltar
          </Button>
          <Chip
            label="Novo Pedido"
            size="small"
            sx={{
              bgcolor: "#fff1f2",
              border: "1px solid #fecdd3",
              color: "#e80000",
              fontSize: 11,
              fontWeight: 900,
              height: 24,
            }}
          />
          <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
            Preencha os dados para registrar um novo pedido
          </Typography>
        </Box>

        <Box
          component="form"
          noValidate
          onSubmit={createOrderForm.handleSubmit(handleCreateSubmit)}
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 294px" },
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                p: 2,
              }}
            >
              <SectionTitle
                icon={
                  <PersonOutlinedIcon sx={{ color: "#e80000", fontSize: 15 }} />
                }
                title="Dados do Pedido"
              />
              <Box
                sx={{
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 320px) minmax(0, 320px)" },
                }}
              >
                <Controller
                  control={createOrderForm.control}
                  name="customerName"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      error={Boolean(fieldState.error)}
                      fullWidth
                      helperText={fieldState.error?.message}
                      label="Cliente"
                      placeholder="Nome do cliente"
                      size="small"
                      sx={compactTextFieldSx}
                    />
                  )}
                />
                <Controller
                  control={createOrderForm.control}
                  name="customerPhone"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      error={Boolean(fieldState.error)}
                      fullWidth
                      helperText={fieldState.error?.message}
                      label="Telefone"
                      placeholder="(00) 00000-0000"
                      size="small"
                      sx={compactTextFieldSx}
                    />
                  )}
                />
                <Controller
                  control={createOrderForm.control}
                  name="customerEmail"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ""}
                      error={Boolean(fieldState.error)}
                      fullWidth
                      helperText={fieldState.error?.message}
                      label="E-mail"
                      placeholder="cliente@email.com"
                      size="small"
                      sx={compactTextFieldSx}
                      type="email"
                    />
                  )}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <SectionTitle
                icon={
                  <LocationOnOutlinedIcon
                    sx={{ color: "#e80000", fontSize: 15 }}
                  />
                }
                title="Endereco de Entrega"
              />
              <Box
                sx={{
                  display: "grid",
                  gap: 1.5,
                  gridTemplateColumns: { xs: "1fr", sm: "minmax(0, 360px) minmax(0, 160px)" },
                }}
              >
                <Controller
                  control={createOrderForm.control}
                  name="deliveryAddress.street"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      error={Boolean(fieldState.error)}
                      fullWidth
                      helperText={fieldState.error?.message}
                      label="Rua"
                      placeholder="Nome da rua"
                      size="small"
                      sx={compactTextFieldSx}
                    />
                  )}
                />
                <Controller
                  control={createOrderForm.control}
                  name="deliveryAddress.number"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      error={Boolean(fieldState.error)}
                      fullWidth
                      helperText={fieldState.error?.message}
                      label="Numero"
                      placeholder="100"
                      size="small"
                      sx={compactTextFieldSx}
                    />
                  )}
                />
                <Controller
                  control={createOrderForm.control}
                  name="deliveryAddress.neighborhood"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      error={Boolean(fieldState.error)}
                      fullWidth
                      helperText={fieldState.error?.message}
                      label="Bairro"
                      placeholder="Centro"
                      size="small"
                      sx={compactTextFieldSx}
                    />
                  )}
                />
                <Controller
                  control={createOrderForm.control}
                  name="deliveryAddress.city"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      error={Boolean(fieldState.error)}
                      fullWidth
                      helperText={fieldState.error?.message}
                      label="Cidade"
                      placeholder="Indaiatuba"
                      size="small"
                      sx={compactTextFieldSx}
                    />
                  )}
                />
                <Controller
                  control={createOrderForm.control}
                  name="deliveryAddress.state"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      error={Boolean(fieldState.error)}
                      fullWidth
                      helperText={fieldState.error?.message}
                      label="UF"
                      placeholder="SP"
                      size="small"
                      sx={compactTextFieldSx}
                    />
                  )}
                />
                <Controller
                  control={createOrderForm.control}
                  name="deliveryAddress.zipCode"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ""}
                      error={Boolean(fieldState.error)}
                      fullWidth
                      helperText={fieldState.error?.message}
                      label="CEP"
                      placeholder="00000-000"
                      size="small"
                      sx={compactTextFieldSx}
                    />
                  )}
                />
                <Controller
                  control={createOrderForm.control}
                  name="deliveryAddress.complement"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ""}
                      error={Boolean(fieldState.error)}
                      fullWidth
                      helperText={fieldState.error?.message}
                      label="Complemento / referencia"
                      placeholder="Sala 3"
                      size="small"
                      sx={{ ...compactTextFieldSx, gridColumn: { xs: "auto", sm: "1 / -1" }, maxWidth: 680 }}
                    />
                  )}
                />
              </Box>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                p: 2,
              }}
            >
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 1.5,
                }}
              >
                <SectionTitle
                  icon={
                    <Inventory2OutlinedIcon
                      sx={{ color: "#e80000", fontSize: 15 }}
                    />
                  }
                  title={`Itens do Pedido (${orderItemsFieldArray.fields.length})`}
                />
                <Typography
                  sx={{ color: "#e80000", fontSize: 12, fontWeight: 900 }}
                >
                  Total: {formatCurrency(createOrderTotal)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                {orderItemsFieldArray.fields.map((field, index) => {
                  const item = watchedItems[index];
                  const subtotal =
                    (Number(item?.quantity) || 0) *
                    (Number(item?.unitPrice) || 0);

                  return (
                    <Box
                      key={field.id}
                      sx={{
                        bgcolor: "#f8fafc",
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 1.3,
                        display: "grid",
                        gap: 1.25,
                        gridTemplateColumns: {
                          xs: "1fr",
                          md: "minmax(0, 1fr) 96px 122px 96px 32px",
                        },
                        p: 1.25,
                      }}
                    >
                      <Controller
                        control={createOrderForm.control}
                        name={`items.${index}.description`}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            error={Boolean(fieldState.error)}
                            helperText={fieldState.error?.message}
                            label="Item"
                            placeholder="Descricao do item"
                            size="small"
                            sx={compactTextFieldSx}
                          />
                        )}
                      />
                      <Controller
                        control={createOrderForm.control}
                        name={`items.${index}.quantity`}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            error={Boolean(fieldState.error)}
                            helperText={fieldState.error?.message}
                            label="Qtd"
                            size="small"
                            sx={compactTextFieldSx}
                            type="number"
                          />
                        )}
                      />
                      <Controller
                        control={createOrderForm.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field, fieldState }) => (
                          <TextField
                            {...field}
                            error={Boolean(fieldState.error)}
                            helperText={fieldState.error?.message}
                            slotProps={{ htmlInput: { step: "0.01" } }}
                            label="Valor unitario"
                            size="small"
                            sx={compactTextFieldSx}
                            type="number"
                          />
                        )}
                      />
                      <Box sx={{ alignSelf: "center" }}>
                        <Typography
                          sx={{
                            color: "text.secondary",
                            fontSize: 10,
                            fontWeight: 900,
                          }}
                        >
                          Subtotal
                        </Typography>
                        <Typography
                          sx={{
                            color: "#111827",
                            fontSize: 13,
                            fontWeight: 900,
                          }}
                        >
                          {formatCurrency(subtotal)}
                        </Typography>
                      </Box>
                      <IconButton
                        aria-label="Remover item"
                        disabled={orderItemsFieldArray.fields.length === 1}
                        onClick={() => orderItemsFieldArray.remove(index)}
                        sx={{ alignSelf: "center", color: "#e80000" }}
                      >
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>

              {createOrderForm.formState.errors.items?.root?.message ? (
                <Typography sx={{ color: "#e80000", fontSize: 12, mt: 1 }}>
                  {createOrderForm.formState.errors.items.root.message}
                </Typography>
              ) : null}

              <Button
                onClick={() =>
                  orderItemsFieldArray.append({
                    description: "",
                    quantity: 1,
                    unitPrice: 0,
                  })
                }
                startIcon={<AddIcon />}
                variant="outlined"
                sx={{
                  borderColor: "divider",
                  borderRadius: 1.3,
                  color: "#111827",
                  fontSize: 12,
                  fontWeight: 900,
                  mt: 1.5,
                  textTransform: "none",
                }}
              >
                Adicionar item
              </Button>
            </Paper>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                p: 2,
              }}
            >
              <SectionTitle
                icon={
                  <PersonOutlinedIcon sx={{ color: "#e80000", fontSize: 15 }} />
                }
                title="Operador"
              />
              <Divider sx={{ mb: 1.5 }} />
              <Typography
                sx={{ color: "#111827", fontSize: 13, fontWeight: 900 }}
              >
                {user?.name ?? "Usuario logado"}
              </Typography>
              <Typography
                sx={{ color: "text.secondary", fontSize: 12, mt: 0.5 }}
              >
                {user?.email ?? "Sessao autenticada"}
              </Typography>
            </Paper>

            <Paper
              elevation={0}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
                p: 2,
              }}
            >
              <SectionTitle
                icon={
                  <Inventory2OutlinedIcon
                    sx={{ color: "#e80000", fontSize: 15 }}
                  />
                }
                title="Resumo"
              />
              <Divider sx={{ mb: 1.5 }} />
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                  Itens
                </Typography>
                <Typography
                  sx={{ color: "#111827", fontSize: 12, fontWeight: 900 }}
                >
                  {orderItemsFieldArray.fields.length}
                </Typography>
              </Box>
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
              >
                <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                  Total
                </Typography>
                <Typography
                  sx={{ color: "#e80000", fontSize: 16, fontWeight: 900 }}
                >
                  {formatCurrency(createOrderTotal)}
                </Typography>
              </Box>

              {createOrderMutation.isError ? (
                <Alert severity="error" sx={{ mb: 1.5 }}>
                  Nao foi possivel criar o pedido. Revise os dados e tente
                  novamente.
                </Alert>
              ) : null}

              <Button
                disabled={createOrderMutation.isPending}
                fullWidth
                startIcon={<SaveIcon />}
                type="submit"
                variant="contained"
                sx={{
                  color: "#fff",
                  bgcolor: "#c00000",
                  borderRadius: 1.3,
                  fontSize: 12,
                  fontWeight: 900,
                  height: 38,
                  textTransform: "none",
                }}
              >
                {createOrderMutation.isPending ? "Criando..." : "Criar Pedido"}
              </Button>
            </Paper>
          </Box>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {orderQuery.isLoading ? (
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress size={28} />
        </Box>
      ) : null}

      {orderQuery.isError ? (
        <Alert severity="error">Nao foi possivel carregar o pedido.</Alert>
      ) : null}

      {order ? (
        <Box>
          <Box
            sx={{
              alignItems: { xs: "flex-start", sm: "center" },
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.25,
              mb: 2,
              pb: 1.5,
            }}
          >
            <Button
              onClick={() => navigate("/orders")}
              startIcon={<ArrowBackIcon />}
              variant="outlined"
              sx={{
                borderColor: "divider",
                borderRadius: 1.3,
                color: "#111827",
                fontSize: 12,
                fontWeight: 800,
                height: 32,
                textTransform: "none",
              }}
            >
              Voltar
            </Button>

            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Chip
                label={formatOrderCode(order.id)}
                size="small"
                sx={{
                  bgcolor: "#f8fafc",
                  border: "1px solid",
                  borderColor: "divider",
                  color: "#111827",
                  fontSize: 11,
                  fontWeight: 900,
                  height: 24,
                }}
              />
              <StatusChip status={order.status} />
              <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                Criado em {formatDateTime(order.createdAt)}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 294px" },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    alignItems: "center",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                    pb: 1.25,
                  }}
                >
                  <SectionTitle
                    icon={
                      <DeliveryDiningIcon
                        sx={{ color: "#e80000", fontSize: 15 }}
                      />
                    }
                    title="Progresso da Entrega"
                  />
                  <Typography
                    sx={{
                      color: "text.disabled",
                      fontSize: 11,
                      fontWeight: 800,
                    }}
                  >
                    Atualize o status conforme o fluxo de preparo
                  </Typography>
                </Box>

                {order.status === "CANCELADO" ? (
                  <Alert
                    icon={<ErrorOutlineOutlinedIcon />}
                    severity="error"
                    sx={{
                      bgcolor: "#fff1f2",
                      border: "1px solid #fecdd3",
                      color: "#e11d48",
                      fontSize: 12,
                      mb: 2,
                    }}
                  >
                    <Typography sx={{ fontSize: 12, fontWeight: 900 }}>
                      Este pedido foi cancelado.
                    </Typography>
                    <Typography sx={{ fontSize: 11 }}>
                      Voce pode alterar o status abaixo para reativar o pedido
                      se necessario.
                    </Typography>
                  </Alert>
                ) : (
                  <Box sx={{ mb: 3, px: { xs: 0, sm: 2 } }}>
                    <Box
                      sx={{
                        alignItems: "flex-start",
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor: "#e80000",
                          height: 5,
                          left: "12.5%",
                          position: "absolute",
                          right: "12.5%",
                          top: 16,
                        }}
                      />
                      {progressStatuses.map((status) => {
                        const index = getProgressIndex(status);
                        const currentIndex = getProgressIndex(order.status);
                        const isCompleted = index < currentIndex;
                        const isCurrent = status === order.status;
                        const isFuture = index > currentIndex;
                        const circleColor = isCurrent
                          ? "#e80000"
                          : isCompleted
                            ? "#059669"
                            : "background.paper";
                        const iconColor = isFuture ? "#9ca3af" : "common.white";

                        return (
                          <Box
                            key={status}
                            sx={{
                              alignItems: "center",
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.75,
                              minWidth: 0,
                              position: "relative",
                              zIndex: 1,
                            }}
                          >
                            <Box
                              sx={{
                                alignItems: "center",
                                bgcolor: circleColor,
                                border: "2px solid",
                                borderColor: isFuture ? "#d1d5db" : circleColor,
                                borderRadius: "50%",
                                boxShadow: isCurrent
                                  ? "0 0 0 6px #fee2e2"
                                  : "none",
                                color: iconColor,
                                display: "flex",
                                height: 34,
                                justifyContent: "center",
                                width: 34,
                              }}
                            >
                              {progressStepIcons[status]}
                            </Box>
                            <Typography
                              sx={{
                                color: isCurrent ? "#e80000" : "#111827",
                                fontSize: 12,
                                fontWeight: 900,
                                lineHeight: 1.1,
                                textAlign: "center",
                              }}
                            >
                              {statusMeta[status].label}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                <Divider sx={{ mb: 1.5 }} />
                <Typography
                  sx={{
                    color: "text.secondary",
                    fontSize: 10,
                    fontWeight: 900,
                    mb: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Alterar status rapidamente
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {quickStatuses.map((status) => {
                    const meta = statusMeta[status];
                    const isSelected = order.status === status;

                    return (
                      <Button
                        key={status}
                        disabled={statusMutation.isPending && !isSelected}
                        onClick={() => handleStatusChange(status)}
                        variant={isSelected ? "contained" : "outlined"}
                        sx={{
                          bgcolor: isSelected ? "#8b8d93" : "background.paper",
                          borderColor: isSelected ? "#8b8d93" : "divider",
                          borderRadius: 1.3,
                          color: isSelected ? "common.white" : "#111827",
                          fontSize: 11,
                          fontWeight: 900,
                          height: 28,
                          px: 1.25,
                          textTransform: "none",
                          "&:hover": {
                            bgcolor: isSelected ? "#8b8d93" : "#f8fafc",
                            borderColor: isSelected ? "#8b8d93" : "divider",
                          },
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            bgcolor: meta.dotColor,
                            borderRadius: "50%",
                            display: "inline-block",
                            height: 7,
                            mr: 0.75,
                            width: 7,
                          }}
                        />
                        {meta.label}
                      </Button>
                    );
                  })}
                </Box>
                {statusMutation.isError ? (
                  <Alert severity="error" sx={{ mt: 1.5 }}>
                    Nao foi possivel atualizar o status do pedido.
                  </Alert>
                ) : null}
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <SectionTitle
                    icon={
                      <Inventory2OutlinedIcon
                        sx={{ color: "#e80000", fontSize: 15 }}
                      />
                    }
                    title={`Itens do Pedido (${order.items.length})`}
                  />
                  <Typography
                    sx={{ color: "#e80000", fontSize: 12, fontWeight: 900 }}
                  >
                    Total: {formatCurrency(order.total)}
                  </Typography>
                </Box>

                <Table
                  size="small"
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1.3,
                    overflow: "hidden",
                  }}
                >
                  <TableHead sx={{ bgcolor: "#f8fafc" }}>
                    <TableRow>
                      <TableCell
                        sx={{
                          color: "text.secondary",
                          fontSize: 11,
                          fontWeight: 900,
                        }}
                      >
                        Item
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: "text.secondary",
                          fontSize: 11,
                          fontWeight: 900,
                        }}
                      >
                        Quantidade
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "text.secondary",
                          fontSize: 11,
                          fontWeight: 900,
                        }}
                      >
                        Valor Unitario
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          color: "text.secondary",
                          fontSize: 11,
                          fontWeight: 900,
                        }}
                      >
                        Subtotal
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell
                          sx={{
                            color: "#111827",
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          {item.description}
                        </TableCell>
                        <TableCell
                          align="center"
                          sx={{ fontSize: 12, fontWeight: 800 }}
                        >
                          {item.quantity}x
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{ color: "text.secondary", fontSize: 12 }}
                        >
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: "#111827",
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: "#f8fafc" }}>
                      <TableCell
                        colSpan={3}
                        align="right"
                        sx={{ color: "#475569", fontSize: 12, fontWeight: 900 }}
                      >
                        Valor Total do Pedido:
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ color: "#e80000", fontSize: 14, fontWeight: 900 }}
                      >
                        {formatCurrency(order.total)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Box
                  sx={{
                    bgcolor: "#fffbeb",
                    border: "1px solid #facc15",
                    borderRadius: 1.3,
                    mt: 2,
                    p: 1.5,
                  }}
                >
                  <Typography
                    sx={{ color: "#92400e", fontSize: 12, fontWeight: 900 }}
                  >
                    Observacoes do cliente:
                  </Typography>
                  <Typography sx={{ color: "#b45309", fontSize: 12 }}>
                    Nao informado.
                  </Typography>
                </Box>
              </Paper>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Paper
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  p: 2,
                }}
              >
                <SectionTitle
                  icon={
                    <PersonOutlinedIcon
                      sx={{ color: "#e80000", fontSize: 15 }}
                    />
                  }
                  title="Informacoes do Cliente"
                />
                <Divider sx={{ mb: 1.5 }} />
                <Typography
                  sx={{
                    color: "#111827",
                    fontSize: 13,
                    fontWeight: 900,
                    mb: 1,
                  }}
                >
                  {order.customerName}
                </Typography>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "flex",
                    gap: 0.75,
                    mb: 0.5,
                  }}
                >
                  <PhoneOutlinedIcon
                    sx={{ color: "text.disabled", fontSize: 15 }}
                  />
                  <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                    {order.customerPhone}
                  </Typography>
                </Box>
                <Box sx={{ alignItems: "center", display: "flex", gap: 0.75 }}>
                  <MailOutlinedIcon
                    sx={{ color: "text.disabled", fontSize: 15 }}
                  />
                  <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                    {order.customerEmail ?? "Nao informado"}
                  </Typography>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1.5,
                  p: 2,
                }}
              >
                <SectionTitle
                  icon={
                    <LocationOnOutlinedIcon
                      sx={{ color: "#e80000", fontSize: 15 }}
                    />
                  }
                  title="Endereco de Entrega"
                />
                <Divider sx={{ mb: 1.5 }} />
                <Typography
                  sx={{ color: "#111827", fontSize: 13, fontWeight: 900 }}
                >
                  {`${order.deliveryAddress.street}, ${order.deliveryAddress.number}`}
                </Typography>
                <Typography
                  sx={{
                    color: "#475569",
                    fontSize: 12,
                    fontWeight: 800,
                    mt: 0.75,
                  }}
                >
                  Bairro: {order.deliveryAddress.neighborhood}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                  Cidade: {order.deliveryAddress.city} -{" "}
                  {order.deliveryAddress.state}
                </Typography>
                <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
                  CEP: {order.deliveryAddress.zipCode ?? "Nao informado"}
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#f8fafc",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    mt: 1.25,
                    p: 1.25,
                  }}
                >
                  <Typography
                    sx={{
                      color: "text.secondary",
                      fontSize: 10,
                      fontWeight: 900,
                    }}
                  >
                    COMPLEMENTO / REF:
                  </Typography>
                  <Typography
                    sx={{ color: "#111827", fontSize: 12, fontWeight: 800 }}
                  >
                    {order.deliveryAddress.complement ?? "Nao informado"}
                  </Typography>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      ) : null}
    </AppLayout>
  );
}
