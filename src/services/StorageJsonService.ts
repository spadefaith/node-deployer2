/* eslint-disable */
const path = require("path");
const lock: any = {};
const storage = {};

const StorageJsonService = (storageName: string) => {
  if (!storage[storageName]) {
    storage[storageName] = {};
  }
  const cacheStorage = storage[storageName];

  return {
    async setItem(key: string, value: any) {
      if (lock[key]) {
        return value;
      } else {
        lock[key] = true;
        cacheStorage[key] = {
          doc: {
            _id: key,
            data: value,
          },
        };

        delete lock[key];
        return value;
      }
    },
    async getItem(key: string) {
      const data = cacheStorage[key];
      return data?.doc?.data || null;
    },
    async removeItem(key: string) {
      delete cacheStorage[key];

      return true;
    },
    async getItems() {
      const toArray = Object.keys(cacheStorage).map((key) => {
        return cacheStorage[key];
      });
      return { rows: toArray };
    },
    async clear() {
      storage[storageName] = {};
      return true;
    },
  };
};
export default StorageJsonService;
