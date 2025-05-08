import { StorageListingService } from "./StorageListingService.js";
import { StorageListingRemoteService } from "./StorageListingRemoteService.js";

export class StorageRepositoryFactory {
  constructor() {
    throw new Error('Cannot instantiate StorageRepositoryFactory');
  }

  static get(repoType = 'local') {
    if (repoType === 'local') {
      return new StorageListingService();
    } else if (repoType === 'remote') {
      return new StorageListingRemoteService();
    } else {
      throw new Error('Invalid repository type');
    }
  }
}
