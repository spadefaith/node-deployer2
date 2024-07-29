/* eslint-disable */

const lock: any = {};

let sessionStorage: any = {
	setItem() {},
	getItem(e) {},
	removeItem() {},
	getItems() {},
	clear() {}
};

if (typeof window !== 'undefined') {
	sessionStorage = window.sessionStorage;
}

const StorageSessionService = (storageName: string) => {
	async function init() {
		if (sessionStorage && sessionStorage.setItem && !sessionStorage[storageName]) {
			sessionStorage.setItem(storageName, JSON.stringify({}));
		}
	}
	return {
		async setItem(key: string, value: any) {
			await init();

			if (lock[key]) {
				return value;
			} else {
				const cacheStorage = await JSON.parse(sessionStorage.getItem(storageName));

				lock[key] = true;
				cacheStorage[key] = {
					doc: {
						_id: key,
						data: value
					}
				};

				delete lock[key];

				await sessionStorage.setItem(storageName, JSON.stringify(cacheStorage));
				return value;
			}
		},
		async getItem(key: string) {
			try {
				await init();
				const cacheStorage = await JSON.parse(sessionStorage.getItem(storageName));

				const data = cacheStorage[key];
				return data?.doc?.data || null;
			} catch (err) {
				return null;
			}
		},
		async removeItem(key: string) {
			await init();
			const cacheStorage = await JSON.parse(sessionStorage.getItem(storageName));

			delete cacheStorage[key];
			await sessionStorage.setItem(storageName, JSON.stringify(cacheStorage));
			return true;
		},
		async getItems() {
			await init();
			const cacheStorage = await JSON.parse(sessionStorage.getItem(storageName));
			const toArray = Object.keys(cacheStorage).map((key) => {
				return cacheStorage[key];
			});
			return { rows: toArray };
		},
		async clear() {
			await init();
			await sessionStorage.setItem(storageName, JSON.stringify({}));
			return true;
		}
	};
};
export default StorageSessionService;
