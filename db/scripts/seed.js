require('dotenv').config({});
const shelljs = require('shelljs');

(async () => {
	try {
		const execs = await shelljs.exec(
			`node_modules/.bin/sequelize db:seed:all --env=${process.env.NODE_ENV}`
		);

		if (execs.code !== 0) {
			throw new Error(execs.stderr);
		}

		console.log('done seeding');
	} catch (err) {
		console.log(43, err.message);
	}
})();
