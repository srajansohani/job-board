import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const TaskDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const tasks: Task[] = JSON.parse(storedTasks);
      const currentTask = tasks.find((t) => t.id === Number(id));
      setTask(currentTask || null);
    }
  }, [id]);

  const handleUpdate = () => {
    if (task) {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        const tasks: Task[] = JSON.parse(storedTasks);
        const updatedTasks = tasks.map((t) =>
          t.id === task.id ? task : t
        );
        localStorage.setItem("tasks", JSON.stringify(updatedTasks));
        navigate("/");
      }
    }
  };

  const handleDelete = () => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      const tasks: Task[] = JSON.parse(storedTasks);
      const updatedTasks = tasks.filter((t) => t.id !== Number(id));
      localStorage.setItem("tasks", JSON.stringify(updatedTasks));
      navigate("/");
    }
  };

  if (!task) return <Typography>Task not found</Typography>;

  return (
    <Box sx={{ padding: "20px" }}>
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Edit Task
      </Typography>
      <TextField
        label="Title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        fullWidth
        sx={{ marginBottom: "10px" }}
      />
      <TextField
        label="Description"
        value={task.description}
        onChange={(e) => setTask({ ...task, description: e.target.value })}
        fullWidth
        multiline
        rows={4}
        sx={{ marginBottom: "10px" }}
      />
      <TextField
        label="Status"
        value={task.status}
        onChange={(e) => setTask({ ...task, status: e.target.value })}
        fullWidth
        sx={{ marginBottom: "20px" }}
      />
      <Button variant="contained" onClick={handleUpdate} sx={{ marginRight: "10px" }}>
        Update Task
      </Button>
      <Button variant="outlined" color="error" onClick={handleDelete}>
        Delete Task
      </Button>
    </Box>
  );
};

export default TaskDetails;
