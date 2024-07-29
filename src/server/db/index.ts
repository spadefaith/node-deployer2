import 'dotenv/config';
import Sequelize from 'sequelize';
import {randomUUID} from 'node:crypto';

import rawConfig from './config';
const config = rawConfig;


import { initModels } from './typed-models/init-models';

console.log(13, config);
//@ts-ignore
const sequelize = new Sequelize(config.database, config.username, config.password, {
	...config,
	logging: process.env.DB_LOGGING == 'true' ? console.log : false,
});

const Models = initModels(sequelize);


// Models.Apps.addHook('beforeCreate',(record, options)=>{

// 	record.dataValues.app_id = randomUUID();
// })



export default Models;
