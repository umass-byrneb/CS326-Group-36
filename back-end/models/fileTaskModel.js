import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.resolve('./data/tasks.json');

export class FileTaskModel {
  static async _readFile() {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  }

  static async _writeFile(tasks) {
    await fs.writeFile(DATA_PATH, JSON.stringify(tasks, null, 2), 'utf8');
  }

  static async getAll() {
    return this._readFile();
  }

  static async create(taskData) {
    const tasks = await this._readFile();
    const id = tasks.length ? tasks[tasks.length - 1].id + 1 : 1;
    const newTask = {
      id,
      ...taskData,
      listed: taskData.listed !== undefined ? taskData.listed : true
    };
    tasks.push(newTask);
    await this._writeFile(tasks);
    return newTask;
  }

  static async deleteById(id) {
    let tasks = await this._readFile();
    const before = tasks.length;
    tasks = tasks.filter(t => t.id !== id);
    if (tasks.length === before) return false;
    await this._writeFile(tasks);
    return true;
  }

  static async updateById(id, updates) {
    const tasks = await this._readFile();
    const idx = tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;
    tasks[idx] = { ...tasks[idx], ...updates };
    await this._writeFile(tasks);
    return tasks[idx];
  }
}
