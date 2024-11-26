import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Box,
  Button,
  Card,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const navigate = useNavigate();

  return (
    <Card
      ref={drag}
      sx={{
        margin: "10px 0",
        padding: "10px",
        opacity: isDragging ? 0.5 : 1,
        cursor: "pointer",
        boxShadow: 3,
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: 6,
        },
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onClick={() => navigate(`/task/${task.id}`)}
    >
      <Typography variant="h6" fontWeight="bold" color="primary">
        {task.title}
      </Typography>
    </Card>
  );
};

const StatusColumn: React.FC<{
  status: string;
  tasks: Task[];
  moveTask: (id: number, status: string) => void;
  addTask: (status: string, title: string) => void;
  deleteStatus: (status: string) => void;
}> = ({ status, tasks, moveTask, addTask, deleteStatus }) => {
  const [, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { id: number }) => moveTask(item.id, status),
  }));

  const [newTaskTitle, setNewTaskTitle] = useState("");

  return (
    <Box
      ref={drop}
      sx={{
        flex: 1,
        margin: "10px",
        padding: "20px",
        backgroundColor: "#f5f5f5",
        borderRadius: "8px",
        boxShadow: 3,
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Chip
          label={`${status} (${tasks.length})`}
          color="secondary"
          sx={{ fontWeight: "bold", fontSize: "1rem" }}
        />
        <IconButton
          color="error"
          onClick={() => deleteStatus(status)}
          sx={{ position: "absolute", right: "10px" }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
      <Box sx={{ marginTop: "20px" }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="New Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          fullWidth
          sx={{ marginBottom: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            if (newTaskTitle.trim()) {
              addTask(status, newTaskTitle.trim());
              setNewTaskTitle("");
            }
          }}
        >
          Add Task
        </Button>
      </Box>
    </Box>
  );
};

const Board: React.FC = () => {
  const [statuses, setStatuses] = useState(["To Do", "In Progress", "Done"]);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [newStatus, setNewStatus] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [statusToDelete, setStatusToDelete] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const moveTask = (id: number, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
    );
  };

  const addTask = (status: string, title: string) => {
    const newTask: Task = {
      id: tasks.length + 1,
      title,
      description: "",
      status,
    };
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const addStatus = () => {
    if (newStatus.trim()) {
      setStatuses((prevStatuses) => [...prevStatuses, newStatus.trim()]);
      setNewStatus("");
      setOpenAddDialog(false);
    }
  };

  const handleDeleteStatus = () => {
    if (statusToDelete) {
      setStatuses((prevStatuses) => prevStatuses.filter((status) => status !== statusToDelete));
      setTasks((prevTasks) => prevTasks.filter((task) => task.status !== statusToDelete));
      setStatusToDelete(null);
      setOpenConfirmDialog(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "20px",
          backgroundColor: "#f0f2f5",
          minHeight: "100vh",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h4" fontWeight="bold" color="primary">
            Task Board
          </Typography>
          <IconButton
            color="primary"
            onClick={() => setOpenAddDialog(true)}
            sx={{ backgroundColor: "#e3f2fd", "&:hover": { backgroundColor: "#bbdefb" } }}
          >
            <AddIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: "flex", gap: "20px" }}>
          {statuses.map((status) => (
            <StatusColumn
              key={status}
              status={status}
              tasks={tasks.filter((task) => task.status === status)}
              moveTask={moveTask}
              addTask={addTask}
              deleteStatus={(status) => {
                setStatusToDelete(status);
                setOpenConfirmDialog(true);
              }}
            />
          ))}
        </Box>

        {/* Dialog for Adding Status */}
        <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)}>
          <DialogTitle>Add New Status</DialogTitle>
          <DialogContent>
            <TextField
              label="Status Name"
              fullWidth
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              variant="outlined"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={addStatus}>
              Add
            </Button>
          </DialogActions>
        </Dialog>

        {/* Confirmation Dialog for Deleting Status */}
        <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
          <DialogTitle>Delete Status</DialogTitle>
          <DialogContent>
            Are you sure you want to delete the status "{statusToDelete}"? This action will remove all associated tasks.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirmDialog(false)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeleteStatus}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DndProvider>
  );
};

export default Board;
