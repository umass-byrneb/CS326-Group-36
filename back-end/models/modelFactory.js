//milestone 6

import { FileTaskModel } from './fileTaskModel.js';
import { FileStorageModel } from './fileStorageModel.js';

export function getTaskModel(type="task") {
  if (type == "storage") return FileStorageModel;
  return FileTaskModel;
}
