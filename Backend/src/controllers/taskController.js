const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findByUserId(req.userId);
    const normalized = tasks.map(t => ({
      id: t.id,
      userId: t.user_id,
      title: t.title,
      description: t.description,
      completed: !!t.completed,
      priority: t.priority,
      category: t.category,
      dueDate: t.due_date,
      createdAt: t.created_at,
      updatedAt: t.updated_at
    }));

    res.json({ tasks: normalized });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching tasks' 
    });
  }
};

// Get task by ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id, req.userId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }
    const normalized = {
      id: task.id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      completed: !!task.completed,
      priority: task.priority,
      category: task.category,
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    };

    res.json({ task: normalized });
  } catch (error) {
    console.error('Get task by ID error:', error);
    res.status(500).json({ 
      error: 'Server error while fetching task' 
    });
  }
};

// Create task
const createTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, priority, category, dueDate } = req.body;
    const task = await Task.create(req.userId, title, description, priority, category, dueDate);

    const normalized = {
      id: task.id,
      userId: task.user_id,
      title: task.title,
      description: task.description,
      completed: !!task.completed,
      priority: task.priority,
      category: task.category,
      dueDate: task.due_date,
      createdAt: task.created_at,
      updatedAt: task.updated_at
    };

    res.status(201).json({
      message: 'Task created successfully',
      task: normalized
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ 
      error: 'Server error while creating task' 
    });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { title, description, completed, priority, category, dueDate } = req.body;

    // Update task
    await Task.update(id, req.userId, { title, description, completed, priority, category, dueDate });

    // Fetch
    const updatedTask = await Task.findById(id, req.userId);
    const normalized = {
      id: updatedTask.id,
      userId: updatedTask.user_id,
      title: updatedTask.title,
      description: updatedTask.description,
      completed: !!updatedTask.completed,
      priority: updatedTask.priority,
      category: updatedTask.category,
      dueDate: updatedTask.due_date,
      createdAt: updatedTask.created_at,
      updatedAt: updatedTask.updated_at
    };

    res.json({
      message: 'Task updated successfully',
      task: normalized
    });
  } catch (error) {
    console.error('Update task error:', error);
    if (error.message === 'Task not found or unauthorized') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ 
      error: 'Server error while updating task' 
    });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.delete(id, req.userId);

    res.json({
      message: 'Task deleted successfully'
    });
  } catch (error) {
    console.error('Delete task error:', error);
    if (error.message === 'Task not found or unauthorized') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ 
      error: 'Server error while deleting task' 
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};
