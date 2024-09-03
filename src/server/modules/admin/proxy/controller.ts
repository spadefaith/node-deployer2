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
import path from 'node:path';
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

	const {domain, name, proxy_path} = find;

	if(!proxy_path){
		throw new Error('app has no domain');
	};


	const text = parser.toConf(JSON.parse(config));



	setTimeout(()=>{
		if(!fs.existsSync(path.join(process.env.PWD, '../proxy'))){
			fs.mkdirSync(path.join(process.env.PWD, '../proxy'),{recursive:true});
		}


		fs.writeFileSync(proxy_path, text);
		shell.exec(`sudo service nginx restart`);
		shell.exec(`sudo service nginx reload`);
	},500)

	
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
	
		const {domain, name, proxy_path} = find;
		let config = {};
	
		if(!domain){
			throw new Error('app has no domain');
		};
	

		const isExist = fs.existsSync(proxy_path);
		if(isExist){
			const cat = shell.exec(`cat ${proxy_path}`);
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
