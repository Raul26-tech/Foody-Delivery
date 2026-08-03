import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box, Chip, IconButton, Paper, Typography } from "@mui/material";
import type { ReactNode } from "react";

import type { DeliveryAddress, Order, OrderStatus } from "../types";

type OrderListProps = {
  orders: Order[];
  onOrderClick: (order: Order) => void;
  footer?: ReactNode;
};

type StatusMeta = {
  label: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
};

const statusMeta: Record<OrderStatus, StatusMeta> = {
  RECEBIDO: {
    label: "Recebido",
    color: "#475569",
    backgroundColor: "#f8fafc",
    borderColor: "#e2e8f0",
  },
  EM_PREPARO: {
    label: "Em Preparo",
    color: "#c2410c",
    backgroundColor: "#fff7ed",
    borderColor: "#fed7aa",
  },
  SAIU_PARA_ENTREGA: {
    label: "Saiu p/ Entrega",
    color: "#dc2626",
    backgroundColor: "#fff1f2",
    borderColor: "#fecdd3",
  },
  ENTREGUE: {
    label: "Entregue",
    color: "#15803d",
    backgroundColor: "#f0fdf4",
    borderColor: "#bbf7d0",
  },
  CANCELADO: {
    label: "Cancelado",
    color: "#e11d48",
    backgroundColor: "#fff1f2",
    borderColor: "#fecdd3",
  },
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency",
  }).format(value);
}

function formatOrderDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "--/--, --:--";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
  }).format(date);
}

function formatOrderCode(id: string): string {
  const rawCode = id.replace(/\D/g, "").slice(-4).padStart(4, "0");

  return `#PED-${rawCode}`;
}

function formatItemsSummary(order: Order): string {
  if (order.items.length === 0) {
    return "Sem itens registrados";
  }

  return order.items
    .map((item) => `${item.quantity}x ${item.description}`)
    .join(", ");
}

function formatDeliveryAddress(address: DeliveryAddress): string {
  return `${address.street}, ${address.number} - ${address.neighborhood}`;
}

export function OrderList({ footer, orders, onOrderClick }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1.3,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            minHeight: 180,
            p: 3,
          }}
        >
          <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
            Nenhum pedido encontrado.
          </Typography>
        </Box>
        {footer}
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.3,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          maxHeight: orders.length > 2 ? { xs: 430, md: "calc(100vh - 360px)" } : "none",
          minHeight: 0,
          overflowY: orders.length > 2 ? "auto" : "visible",
        }}
      >
        {orders.map((order, index) => {
          const meta = statusMeta[order.status];

          return (
            <Box
              key={order.id}
              component="button"
              onClick={() => onOrderClick(order)}
              sx={{
                alignItems: "center",
                bgcolor: "background.paper",
                border: 0,
                borderTop: index === 0 ? 0 : "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                display: "grid",
                fontFamily: "Roboto",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
                minHeight: 108,
                p: { xs: 2, sm: 2.25 },
                textAlign: "left",
                width: "100%",
                "&:hover": {
                  bgcolor: "#fbfbfb",
                },
              }}
              type="button"
            >
              <Box sx={{ minWidth: 0 }}>
              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 1,
                  mb: 0.75,
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
                    height: 22,
                  }}
                />
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
                    height: 22,
                  }}
                />
                <Typography sx={{ color: "text.disabled", fontSize: 12 }}>
                  * {formatOrderDate(order.createdAt)}
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: "#111827",
                  fontSize: 14,
                  fontWeight: 900,
                  mb: 0.6,
                }}
              >
                {order.customerName}
              </Typography>

              <Typography
                sx={{
                  color: "#64748b",
                  fontSize: 12,
                  lineHeight: 1.45,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: { xs: "normal", md: "nowrap" },
                }}
              >
                {formatItemsSummary(order)}
              </Typography>

              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  flexDirection: "row",
                  gap: 0.5,
                  mt: 0.5,
                }}
              >
                <LocationOnOutlinedIcon
                  sx={{ color: "text.disabled", fontSize: 14 }}
                />
                <Typography
                  sx={{
                    color: "text.disabled",
                    fontSize: 12,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: { xs: "normal", md: "nowrap" },
                  }}
                >
                  {formatDeliveryAddress(order.deliveryAddress)}
                </Typography>
              </Box>
              </Box>

              <Box
                sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                gap: 1.25,
                justifyContent: { xs: "space-between", sm: "flex-end" },
              }}
              >
                <Box sx={{ textAlign: "right" }}>
                <Typography
                  sx={{
                    color: "text.disabled",
                    fontSize: 9,
                    fontWeight: 900,
                    letterSpacing: 0,
                    textTransform: "uppercase",
                  }}
                >
                  Total
                </Typography>
                <Typography
                  sx={{ color: "#020617", fontSize: 14, fontWeight: 900 }}
                >
                  {formatCurrency(order.total)}
                </Typography>
                </Box>

                <IconButton
                aria-label="Abrir pedido"
                size="small"
                sx={{ bgcolor: "#f3f4f6", height: 28, width: 28 }}
                >
                  <KeyboardArrowRightIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>
      {footer}
    </Paper>
  );
}
