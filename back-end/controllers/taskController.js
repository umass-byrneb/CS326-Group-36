import { Task } from '../models/index.js';

export async function getAllTasks(req, res, next) {
  try {
    const tasks = await Task.findAll();
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
    const task = await Task.create({
      name, tag, cost, description, contact, delivery, image, owner, listed
    });
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
    const count = await Task.destroy({ where: { id } });
    if (!count) {
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
    const { listed } = req.body;
    if (isNaN(id) || typeof listed !== 'boolean') {
      return res.status(400).json({ error: 'Invalid request.' });
    }
    const [count] = await Task.update({ listed }, { where: { id } });
    if (!count) {
      return res.status(404).json({ error: 'Task not found.' });
    }
    const updated = await Task.findByPk(id);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
