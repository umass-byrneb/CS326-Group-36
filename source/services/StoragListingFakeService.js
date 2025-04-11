import { Service } from "./Service.js";
import { fetch } from "../../utility/fetch.js"
import { Events } from "../eventhub/Events.js"
import { EventHub } from "../eventhub/Eventhub.js";

export class StorageListingFakeService extends Service {
    constructor() {
        super();
    }

    async loadTasks() {
        const response = await fetch("http://127.0.0.1:5500/storageListings", {
            method: "GET",
        });

        if (response.ok) {
            const data = await response.text();
            return data;
        }
        return "Error";
    }

    fetchStorageListings() {
        this.subscribe(Events.LoadStorageServer, () => {
            const data = this.loadTasks();
            EventHub.getInstance().publish(Events.LoadStorageServerSuccess, data);
        });
    }

} 
