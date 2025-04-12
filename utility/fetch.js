import { listings } from "./storageMockData/storageListings.js"

export function fetch(url, options={}) {
    // if (options.method == "GET") {
    //     return new Promise((resolve, reject) => {
    //         const delay = 1000;
    
    //         setTimeout(() => {
    //             const mockResponse = {
    //                 ok: true,
    //                 status: 200,
    //                 statusText: "OK",
    //                 url,
    //                 json: async () => ({message: listings, url}),
    //                 text: async () => listings,
    //             };
    
    //             if (url.includes("error")) {
    //                 reject(new Error("Couldn't complete fetch request: Network error"));
    //             } else resolve(mockResponse);
    //         }, delay)
    //     });
    // }
    
    // return new Promise((reject) => {
    //     reject(new Error("Invalid or unsupported option at the moment.\n"));
    // });
    return new Promise((resolve, reject) => {
        const delay = 100;

        setTimeout(() => {
            const mockResponse = {
                ok: true,
                status: 200,
                statusText: "OK",
                url,
                json: async () => ({message: listings, url}),
                text: async () => listings,
            };

            if (url.includes("error")) {
                reject(new Error("Couldn't complete fetch request: Network error"));
            } else resolve(mockResponse);
        }, delay)
    });
}