import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ff6b00",
    },
    background: {
      default: "#f5f5f5",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
  },
});
