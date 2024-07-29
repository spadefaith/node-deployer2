const Models = require('../models/index');

(async () => {
	try {
		await Models.sequelize.authenticate().then(function (errors) {
			errors ? console.log(errors) : console.log('database connected');
		});
		await Models.sequelize.sync({
			force: true
			// alter: true
		});

		// await updatePackageJson('module');
	} catch (err) {
		console.log(43, err);

		// await updatePackageJson('module');
	}
})();
