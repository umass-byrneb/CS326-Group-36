import { EventHub } from "../eventhub/EventHub.js";
import { Events } from "../eventhub/Events.js";
import { mockItems } from "../utility/mockItems.js";

export class MockItemService {
  constructor() {
    this.items = [...mockItems];
    EventHub.getInstance().publish(Events.LoadTasksSuccess, this.items);
  }

  async storeItem(itemData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.items.push(itemData);
        EventHub.getInstance().publish(Events.StoreTaskSuccess, itemData);
        resolve(itemData);
      }, 1000);
    });
  }

  async clearItems() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.items = [];
        EventHub.getInstance().publish(Events.UnStoreTasksSuccess);
        resolve("All tasks cleared");
      }, 1000);
    });
  }

  async loadItems() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        EventHub.getInstance().publish(Events.LoadTasksSuccess, this.items);
        resolve(this.items);
      }, 1000);
    });
  }
}
