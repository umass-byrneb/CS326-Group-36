import { EventHub } from "../eventhub/Eventhub.js";
import { Events } from "../eventhub/Events.js"
import { Service } from "./Service.js"
import { StorageListingFakeService } from "./StoragListingFakeService.js";

export class StorageListingService extends Service{
    constructor() {
        super();
        this.dbname = 'StorageLists';
        this.storeName = "storageItems";
        this.db = null;
        this.page = -1;
    }

    static instance = null;
    static register() {
        if (!StorageListingService.instance) {
            StorageListingService.instance = new StorageListingService();
            const fakeServer = new StorageListingFakeService();
        }
        return StorageListingService.instance;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbname, 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('storageItems')){
                    db.createObjectStore('storageItems', {keyPath: 'id'});
                }
            };
            request.onsuccess = (event) => {
                this.db = event.target.result;
                resolve(this.db);
            }
            request.onerror = (event) => {
                reject(event.target.error?.message);
            }
        })
    }

    async loadItemsFromDB(page) {
        this.page = page;
        this.db = await this.init();

        let tran = null;
        try {
            tran = this.db.transaction(this.storeName, "readwrite");
        } catch(err) {
            indexedDB.deleteDatabase(this.dbname);
            this.db = await this.init();
            tran = this.db.transaction(this.storeName, "readwrite");
        }
        const objStore = tran.objectStore(this.storeName);
        let items = objStore.getAll();
        return new Promise((resolve, reject) => {
            tran.oncomplete = () => {
                //gets items from API if it's the first time loading or if the listing was updated by some user
                if (items.result.length == 0) {
                    const hub = EventHub.getInstance();
                    hub.subscribe(Events.LoadStorageServerSuccess, (data) => {
                        if (typeof(data) == String) reject(new Error("Error getting list from server.\n"));
                        data.then(list => {
                            //add list to indexed DB - need to do
                            resolve(list.slice(page*10, page*10 + 11));
                            this.addListToDB(list);
                        }).then((message) => console.log(message)).catch((message) => console.error(message));
                    });
                    hub.publish(Events.LoadStorageServer);
                } else {
                    const list = items.result.map(obj => obj.storageItem);
                    resolve(list.slice(page*10, page*10 + 11));
                }
            }
            tran.onerror = function() {
                reject(new Error("Error encountered while loading storage items from the storage list.\n"));
            }
        })
    }

    async addListToDB(list) {
        this.db = await this.init();
        let tran = null;
        try {
            tran = this.db.transaction(this.storeName, "readwrite");
        } catch(err) {
            indexedDB.deleteDatabase(this.dbname);
            this.db = await this.init();
            tran = this.db.transaction(this.storeName, "readwrite");
        }
        const objStore = tran.objectStore(this.storeName);
        list.forEach((item, i) => {
            objStore.add({id: i, storageItem: item})
        });

        return new Promise((resolve, reject) => {
            tran.oncomplete = function() {
                resolve("Added list to IndexedDB succesfully!");
            };
            tran.onerror = function() {
                reject("Failed to add the list to the DB.");
            }
        })
    }

    // //note: for now, we only accept cost in a particular format
    // async removeTextFromPrice(list) {
    //     list.map(item => {
    //         item.cost = item.cost.split().slice(1, 3);
    //         return item;
    //     })
    // }

    async filterListByPrice(order) {
        const list = await this.loadItemsFromDB(0);
        const compareByPrice = (a, b) => {
            if (a.cost < b.cost) return order == "ascending" ? -1 : 1;
            if (a.cost > b.cost) return order == "ascending" ? 1 : -1;
            return 0;
        }
        list.sort(compareByPrice);
        return new Promise((resolve, reject) => {resolve(list.slice(this.page*10, this.page*10 + 11))});
    }

    fetchStorageListings() {
        this.subscribe(Events.LoadStorageListings, (page) => {
            const list = this.loadItemsFromDB(page);
            list.then(items => {
                EventHub.getInstance().publish(Events.LoadStorageSuccess, items);
            }).catch(err => console.log(err));
        });

        this.subscribe(Events.StoragePriceAscend, () => {
            const filtered = this.filterListByPrice("ascending");
            filtered.then(list => {
                EventHub.getInstance().publish(Events.LoadStorageSuccess, list);
            })
        });

        this.subscribe(Events.StoragePriceDescend, () => {
            const filtered = this.filterListByPrice("descending");
            filtered.then(list => {
                EventHub.getInstance().publish(Events.LoadStorageSuccess, list);
            })
        });
    }
}
