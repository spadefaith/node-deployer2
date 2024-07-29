import 'dotenv/config';
export default {
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	dialect: 'mysql',
	reconnect: {
		max_retries: 999
	},
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	},
	timezone: '+08:00'
};
