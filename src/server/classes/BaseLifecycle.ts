import 'dotenv/config';
import { verifyToken } from '~/services/TokenService';
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie';
export default class BaseLifecycle {
	requestEvent: any;
	body: any;
	cookies: any;
	admin: any;
	constructor(admin) {
		this.admin = admin;
	}
	async parseCookies() {

	}
	
	async parseQwikCookies(data, cookies) {
		this.body = data;
		this.cookies = cookies;


		// console.log(21,this.cookies);
		const token = this.cookies.get('x-token');
		
		// console.log(22,token);



		this.admin = await verifyToken(token.value);
	}
}
