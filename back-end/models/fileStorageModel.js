//milestone 6

import fs from 'fs/promises';
import path from 'path';

const DATA_PATH = path.resolve('./data/storage.json');

export class FileStorageModel {
  static async _readFile() {
    const raw = await fs.readFile(DATA_PATH, 'utf8');
    return JSON.parse(raw);
  }

  static async _writeFile(tasks) {
    await fs.writeFile(DATA_PATH, JSON.stringify(tasks, null, 2), 'utf8');
  }

  static async getAll() {
    // try {
    //     return this._readFile();
    // } catch (err) {
    //     return err
    // }
    // const output = this._readFile();
    // console.log("output of read file: ", output);
    return this._readFile();
    // return output;
  }

  static async createItem(item) {
    const list = await this._readFile();
    const id = list[0].id + 1;
    const newItem = {
        id, 
        ...item,
        listed: false,
    }
    list.unshift(newItem);
    await this._writeFile(list);
    return newItem;
  }

  //when ID is removed, it doesn't change the ID of the remaining items in the list
  static async updateItemById(id) {
    const list = await this._readFile();
    const filtered = list.filter(item => item.id == Number(id));
    const index = filtered[0];
    list[list.length - index].listed = true;
    await this._writeFile(filtered);
    return true;
  }
}