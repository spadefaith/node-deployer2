require('dotenv').config({});

const path = require('path');
const fs = require('fs');
const rawConfig = require('../config/config.js');

// throw new Error("pause");

(async () => {
	try {
		fs.writeFileSync(
			path.join(__dirname, '../../src/lib/db/config.ts'),
			`export default ${JSON.stringify(rawConfig, null, 4)}`
		);
	} catch (err) {
		console.log(43, err);
	}
})();
