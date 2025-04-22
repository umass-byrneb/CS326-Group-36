export class EventHub {
    constructor() {
      this.events = {};
    }
  
    static instance = null;
  
    static getInstance() {
      if (!EventHub.instance) {
        EventHub.instance = new EventHub();
      }
      return EventHub.instance;
    }
  
    subscribe(event, listener) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(listener);
    }
  
    publish(event, data) {
      if (!this.events[event]) return;
      this.events[event].forEach(listener => listener(data));
    }
  }
  