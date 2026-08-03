import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import LogoutIcon from "@mui/icons-material/Logout";
import { Avatar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

function LogoMark() {
  return (
    <Box
      sx={{
        alignItems: "center",
        bgcolor: "#e80000",
        borderRadius: "10px",
        color: "common.white",
        display: "inline-flex",
        height: 34,
        justifyContent: "center",
        width: 34,
      }}
    >
      <DeliveryDiningIcon sx={{ fontSize: 19 }} />
    </Box>
  );
}

function getInitials(name?: string): string {
  if (!name) {
    return "U";
  }

  const [firstName, secondName] = name.trim().split(/\s+/);

  return `${firstName?.[0] ?? ""}${secondName?.[0] ?? ""}`.toUpperCase();
}

export function AppLayout({ children }: PropsWithChildren) {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  async function handleLogout(): Promise<void> {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <Box sx={{ bgcolor: "#f8faf9", minHeight: "100vh" }}>
      <Box
        component="header"
        sx={{
          alignItems: "center",
          bgcolor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04)",
          display: "flex",
          height: 58,
          position: "sticky",
          top: 0,
          zIndex: 1100,
          px: { xs: 2, md: 6, lg: 19 },
        }}
      >
        <Box sx={{ alignItems: "center", display: "flex", minWidth: 0 }}>
          <LogoMark />
          <Box sx={{ ml: 1.5, whiteSpace: "nowrap" }}>
            <Typography
              component="span"
              sx={{ color: "#111827", fontSize: 14, fontWeight: 800 }}
            >
              Foody
              <Box component="span" sx={{ color: "#e80000" }}>
                .
              </Box>
            </Typography>
            <Typography
              component="span"
              sx={{
                color: "text.secondary",
                fontSize: 12,
                fontWeight: 700,
                ml: 0.5,
              }}
            >
              Delivery
            </Typography>
          </Box>
        </Box>

        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            gap: { xs: 0.75, sm: 1.5 },
            ml: "auto",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#111827",
              color: "common.white",
              fontSize: 13,
              fontWeight: 800,
              height: 31,
              width: 31,
            }}
          >
            {getInitials(user?.name)}
          </Avatar>

          <Typography
            sx={{
              color: "#111827",
              display: { xs: "none", sm: "block" },
              fontSize: 12,
              fontWeight: 800,
              maxWidth: 140,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.name ?? "Usuario"}
          </Typography>

          <Tooltip title="Sair">
            <IconButton aria-label="Sair" onClick={handleLogout} size="small">
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box
        component="main"
        sx={{
          mx: "auto",
          px: { xs: 2, md: 3 },
          py: 3,
          width: "100%",
          maxWidth: 1042,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
