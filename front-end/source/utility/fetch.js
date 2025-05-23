// source/utility/fetch.js
import { mockItems } from "./mockItems.js";

/**
 * A fake fetch function that simulates a network request.
 * Returns the mockItems when the URL is "http://localhost:3000/products".
 */
export function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url === "http://localhost:3000/products") {
        const response = {
          ok: true,
          status: 200,
          json: async () => mockItems,
        };
        resolve(response);
      } else {
        reject(new Error("URL not recognized in fake fetch"));
      }
    }, 1000);
  });
}
