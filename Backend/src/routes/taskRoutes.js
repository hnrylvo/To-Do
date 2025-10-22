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

const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es requerido')
    .isLength({ min: 1, max: 200 })
    .withMessage('El título debe tener entre 1 y 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción debe tener menos de 1000 caracteres'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('La prioridad debe ser una de: baja, media, alta, urgente'),
  body('category')
    .optional()
    .isIn(['work', 'personal', 'health', 'finance', 'education', 'other'])
    .withMessage('La categoría debe ser una de: trabajo, personal, salud, finanzas, educación, otros'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de vencimiento debe ser una fecha válida')
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('El título debe tener entre 1 y 100 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción debe tener menos de 1000 caracteres'),
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completado debe ser un valor booleano'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'urgent'])
    .withMessage('La prioridad debe ser una de: baja, media, alta, urgente'),
  body('category')
    .optional()
    .isIn(['work', 'personal', 'health', 'finance', 'education', 'other'])
    .withMessage('La categoría debe ser una de: trabajo, personal, salud, finanzas, educación, otros'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('La fecha de vencimiento debe ser una fecha válida')
];

// Todas las rutas requieren autenticación
router.use(auth);

// Routes
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', createTaskValidation, createTask);
router.put('/:id', updateTaskValidation, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
