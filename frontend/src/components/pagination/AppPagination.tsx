import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Box, IconButton, MenuItem, Select, Typography } from "@mui/material";

type AppPaginationProps = {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
};

function getVisibleRange(page: number, size: number, totalElements: number) {
  if (totalElements === 0) {
    return {
      from: 0,
      to: 0,
    };
  }

  const from = page * size + 1;
  const to = Math.min((page + 1) * size, totalElements);

  return { from, to };
}

export function AppPagination({
  page,
  size,
  totalElements,
  totalPages,
  onPageChange,
  onSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: AppPaginationProps) {
  const { from, to } = getVisibleRange(page, size, totalElements);
  const currentPage = totalPages === 0 ? 0 : page + 1;
  const isFirstPage = page <= 0;
  const isLastPage = totalPages === 0 || page >= totalPages - 1;

  return (
    <Box
      sx={{
        alignItems: { xs: "stretch", sm: "center" },
        bgcolor: "background.paper",
        borderTop: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 1.5, sm: 2.5 },
        justifyContent: "space-between",
        px: { xs: 2, sm: 2.25 },
        py: 1.5,
      }}
    >
      <Box
        sx={{
          alignItems: { xs: "flex-start", sm: "center" },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1, sm: 2.25 },
        }}
      >
        <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
          Mostrando{" "}
          <Box component="strong" sx={{ color: "#111827", fontWeight: 900 }}>
            {from} a {to}
          </Box>{" "}
          de{" "}
          <Box component="strong" sx={{ color: "#111827", fontWeight: 900 }}>
            {totalElements}
          </Box>{" "}
          pedidos
        </Typography>

        <Box sx={{ alignItems: "center", display: "flex", gap: 1 }}>
          <Typography sx={{ color: "text.secondary", fontSize: 12 }}>
            Por pagina:
          </Typography>
          <Select
            onChange={(event) => onSizeChange(Number(event.target.value))}
            value={size}
            sx={{
              bgcolor: "background.paper",
              borderRadius: 1,
              color: "#111827",
              fontSize: 12,
              fontWeight: 900,
              height: 30,
              minWidth: 48,
              "& .MuiSelect-select": {
                alignItems: "center",
                display: "flex",
                height: "30px !important",
                py: "0 !important",
              },
            }}
          >
            {pageSizeOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          gap: 0.75,
          justifyContent: { xs: "flex-end", sm: "center" },
        }}
      >
        <IconButton
          aria-label="Pagina anterior"
          disabled={isFirstPage}
          onClick={() => onPageChange(page - 1)}
          size="small"
          sx={{
            bgcolor: "#f8fafc",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            color: "#475569",
            height: 28,
            width: 28,
            "&:hover": {
              bgcolor: "#f1f5f9",
            },
            "&.Mui-disabled": {
              bgcolor: "#f8fafc",
              color: "text.disabled",
            },
          }}
        >
          <KeyboardArrowLeftIcon fontSize="small" />
        </IconButton>

        <Box
          sx={{
            alignItems: "center",
            bgcolor: "#c00000",
            borderRadius: 1,
            color: "common.white",
            display: "flex",
            fontSize: 12,
            fontWeight: 900,
            height: 28,
            justifyContent: "center",
            minWidth: 28,
            px: 1,
          }}
        >
          {currentPage}
        </Box>

        <IconButton
          aria-label="Proxima pagina"
          disabled={isLastPage}
          onClick={() => onPageChange(page + 1)}
          size="small"
          sx={{
            bgcolor: "#f8fafc",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            color: "#475569",
            height: 28,
            width: 28,
            "&:hover": {
              bgcolor: "#f1f5f9",
            },
            "&.Mui-disabled": {
              bgcolor: "#f8fafc",
              color: "text.disabled",
            },
          }}
        >
          <KeyboardArrowRightIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
}
