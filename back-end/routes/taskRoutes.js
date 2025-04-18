import express from 'express';
import {
  getAllTasks,
  addTask,
  deleteTask,
  updateTask
} from '../controllers/taskController.js';

const router = express.Router();

router.get   ('/tasks',     getAllTasks);
router.post  ('/tasks',     addTask);
router.delete('/tasks/:id', deleteTask);
router.put   ('/tasks/:id', updateTask);

export default router;
