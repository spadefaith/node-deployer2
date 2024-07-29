import StorageService from './StorageService';

import path from 'node:path';
import CacheService from './CacheService';
import fs from 'node:fs';
const __dirname = path.resolve(path.dirname(decodeURI(new URL(import.meta.url).pathname)));

const cachePath = path.join(__dirname, '../../tmp_caches');

export default class CacheServerService extends CacheService {
	constructor(name: string) {
		super(name, cachePath, StorageService);
		this.name = name;
		this._createCacheDir();
	}
	// static removeCacheDir() {
	// 	if (fs.existsSync(cachePath)) {
	// 		// fs.rmSync(cachePath, { recursive: true, force: true });
	// 		console.log('caches removed');
	// 	}
	// }
	_createCacheDir() {
		if (!fs.existsSync(this.cachePath)) {
			fs.mkdirSync(this.cachePath);
			console.log('caches created');
		}
	}
}
