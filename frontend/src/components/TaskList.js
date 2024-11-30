import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Typography,
  Box,
  Container,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedText, setEditedText] = useState('');
  const apiUrl = process.env.REACT_APP_API_URL;
  
  // Fetch tasks from the backend API
  useEffect(() => {
    axios
      .get(`${apiUrl}/api/tasks`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((err) => console.error('Error fetching tasks:', err));
  }, []);

  // Add a new task
  const addTask = () => {
    if (newTask.trim()) {
      axios
        .post(`${apiUrl}/api/tasks`, { text: newTask })
        .then((response) => {
          setTasks([...tasks, response.data]);
          setNewTask('');
        })
        .catch((err) => console.error('Error adding task:', err));
    }
  };

  // Toggle task completion status
  const toggleCompletion = (id) => {
    const taskToUpdate = tasks.find((task) => task._id === id);
    axios
      .put(`${apiUrl}/api/tasks/${id}`, { completed: !taskToUpdate.completed })
      .then((response) => {
        setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
      })
      .catch((err) => console.error('Error updating task:', err));
  };

  // Edit a task
  const editTask = (id, currentText) => {
    setEditingTaskId(id);
    setEditedText(currentText);
  };

  // Save the edited task
  const saveEditedTask = (id) => {
    if (editedText.trim()) {
      axios
        .put(`${apiUrl}/api/tasks/edit/${id}`, { text: editedText })
        .then((response) => {
          setTasks(tasks.map((task) => (task._id === id ? response.data : task)));
          setEditingTaskId(null);
          setEditedText('');
        })
        .catch((err) => console.error('Error editing task:', err));
    }
  };

  // Delete a task
  const deleteTask = (id) => {
    axios
      .delete(`${apiUrl}/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => console.error('Error deleting task:', err));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        TaskFlow - Team Collaboration App
      </Typography>

      {/* Add Task Section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={addTask}>
          Add
        </Button>
      </Box>

      {/* Task List */}
      <List>
        {tasks.map((task) => (
          <ListItem
            key={task._id}
            sx={{
              textDecoration: task.completed ? 'line-through' : 'none',
              bgcolor: task.completed ? '#f0f0f0' : '#fff',
              mb: 1,
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            {editingTaskId === task._id ? (
              <TextField
                fullWidth
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                sx={{ mr: 2 }}
              />
            ) : (
              <ListItemText primary={task.text} />
            )}

            <ListItemSecondaryAction>
              {/* Toggle Completion */}
              <Checkbox
                edge="start"
                checked={task.completed}
                onChange={() => toggleCompletion(task._id)}
                color="primary"
              />

              {/* Edit or Save Buttons */}
              {editingTaskId === task._id ? (
                <>
                  <IconButton onClick={() => saveEditedTask(task._id)}>
                    <SaveIcon color="success" />
                  </IconButton>
                  <IconButton onClick={() => setEditingTaskId(null)}>
                    <CancelIcon color="error" />
                  </IconButton>
                </>
              ) : (
                <IconButton onClick={() => editTask(task._id, task.text)}>
                  <EditIcon />
                </IconButton>
              )}

              {/* Delete Button */}
              <IconButton edge="end" onClick={() => deleteTask(task._id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default TaskList;
