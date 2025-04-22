import { EventHub } from "../eventhub/Eventhub.js";

/** 
* @abstract
* @class Service
*/
export class Service {
    constructor() {
        if (new.target == Service) {
            throw new Error('Service is an abstract class and cannot be instantiated.\n');
        }

        this.fetchStorageListings();
    }

    fetchStorageListings() {
        throw new Error("Needs to be implemented.\n");
    }

    subscribe(event, listener) {
        return EventHub.getInstance().subscribe(event, listener);
    }

    publish(event, data) {
        return EventHub.getInstance().publish(event, data);
    }
}