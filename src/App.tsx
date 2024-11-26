import React from "react";
import { CssBaseline, Container, Typography } from "@mui/material";
import Board from "./components/Board";

const App: React.FC = () => {
  return (
    <div>
      <CssBaseline />
      <Container>
        <Typography variant="h4" textAlign="center" marginY={4}>
          Task Board
        </Typography>
        <Board />
      </Container>
    </div>
  );
};

export default App;
