import React, { useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Box, Button, Card, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

// Types
interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

// Draggable TaskCard Component
const TaskCard: React.FC<{ task: Task; moveTask: (id: number, status: string) => void }> = ({ task, moveTask }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <Card
      ref={drag}
      sx={{
        margin: "10px 0",
        padding: "10px",
        opacity: isDragging ? 0.5 : 1,
        cursor: "pointer",
      }}
    >
      <Typography variant="body1" fontWeight="bold">
        {task.title}
      </Typography>
    </Card>
  );
};

// Droppable StatusColumn Component
const StatusColumn: React.FC<{
  status: string;
  tasks: Task[];
  moveTask: (id: number, status: string) => void;
  addTask: (status: string, title: string) => void;
}> = ({ status, tasks, moveTask, addTask }) => {
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
        padding: "10px",
        backgroundColor: "#f4f4f4",
        borderRadius: "8px",
        minHeight: "300px",
      }}
    >
      <Typography variant="h6" sx={{ marginBottom: "10px" }}>
        {status} ({tasks.length})
      </Typography>
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} moveTask={moveTask} />
      ))}
      <Box>
        <TextField
          size="small"
          placeholder="New Task Title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          sx={{ marginBottom: "10px", width: "100%" }}
        />
        <Button
          variant="contained"
          onClick={() => {
            if (newTaskTitle.trim()) {
              addTask(status, newTaskTitle.trim());
              setNewTaskTitle("");
            }
          }}
          sx={{ width: "100%" }}
        >
          Add Task
        </Button>
      </Box>
    </Box>
  );
};

// Main Board Component
const Board: React.FC = () => {
  const [statuses, setStatuses] = useState(["To Do", "In Progress", "Done"]);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Task 1", description: "Description for Task 1", status: "To Do" },
    { id: 2, title: "Task 2", description: "Description for Task 2", status: "In Progress" },
  ]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

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

  const deleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    setSelectedTask(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ display: "flex", padding: "20px" }}>
        {statuses.map((status) => (
          <StatusColumn
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            moveTask={moveTask}
            addTask={addTask}
          />
        ))}
      </Box>

      {selectedTask && (
        <Dialog open={!!selectedTask} onClose={() => setSelectedTask(null)}>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent>
            <TextField
              label="Title"
              value={selectedTask.title}
              onChange={(e) => setSelectedTask({ ...selectedTask, title: e.target.value })}
              fullWidth
              sx={{ marginBottom: "10px" }}
            />
            <TextField
              label="Description"
              value={selectedTask.description}
              onChange={(e) => setSelectedTask({ ...selectedTask, description: e.target.value })}
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              label="Status"
              value={selectedTask.status}
              onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
              fullWidth
              sx={{ marginTop: "10px" }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => deleteTask(selectedTask.id)} color="error">
              Delete
            </Button>
            <Button onClick={() => setSelectedTask(null)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </DndProvider>
  );
};

export default Board;
