import { Box, CircularProgress, Typography } from "@mui/material";

export function LoadingScreen() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress />

      <Typography color="text.secondary">Carregando...</Typography>
    </Box>
  );
}
