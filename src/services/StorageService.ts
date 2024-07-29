/* eslint-disable */
import flatCache from "flat-cache";
const lock: any = {};
const StorageService = (storageName: string) => {
  const cacheStorage = flatCache.load(storageName, storageName);
  return {
    async setItem(key: string, value: any) {
      if (lock[key]) {
        return value;
      } else {
        lock[key] = true;
        const data = await cacheStorage.setKey(key, {
          doc: {
            _id: key,
            data: value,
          },
        });
        await cacheStorage.save(true);

        delete lock[key];
        return data;
      }
    },
    async getItem(key: string) {
      const data = await cacheStorage.getKey(key);
      return data?.doc?.data || null;
    },
    async removeItem(key: string) {
      await cacheStorage.removeKey(key);
      await cacheStorage.save(true);

      return true;
    },
    async getItems() {
      const datas = await cacheStorage.all();
      const toArray = Object.keys(datas).map((key) => {
        return datas[key];
      });
      return { rows: toArray };
    },
    async clear() {
      await cacheStorage.destroy();
      await cacheStorage.save(true);
      return true;
    },
  };
};
export default StorageService;
