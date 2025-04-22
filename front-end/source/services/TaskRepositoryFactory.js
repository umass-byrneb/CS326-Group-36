import { TaskRepositoryService } from "./TaskRepositoryService.js";
import { MockItemService } from "./MockItemService.js";

export class TaskRepositoryFactory {
  constructor() {
    throw new Error('Cannot instantiate TaskRepositoryFactory');
  }

  static get(repoType = 'local') {
    if (repoType === 'local') {
      return new TaskRepositoryService();
    } else if (repoType === 'remote') {
      return new MockItemService();
    } else {
      throw new Error('Invalid repository type');
    }
  }
}
