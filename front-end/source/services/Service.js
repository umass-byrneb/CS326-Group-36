import { EventHub } from '../eventhub/EventHub.js';

export default class Service {
  constructor() {
    if (new.target === Service) {
      throw new Error('Service is an abstract class and cannot be instantiated directly');
    }
    this.addSubscriptions();
  }

  addSubscriptions() {
    throw new Error('Subclasses must implement the addSubscriptions method');
  }

  subscribe(event, listener) {
    return EventHub.getInstance().subscribe(event, listener);
  }

  publish(event, data) {
    EventHub.getInstance().publish(event, data);
  }
}
