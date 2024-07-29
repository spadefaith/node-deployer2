import StorageSessionService from './StorageSessionService';

import CacheService from './CacheService';

export default class CacheClientService extends CacheService {
	constructor(name: string) {
		super(name, '/cache', StorageSessionService);
		this.name = name;
	}
}
