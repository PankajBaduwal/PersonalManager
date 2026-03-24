const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  getTaskStats
} = require('../controllers/taskController');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Task CRUD routes
router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTask);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.patch('/:id/toggle', toggleTaskComplete);

module.exports = router;
