import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppLayout } from "../../../components/layout";
import { AppPagination } from "../../../components/pagination";
import { api } from "../../../service/api";
import { OrderList } from "../components/OrderList";
import type { Order, OrderStatus, PageResponse } from "../types";

type StatusFilter = OrderStatus | "ALL";

const statusFilters: Array<{ label: string; value: StatusFilter }> = [
  { label: "Todos", value: "ALL" },
  { label: "Recebido", value: "RECEBIDO" },
  { label: "Em Preparo", value: "EM_PREPARO" },
  { label: "Saiu p/ Entrega", value: "SAIU_PARA_ENTREGA" },
  { label: "Entregue", value: "ENTREGUE" },
  { label: "Cancelado", value: "CANCELADO" },
];

function getOrderCode(order: Order): string {
  return order.id.replace(/\D/g, "").slice(-4).padStart(4, "0");
}

function matchesSearch(order: Order, search: string): boolean {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [
    order.customerName,
    order.deliveryAddress,
    order.id,
    getOrderCode(order),
  ].some((value) => value.toLowerCase().includes(normalizedSearch));
}

function getStatusCount(orders: Order[], status: StatusFilter): number {
  if (status === "ALL") {
    return orders.length;
  }

  return orders.filter((order) => order.status === status).length;
}

export function OrderPage() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);

  async function listOrders(
    currentPage: number,
    currentSize: number,
  ): Promise<PageResponse<Order>> {
    const response = await api.get<PageResponse<Order>>("/orders", {
      params: {
        page: currentPage,
        size: currentSize,
      },
    });

    return response.data;
  }

  const ordersQuery = useQuery({
    queryKey: ["orders", "list", page, size],
    queryFn: () => listOrders(page, size),
  });

  const orders = useMemo(
    () => ordersQuery.data?.content ?? [],
    [ordersQuery.data?.content],
  );
  const totalElements = ordersQuery.data?.totalElements ?? 0;
  const totalPages = ordersQuery.data?.totalPages ?? 0;

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        selectedStatus === "ALL" || order.status === selectedStatus;

      return matchesStatus && matchesSearch(order, search);
    });
  }, [orders, search, selectedStatus]);

  function handleOrderClick(order: Order): void {
    navigate(`/orders/${order.id}`);
  }

  function handleSizeChange(nextSize: number): void {
    setSize(nextSize);
    setPage(0);
  }

  return (
    <AppLayout>
      <Box
        sx={{
          alignItems: { xs: "stretch", sm: "flex-start" },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          justifyContent: "space-between",
          mb: 2,
        }}
      >
        <Box>
          <Typography
            component="h1"
            sx={{
              color: "#111827",
              fontSize: 21,
              fontWeight: 900,
              lineHeight: 1.15,
            }}
          >
            Gerenciador de Pedidos
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: 12, mt: 0.5 }}>
            {totalElements} pedido(s) registrado(s) no sistema
          </Typography>
        </Box>

        <Button
          onClick={() => navigate("/orders/new")}
          startIcon={<AddIcon />}
          variant="text"
          sx={{
            alignSelf: { xs: "stretch", sm: "center" },
            color: "white",
            bgcolor: "#c00000",
            borderRadius: 1,
            fontSize: 12,
            fontWeight: 900,
            minHeight: 34,
            px: 2,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#c00000",
            },
          }}
        >
          Novo Pedido
        </Button>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 0.75,
          mb: 2,
        }}
      >
        {statusFilters.map((filter) => {
          const isSelected = selectedStatus === filter.value;

          return (
            <Button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              variant={isSelected ? "contained" : "outlined"}
              sx={{
                bgcolor: isSelected ? "#18181a" : "background.paper",
                borderColor: "divider",
                borderRadius: 1,
                color: isSelected ? "common.white" : "#475569",
                fontSize: 12,
                height: 30,
                fontWeight: 900,
                px: 1.35,
                textTransform: "none",
                "&:hover": {
                  bgcolor: isSelected ? "#111827" : "#f8fafc",
                  borderColor: "divider",
                },
              }}
            >
              {filter.label}
              <Chip
                label={getStatusCount(orders, filter.value)}
                size="small"
                sx={{
                  bgcolor: isSelected ? "rgba(255,255,255,0.16)" : "#f1f5f9",
                  color: isSelected ? "common.white" : "text.secondary",
                  fontSize: 10,
                  fontWeight: 900,
                  height: 16,
                  ml: 0.75,
                  minWidth: 18,
                  "& .MuiChip-label": {
                    px: 0.7,
                  },
                }}
              />
            </Button>
          );
        })}
      </Box>

      <Box
        sx={{
          alignItems: "center",
          display: "grid",
          gap: 1,
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 134px" },
          mb: 1.75,
        }}
      >
        <TextField
          fullWidth
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por cliente, n do pedido ou bairro..."
          value={search}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "background.paper",
              borderRadius: 1,
              fontSize: 12,
              height: 36,
              px: 0.75,
            },
            "& .MuiOutlinedInput-input": {
              py: 0,
            },
          }}
        />

        <Select
          displayEmpty
          value="recent"
          sx={{
            bgcolor: "background.paper",
            borderRadius: 1,
            color: "#111827",
            flexShrink: 0,
            fontSize: 12,
            fontWeight: 900,
            height: 36,
            minWidth: { xs: "100%", md: 134 },
            "& .MuiSelect-select": {
              alignItems: "center",
              display: "flex",
              gap: 0.75,
              height: "44px !important",
              py: "0 !important",
            },
          }}
          renderValue={() => (
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "row",
                gap: 0.75,
              }}
            >
              <SwapVertIcon sx={{ color: "text.secondary", fontSize: 16 }} />
              Mais Recentes
            </Box>
          )}
        >
          <MenuItem value="recent">Mais Recentes</MenuItem>
        </Select>
      </Box>

      {ordersQuery.isLoading ? (
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

      {ordersQuery.isError ? (
        <Alert severity="error">
          Não foi possivel carregar os pedidos. Tente novamente em instantes.
        </Alert>
      ) : null}

      {ordersQuery.isSuccess ? (
        <OrderList
          footer={
            <AppPagination
              onPageChange={setPage}
              onSizeChange={handleSizeChange}
              page={page}
              size={size}
              totalElements={totalElements}
              totalPages={totalPages}
            />
          }
          orders={filteredOrders}
          onOrderClick={handleOrderClick}
        />
      ) : null}
    </AppLayout>
  );
}
