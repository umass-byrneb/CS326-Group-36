//milestone 6

import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.resolve('./data/users.json');

export class FileUserModel {
  static async _readFile() {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  }

  static async _writeFile(users) {
    await fs.writeFile(DATA_PATH, JSON.stringify(users, null, 2), 'utf8');
  }

  static async getAll() {
    return this._readFile();
  }

  static async findByEmail(email) {
    const users = await this._readFile();
    return users.find(u => u.email === email) || null;
  }

  static async findById(id) {
    const users = await this._readFile();
    return users.find(u => u.id === id) || null;
  }

  static async create({ fullname, email, password }) {
    const users = await this._readFile();
    const id = users.length ? users[users.length - 1].id + 1 : 1;
    const newUser = { id, fullname, email, password };
    users.push(newUser);
    await this._writeFile(users);
    return newUser;
  }

  static async deleteById(id) {
    const users = await this._readFile();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;
    await this._writeFile(filtered);
    return true;
  }
}
