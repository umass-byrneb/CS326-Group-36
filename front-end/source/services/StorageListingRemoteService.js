import Service from "./Service.js";
// import { fetch } from "../utility/fetch.js"
import { Events } from "../eventhub/Events.js"
import { EventHub } from "../eventhub/EventHub.js";

export class StorageListingRemoteService extends Service {
    constructor() {
        super();
    }

    async loadTasks() {
        const response = await fetch("/v1/storage/listings");
        // console.log("response: ", response);
        if (response.ok) {
            const data = await response.text();
            const output = JSON.parse(data);
            return output.listings;
        }
        return "Error in loading tasks";
    }

    async addTasks(item) {
        // console.log("item received from request: ", item);
        const response = await fetch("/v1/storage/listings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(item),
        })
        if (response.ok) {
            const newItem = await response.text();
            // console.log("item after adding: ", newItem);
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
        this.subscribe(Events.LoadStorageServer, () => {
            const data = this.loadTasks();
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
