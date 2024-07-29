import moment from 'moment';
const expiryTime = 30;
const expiryBy = 'minutes';
const disable = import.meta.env.VITE_CACHE == 'true';


type CacheServiceConfigType = {
	expiry: number;
	recache?: boolean;
	expiryBy?: string;
};

export default class CacheService {
	name: string;
	sessionStorage: any;
	cachePath: any;
	StorageService: any;
	constructor(name: string, cachePath: string, StorageService: any) {
		this.name = name;
		this.cachePath = cachePath;
		this.StorageService = StorageService;

		this._createCacheDir();

		this.sessionStorage = this.StorageService(
			// `http://localhost:3001/cache-${this.name}`
			`${this.cachePath}/${this.name}`
		);
	}
	static removeCacheDir() {
		// if (fs.existsSync(cachePath)) {
		//   // fs.rmSync(cachePath, { recursive: true, force: true });
		//   console.log("caches removed");
		// }
	}
	_createCacheDir() {
		// if (!fs.existsSync(cachePath)) {
		//   fs.mkdirSync(cachePath);
		//   console.log("caches created");
		// }
	}
	async cache(key: string, query: any, config?: CacheServiceConfigType) {
		if (disable) {
			return await query();
		}
		if (!config) {
			config = {} as CacheServiceConfigType;
		}

		const expiry = config.expiry != undefined ? config.expiry : expiryTime;
		const isExpired = await this.isExpired(key);

		if (isExpired) {
			await this.destroyStore(key);
		}

		const refresh = config.recache || false;
		if (!refresh) {
			if (!isExpired) {
				const cachedData = await this._cache(key);
				console.log(`from cache ${key}`);
				return cachedData;
			}
		}

		// await new Promise((res) => setTimeout(res, 2000));
		const data = await query();

		await this._cache(key, data);

		await this._setExpiry(key, expiry, config.expiryBy || expiryBy);

		return data;
	}
	async destroyStore(key: string) {
		try {
			const expiryKey = this._getExpiryKey(key);
			console.log(expiryKey);
			await this.sessionStorage.removeItem(key);
			await this.sessionStorage.removeItem(expiryKey);
		} catch (err) {
			console.log(err);
		}
	}

	async setStore(key: string, value: any) {
		if (typeof value != 'string') {
			value = JSON.stringify(value);
		}
		return !disable && this.sessionStorage.setItem(key, value);
	}
	async cleanUp() {
		await this.sessionStorage.getItems().then((res: any) => {
			// console.log(91, res);
			return Promise.all(
				res.rows.map(async (item: any) => {
					if (!item.doc._id.includes('expiry')) {
						const checkIfExpired = await this.isExpired(item.doc._id);
						if (checkIfExpired) {
							await this.destroyStore(item.doc._id);
						}
					} else {
						const _id = item.doc._id.replace('expiry-', '');
						const checkIfExpired = await this.isExpired(_id);
						if (checkIfExpired) {
							await this.destroyStore(_id);
						}
					}
				})
			);
		});
	}
	async getStore(key: string, fromIsExpired?: boolean) {
		if (!fromIsExpired) {
			/**
			 * self cleanup
			 */
			await this.cleanUp();
		}

		let value = await this.sessionStorage.getItem(key);

		try {
			value = JSON.parse(value);
		} catch (err) {
			//
		}

		return value;
	}

	async isExpired(key: string) {
		key = this._getExpiryKey(key);

		let expired = false;
		const storedExpiry = await this.getStore(key, true);

		if (storedExpiry != null) {
			const expiration = moment(storedExpiry);
			if (moment().isAfter(expiration)) {
				await this.setStore(key, null);
				expired = true;
			}
		}

		if (storedExpiry == null) {
			expired = true;
		}

		return expired;
	}

	_getExpiryKey(key: string) {
		return `expiry-${key}`;
	}

	async _setExpiry(key: string, expiryTime: number, _expiryBy: string) {
		key = `expiry-${key}`;

		//@ts-ignore
		const expiry = moment().add(expiryTime, _expiryBy).format('YYYY-MM-DD HH:mm:ss');

		await this.setStore(key, expiry);
	}

	async _cache(key: string, value?: string) {
		if (value != undefined) {
			await this.setStore(key, value);
			return value;
		}
		return this.getStore(key);
	}
}
