import React from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Board from "./components/Board";
import TaskDetails from "./components/TaskDetails";
import theme from "./theme";

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Board />} />
          <Route path="/task/:id" element={<TaskDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
