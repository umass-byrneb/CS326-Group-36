//milestone 6

import { Events } from "../eventhub/Events.js"
import { EventHub } from "../eventhub/EventHub.js";
import Service from "./Service.js"

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
        const list = await this.loadAllItemsFromDB();
        // console.log("list in loaditems from DB: ", typeof(list));
        return new Promise((resolve, _) => {
            resolve(list.slice(page*10, page*10 + 11))
        });
    }

    async loadAllItemsFromDB() {
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
                    this.fetchFromAPI().then(list => {
                        // console.log("list in load all listings from DB: ", list);
                        const listedItems = list.filter(item => item.listed);
                        resolve(listedItems);
                        this.addListToDB(listedItems);
                    }).catch(err => reject(err));
                } else {
                    const list = items.result;
                    resolve(list);
                }
            }
            tran.onerror = function() {
                reject(new Error("Error encountered while loading storage items from the storage list.\n"));
            }
        })
    }

    async fetchFromAPI() {
        const hub = EventHub.getInstance();
        return new Promise((resolve, reject) => {
            hub.subscribe(Events.LoadStorageServerSuccess, (data) => {
                if (typeof(data) == String) reject(new Error("Error getting list from server.\n"));
                // data.then(list => {
                //     console.log("list from fetch: ", list);
                //     resolve(list);
                resolve(data);
                // }).catch((message) => console.error(message));
            });
            hub.publish(Events.LoadStorageServer);
        })
    }

    async updateList() {
        try {
            const updatedList = await this.fetchFromAPI();
            const filtered = updatedList.filter(item => item.listed);
            await this.rewriteToDB(filtered);
            const finalList = await this.loadItemsFromDB(0);
            console.log("final updated list: ", finalList);
            return finalList;
        } catch (err) {
            console.log("Error received while updating the list: ", err);

        }
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
        list.forEach((item) => {
            objStore.add({...item})
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

    async rewriteToDB(list) {
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
        const request = objStore.clear();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                resolve("Cleared the DB");
                this.addListToDB(list);
            };
            request.onerror = () => {
                reject("Couldn't clear the DB");
            }
        })
    }

    //note: for now, we only accept cost in a particular format
    async filterListByPrice(order) {
        const list = await this.loadAllItemsFromDB();
        // console.log("list in price filter function: ", list);
        const compareByPrice = (a, b) => {
            if (a.cost < b.cost) return order == "ascending" ? -1 : 1;
            if (a.cost > b.cost) return order == "ascending" ? 1 : -1;
            return 0;
        }
        list.sort(compareByPrice);
        // to update the DB so that any filters applied from the side bar will be based on these toggles
        this.addListToDB(list).then(() => console.log("updated the DB")).catch(() => "failed to update the DB");
        return new Promise((resolve, reject) => {resolve(list.slice(this.page*10, this.page*10 + 11))});
    }

    //need to optimize the algorithm
    async filterByTag(tag) {
        tag = tag.toLowerCase();
        const list = await this.fetchFromAPI();
        const filtered = list.filter(item => {
            const split = item.title.split(" ").reduce((sum, curr) => {
                if (curr.toLowerCase() == tag) sum.push(curr);
                return sum;
                }, [])
            return split.length !== 0
        })
        this.rewriteToDB(filtered);
        return new Promise((resolve, reject) => {resolve(filtered.slice(this.page*10, this.page*10 + 11))});
    }

    //need to find a more efficient algorithm - for next milestone
    async removeTag(tagList) {
        console.log("in remove tage");
        const list = await this.fetchFromAPI();
        let filtered = []
        if (tagList.length == 0) {
            filtered = list;
            console.log("here");
        } else {
            filtered = list.filter(item => {
                const split = item.title.split(" ");
                return split.filter(word => {
                    return tagList.filter(tag => tag.toLowerCase() == word.toLowerCase()).length !== 0
                }).length !== 0;
            })
        }
        console.log("filtered after removing tag: ", filtered);
        this.rewriteToDB(filtered);
        return new Promise((resolve, _) => {resolve(filtered.slice(this.page*10, this.page*10 + 11))});
    }

    async filterBySpace(range) {
        const start = range[0] == -1 ? 0 : range[0];
        const end = range[1] == -1 ? Infinity : range[1];
        const list = await this.loadAllItemsFromDB();
        const filtered = list.filter(item => item.size >= start && item.size < end);
        this.rewriteToDB(filtered);
        return new Promise((resolve, _) => {resolve(filtered.slice(this.page*10, this.page*10 + 11))});
    }

    async filterByCost(max) {
        const list = await this.loadAllItemsFromDB();
        console.log("list in filter by cost: ", list);
        const filtered = list.filter(item => item.cost <= max);
        return new Promise((resolve, _) => {resolve(filtered.slice(this.page*10, this.page*10 + 11))});
    }
    

    async getRecent() {
        const list = await this.fetchFromAPI();
        list.reverse();
        this.rewriteToDB(list);
        return new Promise((resolve, _) => {resolve(list.slice(this.page*10, this.page*10 + 11))});
    }

    addSubscriptions() {
        this.subscribe(Events.LoadStorageListings, (page) => {
            const list = this.loadItemsFromDB(page);
            list.then(items => {
                // console.log("items in load storage listings initial load: ", items);
                EventHub.getInstance().publish(Events.LoadStorageSuccess, items);
            }).catch(err => console.log(err));
        });

        this.subscribe(Events.UpdateStorageItemSuccess, async () => {
            const list = await this.updateList();
            EventHub.getInstance().publish(Events.LoadStorageSuccess, list);
        });

        this.subscribe(Events.RemoveStorageItemSuccess, async () => {
            const list = await this.updateList();
            EventHub.getInstance().publish(Events.LoadStorageSuccess, list);
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

        this.subscribe(Events.StorageUnfilteredList, async (page) => {
            // const list = this.fetchFromAPI();
            // list.then(items => {
            //     // console.log("Unfiltered list: ", items);
            //     EventHub.getInstance().publish(Events.LoadStorageSuccess, items.slice(this.page*10, this.page*10 + 11));
            // }).catch(err => console.log(err));
            this.page = page;
            const list = await this.getRecent();
            EventHub.getInstance().publish(Events.LoadStorageSuccess, list);
        });

        this.subscribe(Events.StorageFilterAddTag, (value) => {
            const filteredPromise = this.filterByTag(value);
            filteredPromise.then(list => {
                EventHub.getInstance().publish(Events.LoadStorageSuccess, list);
            })
        });

        this.subscribe(Events.StorageFilterRemoveTag, (tagList) => {
            const filtered = this.removeTag(tagList);
            filtered.then(list => {
                EventHub.getInstance().publish(Events.LoadStorageSuccess, list);
            })
        });

        this.subscribe(Events.StorageSpaceFilter, (spaceRange) => {
            // console.log("space size range: ", spaceRange);
            const filtered = this.filterBySpace(spaceRange);
            filtered.then(list =>
                EventHub.getInstance().publish(Events.LoadStorageSuccess, list)
            )
        })

        this.subscribe(Events.StorageCostFilter, async (max) => {
            const filtered = await this.filterByCost(max);
            EventHub.getInstance().publish(Events.LoadStorageSuccess, filtered);
        })
    }
}
