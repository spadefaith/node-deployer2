import Cookie from 'js-cookie';

export default class CookieStore {
	storage: any;
	propInCookie: string[];
	defaultToken: string;

	constructor() {
		this.storage = typeof window !== 'undefined' ? window.sessionStorage : {};
		this.propInCookie = ['token', 'x-csrf', 'x-token'];
		this.defaultToken = 'userNotLogin';
	}
	clear(key?: any) {
		if (key) {
			Cookie.remove(key);
			sessionStorage.removeItem(key);
			localStorage.removeItem(key);
		} else {
			this.propInCookie.forEach((key) => {
				Cookie.remove(key);
			});
			sessionStorage.clear();
			localStorage.clear();
		}
	}
	put(key: any, value: any) {
		if (this.propInCookie.includes(key)) {
			Cookie.set(key, value, {
				secure: true,
				sameSite: 'lax',
				httpOnly: false
			});
		} else {
			this.storage.setItem(key, JSON.stringify(value));
		}
	}
	get<T>(key: string) {
		let data: string = '';
		if (this.propInCookie.includes(key)) {
			data = Cookie.get(key);
		} else {
			try {
				data = JSON.parse(this.storage.getItem(key));
			} catch (err) {
				data = this.storage.getItem(key);
			}
		}

		if (key == 'token' && !data) {
			data = this.defaultToken;
		}

		return data as T;
	}
	isLoggedIn() {
		return false;
	}
	getToken() {
		return this.get('x-token');
	}
}
