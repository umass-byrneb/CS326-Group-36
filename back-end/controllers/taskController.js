import { getTaskModel } from '../models/modelFactory.js';
const TaskModel = getTaskModel();

export async function getAllTasks(req, res, next) {
  try {
    const tasks = await TaskModel.getAll();
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
}

export async function addTask(req, res, next) {
  try {
    const { name, tag, cost, description, contact, delivery, image, owner, listed } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Task name is required.' });
    }
    const task = await TaskModel.create({ name, tag, cost, description, contact, delivery, image, owner, listed });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
    }
    const success = await TaskModel.deleteById(id);
    if (!success) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid task ID.' });
    }
    const { listed } = req.body;
    if (typeof listed !== 'boolean') {
      return res.status(400).json({ error: '`listed` must be a boolean.' });
    }
    const updated = await TaskModel.updateById(id, { listed });
    if (!updated) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
