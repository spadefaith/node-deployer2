import Sidebar from '~/server/classes/Sidebar';
import Models from '~/server/db';
import { getPk } from '../../../utils';
import meta from './meta/meta';
import Lifecycle from './lifecycle';
import { mergeTo } from '~/utils/client-utils';
import addForm from './meta/add-form';
import shell from 'shelljs';
import fs from 'fs';
import ConfigParser from '@webantic/nginx-config-parser';
import os from 'os';
const parser = new ConfigParser();

const pk = getPk(Models.Envs);

const PWD = process.env.PWD;

export const create = async (lifecycle: Lifecycle) => {
	const {config, app_id} = lifecycle.body;
	
	const find = await Models.Apps.findOne({
		raw:true,
		where:{
			app_id,
		}
	});

	if(!find){
		throw new Error('app not found');
	};

	const {domain, name} = find;

	const configPath = `/etc/nginx/sites-available/${domain}`;
	const configEnablePath = `/etc/nginx/sites-enabled/${domain}`;

	if(!domain){
		throw new Error('app has no domain');
	};


	const text = parser.toConf(JSON.parse(config));


	fs.writeFileSync(configPath, text);
	if(!fs.existsSync(configEnablePath)){
		shell.exec(`sudo ln -s ${configPath} ${configEnablePath}`);
	}
	shell.exec(`sudo service nginx restart`);
};


export const getOne: any = async (payload) => {
	try {
		const find = await Models.Apps.findOne({
			raw:true,
			where:{
				app_id:payload.app_id,
			}
		});
	
		if(!find){
			throw new Error('app not found');
		};
	
		const {domain, name} = find;
		let config = {};
	
		if(!domain){
			throw new Error('app has no domain');
		};
	
		const configPath = `/etc/nginx/sites-available/${domain}`;
		const isExist = fs.existsSync(configPath);
		if(isExist){
			const cat = shell.exec(`cat ${configPath}`);
			config =   parser.toJSON(cat.stdout);
		};

		return {
			...find,
			config
		};
	} catch(err){
		return {
			config:{
				error:err.message
			}
		}
	}
};
