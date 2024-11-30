const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Create a new task
router.post('/tasks', async (req, res) => {
  const { text } = req.body;
  const newTask = new Task({ text });
  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create task' });
  }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch tasks' });
  }
});

// Update a task's completion status
// Edit a task's text
// Update a task's completion status
router.put('/tasks/:id', async (req, res) => {
    const { id } = req.params; // Task ID from URL
    const { completed } = req.body; // Completion status from request body
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(id, { completed }, { new: true });
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json(updatedTask); // Return the updated task
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to update task' });
    }
  });
  
  // Route for editing task text
  router.put('/tasks/edit/:id', async (req, res) => {
    const { id } = req.params;  // Task ID from URL
    const { text } = req.body;  // New task text from request body
  
    try {
      const updatedTask = await Task.findByIdAndUpdate(id, { text }, { new: true });
      if (!updatedTask) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.status(200).json(updatedTask); // Return the updated task
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to update task' });
    }
  });

// Delete a task
router.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
