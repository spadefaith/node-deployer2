require('dotenv').config({});
const SequelizeAuto = require('sequelize-auto');
const path = require('path');
const fs = require('fs');
const rawConfig = require('../config/config.js');

// import jsonSchemaToZod from 'json-schema-to-zod/dist/types';.3
const { toProper, parsedEntityJson } = require('../utils/index.js');

const config = rawConfig;

console.log(14, process.env.NODE_ENV, config);

// throw new Error("pause");

(async () => {
	try {
		const schemaRoot = path.resolve(__dirname, '../schemas');
		fs.rmSync(schemaRoot, { recursive: true, force: true });
		fs.mkdirSync(schemaRoot, { recursive: true });

		/**@ts-ignore */
		const auto = new SequelizeAuto(
			config.database,
			config.username,
			config.password,

			/**@ts-ignore */
			{
				...config,
				caseFile: 'p',
				caseModel: 'p',
				lang: 'ts',
				directory: path.join(__dirname, '../../src/server/db/typed-models')
			}
		);

		/**@ts-ignore */
		await auto.run().then((data) => {
			Object.keys(data.tables).forEach((tbl) => {
				const tableName = tbl.split('_').reduce((accu, iter) => {
					accu += toProper(iter);
					return accu;
				}, '');
				const json = parsedEntityJson(data.tables[tbl]);

				// const name = `${tableName}ModelSchema`;
				// const schema = jsonSchemaToZod(json, { module: "esm" });
				// fs.writeFileSync(path.join(schemaRoot, `./${name}.ts`), schema);
			});
		});
	} catch (err) {
		console.log(43, err);
	}
})();
