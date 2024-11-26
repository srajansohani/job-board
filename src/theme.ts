import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Blue
    },
    secondary: {
      main: "#f50057", // Pink
    },
    background: {
      default: "#f0f2f5",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h5: {
      fontWeight: 700,
    },
    body1: {
      fontSize: "1rem",
    },
  },
});

export default theme;
