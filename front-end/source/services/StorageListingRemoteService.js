//milestone 6

import Service from "./Service.js";
import { Events } from "../eventhub/Events.js"
import { EventHub } from "../eventhub/EventHub.js";
import { StorageRepositoryFactory } from "./StorageListingFactory.js";

export class StorageListingRemoteService extends Service {
    constructor() {
        super();
        //initializing indexedDB
        const local = StorageRepositoryFactory.get();
        // local.register();
    }

    async loadTasks() {
        const response = await fetch("/v1/storage/listings");
        if (response.ok) {
            const {listings} = await response.json();
            console.log("listings: ", listings);
            return listings;
        }
        return "Error in loading tasks";
    }

    async addTasks(item) {
        console.log("item received from request: ", item);
        const response = await fetch("/v1/storage/listings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        })
        console.log("Response for POST storage: ", response);
        if (response.ok) {
            const newItem = await response.json();
            console.log("item after adding: ", newItem);
            return newItem;
        }
        return "Error in adding tasks";
    }

    async updateitemById(item) {
        const id = item.id;
        const response = await fetch(`/v1/storage/listings/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(id),
        });

        if (response.ok) {
            const success = response.status == 200 ? true : false;
            if (success) return true;
            return false;
        }

        return "Error in updating task";

    }

    addSubscriptions() {
        this.subscribe(Events.LoadAllListings, async() => {
            const data = await this.loadTasks();
            EventHub.getInstance().publish(Events.LoadAllListingsSuccess, data);
        });
        
        this.subscribe(Events.LoadStorageServer, async () => {
            const data = await this.loadTasks();
            EventHub.getInstance().publish(Events.LoadStorageServerSuccess, data);
        });
        this.subscribe(Events.AddStorageItem, (item) => {
            const data = this.addTasks(item);
            EventHub.getInstance().publish(Events.AddStorageItemSuccess, data);
        })

        this.subscribe(Events.UpdateStorageItem, (item) => {
            const data = this.updateitemById(item);
            EventHub.getInstance().publish(Events.UpdateStorageItemSuccess, data);
        })
    }

} 
