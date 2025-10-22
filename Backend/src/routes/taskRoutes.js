const express = require('express');
const { body } = require('express-validator');
const auth = require('../middlewares/auth');
const { 
  getTasks, 
  getTaskById,
  createTask, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');

const router = express.Router();

// Validation middleware for creating a task
const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),
  body('category')
    .optional()
    .isIn(['work', 'personal', 'health', 'finance', 'education', 'other'])
    .withMessage('Category must be one of: work, personal, health, finance, education, other'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date')
];

// Validation middleware for updating a task
const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed must be a boolean value'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('Priority must be one of: low, medium, high, urgent'),
  body('category')
    .optional()
    .isIn(['work', 'personal', 'health', 'finance', 'education', 'other'])
    .withMessage('Category must be one of: work, personal, health, finance, education, other'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date')
];

// All routes require authentication
router.use(auth);

// Routes
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTaskValidation, createTask);
router.put('/:id', updateTaskValidation, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
