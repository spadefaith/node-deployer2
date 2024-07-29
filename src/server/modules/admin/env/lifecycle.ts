import bcrypt from 'bcryptjs';

import BaseLifecycle from '~/server/classes/BaseLifecycle';
import Models from '~/server/db';
import path from 'node:path';
import { AppsCreationAttributes } from '~/server/db/typed-models/Apps';
import workerpool from 'workerpool';



const PWD = process.env.PWD;
const pool = workerpool.pool(path.join(PWD, 'deploy.js'));

type DataType = {
	first_name: string;
	last_name: string;
	middle_name: string;
	email: string;
	username: string;
	password: string;
	is_active: string;
	location_id: number;
	role_id: number;
	commission_deposit: string;
	commission_withdraw: string;
	balance_lower_limit: string;
	trx_lower_limit: string;
	trx_high_limit: string;
	admin_id: string;
	agent_id: string;
	priority: string;
	sequence: string;
};

export default class Lifecycle extends BaseLifecycle {
	constructor(opts) {
		super(opts);
	}
	async beforeCreate(props: { data: ({prop_key:string, prop_value:string, app_id:string,created_by?:string})[] }) {

		/**
		 * delete all
		 */

		const appId = (props?.data[0] || {})?.app_id;


		/**
		 * find app
		 */
		const app = await Models.Apps.findOne({raw:true,where:{app_id:appId}});

		if(!app){
			throw new Error('app not found');
		};

		await Models.Envs.destroy({where:{
			app_id: appId,
		}});
		
		return {
			data: props.data.map((item)=>{
				item.created_by= this.admin.username
				return item;
			}),
			app
		};
	}
	async afterCreate(props: { app: AppsCreationAttributes }) {
		
		const envs = (await Models.Envs.findAll({raw:true,where:{app_id:props.app.app_id}})).reduce((accu,item)=>{

			accu[item.prop_key] = item.prop_value;

			return accu;
		},{});

		process.chdir(PWD);
		
		await new Promise((res, rej) => {
			let error;
	

			pool
				.exec('deploy', [
					{
						root_path:props.app.root_path,
						branch:props.app.branch,
						repo:props.app.repo,
						name:props.app.name,
						envs
					}
				])
				.then(function (result) {
					console.log('Result: ' + result); // outputs 55
				})
				.catch(function (err) {
					error = err.message;
				})
				.then(function () {
					pool.terminate(); // terminate all workers when done
					if (error) {
						rej(error);
					} else {
						res(true);
					}
				});
		});

		return true;
	}
	async beforeDelete(props: { data: { account_id } }) {}
	async beforeUpdate(props: { data: DataType & { modified_by: number } }) {
		props.data.password = bcrypt.hashSync(props.data.password, bcrypt.genSaltSync(10));

		props.data.modified_by = this.admin.account_id;

		return props.data;
	}
	async afterUpdate(props: { data: DataType & { agent_id: number } }) {}
}
